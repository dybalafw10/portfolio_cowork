import { test, expect } from "@playwright/test";
test("기관 선택, 사업명, 키보드와 반응형 레이아웃", async ({ page }, info) => {
  await page.goto("./");
  await expect(page.getByRole("heading", { name: "COWORK." })).toBeVisible();
  const buttons = page.getByRole("button", { name: /수행 사업/ });
  await expect(buttons).toHaveCount(6);
  await expect(page.locator(".organization-projects:visible")).toHaveCount(0);
  if (info.project.name === "desktop")
    await buttons.nth(0).hover({ force: true });
  else await buttons.nth(0).tap({ force: true });
  await expect(buttons.nth(0)).toHaveAttribute("aria-expanded", "true");
  await expect(
    page.getByText("2025년 대국민 기상교육", { exact: true }),
  ).toBeVisible();
  if (info.project.name === "desktop")
    await buttons.nth(1).hover({ force: true });
  else await buttons.nth(1).tap({ force: true });
  await expect(buttons.nth(0)).toHaveAttribute("aria-expanded", "false");
  await expect(
    page.getByText(
      "과학관 전문인력양성 교육체계 및 교육콘텐츠 모델 개발 연구",
      { exact: true },
    ),
  ).toBeVisible();
  await buttons.nth(2).focus();
  await page.keyboard.press("Enter");
  await expect(buttons.nth(2)).toHaveAttribute("aria-expanded", "true");
  await expect(
    page.getByText("2025년 신입사원 소양교육", { exact: true }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  const boxes = await page.locator(".organization").evaluateAll((nodes) =>
    nodes.map((node) => {
      const r = node.getBoundingClientRect();
      return { x: r.x, y: r.y, right: r.right, bottom: r.bottom };
    }),
  );
  for (let i = 0; i < boxes.length; i++)
    for (let j = i + 1; j < boxes.length; j++) {
      const a = boxes[i],
        b = boxes[j];
      expect(
        a.right <= b.x || b.right <= a.x || a.bottom <= b.y || b.bottom <= a.y,
      ).toBe(true);
    }
  await page.screenshot({
    path: `test-results/${info.project.name}-hero.png`,
    fullPage: true,
  });
});
test("모션 감소 설정", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("./");
  await expect(page.locator(".floating-mark").first()).toHaveCSS(
    "animation-name",
    "none",
  );
});

test("Paperlogy 로딩, 연결선 및 실제 이미지 경로/실패 폴백", async ({
  page,
}) => {
  await page.goto("./");
  const fontLoaded = await page.evaluate(async () => {
    await Promise.all([
      document.fonts.load("800 32px Paperlogy", "COWORK."),
      document.fonts.load("400 14px Paperlogy", "조직과 사람"),
    ]);
    return [...document.fonts].some(
      (font) => font.family.includes("Paperlogy") && font.status === "loaded",
    );
  });
  expect(fontLoaded).toBe(true);
  await expect(page.locator(".constellation line")).toHaveCount(19);
  const firstLine = page.locator(".constellation line").first();
  await expect(page.locator(".constellation")).toHaveAttribute(
    "data-ready",
    "true",
  );
  await page
    .getByRole("button", { name: "기상기후인재개발원 수행 사업" })
    .hover({ force: true });
  await expect(page.locator(".constellation .is-connected")).toHaveCount(1);
  await expect(firstLine).toHaveCSS("opacity", "0.4");
  // A neutral one-pixel test image only; no invented organization logo is shipped.
  await page.route("**/logos/kma.png", (route) =>
    route.fulfill({
      contentType: "image/png",
      body: Buffer.from(
        "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=",
        "base64",
      ),
    }),
  );
  await page.reload();
  const image = page.getByRole("img", {
    name: "기상기후인재개발원",
    exact: true,
  });
  await expect(image).toBeVisible();
  expect(
    await image.evaluate(
      (el: HTMLImageElement) => el.complete && el.naturalWidth > 0,
    ),
  ).toBe(true);
  await expect(image).toHaveAttribute("src", "/portfolio_cowork/logos/kma.png");
  await page.unroute("**/logos/kma.png");
  await page.reload();
  await expect(
    page
      .getByRole("button", { name: "기상기후인재개발원 수행 사업" })
      .locator(".text-mark"),
  ).toBeVisible();
});

test("320~1920px 중앙 정렬 및 로고 겹침 방지", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("./");
  await page.evaluate(() => document.fonts.ready);
  for (const width of [320, 390, 768, 1100, 1280, 1440, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    await expect
      .poll(() =>
        page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
      )
      .toBe(true);
    const layout = await page.evaluate(() => {
      const title = document.querySelector("h1")!.getBoundingClientRect();
      const hero = document.querySelector(".hero")!.getBoundingClientRect();
      const definitions = document
        .querySelector(".brand-definitions")!
        .getBoundingClientRect();
      const marks = [...document.querySelectorAll(".organization-button")].map(
        (el) => el.getBoundingClientRect(),
      );
      const overlap = (a: DOMRect, b: DOMRect) =>
        a.left < b.right &&
        a.right > b.left &&
        a.top < b.bottom &&
        a.bottom > b.top;
      return {
        centerX: Math.abs(title.x + title.width / 2 - innerWidth / 2),
        centerY: Math.abs(
          title.y + title.height / 2 - (hero.y + hero.height / 2),
        ),
        definitionCenter: Math.abs(
          definitions.x + definitions.width / 2 - innerWidth / 2,
        ),
        overlap: marks.some(
          (r, i) =>
            overlap(r, title) ||
            overlap(r, definitions) ||
            marks.slice(i + 1).some((other) => overlap(r, other)),
        ),
      };
    });
    expect(layout.centerX).toBeLessThan(2);
    expect(layout.definitionCenter).toBeLessThan(2);
    if (width > 1100) expect(layout.centerY).toBeLessThan(2);
    expect(layout.overlap).toBe(false);
  }
});
