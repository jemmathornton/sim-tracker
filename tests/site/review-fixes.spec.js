// Fixes from the 15 Nov review: Progress filters with apostrophes, "New" on a first visit, "N of M built" leaving out the
// game's own lots, Sims counted without animals, the version tabs' redraw, the not-owned worlds by keyboard, one first draw.
const { test } = require('@playwright/test');
const { openApp, go, expect } = require('./helpers');

const showing = async (page, id) => +(await page.locator(`#${id} .showing b`).innerText());

test('Progress: every neighbourhood filter shows its lots and households (apostrophes too)', async ({ page }) => {
  test.setTimeout(120_000);
  await openApp(page, 'admin-progress');
  for (const [w, h, rows] of [['f-world', 'f-hood', 'lot-rows'], ['h-world', 'h-hood', 'hh-rows']]) {
    const worldsWith = await page.locator(`#${w} option`).evaluateAll(os => os.map(o => o.value).filter(Boolean));
    const empty = [];
    for (const wv of worldsWith) {
      await page.selectOption(`#${w}`, wv);
      const hoods = await page.locator(`#${h} option`).evaluateAll(os => os.map(o => o.value).filter(Boolean));
      for (const hv of hoods) {
        await page.selectOption(`#${h}`, hv);
        if (await showing(page, rows) === 0) empty.push(`${wv} / ${hv}`);
      }
    }
    expect(empty, `${rows}: neighbourhoods that filter to nothing`).toEqual([]);
  }
  // the ones that broke: their option values are the straight names from the data
  await page.selectOption('#f-world', 'Brindleton Bay');
  await page.selectOption('#f-hood', "Whiskerman's Wharf");
  expect(await showing(page, 'lot-rows')).toBeGreaterThan(0);
  await expect(page.locator('#f-hood option:checked')).toHaveText('Whiskerman’s Wharf');   // still shown curly
});

test('a first visit shows nothing as New, Community Space lots included, even after switching version tabs', async ({ page }) => {
  await openApp(page);   // a fresh browser: empty localStorage
  expect(await page.evaluate(() => Object.values(lotIndex).filter(l => newSince(l)).map(l => l.name))).toEqual([]);
  const cs = await page.evaluate(() => Object.values(lotIndex).filter(l => l.versions).map(l => l.id));
  expect(cs.length).toBeGreaterThan(0);
  await go(page, cs[0]);
  await page.locator('[data-ver="1"]').click();
  await go(page, 'home');
  await page.reload();
  await page.waitForFunction(() => typeof SECTION_KEYS === 'function' && document.querySelector('#view').innerHTML.length > 0);
  expect(await page.evaluate(() => Object.values(lotIndex).filter(l => newSince(l)).map(l => l.name))).toEqual([]);
  await go(page, 'admin');
  await expect(page.locator('#view .adm-card', {hasText: 'New since you looked'}).locator('b.big')).toHaveText('0');
});

test('"N of M built" leaves out the game\'s own lots, and every page agrees', async ({ page }) => {
  await openApp(page);
  const r = await page.evaluate(() => {
    const L = admOwned(), own = worlds.filter(w => w.owned && w.ready);
    const hood = own.flatMap(w => w.hoods).find(x => x.lots.some(l => l.built === 'N/A') && x.lots.some(l => l.built === false || l.built === true));
    return {built: L.filter(l => l.built === true).length, of: buildable(L).length, na: L.filter(l => l.built === 'N/A').length,
      hood: hood && {id: hood.id, world: hood.world.id, built: hood.lots.filter(l => l.built === true).length, of: buildable(hood.lots).length, all: hood.lots.length}};
  });
  expect(r.na).toBeGreaterThan(0);
  expect(r.hood).toBeTruthy();
  expect(r.hood.of).toBeLessThan(r.hood.all);
  // the neighbourhood page and its card on the world page
  await go(page, 'n-' + r.hood.id);
  await expect(page.locator('#view .hood-head .count').first()).toHaveText(`${r.hood.built} of ${r.hood.of} built`);
  await go(page, 'w-' + r.hood.world);
  await expect(page.locator(`#view a.listing[href="#n-${r.hood.id}"] .meta`)).toContainText(`${r.hood.built} of ${r.hood.of} lots built`);
  // At a glance and Progress's total row
  await go(page, 'admin');
  await expect(page.locator('#view .adm-card', {hasText: 'Built'}).first().locator('b.big')).toContainText(`${r.built} of ${r.of}`);
  await go(page, 'admin-progress');
  await expect(page.locator('#view tfoot tr').first()).toContainText(`${r.built} / ${r.of}`);
});

