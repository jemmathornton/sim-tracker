// Story prototypes (17 Oct): page frame and drawing code for research/household-stories.md.
// Loaded after the app's own site/js/icons.js and site/js/data.js (read only) and this folder's proto-icons.js and
// story-data.js. Nothing in site/ or data/ changes. Pages open straight from the folder (file://).

const SITE = "../../../site/", APP = SITE + "index.html";
const ic = n => (ICONS[n] || ICONS.note).replace("<svg ", '<svg class="i" aria-hidden="true" ');
// shown text uses curly apostrophes, as in the app; ids and links stay straight
const curly = s => String(s ?? "").replace(/(^|[\s(\[“"—-])'/g, "$1‘").replace(/'/g, "’");
const esc = s => curly(s).replace(/[&<>"]/g, c => ({"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;"}[c]));
const url = s => String(s ?? "").replace(/[&<>"]/g, c => ({"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;"}[c]));
const slug = s => String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const HOOD_COLORS = ["#B4573E", "#6A5A9E", "#2F6E9C", "#B98A2E", "#3C8459", "#AE5578", "#2B8A86", "#8C7A3A"];
const sizeTxt = s => s && s !== "N/A" ? s.replace("x", " × ") : "";
const initial = n => esc(String(n).trim()[0] || "?");
const darker = (hex, t) => { const c = hex.replace("#", ""); return "#" + [0, 2, 4].map(i => Math.round(parseInt(c.slice(i, i + 2), 16) * t).toString(16).padStart(2, "0")).join(""); };

/* ================= the app's worlds, lots and households (same ids as the app; read only) ================= */
const WORLDS = {}, LOTS = {}, HHS = {};
DATA.worlds.forEach(w => {
  w.id = slug(w.name); WORLDS[w.name] = w; w.open = !!(w.ready && w.owned); w.dotColour = w.glow || w.color;
  (w.hoods || []).forEach((h, i) => { h.color = h.color || HOOD_COLORS[i % HOOD_COLORS.length];
    h.lots.forEach(l => {
      const key = w.name + "|" + l.lot, mine = l.mine && l.mine.trim() && !/^\?+$/.test(l.mine.trim()) ? l.mine.trim() : null;
      LOTS[key] = {key, name: DATA.nameFix[key] || (l.gallery && l.gallery.title) || mine || l.lot, world: w, hood: h.name, color: h.color,
        type: (l.type || "").replace(/\s*\((?!\d+\??\))[^)]*\)?/g, "").trim(), size: l.size, built: l.built, shared: l.shared,
        id: "l-" + w.id + "--" + slug(l.lot), open: w.open, photos: l.photos || []};
      if (l.who && !/^(n\/a|rent|tenant)/i.test(l.who)) { const b = l.who.replace(/\?$/, "").replace(/\s+own$/i, "").trim(), hk = w.name + "|" + b;
        (HHS[hk] ||= {key: hk, name: b, world: w, id: "h-" + w.id + "--" + slug(b), lots: [], open: w.open, color: h.color}).lots.push(key); }
    }); });
});
Object.entries(DATA.tenants || {}).forEach(([lk, ts]) => ts.forEach(t => { const w = WORLDS[lk.split("|")[0]], hk = w.name + "|" + t.name;
  (HHS[hk] ||= {key: hk, name: t.name, world: w, id: "h-" + w.id + "--" + slug(t.name), lots: [], open: w.open, color: (LOTS[lk] || {}).color || w.color}).lots.push(lk); }));
// worlds the app doesn't show yet (Tartosa): from story-data.js
Object.entries(EXTRA_LOTS).forEach(([k, l]) => { const w = WORLDS[k.split("|")[0]]; LOTS[k] = {key: k, ...l, world: w, color: w.color, id: "l-" + w.id + "--" + slug(k.split("|")[1]), open: false, photos: []}; });
Object.entries(EXTRA_HOUSEHOLDS).forEach(([k, x]) => { const w = WORLDS[k.split("|")[0]]; HHS[k] = {key: k, ...x, world: w, id: "h-" + w.id + "--" + slug(x.name), open: false, color: w.color}; });

/* ================= small pieces ================= */
const SRC = {
  ts4:     ["info", "The Sims 4"],
  older:   ["history", "Older games"],
  gallery: ["image", "EA’s Gallery"],
  plan:    ["flag", "Your plan"],
  mine:    ["pen-line", "Your story"],
  site:    ["hammer", "On the site"],
  todo:    ["pen-line", "Yours to write"],
};
const srcChip = (s, date) => `<span class="src-chip ${s}">${ic(SRC[s][0])}${SRC[s][1]}${date ? " · " + esc(date) : ""}</span>`;
const KIND = {born: "baby", love: "heart", married: "gem", outcast: "split", dynasty: "crown", home: "house", "moved-world": "truck", moved: "door-open",
  school: "users", died: "flower-2", ancestor: "history", older: "scroll-text", build: "hammer", todo: "pen-line"};
const yours = (ask, title = "Yours to write", cls = "") => `<div class="yours ${cls}">${ic("pen-line")}<div><b>${esc(title)}</b>${ask ? `<em>${esc(ask)}</em>` : ""}</div></div>`;
const wikiLinks = src => src && src.length ? `From The Sims Wiki: ${src.map(([n, u]) => `<a href="${url(u)}" target="_blank" rel="noopener">${esc(n)}</a>`).join(", ")}` : "";

function lotRef(k) { const l = LOTS[k]; if (!l) return "";
  const inner = `<span class="wd" style="--c:${l.world.dotColour}"></span>${ic("home")}${esc(l.name)}<small>${esc(l.world.name)}</small>`;
  return l.open ? `<a class="ref" style="--c:${l.color}" href="${APP}#${l.id}" title="Open ${esc(l.name)} in the app">${inner}</a>`
    : `<span class="ref off" title="${esc(l.world.name)} isn’t on the site yet">${inner}</span>`; }
function hhRef(k) { const x = HHS[k]; if (!x) return "";
  const inner = `<span class="wd" style="--c:${x.world.dotColour}"></span>${ic("users")}${esc(x.name)} household<small>${esc(x.world.name)}</small>`;
  return x.open ? `<a class="ref" style="--c:${x.color}" href="${APP}#${x.id}" title="Open the ${esc(x.name)} household in the app">${inner}</a>`
    : `<span class="ref off" title="${esc(x.world.name)} isn’t on the site yet">${inner}</span>`; }
function simRef(id) { const s = SIMS[id]; if (!s) return ""; const x = s.hh && HHS[s.hh];
  const where = x ? x.world.name : s.world || "";
  const inner = `${ic("user-round")}${esc(s.name)}${s.late ? " <small>late</small>" : where ? `<small>${esc(where)}</small>` : ""}`;
  return x && x.open ? `<a class="ref" style="--c:${x.color}" href="${APP}#${x.id}" title="${esc(s.name)} lives with the ${esc(x.name)} household">${inner}</a>`
    : `<span class="ref off" title="${esc(s.late ? "Not alive: on the family tree only" : x ? x.world.name + " isn’t on the site yet" : s.home || "No home on the site")}">${inner}</span>`; }

// segmented choice buttons; each page has an onSeg(name, value)
const seg = (name, label, items, cur) => `<div class="seg" data-seg="${name}"><span>${label}</span>${items.map(([v, t, no]) =>
  `<button type="button" data-v="${v}" class="${v === cur ? "on" : ""}" aria-pressed="${v === cur}">${no ? `<i>${no}</i>` : ""}${t}</button>`).join("")}</div>`;
document.addEventListener("click", e => {
  const b = e.target.closest(".seg button"); if (!b) return;
  const s = b.closest(".seg"); if (typeof onSeg === "function") onSeg(s.dataset.seg, b.dataset.v);
});
const protoBar = (title, opts, choices = "") =>
  `<div class="proto-bar"><span class="proto-tag">Prototype, 17 Oct</span><b>${title}</b><div class="choices">${choices}</div></div><p class="proto-opts">${opts}</p>`;
const optHead = (no, title, rec) => `<div class="opt-head"><span class="no">${no}</span><h2>${title}</h2>${rec ? `<span class="rec">My pick</span>` : ""}</div>`;
const pane = (no, title, body, verdict, rec) => `<div class="pane"><span class="label"><span class="no">${no}</span><b>${title}</b>${rec ? `<span class="rec">My pick</span>` : ""}</span>${body}
  ${verdict ? `<div class="verdict">${verdict.map(v => `<span class="${v[0] === "-" ? "minus" : ""}">${esc(v.replace(/^[-+]\s*/, ""))}</span>`).join("")}</div>` : ""}</div>`;
const foot = () => `<footer><span>Prototype only: nothing on the site has changed.</span><span>EA’s side summarised from The Sims Wiki · Icons by Lucide</span></footer>`;

/* ================= the frame: sidebar like the app's ================= */
const PAGES = [["index.html", "Contents", "list-tree"], ["montys.html", "Romeo, Juliette and Dante", "heart"], ["goths.html", "The Goths", "ghost"]];
function frame(page, title) {
  document.title = title + " · Prototype · Jemma’s Sim World";
  const a = (href, icon, text, on) => `<a href="${href}" class="${on ? "on" : ""}">${ic(icon)}${esc(text)}</a>`;
  document.getElementById("nav").innerHTML =
    `<div class="nav-group"><div class="label">Story prototypes · 17 Oct</div>${PAGES.map(([f, t, i]) => a(f, i, t, f === page)).join("")}</div>
     <div class="nav-group"><div class="label">Other prototypes</div>${a("../sims/index.html", "users", "Showing Sims")}${a("../lots/index.html", "house", "Empty homes")}</div>
     <div class="nav-group"><div class="label">The app</div>${a(APP, "home", "Open the site")}${a(APP + "#h-willow-creek--goth", "users", "Goth household now")}${a(APP + "#h-ondarion--capp", "users", "Capp household now")}</div>`;
  document.querySelector(".brand").setAttribute("href", APP);
  document.getElementById("menuIco").innerHTML = ic("menu");
  document.getElementById("menuBtn").onclick = () => document.body.classList.toggle("nav-open");
  document.getElementById("scrim").onclick = () => document.body.classList.remove("nav-open");
}

/* ================= a household story page ================= */
let VIEW = "page", SHOW = "all", OLDER = "show", BUILDS = "show";
function onSeg(name, v) {
  if (name === "view") VIEW = v; if (name === "show") SHOW = v; if (name === "older") OLDER = v; if (name === "builds") BUILDS = v;
  const y = scrollY; drawStory(); scrollTo(0, y);
}
let ST = null, KEY = "";
function storyPage(key) {
  KEY = key; ST = STORIES[key];
  const q = new URLSearchParams(location.search); if (q.get("view") === "options") VIEW = "options";
  drawStory();
}
const eventsOf = k => EVENTS_OF[k].map(id => EVENTS.find(e => e.id === id));
const STAGES = [["before", "Before the game starts", ""], ["older", "In the older games", "Not part of The Sims 4’s story"], ["start", "When a new save starts", ""], ["save", "In your save", ""]];
const isEA = e => ["ts4", "older", "gallery"].includes(e.src);
function shownEvents() {
  return eventsOf(KEY).filter(e => (SHOW === "all" || (SHOW === "ea" ? isEA(e) : !isEA(e))) && (OLDER === "show" || e.src !== "older") && (BUILDS === "show" || e.src !== "site"));
}
function whenLine(e) {
  if (e.stage === "before") return `<span>Before the game</span>`;
  if (e.stage === "older") return `<span>${e.title.includes("Sims 2 and 3") ? "The Sims 2 and 3" : "The Sims 2"}</span>`;
  if (e.stage === "start") return `<span>Day one of a new save</span>`;
  if (e.src === "plan") return `<span>Decided <b>${esc(e.decided)}</b></span><span>Played: not yet</span><span>In the story: <i>yours to set</i></span>`;
  if (e.src === "site") return `<span>From the site’s own data</span>`;
  return `<span>Played: <i>month you played it</i></span><span>In the story: <i>e.g. Year 1, Spring</i></span>`;
}
function refsOf(e) {
  const skip = new Set(ST.members);
  return [...e.sims.filter(s => !skip.has(s)).map(simRef), ...e.households.filter(h => h !== KEY).map(hhRef), ...e.lots.map(lotRef)].join("");
}
function evCard(e) {
  const cls = [e.src === "older" ? "older" : "", e.src === "todo" ? "todo" : "", e.src === "site" ? "site" : ""].join(" ");
  const refs = refsOf(e);
  return `<div class="ev ${cls}" style="--s:var(--s-${e.src})"><span class="dot">${ic(KIND[e.kind] || "sparkles")}</span><div class="card">
    <div class="top"><h4>${e.title ? esc(e.title) : `<i>A new event</i>`}</h4>${srcChip(e.src)}</div>
    <div class="when">${whenLine(e)}</div>
    ${e.text ? `<p>${esc(e.text)}</p>` : ""}
    ${e.ask ? `<div class="ask">${yours(e.ask, e.src === "todo" ? "Yours to write" : "Your call", "small")}</div>` : ""}
    ${refs ? `<div class="refs">${refs}</div>` : ""}
    ${e.source ? `<div class="srcs">${wikiLinks(e.source)}</div>` : ""}</div></div>`;
}
function timeline(compact) {
  const evs = shownEvents();
  return `<div class="tl ${compact ? "compact" : ""}">${STAGES.map(([s, t, sub]) => { const list = evs.filter(e => e.stage === s).sort((a, b) => a.order - b.order);
    return list.length ? `<div class="tl-stage"><h3>${t}${sub ? ` <small>${sub}</small>` : ""}</h3>${list.map(evCard).join("")}</div>` : ""; }).join("") || `<p class="say">Nothing to show with these choices.</p>`}</div>`;
}
const tlFilters = () => `<div class="tl-filters">${seg("show", "Show", [["all", "Everything"], ["ea", "EA’s story"], ["mine", "Yours"]], SHOW)}${seg("older", "Older games", [["show", "Show"], ["hide", "Hide"]], OLDER)}${seg("builds", "Your builds", [["show", "Show"], ["hide", "Hide"]], BUILDS)}</div>`;
function timelineTable() {
  const evs = shownEvents().slice().sort((a, b) => STAGES.findIndex(s => s[0] === a.stage) - STAGES.findIndex(s => s[0] === b.stage) || a.order - b.order);
  const when = e => e.stage === "before" ? "Before the game" : e.stage === "older" ? "Older games" : e.stage === "start" ? "Day one" : e.src === "plan" ? "Decided " + e.decided : e.src === "site" ? "Site" : "—";
  return `<div class="sheet-wrap"><table class="sheet tlt"><thead><tr><th scope="col">When</th><th scope="col">What happened</th><th scope="col">Who and where</th><th scope="col">From</th></tr></thead><tbody>
    ${evs.map(e => `<tr class="${e.src === "older" ? "older" : ""}"><td class="w">${esc(when(e))}</td><td class="what"><b>${e.title ? esc(e.title) : "<i>Yours to write</i>"}</b>${e.text ? `<span>${esc(e.text)}</span>` : e.ask ? `<span>${esc(e.ask)}</span>` : ""}</td><td class="who"><div class="refs">${refsOf(e)}</div></td><td>${srcChip(e.src)}</td></tr>`).join("")}</tbody></table></div>`;
}
function compareTable() {
  const cell = ([t, s, d], ask, side) => s === "todo" ? `<td>${yours(ask || "", "Yours to write", "small")}</td>`
    : `<td class="${side === "mine" && s === "plan" ? "diff" : ""}">${esc(t)}<br>${srcChip(s, d)}${side === "mine" && ask ? `<div style="margin-top:8px">${yours(ask, "Your call", "small")}</div>` : ""}</td>`;
  return `<div class="sheet-wrap"><table class="sheet cmp"><thead><tr><th scope="col"><span class="sr">Topic</span></th><th scope="col">In the game</th><th scope="col">In your save</th></tr></thead><tbody>
    ${ST.compare.map(r => `<tr><th scope="row">${esc(r.topic)}</th>${cell(r.game, null, "game")}${cell(r.mine, r.ask, "mine")}</tr>`).join("")}</tbody></table></div>
    <p class="cmp-key">Shaded: where your save differs from the game.</p>`;
}
const eaBio = (lede) => `<div class="ea-bio"><p>${esc(ST.ea.bio)}</p><span class="src-note">${srcChip("ts4")} EA’s household bio (${esc(ST.ea.game)}), summarised in our words. ${wikiLinks(ST.ea.source)}</span></div>`;
function bioA1() {
  return `<div class="bio">${ST.bio ? `<p class="lede">${esc(ST.bio)}</p>` : yours(ST.bioAsk, "Your bio: a sentence or three")}
    <details class="ea-more" open><summary>EA’s version</summary><div>${eaBio()}</div></details></div>`;
}
function bioA2() {
  return `<div class="bio">${eaBio()}<p class="say" style="margin:0">When you write your own bio, it takes this place and EA’s moves under “EA’s version”.</p></div>`;
}
function twoBios() {
  return `<div class="two-bios"><div><h4>In the game</h4>${eaBio()}</div><div><h4>In your save</h4>${ST.bio ? `<p class="lede">${esc(ST.bio)}</p>` : yours(ST.bioAsk, "Your bio")}</div></div>`;
}
function chapters(colour) {
  return `<div class="chapters-list">${ST.chapters.map(c => c.src === "todo"
    ? `<article class="chap todo"><div class="pic empty-pic">${ic("camera")}<span>Your screenshots</span></div><div class="body"><span class="label">Chapter ${esc(c.n)} ${srcChip("todo")}</span>${yours(c.ask, "Title, date and story")}</div></article>`
    : `<article class="chap" style="--h:${colour}"><div class="pic">${esc(c.n)}</div><div class="body"><span class="label">Chapter ${esc(c.n)} ${srcChip(c.src)}</span><h4>${esc(c.title)}</h4><p>${esc(c.text)}</p></div></article>`).join("")}</div>`;
}
function people() {
  const card = ([kind, k, why]) => {
    if (kind === "lot") { const l = LOTS[k]; if (!l) return ""; const sub = [l.type, sizeTxt(l.size), l.hood + ", " + l.world.name].filter(Boolean).join(" · ");
      const inner = `<span class="mono">${ic("home")}</span><span><span class="why">${esc(why)}</span><b>${esc(l.name)}</b><small>${esc(sub)}</small><small>${l.built ? "Built" : "Not built yet"}${l.open ? "" : " · " + esc(l.world.name) + " isn’t on the site yet"}</small></span>`;
      return l.open ? `<a class="pp-card" style="--c:${l.color}" href="${APP}#${l.id}">${inner}</a>` : `<span class="pp-card off" style="--c:${l.color}">${inner}</span>`; }
    if (kind === "hh") { const x = HHS[k]; if (!x) return "";
      const inner = `<span class="mono">${initial(x.name)}</span><span><span class="why">${esc(why)}</span><b>${esc(x.name)}</b><small>${esc(x.lots.map(l => (LOTS[l] || {}).name).join(" & "))} · ${esc(x.world.name)}</small></span>`;
      return x.open ? `<a class="pp-card" style="--c:${x.color}" href="${APP}#${x.id}">${inner}</a>` : `<span class="pp-card off" style="--c:${x.color}">${inner}</span>`; }
    const s = SIMS[k]; return `<span class="pp-card off" style="--c:#8A918C"><span class="mono">${initial(s.name)}</span><span><span class="why">${esc(why)}</span><b>${esc(s.name)}</b><small>${esc(s.late ? "Late: on the family tree only" : s.home || "")}</small></span></span>`;
  };
  const grp = (t, kind) => { const items = ST.links.filter(l => l[0] === kind); return items.length ? `<div class="pp-group"><h3>${t}</h3><div class="pp">${items.map(card).join("")}</div></div>` : ""; };
  return `<div class="pp-groups">${grp("Homes", "lot")}${grp("Households", "hh")}${grp("Sims with no home on the site", "sim")}</div>`;
}
// JSON with short arrays and objects kept on one line, so the sample stays readable
function pretty(v, ind = "") {
  const one = JSON.stringify(v);
  if (v === null || typeof v !== "object" || one.length <= 110) return one;
  const nx = ind + "  ";
  if (Array.isArray(v)) return "[\n" + v.map(x => nx + pretty(x, nx)).join(",\n") + "\n" + ind + "]";
  return "{\n" + Object.entries(v).map(([k, x]) => nx + JSON.stringify(k) + ": " + pretty(x, nx)).join(",\n") + "\n" + ind + "}";
}
function stored() {
  const [world, name] = KEY.split("|"), st = {...ST}; delete st.title; delete st.links; delete st.bioAsk; delete st.members;
  const evs = eventsOf(KEY).map(e => { const o = {...e}; delete o.order; return o; });
  return `<details class="stored"><summary>${ic("scroll-text")}How this page’s story would be stored (proposal)</summary>
    <p>In <code>data/worlds/${slug(world)}.json</code>, under the household (the app shows apostrophes curly):</p>
    <pre>${url(pretty({households: {[name]: {story: st}}}))}</pre>
    <p>In one save-wide <code>data/story-events.json</code>, so an event shared by households in two worlds is typed once and shows on both:</p>
    <pre>${url(pretty(evs))}</pre></details>`;
}
function hero() {
  const x = HHS[KEY], home = LOTS[x.lots[0]], w = x.world, root = document.documentElement.style;
  const deep = w.deep || [darker(w.color, .30), darker(w.color, .42)]; root.setProperty("--deep", deep[0]); root.setProperty("--deep-2", deep[1]);
  const crumb = (href, icon, t) => href ? `<a href="${href}">${ic(icon)}${esc(t)}</a>` : `<span>${ic(icon)}${esc(t)}</span>`;
  return `<section class="hero small" style="--c:${home.color}"><div class="crumbs">${crumb(w.open ? APP + "#w-" + w.id : "", "map", w.name)}${crumb(w.open ? APP + "#n-" + w.id + "-" + slug(home.hood) : "", "pin", home.hood)}${crumb(home.open ? APP + "#" + home.id : "", "home", home.name)}</div>
    <div style="display:flex;gap:26px;align-items:center;flex-wrap:wrap;margin-top:22px"><div class="monogram">${initial(x.name)}</div><div><span class="label" style="color:var(--on-deep-mute)">Household</span><h1 style="margin-top:6px">${esc(x.name)}</h1></div></div>
    <p>${esc(ST.members.map(m => SIMS[m].name.split(" ")[0]).join(", ").replace(/, ([^,]*)$/, " and $1"))}</p></section>
    ${x.open ? "" : `<div class="note">${esc(w.name)} isn’t on the site yet (you don’t own it), so this household page doesn’t exist in the app. In your plan the ${esc(x.name)}s live at ${esc(home.name)}.</div>`}`;
}
const sub = (t, extra = "") => `<div class="block-head" style="margin-top:44px;border-bottom:0;padding-bottom:0"><h3 style="font:400 28px/1 var(--display)">${t}</h3>${extra}</div>`;

function drawStory() {
  const x = HHS[KEY], colour = (LOTS[x.lots[0]] || {}).color || x.world.color;
  let h = protoBar(esc(ST.title), VIEW === "page"
    ? "How “Their story” on the household page could look with my picks: your bio first with EA’s under it (A1), In the game against In your save (C1), the timeline (B1), people and places (E1), chapters (D). Switch to “Each option” to see the others."
    : "Each option on its own, with the alternatives side by side. Letters match research/household-stories.md.",
    seg("view", "Show", [["page", "On the household page"], ["options", "Each option"]], VIEW));
  h += hero();
  if (VIEW === "page") {
    h += `<p class="say" style="margin-top:28px">${ic("info")} The top of the household page (homes, The Sims, Connected households) stays as it is now; this is the “Their story” section further down.</p>`;
    h += `<section class="block" style="--h:${colour};margin-top:24px"><div class="block-head"><h2>Their <em>story</em></h2></div>
      ${bioA1()}
      ${sub("In the game, and in your save")}<div style="margin-top:14px">${compareTable()}</div>
      ${sub("Timeline")}${tlFilters()}${timeline(false)}
      ${sub("People and places")}${people()}
      ${sub("Chapters", `<span class="count">for households you play as a story</span>`)}<div style="margin-top:14px">${chapters(colour)}</div></section>`;
  } else {
    h += optHead("A", "A short bio", true) + `<p class="say">A few sentences at the top of “Their story”. For EA’s families there are two bios to place: theirs and yours.</p>`;
    h += `<div class="pair" style="--h:${colour}">${pane("A1", "Yours first, EA’s underneath", bioA1(), ["+ Your words lead; EA’s stays for reference", "+ Works the same for your own families (no EA part)", "- Empty-looking until you write something"], true)}
      ${pane("A2", "EA’s until yours is written", bioA2(), ["+ Every premade household has a bio from day one", "- Reads as if EA’s version is the story of your save"])}</div>`;
    h += optHead("B", "A dated timeline", true) + `<p class="say">One line per event: born, fell in love, married, moved, joined a dynasty, died. EA’s backstory sits “Before the game”, the older games apart, then your save. Your events carry the month you played them and, if you like, a time in the story (“Year 1, Spring”). Try the switches.</p>${tlFilters()}`;
    h += `<div class="stack" style="--h:${colour}"><div class="pair">${pane("B1", "A line with icons", timeline(false), ["+ Easy to follow; each event links its Sims, households and lots", "+ Placeholders show where your story goes", "- Long for families with many events (the compact version hides the details)"], true)}
      ${pane("B1, compact", "Titles and links only", timeline(true), ["+ Fits a big family on one screen", "- Loses EA’s detail lines"])}</div>
      ${pane("B2", "A table", timelineTable(), ["+ Like the Stats sheet: quick to scan", "- Feels like a record, not a story"])}</div>`;
    h += optHead("C", "EA’s version and yours, side by side", true) + `<p class="say">For EA’s families: what the game says against what you made of them. Your plan already fills some of it.</p>`;
    h += `<div class="stack" style="--h:${colour}">${pane("C1", "Topic by topic", compareTable(), ["+ Shows exactly what you changed", "+ Rows like Home can fill themselves from your plan", "- Only for EA’s families"], true)}
      ${pane("C2", "Two bios", twoBios(), ["+ Short, reads like a story", "- Harder to see what changed"])}</div>`;
    h += optHead("D", "Chapters") + `<p class="say">Legacy-blog style: numbered chapters with a title, the date you played, a few lines and your screenshots. Players number them generation.chapter (1.1, 1.2, then 2.1 for the heir). Worth it only for households you play as a story.</p>`;
    h += `<div style="--h:${colour}">${pane("D", "Chapter cards", chapters(colour), ["+ Room for real storytelling and your screenshots", "+ Pictures could come from your Sims 4 Screenshots folder, the way lot pictures come from your Builds folders", "- The most writing; empty for most households"])}</div>`;
    h += optHead("E", "Links to the lots and households involved", true) + `<p class="say">Everything the story mentions, gathered in one place. In the real thing this is worked out from the timeline, so nothing extra to type.</p>`;
    h += `<div class="pair" style="--h:${colour}">${pane("E1", "People and places cards", people(), ["+ One look shows the family’s web across worlds", "+ Opens the other households and lots in the app"], true)}
      ${pane("E2", "Only as links on each event", `<p class="say" style="margin-top:0">The same links, but only inside the timeline, next to what happened:</p>${evCard(eventsOf(KEY).find(e => e.stage === "save" && e.lots.length) || eventsOf(KEY)[0])}`, ["+ Nothing extra on the page", "- No single list of who’s connected"])}</div>`;
  }
  h += stored() + foot();
  document.getElementById("view").innerHTML = h;
}
