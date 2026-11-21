// Fixes from the 21 Nov 2026 review: Back/Forward keep the scroll position, search ranks groups last, the phone drawer keeps
// focus and scroll to itself, the site's own browser storage, small-text contrast in light mode, career lines and the New save
// column's date. Names are taken from the page's own data, except "goth" (the case that was reported).
const { test } = require('@playwright/test');
const { openApp, go, expect } = require('./helpers');

test('Back and Forward return to where the page was scrolled; a new page opens at the top', async ({ page }) => {
  await openApp(page);
  const k = await page.evaluate(() => { const w = worlds.find(x => x.ready && x.owned && x.hoods.length > 3); return {w: 'w-' + w.id, n: 'n-' + w.hoods[1].id}; });
  await go(page, k.w);
  await page.evaluate(() => scrollTo(0, 900));
  await page.waitForTimeout(400);                                   // the position is kept a moment after scrolling stops
  await go(page, 'no-such-page');                                   // a short page: the browser alone would lose the place
  expect(await page.evaluate(() => scrollY)).toBe(0);
  await page.goBack();
  await expect(page).toHaveURL(new RegExp(`#${k.w}$`));
  await expect.poll(() => page.evaluate(() => scrollY)).toBe(900);
  // a click on a link straight after scrolling still keeps the place, and Forward returns to the next page's place
  await page.evaluate(() => scrollTo(0, 500));
  await page.locator(`#view a[href="#${k.n}"]`).first().evaluate(a => a.click());
  await expect(page).toHaveURL(new RegExp(`#${k.n}$`));
  expect(await page.evaluate(() => scrollY)).toBe(0);
  await page.evaluate(() => scrollTo(0, 300));
  await page.waitForTimeout(400);
  await page.goBack();
  await expect.poll(() => page.evaluate(() => scrollY)).toBe(500);
  await page.goForward();
  await expect(page).toHaveURL(new RegExp(`#${k.n}$`));
  await expect.poll(() => page.evaluate(() => scrollY)).toBe(300);
});

test('search: dynasties, clubs and organisations come after worlds, neighbourhoods, lots, households and Sims', async ({ page }) => {
  await openApp(page);
  const bad = await page.evaluate(() => {
    const e = [], main = ['World', 'Neighbourhood', 'Lot', 'Household', 'Sim'];
    for (const g of Object.values(GROUP_PAGES)) {
      const hits = search(g.name);
      hits.forEach((h, i) => { if (!main.includes(h.kind) && hits.slice(i + 1).some(x => x.s === h.s && main.includes(x.kind))) e.push(`“${g.name}”: ${h.kind} ${h.name} before ${hits.slice(i + 1).find(x => x.s === h.s && main.includes(x.kind)).name}`); });
    }
    return [...new Set(e)].slice(0, 10);
  });
  expect(bad).toEqual([]);
  const goth = await page.evaluate(() => Object.values(hhIndex).find(h => h.name === 'Goth')?.id);
  expect(goth).toBeTruthy();
  await page.fill('#q', 'goth');
  await page.press('#q', 'Enter');
  await expect(page).toHaveURL(new RegExp(`#${goth}$`));
});

test('phone drawer: focus stays inside, the page behind doesn’t scroll, Escape in the search only clears it, the open page’s link closes it', async ({ page }) => {
  await page.setViewportSize({width: 375, height: 800});
  await openApp(page);
  await go(page, 'calendar');
  await page.click('#menuBtn');
  await expect(page.locator('body')).toHaveClass(/nav-open/);
  expect(await page.evaluate(() => document.getElementById('main').inert)).toBe(true);
  for (let i = 0; i < 40; i++) {
    await page.keyboard.press('Tab');
    expect(await page.evaluate(() => !!document.activeElement.closest('#side')), `Tab ${i + 1}`).toBe(true);   // the top bar is inert too (family rules)
  }
  const y0 = await page.evaluate(() => scrollY);
  await page.mouse.move(360, 500); await page.mouse.wheel(0, 600); await page.waitForTimeout(300);   // a swipe on the page behind
  expect(await page.evaluate(() => [getComputedStyle(document.documentElement).overflow, scrollY])).toEqual(['hidden', y0]);
  await page.fill('#q', 'goth');
  await page.press('#q', 'Escape');
  await expect(page.locator('#q')).toHaveValue('');
  await expect(page.locator('body')).toHaveClass(/nav-open/);
  await page.locator('#nav a[href="#calendar"]').click();
  await expect(page.locator('body')).not.toHaveClass(/nav-open/);
  expect(await page.evaluate(() => [document.getElementById('main').inert, getComputedStyle(document.documentElement).overflow])).toEqual([false, 'visible']);
});

