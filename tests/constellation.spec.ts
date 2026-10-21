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
  await expect(line).toHaveCSS("opacity", "0.2");
  await expect(line).toHaveCSS("stroke-width", "0.8px");
  await expect(line).toHaveCSS("stroke", "rgb(168, 184, 206)");
  await expect(svg.locator("circle")).toHaveCount(23);

  // This checks painted pixels from the page screenshot, including stacking/clipping.
  // A DOM/computed-style assertion alone passed even when the old design was imperceptible.
  for (const cluster of await svg.locator("g[data-cluster]").all()) {
    const rect = await cluster.locator("line").first().boundingBox();
    const clip = {
      x: Math.floor(rect!.x) - 4,
      y: Math.floor(rect!.y) - 4,
      width: Math.ceil(rect!.width) + 8,
      height: Math.ceil(rect!.height) + 8,
    };
    const hideDots = await page.addStyleTag({
      content: ".constellation circle {visibility:hidden}",
    });
    const painted = await page.screenshot({ clip, fullPage: true });
    await svg.evaluate(
      (el) => ((el as SVGElement).style.visibility = "hidden"),
    );
    const hidden = await page.screenshot({ clip, fullPage: true });
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
  }
  await page
    .getByRole("button", { name: "기상기후인재개발원 수행 사업" })
    .hover({ force: true });
  await expect(svg.locator('g[data-cluster="weather"]')).toHaveClass(
    "is-connected",
  );
  await expect(svg.locator("g:not(.is-connected) line").first()).toHaveCSS(
    "opacity",
    "0.2",
  );
  await expect(line).toHaveCSS("opacity", "0.4");
  await page.mouse.move(5, 900);
  await expect(svg.locator(".is-connected")).toHaveCount(0);
  await expect(line).toHaveCSS("opacity", "0.2");
  await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
  const hero = await page.locator(".hero").boundingBox();
  await page.screenshot({
    path: `test-results/${info.project.name}-constellation-final.png`,
    fullPage: true,
    clip: { x: 0, y: 0, width: hero!.width, height: hero!.height },
  });
});

test("군집 그래프는 연결된 열린 트리이고 선/노드 좌표가 일치", async ({
  page,
}) => {
  await page.goto("./");
  await expect(page.locator(".constellation")).toHaveAttribute(
    "data-ready",
    "true",
  );
  const graphs = await page.locator("[data-cluster]").evaluateAll((groups) =>
    groups.map((group) => {
      const nodes = [...group.querySelectorAll("circle")];
      const edges = [...group.querySelectorAll("line")];
      const map = new Map(nodes.map((n) => [n.dataset.node!, n]));
      const adjacency = new Map(
        nodes.map((n) => [n.dataset.node!, [] as string[]]),
      );
      let matches = true;
      edges.forEach((e) => {
        const a = map.get(e.dataset.from!)!,
          b = map.get(e.dataset.to!)!;
        matches &&=
          !!a &&
          !!b &&
          e.getAttribute("x1") === a.getAttribute("cx") &&
          e.getAttribute("y1") === a.getAttribute("cy") &&
          e.getAttribute("x2") === b.getAttribute("cx") &&
          e.getAttribute("y2") === b.getAttribute("cy");
        adjacency.get(e.dataset.from!)!.push(e.dataset.to!);
        adjacency.get(e.dataset.to!)!.push(e.dataset.from!);
      });
      const visited = new Set<string>(),
        queue = [nodes[0].dataset.node!];
      while (queue.length) {
        const n = queue.pop()!;
        if (visited.has(n)) continue;
        visited.add(n);
        queue.push(...adjacency.get(n)!);
      }
      return {
        nodeCount: nodes.length,
        edgeCount: edges.length,
        connected: visited.size === nodes.length,
        matches,
        maxDegree: Math.max(...[...adjacency.values()].map((a) => a.length)),
      };
    }),
  );
  for (const id of ["weather", "science", "kiat", "mg"]) {
    await page.locator(`[data-organization="${id}"]`).hover({ force: true });
    await expect(page.locator(".constellation .is-connected")).toHaveCount(1);
    await expect(page.locator(`[data-cluster="${id}"]`)).toHaveClass(
      "is-connected",
    );
    await expect(page.locator(`[data-cluster="${id}"] line`).first()).toHaveCSS(
      "opacity",
      "0.4",
    );
    await expect(
      page.locator(`[data-cluster="${id}"] circle`).first(),
    ).toHaveCSS("opacity", "0.4");
    await expect(
      page.locator(".constellation g:not(.is-connected) line").first(),
    ).toHaveCSS("opacity", "0.2");
  }
  expect(graphs).toHaveLength(4);
  for (const graph of graphs) {
    expect(graph.nodeCount).toBeGreaterThanOrEqual(4);
    expect(graph.nodeCount).toBeLessThanOrEqual(7);
    expect(graph.edgeCount).toBe(graph.nodeCount - 1);
    expect(graph.connected).toBe(true);
    expect(graph.matches).toBe(true);
    expect(graph.maxDegree).toBeLessThanOrEqual(3);
  }
});
