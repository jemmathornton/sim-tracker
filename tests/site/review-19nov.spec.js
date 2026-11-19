// Fixes from the 19 Nov review: the refresh card's Sunday time, Community Space totals and tabs, focus after redraws, each world's own
// calendar ticks, Progress searches folded like the sidebar's, a curly "Page not found", no admin notes on old-layout household pages.
// (Not-owned rows after a sort: progress.spec.js; in-law words both ways: family.spec.js.)
const { test } = require('@playwright/test');
const { openApp, go, viewText, expect } = require('./helpers');

test.use({ timezoneId: 'Europe/London' });

test('the refresh card: the Sunday run is at 07:54 UTC, so a good 07:56 run in winter is not "hasn’t happened yet"', async ({ page }) => {
  await openApp(page, 'admin');
  const at = async iso => { await page.clock.setFixedTime(new Date(iso)); return page.evaluate(() => lastSunday().toISOString()); };
  expect(await at('2026-11-22T09:00:00Z')).toBe('2026-11-22T07:54:00.000Z');   // winter: 07:54 UK time
  expect(await at('2026-11-22T07:50:00Z')).toBe('2026-11-15T07:54:00.000Z');   // before the run: the Sunday before
  expect(await at('2026-07-05T08:30:00Z')).toBe('2026-07-05T07:54:00.000Z');   // summer: 08:54 UK time
  await page.evaluate(() => ADM.refresh.push({when: '22 Nov 2026 07:56', ok: true, listed: 200, new: 0}));
  await page.clock.setFixedTime(new Date('2026-11-22T10:00:00Z'));
  await go(page, 'home'); await go(page, 'admin');
  const card = page.locator('#view .adm-card', {hasText: 'Weekly Gallery refresh'});
  await expect(card).not.toContainText('hasn’t happened yet');
  await expect(card).toHaveClass(/\bok\b/);
});

