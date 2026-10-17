// Jemma's Sim World: the page code. Everything is drawn from DATA (js/data.js, built by tools/build.py).
const FAMILY_LINKS = DATA.familyLinks;
const TENANTS = DATA.tenants;
const NO_LANDLORD = new Set(DATA.noLandlord || []);
const NAME_FIX = DATA.nameFix;
const ic = n => ICONS[n].replace("<svg ", '<svg class="i" aria-hidden="true" ');
// shown text uses curly apostrophes and single quotes (12 Oct); ids and links are untouched
const curly = s => String(s ?? "").replace(/(^|[\s(\[“"—-])'/g, "$1‘").replace(/'/g, "’");
const esc = s => curly(s).replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const slug = s => String(s).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/&/g,"and").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
// neighbourhood colours: muted jewel tones
const HOOD_COLORS = ["#B4573E","#6A5A9E","#2F6E9C","#B98A2E","#3C8459","#AE5578","#2B8A86","#8C7A3A"];

const worlds = DATA.worlds, lotIndex = {}, hhIndex = {}, hoodIndex = {};
// a household's own extras from the data: its picture (a screenshot in shots/), origin (Premade or Mine), played, Neighbourhood Stories
const hhMore = x => ({portrait: x.portrait, origin: x.origin, played: x.played, stories: x.stories, single: x.single});
worlds.forEach(w => {
  w.id = slug(w.name); w.households = {};
  // a surname on more than one home = related but separate households: "Davidson 1", "Davidson 2"
  const base = n => n.replace(/\?$/,"").replace(/\s+own$/i,"").trim(), seen = {}, total = {}; // "Robles own" = the Robles family owns this rental
  // only homes count towards numbering: a family's restaurant or shop belongs to the same household
  const isHome = l => l.sims !== "N/A" && !/\sown\??$/i.test(l.who || ""), biz = [];
  w.hoods.forEach(h => h.lots.forEach(l => { if (l.who && isHome(l)) total[base(l.who)] = (total[base(l.who)] || 0) + 1; }));
  w.hoods.forEach((h, i) => { h.id = w.id + "-" + slug(h.name); h.world = w; hoodIndex[h.id] = h; h.color = h.color || HOOD_COLORS[i % HOOD_COLORS.length]; h.glow = w.glow;
    h.lots.forEach(l => {
      l.world = w; l.hood = h; l.id = "l-" + w.id + "--" + slug(l.lot); lotIndex[l.id] = l;
      // your own name for a lot comes first; the in-game name is kept as a subtitle
      // name shown: what Jemma called it on the Gallery, else her own name, else the in-game name
      const mine = l.mine && l.mine.trim() && !/^\?+$/.test(l.mine.trim()) ? l.mine.trim() : null; // a bare "?" means not named yet
      const own = (l.gallery && l.gallery.title) || mine || l.lot;
      // spelling fixes Jemma chose (12 Oct) win over the Gallery title
      l.name = NAME_FIX[w.name + "|" + l.lot] || own; l.ea = l.name !== l.lot ? l.lot : null;
      l.photos = l.photos || [];
      // bracketed bits in the lot type were planning comments; the type itself is what's outside them
      // bracketed planning comments are dropped, but rental unit counts like "(4)" are kept
      if (l.type) l.type = l.type.replace(/\s*\((?!\d+\??\))[^)]*\)?/g, "").trim();
      if (!l.type) { l.type = "To be decided"; l.tbd = true; } if (l.photos.length) l.shots = true;
      if (l.who && !isHome(l) && total[base(l.who)]) biz.push(l);
      else if (l.who && !isHome(l) && !/rent|tenant/i.test(l.who)) { // a family business with no family home in this world: its own household, shown as "Owned by"
        const b = base(l.who), k = slug(b), extra = (DATA.households[w.name] || {})[b] || {};
        const hh = w.households[k] ||= {name: b, family: b, unsure: /\?/.test(l.who), lots: [], world: w, id: "h-" + w.id + "--" + k, sims: extra.sims || [], links: (extra.links || []).slice(), source: extra.source, ...hhMore(extra)};
        hh.lots.push(l); hhIndex[hh.id] = hh; l.hh = hh; l.owned = true; }
      else if (l.who) {
        const b = base(l.who); seen[b] = (seen[b] || 0) + 1;
        const name = total[b] > 1 ? `${b} ${seen[b]}` : b, k = slug(name);
        const extra = (DATA.households[w.name] || {})[name] || {};
        const hh = w.households[k] ||= {name, family:b, unsure:/\?/.test(l.who), lots:[], world:w, id:"h-"+w.id+"--"+k, sims: extra.sims || [], links: (extra.links || []).slice(), source: extra.source, ...hhMore(extra)};
        hh.lots.push(l); hhIndex[hh.id] = hh; l.hh = hh;
      }
    }); });
  // a family business joins the family's household (their first home), marked as owned rather than lived in
  biz.forEach(l => { const b = base(l.who), hh = Object.values(w.households).find(x => x.family === b); if (hh) { hh.lots.push(l); l.hh = hh; l.owned = true; } });
  // tenants renting a unit (13 Oct): their own household, living on the owners' lot
  w.hoods.forEach(h => h.lots.forEach(l => (TENANTS[w.name + "|" + l.lot] || []).forEach(t => { const k = slug(t.name);
    const extra = (DATA.households[w.name] || {})[t.name] || {};
    const hh = w.households[k] ||= {name: t.name, family: t.name, unsure: false, lots: [], world: w, id: "h-" + w.id + "--" + k, sims: extra.sims || [], links: [], source: extra.source, ...hhMore(extra), note: t.note, tenantOf: l};
    hh.lots.push(l); hhIndex[hh.id] = hh; (l.tenants ||= []).push(hh); })));
  // related households Jemma confirmed (12 Oct)
  (FAMILY_LINKS[w.name] || []).forEach(([a, b]) => { const A = Object.values(w.households).find(x => x.name === a), B = Object.values(w.households).find(x => x.name === b);
    if (A && B) { if (!A.links.some(x => x.to === b)) A.links.push({to: b, type: "Family", note: "Related households"}); if (!B.links.some(x => x.to === a)) B.links.push({to: a, type: "Family", note: "Related households"}); } });
  // households sharing a surname are linked as family automatically
  const hhs = Object.values(w.households);
  hhs.forEach(a => hhs.forEach(b => { if (a !== b && a.family === b.family && !a.links.some(x => x.to === b.name)) a.links.push({to: b.name, type: "Family", note: "Same family, separate homes"}); }));
  hhs.forEach(a => a.links.forEach(x => x.hh = hhs.find(b => b.name === x.to)));
  const all = w.hoods.flatMap(h => h.lots);
  const known = k => all.filter(l => l[k] === true || l[k] === false);
  const cnt = k => all.filter(l => l[k] === true).length;
  const pct = k => known(k).length ? Math.round(100 * cnt(k) / known(k).length) : 0;
  w.stats = {lots: all.length, built: cnt("built"), shared: cnt("shared"), shots: cnt("shots"), sims: cnt("sims"), simsOf: known("sims").length,
    pBuilt: pct("built"), pShared: pct("shared"), pShots: pct("shots"), hh: Object.keys(w.households).length};
  // Sims made is counted per household (from the spreadsheet's Sims Made column on their home)
  w.stats.hhMade = Object.values(w.households).filter(x => x.lots.some(l => l.sims === true)).length;
  w.stats.pHH = w.stats.hh ? Math.round(100 * w.stats.hhMade / w.stats.hh) : 0;
});
// every Sim, by full name, so relationships can link across households
// apartment buildings: units of one building grouped together (trial: Culpepper House only)
// apartment buildings: apartments sharing a building name (minus their unit number) in the same neighbourhood are grouped
const bldIndex = {};
worlds.forEach(w => w.hoods.forEach(h => { const groups = {};
  h.lots.filter(l => /apartment|penthouse/i.test(l.type || "")).forEach(l => {
    const r = l.lot.match(/^\s*([IVXL]+)\s+(.+?)\s*$/); // Roman-numbered units, e.g. VIII / IX Landgraab Apartments
    const m = r ? [null, r[1], r[2]] : l.lot.match(/^\s*(\d+[A-Z]?)\s+(.+?)\s*$/i) || l.lot.match(/^\s*(.+?)\s*#\s*(\d+)\s*$/);
    if (!m) return; const [unit, name] = (r || /^\d/.test(m[1])) ? [m[1], m[2]] : [m[2], m[1]];
    (groups[name.toLowerCase()] ||= {names: [], units: []}).units.push([l, unit]); groups[name.toLowerCase()].names.push(name); });
  Object.values(groups).filter(g => g.units.length > 1).forEach(g => {
    const name = g.names.find(n => /^[^a-z]*(\b[A-Z0-9][^ ]*\s*)+$/.test(n)) || g.names[0];
    const b = {name, world: w, hood: h, units: g.units.map(([l]) => l), id: "b-" + w.id + "--" + slug(name)};
    g.units.forEach(([l, unit]) => { l.building = b; l.unit = unit; }); bldIndex[b.id] = b; });
}));
const simIndex = {};
worlds.forEach(w => Object.values(w.households).forEach(hh => hh.sims.forEach(sm => { if (sm.id && !sm.sid && !String(sm.id).startsWith("h-")) sm.sid = sm.id; sm.hh = hh; sm.id = hh.id + "--" + slug(sm.name); simIndex[sm.name] = sm; })));
// ---------- Sims with their own pages (her decision, 17 Oct; trying it on the Goths, Landgraabs, Zest and Roomies first) ----------
// The design is the prototype she reviewed (for-jemma/prototypes/sims/, 17 Oct), ported here. The prototype's own names start
// with p or P_ because its pages load this file too, so nothing here may take one of those names.
// SIMS holds every Sim with a save-wide "id": household Sims, plus Sims with no household on the site (data/people.json: late
// relatives, townies, and placeholders for parents who aren't on the game's family tree). Family words are worked out from
// "parents" and "partners"; nothing else about family is typed. line = the family a Sim was born into ("born", else the surname),
// into = the family they married into. Household Sims get a page (#s-<id>); so does anyone else on a household's family tree.
const PARTNER_KINDS = {"Spouse": "spouse", "Partner": "partner", "Engaged": "engaged", "Ex-Spouse": "ex", "Late Spouse": "late-spouse", "Deceased Spouse": "late-spouse"};
const SIMS = {}, SIM_PAGES = {}, GROUP_PAGES = {}, FAMILIES = {}, ANCHOR = {};
const sx = (s, m, f, x) => s === "m" ? m : s === "f" ? f : x;
const surname = n => n.trim().split(/\s+/).slice(1).join(" ") || n.trim();
const firstName = s => s.name.trim().split(/\s+/)[0];
const aAn = n => /^[aeiou]/i.test(n) ? "an" : "a";
function addSim(id, s, hh){
  const sur = surname(s.name), born = s.born || sur, line = slug(born), into = s.born && slug(s.born) !== slug(sur) ? slug(sur) : null;
  FAMILIES[line] ||= {name: born}; if (into) FAMILIES[into] ||= {name: sur};
  SIMS[id] = {...s, id, src: s, hh: hh || null, world: hh ? hh.world : worlds.find(w => w.id === s.world) || null, home: s.where, line, into,
    ph: !!s.placeholder, phText: s.placeholder ? sx(s.sex, "Father", "Mother", "Parent") + " unknown" : "",
    partners: (s.partners || []).map(([p, k]) => [p, PARTNER_KINDS[k] || "unknown"])};
}
worlds.forEach(w => Object.values(w.households).forEach(hh => hh.sims.forEach(sm => { if (sm.sid) addSim(sm.sid, sm, hh); })));
Object.entries(DATA.people || {}).forEach(([id, p]) => addSim(id, p));
// a parent who isn't on the family tree stands beside the other parent, joined by a faint dotted line
Object.values(SIMS).forEach(s => { const pp = (s.parents || []).filter(p => SIMS[p]);
  pp.filter(p => SIMS[p].ph).forEach(ph => pp.filter(q => !SIMS[q].ph).forEach(q => { if (!partnersOf(q).some(([x]) => x === ph)) SIMS[q].partners.push([ph, "unknown"]); })); });
// a family nobody on the site was born into and stayed in (Bella was born a Bachelor)
Object.keys(FAMILIES).forEach(f => { const own = Object.values(SIMS).filter(s => !s.ph && s.line === f); if (own.length && own.every(s => s.into)) FAMILIES[f].note = `No ${FAMILIES[f].name}s on the family tree`; });

/* relationship tags (the prototype's six groups); romance words are the game's (Spouse, Engaged, Partner): her decision, 17 Oct */
const TAG_GROUPS = {
  family:   {name: "Family",        icon: "network"},
  romance:  {name: "Romance",       icon: "heart"},
  friends:  {name: "Friends",       icon: "smile"},
  conflict: {name: "Conflict",      icon: "swords"},
  work:     {name: "Work & school", icon: "briefcase"},
  dynasty:  {name: "Dynasty",       icon: "crown"},
};
const TAGS = {
  family: {g: "family", name: "Family"}, spouse: {g: "romance", name: "Spouse"}, engaged: {g: "romance", name: "Engaged"}, partner: {g: "romance", name: "Partner"},
  ex: {g: "romance", name: "Ex"}, "late-spouse": {g: "romance", name: "Deceased Spouse"}, crush: {g: "romance", name: "Crush"},
  bff: {g: "friends", name: "Best Friends"}, "good-friends": {g: "friends", name: "Good Friends"}, friends: {g: "friends", name: "Friends"}, acquaintance: {g: "friends", name: "Acquaintances"},
  rivals: {g: "conflict", name: "Rivals"}, enemies: {g: "conflict", name: "Enemies"},
  coworkers: {g: "work", name: "Coworkers"}, classmates: {g: "work", name: "Classmates"}, boss: {g: "work", name: "Boss"}, landlord: {g: "work", name: "Landlord / Tenant"},
  ally: {g: "dynasty", name: "Dynasty Ally"}, "dyn-rival": {g: "dynasty", name: "Dynasty Rival"}, outcast: {g: "dynasty", name: "Outcast"},
};
const tagPill = (t, cls = "") => `<span class="tg ${TAGS[t].g} ${cls}">${ic(TAG_GROUPS[TAGS[t].g].icon)}${esc(TAGS[t].name)}</span>`;
// each Sim's "rels" (from the game) as pairs between Sims, stored once; family and partner words are left out (they're worked out)
const REL_TAGS = [[/best friend/i, "bff"], [/good friend/i, "good-friends"], [/friend/i, "friends"], [/acquaint/i, "acquaintance"], [/crush/i, "crush"],
  [/rival/i, "rivals"], [/enem|nemesis|disliked/i, "enemies"], [/co-?worker|colleague/i, "coworkers"], [/classmate/i, "classmates"], [/boss/i, "boss"], [/landlord|tenant/i, "landlord"]];
const KIN_WORD = /^(mother|father|parent|son|daughter|child|brother|sister|sibling|spouse|husband|wife|partner|engaged|fianc|ex\b|ex-|late spouse|grand|great|aunt|uncle|niece|nephew|cousin|step|half)|-in-law$/i;
const SIM_BY_NAME = {}, REL_PAIRS = [];
Object.values(SIMS).forEach(s => { if (!s.ph) SIM_BY_NAME[s.name] ||= s.id; });
Object.values(SIMS).forEach(s => (s.rels || []).forEach(([name, label]) => {
  if (KIN_WORD.test(label)) return;
  let o = SIM_BY_NAME[name];
  if (!o) { o = "x-" + slug(name); SIMS[o] ||= {id: o, name, sex: "x", stub: true, partners: []}; SIM_BY_NAME[name] = o; }   // a Sim not on the site
  const tag = (REL_TAGS.find(([re]) => re.test(label)) || [])[1] || null, word = tag ? TAGS[tag].name : label;
  if (!REL_PAIRS.some(r => r.word === word && [r.a, r.b].includes(s.id) && [r.a, r.b].includes(o))) REL_PAIRS.push({a: s.id, b: o, tag, g: tag ? TAGS[tag].g : "friends", word});
}));

/* groups: dynasties, clubs, university organisations (her decision, 17 Oct). One page each; a Sim is in at most one dynasty.
   Members come from each Sim's "dynasty"; the group's own details from data/groups.json. Based where its head lives. */
const GROUP_KINDS = {
  dynasty: {name: "Dynasty", icon: "crown", roles: {head: "Head", heir: "Heir", member: "Member", outcast: "Outcast"}},
  club:    {name: "Club", icon: "flag", roles: {leader: "Leader", member: "Member"}},
  org:     {name: "University organisation", icon: "graduation-cap", roles: {member: "Member"}},
};
Object.values(SIMS).forEach(s => { const d = s.dynasty; if (!d || !d.name) return; const id = "g-dynasty-" + slug(d.name);
  (GROUP_PAGES[id] ||= {...(((DATA.groups || {}).dynasties || {})[d.name] || {}), kind: "dynasty", name: d.name, id, members: []}).members.push([s.id, d.role || "member"]); });
Object.values(GROUP_PAGES).forEach(g => { const head = SIMS[(g.members.find(([, r]) => r === "head") || g.members[0])[0]]; g.homeHh = head.hh; g.world = head.hh ? head.hh.world : head.world; });
const groupTitle = g => g.kind === "dynasty" ? `${g.name} dynasty` : g.name;
const groupsOf = id => Object.values(GROUP_PAGES).filter(g => g.members.some(([m]) => m === id)).map(g => [g.id, g, g.members.find(([m]) => m === id)[1]]);
const dynastyOf = id => groupsOf(id).find(([, g]) => g.kind === "dynasty");
// is this member based where the group is?
function atHome(g, id){ const s = SIMS[id]; return g.homeHh ? s.hh === g.homeHh : (s.hh ? s.hh.world : s.world) === g.world; }
// a member as a small box, like the tree's cards: based here = highlighted; elsewhere = lighter, with a chip for where they live
function memberCard(g, id, role){
  const s = SIMS[id], dyn = g.kind === "dynasty", here = dyn || atHome(g, id), href = simLinkTo(id), R = GROUP_KINDS[g.kind].roles[role] || role, crown = ["head", "heir", "leader"].includes(role);
  return `<div class="mcard ${here ? "here" : "away"} ${s.late ? "late" : ""}" style="--w:${simColour(id)}"><span class="tm">${initial(s.name)}</span>
    <div class="tn">${href ? `<a href="${href}">${esc(s.name)}</a>` : esc(s.name)}</div><div class="ts">${esc([s.age, s.state].filter(Boolean).join(" · "))}</div>
    <div class="tchip">${here && !dyn ? "" : homeChip(s)}</div><span class="badge ${role === "outcast" ? "out" : role === "member" ? "plain" : ""}">${crown ? ic(g.kind === "club" ? "flag" : "crown") : ""}${esc(R)}</span></div>`;
}

/* ---------- family words, worked out (never typed) ---------- */
function partnersOf(id){
  const out = (SIMS[id].partners || []).filter(([p]) => SIMS[p]);
  Object.values(SIMS).forEach(t => (t.partners || []).forEach(([p, k]) => { if (p === id && !out.some(x => x[0] === t.id)) out.push([t.id, k]); }));
  return out;
}
function ancestors(id, d = 0, out = new Map()){
  if (!out.has(id) || out.get(id) > d) out.set(id, d);
  (SIMS[id].parents || []).forEach(p => { if (SIMS[p] && !SIMS[p].ph) ancestors(p, d + 1, out); });
  return out;
}
function blood(a, b){
  const A = ancestors(a), B = ancestors(b); let best = null;
  A.forEach((da, x) => { if (B.has(x)) { const db = B.get(x); if (!best || da + db < best[0] + best[1]) best = [da, db]; } });
  return best;
}
const partnerWord = kind => !TAGS[kind] ? "Partner" : kind === "ex" ? "Ex-Spouse" : TAGS[kind].name;
function relWord(a, b){   // what b is to a
  const s = SIMS[b].sex, p = partnersOf(a).find(x => x[0] === b);
  if (p) return partnerWord(p[1]);
  const r = blood(a, b);
  if (r) {
    const [da, db] = r;
    if (da === 0) return [null, sx(s, "Son", "Daughter", "Child"), sx(s, "Grandson", "Granddaughter", "Grandchild"), sx(s, "Great-grandson", "Great-granddaughter", "Great-grandchild")][db] || "Descendant";
    if (db === 0) return [null, sx(s, "Father", "Mother", "Parent"), sx(s, "Grandfather", "Grandmother", "Grandparent"), sx(s, "Great-grandfather", "Great-grandmother", "Great-grandparent")][da] || "Ancestor";
    if (da === 1 && db === 1) return sx(s, "Brother", "Sister", "Sibling");
    if (da === 2 && db === 1) return sx(s, "Uncle", "Aunt", "Parent’s sibling");
    if (da === 3 && db === 1) return sx(s, "Great-uncle", "Great-aunt", "Grandparent’s sibling");
    if (da === 1 && db === 2) return sx(s, "Nephew", "Niece", "Sibling’s child");
    if (da === 2 && db === 2) return "Cousin";
    return "Relative";
  }
  for (const [q, k] of partnersOf(a)) {   // in-laws
    if (k !== "spouse") continue;
    const r2 = blood(q, b);
    if (r2 && r2[1] === 0 && r2[0] === 1) return sx(s, "Father-in-law", "Mother-in-law", "Parent-in-law");
    if (r2 && r2[0] === 1 && r2[1] === 1) return sx(s, "Brother-in-law", "Sister-in-law", "Sibling-in-law");
  }
  for (const c of Object.keys(SIMS)) {   // a child's spouse
    const r3 = blood(a, c);
    if (r3 && r3[0] === 0 && r3[1] === 1 && partnersOf(c).some(([q, k]) => q === b && k === "spouse")) return sx(s, "Son-in-law", "Daughter-in-law", "Child-in-law");
  }
  return null;
}
// a Sim's family, closest first (partners, parents, children, siblings, then the rest)
const FAMILY_ORDER = ["Spouse", "Engaged", "Partner", "Ex-Spouse", "Deceased Spouse", "Mother", "Father", "Parent", "Daughter", "Son", "Child", "Sister", "Brother", "Sibling",
  "Grandmother", "Grandfather", "Grandparent", "Granddaughter", "Grandson", "Grandchild", "Great-grandmother", "Great-grandfather", "Great-grandparent",
  "Aunt", "Uncle", "Great-aunt", "Great-uncle", "Niece", "Nephew", "Cousin", "Mother-in-law", "Father-in-law", "Daughter-in-law", "Son-in-law", "Sister-in-law", "Brother-in-law"];
function familyOf(id){
  const s = SIMS[id], rank = w => { const i = FAMILY_ORDER.indexOf(w); return i < 0 ? 99 : i; };
  const band = o => SIMS[o].hh && SIMS[o].hh === s.hh ? 0 : SIMS[o].late ? 2 : 1;   // household, living elsewhere, late
  return Object.keys(SIMS).filter(o => o !== id && !SIMS[o].ph).map(o => [o, relWord(id, o)]).filter(([, w]) => w)
    .sort((x, y) => rank(x[1]) - rank(y[1]) || band(x[0]) - band(y[0]));
}
const membersOf = hh => Object.keys(SIMS).filter(id => SIMS[id].hh === hh);
// where a Sim lives, as a chip in the world's colour
function homeChip(s){
  const hh = s.hh, w = s.world;
  if (hh) return `<a class="hhchip" href="#${hh.id}" style="--w:${wColour(hh.world)}">${esc(hh.name)} · ${esc(hh.world.name)}</a>`;
  if (w) return `<span class="hhchip" style="--w:${wColour(w)}" title="${esc(s.home || w.name + (w.owned ? "" : " (not owned)"))}">${s.hhName ? esc(s.hhName) + " · " : ""}${esc(w.name)}</span>`;
  return "";
}
const wColour = w => w ? (w.glow || w.color) : "#8A918C";
// where another Sim's link goes: their Sim page, else their household, else nowhere
const simLinkTo = o => SIM_PAGES["s-" + o] ? "#s-" + o : SIMS[o].hh ? "#" + SIMS[o].hh.id : "";
function simWhere(o){
  const t = SIMS[o]; if (t.late) return "deceased";
  if (t.hh) return `${t.hh.name} household · ${t.hh.world.name}`;
  const w = t.world; return w ? `${t.hhName ? t.hhName + " · " : ""}${w.name}${w.owned ? "" : " (not owned)"}${t.noHome ? " · no home" : ""}` : "";
}
const simColour = o => { const t = SIMS[o]; return t.late ? "#A3AAA5" : wColour(t.hh ? t.hh.world : t.world); };
// origin (her words, 17 Oct): "Premade" for the game's Sims and households (even when she changes them), "Mine" for hers and children born in her game
const originTag = o => { const mine = /^mine$/i.test(o || ""); return `<span class="otag ${mine ? "mine" : ""}">${mine ? "Mine" : "Premade"}</span>`; };

/* ---------- a household's family tree (her rules, 17 Oct) ----------
   Centred on the Sims who live there; built from family links only (parents and partners), never from who lives together.
   Everyone in the household, all their blood relatives wherever they live, and those relatives' partners ("plus ones").
   Worlds don't matter. A Sim with no family anywhere isn't drawn; a household where nobody has family gets no tree at all. */
// a tree centred on some Sims: a household's (treeOf) or one Sim's own (on their page, 17 Oct)
const treeOf = hh => treeAround(membersOf(hh));
function treeAround(centre){
  const all = Object.keys(SIMS), set = new Set();
  centre.forEach(m => all.forEach(o => { if (!SIMS[o].ph && blood(m, o)) set.add(o); }));   // blood(m, m) counts: members are in
  [...set].forEach(id => partnersOf(id).forEach(([p]) => set.add(p)));                               // plus ones (and placeholders like Mortimer's father)
  [...set].forEach(id => (SIMS[id].parents || []).forEach(p => { if (SIMS[p] && SIMS[p].ph) set.add(p); }));
  const famLinked = (a, b) => (SIMS[a].parents || []).includes(b) || (SIMS[b].parents || []).includes(a) || partnersOf(a).some(([p]) => p === b);
  const ids = [...set].filter(a => [...set].some(b => b !== a && famLinked(a, b)));
  return ids.length > 1 ? ids.sort((a, b) => all.indexOf(a) - all.indexOf(b)) : [];
}
// Sim pages: every household Sim, and anyone else on a household's tree (Cornelia, Agnes…), who belongs to the first such household
Object.values(SIMS).forEach(s => { if (s.hh) SIM_PAGES["s-" + s.id] = s; });
worlds.forEach(w => Object.values(w.households).forEach(hh => { if (hh.sims.some(sm => sm.sid)) treeOf(hh).forEach(id => { ANCHOR[id] ||= hh; }); }));
Object.values(SIMS).forEach(s => { if (!s.hh && !s.ph && !s.stub && ANCHOR[s.id]) SIM_PAGES["s-" + s.id] = s; });

/* ---------- the drawn family tree (decided 17 Oct) ----------
   Founders at the top, one row per generation, couples side by side (double line = spouses, dashed = partners, broken = ex,
   faint = late spouse), children hang below. Cards: monogram, name, life stage, where they live.
   o: {line (the household's family), here (the household: its Sims highlighted), compact, cw, ch, labels (generation labels)} */
function drawTree(ids, o = {}){
  const C = o.compact, CW = o.cw || (C ? 136 : 188), CH = o.ch || (C ? 112 : 128), CG = C ? 28 : 38, SG = C ? 14 : 26, RG = C ? 44 : 58, LX = o.labels === false ? 6 : 96, PAD = 14;
  const inT = new Set(ids), S = id => SIMS[id];
  const ps = id => (S(id).parents || []).filter(p => inT.has(p));
  const prs = id => partnersOf(id).filter(([p]) => inT.has(p));
  // generations: children one below their parents; married-in partners beside their partner
  const gen = Object.fromEntries(ids.map(id => [id, 0]));
  for (let k = 0, ch = true; ch && k < 40; k++) { ch = false;
    ids.forEach(id => { const pp = ps(id); let g = pp.length ? Math.max(...pp.map(p => gen[p] + 1)) : Math.max(0, ...prs(id).filter(([p]) => ps(p).length).map(([p]) => gen[p]));
      if (g !== gen[id]) { gen[id] = g; ch = true; } }); }
  // units: a Sim with the partners beside them (Sims born into the tree first, so the partners who married in join them)
  const unitOf = {}, units = [];
  ids.filter(id => ps(id).length).concat(ids.filter(id => !ps(id).length)).forEach(id => { if (unitOf[id]) return;
    const pr = prs(id).filter(([p]) => !unitOf[p] && gen[p] === gen[id] && !ps(p).length);
    const m = pr.length === 2 ? [pr[0][0], id, pr[1][0]] : [id, ...pr.map(x => x[0])];
    const kinds = m.slice(1).map((x, i) => { const a = m[i], b = x; return (prs(a).find(([p]) => p === b) || prs(b).find(([p]) => p === a) || [0, "spouse"])[1]; });
    const u = {members: m, kinds, gen: gen[id], kids: []}; units.push(u); m.forEach(x => unitOf[x] = u); });
  // children belong to the unit holding their parents
  units.forEach(u => { const anchor = u.members.find(x => ps(x).length); if (!anchor) return;
    const pu = unitOf[ps(anchor)[0]]; if (pu && !pu.kids.includes(u)) pu.kids.push(u); u.parent = pu; });
  const roots = units.filter(u => !u.parent);
  const ownW = u => u.members.length * CW + (u.members.length - 1) * CG;
  const kidsW = u => u.kids.reduce((s, k, i) => s + subW(k) + (i ? SG : 0), 0);
  const subW = u => u.w ??= Math.max(ownW(u), kidsW(u));
  const top = g => PAD + g * (CH + RG);
  const place = (u, x0) => { const w = subW(u); u.x = x0 + (w - ownW(u)) / 2; u.y = top(u.gen);
    let cx = x0 + (w - kidsW(u)) / 2; u.kids.forEach(k => { place(k, cx); cx += subW(k) + SG; }); };
  let x = LX; roots.forEach(r => { place(r, x); x += subW(r) + SG * 2; });
  const width = x - SG * 2 + PAD, maxG = Math.max(...units.map(u => u.gen)), height = top(maxG) + CH + PAD;
  const cardX = id => { const u = unitOf[id]; return u.x + u.members.indexOf(id) * (CW + CG); };
  // lines
  const ink = "var(--muted)";
  let svg = "";
  units.forEach(u => u.kinds.forEach((k, i) => {
    const x1 = u.x + (i + 1) * CW + i * CG, x2 = x1 + CG, y = u.y + CH / 2;
    const dash = k === "partner" || k === "ex" ? 'stroke-dasharray="5 4"' : k === "unknown" ? 'stroke-dasharray="2 4"' : "";
    const op = k === "late-spouse" || k === "unknown" ? 'opacity=".5"' : "";
    svg += `<line x1="${x1}" y1="${y}" x2="${x2}" y2="${y}" stroke="${ink}" stroke-width="2.5" ${dash} ${op}/>`;
    if (k === "spouse" || k === "late-spouse") svg += `<line x1="${x1}" y1="${y + 4}" x2="${x2}" y2="${y + 4}" stroke="${ink}" stroke-width="1.2" ${op}/>`;   // married: double line
    if (k === "ex") { const m = (x1 + x2) / 2; svg += `<path d="M${m - 5} ${y + 6} L${m - 1} ${y - 6} M${m + 1} ${y + 6} L${m + 5} ${y - 6}" stroke="${ink}" stroke-width="1.6"/>`; }
  }));
  units.forEach(u => { if (!u.kids.length) return;
    const groups = {};   // children by their set of parents
    u.kids.forEach(k => { const c = k.members.find(x => ps(x).length); const key = ps(c).sort().join("+"); (groups[key] ||= []).push(c); });
    Object.entries(groups).forEach(([key, kids]) => {
      const pp = key.split("+"), idx = pp.map(p => u.members.indexOf(p)).filter(i => i >= 0).sort((a, b) => a - b);
      let ox, oy;
      if (idx.length === 2 && idx[1] - idx[0] === 1) { ox = u.x + idx[1] * (CW + CG) - CG / 2; oy = u.y + CH / 2 + 4; }
      else { ox = u.x + idx[0] * (CW + CG) + CW / 2; oy = u.y + CH; }
      const by = u.y + CH + RG / 2, cxs = kids.map(c => cardX(c) + CW / 2);
      svg += `<path d="M${ox} ${oy} V${by} M${Math.min(ox, ...cxs)} ${by} H${Math.max(ox, ...cxs)} ${cxs.map(c => `M${c} ${by} V${top(gen[kids[0]])}`).join(" ")}" fill="none" stroke="${ink}" stroke-width="1.6"/>`;
    });
  });
  const labels = o.labels === false ? "" : Array.from({length: maxG + 1}, (_, g) => `<span class="gen" style="top:${top(g) + CH / 2 - 14}px">Generation ${g + 1}</span>`).join("");
  o.inTree = inT;
  const cards = ids.map(id => treeCard(id, cardX(id), unitOf[id].y, CW, CH, o)).join("");
  return `<div class="tree" style="width:${width}px;height:${height}px"><svg class="lines" width="${width}" height="${height}" aria-hidden="true">${svg}</svg>${labels}${cards}</div>`;
}
// a household tree's card: the household's own Sims highlighted; everyone else lighter, with a chip for where they live
function treeCard(id, x, y, CW, CH, o){
  const s = SIMS[id], C = o.compact ? "compact" : "", pos = `left:${x}px;top:${y}px;width:${CW}px;height:${CH}px`;
  if (s.ph) return `<div class="tc ph ${C} ${o.here ? "away" : ""}" style="${pos}"><span class="tm">?</span><div class="tn">${esc(s.phText)}</div></div>`;
  const w = s.hh ? s.hh.world : s.world, here = o.me ? id === o.me : o.here && s.hh === o.here;
  const sub = [s.age, s.state, s.noHome ? "no home" : ""].filter(Boolean).join(" · ");
  // married-in Sims: the family they were born into (or married into), as a plain chip
  const born = f => `<span class="bornchip" ${FAMILIES[f] && FAMILIES[f].note ? `title="${esc(FAMILIES[f].note)}"` : ""}>${s.line === f ? "born" : "married"} ${aAn(FAMILIES[f] ? FAMILIES[f].name : f)} ${esc(FAMILIES[f] ? FAMILIES[f].name : f)}</span>`;
  const chips = [];
  const marriedIn = !(s.parents || []).some(p => o.inTree && o.inTree.has(p));   // descendants don't need a "born a…" chip
  if (s.line && s.into && s.line !== o.line && marriedIn) chips.push(born(s.line));
  else if (!s.line && !s.late && !s.treeOnly) chips.push(`<span class="bornchip">married in</span>`);
  if (s.into && s.into !== o.line && s.line === o.line) chips.push(born(s.into));
  if (!s.late && !here) chips.push(homeChip(s));
  // dynasty heads and heirs keep a small badge (the dynasty itself has its own page)
  const dy = dynastyOf(id), role = dy && dy[2], badge = role ? `<span class="badge ${role === "head" ? "head" : role === "outcast" ? "out" : role === "member" ? "plain" : ""}">${role === "head" || role === "heir" ? ic("crown") : ""}${GROUP_KINDS.dynasty.roles[role]}${slug(dy[1].name) !== o.line ? " · " + esc(dy[1].name) : ""}</span>` : "";
  // names open the Sim's own page, or their household where there's no Sim page yet
  const href = simLinkTo(id), nm = href ? `<a href="${href}">${esc(s.name)}</a>` : esc(s.name);
  return `<div class="tc ${C} ${s.late ? "late" : ""} ${o.here ? (here ? "here" : "away") : ""}" style="${pos};--w:${wColour(w)}" data-sim="${id}"><span class="tm">${initial(s.name)}</span>${s.late ? `<span class="dead" title="Deceased">${ic("flower-2")}</span>` : ""}<div class="tn">${nm}</div><div class="ts">${esc(sub)}</div>
    <div class="tchip" style="display:flex;flex-wrap:wrap;gap:4px">${chips.filter(Boolean).join("")}</div>${badge}</div>`;
}
const treeKey = (here = false, colour = "") => `<div class="tree-key">
  ${here ? `<span><span class="k-box here" ${colour ? `style="--w:${colour}"` : ""}></span>Lives here</span><span><span class="k-box away"></span>Lives elsewhere</span>` : ""}
  <span><svg class="k" viewBox="0 0 34 10"><line x1="0" y1="3" x2="34" y2="3" stroke="var(--muted)" stroke-width="2.5"/><line x1="0" y1="7" x2="34" y2="7" stroke="var(--muted)" stroke-width="1.2"/></svg>Spouses</span>
  <span><svg class="k" viewBox="0 0 34 10"><line x1="0" y1="5" x2="34" y2="5" stroke="var(--muted)" stroke-width="2.5" stroke-dasharray="5 4"/></svg>Partners</span>
  <span><svg class="k" viewBox="0 0 34 12"><line x1="0" y1="6" x2="34" y2="6" stroke="var(--muted)" stroke-width="2.5" stroke-dasharray="5 4"/><path d="M12 12 L16 0 M18 12 L22 0" stroke="var(--muted)" stroke-width="1.6"/></svg>Ex</span>
  <span><svg class="k" viewBox="0 0 34 10" opacity=".5"><line x1="0" y1="3" x2="34" y2="3" stroke="var(--muted)" stroke-width="2.5"/><line x1="0" y1="7" x2="34" y2="7" stroke="var(--muted)" stroke-width="1.2"/></svg>Deceased spouse</span>
  <span>${ic("flower-2")} Deceased</span>
  <span>${ic("crown")} Dynasty roles</span></div>`;

/* ---------- relationships between Sims: only on Sim pages, grouped by tag group (her decision, 17 Oct) ---------- */
const CLOSE_FAMILY = new Set(["Mother", "Father", "Parent", "Daughter", "Son", "Child", "Sister", "Brother", "Sibling"]);
// everything a Sim has with other Sims, as {o (the other Sim), g (tag group), tag, word}
function simRels(id){
  const out = [], prs = partnersOf(id);
  familyOf(id).forEach(([o, w]) => { if (!prs.some(([p]) => p === o)) out.push({o, g: "family", word: w}); });
  REL_PAIRS.forEach(r => { if (r.a === id || r.b === id) out.push({o: r.a === id ? r.b : r.a, g: r.g, tag: r.tag, word: r.word}); });
  return out;
}
const relPill = r => r.g === "family" ? `<span class="tg family">${ic("network")}${esc(r.word)}</span>` : r.tag === "spouse" || r.tag === "ex" ? `<span class="tg romance">${ic("heart")}${esc(r.word)}</span>`
  : r.tag ? tagPill(r.tag) : `<span class="tg ${r.g}">${ic(TAG_GROUPS[r.g].icon)}${esc(r.word)}</span>`;
function simRelCard(r){
  const t = SIMS[r.o], href = simLinkTo(r.o), T = href ? "a" : "div";
  return `<${T} class="rel-card ${t.late ? "late" : ""}" ${href ? `href="${href}"` : ""} style="--w:${simColour(r.o)};--g:var(--t-${r.g})"><span class="mono">${initial(t.name)}</span>
    <b>${esc(t.name)}</b><span class="where">${esc(simWhere(r.o))}</span><span class="tagrow">${relPill(r)}</span></${T}>`;
}
// grouped lists, in the tag groups (family has its own section on Sim pages; dynasties are groups with their own pages)
function simRelGroups(id, o = {}){
  const by = {};
  simRels(id).filter(r => r.g !== "family" || (o.family && CLOSE_FAMILY.has(r.word))).forEach(r => (by[r.g] ||= []).push(r));
  const order = Object.keys(TAG_GROUPS).filter(g => g !== "dynasty" && (g !== "family" || o.family));
  const gs = order.filter(g => by[g]), none = order.filter(g => !by[g]);
  const count = list => { const n = new Set(list.map(r => r.o)).size; return `${n} ${n === 1 ? "Sim" : "Sims"}`; };
  return `${gs.length ? `<div class="rel-groups">${gs.map(g => `<div class="rel-group" style="--g:var(--t-${g})"><h3><span class="ico">${ic(TAG_GROUPS[g].icon)}</span>${TAG_GROUPS[g].name}<small>${count(by[g])}</small></h3>
      <div class="rel-list">${by[g].map(simRelCard).join("")}</div></div>`).join("")}</div>` : ""}
`;
}

/* ---------- the Sim page (as the prototype's sim.html) ---------- */
// one Sim as a small card: monogram in their world's colour (grey when late), name linking to their page or household
function simFamItem(o, word){
  const t = SIMS[o];
  if (t.ph) return `<li><div class="card ph"><span class="mono">?</span><span><b>${esc(word === "parent" ? t.phText : "Not on the family tree")}</b></span></div></li>`;
  const href = simLinkTo(o), T = href ? "a" : "div", where = simWhere(o);
  return `<li><${T} class="card ${t.late ? "late" : ""}" ${href ? `href="${href}"` : ""} style="--w:${simColour(o)}"><span class="mono">${initial(t.name)}</span><span><b>${esc(t.name)}</b><small>${esc([word, where].filter(Boolean).join(" · "))}</small></span></${T}></li>`;
}
function simFamily(id){
  const s = SIMS[id], fam = familyOf(id), words = ws => fam.filter(([, w]) => ws.includes(w));
  const parents = (s.parents || []).filter(p => SIMS[p]).map(p => [p, SIMS[p].ph ? "parent" : relWord(id, p)]);
  const partners = partnersOf(id).map(([p, k]) => [p, partnerWord(k)]);
  const kids = words(["Son", "Daughter", "Child"]), sibs = words(["Brother", "Sister", "Sibling"]);
  const shown = new Set([...parents, ...partners, ...kids, ...sibs].map(([o]) => o));
  const wider = fam.filter(([o]) => !shown.has(o));
  const all = [...parents, ...partners, ...kids, ...sibs, ...wider];
  return all.length ? `<ul class="sim-list cols fam-grid">${all.map(([o, w]) => simFamItem(o, w)).join("")}</ul>` : "";
}
function simGroups(id){
  const gs = groupsOf(id);
  const card = ([gid, g, role]) => `<a class="memb" href="#${gid}"><span class="ico">${ic(GROUP_KINDS[g.kind].icon)}</span><span><b>${esc(groupTitle(g))}</b><small>${esc(GROUP_KINDS[g.kind].name)}</small></span><span class="role-pill">${esc(GROUP_KINDS[g.kind].roles[role] || role)}</span></a>`;
  return gs.length ? `<div class="membs">${gs.map(card).join("")}</div>` : "";
}
function simHomes(s){
  const hh = s.hh;
  if (!hh) return "";
  return `<ul class="homes">${hh.lots.filter(l => !l.owned).map(l => `<li>${ic("home")}<a href="#${l.id}">${esc(l.name)}</a><span>${esc(l.hood.name)}, ${esc(l.world.name)}</span></li>`).join("")}</ul>`;
}
function simPage(s){
  const hh = s.hh, base = hh || ANCHOR[s.id], home1 = base.lots[0], hc = home1.hood.color, w = home1.world, first = firstName(s);
  // Sims with no household: their family's household (for a blood relative), or the household whose tree they're on
  const kin = !hh && membersOf(base).some(m => blood(m, s.id));
  const hhCrumb = hh ? `${esc(hh.name)} household` : `Related to the ${esc(base.name)} household`;
  const stage = [s.age, s.late ? "deceased" : ""].filter(Boolean).join(" · ");
  let h = `<section class="hero small" style="--c:${home1.hood.glow || hc}"><div class="crumbs">${hh ? `<a href="#w-${w.id}">${ic("map")}${esc(w.name)}</a><a href="#n-${home1.hood.id}">${ic("pin")}${esc(home1.hood.name)}</a><a href="#${home1.id}">${ic("home")}${esc(home1.name)}</a>` : ""}<a href="#${base.id}">${ic("users")}${hhCrumb}</a></div>
    <div style="display:flex;gap:26px;align-items:center;flex-wrap:wrap;margin-top:22px"><div class="monogram">${initial(s.name)}</div><div><span class="label" style="color:var(--on-deep-mute)">Sim</span><h1 style="margin-top:6px">${esc(s.name)}</h1></div></div>
    <div class="sim-chips">${stage ? `<span>${esc(stage.charAt(0).toUpperCase() + stage.slice(1))}</span>` : ""}<span class="${s.state ? "occult" : ""}">${s.state ? `${ic("ghost")}${esc(s.state)}` : "Human"}</span>${hh || s.late ? "" : `<span>No home</span>`}${originTag(s.origin)}</div></section>`;
  // details
  const facts = [["Aspiration", s.aspiration], ["Career", s.career], ["School", s.school], ["Lifestyles", (s.lifestyles || []).join(", ")], ["Likes", (s.likes || []).join(", ")], ["Died", s.died]].filter(([, v]) => v);
  const hasTraits = s.traits && s.traits.length;
  if (hasTraits || facts.length) h += `<section class="block" style="--h:${hc}"><div class="block-head"><h2>About <em>${esc(first)}</em></h2></div>
    <div class="sim-about"><div>${hasTraits ? `<span class="label">Traits</span><div class="traits">${s.traits.map(t => `<span>${esc(t)}</span>`).join("")}${s.bonus ? `<span class="bonus" title="Bonus trait">${esc(s.bonus)}</span>` : ""}</div>` : ""}</div>
      ${facts.length ? `<dl class="facts">${facts.map(([t, v]) => `<div><dt>${t}</dt><dd>${esc(v)}</dd></div>`).join("")}</dl>` : "<div></div>"}</div></section>`;
  // family
  const fam = simFamily(s.id), own = s.hh ? treeOf(s.hh) : treeAround([s.id]);   // their household’s whole family tree, with them highlighted
  if (fam.trim() || own.length) h += `<section class="block" id="family" style="--h:${hc}"><div class="block-head"><h2>Their <em>family</em></h2></div>
    ${own.length ? `<div class="tree-box">${drawTree(own, {line: s.line, compact: true, cw: 146, ch: 96, labels: false, here: true, me: s.id})}</div>${treeKey(false)}` : ""}
    ${fam.trim() ? `<div style="margin-top:22px">${fam}</div>` : ""}</section>`;
  // relationships
  const rels = simRelGroups(s.id);
  if (rels.trim()) h += `<section class="block" style="--h:${hc}"><div class="block-head"><h2>Their <em>relationships</em></h2></div>${rels}</section>`;
  // groups
  const grps = simGroups(s.id);
  if (grps) h += `<section class="block" style="--h:${hc}"><div class="block-head"><h2>Their <em>groups</em></h2></div>${grps}</section>`;
  // homes
  const homes = simHomes(s);
  if (homes) h += `<section class="block" style="--h:${hc}"><div class="block-head"><h2>Where they <em>live</em></h2></div>${homes}</section>`;
  // story
  if (s.story) h += `<section class="block" style="--h:${hc}"><div class="block-head"><h2>Their <em>story</em></h2></div><p class="lede">${esc(s.story)}</p></section>`;
  return h;
}

/* ---------- the group page (as the prototype's group.html): dynasties now, clubs and university organisations later ---------- */
const ROLE_ORDER = ["head", "leader", "heir", "member", "outcast"];
function groupPage(g){
  const K = GROUP_KINDS[g.kind], W = g.world, lotOf = g.place ? lotIndex[g.place] : g.homeHh ? g.homeHh.lots[0] : null, c = lotOf ? (lotOf.hood.glow || lotOf.hood.color) : wColour(W);
  const dyn = g.kind === "dynasty", ids = g.members.slice().sort((a, b) => ROLE_ORDER.indexOf(a[1]) - ROLE_ORDER.indexOf(b[1])), away = dyn ? 0 : ids.filter(([id]) => !atHome(g, id)).length;
  const hhs = [...new Set(ids.map(([id]) => SIMS[id].hh).filter(Boolean))].map(hh => `<a href="#${hh.id}">${esc(hh.name)}</a> (${esc(hh.world.name)})`).join(", ");
  const link = x => GROUP_PAGES["g-dynasty-" + slug(x)] ? `<a href="#g-dynasty-${slug(x)}">${esc(groupTitle(GROUP_PAGES["g-dynasty-" + slug(x)]))}</a>` : esc(x + " dynasty");
  const who = role => g.members.filter(([, r]) => r === role).map(([id]) => simLinkTo(id) ? `<a href="${simLinkTo(id)}">${esc(SIMS[id].name)}</a>` : esc(SIMS[id].name)).join(", ") || "None";
  const based = () => { if (g.homeHh) { const hh = g.homeHh, l = hh.lots[0]; return `<a href="#${hh.id}">${esc(hh.name)} household</a> (<a href="#${l.id}">${esc(l.name)}</a>, ${esc(l.world.name)})`; }
    if (lotOf) return `<a href="#${lotOf.id}">${esc(lotOf.name)}</a> (${esc(lotOf.hood.name)}, ${esc(lotOf.world.name)})`;
    return W ? `${esc(W.name)}${W.owned ? "" : " (not owned)"}` : ""; };
  let h = `<section class="hero small" style="--c:${c}"><div class="crumbs">${W ? (W.ready && W.owned ? `<a href="#w-${W.id}">${ic("map")}${esc(W.name)}</a>` : `<span>${ic("map")}${esc(W.name)} (not owned)</span>`) : ""}${lotOf && g.kind !== "dynasty" ? `<a href="#${lotOf.id}">${ic(g.place ? "pin" : "home")}${esc(lotOf.name)}</a>` : ""}</div>
    <div style="display:flex;gap:26px;align-items:center;flex-wrap:wrap;margin-top:22px"><div class="monogram ico-mono">${ic(K.icon)}</div><div><span class="label" style="color:var(--on-deep-mute)">${esc(K.name)}</span><h1 style="margin-top:6px">${esc(groupTitle(g))}</h1></div></div></section>`;
  // the group's own details
  const list = xs => xs && xs.length ? xs.map(esc).join(", ") : "";
  const rows = (g.kind === "dynasty" ? [["Head", who("head")], ["Heir", who("heir")], ["Households", hhs], ["Prestige", g.prestige != null ? `${g.prestige} ${g.prestige === 1 ? "star" : "stars"}` : ""],
      ["Ideals", list(g.ideals)], ["Heirloom", g.heirloom ? esc(g.heirloom) : ""], ["Allies", (g.allies || []).map(link).join(", ")], ["Rivals", (g.rivals || []).map(link).join(", ")]]
    : [["Leader", who("leader")], ["Meets at", based()], ["Activities", list(g.activities)], ["Rules", (g.rules || []).map(esc).join(", ")]]).filter(([, v]) => v && v !== "None");
  const half = Math.ceil(rows.length / 2), dl = rs => `<dl class="facts">${rs.map(([t, v]) => `<div><dt>${t}</dt><dd>${v}</dd></div>`).join("")}</dl>`;
  h += `<div class="detail" style="--h:${c}"><div>${dl(rows.slice(0, half))}</div><div>${dl(rows.slice(half))}</div></div>`;
  // members
  h += `<section class="block" style="--h:${c}"><div class="block-head"><h2>The <em>members</em></h2><span class="count">${ids.length} ${ids.length === 1 ? "Sim" : "Sims"}${away ? ` · ${away} based elsewhere` : ""}</span></div>
    <div class="mcards">${ids.map(([id, r]) => memberCard(g, id, r)).join("")}</div>
    ${dyn ? "" : `<div class="tree-key"><span><span class="k-box here" style="--w:${wColour(W)}"></span>Lives in ${esc(W.name)}</span><span><span class="k-box away"></span>Lives elsewhere</span></div>`}</section>`;
  return h;
}

function plot(size, px, labels){
  const m = /^(\d+)x(\d+)$/.exec(size || ""), pad = labels ? 26 : 4, box = px - pad*2;
  if (!m) return `<svg class="plot-svg" viewBox="0 0 ${px} ${px}" aria-hidden="true"><rect class="frame" x="${pad}" y="${pad}" width="${box}" height="${box}" rx="4"/><text x="${px/2}" y="${px/2+4}" text-anchor="middle">size to check</text></svg>`;
  const W=+m[1], D=+m[2], s=box/64, w=W*s, d=D*s, x=pad+(box-w)/2, y=pad+(box-d)/2, step = labels ? 1 : 5;
  let t=""; for(let i=step;i<W;i+=step) t+=`<line x1="${x+i*s}" y1="${y}" x2="${x+i*s}" y2="${y+d}"/>`; for(let j=step;j<D;j+=step) t+=`<line x1="${x}" y1="${y+j*s}" x2="${x+w}" y2="${y+j*s}"/>`;
  const lab = labels ? `<text x="${x+w/2}" y="${y-10}" text-anchor="middle">${W} tiles</text><text x="${x-10}" y="${y+d/2}" text-anchor="middle" transform="rotate(-90 ${x-10} ${y+d/2})">${D} tiles</text>` : "";
  return `<svg class="plot-svg" viewBox="0 0 ${px} ${px}" role="img" aria-label="${W} by ${D} lot"><rect class="frame" x="${pad}" y="${pad}" width="${box}" height="${box}" rx="4"/><rect class="ground" x="${x}" y="${y}" width="${w}" height="${d}" rx="2"/>${t}${lab}</svg>`;
}
const sizeTxt = s => s && s !== "N/A" ? s.replace("x"," × ") : "";
const initial = n => esc(n.trim()[0] || "?");
const hhListName = hh => { if (!hh.single) return hh.name; const p = hh.name.split(" "); return p.at(-1) + ", " + p.slice(0, -1).join(" "); };
const hhSortKey = hh => (hh.single ? hhListName(hh) : hh.name.replace(/^The /, "")).toLowerCase();
const byHh = (a, b) => hhSortKey(a).localeCompare(hhSortKey(b));
const titleWord = name => { const p = esc(name).split(" "); return p.length > 1 ? p.slice(0,-1).join(" ") + " <em>" + p.at(-1) + "</em>" : "<em>" + p[0] + "</em>"; };

// sidebar follows where things live: world → neighbourhood → lot → household → Sims
let navArgs = null;   // the page the sidebar belongs to, so it can come back after a search
// households live only under "Households" in the sidebar (her choice, 17 Oct), never under lots; the list opens on any household, Sim or dynasty page
function renderNav(active, key, ctx){
  navArgs = [active, key, ctx];
  const nav = document.getElementById("nav");
  const owned = worlds.filter(w => w.owned), notOwned = worlds.filter(w => !w.owned);
  let h = `<div class="nav-group"><a href="#home" class="${active==="home"?"on":""}">${ic("home")}Home</a></div><div class="nav-group"><div class="label">Worlds</div>`;
  // not-owned worlds are listed greyed in the "Not owned" group and don't open (opened 16 Oct for her plan review, closed again the same day)
  const navWorld = (w, grey) => { let h = "";
    const on = active === w.id, open = w.ready && !grey;
    h += open ? `<a href="#w-${w.id}" class="${on?"on":""}" style="--c:${w.glow||w.color}"><span class="dot"></span>${esc(w.name)}</a>`
      : `<a class="soon" aria-disabled="true" style="--c:${w.glow||w.color}"><span class="dot"></span>${esc(w.name)}${grey ? "" : `<span class="pct">soon</span>`}</a>`;
    if (open && on) {
      h += `<div class="subnav">${w.hoods.map(x => {
        let t = `<a href="#n-${x.id}" class="${ctx.hood===x && !ctx.hh ? (ctx.lot ? "path" : "cur") : ""}">${esc(x.name)}</a>`;
        const seenB = new Set();
        if (ctx.hood === x && !ctx.hh) t += `<div class="lotnav">${x.lots.map(l => {
          let pre = "";
          if (l.building) { if (seenB.has(l.building)) return ""; seenB.add(l.building);
            const b = l.building, inB = b.units.includes(ctx.lot);
            return `<span class="bld-label ${inB?"path":""}">${ic("home")}${esc(b.name)}</span><div class="lotnav">${b.units.map(u2 => { let v = `<a href="#${u2.id}" class="${ctx.lot===u2 ? "cur" : ""}">${esc(u2.name)}</a>`;
              return v; }).join("")}</div>`; }
          let u = pre + `<a href="#${l.id}" class="${ctx.lot===l ? "cur" : ""}">${esc(l.name)}</a>`;
          return u; }).join("")}</div>`;
        return t; }).join("")}<a class="hh-link ${key==="f-"+w.id ? "cur" : ctx.hh ? "path" : ""}" href="#f-${w.id}">${ic("users")}Households</a>${key === "f-" + w.id || (ctx.hh && ctx.hh.world === w) ? `<div class="lotnav">${Object.values(w.households).sort(byHh).map(hx =>
          `<a href="#${hx.id}" class="${ctx.hh === hx ? (ctx.sim || ctx.group ? "path" : "cur") : ""}">${esc(hhListName(hx))}</a>${ctx.hh === hx && hx.sims.length ? `<div class="lotnav">${hx.sims.map(sm => sm.sid ? `<a href="#s-${sm.sid}" class="${ctx.sim === sm ? "cur" : ""}">${esc(sm.name)}</a>` : `<a href="#${hx.id}" data-sim="${sm.id}">${esc(sm.name)}</a>`).join("")}</div>` : ""}`).join("")}</div>` : ""}</div>`;
    }
    return h; };
  owned.forEach(w => h += navWorld(w));
  h += `</div><div class="nav-group dim"><div class="label">Not owned</div>${notOwned.map(w => navWorld(w, true)).join("")}</div>
    <div class="nav-group stats-nav"><a href="#stats" class="${active==="stats"?"on":""}">${ic("grid")}Stats</a></div>`;
  nav.innerHTML = h;
}
// clicking the page you're already on goes back to its top
// clicking the item for the page you are on folds its list (click again to unfold); anything else takes you to its page
document.addEventListener("click", e => {
  const a = e.target.closest('.nav a[href]'); if (!a || a.dataset.sim) return;
  const next = a.nextElementSibling, list = next && (next.classList.contains("lotnav") || next.classList.contains("subnav")) ? next : null;
  const here = location.hash === a.getAttribute("href") || (location.hash === "" && a.getAttribute("href") === "#home");
  if (list && here) { e.preventDefault(); list.hidden = !list.hidden; a.classList.toggle("folded", list.hidden); return; }
  if (here) window.scrollTo({top:0, behavior:"smooth"});
});
// ---------- search (13 Oct): lots by any of their names, households, Sims, neighbourhoods and worlds; results take the sidebar's place while typing ----------
const fold = s => String(s ?? "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[‘’'.]/g, "").replace(/&/g, "and").replace(/\s+/g, " ");
const KINDS = ["World", "Neighbourhood", "Lot", "Household", "Sim"];
let searchList = null, hits = [], hit = 0;
function searchIndex(){
  const out = [], add = (kind, name, where, href, also, sim) => out.push({kind, name, where, href, sim, keys: [name, ...also].filter(Boolean).map(k => [k, fold(k)])});
  worlds.filter(w => w.ready).forEach(w => {
    add("World", w.name, w.pack, "#w-" + w.id, []);
    w.hoods.forEach(h => { add("Neighbourhood", h.name, w.name, "#n-" + h.id, []);
      h.lots.forEach(l => add("Lot", l.name, h.name + " · " + w.name, "#" + l.id, [l.lot, l.mine, l.gallery?.title, ...(l.versions || []).map(v => v.title), ...(l.gallery?.others || []).map(o => o.title)])); });
    Object.values(w.households).forEach(x => { add("Household", x.name, w.name, "#" + x.id, []);
      x.sims.forEach(sm => sm.sid ? add("Sim", sm.name, x.name + " household", "#s-" + sm.sid, []) : add("Sim", sm.name, x.name + " household", "#" + x.id, [], sm.id)); });
  });
  Object.values(SIM_PAGES).filter(s => !s.hh).forEach(s => add("Sim", s.name, ANCHOR[s.id].name + " household’s family tree", "#s-" + s.id, []));
  Object.values(GROUP_PAGES).forEach(g => add(GROUP_KINDS[g.kind].name, groupTitle(g), GROUP_KINDS[g.kind].name, "#" + g.id, [g.name]));
  return out;
}
// best first: the name starts with it, then a word in the name does, then the name has it anywhere; matches on another name (in-game, Gallery title) after those
function search(q){
  const f = fold(q).trim(); searchList ||= searchIndex();
  return searchList.map(r => { let best = null;
    r.keys.forEach(([raw, k], i) => { const at = k.indexOf(f); if (at < 0) return;
      const s = (i ? 3 : 0) + (at === 0 ? 0 : k[at - 1] === " " || k[at - 1] === "-" ? 1 : 2);
      if (!best || s < best.s) best = {s, also: i && fold(raw) !== fold(r.name) ? raw : null}; });
    return best && {...r, ...best}; }).filter(Boolean)
    .sort((a, b) => a.s - b.s || KINDS.indexOf(a.kind) - KINDS.indexOf(b.kind) || a.name.localeCompare(b.name)).slice(0, 40);
}
function showSearch(){
  const q = document.getElementById("q").value, nav = document.getElementById("nav");
  if (!fold(q).trim()) { hits = []; if (navArgs) renderNav(...navArgs); return; }
  hits = search(q); hit = Math.min(hit, Math.max(0, hits.length - 1));
  nav.innerHTML = `<div class="nav-group results"><div class="label">${hits.length ? hits.length + (hits.length === 40 ? "+" : "") + " found" : "Nothing found"}</div>${hits.map((r, i) =>
    `<a href="${r.href}" class="hit ${i === hit ? "on" : ""}" ${r.sim ? `data-sim="${r.sim}"` : ""}><span><b>${esc(r.name)}</b><small>${esc(r.kind)} · ${esc(r.where)}${r.also ? ` · “${esc(r.also)}”` : ""}</small></span></a>`).join("")}
    ${hits.length ? "" : `<a href="#stats" class="hit">${ic("grid")}Search every lot on the Stats page</a>`}</div>`;
}
const clearSearch = () => { const q = document.getElementById("q"); if (q.value) { q.value = ""; hits = []; } };
document.getElementById("q").addEventListener("input", () => { hit = 0; showSearch(); });
document.getElementById("q").addEventListener("keydown", e => {
  if (e.key === "Escape") { clearSearch(); showSearch(); return; }
  if (!hits.length || !["ArrowDown", "ArrowUp", "Enter"].includes(e.key)) return;
  e.preventDefault();
  if (e.key === "Enter") { document.querySelector(".nav a.hit.on")?.click(); return; }
  hit = (hit + (e.key === "ArrowDown" ? 1 : -1) + hits.length) % hits.length;
  document.querySelectorAll(".nav a.hit").forEach((a, i) => a.classList.toggle("on", i === hit));
  document.querySelector(".nav a.hit.on")?.scrollIntoView({block: "nearest"});
});
// a result for the page already open: no hashchange, so put the sidebar back here
document.addEventListener("click", e => { const a = e.target.closest(".nav a.hit"); if (a && a.getAttribute("href") === location.hash) { clearSearch(); route(); } });
// in-page jumps (households page chapter buttons)
document.addEventListener("click", e => { const b = e.target.closest("[data-local]"); if (b) document.getElementById(b.dataset.hood)?.scrollIntoView({behavior:"smooth",block:"start"}); });

function worldTile(w){
  const inner = `<div class="photo ${w.thumb?"pic":""}" ${w.thumb?`data-lazy="--map" data-src="${w.thumb}"`:""}><span class="big">${esc(w.name.slice(0,1))}</span><span class="type">${esc(w.pack)}</span></div>
    <h3>${esc(w.name)}</h3><div class="meta"><span>${w.ready ? `${w.stats.lots} lots · ${w.stats.hh} households` : w.owned ? "Coming soon" : "Pack not owned"}</span></div>`;
  if (!w.owned) return `<div class="wt off notown" style="--c:${w.glow||w.color}">${inner}</div>`;
  return w.ready ? `<a class="wt" href="#w-${w.id}" style="--c:${w.glow||w.color}">${inner}</a>` : `<div class="wt off" style="--c:${w.glow||w.color}">${inner}</div>`;
}
function home(){
  const ready = worlds.filter(w => w.ready), all = ready.flatMap(w => w.hoods.flatMap(h => h.lots));
  const b = all.filter(l => l.built === true).length, sh = all.filter(l => l.shared === true).length;
  const hhAll = ready.reduce((n,w) => n + w.stats.hh, 0), hhMade = ready.reduce((n,w) => n + w.stats.hhMade, 0);
  const owned = worlds.filter(w => w.owned), notOwned = worlds.filter(w => !w.owned);
  return `<section class="hero" style="--c:#8E62CF"><div class="kicker"><i></i><span class="label">A Sims 4 save, rebuilt by hand</span></div>
    <h1>Jemma's <em>Sim World</em></h1>
    <p>Every world in the game, rebuilt one lot at a time. Wander the neighbourhoods, look around the homes and venues, and meet the households who live in them.</p>
    <div class="hero-foot"><div class="figures">${[[ready.length, ready.length===1?"world":"worlds"],[ready.reduce((n,w)=>n+w.hoods.length,0),"neighbourhoods"],[ready.reduce((n,w)=>n+w.stats.lots,0),"lots"],[ready.reduce((n,w)=>n+w.stats.hh,0),"households"],[simCount(ready.flatMap(w => Object.values(w.households))),"Sims"]].map(([n,t]) => `<div><b>${n}</b><span>${t}</span></div>`).join("")}</div></div></section>
    <div class="section-head"><h2>The <em>worlds</em></h2><span class="count">in the order they arrived</span></div><div class="worlds">${owned.map(worldTile).join("")}</div>
    <div class="section-head"><h2>Not owned</h2><span class="count">${notOwned.length} worlds</span></div><div class="worlds">${notOwned.map(worldTile).join("")}</div>
    <footer><span>Lot names are my own; each lot page also shows its in-game name. Types and sizes follow the game.</span><span>World maps by 20th Century Plumbob · Icons by Lucide</span>
      <span class="as-of">Lots and households as of ${asOf(DATA.meta.built)} · Gallery numbers as of ${asOf(DATA.meta.galleryChecked)}${DATA.meta.game ? ` · Game version ${esc(DATA.meta.game)}` : ""}</span></footer>`;
}
const asOf = iso => iso ? new Date(iso + "T12:00").toLocaleDateString("en-GB", {day: "numeric", month: "short", year: "numeric"}) : "not yet";

const statusDots = l => [["built","hammer","Built"],["shared","share","Shared"],["sims","sim","Sims made"]]
  .filter(([k]) => l[k] === true || l[k] === false).map(([k,n,t]) => `<span class="${l[k]?"yes":""}" title="${t}: ${l[k]?"yes":"not yet"}">${ic(n)}</span>`).join("");

const progressRow = l => { const parts = [["built","Built"],["shared","Shared"],["sims","Sims made"]].filter(([k]) => l[k] === true || l[k] === false);
  return parts.length ? `<div><dt>Progress</dt><dd class="progress">${parts.map(([k,t]) => `<span class="${l[k]?"yes":"no"}">${l[k]?"✓":"–"} ${t}${l[k]?"":" not yet"}</span>`).join("")}</dd></div>` : ""; };
// apartments have no lot size of their own, so no plot drawing or size for them
const isApt = l => /apartment|penthouse/i.test(l.type || "");
const lotArt = l => isApt(l) ? `<span class="apt-art">${ic("home")}</span>` : plot(l.size, 120, false);
const cardPills = l => { const n = newSince(l), p = [n ? `<span class="pill new" title="${esc(newTxt(n))} since you last looked">New</span>` : "", baseGame(l) ? `<span class="pill" title="Needs no packs">Base game</span>` : ""].join("");
  return p ? `<span class="pills">${p}</span>` : ""; };
// ---------- rentals (layout chosen 16 Oct, "4"): the front picture with a circle per unit, and every household listed with its unit ----------
const isRental = l => /residential rental/i.test(l.type || "");
const unitCount = l => { const m = /\((\d+)\)/.exec(l.type || ""); return isRental(l) && m ? +m[1] : null; };
// who lives in which unit isn't decided yet: the plan's household fills the first unit, tenants the next, the rest show as empty
const rentalUnits = l => { const n = unitCount(l), who = [];
  if (l.hh) who.push({hh: l.hh, role: (l.tenants && !NO_LANDLORD.has(l.world.name + "|" + l.lot)) || /\sown\??$/i.test(l.who || "") ? "owners" : ""});
  (l.tenants || []).forEach(t => who.push({hh: t, role: "tenant"}));
  return Array.from({length: n}, (_, i) => who[i] || null); };
// a unit's own pictures: photos named flat-N or unit-N
const unitPhotos = l => { const m = {}; l.photos.forEach(p => { const r = /(?:flat|unit)[-_ ]?(\d+)/i.exec(p.thumb || p.src || ""); if (r) (m[+r[1]] ||= []).push(p); }); return m; };
// the unit circles on the card (like the lot circles on neighbourhood cards), and the households listed under it
function rentalBubbles(l){
  const units = rentalUnits(l), ph = unitPhotos(l);
  return units.map((u, i) => { const p = (ph[i + 1] || [])[0], lab = `${unitLabel(l, i)}: ${u ? u.hh.name + (u.role === "owners" ? " (landlord)" : "") : "Empty"}`, to = u ? u.hh.id : l.id;
    return p ? `<i data-lot-link="${to}" aria-label="${esc(lab)}" data-name="${esc(lab)}" style="background-image:url('${p.thumb}')"></i>`
      : `<i class="nb-none unit-no-pic" data-lot-link="${to}" aria-label="${esc(lab)}" data-name="${esc(lab)}"><b>${i + 1}</b></i>`; }).join("");
}
// a unit's name as she gave it in the game (from her Building save, shared rentals only): "Unit 3A", or her own name in full; otherwise its number
const unitLabel = (l, i) => { const n = l.units?.[i]?.name; return !n ? `Unit ${i + 1}` : n.length <= 4 ? `Unit ${n}` : n; };
const unitTraits = (l, i) => [...(l.units?.[i]?.traits || []), ...(l.units?.[i]?.challenges || [])];
const rentalMeta = l => { const units = rentalUnits(l), who = units.filter(Boolean), owned = who.filter(u => u.role === "owners").length, lived = who.length - owned, free = units.length - who.length;   // the landlord's own unit isn't "let"
  const rows = units.map((u, i) => `<li${u ? "" : ' class="free"'}>${ic("home")}${u ? hhLink(u.hh) + (u.role === "owners" ? " (landlord)" : "") : "Free"}<em>${esc(unitLabel(l, i))}</em></li>`).join("");
  return `${rows ? `<ul class="unit-list">${rows}</ul>` : ""}<span>${ic("grid")}${free ? `${lived} let, ${free} free` : "All let"}</span>`; };

// the units as a table on the lot page: picture, unit, who (only the landlord is marked)
function unitsTable(l){
  const units = rentalUnits(l), ph = unitPhotos(l);
  return `<section class="block" style="--h:${l.hood.color}"><div class="block-head"><h2>The <em>units</em></h2><span class="count">${units.length} units</span></div><div class="unit-table">${units.map((u, i) => { const p = (ph[i + 1] || [])[0];
    return `<a class="unit-row" href="#${u ? u.hh.id : l.id}"><span class="u-pic" ${p ? `style="background-image:url('${p.thumb}')"` : ""}>${p ? "" : i + 1}</span><span class="u-name">${esc(unitLabel(l, i))}</span><span class="u-who">${u ? `<b>${esc(u.hh.name)}</b>${u.role === "owners" ? " (landlord)" : ""}` : "<i>Nobody yet</i>"}</span><span class="u-traits">${unitTraits(l, i).map(esc).join(", ")}</span></a>`; }).join("")}</div></section>`;
}
// apartment buildings: one card with the building's front picture and its apartments as circles; the card itself doesn't open (her choice, 16 Oct), the circles and household names do
// a household's name on a card opens the household's page (the card itself opens the lot)
const hhLink = hh => `<b class="hh-link" data-lot-link="${hh.id}" title="Open the ${esc(hh.name)} household">${esc(hh.name)}</b>`;
function buildingFront(b){
  const cover = (b.units.find(u => u.photos[0]) || {}).photos?.[0], lived = b.units.filter(u => u.hh).length;
  const circ = b.units.map(u => nbTile(u).replace("<i ", `<i data-lot-link="${u.id}" aria-label="${esc(u.name)}" `).replace(/ title="[^"]*"/, ` data-name="${esc(u.name)}"`)).join("");
  return `<div class="listing bfront" style="--h:${b.hood.color}"><div class="photo ${cover?"shot":""}" ${cover?`style="--img:url('${cover.thumb}')"`:""}>${cover ? "" : plot("40x30", 120, false)}<span class="nb-bubbles${b.units.length > 5 ? " many" : ""}">${circ}</span><span class="type">Apartment Building · ${b.units.length} Apartments</span></div>
    <h3>${esc(b.name)}</h3><div class="meta"><ul class="unit-list">${b.units.map(u => `<li${u.hh ? "" : ' class="free"'}>${ic("home")}${u.hh ? hhLink(u.hh) : "Free"}<em>${esc(u.unit || "")}</em></li>`).join("")}</ul><span>${ic("grid")}${b.units.length - lived ? `${lived} lived in, ${b.units.length - lived} free` : "All lived in"}</span></div></div>`;
}

function listing(l){
  const cover = l.photos[0];
  return `<a class="listing" href="#${l.id}" style="--h:${l.hood.color}"><div class="photo ${cover?"shot":""}" ${cover?`data-lazy="--img" data-src="${cover.thumb}"`:""}>${cover ? "" : lotArt(l)}${unitCount(l) ? `<span class="nb-bubbles${unitCount(l) > 5 ? " many" : ""}">${rentalBubbles(l)}</span>` : ""}<span class="type">${unitCount(l) ? `Residential Rental · ${unitCount(l)} units` : esc(l.type || "Lot")}</span><span class="status">${statusDots(l)}</span>${sizeTxt(l.size) && !isApt(l) ? `<span class="size">${sizeTxt(l.size)}</span>` : ""}${cardPills(l)}</div>
    <h3>${esc(l.name)}</h3>
    <div class="meta">${unitCount(l) ? rentalMeta(l) : l.hh ? `<span>${ic("users")}${hhLink(l.hh)}${l.hh.unsure?" (unsure)":""}</span>` : l.whoNote ? `<span>${ic("users")}${esc(emptyNote(l.whoNote))}</span>` : ""}${l.gallery ? `<span title="Downloads on the Sims 4 Gallery">${ic("share")}${l.gallery.downloads} downloads</span>` : ""}</div></a>`;
}

function buildingCard(b){
  const cover = b.units.find(l => l.photos[0]), built = b.units.filter(l => l.built === true).length;
  return `<div class="listing bcard" style="--h:${b.hood.color}"><div class="photo ${cover?"shot":""}" ${cover?`style="--img:url('${cover.photos[0].thumb}')"`:""}>${cover ? "" : plot("40x30", 120, false)}<span class="type">Apartment Building</span><span class="size">${b.units.length} Apartments</span></div>
    <h3>${esc(b.name)}</h3>
    <ul class="units">${b.units.map(l => `<li><a href="#${l.id}"><span class="unit-no">${esc(l.unit)}</span><span class="unit-who">${l.hh ? `${ic("users")}<b>${esc(l.hh.name)}</b>` : `<i>${esc(l.whoNote ? emptyNote(l.whoNote) : "No household yet")}</i>`}</span><span class="status">${statusDots(l)}</span></a></li>`).join("")}</ul>
    <div class="meta"><span>${ic("hammer")}<b>${built} of ${b.units.length}</b> built</span></div></div>`;
}
// units of a building share one card
const hoodItems = x => { const seen = new Set(); return x.lots.flatMap(l => { if (!l.building) return [listing(l)]; const b = l.building; if (seen.has(b)) return []; seen.add(b);
  return [buildingFront(b)]; }); };
function mapHero(w, kicker, title, text, figures, chapters, small, view){
  return `<section class="hero ${w.map?"mapped":""} ${small?"hh-hero":""}" style="--c:${w.glow||w.color};${w.map?`--map:url('${w.map}')`:""}${view ? `;--mapview:${view}` : w.heroY != null ? `;--mapview:center ${w.heroY}%/cover` : ""}">${w.map?`<span class="credit">Map by 20th Century Plumbob</span>`:""}<div class="kicker"><i></i><span class="label">${kicker}</span></div>
    <h1>${title}</h1>${text ? `<p>${text}</p>` : ""}
    <div class="hero-foot"><div class="figures">${figures.map(([n,t]) => `<div><b>${n}</b><span>${t}</span></div>`).join("")}</div><div class="chapters">${chapters}</div></div></section>`;
}

// Neighbourhood cards (chosen 12 Oct, "D1"): a close-up of the world map at the neighbourhood's spot (no pin, Jemma's choice),
// and a row of circles, one per lot, each linking to its lot.
// Spots are fractions of the map's width/height, placed by Jemma on a gridded map. Worlds without spots show the whole map, no pin.
const NB_PT = DATA.nbPt, NB_BOX = DATA.nbBox || {}, NB_CENTRED = DATA.nbCentred || {}, NB_ZOOM = DATA.nbZoom || {};
const MAP_RATIO = 1266/1800, CARD_RATIO = 3/4, ZOOM = 3.2;
// a box Jemma drew around a neighbourhood (14 Oct): zoom so the whole box fits the card, with a little room around it
// (never so far out that the map no longer fills the card, nor closer than a quarter of the map's width)
function boxZoom(b){
  const room = 1.15, w = (b[2] - b[0]) * room, h = (b[3] - b[1]) * room;
  return Math.max(CARD_RATIO / MAP_RATIO + .01, Math.min(4, 1 / Math.max(w, .01), CARD_RATIO / (MAP_RATIO * Math.max(h, .01))));
}
// where the card looks: the card is 4:3, so a wide or tall box leaves spare room around it. The card slides part of the way
// (at most 60% of that spare room, and never into the margin around the box) towards the side that shows less of the
// world's other neighbourhoods (14 Oct: Windslar showed a Crumbling Isle lot; sliding all the way left Crow's Crossing
// lopsided and clipped Whispering Glen's lots); small differences stay centred
const SLIDE = .6;
function boxCentre(b, zoom, others){
  const room = 1.15, vw = 1 / zoom, vh = CARD_RATIO / (zoom * MAP_RATIO), steps = 12;
  const cx = (b[0] + b[2]) / 2, cy = (b[1] + b[3]) / 2;
  const sx = Math.max(0, (vw - (b[2] - b[0]) * room) / 2) * SLIDE, sy = Math.max(0, (vh - (b[3] - b[1]) * room) / 2) * SLIDE;
  const hit = (l, t) => others.reduce((n, o) => n + Math.max(0, Math.min(l + vw, o[2]) - Math.max(l, o[0])) * Math.max(0, Math.min(t + vh, o[3]) - Math.max(t, o[1])), 0) / (vw * vh);
  let best = null;
  for (let i = -steps; i <= steps; i++) for (let j = -steps; j <= steps; j++) {
    const x = cx + sx * i / steps, y = cy + sy * j / steps, n = hit(x - vw / 2, y - vh / 2), off = Math.abs(i) + Math.abs(j);
    if (!best || n < best.n - .005 || (Math.abs(n - best.n) <= .005 && off < best.off)) best = {n, off, c: [x, y]};
  }
  return best.c;
}
// background-position that puts point [x,y] of the map at the card's centre (clamped at the map's edges), plus where the pin lands
function nbView(pt, zoom = ZOOM, ratio = CARD_RATIO){
  const kx = zoom, ky = zoom * MAP_RATIO / ratio, cl = v => Math.max(0, Math.min(1, v));
  const px = cl((pt[0]*kx - .5)/(kx - 1)), py = cl((pt[1]*ky - .5)/(ky - 1));
  return {bg: `${(px*100).toFixed(1)}% ${(py*100).toFixed(1)}%/${(zoom*100).toFixed(1)}% auto`, pin: [pt[0]*kx + px*(1-kx), pt[1]*ky + py*(1-ky)].map(v => (v*100).toFixed(1) + "%")};
}
const nbTile = l => l.photos[0] ? `<i style="background-image:url('${l.photos[0].thumb}')" title="${esc(l.name)}"></i>` : `<i class="nb-none" title="${esc(l.name)} (no picture yet)">${isApt(l) ? ic("home") : plot(l.size, 60, false)}</i>`;
// a lot circle on a neighbourhood card opens that lot (the rest of the card still opens the neighbourhood)
document.addEventListener("click", e => { const c = e.target.closest("[data-lot-link]"); if (!c) return; e.preventDefault(); e.stopPropagation(); location.hash = c.dataset.lotLink; }, true);
// the banner on a neighbourhood page shows the same part of the map as its card (16 Oct, her idea), zoomed less:
// (the banner's real shape is used, as it runs the full width of the page; it zooms only as far as the map picture stays sharp:
// most maps are about 3075px wide, San Myshuno's 1800px, as its night map didn't come out right at full size)
function hoodHeroView(x){
  const box = (NB_BOX[x.world.id] || {})[x.name], spot = (NB_PT[x.world.id] || {})[x.name];
  if (!x.world.map || !(box || spot)) return "";
  const W = document.querySelector("main")?.clientWidth || 1000, HERO_RATIO = Math.max(.3, Math.min(.7, Math.min(.44 * innerHeight, 420) / W));
  const HERO_ZOOM = Math.max(1.01, Math.min(3, (x.world.mapW || 1800) / (W * .85)));
  const room = 1.3, c = box ? [(box[0] + box[2]) / 2, (box[1] + box[3]) / 2] : spot;
  const fit = box ? Math.min(1 / ((box[2] - box[0]) * room), HERO_RATIO / (MAP_RATIO * (box[3] - box[1]) * room)) : HERO_ZOOM;
  const z = Math.max(1.01, Math.min(HERO_ZOOM, fit));
  return nbView([c[0], Math.min(1, c[1] + .04 / z)], z, HERO_RATIO).bg;   // a touch lower, so the neighbourhood sits above the fade
}
function hoodArt(x){
  const spot = (NB_PT[x.world.id] || {})[x.name], box = (NB_BOX[x.world.id] || {})[x.name], n = x.lots.length;
  // a neighbourhood Jemma wants centred on its box doesn't slide (14 Oct: Whispering Glen showed too much cloud above)
  const others = (NB_CENTRED[x.world.id] || []).includes(x.name) ? [] : Object.entries(NB_BOX[x.world.id] || {}).filter(([n]) => n !== x.name).map(([, b]) => b);
  const z = box ? boxZoom(box) * ((NB_ZOOM[x.world.id] || {})[x.name] || 1) : 0;   // her own closer zoom for a card (14 Oct: Whispering Glen)
  const v = box ? nbView(boxCentre(box, z, others), z) : spot ? nbView(spot) : null;
  const bg = !x.world.map ? "" : v ? `background:url('${x.world.map}') ${v.bg}` : `background:url('${x.world.map}') center 45%/cover`;
  const circles = x.lots.map(l => nbTile(l).replace("<i ", `<i data-lot-link="${l.id}" aria-label="${esc(l.name)}" `).replace(/ title="[^"]*"/, ` data-name="${esc(l.name)}"`)).join("");
  return `<div class="photo nb-map" style="${bg}"><span class="nb-bubbles${n > 5 ? " many" : ""}">${circles}</span><span class="type">Neighbourhood</span></div>`;
}
// festivals and events held in a neighbourhood, and where its eco footprint starts (14 Oct, read from the game's own files)
function hoodExtras(x, all){
  const f = x.festivals || [], shown = all ? f : f.slice(0, 3), more = f.length - shown.length;
  return (f.length ? `<p class="home-to">${ic("party")}<span>Festivals and events: ${shown.map(n => `<b>${esc(n)}</b>`).join(", ")}${more ? ` and ${more} more` : ""}</span></p>` : "")
    + (x.ecoStart ? `<p class="home-to">${ic(x.ecoStart === "Industrial" ? "factory" : "leaf")}<span>Eco footprint starts <b>${esc(x.ecoStart)}</b></span></p>` : "");
}
function hoodCard(x){
  const hhSet = [...new Set(x.lots.filter(l => l.hh).map(l => l.hh))], hh = hhSet.length, built = x.lots.filter(l => l.built === true).length, made = hhSet.filter(simsMade).length;
  return `<a class="listing" href="#n-${x.id}" style="--h:${x.color}">${hoodArt(x)}
    <h3>${esc(x.name)}</h3>${x.desc ? `<p class="desc">${esc(x.desc)}</p>` : ""}
    ${hh ? `<p class="home-to">${ic("users")}<span>Home to ${hhSet.map(f => `<b>${esc(f.name)}</b>`).join(", ")}</span></p>` : `<p class="home-to">${ic("pin")}<span>Community lots only</span></p>`}
    ${hoodExtras(x)}
    <div class="meta"><span>${ic("hammer")}<b>${built} of ${x.lots.length}</b> lots built</span>${hh ? `<span>${ic("sim")}<b>${made} of ${hh}</b> with Sims made</span>` : ""}</div></a>`;
}
function world(w){
  const s = w.stats;
  let h = mapHero(w, esc(w.pack) + (w.owned ? "" : " · not owned yet"), titleWord(w.name), w.blurb ? esc(w.blurb) : "", [[w.hoods.length,"neighbourhoods"],[s.lots,"lots"],[s.hh,"households"],[simCount(Object.values(w.households)),"Sims"]],
    w.hoods.map(x => `<a href="#n-${x.id}">${esc(x.name)}</a>`).join(""));
  h += `<section class="hood" style="--h:${w.color}"><div class="hood-head"><span class="label">Explore</span><div><h2>Neighbourhoods</h2><p>Open a neighbourhood to see its lots, then a home to meet the household living there.</p></div><a class="count" href="#f-${w.id}">All ${s.hh} households</a></div>
    <div class="listings">${w.hoods.map(hoodCard).join("")}</div></section>`;
  h += worldAbout(w);
  h += `<a class="stats-link" href="#stats-${w.id}"><span>${ic("grid")}Progress, lot by lot</span><span class="go">See the stats for ${esc(w.name)} ${ic("arrow")}</span></a>`;
  return h;
}
// the world's weather and the three highlights the game shows when you pick it (14 Oct, read from the game's own files)
function worldAbout(w){
  if (!w.weather && !w.highlights) return "";
  return `<section class="block" style="--h:${w.color}"><div class="block-head"><h2>Weather and <em>highlights</em></h2><span class="count">from the game</span></div>
    ${w.weather ? `<p class="home-to world-weather">${ic("weather")}<span>${esc(w.weather)}</span></p>` : ""}
    ${w.highlights ? `<div class="highlights">${w.highlights.map(x => `<div>${ic("landmark")}<b>${esc(x.name)}</b><span>${esc(x.text)}</span></div>`).join("")}</div>` : ""}</section>`;
}
function hoodPage(x){
  const w = x.world, hhSet = [...new Set(x.lots.filter(l => l.hh).map(l => l.hh))], built = x.lots.filter(l => l.built === true).length;
  const figs = [[x.lots.length, x.lots.length===1?"lot":"lots"]];
  if (hhSet.length) figs.push([hhSet.length, hhSet.length===1?"household":"households"],[simCount(hhSet), simCount(hhSet)===1?"Sim":"Sims"]);
  let h = mapHero(w, `Neighbourhood · ${esc(w.name)}`, esc(x.name), x.desc ? esc(x.desc) : "", figs,
    w.hoods.filter(o => o !== x).map(o => `<a href="#n-${o.id}">${esc(o.name)}</a>`).join(""), true, hoodHeroView(x));
  h += `<section class="hood" style="--h:${x.color}"><div class="hood-head"><span class="label">${esc(x.name)}</span><div><h2>The <em>lots</em></h2><p>Open a home to meet the household who lives there.</p>${hoodExtras(x, true) ? `<div class="hood-extras">${hoodExtras(x, true)}</div>` : ""}<p class="dot-key"><span class="yes">${ic("hammer")}</span>Built <span class="yes">${ic("share")}</span>Shared <span class="yes">${ic("sim")}</span>Sims made <small>Faded means not yet.</small></p></div><span class="count">${built} of ${x.lots.length} built</span></div>
    <div class="listings">${hoodItems(x).join("")}</div></section>`;
  return h;
}


// screenshot carousel (replaces the lot plan); click the photo for full screen
function carousel(l){
  if (!l.photos.length) return `<div class="carousel empty-car"><div class="empty" style="margin:0;height:100%">${ic("image")}No screenshots yet.</div></div>`;
  const many = l.photos.length > 1;
  return `<div class="carousel" data-car="${l.id}" data-i="0">
    <div class="car-view"><div class="car-track">${l.photos.map((ph,i) => `<button type="button" class="car-slide shot-btn" data-lot="${l.id}" data-i="${i}" ${i?'tabindex="-1"':""} aria-label="Open ${esc(ph.caption)} full screen"><img src="${ph.src}" alt="${esc(l.name)}: ${esc(ph.caption)}" ${i?'loading="lazy"':""}></button>`).join("")}</div>
      ${many ? `<button type="button" class="car-arrow prev" data-step="-1" aria-label="Previous photo">‹</button><button type="button" class="car-arrow next" data-step="1" aria-label="Next photo">›</button>` : ""}
      <div class="car-cap"><b>${esc(l.photos[0].caption)}</b>${many ? `<span>1 / ${l.photos.length}</span>` : ""}</div></div>
    ${many ? `<div class="car-thumbs">${l.photos.map((ph,i) => `<button type="button" data-go="${i}" class="${i?"":"on"}" aria-label="Show ${esc(ph.caption)}"><img src="${ph.thumb}" alt=""></button>`).join("")}</div>` : ""}
  </div>`;
}
function carGo(car, i){
  const l = lotIndex[car.dataset.car], n = l.photos.length; i = (i + n) % n; car.dataset.i = i;
  car.querySelector(".car-track").style.transform = `translateX(-${i*100}%)`;
  car.querySelector(".car-cap").innerHTML = `<b>${esc(l.photos[i].caption)}</b><span>${i+1} / ${n}</span>`;
  car.querySelectorAll(".car-slide").forEach((b,k) => b.tabIndex = k === i ? 0 : -1);
  car.querySelector(".car-view").scrollLeft = 0;
  car.querySelectorAll(".car-thumbs button").forEach((b,k) => b.classList.toggle("on", k === i));
  car.querySelectorAll(".car-thumbs button")[i]?.scrollIntoView({block:"nearest", inline:"nearest"});
}
document.addEventListener("click", e => { const car = e.target.closest(".carousel[data-car]"); if (!car) return;
  const st = e.target.closest("[data-step]"), go = e.target.closest("[data-go]");
  if (st) { e.stopPropagation(); carGo(car, +car.dataset.i + +st.dataset.step); } else if (go) carGo(car, +go.dataset.go); }, true);
let carTouch = null;
document.addEventListener("pointerdown", e => { const car = e.target.closest(".carousel[data-car]"); if (car && e.pointerType !== "mouse") carTouch = {car, x: e.clientX}; });
document.addEventListener("pointerup", e => { if (!carTouch) return; const dx = e.clientX - carTouch.x; if (Math.abs(dx) > 40) carGo(carTouch.car, +carTouch.car.dataset.i + (dx < 0 ? 1 : -1)); carTouch = null; });
document.addEventListener("keydown", e => { if (lb || !["ArrowLeft","ArrowRight"].includes(e.key)) return; const car = e.target.closest?.(".carousel[data-car]") || (e.target === document.body ? document.querySelector(".carousel[data-car]") : null); if (car) carGo(car, +car.dataset.i + (e.key === "ArrowRight" ? 1 : -1)); });
document.addEventListener("focusin", e => { const sl = e.target.closest?.(".car-slide"); if (!sl) return; const car = sl.closest(".carousel[data-car]"); if (car && +sl.dataset.i !== +car.dataset.i) carGo(car, +sl.dataset.i); else if (car) car.querySelector(".car-view").scrollLeft = 0; });
function lot(l){
  const w = l.world, hc = l.hood.color;
  const tk = (v, t) => v === true || v === false ? `<div class="tick ${v?"yes":""}"><i></i>${t}</div>` : "";
  const others = l.hood.lots.filter(x => x !== l && !(l.building && x.building === l.building)), mates = l.building ? l.building.units.filter(x => x !== l) : [];
  const cover = l.photos[0];
  return `<section class="hero small ${cover?"mapped lot-hero":""}" style="--c:${l.hood.glow||hc};${cover?`--map:url('${cover.src}')`:""}"><div class="crumbs"><a href="#w-${w.id}">${ic("map")}${esc(w.name)}</a><a href="#n-${l.hood.id}">${ic("pin")}${esc(l.hood.name)}</a>${l.building ? `<span>${ic("home")}${esc(l.building.name)}</span>` : ""}${baseGame(l) ? `<span>${ic("sparkle")}Base game only</span>` : ""}</div>
    <h1 style="margin-top:18px">${esc(l.name)}</h1></section>
    <div class="detail" style="--h:${hc}">${carousel(l)}
    <div><dl class="facts">${l.ea ? `<div><dt>In-game name</dt><dd>${esc(l.ea)}</dd></div>` : ""}<div><dt>Lot type</dt><dd>${esc(unitCount(l) ? l.type.replace(/\s*\((\d+)\)/, " · $1 units") : l.type || "Not set")}</dd></div>${isApt(l) ? "" : `<div><dt>Lot size</dt><dd>${esc(sizeTxt(l.size) || "Not checked yet")}</dd></div>`}${l.traits ? `<div><dt>Lot traits</dt><dd>${l.traits.map(esc).join(", ")}</dd></div>` : ""}${l.challenges ? `<div><dt>${l.challenges.length > 1 ? "Lot challenges" : "Lot challenge"}</dt><dd>${l.challenges.map(esc).join(", ")}</dd></div>` : ""}
      <div><dt>Neighbourhood</dt><dd>${esc(l.hood.name)}</dd></div>${progressRow(l)}${l.building ? `<div><dt>Building</dt><dd>${esc(l.building.name)} · ${l.building.units.length} Apartments</dd></div>` : ""}
      ${l.hh || l.whoNote ? `<div><dt>${l.owned ? "Owned by" : "Household"}</dt><dd>${l.hh ? `<a href="#${l.hh.id}">${esc(l.hh.name)}</a>${l.hh.unsure?" (unsure)":""}${l.tenants && !l.owned && !NO_LANDLORD.has(l.world.name + "|" + l.lot) ? " (landlord)" : ""}` : esc(emptyNote(l.whoNote))}</dd></div>` : ""}${unitCount(l) ? (u => `<div><dt>Units</dt><dd>${u.length}: ${u.filter(Boolean).length} lived in, ${u.filter(x => !x).length} free</dd></div>`)(rentalUnits(l)) : ""}${l.tenants ? `<div><dt>${l.tenants.length > 1 ? "Tenants" : "Tenant"}</dt><dd>${l.tenants.map(t => `<a href="#${t.id}">${esc(t.name)}</a>${t.note ? ` <small>“${esc(t.note)}”</small>` : ""}`).join(", ")}</dd></div>` : ""}</dl>${l.versions ? versionTabs(l) : ""}
</div></div>
    ${l.hh ? `<section class="block" style="--h:${hc}"><div class="block-head"><h2>${l.owned ? "Who <em>owns it</em>" : "Who <em>lives here</em>"}</h2></div>
      <div class="lives"><div class="lives-card">${hhListing(l.hh)}</div>
      <div>${l.hh.sims.length ? `<span class="label">The Sims</span><ul class="sim-list">${l.hh.sims.map(sm => `<li><a href="${sm.sid ? "#s-" + sm.sid : "#" + l.hh.id}" ${sm.sid ? "" : `data-sim="${sm.id}"`}><span class="mono">${initial(sm.name)}</span><span><b>${esc(sm.name)}</b><small>${esc([sm.age, sm.aspiration].filter(Boolean).join(" · "))}</small></span></a></li>`).join("")}</ul>` : `<div class="empty" style="margin-top:0">${ic("sim")}No Sims added for the ${esc(l.hh.name)} household yet.</div>`}
      <a class="more" href="#${l.hh.id}">Open the ${esc(l.hh.name)} household ${ic("arrow")}</a></div></div></section>` : ""}
    ${unitCount(l) ? unitsTable(l) : ""}
    <section class="block" style="--h:${hc}"><div class="block-head"><h2>Build <em>notes</em></h2></div>
      ${l.gallery ? `<div class="notes-wrap"><div class="notes-text">${l.gallery.title !== l.name ? `<span class="label">Uploaded as “${esc(l.gallery.title)}”</span>` : ""}${l.gallery.description ? `<p class="lede">${esc(l.gallery.description)}</p>` : ""}
          ${l.gallery.tags?.length ? `<div class="tags">${l.gallery.tags.map(t => `<span>#${esc(t)}</span>`).join("")}</div>` : ""}
          ${theirs(l).length ? `<div class="g-comments"><span class="label">Comments on the Gallery</span><ul>${theirs(l).map(c => `<li><div class="c-head"><b>${esc(c.u || "A simmer")}</b>${c.t ? `<small>${new Date(c.t).toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"})}</small>` : ""}</div><p>${esc(c.m)}</p></li>`).join("")}</ul></div>` : ""}</div>
        <aside class="gallery-card"><span class="label">On the Sims 4 Gallery</span>${(n => n ? `<p class="new-since">${ic("sparkle")}${esc(newTxt(n))} since you last looked</p>` : "")(newSince(l))}
          <dl><div><dt>Value</dt><dd>${esc(l.gallery.value)}</dd></div><div><dt>Favourites</dt><dd>${l.gallery.likes}</dd></div><div><dt>Downloads</dt><dd>${l.gallery.downloads}</dd></div>${l.gallery.beds ? `<div><dt>Bedrooms</dt><dd>${l.gallery.beds}</dd></div>` : ""}${l.gallery.baths ? `<div><dt>Bathrooms</dt><dd>${l.gallery.baths}</dd></div>` : ""}<div><dt>Comments</dt><dd>${l.gallery.comments || 0}</dd></div>${l.gallery.shared ? `<div><dt>Shared</dt><dd>${esc(l.gallery.shared)}</dd></div>` : ""}</dl>
          ${l.gallery.packs?.length ? `<span class="label">Packs used</span><div class="packs">${l.gallery.packs.map(p => `<span>${esc(p)}</span>`).join("")}</div>` : `<span class="label">Packs used</span><div class="packs"><span>Base game only</span></div>`}
          ${l.gallery.old ? `<p class="g-old">${ic("note")}This Gallery upload is an older version of the build.</p>` : ""}
          <a class="gal-link" style="color:${textOn(l.hood.color)}" href="${esc(l.gallery.url)}" target="_blank" rel="noopener">View on the Gallery${l.gallery.others?.length ? ` · ${esc(l.gallery.label)}` : ""} ${ic("arrow")}</a>
          ${l.gallery.others?.length ? `<span class="label">Other versions</span><ul class="g-others">${l.gallery.others.map(o => `<li><a href="${esc(o.url)}" target="_blank" rel="noopener"><b>${esc(o.label)}</b><small>${esc(o.title)} · ${o.likes} favourites · ${o.downloads} downloads</small></a></li>`).join("")}</ul>` : ""}
          <small>Favourites, downloads and comments as of ${esc(l.gallery.checked)}</small></aside></div>`
      : `<div class="empty">${ic("note")}No notes yet.</div>`}</section>
    ${mates.length ? `<section class="block" style="--h:${hc}"><div class="block-head"><h2>Also in <em>${esc(l.building.name)}</em></h2></div><div class="mini">${mates.map(n => `<a href="#${n.id}" style="--h:${hc}"><div class="photo ${n.photos[0]?"shot":""}" ${n.photos[0]?`style="--img:url('${n.photos[0].thumb}')"`:""}>${n.photos[0] ? "" : lotArt(n)}</div><b>${esc(n.name)}</b><small>${esc([n.type, isApt(n) ? "" : sizeTxt(n.size)].filter(Boolean).join(" · "))}</small></a>`).join("")}</div></section>` : ""}
    ${others.length ? `<section class="block"><div class="block-head"><h2>Also in ${esc(l.hood.name)}</h2></div><div class="mini">${others.map(n => `<a href="#${n.id}" style="--h:${hc}"><div class="photo ${n.photos[0]?"shot":""}" ${n.photos[0]?`style="--img:url('${n.photos[0].thumb}')"`:""}>${n.photos[0] ? "" : lotArt(n)}</div><b>${esc(n.name)}</b><small>${esc([n.type, isApt(n) ? "" : sizeTxt(n.size)].filter(Boolean).join(" · "))}</small></a>`).join("")}</div></section>` : ""}`;
}

function famCard(x, link){
  const hc = x.lots[0].hood.color;
  return `<a class="fam" href="#${x.id}" style="--h:${hc}"><span class="mono">${initial(x.name)}</span><span>${link ? `<span class="rel">${esc(link.type)}</span>` : ""}<b>${esc(x.name)}</b>${x.unsure?` <small class="unsure">unsure</small>`:""}${link && link.note ? `<small>${esc(link.note)}</small>` : ""}
    <small>${x.lots.map(l => esc(l.name)).join(" & ")} · ${esc([...new Set(x.lots.map(l => l.hood.name))].join(", "))}</small></span></a>`;
}
function simCard(sm){
  const skills = (sm.skills || []).map(([n, lv, max]) => `<div class="skill"><span>${esc(n)}</span><div class="pips" style="--max:${max||10}">${Array.from({length:max||10},(_,i)=>`<i class="${i<lv?"on":""}"></i>`).join("")}</div><b>${lv}</b></div>`).join("");
  const rels = (sm.rels || []).map(([who, label]) => { const t = simIndex[who]; const nm = t ? `<a href="#${t.hh.id}" data-sim="${t.id}">${esc(who)}</a>` : esc(who); return `<li>${nm}<span>${esc(label)}</span>${t && t.hh !== sm.hh ? `<small>${esc(t.hh.name)} household</small>` : ""}</li>`; }).join("");
  return `<article class="sim" id="${sm.id}">
    <header><span class="mono">${initial(sm.name)}</span><div><h3>${esc(sm.name)}</h3><div class="sim-sub">${[sm.age, sm.aspiration && "Aspiration: " + sm.aspiration].filter(Boolean).map(esc).join(" · ")}</div></div></header>
    ${sm.traits?.length ? `<div class="traits">${sm.traits.map(t => `<span>${esc(t)}</span>`).join("")}${sm.bonus ? `<span class="bonus">${esc(sm.bonus)}</span>` : ""}</div>` : ""}
    <dl class="sim-facts"><div><dt>Career</dt><dd>${esc(sm.career || "None")}</dd></div>${sm.school ? `<div><dt>School</dt><dd>${esc(sm.school)}</dd></div>` : ""}</dl>
    ${skills ? `<div class="skills"><span class="label">Skills</span>${skills}</div>` : ""}
    ${rels ? `<div class="rels"><span class="label">Relationships</span><ul>${rels}</ul></div>` : ""}
    ${sm.notes ? `<p class="sim-note">${esc(sm.notes)}</p>` : ""}
  </article>`;
}
document.addEventListener("click", e => { const a = e.target.closest("a[data-sim]"); if (a) { const id = a.dataset.sim; setTimeout(() => document.getElementById(id)?.scrollIntoView({block:"start", behavior:"smooth"}), 120); } });
// Jemma's own replies count towards the total but are not shown
const theirs = l => (l.gallery?.commentList || []).filter(c => (c.u || "").toLowerCase() !== "jemmathesimmer");
// builds that need no packs (15 Oct: base-game builds are the most downloaded)
const baseGame = l => !!l.gallery && !(l.gallery.packs || []).length;
// "new since you looked" (15 Oct): this browser remembers each build's favourites and comments from when its page was
// last opened. The first visit just remembers everything; after that, builds with more favourites or comments, and new
// uploads, are marked until their page is opened. Kept in this browser only, so it's per viewer.
const SEEN_KEY = "jsw-seen-v1";
let seen = null; try { seen = JSON.parse(localStorage.getItem(SEEN_KEY) || "null"); } catch (e) {}
const seenNow = l => [l.gallery.likes, theirs(l).length];
const saveSeen = () => { try { localStorage.setItem(SEEN_KEY, JSON.stringify(seen)); } catch (e) {} };
if (!seen) { seen = {}; Object.values(lotIndex).forEach(l => { if (l.gallery) seen[l.id] = seenNow(l); }); saveSeen(); }
const newSince = l => { if (!l.gallery) return null; const s = seen[l.id], [f, c] = seenNow(l);
  if (!s) return {fresh: true}; return f > s[0] || c > s[1] ? {f: Math.max(0, f - s[0]), c: Math.max(0, c - s[1])} : null; };
const markSeen = l => { if (l.gallery) { seen[l.id] = seenNow(l); saveSeen(); } };
const newTxt = n => n.fresh ? "New on the Gallery" : [n.f && `${n.f} new ${n.f === 1 ? "favourite" : "favourites"}`, n.c && `${n.c} new ${n.c === 1 ? "comment" : "comments"}`].filter(Boolean).join(", ");
// a home with no household yet: bed-size planning notes just read "Empty" (bed counts live in the Gallery card)
// dark text on light colours (Sulani yellow etc.), white on dark ones: whichever reads better
function textOn(hex){ const c = (hex || "#000").replace("#",""), L = [0,2,4].map(i => { const v = parseInt(c.slice(i,i+2),16)/255; return v <= .03928 ? v/12.92 : Math.pow((v+.055)/1.055, 2.4); }), Y = .2126*L[0] + .7152*L[1] + .0722*L[2];
  return (1.05)/(Y+.05) >= (Y+.05)/(.0185+.05) ? "#fff" : "#1A1F1C"; }
const emptyNote = n => /bed|empty/i.test(n) ? "Empty" : n;
const simsMade = x => x.lots.some(l => l.sims === true);
const simCount = hhs => hhs.reduce((n, x) => n + x.sims.length, 0);
function hhListing(x, listed){   // listed: on the households page, one-Sim households read surname first
  const n = x.sims.length, hc = x.lots[0].hood.color, made = simsMade(x);
  return `<a class="listing" href="#${x.id}" style="--h:${hc}"><div class="photo"><span class="initial">${initial(x.name)}</span><span class="type">Household</span><span class="status">${x.unsure ? `<span class="flag">unsure</span>` : ""}<span class="${made?"yes":""}" title="Sims made: ${made?"yes":"not yet"}">${ic("sim")}</span></span><span class="size">${esc(x.lots.map(l => l.name).join(" & "))}</span></div>
    <h3>${esc(listed ? hhListName(x) : x.name)}</h3><p class="desc">${esc([...new Set(x.lots.map(l => l.hood.name))].join(", "))}</p>
    <div class="meta"><span class="${made?"made":""}">${ic("sim")}<b>${made ? "Sims made" : "Sims not made yet"}</b></span>${n ? `<span>${ic("users")}${n} Sim ${n===1?"profile":"profiles"}</span>` : ""}${x.links.length ? `<span>${ic("share")}${x.links.length} connected</span>` : ""}</div></a>`;
}
function families(w){
  const hhs = Object.values(w.households).sort(byHh), s = w.stats;
  let h = mapHero(w, esc(w.name), "The <em>households</em>", `Every family living in ${esc(w.name)}.`, [[hhs.length,"households"],[simCount(hhs),"Sims"]], "", true);
  h += `<section class="hood" style="--h:${w.color}"><div class="hood-head"><span class="label">${esc(w.name)}</span><div><h2>All <em>households</em></h2><p>Open a household to meet its Sims.</p></div><span class="count">${s.hhMade} of ${s.hh} with Sims made</span></div>
    <div class="listings">${hhs.map(x => hhListing(x, true)).join("")}</div></section>`;
  return h;
}
const lotsLabel = hh => { const o = hh.lots.some(l => l.owned), n = hh.lots.filter(l => !l.owned).length; return (n > 1 ? "Homes" : "Home") + (o ? " & business" : ""); };
function household(hh){
  if (hh.sims.some(sm => sm.sid)) return householdNew(hh);
  const w = hh.world, home1 = hh.lots[0], hc = home1.hood.color, homes = hh.lots.filter(l => !l.owned), owns = hh.lots.filter(l => l.owned);
  const hoods = [...new Set(hh.lots.map(l => l.hood))];
  const neighbours = Object.values(w.households).filter(x => x !== hh && !hh.links.some(k => k.hh === x) && x.lots.some(l => hoods.includes(l.hood)));
  return `<section class="hero small" style="--c:${home1.hood.glow||hc}"><div class="crumbs"><a href="#w-${w.id}">${ic("map")}${esc(w.name)}</a><a href="#n-${home1.hood.id}">${ic("pin")}${esc(home1.hood.name)}</a>${hh.lots.map(l => `<a href="#${l.id}">${ic(l.owned ? "pin" : "home")}${esc(l.name)}</a>`).join("")}</div>
    <div style="display:flex;gap:26px;align-items:center;flex-wrap:wrap;margin-top:22px"><div class="monogram">${initial(hh.name)}</div><div><span class="label" style="color:var(--on-deep-mute)">Household</span><h1 style="margin-top:6px">${esc(hh.name)}</h1></div></div></section>
    ${hh.unsure ? `<div class="note">Marked as unsure in the plan. Double-check which family lives here.</div>` : ""}
    <div class="detail" style="--h:${hc}">
      <div><span class="label">${lotsLabel(hh)}</span><div class="home-list">${hh.lots.map(listing).join("")}</div></div>
      <div><dl class="facts"><div><dt>World</dt><dd><a href="#w-${w.id}">${esc(w.name)}</a></dd></div><div><dt>Neighbourhood</dt><dd>${esc(hoods.map(x => x.name).join(", "))}</dd></div>
        <div><dt>${homes.length > 1 ? "Homes" : "Home"}</dt><dd>${homes.map(l => `<a href="#${l.id}">${esc(l.name)}</a>${hh.tenantOf === l ? " (renting)" : ""}`).join(", ")}</dd></div>${(() => { const lets = owns.filter(l => /rental/i.test(l.type || "")).concat(homes.filter(l => l.tenants && l.hh === hh)), biz = owns.filter(l => !/rental/i.test(l.type || ""));
          return (lets.length ? `<div><dt>Landlord of</dt><dd>${lets.map(l => `<a href="#${l.id}">${esc(l.name)}</a>`).join(", ")}</dd></div>` : "") + (biz.length ? `<div><dt>Owns</dt><dd>${biz.map(l => `<a href="#${l.id}">${esc(l.name)}</a> (${esc(l.type)})`).join(", ")}</dd></div>` : ""); })()}
        <div><dt>Sims made in game</dt><dd>${simsMade(hh) ? `<span class="ok">${ic("sim")} Yes</span>` : "Not yet"}</dd></div></dl></div>
    </div>
    <section class="block" style="--h:${hc}"><div class="block-head"><h2>The <em>Sims</em></h2>${hh.sims.length ? `<span class="count">${hh.sims.length} ${hh.sims.length===1?"Sim":"Sims"}</span>` : ""}</div>
      ${hh.sims.length ? `<div class="sims">${hh.sims.map(simCard).join("")}</div>` : `<div class="empty">${ic("sim")}No Sims added yet. Each Sim in the household will get a card here with their traits, career, skills and relationships.</div>`}
      ${hh.source ? `<p class="source">In-game starting details from The Sims Wiki: ${hh.source.map(([n,u]) => `<a href="${esc(u)}" target="_blank" rel="noopener">${esc(n)}</a>`).join(", ")}.</p>` : ""}</section>
    ${hh.links.length ? `<section class="block" style="--h:${hc}"><div class="block-head"><h2>Connected <em>households</em></h2></div><div class="families">${hh.links.map(x => x.hh ? famCard(x.hh, x) : "").join("")}</div></section>` : ""}
    <section class="block" style="--h:${hc}"><div class="block-head"><h2>Their <em>story</em></h2></div><div class="empty">${ic("note")}No story yet.</div></section>
    ${neighbours.length ? `<section class="block"><div class="block-head"><h2>Neighbours</h2></div><div class="families">${neighbours.map(famCard).join("")}</div></section>` : ""}`;
}

// the household page as the family overview (the prototype's household.html, her decisions of 17 Oct): the household picture on
// the left where a lot page has its photos (a placeholder until her screenshot is in, as "portrait"), the facts on the right;
// the roster (each name opens the Sim's page), the family tree from family links only, their story and the neighbours.
// Relationships between Sims are only on Sim pages.
function hhPicture(hh, ids){
  if (hh.portrait) return `<div class="portrait hh-pic" style="background-image:url('${hh.portrait}')" role="img" aria-label="The ${esc(hh.name)} household">
    <div class="names">${ids.map(id => `<div><a href="#s-${id}"><b>${esc(firstName(SIMS[id]))}</b></a><small>${esc(SIMS[id].age)}</small></div>`).join("")}</div></div>`;
  return `<div class="hh-pic none" aria-hidden="true"><span class="hh-pic-mono">${initial(hh.name)}</span><span class="hh-pic-txt">${ic("camera")}</span></div>`;
}
// plain-link lines for where they live and what they own, run, rent and let
function hhLotLines(hh){
  const link = l => `<a href="#${l.id}">${esc(l.name)}</a>`, hhA = x => `<a href="#${x.id}">${esc(x.name)}</a>`, noLord = l => NO_LANDLORD.has(l.world.name + "|" + l.lot);
  const homes = hh.lots.filter(l => !l.owned), owns = hh.lots.filter(l => l.owned);
  const landlord = hh.tenantOf && hh.tenantOf.hh && hh.tenantOf.hh !== hh && !noLord(hh.tenantOf) ? hh.tenantOf.hh : null;
  const lets = homes.concat(owns).filter(l => l.hh === hh && l.tenants && l.tenants.length && !noLord(l)).flatMap(l => l.tenants);
  const rows = [[homes.length > 1 ? "Homes" : "Home", homes.map(l => link(l) + (hh.tenantOf === l && !landlord ? " (renting)" : "")).join(", ")],
    [owns.length ? "Owns or runs" : "", owns.map(l => `${link(l)} (${esc(l.type)})`).join(", ")],
    [landlord ? "Rents from" : "", landlord ? `${hhA(landlord)} (${link(hh.tenantOf)})` : ""],
    [lets.length ? "Rents to" : "", lets.map(hhA).join(", ")]];
  return rows.filter(([t, v]) => t && v).map(([t, v]) => `<div><dt>${t}</dt><dd>${v}</dd></div>`).join("");
}
// the dynasty line: the dynasties the household's Sims belong to (usually one), each linking to its page ("outcast" when that's all they are in it)
const dynLine = ids => [...new Set(ids.map(id => (dynastyOf(id) || [])[0]).filter(Boolean))].map(gid => { const roles = ids.map(dynastyOf).filter(d => d && d[0] === gid).map(d => d[2]);
  return `<a href="#${gid}">${ic("crown")}${esc(GROUP_PAGES[gid].name)}</a>${roles.every(r => r === "outcast") ? " (outcast)" : ""}`; }).join(", ");
function simRoster(ids){
  return `<div class="sheet-wrap"><table class="sheet roster"><thead><tr><th scope="col">Sim</th><th scope="col">Life stage</th><th scope="col">Life state</th><th scope="col">Aspiration</th><th scope="col">Career or school</th><th scope="col">Details</th></tr></thead><tbody>
    ${ids.map(id => { const s = SIMS[id], has = s.traits && s.traits.length, job = (s.career || s.school || "").split(" · ")[0];
      return `<tr><td><span class="who"><span class="mono">${initial(s.name)}</span><a href="#s-${id}">${esc(s.name)}</a></span></td>
        <td>${esc(s.age)}</td><td>${s.state ? `<span class="state occult">${ic("ghost")}${esc(s.state)}</span>` : `<span class="muted">Human</span>`}</td>
        <td>${s.aspiration ? esc(s.aspiration) : `<span class="muted">—</span>`}</td><td>${job ? esc(job) : `<span class="muted">—</span>`}</td>
        <td><span class="lvl ${has ? "profile" : ""}">${has ? "Profile" : "Basics"}</span></td></tr>`; }).join("")}</tbody></table></div>`;
}
function householdNew(hh){
  const w = hh.world, home1 = hh.lots[0], hc = home1.hood.color, ids = membersOf(hh), n = ids.length, hoods = [...new Set(hh.lots.map(l => l.hood))];
  const neighbours = Object.values(w.households).filter(x => x !== hh && !hh.links.some(k => k.hh === x) && x.lots.some(l => l.hood === home1.hood));
  const dyn = dynLine(ids), tree = treeOf(hh), origin = hh.origin || (ids.some(id => !/^mine$/i.test(SIMS[id].origin || "")) ? "Premade" : "Mine");
  return `<section class="hero small" style="--c:${home1.hood.glow || hc}"><div class="crumbs"><a href="#w-${w.id}">${ic("map")}${esc(w.name)}</a><a href="#n-${home1.hood.id}">${ic("pin")}${esc(home1.hood.name)}</a>${hh.lots.map(l => `<a href="#${l.id}">${ic(l.owned ? "pin" : "home")}${esc(l.name)}</a>`).join("")}</div>
    <div style="display:flex;gap:26px;align-items:center;flex-wrap:wrap;margin-top:22px"><div class="monogram">${initial(hh.name)}</div><div><span class="label" style="color:var(--on-deep-mute)">Household</span><h1 style="margin-top:6px">${esc(hh.name)}</h1></div></div></section>
    ${hh.unsure ? `<div class="note">Marked as unsure in the plan. Double-check which family lives here.</div>` : ""}
    <div class="detail" style="--h:${hc}">${hhPicture(hh, ids)}
      <div><dl class="facts"><div><dt>World</dt><dd><a href="#w-${w.id}">${esc(w.name)}</a></dd></div><div><dt>Neighbourhood</dt><dd>${esc(hoods.map(x => x.name).join(", "))}</dd></div>
        ${hhLotLines(hh)}
        <div><dt>Sims made in game</dt><dd>${simsMade(hh) ? `<span class="ok">${ic("sim")} Yes</span>` : "Not yet"}</dd></div>
        <div><dt>Origin</dt><dd>${originTag(origin)}</dd></div>
        <div><dt>Played</dt><dd>${esc(hh.played || "Not yet")}</dd></div>
        <div><dt>Neighbourhood Stories</dt><dd>${esc(hh.stories || "Not set")}</dd></div>
        ${dyn ? `<div><dt>Dynasty</dt><dd class="dynline">${dyn}</dd></div>` : ""}</dl></div>
    </div>
    <section class="block" style="--h:${hc}"><div class="block-head"><h2>The <em>Sims</em></h2><span class="count">${n} ${n === 1 ? "Sim" : "Sims"} · no pets</span></div>
      ${simRoster(ids)}
      ${hh.source ? `<p class="source">Starting details from The Sims Wiki: ${hh.source.map(([t, u]) => `<a href="${esc(u)}" target="_blank" rel="noopener">${esc(t)}</a>`).join(", ")}.</p>` : ""}</section>
    ${tree.length ? `<section class="block" style="--h:${hc}"><div class="block-head"><h2>Family <em>tree</em></h2></div>
      <div class="tree-box">${drawTree(tree, {line: slug(hh.family), compact: true, cw: 146, ch: 96, labels: false, here: hh})}</div>${treeKey(true, wColour(w))}</section>` : ""}
    ${hh.story ? `<section class="block" style="--h:${hc}"><div class="block-head"><h2>Their <em>story</em></h2></div><p class="lede">${esc(hh.story)}</p></section>` : ""}
    ${neighbours.length ? `<section class="block"><div class="block-head"><h2>Neighbours</h2></div><div class="families">${neighbours.map(x => famCard(x)).join("")}</div></section>` : ""}`;
}

// ---------- Stats: the spreadsheet view ----------
const ROWS = DATA.stats.map(r => { const wd = worlds.find(w => w.name === r.w); const id = "l-" + slug(r.w) + "--" + slug(r.lot); const live = lotIndex[id];
  return {...r, type: (r.type || "").replace(/\s*\((?!\d+\??\))[^)]*\)?/g, "").trim(), owned: wd ? wd.owned : true, order: (wd && !wd.owned ? 100 : 0) + worlds.indexOf(wd), link: live ? id : null,
    name: live ? live.name : (r.mine && r.mine.trim() && r.mine.trim() !== r.lot ? r.mine.trim() : r.lot), ea: live ? (live.ea || "") : (r.mine && r.mine.trim() && r.mine.trim() !== r.lot ? r.lot : ""),
    photos: live ? live.photos.length : 0, likes: live && live.gallery ? live.gallery.likes : null, dls: live && live.gallery ? live.gallery.downloads : null}; });
let statsState = {world: "", hood: "", status: "", q: "", sort: "order", dir: 1};
const yes = v => v === true, known = v => v === true || v === false;
function worldSummary(){
  const by = [...worlds.filter(w => w.owned), ...worlds.filter(w => !w.owned)].map(w => { const rs = ROWS.filter(r => r.w === w.name), homes = rs.filter(r => known(r.sims));
    return {w, lots: rs.length, built: rs.filter(r => yes(r.built)).length, builtOf: rs.filter(r => known(r.built)).length, shared: rs.filter(r => yes(r.shared)).length, homes: homes.length, made: homes.filter(r => yes(r.sims)).length, fav: rs.reduce((n,r) => n + (r.likes || 0), 0), dls: rs.reduce((n,r) => n + (r.dls || 0), 0), gal: rs.some(r => r.likes != null)}; });
  const pc = (a, b) => b ? Math.round(100 * a / b) : 0;
  const row = (x, total) => `<tr class="${total?"total":""} ${!total && !x.w.owned?"dim":""}"><th scope="row">${total ? "All owned worlds" : `<button type="button" class="linkish" data-sw="${esc(x.w.name)}">${esc(x.w.name)}</button>${x.w.owned ? "" : " <small>not owned</small>"}`}</th>
    <td>${x.lots}</td><td>${x.built}<small> / ${x.builtOf}</small></td><td><div class="mini-bar"><i style="width:${pc(x.built,x.builtOf)}%"></i></div>${pc(x.built,x.builtOf)}%</td>
    <td>${x.shared}</td><td>${x.made}<small> / ${x.homes}</small></td><td><div class="mini-bar simbar"><i style="width:${pc(x.made,x.homes)}%"></i></div>${pc(x.made,x.homes)}%</td><td class="num">${x.gal || total ? x.fav : ""}</td><td class="num">${x.gal || total ? x.dls : ""}</td></tr>`;
  const own = by.filter(x => x.w.owned), tot = own.reduce((a, x) => ({lots:a.lots+x.lots, built:a.built+x.built, builtOf:a.builtOf+x.builtOf, shared:a.shared+x.shared, homes:a.homes+x.homes, made:a.made+x.made, fav:a.fav+x.fav, dls:a.dls+x.dls}), {lots:0,built:0,builtOf:0,shared:0,homes:0,made:0,fav:0,dls:0});
  return `<div class="sheet-wrap"><table class="sheet summary"><thead><tr><th scope="col">World</th><th scope="col">Lots</th><th scope="col">Built</th><th scope="col">% built</th><th scope="col">Shared</th><th scope="col">Homes with Sims made</th><th scope="col">% Sims made</th><th scope="col">Favourites</th><th scope="col">Downloads</th></tr></thead>
    <tbody>${by.map(x => row(x)).join("")}</tbody><tfoot>${row(tot, true)}</tfoot></table></div>`;
}
function lotRows(){
  const st = statsState, q = st.q.trim().toLowerCase();
  let rs = ROWS.filter(r => (!st.world || r.w === st.world) && (!st.hood || r.n === st.hood)
    && (!st.status || (st.status === "notbuilt" && r.built === false) || (st.status === "notshared" && r.built === true && r.shared === false) || (st.status === "nosims" && r.sims === false) || (st.status === "photos" && r.photos))
    && (!q || [r.name, r.lot, r.type, r.who, r.n, r.w].join(" ").toLowerCase().includes(q)));
  const NUMS = ["likes","dls","photos"];
  const val = r => NUMS.includes(st.sort) ? (r[st.sort] == null || r[st.sort] === "" ? null : +r[st.sort]) : st.sort === "order" ? r.order * 1000 + ROWS.indexOf(r) % 1000 : st.sort === "name" ? r.name.toLowerCase() : st.sort === "size" ? (/^(\d+)x(\d+)$/.exec(r.size || "") ? RegExp.$1 * RegExp.$2 : -1) : ["built","shared","sims"].includes(st.sort) ? (r[st.sort] === true ? 2 : r[st.sort] === false ? 1 : 0) : (r[st.sort] ?? "").toString().toLowerCase();
  rs = rs.slice().sort((a, b) => { const x = val(a), y = val(b);
    if (x === null || y === null) return x === y ? ROWS.indexOf(a) - ROWS.indexOf(b) : x === null ? 1 : -1;
    return (x > y ? 1 : x < y ? -1 : ROWS.indexOf(a) - ROWS.indexOf(b)) * st.dir; });
  const tick = v => v === true ? `<span class="t yes" title="Yes">✓</span>` : v === false ? `<span class="t no" title="Not yet">–</span>` : `<span class="t na" title="Not applicable">n/a</span>`;
  const H = (k, t) => `<th scope="col"><button type="button" data-sort="${k}" class="${st.sort===k?"on":""}">${t}${st.sort===k ? (st.dir>0?" ↑":" ↓") : ""}</button></th>`;
  return `<p class="showing">Showing <b>${rs.length}</b> of ${ROWS.length} lots</p><div class="sheet-wrap tall"><table class="sheet lots-sheet"><thead><tr>${H("order","Where")}${H("name","Lot")}${H("type","Type")}${H("size","Size")}${H("who","Residents")}${H("built","Built")}${H("shared","Shared")}${H("sims","Sims")}${H("photos","Photos")}${H("likes","Favourites")}${H("dls","Downloads")}</tr></thead>
    <tbody>${rs.map(r => `<tr class="${r.owned?"":"dim"}"><td class="where">${esc(r.n)}<small>${esc(r.w)}</small></td><td class="lotcell wrap">${r.link ? `<a href="#${r.link}">${esc(r.name)}</a>` : esc(r.name)}${r.ea ? `<small>${esc(r.ea)}</small>` : ""}</td><td class="wrap">${esc(r.type)}</td><td class="num">${esc(r.size && r.size !== "N/A" ? r.size.replace("x"," × ") : "")}</td><td class="wrap">${esc(r.who ? (/\bbed(room)?s?\b|^empty$/i.test(r.who) ? "Empty" : r.who) : "")}</td><td class="c">${tick(r.built)}</td><td class="c">${tick(r.shared)}</td><td class="c">${tick(r.sims)}</td><td class="num">${r.photos || ""}</td><td class="num">${r.likes ?? ""}</td><td class="num">${r.dls ?? ""}</td></tr>`).join("")}</tbody></table></div>`;
}
function statsPage(pre){
  if (pre) statsState = {...statsState, world: pre, hood: "", status: "", q: ""};
  else if (pre === null) statsState = {...statsState, world: "", hood: "", status: "", q: ""};
  const hoods = [...new Set(ROWS.filter(r => !statsState.world || r.w === statsState.world).map(r => r.n))];
  return `<section class="hero small" style="--c:#8E62CF"><div class="kicker"><i></i><span class="label">Behind the scenes</span></div><h1 style="margin-top:14px">The <em>stats</em></h1><p>Every world and every lot from the plan in one place, ready to sort and filter.</p></section>
    <section class="block"><div class="block-head"><h2>By <em>world</em></h2><span class="count">click a world to filter the lots below</span></div>${worldSummary()}</section>
    <section class="block" id="lot-sheet"><div class="block-head"><h2>Every <em>lot</em></h2></div>
      <div class="filters"><label>World<select id="f-world"><option value="">All worlds</option>${worlds.map(w => `<option ${statsState.world===w.name?"selected":""}>${esc(w.name)}</option>`).join("")}</select></label>
        <label>Neighbourhood<select id="f-hood"><option value="">All</option>${hoods.map(n => `<option ${statsState.hood===n?"selected":""}>${esc(n)}</option>`).join("")}</select></label>
        <label>Show<select id="f-status"><option value="">Everything</option><option value="notbuilt" ${statsState.status==="notbuilt"?"selected":""}>Not built yet</option><option value="notshared" ${statsState.status==="notshared"?"selected":""}>Built, not shared</option><option value="nosims" ${statsState.status==="nosims"?"selected":""}>Sims not made</option><option value="photos" ${statsState.status==="photos"?"selected":""}>Has photos</option></select></label>
        <label class="grow">Search<input id="f-q" type="search" placeholder="Lot, type, residents…" value="${esc(statsState.q)}"></label></div>
      <div id="lot-rows">${lotRows()}</div></section>
    ${galleryOverTime()}`;
}
// Gallery numbers over time (13 Oct): one row per weekly check, then the builds that gained most since the check before
function galleryOverTime(){
  const g = DATA.galleryHistory; if (!g || !g.dates.length) return "";
  const up = x => x > 0 ? `<small> +${x}</small>` : "";
  const weeks = `<div class="sheet-wrap"><table class="sheet"><thead><tr><th scope="col">Checked</th><th scope="col">Uploads</th><th scope="col">Favourites</th><th scope="col">Downloads</th><th scope="col">Comments</th></tr></thead>
    <tbody>${g.dates.map(d => `<tr><th scope="row">${esc(d.date)}</th><td class="num">${d.uploads}</td><td class="num">${d.favourites}${up(d.gain?.favourites)}</td><td class="num">${d.downloads}${up(d.gain?.downloads)}</td><td class="num">${d.comments}${up(d.gain?.comments)}</td></tr>`).join("")}</tbody></table></div>
    ${g.since ? `<p class="showing">Small numbers: new since the check before, on uploads that were already there.</p>` : ""}`;
  const gains = !g.since ? "" : !g.gains.length ? `<p class="showing">No new favourites or downloads since ${esc(g.since)}.</p>`
    : `<div class="gal-gains"><span class="label">Biggest gains since ${esc(g.since)}</span><div class="sheet-wrap"><table class="sheet lots-sheet"><thead><tr><th scope="col">Build</th><th scope="col">World</th><th scope="col">Favourites</th><th scope="col">Downloads</th></tr></thead>
      <tbody>${g.gains.map(x => `<tr><td class="lotcell wrap">${x.lot ? `<a href="#${x.lot.id}">${esc(x.title)}</a>` : `<a href="${esc(x.url)}" target="_blank" rel="noopener">${esc(x.title)}</a>`}</td><td>${esc(x.lot ? x.lot.world : "")}</td>
        <td class="num">${x.favourites > 0 ? "+" + x.favourites : "–"}<small> of ${x.nowFavourites}</small></td><td class="num">${x.downloads > 0 ? "+" + x.downloads : "–"}<small> of ${x.nowDownloads}</small></td></tr>`).join("")}</tbody></table></div></div>`;
  return `<section class="block"><div class="block-head"><h2>On the <em>Gallery</em></h2><span class="count">checked every Sunday</span></div>${weeks}${gains}${galleryBest()}${newestComments()}</section>`;
}
// most downloaded next to most loved (favourites per 100 downloads, builds with 50+ downloads), 15 Oct
function galleryBest(){
  const ls = Object.values(lotIndex).filter(l => l.gallery), row = (l, v) => `<tr><td class="lotcell wrap"><a href="#${l.id}">${esc(l.name)}</a></td><td>${esc(l.world.name)}</td><td class="num">${v}</td></tr>`;
  const most = [...ls].sort((a, b) => b.gallery.downloads - a.gallery.downloads).slice(0, 8);
  const loved = ls.filter(l => l.gallery.downloads >= 50).sort((a, b) => b.gallery.likes / b.gallery.downloads - a.gallery.likes / a.gallery.downloads).slice(0, 8);
  const table = (title, head, rows) => `<div><span class="label">${title}</span><div class="sheet-wrap"><table class="sheet lots-sheet"><thead><tr><th scope="col">Build</th><th scope="col">World</th><th scope="col">${head}</th></tr></thead><tbody>${rows}</tbody></table></div></div>`;
  return `<div class="gal-best">${table("Most downloaded", "Downloads", most.map(l => row(l, l.gallery.downloads)).join(""))}
    ${table("Most loved", "Favourites", loved.map(l => row(l, `${Math.round(100 * l.gallery.likes / l.gallery.downloads)}%<small> of ${l.gallery.downloads} downloads</small>`)).join(""))}</div>
    <p class="showing">Most loved: the share of downloads that also got a favourite, for builds with at least 50 downloads.</p>`;
}
// the latest comments other simmers left on her builds, 15 Oct
function newestComments(){
  const all = Object.values(lotIndex).filter(l => l.gallery).flatMap(l => theirs(l).map(c => ({c, l}))).filter(x => x.c.t).sort((a, b) => b.c.t - a.c.t).slice(0, 8);
  if (!all.length) return "";
  return `<div class="g-comments newest"><span class="label">Newest comments</span><ul>${all.map(({c, l}) => `<li><div class="c-head"><b>${esc(c.u || "A simmer")}</b> on <a href="#${l.id}">${esc(l.name)}</a><small>${new Date(c.t).toLocaleDateString("en-GB", {day: "numeric", month: "short", year: "numeric"})}</small></div><p>${esc(c.m)}</p></li>`).join("")}</ul></div>`;
}
function refreshStats(full){ if (full) { const y = scrollY; document.getElementById("view").innerHTML = statsPage(); window.scrollTo(0, y); } else document.getElementById("lot-rows").innerHTML = lotRows(); }
document.addEventListener("change", e => { if (!e.target.closest("#lot-sheet")) return;
  if (e.target.id === "f-world") { statsState.world = e.target.value; statsState.hood = ""; refreshStats(true); }
  if (e.target.id === "f-hood") { statsState.hood = e.target.value; refreshStats(); }
  if (e.target.id === "f-status") { statsState.status = e.target.value; refreshStats(); } });
document.addEventListener("input", e => { if (e.target.id === "f-q") { statsState.q = e.target.value; refreshStats(); } });
document.addEventListener("click", e => { const so = e.target.closest("[data-sort]"); if (so) { statsState.dir = statsState.sort === so.dataset.sort ? -statsState.dir : 1; statsState.sort = so.dataset.sort; refreshStats(); }
  const sw = e.target.closest("[data-sw]"); if (sw) { statsState.world = sw.dataset.sw; statsState.hood = ""; refreshStats(true); document.getElementById("lot-sheet").scrollIntoView({behavior:"smooth"}); } });

// full-size photo viewer
let lb = null;
function openLightbox(l, i){
  const opener = lb ? lb.opener : document.activeElement;
  lb = {l, i, opener};
  let el = document.getElementById("lightbox");
  if (!el) { el = document.createElement("div"); el.id = "lightbox"; el.setAttribute("role","dialog"); el.setAttribute("aria-modal","true"); document.body.appendChild(el);
    el.addEventListener("click", e => { if (e.target === el || e.target.closest("[data-lb=close]")) closeLightbox(); else if (e.target.closest("[data-lb=prev]")) stepLightbox(-1); else if (e.target.closest("[data-lb=next]")) stepLightbox(1); }); }
  const ph = l.photos[i];
  el.innerHTML = `<figure><img src="${ph.src}" alt="${esc(l.name)}: ${esc(ph.caption)}"><figcaption><b>${esc(ph.caption)}</b><span>${esc(l.name)} · ${i+1} of ${l.photos.length}</span></figcaption></figure>
    <button type="button" class="lb-btn close" data-lb="close" aria-label="Close">×</button>${l.photos.length > 1 ? `<button type="button" class="lb-btn prev" data-lb="prev" aria-label="Previous photo">‹</button><button type="button" class="lb-btn next" data-lb="next" aria-label="Next photo">›</button>` : ""}`;
  el.hidden = false; document.body.style.overflow = "hidden"; el.querySelector(".close").focus();
}
function stepLightbox(d){ if (lb) openLightbox(lb.l, (lb.i + d + lb.l.photos.length) % lb.l.photos.length); }
function closeLightbox(){ const el = document.getElementById("lightbox"); if (el) el.hidden = true; document.body.style.overflow = ""; const o = lb && lb.opener; lb = null; if (o && document.contains(o)) o.focus(); }
document.addEventListener("click", e => { const b = e.target.closest(".shot-btn"); if (b) openLightbox(lotIndex[b.dataset.lot], +b.dataset.i); });
document.addEventListener("keydown", e => { if (!lb) return;
  if (e.key === "Tab") { const bs = [...document.querySelectorAll("#lightbox button")]; const k = bs.indexOf(document.activeElement); e.preventDefault(); bs[(k + (e.shiftKey ? -1 : 1) + bs.length) % bs.length]?.focus(); return; }
  if (e.key === "Escape") closeLightbox(); if (e.key === "ArrowLeft") stepLightbox(-1); if (e.key === "ArrowRight") stepLightbox(1); });

// pictures on cards load only when they scroll near the screen
const lazyIO = "IntersectionObserver" in window ? new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { showPic(e.target); lazyIO.unobserve(e.target); } }), {rootMargin: "400px 0px"}) : null;
function showPic(el){ el.style.setProperty(el.dataset.lazy, `url('${el.dataset.src}')`); el.removeAttribute("data-lazy"); }
function lazyPics(root){ root.querySelectorAll("[data-lazy]").forEach(el => lazyIO ? lazyIO.observe(el) : showPic(el)); }
const open = w => w.ready;   // pages that open: owned, ready worlds
function route(){
  closeLightbox();
  const key = location.hash.slice(1) || "home";
  const view = document.getElementById("view");
  let html, active = "home"; const ctx = {};
  const wd = key.startsWith("w-") && worlds.find(w => open(w) && w.id === key.slice(2));
  if (wd) { html = world(wd); active = wd.id; document.title = wd.name + " · Jemma's Sim World"; }
  else if (lotIndex[key]) { const l = lotIndex[key]; ctx.hood = l.hood; ctx.lot = l; html = lot(l); markSeen(l); active = l.world.id; document.title = l.name + " · Jemma's Sim World"; }
  else if (key.startsWith("n-") && hoodIndex[key.slice(2)]) { const x = hoodIndex[key.slice(2)]; ctx.hood = x; html = hoodPage(x); active = x.world.id; document.title = x.name + " · " + x.world.name + " · Jemma's Sim World"; }
  else if (key.startsWith("f-") && worlds.find(w => open(w) && w.id === key.slice(2))) { const w = worlds.find(w => w.id === key.slice(2)); html = families(w); active = w.id; document.title = "Households · " + w.name + " · Jemma's Sim World"; }
  else if (SIM_PAGES[key]) { const s = SIM_PAGES[key], base = s.hh || ANCHOR[s.id]; ctx.sim = s.src; ctx.hh = base; ctx.lot = base.lots[0]; ctx.hood = ctx.lot.hood; html = simPage(s); active = base.world.id; document.title = s.name + " · Jemma's Sim World"; }
  else if (GROUP_PAGES[key]) { const g = GROUP_PAGES[key], base = g.homeHh; ctx.group = g; if (base) { ctx.hh = base; ctx.lot = base.lots[0]; ctx.hood = ctx.lot.hood; } html = groupPage(g); active = g.world && g.world.ready && g.world.owned ? g.world.id : ""; document.title = groupTitle(g) + " · Jemma's Sim World"; }
  else if (hhIndex[key]) { const x = hhIndex[key]; ctx.hh = x; ctx.lot = x.lots[0]; ctx.hood = x.lots[0].hood; html = household(x); active = x.world.id; document.title = x.name + " household · Jemma's Sim World"; }
  else if (key === "stats" || key.startsWith("stats-")) { const w = worlds.find(x => "stats-" + x.id === key); html = statsPage(w ? w.name : (key === "stats" ? null : "")); active = "stats"; document.title = "Stats · Jemma's Sim World"; }
  else if (key === "home") { html = home(); document.title = "Jemma's Sim World"; }
  else { html = `<section class="hero small" style="--c:#8E62CF"><div class="kicker"><i></i><span class="label">Page not found</span></div><h1 style="margin-top:14px">Nothing <em>here</em></h1><p>This link doesn't match any world, neighbourhood, lot or household. It may be an old link from before something was renamed.</p></section>
    <section class="block"><p class="notfound"><a href="#home">${ic("home")}Go to the home page</a><a href="#stats">Search every lot on the Stats page</a></p></section>`; document.title = "Page not found · Jemma's Sim World"; active = ""; }
  const cw = worlds.find(w => w.id === active);
  const root = document.documentElement.style;
  if (cw && cw.deep) { root.setProperty("--deep", cw.deep[0]); root.setProperty("--deep-2", cw.deep[1]); }
  else { root.removeProperty("--deep"); root.removeProperty("--deep-2"); }
  view.innerHTML = html;
  lazyPics(view);
  clearSearch();
  renderNav(active, key, ctx);
  window.scrollTo(0, 0);
  document.body.classList.remove("nav-open");
}

// Community Space lots: all four versions shown as equals (12 Oct). Each version has its own Gallery pictures, notes and stats.
const CS_VERSIONS = DATA.csVersions;
function applyVersion(l, i){
  const v = l.versions[i]; l.vi = i; l.photos = v.photos;
  l.gallery = {...l.baseGallery, title: v.title, url: v.url, likes: v.likes, downloads: v.downloads, value: v.value, packs: v.packs, description: v.description, tags: v.tags, shared: v.shared, label: v.label, others: null, beds: 0, baths: 0};
}
Object.values(lotIndex).forEach(l => { const vs = CS_VERSIONS[l.world.name + "|" + l.lot]; if (vs && l.gallery) { l.versions = vs; l.baseGallery = l.gallery; applyVersion(l, 0); } });
function versionTabs(l){
  const tl = l.versions.reduce((n,v) => n + v.likes, 0), td = l.versions.reduce((n,v) => n + v.downloads, 0);
  return `<div class="versions" style="--h:${l.hood.color}"><span class="label">${l.versions.length} versions of this lot</span>
    <div class="ver-tabs" role="tablist">${l.versions.map((v,i) => `<button type="button" role="tab" data-ver="${i}" aria-selected="${i===l.vi}" class="${i===l.vi?"on":""}"><span class="ver-pic" style="background-image:url('${v.photos[0].thumb}')"></span><span class="ver-txt"><b>${esc(v.label)}</b><small>${v.likes} favourites · ${v.downloads} downloads</small></span></button>`).join("")}</div>
    <small class="ver-total">All ${l.versions.length} together: ${tl} favourites · ${td} downloads</small></div>`;
}
document.addEventListener("click", e => { const b = e.target.closest("[data-ver]"); if (!b) return; const l = lotIndex[location.hash.slice(1)]; if (!l || !l.versions) return;
  applyVersion(l, +b.dataset.ver); const y = scrollY; document.getElementById("view").innerHTML = lot(l); lazyPics(document.getElementById("view")); window.scrollTo(0, y); document.querySelector(`[data-ver="${b.dataset.ver}"]`)?.focus(); });
document.getElementById("menuIco").innerHTML = ic("menu");
document.getElementById("searchIco").innerHTML = ic("search");
addEventListener("hashchange", route);
document.getElementById("menuBtn").addEventListener("click", () => document.body.classList.toggle("nav-open"));
document.getElementById("scrim").addEventListener("click", () => document.body.classList.remove("nav-open"));
route();
