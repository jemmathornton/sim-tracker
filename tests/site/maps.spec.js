// Admin's card for filipesims' new world maps (23 Nov, her ask; tools/research/filipesims_check.py): shown only when there's
// news, or no check for over two weeks; each item links to the post. The data is set in the page, so it never depends on the real list.
const { test } = require('@playwright/test');
const { openApp, go, expect } = require('./helpers');

test('Admin’s filipesims card: hidden when all is quiet, the news when there is some, a nudge when not checked for two weeks', async ({ page }) => {
  await openApp(page, 'admin');
  const card = page.locator('#view .adm-card', {hasText: 'World maps from filipesims'});
  const today = new Date().toISOString().slice(0, 10);
  await page.evaluate(d => { ADM.maps = {checked: d, news: []}; }, today);
  await go(page, 'home'); await go(page, 'admin');
  await expect(card).toHaveCount(0);
  await page.evaluate(d => { ADM.maps = {checked: d, news: [
    {title: 'Granite Falls - Map Replacement Mod', url: 'https://www.patreon.com/filipesims_art/posts/granite-falls-1', date: 'Dec 5', kind: 'world', worlds: ['Granite Falls']},
    {title: 'December Patch - Mod Update', url: 'https://www.patreon.com/filipesims_art/posts/december-patch-2', date: 'Dec 6', kind: 'update', worlds: []}]}; }, today);
  await go(page, 'home'); await go(page, 'admin');
  await expect(card).toHaveCount(1);
  await expect(card).toHaveClass(/\bwarn\b/);
  await expect(card.locator('b.big')).toHaveText('2');
  await expect(card).toContainText('New map for Granite Falls (here it’s still 20th Century Plumbob’s)');
  await expect(card).toContainText('Maps updated (download them again)');
  await expect(card.locator('a[href$="granite-falls-1"]')).toHaveText('Granite Falls - Map Replacement Mod');
  await page.evaluate(() => { ADM.maps = {checked: '2026-01-01', news: []}; });
  await go(page, 'home'); await go(page, 'admin');
  await expect(card).toContainText('Not checked since 2026-01-01');
});