test('Community Space lots: Progress counts every version together, and a tab picked on the lot page changes no other page', async ({ page }) => {
  await openApp(page, 'admin-progress');
  const cs = await page.evaluate(() => Object.values(lotIndex).filter(l => l.versions).map(l => ({id: l.id, hood: l.hood.id, world: l.world.name, wid: l.world.id,
    likes: l.versions.reduce((n, v) => n + v.likes, 0), dls: l.versions.reduce((n, v) => n + v.downloads, 0),
    photos: new Set(l.versions.flatMap(v => v.photos.map(p => p.src))).size, first: l.versions[0].photos[0].thumb, last: l.versions[l.versions.length - 1].photos[0].thumb})));
  expect(cs.length).toBeGreaterThan(0);
  for (const l of cs) {
    const r = await page.evaluate(id => ROWS.find(r => r.link === id), l.id);
    expect([r.likes, r.dls, r.photos], l.id).toEqual([l.likes, l.dls, l.photos]);
    const row = page.locator('#lot-rows tbody tr', {has: page.locator(`a[href="#${l.id}"]`)});
    await expect(row.locator('td.num').nth(1)).toHaveText(String(l.photos));
    await expect(row.locator('td.num').nth(2)).toHaveText(String(l.likes));
  }
  // the world summary adds the same totals
  const w = cs[0].world, sum = await page.evaluate(w => ROWS.filter(r => r.w === w).reduce((n, r) => n + (r.likes || 0), 0), w);
  await expect(page.locator(`#view table.summary tr:has([data-sw="${w}"]) td.num`).first()).toHaveText(String(sum));
  // pick the last tab on the lot page, then look at the neighbourhood card and page: they still show the first version, with the totals
  for (const l of cs) {
    await go(page, l.id);
    const n = await page.locator('#view [data-ver]').count();
    await page.locator(`#view [data-ver="${n - 1}"]`).click();
    await expect(page.locator(`#view [data-ver="${n - 1}"]`)).toHaveAttribute('aria-selected', 'true');
    await go(page, 'w-' + l.wid);   // the neighbourhood card's lot circle
    await expect(page.locator(`#view [data-lot-link="${l.id}"]`).first()).toHaveAttribute('style', new RegExp(l.first.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
    await go(page, 'n-' + l.hood);   // the neighbourhood page's lot card
    await expect(page.locator(`#view a.listing[href="#${l.id}"] .photo`)).toHaveAttribute('data-src', l.first);
    await expect(page.locator(`#view a.listing[href="#${l.id}"] .meta`)).toContainText(`${l.dls} downloads`);
    expect(await page.evaluate(id => [lotIndex[id].gallery.likes, lotIndex[id].gallery.downloads, lotIndex[id].photos[0].thumb], l.id)).toEqual([l.likes, l.dls, l.first]);
    // back on the lot page, her tab is still the one shown
    await go(page, l.id);
    await expect(page.locator(`#view [data-ver="${n - 1}"]`)).toHaveAttribute('aria-selected', 'true');
    expect(await page.evaluate(id => lotIndex[id].photos[0].thumb, l.id)).toBe(l.last);
  }
});

const focused = page => page.evaluate(() => { const a = document.activeElement; return a ? a.id || [...a.attributes].filter(x => x.name.startsWith('data-')).map(x => `${x.name}=${x.value}`).join(' ') : ''; });
const change = (page, sel) => page.evaluate(sel => { const s = document.querySelector(sel); s.focus(); s.value = s.options[1].value; s.dispatchEvent(new Event('change', {bubbles: true})); }, sel);

test('keyboard focus stays on the control after a redraw: Progress World selects, sort buttons, calendar ticks, seasons and school chips', async ({ page }) => {
  await openApp(page, 'admin-progress');
  for (const id of ['f-world', 'h-world', 'f-hood', 'h-status']) {
    await change(page, '#' + id);
    expect(await focused(page), id).toBe(id);
  }
  await page.locator('#lot-rows [data-sort="name"]').focus();
  await page.keyboard.press('Enter');
  expect(await focused(page)).toBe('data-sort=name');
  await go(page, 'calendar');
  const kind = page.locator('#view [data-cal-kind="school"]');
  await kind.focus(); await page.keyboard.press('Space');
  await expect(page.locator('#view [data-cal-kind="school"]')).toBeChecked();
  expect(await focused(page)).toBe('data-cal-kind=school');
  const season = await page.locator('#view [data-cal-season]').nth(1).getAttribute('data-cal-season');
  await page.locator(`#view [data-cal-season="${season}"]`).focus(); await page.keyboard.press('Enter');
  await expect(page.locator(`#view [data-cal-season="${season}"]`)).toHaveClass(/\bon\b/);
  expect(await focused(page)).toBe('data-cal-season=' + season);
  const chips = page.locator('#view button[data-cal-school]');
  test.skip(await chips.count() < 2, 'no school chips to try');
  const v = await chips.nth(1).getAttribute('data-cal-school');
  await chips.nth(1).focus(); await page.keyboard.press('Enter');
  await expect(page.locator(`#view button[data-cal-school="${v}"]`)).toHaveClass(/\bon\b/);
  expect(await focused(page)).toBe('data-cal-school=' + v);
});

test('each world’s calendar keeps its own ticks: unticking in one world leaves the others as they were', async ({ page }) => {
  await openApp(page, 'calendar');
  const ws = await page.evaluate(() => calWorlds().filter(w => calEvents().some(e => e.w === w.name && calKind(e) === 'festival')).slice(0, 2).map(w => w.id));
  expect(ws.length).toBe(2);
  await go(page, 'calendar-' + ws[0]);
  await page.locator('#view [data-cal-kind="festival"]').uncheck();
  await go(page, 'calendar-' + ws[1]);
  await expect(page.locator('#view [data-cal-kind="festival"]')).toBeChecked();
  await go(page, 'calendar-' + ws[0]);
  await expect(page.locator('#view [data-cal-kind="festival"]')).not.toBeChecked();
});

test('Progress searches fold apostrophes and accents like the sidebar search', async ({ page }) => {
  await openApp(page, 'admin-progress');
  const name = await page.evaluate(() => ROWS.find(r => /[’']/.test(r.name)).name);
  for (const q of [name.replace(/[’']/g, ''), name.replace(/’/g, "'"), name.replace(/'/g, '’')]) {
    await page.fill('#f-q', 'zzqx'); await expect(page.locator('#lot-rows tbody tr')).toHaveCount(0);   // the table redraws once typing pauses
    await page.fill('#f-q', q);
    await expect(page.locator('#lot-rows tbody tr', {hasText: name.replace(/'/g, '’')}).first(), q).toBeVisible();
  }
  const hh = await page.evaluate(() => { const h = hhList().find(h => /[’'À-ž]/.test(h.name)); return h && {name: h.name, id: h.id}; });
  test.skip(!hh, 'no household name with an apostrophe or accent');
  for (const q of [hh.name.normalize('NFD').replace(/[̀-ͯ’']/g, ''), hh.name.replace(/’/g, "'"), hh.name.replace(/'/g, '’')]) {
    await page.fill('#h-q', 'zzqx'); await expect(page.locator('#hh-rows tbody tr')).toHaveCount(0);
    await page.fill('#h-q', q);
    await expect(page.locator(`#hh-rows tbody a[href="#${hh.id}"]`), q).toHaveCount(1);
  }
});

test('"Page not found" uses a curly apostrophe', async ({ page }) => {
  await openApp(page, 'no-such-page-here');
  const t = await viewText(page);
  expect(t).toContain('doesn’t match');
  expect(t).not.toContain("'");
});

test('household pages with no Sims show no admin notes, and keep their homes and links', async ({ page }) => {
  test.setTimeout(120_000);
  await openApp(page);
  const ids = await page.evaluate(() => Object.values(hhIndex).filter(h => !h.sims.some(sm => sm.sid)).map(h => h.id));
  expect(ids.length).toBeGreaterThan(0);
  const bad = [];
  for (const id of ids) {
    await go(page, id);
    const t = await viewText(page);
    for (const note of ['Sims made in game', 'No Sims added yet', 'No story yet', 'Their story']) if (t.includes(note)) bad.push(`${id}: ${note}`);
    if (!t.includes('Neighbourhood')) bad.push(`${id}: lost its facts`);
  }
  expect(bad).toEqual([]);
});
