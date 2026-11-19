// Search (19 Nov): every lot, household, Sim and group on the site is found by its own name, results are counted right, and
// the sidebar's search works from the keyboard. Names are taken from the page's own data, never typed in here.
const { test } = require('@playwright/test');
const { openApp, expect } = require('./helpers');

test('every lot, household, Sim page and group is found by its name (and lots by their in-game and Gallery names)', async ({ page }) => {
  await openApp(page);
  const r = await page.evaluate(() => {
    const want = [];
    worlds.filter(w => w.ready).forEach(w => {
      want.push(['World', w.name, '#w-' + w.id]);
      w.hoods.forEach(h => { want.push(['Neighbourhood', h.name, '#n-' + h.id]);
        h.lots.forEach(l => { want.push(['Lot', l.name, '#' + l.id]); if (l.lot && l.lot !== l.name) want.push(['Lot (in-game name)', l.lot, '#' + l.id]);
          if (l.gallery && l.gallery.title && l.gallery.title !== l.name) want.push(['Lot (Gallery title)', l.gallery.title, '#' + l.id]); }); });
      Object.values(w.households).forEach(x => { want.push(['Household', x.name, '#' + x.id]);
        x.sims.forEach(s => want.push(['Sim', s.name, s.sid ? '#s-' + s.sid : '#' + x.id])); });
    });
    Object.values(SIM_PAGES).filter(s => !s.hh).forEach(s => want.push(['Sim (family tree)', s.name, '#s-' + s.id]));
    Object.values(GROUP_PAGES).forEach(g => want.push([g.kind, groupTitle(g), '#' + g.id]));
    const missing = [], crowded = [];
    for (const [kind, name, href] of want) {
      const hits = search(name);
      if (hits.some(h => h.href === href)) continue;
      (hits.length >= 40 ? crowded : missing).push(`${kind} “${name}” (${href})`);
    }
    return {n: want.length, missing, crowded};
  });
  expect(r.n).toBeGreaterThan(1000);
  expect(r.missing.slice(0, 20)).toEqual([]);
  expect(r.crowded.length, 'names so common that 40 better matches push them out: ' + r.crowded.slice(0, 5).join(', ')).toBeLessThan(10);
});

test('results come best first: a name that starts with the words, before one that only contains them', async ({ page }) => {
  await openApp(page);
  const bad = await page.evaluate(() => {
    const e = [];
    for (const l of Object.values(lotIndex).filter(l => l.world.owned && l.world.ready).slice(0, 150)) {
      const hits = search(l.name), first = hits[0];
      if (!first || first.s !== 0) e.push(`“${l.name}”: first hit ${first && first.name}`);
      if (hits.some((h, i) => i && h.s < hits[i - 1].s)) e.push(`“${l.name}”: not best first`);
    }
    return e.slice(0, 10);
  });
  expect(bad).toEqual([]);
});

test('the sidebar search: the count matches the hits, arrows wrap round, Enter opens a household and a Sim', async ({ page }) => {
  await openApp(page);
  const p = await page.evaluate(() => { const h = Object.values(hhIndex).find(h => h.world.owned && h.world.ready && h.sims.some(s => s.sid && SIM_PAGES['s-' + s.sid]) && search(h.name).length > 2);
    const s = h.sims.find(s => s.sid && SIM_PAGES['s-' + s.sid]); return {hh: h.id, name: h.name, sim: 's-' + s.sid, simName: s.name}; });
  await page.fill('#q', p.name);
  const hits = page.locator('#nav a.hit');
  const n = await hits.count();
  await expect(page.locator('#nav .results .label')).toHaveText(new RegExp(`^${n}\\+? found$`));
  await expect(hits.first()).toHaveClass(/\bon\b/);
  await page.press('#q', 'ArrowUp');                                         // from the first hit up to the last
  await expect(hits.nth(n - 1)).toHaveClass(/\bon\b/);
  await page.press('#q', 'ArrowDown');                                       // and back round to the first
  await expect(hits.first()).toHaveClass(/\bon\b/);
  await expect(page.locator('#nav a.hit.on')).toHaveCount(1);
  const i = await hits.evaluateAll((as, href) => as.findIndex(a => a.getAttribute('href') === href), '#' + p.hh);
  expect(i).toBeGreaterThanOrEqual(0);
  for (let k = 0; k < i; k++) await page.press('#q', 'ArrowDown');
  await page.press('#q', 'Enter');
  await expect(page).toHaveURL(new RegExp(`#${p.hh}$`));
  await expect(page.locator('#q')).toHaveValue('');
  await page.fill('#q', p.simName);
  await page.locator(`#nav a.hit[href="#${p.sim}"]`).first().click();
  await expect(page).toHaveURL(new RegExp(`#${p.sim}$`));
  await expect(page.locator('#view')).toContainText(p.simName.replace(/'/g, '’'));
});

test('a search hit for the page already open puts the sidebar back', async ({ page }) => {
  await openApp(page);
  const p = await page.evaluate(() => { const l = Object.values(lotIndex).find(l => l.world.owned && l.world.ready && !l.versions); return {id: l.id, name: l.name}; });
  await page.evaluate(id => { location.hash = id; }, p.id);
  await expect(page).toHaveURL(new RegExp(`#${p.id}$`));
  await page.fill('#q', p.name);
  await page.locator(`#nav a.hit[href="#${p.id}"]`).first().click();
  await expect(page.locator('#q')).toHaveValue('');
  await expect(page.locator('#nav a.hit')).toHaveCount(0);
  await expect(page.locator('#nav a[href="#admin"]')).toBeVisible();
});
