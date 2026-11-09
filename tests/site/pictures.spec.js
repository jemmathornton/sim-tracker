// The real pictures load (the other tests serve a stand-in): maps, screenshots, Gallery pictures and portraits on a
// sample of pages. The build itself already stops if a picture it lists is missing (tests/test_tools.py, TheBuild).
const { test } = require('@playwright/test');
const { openApp, go, expect } = require('./helpers');

test('pictures on the home, world, neighbourhood, lot and household pages load', async ({ page }) => {
  const failed = [];
  page.on('response', r => { if (r.status() >= 400) failed.push(`${r.status()} ${r.url()}`); });
  page.on('requestfailed', r => failed.push(`failed ${r.url()}`));
  await openApp(page, '', {pictures: true});
  const keys = await page.evaluate(() => {
    const l = Object.values(lotIndex).find(l => l.world.owned && l.world.ready && l.photos.length > 2 && l.hh && l.hh.portrait) ||
      Object.values(lotIndex).find(l => l.world.owned && l.world.ready && l.photos.length > 2);
    const h = Object.values(hhIndex).find(h => h.world.owned && h.world.ready && (h.portrait || h.libraryPic));
    return ['home', 'w-' + l.world.id, 'n-' + l.hood.id, l.id, h.id];
  });
  for (const k of keys) {
    await go(page, k);
    await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { scrollTo(0, y); await new Promise(r => setTimeout(r, 30)); } });
    await page.waitForLoadState('networkidle');
  }
  const loaded = await page.evaluate(() => performance.getEntriesByType('resource').filter(e => /\.(jpe?g|png|webp)/i.test(e.name)).length);
  expect(loaded).toBeGreaterThan(10);
  expect(failed).toEqual([]);
});
