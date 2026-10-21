import { test, expect } from "@playwright/test";

test("별자리 실제 픽셀 표시·좌표·레이어·호버 복귀", async ({ page }, info) => {
  // Freeze the floating marks so screenshot differences measure paint, not motion.
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("./");
  await page.evaluate(() => document.fonts.ready);
  const svg = page.locator(".constellation");
  await expect(svg).toHaveAttribute("data-ready", "true");
  const geometry = await svg.evaluate((el) => {
    const svg = el as SVGSVGElement,
      rect = svg.getBoundingClientRect(),
      box = svg.viewBox.baseVal;
    const inside = [...svg.querySelectorAll("line")].every(
      (line) =>
        [line.x1.baseVal.value, line.x2.baseVal.value].every(
          (x) => x >= 0 && x <= box.width,
        ) &&
        [line.y1.baseVal.value, line.y2.baseVal.value].every(
          (y) => y >= 0 && y <= box.height,
        ),
    );
    const protectedAreas = [
      ...document.querySelectorAll(".brand,.organization-button"),
    ].map((el) => el.getBoundingClientRect());
    const overlaps = [...svg.querySelectorAll("line")].some((line) => {
      const a = line.getBoundingClientRect();
      return protectedAreas.some(
        (b) =>
          a.left < b.right &&
          a.right > b.left &&
          a.top < b.bottom &&
          a.bottom > b.top,
      );
    });
    return {
      width: rect.width,
      height: rect.height,
      viewWidth: box.width,
      viewHeight: box.height,
      inside,
      overlaps,
    };
  });
  expect(geometry.width).toBeGreaterThan(0);
  expect(geometry.height).toBeGreaterThan(0);
  expect(geometry.width).toBeCloseTo(geometry.viewWidth, 1);
  expect(geometry.height).toBeCloseTo(geometry.viewHeight, 1);
  expect(geometry.inside).toBe(true);
  expect(geometry.overlaps).toBe(false);
  await expect(svg).toHaveCSS("z-index", "0");
  await expect(svg).toHaveCSS("pointer-events", "none");
  const line = svg.locator("line").first();
  await expect(line).toHaveCSS("opacity", "0.23");
  await expect(line).toHaveCSS("stroke-width", "0.8px");
  await expect(line).toHaveCSS("stroke", "rgb(168, 184, 206)");
  await expect(svg.locator("circle")).toHaveCount(7);

  // This checks painted pixels from the page screenshot, including stacking/clipping.
  // A DOM/computed-style assertion alone passed even when the old design was imperceptible.
  const rect = await svg.locator("line").nth(4).boundingBox();
  const clip = {
    x: Math.floor(rect!.x) - 4,
    y: Math.floor(rect!.y) - 4,
    width: Math.ceil(rect!.width) + 8,
    height: Math.ceil(rect!.height) + 8,
  };
  const hideDots = await page.addStyleTag({
    content: ".constellation circle {visibility:hidden}",
  });
  const painted = await page.screenshot({ clip });
  await svg.evaluate((el) => ((el as SVGElement).style.visibility = "hidden"));
  const hidden = await page.screenshot({ clip });
  await svg.evaluate((el) => ((el as SVGElement).style.visibility = ""));
  await hideDots.evaluate((el) => el.remove());
  const contrast = await page.evaluate(
    async ({ a, b }) => {
      const pixels = async (data: string) => {
        const image = new Image();
        image.src = `data:image/png;base64,${data}`;
        await image.decode();
        const c = document.createElement("canvas");
        c.width = image.width;
        c.height = image.height;
        const ctx = c.getContext("2d")!;
        ctx.drawImage(image, 0, 0);
        return ctx.getImageData(0, 0, c.width, c.height).data;
      };
      const [first, second] = await Promise.all([pixels(a), pixels(b)]);
      let max = 0,
        changed = 0;
      for (let i = 0; i < first.length; i += 4) {
        const diff = Math.max(
          ...[0, 1, 2].map((c) => Math.abs(first[i + c] - second[i + c])),
        );
        max = Math.max(max, diff);
        if (diff > 0) changed++;
      }
      return { max, changed };
    },
    { a: painted.toString("base64"), b: hidden.toString("base64") },
  );
  expect(contrast.max).toBeGreaterThanOrEqual(9);
  expect(contrast.changed).toBeGreaterThan(10);
  await page
    .getByRole("button", { name: "기상기후인재개발원 수행 사업" })
    .hover({ force: true });
  await expect(line).toHaveClass("is-connected");
  await expect(line).toHaveCSS("opacity", "0.43");
  await page.mouse.move(5, 900);
  await expect(line).not.toHaveClass("is-connected");
  await expect(line).toHaveCSS("opacity", "0.23");
  await page.screenshot({
    path: `test-results/${info.project.name}-constellation-final.png`,
  });
});
