// Jemma's Sim World: the page code. Everything is drawn from DATA (js/data.js, built by tools/build.py).
const FAMILY_LINKS = DATA.familyLinks;
const TENANTS = DATA.tenants;
const NO_LANDLORD = new Set(DATA.noLandlord || []);
const NAME_FIX = DATA.nameFix;
const ic = n => ICONS[n].replace("<svg ", '<svg class="i" aria-hidden="true" ');
// shown text uses curly apostrophes and single quotes (12 Oct); ids and links are untouched
// ’n’, ’Round, ’til and ’tis are apostrophes, not opening quotes (Thrift ’n’ Fish, ’Round the Fire Festival)
const curly = s => String(s ?? "").replace(/(^|[\s(])'(?=n'|Round\b|til\b|tis\b)/g, "$1’").replace(/(^|[\s(\[“"—-])'/g, "$1‘").replace(/'/g, "’")
  .replace(/(^|[\s(\[‘—-])"/g, "$1“").replace(/"/g, "”");   // double quotes too (19 Oct)
const esc = s => curly(s).replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
// a value that code reads back (select options): HTML-escaped but kept straight, so it still matches the data (15 Nov)
const escAttr = s => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
// lots that can be built: the game's own lots ("N/A", e.g. Sylvan Glade) are left out of every "N of M built" (15 Nov)
const buildable = ls => ls.filter(l => l.built === true || l.built === false);
const slug = s => String(s).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/&/g,"and").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
// neighbourhood colours: muted jewel tones
const HOOD_COLORS = ["#B4573E","#6A5A9E","#2F6E9C","#B98A2E","#3C8459","#AE5578","#2B8A86","#8C7A3A"];

// families in worlds she doesn't own yet (her choice A, 19 Oct; ported from for-jemma/prototypes/not-owned): the build keeps a
// not-owned world's lots only in DATA.stats, so give those worlds back the neighbourhoods and lots their households live on
// (homes only). The households, Sims, trees and dynasties are then made exactly as for owned worlds.
DATA.worlds.filter(w => !w.owned && DATA.households[w.name]).forEach(w => {
  const names = Object.keys(DATA.households[w.name]), hoods = {};
  DATA.stats.filter(r => r.w === w.name && r.who && names.includes(r.who.replace(/\?$/, "").trim())).forEach(r =>
    (hoods[r.n] ||= {name: r.n, desc: "", color: w.color, lots: []}).lots.push({lot: r.lot, mine: r.mine, type: r.type, size: r.size,
      who: r.who, whoNote: null, built: r.built, shared: r.shared, sims: r.sims, gallery: null, photos: []}));
  w.hoods = Object.values(hoods);
});

// smooth scrolling only for people who haven't asked their system for less motion
const SMOOTH = () => matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
const worlds = DATA.worlds, lotIndex = {}, hhIndex = {}, hoodIndex = {};
// a household's own extras from the data: its picture (a screenshot in shots/), origin (Premade or Mine), played, Neighbourhood Stories
const hhMore = x => ({gallery: x.galleryCard, portrait: x.portrait, libraryPic: x.libraryPic, origin: x.origin, played: x.played, stories: x.stories, single: x.single, bio: x.bio, story: x.story});
// the households a world counts and lists: everyone but the NPC households her plan names (22 Oct)
const homeHhs = w => Object.values(w.households).filter(x => !x.npc);
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
      if (l.type) { l.typeFull = l.type; l.type = l.type.replace(/\s*\((?!\d+\??\))[^)]*\)?/g, "").trim(); }
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
    if (t.unit) hh.unit = t.unit;
    hh.lots.push(l); hhIndex[hh.id] = hh; (l.tenants ||= []).push(hh); })));
  // related households Jemma confirmed (12 Oct)
  (FAMILY_LINKS[w.name] || []).forEach(([a, b]) => { const A = Object.values(w.households).find(x => x.name === a), B = Object.values(w.households).find(x => x.name === b);
    if (A && B) { if (!A.links.some(x => x.to === b)) A.links.push({to: b, type: "Family", note: "Related households"}); if (!B.links.some(x => x.to === a)) B.links.push({to: a, type: "Family", note: "Related households"}); } });
  // households sharing a surname are linked as family automatically
  const hhs = Object.values(w.households);
  hhs.forEach(a => hhs.forEach(b => { if (a !== b && a.family === b.family && !a.links.some(x => x.to === b.name)) a.links.push({to: b.name, type: "Family", note: "Same family, separate homes"}); }));
  hhs.forEach(a => a.links.forEach(x => x.hh = hhs.find(b => b.name === x.to)));
  // NPC households her plan names ("The Scotts (*NPC)" at The Gnome's Arms) keep their page but count like other NPCs: not as the world's households (her call, 22 Oct)
  Object.values(w.households).forEach(x => { x.npc = x.lots.some(l => l.npc); });
  const all = w.hoods.flatMap(h => h.lots);
  const known = k => all.filter(l => l[k] === true || l[k] === false);
  const cnt = k => all.filter(l => l[k] === true).length;
  const pct = k => known(k).length ? Math.round(100 * cnt(k) / known(k).length) : 0;
  w.stats = {lots: all.length, built: cnt("built"), shared: cnt("shared"), shots: cnt("shots"), sims: cnt("sims"), simsOf: known("sims").length,
    pBuilt: pct("built"), pShared: pct("shared"), pShots: pct("shots"), hh: homeHhs(w).length};
  // Sims made is counted per household (from the spreadsheet's Sims Made column on their home)
  w.stats.hhMade = homeHhs(w).filter(x => x.lots.some(l => l.sims === true)).length;
  w.stats.pHH = w.stats.hh ? Math.round(100 * w.stats.hhMade / w.stats.hh) : 0;
});
// owners of a residential rental with no home anywhere else live in one of its units, as the landlord (the Cahyaputris at Taka Soi 15,
// Aloisio Romualdo at Casa Do Corsário; 19 Oct check); owners with a home elsewhere (the Kirklands, the Robles) stay owners only
Object.values(hhIndex).forEach(h => { if (h.tenantOf || h.lots.some(l => !l.owned && l.hh === h)) return;
  const r = h.lots.find(l => l.hh === h && l.owned && /rental/i.test(l.type) && !/vacation/i.test(l.type)); if (r) r.owned = false; });
