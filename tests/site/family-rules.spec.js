// The family rules (21 Nov 2026, her decision for all her sites; JemmasJournals/research/family-rules.md): dark mode works the same on
// every site and carries across them (localStorage "jj-mode"), the same footer on every page, the same Menu drawer under 900px.
const { test } = require('@playwright/test');
const { openApp, go, expect } = require('./helpers');

const LINE1 = 'No cookies, no tracking, no ads. Made with HTML, CSS, JavaScript and Python, kept on GitHub.';
const theme = page => page.evaluate(() => document.querySelector('meta[name="theme-color"]').getAttribute('content'));

test('opens light with the device set to dark; the button switches, saves jj-mode, changes the bar colour, and a reload keeps it', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await openApp(page);
  expect(await page.evaluate(() => [document.documentElement.getAttribute('data-mode'), localStorage.getItem('jj-mode')])).toEqual(['light', null]);
  expect(await theme(page)).toBe('#EEEAF2');
  await expect(page.locator('#modeBtn')).toHaveAttribute('aria-pressed', 'false');
  await page.click('#modeBtn');
  expect(await page.evaluate(() => [document.documentElement.getAttribute('data-mode'), localStorage.getItem('jj-mode')])).toEqual(['dark', 'dark']);
  expect(await theme(page)).toBe('#1B1524');
  await expect(page.locator('#modeBtn')).toHaveAttribute('aria-pressed', 'true');
  await page.reload();
  await page.waitForFunction(() => document.querySelector('#view').innerHTML.length > 0);
  expect(await page.evaluate(() => document.documentElement.getAttribute('data-mode'))).toBe('dark');
  expect(await theme(page)).toBe('#1B1524');
  // the same key set by another site in the family is followed (light from there means light here)
  await page.evaluate(() => localStorage.setItem('jj-mode', 'light'));
  await page.reload();
  await page.waitForFunction(() => document.querySelector('#view').innerHTML.length > 0);
  expect(await page.evaluate(() => document.documentElement.getAttribute('data-mode'))).toBe('light');
  await expect(page.locator('#modeBtn')).toHaveText('Dark mode');
});

test('her old choice ("jsw-mode") is kept once, moved to jj-mode; no dark styles hang off the device setting', async ({ page }) => {
  await openApp(page);
  await page.evaluate(() => { localStorage.removeItem('jj-mode'); localStorage.setItem('jsw-mode', 'dark'); });
  await page.reload();
  await page.waitForFunction(() => document.querySelector('#view').innerHTML.length > 0);
  expect(await page.evaluate(() => [document.documentElement.getAttribute('data-mode'), localStorage.getItem('jj-mode'), localStorage.getItem('jsw-mode')]))
    .toEqual(['dark', 'dark', null]);
  const media = await page.evaluate(() => [...document.styleSheets].flatMap(s => { try { return [...s.cssRules]; } catch (e) { return []; } })
    .filter(r => r.media && /prefers-color-scheme/.test(r.media.mediaText)).length);
  expect(media).toBe(0);
});

for (const [name, width] of [['laptop', 1600], ['phone', 390]]) {
  test(`the footer, in the family layout, on several kinds of page (${name})`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await openApp(page);
    const keys = await page.evaluate(() => { const w = worlds.find(x => x.ready && x.owned), l = Object.values(lotIndex)[0];
      return ['home', 'w-' + w.id, 'n-' + l.hood.id, l.id, Object.keys(SIM_PAGES)[0], 'calendar', 'no-such-page']; });
    for (const k of keys) {
      await go(page, k);
      const r = await page.evaluate(() => {
        const f = document.querySelector('.site-foot'), kids = [...f.children].map(e => e.className);
        const ps = [...f.querySelectorAll('.about-site p')], crs = [...ps[1].querySelectorAll('.cr')];
        const tops = crs.map(c => Math.round(c.getBoundingClientRect().top));
        return { footers: document.querySelectorAll('footer').length, order: kids, name: f.querySelector('.jj-name').textContent,
          nameItalic: getComputedStyle(f.querySelector('.jj-name')).fontStyle, line1: ps[0].textContent, credits: crs.map(c => c.textContent),
          capitals: crs.every(c => /^[A-Z]/.test(c.textContent)), oneRow: new Set(tops).size, size: getComputedStyle(ps[0]).fontSize,
          sideways: document.documentElement.scrollWidth > innerWidth };
      });
      expect(r.footers, k).toBe(1);
      expect(r.order, k).toEqual(['foot-rule', 'jj-name', 'about-site', 'jj-foot-links']);
      expect([r.name, r.nameItalic, r.line1, r.capitals, r.sideways], k).toEqual(['Jemma’s Sim World', 'normal', LINE1, true, false]);
      expect(r.credits[0], k).toBe('World maps by 20th Century Plumbob');
      expect(r.credits.join(' ')).toMatch(/Instrument Serif and Manrope.*Lucide/);
      if (width < 700) expect(r.oneRow, k + ': one credit per line').toBe(r.credits.length);
      else expect(r.size, k).toBe('12.5px');
    }
  });
}

