// Look trial (21 Nov, her ask): a "Look trial" switch at the bottom right with three rows (Cards, Banner boxes, Not owned),
// each "As now" or "Suggestion". A Suggestion adds a class on <html> (lt-cards, lt-boxes, lt-notowned) and is remembered in
// localStorage "jsw-look-trial"; "As now" leaves no class. Remove with the trial once she picks.
const { test } = require('@playwright/test');
const { openApp, go, expect } = require('./helpers');

const ROWS = [['Cards', 'lt-cards'], ['Banner boxes', 'lt-boxes'], ['Not owned', 'lt-notowned']];
const classes = page => page.evaluate(() => [...document.documentElement.classList].filter(c => c.startsWith('lt-')).sort());
const row = (page, name) => page.locator('#look-trial div[role="group"]', { hasText: name });

test('the look trial switch shows, each row sets its own class, and the choice survives a reload', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await openApp(page);
  await page.evaluate(() => localStorage.removeItem('jsw-look-trial'));
  await page.reload(); await page.waitForFunction(() => typeof SECTION_KEYS === 'function');
  const sw = page.locator('#look-trial');
  await expect(sw).toBeVisible();
  await expect(sw.locator('summary')).toHaveText('Look trial');
  expect(await classes(page)).toEqual([]);   // As now everywhere: no class at all
  for (const [name, cls] of ROWS) {
    await row(page, name).getByRole('button', { name: 'Suggestion' }).click();
    expect(await classes(page)).toContain(cls);
    await expect(row(page, name).getByRole('button', { name: 'Suggestion' })).toHaveAttribute('aria-pressed', 'true');
  }
  expect(await classes(page)).toEqual(ROWS.map(r => r[1]).sort());
  await page.reload(); await page.waitForFunction(() => typeof SECTION_KEYS === 'function');
  expect(await classes(page)).toEqual(ROWS.map(r => r[1]).sort());   // kept, and set before the page is drawn
  for (const [name, cls] of ROWS) {
    await row(page, name).getByRole('button', { name: 'As now' }).click();
    expect(await classes(page)).not.toContain(cls);
  }
  expect(await classes(page)).toEqual([]);
  await page.reload(); await page.waitForFunction(() => typeof SECTION_KEYS === 'function');
  expect(await classes(page)).toEqual([]);
});

test('the look trial and the ancestors trial stack without covering each other', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await openApp(page);
  await go(page, 's-mortimer-goth');
  const anc = page.locator('#anc-switch');
  if (!(await anc.count()) || !(await anc.isVisible())) test.skip(true, 'no ancestors trial on this page');
  const [a, l] = [await anc.boundingBox(), await page.locator('#look-trial').boundingBox()];
  expect(a.y + a.height <= l.y || l.y + l.height <= a.y).toBe(true);
});

test('on a phone the look trial starts as a small closed tab', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 800 });
  await openApp(page);
  const sw = page.locator('#look-trial');
  await expect(sw).toBeVisible();
  expect(await sw.evaluate(d => d.open)).toBe(false);
  await sw.locator('summary').click();
  await expect(row(page, 'Cards').getByRole('button', { name: 'Suggestion' })).toBeVisible();
});
