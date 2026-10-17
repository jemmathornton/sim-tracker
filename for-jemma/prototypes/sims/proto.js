// Sims prototypes (16–17 Oct): shared data and drawing code. Nothing here is used by the app, and nothing in site/ or data/ changes.
// Loaded after the app's own scripts (site/js/icons.js, data.js, app.js, read only), so the pages use the app's real worlds,
// households, colours and drawing functions (listing, famCard, renderNav…).
// Sim details come from the game's data as given on The Sims Wiki (fetched 16–17 Oct), checked against research/ea-family-lore.md.
// Her decisions, 17 Oct: a page per Sim; the household page is the family overview; the game's words (Spouse, Partner, Engaged)
// with no switch; a family tree per household from family links only; relationships only between Sims, on Sim pages; a page per
// group (dynasty, club, university organisation); origin is "Premade" or "Mine"; no "EA's version vs mine" anywhere.

/* ================= the page frame ================= */
const PROTO = "../for-jemma/prototypes/sims/";   // each page's <base> is site/, so links between prototype pages need this
const P_PAGES = [
  ["index.html", "Contents", "list-tree"],
  ["household.html", "Household page", "users"],
  ["sim.html", "Sim pages", "user-round", "?sim=mortimer-goth"],
  ["group.html", "Group pages", "flag", "?g=goth-dynasty"],
  ["family-tree.html", "Family tree", "network"],
  ["relationships.html", "Relationships", "link"],
  ["tags.html", "Relationship tags", "tag"],
];
let P_PAGE = "", P_CUR_SIM = "";
// Sims with their own page (every Sim in the end; the Goths first). Cornelia is on the Goths' tree but in no household.
const P_SIM_PAGES = ["mortimer-goth", "bella-goth", "cassandra-goth", "alexander-goth", "cornelia-goth"];
const pSimHref = id => `${PROTO}sim.html?sim=${id}`;
const pGroupHref = id => `${PROTO}group.html?g=${id}`;
// the sidebar is the app's own, with a "Prototypes" group added at the top, and the Goths' Sims under their household
const pAppRenderNav = renderNav;
renderNav = function (...a) {
  pAppRenderNav(...a);
  const nav = document.getElementById("nav");
  nav.insertAdjacentHTML("afterbegin", `<div class="nav-group"><div class="label">Prototypes · 16–17 Oct</div>${P_PAGES.map(([f, t, i, q]) =>
    `<a href="${PROTO}${f}${q || ""}" class="${f === P_PAGE ? "on" : ""}">${ic(i)}${t}</a>`).join("")}</div>`);
  // world → neighbourhood → lot → household → Sims, as in the app; here the household and its Sims open the prototype pages
  const fl = nav.querySelector('a.fam-link[href="#h-willow-creek--goth"]');
  if (!fl) return;
  fl.setAttribute("href", PROTO + "household.html");
  if (P_CUR_SIM) { fl.classList.remove("cur"); fl.classList.add("path"); }
  if (fl.nextElementSibling && fl.nextElementSibling.classList.contains("lotnav")) fl.nextElementSibling.remove();   // the app's own list (links to its household page)
  fl.insertAdjacentHTML("afterend", `<div class="lotnav proto-sims">${P_SIM_PAGES.map(id => { const s = P_SIMS[id];
    return `<a href="${pSimHref(id)}" class="${id === P_CUR_SIM ? "cur" : ""} ${s.hh ? "" : "away"}">${esc(s.name)}${s.late ? "<small>late</small>" : ""}</a>`; }).join("")}</div>`);
};
function protoStart(o) {
  P_PAGE = o.page;
  removeEventListener("hashchange", route);   // the app's own pages stay in the app
  const w = o.world ? worlds.find(x => x.id === o.world) : null, root = document.documentElement.style;
  if (w && w.deep) { root.setProperty("--deep", w.deep[0]); root.setProperty("--deep-2", w.deep[1]); }
  else { root.removeProperty("--deep"); root.removeProperty("--deep-2"); }
  const hh = o.hh ? hhIndex[o.hh] : null;
  renderNav(w ? w.id : "", hh ? hh.id : "", hh ? {hh, lot: hh.lots[0], hood: hh.lots[0].hood} : {});
  document.title = o.title + " · Prototype · Jemma’s Sim World";
}
// links to the app's pages ("#h-…", "#l-…") open the real app
document.addEventListener("click", e => {
  const a = e.target.closest("a[href^='#']"); if (!a) return;
  e.preventDefault(); e.stopImmediatePropagation();
  location.href = "index.html" + a.getAttribute("href");
}, true);
// the bar stays in view (with the page's choices); the options it shows go on the line under it
const protoBar = (title, opts, choices = "", date = "16 Oct") =>
  `<div class="proto-bar"><span class="proto-tag">Prototype, ${date}</span><b>${title}</b><div class="choices">${choices}</div></div><p class="proto-opts">${opts}</p>`;
// segmented choice buttons; each page has an onSeg(name, value)
const pSeg = (name, label, items, cur) => `<div class="seg" data-seg="${name}"><span>${label}</span>${items.map(([v, t, no]) =>
  `<button type="button" data-v="${v}" class="${v === cur ? "on" : ""}" aria-pressed="${v === cur}">${no ? `<i>${no}</i>` : ""}${t}</button>`).join("")}</div>`;