test('the Menu bar shows at 899px and the sidebar at 901px; the bar has the Menu button and the name as a link home', async ({ page }) => {
  await page.setViewportSize({ width: 901, height: 800 });
  await openApp(page, 'calendar');
  const state = () => page.evaluate(() => ({ bar: getComputedStyle(document.querySelector('.topbar')).display !== 'none',
    side: document.getElementById('side').getBoundingClientRect().left >= 0 && !document.getElementById('side').inert }));
  expect(await state()).toEqual({ bar: false, side: true });
  await page.setViewportSize({ width: 899, height: 800 });
  await expect.poll(state).toEqual({ bar: true, side: false });
  const btn = page.locator('#menuBtn');
  await expect(btn).toHaveText('Menu');
  expect(await btn.evaluate(b => [!!b.querySelector('svg'), b.getAttribute('aria-controls'), b.getAttribute('aria-expanded')])).toEqual([true, 'side', 'false']);
  const lockup = page.locator('.topbar a.brand-bar');
  await expect(lockup).toHaveText('Jemma’s Sim World');
  expect(await lockup.evaluate(a => [a.getAttribute('href'), getComputedStyle(a.querySelector('em')).fontStyle, a.querySelector('em').textContent]))
    .toEqual(['#home', 'italic', 'Sim World']);
  await lockup.click();
  await expect(page).toHaveURL(/#home$/);
  // ← Jemma’s Journals is the very first thing in the drawer
  expect(await page.evaluate(() => document.getElementById('side').firstElementChild.textContent.trim())).toBe('← Jemma’s Journals');
});

test('the drawer: button, Escape, scrim and a link close it; focus goes in and back; closed it is inert; crossing 900px resets it', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await openApp(page);
  const open = () => page.evaluate(() => document.getElementById('side').classList.contains('jj-open'));
  const inSide = () => page.evaluate(() => document.getElementById('side').contains(document.activeElement));
  const focusId = () => page.evaluate(() => document.activeElement.id);
  // the button opens it; while open, everything outside it is inert (the top bar it covers too: no hidden focus stops)
  await page.click('#menuBtn');
  expect([await open(), await inSide()]).toEqual([true, true]);
  expect(await page.evaluate(() => [document.getElementById('main').inert, document.querySelector('.topbar').inert, getComputedStyle(document.documentElement).overflow])).toEqual([true, true, 'hidden']);
  for (const key of ['Tab', 'Shift+Tab']) for (let i = 0; i < 30; i++) {
    await page.keyboard.press(key);
    expect(await inSide(), `${key} ${i + 1}`).toBe(true);
  }
  await page.keyboard.press('Escape');
  expect([await open(), await focusId()]).toEqual([false, 'menuBtn']);
  expect(await page.evaluate(() => [document.getElementById('side').inert, document.querySelector('.topbar').inert])).toEqual([true, false]);
  // Escape
  await page.click('#menuBtn'); await page.keyboard.press('Escape');
  expect([await open(), await focusId()]).toEqual([false, 'menuBtn']);
  // the scrim
  await page.click('#menuBtn'); await page.mouse.click(370, 500);
  expect([await open(), await focusId()]).toEqual([false, 'menuBtn']);
  // a link
  await page.click('#menuBtn'); await page.locator('#nav a[href="#calendar"]').click();
  await expect(page).toHaveURL(/#calendar$/);
  expect(await open()).toBe(false);
  // Tab can't reach the closed drawer
  for (let i = 0; i < 15; i++) { await page.keyboard.press('Tab'); expect(await inSide(), `Tab ${i + 1}`).toBe(false); }
  // open, then widen past 900px: it resets (no scrim, page unlocked, sidebar reachable)
  await page.click('#menuBtn');
  await page.setViewportSize({ width: 1280, height: 800 });
  await expect.poll(open).toBe(false);
  expect(await page.evaluate(() => [document.getElementById('side').inert, document.getElementById('main').inert,
    document.documentElement.classList.contains('jj-menu-open'), document.getElementById('menuBtn').getAttribute('aria-expanded')])).toEqual([false, false, false, 'false']);
});

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

test('family sizes and small things: Menu button 44px, bar name 26px, scrim 45% black, back link 24px, robots meta, data-mode always set', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await openApp(page);
  await page.click('#menuBtn');
  const r = await page.evaluate(() => ({ btn: document.getElementById('menuBtn').getBoundingClientRect().height,
    name: getComputedStyle(document.querySelector('.topbar .brand-bar')).fontSize, scrim: getComputedStyle(document.getElementById('scrim')).backgroundColor,
    back: document.querySelector('.home-link').getBoundingClientRect().height, robots: document.querySelector('meta[name="robots"]')?.content,
    mode: document.documentElement.getAttribute('data-mode') }));
  expect(r.btn).toBeGreaterThanOrEqual(44);
  expect(r.name).toBe('26px');
  expect(r.scrim).toBe('rgba(0, 0, 0, 0.45)');
  expect(r.back).toBeGreaterThanOrEqual(24);
  expect([r.robots, r.mode]).toEqual(['noindex, noai, noimageai', 'light']);
});

