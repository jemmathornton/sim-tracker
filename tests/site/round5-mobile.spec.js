// Round 5, phones and tablets (22 Nov 2026; JemmasJournals/research/reviews/round5-mobile.md, Sim World section):
// search text 16px in the drawer, the family's drawer width, the way home 44px tall, a swipe to the left closes the drawer,
// phone-sized map copies on phones only, the lot cards' dots in words on touch screens only, small links at least 24px tall.
const { test } = require('@playwright/test');
const { openApp, expect } = require('./helpers');

test('drawer on a phone: 16px search, 300px wide, the way home 44px tall with 12.5px text, a left swipe closes it', async ({ browser }) => {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  const page = await ctx.newPage();
  await openApp(page, 'home');
  await page.locator('#menuBtn').tap();
  await expect(page.locator('#side.jj-open')).toHaveCount(1);
  const r = await page.evaluate(() => { const h = document.querySelector('.home-link').getBoundingClientRect();
    return { search: getComputedStyle(document.querySelector('#q')).fontSize, w: Math.round(document.querySelector('#side').getBoundingClientRect().width),
      homeH: Math.round(h.height), homeFont: getComputedStyle(document.querySelector('.home-link')).fontSize }; });
  expect(r).toEqual({ search: '16px', w: 300, homeH: 44, homeFont: '12.5px' });
  const cdp = await ctx.newCDPSession(page);
  const touch = async (pts) => { await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [pts[0]] });
    for (const p of pts.slice(1)) await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [p] });
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] }); await page.waitForTimeout(300); };
  await touch([{ x: 150, y: 600 }, { x: 148, y: 500 }, { x: 146, y: 350 }]);   // scrolling the list: stays open
  await expect(page.locator('#side.jj-open')).toHaveCount(1);
  await touch([{ x: 240, y: 400 }, { x: 200, y: 402 }, { x: 120, y: 405 }, { x: 60, y: 406 }]);   // a swipe to the left: closes
  await expect(page.locator('#side.jj-open')).toHaveCount(0);
  await ctx.close();
});

test('the laptop sidebar is unchanged: 280px, the way home 10px text', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await openApp(page, 'home');
  const r = await page.evaluate(() => ({ w: Math.round(document.querySelector('#side').getBoundingClientRect().width), f: getComputedStyle(document.querySelector('.home-link')).fontSize }));
  expect(r).toEqual({ w: 280, f: '10px' });
});

test('map pictures: the phone-sized copy under 700px, the full map on laptops', async ({ page }) => {
  for (const [width, want] of [[390, /\.phone\.webp/], [1280, /maps\/willow-creek\.jpg/]]) {
    await page.setViewportSize({ width, height: 844 });
    await openApp(page, 'w-willow-creek');
    await page.reload();
    await page.waitForFunction(() => document.querySelector('.hero.mapped'));
    const style = await page.locator('.hero.mapped').getAttribute('style');
    expect(style).toMatch(want);
  }
});

test('lot cards: the dots have labels; words show on touch screens only; household links at least 24px tall', async ({ browser }) => {
  for (const touch of [true, false]) {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: touch, isMobile: touch });
    const page = await ctx.newPage();
    await openApp(page, 'n-willow-creek-foundry-cove');
    const r = await page.evaluate(() => ({
      labelled: [...document.querySelectorAll('.photo .status span')].every(s => s.getAttribute('role') === 'img' && /^(Built|Shared|Sims made): (yes|not yet)$/.test(s.getAttribute('aria-label'))),
      words: getComputedStyle(document.querySelector('.status-words')).display,
      hh: Math.min(...[...document.querySelectorAll('.hh-link')].map(a => a.getBoundingClientRect().height)) }));
    expect(r.labelled).toBe(true);
    expect(r.words).toBe(touch ? 'flex' : 'none');
    expect(r.hh).toBeGreaterThanOrEqual(24);
    await ctx.close();
  }
});
