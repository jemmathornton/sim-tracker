// Community Space lots (19 Nov): one tab per version she keeps, each tab showing that version's own Gallery upload and numbers,
// exactly one tab chosen at a time, and the "all together" line adding them up. Plus the Admin refresh card on a pinned clock
// (it depends on today's date, so the test sets the date instead of using the real one).
const { test } = require('@playwright/test');
const { openApp, go, expect } = require('./helpers');

const num = n => new RegExp(`^(${n}|${n.toLocaleString('en-GB')})$`);   // 1234 or 1,234

test('every Community Space lot: a tab per version, each showing its own upload, one chosen at a time', async ({ page }) => {
  await openApp(page);
  const lots = await page.evaluate(() => Object.values(lotIndex).filter(l => l.versions).map(l => ({id: l.id,
    vs: l.versions.map(v => ({url: v.url, label: curly(v.label), likes: v.likes, dls: v.downloads})),
    likes: l.versions.reduce((n, v) => n + v.likes, 0), dls: l.versions.reduce((n, v) => n + v.downloads, 0)})));
  expect(lots.length).toBeGreaterThan(0);
  for (const l of lots) {
    await go(page, l.id);
    const tabs = page.locator('#view .ver-tabs [role="tab"]');
    await expect(tabs, l.id).toHaveCount(l.vs.length);
    await expect(page.locator('#view .ver-total')).toHaveText(`All ${l.vs.length} together: ${l.likes} favourites · ${l.dls} downloads`);
    for (const [i, v] of l.vs.entries()) {
      await page.locator(`#view [data-ver="${i}"]`).click();
      await expect(page.locator(`#view [data-ver="${i}"]`)).toHaveAttribute('aria-selected', 'true');
      await expect(page.locator('#view .ver-tabs [aria-selected="true"]')).toHaveCount(1);
      await expect(page.locator(`#view [data-ver="${i}"] .ver-txt`)).toContainText(`${v.likes} favourites · ${v.dls} downloads`);
      await expect(page.locator(`#view [data-ver="${i}"] .ver-txt b`)).toHaveText(v.label);
      const card = page.locator('#view .gallery-card');
      await expect(card.locator('a[href^="http"]').first()).toHaveAttribute('href', v.url);                 // "View on the Gallery": this version's upload
      await expect(card.locator('dt', {hasText: /^Favourites$/}).locator('xpath=following-sibling::dd[1]')).toHaveText(num(v.likes));
      await expect(card.locator('dt', {hasText: /^Downloads$/}).locator('xpath=following-sibling::dd[1]')).toHaveText(num(v.dls));
      expect(await page.evaluate(id => lotIndex[id].gallery.likes, l.id)).toBe(v.likes);
    }
    // the lot's name and totals don't change with the tab
    await expect(page.locator('#view .ver-total')).toHaveText(`All ${l.vs.length} together: ${l.likes} favourites · ${l.dls} downloads`);
  }
});

test('Admin’s refresh card: fine just after a good Sunday run, a nudge once the next Sunday has passed without one', async ({ page }) => {
  await openApp(page, 'admin');
  const last = await page.evaluate(() => { const ok = [...ADM.refresh].reverse().find(r => r.ok); return ok && {when: ok.when, t: runDate(ok).getTime()}; });
  test.skip(!last, 'no good refresh logged yet');
  const card = page.locator('#view .adm-card', {hasText: 'Weekly Gallery refresh'});
  await page.clock.setFixedTime(new Date(last.t + 60 * 60 * 1000));          // an hour after the last good run
  await go(page, 'home'); await go(page, 'admin');
  const lastBad = await page.evaluate(() => !ADM.refresh[ADM.refresh.length - 1].ok);
  await expect(card).not.toContainText('hasn’t happened yet');
  if (!lastBad) await expect(card).toHaveClass(/\bok\b/);
  await expect(card.locator('b.big')).toHaveText(last.when.replace(/ 20\d\d/, ''));
  await page.clock.setFixedTime(new Date(last.t + 9 * 24 * 60 * 60 * 1000));  // nine days later: a Sunday has gone by
  await go(page, 'home'); await go(page, 'admin');
  await expect(card).toContainText('Sunday’s run hasn’t happened yet');
  await expect(card).toHaveClass(/\bwarn\b/);
});
