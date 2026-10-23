// Prototype, 23 Oct: an admin page in place of Stats, for Jemma only. Runs the app's own code (read only); nothing in site/ changes.
// Everything the site has kept off its public pages lives here: progress (the old Stats), the weekly Gallery refresh, New since you
// looked, checks, unlinked uploads, hashtag slips, what's waiting in game, and the Sims details that were taken off household pages.
// Extra bits not in data.js (refresh log, unlinked uploads, in-game checklist, TODO.md, research notes) come from admin-data.js,
// made by make_admin_data.py. In the real app that file would be built separately and never uploaded (research/calendar-and-admin.md).
PROTO.opts = [
  {k: "now", name: "Now", note: "The app today: Stats at the bottom of the sidebar, open to anyone who can see the site."},
  {k: "tabs", name: "Admin · tabs", note: "One admin page, in tabs. Only on your PC (online, it would sit behind a sign-in or not be uploaded at all)."},
  {k: "long", name: "Admin · one page", note: "The same sections on one long page, with jump links in the banner, like a world page."},
];
PROTO.mode = "tabs";
const A = window.ADMIN || {refresh: [], unlinked: [], checklist: [], todo: [], tagSlips: [], buildNext: []};
const owned = () => Object.values(lotIndex).filter(l => l.world.owned && l.world.ready);
const lotA = l => `<a href="#${l.id}">${esc(l.name)}</a>`;
const wDot = w => `<span class="dot" style="--h:${w.glow || w.color}"></span>`;
const hasShots = l => l.photos.some(p => /^shots\//.test(p.src));
const plural = (n, one, many) => `${n} ${n === 1 ? one : many || one + "s"}`;
const typeHead = t => (t || "").split(/[/(]/)[0].trim().toLowerCase();
// her own British names and the game's blank labels aren't mismatches (CLAUDE.md: Thrift and Boba Store, UoB Commons; EA's "Missing sims translation")
const TYPE_SAME = {"thrift and bubble tea store": "thrift and boba store", "ubrite commons": "uob commons"};
const typeClash = l => { const g = (l.gallery.lotType || "").toLowerCase(); if (!g || /missing sims translation|generic/.test(g)) return false;
  const plan = (l.type || "").toLowerCase().replace(/\s*\([^)]*\)/g, "").split("/").map(x => x.trim());
  return !plan.includes(TYPE_SAME[g] || g) && !/rental|apartment|penthouse|residential/.test(plan.join(" ") + g); };

// ---------- checks (the "Automatic Checks panel" idea, TODO §8) ----------
function checks(){
  const L = owned(), names = {};
  L.forEach(l => { const k = l.world.id + "|" + l.name.toLowerCase(); (names[k] ||= []).push(l); });
  const sameGal = (l, f) => l.gallery && l.gallery[f] && l[f] && l.gallery[f] !== l[f];
  return [
    {name: "Shared, but no Gallery upload linked", items: L.filter(l => l.shared === true && !l.gallery)},
    {name: "On the Gallery, but not ticked Shared", items: L.filter(l => l.gallery && l.shared !== true), note: l => `uploaded as “${esc(l.gallery.title)}”`},
    {name: "Shared, but not ticked Built", items: L.filter(l => l.shared === true && l.built === false)},
    {name: "No lot type", items: L.filter(l => !l.type)},
    {name: "No lot size", items: L.filter(l => !isApt(l) && !sizeTxt(l.size))},
    {name: "Plan size differs from the Gallery’s", items: L.filter(l => sameGal(l, "size")), note: l => `plan ${esc(sizeTxt(l.size))}, Gallery ${esc(sizeTxt(l.gallery.size))}`},
    {name: "Plan lot type differs from the Gallery’s", items: L.filter(l => l.gallery && l.type && !l.versions && typeClash(l)), note: l => `plan ${esc(l.type)}, Gallery ${esc(l.gallery.lotType)}`},
    {name: "Same name twice in one world", items: Object.values(names).filter(v => v.length > 1 && !v.every(l => l.building && l.building === v[0].building)).flat()},
    {name: "In the plan, but no page on the site", items: ROWS.filter(r => r.owned && !r.link).map(r => ({id: "", name: r.name, world: worlds.find(w => w.name === r.w)}))},
  ];
}

// ---------- the weekly Gallery refresh ----------
const lastSunday = () => { const d = new Date(); d.setHours(8, 54, 0, 0); while (d.getDay() !== 0 || d > new Date()) d.setDate(d.getDate() - 1); return d; };
const runDate = r => new Date(r.when.replace(/^(\d+) (\w+) (\d+) (\d+):(\d+)$/, "$2 $1, $3 $4:$5"));
function refreshCard(){
  const runs = A.refresh, last = runs[runs.length - 1], lastOk = [...runs].reverse().find(r => r.ok);
  if (!last) return `<div class="adm-card"><span class="label">${ic("refresh-cw")}Weekly Gallery refresh</span><p>No runs logged yet.</p></div>`;
  const missed = runDate(lastOk) < lastSunday(), bad = !last.ok;
  return `<div class="adm-card ${bad || missed ? "warn" : "ok"}"><span class="label">${ic("refresh-cw")}Weekly Gallery refresh</span>
    <b class="big">${esc(lastOk.when.replace(/ 20\d\d/, ""))}</b>
    <p>${bad ? `<b>The last run stopped with an error</b> (${esc(last.when)}). ` : ""}${missed ? `<b>Sunday’s run hasn’t happened yet</b>; it catches up next time you’re signed in. ` : "Last good run. "}
      ${lastOk.listed} uploads listed, ${plural(lastOk.new, "new one")}.</p><p>Runs every Sunday at 08:54 while you’re signed in.</p></div>`;
}
function refreshTable(){
  const rows = [...A.refresh].reverse().slice(0, 8);
  return `<div class="sheet-wrap"><table class="sheet"><thead><tr><th scope="col">Run</th><th scope="col">Result</th><th scope="col">Uploads</th><th scope="col">New</th><th scope="col">Favourites</th><th scope="col">Downloads</th><th scope="col">What happened</th></tr></thead>
    <tbody>${rows.map(r => `<tr><th scope="row">${esc(r.when)}</th><td>${r.ok ? `<span class="adm-pill ok">done</span>` : `<span class="adm-pill bad">stopped</span>`}</td><td class="num">${r.listed ?? ""}</td><td class="num">${r.new ?? ""}</td><td class="num">${r.favourites ?? ""}</td><td class="num">${r.downloads ?? ""}</td>
      <td class="wrap">${[...r.linked.map(x => esc(x.replace(/^linked new upload /, "Linked "))), ...r.notes.map(esc)].join("<br>") || `<small>nothing new</small>`}</td></tr>`).join("")}</tbody></table></div>
    <p class="showing">From logs/gallery-refresh.log. Hand-run refreshes show too.</p>`;
}

// ---------- sections ----------
const SECTIONS = [
  {k: "glance", name: "At a glance", icon: "sparkle"},
  {k: "progress", name: "Progress", icon: "grid"},
  {k: "gallery", name: "Gallery", icon: "share"},
  {k: "checks", name: "Checks", icon: "list-checks"},
  {k: "next", name: "Build next", icon: "hammer"},
  {k: "game", name: "In game", icon: "flag"},
  {k: "sims", name: "Sims", icon: "users"},
];
let adminTab = "glance";
const counts = () => { const c = checks().reduce((n, x) => n + x.items.length, 0), L = owned();
  return {checks: c, next: L.filter(l => l.built === true && l.shared === false).length, game: A.checklist.length + A.todo.filter(t => t.inGame).length,
    gallery: L.filter(l => newSince(l)).length, sims: Object.values(SIMS).filter(s => s.from).length}; };

function glance(){
  const L = owned(), built = L.filter(l => l.built === true).length, shared = L.filter(l => l.shared === true).length, n = counts();
  const fresh = L.filter(l => newSince(l)), ch = checks().filter(x => x.items.length);
  const card = (icon, label, big, text, tab, cls = "") => `<div class="adm-card ${cls}"><span class="label">${ic(icon)}${label}</span><b class="big">${big}</b><p>${text}</p>${tab ? `<button type="button" class="linkish" data-admin-tab="${tab}">Open ${esc(SECTIONS.find(s => s.k === tab).name)} ${ic("arrow")}</button>` : ""}</div>`;
  return `<div class="adm-grid">${refreshCard()}
    ${card("sparkle", "New since you looked", fresh.length, fresh.length ? fresh.slice(0, 6).map(l => `${lotA(l)} <small>${esc(newTxt(newSince(l)))}</small>`).join("<br>") : "No new favourites, comments or uploads since you last opened each lot.", fresh.length ? "gallery" : "")}
    ${card("hammer", "Built", `${built}<small style="font-size:18px"> of ${L.length}</small>`, `${Math.round(100 * built / L.length)}% of the owned worlds’ lots. <b>${shared}</b> shared, <b>${n.next}</b> built but not shared yet.`, "progress")}
    ${card("list-checks", "Checks", ch.length ? n.checks : "All clear", ch.length ? ch.map(x => `${esc(x.name)}: <b>${x.items.length}</b>`).join("<br>") : "Plan, Gallery and site agree.", "checks", ch.length ? "warn" : "ok")}
    ${card("flag", "Waiting in game", n.game, `${plural(A.checklist.length, "item")} on your in-game checklist, ${plural(A.todo.filter(t => t.inGame).length, "to-do")} that need the game open.`, "game")}
    ${card("share", "Gallery uploads not on a lot", A.unlinked.length, "Left off on purpose (older copies, room uploads, other builds), each with its reason.", "gallery")}
    ${card("camera", "Shared, no screenshots", L.filter(l => l.shared === true && !hasShots(l)).length, "Shared lots showing only their Gallery pictures.", "next")}
    ${card("users", "Sims to double-check", n.sims, "Sims filled from one of your saves or your Library; the pages show them without a marker.", "sims")}</div>`;
}
function progress(){
  const t = document.createElement("template"); t.innerHTML = statsPage();
  t.content.querySelector("section.hero")?.remove();
  [...t.content.querySelectorAll("section.block")].filter(s => /On the/.test(s.querySelector("h2")?.textContent || "")).forEach(s => s.remove());
  return `<p class="adm-intro">The old Stats page, as it was: every world and every lot of the plan, to sort and filter.</p>` + t.innerHTML;
}
function gallery(){
  const fresh = owned().filter(l => newSince(l));
  return `<h3 class="adm-sub">The weekly <em>refresh</em><small>latest runs first</small></h3>${refreshTable()}
    <h3 class="adm-sub">New since you <em>looked</em><small>in this browser</small></h3>
    ${fresh.length ? `<ul class="adm-list">${fresh.map(l => `<li><span>${wDot(l.world)}${lotA(l)}</span><span class="w">${esc(newTxt(newSince(l)))}</span></li>`).join("")}</ul>` : `<p class="adm-plain">Nothing new since you last opened each lot. (The “New” pills on lot cards stay as they are.)</p>`}
    ${galleryOverTime()}
    <h3 class="adm-sub">Uploads not on a <em>lot</em><small>${A.unlinked.length}, from data/gallery/unlinked.json</small></h3>
    <ul class="adm-list">${A.unlinked.map(u => `<li><span><b>${esc(u.title)}</b>${u.lot ? ` <span class="w">· ${esc(u.lot)}</span>` : ""}</span><small>${esc(u.why)}</small></li>`).join("")}</ul>
    <details class="adm-more"><summary>Hashtag slips, for when you re-upload (${A.tagSlips.length})</summary>
      <p class="adm-plain">You said you’d check these yourself when re-uploading; here so they’re in one place. Old uploads can’t be edited.</p>
      <ul class="adm-list">${A.tagSlips.map(s => `<li><span><b>${esc(s.upload)}</b></span><span class="w">${esc(s.tag)} → ${esc(s.meant)}</span></li>`).join("")}</ul>
      ${A.noWorldTag ? `<p class="adm-plain"><b>No world tag:</b> ${esc(A.noWorldTag)}.</p>` : ""}</details>`;
}
function checksSec(){
  return `<p class="adm-intro">Worked out at every build from your plan, the Gallery and the site. Nothing here is fixed by itself: you decide.</p>
    <ul class="adm-list">${checks().map(c => `<li><span><b>${esc(c.name)}</b></span><span class="w">${c.items.length ? `<span class="adm-pill bad">${c.items.length}</span>` : `<span class="adm-pill ok">all clear</span>`}</span>
      ${c.items.length ? `<small>${c.items.map(l => (l.id ? lotA(l) : esc(l.name)) + (l.world ? ` (${esc(l.world.name)})` : "") + (c.note ? ": " + c.note(l) : "")).join(" · ")}</small>` : ""}</li>`).join("")}</ul>`;
}
function nextSec(){
  const L = owned(), bns = L.filter(l => l.built === true && l.shared === false), byW = {};
  L.filter(l => l.shared === true && !hasShots(l)).forEach(l => (byW[l.world.id] ||= []).push(l));
  const empty = L.filter(l => !l.hh && !unitCount(l) && /residential|apartment|penthouse/i.test(l.type || "") && !l.owned);
  const free = L.filter(l => unitCount(l)).map(l => [l, rentalUnits(l).map((u, i) => u ? null : unitLabel(l, i)).filter(Boolean)]).filter(([, f]) => f.length);
  const find = n => L.find(l => fold(l.name) === fold(n));
  return `<h3 class="adm-sub">Built, not <em>shared</em><small>${bns.length}</small></h3>
    <ul class="adm-list">${bns.map(l => `<li><span>${wDot(l.world)}${lotA(l)} <span class="w">· ${esc(l.type || "")}</span></span><span class="w">${esc(l.world.name)}</span></li>`).join("")}</ul>
    <h3 class="adm-sub">A suggested <em>order</em><small>from research/build-priorities.md (16–17 Oct); your call</small></h3>
    <ul class="adm-list">${A.buildNext.map((b, i) => { const l = find(b.name); return `<li><span>${i + 1}. ${l ? lotA(l) : `<b>${esc(b.name)}</b>`} ${l && l.shared === true ? `<span class="adm-pill ok">shared</span>` : l && l.built === true ? `<span class="adm-pill">built</span>` : ""}</span><span class="w">${esc(b.world)}</span><small>${esc(b.why)}</small></li>`; }).join("")}</ul>
    <h3 class="adm-sub">Shared, no <em>screenshots</em><small>${Object.values(byW).flat().length}; they show only their Gallery pictures</small></h3>
    <ul class="adm-list">${Object.entries(byW).sort((a, b) => b[1].length - a[1].length).map(([wid, ls]) => `<li><span>${wDot(ls[0].world)}<b>${esc(ls[0].world.name)}</b></span><span class="w">${ls.length}</span><small>${ls.map(lotA).join(" · ")}</small></li>`).join("")}</ul>
    <div class="adm-two"><div><h3 class="adm-sub">Empty <em>homes</em><small>${empty.length}</small></h3><ul class="adm-list">${empty.map(l => `<li><span>${lotA(l)}</span><span class="w">${esc(l.world.name)}</span>${l.whoNote ? `<small>${esc(l.whoNote)}</small>` : ""}</li>`).join("")}</ul></div>
      <div><h3 class="adm-sub">Free rental <em>units</em><small>${free.reduce((n, [, f]) => n + f.length, 0)}</small></h3><ul class="adm-list">${free.map(([l, f]) => `<li><span>${lotA(l)}</span><span class="w">${esc(l.world.name)}</span><small>${f.map(esc).join(", ")}</small></li>`).join("")}</ul></div></div>`;
}
function gameSec(){
  const groups = {}; A.checklist.forEach(c => (groups[c.section] ||= []).push(c));
  const heads = {}; A.todo.forEach(t => (heads[t.head] ||= []).push(t));
  const md = s => esc(s).replace(/\*\*(.+?)\*\*/g, "<b>$1</b>");
  return `<p class="adm-intro">From your in-game checklist (for-jemma/in-game-checklist.md) and TODO.md; ticked items left out. Read only here: tell Claude what you find, as now.</p>
    ${Object.entries(groups).map(([s, cs]) => `<h3 class="adm-sub">${esc(s)}<small>${cs.length}</small></h3><ul class="adm-list">${cs.map(c => `<li><span>${md(c.text)}</span>${c.world ? `<span class="w">${esc(c.world)}</span>` : ""}</li>`).join("")}</ul>`).join("")}
    <h3 class="adm-sub">To-dos that need the <em>game</em><small>${A.todo.filter(t => t.inGame).length}, from TODO.md</small></h3>
    <ul class="adm-list">${A.todo.filter(t => t.inGame).map(t => `<li><span>${md(t.text.length > 260 ? t.text.slice(0, 257) + "…" : t.text)}</span><small>${esc(t.head)}</small></li>`).join("")}</ul>
    <details class="adm-more"><summary>Everything on TODO.md waiting for you (${A.todo.length})</summary>
      ${Object.entries(heads).map(([h, ts]) => `<h3 class="adm-sub" style="font-size:20px">${esc(h)}<small>${ts.length}</small></h3><ul class="adm-list">${ts.map(t => `<li><span>${md(t.text.length > 260 ? t.text.slice(0, 257) + "…" : t.text)}</span></li>`).join("")}</ul>`).join("")}</details>`;
}
function simsSec(){
  const ws = worlds.filter(w => w.owned && w.ready), from = {};
  Object.values(SIMS).filter(s => s.from && s.hh).forEach(s => { const k = s.hh.id; (from[k] ||= {hh: s.hh, src: new Set(), n: 0}); from[k].n++; from[k].src.add(s.from); });
  const rows = ws.map(w => { const hs = homeHhs(w); return {w, hs, made: hs.filter(simsMade).length, none: hs.filter(h => !h.sims.length).length, pic: hs.filter(h => h.portrait).length, lib: hs.filter(h => !h.portrait && h.libraryPic).length}; }).filter(r => r.hs.length);
  return `<p class="adm-intro">The progress and source notes that were taken off household and Sim pages (19 Oct, no admin notes), kept here instead.</p>
    <div class="sheet-wrap"><table class="sheet summary"><thead><tr><th scope="col">World</th><th scope="col">Households</th><th scope="col">Sims made in game</th><th scope="col">% made</th><th scope="col">No Sims on the site</th><th scope="col">Your screenshot</th><th scope="col">Library picture</th></tr></thead>
    <tbody>${rows.map(r => `<tr><th scope="row">${wDot(r.w)}${esc(r.w.name)}</th><td class="num">${r.hs.length}</td><td class="num">${r.made}</td><td><div class="mini-bar simbar"><i style="width:${Math.round(100 * r.made / r.hs.length)}%"></i></div>${Math.round(100 * r.made / r.hs.length)}%</td><td class="num">${r.none || ""}</td><td class="num">${r.pic || ""}</td><td class="num">${r.lib || ""}</td></tr>`).join("")}</tbody></table></div>
    <h3 class="adm-sub">Filled from your <em>saves</em><small>${Object.values(from).reduce((n, x) => n + x.n, 0)} Sims in ${Object.keys(from).length} households, to double-check (research/own-households-review.md)</small></h3>
    <ul class="adm-list">${Object.values(from).sort((a, b) => byHh(a.hh, b.hh)).map(x => `<li><span>${wDot(x.hh.world)}<a href="#${x.hh.id}">${esc(x.hh.name)}</a> <span class="w">· ${plural(x.n, "Sim")}</span></span><span class="w">${esc(x.hh.world.name)}</span><small>${[...x.src].map(esc).join("; ")}</small></li>`).join("")}</ul>`;
}
const BODY = {glance, progress, gallery, checks: checksSec, next: nextSec, game: gameSec, sims: simsSec};

function adminPage(){
  const L = owned(), n = counts(), long = PROTO.mode === "long";
  const badge = k => ({checks: n.checks, next: n.next, game: n.game, gallery: n.gallery, sims: n.sims})[k];
  const jump = SECTIONS.map(s => `<a href="#admin-${s.k}" data-admin-jump="${s.k}">${esc(s.name)}</a>`).join("");
  let h = `<section class="hero small adm-hero" style="--c:#8E62CF"><div class="kicker"><i></i><span class="label">Behind the scenes</span><span class="adm-lock">${ic("lock")}Only you</span></div>
    <h1 style="margin-top:14px">The <em>admin</em> page</h1><p>Progress, Gallery numbers, checks and what’s waiting in game. Not part of the site anyone else would see.</p>
    <div class="hero-foot"><div class="figures">${[[L.filter(l => l.built === true).length, "lots built"], [L.filter(l => l.shared === true).length, "shared"], [L.filter(l => l.gallery).length, "on the Gallery"], [n.checks, n.checks === 1 ? "check to look at" : "checks to look at"]].map(([a, b]) => `<div><b>${a}</b><span>${b}</span></div>`).join("")}</div>${long ? `<div class="chapters">${jump}</div>` : ""}</div></section>`;
  if (long) return h + SECTIONS.map(s => `<section class="block" id="admin-${s.k}"><div class="block-head"><h2>${esc(s.name)}</h2>${badge(s.k) ? `<span class="count">${badge(s.k)}</span>` : ""}</div>${BODY[s.k]()}</section>`).join("");
  h += `<div class="adm-tabs" role="tablist">${SECTIONS.map(s => `<button type="button" role="tab" aria-selected="${adminTab === s.k}" class="${adminTab === s.k ? "on" : ""}" data-admin-tab="${s.k}">${ic(s.icon)}${esc(s.name)}${badge(s.k) ? `<span class="n">${badge(s.k)}</span>` : ""}</button>`).join("")}</div>`;
  return h + `<section class="block" style="margin-top:28px">${BODY[adminTab]()}</section>`;
}

PROTO.page = key => {
  if (PROTO.mode === "now") return null;
  const m = /^(admin|stats)(?:-(.+))?$/.exec(key); if (!m) return null;
  if (m[1] === "stats") { const w = worlds.find(x => x.id === m[2]); statsPage(w ? w.name : null); adminTab = "progress"; }
  else if (m[2] && BODY[m[2]] && PROTO.mode === "tabs") adminTab = m[2];
  return {html: adminPage(), active: "admin", title: "Admin · Jemma’s Sim World", keepScroll: PROTO.keep};
};
// the Stats filters redraw the admin page, not the old Stats page
window.refreshStats = full => { if (full) { PROTO.keep = true; window.route(); PROTO.keep = false; } else { const el = document.getElementById("lot-rows"); if (el) el.innerHTML = lotRows(); } };
document.addEventListener("click", e => { const b = e.target.closest("[data-admin-tab]"); if (!b) return;
  adminTab = b.dataset.adminTab; if (PROTO.mode === "long") { document.getElementById("admin-" + adminTab)?.scrollIntoView({behavior: SMOOTH()}); return; }
  history.replaceState(null, "", hereHash("#admin-" + adminTab)); PROTO.keep = true; window.route(); PROTO.keep = false; });
document.addEventListener("click", e => { const a = e.target.closest("[data-admin-jump]"); if (!a) return; e.preventDefault(); document.getElementById("admin-" + a.dataset.adminJump)?.scrollIntoView({behavior: SMOOTH()}); });

// the sidebar: Calendar up under Home (calendar option A), Stats becomes Admin with a lock, last in the list
PROTO.navHook = (active, key, ctx, nav) => {
  if (PROTO.mode === "now") return;
  const bottom = nav.querySelector(".stats-nav"); if (!bottom) return;
  bottom.querySelector('a[href="#calendar"]')?.remove();
  nav.querySelector(".nav-group").insertAdjacentHTML("beforeend", `<a href="#calendar">${ic("calendar")}Calendar</a>`);
  bottom.classList.add("admin-nav"); bottom.innerHTML = `<a href="#admin" class="${active === "admin" ? "on" : ""}">${ic("lock")}Admin</a>`;
};
// public pages lose their links to Stats: the world page's "Progress, lot by lot" card goes; the search's fallback points at Admin
PROTO.after = (key, view) => { if (PROTO.mode === "now") return; view.querySelector(".stats-link")?.remove(); };
protoStart();
