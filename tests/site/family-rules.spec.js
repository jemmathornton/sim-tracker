// The family rules (21 Nov 2026, her decision for all her sites; JemmasJournals/research/family-rules.md): dark mode works the same on
// every site and carries across them (localStorage "jj-mode"), the same footer on every page, the same Menu drawer under 900px.
const { test } = require('@playwright/test');
const { openApp, go, expect } = require('./helpers');

const LINE1 = 'No cookies, no tracking, no ads. Made with plain HTML and CSS, kept on GitHub.';
const theme = page => page.evaluate(() => document.querySelector('meta[name="theme-color"]').getAttribute('content'));

test('opens light with the device set to dark; the button switches, saves jj-mode, changes the bar colour, and a reload keeps it', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await openApp(page);
  expect(await page.evaluate(() => [document.documentElement.getAttribute('data-mode'), localStorage.getItem('jj-mode')])).toEqual([null, null]);
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
  expect(await page.evaluate(() => document.documentElement.getAttribute('data-mode'))).toBeNull();
  await expect(page.locator('#modeBtn .txt')).toHaveText('Dark mode');
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
        return { footers: document.querySelectorAll('footer').length, order: kids, name: f.querySelector('.foot-name').textContent,
          nameItalic: getComputedStyle(f.querySelector('.foot-name')).fontStyle, line1: ps[0].textContent, credits: crs.map(c => c.textContent),
          capitals: crs.every(c => /^[A-Z]/.test(c.textContent)), oneRow: new Set(tops).size, size: getComputedStyle(ps[0]).fontSize,
          sideways: document.documentElement.scrollWidth > innerWidth };
      });
      expect(r.footers, k).toBe(1);
      expect(r.order, k).toEqual(['foot-rule', 'foot-name', 'about-site', 'foot-links']);
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
  const open = () => page.evaluate(() => document.body.classList.contains('nav-open'));
  const inSide = () => page.evaluate(() => document.getElementById('side').contains(document.activeElement));
  const focusId = () => page.evaluate(() => document.activeElement.id);
  // the button opens it (and, reached with Tab, closes it again: the open drawer covers it on screen)
  await page.click('#menuBtn');
  expect([await open(), await inSide()]).toEqual([true, true]);
  expect(await page.evaluate(() => [document.getElementById('main').inert, getComputedStyle(document.documentElement).overflow])).toEqual([true, 'hidden']);
  await page.locator('#menuBtn').focus(); await page.keyboard.press('Enter');
  expect([await open(), await focusId()]).toEqual([false, 'menuBtn']);
  expect(await page.evaluate(() => document.getElementById('side').inert)).toBe(true);
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
    document.documentElement.classList.contains('nav-lock'), document.getElementById('menuBtn').getAttribute('aria-expanded')])).toEqual([false, false, false, 'false']);
});