document.addEventListener("click", e => {
  const b = e.target.closest(".seg button"); if (!b) return;
  const s = b.closest(".seg"); s.querySelectorAll("button").forEach(x => { x.classList.toggle("on", x === b); x.setAttribute("aria-pressed", x === b); });
  if (typeof onSeg === "function") onSeg(s.dataset.seg, b.dataset.v);
});
const pWorldById = id => worlds.find(w => w.id === id);
const pWColour = w => w ? (w.glow || w.color) : "#8A918C";
// origin (her words, 17 Oct): "Premade" for the game's Sims and households (even when she changes them), "Mine" for hers
// and for children born in her game
const pOriginTag = o => `<span class="otag ${o === "mine" ? "mine" : ""}">${o === "mine" ? "Mine" : "Premade"}</span>`;

/* ================= relationship tags (§6, option B) ================= */
const P_TAG_GROUPS = {
  family:   {name: "Family",        icon: "network",   line: "solid"},
  romance:  {name: "Romance",       icon: "heart",     line: "solid2"},
  friends:  {name: "Friends",       icon: "smile",     line: "dash"},
  conflict: {name: "Conflict",      icon: "swords",    line: "zigzag"},
  work:     {name: "Work & school", icon: "briefcase", line: "dots"},
  dynasty:  {name: "Dynasty",       icon: "crown",     line: "double"},
};
// romance words are the game's since patch 162 (Spouse, Engaged, Partner): her decision, 17 Oct, everywhere and with no switch
const P_TAGS = {
  family:         {g: "family",   name: "Family"},
  spouse:         {g: "romance",  name: "Spouse"},
  engaged:        {g: "romance",  name: "Engaged"},
  partner:        {g: "romance",  name: "Partner"},
  ex:             {g: "romance",  name: "Ex"},
  "late-spouse":  {g: "romance",  name: "Late Spouse"},
  crush:          {g: "romance",  name: "Crush"},
  bff:            {g: "friends",  name: "Best Friends"},
  "good-friends": {g: "friends",  name: "Good Friends"},
  friends:        {g: "friends",  name: "Friends"},
  rivals:         {g: "conflict", name: "Rivals"},
  enemies:        {g: "conflict", name: "Enemies"},
  coworkers:      {g: "work",     name: "Coworkers"},
  classmates:     {g: "work",     name: "Classmates"},
  boss:           {g: "work",     name: "Boss"},
  landlord:       {g: "work",     name: "Landlord / Tenant"},
  ally:           {g: "dynasty",  name: "Dynasty Ally"},
  "dyn-rival":    {g: "dynasty",  name: "Dynasty Rival"},
  outcast:        {g: "dynasty",  name: "Outcast"},
};
const pTagName = t => P_TAGS[t].name;
const pTagPill = (t, cls = "") => `<span class="tg ${P_TAGS[t].g} ${cls}">${ic(P_TAG_GROUPS[P_TAGS[t].g].icon)}${esc(pTagName(t))}</span>`;

/* ================= Sims (§9's proposed data, as it would look) =================
   Save-wide ids. parents on the child; partners as [id, kind]; every other family word is worked out.
   line = the family they were born into (null = not known); into = the family they married into.
   hh = the app's household; world + home for Sims with no household on the site. origin: "premade" (all of these) or "mine". */
