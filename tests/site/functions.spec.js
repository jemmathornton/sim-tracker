// The site's own workings, run inside the page: family words, the plan's counts, rental words, names and text helpers.
// Family words use a small made-up family added for the test (and taken out again), so they never depend on the data.
const { test } = require('@playwright/test');
const { openApp, expect } = require('./helpers');

test('family words are worked out from parents and partners', async ({ page }) => {
  await openApp(page);
  const r = await page.evaluate(() => {
    // Gran+Grandad → Mum, Uncle Ed; Mum+Dad → Kid, Sis; Uncle Ed+Aunt Ann (married in) → Cousin Cy; Kid's spouse Sam; Dad's mother Nan
    const T = {
      tgran: {sex: 'f'}, tgrandad: {sex: 'm'}, tnan: {sex: 'f'},
      tmum: {sex: 'f', parents: ['tgran', 'tgrandad'], partners: [['tdad', 'Spouse']]}, tdad: {sex: 'm', parents: ['tnan']},
      ted: {sex: 'm', parents: ['tgran', 'tgrandad'], partners: [['tann', 'Spouse']]}, tann: {sex: 'f'},
      tkid: {sex: 'm', parents: ['tmum', 'tdad'], partners: [['tsam', 'Spouse']]}, tsis: {sex: 'f', parents: ['tmum', 'tdad']},
      tcy: {sex: 'x', parents: ['ted', 'tann']}, tsam: {sex: 'f'}, tbaby: {sex: 'f', parents: ['tkid', 'tsam']},
      tex: {sex: 'm', partners: [['tsis', 'Ex-Spouse']]}, tlate: {sex: 'm', late: true, partners: [['tnan', 'Spouse']]},
    };
    Object.entries(T).forEach(([id, s]) => addSim(id, {name: id + ' Testfamily', world: worlds[0].id, ...s}));
    FAMILY_CACHE.partners.clear(); FAMILY_CACHE.ancestors.clear();
    const w = (a, b) => relWord(a, b);
    const out = {
      mother: w('tkid', 'tmum'), father: w('tkid', 'tdad'), sister: w('tkid', 'tsis'), brother: w('tsis', 'tkid'), son: w('tmum', 'tkid'), daughter: w('tmum', 'tsis'),
      grandmother: w('tkid', 'tgran'), grandson: w('tgrandad', 'tkid'), greatgran: w('tbaby', 'tgran'), greatgrandchild: w('tgran', 'tbaby'),
      uncle: w('tkid', 'ted'), niece: w('ted', 'tsis'), cousin: w('tkid', 'tcy'), parentsSibling: w('tcy', 'tmum'),
      spouse: w('tkid', 'tsam'), ex: w('tsis', 'tex'), motherInLaw: w('tsam', 'tmum'), daughterInLaw: w('tmum', 'tsam'), sisterInLaw: w('tsam', 'tsis'),
      deceasedSpouse: w('tnan', 'tlate'), auntByMarriage: w('tkid', 'tann'), stranger: w('tcy', 'tnan'), dadsMum: w('tkid', 'tnan'),
      familyOrder: familyOf('tkid').slice(0, 4).map(([, x]) => x),
    };
    Object.keys(T).forEach(id => delete SIMS[id]);
    FAMILY_CACHE.partners.clear(); FAMILY_CACHE.ancestors.clear();
    return out;
  });
  expect(r).toMatchObject({
    mother: 'Mother', father: 'Father', sister: 'Sister', brother: 'Brother', son: 'Son', daughter: 'Daughter',
    grandmother: 'Grandmother', grandson: 'Grandson', greatgran: 'Great-grandmother', greatgrandchild: 'Great-granddaughter',
    uncle: 'Uncle', niece: 'Niece', cousin: 'Cousin', parentsSibling: 'Aunt',
    spouse: 'Spouse', ex: 'Ex-Spouse', motherInLaw: 'Mother-in-law', daughterInLaw: 'Daughter-in-law', sisterInLaw: 'Sister-in-law',
    deceasedSpouse: 'Deceased spouse', auntByMarriage: null, stranger: null, dadsMum: 'Grandmother',
  });
  // closest first: spouse, then parents, then children
  expect(r.familyOrder).toEqual(['Spouse', 'Mother', 'Father', 'Daughter']);
});

test('family words on the real data: parents and children always agree', async ({ page }) => {
  await openApp(page);
  const bad = await page.evaluate(() => {
    const out = [], parentWords = ['Mother', 'Father', 'Parent'], childWords = ['Son', 'Daughter', 'Child'];
    Object.values(SIMS).forEach(s => (s.parents || []).filter(p => SIMS[p] && !SIMS[p].ph).forEach(p => {
      const up = relWord(s.id, p), down = relWord(p, s.id);
      if (!parentWords.includes(up) && !partnersOf(s.id).some(([x]) => x === p)) out.push(`${s.name} → ${SIMS[p].name}: ${up}`);
      if (!childWords.includes(down) && !partnersOf(s.id).some(([x]) => x === p)) out.push(`${SIMS[p].name} → ${s.name}: ${down}`);
    }));
    return out.slice(0, 20);
  });
  expect(bad).toEqual([]);
});

test('every world’s counts match its lots', async ({ page }) => {
  await openApp(page);
  const bad = await page.evaluate(() => worlds.flatMap(w => {
    const all = w.hoods.flatMap(h => h.lots), n = k => all.filter(l => l[k] === true).length, e = [];
    if (w.stats.lots !== all.length) e.push(`${w.name}: ${w.stats.lots} lots, really ${all.length}`);
    for (const k of ['built', 'shared', 'shots']) if (w.stats[k] !== n(k)) e.push(`${w.name}: ${k} ${w.stats[k]}, really ${n(k)}`);
    if (w.stats.hh !== homeHhs(w).length) e.push(`${w.name}: ${w.stats.hh} households, really ${homeHhs(w).length}`);
    if (w.stats.pBuilt < 0 || w.stats.pBuilt > 100) e.push(`${w.name}: built ${w.stats.pBuilt}%`);
    return e;
  }));
  expect(bad).toEqual([]);
});