test('Sims are counted without animals on household cards and Progress, matching the world pages', async ({ page }) => {
  await openApp(page);
  const r = await page.evaluate(() => {
    const own = worlds.filter(w => w.owned && w.ready), hhs = own.flatMap(homeHhs);
    const pets = hhs.find(x => x.sims.some(isAnimal) && x.sims.some(sm => !isAnimal(sm)));
    return {total: simCount(hhs), pets: pets && {id: pets.id, world: pets.world.id, sims: simCount([pets]), all: pets.sims.length}};
  });
  expect(r.pets).toBeTruthy();
  expect(r.pets.sims).toBeLessThan(r.pets.all);
  await go(page, 'f-' + r.pets.world);
  await expect(page.locator(`#view a.listing[href="#${r.pets.id}"] .meta`)).toContainText(`${r.pets.sims} Sim profile`);
  await go(page, 'admin-progress');
  const sum = await page.evaluate(() => [...document.querySelectorAll('#hh-rows tbody tr')].reduce((n, tr) => n + +tr.querySelectorAll('td.num')[0].textContent, 0));
  const listed = await page.evaluate(() => { const all = hhList(); return simCount(all); });
  expect(sum).toBe(listed);
  const row = page.locator('#hh-rows tbody tr', {has: page.locator(`a[href="#${r.pets.id}"]`)}).first();
  await expect(row.locator('td.num').first()).toHaveText(String(r.pets.sims));
});

test('switching a Community Space version tab redraws the page fully', async ({ page }) => {
  await openApp(page);
  const id = await page.evaluate(() => Object.values(lotIndex).find(l => l.versions).id);
  await go(page, id);
  await page.evaluate(() => { window.__drawn = 0; const f = afterDraw; afterDraw = function (...a) { window.__drawn++; return f.apply(this, a); }; });
  await page.locator('[data-ver="1"]').click();
  await expect(page.locator('[data-ver="1"]')).toHaveAttribute('aria-selected', 'true');
  expect(await page.evaluate(() => window.__drawn)).toBe(1);
  await expect(page.locator('[data-ver="1"]')).toBeFocused();
});

test('the not-owned worlds\' household lists open from the keyboard', async ({ page }) => {
  await openApp(page);
  const t = page.locator('#nav a[data-nofold]').first();
  await expect(t).toHaveAttribute('tabindex', '0');
  await t.focus();
  await expect(t).toHaveAttribute('aria-expanded', 'false');
  await page.keyboard.press('Enter');
  await expect(t).toHaveAttribute('aria-expanded', 'true');
  await page.keyboard.press(' ');
  await expect(t).toHaveAttribute('aria-expanded', 'false');
});

test('a rental never places a tenant outside its units', async ({ page }) => {
  await openApp(page);
  const r = await page.evaluate(() => {
    const l = Object.values(lotIndex).find(x => unitCount(x) >= 1 && x.hh);
    const fake = {...l, tenants: [...(l.tenants || []), ...Array.from({length: unitCount(l) + 2}, (_, i) => ({name: 'Test ' + i, id: 'x' + i, unit: 1}))]};
    const out = rentalUnits(fake);
    return {n: unitCount(l), len: out.length, neg: Object.keys(out).filter(k => !/^\d+$/.test(k))};
  });
  expect(r.len).toBe(r.n);
  expect(r.neg).toEqual([]);
});

test('the first page is drawn once, and a section page never shows "Page not found" first', async ({ page }) => {
  await page.addInitScript(() => {
    window.__titles = [];
    const d = Object.getOwnPropertyDescriptor(Document.prototype, 'title');   // every title a page draw sets
    Object.defineProperty(document, 'title', {get() { return d.get.call(this); }, set(v) { window.__titles.push(v); d.set.call(this, v); }, configurable: true});
  });
  const errors = await openApp(page, 'admin-progress');
  expect(errors).toEqual([]);
  const titles = await page.evaluate(() => window.__titles);
  expect(titles.filter(t => /not found/i.test(t))).toEqual([]);
  expect(titles.length, 'one draw sets the title twice (its own, then curly)').toBe(2);
  await expect(page.locator('#view h1')).toContainText('progress');
});