const P_SIMS = {
  // the Goths, and Mortimer's mother's family
  "simon-crumplebottom":    {name: "Simon Crumplebottom", sex: "m", age: "Elder", late: true, line: "crumplebottom", partners: [["prudence-crumplebottom", "spouse"]]},
  "prudence-crumplebottom": {name: "Prudence Crumplebottom", sex: "f", age: "Elder", late: true, line: "crumplebottom"},
  "cornelia-goth":   {name: "Cornelia Goth", sex: "f", age: "Elder", late: true, died: "In a fire", line: "crumplebottom", into: "goth", parents: ["simon-crumplebottom", "prudence-crumplebottom"], partners: [["gunther-goth", "unknown"]]},
  "gunther-goth":    {name: "Gunther Goth", sex: "m", ph: true, line: "goth", phText: "Father not on the family tree"},
  "agnes-crumplebottom": {name: "Agnes Crumplebottom", sex: "f", age: "Elder", line: "crumplebottom", parents: ["simon-crumplebottom", "prudence-crumplebottom"],
                     partners: [["robert-crumplebottom", "ex"], ["erik-darling", "late-spouse"]], world: "henford-on-bagley", home: "a townie", noHome: true},
  "robert-crumplebottom": {name: "Robert Crumplebottom", sex: "m", age: "", line: null, treeOnly: true},
  "erik-darling":    {name: "Erik Darling", sex: "m", age: "", late: true, line: null},
  "mortimer-goth":   {name: "Mortimer Goth", sex: "m", age: "Adult", hh: "h-willow-creek--goth", line: "goth", parents: ["cornelia-goth", "gunther-goth"], partners: [["bella-goth", "spouse"]],
                      traits: ["Bookworm", "Outgoing", "Creative"], bonus: "Quick Learner", aspiration: "Renaissance Sim", career: "Writer"},
  "bella-goth":      {name: "Bella Goth", sex: "f", age: "Young Adult", hh: "h-willow-creek--goth", line: "bachelor", into: "goth",
                      traits: ["Good", "Family-Oriented", "Romantic"], bonus: "Gregarious", aspiration: "Party Animal", career: "Secret Agent"},
  "cassandra-goth":  {name: "Cassandra Goth", sex: "f", age: "Teen", hh: "h-willow-creek--goth", line: "goth", parents: ["mortimer-goth", "bella-goth"],
                      traits: ["Creative", "Gloomy"], bonus: "Muser", aspiration: "Musical Genius", school: "High school"},
  "alexander-goth":  {name: "Alexander Goth", sex: "m", age: "Child", hh: "h-willow-creek--goth", line: "goth", parents: ["mortimer-goth", "bella-goth"],
                      traits: ["Bookworm"], aspiration: "Whiz Kid", school: "Grade school"},
  // the Pancakes (basics only, for the comparison)
  "bob-pancakes":    {name: "Bob Pancakes", sex: "m", age: "Young Adult", hh: "h-willow-creek--pancakes", line: "pancakes", partners: [["eliza-pancakes", "spouse"]]},
  "eliza-pancakes":  {name: "Eliza Pancakes", sex: "f", age: "Young Adult", hh: "h-willow-creek--pancakes", line: "hastings", into: "pancakes"},
  // the Capps and Montys (Royalty & Legacy): a family across Ondarion and Tartosa (Tartosa is her plan)
  "consort-capp":    {name: "Consort Capp", sex: "m", age: "Elder", state: "Ghost", line: "thebe", into: "capp", partners: [["contessa-capp", "late-spouse"]], world: "ondarion", home: "no home", noHome: true},
  "contessa-capp":   {name: "Contessa Capp", sex: "f", age: "", late: true, line: "capp"},
  "cordelia-capp":   {name: "Cordelia Capp", sex: "f", age: "", late: true, line: "capp", parents: ["consort-capp", "contessa-capp"], partners: [["caliban-capp", "spouse"]]},
  "caliban-capp":    {name: "Caliban Capp", sex: "m", age: "", late: true, line: null, into: "capp"},
  "tybalt-capp":     {name: "Tybalt Capp", sex: "m", age: "Adult", hh: "h-ondarion--capp", line: "capp", parents: ["cordelia-capp", "caliban-capp"]},
  "juliette-monty":  {name: "Juliette Monty", sex: "f", age: "Adult", line: "capp", into: "monty", parents: ["cordelia-capp", "caliban-capp"], partners: [["romeo-monty", "spouse"]], world: "tartosa", home: "Rifugio dei Pirati", hhName: "Monty"},
  "romeo-monty":     {name: "Romeo Monty", sex: "m", age: "Adult", line: "monty", world: "tartosa", home: "Rifugio dei Pirati", hhName: "Monty"},
  "beatrice-capp":   {name: "Beatrice Capp", sex: "f", age: "Young Adult", hh: "h-ondarion--capp", line: "capp", parents: ["tybalt-capp"]},
  "celeste-capp":    {name: "Celeste Capp", sex: "x", age: "Young Adult", hh: "h-ondarion--capp", line: "capp", parents: ["tybalt-capp"]},
  "virgilio-capp":   {name: "Virgilio Capp", sex: "m", age: "Young Adult", hh: "h-ondarion--capp", line: "capp", parents: ["tybalt-capp"]},
  "dante-monty":     {name: "Dante Monty", sex: "m", age: "Teen", line: "monty", parents: ["romeo-monty", "juliette-monty"], world: "tartosa", home: "Rifugio dei Pirati", hhName: "Monty"},
  "enzo-alto":       {name: "Enzo Alto", sex: "m", age: "", hh: "h-ondarion--enzo-alto", line: "alto"},
  // the Avant Gardes club (Get Together): Windenburg, Willow Creek and San Myshuno in her plan
  "maaike-haas":     {name: "Maaike Haas", sex: "f", age: "Young Adult", hh: "h-windenburg--free-spirits", line: "haas"},
  "gunther-munch":   {name: "Gunther Munch", sex: "m", age: "Young Adult", hh: "h-windenburg--munch", line: "munch"},
  "hugo-villareal":  {name: "Hugo Villareal", sex: "m", age: "Teen", hh: "h-willow-creek--villareal", line: "villareal"},
  "yuki-behr":       {name: "Yuki Behr", sex: "f", age: "Teen", hh: "h-san-myshuno--behr", line: "behr"},
};
Object.entries(P_SIMS).forEach(([id, s]) => { s.id = id; s.origin ||= "premade"; });
const P_HH_ORIGIN = {"h-willow-creek--goth": "premade", "h-willow-creek--pancakes": "premade"};
const P_FAMILIES = {
  goth:          {name: "Goth"},
  crumplebottom: {name: "Crumplebottom"},
  bachelor:      {name: "Bachelor", note: "No Bachelors on the family tree"},
  hastings:      {name: "Hastings"},
  pancakes:      {name: "Pancakes"},
  capp:          {name: "Capp"},
  monty:         {name: "Monty"},
  thebe:         {name: "Thebe"},
};
const pMembersOf = hhId => Object.keys(P_SIMS).filter(id => P_SIMS[id].hh === hhId);

/* ================= groups: dynasties, clubs, university organisations (her decision, 17 Oct) =================
   One page each, the same layout for all three. A Sim is in at most one dynasty. home = where the group is based (a dynasty:
   its head's household; a club: the world of its meeting place); members living elsewhere show lighter, with a world chip. */
