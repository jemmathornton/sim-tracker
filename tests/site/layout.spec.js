// Layout: the laptop (1280px) comes first and the phone fixes never touch it (CLAUDE.md). The phone block is the
// last thing in site.css and only applies under 700px; at 1280 the sidebar sits beside the page; on a phone it slides in.
const { test } = require('@playwright/test');
const fs = require('fs'), path = require('path');
const { openApp, go, expect } = require('./helpers');

const CSS = fs.readFileSync(path.join(__dirname, '..', '..', 'site', 'site.css'), 'utf8');

test('the phone fixes are one block at the end of site.css, and no width rule reaches 1280px', () => {
  const last = CSS.lastIndexOf('@media');
  expect(CSS.slice(last)).toMatch(/^@media \(max-width:700px\)\{/);
  // the block closes at the end of the file
  const block = CSS.slice(last), depth = [...block].reduce((d, c, i) => (c === '{' ? d + 1 : c === '}' ? d - 1 : d), 0);
  expect(depth).toBe(0);
  expect(block.trim().endsWith('}')).toBe(true);
  const widths = [...CSS.matchAll(/@media[^{]*max-width:\s*(\d+)px/g)].map(m => +m[1]);
  expect(widths.length).toBeGreaterThan(0);
  expect(widths.filter(w => w >= 1280)).toEqual([]);
  expect([...CSS.matchAll(/@media[^{]*min-width/g)]).toEqual([]);
});

test('at 1280px the sidebar sits beside the page and the menu button is hidden', async ({ page }) => {
  await openApp(page);
  const r = await page.evaluate(() => { const s = document.getElementById('side').getBoundingClientRect(), m = document.getElementById('main').getBoundingClientRect();
    return {sideLeft: s.left, sideW: s.width, mainLeft: m.left, mainRight: m.right, menu: getComputedStyle(document.getElementById('menuBtn')).display,
      topbar: getComputedStyle(document.querySelector('.topbar')).display, over: document.documentElement.scrollWidth - document.documentElement.clientWidth}; });
  expect(r.sideLeft).toBe(0);
  expect(r.sideW).toBeGreaterThan(200);
  expect(r.mainLeft).toBeGreaterThanOrEqual(r.sideW - 1);
  expect(r.mainRight).toBeLessThanOrEqual(1280);
  expect(r.topbar === 'none' || r.menu === 'none').toBe(true);
  expect(r.over).toBeLessThanOrEqual(1);
});

test('the phone block changes nothing at 1280px (same layout with it taken out)', async ({ page }) => {
  await openApp(page);
  const keys = await page.evaluate(() => { const l = Object.values(lotIndex).find(l => l.world.owned && l.world.ready && l.gallery && unitCount(l));
    const h = Object.values(hhIndex).find(h => h.world.owned && h.world.ready && h.sims.length > 2);
    return ['home', 'w-' + l.world.id, 'n-' + l.hood.id, l.id, h.id, 'admin-progress', 'admin-game', 'calendar']; });
  // every picture loaded and decoded first: one still loading measures 0×0 instead of 1×1 (21 Nov: the test failed now and then)
  const boxes = () => page.evaluate(async () => { await Promise.all([...document.querySelectorAll('#view img')].map(i => i.decode().catch(() => {})).map(p => Promise.race([p, new Promise(r => setTimeout(r, 3000))])));
    await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))); return [...document.querySelectorAll('#view *')].slice(0, 400).map(e => { const r = e.getBoundingClientRect(); return [r.x, r.y, r.width, r.height].map(Math.round).join(','); }).join(';'); });
  const dropPhone = () => page.evaluate(() => { for (const sh of document.styleSheets) { if (!/site\.css/.test(sh.href || '')) continue;
    for (let i = sh.cssRules.length - 1; i >= 0; i--) { const r = sh.cssRules[i]; if (r.media && /max-width:\s*700px/.test(r.conditionText) && r.cssRules.length > 3) { sh.deleteRule(i); return true; } } } return false; });
  const withIt = {};
  for (const k of keys) { await go(page, k); withIt[k] = await boxes(); }
  expect(await dropPhone()).toBe(true);
  for (const k of keys) { await go(page, k + '?'); await go(page, k); expect(await boxes(), k).toBe(withIt[k]); }
});

test('on a phone the sidebar slides in from the menu button and the scrim closes it', async ({ page }) => {
  await page.setViewportSize({width: 375, height: 800});
  await openApp(page);
  const sideX = () => page.evaluate(() => document.getElementById('side').getBoundingClientRect().right);
  await expect(page.locator('#menuBtn')).toBeVisible();
  expect(await sideX()).toBeLessThanOrEqual(0);
  await page.click('#menuBtn');
  await expect(page.locator('body')).toHaveClass(/nav-open/);
  await expect.poll(sideX).toBeGreaterThan(200);
  await page.mouse.click(360, 400);   // the scrim, to the right of the sidebar
  await expect(page.locator('body')).not.toHaveClass(/nav-open/);
  // choosing a page closes it too
  await page.click('#menuBtn');
  const w = await page.evaluate(() => worlds.find(w => w.owned && w.ready).id);
  await page.locator(`#nav a[href="#w-${w}"]`).click();
  await expect(page).toHaveURL(new RegExp(`#w-${w}$`));
  await expect(page.locator('body')).not.toHaveClass(/nav-open/);
});
