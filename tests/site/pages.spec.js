// Every page draws: tools/check_pages.js (no code errors, bad links, "undefined"/"NaN"/"null", empty pages or overflow),
// at the laptop width (1280) and the phone width (375), and the app loads with no console errors.
const { test } = require('@playwright/test');
const { openApp, checkPages, expect } = require('./helpers');

test('the app loads with no errors', async ({ page }) => {
  const errors = await openApp(page);
  await expect(page.locator('#view')).not.toBeEmpty();
  await expect(page.locator('#nav a').first()).toBeVisible();
  expect(errors).toEqual([]);
});

for (const [name, width] of [['laptop', 1280], ['phone', 375]]) {
  test(`every page draws cleanly at ${name} width (${width}px)`, async ({ page }) => {
    await page.setViewportSize({ width, height: 800 });
    const errors = await openApp(page);
    const r = await checkPages(page);
    expect(r.pages).toBeGreaterThan(1000);
    expect(r.problems, JSON.stringify(r.problems, null, 1)).toEqual([]);
    expect(errors).toEqual([]);
  });
}