const P_GROUP_KINDS = {
  dynasty: {name: "Dynasty", icon: "crown", roles: {head: "Head", heir: "Heir", member: "Member", outcast: "Outcast"}},
  club:    {name: "Club", icon: "flag", roles: {leader: "Leader", member: "Member"}},
  org:     {name: "University organisation", icon: "graduation-cap", roles: {member: "Member"}},
};
const P_SIM_GROUPS = {
  "goth-dynasty":  {kind: "dynasty", name: "Goth", homeHh: "h-willow-creek--goth", world: "willow-creek", prestige: 3, ideals: ["Passionate", "Mysterious"], allies: [], rivals: [],
                    note: "Only in saves started after Royalty & Legacy.",
                    members: [["mortimer-goth", "head"], ["cassandra-goth", "heir"], ["bella-goth", "member"], ["alexander-goth", "member"]]},
  "capp-dynasty":  {kind: "dynasty", name: "Capp", homeHh: "h-ondarion--capp", world: "ondarion", prestige: 7, ideals: ["Diplomatic", "Connoisseur", "Artistic"], allies: ["Alto"], rivals: ["monty-dynasty"],
                    members: [["tybalt-capp", "head"], ["beatrice-capp", "heir"], ["celeste-capp", "member"], ["consort-capp", "member"], ["virgilio-capp", "outcast"]]},
  "monty-dynasty": {kind: "dynasty", name: "Monty", homeWorld: "tartosa", homeName: "Monty", world: "tartosa", prestige: 1, ideals: ["Passionate", "Hardworking"], allies: [], rivals: ["capp-dynasty"],
                    members: [["juliette-monty", "head"], ["dante-monty", "heir"], ["romeo-monty", "member"]]},
  "avant-gardes":  {kind: "club", name: "Avant Gardes", world: "windenburg", place: "l-windenburg--south-square-coffee",
                    activities: ["Coffee", "Reading", "Homework", "Writing", "Video games"], rules: ["Invite only"],
                    members: [["maaike-haas", "leader"], ["gunther-munch", "member"], ["hugo-villareal", "member"], ["yuki-behr", "member"]]},
};
const pGroupTitle = g => g.kind === "dynasty" ? `${g.name} dynasty` : g.name;
const pGroupsOf = id => Object.entries(P_SIM_GROUPS).filter(([, g]) => g.members.some(([m]) => m === id)).map(([gid, g]) => [gid, g, g.members.find(([m]) => m === id)[1]]);
const pDynastyOf = id => pGroupsOf(id).find(([, g]) => g.kind === "dynasty");
// is this member based where the group is?
function pAtHome(g, id) {
  const s = P_SIMS[id];
  if (g.homeHh) return s.hh === g.homeHh;
  if (g.homeWorld) return !s.hh && s.world === g.homeWorld && s.hhName === g.homeName;
  const hh = s.hh && hhIndex[s.hh]; return hh ? hh.world.id === g.world : s.world === g.world;
}
// a member as a small box, like the tree's cards: based here = highlighted; elsewhere = lighter, with a world chip
function pMemberCard(gid, id, role) {
  const g = P_SIM_GROUPS[gid], s = P_SIMS[id], here = pAtHome(g, id), href = pSimLinkTo(id);
  const R = P_GROUP_KINDS[g.kind].roles[role], crown = ["head", "heir", "leader"].includes(role);
  return `<div class="mcard ${here ? "here" : "away"} ${s.late ? "late" : ""}" style="--w:${pSimColour(id)}"><span class="tm">${initial(s.name)}</span>
    <div class="tn">${href ? `<a href="${href}">${esc(s.name)}</a>` : esc(s.name)}</div><div class="ts">${esc([s.age, s.state].filter(Boolean).join(" · "))}</div>
    <div class="tchip">${here ? "" : pHomeChip(s)}</div><span class="badge ${role === "outcast" ? "out" : role === "member" ? "plain" : ""}">${crown ? ic(g.kind === "club" ? "flag" : "crown") : ""}${esc(R)}</span></div>`;
}

/* ---------- a household's family tree (her rules, 17 Oct) ----------
   Centred on the Sims who live there; built from family links only (parents and partners), never from who lives together.
   Everyone in the household, all their blood relatives wherever they live, and those relatives' partners ("plus ones").
   Worlds don't matter. A Sim with no family anywhere isn't drawn; a household where nobody has family gets no tree at all. */
function pTreeOf(hhId) {
  const all = Object.keys(P_SIMS), set = new Set();
  pMembersOf(hhId).forEach(m => all.forEach(o => { if (!P_SIMS[o].ph && pBlood(m, o)) set.add(o); }));   // pBlood(m, m) counts: members are in
  [...set].forEach(id => pPartnersOf(id).forEach(([p]) => { if (P_SIMS[p]) set.add(p); }));            // plus ones (and placeholders like Mortimer's father)
  [...set].forEach(id => (P_SIMS[id].parents || []).forEach(p => { if (P_SIMS[p] && P_SIMS[p].ph) set.add(p); }));
  const famLinked = (a, b) => (P_SIMS[a].parents || []).includes(b) || (P_SIMS[b].parents || []).includes(a) || pPartnersOf(a).some(([p]) => p === b);
  const ids = [...set].filter(a => [...set].some(b => b !== a && famLinked(a, b)));
  return ids.length > 1 ? ids.sort((a, b) => all.indexOf(a) - all.indexOf(b)) : [];
}

