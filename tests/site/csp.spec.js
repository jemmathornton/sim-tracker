// Content Security Policy (her decision, 22 Nov 2026): index.html's CSP lets the browser run only the site's own code. Any inline
// script, onclick= style handler, javascript: link, eval, or picture/font/connection from elsewhere would be blocked and reported as a
// 'securitypolicyviolation' event (and a console error). These tests open every kind of page, light and dark, at three widths, use the
// drawer, dark mode, Back to top, search, the photo viewer, the calendar and the Admin buttons, and fail on any violation.
const { test } = require('@playwright/test');
const { openApp, go, expect } = require('./helpers');

// Playwright's init scripts are not subject to the page's CSP, so this listener is in place before the page's own code runs
async function watchCsp(page) {
  const seen = [];
  await page.addInitScript(() => {
    window.__csp = [];
    document.addEventListener('securitypolicyviolation', e => window.__csp.push(`${e.violatedDirective} blocked ${e.blockedURI || '(inline)'} at ${e.sourceFile || ''}:${e.lineNumber || ''}`));
  });
  page.on('console', m => { if (/Content Security Policy/i.test(m.text())) seen.push('console: ' + m.text()); });
  return async () => seen.concat(await page.evaluate(() => window.__csp || []));
}

// one page of each kind (picked from the data at run time, so the test follows her plan), plus every Across-the-worlds and Admin page
const PAGE_KEYS = () => {
  const firstKey = o => Object.keys(o)[0];
  const lotWithPhotos = Object.values(lotIndex).find(l => l.photos && l.photos.length > 1) || Object.values(lotIndex)[0];
  const w = worlds.find(w => open(w));
  return [...new Set(['home', 'w-' + w.id, 'n-' + firstKey(hoodIndex), lotWithPhotos.id, firstKey(SIM_PAGES), firstKey(hhIndex),
    firstKey(GROUP_PAGES), 'f-' + w.id, ...SECTION_KEYS(), 'no-such-page'])];
};

test('no inline event handlers or javascript: links on any page', async ({ page }) => {
  await openApp(page);
  const bad = await page.evaluate(async () => {
    const out = [];
    const keys = [...new Set([...document.querySelectorAll('a[href^="#"]')].map(a => a.getAttribute('href').slice(1)).concat(['home', ...SECTION_KEYS()]))];
    for (const k of keys) {
      location.hash = k; await new Promise(r => setTimeout(r, 0));
      for (const el of document.querySelectorAll('*')) {
        for (const a of el.attributes) if (/^on/i.test(a.name)) out.push(`${k}: ${el.tagName} ${a.name}`);
        const h = el.getAttribute('href'); if (h && /^\s*javascript:/i.test(h)) out.push(`${k}: javascript: link`);
      }
    }
    return out;
  });
  expect(bad).toEqual([]);
});

for (const [width, mode] of [[1600, 'light'], [1600, 'dark'], [899, 'light'], [899, 'dark'], [390, 'light'], [390, 'dark']]) {
  test(`no CSP violations on every kind of page, ${mode}, ${width}px, with the buttons used`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    const violations = await watchCsp(page);
    if (mode === 'dark') await page.addInitScript(() => localStorage.setItem('jj-mode', 'dark'));
    const errors = await openApp(page, '', { pictures: width === 1600 && mode === 'light' });
    expect(await page.evaluate(() => document.documentElement.getAttribute('data-mode'))).toBe(mode);
    const keys = await page.evaluate(PAGE_KEYS);
    for (const k of keys) {
      await go(page, k);
      await page.waitForTimeout(30);
    }
    // the photo viewer on a lot with several photos
    await go(page, keys[3]);
    const shot = page.locator('.shot-btn').first();
    if (await shot.count()) { await shot.click(); await expect(page.locator('[data-lb="close"]')).toBeVisible(); await page.keyboard.press('Escape'); }
    // the calendar's season buttons
    await go(page, 'calendar');
    const season = page.locator('[data-cal-season]').nth(1);
    if (await season.count()) await season.click();
    // Admin buttons: the sort buttons on Progress
    await go(page, 'admin-progress');
    const sort = page.locator('button[data-sort], button[data-hsort]').first();
    if (await sort.count()) await sort.click();
    // search
    await go(page, 'home');
    if (width > 900) { await page.fill('#q', 'Goth'); await page.waitForTimeout(200); await page.fill('#q', ''); }
    else {
      // the Menu drawer, then search inside it
      await page.click('#menuBtn'); await expect(page.locator('#side')).toBeVisible();
      await page.fill('#q', 'Goth'); await page.waitForTimeout(200); await page.fill('#q', '');
      await page.keyboard.press('Escape');
    }
    // Back to top and the Dark mode button (twice, so it ends where it started)
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.click('#toTop');
    await page.click('#modeBtn'); await page.click('#modeBtn');
    expect(await page.evaluate(() => document.documentElement.getAttribute('data-mode'))).toBe(mode);
    expect(await violations()).toEqual([]);
    expect(errors).toEqual([]);
  });
}
