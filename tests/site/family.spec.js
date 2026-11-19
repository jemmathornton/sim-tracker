// Family words both ways (19 Nov): if the site calls A someone's aunt, it calls them A's niece or nephew; on every Sim on the
// site (worked out from data.js, so it never goes stale), and on small made-up families for the in-law cases.
const { test } = require('@playwright/test');
const { openApp, expect } = require('./helpers');

// what A's word for B allows as B's word for A (the site's own words, relWord in app.js)
const INVERSE = {
  Mother: 'Son Daughter Child', Father: 'Son Daughter Child', Parent: 'Son Daughter Child',
  Son: 'Mother Father Parent', Daughter: 'Mother Father Parent', Child: 'Mother Father Parent',
  Grandmother: 'Grandson Granddaughter Grandchild', Grandfather: 'Grandson Granddaughter Grandchild', Grandparent: 'Grandson Granddaughter Grandchild',
  Grandson: 'Grandmother Grandfather Grandparent', Granddaughter: 'Grandmother Grandfather Grandparent', Grandchild: 'Grandmother Grandfather Grandparent',
  'Great-grandmother': 'Great-grandson Great-granddaughter Great-grandchild', 'Great-grandfather': 'Great-grandson Great-granddaughter Great-grandchild', 'Great-grandparent': 'Great-grandson Great-granddaughter Great-grandchild',
  'Great-grandson': 'Great-grandmother Great-grandfather Great-grandparent', 'Great-granddaughter': 'Great-grandmother Great-grandfather Great-grandparent', 'Great-grandchild': 'Great-grandmother Great-grandfather Great-grandparent',
  Ancestor: 'Descendant', Descendant: 'Ancestor',
  Brother: 'Brother Sister Sibling', Sister: 'Brother Sister Sibling', Sibling: 'Brother Sister Sibling',
  Uncle: 'Nephew Niece Sibling’s_child', Aunt: 'Nephew Niece Sibling’s_child', 'Parent’s sibling': 'Nephew Niece Sibling’s_child',
  Nephew: 'Uncle Aunt Parent’s_sibling', Niece: 'Uncle Aunt Parent’s_sibling', 'Sibling’s child': 'Uncle Aunt Parent’s_sibling',
  'Great-uncle': 'Great-nephew Great-niece Sibling’s_grandchild', 'Great-aunt': 'Great-nephew Great-niece Sibling’s_grandchild', 'Grandparent’s sibling': 'Great-nephew Great-niece Sibling’s_grandchild',
  'Great-nephew': 'Great-uncle Great-aunt Grandparent’s_sibling', 'Great-niece': 'Great-uncle Great-aunt Grandparent’s_sibling', 'Sibling’s grandchild': 'Great-uncle Great-aunt Grandparent’s_sibling',
  Cousin: 'Cousin', Relative: 'Relative',
  Spouse: 'Spouse Deceased_spouse Widow Widower', 'Deceased spouse': 'Spouse Widow Widower', Widow: 'Deceased_spouse Spouse', Widower: 'Deceased_spouse Spouse',
  Engaged: 'Engaged', Partner: 'Partner', 'Ex-Spouse': 'Ex-Spouse',
  'Mother-in-law': 'Son-in-law Daughter-in-law Child-in-law', 'Father-in-law': 'Son-in-law Daughter-in-law Child-in-law', 'Parent-in-law': 'Son-in-law Daughter-in-law Child-in-law',
  'Son-in-law': 'Mother-in-law Father-in-law Parent-in-law', 'Daughter-in-law': 'Mother-in-law Father-in-law Parent-in-law', 'Child-in-law': 'Mother-in-law Father-in-law Parent-in-law',
  'Brother-in-law': 'Brother-in-law Sister-in-law Sibling-in-law', 'Sister-in-law': 'Brother-in-law Sister-in-law Sibling-in-law', 'Sibling-in-law': 'Brother-in-law Sister-in-law Sibling-in-law',
};
const INV = Object.fromEntries(Object.entries(INVERSE).map(([k, v]) => [k, v.split(' ').map(x => x.replace(/_/g, ' '))]));