test('footer credits: a “·” never starts or ends a line, at any laptop width; 12.5px on phones too', async ({ page }) => {
  await openApp(page);
  for (const width of [1600, 1440, 1280, 1100, 1024, 950, 901, 800, 701]) {
    await page.setViewportSize({ width, height: 800 });
    await page.waitForTimeout(200);
    const bad = await page.evaluate(() => [...document.querySelectorAll('.about-site .jj-dot')].filter(s => getComputedStyle(s).visibility !== 'hidden' && getComputedStyle(s).display !== 'none').filter(s => {   // a dot at a break is taken out (family.js)
      const t = s.getBoundingClientRect(), prev = s.previousElementSibling.getBoundingClientRect(), next = s.nextElementSibling.getBoundingClientRect();
      return Math.abs(prev.bottom - t.bottom) > 3 || Math.abs(next.bottom - t.bottom) > 3; }).map(s => s.nextElementSibling.textContent));
    expect(bad, `${width}px`).toEqual([]);
  }
  await page.setViewportSize({ width: 390, height: 844 });
  expect(await page.evaluate(() => [...document.querySelectorAll('.site-foot .about-site p')].map(p => getComputedStyle(p).fontSize))).toEqual(['12.5px', '12.5px']);
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

// 22 Nov 2026 (her decision): the shared parts are one copy of code in Jemma’s Journals (site/family/), loaded at /family/
test('the family’s shared code loads from /family/ and does the shared parts (no own copies left)', async ({ page, request }) => {
  for (const f of ['mode.js', 'family.css', 'family.js']) {
    const r = await request.get('/family/' + f);
    expect(r.status(), f).toBe(200);
  }
  expect((await request.get('/family/..%2findex.html')).status()).not.toBe(200);   // only the family folder of the parent
  expect((await request.get('/family/')).status()).toBe(404);
  const errors = await openApp(page);
  expect(errors).toEqual([]);
  const r = await page.evaluate(() => ({
    family: typeof window.JJFamily === 'object' && typeof JJFamily.menu === 'function',
    head: [...document.head.querySelectorAll('script[src], link[rel="stylesheet"]')].map(e => (e.getAttribute('src') || e.getAttribute('href')).split('?')[0]),
    oldKey: document.querySelector('script[src="/family/mode.js"]').dataset.oldKey,
    inline: [...document.head.querySelectorAll('script:not([src])')].length,
    line1: document.querySelector('[data-jj-line1]').textContent === JJFamily.LINE1,
    painted: document.getElementById('modeBtn').getAttribute('data-jj-painted'),
    themeDark: document.querySelector('meta[name="theme-color"]').dataset.dark }));
  expect(r.family).toBe(true);
  expect(r.head).toEqual(['/family/mode.js', '/family/family.css', '/family/family.js', 'site.css']);   // mode.js and family.css before Sim World's own stylesheet
  expect([r.oldKey, r.inline, r.line1, r.painted, r.themeDark]).toEqual(['jsw-mode', 0, true, 'light', '#1B1524']);
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
