// Across the worlds (19 Nov): Clubs, Dynasties, University organisations, Families and Businesses agree with the Sims and lots
// in data.js (each Sim's own clubs, dynasty and organisations as the plan records them), with their sidebar counts, and with
// each group's own page.
const { test } = require('@playwright/test');
const { openApp, go, expect } = require('./helpers');

// every group the plan's Sims are in, straight from their records (SIMS[id].src is the Sim as data.js has it)
const FROM_DATA = () => {
  const g = {club: {}, dynasty: {}, org: {}}, add = (kind, name, id, role) => { ((g[kind][name] ||= {})[id] ||= role || 'member'); };
  Object.values(SIMS).forEach(s => { const r = s.src || s;
    (r.clubs || []).forEach(c => add('club', c.name, s.id, c.role)); (r.orgs || []).forEach(c => add('org', c.name, s.id, c.role));
    if (r.dynasty && r.dynasty.name) add('dynasty', r.dynasty.name, s.id, r.dynasty.role); });
  const known = {club: (DATA.groups || {}).clubs || {}, org: (DATA.groups || {}).organisations || {}, dynasty: null};
  Object.entries(known).forEach(([k, have]) => { if (have) Object.keys(g[k]).forEach(n => { if (!have[n]) delete g[k][n]; }); });   // groups.json's own list (a data test checks the rest)
  return g;
};

test('every club, dynasty and organisation page lists exactly the Sims whose records name it, with their roles', async ({ page }) => {
  await openApp(page);
  const r = await page.evaluate(FROM_DATA => {
    const g = (0, eval)('(' + FROM_DATA + ')')(), e = [];
    for (const [kind, groups] of Object.entries(g)) for (const [name, members] of Object.entries(groups)) {
      const page = Object.values(GROUP_PAGES).find(p => p.kind === kind && p.name === name);
      if (!page) { e.push(`${kind} ${name}: no page`); continue; }
      const have = Object.fromEntries(page.members), want = members;
      if (JSON.stringify(Object.keys(have).sort()) !== JSON.stringify(Object.keys(want).sort())) e.push(`${kind} ${name}: members ${Object.keys(have).sort()} vs ${Object.keys(want).sort()}`);
      Object.entries(want).forEach(([id, role]) => { if (have[id] && have[id] !== role) e.push(`${kind} ${name}: ${id} is ${have[id]}, record says ${role}`); });
    }
    Object.values(GROUP_PAGES).forEach(p => { if (!(g[p.kind] || {})[p.name]) e.push(`${p.kind} ${p.name}: a page nobody's record names`); });
    return {e, pages: Object.values(GROUP_PAGES).map(p => ({id: p.id, n: p.members.length, names: p.members.map(([id]) => curly(SIMS[id].name)),
      lead: p.members.filter(([, r]) => ['leader', 'head', 'heir'].includes(r)).map(([id, r]) => [r, curly(SIMS[id].name)])}))};
  }, FROM_DATA.toString());
  expect(r.e).toEqual([]);
  expect(r.pages.length).toBeGreaterThan(0);
  for (const p of r.pages) {
    await go(page, p.id);
    await expect(page.locator('#view .mcards > .mcard'), p.id).toHaveCount(p.n);
    await expect(page.locator('#view .block-head .count').last()).toHaveText(`${p.n} ${p.n === 1 ? 'Sim' : 'Sims'}`);
    const shown = await page.locator('#view .mcards .tn').allInnerTexts();
    expect(shown.sort(), p.id).toEqual(p.names.slice().sort());
    for (const [role, name] of p.lead) {
      const dt = {leader: 'Leader', head: 'Head', heir: 'Heir'}[role];
      await expect(page.locator('#view dt', {hasText: new RegExp(`^${dt}$`)}).locator('xpath=following-sibling::dd[1]'), `${p.id} ${dt}`).toContainText(name);
    }
  }
});

test('the Across the worlds pages: cards match the sidebar counts and each group’s own page', async ({ page }) => {
  await openApp(page);
  const badge = key => page.locator(`#nav a[href="#${key}"] .pct`).innerText().then(Number).catch(() => 0);
  const n = await page.evaluate(() => ({club: Object.values(GROUP_PAGES).filter(g => g.kind === 'club'), dynasty: Object.values(GROUP_PAGES).filter(g => g.kind === 'dynasty'),
    orgs: Object.keys((DATA.groups || {}).organisations || {}).length, joined: Object.values(GROUP_PAGES).filter(g => g.kind === 'org').length,
    families: crossFamilies().length, businesses: ownedBusinesses().length}));
  const card = id => page.locator(`#view a.fam[href="#${id}"]`);

  await go(page, 'clubs');
  expect(await badge('clubs')).toBe(n.club.length);
  await expect(page.locator('#view a.fam[href^="#g-club-"]')).toHaveCount(n.club.length);
  for (const g of n.club) await expect(card(g.id)).toContainText(`${g.members.length} member${g.members.length === 1 ? '' : 's'}`);

  await go(page, 'dynasties');
  expect(await badge('dynasties')).toBe(n.dynasty.length);
  await expect(page.locator('#view a.fam[href^="#g-dynasty-"]')).toHaveCount(n.dynasty.length);
  for (const g of n.dynasty) await expect(card(g.id)).toContainText(`${g.members.length} member${g.members.length === 1 ? '' : 's'}`);

  await go(page, 'organisations');
  expect(await badge('organisations')).toBe(n.orgs);
  await expect(page.locator('#view .fam')).toHaveCount(n.orgs);                       // every organisation, joined or not
  await expect(page.locator('#view a.fam[href^="#g-org-"]')).toHaveCount(n.joined);  // only joined ones open a page
  await expect(page.locator('#view div.fam')).toHaveCount(n.orgs - n.joined);
  for (const t of await page.locator('#view div.fam small').allInnerTexts()) expect(t).toBe('No members yet');

  await go(page, 'families');
  expect(await badge('families')).toBe(n.families);
  const fams = await page.evaluate(() => crossFamilies().map(f => ({hhs: f.hhs.map(h => h.id), worlds: f.ws.length, hhWorlds: new Set(f.hhs.map(h => h.world.id)).size})));
  const sections = page.locator('#view section.block', {has: page.locator('.families')});
  await expect(sections).toHaveCount(n.families);
  for (const [i, f] of fams.entries()) {
    expect(f.worlds, 'a family across the worlds lives in two or more').toBeGreaterThanOrEqual(2);
    await expect(sections.nth(i).locator('.block-head .count')).toHaveText(`${f.hhs.length} household${f.hhs.length === 1 ? '' : 's'} in ${f.worlds} worlds`);
    expect(await sections.nth(i).locator('a.fam').evaluateAll(as => as.map(a => a.getAttribute('href').slice(1)))).toEqual(f.hhs);
  }

  await go(page, 'businesses');
  expect(await badge('businesses')).toBe(n.businesses);
  await expect(page.locator('#view a.listing')).toHaveCount(n.businesses);
  const biz = await page.evaluate(() => ownedBusinesses().map(l => ({id: l.id, hh: l.hh.id, ok: l.owned && !isRental(l) && l.world.owned})));
  for (const b of biz) {
    expect(b.ok, b.id).toBe(true);
    await go(page, b.id);
    await expect(page.locator(`#view a[href="#${b.hh}"]`).first(), `${b.id} names who runs it`).toBeAttached();
  }
});