// a business owned from another world (the Newcrest Kirklands own Magnolia Mall, 19 Oct): when the owners have no Sims or home in the
// lot's world and exactly one household of that family elsewhere has Sims, the lot joins that household instead of an empty one
Object.values(hhIndex).filter(h => !h.sims.length && h.lots.every(l => l.owned)).forEach(h => {
  const homes = Object.values(hhIndex).filter(o => o !== h && o.family === h.family && o.sims.length && o.world !== h.world);
  if (homes.length !== 1) return; const to = homes[0];
  h.lots.forEach(l => { l.hh = to; to.lots.push(l); });
  delete hhIndex[h.id]; delete h.world.households[slug(h.name)]; const st = h.world.stats, left = homeHhs(h.world);
  st.hh = left.length; st.hhMade = left.filter(x => x.lots.some(l => l.sims === true)).length; st.pHH = st.hh ? Math.round(100 * st.hhMade / st.hh) : 0;
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
const FAMILY_CACHE = {partners: new Map(), ancestors: new Map()};   // see partnersOf
const sx = (s, m, f, x) => s === "m" ? m : s === "f" ? f : x;
const surname = n => n.trim().split(/\s+/).slice(1).join(" ") || n.trim();
const firstName = s => s.name.trim().split(/\s+/)[0];
const aAn = n => /^[aeiou]/i.test(n) ? "an" : "a";
function addSim(id, s, hh){
  const sur = surname(s.name), born = s.born || sur, line = slug(born), into = s.born && slug(s.born) !== slug(sur) ? slug(sur) : null;
  FAMILIES[line] ||= {name: born}; if (into) FAMILIES[into] ||= {name: sur};
  SIMS[id] = {...s, id, src: s, hh: hh || null, world: hh ? hh.world : worlds.find(w => w.id === s.world) || null, home: s.where, line, into,
    ph: !!s.placeholder, phText: s.placeholder ? "Unknown" : "",
    partners: (s.partners || []).map(([p, k]) => [p, PARTNER_KINDS[k] || "unknown"])};
}
worlds.forEach(w => Object.values(w.households).forEach(hh => hh.sims.forEach(sm => { if (sm.sid) addSim(sm.sid, sm, hh); })));
Object.entries(DATA.people || {}).forEach(([id, p]) => addSim(id, p));
// a parent who isn't on the family tree stands beside the other parent, joined by a faint dotted line
Object.values(SIMS).forEach(s => { const pp = (s.parents || []).filter(p => SIMS[p]);
  pp.filter(p => SIMS[p].ph).forEach(ph => pp.filter(q => !SIMS[q].ph).forEach(q => { if (!partnersOf(q).some(([x]) => x === ph)) SIMS[q].partners.push([ph, "unknown"]); })); });
FAMILY_CACHE.partners.clear(); FAMILY_CACHE.ancestors.clear();   // partners were just added above
// a family nobody on the site was born into and stayed in (Bella was born a Bachelor)
Object.keys(FAMILIES).forEach(f => { const own = Object.values(SIMS).filter(s => !s.ph && s.line === f); if (own.length && own.every(s => s.into)) FAMILIES[f].note = `No ${FAMILIES[f].name}s on the family tree`; });

/* relationship tags (the prototype's six groups); romance words are the game's (Spouse, Engaged, Partner): her decision, 17 Oct */
const TAG_GROUPS = {
  family:   {name: "Family",        icon: "network"},
  romance:  {name: "Romance",       icon: "heart"},
  friends:  {name: "Friends",       icon: "smile"},
  conflict: {name: "Enemies",       icon: "frown"},   // smile and frown as a pair (her pick, 19 Oct)
  work:     {name: "Work & school", icon: "briefcase"},
  dynasty:  {name: "Dynasty",       icon: "crown"},
};
const TAGS = {
  family: {g: "family", name: "Family"}, spouse: {g: "romance", name: "Spouse"}, engaged: {g: "romance", name: "Engaged"}, partner: {g: "romance", name: "Partner"},
  ex: {g: "romance", name: "Ex"}, "late-spouse": {g: "romance", name: "Deceased spouse"}, crush: {g: "romance", name: "Crush"},
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
// clubs (Get Together): members from each Sim's "clubs" [{name, role}]; the club's own details, and members who aren't on the
// site yet ("others": [name, role, household id]), from data/groups.json. Based in the world of the lot where it meets.
Object.entries((DATA.groups || {}).clubs || {}).forEach(([name, c]) => {
  const id = "g-club-" + slug(name), place = c.place && lotIndex[c.place] ? c.place : null;
  const g = GROUP_PAGES[id] = {...c, kind: "club", name, id, place, members: [], world: place ? lotIndex[place].world : worlds.find(w => w.id === c.world) || null};
  (c.others || []).forEach(([who, role, hhId]) => { const o = SIM_BY_NAME[who] || "x-" + slug(who);
    SIMS[o] ||= {id: o, name: who, sex: "x", stub: true, partners: []}; if (hhId && hhIndex[hhId]) SIMS[o].hh ||= hhIndex[hhId]; SIM_BY_NAME[who] ||= o;
    g.members.push([o, role || "member"]); });
});
// university organisations (Discover University): members from each Sim's "orgs"; details from data/groups.json; coloured by university
const UNIS = {uob: {name: "University of Britechester", colour: "#4E8B66", trim: "#D7AC0D"}, foxbury: {name: "Foxbury Institute", colour: "#CE3B3B", trim: "#D7AC0D"}, secret: {name: "Both (it’s secret)", colour: "#3E2458", trim: "#7A5A9E"}};
const kindName = g => g.kind === "org" && g.uni === "secret" ? "Secret society" : GROUP_KINDS[g.kind].name;
Object.entries((DATA.groups || {}).organisations || {}).forEach(([name, o]) => { const id = "g-org-" + slug(name);
  GROUP_PAGES[id] = {...o, kind: "org", name, id, members: [], colour: (UNIS[o.uni] || {}).colour, trim: (UNIS[o.uni] || {}).trim, world: worlds.find(w => w.id === "britechester") || null}; });
Object.values(SIMS).forEach(s => (s.orgs || []).forEach(c => { const g = GROUP_PAGES["g-org-" + slug(c.name)]; if (g && !g.members.some(([m]) => m === s.id)) g.members.push([s.id, c.role || "member"]); }));
Object.values(SIMS).forEach(s => (s.clubs || []).forEach(c => { const g = GROUP_PAGES["g-club-" + slug(c.name)]; if (g && !g.members.some(([m]) => m === s.id)) g.members.push([s.id, c.role || "member"]); }));
Object.values(GROUP_PAGES).filter(g => !g.members.length).forEach(g => delete GROUP_PAGES[g.id]);   // only groups someone on the site is in
const groupTitle = g => g.kind === "dynasty" ? `${g.name} dynasty` : g.name;
const groupsOf = id => Object.values(GROUP_PAGES).filter(g => g.members.some(([m]) => m === id)).map(g => [g.id, g, g.members.find(([m]) => m === id)[1]]);
const dynastyOf = id => groupsOf(id).find(([, g]) => g.kind === "dynasty");
// a member as a small box, like the tree's cards: based here = highlighted; elsewhere = lighter, with a chip for where they live
const roleBadge = (kind, role, g) => { const R = GROUP_KINDS[kind].roles[role] || role, dyn = kind === "dynasty";
  if (kind === "org") return `<span class="badge o-badge" style="--u:${g.colour};--t:${g.trim}">${ic(g.uni === "secret" ? "book-open-text" : "graduation-cap")}${esc(R)}</span>`;
  return `<span class="badge ${dyn ? "r-" + role : "c-" + role}">${ic(dyn ? "crown" : "flag")}${esc(R)}</span>`; };
function memberCard(g, id, role){
  const s = SIMS[id], dyn = g.kind === "dynasty", here = true, href = simLinkTo(id), R = GROUP_KINDS[g.kind].roles[role] || role, crown = ["head", "heir", "leader"].includes(role);
  return `<div class="mcard ${here ? "here" : "away"} ${s.late ? "late" : ""}" style="--w:${simColour(id)}"><span class="tm">${initial(s.name)}</span>
    <div class="tn">${href ? `<a href="${href}">${esc(s.name)}</a>` : esc(s.name)}</div><div class="ts">${esc([s.age, s.state].filter(Boolean).join(" · "))}</div>
    <div class="tchip">${homeChip(s)}</div>${roleBadge(g.kind, role, g)}</div>`;
}

/* ---------- family words, worked out (never typed) ---------- */
// family look-ups are cached once the data is set up (300+ Sims made every Sim page slow); FAMILY_CACHE is cleared after setup
function partnersOf(id){
  if (FAMILY_CACHE.partners.has(id)) return FAMILY_CACHE.partners.get(id);
  const out = partnersAll(id); FAMILY_CACHE.partners.set(id, out); return out;
}
function partnersAll(id){
  const out = (SIMS[id].partners || []).filter(([p]) => SIMS[p]);
  Object.values(SIMS).forEach(t => (t.partners || []).forEach(([p, k]) => { if (p === id && !out.some(x => x[0] === t.id)) out.push([t.id, k]); }));
  return out;
}
function ancestors(id, d = 0, out = new Map()){
  if (!out.has(id) || out.get(id) > d) out.set(id, d);
  (SIMS[id].parents || []).forEach(p => { if (SIMS[p]) ancestors(p, d + 1, out); });   // through unknown parents too, so their children count as siblings
  return out;
}
const ancestorsOf = id => { if (!FAMILY_CACHE.ancestors.has(id)) FAMILY_CACHE.ancestors.set(id, ancestors(id)); return FAMILY_CACHE.ancestors.get(id); };
function blood(a, b){
  const A = ancestorsOf(a), B = ancestorsOf(b); let best = null;
  A.forEach((da, x) => { if (B.has(x)) { const db = B.get(x); if (!best || da + db < best[0] + best[1]) best = [da, db]; } });
  return best;
}
const partnerWord = kind => !TAGS[kind] ? "Partner" : kind === "ex" ? "Ex-Spouse" : TAGS[kind].name;
const spousesOf = id => partnersOf(id).filter(([, k]) => k === "spouse" || k === "late-spouse").map(([q]) => q);
function relWord(a, b){   // what b is to a
  const s = SIMS[b].sex, p = partnersOf(a).find(x => x[0] === b);
  if (p && p[1] === "spouse" && SIMS[b].late && !SIMS[a].late) return "Deceased spouse";
  if (p) return p[1] === "late-spouse" && SIMS[a].late && !SIMS[b].late && !SIMS[b].ph ? sx(s, "Widower", "Widow", "Spouse") : partnerWord(p[1]);
  const r = blood(a, b);
  if (r) {
    const [da, db] = r;
    if (da === 0) return [null, sx(s, "Son", "Daughter", "Child"), sx(s, "Grandson", "Granddaughter", "Grandchild"), sx(s, "Great-grandson", "Great-granddaughter", "Great-grandchild")][db] || "Descendant";
    if (db === 0) return [null, sx(s, "Father", "Mother", "Parent"), sx(s, "Grandfather", "Grandmother", "Grandparent"), sx(s, "Great-grandfather", "Great-grandmother", "Great-grandparent")][da] || "Ancestor";
    if (da === 1 && db === 1) return sx(s, "Brother", "Sister", "Sibling");
    if (da === 2 && db === 1) return sx(s, "Uncle", "Aunt", "Parent’s sibling");
    if (da === 3 && db === 1) return sx(s, "Great-uncle", "Great-aunt", "Grandparent’s sibling");
    if (da === 1 && db === 2) return sx(s, "Nephew", "Niece", "Sibling’s child");
    if (da === 1 && db === 3) return sx(s, "Great-nephew", "Great-niece", "Sibling’s grandchild");
    if (da === 2 && db === 2) return "Cousin";
    return "Relative";
  }
  // in-laws, both ways round (19 Nov): a late spouse counts as a spouse, whichever side's record says so
  const wedA = spousesOf(a), wedB = spousesOf(b);
  if (wedA.some(q => (r => r && r[0] === 1 && r[1] === 0)(blood(q, b)))) return sx(s, "Father-in-law", "Mother-in-law", "Parent-in-law");   // a spouse's parent
  if (wedB.some(q => (r => r && r[0] === 0 && r[1] === 1)(blood(a, q)))) return sx(s, "Son-in-law", "Daughter-in-law", "Child-in-law");   // a child's spouse
  if (wedA.some(q => (r => r && r[0] === 1 && r[1] === 1)(blood(q, b))) || wedB.some(q => (r => r && r[0] === 1 && r[1] === 1)(blood(a, q))))
    return sx(s, "Brother-in-law", "Sister-in-law", "Sibling-in-law");   // a spouse's sibling, or a sibling's spouse
  return null;
}
// a Sim's family, closest first (partners, parents, children, siblings, then the rest)
const FAMILY_ORDER = ["Spouse", "Engaged", "Partner", "Ex-Spouse", "Deceased spouse", "Mother", "Father", "Parent", "Daughter", "Son", "Child", "Sister", "Brother", "Sibling",
  "Grandmother", "Grandfather", "Grandparent", "Granddaughter", "Grandson", "Grandchild", "Great-grandmother", "Great-grandfather", "Great-grandparent",
  "Aunt", "Uncle", "Great-aunt", "Great-uncle", "Niece", "Nephew", "Great-niece", "Great-nephew", "Cousin", "Widow", "Widower", "Mother-in-law", "Father-in-law", "Daughter-in-law", "Son-in-law", "Sister-in-law", "Brother-in-law"];
function familyOf(id){
  const s = SIMS[id], rank = w => { const i = FAMILY_ORDER.indexOf(w); return i < 0 ? 99 : i; };
  const band = o => SIMS[o].hh && SIMS[o].hh === s.hh ? 0 : SIMS[o].late ? 2 : 1;   // household, living elsewhere, late
  return Object.keys(SIMS).filter(o => o !== id && !SIMS[o].ph).map(o => [o, relWord(id, o)]).filter(([, w]) => w)
    .sort((x, y) => rank(x[1]) - rank(y[1]) || band(x[0]) - band(y[0]));
}
const membersOf = hh => Object.keys(SIMS).filter(id => SIMS[id].hh === hh);
// where a household lives: not the rentals or businesses it only owns (neighbours are people who live nearby, her ask 24 Oct)
const homesOf = hh => hh.lots.filter(l => !l.owned || hh.tenantOf === l);
// a household's Sims oldest to youngest (her ask, 24 Oct); the same life stage keeps the plan's order
const AGE_ORDER = ["Elder", "Adult", "Young Adult", "Teen", "Child", "Toddler", "Infant", "Baby"];
const byAge = ids => ids.slice().sort((a, b) => (AGE_ORDER.indexOf(SIMS[a].age) + 1 || 99) - (AGE_ORDER.indexOf(SIMS[b].age) + 1 || 99) || (SIMS[b].ageDays ?? -1) - (SIMS[a].ageDays ?? -1));
// the game's own label for a Sim with no job who has a child, teen or younger in their household (careers/career_unemployment):
// "Stay-at-Home Mom/Dad" (24 Oct, her ask)
// a career whose branch has the same name says it once: "Freelance Programmer (level 1)", not "Freelance Programmer · Freelance Programmer (level 1)"
const careerText = c => c ? String(c).replace(/^(.+?) · \1(?= \(|$)/, "$1") : c;
const stayAtHome = s => { if (s.career || s.late || isAnimal(s) || !s.hh || !["Young Adult", "Adult", "Elder"].includes(s.age)) return "";
  const kids = membersOf(s.hh).filter(id => ["Teen", "Child", "Toddler", "Infant", "Baby"].includes(SIMS[id].age) && (SIMS[id].parents || []).includes(s.id));
  return kids.length ? `Stay-at-Home ${s.sex === "f" ? "Mom" : s.sex === "m" ? "Dad" : "Parent"}` : ""; };
/* ---------- pets and horses (trial, 19 Oct: her choice A, "more info") ----------
   Stored with the Sims (their kind in `state`), but not Sims: left out of Sim counts and the Sims family tree, listed under the
   Sims as "The animals", with their own small family tree where one has a mother or father, and a pet page instead of a Sim page. */
const ANIMAL = /^(Horse|Cat|Dog|Small Dog|Large Dog)$/i, isAnimal = s => !!s && ANIMAL.test(s.state || "");
const animalIcon = s => ic(/cat/i.test(s.state) ? "cat" : /dog/i.test(s.state) ? "dog" : /horse/i.test(s.state) ? "horse-head" : "paw-print");
// the game's words for young animals
const stageOf = s => isAnimal(s) && /^(Child|Baby|Toddler)$/.test(s.age || "") ? ({Horse: "Foal", Cat: "Kitten"}[s.state] || "Puppy") : s.age;
// horse competitions: wins are [competition, level, place] from the game (Beginner to Master; 1st, 2nd, 3rd = gold, silver, bronze)
const COMPS = [["Show Jumping", "Show Jumping"], ["Barrel Racing", "Barrel Racing"], ["Endurance Racing", "Endurance Racing"], ["Western Pleasure", "Western Pleasure"]], LEVELS = ["Beginner", "Intermediate", "Expert", "Master"];
const isChampion = s => (s.wins || []).some(w => w[0] === "Ultimate Horse Championship" && w[2] === "1st") || !!s.champion;
const medal = place => place ? `<span class="medal m${place[0]}" title="${place} place">${place}</span>` : `<span class="muted">—</span>`;
function horseComps(s){   // the game keeps each horse's best result per competition: its level and place
  const wins = s.wins || [], best = c => wins.filter(w => w[0] === c).sort((a, b) => LEVELS.indexOf(b[1]) - LEVELS.indexOf(a[1]) || a[2].localeCompare(b[2]))[0];
  return `<div class="sheet-wrap"><table class="sheet comps"><thead><tr><th scope="col">Competition</th><th scope="col">Best level</th><th scope="col">Medal</th></tr></thead><tbody>
    ${[...COMPS, ["Ultimate Horse Championship", "Ultimate Horse Championship"]].map(([k, n]) => { const b = best(k);
      return `<tr><th scope="row">${n}</th><td>${b ? esc(b[1] || "—") : `<span class="muted">Not won yet</span>`}</td><td>${b ? medal(b[2]) : `<span class="muted">—</span>`}</td></tr>`; }).join("")}</tbody></table></div>`;
}
// where a Sim lives, as a chip in the world's colour
function homeChip(s, worldOnly){
  const hh = s.hh, w = s.world;
  if (hh) return `<a class="hhchip" href="#${hh.id}" style="--w:${wColour(hh.world)}" title="${esc(hhWord(hh.name))}, ${esc(hh.world.name)}">${worldOnly ? "" : esc(hh.name) + " · "}${esc(hh.world.name)}</a>`;
  if (w) return `<span class="hhchip" style="--w:${wColour(w)}" title="${esc(s.home || w.name + (w.owned ? "" : " (not owned)"))}">${s.hhName && !worldOnly ? esc(s.hhName) + " · " : ""}${esc(w.name)}</span>`;
  return "";
}
const wColour = w => w ? (w.glow || w.color) : "#8A918C";
// where another Sim's link goes: their Sim page, else their household, else nowhere
const simLinkTo = o => SIM_PAGES["s-" + o] ? "#s-" + o : SIMS[o].hh ? "#" + SIMS[o].hh.id : "";
function simWhere(o){
  const t = SIMS[o]; if (t.late) return "deceased";
  if (t.hh) return `${hhWord(t.hh.name)} · ${t.hh.world.name}`;
  const w = t.world; return w ? `${t.hhName ? t.hhName + " · " : ""}${w.name}${w.owned ? "" : " (not owned)"}${t.noHome ? " · no home" : ""}` : "";
}
const simColour = o => { const t = SIMS[o]; return t.late ? "#A3AAA5" : wColour(t.hh ? t.hh.world : t.world); };
// origin (her words, 17 Oct): "Premade" for the game's Sims and households (even when she changes them), "Mine" for hers and children born in her game
const originTag = o => /^mine$/i.test(o || "") ? "Mine" : "Premade";   // plain, like the other details (her feedback, 17 Oct)

/* ---------- a household's family tree (her rules, 17 Oct) ----------
   Centred on the Sims who live there; built from family links only (parents and partners), never from who lives together.
   Everyone in the household, all their blood relatives wherever they live, and those relatives' partners ("plus ones").
   Worlds don't matter. A Sim with no family anywhere isn't drawn; a household where nobody has family gets no tree at all. */
// a tree centred on some Sims: a household's (treeOf) or one Sim's own (on their page, 17 Oct)
const treeOf = hh => treeAround(membersOf(hh).filter(id => !isAnimal(SIMS[id])));
const animalTreeOf = hh => treeAround(membersOf(hh).filter(id => isAnimal(SIMS[id])), true);
function treeAround(centre, animals = false){
  const all = Object.keys(SIMS).filter(o => isAnimal(SIMS[o]) === animals), set = new Set();
  centre.forEach(m => all.forEach(o => { if (!SIMS[o].ph && blood(m, o)) set.add(o); }));   // blood(m, m) counts: members are in
  [...set].forEach(id => partnersOf(id).forEach(([p]) => set.add(p)));                               // plus ones (and placeholders like Mortimer's father)
  [...set].forEach(id => (SIMS[id].parents || []).forEach(p => { if (SIMS[p] && SIMS[p].ph) set.add(p); }));
  const famLinked = (a, b) => (SIMS[a].parents || []).includes(b) || (SIMS[b].parents || []).includes(a) || partnersOf(a).some(([p]) => p === b);
  const ids = [...set].filter(a => [...set].some(b => b !== a && famLinked(a, b)));
  return ids.length > 1 ? ids.sort((a, b) => all.indexOf(a) - all.indexOf(b)) : [];
}
// Sim pages: every household Sim, and anyone else on a household's tree (Cornelia, Agnes…), who belongs to the first such household
Object.values(SIMS).forEach(s => { if (s.hh && !s.stub) SIM_PAGES["s-" + s.id] = s; });
worlds.forEach(w => Object.values(w.households).forEach(hh => { if (hh.sims.some(sm => sm.sid)) treeOf(hh).forEach(id => { ANCHOR[id] ||= hh; }); }));
FAMILY_CACHE.partners.clear(); FAMILY_CACHE.ancestors.clear();   // set-up done: cache from here on
Object.values(SIMS).forEach(s => { if (!s.hh && !s.ph && !s.stub && ANCHOR[s.id]) SIM_PAGES["s-" + s.id] = s; });

/* ---------- the drawn family tree (decided 17 Oct) ----------
   Founders at the top, one row per generation, couples side by side (double line = spouses, dashed = partners, broken = ex,
   faint = late spouse), children hang below. Cards: monogram, name, life stage, where they live.
   o: {line (the household's family), here (the household: its Sims highlighted), compact, cw, ch, labels (generation labels)} */
function fitTree(ids, o){
  const wide = drawTree(ids, {...o, cw: 170});
  return +wide.match(/width:(\d+)px/)[1] <= 860 ? wide : drawTree(ids, {...o, cw: 146});
}
function drawTree(ids, o = {}){
  const C = o.compact, CW = o.cw || (C ? 136 : 188), CH = o.ch || (C ? 112 : 128), CG = C ? 28 : 38, SG = C ? 14 : 26, RG = C ? 44 : 58, LX = o.labels === false ? 6 : 96, PAD = 14;
  const inT = new Set(ids), S = id => SIMS[id];
  const ps = id => (S(id).parents || []).filter(p => inT.has(p));
  // animals have no partners in the game: a foal's mother and father are drawn side by side, joined by a thin line (her feedback, 19 Oct: Longface)
  const coParents = id => !isAnimal(S(id)) ? [] : [...new Set(ids.filter(c => (S(c).parents || []).includes(id)).flatMap(c => S(c).parents.filter(p => p !== id && inT.has(p))))].map(p => [p, "coparent"]);
  const prs = id => [...partnersOf(id).filter(([p]) => inT.has(p)), ...coParents(id)];
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
  // siblings oldest to youngest, left to right (her rule, 24 Oct); same life stage keeps the plan's order
  const STAGE = ["Elder", "Adult", "Young Adult", "Teen", "Child", "Toddler", "Infant", "Baby"];
  const stage = u => { const c = u.members.find(x => ps(x).length), i = STAGE.indexOf((S(c).age || "").replace(/^Late /, "")); return i < 0 ? -1 : i; };
  const days = u => S(u.members.find(x => ps(x).length)).ageDays ?? -1;   // same stage: further into it is older (tools/age_days.py)
  units.forEach(u => u.kids.sort((a, b) => stage(a) - stage(b) || days(b) - days(a)));
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
  // couples who were both born into the tree sit in their own parents' groups: their marriage line joins the two cards (Eric Lewis and Alice Spencer-Kim, 19 Oct)
  const kindOf = (a, b) => (prs(a).find(([p]) => p === b) || prs(b).find(([p]) => p === a) || [])[1];
  const cross = [];
  ids.forEach(a => prs(a).forEach(([b]) => { if (a < b && inT.has(b) && unitOf[a] !== unitOf[b] && unitOf[a].y === unitOf[b].y) cross.push([a, b]); }));
  const crossMid = (a, b) => { const [l, r] = cardX(a) < cardX(b) ? [a, b] : [b, a]; return [(cardX(l) + CW + cardX(r)) / 2, cardX(l) + CW, cardX(r)]; };
  const coupleLine = (x1, x2, y, k) => {
    const dash = k === "partner" || k === "ex" ? 'stroke-dasharray="5 4"' : k === "unknown" ? 'stroke-dasharray="2 4"' : "";
    const op = k === "late-spouse" || k === "unknown" ? 'opacity=".5"' : "";
    let l = `<line x1="${x1}" y1="${y}" x2="${x2}" y2="${y}" stroke="${ink}" stroke-width="2.5" ${dash} ${op}/>`;
    if (k === "spouse" || k === "late-spouse") l += `<line x1="${x1}" y1="${y + 4}" x2="${x2}" y2="${y + 4}" stroke="${ink}" stroke-width="1.2" ${op}/>`;
    if (k === "ex") { const m = (x1 + x2) / 2; l += `<path d="M${m - 5} ${y + 6} L${m - 1} ${y - 6} M${m + 1} ${y + 6} L${m + 5} ${y - 6}" stroke="${ink}" stroke-width="1.6"/>`; }
    return l; };
  cross.forEach(([a, b]) => { const [, x1, x2] = crossMid(a, b); svg += coupleLine(x1, x2, unitOf[a].y + CH / 2, kindOf(a, b)); });
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
      const other = pp.find(p => u.members.indexOf(p) < 0), cp = other && cross.find(([a, c]) => (a === other || c === other) && pp.includes(a) && pp.includes(c));
      if (idx.length === 2 && idx[1] - idx[0] === 1) { ox = u.x + idx[1] * (CW + CG) - CG / 2; oy = u.y + CH / 2 + 4; }
      else if (cp) { ox = crossMid(...cp)[0]; oy = u.y + CH / 2 + 4; }
      else { ox = u.x + idx[0] * (CW + CG) + CW / 2; oy = u.y + CH; }
      const by = u.y + CH + RG / 2, cxs = kids.map(c => cardX(c) + CW / 2);
      svg += `<path d="M${ox} ${oy} V${by} M${Math.min(ox, ...cxs)} ${by} H${Math.max(ox, ...cxs)} ${cxs.map(c => `M${c} ${by} V${top(gen[kids[0]])}`).join(" ")}" fill="none" stroke="${ink}" stroke-width="1.6"/>`;
    });
  });
  // a child whose other parent sits elsewhere in the tree, not as a partner (Afua Ananou: Adekoya Darong's secret daughter, 19 Oct):
  // a thin dashed line from that parent down to the child
  ids.forEach(c => { const pp = ps(c); if (pp.length !== 2) return; const home = unitOf[c].parent;
    if (cross.some(([a, b]) => pp.includes(a) && pp.includes(b))) return;
    pp.filter(p => unitOf[p] !== home).forEach(p => { const px = cardX(p) + CW / 2, py = unitOf[p].y + CH, cx = cardX(c) + CW / 2, cy = unitOf[c].y, my = cy - RG / 2 + 8;
      svg += `<path d="M${px} ${py} V${my} H${cx} V${cy}" fill="none" stroke="${ink}" stroke-width="1.2" stroke-dasharray="3 4"/>`; }); });
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
  const sub = [nee(s), stageOf(s), s.state, s.noHome ? "no home" : "", s.galleryOnly ? "on EA’s Gallery" : ""].filter(Boolean).join(" · ");   // galleryOnly: a Maxis Gallery relative, in no world (19 Oct)
  const chips = [];
  const housemate = o.me && s.hh && s.hh === SIMS[o.me].hh;   // on a Sim page, their own household needs no chip either
  if (!s.late && !here && !housemate) chips.push(homeChip(s));
  // dynasty heads and heirs keep a small badge (the dynasty itself has its own page)
  const dy = dynastyOf(id), role = dy && dy[2], badge = role ? roleBadge("dynasty", role) : "";
  // names open the Sim's own page, or their household where there's no Sim page yet
  const href = simLinkTo(id), nm = href ? `<a href="${href}">${esc(s.name)}</a>` : esc(s.name);
  return `<div class="tc ${C} ${s.late ? "late" : ""} ${s.notInGame ? "nig" : ""} ${o.here ? (here ? "here" : "away") : ""}" style="${pos};--w:${wColour(w)}" data-sim="${id}"><span class="tm">${initial(s.name)}</span>${s.late ? `<span class="dead" title="Deceased">†</span>` : ""}<div class="tn">${nm}</div><div class="ts">${esc(sub)}</div>
    <div class="tchip" style="display:flex;flex-wrap:wrap;gap:4px">${chips.filter(Boolean).join("")}</div>${badge}</div>`;
}
// the key lists only what this tree actually shows
function treeKey(ids, here = false, colour = "", away = false){
  const inTree = new Set(ids), kinds = new Set();
  ids.forEach(id => (SIMS[id].partners || []).forEach(([p, k]) => { if (inTree.has(p)) kinds.add(k); }));
  const item = (on, html) => on ? `<span>${html}</span>` : "";
  return `<div class="tree-key">
  ${here && away ? `<span><span class="k-box here" ${colour ? `style="--w:${colour}"` : ""}></span>Lives here</span><span><span class="k-box away"></span>Lives elsewhere</span>` : ""}
  ${item(kinds.has("spouse"), `<svg class="k" viewBox="0 0 34 10"><line x1="0" y1="3" x2="34" y2="3" stroke="var(--muted)" stroke-width="2.5"/><line x1="0" y1="7" x2="34" y2="7" stroke="var(--muted)" stroke-width="1.2"/></svg>Spouses`)}
  ${item(kinds.has("partner") || kinds.has("engaged"), `<svg class="k" viewBox="0 0 34 10"><line x1="0" y1="5" x2="34" y2="5" stroke="var(--muted)" stroke-width="2.5" stroke-dasharray="5 4"/></svg>Partners`)}
  ${item(kinds.has("ex"), `<svg class="k" viewBox="0 0 34 12"><line x1="0" y1="6" x2="34" y2="6" stroke="var(--muted)" stroke-width="2.5" stroke-dasharray="5 4"/><path d="M12 12 L16 0 M18 12 L22 0" stroke="var(--muted)" stroke-width="1.6"/></svg>Ex`)}
  ${item(kinds.has("late-spouse"), `<svg class="k" viewBox="0 0 34 10" opacity=".5"><line x1="0" y1="3" x2="34" y2="3" stroke="var(--muted)" stroke-width="2.5"/><line x1="0" y1="7" x2="34" y2="7" stroke="var(--muted)" stroke-width="1.2"/></svg>Deceased spouse`)}
  ${item(ids.some(id => SIMS[id].late), `<span class="dead-k">†</span>Deceased`)}
  ${item(ids.some(id => SIMS[id].notInGame), `<span class="k-box nig-k"></span>Never in the game (named on the Sims Wiki)`)}
  ${item(ids.some(id => dynastyOf(id)), `${ic("crown")} Dynasty roles`)}</div>`;
}

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
  if (t.ph) return `<li><div class="card ph"><span class="mono">?</span><span><b>Unknown</b><small>${esc(word === "parent" ? sx(t.sex, "Father", "Mother", "Parent") : word ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() : "Relative")}</small></span></div></li>`;
  const href = simLinkTo(o), T = href ? "a" : "div", where = simWhere(o);
  return `<li><${T} class="card ${t.late ? "late" : ""}" ${href ? `href="${href}"` : ""} style="--w:${simColour(o)}"><span class="mono">${initial(t.name)}</span><span><b>${esc(t.name)}</b><small>${esc([word, nee(t), /^Deceased/.test(word || "") && where === "deceased" ? "" : where].filter(Boolean).join(" · "))}</small></span></${T}></li>`;
}
function simFamily(id){
  const s = SIMS[id], fam = familyOf(id), words = ws => fam.filter(([, w]) => ws.includes(w));
  const parents = (s.parents || []).filter(p => SIMS[p]).map(p => [p, SIMS[p].ph ? "parent" : relWord(id, p)]);
  const partners = partnersOf(id).map(([p]) => [p, relWord(id, p)]);
  const kids = words(["Son", "Daughter", "Child"]), sibs = words(["Brother", "Sister", "Sibling"]);
  const shown = new Set([...parents, ...partners, ...kids, ...sibs].map(([o]) => o));
  const wider = fam.filter(([o]) => !shown.has(o));
  const all = [...parents, ...partners, ...kids, ...sibs, ...wider];
  return all.length ? `<ul class="sim-list cols fam-grid">${all.map(([o, w]) => simFamItem(o, w)).join("")}</ul>` : "";
}
function simGroups(id){
  const gs = groupsOf(id);
  // the role uses the same badge as tree and member cards: gold for dynasties, silver for clubs, university colours (19 Oct, her ask)
  const card = ([gid, g, role]) => `<a class="memb k-${g.kind}" href="#${gid}" style="${g.kind === "org" ? `--u:${g.colour};--t:${g.trim}` : ""}"><span class="ico">${ic(g.uni === "secret" ? "book-open-text" : GROUP_KINDS[g.kind].icon)}</span><span><b>${esc(groupTitle(g))}</b><small>${esc(kindName(g))}</small></span>${roleBadge(g.kind, role, g)}</a>`;
  return gs.length ? `<div class="membs">${gs.map(card).join("")}</div>` : "";
}
function simHomes(s){
  const hh = s.hh;
  if (!hh) return "";
  const homes = hh.lots.filter(l => !l.owned || hh.tenantOf === l);
  if (!homes.length) return "";   // a household that only runs a venue (the Scotts at The Gnome’s Arms) has no home to list
  return `<ul class="homes">${homes.map(l => `<li>${ic("home")}<a href="#${l.id}">${esc(l.name)}</a><span><a href="#n-${l.hood.id}">${esc(l.hood.name)}</a>, <a href="#w-${l.world.id}">${esc(l.world.name)}</a></span></li>`).join("")}</ul>`;
}
function simPage(s){
  const hh = s.hh, base = hh || ANCHOR[s.id], home1 = base.lots[0], hc = home1.hood.color, w = home1.world, first = firstName(s);
  // Sims with no household: their family's household (for a blood relative), or the household whose tree they're on
  const kin = !hh && membersOf(base).some(m => blood(m, s.id));
  const hhCrumb = hh ? `${esc(hhWord(hh.name))}` : `Related to ${esc(theHh(base.name))}`;
  const stage = [stageOf(s), s.late ? "deceased" : ""].filter(Boolean).join(" · ");
  let h = `<section class="hero small" style="--c:${home1.hood.glow || hc}"><div class="crumbs">${hh ? `<a href="#w-${w.id}">${ic("map")}${esc(w.name)}</a><a href="#n-${home1.hood.id}">${ic("pin")}${esc(home1.hood.name)}</a><a href="#${home1.id}">${ic("home")}${esc(home1.name)}</a>` : ""}<a href="#${base.id}">${ic("users")}${hhCrumb}</a></div>
    <div style="display:flex;gap:26px;align-items:center;flex-wrap:wrap;margin-top:22px"><div class="monogram">${initial(s.name)}</div><div><span class="label" style="color:var(--on-deep-mute)">${isAnimal(s) ? esc(s.state) : "Sim"}</span><h1 style="margin-top:6px">${esc(s.name)}</h1>${nee(s) ? `<p class="nee">${esc(nee(s))}</p>` : ""}</div></div>
    <div class="sim-chips">${s.state ? lifeState(s, "") : `<span>${ic("sim")}Human</span>`}${stage ? `<span>${esc(stage.charAt(0).toUpperCase() + stage.slice(1))}</span>` : ""}${isChampion(s) ? `<span class="champ">${ic("ph-trophy")}Champion</span>` : ""}${s.noHome ? `<span>No home</span>` : ""}${s.notInGame ? `<span title="Named on the Sims Wiki">Never in the game</span>` : ""}${s.galleryOnly ? `<span title="A Maxis upload on the Gallery, not placed in any world">On EA’s Gallery</span>` : ""}${s.notInGame ? "" : `<span>${originTag(s.origin)}</span>`}</div></section>`;
  // details
  // top right: where they live and what they do; who they are (aspiration, quirks, lifestyles, likes, fame) sits with traits and skills below (her ask, 19 Oct)
  const facts = [["Breed", s.breed], ["Cause of death", s.state === "Ghost" ? s.death : null], ["Career", careerText(s.career) || stayAtHome(s)], ["About the job", s.careerNote], ["School", s.school], ["Died", s.died]].filter(([, v]) => v);
  const chipRow = (label, xs, cls) => xs && xs.length ? `<span class="label">${label}</span><div class="traits${cls ? " " + cls : ""}">${xs.map(t => `<span>${esc(t)}</span>`).join("")}</div>` : "";
  const aboutMore = chipRow("Aspiration", s.aspiration ? [s.aspiration] : []) + chipRow("Quirks", s.quirks) + chipRow("Lifestyles", s.lifestyles) + chipRow("Likes", s.likes);
  const fameRow = s.fame ? `<span class="label">Fame</span><div class="skill"><span>${esc(FAME_LEVELS[s.fame])}</span><div class="pips" style="--max:5">${[1, 2, 3, 4, 5].map(i => `<i class="${i <= s.fame ? "on" : ""}"></i>`).join("")}</div><b>${s.fame}</b></div>` : "";
  const hasTraits = (s.traits && s.traits.length) || aboutMore || fameRow;
  const skills = (s.skills || []).map(([n, lv, max]) => `<div class="skill"><span>${esc(n)}</span><div class="pips" style="--max:${max||10}">${Array.from({length:max||10},(_,i)=>`<i class="${i<lv?"on":""}"></i>`).join("")}</div><b>${lv}</b></div>`).join("");
  // picture top left with the facts beside it, as on household pages (her ask, 19 Oct: Sims and animals had no picture box)
  const home = hh ? `<a href="#${hh.id}">${esc(hhWord(hh.name))}</a>` : `<a href="#${base.id}">${hhCrumb}</a>`;
  h += `<div class="detail" style="--h:${hc}">${simPicture(s)}<div><dl class="facts"><div><dt>${hh ? "Household" : "Family"}</dt><dd>${home}</dd></div>${facts.map(([t, v]) => `<div><dt>${t}</dt><dd>${esc(v)}</dd></div>`).join("")}</dl></div></div>`;
  if (hasTraits || skills || s.notes) h += `<section class="block" style="--h:${hc}"><div class="block-head"><h2>About <em>${esc(first)}</em></h2></div>
    <div class="sim-about"><div>${s.traits && s.traits.length ? `<span class="label">Traits</span><div class="traits">${s.traits.map(t => `<span>${esc(t)}</span>`).join("")}${s.bonus ? `<span class="bonus" title="Bonus trait">${esc(s.bonus)}</span>` : ""}</div>` : ""}${aboutMore}${s.notes ? `<p class="sim-note">${esc(s.notes)}</p>` : ""}</div>
      ${skills || fameRow ? `<div class="skills">${skills ? `<span class="label">Skills</span>${skills}` : ""}${fameRow}</div>` : "<div></div>"}</div></section>`;
  // a horse's competitions: best place at each level (her ask, 19 Oct)
  if (s.state === "Horse") h += `<section class="block" style="--h:${hc}"><div class="block-head"><h2>Competitions</h2></div>${horseComps(s)}</section>`;
  // family
  // a Sim's own family (blood relatives plus partners), not their household's whole tree: Romeo shouldn't show Juliette's distant Capps (her call, 19 Oct)
  const fam = simFamily(s.id), own = isAnimal(s) ? (t => t.includes(s.id) ? t : [])(s.hh ? animalTreeOf(s.hh) : []) : treeAround([s.id]);
  if (fam.trim() || own.length) h += `<section class="block" id="family" style="--h:${hc}"><div class="block-head"><h2>Their <em>family</em></h2></div>
    ${own.length ? `<div class="tree-box">${fitTree(own, {line: s.line, compact: true, ch: 96, labels: false, here: true, me: s.id})}</div>${treeKey(own)}` : ""}
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
  const K = GROUP_KINDS[g.kind], W = g.world, lotOf = g.place ? lotIndex[g.place] : g.homeHh ? g.homeHh.lots[0] : null, c = g.colour || (lotOf ? (lotOf.hood.glow || lotOf.hood.color) : wColour(W));
  const dyn = g.kind === "dynasty", ids = g.members.slice().sort((a, b) => ROLE_ORDER.indexOf(a[1]) - ROLE_ORDER.indexOf(b[1]));
  const hhs = [...new Set(ids.map(([id]) => SIMS[id].hh).filter(Boolean))].map(hh => `<a href="#${hh.id}">${esc(hh.name)}</a> (${esc(hh.world.name)})`).join(", ");
  const link = x => GROUP_PAGES["g-dynasty-" + slug(x)] ? `<a href="#g-dynasty-${slug(x)}">${esc(groupTitle(GROUP_PAGES["g-dynasty-" + slug(x)]))}</a>` : esc(x + " dynasty");
  const who = role => g.members.filter(([, r]) => r === role).map(([id]) => simLinkTo(id) ? `<a href="${simLinkTo(id)}">${esc(SIMS[id].name)}</a>` : esc(SIMS[id].name)).join(", ") || "None";
  const based = () => { if (g.homeHh) { const hh = g.homeHh, l = hh.lots[0]; return `<a href="#${hh.id}">${esc(hhWord(hh.name))}</a> (<a href="#${l.id}">${esc(l.name)}</a>, ${esc(l.world.name)})`; }
    if (lotOf) return `<a href="#${lotOf.id}">${esc(lotOf.name)}</a> (${esc(lotOf.hood.name)}, ${esc(lotOf.world.name)})`;
    if (g.anyType) return `Any ${esc(g.anyType)}`;   // a club set to meet at a lot type rather than one lot
    return W ? `${esc(W.name)}${W.owned ? "" : " (not owned)"}` : ""; };
  let h = `<section class="hero small" style="--c:${c}"><div class="crumbs">${W ? (W.ready && W.owned ? `<a href="#w-${W.id}">${ic("map")}${esc(W.name)}</a>` : `<span>${ic("map")}${esc(W.name)} (not owned)</span>`) : ""}${lotOf && g.kind !== "dynasty" ? `<a href="#${lotOf.id}">${ic(g.place ? "pin" : "home")}${esc(lotOf.name)}</a>` : ""}</div>
    <div style="display:flex;gap:26px;align-items:center;flex-wrap:wrap;margin-top:22px"><div class="monogram ico-mono${g.kind === "club" ? " silver" : ""}">${ic(g.uni === "secret" ? "book-open-text" : K.icon)}</div><div><span class="label" style="color:var(--on-deep-mute)">${esc(kindName(g))}</span><h1 style="margin-top:6px">${esc(groupTitle(g))}</h1></div></div></section>`;
  // the group's own details
  const list = xs => xs && xs.length ? xs.map(esc).join(", ") : "";
  const rows = (g.kind === "dynasty" ? [["Head", who("head")], ["Heir", who("heir")], ["Households", hhs], ["Prestige", g.prestige != null ? `${g.prestige} ${g.prestige === 1 ? "star" : "stars"}` : ""],
      ["Ideals", list(g.ideals)], ["Heirloom", g.heirloom ? esc(g.heirloom) : ""], ["Allies", (g.allies || []).map(link).join(", ")], ["Rivals", (g.rivals || []).map(link).join(", ")]]
    : g.kind === "org" ? [["University", esc((UNIS[g.uni] || {}).name || "")], ["How to join", esc(g.join || "")], ["Events", (g.events || []).map(esc).join("<br>")]]
    : [["Leader", who("leader")], ["Meets at", based()], ["Activities", list(g.activities)], ["Rules", (g.rules || []).map(esc).join(", ")]]).filter(([, v]) => v && v !== "None");
  const half = Math.ceil(rows.length / 2), dl = rs => `<dl class="facts">${rs.map(([t, v]) => `<div><dt>${t}</dt><dd>${v}</dd></div>`).join("")}</dl>`;
  h += `<div class="detail" style="--h:${c}"><div>${dl(rows.slice(0, half))}</div><div>${dl(rows.slice(half))}</div></div>`;
  // members
  h += `<section class="block" style="--h:${c}"><div class="block-head"><h2>The <em>members</em></h2><span class="count">${ids.length} ${ids.length === 1 ? "Sim" : "Sims"}</span></div>
    <div class="mcards">${ids.map(([id, r]) => memberCard(g, id, r)).join("")}</div></section>`;

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
// one-Sim households list as "Surname, First"; a household named by surname only (the 19 Oct splits) takes its Sim's full name
const hhListName = hh => { if (!hh.single) return hh.name; const full = !hh.name.includes(" ") && hh.sims.length === 1 ? hh.sims[0].name : hh.name, p = full.split(" ");
  const k = p.length > 2 && /^(I{2,3}|IV|Jr\.?|Sr\.?)$/.test(p.at(-1)) ? 2 : 1;   // "J Huntington III" → "Huntington III, J"
  return p.length > k ? p.slice(-k).join(" ") + ", " + p.slice(0, -k).join(" ") : full; };
const hhSortKey = hh => (hh.single ? hhListName(hh) : hh.name.replace(/^The /, "")).toLowerCase();
const byHh = (a, b) => hhSortKey(a).localeCompare(hhSortKey(b));
const nee = s => s.line && s.into && s.line !== s.into && FAMILIES[s.line] ? `${sx(s.sex, "né", "née", "né")} ${FAMILIES[s.line].name}` : "";
const hhWord = name => /\bhousehold$/i.test(name) ? name : name + " household";   // "Urbane Housesharers household" stays as it is
const theHh = name => (/^the /i.test(name) ? "" : "the ") + hhWord(name);              // "the Goth household", "The Scotts household"
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
        let t = `<a href="#n-${x.id}" class="${ctx.hood===x && !ctx.hh ? (ctx.lot ? "path" : "cur") : ""}">${esc(((NB_BANNER[w.id] || {})[x.name] || {}).title || x.name)}</a>`;   // her own order for a two-part name (bannerTitle)
        const seenB = new Set();
        if (ctx.hood === x && !ctx.hh) t += `<div class="lotnav">${x.lots.map(l => {
          let pre = "";
          if (l.building) { if (seenB.has(l.building)) return ""; seenB.add(l.building);
            const b = l.building, inB = b.units.includes(ctx.lot);
            return `<span class="bld-label ${inB?"path":""}">${ic("home")}${esc(b.name)}</span><div class="lotnav">${b.units.map(u2 => { let v = `<a href="#${u2.id}" class="${ctx.lot===u2 ? "cur" : ""}">${esc(u2.name)}</a>`;
              return v; }).join("")}</div>`; }
          let u = pre + `<a href="#${l.id}" class="${ctx.lot===l ? "cur" : ""}">${esc(l.name)}</a>`;
          return u; }).join("")}</div>`;
        return t; }).join("")}<a class="hh-link ${key==="f-"+w.id ? "cur" : ctx.hh ? "path" : ""}" href="#f-${w.id}">${ic("users")}Households</a>${key === "f-" + w.id || (ctx.hh && ctx.hh.world === w) ? `<div class="lotnav">${homeHhs(w).sort(byHh).map(hx =>
          `<a href="#${hx.id}" class="${ctx.hh === hx ? (ctx.sim || ctx.group ? "path" : "cur") : ""}">${esc(hhListName(hx))}</a>${ctx.hh === hx && hx.sims.length ? `<div class="lotnav">${hx.sims.map(sm => sm.sid ? `<a href="#s-${sm.sid}" class="${ctx.sim === sm ? "cur" : ""}">${esc(sm.name)}</a>` : `<a href="#${hx.id}" data-sim="${sm.id}">${esc(sm.name)}</a>`).join("")}</div>` : ""}`).join("")}</div>` : ""}</div>`;
    }
    return h; };
  owned.forEach(w => h += navWorld(w));
  h += `</div><div class="nav-group dim"><div class="label">Not owned</div>${notOwned.map(w => navWorld(w, true)).join("")}</div>`;   // Across the worlds and Admin are added by js/sections.js
  nav.innerHTML = h;
}
// clicking the page you're already on goes back to its top
// clicking the item for the page you are on folds its list (click again to unfold); anything else takes you to its page
document.addEventListener("click", e => {
  const a = e.target.closest('.nav a[href]'); if (!a || a.dataset.sim) return;
  const next = a.nextElementSibling, list = next && (next.classList.contains("lotnav") || next.classList.contains("subnav")) ? next : null;
  const here = location.hash === a.getAttribute("href") || (location.hash === "" && a.getAttribute("href") === "#home");
  if (list && here) { e.preventDefault(); list.hidden = !list.hidden; a.classList.toggle("folded", list.hidden); return; }
  // a world whose list is open (with a household or Sim open under it, say) closes completely in one click (her ask, 19 Oct); click again to go to the world
  if (list && list.classList.contains("subnav") && !list.hidden && a.closest(".nav-group") && !a.closest(".subnav")) { e.preventDefault(); list.hidden = true; a.classList.add("folded"); return; }
  if (here) { window.scrollTo({top:0, behavior: SMOOTH()}); if (document.body.classList.contains("nav-open")) setNav(false); }   // on a phone the drawer closes too
});
// ---------- search (13 Oct): lots by any of their names, households, Sims, neighbourhoods and worlds; results take the sidebar's place while typing ----------
const fold = s => String(s ?? "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[‘’'.]/g, "").replace(/&/g, "and").replace(/\s+/g, " ");
const KINDS = ["World", "Neighbourhood", "Lot", "Household", "Sim"];
const kindRank = k => { const i = KINDS.indexOf(k); return i < 0 ? KINDS.length : i; };   // groups (dynasties, clubs, organisations) after these
let searchList = null, hits = [], hit = 0;
function searchIndex(){
  const out = [], add = (kind, name, where, href, also, sim) => out.push({kind, name, where, href, sim, keys: [name, ...also].filter(Boolean).map(k => [k, fold(k)])});
  worlds.filter(w => w.ready).forEach(w => {
    add("World", w.name, w.pack, "#w-" + w.id, []);
    w.hoods.forEach(h => { add("Neighbourhood", h.name, w.name, "#n-" + h.id, []);
      h.lots.forEach(l => add("Lot", l.name, h.name + " · " + w.name, "#" + l.id, [l.lot, l.mine, l.gallery?.title, ...(l.versions || []).map(v => v.title), ...(l.gallery?.others || []).map(o => o.title)])); });
    Object.values(w.households).forEach(x => { add("Household", x.name, w.name, "#" + x.id, []);
      x.sims.forEach(sm => sm.sid ? add("Sim", sm.name, hhWord(x.name), "#s-" + sm.sid, []) : add("Sim", sm.name, hhWord(x.name), "#" + x.id, [], sm.id)); });
  });
  Object.values(SIM_PAGES).filter(s => !s.hh).forEach(s => add("Sim", s.name, hhWord(ANCHOR[s.id].name) + "’s family tree", "#s-" + s.id, []));
  Object.values(GROUP_PAGES).forEach(g => add(kindName(g), groupTitle(g), g.world ? g.world.name : "Across the save", "#" + g.id, [g.name]));
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
    .sort((a, b) => a.s - b.s || kindRank(a.kind) - kindRank(b.kind) || a.name.localeCompare(b.name)).slice(0, 40);
}
function showSearch(){
  const q = document.getElementById("q").value, nav = document.getElementById("nav");
  if (!fold(q).trim()) { hits = []; if (navArgs) renderNav(...navArgs); return; }
  hits = search(q); hit = Math.min(hit, Math.max(0, hits.length - 1));
  nav.innerHTML = `<div class="nav-group results"><div class="label">${hits.length ? hits.length + (hits.length === 40 ? "+" : "") + " found" : "Nothing found"}</div>${hits.map((r, i) =>
    `<a href="${r.href}" class="hit ${i === hit ? "on" : ""}" ${r.sim ? `data-sim="${r.sim}"` : ""}><span><b>${esc(r.name)}</b><small>${esc(r.kind)} · ${esc(r.where)}${r.also ? ` · “${esc(r.also)}”` : ""}</small></span></a>`).join("")}
    ${hits.length ? "" : `<a href="#admin-progress" class="hit">${ic("grid")}Search every lot in Admin, Progress</a>`}</div>`;
}
const clearSearch = () => { const q = document.getElementById("q"); if (q.value) { q.value = ""; hits = []; } };
document.getElementById("q").addEventListener("input", () => { hit = 0; showSearch(); });
document.getElementById("q").addEventListener("keydown", e => {
  if (e.key === "Escape") { if (e.target.value) e.stopPropagation(); clearSearch(); showSearch(); return; }   // with words typed, Escape only clears them (the phone drawer stays open)
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
document.addEventListener("click", e => { const b = e.target.closest("[data-local]"); if (b) document.getElementById(b.dataset.hood)?.scrollIntoView({behavior: SMOOTH(),block:"start"}); });

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
    <h1>Jemma’s <em>Sim World</em></h1>
    <p>Every world in the game, rebuilt one lot at a time. Wander the neighbourhoods, look around the homes and venues, and meet the households who live in them.</p>
    <div class="hero-foot"><div class="figures">${[[ready.length, ready.length===1?"world":"worlds"],[ready.reduce((n,w)=>n+w.hoods.length,0),"neighbourhoods"],[ready.reduce((n,w)=>n+w.stats.lots,0),"lots"],[ready.reduce((n,w)=>n+w.stats.hh,0),"households"],[simCount(ready.flatMap(homeHhs)),"Sims"]].map(([n,t]) => `<div><b>${n}</b><span>${t}</span></div>`).join("")}</div></div></section>
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
  const away = l.hh && l.owned && l.hh.lots.some(x => x !== l && !x.owned);
  if (l.hh && !away) who.push({hh: l.hh, role: (l.tenants && !NO_LANDLORD.has(l.world.name + "|" + l.lot)) || /\sown\??$/i.test(l.who || "") ? "owners" : ""});
  (l.tenants || []).filter(t => !t.unit).forEach(t => who.push({hh: t, role: "tenant"}));
  // the residents go in their own unit when one is set (19 Oct: the Lynxes in Tail's End 3, Moody & McMillan in 3B), everyone else fills from unit 1
  const ru = ((DATA.residentsUnit || {})[l.world.name + "|" + l.lot] || 1) - 1, out = Array.from({length: n}, () => null);
  const placed = who[0] && who[0].hh === l.hh && ru > 0 && ru < n ? (out[ru] = who[0], who.slice(1)) : who;
  placed.forEach(x => { const k = out.indexOf(null); if (k >= 0) out[k] = x; });
  (l.tenants || []).filter(t => t.unit).forEach(t => { const i = t.unit - 1;   // a tenant in a given unit (Johnny Zest in trailer 4)
    if (i < n && !out[i]) out[i] = {hh: t, role: "tenant"}; else { const k = out.indexOf(null); if (k >= 0) out[k] = {hh: t, role: "tenant"}; } });   // no free unit: not drawn (15 Nov guard)
  return out; };
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
// a unit's bedrooms and bathrooms, where her Building save records them (22 Oct)
const unitRooms = (l, i) => { const u = l.units?.[i]; return u && u.beds ? `${u.beds} bed${u.baths ? ` · ${u.baths} bath` : ""}` : ""; };
const unitTraits = (l, i) => [...(l.units?.[i]?.traits || []), ...(l.units?.[i]?.challenges || [])];
// how a rental's units are used, the same words on its card and its page (her wording, 22 Oct): "Landlord’s home · 1 let · 1 empty"
function unitWords(l){ const units = rentalUnits(l), who = units.filter(Boolean), own = who.some(u => u.role === "owners"), let_ = who.filter(u => u.role !== "owners").length, free = units.length - who.length;
  if (!own && !free) return "All let";
  return [own ? "Landlord’s home" : "", let_ ? `${let_} let` : "", free ? `${free} empty` : ""].filter(Boolean).join(" · "); }
const rentalMeta = l => { const units = rentalUnits(l), who = units.filter(Boolean), owned = who.filter(u => u.role === "owners").length, lived = who.length - owned, free = units.length - who.length;   // the landlord's own unit isn't "let"
  const rows = units.map((u, i) => `<li${u ? "" : ' class="free"'}>${ic("home")}${u ? hhLink(u.hh) + (u.role === "owners" ? " (landlord)" : "") : "Empty"}<em>${esc(unitLabel(l, i))}</em></li>`).join("");
  // no household named, only her note ("Current uni sims" at Rippling Flats): show the note, as the lot page does
  if (!who.length && l.whoNote) return `<span>${ic("grid")}${esc(l.whoNote)}</span>`;
  return `${rows ? `<ul class="unit-list">${rows}</ul>` : ""}<span>${ic("grid")}${unitWords(l)}</span>`; };

// the units as a table on the lot page: picture, unit, who (only the landlord is marked)
function unitsTable(l){
  const units = rentalUnits(l), ph = unitPhotos(l);
  return `<section class="block" style="--h:${l.hood.color}"><div class="block-head"><h2>The <em>units</em></h2><span class="count">${units.length} units</span></div><div class="unit-table">${units.map((u, i) => { const p = (ph[i + 1] || [])[0];
    return `<a class="unit-row" href="#${u ? u.hh.id : l.id}"><span class="u-pic" ${p ? `style="background-image:url('${p.thumb}')"` : ""}>${p ? "" : i + 1}</span><span class="u-name">${esc(unitLabel(l, i))}${unitRooms(l, i) ? `<small>${unitRooms(l, i)}</small>` : ""}</span><span class="u-who">${u ? `<b>${esc(u.hh.name)}</b>${u.role === "owners" ? " (landlord)" : ""}` : "<i>Empty</i>"}</span><span class="u-traits">${unitTraits(l, i).map(esc).join(", ")}</span></a>`; }).join("")}</div></section>`;
}
// apartment buildings: one card with the building's front picture and its apartments as circles; the card itself doesn't open (her choice, 16 Oct), the circles and household names do
// a household's name on a card opens the household's page (the card itself opens the lot)
const hhLink = hh => `<b class="hh-link" data-lot-link="${hh.id}" title="Open ${esc(theHh(hh.name))}">${esc(hh.name)}</b>`;
function buildingFront(b){
  const cover = (b.units.find(u => u.photos[0]) || {}).photos?.[0], lived = b.units.filter(u => u.hh).length;
  const circ = b.units.map(u => nbTile(u).replace("<i ", `<i data-lot-link="${u.id}" aria-label="${esc(u.name)}" `).replace(/ title="[^"]*"/, ` data-name="${esc(u.name)}"`)).join("");
  return `<div class="listing bfront" style="--h:${b.hood.color}"><div class="photo ${cover?"shot":""}" ${cover?`style="--img:url('${cover.thumb}')"`:""}>${cover ? "" : plot("40x30", 120, false)}<span class="nb-bubbles${b.units.length > 5 ? " many" : ""}">${circ}</span><span class="type">Apartment Building · ${b.units.length} Apartments</span></div>
    <h3>${esc(b.name)}</h3><div class="meta"><ul class="unit-list">${b.units.map(u => `<li${u.hh ? "" : ' class="free"'}>${ic("home")}${u.hh ? hhLink(u.hh) : "Empty"}<em>${esc(u.unit || "")}</em></li>`).join("")}</ul><span>${ic("grid")}${b.units.length - lived ? `${lived} lived in, ${b.units.length - lived} empty` : "All lived in"}</span></div></div>`;
}

function listing(l){
  const cover = l.photos[0];
  return `<a class="listing" href="#${l.id}" style="--h:${l.hood.color}"><div class="photo ${cover?"shot":""}" ${cover?`data-lazy="--img" data-src="${cover.thumb}"`:""}>${cover ? "" : lotArt(l)}${unitCount(l) ? `<span class="nb-bubbles${unitCount(l) > 5 ? " many" : ""}">${rentalBubbles(l)}</span>` : ""}<span class="type">${unitCount(l) ? `Residential Rental · ${unitCount(l)} units` : esc(l.type || "Lot")}</span><span class="status">${statusDots(l)}</span>${sizeTxt(l.size) && !isApt(l) ? `<span class="size">${sizeTxt(l.size)}</span>` : ""}${cardPills(l)}</div>
    <h3>${esc(l.name)}</h3>
    <div class="meta">${unitCount(l) ? rentalMeta(l) : l.hh ? `<span>${ic("users")}${hhLink(l.hh)}${l.hh.unsure?" (unsure)":""}</span>` : l.whoNote ? `<span>${ic("users")}${esc(emptyNote(l.whoNote))}</span>` : ""}${l.gallery ? `<span title="Downloads on the Sims 4 Gallery">${ic("share")}${countOf(l.gallery.downloads, "download")}</span>` : ""}</div></a>`;
}

function buildingCard(b){
  const cover = b.units.find(l => l.photos[0]), built = b.units.filter(l => l.built === true).length;
  return `<div class="listing bcard" style="--h:${b.hood.color}"><div class="photo ${cover?"shot":""}" ${cover?`style="--img:url('${cover.photos[0].thumb}')"`:""}>${cover ? "" : plot("40x30", 120, false)}<span class="type">Apartment Building</span><span class="size">${b.units.length} Apartments</span></div>
    <h3>${esc(b.name)}</h3>
    <ul class="units">${b.units.map(l => `<li><a href="#${l.id}"><span class="unit-no">${esc(l.unit)}</span><span class="unit-who">${l.hh ? `${ic("users")}<b>${esc(l.hh.name)}</b>` : `<i>${esc(l.whoNote ? emptyNote(l.whoNote) : "No household yet")}</i>`}</span><span class="status">${statusDots(l)}</span></a></li>`).join("")}</ul>
    <div class="meta"><span>${ic("hammer")}<b>${built} of ${buildable(b.units).length}</b> built</span></div></div>`;
}
// units of a building share one card
const hoodItems = x => { const seen = new Set(); return x.lots.flatMap(l => { if (!l.building) return [listing(l)]; const b = l.building; if (seen.has(b)) return []; seen.add(b);
  return [buildingFront(b)]; }); };
function mapHero(w, kicker, title, text, figures, chapters, small, view){
  return `<section class="hero ${w.map?"mapped":""} ${small?"hh-hero":""}" style="--c:${w.glow||w.color};${w.map?`--map:url('${w.map}')`:""}${view ? `;--mapview:${view}` : w.heroY != null ? `;--mapview:center ${w.heroY}%/cover` : ""}">${w.map?`<span class="credit">Map by 20th Century Plumbob</span>`:""}<div class="kicker"><i></i><span class="label">${kicker}</span></div>
    <h1 class="${title.replace(/<small[\s\S]*$/, "").replace(/<[^>]+>/g, "").length > 16 ? "long" : ""}">${title}</h1>${text ? `<p>${text}</p>` : ""}
    <div class="hero-foot"><div class="figures">${figures.map(([n,t]) => `<div><b>${n}</b><span>${t}</span></div>`).join("")}</div><div class="chapters">${chapters}</div></div></section>`;
}

// Neighbourhood cards (chosen 12 Oct, "D1"): a close-up of the world map at the neighbourhood's spot (no pin, Jemma's choice),
// and a row of circles, one per lot, each linking to its lot.
// Spots are fractions of the map's width/height, placed by Jemma on a gridded map. Worlds without spots show the whole map, no pin.
const NB_PT = DATA.nbPt, NB_BOX = DATA.nbBox || {}, NB_CENTRED = DATA.nbCentred || {}, NB_ZOOM = DATA.nbZoom || {}, NB_BANNER = DATA.nbBanner || {};
const hoodTitle = x => ((NB_BANNER[x.world.id] || {})[x.name] || {}).title || x.name;   // her own order for a two-part name (bannerTitle)
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
// keyboard: lot circles, unit circles and household names inside cards can be reached with Tab and opened with Enter (22 Oct)
function keyLinks(root){ root.querySelectorAll("[data-lot-link]").forEach(el => { el.tabIndex = 0; el.setAttribute("role", "link"); if (!el.hasAttribute("aria-label")) el.setAttribute("aria-label", el.title || el.textContent); }); }
document.addEventListener("keydown", e => { if (e.key !== "Enter" && e.key !== " ") return; const c = e.target.closest && e.target.closest("[data-lot-link]"); if (!c || c !== e.target) return; e.preventDefault(); e.stopPropagation(); location.hash = c.dataset.lotLink; }, true);
// the banner on a neighbourhood page shows the same part of the map as its card (16 Oct, her idea), zoomed less:
// (the banner's real shape is used, as it runs the full width of the page; it zooms only as far as the map picture stays sharp:
// most maps are about 3075px wide, San Myshuno's 1800px, as its night map didn't come out right at full size)
function hoodHeroView(x, raw){
  const box = (NB_BOX[x.world.id] || {})[x.name], spot = (NB_PT[x.world.id] || {})[x.name];
  if (!x.world.map || !(box || spot)) return "";
  const W = document.querySelector("main")?.clientWidth || 1000, HERO_RATIO = Math.max(.3, Math.min(.7, Math.min(.62 * innerHeight, 560) / W));   // the banner's real height (site.css .hero.mapped)
  const HERO_ZOOM = Math.max(1.01, Math.min(3, (x.world.mapW || 1800) / (W * .85)));
  const room = 1.3, c = box ? [(box[0] + box[2]) / 2, (box[1] + box[3]) / 2] : spot;
  const fit = box ? Math.min(1 / ((box[2] - box[0]) * room), HERO_RATIO / (MAP_RATIO * (box[3] - box[1]) * room)) : HERO_ZOOM;
  const nudge = (NB_BANNER[x.world.id] || {})[x.name] || {zoom: 1, shift: [0, 0]};   // her own nudges (bannerZoom, bannerShift)
  const z = Math.max(1.01, Math.min(HERO_ZOOM * nudge.zoom, fit * nudge.zoom));
  if (raw) return {z, ratio: HERO_RATIO, c: [c[0] + nudge.shift[0], c[1] + nudge.shift[1]]};   // for the card (hoodArt)
  const zh = Math.max(1.01, z * (nudge.heroOnly || 1));   // bannerOnlyZoom: the banner alone, the card stays (19 Oct: UoB, Foxbury)
  return nbView([c[0] + nudge.shift[0], Math.min(1, c[1] + nudge.shift[1] + .04 / zh)], zh, HERO_RATIO).bg;   // a touch lower, so the neighbourhood sits above the fade
}
function hoodArt(x){
  const spot = (NB_PT[x.world.id] || {})[x.name], box = (NB_BOX[x.world.id] || {})[x.name], n = x.lots.length;
  // a neighbourhood Jemma wants centred on its box doesn't slide (14 Oct: Whispering Glen showed too much cloud above)
  const others = (NB_CENTRED[x.world.id] || []).includes(x.name) ? [] : Object.entries(NB_BOX[x.world.id] || {}).filter(([n]) => n !== x.name).map(([, b]) => b);
  // a neighbourhood whose banner she has nudged (bannerZoom, bannerShift) gets a card that shows what its banner shows: the same
  // middle and the same amount of map (the card is taller and narrower, so a little more above and below, a little less at the sides) (19 Oct, her ask)
  const nudge = (NB_BANNER[x.world.id] || {})[x.name], hero = nudge && (nudge.zoom !== 1 || nudge.shift[0] || nudge.shift[1]) ? hoodHeroView(x, true) : null;
  const cs = (nudge && nudge.card) || [0, 0];   // cardShift: a little extra for the card only
  const z = hero ? Math.max(CARD_RATIO / MAP_RATIO + .01, hero.z * Math.sqrt(CARD_RATIO / hero.ratio)) : box ? boxZoom(box) * ((NB_ZOOM[x.world.id] || {})[x.name] || 1) : 0;   // her own closer zoom for a card (14 Oct: Whispering Glen)
  const v = hero ? nbView([hero.c[0] + cs[0], hero.c[1] + cs[1]], z) : box ? nbView(boxCentre(box, z, others), z) : spot ? nbView(spot) : null;
  const bg = !x.world.map ? "" : v ? `background:url('${x.world.map}') ${v.bg}` : `background:url('${x.world.map}') center 45%/cover`;
  const circles = x.lots.map(l => nbTile(l).replace("<i ", `<i data-lot-link="${l.id}" aria-label="${esc(l.name)}" `).replace(/ title="[^"]*"/, ` data-name="${esc(l.name)}"`)).join("");
  return `<div class="photo nb-map" style="${bg}"><span class="nb-bubbles${n > 5 ? " many" : ""}">${circles}</span><span class="type">Neighbourhood</span></div>`;
}
// festivals and events held in a neighbourhood, and where its eco footprint starts (14 Oct, read from the game's own files)
function hoodExtras(x, all){
  const f = x.festivals || [], shown = all ? f : f.slice(0, 3), more = f.length - shown.length;
  return (f.length ? `<p class="home-to">${ic("party")}<span>Festivals and events: ${shown.map(n => `<b>${esc(n)}</b>`).join(", ")}${more ? ` and ${more} more` : ""}</span></p>` : "")
    + (ecoOf(x) ? `<p class="home-to">${ic(ecoOf(x) === "Industrial" ? "factory" : "leaf")}<span>Eco footprint starts <b>${esc(ecoOf(x))}</b></span></p>` : "");
}
// the households living in a neighbourhood: tenants in its rentals count, owners of a business there who live elsewhere don't (22 Oct)
const hoodHouseholds = x => [...new Set(x.lots.flatMap(l => unitCount(l) ? rentalUnits(l).filter(Boolean).map(u => u.hh) : l.hh && !l.owned ? [l.hh] : []))];
// every neighbourhood's starting eco footprint, Neutral where the game sets none (her ask, 23 Oct); not StrangerVille (no eco footprint
// there) or the Secret Lots groups
const ecoOf = x => x.ecoStart || (x.world.id === "strangerville" || /secret lots/i.test(x.name) ? "" : "Neutral");
function hoodCard(x){
  const hhSet = hoodHouseholds(x), hh = hhSet.length, built = x.lots.filter(l => l.built === true).length, made = hhSet.filter(simsMade).length;
  return `<a class="listing" href="#n-${x.id}" style="--h:${x.color}">${hoodArt(x)}
    <h3>${esc(((NB_BANNER[x.world.id] || {})[x.name] || {}).title || x.name)}</h3>${x.desc ? `<p class="desc">${esc(x.desc)}</p>` : ""}
    ${hh ? `<p class="home-to">${ic("users")}<span>Home to ${hhSet.map(f => `<b>${esc(f.name)}</b>`).join(", ")}</span></p>` : `<p class="home-to">${ic("pin")}<span>Community lots only</span></p>`}
    ${hoodExtras(x)}
    <div class="meta"><span>${ic("hammer")}<b>${built} of ${buildable(x.lots).length}</b> lots built</span>${hh ? `<span>${ic("sim")}<b>${made} of ${hh}</b> with Sims made</span>` : ""}</div></a>`;
}
function world(w){
  const s = w.stats;
  let h = mapHero(w, esc(w.pack) + (w.owned ? "" : " · not owned yet"), titleWord(w.name), w.blurb ? esc(w.blurb) : "", [[w.hoods.length,"neighbourhoods"],[s.lots,"lots"],[s.hh,"households"],[simCount(homeHhs(w)),"Sims"]],
    w.hoods.map(x => `<a href="#n-${x.id}">${esc(hoodTitle(x))}</a>`).join(""));
  h += worldAbout(w);   // weather and highlights first, small (her call, 19 Oct)
  h += `<section class="hood" style="--h:${w.color}"><div class="hood-head"><span class="label">Explore</span><div><h2>Neighbourhoods</h2><p>Open a neighbourhood to see its lots, then a home to meet the household living there.</p></div><a class="count" href="#f-${w.id}">All ${s.hh} households</a></div>
    <div class="listings hoods">${w.hoods.map(hoodCard).join("")}</div></section>`;
  return h;
}
const SEASON_ICON = {Spring: "flower", Summer: "sun", Autumn: "leaf", Winter: "snowflake"}, CAL_SEASONS = ["Spring", "Summer", "Autumn", "Winter"];
// each season with its icon and the game's three likeliest kinds of weather (her layout, 19 Oct)
// the world's weather and the three highlights the game shows when you pick it (14 Oct, read from the game's own files)
function worldAbout(w){
  if (!w.weather && !w.highlights) return "";
  // a slim strip under the banner with no heading of its own, so Neighbourhoods stays the page's first heading (her feedback, 19 Oct)
  return `<section class="world-strip" style="--h:${w.color}">
    ${w.weatherSeasons ? `<div class="wx-seasons">${CAL_SEASONS.filter(n => w.weatherSeasons[n]).map(n => `<div class="s-${n.toLowerCase()}">${ic(SEASON_ICON[n])}<b>${n}:</b><span>${esc(w.weatherSeasons[n].replace(/, ([^,]+)$/, " and $1"))}</span></div>`).join("")}</div>`
      : w.weather ? `<p class="home-to world-weather">${ic("weather")}<span>${esc(w.weather)}</span></p>` : ""}
    ${w.highlights ? `<div class="wx-highlights">${w.highlights.map(x => `<div>${ic("landmark")}<b>${esc(x.name)}:</b><span>${esc(x.text)}</span></div>`).join("")}</div>` : ""}</section>`;
}
function hoodPage(x){
  const w = x.world, hhSet = hoodHouseholds(x), built = x.lots.filter(l => l.built === true).length;
  const figs = [[x.lots.length, x.lots.length===1?"lot":"lots"]];
  if (hhSet.length) figs.push([hhSet.length, hhSet.length===1?"household":"households"],[simCount(hhSet), simCount(hhSet)===1?"Sim":"Sims"]);
  // a two-part name ("Lykke Center / University of Windenburg") keeps its first part as the title, the rest on a smaller line
  const [t1, ...t2] = (((NB_BANNER[w.id] || {})[x.name] || {}).title || x.name).split(" / ");   // bannerTitle: her own order for the banner
  let h = mapHero(w, `Neighbourhood · ${esc(w.name)}`, esc(t1) + (t2.length ? `<small class="h1-sub">${esc(t2.join(" / "))}</small>` : ""), x.desc ? esc(x.desc) : "", figs,
    w.hoods.filter(o => o !== x).map(o => `<a href="#n-${o.id}">${esc(hoodTitle(o))}</a>`).join(""), true, hoodHeroView(x));
  h += `<section class="hood" style="--h:${x.color}"><div class="hood-head"><span class="label">${esc(x.name)}</span><div><h2>The <em>lots</em></h2><p>Open a home to meet the household who lives there.</p>${hoodExtras(x, true) ? `<div class="hood-extras">${hoodExtras(x, true)}</div>` : ""}<p class="dot-key"><span class="yes">${ic("hammer")}</span>Built <span class="yes">${ic("share")}</span>Shared <span class="yes">${ic("sim")}</span>Sims made <small>Faded means not yet.</small></p></div><span class="count">${built} of ${buildable(x.lots).length} built</span></div>
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
    <div><dl class="facts">${l.ea ? `<div><dt>In-game name</dt><dd>${esc(l.ea)}</dd></div>` : ""}<div><dt>Lot type</dt><dd>${esc(unitCount(l) ? (l.typeFull || l.type).replace(/\s*\((\d+)\)/, " · $1 units") : l.typeFull || l.type || "Not set")}</dd></div>${isApt(l) ? "" : `<div><dt>Lot size</dt><dd>${esc(sizeTxt(l.size) || "Not checked yet")}</dd></div>`}${l.traits && !unitCount(l) ? `<div><dt>Lot traits</dt><dd>${l.traits.map(esc).join(", ")}</dd></div>` : ""}${l.challenges ? `<div><dt>${l.challenges.length > 1 ? "Lot challenges" : "Lot challenge"}</dt><dd>${l.challenges.map(esc).join(", ")}</dd></div>` : ""}
      <div><dt>Neighbourhood</dt><dd><a href="#n-${l.hood.id}">${esc(l.hood.name)}</a></dd></div>${progressRow(l)}${l.building ? `<div><dt>Building</dt><dd>${esc(l.building.name)} · ${l.building.units.length} Apartments</dd></div>` : ""}
      ${l.hh || l.whoNote ? `<div><dt>${l.owned ? "Owned by" : "Household"}</dt><dd>${l.hh ? `<a href="#${l.hh.id}">${esc(l.hh.name)}</a>${l.hh.unsure?" (unsure)":""}${unitCount(l) && rentalUnits(l).some(u => u && u.hh === l.hh && u.role === "owners") ? " (landlord)" : ""}` : esc(emptyNote(l.whoNote))}</dd></div>` : ""}${unitCount(l) ? `<div><dt>Units</dt><dd>${unitWords(l)}</dd></div>` : ""}${l.hh && !l.owned && l.hh.sims.some(isAnimal) ? `<div><dt>Animals</dt><dd>${esc(whoCount(l.hh.sims.filter(isAnimal)).replace(/^0 Sims · /, ""))}</dd></div>` : ""}${l.tenants ? `<div><dt>${l.tenants.length > 1 ? "Tenants" : "Tenant"}</dt><dd>${l.tenants.map(t => `<a href="#${t.id}">${esc(t.name)}</a>${t.note ? ` <small>“${esc(t.note)}”</small>` : ""}`).join(", ")}</dd></div>` : ""}</dl>${l.versions ? versionTabs(l) : ""}
</div></div>
    ${l.hh && !unitCount(l) ? `<section class="block" style="--h:${hc}"><div class="block-head"><h2>${l.owned ? "Who <em>owns it</em>" : "Who <em>lives here</em>"}</h2></div>
      <div class="lives"><div class="lives-card">${hhListing(l.hh)}</div>
      <div>${l.hh.sims.length ? `<span class="label">The Sims</span><ul class="sim-list">${l.hh.sims.map(sm => `<li><a href="${sm.sid ? "#s-" + sm.sid : "#" + l.hh.id}" ${sm.sid ? "" : `data-sim="${sm.id}"`}><span class="mono">${initial(sm.name)}</span><span><b>${esc(sm.name)}</b><small>${esc([sm.age, sm.aspiration].filter(Boolean).join(" · "))}</small></span></a></li>`).join("")}</ul>` : `<div class="empty" style="margin-top:0">${ic("sim")}No Sims added for ${esc(theHh(l.hh.name))} yet.</div>`}
      <a class="more" href="#${l.hh.id}">Open ${esc(theHh(l.hh.name))} ${ic("arrow")}</a></div></div></section>` : ""}
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
          ${l.gallery.others?.length ? `<span class="label">Other versions</span><ul class="g-others">${l.gallery.others.map(o => `<li><a href="${esc(o.url)}" target="_blank" rel="noopener"><b>${esc(o.label)}</b><small>${esc(o.title)} · ${countOf(o.likes, "favourite")} · ${countOf(o.downloads, "download")}</small></a></li>`).join("")}</ul>` : ""}
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
  const rels = (sm.rels || []).map(([who, label]) => { const t = simIndex[who]; const nm = t ? `<a href="#${t.hh.id}" data-sim="${t.id}">${esc(who)}</a>` : esc(who); return `<li>${nm}<span>${esc(label)}</span>${t && t.hh !== sm.hh ? `<small>${esc(hhWord(t.hh.name))}</small>` : ""}</li>`; }).join("");
  return `<article class="sim" id="${sm.id}">
    <header><span class="mono">${initial(sm.name)}</span><div><h3>${esc(sm.name)}</h3><div class="sim-sub">${[sm.age, sm.aspiration && "Aspiration: " + sm.aspiration].filter(Boolean).map(esc).join(" · ")}</div></div></header>
    ${sm.traits?.length ? `<div class="traits">${sm.traits.map(t => `<span>${esc(t)}</span>`).join("")}${sm.bonus ? `<span class="bonus">${esc(sm.bonus)}</span>` : ""}</div>` : ""}
    <dl class="sim-facts"><div><dt>Career</dt><dd>${esc(careerText(sm.career) || "None")}</dd></div>${sm.school ? `<div><dt>School</dt><dd>${esc(sm.school)}</dd></div>` : ""}</dl>
    ${skills ? `<div class="skills"><span class="label">Skills</span>${skills}</div>` : ""}
    ${rels ? `<div class="rels"><span class="label">Relationships</span><ul>${rels}</ul></div>` : ""}
    ${sm.notes ? `<p class="sim-note">${esc(sm.notes)}</p>` : ""}
  </article>`;
}
document.addEventListener("click", e => { const a = e.target.closest("a[data-sim]"); if (a) { const id = a.dataset.sim; setTimeout(() => document.getElementById(id)?.scrollIntoView({block:"start", behavior: SMOOTH()}), 120); } });
// Jemma's own replies count towards the total but are not shown
const theirs = l => (l.gallery?.commentList || []).filter(c => (c.u || "").toLowerCase() !== "jemmathesimmer");
// builds that need no packs (15 Oct: base-game builds are the most downloaded)
const baseGame = l => !!l.gallery && !(l.gallery.packs || []).length;
// "new since you looked" (15 Oct): this browser remembers each build's favourites and comments from when its page was
// last opened. The first visit just remembers everything; after that, builds with more favourites or comments, and new
// uploads, are marked until their page is opened. Kept in this browser only, so it's per viewer.
const SEEN_KEY = "jsw-seen-v1";
let seen = null; try { seen = JSON.parse(localStorage.getItem(SEEN_KEY) || "null"); } catch (e) {}
if (!seen || typeof seen !== "object" || Array.isArray(seen)) seen = null;   // anything but a saved list counts as a first visit
// Community Space lots count all their versions together, whichever version tab is showing (15 Nov: counting the tab
// shown made them "New" on a first visit)
const seenNow = l => [l.versions ? l.versions.reduce((n, v) => n + v.likes, 0) : l.gallery.likes, theirs(l).length];
const saveSeen = () => { try { localStorage.setItem(SEEN_KEY, JSON.stringify(seen)); } catch (e) {} };
const newSince = l => { if (!l.gallery) return null; const s = seen[l.id], [f, c] = seenNow(l);
  if (!s) return {fresh: true}; return f > s[0] || c > s[1] ? {f: Math.max(0, f - s[0]), c: Math.max(0, c - s[1])} : null; };
const markSeen = l => { if (l.gallery) { seen[l.id] = seenNow(l); saveSeen(); } };
// a count with its word, singular for one ("1 download", "2 downloads"; 21 Nov)
const countOf = (n, one, many) => `${n} ${n === 1 ? one : many || one + "s"}`;
const newTxt = n => n.fresh ? "New on the Gallery" : [n.f && `${n.f} new ${n.f === 1 ? "favourite" : "favourites"}`, n.c && `${n.c} new ${n.c === 1 ? "comment" : "comments"}`].filter(Boolean).join(", ");
// a home with no household yet: bed-size planning notes just read "Empty" (bed counts live in the Gallery card)
// dark text on light colours (Sulani yellow etc.), white on dark ones: whichever reads better
// white initials are hard to read on pale world and neighbourhood colours: give each coloured element its readable text colour
function initialsContrast(root){
  root.querySelectorAll('[style*="--w:"],[style*="--h:"]').forEach(el => {
    const w = /--w:\s*(#[0-9a-fA-F]{6})/.exec(el.getAttribute("style")), h = /--h:\s*(#[0-9a-fA-F]{6})/.exec(el.getAttribute("style"));
    if (w) el.style.setProperty("--on-w", textOn(w[1]));
    if (h) el.style.setProperty("--on-h", textOn(h[1]));
  });
}
function textOn(hex){ const c = (hex || "#000").replace("#",""), L = [0,2,4].map(i => { const v = parseInt(c.slice(i,i+2),16)/255; return v <= .03928 ? v/12.92 : Math.pow((v+.055)/1.055, 2.4); }), Y = .2126*L[0] + .7152*L[1] + .0722*L[2];
  return (1.05)/(Y+.05) >= (Y+.05)/(.0185+.05) ? "#fff" : "#1A1F1C"; }
const emptyNote = n => /bed|empty/i.test(n) ? "Empty" : n;
const simsMade = x => x.lots.some(l => l.sims === true);
const simCount = hhs => hhs.reduce((n, x) => n + x.sims.filter(sm => !isAnimal(sm)).length, 0);
// "2 Sims · 6 horses" (a list of Sims, or of ids)
function whoCount(list){
  const xs = list.map(x => typeof x === "string" ? SIMS[x] : x).filter(Boolean), n = xs.filter(x => !isAnimal(x)).length, pets = {};
  xs.filter(isAnimal).forEach(x => { const k = x.state.toLowerCase().replace(/^(small|large) /, ""); pets[k] = (pets[k] || 0) + 1; });
  return [`${n} ${n === 1 ? "Sim" : "Sims"}`, ...Object.entries(pets).map(([k, c]) => `${c} ${c === 1 ? k : k + "s"}`)].join(" · ");
}
// each life state its own icon (her picks, 19 Oct); mermaids still to choose
// fame (Get Famous, her call 19 Oct): stars 1–5 with the game’s own level names; quirks as the game names them
const FAME_LEVELS = [null, "Rising Star", "B-Lister", "Celebrity", "Superstar", "Global Superstar"];
const OCCULT_ICON = {Spellcaster: "cauldron", Vampire: "bat", Werewolf: "ph-moon", Ghost: "ghost", Alien: "ph-alien", Fairy: "ph-butterfly", "Plant Sim": "ph-plant", Servo: "bot", Mermaid: "trident"};
const lifeState = (s, cls) => isAnimal(s) ? `<span class="${cls} animal">${animalIcon(s)}${esc(s.state)}</span>` : `<span class="${cls} occult">${ic(OCCULT_ICON[s.state] || "sparkle")}${esc(s.state)}</span>`;
function hhListing(x, listed){   // listed: on the households page, one-Sim households read surname first
  const n = simCount([x]), hc = x.lots[0].hood.color, made = simsMade(x);   // Sims only, as on world pages (15 Nov: animals were counted)
  return `<a class="listing" href="#${x.id}" style="--h:${hc}"><div class="photo"><span class="initial">${initial(x.name)}</span><span class="type">Household</span><span class="status">${x.unsure ? `<span class="flag">unsure</span>` : ""}<span class="${made?"yes":""}" title="Sims made: ${made?"yes":"not yet"}">${ic("sim")}</span></span><span class="size home">${esc(x.lots.map(l => l.name).join(" & "))}</span></div>
    <h3>${esc(listed ? hhListName(x) : x.name)}</h3><p class="desc">${esc([...new Set(x.lots.map(l => l.hood.name))].join(", "))}</p>
    <div class="meta"><span class="${made?"made":""}">${ic("sim")}<b>${made ? "Sims made" : "Sims not made yet"}</b></span>${n ? `<span>${ic("users")}${n} Sim ${n===1?"profile":"profiles"}</span>` : ""}${x.links.length ? `<span>${ic("share")}${x.links.length} connected</span>` : ""}</div></a>`;
}
function families(w){
  const hhs = homeHhs(w).sort(byHh), s = w.stats;
  let h = mapHero(w, esc(w.name), "The <em>households</em>", `Every family living in ${esc(w.name)}.`, [[hhs.length,"households"],[simCount(hhs),"Sims"]], "", true);
  h += `<section class="hood" style="--h:${w.color}"><div class="hood-head"><span class="label">${esc(w.name)}</span><div><h2>All <em>households</em></h2><p>Open a household to meet its Sims.</p></div><span class="count">${s.hhMade} of ${s.hh} with Sims made</span></div>
    <div class="listings">${hhs.map(x => hhListing(x, true)).join("")}</div></section>`;
  return h;
}
const lotsLabel = hh => { const o = hh.lots.some(l => l.owned), n = hh.lots.filter(l => !l.owned).length; return (n > 1 ? "Homes" : "Home") + (o ? " & business" : ""); };
function household(hh){   // no admin notes here (19 Nov, her rule): no “Sims made in game”, “No Sims added yet” or “No story yet”
  if (hh.sims.some(sm => sm.sid)) return householdNew(hh);
  const w = hh.world, home1 = hh.lots[0], hc = home1.hood.color, homes = hh.lots.filter(l => !l.owned || hh.tenantOf === l), owns = hh.lots.filter(l => l.owned && hh.tenantOf !== l);
  const hoods = [...new Set(hh.lots.map(l => l.hood))];
  const neighbours = Object.values(w.households).filter(x => x !== hh && !hh.links.some(k => k.hh === x) && homesOf(x).some(l => homesOf(hh).map(m => m.hood).includes(l.hood)));
  return `<section class="hero small" style="--c:${home1.hood.glow||hc}"><div class="crumbs"><a href="#w-${w.id}">${ic("map")}${esc(w.name)}</a><a href="#n-${home1.hood.id}">${ic("pin")}${esc(home1.hood.name)}</a>${hh.lots.map(l => `<a href="#${l.id}">${ic(l.owned ? "pin" : "home")}${esc(l.name)}</a>`).join("")}</div>
    <div style="display:flex;gap:26px;align-items:center;flex-wrap:wrap;margin-top:22px"><div class="monogram">${initial(hh.name)}</div><div><span class="label" style="color:var(--on-deep-mute)">Household</span><h1 style="margin-top:6px">${esc(hh.name)}</h1></div></div></section>
    ${hh.unsure ? `<div class="note">Marked as unsure in the plan. Double-check which family lives here.</div>` : ""}
    <div class="detail" style="--h:${hc}">
      <div><span class="label">${lotsLabel(hh)}</span><div class="home-list">${hh.lots.map(listing).join("")}</div></div>
      <div><dl class="facts"><div><dt>World</dt><dd><a href="#w-${w.id}">${esc(w.name)}</a></dd></div><div><dt>Neighbourhood</dt><dd>${hoods.map(x => `<a href="#n-${x.id}">${esc(hoodTitle(x))}</a>`).join(", ")}</dd></div>
        <div><dt>${homes.length > 1 ? "Homes" : "Home"}</dt><dd>${homes.map(l => `<a href="#${l.id}">${esc(l.name)}</a>${hh.tenantOf === l ? " (renting)" : ""}`).join(", ")}</dd></div>${(() => { const lets = owns.filter(l => /rental/i.test(l.type || "")).concat(homes.filter(l => l.tenants && l.hh === hh)), biz = owns.filter(l => !/rental/i.test(l.type || ""));
          return (lets.length ? `<div><dt>Landlord of</dt><dd>${lets.map(l => `<a href="#${l.id}">${esc(l.name)}</a>`).join(", ")}</dd></div>` : "") + (biz.length ? `<div><dt>Owns</dt><dd>${biz.map(l => `<a href="#${l.id}">${esc(l.name)}</a> (${esc(l.type)})`).join(", ")}</dd></div>` : ""); })()}</dl></div>
    </div>
    ${hh.sims.length || hh.source ? `<section class="block" style="--h:${hc}"><div class="block-head"><h2>The <em>Sims</em></h2>${hh.sims.length ? `<span class="count">${whoCount(hh.sims)}</span>` : ""}</div>
      ${hh.sims.length ? `<div class="sims">${hh.sims.slice().sort((a, b) => (AGE_ORDER.indexOf(a.age) + 1 || 99) - (AGE_ORDER.indexOf(b.age) + 1 || 99)).map(simCard).join("")}</div>` : ""}
      ${hh.source ? `<p class="source">In-game starting details from The Sims Wiki: ${hh.source.map(([n,u]) => `<a href="${esc(u)}" target="_blank" rel="noopener">${esc(n)}</a>`).join(", ")}.</p>` : ""}</section>` : ""}
    ${hhGallery(hh, hc)}
    ${hh.links.length ? `<section class="block" style="--h:${hc}"><div class="block-head"><h2>Connected <em>households</em></h2></div><div class="families">${hh.links.map(x => x.hh ? famCard(x.hh, x) : "").join("")}</div></section>` : ""}
    ${neighbours.length ? `<section class="block"><div class="block-head"><h2>Neighbours</h2></div><div class="families">${neighbours.map(famCard).join("")}</div></section>` : ""}`;
}

// the household page as the family overview (the prototype's household.html, her decisions of 17 Oct): the household picture on
// the left where a lot page has its photos (a placeholder until her screenshot is in, as "portrait"), the facts on the right;
// the roster (each name opens the Sim's page), the family tree from family links only, their story and the neighbours.
// Relationships between Sims are only on Sim pages.
// a Sim's or animal's own picture (her screenshot as `portrait`), or a placeholder like the household's
// (her Library picture of them stands in until then, shown whole on a soft background: tools/library_pictures.py, 19 Oct)
const simPicture = s => s.portrait ? `<div class="portrait hh-pic" style="background-image:url('${s.portrait}')" role="img" aria-label="${esc(s.name)}"></div>`
  : s.libraryPic ? `<div class="hh-pic library"><img src="${s.libraryPic}" alt="${esc(s.name)}"></div>`
  : `<div class="hh-pic none" aria-hidden="true"><span class="hh-pic-mono">${isAnimal(s) ? animalIcon(s) : initial(s.name)}</span><span class="hh-pic-txt">${ic("camera")}</span></div>`;
function hhPicture(hh, ids){
  if (hh.portrait) return `<div class="portrait hh-pic" style="background-image:url('${hh.portrait}')" role="img" aria-label="${esc(hhWord(hh.name))}">
    <div class="names">${ids.map(id => `<div><a href="#s-${id}"><b>${esc(firstName(SIMS[id]))}</b></a><small>${esc(SIMS[id].age)}</small></div>`).join("")}</div></div>`;
  if (hh.libraryPic) return `<div class="hh-pic library"><img src="${hh.libraryPic}" alt="${esc(hhWord(hh.name))}"></div>`;   // never stretched past its own size (the game draws big families small; 24 Oct)
  return `<div class="hh-pic none" aria-hidden="true"><span class="hh-pic-mono">${initial(hh.name)}</span><span class="hh-pic-txt">${ic("camera")}</span></div>`;
}
// plain-link lines for where they live and what they own, run, rent and let
function hhLotLines(hh){
  const link = l => `<a href="#${l.id}">${esc(l.name)}</a>`, hhA = x => `<a href="#${x.id}">${esc(x.name)}</a>`, noLord = l => NO_LANDLORD.has(l.world.name + "|" + l.lot);
  const homes = hh.lots.filter(l => !l.owned || hh.tenantOf === l), owns = hh.lots.filter(l => l.owned && hh.tenantOf !== l);
  const landlord = hh.tenantOf && hh.tenantOf.hh && hh.tenantOf.hh !== hh && !noLord(hh.tenantOf) ? hh.tenantOf.hh : null;
  const lets = homes.concat(owns).filter(l => l.hh === hh && l.tenants && l.tenants.length && !noLord(l)).flatMap(l => l.tenants);
  const rows = [[homes.length > 1 ? "Homes" : "Home", homes.map(l => link(l) + (hh.tenantOf === l && !landlord ? " (renting)" : "")).join(", ")],
    [owns.length ? "Owns or runs" : "", owns.map(l => `${link(l)} (${esc(l.type.replace(/\s*\(\d+\)$/, ""))})`).join(", ")],
    [landlord ? "Rents from" : "", landlord ? `${hhA(landlord)} (${link(hh.tenantOf)})` : ""],
    [lets.length ? "Rents to" : "", lets.map(hhA).join(", ")]];
  return rows.filter(([t, v]) => t && v).map(([t, v]) => `<div><dt>${t}</dt><dd>${v}</dd></div>`).join("");
}
// the dynasty line: the dynasties the household's Sims belong to (usually one), each linking to its page ("outcast" when that's all they are in it)
const dynLine = ids => [...new Set(ids.map(id => (dynastyOf(id) || [])[0]).filter(Boolean))].map(gid => { const roles = ids.map(dynastyOf).filter(d => d && d[0] === gid).map(d => d[2]);
  return `<a href="#${gid}">${ic("crown")}${esc(GROUP_PAGES[gid].name)}</a>${roles.every(r => r === "outcast") ? " (outcast)" : ""}`; }).join(", ");
function simRoster(ids){
  return `<div class="sheet-wrap"><table class="sheet roster"><thead><tr><th scope="col">Sim</th><th scope="col">Life state</th><th scope="col">Life stage</th><th scope="col">Traits</th><th scope="col">Career or school</th></tr></thead><tbody>
    ${ids.map(id => { const s = SIMS[id], uni = /^(University of Britechester|Foxbury Institute) · (.+?)( \(distinguished\))?$/.exec(s.school || ""),
        sch = uni ? `${uni[2]} (${uni[1].startsWith("Foxbury") ? "Foxbury" : "UoB"})` : (s.school || "").replace(" · ", ", "),
        job = [(s.career || stayAtHome(s)).split(" · ")[0], sch].filter(Boolean).join(" · ");   // a job and a school both show, with the grade (her ask, 24 Oct)
      return `<tr><td><span class="who"><span class="mono">${initial(s.name)}</span><a href="#s-${id}">${esc(s.name)}</a></span></td>
        <td>${s.state ? lifeState(s, "state") : `<span class="state">${ic("sim")}Human</span>`}</td><td>${esc(s.age)}</td>
        <td class="tlist">${s.traits && s.traits.length ? esc(s.traits.join(", ")) : `<span class="muted">—</span>`}</td><td>${job ? esc(job) : `<span class="muted">—</span>`}</td></tr>`; }).join("")}</tbody></table></div>`;
}
function animalRoster(ids){
  return `<div class="sheet-wrap"><table class="sheet roster animals"><thead><tr><th scope="col">Name</th><th scope="col">Animal</th><th scope="col">Life stage</th><th scope="col">Traits</th><th scope="col">Breed</th></tr></thead><tbody>
    ${ids.map(id => { const s = SIMS[id], dash = `<span class="muted">—</span>`;
      return `<tr><td><span class="who"><span class="mono">${initial(s.name)}</span><a href="#s-${id}">${esc(s.name)}</a>${isChampion(s) ? `<span class="champ small" title="Champion">${ic("ph-trophy")}</span>` : ""}</span></td>
        <td><span class="state animal">${animalIcon(s)}${esc(s.state)}</span></td><td>${esc(stageOf(s) || "")}</td><td class="tlist">${s.traits && s.traits.length ? esc(s.traits.join(", ")) : dash}</td>
        <td>${s.breed ? esc(s.breed) : dash}</td></tr>`; }).join("")}</tbody></table></div>`;
}
function householdNew(hh){
  const w = hh.world, home1 = hh.lots[0], hc = home1.hood.color, all = membersOf(hh), ids = byAge(all.filter(id => !isAnimal(SIMS[id]))), pets = all.filter(id => isAnimal(SIMS[id])), n = ids.length, hoods = [...new Set(hh.lots.map(l => l.hood))];
  const neighbours = Object.values(w.households).filter(x => x !== hh && !hh.links.some(k => k.hh === x) && homesOf(x).some(l => homesOf(hh).map(m => m.hood).includes(l.hood)));
  const dyn = dynLine(ids), tree = treeOf(hh), origin = hh.origin || (ids.some(id => !/^mine$/i.test(SIMS[id].origin || "")) ? "Premade" : "Mine");
  return `<section class="hero small" style="--c:${home1.hood.glow || hc}"><div class="crumbs"><a href="#w-${w.id}">${ic("map")}${esc(w.name)}</a><a href="#n-${home1.hood.id}">${ic("pin")}${esc(home1.hood.name)}</a>${hh.lots.map(l => `<a href="#${l.id}">${ic(l.owned ? "pin" : "home")}${esc(l.name)}</a>`).join("")}</div>
    <div style="display:flex;gap:26px;align-items:center;flex-wrap:wrap;margin-top:22px"><div class="monogram">${initial(hh.name)}</div><div><span class="label" style="color:var(--on-deep-mute)">Household</span><h1 style="margin-top:6px">${esc(hh.name)}</h1></div></div></section>
    ${hh.unsure ? `<div class="note">Marked as unsure in the plan. Double-check which family lives here.</div>` : ""}
    <div class="detail" style="--h:${hc}">${hhPicture(hh, ids)}
      <div><dl class="facts"><div><dt>World</dt><dd><a href="#w-${w.id}">${esc(w.name)}</a></dd></div><div><dt>Neighbourhood</dt><dd>${hoods.map(x => `<a href="#n-${x.id}">${esc(hoodTitle(x))}</a>`).join(", ")}</dd></div>
        ${hhLotLines(hh)}
        <div><dt>Origin</dt><dd>${originTag(origin)}</dd></div>
        <div><dt>Played</dt><dd>${esc(hh.played || "Not yet")}</dd></div>
        <div><dt>Neighbourhood Stories</dt><dd>${esc(hh.stories || "Not set")}</dd></div>
        ${dyn ? `<div><dt>Dynasty</dt><dd class="dynline">${dyn}</dd></div>` : ""}</dl></div>
    </div>
    <section class="block" style="--h:${hc}"><div class="block-head"><h2>The <em>Sims</em></h2><span class="count">${whoCount(ids)}</span></div>
      ${simRoster(ids)}
      </section>
    ${pets.length ? `<section class="block" style="--h:${hc}"><div class="block-head"><h2>The <em>animals</em></h2><span class="count">${whoCount(pets).replace(/^0 Sims · /, "")}</span></div>
      ${animalRoster(pets)}</section>` : ""}
    ${hhGallery(hh, hc)}
    ${tree.length ? `<section class="block" style="--h:${hc}"><div class="block-head"><h2>Family <em>tree</em></h2></div>
      <div class="tree-box">${fitTree(tree, {line: slug(hh.family), compact: true, ch: 96, labels: false, here: hh})}</div>${treeKey(tree, true, wColour(w), tree.some(id => !SIMS[id].ph && SIMS[id].hh !== hh))}</section>` : ""}
    ${(t => t.length ? `<section class="block" style="--h:${hc}"><div class="block-head"><h2>Animal <em>family</em></h2></div><div class="tree-box">${fitTree(t, {compact: true, ch: 96, labels: false, here: hh})}</div></section>` : "")(animalTreeOf(hh))}
    ${hh.bio || hh.story ? `<section class="block" style="--h:${hc}"><div class="block-head"><h2>Their <em>story</em></h2></div>${hh.bio ? `<p class="lede">${esc(hh.bio)}</p>` : ""}${hh.story ? `<p class="lede">${esc(hh.story)}</p>` : ""}</section>` : ""}
    ${neighbours.length ? `<section class="block"><div class="block-head"><h2>Neighbours</h2></div><div class="families">${neighbours.map(x => famCard(x)).join("")}</div></section>` : ""}`;
}

// her household upload on the Gallery (24 Oct), laid out like a lot's Build notes: her description and comments, the card on the right
function hhGallery(hh, hc){
  const g = hh.gallery; if (!g) return "";
  const cs = (g.commentList || []).filter(c => (c.u || "").toLowerCase() !== "jemmathesimmer");
  return `<section class="block" style="--h:${hc}"><div class="block-head"><h2>On the <em>Gallery</em></h2></div>
    <div class="notes-wrap"><div class="notes-text">${g.title !== hh.name ? `<span class="label">Uploaded as “${esc(g.title)}”</span>` : ""}${g.description ? `<p class="lede">${esc(g.description)}</p>` : ""}
      ${g.tags?.length ? `<div class="tags">${g.tags.map(t => `<span>#${esc(t)}</span>`).join("")}</div>` : ""}
      ${cs.length ? `<div class="g-comments"><span class="label">Comments on the Gallery</span><ul>${cs.map(c => `<li><div class="c-head"><b>${esc(c.u || "A simmer")}</b>${c.t ? `<small>${new Date(c.t).toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"})}</small>` : ""}</div><p>${esc(c.m)}</p></li>`).join("")}</ul></div>` : ""}</div>
    <aside class="gallery-card"><span class="label">On the Sims 4 Gallery</span>
      <dl><div><dt>Favourites</dt><dd>${g.likes}</dd></div><div><dt>Downloads</dt><dd>${g.downloads}</dd></div><div><dt>Comments</dt><dd>${g.comments || 0}</dd></div>${g.shared ? `<div><dt>Shared</dt><dd>${esc(g.shared)}</dd></div>` : ""}</dl>
      ${g.packs?.length ? `<span class="label">Packs used</span><div class="packs">${g.packs.map(p => `<span>${esc(p)}</span>`).join("")}</div>` : `<span class="label">Packs used</span><div class="packs"><span>Base game only</span></div>`}
      <a class="gal-link" style="color:${textOn(hc)}" href="${esc(g.url)}" target="_blank" rel="noopener">View on the Gallery ${ic("arrow")}</a>
      <small>Favourites, downloads and comments as of ${esc(g.checked)}</small></aside></div></section>`;
}

// ---------- Stats: the spreadsheet view ----------
// lots in worlds she doesn't own never get a page, so their rows are plain text (19 Nov: they were links to "Page not found" after a sort);
// a Community Space lot counts all its versions together, as its lot page does (19 Nov)
const ROWS = DATA.stats.map(r => { const wd = worlds.find(w => w.name === r.w); const id = "l-" + slug(r.w) + "--" + slug(r.lot); const live = lotIndex[id];
  const vs = live && live.gallery && (DATA.csVersions || {})[live.world.name + "|" + live.lot], sum = k => vs.reduce((n, v) => n + v[k], 0);
  return {...r, type: (r.type || "").replace(/\s*\((?!\d+\??\))[^)]*\)?/g, "").trim(), owned: wd ? wd.owned : true, order: (wd && !wd.owned ? 100 : 0) + worlds.indexOf(wd), link: live && live.world.owned ? id : null,
    name: live ? live.name : (r.mine && r.mine.trim() && r.mine.trim() !== r.lot ? r.mine.trim() : r.lot), ea: live ? (live.ea || "") : (r.mine && r.mine.trim() && r.mine.trim() !== r.lot ? r.lot : ""),
    photos: vs ? new Set(vs.flatMap(v => v.photos.map(p => p.src))).size : live ? live.photos.length : 0,
    likes: vs ? sum("likes") : live && live.gallery ? live.gallery.likes : null, dls: vs ? sum("downloads") : live && live.gallery ? live.gallery.downloads : null}; });
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
  const st = statsState, q = fold(st.q).trim();   // folded like the sidebar search: Crow’s, Crow's and Crows all match (19 Nov)
  let rs = ROWS.filter(r => (!st.world || r.w === st.world) && (!st.hood || r.n === st.hood)
    && (!st.status || (st.status === "notbuilt" && r.built === false) || (st.status === "notshared" && r.built === true && r.shared === false) || (st.status === "nosims" && r.sims === false) || (st.status === "photos" && r.photos))
    && (!q || fold([r.name, r.lot, r.type, r.who, r.n, r.w].join(" ")).includes(q)));
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
      <div class="filters"><label>World<select id="f-world"><option value="">All worlds</option>${worlds.map(w => `<option value="${escAttr(w.name)}" ${statsState.world===w.name?"selected":""}>${esc(w.name)}</option>`).join("")}</select></label>
        <label>Neighbourhood<select id="f-hood"><option value="">All</option>${hoods.map(n => `<option value="${escAttr(n)}" ${statsState.hood===n?"selected":""}>${esc(n)}</option>`).join("")}</select></label>
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
    ${table("Most loved", "Favourites", loved.map(l => row(l, `${Math.round(100 * l.gallery.likes / l.gallery.downloads)}%<small> of ${countOf(l.gallery.downloads, "download")}</small>`)).join(""))}</div>
    <p class="showing">Most loved: the share of downloads that also got a favourite, for builds with at least 50 downloads.</p>`;
}
// the latest comments other simmers left on her builds, 15 Oct
function newestComments(){
  const all = Object.values(lotIndex).filter(l => l.gallery).flatMap(l => theirs(l).map(c => ({c, l}))).filter(x => x.c.t).sort((a, b) => b.c.t - a.c.t).slice(0, 8);
  if (!all.length) return "";
  return `<div class="g-comments newest"><span class="label">Newest comments</span><ul>${all.map(({c, l}) => `<li><div class="c-head"><b>${esc(c.u || "A simmer")}</b> on <a href="#${l.id}">${esc(l.name)}</a><small>${new Date(c.t).toLocaleDateString("en-GB", {day: "numeric", month: "short", year: "numeric"})}</small></div><p>${esc(c.m)}</p></li>`).join("")}</ul></div>`;
}
// after a redraw, keyboard focus goes back to the same control (19 Nov: the World select, sort buttons, calendar ticks); found again
// by its id or its data- key, as the redraw makes new elements
const FOCUS_KEYS = ["data-cal-kind", "data-cal-season", "data-cal-school", "data-sort", "data-hsort", "data-ver"];
function keepFocus(draw){
  const el = document.activeElement, view = document.getElementById("view");
  const k = !el || !view || !view.contains(el) ? null : el.id ? "#" + CSS.escape(el.id) : (a => a ? `[${a}="${CSS.escape(el.getAttribute(a))}"]` : null)(FOCUS_KEYS.find(a => el.hasAttribute(a)));
  const out = draw();
  if (k && !view.contains(document.activeElement)) document.querySelector("#view " + k)?.focus({preventScroll: true});
  return out;
}
function refreshStats(full){ keepFocus(() => { if (full) { const y = scrollY; document.getElementById("view").innerHTML = statsPage(); window.scrollTo(0, y); } else document.getElementById("lot-rows").innerHTML = lotRows(); }); }
document.addEventListener("change", e => { if (!e.target.closest("#lot-sheet")) return;
  if (e.target.id === "f-world") { statsState.world = e.target.value; statsState.hood = ""; refreshStats(true); }
  if (e.target.id === "f-hood") { statsState.hood = e.target.value; refreshStats(); }
  if (e.target.id === "f-status") { statsState.status = e.target.value; refreshStats(); } });
// the Stats table redraws once typing pauses, not on every key (it takes up to 0.3 s; 22 Oct)
let statsTyping;
document.addEventListener("input", e => { if (e.target.id === "f-q") { statsState.q = e.target.value; clearTimeout(statsTyping); statsTyping = setTimeout(refreshStats, 150); } });
document.addEventListener("click", e => { const so = e.target.closest("[data-sort]"); if (so) { statsState.dir = statsState.sort === so.dataset.sort ? -statsState.dir : 1; statsState.sort = so.dataset.sort; refreshStats(); }
  const sw = e.target.closest("[data-sw]"); if (sw) { statsState.world = sw.dataset.sw; statsState.hood = ""; refreshStats(true); document.getElementById("lot-sheet").scrollIntoView({behavior: SMOOTH()}); } });

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
// everything a freshly drawn page needs; also used when a Community Space version tab redraws the lot (15 Nov)
function afterDraw(key, view){
  if (typeof afterRoute === "function") afterRoute(key, view);   // js/sections.js: calendar links on world, neighbourhood and lot pages
  notOwnedLinks(view);
  initialsContrast(view);
  lazyPics(view);
  keyLinks(view);
}
let drawnOnce = false, routeY = 0;   // routeY: where Back or Forward returns to on the page (scrollBack below)
function route(){
  drawnOnce = true;
  closeLightbox();
  const key = location.hash.slice(1) || "home";
  const view = document.getElementById("view");
  versionsFor(key);   // Community Space lots: the version tab on its own lot page, all versions together elsewhere
  let html, active = "home"; const ctx = {};
  const wd = key.startsWith("w-") && worlds.find(w => open(w) && w.id === key.slice(2));
  const tp = typeof sectionPage === "function" ? sectionPage(key) : null;   // js/sections.js: Calendar, Across the worlds and Admin pages (old Stats links open Admin, Progress)
  if (tp) { html = tp.html; active = tp.active; document.title = tp.title; }
  else if (wd) { html = world(wd); active = wd.id; document.title = wd.name + " · Jemma’s Sim World"; }
  else if (lotIndex[key]) { const l = lotIndex[key]; ctx.hood = l.hood; ctx.lot = l; html = lot(l); markSeen(l); active = l.world.id; document.title = l.name + " · Jemma’s Sim World"; }
  else if (key.startsWith("n-") && hoodIndex[key.slice(2)]) { const x = hoodIndex[key.slice(2)]; ctx.hood = x; html = hoodPage(x); active = x.world.id; document.title = x.name + " · " + x.world.name + " · Jemma’s Sim World"; }
  else if (key.startsWith("f-") && worlds.find(w => open(w) && w.id === key.slice(2))) { const w = worlds.find(w => w.id === key.slice(2)); html = families(w); active = w.id; document.title = "Households · " + w.name + " · Jemma’s Sim World"; }
  else if (SIM_PAGES[key]) { const s = SIM_PAGES[key], base = s.hh || ANCHOR[s.id]; ctx.sim = s.src; ctx.hh = base; ctx.lot = base.lots[0]; ctx.hood = ctx.lot.hood; html = simPage(s); active = base.world.id; document.title = s.name + " · Jemma’s Sim World"; }
  else if (GROUP_PAGES[key]) { const g = GROUP_PAGES[key], base = g.homeHh; ctx.group = g; if (base) { ctx.hh = base; ctx.lot = base.lots[0]; ctx.hood = ctx.lot.hood; } html = groupPage(g); active = g.world && g.world.ready && g.world.owned ? g.world.id : ""; document.title = groupTitle(g) + " · Jemma’s Sim World"; }
  else if (hhIndex[key]) { const x = hhIndex[key]; ctx.hh = x; ctx.lot = x.lots[0]; ctx.hood = x.lots[0].hood; html = household(x); active = x.world.id; document.title = hhWord(x.name) + " · " + x.world.name + " · Jemma’s Sim World"; }
  else if (key === "home") { html = home(); document.title = "Jemma’s Sim World"; }
  else { html = `<section class="hero small" style="--c:#8E62CF"><div class="kicker"><i></i><span class="label">Page not found</span></div><h1 style="margin-top:14px">Nothing <em>here</em></h1><p>This link doesn’t match any world, neighbourhood, lot or household. It may be an old link from before something was renamed.</p></section>
    <section class="block"><p class="notfound"><a href="#home">${ic("home")}Go to the home page</a><a href="#admin-progress">Search every lot in Admin, Progress</a></p></section>`; document.title = "Page not found · Jemma’s Sim World"; active = ""; }
  document.title = curly(document.title);   // curly apostrophes in the tab title too (Crow’s Crossing, 19 Oct check)
  const cw = tp && tp.deep ? tp : worlds.find(w => w.id === active);
  const root = document.documentElement.style;
  if (cw && cw.deep) { root.setProperty("--deep", cw.deep[0]); root.setProperty("--deep-2", cw.deep[1]); }
  else { root.removeProperty("--deep"); root.removeProperty("--deep-2"); }
  view.innerHTML = html;
  afterDraw(key, view);
  clearSearch();
  renderNav(active, key, ctx);
  // keyboard users: the sidebar is redrawn, so put focus back on the link they chose
  if (navChosen) { document.querySelector("#nav a.cur, #nav a.path")?.focus({preventScroll: true}); navChosen = false; }
  window.scrollTo(0, +routeY || 0); routeY = 0;   // a new page starts at the top; Back and Forward return to where that page was
  if (document.body.classList.contains("nav-open")) setNav(false);
}

// Community Space lots: all four versions shown as equals (12 Oct). Each version has its own Gallery pictures, notes and stats.
const CS_VERSIONS = DATA.csVersions;
// the tab picked (l.vi) shows on the lot page only (19 Nov): every other page shows the first version's pictures with all the
// versions' favourites and downloads together, so cards elsewhere never follow the last tab clicked
function applyVersion(l, i){
  const v = l.versions[i]; l.photos = v.photos;
  l.gallery = {...l.baseGallery, title: v.title, url: v.url, likes: v.likes, downloads: v.downloads, value: v.value, packs: v.packs, description: v.description, tags: v.tags, shared: v.shared, label: v.label, others: null, beds: 0, baths: 0};
}
function versionsTogether(l){
  applyVersion(l, 0);
  l.gallery = {...l.gallery, likes: l.versions.reduce((n, v) => n + v.likes, 0), downloads: l.versions.reduce((n, v) => n + v.downloads, 0)};
}
const CS_LOTS = [];
Object.values(lotIndex).forEach(l => { const vs = CS_VERSIONS[l.world.name + "|" + l.lot]; if (vs && l.gallery) { l.versions = vs; l.baseGallery = l.gallery; l.vi = 0; versionsTogether(l); CS_LOTS.push(l); } });
// before a page is drawn: the lot page's own tab, everything else all versions together
const versionsFor = key => CS_LOTS.forEach(l => l.id === key ? applyVersion(l, l.vi) : versionsTogether(l));
// first visit: everything counts as seen (after the Community Space versions are in place, so their totals are used)
if (!seen) { seen = {}; Object.values(lotIndex).forEach(l => { if (l.gallery) seen[l.id] = seenNow(l); }); saveSeen(); }
function versionTabs(l){
  const tl = l.versions.reduce((n,v) => n + v.likes, 0), td = l.versions.reduce((n,v) => n + v.downloads, 0);
  return `<div class="versions" style="--h:${l.hood.color}"><span class="label">${l.versions.length} versions of this lot</span>
    <div class="ver-tabs" role="tablist">${l.versions.map((v,i) => `<button type="button" role="tab" data-ver="${i}" aria-selected="${i===l.vi}" class="${i===l.vi?"on":""}"><span class="ver-pic" style="background-image:url('${v.photos[0].thumb}')"></span><span class="ver-txt"><b>${esc(v.label)}</b><small>${countOf(v.likes, "favourite")} · ${countOf(v.downloads, "download")}</small></span></button>`).join("")}</div>
    <small class="ver-total">All ${l.versions.length} together: ${countOf(tl, "favourite")} · ${countOf(td, "download")}</small></div>`;
}
document.addEventListener("click", e => { const b = e.target.closest("[data-ver]"); if (!b) return; const l = lotIndex[location.hash.slice(1)]; if (!l || !l.versions) return;
  l.vi = +b.dataset.ver; applyVersion(l, l.vi); const y = scrollY, view = document.getElementById("view"); view.innerHTML = lot(l); afterDraw(location.hash.slice(1), view); window.scrollTo(0, y); document.querySelector(`[data-ver="${b.dataset.ver}"]`)?.focus(); });
/* ---------- families in worlds she doesn't own yet (her choice A, 19 Oct; ported from for-jemma/prototypes/not-owned) ----------
   Their household and Sim pages are the usual ones with a lighter banner and one plain line; they're listed under their world
   in the sidebar's Not owned list. Marks: a hollow dot or monogram, like the sidebar's not-owned worlds. Their lots,
   neighbourhoods and worlds don't open, so links to them become plain text. */
const notOwnedW = w => !!w && !w.owned;
const simWorldOf = id => { const s = SIMS[id]; return s ? (s.hh ? s.hh.world : s.world) : null; };
const awaySim = id => !!SIMS[id] && !SIMS[id].ph && notOwnedW(simWorldOf(id));
const NO_LOTS = {}, NO_HOODS = {};   // lots and neighbourhoods of not-owned worlds never get pages; kept here to spot links to them
Object.keys(lotIndex).forEach(k => { if (notOwnedW(lotIndex[k].world)) { NO_LOTS[k] = lotIndex[k]; delete lotIndex[k]; } });
Object.keys(hoodIndex).forEach(k => { if (notOwnedW(hoodIndex[k].world)) { NO_HOODS[k] = hoodIndex[k]; delete hoodIndex[k]; } });
// homeChip: a hollow dot, and the tooltip says so
const homeChipOwned = homeChip;
homeChip = function (s, worldOnly) {
  const h = homeChipOwned(s, worldOnly), w = s.hh ? s.hh.world : s.world;
  if (!h || !notOwnedW(w)) return h;
  const who = s.hh ? hhWord(s.hh.name) : s.hhName ? hhWord(s.hhName) : "";
  return h.replace('class="hhchip"', 'class="hhchip notown"').replace(/title="[^"]*"/, `title="${esc((who ? who + ", " : "") + w.name)}, a world you don’t own yet"`);
};
// simWhere: "Monticapp household · Tartosa (not owned)"
const simWhereOwned = simWhere;
simWhere = function (o) { const t = SIMS[o], out = simWhereOwned(o); return t && t.hh && notOwnedW(t.hh.world) ? out + " (not owned)" : out; };
// tree cards, family cards, relationship cards and dynasty member cards: a hollow monogram
const markAway = (html, id, cls) => awaySim(id) ? html.replace(`class="${cls} `, `class="${cls} notown `) : html;
const treeCardOwned = treeCard;     treeCard = (id, ...a) => markAway(treeCardOwned(id, ...a), id, "tc");
const simFamItemOwned = simFamItem; simFamItem = (o, w) => markAway(simFamItemOwned(o, w), o, "card");
const simRelCardOwned = simRelCard; simRelCard = r => markAway(simRelCardOwned(r), r.o, "rel-card");
const memberCardOwned = memberCard; memberCard = (g, id, r) => markAway(memberCardOwned(g, id, r), id, "mcard");
// the tree key gets one more line when the tree has someone from a world she doesn't own
const treeKeyOwned = treeKey;
treeKey = function (ids, ...a) {
  const h = treeKeyOwned(ids, ...a);
  return ids.some(awaySim) ? h.replace(/<\/div>\s*$/, `<span><span class="k-notown"></span>In a world you don’t own yet</span></div>`) : h;
};
// the pages: a lighter banner and one plain line under it
const notOwnedNote = w => `<div class="note notown-note">This family lives in ${esc(w.name)} (${esc(w.pack)}), a world you don’t own yet. Their home and the world will open once the pack is in.</div>`;
const afterHero = (h, extra) => { const i = h.indexOf("</section>") + 10; return h.slice(0, i).replace('class="hero small"', 'class="hero small notown"') + extra + h.slice(i); };
const householdNewOwned = householdNew;
householdNew = hh => notOwnedW(hh.world) ? afterHero(householdNewOwned(hh), notOwnedNote(hh.world)) : householdNewOwned(hh);
const householdOwned = household;
household = hh => notOwnedW(hh.world) && !hh.sims.some(sm => sm.sid) ? afterHero(householdOwned(hh), notOwnedNote(hh.world)) : householdOwned(hh);
const simPageOwned = simPage;
simPage = function (s) {
  const w = simWorldOf(s.id); if (!notOwnedW(w)) return simPageOwned(s);
  return afterHero(simPageOwned(s), `<div class="note notown-note">Lives in ${esc(w.name)} (${esc(w.pack)}), a world you don’t own yet.</div>`);
};
// links to lots, neighbourhoods and worlds that don't open become plain text (a world crumb says "(not owned)")
function notOwnedLinks(root){
  root.querySelectorAll('a[href^="#"]').forEach(a => {
    const k = a.getAttribute("href").slice(1);
    const w = NO_LOTS[k] ? NO_LOTS[k].world : k.startsWith("n-") && NO_HOODS[k.slice(2)] ? NO_HOODS[k.slice(2)].world : /^[wf]-/.test(k) ? worlds.find(x => x.id === k.slice(2)) : null;
    if (!w || w.ready) return;
    const sp = document.createElement("span"); sp.className = (a.className + " nolink").trim(); sp.innerHTML = a.innerHTML;
    if (k.startsWith("w-") && a.closest(".crumbs")) sp.append(" (not owned)");
    a.replaceWith(sp);
  });
}
// sidebar: a not-owned world with families unfolds to its households, like an owned world's list
const renderNavOwned = renderNav, NO_FOLD = new Set();
renderNav = function (active, key, ctx) {
  renderNavOwned(active, key, ctx);
  const cur = ctx && ctx.hh && notOwnedW(ctx.hh.world) ? ctx.hh.world : null;
  document.querySelectorAll("#nav .nav-group.dim a.soon").forEach(a => {
    const w = worlds.find(x => x.name === a.textContent.trim()), hhs = w ? Object.values(w.households).sort(byHh) : [];
    if (!hhs.length) return;
    const open = w === cur || NO_FOLD.has(w.id);
    a.classList.add("has-hh"); a.dataset.nofold = w.id; a.setAttribute("role", "button"); a.tabIndex = 0; a.setAttribute("aria-expanded", open); a.removeAttribute("aria-disabled");   // tabIndex: reachable by keyboard (15 Nov)
    a.insertAdjacentHTML("beforeend", `<span class="pct">${hhs.length}</span>`);
    a.insertAdjacentHTML("afterend", `<div class="subnav" ${open ? "" : "hidden"}>${hhs.map(hx => `<a href="#${hx.id}" class="${ctx.hh === hx ? (ctx.sim ? "path" : "cur") : ""}">${esc(hhListName(hx))}</a>${ctx.hh === hx ? `<div class="lotnav">${hx.sims.map(sm => `<a href="#s-${sm.sid}" class="${ctx.sim === sm ? "cur" : ""}">${esc(sm.name)}</a>`).join("")}</div>` : ""}`).join("")}</div>`);
  });
};
document.addEventListener("click", e => { const a = e.target.closest("#nav a[data-nofold]"); if (!a) return; e.preventDefault();
  const id = a.dataset.nofold, list = a.nextElementSibling, show = list.hidden; list.hidden = !show; a.setAttribute("aria-expanded", show); show ? NO_FOLD.add(id) : NO_FOLD.delete(id); });
document.addEventListener("keydown", e => { const a = e.target.closest && e.target.closest("#nav a[data-nofold]"); if (!a || (e.key !== "Enter" && e.key !== " ")) return; e.preventDefault(); a.click(); });
// search: their households and Sims can be found, marked "not owned"
const searchIndexOwned = searchIndex;
searchIndex = function () {
  const out = searchIndexOwned();
  const add = (kind, name, where, href) => out.push({kind, name, where, href, keys: [[name, fold(name)]]});
  worlds.filter(w => !w.owned).forEach(w => Object.values(w.households).forEach(x => { add("Household", x.name, w.name + " (not owned)", "#" + x.id);
    x.sims.forEach(sm => add("Sim", sm.name, hhWord(x.name) + " · not owned", sm.sid ? "#s-" + sm.sid : "#" + x.id)); }));
  return out;
};

/* ---------- the save's calendar (19 Oct, her choices: weeks start on Monday, four-week seasons,
   holidays of her own; the page itself is drawn by js/sections.js). Ported from for-jemma/prototypes/calendar (option A, the week calendar). Festivals and regular events come
   from data/calendar.json (the game's own files, checked against the Sims Wiki); lot nights are made from her lots' types and traits. */
const CAL = Object.assign({events: [], lotEvents: [], holidays: [], seasons: ["Spring", "Summer", "Autumn", "Winter"], seasonWeeks: 4, surprise: []}, DATA.calendar || {});
const CAL_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const CAL_DAY_NAMES = {Mon: "Monday", Tue: "Tuesday", Wed: "Wednesday", Thu: "Thursday", Fri: "Friday", Sat: "Saturday", Sun: "Sunday"};
const CAL_OFTEN = {week: "every week", fortnight: "every other week", third: "every third week", lounge: "the game picks each week"};
const CAL_KINDS = {holiday: "Holidays", festival: "Festivals", community: "Community events", school: "Educational", lot: "Lot nights"};   // split up (her asks, 19 Oct)
const calKind = e => e.kind === "uni" || e.kind === "highschool" ? "school" : e.kind;
// festivals, community events and lot nights are filtered by world; education by university or high school (her asks, 19 Oct)
const calSub = e => e.kind === "uni" ? "University" : e.kind === "highschool" ? "High school" : e.kind === "lot" ? (/^Lounge/.test(e.lotType) ? "Lounges" : e.lotType + "s") : null;

const calW = name => worlds.find(w => w.name === name);
// text on a world-coloured chip: dark on the light colours (Sulani's yellow), white on the rest
const onColour = hex => { const n = parseInt(String(hex).slice(1), 16), [r, g, b] = [n >> 16 & 255, n >> 8 & 255, n & 255];
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.62 ? "#1A1F1C" : "#fff"; };
const calHues = name => { const c = (calW(name) || {}).color || "#888"; return `--h:${c};--on:${onColour(c)}`; };
let CAL_ALL = null;
function calEvents(){
  if (CAL_ALL) return CAL_ALL;
  const all = CAL.events.map(e => ({...e}));
  worlds.filter(w => w.owned && w.ready).forEach(w => w.hoods.forEach(h => h.lots.forEach(l => CAL.lotEvents.forEach(t => {
    if (!(l.type || "").startsWith(t.type) || (t.trait && !(l.traits || []).includes(t.trait))) return;
    all.push({w: w.name, hood: h.name, name: t.name, days: t.days, time: t.time, start: t.start, kind: "lot", where: l.name, lotType: l.type.split("/")[0],
      link: "#" + l.id, often: /^Lounge/.test(l.type) ? "lounge" : "week", built: l.built === true}); }))));
  return CAL_ALL = all.filter(e => calW(e.w) && calW(e.w).owned).map(e => ({...e, order: worlds.indexOf(calW(e.w))}));
}
const calState = {kinds: new Set(["holiday", "festival", "community"]), world: null, school: null};
// kept as "jsw-calendar-4" (21 Nov: every key of this site starts jsw-); a value kept under the old name "calendar-4" moves across once
const CAL_KEY = "jsw-calendar-4";
try { const old = localStorage.getItem("calendar-4"); if (old !== null) { if (localStorage.getItem(CAL_KEY) === null) localStorage.setItem(CAL_KEY, old); localStorage.removeItem("calendar-4"); } } catch (e) {}
try { const s = JSON.parse(localStorage.getItem(CAL_KEY) || "{}"); if (s && Array.isArray(s.kinds)) calState.kinds = new Set(s.kinds.filter(k => CAL_KINDS[k])); } catch (e) {}
const calKeep = () => { try { localStorage.setItem(CAL_KEY, JSON.stringify({kinds: [...calState.kinds]})); } catch (e) {} };
const calPlace = e => { const w = calW(e.w), hid = w && e.hood ? w.id + "-" + slug(e.hood) : null;
  return e.link ? `<a href="${e.link}">${esc(e.where)}</a>` : hid && hoodIndex[hid] ? `<a href="#n-${hid}">${esc(e.where || e.hood)}</a>` : esc(e.where || e.hood || ""); };
const calTag = e => e.often === "fortnight" ? `<span class="often">${ic("repeat")}every other week</span>` : e.often === "third" ? `<span class="often">${ic("repeat")}every third week</span>` : "";
const calStar = e => e.star ? `<sup title="The game never shows this name; it’s made from the game’s settings">*</sup>` : "";
const calPill = e => `<div class="ev k-${e.kind} o-${slug(e.often || "")}${e.built === false ? " unbuilt" : ""}" style="${e.agg ? "--h:#9A7B3A;--on:#fff" : calHues(e.w)}">
  <span class="t">${esc(e.time)}</span><b>${esc(e.label || e.name)}${calStar(e)}</b>
  <small>${[e.agg ? "" : `<a href="#w-${calW(e.w).id}">${esc(e.w)}</a>`, e.agg ? esc(e.where) : calPlace(e)].filter(Boolean).join(" · ")}</small>${calTag(e)}</div>`;
// which weeks of a season an event is on (1-4): every week, or every other week (pairs take turns; which week depends on her save)
const calWeeks = e => e.often === "fortnight" ? (e.pair && e.name.toLowerCase() > e.pair.toLowerCase().replace(/^the /, "") ? [2, 4] : e.name === "Flea Market" ? [2, 4] : [1, 3]) : e.often === "third" ? [1, 4] : [1, 2, 3, 4];
const calHolidays = sn => [...(CAL.gameHolidays || []).filter(x => !CAL.holidays.some(y => y.replaces === x.name)), ...CAL.holidays].filter(x => x.season === sn);
calState.season ||= "Spring";

document.getElementById("menuIco").innerHTML = ic("menu");
document.getElementById("searchIco").innerHTML = ic("search");
let navChosen = false;
document.getElementById("nav").addEventListener("click", e => { if (e.target.closest("a[href^='#']") && e.detail === 0) navChosen = true; });   // a keyboard "click" (Enter) has detail 0
// Back and Forward (21 Nov): each history entry keeps how far down its page was scrolled (in history.state), so going back
// returns there; a new entry has none, so a link still opens its page at the top
if ("scrollRestoration" in history) history.scrollRestoration = "manual";
let scrollKeep = 0;
const keepScroll = () => { clearTimeout(scrollKeep); try { history.replaceState({...(history.state || {}), y: scrollY}, ""); } catch (e) {} };
addEventListener("scroll", () => { clearTimeout(scrollKeep); scrollKeep = setTimeout(keepScroll, 120); }, {passive: true});
document.addEventListener("click", e => { if (e.target.closest && e.target.closest("a[href^='#'], [data-lot-link]")) keepScroll(); }, true);
const scrollBack = () => { routeY = history.state && history.state.y; route(); };
addEventListener("hashchange", scrollBack);
// the phone's Worlds drawer (21 Nov): the button says whether it's open, a closed drawer can't be reached with Tab (inert),
// opening it moves focus in, and Escape or the scrim closes it with focus back on the button
const sideEl = document.getElementById("side"), menuBtn = document.getElementById("menuBtn"), phoneNav = matchMedia("(max-width:900px)");
function setNav(open, focus){
  const wasIn = sideEl.contains(document.activeElement);
  document.body.classList.toggle("nav-open", open);
  menuBtn.setAttribute("aria-expanded", String(open));
  sideEl.inert = phoneNav.matches && !open;
  // while it's open on a phone, the page behind can't be reached with Tab or scrolled (focus stays in the drawer and the top bar's button)
  const lock = phoneNav.matches && open;
  document.querySelectorAll("body > *:not(#side):not(.topbar):not(#scrim):not(script)").forEach(el => { el.inert = lock; });
  document.documentElement.classList.toggle("nav-lock", lock);
  if (open && focus) (sideEl.querySelector('.nav-group a[href="#home"]') || sideEl.querySelector("a,input"))?.focus({preventScroll: true});   // starts on Home, not "← Jemma's Journals" (her call 21 Nov: one Enter shouldn't leave the site)
  if (!open && phoneNav.matches && (focus || wasIn)) menuBtn.focus({preventScroll: true});
}
menuBtn.setAttribute("aria-controls", "side");
menuBtn.addEventListener("click", () => setNav(!document.body.classList.contains("nav-open"), true));
document.getElementById("scrim").addEventListener("click", () => setNav(false, true));
addEventListener("keydown", e => { if (e.key === "Escape" && document.body.classList.contains("nav-open")) setNav(false, true); });
// Tab wraps round inside the open drawer (the Menu button, then the drawer's links), so focus never leaves it for the browser's own bar
addEventListener("keydown", e => {
  if (e.key !== "Tab" || !phoneNav.matches || !document.body.classList.contains("nav-open")) return;
  const all = [menuBtn, ...sideEl.querySelectorAll('a[href],button,input,select,[tabindex]:not([tabindex="-1"])')].filter(el => !el.disabled && el.getClientRects().length);
  const k = all.indexOf(document.activeElement), last = all.length - 1;
  if (e.shiftKey ? k <= 0 : k === last || k < 0) { e.preventDefault(); all[e.shiftKey ? last : 0].focus(); }
});
phoneNav.addEventListener("change", () => setNav(false));
setNav(false);
// bottom of every page (21 Nov 2026, as on Jemma’s Journals): Back to top, and Dark/Light mode. The site always opens light, even when
// the device prefers dark (her rule for all her sites); pressing the button switches and the choice is kept in localStorage "jsw-mode"
// (read before the page is drawn by the small script in index.html's head).
const MODE_KEY = "jsw-mode", modeBtn = document.getElementById("modeBtn");
function showMode(){
  const dark = document.documentElement.getAttribute("data-mode") === "dark";
  modeBtn.querySelector(".ico").innerHTML = ic(dark ? "sun" : "moon");
  modeBtn.querySelector(".txt").textContent = dark ? "Light mode" : "Dark mode";
  modeBtn.setAttribute("aria-pressed", String(dark));
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", dark ? "#1B1524" : "#EEEAF2");
}
modeBtn.addEventListener("click", () => {
  const dark = document.documentElement.getAttribute("data-mode") !== "dark";
  document.documentElement.setAttribute("data-mode", dark ? "dark" : "light");
  try { localStorage.setItem(MODE_KEY, dark ? "dark" : "light"); } catch (e) {}
  showMode();
});
showMode();
// another window of the site switched mode: follow it
addEventListener("storage", e => { if (e.key !== MODE_KEY) return; document.documentElement.setAttribute("data-mode", e.newValue === "dark" ? "dark" : "light"); showMode(); });
document.querySelector("#toTop .ico").innerHTML = ic("arrow-up");
document.getElementById("toTop").addEventListener("click", () => {
  window.scrollTo({top: 0, behavior: SMOOTH()});
  document.getElementById("view").focus({preventScroll: true});   // keyboard users carry on from the top of the page
});
// the "← Jemma’s Journals" link (index.html, 20 Nov): "/" is home once online; opened as a file from her PC, "/" would be
// the C: drive, so it goes to her local copy of the home page instead (relative: Documents/SimTracker/site → Documents/JemmasJournals)
const HOME_LOCAL = "../../JemmasJournals/concepts/index.html";
if (location.protocol === "file:") document.querySelector(".home-link")?.setAttribute("href", HOME_LOCAL);
// the first page is drawn once, at the end of js/sections.js, so section pages never flash "Page not found" (15 Nov)
addEventListener("DOMContentLoaded", () => { if (!drawnOnce) route(); });   // only if js/sections.js didn't (it draws first, at its end)