test('browser storage: the calendar key moves to jsw-calendar-4, a broken “seen” list is a first visit, dark mode follows another window', async ({ page, context }) => {
  await openApp(page);
  await page.evaluate(() => { localStorage.removeItem('jsw-calendar-4'); localStorage.setItem('calendar-4', JSON.stringify({kinds: ['holiday', 'school']})); localStorage.setItem('jsw-seen-v1', '[1,2,3]'); });
  const errors = await openApp(page);
  expect(errors).toEqual([]);
  expect(await page.evaluate(() => [localStorage.getItem('calendar-4'), JSON.parse(localStorage.getItem('jsw-calendar-4')).kinds, [...calState.kinds].sort(),
    typeof seen === 'object' && !Array.isArray(seen) && Object.keys(seen).length > 0])).toEqual([null, ['holiday', 'school'], ['holiday', 'school'], true]);
  await page.evaluate(() => localStorage.setItem('jsw-seen-v1', '7'));
  expect(await openApp(page)).toEqual([]);
  const other = await context.newPage();
  await openApp(other);
  await page.click('#modeBtn');
  await expect(page.locator('html')).toHaveAttribute('data-mode', 'dark');
  await expect(other.locator('html')).toHaveAttribute('data-mode', 'dark');
  await expect(other.locator('#modeBtn .txt')).toHaveText('Light mode');
  await page.click('#modeBtn');
  await expect(other.locator('html')).toHaveAttribute('data-mode', 'light');
});

// WCAG contrast of an element's text against the first solid background behind it
const CONTRAST = () => {
  window.__contrast = el => {
    const parse = c => { let m = /^rgba?\(([^)]+)\)/.exec(c); if (m) { const v = m[1].split(/[\s,/]+/).filter(Boolean).map(Number); return [v[0], v[1], v[2], v[3] ?? 1]; }
      m = /^color\(srgb ([^)]+)\)/.exec(c); if (m) { const v = m[1].split(/[\s/]+/).filter(Boolean).map(Number); return [v[0] * 255, v[1] * 255, v[2] * 255, v[3] ?? 1]; } return null; };
    const lum = ([r, g, b]) => [r, g, b].map(v => { v /= 255; return v <= .03928 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4; }).reduce((s, v, i) => s + v * [.2126, .7152, .0722][i], 0);
    let bg = null; for (let e = el; e && !bg; e = e.parentElement) { const c = parse(getComputedStyle(e).backgroundColor); if (c && c[3] > .9) bg = c; }
    bg ||= parse(getComputedStyle(document.body).backgroundColor);
    const fg = parse(getComputedStyle(el).color), a = lum(fg), b = lum(bg);
    return +((Math.max(a, b) + .05) / (Math.min(a, b) + .05)).toFixed(2);
  };
};

test('light mode: small words in a world’s colour, calendar holidays and markers read at 4.5:1', async ({ page }) => {
  await openApp(page);
  await page.evaluate(CONTRAST);
  const keys = await page.evaluate(() => ['businesses', 'families', 'calendar', ...Object.values(GROUP_PAGES).filter(g => g.kind === 'organisation' || /organi/i.test(g.kind)).map(g => g.id),
    ...worlds.filter(w => w.ready && w.owned).map(w => 'w-' + w.id)]);
  const low = [];
  for (const k of keys) {
    await go(page, k);
    low.push(...await page.evaluate(k => [...document.querySelectorAll('#view .hood-head .label, #view .fam .rel, #view .hhchip, #view .cal sup')]
      .map(el => [k, el.className || el.tagName, el.textContent.trim().slice(0, 30), __contrast(el)]).filter(x => x[3] < 4.5), k));
  }
  expect(low.length, 'checked pages with nothing to check').toBeDefined();
  expect(low.slice(0, 10)).toEqual([]);
  // the holiday pills, season by season
  await go(page, 'calendar');
  const pills = await page.evaluate(() => { const out = []; for (const sn of ['Spring', 'Summer', 'Autumn', 'Winter']) { calState.season = sn; calState.kinds.add('holiday'); route();
    document.querySelectorAll('#view .m-hol').forEach(el => out.push([sn, el.textContent.trim().slice(0, 20), __contrast(el)])); } return out; });
  expect(pills.length).toBeGreaterThan(0);
  expect(pills.filter(x => x[2] < 4.5)).toEqual([]);
});

test('a career with a branch of the same name shows it once; the New save column’s date is written as the site writes dates', async ({ page }) => {
  await openApp(page);
  const sims = await page.evaluate(() => Object.entries(SIM_PAGES).filter(([, s]) => s.src && /^(.+?) · \1(?= \(|$)/.test(s.src.career || '')).slice(0, 5).map(([k]) => k));
  for (const k of sims) {
    await go(page, k);
    expect(await page.locator('#view').innerText(), k).not.toMatch(/(\b[A-Z][\w ]+?) · \1 \(level/);
  }
  await go(page, 'admin-progress');
  const t = await page.locator('#view th.ns-th').getAttribute('title').catch(() => null);
  if (t) { expect(t).not.toMatch(/\d{4}-\d\d-\d\d/); expect(t).toMatch(/new save, \d{1,2} [A-Z][a-z]{2} \d\d:\d\d:/); }
});

test('a rental’s card says its units the way its lot page does', async ({ page }) => {
  await openApp(page);
  const l = await page.evaluate(() => { const l = Object.values(lotIndex).find(l => l.world.owned && l.world.ready && unitCount(l) && !l.building); return l && {id: l.id, hood: 'n-' + l.hood.id}; });
  expect(l).toBeTruthy();
  await go(page, l.hood);
  const card = (await page.locator(`#view a.listing[href="#${l.id}"] .type`).first().textContent()).trim();
  await go(page, l.id);
  const dd = (await page.locator('#view .facts div').filter({hasText: 'Lot type'}).locator('dd').first().textContent()).trim();
  expect(card).toMatch(/ · \d+ units$/);
  expect(dd).toContain(card.replace(/ · \d+ units$/, ''));
  expect(dd).toMatch(/ · \d+ units/);
});
