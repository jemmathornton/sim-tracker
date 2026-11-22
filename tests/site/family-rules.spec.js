// The family rules (21 Nov 2026, her decision for all her sites; JemmasJournals/research/family-rules.md): dark mode works the same on
// every site and carries across them (localStorage "jj-mode"), the same footer on every page, the same Menu drawer under 900px.
// Since 22 Nov the family rules themselves (dark mode, jj-mode and the old key, footer layout and sizes, credit dots, the Menu
// drawer at 899/901, robots, the shared code) are tested once for every site in the parent: JemmasJournals/tests/family/family.test.js.
// What stays here is Sim World's own: its credits on every kind of page, where the drawer starts, its test server's /family/.
const { test } = require('@playwright/test');
const { openApp, go, expect } = require('./helpers');

for (const [name, width] of [['laptop', 1600], ['phone', 390]]) {
  test(`the footer carries Sim World’s own credits on several kinds of page (${name})`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await openApp(page);
    const keys = await page.evaluate(() => { const w = worlds.find(x => x.ready && x.owned), l = Object.values(lotIndex)[0];
      return ['home', 'w-' + w.id, 'n-' + l.hood.id, l.id, Object.keys(SIM_PAGES)[0], 'calendar', 'no-such-page']; });
    for (const k of keys) {
      await go(page, k);
      const r = await page.evaluate(() => ({ footers: document.querySelectorAll('footer').length,
        credits: [...document.querySelectorAll('.site-foot [data-jj-credits] .cr')].map(c => c.textContent),
        sideways: document.documentElement.scrollWidth > innerWidth }));
      expect([r.footers, r.sideways], k).toEqual([1, false]);
      expect(r.credits[0], k).toBe('World maps by 20th Century Plumbob');
      expect(r.credits.join(' '), k).toMatch(/Instrument Serif and Manrope.*Lucide/);
    }
  });
}

// second review (21 Nov evening) and the tightened family rules (sections 2–4)
test('opening the drawer starts on the current page’s link (Home if the page has none), never on “← Jemma’s Journals”', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await openApp(page);
  const start = async () => { await page.click('#menuBtn'); const h = await page.evaluate(() => document.activeElement.getAttribute('href')); await page.keyboard.press('Escape'); return h; };
  expect(await start()).toBe('#home');
  const w = await page.evaluate(() => worlds.find(x => x.ready && x.owned).id);
  for (const k of ['calendar', 'w-' + w]) { await go(page, k); expect(await start(), k).toBe('#' + k); }
  await go(page, 'no-such-page');
  expect(await start()).toBe('#home');
});

test('second review: no sideways scroll on Community Space lots just over 900px; white focus ring on map banners; Secret Lots has no “0 of 0”', async ({ page }) => {
  await openApp(page);
  const cs = await page.evaluate(() => Object.values(lotIndex).find(l => l.versions && l.versions.length > 1).id);
  for (const width of [901, 920, 955]) {
    await page.setViewportSize({ width, height: 800 });
    await go(page, cs);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth), `${width}px`).toBeLessThanOrEqual(0);
  }
  await page.setViewportSize({ width: 1280, height: 800 });
  await go(page, 'w-britechester');
  const ring = await page.evaluate(() => { const a = document.querySelector('.hero.mapped a[href], .hero.mapped button'); a.focus(); return getComputedStyle(a).outlineColor; });
  expect(ring).toBe('rgb(255, 255, 255)');
  await go(page, 'w-strangerville');
  expect(await page.locator('#view').innerText()).not.toMatch(/\b0 of 0\b/);
});

test('second review: Gallery buttons and gold badges read at 4.5:1; phone banners put four figures 2 × 2; household Sims stack on a phone', async ({ page }) => {
  await openApp(page);
  const contrast = () => page.evaluate(() => {
    const lum = c => { const k = c.startsWith('color(') ? 1 : 255, m = c.match(/[\d.]+/g).map(Number); return m.slice(0, 3).map(v => { v /= k; return v <= .03928 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4); }).reduce((s, v, i) => s + v * [.2126, .7152, .0722][i], 0); };
    return [...document.querySelectorAll('.gal-link, .badge.r-head, .badge.o-badge')].map(el => { const st = getComputedStyle(el), a = lum(st.color), b = lum(st.backgroundColor);
      return +((Math.max(a, b) + .05) / (Math.min(a, b) + .05)).toFixed(2); });
  });
  const keys = await page.evaluate(() => [...Object.values(lotIndex).filter(l => l.gallery).map(l => l.id), ...Object.keys(GROUP_PAGES).filter(k => /org|dyn/.test(k)).slice(0, 12)]);
  let seen = 0;
  for (const k of keys) { await go(page, k); const c = await contrast(); seen += c.length; for (const x of c) expect(x, k).toBeGreaterThanOrEqual(4.5); }
  expect(seen).toBeGreaterThan(20);
  await page.setViewportSize({ width: 390, height: 844 });
  await go(page, 'w-willow-creek');
  const rows = await page.evaluate(() => new Set([...document.querySelectorAll('.hero .figures > div')].map(d => Math.round(d.getBoundingClientRect().top))).size);
  expect(rows).toBe(2);
  await go(page, 'h-willow-creek--goth');
  const r = await page.evaluate(() => { const t = document.querySelector('.roster'); return [t.getBoundingClientRect().width <= innerWidth, t.closest('.sheet-wrap').scrollWidth <= t.closest('.sheet-wrap').clientWidth]; });
  expect(r).toEqual([true, true]);
});