/* ---------- family words, worked out (never typed) ---------- */
const pSx = (s, m, f, x) => s === "m" ? m : s === "f" ? f : x;
function pPartnersOf(id) {
  const out = (P_SIMS[id].partners || []).slice();
  Object.values(P_SIMS).forEach(t => (t.partners || []).forEach(([p, k]) => { if (p === id && !out.some(x => x[0] === t.id)) out.push([t.id, k]); }));
  return out;
}
function pAncestors(id, d = 0, out = new Map()) {
  if (!out.has(id) || out.get(id) > d) out.set(id, d);
  (P_SIMS[id].parents || []).forEach(p => { if (P_SIMS[p] && !P_SIMS[p].ph) pAncestors(p, d + 1, out); });
  return out;
}
function pBlood(a, b) {
  const A = pAncestors(a), B = pAncestors(b); let best = null;
  A.forEach((da, x) => { if (B.has(x)) { const db = B.get(x); if (!best || da + db < best[0] + best[1]) best = [da, db]; } });
  return best;
}
function pPartnerWord(kind) {
  const T = P_TAGS[kind]; if (!T || kind === "unknown") return "Partner";
  return kind === "ex" ? "Ex-Spouse" : T.name;
}
function pRelWord(a, b) {   // what b is to a
  const s = P_SIMS[b].sex, p = pPartnersOf(a).find(x => x[0] === b);
  if (p) return pPartnerWord(p[1]);
  const r = pBlood(a, b);
  if (r) {
    const [da, db] = r;
    if (da === 0) return [null, pSx(s, "Son", "Daughter", "Child"), pSx(s, "Grandson", "Granddaughter", "Grandchild"), pSx(s, "Great-grandson", "Great-granddaughter", "Great-grandchild")][db] || "Descendant";
    if (db === 0) return [null, pSx(s, "Father", "Mother", "Parent"), pSx(s, "Grandfather", "Grandmother", "Grandparent"), pSx(s, "Great-grandfather", "Great-grandmother", "Great-grandparent")][da] || "Ancestor";
    if (da === 1 && db === 1) return pSx(s, "Brother", "Sister", "Sibling");
    if (da === 2 && db === 1) return pSx(s, "Uncle", "Aunt", "Parent’s sibling");
    if (da === 3 && db === 1) return pSx(s, "Great-uncle", "Great-aunt", "Grandparent’s sibling");
    if (da === 1 && db === 2) return pSx(s, "Nephew", "Niece", "Sibling’s child");
    if (da === 2 && db === 2) return "Cousin";
    return "Relative";
  }
  for (const [q, k] of pPartnersOf(a)) {   // in-laws
    if (k !== "spouse") continue;
    const r2 = pBlood(q, b);
    if (r2 && r2[1] === 0 && r2[0] === 1) return pSx(s, "Father-in-law", "Mother-in-law", "Parent-in-law");
    if (r2 && r2[0] === 1 && r2[1] === 1) return pSx(s, "Brother-in-law", "Sister-in-law", "Sibling-in-law");
  }
  for (const c of Object.keys(P_SIMS)) {   // a child's spouse
    const r3 = pBlood(a, c);
    if (r3 && r3[0] === 0 && r3[1] === 1 && pPartnersOf(c).some(([q, k]) => q === b && k === "spouse")) return pSx(s, "Son-in-law", "Daughter-in-law", "Child-in-law");
  }
  return null;
}
// a Sim's family, closest first (partners, parents, children, siblings, then the rest)
const P_FAMILY_ORDER = ["Spouse", "Engaged", "Partner", "Ex-Spouse", "Late Spouse", "Mother", "Father", "Parent", "Daughter", "Son", "Child", "Sister", "Brother", "Sibling",
  "Grandmother", "Grandfather", "Grandparent", "Granddaughter", "Grandson", "Grandchild", "Great-grandmother", "Great-grandfather", "Great-grandparent",
  "Aunt", "Uncle", "Great-aunt", "Great-uncle", "Niece", "Nephew", "Cousin", "Mother-in-law", "Father-in-law", "Daughter-in-law", "Son-in-law", "Sister-in-law", "Brother-in-law"];
function pFamilyOf(id) {
  const s = P_SIMS[id], rank = w => { const i = P_FAMILY_ORDER.indexOf(w); return i < 0 ? 99 : i; };
  const band = o => P_SIMS[o].hh && P_SIMS[o].hh === s.hh ? 0 : P_SIMS[o].late ? 2 : 1;   // household, living elsewhere, late
  return Object.keys(P_SIMS).filter(o => o !== id && !P_SIMS[o].ph).map(o => [o, pRelWord(id, o)]).filter(([, w]) => w)
    .sort((x, y) => rank(x[1]) - rank(y[1]) || band(x[0]) - band(y[0]));
}
// where a Sim lives, as a coloured chip (the world's colour)
function pHomeChip(s) {
  const hh = s.hh ? hhIndex[s.hh] : null;
  if (hh) return `<a class="hhchip" href="#${hh.id}" style="--w:${pWColour(hh.world)}">${esc(hh.name)} · ${esc(hh.world.name)}</a>`;
  const w = pWorldById(s.world);
  if (w) return `<span class="hhchip" style="--w:${pWColour(w)}" title="${esc([s.home, w.name + (w.owned ? "" : " (not owned)")].filter(Boolean).join(", "))}">${s.hhName ? esc(s.hhName) + " · " : ""}${esc(w.name)}</span>`;
  return "";
}
// where another Sim's link goes: their Sim page, else their household in the app, else nowhere
const pSimLinkTo = o => P_SIM_PAGES.includes(o) ? pSimHref(o) : P_SIMS[o].hh && hhIndex[P_SIMS[o].hh] ? "#" + P_SIMS[o].hh : "";
function pSimWhere(o) {
  const t = P_SIMS[o]; if (t.late) return "late";
  const hh = t.hh && hhIndex[t.hh]; if (hh) return `${hh.name} household · ${hh.world.name}`;
  const w = pWorldById(t.world); return w ? `${t.hhName ? t.hhName + " · " : ""}${w.name}${w.owned ? "" : " (not owned)"}${t.noHome ? " · no home" : ""}` : "";
}
const pSimColour = o => { const t = P_SIMS[o], hh = t.hh && hhIndex[t.hh]; return t.late ? "#A3AAA5" : pWColour(hh ? hh.world : pWorldById(t.world)); };

/* ================= drawn family tree (§7a, option A, decided 17 Oct) =================
   Founders at the top, one row per generation, couples side by side (solid line = spouses, dashed = partners,
   broken = ex, faint = late spouse), children hang below. Cards: monogram, name, life stage, where they live.
   o: {line (the household's family), here (the household: its Sims highlighted), compact, cw, ch, labels (generation labels)} */
