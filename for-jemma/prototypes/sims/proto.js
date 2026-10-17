// Sims prototypes (16 Oct): shared data and drawing code. Nothing here is used by the app, and nothing in site/ or data/ changes.
// Loaded after the app's own scripts (site/js/icons.js, data.js, app.js, read only), so the pages use the app's real worlds,
// households, colours and drawing functions (listing, famCard, renderNav…).
// Sim details are EA's starting ones from The Sims Wiki (fetched 16–17 Oct), checked against research/ea-family-lore.md.
// Nothing here is from Jemma's save.

/* ================= the page frame ================= */
const PROTO = "../for-jemma/prototypes/sims/";   // each page's <base> is site/, so links between prototype pages need this
const PAGES = [
  ["index.html", "Contents", "list-tree"],
  ["household.html", "Household page", "users"],
  ["sim.html", "Sim pages", "user-round", "?sim=mortimer-goth"],
  ["family-tree.html", "Family tree", "network"],
  ["relationships.html", "Links between households", "link"],
  ["tags.html", "Relationship tags", "tag"],
];
let PAGE = "", CUR_SIM = "";
// Sims with their own page (17 Oct: every Sim in the end; the Goths first). Cornelia is on the Goth tree but in no household.
const SIM_PAGES = ["mortimer-goth", "bella-goth", "cassandra-goth", "alexander-goth", "cornelia-goth"];
const simHref = id => `${PROTO}sim.html?sim=${id}`;
// the sidebar is the app's own, with a "Prototypes" group added at the top, and the Goths' Sims under their household
const appRenderNav = renderNav;
renderNav = function (...a) {
  appRenderNav(...a);
  const nav = document.getElementById("nav");
  nav.insertAdjacentHTML("afterbegin", `<div class="nav-group"><div class="label">Prototypes · 16–17 Oct</div>${PAGES.map(([f, t, i, q]) =>
    `<a href="${PROTO}${f}${q || ""}" class="${f === PAGE ? "on" : ""}">${ic(i)}${t}</a>`).join("")}</div>`);
  // world → neighbourhood → lot → household → Sims, as in the app; here the household and its Sims open the prototype pages
  const fl = nav.querySelector('a.fam-link[href="#h-willow-creek--goth"]');
  if (!fl) return;
  fl.setAttribute("href", PROTO + "household.html");
  if (CUR_SIM) { fl.classList.remove("cur"); fl.classList.add("path"); }
  if (fl.nextElementSibling && fl.nextElementSibling.classList.contains("lotnav")) fl.nextElementSibling.remove();   // the app's own list (links to its household page)
  fl.insertAdjacentHTML("afterend", `<div class="lotnav proto-sims">${SIM_PAGES.map(id => { const s = SIMS[id];
    return `<a href="${simHref(id)}" class="${id === CUR_SIM ? "cur" : ""} ${s.hh ? "" : "away"}">${esc(s.name)}${s.late ? "<small>late</small>" : ""}</a>`; }).join("")}</div>`);
};
function protoStart(o) {
  PAGE = o.page;
  removeEventListener("hashchange", route);   // the app's own pages stay in the app
  const w = o.world ? worlds.find(x => x.id === o.world) : null, root = document.documentElement.style;
  if (w && w.deep) { root.setProperty("--deep", w.deep[0]); root.setProperty("--deep-2", w.deep[1]); }
  else { root.removeProperty("--deep"); root.removeProperty("--deep-2"); }
  const hh = o.hh ? hhIndex[o.hh] : null;
  renderNav(w ? w.id : "", hh ? hh.id : "", hh ? {hh, lot: hh.lots[0], hood: hh.lots[0].hood} : {});
  document.title = o.title + " · Prototype · Jemma's Sim World";
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
const seg = (name, label, items, cur) => `<div class="seg" data-seg="${name}"><span>${label}</span>${items.map(([v, t, no]) =>
  `<button type="button" data-v="${v}" class="${v === cur ? "on" : ""}" aria-pressed="${v === cur}">${no ? `<i>${no}</i>` : ""}${t}</button>`).join("")}</div>`;
document.addEventListener("click", e => {
  const b = e.target.closest(".seg button"); if (!b) return;
  const s = b.closest(".seg"); s.querySelectorAll("button").forEach(x => { x.classList.toggle("on", x === b); x.setAttribute("aria-pressed", x === b); });
  if (typeof onSeg === "function") onSeg(s.dataset.seg, b.dataset.v);
});
const worldById = id => worlds.find(w => w.id === id);
const wColour = w => w ? (w.glow || w.color) : "#8A918C";

/* ================= relationship tags (§6, option B) ================= */
const GROUPS = {
  family:   {name: "Family",        icon: "network",   line: "solid",  sample: "Worked out from parents and partners"},
  romance:  {name: "Romance",       icon: "heart",     line: "solid2", sample: ""},
  friends:  {name: "Friends",       icon: "smile",     line: "dash",   sample: ""},
  conflict: {name: "Conflict",      icon: "swords",    line: "zigzag", sample: ""},
  work:     {name: "Work & school", icon: "briefcase", line: "dots",   sample: ""},
  dynasty:  {name: "Dynasty",       icon: "crown",     line: "double", sample: ""},
};
// romance words are the game's since patch 162 (Spouse, Engaged, Partner): her decision, 17 Oct, everywhere and with no switch
const TAGS = {
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
const tagName = t => TAGS[t].name;
const tagPill = (t, cls = "") => `<span class="tg ${TAGS[t].g} ${cls}">${ic(GROUPS[TAGS[t].g].icon)}${esc(tagName(t))}</span>`;
const SOURCES = {
  game:    ["info", "In the game"],
  gallery: ["info", "From EA’s Gallery household"],
  site:    ["info", "On the site now"],
  plan:    ["flag", "Your plan"],
  idea:    ["sparkles", "Idea, not in The Sims 4"],
};
const srcLine = l => `<span class="src ${l.src}">${ic(SOURCES[l.src][0])}${esc(SOURCES[l.src][1])}${l.note ? " · " + esc(l.note) : ""}</span>`;

/* ================= Sims (§9's proposed data, as it would look) =================
   Save-wide ids. parents on the child; partners as [id, kind]; every other family word is worked out.
   line = the family they were born into (null = not in the game); into = the family they married into.
   hh = the app's household; world + home for Sims with no household on the site. */
const SIMS = {
  // the Goths (The Sims 4; family tree as of patch 193)
  "simon-crumplebottom":    {name: "Simon Crumplebottom", sex: "m", age: "Elder", late: true, line: "crumplebottom", partners: [["prudence-crumplebottom", "spouse"]]},
  "prudence-crumplebottom": {name: "Prudence Crumplebottom", sex: "f", age: "Elder", late: true, line: "crumplebottom"},
  "cornelia-goth":   {name: "Cornelia Goth", sex: "f", age: "Elder", late: true, line: "crumplebottom", into: "goth", parents: ["simon-crumplebottom", "prudence-crumplebottom"], partners: [["gunther-goth", "unknown"]],
                      start: "Not a Sim you can play: she is on the Goth family tree since patch 193 (February 2026), already late. She died in a fire, and the game won’t let her come back as a ghost."},
  "gunther-goth":    {name: "Gunther Goth", sex: "m", ph: true, line: "goth", phText: "Father not in the game’s tree", phNote: "Gunther, in earlier games"},
  "agnes-crumplebottom": {name: "Agnes Crumplebottom", sex: "f", age: "Elder", line: "crumplebottom", parents: ["simon-crumplebottom", "prudence-crumplebottom"],
                     partners: [["robert-crumplebottom", "ex"], ["erik-darling", "late-spouse"]], world: "henford-on-bagley", home: "a townie", noHome: true},
  "robert-crumplebottom": {name: "Robert Crumplebottom", sex: "m", age: "", line: null, treeOnly: true},
  "erik-darling":    {name: "Erik Darling", sex: "m", age: "", late: true, line: null},
  "mortimer-goth":   {name: "Mortimer Goth", sex: "m", age: "Adult", hh: "h-willow-creek--goth", line: "goth", parents: ["cornelia-goth", "gunther-goth"], partners: [["bella-goth", "spouse"]], dyn: ["head", "goth"],
                      traits: ["Bookworm", "Outgoing", "Creative"], bonus: "Quick Learner", aspiration: "Renaissance Sim", career: "Writer",
                      start: "An Adult, 42 days from Elder. Writer career at level 3 (Freelance Article Writer), Writing at 4."},
  "bella-goth":      {name: "Bella Goth", sex: "f", age: "Young Adult", hh: "h-willow-creek--goth", line: "bachelor", into: "goth",
                      traits: ["Good", "Family-Oriented", "Romantic"], bonus: "Gregarious", aspiration: "Party Animal", career: "Secret Agent",
                      start: "A Young Adult, younger than Mortimer in this game. Secret Agent (Intelligence Researcher); Charisma, Fitness and Programming at 2. No friends outside the household."},
  "cassandra-goth":  {name: "Cassandra Goth", sex: "f", age: "Teen", hh: "h-willow-creek--goth", line: "goth", parents: ["mortimer-goth", "bella-goth"], dyn: ["heir", "goth"],
                      traits: ["Creative", "Gloomy"], bonus: "Muser", aspiration: "Musical Genius", school: "High school",
                      start: "A Teen at grade C; Violin at 2. Heir of the Goth dynasty (Royalty & Legacy)."},
  "alexander-goth":  {name: "Alexander Goth", sex: "m", age: "Child", hh: "h-willow-creek--goth", line: "goth", parents: ["mortimer-goth", "bella-goth"],
                      traits: ["Bookworm"], aspiration: "Whiz Kid", school: "Grade school",
                      start: "A Child, 14 days from Teen; Creativity, Mental, Motor and Social at 1."},
  // the Pancakes (basics only, for the comparison)
  "bob-pancakes":    {name: "Bob Pancakes", sex: "m", age: "Young Adult", hh: "h-willow-creek--pancakes", line: "pancakes", partners: [["eliza-pancakes", "spouse"]]},
  "eliza-pancakes":  {name: "Eliza Pancakes", sex: "f", age: "Young Adult", hh: "h-willow-creek--pancakes", line: "hastings", into: "pancakes"},
  // Mortimer and Bella's classmates, and Tybalt's friend (names only, for the relationships)
  "nancy-landgraab":    {name: "Nancy Landgraab", sex: "f", age: "Adult", hh: "h-oasis-springs--landgraab", line: "landgraab", partners: [["geoffrey-landgraab", "spouse"]], dyn: ["head", "landgraab"]},
  "geoffrey-landgraab": {name: "Geoffrey Landgraab", sex: "m", age: "Adult", hh: "h-oasis-springs--landgraab", line: "osteer", into: "landgraab"},
  "enzo-alto":       {name: "Enzo Alto", sex: "m", age: "", hh: "h-ondarion--enzo-alto", line: "alto", dyn: ["head", "alto"]},
  // the Capps and Montys (Royalty & Legacy): her test case for families across worlds
  "consort-capp":    {name: "Consort Capp", sex: "m", age: "Elder", state: "Ghost", line: "thebe", into: "capp", partners: [["contessa-capp", "late-spouse"]], world: "ondarion", home: "stays homeless, as the game has him", noHome: true},
  "contessa-capp":   {name: "Contessa Capp", sex: "f", age: "", late: true, line: "capp"},
  "cordelia-capp":   {name: "Cordelia Capp", sex: "f", age: "", late: true, line: "capp", parents: ["consort-capp", "contessa-capp"], partners: [["caliban-capp", "spouse"]]},
  "caliban-capp":    {name: "Caliban Capp", sex: "m", age: "", late: true, line: null, into: "capp"},
  "tybalt-capp":     {name: "Tybalt Capp", sex: "m", age: "Adult", hh: "h-ondarion--capp", line: "capp", parents: ["cordelia-capp", "caliban-capp"], dyn: ["head", "capp"]},
  "juliette-monty":  {name: "Juliette Monty", sex: "f", age: "Adult", line: "capp", into: "monty", parents: ["cordelia-capp", "caliban-capp"], partners: [["romeo-monty", "spouse"]], dyn: ["head", "monty"], world: "tartosa", home: "Rifugio dei Pirati", hhName: "Monty"},
  "romeo-monty":     {name: "Romeo Monty", sex: "m", age: "Adult", line: "monty", world: "tartosa", home: "Rifugio dei Pirati", hhName: "Monty"},
  "beatrice-capp":   {name: "Beatrice Capp", sex: "f", age: "Young Adult", hh: "h-ondarion--capp", line: "capp", parents: ["tybalt-capp"], dyn: ["heir", "capp"]},
  "celeste-capp":    {name: "Celeste Capp", sex: "x", age: "Young Adult", hh: "h-ondarion--capp", line: "capp", parents: ["tybalt-capp"]},
  "virgilio-capp":   {name: "Virgilio Capp", sex: "m", age: "Young Adult", hh: "h-ondarion--capp", line: "capp", parents: ["tybalt-capp"], dyn: ["outcast", "capp"]},
  "dante-monty":     {name: "Dante Monty", sex: "m", age: "Teen", line: "monty", parents: ["romeo-monty", "juliette-monty"], dyn: ["heir", "monty"], world: "tartosa", home: "Rifugio dei Pirati", hhName: "Monty"},
};
Object.entries(SIMS).forEach(([id, s]) => s.id = id);
const FAMILIES = {
  goth:          {name: "Goth", dynasty: {head: "mortimer-goth", heir: "cassandra-goth", ideals: ["Passionate", "Mysterious"], prestige: 3}},
  crumplebottom: {name: "Crumplebottom"},
  bachelor:      {name: "Bachelor", note: "Bella Bachelor in EA’s Copperdale Class of ’00 Gallery household; the game’s tree has no Bachelors"},
  hastings:      {name: "Hastings", note: "Eliza Hastings in EA’s Copperdale Class of ’00 Gallery household"},
  pancakes:      {name: "Pancakes"},
  capp:          {name: "Capp", dynasty: {head: "tybalt-capp", heir: "beatrice-capp", ideals: ["Diplomatic", "Connoisseur", "Artistic"], prestige: 7, allies: ["Alto"], rivals: ["Monty"]}},
  monty:         {name: "Monty", dynasty: {head: "juliette-monty", heir: "dante-monty", ideals: ["Passionate", "Hardworking"], prestige: 1, rivals: ["Capp"]}},
  landgraab:     {name: "Landgraab", dynasty: {head: "nancy-landgraab", allies: ["Abrantes"], rivals: ["Alto"]}},
  alto:          {name: "Alto", dynasty: {head: "enzo-alto", allies: ["Capp"], rivals: ["Landgraab"]}},
  osteer:        {name: "Osteer", note: "Geoffrey Osteer in EA’s Copperdale Class of ’00 Gallery household"},
  thebe:         {name: "Thebe"},
};
const GOTHS = ["mortimer-goth", "bella-goth", "cassandra-goth", "alexander-goth"];
const membersOf = hhId => Object.keys(SIMS).filter(id => SIMS[id].hh === hhId);

/* ---------- a household's family tree (her rules, 17 Oct) ----------
   Centred on the Sims who live there; built from family links only (parents and partners), never from who lives together.
   Everyone in the household, all their blood relatives wherever they live, and those relatives' partners ("plus ones").
   Worlds don't matter. A Sim with no family anywhere isn't drawn; a household where nobody has family gets no tree at all. */
function treeOf(hhId) {
  const all = Object.keys(SIMS), set = new Set();
  membersOf(hhId).forEach(m => all.forEach(o => { if (!SIMS[o].ph && blood(m, o)) set.add(o); }));   // blood(m, m) counts: members are in
  [...set].forEach(id => partnersOf(id).forEach(([p]) => { if (SIMS[p]) set.add(p); }));            // plus ones (and placeholders like Gunther)
  [...set].forEach(id => (SIMS[id].parents || []).forEach(p => { if (SIMS[p] && SIMS[p].ph) set.add(p); }));
  const famLinked = (a, b) => (SIMS[a].parents || []).includes(b) || (SIMS[b].parents || []).includes(a) || partnersOf(a).some(([p]) => p === b);
  const ids = [...set].filter(a => [...set].some(b => b !== a && famLinked(a, b)));
  return ids.length > 1 ? ids.sort((a, b) => all.indexOf(a) - all.indexOf(b)) : [];
}
// EA's side of the Goths' story, oldest first: the story prototype's lines (../stories/story-data.js, 17 Oct), summarised in our
// own words from The Sims Wiki. Her own story isn't here: every Sim page ends with "Yours to write".
const STORY_FROM = {game: "In the game", older: "Older games", gallery: "EA’s Gallery household", plan: "Your plan"};
const STORY_ICON = {born: "baby", married: "gem", died: "flower-2", dynasty: "crown", home: "house", school: "graduation-cap", older: "scroll-text"};
const STORY = [
  {kind: "born", src: "game", title: "Mortimer is born a Goth", text: "His mother is Cornelia, born a Crumplebottom; his father isn’t on the game’s family tree. Cornelia’s sister Agnes is his aunt.", sims: ["mortimer-goth", "cornelia-goth"]},
  {kind: "school", src: "gallery", title: "Classmates at Copperdale High", text: "EA’s “Copperdale Class of ’00” Gallery household has teenage Mortimer and Bella Bachelor in one class with Bob Pancakes, Eliza Hastings, Nancy Landgraab and Geoffrey (then Osteer).", sims: ["mortimer-goth", "bella-goth"]},
  {kind: "married", src: "game", title: "Mortimer and Bella marry", text: "Bella was born a Bachelor.", sims: ["mortimer-goth", "bella-goth"]},
  {kind: "died", src: "game", title: "Cornelia dies in a fire", text: "She is on the family tree since the February 2026 update, but can’t come back as a ghost.", sims: ["cornelia-goth", "mortimer-goth"]},
  {kind: "born", src: "game", title: "Cassandra and Alexander are born", text: "", sims: ["cassandra-goth", "alexander-goth", "mortimer-goth", "bella-goth"]},
  {kind: "dynasty", src: "game", title: "The Goth dynasty", text: "With Royalty & Legacy, Mortimer heads it and Cassandra is the heir (only in saves started after the pack).", sims: ["mortimer-goth", "cassandra-goth"]},
  {kind: "home", src: "game", title: "At Ophelia Villa, Pendula View", text: "As a new save starts: Mortimer is a freelance writer, Bella a secret agent, Cassandra a teen at high school and Alexander a child, 14 days from his teens.", sims: ["mortimer-goth", "bella-goth", "cassandra-goth", "alexander-goth"]},
  {kind: "older", src: "older", title: "Pleasantview and Sunset Valley (The Sims 2 and 3)", text: "In the older games Bella vanishes and Mortimer raises the children alone, and Mortimer’s parents Gunther and Cornelia appear. The Sims 4 is its own timeline, so none of this happened here unless you say so.", sims: ["bella-goth", "mortimer-goth", "cornelia-goth"]},
];

/* ---------- family words, worked out (never typed) ---------- */
const sx = (s, m, f, x) => s === "m" ? m : s === "f" ? f : x;
function partnersOf(id) {
  const out = (SIMS[id].partners || []).slice();
  Object.values(SIMS).forEach(t => (t.partners || []).forEach(([p, k]) => { if (p === id && !out.some(x => x[0] === t.id)) out.push([t.id, k]); }));
  return out;
}
function ancestors(id, d = 0, out = new Map()) {
  if (!out.has(id) || out.get(id) > d) out.set(id, d);
  (SIMS[id].parents || []).forEach(p => { if (SIMS[p] && !SIMS[p].ph) ancestors(p, d + 1, out); });
  return out;
}
function blood(a, b) {
  const A = ancestors(a), B = ancestors(b); let best = null;
  A.forEach((da, x) => { if (B.has(x)) { const db = B.get(x); if (!best || da + db < best[0] + best[1]) best = [da, db]; } });
  return best;
}
function partnerWord(kind) {
  const T = TAGS[kind]; if (!T || kind === "unknown") return "Partner";
  return kind === "ex" ? "Ex-Spouse" : T.name;
}
function relWord(a, b) {   // what b is to a
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
const FAMILY_ORDER = ["Spouse", "Engaged", "Partner", "Ex-Spouse", "Late Spouse", "Mother", "Father", "Parent", "Daughter", "Son", "Child", "Sister", "Brother", "Sibling",
  "Grandmother", "Grandfather", "Grandparent", "Granddaughter", "Grandson", "Grandchild", "Great-grandmother", "Great-grandfather", "Great-grandparent",
  "Aunt", "Uncle", "Great-aunt", "Great-uncle", "Niece", "Nephew", "Cousin", "Mother-in-law", "Father-in-law", "Daughter-in-law", "Son-in-law", "Sister-in-law", "Brother-in-law"];
function familyOf(id) {
  const s = SIMS[id], rank = w => { const i = FAMILY_ORDER.indexOf(w); return i < 0 ? 99 : i; };
  const band = o => SIMS[o].hh && SIMS[o].hh === s.hh ? 0 : SIMS[o].late ? 2 : 1;   // household, living elsewhere, late
  return Object.keys(SIMS).filter(o => o !== id && !SIMS[o].ph).map(o => [o, relWord(id, o)]).filter(([, w]) => w)
    .sort((x, y) => band(x[0]) - band(y[0]) || rank(x[1]) - rank(y[1]));
}
// where a Sim lives, as a coloured chip (the world's colour)
function homeChip(s) {
  const hh = s.hh ? hhIndex[s.hh] : null;
  if (hh) return `<a class="hhchip" href="#${hh.id}" style="--w:${wColour(hh.world)}">${esc(hh.name)} · ${esc(hh.world.name)}</a>`;
  const w = worldById(s.world);
  if (w) return `<span class="hhchip" style="--w:${wColour(w)}" title="${esc([s.home, w.name + (w.owned ? "" : " (not owned)")].filter(Boolean).join(", "))}">${s.hhName ? esc(s.hhName) + " · " : ""}${esc(w.name)}</span>`;
  return "";
}

/* ================= drawn family tree (§7a, option A) =================
   Founders at the top, one row per generation, couples side by side (solid line = spouses, dashed = partners,
   broken = ex, faint = late spouse), children hang below. Cards: monogram, name, life stage, where they live.
   o: {line (whose tree), compact, labels (generation labels), stubs: {simId: html}, link (chips link to the tree page)} */
function drawTree(ids, o = {}) {
  const C = o.compact, CW = o.cw || (C ? 136 : 188), CH = o.ch || (C ? 112 : 128), CG = C ? 28 : 38, SG = C ? 14 : 26, RG = C ? 44 : 58, LX = o.labels === false ? 6 : 96, PAD = 14;
  const inT = new Set(ids), S = id => SIMS[id];
  const ps = id => (S(id).parents || []).filter(p => inT.has(p));
  const prs = id => partnersOf(id).filter(([p]) => inT.has(p));
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
  const cards = ids.map(id => tcard(id, cardX(id), unitOf[id].y, CW, CH, o)).join("");
  return `<div class="tree" style="width:${width}px;height:${height}px"><svg class="lines" width="${width}" height="${height}" aria-hidden="true">${svg}</svg>${labels}${cards}</div>`;
}
function tcard(id, x, y, CW, CH, o) {
  const s = SIMS[id], C = o.compact ? "compact" : "", pos = `left:${x}px;top:${y}px;width:${CW}px;height:${CH}px`;
  if (s.ph) return `<div class="tc ph ${C}" style="${pos}"><span class="tm">?</span><div class="tn">${esc(s.phText)}</div><div class="ts">${esc(s.phNote || "")}</div></div>`;
  const hh = s.hh ? hhIndex[s.hh] : null, w = hh ? hh.world : worldById(s.world);
  const stub = o.stubs && o.stubs[id];
  const sub = [s.age, s.state, s.late ? "late" : "", s.noHome ? "no home" : "", s.treeOnly ? "in the game’s tree only" : ""].filter(Boolean).join(" · ") || (s.late ? "late" : "");
  // married-in Sims: a chip that opens the family they were born into (or married into)
  const born = f => { const t = `${s.line === f ? "born a" : "married a"} ${esc(FAMILIES[f] ? FAMILIES[f].name : f)}`;
    if (!TREES[f] || f === o.line) return `<span class="bornchip" title="${esc(FAMILIES[f] && FAMILIES[f].note || "No " + (FAMILIES[f] ? FAMILIES[f].name : f) + " tree in this prototype")}">${t}</span>`;
    return o.link ? `<a class="bornchip" href="${PROTO}family-tree.html?open=${f}">${t} ${ic("chevron-right")}</a>`
                  : `<button type="button" class="bornchip" data-tree="${f}">${t} ${ic("chevron-right")}</button>`; };
  let chips = [];
  if (stub) chips.push(stub);
  else {
    const marriedIn = !(s.parents || []).some(p => o.inTree && o.inTree.has(p));   // descendants don't need a "born a…" chip
    if (s.line && s.line !== o.line && marriedIn) chips.push(born(s.line));
    else if (!s.line && !s.late && !s.treeOnly) chips.push(`<span class="bornchip">married in</span>`);
    if (s.into && s.into !== o.line && s.line === o.line) chips.push(born(s.into));
    if (!s.late && !(o.here && s.hh === o.here)) chips.push(homeChip(s));
  }
  const d = s.dyn, badge = d ? `<span class="badge ${d[0] === "head" ? "head" : d[0] === "outcast" ? "out" : ""}">${d[0] === "outcast" ? "" : ic("crown")}${d[0] === "head" ? "Head" : d[0] === "heir" ? "Heir" : "Outcast"}${d[1] !== o.line ? " · " + esc(FAMILIES[d[1]].name) : ""}</span>` : "";
  const nm = o.simLinks && SIM_PAGES.includes(id) ? `<a href="${simHref(id)}">${esc(s.name)}</a>` : esc(s.name);   // names open the Sim's own page
  return `<div class="tc ${C} ${s.late ? "late" : ""} ${stub ? "stub" : ""}" style="${pos};--w:${wColour(w)}" data-sim="${id}"><span class="tm">${initial(s.name)}</span><div class="tn">${nm}</div><div class="ts">${esc(sub)}</div>
    <div class="tchip" style="display:flex;flex-wrap:wrap;gap:4px">${chips.filter(Boolean).join("")}</div>${badge}</div>`;
}
const treeKey = () => `<div class="tree-key">
  <span><svg class="k" viewBox="0 0 34 10"><line x1="0" y1="3" x2="34" y2="3" stroke="var(--muted)" stroke-width="2.5"/><line x1="0" y1="7" x2="34" y2="7" stroke="var(--muted)" stroke-width="1.2"/></svg>Spouses</span>
  <span><svg class="k" viewBox="0 0 34 10"><line x1="0" y1="5" x2="34" y2="5" stroke="var(--muted)" stroke-width="2.5" stroke-dasharray="5 4"/></svg>Partners</span>
  <span><svg class="k" viewBox="0 0 34 12"><line x1="0" y1="6" x2="34" y2="6" stroke="var(--muted)" stroke-width="2.5" stroke-dasharray="5 4"/><path d="M12 12 L16 0 M18 12 L22 0" stroke="var(--muted)" stroke-width="1.6"/></svg>Ex</span>
  <span><svg class="k" viewBox="0 0 34 10" opacity=".5"><line x1="0" y1="3" x2="34" y2="3" stroke="var(--muted)" stroke-width="2.5"/><line x1="0" y1="7" x2="34" y2="7" stroke="var(--muted)" stroke-width="1.2"/></svg>Late Spouse</span>
  <span><span style="width:14px;height:14px;border-radius:50%;background:#A3AAA5;display:inline-block"></span>Late Sims greyed</span>
  <span>${ic("crown")} Dynasty head and heir</span></div>`;

/* ================= links between households (§7d) ================= */
// Sims with no household on the site, shown as dashed circles
const XNODES = {
  "x-agnes":        {name: "Agnes Crumplebottom", world: "henford-on-bagley", where: "a townie, no home on the site"},
  "x-tartosa-monty": {name: "Monty", world: "tartosa", where: "Romeo, Juliette, Dante · Rifugio dei Pirati"},
};
const LINKS = [
  {a: "h-willow-creek--goth", b: "x-agnes", tag: "family", who: "Agnes is Mortimer’s aunt (his late mother Cornelia’s sister)", src: "game", note: "with Cottage Living, since patch 193"},
  {a: "h-willow-creek--goth", b: "h-willow-creek--pancakes", tag: "classmates", label: "Copperdale Class of ’00", who: "Mortimer, Bella ↔ Bob, Eliza, as teens", src: "gallery"},
  {a: "h-willow-creek--goth", b: "h-oasis-springs--landgraab", tag: "classmates", label: "Copperdale Class of ’00", who: "Mortimer, Bella ↔ Nancy, Geoffrey, as teens", src: "gallery"},
  {a: "h-willow-creek--pancakes", b: "h-oasis-springs--landgraab", tag: "classmates", label: "Copperdale Class of ’00", who: "Bob, Eliza ↔ Nancy, Geoffrey, as teens", src: "gallery"},
  {a: "h-willow-creek--goth", b: "h-ravenwood--gomes", tag: "family", who: "Distant relatives: the Gomeses descend from Lady Ravendancer Goth", src: "game", note: "Tziporah’s Ravenwood Rumours"},
  {a: "h-willow-creek--goth", b: "h-ondarion--enzo-alto", tag: "dyn-rival", label: "Old rivals", who: "Goths ↔ Altos", src: "idea", note: "in The Sims 3 the Altos’ uptown ideals clashed with the Goths"},
  {a: "h-willow-creek--davidson-1", b: "h-willow-creek--davidson-2", tag: "family", who: "Same family, separate homes", src: "site"},
  {a: "h-oasis-springs--landgraab", b: "h-del-sol-valley--zest", tag: "family", who: "Johnny is Nancy and Geoffrey’s son", src: "game"},
  {a: "h-oasis-springs--landgraab", b: "h-del-sol-valley--zest", tag: "outcast", who: "Johnny, outcast of the Landgraab dynasty", src: "game"},
  {a: "h-oasis-springs--landgraab", b: "h-ondarion--abrantes", tag: "ally", who: "Landgraab and Abrantes dynasties", src: "game"},
  {a: "h-oasis-springs--landgraab", b: "h-ondarion--enzo-alto", tag: "dyn-rival", who: "Landgraab and Alto dynasties (Enzo is the Alto dynasty)", src: "game"},
  {a: "h-ondarion--capp", b: "h-ondarion--enzo-alto", tag: "ally", who: "Capp and Alto dynasties (Enzo is the Alto dynasty)", src: "game"},
  {a: "h-ondarion--capp", b: "x-tartosa-monty", tag: "dyn-rival", who: "Capp and Monty dynasties", src: "game"},
  {a: "h-ondarion--capp", b: "x-tartosa-monty", tag: "family", who: "Juliette is Tybalt’s sister; Consort Capp is her grandfather", src: "game"},
  {a: "h-ondarion--capp", b: "x-tartosa-monty", tag: "enemies", who: "Tybalt ↔ Juliette and Romeo: they despise each other", src: "game"},
  {a: "h-ondarion--capp", b: "x-tartosa-monty", tag: "good-friends", who: "Celeste ↔ Dante, cousins", src: "game"},
  {a: "h-ondarion--capp", b: "h-ondarion--thebe", tag: "family", who: "Consort Capp, the Capps’ ghostly ancestor, was born a Thebe", src: "game"},
  {a: "h-ondarion--thebe", b: "h-ondarion--abrantes", tag: "ally", who: "Thebe and Abrantes dynasties", src: "game"},
  {a: "h-ondarion--thebe", b: "h-ondarion--abrantes", tag: "family", who: "Thiago, Cordelia’s spouse, was born an Abrantes", src: "game"},
  {a: "h-ondarion--alto", b: "h-ondarion--enzo-alto", tag: "family", who: "Enzo’s mother, sister and brother-in-law", src: "plan", note: "the vineyard family, still to create"},
  {a: "h-willow-creek--bjergsen", b: "h-willow-creek--villareal", tag: "friends", who: "Bjorn ↔ Jacques; Sofia ↔ Luna; Elsa ↔ Max", src: "game", note: "neighbours in Windenburg; your plan moves both families here"},
  {a: "h-willow-creek--bjergsen", b: "h-windenburg--munch", tag: "coworkers", who: "Clara ↔ Mila", src: "game"},
  {a: "h-willow-creek--bjergsen", b: "h-windenburg--munch", tag: "friends", who: "Elsa ↔ Lucas", src: "game"},
  {a: "h-willow-creek--villareal", b: "h-windenburg--munch", tag: "friends", who: "Max ↔ Lucas", src: "game"},
  {a: "h-willow-creek--bjergsen", b: "h-windenburg--fyres", tag: "friends", who: "Sofia ↔ Siobhan", src: "game"},
  {a: "h-willow-creek--villareal", b: "h-windenburg--fyres", tag: "friends", who: "Luna ↔ Siobhan", src: "game"},
  {a: "h-willow-creek--villareal", b: "h-san-myshuno--behr", tag: "friends", who: "Hugo, Jacques ↔ Yuki", src: "game"},
  {a: "h-oasis-springs--lothario", b: "h-oasis-springs--caliente", tag: "crush", label: "Romantic interest", who: "Don ↔ Katrina", src: "game", note: "in the game Don lives with the Calientes; your plan gives him Agave Abode"},
];
function nodeInfo(id) {
  const hh = hhIndex[id];
  if (hh) return {id, name: hh.name, world: hh.world, colour: wColour(hh.world), href: "#" + hh.id, where: hh.lots.map(l => l.name).join(" & ")};
  const x = XNODES[id], w = worldById(x.world);
  return {id, name: x.name, world: w, colour: wColour(w), nohome: true, where: x.where};
}
const linksOf = id => LINKS.filter(l => l.a === id || l.b === id);
const otherEnd = (l, id) => l.a === id ? l.b : l.a;

// grouped lists (option A)
function relGroups(centre) {
  const by = {};
  linksOf(centre).forEach(l => { ((by[TAGS[l.tag].g] ||= {})[otherEnd(l, centre)] ||= []).push(l); });
  const gs = Object.keys(GROUPS).filter(g => by[g]);
  if (!gs.length) return `<div class="empty">${ic("link")}No links yet.</div>`;
  return `<div class="rel-groups">${gs.map(g => { const n = Object.keys(by[g]).length;
    return `<div class="rel-group" style="--g:var(--t-${g})"><h3><span class="ico">${ic(GROUPS[g].icon)}</span>${GROUPS[g].name}<small>${n} ${n === 1 ? "household" : "households"}</small></h3>
      <div class="rel-list">${Object.entries(by[g]).map(([o, ls]) => relCard(o, ls)).join("")}</div></div>`; }).join("")}</div>`;
}
function relCard(id, ls) {
  const n = nodeInfo(id), T = n.href ? "a" : "div";
  return `<${T} class="rel-card" ${n.href ? `href="${n.href}"` : ""} style="--w:${n.colour};--g:var(--t-${TAGS[ls[0].tag].g})"><span class="mono ${n.nohome ? "nohome" : ""}">${initial(n.name)}</span>
    <b>${esc(n.name)}</b><span class="where">${esc(n.where)} · ${esc(n.world.name)}${n.world.owned ? "" : " (not owned)"}</span>
    ${ls.map(l => `<span class="tagrow">${tagPill(l.tag, l.src === "idea" ? "free" : "")}${l.label ? `<span class="lbl">${esc(l.label)}</span>` : ""}</span><span class="who">${esc(l.who)}</span>${srcLine(l)}`).join("")}</${T}>`;
}

/* ---------- line styles (shared by the web, the map and the key) ---------- */
function edge(x1, y1, x2, y2, g, faint, halo) {
  const c = `var(--t-${g})`, op = faint ? ' opacity=".6"' : "", st = GROUPS[g].line;
  if (halo) return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="rgba(255,255,255,.8)" stroke-width="10" stroke-linecap="round"/>` + edge(x1, y1, x2, y2, g, faint);
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
const webKey = () => `<div class="web-key">${Object.entries(GROUPS).map(([g, G]) =>
  `<span><svg viewBox="0 0 40 12" aria-hidden="true">${edge(2, 6, 38, 6, g)}</svg><span style="color:var(--t-${g});display:inline-flex">${ic(G.icon)}</span>${G.name}</span>`).join("")}
  <span><svg viewBox="0 0 40 12" aria-hidden="true">${edge(2, 6, 38, 6, "dynasty", true)}</svg>Faded = an idea, not in the game</span></div>`;

// one household in the middle (option B): lines styled by tag group; each household lists its tags under its name
function drawWeb(centre, W = 470, H = 580) {
  const cx = W / 2, cy = H / 2 + 10, others = [...new Set(linksOf(centre).map(l => otherEnd(l, centre)))];
  const gi = id => Math.min(...linksOf(centre).filter(l => otherEnd(l, centre) === id).map(l => Object.keys(GROUPS).indexOf(TAGS[l.tag].g)));
  others.sort((a, b) => gi(a) - gi(b));
  const n = others.length, rx = W / 2 - 85, ry = Math.min(H / 2 - 130, 160), pos = {};
  others.forEach((id, i) => { const a = n === 2 ? i * Math.PI : -Math.PI / 2 + i * 2 * Math.PI / n; pos[id] = [cx + rx * Math.cos(a), cy + ry * Math.sin(a)]; });
  let svg = "";
  others.forEach(id => {
    const ls = linksOf(centre).filter(l => otherEnd(l, centre) === id), [x2, y2] = pos[id];
    const dx = x2 - cx, dy = y2 - cy, len = Math.hypot(dx, dy), ux = dx / len, uy = dy / len, s0 = uy > .3 ? 84 : 42;
    ls.forEach((l, j) => {
      const off = (j - (ls.length - 1) / 2) * 8, px = -uy * off, py = ux * off;
      svg += edge(cx + ux * s0 + px, cy + uy * s0 + py, x2 - ux * 32 + px, y2 - uy * 32 + py, TAGS[l.tag].g, l.src === "idea");
    });
  });
  const node = (id, c) => { const k = nodeInfo(id), w = k.world.id !== nodeInfo(centre).world.id || c ? k.world.name : "";
    const [x, y] = c ? [cx, cy] : pos[id], T = k.href ? "a" : "span", ls = c ? [] : linksOf(centre).filter(l => otherEnd(l, centre) === id);
    const pills = ls.length ? `<span class="npills">${ls.map(l => tagPill(l.tag, l.src === "idea" ? "free" : "")).join("")}</span>` : "";
    return `<${T} class="node ${c ? "centre" : ""} ${!c && y < cy - 20 ? "up" : ""} ${k.nohome ? "nohome" : ""}" ${k.href ? `href="${k.href}"` : ""} style="left:${x}px;top:${y}px;--w:${k.colour}" title="${esc(ls.map(l => tagName(l.tag) + ": " + l.who).join("\n"))}"><span class="c">${initial(k.name)}</span><b>${esc(k.name)}</b>${w ? `<small>${esc(w)}${k.world.owned ? "" : " (not owned)"}${k.nohome ? " · no home" : ""}</small>` : ""}${pills}</${T}>`; };
  return `<div class="web" style="width:${W}px;height:${H}px"><svg width="${W}" height="${H}" aria-hidden="true">${svg}</svg>${others.map(id => node(id)).join("")}${node(centre, true)}</div>`;
}