// every pair of Sims joined within six steps of parents and partners, with both words
const PAIRS = () => {
  const ids = Object.keys(SIMS).filter(id => !SIMS[id].ph), nb = {};
  const link = (a, b) => { (nb[a] ||= new Set()).add(b); (nb[b] ||= new Set()).add(a); };
  ids.forEach(id => { (SIMS[id].parents || []).forEach(p => SIMS[p] && link(id, p)); partnersOf(id).forEach(([p]) => SIMS[p] && link(id, p)); });
  const out = [];
  ids.forEach(a => { const seen = new Set([a]); let fr = [a];
    for (let d = 0; d < 6; d++) { const nx = []; fr.forEach(x => (nb[x] || []).forEach(y => { if (!seen.has(y)) { seen.add(y); nx.push(y); } })); fr = nx; }
    seen.forEach(b => { if (b === a || SIMS[b].ph) return; const w = relWord(a, b); if (w) out.push([SIMS[a].name, SIMS[b].name, w, relWord(b, a)]); }); });
  return out;
};

const check = (pairs, inLaws) => pairs.filter(([, , w]) => /-in-law$/.test(w) === inLaws)
  .filter(([, , w, back]) => !INV[w] || !INV[w].includes(back)).map(([a, b, w, back]) => `${b} is ${a}’s ${w}, but ${a} is ${b}’s ${back}`);

test('family words agree both ways for every Sim: parents, grandparents, siblings, aunts, cousins and partners', async ({ page }) => {
  await openApp(page);
  const pairs = await page.evaluate(PAIRS);
  expect(pairs.length).toBeGreaterThan(100);
  expect(pairs.filter(([, , w]) => !INV[w]).map(p => p[2]), 'family words the test doesn’t know').toEqual([]);
  expect(check(pairs, false).slice(0, 20)).toEqual([]);
  // and a Sim's family list on their page holds exactly the Sims that have a word
  const bad = await page.evaluate(() => Object.keys(SIM_PAGES).slice(0, 400).map(k => k.slice(2)).flatMap(id => {
    const fam = familyOf(id), ids = new Set(fam.map(([o]) => o));
    return fam.filter(([o, w]) => relWord(id, o) !== w).map(([o]) => `${id} → ${o}`).concat(ids.has(id) ? [`${id} is in their own family`] : []);
  }));
  expect(bad).toEqual([]);
});

// fixed 19 Nov: relWord in app.js gave a sibling’s spouse no word (one way only), and a late spouse’s parents-in-law no word for them, because
// partners are read with the kind each Sim's own record gives ("Late Spouse" on one side, "Spouse" on the other)
test('in-law words agree both ways for every Sim', async ({ page }) => {
  await openApp(page);
  const pairs = await page.evaluate(PAIRS);
  expect(check(pairs, true).slice(0, 20)).toEqual([]);
});

test('in-laws both ways on a made-up family: a brother’s wife, and a late wife’s mother-in-law', async ({ page }) => {
  await openApp(page);
  const r = await page.evaluate(() => {
    const T = {xmum: {sex: 'f'}, xkid: {sex: 'm', parents: ['xmum'], partners: [['xwife', 'Late Spouse']]}, xsis: {sex: 'f', parents: ['xmum']},
      xwife: {sex: 'f', late: true, partners: [['xkid', 'Spouse']]}};
    Object.entries(T).forEach(([id, s]) => addSim(id, {name: id + ' Testfamily', world: worlds[0].id, ...s}));
    FAMILY_CACHE.partners.clear(); FAMILY_CACHE.ancestors.clear();
    const out = {wifeToSis: relWord('xwife', 'xsis'), sisToWife: relWord('xsis', 'xwife'), wifeToMum: relWord('xwife', 'xmum'), mumToWife: relWord('xmum', 'xwife')};
    Object.keys(T).forEach(id => delete SIMS[id]);
    FAMILY_CACHE.partners.clear(); FAMILY_CACHE.ancestors.clear();
    return out;
  });
  expect(r.wifeToSis).toBe('Sister-in-law');
  expect(r.wifeToMum).toBe('Mother-in-law');
  expect(r.sisToWife).toBe('Sister-in-law');
  expect(r.mumToWife).toBe('Daughter-in-law');
});
