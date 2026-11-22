// Round 5 review fixes (22 Nov 2026; JemmasJournals/research/reviews/round5-simworld.md, Should fix 2–5):
// "✓ Built" / "✓ Shared", trait chips and life-state chips read at 4.5:1 in both modes; a lot's carousel loads only the photo shown and
// its neighbours (the rest when the carousel moves near them); after a keyboard search for a page with no sidebar link of its own
// (a dynasty, club or organisation), focus goes to the page, not to the world link. (The refresh card: review-19nov and versions.)
const { test } = require('@playwright/test');
const { openApp, go, expect } = require('./helpers');

// contrast of an element's text against its own background (walking up to the first solid colour), as in round4.spec.js
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

test('“✓ Built”, “✓ Shared”, trait chips and life-state chips read at 4.5:1 in light and dark, in every world', async ({ page }) => {
  test.setTimeout(240_000);
  await page.setViewportSize({ width: 1280, height: 900 });
  await openApp(page);
  await page.evaluate(RATIO);
  // per ready world: a shared lot, a lot with traits, a Sim with traits; plus every Sim with an occult or animal chip's household
  const keys = await page.evaluate(() => {
    const k = new Set(['l-oasis-springs--rio-verde', 'l-sulani--admiral-s-wreckage', 's-cordelia-thebe-v', 'h-forgotten-hollow--straud'].filter(x => lotIndex[x] || SIM_PAGES[x] || hhIndex[x]));
    for (const w of worlds.filter(w => w.owned && w.ready)) {
      const lots = Object.values(lotIndex).filter(l => l.world === w);
      const a = lots.find(l => l.shared === true), b = lots.find(l => (l.traits || []).length);
      if (a) k.add(a.id); if (b) k.add(b.id);
      const s = Object.entries(SIM_PAGES).find(([, s]) => s.hh && s.hh.world === w && (s.traits || []).length); if (s) k.add(s[0]);
    }
    return [...k];
  });
  expect(keys.length).toBeGreaterThan(20);
  const low = [];
  for (const mode of ['light', 'dark']) {
    await page.evaluate(m => document.documentElement.setAttribute('data-mode', m), mode);
    for (const k of keys) {
      await go(page, k);
      low.push(...await page.evaluate(([m, k]) => [...document.querySelectorAll('#view .facts dd.progress span.yes, #view .traits span, #view .state')]
        .filter(el => el.getClientRects().length && el.textContent.trim()).map(el => [m, k, el.textContent.trim().slice(0, 20), __ratio(el)]).filter(x => x[3] < 4.5), [mode, k]));
    }
  }
  expect(low.slice(0, 15)).toEqual([]);
});

test('a lot’s carousel loads only the photo shown and its neighbours; moving loads the next; the lightbox still opens the full photo', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await openApp(page);
  const id = await page.evaluate(() => Object.values(lotIndex).find(l => l.world.owned && l.world.ready && l.photos.length >= 6 && !l.versions)?.id);
  test.skip(!id, 'no lot with six photos');
  await go(page, id);
  const loaded = () => page.evaluate(() => [...document.querySelectorAll('#view .car-slide img')].map((im, k) => im.getAttribute('src') ? k : -1).filter(k => k >= 0));
  const n = await page.locator('#view .car-slide').count();
  expect(await loaded()).toEqual([0, 1, n - 1]);
  await page.locator('#view .car-arrow.next').click();                      // to photo 2: photo 3 loads
  expect(await loaded()).toEqual([0, 1, 2, n - 1]);
  await page.locator('#view .car-slide').nth(1).focus();
  await page.keyboard.press('ArrowRight');                                   // keyboard: to photo 3, photo 4 loads
  await expect(page.locator('#view .carousel')).toHaveAttribute('data-i', '2');
  expect(await loaded()).toEqual([0, 1, 2, 3, n - 1]);
  await page.locator('#view .car-thumbs button').nth(n - 3).click();         // a thumbnail far along: it and its neighbours load
  expect(await loaded()).toEqual([0, 1, 2, 3, n - 4, n - 3, n - 2, n - 1]);
  await page.locator('#view .car-slide').nth(n - 3).click();
  const want = await page.evaluate(([id, i]) => lotIndex[id].photos[i].src, [id, n - 3]);
  await expect(page.locator('#lightbox img')).toHaveAttribute('src', want);
});

test('a keyboard search for a dynasty, club or organisation puts focus on the page, not on the world link', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await openApp(page);
  const g = await page.evaluate(() => { const g = Object.values(GROUP_PAGES).find(g => search(groupTitle(g)).some(h => h.href === '#' + g.id)); return g && {id: g.id, name: groupTitle(g)}; });
  test.skip(!g, 'no group page');
  await page.fill('#q', g.name);
  const i = await page.locator('#nav a.hit').evaluateAll((as, href) => as.findIndex(a => a.getAttribute('href') === href), '#' + g.id);
  expect(i).toBeGreaterThanOrEqual(0);
  for (let k = 0; k < i; k++) await page.press('#q', 'ArrowDown');
  await page.press('#q', 'Enter');
  await expect(page).toHaveURL(new RegExp(`#${g.id}$`));
  await expect.poll(() => page.evaluate(() => document.activeElement && (document.activeElement.id || document.activeElement.textContent.trim().slice(0, 30)))).toBe('view');
});
