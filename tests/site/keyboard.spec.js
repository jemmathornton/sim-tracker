// Keyboard only (19 Nov): the sidebar can be walked with Tab in the order it's shown, every link has a name and a visible focus
// ring, Enter opens a page, and on a phone the menu button opens the sidebar from the keyboard.
const { test } = require('@playwright/test');
const { openApp, expect } = require('./helpers');

const focused = page => page.evaluate(() => { const a = document.activeElement;
  return {inNav: !!a.closest('#nav'), kbi: a.dataset.kbi, tag: a.tagName, href: a.getAttribute('href'), id: a.id, text: (a.innerText || a.getAttribute('aria-label') || '').trim(),
    ring: (() => { const s = getComputedStyle(a); return s.outlineStyle !== 'none' && parseFloat(s.outlineWidth) > 0 || s.boxShadow !== 'none'; })()}; });

test('Tab walks the whole sidebar in order, every link named and with a focus ring', async ({ page }) => {
  await openApp(page);
  // every element in the sidebar that can take focus, numbered in the order it's shown
  const links = await page.evaluate(() => [...document.querySelectorAll('#nav a[href], #nav button, #nav [tabindex="0"]')]
    .filter(a => a.offsetParent !== null && a.tabIndex >= 0).map((a, i) => { a.dataset.kbi = i; return i; }));
  expect(links.length).toBeGreaterThan(10);
  const order = [], bad = [];
  await page.evaluate(() => document.activeElement && document.activeElement.blur());   // nothing focused: Tab starts at the top
  for (let i = 0; i < links.length + 15 && order.length < links.length; i++) {
    await page.keyboard.press('Tab');
    const f = await focused(page);
    if (!f.inNav) { if (order.length) break; continue; }
    order.push(f.kbi == null ? f.href || f.text : +f.kbi);
    if (!f.text) bad.push(`${f.href}: no name`);
    if (!f.ring) bad.push(`${f.href || f.text}: no visible focus`);
  }
  expect(order).toEqual(links);
  expect(bad).toEqual([]);
});

test('Enter on a sidebar link opens its page; search works from the keyboard alone', async ({ page }) => {
  await openApp(page);
  const w = await page.evaluate(() => worlds.find(w => w.owned && w.ready).id);
  const target = page.locator(`#nav a[href="#w-${w}"]`);
  await page.locator('#q').focus();
  let f;
  for (let i = 0; i < 40; i++) { await page.keyboard.press('Tab'); f = await focused(page); if (f.href === `#w-${w}`) break; }
  expect(f.href).toBe(`#w-${w}`);
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(new RegExp(`#w-${w}$`));
  await expect(target).toHaveClass(/\bon\b/);
  // search, entirely from the keyboard
  await page.locator('#q').focus();
  const lot = await page.evaluate(() => Object.values(lotIndex).find(l => l.world.owned && l.world.ready).name);
  await page.keyboard.type(lot);
  await expect(page.locator('#nav a.hit.on')).toHaveCount(1);
  await page.keyboard.press('Escape');
  await expect(page.locator('#q')).toHaveValue('');
  await expect(page.locator('#nav a.hit')).toHaveCount(0);
});

test('on a phone, the menu button opens the sidebar from the keyboard and a link closes it', async ({ page }) => {
  await page.setViewportSize({width: 375, height: 800});
  await openApp(page);
  await page.locator('#menuBtn').focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('#side')).toHaveClass(/jj-open/);
  expect(await page.locator('#menuBtn').evaluate(b => b.tagName === 'BUTTON' || b.getAttribute('role') === 'button')).toBe(true);
  expect(await page.locator('#menuBtn').evaluate(b => (b.getAttribute('aria-label') || b.innerText || '').trim().length)).toBeGreaterThan(0);
  const w = await page.evaluate(() => worlds.find(w => w.owned && w.ready).id);
  await page.locator(`#nav a[href="#w-${w}"]`).focus();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(new RegExp(`#w-${w}$`));
  await expect(page.locator('#side')).not.toHaveClass(/jj-open/);
});
