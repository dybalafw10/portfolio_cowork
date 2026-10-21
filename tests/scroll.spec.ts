import { test, expect } from "@playwright/test";
const desktop = (name: string) => name === "desktop";

test("휠·트랙패드 관성과 내비게이션·히스토리·키보드", async ({
  page,
}, info) => {
  test.skip(!desktop(info.project.name), "데스크톱 전용 휠 전환");
  await page.goto("./");
  await page.mouse.move(720, 700);
  await page.mouse.wheel(0, 100);
  await expect(page).toHaveURL(/#about$/);
  for (let i = 0; i < 20; i++) {
    await page.mouse.wheel(0, 12);
    await page.waitForTimeout(45);
  }
  await expect(page).toHaveURL(/#about$/);
  await expect
    .poll(() =>
      page.evaluate(() =>
        Math.abs(scrollY - document.getElementById("about")!.offsetTop),
      ),
    )
    .toBeLessThan(3);
  await page.waitForTimeout(210);
  await page.mouse.wheel(0, 100);
  await expect(page).toHaveURL(/#experience$/);
  await expect(page.locator("html")).not.toHaveAttribute("data-transitioning");
  await page.keyboard.press("PageDown");
  await expect(page).toHaveURL(/#projects$/);
  await expect(page.locator("html")).not.toHaveAttribute("data-transitioning");
  await page.keyboard.press("PageUp");
  await expect(page).toHaveURL(/#experience$/);
  await expect(page.locator("html")).not.toHaveAttribute("data-transitioning");
  await page.keyboard.press("End");
  await expect(page).toHaveURL(/#contact$/);
  await expect(page.locator("html")).not.toHaveAttribute("data-transitioning");
  await page.keyboard.press("Home");
  await expect(page).toHaveURL(/#home$/);
  await expect(page.locator("html")).not.toHaveAttribute("data-transitioning");
  await page.getByRole("link", { name: "PROJECTS", exact: true }).click();
  await expect(page).toHaveURL(/#projects$/);
  await expect(page.locator("html")).not.toHaveAttribute("data-transitioning");
  await page.goBack();
  await expect(page).toHaveURL(/#home$/);
  await expect(page.locator("html")).not.toHaveAttribute("data-transitioning");
  await page.goForward();
  await expect(page).toHaveURL(/#projects$/);
  await expect(page.locator("html")).not.toHaveAttribute("data-transitioning");
  await page.reload();
  await expect
    .poll(() =>
      page.evaluate(() =>
        Math.abs(scrollY - document.getElementById("projects")!.offsetTop),
      ),
    )
    .toBeLessThan(3);
  await expect(page.locator(".section-indicator")).toContainText("04");
});

test("긴 콘텐츠의 일반 스크롤 후 경계에서 전환", async ({ page }, info) => {
  test.skip(!desktop(info.project.name), "데스크톱 경계 전환");
  await page.goto("./#about");
  await expect(page.locator("html")).not.toHaveAttribute("data-transitioning");
  await expect
    .poll(() =>
      page.evaluate(() =>
        Math.abs(scrollY - document.getElementById("about")!.offsetTop),
      ),
    )
    .toBeLessThan(3);
  await page.locator("#about .section-content").evaluate((el) => {
    const block = document.createElement("div");
    block.style.height = "2200px";
    block.textContent = "긴 콘텐츠 검증";
    el.append(block);
  });
  await page.mouse.move(700, 500);
  await page.mouse.wheel(0, 350);
  await page.waitForTimeout(250);
  await expect(page).toHaveURL(/#about$/);
  expect(
    await page.evaluate(
      () => scrollY > document.getElementById("about")!.offsetTop + 200,
    ),
  ).toBe(true);
  await page.mouse.wheel(0, 5000);
  await page.waitForTimeout(250);
  await expect(page).toHaveURL(/#about$/);
  await page.evaluate(() => {
    const p = document.getElementById("about")!;
    scrollTo({
      top: p.offsetTop + p.offsetHeight - innerHeight,
      behavior: "instant",
    });
  });
  await page.waitForTimeout(250);
  await page.mouse.wheel(0, 100);
  await expect(page).toHaveURL(/#experience$/);
});

test("모션 감소·모바일에서 기본 스크롤 및 직접 해시", async ({
  page,
}, info) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("./#experience");
  await expect
    .poll(() =>
      page.evaluate(() =>
        Math.abs(scrollY - document.getElementById("experience")!.offsetTop),
      ),
    )
    .toBeLessThan(3);
  await expect(page.locator("html")).not.toHaveAttribute("data-transitioning");
  await page.getByRole("link", { name: "CONTACT", exact: true }).click();
  await expect(page).toHaveURL(/#contact$/);
  await expect(
    page.getByRole("heading", { name: "CONTACT", exact: true }),
  ).toBeFocused();
  await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
  await expect.poll(() => page.evaluate(() => scrollY)).toBe(0);
  if (info.project.name === "mobile")
    await expect(page.locator(".section-indicator")).toBeHidden();
});

test("모바일 터치 스와이프는 기본 스크롤을 유지", async ({ page }, info) => {
  test.skip(info.project.name !== "mobile", "모바일 터치 전용");
  await page.goto("./");
  const session = await page.context().newCDPSession(page);
  await session.send("Input.dispatchTouchEvent", {
    type: "touchStart",
    touchPoints: [{ x: 195, y: 700 }],
  });
  for (let y = 660; y >= 220; y -= 40) {
    await session.send("Input.dispatchTouchEvent", {
      type: "touchMove",
      touchPoints: [{ x: 195, y }],
    });
    await page.waitForTimeout(20);
  }
  await session.send("Input.dispatchTouchEvent", {
    type: "touchEnd",
    touchPoints: [],
  });
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(250);
  await expect(page.locator("html")).not.toHaveAttribute("data-transitioning");
  await session.detach();
});