function pDrawTree(ids, o = {}) {
  const C = o.compact, CW = o.cw || (C ? 136 : 188), CH = o.ch || (C ? 112 : 128), CG = C ? 28 : 38, SG = C ? 14 : 26, RG = C ? 44 : 58, LX = o.labels === false ? 6 : 96, PAD = 14;
  const inT = new Set(ids), S = id => P_SIMS[id];
  const ps = id => (S(id).parents || []).filter(p => inT.has(p));
  const prs = id => pPartnersOf(id).filter(([p]) => inT.has(p));
  // generations: children one below their parents; married-in partners beside their partner
  const gen = Object.fromEntries(ids.map(id => [id, 0]));
  for (let k = 0, ch = true; ch && k < 40; k++) { ch = false;
    ids.forEach(id => { const pp = ps(id); let g = pp.length ? Math.max(...pp.map(p => gen[p] + 1)) : Math.max(0, ...prs(id).filter(([p]) => ps(p).length).map(([p]) => gen[p]));
      if (g !== gen[id]) { gen[id] = g; ch = true; } }); }
  // units: a Sim with the partners beside them
  const unitOf = {}, units = [];
  ids.forEach(id => { if (unitOf[id]) return;
    const pr = prs(id).filter(([p]) => !unitOf[p] && gen[p] === gen[id] && !ps(p).length);
    const m = pr.length === 2 ? [pr[0][0], id, pr[1][0]] : [id, ...pr.map(x => x[0])];
    const kinds = m.slice(1).map((x, i) => { const a = m[i], b = x; const k = (prs(a).find(([p]) => p === b) || prs(b).find(([p]) => p === a) || [0, "spouse"])[1]; return k; });
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
      const pp = key.split("+"), idx = pp.map(p => u.members.indexOf(p)).sort((a, b) => a - b);
      let ox, oy;
      if (idx.length === 2 && idx[1] - idx[0] === 1) { ox = u.x + idx[1] * (CW + CG) - CG / 2; oy = u.y + CH / 2 + 4; }
      else { ox = u.x + idx[0] * (CW + CG) + CW / 2; oy = u.y + CH; }
      const by = u.y + CH + RG / 2, cxs = kids.map(c => cardX(c) + CW / 2);
      svg += `<path d="M${ox} ${oy} V${by} M${Math.min(ox, ...cxs)} ${by} H${Math.max(ox, ...cxs)} ${cxs.map(c => `M${c} ${by} V${top(gen[kids[0]])}`).join(" ")}" fill="none" stroke="${ink}" stroke-width="1.6"/>`;
    });
  });
  const labels = o.labels === false ? "" : Array.from({length: maxG + 1}, (_, g) => `<span class="gen" style="top:${top(g) + CH / 2 - 14}px">Generation ${g + 1}</span>`).join("");
  o.inTree = inT;
  const cards = ids.map(id => pTcard(id, cardX(id), unitOf[id].y, CW, CH, o)).join("");
  return `<div class="tree" style="width:${width}px;height:${height}px"><svg class="lines" width="${width}" height="${height}" aria-hidden="true">${svg}</svg>${labels}${cards}</div>`;
}
// a household tree's card: the household's own Sims highlighted; everyone else lighter, with a chip for where they live
function pTcard(id, x, y, CW, CH, o) {
  const s = P_SIMS[id], C = o.compact ? "compact" : "", pos = `left:${x}px;top:${y}px;width:${CW}px;height:${CH}px`;
  if (s.ph) return `<div class="tc ph ${C} ${o.here ? "away" : ""}" style="${pos}"><span class="tm">?</span><div class="tn">${esc(s.phText)}</div></div>`;
  const hh = s.hh ? hhIndex[s.hh] : null, w = hh ? hh.world : pWorldById(s.world), here = o.here && s.hh === o.here;
  const sub = [s.age, s.state, s.late ? "late" : "", s.noHome ? "no home" : "", s.treeOnly ? "on the family tree only" : ""].filter(Boolean).join(" · ") || (s.late ? "late" : "");
  // married-in Sims: the family they were born into (or married into), as a plain chip
  const born = f => `<span class="bornchip" ${P_FAMILIES[f] && P_FAMILIES[f].note ? `title="${esc(P_FAMILIES[f].note)}"` : ""}>${s.line === f ? "born a" : "married a"} ${esc(P_FAMILIES[f] ? P_FAMILIES[f].name : f)}</span>`;
  const chips = [];
  const marriedIn = !(s.parents || []).some(p => o.inTree && o.inTree.has(p));   // descendants don't need a "born a…" chip
  if (s.line && s.into && s.line !== o.line && marriedIn) chips.push(born(s.line));
  else if (!s.line && !s.late && !s.treeOnly) chips.push(`<span class="bornchip">married in</span>`);
  if (s.into && s.into !== o.line && s.line === o.line) chips.push(born(s.into));
  if (!s.late && !here) chips.push(pHomeChip(s));
  // dynasty heads and heirs keep a small badge (the dynasty itself has its own page)
  const dy = pDynastyOf(id), role = dy && dy[2], badge = role === "head" || role === "heir" || role === "outcast" ? `<span class="badge ${role === "head" ? "head" : role === "outcast" ? "out" : ""}">${role === "outcast" ? "" : ic("crown")}${P_GROUP_KINDS.dynasty.roles[role]}${dy[1].name.toLowerCase() !== o.line ? " · " + esc(dy[1].name) : ""}</span>` : "";
  // names open the Sim's own page, or their household in the app where there's no Sim page yet
  const nm = P_SIM_PAGES.includes(id) ? `<a href="${pSimHref(id)}">${esc(s.name)}</a>` : s.hh && hhIndex[s.hh] ? `<a href="#${s.hh}">${esc(s.name)}</a>` : esc(s.name);
  return `<div class="tc ${C} ${s.late ? "late" : ""} ${o.here ? (here ? "here" : "away") : ""}" style="${pos};--w:${pWColour(w)}" data-sim="${id}"><span class="tm">${initial(s.name)}</span><div class="tn">${nm}</div><div class="ts">${esc(sub)}</div>
    <div class="tchip" style="display:flex;flex-wrap:wrap;gap:4px">${chips.filter(Boolean).join("")}</div>${badge}</div>`;
}
const pTreeKey = (here = false, colour = "") => `<div class="tree-key">
  ${here ? `<span><span class="k-box here" ${colour ? `style="--w:${colour}"` : ""}></span>Lives here</span><span><span class="k-box away"></span>Lives elsewhere (any world), with a chip for where</span>` : ""}
  <span><svg class="k" viewBox="0 0 34 10"><line x1="0" y1="3" x2="34" y2="3" stroke="var(--muted)" stroke-width="2.5"/><line x1="0" y1="7" x2="34" y2="7" stroke="var(--muted)" stroke-width="1.2"/></svg>Spouses</span>
  <span><svg class="k" viewBox="0 0 34 10"><line x1="0" y1="5" x2="34" y2="5" stroke="var(--muted)" stroke-width="2.5" stroke-dasharray="5 4"/></svg>Partners</span>
  <span><svg class="k" viewBox="0 0 34 12"><line x1="0" y1="6" x2="34" y2="6" stroke="var(--muted)" stroke-width="2.5" stroke-dasharray="5 4"/><path d="M12 12 L16 0 M18 12 L22 0" stroke="var(--muted)" stroke-width="1.6"/></svg>Ex</span>
  <span><svg class="k" viewBox="0 0 34 10" opacity=".5"><line x1="0" y1="3" x2="34" y2="3" stroke="var(--muted)" stroke-width="2.5"/><line x1="0" y1="7" x2="34" y2="7" stroke="var(--muted)" stroke-width="1.2"/></svg>Late Spouse</span>
  <span><span style="width:14px;height:14px;border-radius:50%;background:#A3AAA5;display:inline-block"></span>Late Sims greyed</span>
  <span>${ic("crown")} Dynasty head and heir</span></div>`;