// 22 Nov 2026 (her decision): the shared code is one copy in Jemma’s Journals (site/family/); Sim World's own test server serves it
// at /family/ and nothing else of the parent (what the code does is tested in the parent's family suite)
test('the test server serves the family’s shared code at /family/, and nothing else of the parent', async ({ request }) => {
  for (const f of ['mode.js', 'family.css', 'family.js']) {
    const r = await request.get('/family/' + f);
    expect(r.status(), f).toBe(200);
  }
  expect((await request.get('/family/..%2findex.html')).status()).not.toBe(200);   // only the family folder of the parent
  expect((await request.get('/family/')).status()).toBe(404);
});

test('round 3 review: a link chosen by keyboard keeps focus on it on a laptop (Home, worlds, Calendar too); in the phone’s drawer focus goes to the page', async ({ page }) => {
  await openApp(page);
  const w = await page.evaluate(() => worlds.find(x => x.ready && x.owned).id);
  for (const href of ['#calendar', '#w-' + w, '#admin', '#home']) {
    await page.locator(`#nav a[href="${href}"]`).focus();
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(new RegExp(href + '$'));
    await expect.poll(() => page.evaluate(() => document.activeElement.getAttribute('href')), href).toBe(href);
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.click('#menuBtn');
  await page.locator('#nav a[href="#calendar"]').focus();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#calendar$/);
  await expect.poll(() => page.evaluate(() => document.activeElement.id)).toBe('view');
  await page.keyboard.press('Tab');
  expect(await page.evaluate(() => document.getElementById('view').contains(document.activeElement))).toBe(true);
});

test('round 3 review: the open page’s link in the sidebar says so to screen readers (aria-current="page", one at a time)', async ({ page }) => {
  await openApp(page);
  const keys = await page.evaluate(() => { const l = Object.values(lotIndex)[0];
    return ['home', 'w-' + l.world.id, 'n-' + l.hood.id, l.id, 'f-' + l.world.id, Object.keys(hhIndex)[0], Object.keys(SIM_PAGES)[0], 'calendar', 'admin-progress']; });
  for (const k of keys) {
    await go(page, k);
    const cur = await page.evaluate(() => [...document.querySelectorAll('#nav [aria-current]')].map(a => [a.getAttribute('aria-current'), a.getAttribute('href')]));
    expect(cur, k).toEqual([['page', '#' + k]]);
  }
  await go(page, 'no-such-page');
  expect(await page.locator('#nav [aria-current]').count()).toBe(0);
});

test('round 3 review: the Not owned worlds in the sidebar read at 4.5:1, light and dark', async ({ page }) => {
  await openApp(page);
  for (const mode of ['light', 'dark']) {
    await page.evaluate(m => document.documentElement.setAttribute('data-mode', m), mode);
    const r = await page.evaluate(() => {
      const P = s => { const n = s.match(/[\d.]+/g).map(Number); return s.startsWith('color(') ? [n[0] * 255, n[1] * 255, n[2] * 255, n[3] ?? 1] : [n[0], n[1], n[2], n[3] ?? 1]; };
      const L = ([r, g, b]) => { const f = c => { c /= 255; return c <= .03928 ? c / 12.92 : ((c + .055) / 1.055) ** 2.4; }; return .2126 * f(r) + .7152 * f(g) + .0722 * f(b); };
      const bg = P(getComputedStyle(document.documentElement).getPropertyValue('--nav').trim().replace(/^#(..)(..)(..)$/, (_, a, b, c) => `rgb(${parseInt(a, 16)}, ${parseInt(b, 16)}, ${parseInt(c, 16)})`));
      const over = (fg) => { const a = fg[3]; return [0, 1, 2].map(i => fg[i] * a + bg[i] * (1 - a)); };
      const ratio = el => { const st = getComputedStyle(el), fg = over(P(st.color)), op = +st.opacity; const c = [0, 1, 2].map(i => fg[i] * op + bg[i] * (1 - op));
        const x = L(c), y = L(bg); return +((Math.max(x, y) + .05) / (Math.min(x, y) + .05)).toFixed(2); };
      const g = document.querySelector('.nav-group.dim');
      return [ratio(g.querySelector('.label')), ...[...g.querySelectorAll('a.soon')].map(ratio), ...[...g.querySelectorAll('a.soon .pct')].map(ratio)];
    });
    expect(r.length, mode).toBeGreaterThan(3);
    for (const x of r) expect(x, mode).toBeGreaterThanOrEqual(4.5);
  }
});
