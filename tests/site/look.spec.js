// The town-plan look (her pick 21 Nov 2026) and the fixes from its review: banners keep their description, counts say
// "1 download", household cards don't get lot-size brackets, and the phone's Worlds drawer works from the keyboard.
const { test } = require('@playwright/test');
const { openApp, go, expect } = require('./helpers');

test('every world banner shows at least one line of its description at 1280×800 and 1600×930', async ({ page }) => {
  await openApp(page);
  const ids = await page.evaluate(() => worlds.filter(w => w.ready && w.owned && w.map).map(w => w.id));
  for (const size of [{width: 1280, height: 800}, {width: 1600, height: 930}]) {
    await page.setViewportSize(size);
    for (const id of ids) {
      await go(page, 'w-' + id);
      const r = await page.evaluate(() => { const p = document.querySelector('.hero.mapped > p'), h = document.querySelector('.hero.mapped');
        if (!p) return {none: true};
        const pr = p.getBoundingClientRect(), hr = h.getBoundingClientRect(), line = parseFloat(getComputedStyle(p).lineHeight);
        return {tall: pr.height, line, inside: pr.top >= hr.top && pr.bottom <= hr.bottom}; });
      if (r.none) continue;
      expect(r.tall, `${id} at ${size.width}`).toBeGreaterThanOrEqual(r.line - 1);
      expect(r.inside, `${id} at ${size.width}`).toBe(true);
    }
  }
});

test('counts of one are singular ("1 download", "1 favourite")', async ({ page }) => {
  await openApp(page);
  const keys = await page.evaluate(() => [...new Set(Object.values(lotIndex).filter(l => l.gallery).map(l => 'n-' + l.hood.id))]);
  for (const k of keys) {
    await go(page, k);
    const t = await page.locator('#view').innerText();
    expect(t, k).not.toMatch(/\b1 (downloads|favourites)\b/);
  }
});

test('household cards show the home name without the lot-size brackets', async ({ page }) => {
  await openApp(page, 'f-willow-creek');
  const marks = await page.evaluate(() => [...document.querySelectorAll('.photo .size.home')].map(e => getComputedStyle(e, '::before').display));
  expect(marks.length).toBeGreaterThan(0);
  expect(marks.every(d => d === 'none')).toBe(true);
});

test('phone drawer: closed it is out of the Tab order; the button says open or closed; Escape closes it and focus returns', async ({ page }) => {
  await page.setViewportSize({width: 390, height: 844});
  await openApp(page);
  const btn = page.locator('#menuBtn');
  await expect(btn).toHaveAttribute('aria-expanded', 'false');
  expect(await page.evaluate(() => document.getElementById('side').inert)).toBe(true);
  await btn.focus();
  await page.keyboard.press('Enter');
  await expect(btn).toHaveAttribute('aria-expanded', 'true');
  expect(await page.evaluate(() => document.getElementById('side').contains(document.activeElement))).toBe(true);
  // it starts on Home, not on the Jemma's Journals link (her call 21 Nov: one Enter shouldn't leave the site)
  expect(await page.evaluate(() => [document.activeElement.getAttribute('href'), document.activeElement.closest('.nav-group') != null])).toEqual(['#home', true]);
  await page.keyboard.press('Escape');
  await expect(btn).toHaveAttribute('aria-expanded', 'false');
  expect(await page.evaluate(() => document.activeElement.id)).toBe('menuBtn');
  // at laptop width the sidebar is always reachable
  await page.setViewportSize({width: 1280, height: 800});
  expect(await page.evaluate(() => document.getElementById('side').inert)).toBe(false);
});