/* ================= relationships between Sims (§6, §7d) =================
   Her decision, 17 Oct: relationships are between Sims, so they live only on Sim pages (none on household pages).
   Family words and partners are worked out from P_SIMS; everything else is a pair, stored once (data/relationships.json in the proposal).
   These are the game's own starting relationships (research/ea-family-lore.md). */
const P_RELS = [
  {a: "tybalt-capp", b: "juliette-monty", tag: "enemies", label: "They despise each other"},
  {a: "tybalt-capp", b: "romeo-monty", tag: "enemies", label: "They despise each other"},
  {a: "celeste-capp", b: "dante-monty", tag: "good-friends", label: "Cousins"},
  {a: "tybalt-capp", b: "enzo-alto", tag: "friends"},
  {a: "tybalt-capp", b: "enzo-alto", tag: "coworkers"},
];
const P_CLOSE = new Set(["Mother", "Father", "Parent", "Daughter", "Son", "Child", "Sister", "Brother", "Sibling"]);
// everything a Sim has with other Sims, as {o (the other Sim), g (tag group), tag, word, label}
function pSimRels(id) {
  const out = [], prs = pPartnersOf(id);
  prs.forEach(([o, k]) => { if (!P_SIMS[o].ph && P_TAGS[k]) out.push({o, g: "romance", tag: k, word: pPartnerWord(k)}); });
  pFamilyOf(id).forEach(([o, w]) => { if (!prs.some(([p]) => p === o)) out.push({o, g: "family", word: w}); });
  P_RELS.forEach(r => { if (r.a === id || r.b === id) out.push({o: r.a === id ? r.b : r.a, g: P_TAGS[r.tag].g, tag: r.tag, word: pTagName(r.tag), label: r.label, idea: r.idea}); });
  return out;
}
const pRelPill = r => r.g === "family" ? `<span class="tg family">${ic("network")}${esc(r.word)}</span>` : r.tag === "spouse" || r.tag === "ex" ? `<span class="tg romance">${ic("heart")}${esc(r.word)}</span>` : pTagPill(r.tag, r.idea ? "free" : "");
function pSimRelCard(r) {
  const t = P_SIMS[r.o], href = pSimLinkTo(r.o), T = href ? "a" : "div";
  return `<${T} class="rel-card ${t.late ? "late" : ""}" ${href ? `href="${href}"` : ""} style="--w:${pSimColour(r.o)};--g:var(--t-${r.g})"><span class="mono">${initial(t.name)}</span>
    <b>${esc(t.name)}</b><span class="where">${esc(pSimWhere(r.o))}</span>
    <span class="tagrow">${pRelPill(r)}${r.label ? `<span class="lbl">${esc(r.label)}</span>` : ""}</span>${r.note ? `<span class="who">${esc(r.note)}</span>` : ""}</${T}>`;
}
// grouped lists (option A), in the tag groups. o.family: close family as a group too (on Sim pages family has its own section).
// Dynasties are groups with their own pages now, so the Dynasty tag group isn't listed for a Sim.
function pSimRelGroups(id, o = {}) {
  const by = {};
  pSimRels(id).filter(r => r.g !== "family" || (o.family && P_CLOSE.has(r.word))).forEach(r => (by[r.g] ||= []).push(r));
  const order = Object.keys(P_TAG_GROUPS).filter(g => g !== "dynasty" && (g !== "family" || o.family));
  const gs = order.filter(g => by[g]), none = order.filter(g => !by[g]);
  const count = list => { const n = new Set(list.map(r => r.o)).size; return `${n} ${n === 1 ? "Sim" : "Sims"}`; };
  return `${gs.length ? `<div class="rel-groups">${gs.map(g => `<div class="rel-group" style="--g:var(--t-${g})"><h3><span class="ico">${ic(P_TAG_GROUPS[g].icon)}</span>${P_TAG_GROUPS[g].name}<small>${count(by[g])}</small></h3>
      <div class="rel-list">${by[g].map(pSimRelCard).join("")}</div></div>`).join("")}</div>` : ""}
    ${none.length ? `<p class="rel-none">Nothing noted yet: ${none.map(g => P_TAG_GROUPS[g].name).join(", ")}.</p>` : ""}`;
}

