// Round 4 review fixes (22 Nov 2026; JemmasJournals/research/reviews/round4-simworld-pokedex.md, Sim World section):
// opened as a file the page stays usable (no scrim over it, no Menu bar, the sidebar above the page); aria-current only on the page's own
// link (none on club, dynasty, organisation and a world's calendar pages); one Tab rule in the drawer (the family's); the footer's map pin
// shows on phones; the last small low-contrast text reads at 4.5:1.
const path = require('path'), { pathToFileURL } = require('url');
const { test } = require('@playwright/test');
const { openApp, go, expect } = require('./helpers');

const FILE = pathToFileURL(path.join(__dirname, '..', '..', 'site', 'index.html')).href;

test('opened as a file (no family code): no scrim over the page, no Menu bar, the sidebar works at every width, no empty footer buttons', async ({ page }) => {
  const pageErrors = [];
  page.on('pageerror', e => pageErrors.push(e.message));
  await page.route(/\.(jpe?g|png|webp|gif)(\?.*)?$/i, r => r.abort());
  for (const width of [390, 899, 1280]) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto(FILE + '#home');
    await page.waitForFunction(() => typeof SECTION_KEYS === 'function' && document.querySelector('#view').innerHTML.length > 0, null, { timeout: 30_000 });
    const r = await page.evaluate(() => {
      const scrim = document.getElementById('scrim'), side = document.getElementById('side'), sr = side.getBoundingClientRect();
      const hit = document.elementFromPoint(innerWidth / 2, innerHeight / 2);
      return { family: !!window.JJFamily, noFamily: document.documentElement.classList.contains('no-family'),
        scrimHidden: scrim.hidden, scrimShown: getComputedStyle(scrim).display !== 'none', centreOnScrim: hit === scrim,
        bar: getComputedStyle(document.querySelector('.topbar')).display, sideOnScreen: sr.left >= 0 && sr.width > 0, sideInert: side.inert,
        footLinks: getComputedStyle(document.querySelector('.jj-foot-links')).display, sideways: document.documentElement.scrollWidth > innerWidth };
    });
    expect(r, `${width}px`).toEqual({ family: false, noFamily: true, scrimHidden: true, scrimShown: false, centreOnScrim: false,
      bar: 'none', sideOnScreen: true, sideInert: false, footLinks: 'none', sideways: false });
    // a sidebar link can be clicked and opens its page
    await page.locator('#nav a[href="#calendar"]').click();
    await expect(page).toHaveURL(/#calendar$/);
  }
  expect(pageErrors).toEqual([]);
});

test('the scrim is hidden in the markup, so it can never cover the page before (or without) the family code', async ({ request }) => {
  const html = await (await request.get('/index.html')).text();
  expect(html).toMatch(/<div class="scrim" id="scrim" hidden><\/div>/);
});

test('aria-current="page" only on the page’s own link: none on club, dynasty, organisation and a world’s calendar pages; old Stats links mark Progress', async ({ page }) => {
  await openApp(page);
  const keys = await page.evaluate(() => {
    const g = kind => Object.values(GROUP_PAGES).filter(p => p.kind === kind).map(p => p.id);
    return { groups: [...g('club'), ...g('dynasty'), ...g('org')], cal: calWorlds().map(w => 'calendar-' + w.id) };
  });
  expect(keys.groups.length).toBeGreaterThan(5);
  expect(keys.cal.length).toBeGreaterThan(0);
  const marked = () => page.evaluate(() => [...document.querySelectorAll('#side [aria-current]')].map(a => [a.getAttribute('aria-current'), a.getAttribute('href')]));
  for (const k of [...keys.groups, ...keys.cal]) {
    await go(page, k);
    expect(await marked(), k).toEqual([]);
  }
  for (const k of ['stats', 'stats-willow-creek']) {
    await go(page, k);
    expect(await marked(), k).toEqual([['page', '#admin-progress']]);
  }
  // the drawer starts on the same link (Home when the page has none)
  await page.setViewportSize({ width: 390, height: 844 });
  const start = async () => { await page.click('#menuBtn'); const h = await page.evaluate(() => document.activeElement.getAttribute('href')); await page.keyboard.press('Escape'); return h; };
  await go(page, keys.groups[0]); expect(await start(), keys.groups[0]).toBe('#home');
  await go(page, keys.cal[0]); expect(await start(), keys.cal[0]).toBe('#home');
  await go(page, 'stats'); expect(await start()).toBe('#admin-progress');
  const sim = await page.evaluate(() => Object.keys(SIM_PAGES)[0]);
  await go(page, sim); expect(await start(), sim).toBe('#' + sim);
});

