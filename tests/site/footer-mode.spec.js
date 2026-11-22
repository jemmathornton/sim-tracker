// Bottom of every page (21 Nov 2026, her ask for all her sites, as on Jemma’s Journals): "Back to top" and "Dark mode".
// The site opens light even when the device prefers dark; the button switches it, and the choice is remembered ("jj-mode", the key
// every site in the family shares). What the buttons do, their words, icons and sizes are tested once for every site in the parent
// (JemmasJournals/tests/family/family.test.js); here only Sim World's routing (every kind of page) and its dark-mode contrast.
const { test } = require('@playwright/test');
const { openApp, go, expect } = require('./helpers');

// one page of every kind: home, a world, a neighbourhood, a lot, households, a household, a Sim, a group, every section page
// (Calendar, Across the worlds, Admin) and "Page not found"
const pageKeys = page => page.evaluate(() => {
  const w = worlds.find(x => x.ready && x.owned), l = Object.values(lotIndex)[0];
  return ['home', 'w-' + w.id, 'n-' + l.hood.id, l.id, 'f-' + w.id, Object.keys(hhIndex)[0], Object.keys(SIM_PAGES)[0],
    Object.keys(GROUP_PAGES)[0], ...SECTION_KEYS(), 'no-such-page'].filter(Boolean);
});

for (const [name, width] of [['laptop', 1280], ['phone', 375]]) {
  test(`Back to top and Dark mode sit below the page on every kind of page (${name})`, async ({ page }) => {
    await page.setViewportSize({ width, height: 800 });
    await openApp(page);
    for (const k of await pageKeys(page)) {
      await go(page, k);
      const r = await page.evaluate(() => {
        const t = document.getElementById('toTop').getBoundingClientRect(), m = document.getElementById('modeBtn').getBoundingClientRect(), v = document.getElementById('view').getBoundingClientRect();
        return { below: t.top >= v.bottom - 1 && m.top >= v.bottom - 1, last: document.querySelector('main').lastElementChild.classList.contains('site-foot') };
      });
      expect(r, k).toEqual({ below: true, last: true });
    }
  });
}

// text contrast in dark mode: the colour tokens for words against the backgrounds they sit on, at least 4.5:1
test('dark mode text colours read at 4.5:1 or more', async ({ page }) => {
  await openApp(page);
  await page.locator('#modeBtn').click();
  const r = await page.evaluate(() => {
    const css = getComputedStyle(document.documentElement), v = n => css.getPropertyValue(n).trim();
    const rgb = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16) / 255).map(c => c <= .03928 ? c / 12.92 : ((c + .055) / 1.055) ** 2.4);
    const lum = h => { const [r, g, b] = rgb(h); return .2126 * r + .7152 * g + .0722 * b; };
    const ratio = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + .05) / (Math.min(x, y) + .05); };
    const out = [];
    for (const fg of ['--ink', '--muted', '--water', '--plum', '--brass', '--side-ink', '--side-mute', '--done'])
      for (const bg of ['--paper', '--surface', '--soft', '--nav']) out.push([fg, bg, Math.round(ratio(v(fg), v(bg)) * 100) / 100]);
    return out;
  });
  const low = r.filter(([, , x]) => x < 4.5);
  expect(low, JSON.stringify(low)).toEqual([]);
});

// every word on a sample of pages (one of each kind, every calendar and section page): dark mode adds no text below 4.5:1
// against what it sits on (text over map banners and photos is left out; anything already low in light mode is the light
// look's own, e.g. white initials on a world-coloured circle)
const LOW_TEXT = () => {
  const P = s => { const m = s.match(/[\d.]+/g); if (!m) return null; const n = m.map(Number);
    return s.startsWith('color(') ? [n[0] * 255, n[1] * 255, n[2] * 255, ...(n.length > 3 ? [n[3]] : [])] : n; };
  const L = ([r, g, b]) => { const f = c => { c /= 255; return c <= .03928 ? c / 12.92 : ((c + .055) / 1.055) ** 2.4; }; return .2126 * f(r) + .7152 * f(g) + .0722 * f(b); };
  const out = [];
  for (const el of document.querySelectorAll('#view *, .site-foot *, #nav *')) {
    if (![...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim())) continue;
    const cs = getComputedStyle(el); if (cs.visibility === 'hidden' || !el.getClientRects().length) continue;
    const fg = P(cs.color); if (fg.length > 3 && fg[3] < 1) continue;
    let e = el, bg = null;
    while (e) { const c = getComputedStyle(e);
      if ((c.backgroundImage !== 'none' && !/gradient/.test(c.backgroundImage)) || e.classList.contains('mapped')) break;
      const b = P(c.backgroundColor); if (b && (b.length === 3 || b[3] > .5)) { bg = b; break; } e = e.parentElement; }
    if (!bg) continue;
    const a = L(fg), b = L(bg);
    if ((Math.max(a, b) + .05) / (Math.min(a, b) + .05) < 4.5) out.push(el.className + ' "' + el.textContent.trim().slice(0, 30) + '"');
  }
  return [...new Set(out)];
};
test('dark mode makes no words harder to read than 4.5:1', async ({ page }) => {
  test.setTimeout(240_000);
  await openApp(page);
  const keys = await page.evaluate(() => { const w = worlds.find(x => x.ready && x.owned), l = Object.values(lotIndex).find(x => x.hh);
    return ['home', 'w-' + w.id, 'n-' + l.hood.id, l.id, 'f-' + w.id, l.hh.id, Object.keys(SIM_PAGES)[0], ...Object.keys(GROUP_PAGES).slice(0, 6), ...SECTION_KEYS()]; });
  const low = {};
  for (const mode of ['light', 'dark']) {
    await page.evaluate(m => document.documentElement.setAttribute('data-mode', m), mode);
    for (const k of keys) { await go(page, k); (low[k] ||= {})[mode] = await page.evaluate(LOW_TEXT); }
  }
  const worse = Object.entries(low).map(([k, r]) => [k, r.dark.filter(t => !r.light.includes(t))]).filter(([, t]) => t.length);
  expect(worse, JSON.stringify(worse, null, 1)).toEqual([]);
});