/* ---------- line styles (shared by the web and the key) ---------- */
function pEdge(x1, y1, x2, y2, g, faint, halo) {
  const c = `var(--t-${g})`, op = faint ? ' opacity=".6"' : "", st = P_TAG_GROUPS[g].line;
  if (halo) return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="rgba(255,255,255,.8)" stroke-width="10" stroke-linecap="round"/>` + pEdge(x1, y1, x2, y2, g, faint);
  const L = (w, extra = "") => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${c}" stroke-width="${w}" stroke-linecap="round" ${extra}${op}/>`;
  if (st === "solid") return L(3.2);
  if (st === "solid2") return L(2.6);
  if (st === "dash") return L(2.8, 'stroke-dasharray="10 6" stroke-linecap="butt"');
  if (st === "dots") return L(3.6, 'stroke-dasharray="0.1 7.5"');
  if (st === "double") return L(7.5) + `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="var(--surface)" stroke-width="2.6"${op}/>`;
  // zigzag
  const dx = x2 - x1, dy = y2 - y1, len = Math.hypot(dx, dy), n = Math.max(2, Math.round(len / 9)), ux = dx / len, uy = dy / len;
  let pts = [`${x1},${y1}`];
  for (let i = 1; i < n; i++) { const t = i / n, s = (i % 2 ? 4 : -4); pts.push(`${x1 + dx * t - uy * s},${y1 + dy * t + ux * s}`); }
  pts.push(`${x2},${y2}`);
  return `<polyline points="${pts.join(" ")}" fill="none" stroke="${c}" stroke-width="2.2" stroke-linejoin="round"${op}/>`;
}
const pWebKey = (groups = Object.keys(P_TAG_GROUPS)) => `<div class="web-key">${groups.map(g =>
  `<span><svg viewBox="0 0 40 12" aria-hidden="true">${pEdge(2, 6, 38, 6, g)}</svg><span style="color:var(--t-${g});display:inline-flex">${ic(P_TAG_GROUPS[g].icon)}</span>${P_TAG_GROUPS[g].name}</span>`).join("")}</div>`;

// one Sim in the middle (option B): their close family and everyone they have a link with; lines styled by tag group
function pDrawSimWeb(id, W = 470, H = 580) {
  const rs = pSimRels(id).filter(r => r.g !== "family" || P_CLOSE.has(r.word));
  const cx = W / 2, cy = H / 2 + 10, others = [...new Set(rs.map(r => r.o))];
  const gi = o => Math.min(...rs.filter(r => r.o === o).map(r => Object.keys(P_TAG_GROUPS).indexOf(r.g)));
  others.sort((a, b) => gi(a) - gi(b));
  const n = others.length, rx = W / 2 - 80, ry = Math.min(H / 2 - 100, 230), pos = {};
  others.forEach((o, i) => { const a = n === 2 ? i * Math.PI : -Math.PI / 2 + i * 2 * Math.PI / n; pos[o] = [cx + rx * Math.cos(a), cy + ry * Math.sin(a)]; });
  let svg = "";
  others.forEach(o => {
    const ls = rs.filter(r => r.o === o), [x2, y2] = pos[o];
    const dx = x2 - cx, dy = y2 - cy, len = Math.hypot(dx, dy), ux = dx / len, uy = dy / len, s0 = uy > .3 ? 84 : 42;
    ls.forEach((r, j) => { const off = (j - (ls.length - 1) / 2) * 8, px = -uy * off, py = ux * off;
      svg += pEdge(cx + ux * s0 + px, cy + uy * s0 + py, x2 - ux * 32 + px, y2 - uy * 32 + py, r.g, r.idea); });
  });
  // under each name: "late", or the world when it isn't the centre Sim's (keeps the drawing quiet)
  const worldOf = o => { const t = P_SIMS[o], hh = t.hh && hhIndex[t.hh]; return hh ? hh.world : pWorldById(t.world); };
  const sub = (o, c) => { if (c) return pSimWhere(o); const t = P_SIMS[o], w = worldOf(o);
    return t.late ? "late" : w && w !== worldOf(id) ? w.name + (w.owned ? "" : " (not owned)") : ""; };
  const node = (o, c) => { const t = P_SIMS[o], [x, y] = c ? [cx, cy] : pos[o], href = c ? "" : pSimLinkTo(o), T = href ? "a" : "span", ls = c ? [] : rs.filter(r => r.o === o), s = sub(o, c);
    const pills = ls.length ? `<span class="npills">${ls.map(pRelPill).join("")}</span>` : "";
    return `<${T} class="node ${c ? "centre" : ""} ${!c && y < cy - 20 ? "up" : ""} ${t.late ? "late" : ""}" ${href ? `href="${href}"` : ""} style="left:${x}px;top:${y}px;--w:${pSimColour(o)}"><span class="c">${initial(t.name)}</span><b>${esc(t.name)}</b>${s ? `<small>${esc(s)}</small>` : ""}${pills}</${T}>`; };
  return `<div class="web" style="width:${W}px;height:${H}px"><svg width="${W}" height="${H}" aria-hidden="true">${svg}</svg>${others.map(o => node(o)).join("")}${node(id, true)}</div>`;
}
