// Her rules (CLAUDE.md) as the pages show them: lot names, curly apostrophes, British words, percentages only on the
// Stats/Progress page, live counts in her list, bedrooms, rental units, the New save column and the ancestors trial.
const { test } = require('@playwright/test');
const { openApp, go, viewText, expect } = require('./helpers');

// draw every page and collect what a rule forbids in its text (the same drawing trick as tools/check_pages.js)
const SCAN = () => {
  const render = (0, eval)('(' + route.toString().replace(/^function route\(\)\{/, 'function(key0){').replace('location.hash.slice(1) || "home"', 'key0') + ')');
  const keys = ['home', 'stats', ...worlds.filter(w => w.ready).flatMap(w => ['w-' + w.id, 'f-' + w.id, ...w.hoods.map(h => 'n-' + h.id)]),
    ...Object.keys(lotIndex), ...Object.keys(hhIndex), ...Object.keys(SIM_PAGES), ...Object.keys(GROUP_PAGES), ...SECTION_KEYS()];
  const view = document.getElementById('view'), out = {pages: keys.length, straight: [], pct: [], american: [], likes: [], braces: [], title: []};
  const add = (k, arr, t, re) => { const m = t.match(re); if (m) arr.push(k + ': ' + [...new Set(m)].slice(0, 3).join(' | ')); };
  for (const k of keys) {
    render(k); const t = view.innerText;
    add(k, out.straight, t, /.{0,15}'.{0,15}/g);                                    // curly apostrophes in shown text
    if (!/^(stats|admin-progress)$/.test(k)) add(k, out.pct, t, /.{0,15}\d\s?%/g);   // percentages only on Stats (now Admin, Progress)
    add(k, out.american, t, /.{0,15}\b(favorites?|organization)\b.{0,10}/gi);       // "Neighborhood" and "Color" stay in the game's own names
    add(k, out.likes, t, /\d[\d,]*\s+likes?\b/gi);                                  // Gallery likes are called favourites
    add(k, out.braces, t, /\{\w+\}/g);                                              // her list's {words} are always filled in
    add(k, out.title, document.title, /'/g);
  }
  render(location.hash.slice(1) || 'home');
  return out;
};

test('every page follows the wording rules', async ({ page }) => {
  await openApp(page);
  const r = await page.evaluate(SCAN);
  expect(r.pages).toBeGreaterThan(1000);
  expect(r.straight, 'straight apostrophes in shown text').toEqual([]);
  expect(r.title, 'straight apostrophes in the tab title').toEqual([]);
  expect(r.pct, 'percentages outside Stats').toEqual([]);
  expect(r.american, 'American spellings').toEqual([]);
  expect(r.likes, '"likes" for Gallery favourites').toEqual([]);
  expect(r.braces, 'unfilled {words}').toEqual([]);
});

test('lot names: Gallery title, then her name (not a bare "?"), then the in-game name', async ({ page }) => {
  await openApp(page);
  // Community Space lots are left out: each version tab brings its own Gallery title, and the lot keeps the name it had before
  const bad = await page.evaluate(() => Object.values(lotIndex).filter(l => !l.versions).flatMap(l => {
    const fix = NAME_FIX[l.world.name + '|' + l.lot], mine = (l.mine || '').trim();
    const want = fix || (l.gallery && l.gallery.title) || (mine && !/^\?+$/.test(mine) ? mine : '') || l.lot;
    const errs = [];
    if (l.name !== want) errs.push(`${l.id}: "${l.name}", expected "${want}"`);
    if (/^\?+$/.test(l.name)) errs.push(`${l.id}: named "?"`);
    if ((l.ea || null) !== (l.name !== l.lot ? l.lot : null)) errs.push(`${l.id}: in-game name kept wrongly`);
    return errs;
  }));
  expect(bad).toEqual([]);
});

test('the in-game name shows on the lot page, not on its neighbourhood card', async ({ page }) => {
  await openApp(page);
  const l = await page.evaluate(() => { const l = Object.values(lotIndex).find(l => l.world.owned && l.world.ready && l.ea && !l.building && !l.name.includes(l.ea) && !l.ea.includes(l.name));
    return l && {id: l.id, hood: l.hood.id, ea: curly(l.ea), name: curly(l.name)}; });
  test.skip(!l, 'no lot with a different in-game name');
  await go(page, l.id);
  await expect(page.locator('#view')).toContainText(l.ea);
  await go(page, 'n-' + l.hood);
  const card = page.locator(`#view a.listing[href="#${l.id}"]`);
  await expect(card).toContainText(l.name);
  await expect(card).not.toContainText(l.ea);
});

test('lot pages show the Gallery’s bedroom and bathroom counts', async ({ page }) => {
  await openApp(page);
  const l = await page.evaluate(() => { const l = Object.values(lotIndex).find(l => l.world.owned && l.world.ready && l.gallery && l.gallery.beds > 0 && l.gallery.baths > 0 && !l.versions);
    return l && {id: l.id, beds: l.gallery.beds, baths: l.gallery.baths}; });
  await go(page, l.id);
  const dd = dt => page.locator('#view dt', {hasText: new RegExp(`^${dt}$`)}).locator('xpath=following-sibling::dd[1]');
  await expect(dd('Bedrooms')).toHaveText(String(l.beds));
  await expect(dd('Bathrooms')).toHaveText(String(l.baths));
  const none = await page.evaluate(() => { const l = Object.values(lotIndex).find(l => l.world.owned && l.world.ready && l.gallery && !l.gallery.beds && !/rental/i.test(l.type)); return l && l.id; });
  if (none) { await go(page, none); await expect(page.locator('#view dt', {hasText: /^Bedrooms$/})).toHaveCount(0); }
});

test('rental units: one row per unit, each linking to the household living there', async ({ page }) => {
  await openApp(page);
  const rentals = await page.evaluate(() => Object.values(lotIndex).filter(l => l.world.owned && l.world.ready && unitCount(l))
    .map(l => ({id: l.id, n: unitCount(l), who: rentalUnits(l).map(u => u ? u.hh.id : null)})));
  expect(rentals.length).toBeGreaterThan(5);
  for (const r of rentals) {
    await go(page, r.id);
    const rows = page.locator('#view .unit-row');
    await expect(rows, r.id).toHaveCount(r.n);
    const hrefs = await rows.evaluateAll(as => as.map(a => a.getAttribute('href').slice(1)));
    expect(hrefs, r.id).toEqual(r.who.map(h => h || r.id));
    for (const h of r.who.filter(Boolean)) expect(await page.evaluate(id => !!hhIndex[id], h), h).toBe(true);
  }
});

test('the counts in her list on Admin, Notes are filled in live and match the plan', async ({ page }) => {
  await openApp(page, 'admin-game');
  const r = await page.evaluate(() => {
    const L = Object.values(lotIndex).filter(l => l.world.owned && l.world.ready), live = admLive();
    return {live, toBuild: L.filter(l => l.built === false).length, toShare: L.filter(l => l.built === true && l.shared !== true).length,
      list: ADM.checklist.length, raw: ADM.checklist.flatMap(c => c.text.match(/\{(\w+)\}/g) || [])};
  });
  expect(r.live.toBuild).toBe(r.toBuild);
  expect(r.live.toShare).toBe(r.toShare);
  expect(r.list).toBeGreaterThan(10);
  for (const w of new Set(r.raw)) expect(Object.keys(r.live), w).toContain(w.slice(1, -1));   // every {word} her list uses is one the page knows
  const text = await viewText(page);
  expect(text).not.toMatch(/\{\w+\}/);
  expect(text).toContain(`Build the ${r.toBuild} lots`);
});

test('Admin numbers add up: At a glance, the sidebar badge and Notes agree', async ({ page }) => {
  await openApp(page, 'admin');
  const r = await page.evaluate(() => { const n = admCounts(), L = admOwned();
    return {notes: ADM.checklist.length + n.checks + ADM.toSort.length, built: L.filter(l => l.built === true).length, all: buildable(L).length,   // the game's own lots ("N/A") are not counted (15 Nov)
      shared: L.filter(l => l.shared === true).length}; });
  const notesCard = page.locator('#view .adm-card', {hasText: 'Notes'});
  await expect(notesCard.locator('b.big')).toHaveText(String(r.notes));
  await expect(page.locator('#nav a[href="#admin-game"] .pct')).toHaveText(String(r.notes));
  const builtCard = page.locator('#view .adm-card', {hasText: 'Built'}).first();
  await expect(builtCard.locator('b.big')).toContainText(`${r.built} of ${r.all}`);
  await expect(builtCard).toContainText(`${r.shared} shared`);
});

test('Progress has the New save column, one cell per lot row', async ({ page }) => {
  await openApp(page, 'admin-progress');
  const has = await page.evaluate(() => !!(ADM.newSave && ADM.newSave.lots));
  test.skip(!has, 'no new-save check in admin-data.js');
  await expect(page.locator('#lot-rows thead th.ns-th')).toHaveCount(1);
  const r = await page.locator('#lot-rows table').evaluate(t => ({head: t.querySelectorAll('thead th').length, rows: [...t.querySelectorAll('tbody tr')].map(tr => tr.children.length)}));
  expect(r.rows.length).toBeGreaterThan(100);
  expect(r.rows.filter(n => n !== r.head)).toEqual([]);
});

test('the ancestors trial: the switch shows on Sim pages only and swaps the pictures in and out', async ({ page }) => {
  await openApp(page);
  const id = await page.evaluate(() => Object.keys(ANC).find(id => SIMS[id] && SIM_PAGES['s-' + id] && ANC[id].portrait && !SIMS[id].portrait && !ANC_WAS[id].libraryPic));
  test.skip(!id, 'no ancestor with a game portrait');
  await go(page, 'home');
  await expect(page.locator('#anc-switch')).toBeHidden();
  await go(page, 's-' + id);
  const sw = page.locator('#anc-switch');
  await expect(sw).toBeVisible();
  await expect(sw.locator('[data-anctrial="now"]')).toHaveAttribute('aria-pressed', 'true');
  expect(await page.evaluate(i => SIMS[i].libraryPic || null, id)).toBeNull();
  await sw.locator('[data-anctrial="on"]').click();
  await expect(sw.locator('[data-anctrial="on"]')).toHaveAttribute('aria-pressed', 'true');
  expect(await page.evaluate(i => SIMS[i].libraryPic === ANC[i].portrait, id)).toBe(true);
  await expect(page.locator(`#view img[src="${await page.evaluate(i => ANC[i].portrait, id)}"], #view [style*="${await page.evaluate(i => ANC[i].portrait, id)}"]`).first()).toBeAttached();
  expect(await page.evaluate(() => localStorage.getItem('jsw-ancestors-trial'))).toBe('on');
  await sw.locator('[data-anctrial="now"]').click();
  await expect(sw.locator('[data-anctrial="now"]')).toHaveAttribute('aria-pressed', 'true');
  expect(await page.evaluate(i => SIMS[i].libraryPic || null, id)).toBeNull();
});