test('every lot, household and Sim page is reachable, and everything points back the right way', async ({ page }) => {
  await openApp(page);
  const bad = await page.evaluate(() => {
    const e = [];
    Object.values(lotIndex).forEach(l => { if (lotIndex[l.id] !== l || !l.hood.lots.includes(l) || l.hood.world !== l.world) e.push('lot ' + l.id);
      if (l.hh && !l.hh.lots.includes(l)) e.push(`lot ${l.id}: household ${l.hh.id} doesn't list it`); });
    Object.values(hhIndex).forEach(h => { if (!h.lots.length) e.push('household with no lot ' + h.id);
      h.sims.forEach(s => { if (s.hh !== h) e.push(`Sim ${s.name} not pointing at ${h.id}`); if (s.sid && !SIMS[s.sid]) e.push(`Sim ${s.name} missing from SIMS`); }); });
    Object.entries(SIM_PAGES).forEach(([k, s]) => { if (!(s.hh || ANCHOR[s.id])) e.push(`Sim page ${k} has no household to sit under`); });
    return e.slice(0, 20);
  });
  expect(bad).toEqual([]);
});

test('rental words: units, labels and rooms', async ({ page }) => {
  await openApp(page);
  const r = await page.evaluate(() => {
    const fake = (type, extra = {}) => ({type, world: worlds[0], lot: 'Test', ...extra});
    return {
      count: [unitCount(fake('Residential Rental (4)')), unitCount(fake('Residential')), unitCount(fake('Vacation Rental (2)'))],
      labels: [unitLabel(fake('x'), 0), unitLabel(fake('x', {units: [{name: '3A'}]}), 0), unitLabel(fake('x', {units: [{name: 'The Loft Flat'}]}), 0)],
      rooms: [unitRooms(fake('x', {units: [{beds: 2, baths: 1}]}), 0), unitRooms(fake('x', {units: [{beds: 0}]}), 0), unitRooms(fake('x'), 0)],
      // every rental: its words add up to its units
      sums: Object.values(lotIndex).filter(l => unitCount(l)).map(l => { const u = rentalUnits(l); return u.length === unitCount(l) ? null : l.id; }).filter(Boolean),
    };
  });
  expect(r.count).toEqual([4, null, null]);
  expect(r.labels).toEqual(['Unit 1', 'Unit 3A', 'The Loft Flat']);
  expect(r.rooms).toEqual(['2 bed · 1 bath', '', '']);
  expect(r.sums).toEqual([]);
});

test('text helpers: curly apostrophes, safe HTML, slugs and household words', async ({ page }) => {
  await openApp(page);
  const r = await page.evaluate(() => ({
    curly: [curly("Crow's Crossing"), curly("'Round the Bend"), curly("rock 'n' roll"), curly("say 'hello'")],
    esc: esc('Tom & Jerry\'s "best" <b>'),
    slug: [slug('Admiral’s Wreckage'), slug('Café & Bar'), slug('  San Myshuno  ')],
    hh: [hhWord('Goth'), hhWord('Urbane Housesharers household'), theHh('Goth'), theHh('The Scotts')],
    aAn: [aAn('Elder'), aAn('Teen')],
  }));
  expect(r.curly).toEqual(['Crow’s Crossing', '’Round the Bend', 'rock ’n’ roll', 'say ‘hello’']);
  expect(r.esc).toBe('Tom &amp; Jerry’s “best” &lt;b&gt;');
  expect(r.slug).toEqual(['admiral-s-wreckage', 'cafe-and-bar', 'san-myshuno']);
  expect(r.hh).toEqual(['Goth household', 'Urbane Housesharers household', 'the Goth household', 'The Scotts household']);
  expect(r.aAn).toEqual(['an', 'a']);
});

test('“new since you looked”: a lot is new until opened, then again only when favourites or comments go up', async ({ page }) => {
  await openApp(page);
  const r = await page.evaluate(() => {
    const l = Object.values(lotIndex).find(l => l.world.owned && l.world.ready && l.gallery);
    const was = seen[l.id]; delete seen[l.id];
    const before = !!newSince(l); markSeen(l); const after = newSince(l);
    seen[l.id] = [l.gallery.likes - 2, theirs(l).length]; const more = newSince(l);
    if (was === undefined) delete seen[l.id]; else seen[l.id] = was; saveSeen();
    return {before, after, more: more && newTxt(more)};
  });
  expect(r.before).toBe(true);
  expect(r.after).toBeFalsy();
  expect(r.more).toBe('2 new favourites');
});

test('the calendar: every holiday and event sits in a real season, week and day', async ({ page }) => {
  await openApp(page);
  const bad = await page.evaluate(() => {
    const e = [];
    [...(CAL.gameHolidays || []), ...CAL.holidays].forEach(h => { if (!CAL_SEASONS.includes(h.season) || !(h.week >= 1 && h.week <= CAL.seasonWeeks) || !CAL_DAYS.includes(h.day)) e.push('holiday ' + h.name); });
    calEvents().forEach(ev => { if (!CAL_KINDS[calKind(ev)]) e.push(`event ${ev.name}: kind ${ev.kind}`); if (calWeeks(ev).some(n => n < 1 || n > CAL.seasonWeeks)) e.push(`event ${ev.name}: weeks`); });
    return e.slice(0, 20);
  });
  expect(bad).toEqual([]);
});