test('the drawer: Tab and Shift+Tab stay inside for 30 presses each on several pages (the family’s one rule; no copy of Sim World’s own)', async ({ page }) => {
  await page.setViewportSize({ width: 899, height: 844 });
  await openApp(page);
  const keys = await page.evaluate(() => ['home', 'w-' + worlds.find(x => x.ready && x.owned).id, Object.keys(SIM_PAGES)[0], Object.values(GROUP_PAGES)[0].id, 'calendar', 'no-such-page']);
  const inSide = () => page.evaluate(() => document.getElementById('side').contains(document.activeElement));
  for (const k of keys) {
    await go(page, k);
    await page.click('#menuBtn');
    for (const key of ['Tab', 'Shift+Tab']) for (let i = 0; i < 30; i++) {
      await page.keyboard.press(key);
      expect(await inSide(), `${k}: ${key} ${i + 1}`).toBe(true);
    }
    await page.keyboard.press('Escape');
  }
  const src = await (await page.request.get('/js/app.js')).text();
  expect(src).not.toMatch(/function drawerStart/);
  expect(src).not.toMatch(/e\.key !== "Tab"/);
});

test('the footer’s map pin shows on phones (the family only hides the dots inside the credits)', async ({ page }) => {
  for (const width of [390, 899, 1280]) {
    await page.setViewportSize({ width, height: 844 });
    await openApp(page);
    const r = await page.evaluate(() => { const d = document.querySelector('.foot-rule .dot'), b = d.getBoundingClientRect();
      return { display: getComputedStyle(d).display !== 'none', w: d.offsetWidth, h: d.offsetHeight, creditDots: [...document.querySelectorAll('[data-jj-credits] .jj-dot')].some(x => getComputedStyle(x).display !== 'none') }; });
    expect([r.display, r.w, r.h], `${width}px`).toEqual([true, 10, 10]);
    expect(r.creditDots, `${width}px`).toBe(width > 600);
  }
});

// contrast of an element's text against its own background (walking up to the first solid colour), with opacity
const RATIO = () => {
  window.__ratio = el => {
    const P = s => { const n = (s.match(/[\d.]+/g) || []).map(Number); return s.startsWith('color(') ? [n[0] * 255, n[1] * 255, n[2] * 255, n[3] ?? 1] : [n[0], n[1], n[2], n[3] ?? 1]; };
    const L = ([r, g, b]) => { const f = c => { c /= 255; return c <= .03928 ? c / 12.92 : ((c + .055) / 1.055) ** 2.4; }; return .2126 * f(r) + .7152 * f(g) + .0722 * f(b); };
    const layers = []; for (let e = el; e; e = e.parentElement) { const c = P(getComputedStyle(e).backgroundColor); if (c[3] > 0) { layers.push(c); if (c[3] >= 1) break; } }
    let bg = [255, 255, 255]; for (const c of layers.reverse()) bg = [0, 1, 2].map(i => c[i] * c[3] + bg[i] * (1 - c[3]));
    const fg = P(getComputedStyle(el).color); let op = 1; for (let e = el; e; e = e.parentElement) op *= +getComputedStyle(e).opacity;
    const c = [0, 1, 2].map(i => (fg[i] * fg[3] + bg[i] * (1 - fg[3])) * op + bg[i] * (1 - op)); const x = L(c), y = L(bg);
    return +((Math.max(x, y) + .05) / (Math.min(x, y) + .05)).toFixed(2);
  };
};

test('low contrast leftovers read at 4.5:1 in both modes: late relatives’ initials, family-tree and relative initials, Admin Progress’s not-owned rows', async ({ page }) => {
  await page.setViewportSize({ width: 1600, height: 930 });
  await openApp(page);
  await page.evaluate(RATIO);
  // pages with late relatives, family trees in every middling world colour (Tomarang, Gibbi Point, StrangerVille, Henford-on-Bagley) and not-owned Sims
  const keys = await page.evaluate(() => {
    const k = Object.entries(SIM_PAGES).filter(([, s]) => /Bella Goth|Mortimer Goth/.test(s.name)).map(([k]) => k);
    for (const w of ['tomarang', 'gibbi-point', 'strangerville', 'henford-on-bagley', 'tartosa']) {
      const e = Object.entries(SIM_PAGES).find(([, s]) => s.hh && s.hh.world.id === w); if (e) k.push(e[0]); }
    return k;
  });
  expect(keys.length).toBeGreaterThan(5);
  for (const mode of ['light', 'dark']) {
    await page.evaluate(m => document.documentElement.setAttribute('data-mode', m), mode);
    for (const k of keys) {
      await go(page, k);
      const low = await page.evaluate(() => [...document.querySelectorAll('#view .tm, #view .mono')].filter(el => el.getClientRects().length && el.textContent.trim().length === 1)
        .map(el => [el.textContent, el.parentElement.className, __ratio(el)]).filter(x => x[2] < 4.5));
      expect(low, `${mode} ${k}`).toEqual([]);
    }
    await go(page, 'admin-progress');
    const prog = await page.evaluate(() => { const rows = [...document.querySelectorAll('#view .sheet tr.dim')];
      return { rows: rows.length, low: rows.flatMap(r => [...r.querySelectorAll('th, td, small, button, a')]).filter(el => el.textContent.trim()).map(el => [el.textContent.trim().slice(0, 20), __ratio(el)]).filter(x => x[1] < 4.5) }; });
    expect(prog.rows, mode).toBeGreaterThan(0);
    expect(prog.low, mode).toEqual([]);
  }
});
