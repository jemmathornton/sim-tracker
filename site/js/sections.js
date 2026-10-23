// The sidebar sections Across the worlds (Calendar, Clubs, Dynasties, University organisations, Families, Businesses) and Admin
// (in place of the old Stats page), their pages, and the calendar links on world, neighbourhood and lot pages. Kept after a trial
// (her call, 23 Oct; her decisions in research/calendar-and-admin.md and TODO.md "Calendar, admin page and a sidebar section").
// The Calendar and Admin pages are ported from the prototype she reviewed (for-jemma/prototypes/calendar-admin/: proto-calendar.js,
// option A; proto-admin.js, as pages instead of tabs). Loaded after app.js and js/admin-data.js; app.js's route() asks sectionPage()
// for these pages and lets afterRoute() add the calendar links.
let redrawing = false;
const redraw = () => { const y = scrollY; redrawing = true; try { route(); } finally { redrawing = false; } scrollTo(0, y); };
const ACROSS_KEYS = ["clubs", "dynasties", "organisations", "families", "businesses"];

// ---------- the sidebar ----------
const ADM_SECTIONS = [
  {k: "glance", key: "admin", name: "At a glance", icon: "sparkle", title: "At a <em>glance</em>"},
  {k: "progress", key: "admin-progress", name: "Progress", icon: "grid", title: "The <em>progress</em>"},
  {k: "gallery", key: "admin-gallery", name: "Gallery", icon: "share", title: "On the <em>Gallery</em>"},
  {k: "checks", key: "admin-checks", name: "Checks", icon: "list-checks", title: "The <em>checks</em>"},
  {k: "next", key: "admin-next", name: "Build next", icon: "hammer", title: "Build <em>next</em>"},
  {k: "game", key: "admin-game", name: "In game", icon: "flag", title: "In <em>game</em>"},
  {k: "sims", key: "admin-sims", name: "Sims", icon: "users", title: "The <em>Sims</em>"},
];
const grpOf = kind => Object.values(GROUP_PAGES).filter(g => g.kind === kind);
const ACROSS_NAV = () => [["calendar", "calendar", "Calendar", null], ["clubs", "flag", "Clubs", grpOf("club").length], ["dynasties", "crown", "Dynasties", grpOf("dynasty").length],
  ["organisations", "graduation-cap", "University organisations", Object.keys((DATA.groups || {}).organisations || {}).length], ["families", "network", "Families", crossFamilies().length], ["businesses", "briefcase", "Businesses", ownedBusinesses().length]];
function sectionsNav(active){
  const nav = document.getElementById("nav"), notOwned = nav.querySelector(".nav-group.dim");
  const n = admCounts(), badge = k => ({checks: n.checks, next: n.next, game: n.game, gallery: n.gallery, sims: n.sims})[k];
  const across = `<div class="nav-group across-nav"><div class="label">Across the worlds</div>${ACROSS_NAV().map(([k, i, t, c]) => `<a href="#${k}" class="${active === k ? "on" : ""}">${ic(i)}${esc(t)}${c ? `<span class="pct">${c}</span>` : ""}</a>`).join("")}</div>`;
  const admin = `<div class="nav-group admin-nav"><div class="label">Admin</div>${ADM_SECTIONS.map(s => `<a href="#${s.key}" class="${active === s.key ? "on" : ""}">${ic(s.icon)}${esc(s.name)}${badge(s.k) ? `<span class="pct">${badge(s.k)}</span>` : ""}</a>`).join("")}</div>`;
  if (notOwned) notOwned.insertAdjacentHTML("beforebegin", across); else nav.insertAdjacentHTML("beforeend", across);
  nav.insertAdjacentHTML("beforeend", admin);
}
const renderNavBase = renderNav;
renderNav = function (active, key, ctx) { renderNavBase(active, key, ctx); sectionsNav(active); };

/* ---------- the Calendar (prototype option A, her pick): one calendar, a map banner of the worlds with something on; pick a world and
   the banner becomes its map and colours (#calendar-<world>). Every event in the month opens its lot or neighbourhood. ---------- */
const calWorlds = () => worlds.filter(w => w.owned && w.ready);
const wById = id => calWorlds().find(w => w.id === id);
const calLink = w => !w ? "#calendar" : "#calendar-" + w.id;
// where an event takes you: its lot, else its neighbourhood, else its world
const evHref = e => { const w = calW(e.w), hid = w && e.hood ? w.id + "-" + slug(e.hood) : null;
  return e.link || (hid && hoodIndex[hid] ? "#n-" + hid : w ? "#w-" + w.id : ""); };
const KIND_WORD = {festival: ["festival", "festivals"], community: ["community event", "community events"], school: ["educational event", "educational events"], lot: ["lot night", "lot nights"]};
// a world's calendar shows every kind held there to start with (its own ticks, kept apart from the whole-save calendar's)
const worldKinds = new Set(Object.keys(CAL_KINDS));
function protoCal(w){
  const kinds = w ? worldKinds : calState.kinds, on = e => kinds.has(calKind(e)), byWorld = e => e.kind === "festival" || e.kind === "community" || e.kind === "lot";
  const base = calEvents().filter(e => !w || e.w === w.name);   // a world's calendar: everything held there, school events too
  const shown = base.filter(e => on(e) && (w || !byWorld(e) || !calState.world || e.w === calState.world) && (byWorld(e) || e.kind === "lot" || !calState.school || calSub(e) === calState.school))
    .map(e => e.kind === "lot" ? {...e, label: e.where + ": " + e.name} : e);
  const withEv = calWorlds().filter(x => calEvents().some(e => e.w === x.name && on(e)));
  const subs = k => [...new Set(base.filter(e => calKind(e) === k).map(calSub))];
  const byStart = (a, b) => (a.kind === "lot") - (b.kind === "lot") || (a.kind === "lot" ? a.where.localeCompare(b.where) || a.start - b.start : a.start - b.start || a.order - b.order);
  const daily = shown.filter(e => e.special === "daily").sort(byStart), loose = shown.filter(e => e.special && e.special !== "daily").sort(byStart);
  const weeks = CAL.seasonWeeks || 4, sn = calState.season, hols = kinds.has("holiday") ? calHolidays(sn) : [];

  // the banner
  const seasons = CAL.seasons.map(s => `<button type="button" class="${s === sn ? "on" : ""}" data-cal-season="${s}">${ic(SEASON_ICON[s] || "calendar")}${esc(s)}</button>`).join("");
  const count = k => new Set(shown.filter(e => calKind(e) === k).map(e => e.name + "|" + e.w)).size;
  const figs = [[hols.length, hols.length === 1 ? "holiday" : "holidays"], ...["festival", "community", "school", "lot"].filter(k => kinds.has(k) && count(k)).map(k => [count(k), KIND_WORD[k][count(k) === 1 ? 0 : 1]])];
  let h;
  if (w) {
    const text = shown.length ? `What’s on in ${esc(w.name)} each ${esc(sn.toLowerCase())}: its holidays, and every festival and regular event held here, week by week.`
      : `Holidays only: no festivals or regular events are held in ${esc(w.name)}${kinds.size < 5 ? " (with the kinds ticked below)" : ""}.`;
    h = mapHero(w, `Calendar · ${esc(w.name)}`, `What’s <em>on</em><small class="h1-sub">${esc(sn)} in ${esc(w.name)}</small>`, text, figs, seasons, true).replace('class="hero ', 'class="hero cal-w-hero ');
    h = h.replace('<div class="kicker">', `<a class="cal-back" href="#calendar">${ic("arrow")}All worlds</a><div class="kicker">`);
  } else {
    const strip = withEv.map(x => `<a href="${calLink(x)}" style="background-image:url('${x.thumb}');--h:${x.glow || x.color}" title="${esc(x.name)}"><span>${esc(x.name)}</span></a>`).join("");
    h = `<section class="hero mapped cal-hero" style="--c:#C9A04A"><div class="patch">${strip}</div><div class="patch-fade"></div><span class="credit">Maps by 20th Century Plumbob</span>
      <div class="kicker"><i></i><span class="label">Across the save · ${withEv.length} worlds with something on</span></div>
      <h1>The <em>calendar</em><small class="h1-sub">${esc(sn)}, four weeks, Monday to Sunday</small></h1>
      <div class="hero-foot"><div class="figures">${figs.map(([n, t]) => `<div><b>${n}</b><span>${t}</span></div>`).join("")}</div><div class="chapters">${seasons}</div></div></section>`;
  }

  const chip = (x) => `<a class="wchip ${calState.world === x.name ? "on" : ""}" href="${calLink(x)}" style="${calHues(x.name)}"><i></i>${esc(x.name)}</a>`;
  const chipRow = (label, key, all, list) => `<div class="wchips"><span class="chip-l">${label}</span><button type="button" class="wchip ${calState[key] ? "" : "on"}" data-cal-${key}="">${all}</button>${list.map(([v, style]) => `<button type="button" class="wchip ${calState[key] === v ? "on" : ""}" data-cal-${key}="${esc(v)}" style="${style || ""}"><i></i>${esc(v)}</button>`).join("")}</div>`;
  h += `<section class="block cal"><div class="cal-top"><div class="kinds">${Object.entries(CAL_KINDS).filter(([k]) => !w || k === "holiday" || base.some(e => calKind(e) === k)).map(([k, t]) => `<label><input type="checkbox" data-cal-kind="${k}" ${kinds.has(k) ? "checked" : ""}> ${esc(t)}</label>`).join("")}</div></div>
    ${!w && withEv.length ? `<div class="wchips"><span class="chip-l">Worlds</span><a class="wchip ${calState.world ? "" : "on"}" href="#calendar">All worlds</a>${withEv.map(chip).join("")}</div>` : ""}
    ${kinds.has("school") && subs("school").length > 1 ? chipRow("Educational", "school", "Both", subs("school").map(v => [v])) : ""}`;
  if (daily.length) h += `<div class="band"><span class="band-l">${ic("repeat")}Every day</span><div class="band-evs">${daily.map(calPill).join("")}</div></div>`;
  h += `<div class="month s-${sn.toLowerCase()}"><div class="m-head"><span></span>${CAL_DAYS.map(d => `<b>${CAL_DAY_NAMES[d]}</b>`).join("")}</div>
    ${Array.from({length: weeks}, (_, i) => { const wk = i + 1;
      return `<div class="m-week"><span class="m-wk">Week ${wk}</span>${CAL_DAYS.map((d, j) => { const ho = hols.filter(x => x.week === wk && x.day === d);
        const evs = shown.filter(e => e.days && e.days.includes(d) && calWeeks(e).includes(wk)).sort(byStart);
        return `<div class="m-day${ho.length ? " hol" : ""}"><span class="m-n">${i * 7 + j + 1}</span>${ho.map(x => `<div class="m-hol">${ic(SEASON_ICON[sn] || "sparkle")}<b>${esc(x.name)}</b>${x.off ? "<small>day off</small>" : ""}</div>`).join("")}
          ${evs.map(e => `<a href="${evHref(e)}" class="m-ev k-${calKind(e)}${e.built === false ? " unbuilt" : ""}" style="${calHues(e.w)}" title="${esc((e.label || e.name) + " · " + e.time + " · " + e.w + (e.kind !== "lot" && (e.where || e.hood) ? ", " + (e.where || e.hood) : "") + (e.built === false ? " (not built yet)" : ""))}"><i></i><span>${esc(e.label || e.name)}${calStar(e)}</span></a>`).join("")}</div>`; }).join("")}</div>`; }).join("")}</div>`;
  if (loose.length) h += `<div class="band"><span class="band-l">${ic("moon")}No fixed day</span><div class="band-evs">${loose.map(e => calPill(e).replace('<span class="t">', `<span class="t">${esc(CAL_OFTEN[e.often] || e.often || "")} · `)).join("")}</div></div>`;
  h += `<div class="key"><span><i class="k-hol"></i>holiday</span><span>Every-other-week festivals are shown on weeks 1 and 3 (or 2 and 4 for the one they take turns with); which week depends on your save.</span><span><sup>*</sup> the game never shows this name</span><span>Click an event to open its lot or neighbourhood.</span></div>`;
  h += `<p class="yr-note">${ic("sparkle")}<span>${CAL.holidays.length ? "" : "These are the game’s own holidays; you’ll make your own for this save. "}<b>Surprise holidays</b>, a few days’ notice, at random: ${CAL.surprise.map(([d, n]) => `${esc(n)} (${d})`).join(", ")}.</span></p>
    <p class="yr-note">${ic("leaf")}<span><b>Neighbourhood action plan voting</b> every week from Friday 8 am to Monday 6 pm, in every neighbourhood with residents.</span></p></section>`;
  return h;
}
// seasons, kinds and the school filter redraw the calendar
const onCalendar = () => /^#calendar/.test(location.hash);
document.addEventListener("click", e => { if (!onCalendar()) return;
  const s = e.target.closest("[data-cal-season]"), sc = e.target.closest("[data-cal-school]");
  if (s) { calState.season = s.dataset.calSeason; redraw(); }
  else if (sc) { calState.school = sc.getAttribute("data-cal-school") || null; redraw(); } });
document.addEventListener("change", e => { if (!onCalendar()) return; const k = e.target.dataset && e.target.dataset.calKind; if (!k) return;
  const set = /^#calendar-/.test(location.hash) ? worldKinds : calState.kinds; e.target.checked ? set.add(k) : set.delete(k); if (set === calState.kinds) calKeep(); redraw(); });

// links to the Calendar from world, neighbourhood and lot pages
const whatsOnLine = w => { const evs = calEvents().filter(e => e.w === w.name), names = [...new Set(evs.filter(e => e.kind === "festival").map(e => e.name))];
  const others = new Set(evs.filter(e => e.kind !== "festival").map(e => e.name + "|" + (e.where || ""))).size;
  const txt = names.length ? names.map(n => `<b>${esc(n)}</b>`).join(", ") + (others ? ` and ${others} regular ${others === 1 ? "event" : "events"}` : "")
    : others ? `${others} regular ${others === 1 ? "event" : "events"} (no festivals)` : "the save’s holidays (no festivals or regular events here)";
  return `<div class="wx-whatson">${ic("party")}<b>What’s on:</b><span>${txt}.</span><a href="${calLink(w)}">${esc(w.name)}’s calendar ${ic("arrow")}</a></div>`; };
function afterRoute(key, view){
  const wm = /^w-(.+)$/.exec(key), w = wm && wById(wm[1]);
  if (w) { const strip = view.querySelector(".world-strip"); if (strip) strip.insertAdjacentHTML("beforeend", whatsOnLine(w)); }
  const hm = /^n-(.+)$/.exec(key), x = hm && hoodIndex[hm[1]];
  if (x && wById(x.world.id)) view.querySelectorAll(".hood-extras .home-to").forEach(p => { if (!/Festivals and events/.test(p.textContent)) return;
    p.querySelectorAll("b").forEach(b => b.outerHTML = `<a class="fest-link" href="${calLink(x.world)}">${b.outerHTML}</a>`); });
  const l = lotIndex[key];
  if (l && wById(l.world.id)) { const nights = calEvents().filter(e => e.kind === "lot" && e.link === "#" + l.id), dl = view.querySelector("dl.facts");
    if (nights.length && dl) dl.insertAdjacentHTML("beforeend", `<div><dt>Lot nights</dt><dd>${nights.map(e => `${esc(e.name)}, ${e.days.map(d => CAL_DAY_NAMES[d]).join(" and ")} ${esc(e.time)}`).join("; ")} · <a href="${calLink(l.world)}">calendar</a></dd></div>`); }
}

/* ---------- Admin (in place of Stats; for her only, on her PC). Ported from proto-admin.js; her call: pages under an Admin header in
   the sidebar, not tabs. Extra bits not in data.js come from js/admin-data.js (tools/admin_data.py, run by the build). ---------- */
const ADM = window.ADMIN || {refresh: [], unlinked: [], checklist: [], todo: [], tagSlips: [], buildNext: []};
const admOwned = () => Object.values(lotIndex).filter(l => l.world.owned && l.world.ready);
const lotA = l => `<a href="#${l.id}">${esc(l.name)}</a>`;
const wDot = w => `<span class="dot" style="--h:${w.glow || w.color}"></span>`;
const hasShots = l => l.photos.some(p => /^shots\//.test(p.src));
const plural = (n, one, many) => `${n} ${n === 1 ? one : many || one + "s"}`;
// her own British names and the game's blank labels aren't mismatches (CLAUDE.md: Thrift and Boba Store, UoB Commons; EA's "Missing sims translation")
const TYPE_SAME = {"thrift and bubble tea store": "thrift and boba store", "ubrite commons": "uob commons"};
const typeClash = l => { const g = (l.gallery.lotType || "").toLowerCase(); if (!g || /missing sims translation|generic/.test(g)) return false;
  const plan = (l.type || "").toLowerCase().replace(/\s*\([^)]*\)/g, "").split("/").map(x => x.trim());
  return !plan.includes(TYPE_SAME[g] || g) && !/rental|apartment|penthouse|residential/.test(plan.join(" ") + g); };

// checks (the "Automatic Checks panel" idea, TODO §8); worked out once, as the data doesn't change while the page is open
let ADM_CHECKS = null;
function admChecks(){
  if (ADM_CHECKS) return ADM_CHECKS;
  const L = admOwned(), names = {};
  L.forEach(l => { const k = l.world.id + "|" + l.name.toLowerCase(); (names[k] ||= []).push(l); });
  const sameGal = (l, f) => l.gallery && l.gallery[f] && l[f] && l.gallery[f] !== l[f];
  return ADM_CHECKS = [
    {name: "Shared, but no Gallery upload linked", items: L.filter(l => l.shared === true && !l.gallery)},
    {name: "On the Gallery, but not ticked Shared", items: L.filter(l => l.gallery && l.shared !== true), note: l => `uploaded as “${esc(l.gallery.title)}”`},
    {name: "Shared, but not ticked Built", items: L.filter(l => l.shared === true && l.built === false)},
    {name: "No lot type", items: L.filter(l => !l.type || l.tbd)},
    {name: "No lot size", items: L.filter(l => !isApt(l) && !sizeTxt(l.size))},
    {name: "Plan size differs from the Gallery’s", items: L.filter(l => sameGal(l, "size")), note: l => `plan ${esc(sizeTxt(l.size))}, Gallery ${esc(sizeTxt(l.gallery.size))}`},
    {name: "Plan lot type differs from the Gallery’s", items: L.filter(l => l.gallery && l.type && !l.versions && typeClash(l)), note: l => `plan ${esc(l.type)}, Gallery ${esc(l.gallery.lotType)}`},
    {name: "Same name twice in one world", items: Object.values(names).filter(v => v.length > 1 && !v.every(l => l.building && l.building === v[0].building)).flat()},
    {name: "In the plan, but no page on the site", items: ROWS.filter(r => r.owned && !r.link).map(r => ({id: "", name: r.name, world: worlds.find(w => w.name === r.w)}))},
  ];
}

// the weekly Gallery refresh
const lastSunday = () => { const d = new Date(); d.setHours(8, 54, 0, 0); while (d.getDay() !== 0 || d > new Date()) d.setDate(d.getDate() - 1); return d; };
const runDate = r => new Date(r.when.replace(/^(\d+) (\w+) (\d+) (\d+):(\d+)$/, "$2 $1, $3 $4:$5"));
function refreshCard(){
  const runs = ADM.refresh, last = runs[runs.length - 1], lastOk = [...runs].reverse().find(r => r.ok);
  if (!last || !lastOk) return `<div class="adm-card"><span class="label">${ic("refresh-cw")}Weekly Gallery refresh</span><p>No runs logged yet.</p></div>`;
  const missed = runDate(lastOk) < lastSunday(), bad = !last.ok;
  return `<div class="adm-card ${bad || missed ? "warn" : "ok"}"><span class="label">${ic("refresh-cw")}Weekly Gallery refresh</span>
    <b class="big">${esc(lastOk.when.replace(/ 20\d\d/, ""))}</b>
    <p>${bad ? `<b>The last run stopped with an error</b> (${esc(last.when)}). ` : ""}${missed ? `<b>Sunday’s run hasn’t happened yet</b>; it catches up next time you’re signed in. ` : "Last good run. "}
      ${lastOk.listed} uploads listed, ${plural(lastOk.new, "new one")}.</p><p>Runs every Sunday at 08:54 while you’re signed in.</p></div>`;
}
function refreshTable(){
  const rows = [...ADM.refresh].reverse().slice(0, 8);
  return `<div class="sheet-wrap"><table class="sheet"><thead><tr><th scope="col">Run</th><th scope="col">Result</th><th scope="col">Uploads</th><th scope="col">New</th><th scope="col">Favourites</th><th scope="col">Downloads</th><th scope="col">What happened</th></tr></thead>
    <tbody>${rows.map(r => `<tr><th scope="row">${esc(r.when)}</th><td>${r.ok ? `<span class="adm-pill ok">done</span>` : `<span class="adm-pill bad">stopped</span>`}</td><td class="num">${r.listed ?? ""}</td><td class="num">${r.new ?? ""}</td><td class="num">${r.favourites ?? ""}</td><td class="num">${r.downloads ?? ""}</td>
      <td class="wrap">${[...r.linked.map(x => esc(x.replace(/^linked new upload /, "Linked "))), ...r.notes.map(esc)].join("<br>") || `<small>nothing new</small>`}</td></tr>`).join("")}</tbody></table></div>
    <p class="showing">From logs/gallery-refresh.log. Hand-run refreshes show too.</p>`;
}

const admCounts = () => { const c = admChecks().reduce((n, x) => n + x.items.length, 0), L = admOwned();
  return {checks: c, next: L.filter(l => l.built === true && l.shared === false).length, game: ADM.checklist.length + ADM.todo.filter(t => t.inGame).length,
    gallery: L.filter(l => newSince(l)).length, sims: Object.values(SIMS).filter(s => s.from).length}; };

function admGlance(){
  const L = admOwned(), built = L.filter(l => l.built === true).length, shared = L.filter(l => l.shared === true).length, n = admCounts();
  const fresh = L.filter(l => newSince(l)), ch = admChecks().filter(x => x.items.length);
  const card = (icon, label, big, text, sec, cls = "") => { const s = ADM_SECTIONS.find(x => x.k === sec);
    return `<div class="adm-card ${cls}"><span class="label">${ic(icon)}${label}</span><b class="big">${big}</b><p>${text}</p>${s ? `<a class="linkish" href="#${s.key}">Open ${esc(s.name)} ${ic("arrow")}</a>` : ""}</div>`; };
  return `<div class="adm-grid">${refreshCard()}
    ${card("sparkle", "New since you looked", fresh.length, fresh.length ? fresh.slice(0, 6).map(l => `${lotA(l)} <small>${esc(newTxt(newSince(l)))}</small>`).join("<br>") : "No new favourites, comments or uploads since you last opened each lot.", fresh.length ? "gallery" : "")}
    ${card("hammer", "Built", `${built}<small style="font-size:18px"> of ${L.length}</small>`, `${Math.round(100 * built / L.length)}% of the owned worlds’ lots. <b>${shared}</b> shared, <b>${n.next}</b> built but not shared yet.`, "progress")}
    ${card("list-checks", "Checks", ch.length ? n.checks : "All clear", ch.length ? ch.map(x => `${esc(x.name)}: <b>${x.items.length}</b>`).join("<br>") : "Plan, Gallery and site agree.", "checks", ch.length ? "warn" : "ok")}
    ${card("flag", "Waiting in game", n.game, `${plural(ADM.checklist.length, "item")} on your in-game checklist, ${plural(ADM.todo.filter(t => t.inGame).length, "to-do")} that need the game open.`, "game")}
    ${card("share", "Gallery uploads not on a lot", ADM.unlinked.length, "Left off on purpose (older copies, room uploads, other builds), each with its reason.", "gallery")}
    ${card("camera", "Shared, no screenshots", L.filter(l => l.shared === true && !hasShots(l)).length, "Shared lots showing only their Gallery pictures.", "next")}
    ${card("users", "Sims to double-check", n.sims, "Sims filled from one of your saves or your Library; the pages show them without a marker.", "sims")}</div>`;
}
function admProgress(){
  const t = document.createElement("template"); t.innerHTML = statsPage();
  t.content.querySelector("section.hero")?.remove();
  [...t.content.querySelectorAll("section.block")].filter(s => /On the/.test(s.querySelector("h2")?.textContent || "")).forEach(s => s.remove());
  return `<p class="adm-intro">The old Stats page, as it was: every world and every lot of the plan, to sort and filter.</p>` + t.innerHTML;
}
function admGallery(){
  const fresh = admOwned().filter(l => newSince(l));
  return `<h3 class="adm-sub">The weekly <em>refresh</em><small>latest runs first</small></h3>${refreshTable()}
    <h3 class="adm-sub">New since you <em>looked</em><small>in this browser</small></h3>
    ${fresh.length ? `<ul class="adm-list">${fresh.map(l => `<li><span>${wDot(l.world)}${lotA(l)}</span><span class="w">${esc(newTxt(newSince(l)))}</span></li>`).join("")}</ul>` : `<p class="adm-plain">Nothing new since you last opened each lot. (The “New” pills on lot cards stay as they are.)</p>`}
    ${galleryOverTime()}
    <h3 class="adm-sub">Uploads not on a <em>lot</em><small>${ADM.unlinked.length}, from data/gallery/unlinked.json</small></h3>
    <ul class="adm-list">${ADM.unlinked.map(u => `<li><span><b>${esc(u.title)}</b>${u.lot ? ` <span class="w">· ${esc(u.lot)}</span>` : ""}</span><small>${esc(u.why)}</small></li>`).join("")}</ul>
    <details class="adm-more"><summary>Hashtag slips, for when you re-upload (${ADM.tagSlips.length})</summary>
      <p class="adm-plain">You said you’d check these yourself when re-uploading; here so they’re in one place. Old uploads can’t be edited.</p>
      <ul class="adm-list">${ADM.tagSlips.map(s => `<li><span><b>${esc(s.upload)}</b></span><span class="w">${esc(s.tag)} → ${esc(s.meant)}</span></li>`).join("")}</ul>
      ${ADM.noWorldTag ? `<p class="adm-plain"><b>No world tag:</b> ${esc(ADM.noWorldTag)}.</p>` : ""}</details>`;
}
function admChecksSec(){
  return `<p class="adm-intro">Worked out at every build from your plan, the Gallery and the site. Nothing here is fixed by itself: you decide.</p>
    <ul class="adm-list">${admChecks().map(c => `<li><span><b>${esc(c.name)}</b></span><span class="w">${c.items.length ? `<span class="adm-pill bad">${c.items.length}</span>` : `<span class="adm-pill ok">all clear</span>`}</span>
      ${c.items.length ? `<small>${c.items.map(l => (l.id ? lotA(l) : esc(l.name)) + (l.world ? ` (${esc(l.world.name)})` : "") + (c.note ? ": " + c.note(l) : "")).join(" · ")}</small>` : ""}</li>`).join("")}</ul>`;
}
function admNext(){
  const L = admOwned(), bns = L.filter(l => l.built === true && l.shared === false), byW = {};
  L.filter(l => l.shared === true && !hasShots(l)).forEach(l => (byW[l.world.id] ||= []).push(l));
  const empty = L.filter(l => !l.hh && !unitCount(l) && /residential|apartment|penthouse/i.test(l.type || "") && !l.owned);
  const free = L.filter(l => unitCount(l)).map(l => [l, rentalUnits(l).map((u, i) => u ? null : unitLabel(l, i)).filter(Boolean)]).filter(([, f]) => f.length);
  const find = n => L.find(l => fold(l.name) === fold(n));
  return `<h3 class="adm-sub">Built, not <em>shared</em><small>${bns.length}</small></h3>
    <ul class="adm-list">${bns.map(l => `<li><span>${wDot(l.world)}${lotA(l)} <span class="w">· ${esc(l.type || "")}</span></span><span class="w">${esc(l.world.name)}</span></li>`).join("")}</ul>
    <h3 class="adm-sub">A suggested <em>order</em><small>from research/build-priorities.md (16–17 Oct); your call</small></h3>
    <ul class="adm-list">${ADM.buildNext.map((b, i) => { const l = find(b.name); return `<li><span>${i + 1}. ${l ? lotA(l) : `<b>${esc(b.name)}</b>`} ${l && l.shared === true ? `<span class="adm-pill ok">shared</span>` : l && l.built === true ? `<span class="adm-pill">built</span>` : ""}</span><span class="w">${esc(b.world)}</span><small>${esc(b.why)}</small></li>`; }).join("")}</ul>
    <h3 class="adm-sub">Shared, no <em>screenshots</em><small>${Object.values(byW).flat().length}; they show only their Gallery pictures</small></h3>
    <ul class="adm-list">${Object.entries(byW).sort((a, b) => b[1].length - a[1].length).map(([wid, ls]) => `<li><span>${wDot(ls[0].world)}<b>${esc(ls[0].world.name)}</b></span><span class="w">${ls.length}</span><small>${ls.map(lotA).join(" · ")}</small></li>`).join("")}</ul>
    <div class="adm-two"><div><h3 class="adm-sub">Empty <em>homes</em><small>${empty.length}</small></h3><ul class="adm-list">${empty.map(l => `<li><span>${lotA(l)}</span><span class="w">${esc(l.world.name)}</span>${l.whoNote ? `<small>${esc(l.whoNote)}</small>` : ""}</li>`).join("")}</ul></div>
      <div><h3 class="adm-sub">Free rental <em>units</em><small>${free.reduce((n, [, f]) => n + f.length, 0)}</small></h3><ul class="adm-list">${free.map(([l, f]) => `<li><span>${lotA(l)}</span><span class="w">${esc(l.world.name)}</span><small>${f.map(esc).join(", ")}</small></li>`).join("")}</ul></div></div>`;
}
function admGame(){
  const groups = {}; ADM.checklist.forEach(c => (groups[c.section] ||= []).push(c));
  const heads = {}; ADM.todo.forEach(t => (heads[t.head] ||= []).push(t));
  const md = s => esc(s).replace(/\*\*(.+?)\*\*/g, "<b>$1</b>");
  return `<p class="adm-intro">From your in-game checklist (for-jemma/in-game-checklist.md) and TODO.md; ticked items left out. Read only here: tell Claude what you find, as now.</p>
    ${Object.entries(groups).map(([s, cs]) => `<h3 class="adm-sub">${esc(s)}<small>${cs.length}</small></h3><ul class="adm-list">${cs.map(c => `<li><span>${md(c.text)}</span>${c.world ? `<span class="w">${esc(c.world)}</span>` : ""}</li>`).join("")}</ul>`).join("")}
    <h3 class="adm-sub">To-dos that need the <em>game</em><small>${ADM.todo.filter(t => t.inGame).length}, from TODO.md</small></h3>
    <ul class="adm-list">${ADM.todo.filter(t => t.inGame).map(t => `<li><span>${md(t.text.length > 260 ? t.text.slice(0, 257) + "…" : t.text)}</span><small>${esc(t.head)}</small></li>`).join("")}</ul>
    <details class="adm-more"><summary>Everything on TODO.md waiting for you (${ADM.todo.length})</summary>
      ${Object.entries(heads).map(([h, ts]) => `<h3 class="adm-sub" style="font-size:20px">${esc(h)}<small>${ts.length}</small></h3><ul class="adm-list">${ts.map(t => `<li><span>${md(t.text.length > 260 ? t.text.slice(0, 257) + "…" : t.text)}</span></li>`).join("")}</ul>`).join("")}</details>`;
}
function admSims(){
  const ws = worlds.filter(w => w.owned && w.ready), from = {};
  Object.values(SIMS).filter(s => s.from && s.hh).forEach(s => { const k = s.hh.id; (from[k] ||= {hh: s.hh, src: new Set(), n: 0}); from[k].n++; from[k].src.add(s.from); });
  const rows = ws.map(w => { const hs = homeHhs(w); return {w, hs, made: hs.filter(simsMade).length, none: hs.filter(h => !h.sims.length).length, pic: hs.filter(h => h.portrait).length, lib: hs.filter(h => !h.portrait && h.libraryPic).length}; }).filter(r => r.hs.length);
  return `<p class="adm-intro">The progress and source notes that were taken off household and Sim pages (19 Oct, no admin notes), kept here instead.</p>
    <div class="sheet-wrap"><table class="sheet summary"><thead><tr><th scope="col">World</th><th scope="col">Households</th><th scope="col">Sims made in game</th><th scope="col">% made</th><th scope="col">No Sims on the site</th><th scope="col">Your screenshot</th><th scope="col">Library picture</th></tr></thead>
    <tbody>${rows.map(r => `<tr><th scope="row">${wDot(r.w)}${esc(r.w.name)}</th><td class="num">${r.hs.length}</td><td class="num">${r.made}</td><td><div class="mini-bar simbar"><i style="width:${Math.round(100 * r.made / r.hs.length)}%"></i></div>${Math.round(100 * r.made / r.hs.length)}%</td><td class="num">${r.none || ""}</td><td class="num">${r.pic || ""}</td><td class="num">${r.lib || ""}</td></tr>`).join("")}</tbody></table></div>
    <h3 class="adm-sub">Filled from your <em>saves</em><small>${Object.values(from).reduce((n, x) => n + x.n, 0)} Sims in ${Object.keys(from).length} households, to double-check (research/own-households-review.md)</small></h3>
    <ul class="adm-list">${Object.values(from).sort((a, b) => byHh(a.hh, b.hh)).map(x => `<li><span>${wDot(x.hh.world)}<a href="#${x.hh.id}">${esc(x.hh.name)}</a> <span class="w">· ${plural(x.n, "Sim")}</span></span><span class="w">${esc(x.hh.world.name)}</span><small>${[...x.src].map(esc).join("; ")}</small></li>`).join("")}</ul>`;
}
const ADM_BODY = {glance: admGlance, progress: admProgress, gallery: admGallery, checks: admChecksSec, next: admNext, game: admGame, sims: admSims};
function adminPage(sec){
  const L = admOwned(), n = admCounts();
  return `<section class="hero small adm-hero" style="--c:#8E62CF"><div class="kicker"><i></i><span class="label">Admin</span><span class="adm-lock">${ic("lock")}Only you</span></div>
    <h1 style="margin-top:14px">${sec.title}</h1><p>Progress, Gallery numbers, checks and what’s waiting in game. Not part of the site anyone else would see.</p>
    <div class="hero-foot"><div class="figures">${[[L.filter(l => l.built === true).length, "lots built"], [L.filter(l => l.shared === true).length, "shared"], [L.filter(l => l.gallery).length, "on the Gallery"], [n.checks, n.checks === 1 ? "check to look at" : "checks to look at"]].map(([a, b]) => `<div><b>${a}</b><span>${b}</span></div>`).join("")}</div></div></section>
    <section class="block adm-body">${ADM_BODY[sec.k]()}</section>`;
}
// the Progress filters redraw the Admin page, not the old Stats page
const refreshStatsBase = refreshStats;
refreshStats = function (full) {
  if (!/^#(admin-progress|stats)/.test(location.hash)) return refreshStatsBase(full);
  if (full) redraw(); else { const el = document.getElementById("lot-rows"); if (el) el.innerHTML = lotRows(); } };

/* ---------- Across the worlds: clubs, dynasties, university organisations, families, businesses ---------- */
const grpColour = g => { const l = g.place ? lotIndex[g.place] : g.homeHh ? g.homeHh.lots[0] : null; return g.colour || (l ? (l.hood.glow || l.hood.color) : wColour(g.world)); };
const grpCard = (g, icon, rel, sub) => `<a class="fam" href="#${g.id}" style="--h:${grpColour(g)}"><span class="mono">${ic(icon)}</span><span>${rel ? `<span class="rel">${esc(rel)}</span>` : ""}<b>${esc(groupTitle(g))}</b><small>${sub}</small></span></a>`;
const worldLabel = w => w ? w.name + (w.owned ? "" : " (not owned)") : "Across the save";
const acrossHero = (c, kicker, title, text, figs) => `<section class="hero small" style="--c:${c}"><div class="kicker"><i></i><span class="label">${kicker}</span></div><h1 style="margin-top:14px">${title}</h1><p>${text}</p>
  ${figs ? `<div class="hero-foot"><div class="figures">${figs.map(([n, t]) => `<div><b>${n}</b><span>${t}</span></div>`).join("")}</div></div>` : ""}</section>`;
const byWorldOrder = (a, b) => (a ? worlds.indexOf(a) : 999) - (b ? worlds.indexOf(b) : 999);
function groupsBy(list, keyOf){ const m = new Map(); list.forEach(g => { const k = keyOf(g); if (!m.has(k)) m.set(k, []); m.get(k).push(g); }); return m; }
const whoRole = (g, role) => g.members.filter(([, r]) => r === role).map(([id]) => SIMS[id].name).join(", ");
const acrossEmpty = txt => `<section class="block"><div class="empty">${ic("note")}${txt}</div></section>`;

function clubsPage(){
  const cs = grpOf("club").sort((a, b) => byWorldOrder(a.world, b.world) || a.name.localeCompare(b.name)), by = groupsBy(cs, g => g.world || null);
  let h = acrossHero("#5E8F7A", "Across the worlds", "The <em>clubs</em>", "Every club on the site, by the world where it meets: who leads it, where it gets together, how many are in it.", [[cs.length, cs.length === 1 ? "club" : "clubs"], [by.size, by.size === 1 ? "world" : "worlds"], [new Set(cs.flatMap(g => g.members.map(([m]) => m))).size, "members"]]);
  if (!cs.length) return h + acrossEmpty("No clubs yet.");
  by.forEach((gs, w) => { h += `<section class="block"><div class="block-head"><h2>${esc(worldLabel(w))}</h2><span class="count">${plural(gs.length, "club")}</span></div><div class="families tr-groups">${gs.map(g => {
    const lead = whoRole(g, "leader"), at = g.place && lotIndex[g.place] ? lotIndex[g.place].name : g.anyType ? "any " + g.anyType : "";
    return grpCard(g, "flag", "", [lead && "Led by " + esc(lead), at && "meets at " + esc(at), plural(g.members.length, "member")].filter(Boolean).join(" · ")); }).join("")}</div></section>`; });
  return h;
}
function dynastiesPage(){
  const ds = grpOf("dynasty").sort((a, b) => byWorldOrder(a.world, b.world) || a.name.localeCompare(b.name)), by = groupsBy(ds, g => g.world || null);
  let h = acrossHero("#9A7B3A", "Across the worlds", "The <em>dynasties</em>", "Every dynasty on the site, by the world its head lives in: the head, the heir, and how far the family has spread.", [[ds.length, ds.length === 1 ? "dynasty" : "dynasties"], [by.size, by.size === 1 ? "world" : "worlds"], [ds.reduce((n, g) => n + g.members.length, 0), "members"]]);
  if (!ds.length) return h + acrossEmpty("No dynasties yet.");
  by.forEach((gs, w) => { h += `<section class="block"><div class="block-head"><h2>${esc(worldLabel(w))}</h2><span class="count">${plural(gs.length, "dynasty", "dynasties")}</span></div><div class="families tr-groups">${gs.map(g => {
    const head = whoRole(g, "head"), heir = whoRole(g, "heir"), hhs = new Set(g.members.map(([id]) => SIMS[id].hh).filter(Boolean)).size;
    return grpCard(g, "crown", g.prestige != null ? `${g.prestige} ${g.prestige === 1 ? "star" : "stars"}` : "", [head && "Head: " + esc(head), heir && "heir: " + esc(heir), plural(g.members.length, "member") + (hhs > 1 ? ` in ${hhs} households` : "")].filter(Boolean).join(" · ")); }).join("")}</div></section>`; });
  return h;
}
function orgsPage(){
  // every organisation the game has, the ones nobody on the site is in yet as plain cards with no page (her ask, 23 Oct: Foxbury Spirit Squad)
  const joined = grpOf("org"), empty = Object.entries((DATA.groups || {}).organisations || {}).filter(([n]) => !joined.some(g => g.name === n)).map(([n, o]) => ({...o, name: n, kind: "org", empty: true, members: []}));
  const os = [...joined, ...empty].sort((a, b) => Object.keys(UNIS).indexOf(a.uni) - Object.keys(UNIS).indexOf(b.uni) || a.name.localeCompare(b.name)), by = groupsBy(os, g => g.uni);
  let h = acrossHero("#4E8B66", "Across the worlds · Britechester", "University <em>organisations</em>", "Every organisation, by university: the University of Britechester, Foxbury Institute, and the secret one open to both.", [[os.length, os.length === 1 ? "organisation" : "organisations"], [new Set(os.flatMap(g => g.members.map(([m]) => m))).size, "members"]]);
  if (!os.length) return h + acrossEmpty("No university organisations yet.");
  by.forEach((gs, u) => { h += `<section class="block"><div class="block-head"><h2>${esc((UNIS[u] || {}).name || "Other")}</h2><span class="count">${plural(gs.length, "organisation")}</span></div><div class="families tr-groups">${gs.map(g =>
    g.empty ? `<div class="fam" style="--h:${(UNIS[g.uni] || {}).colour || "#888"}"><span class="mono">${ic(g.uni === "secret" ? "book-open-text" : "graduation-cap")}</span><span>${g.uni === "secret" ? `<span class="rel">Secret society</span>` : ""}<b>${esc(g.name)}</b><small>No members yet</small></span></div>`
    : grpCard(g, g.uni === "secret" ? "book-open-text" : "graduation-cap", kindName(g) === "Secret society" ? "Secret society" : "", [plural(g.members.length, "member"), g.join ? esc(g.join) : ""].filter(Boolean).join(" · "))).join("")}</div></section>`; });
  return h;
}
// families spread over several worlds: Sims joined by real family links (parents and partners), never by a shared surname alone;
// a family counts when its Sims live in two or more worlds. NPC households (the Scotts at The Gnome's Arms) are left out.
let FAMILIES_ACROSS = null;
function crossFamilies(){
  if (FAMILIES_ACROSS) return FAMILIES_ACROSS;
  const ok = id => SIMS[id] && !SIMS[id].ph && !SIMS[id].stub && !(SIMS[id].hh && SIMS[id].hh.npc) && simWorldOf(id);
  const ids = Object.keys(SIMS).filter(ok), up = {}, find = x => up[x] === x ? x : (up[x] = find(up[x]));
  ids.forEach(id => up[id] = id);
  const edges = [];
  ids.forEach(id => { (SIMS[id].parents || []).filter(ok).forEach(p => edges.push([id, p])); (SIMS[id].partners || []).filter(([p]) => ok(p)).forEach(([p]) => edges.push([id, p])); });
  edges.forEach(([a, b]) => { up[find(a)] = find(b); });
  const comps = {}; ids.forEach(id => (comps[find(id)] ||= []).push(id));
  return FAMILIES_ACROSS = Object.values(comps).map(m => {
    const ws = [...new Set(m.map(simWorldOf))].sort(byWorldOrder);
    if (ws.length < 2) return null;
    const hhs = [...new Set(m.map(id => SIMS[id].hh).filter(Boolean))].sort((a, b) => byWorldOrder(a.world, b.world) || byHh(a, b));
    const lines = {}; m.forEach(id => { const n = FAMILIES[SIMS[id].line]?.name; if (n) lines[n] = (lines[n] || 0) + 1; });
    const name = Object.entries(lines).sort((a, b) => b[1] - a[1])[0]?.[0] || surname(SIMS[m[0]].name);
    const seenPair = new Set(), across = edges.filter(([a, b]) => m.includes(a) && simWorldOf(a) !== simWorldOf(b)).filter(([a, b]) => { const k = [a, b].sort().join("|"); if (seenPair.has(k)) return false; seenPair.add(k); return true; });
    return {name, ws, hhs, sims: m, loose: m.filter(id => !SIMS[id].hh), across};
  }).filter(Boolean).sort((a, b) => b.ws.length - a.ws.length || b.sims.length - a.sims.length || a.name.localeCompare(b.name));
}
// the links between worlds in a few lines, parents grouped with all their children (her feedback, 23 Oct: "so much duplication"):
// "Daniel and Mary-Sue Pleasant (Windenburg) are the parents of Angela and Lilith Pleasant (Britechester)"
function namesOf(ids, fam){
  const sur = ids.map(id => surname(SIMS[id].name)), same = sur.every(x => x && x === sur[0]) && (ids.length > 1 || sur[0] === fam);
  const parts = ids.map(id => same ? (() => { const href = simLinkTo(id), n = SIMS[id].name.slice(0, -sur[0].length).trim(); return href ? `<a href="${href}">${esc(n)}</a>` : esc(n); })() : simA(id));
  return (parts.length > 1 ? parts.slice(0, -1).join(", ") + " and " + parts[parts.length - 1] : parts[0]) + (same && sur[0] !== fam ? " " + esc(sur[0]) : "");   // the heading already says "The Pleasant family"
}
function acrossLines(across, fam){
  const isParent = (a, b) => (SIMS[a].parents || []).includes(b), out = [], kids = {};
  across.filter(([a, b]) => isParent(a, b)).forEach(([a, b]) => (kids[a] ||= []).push(b));
  const groups = {};
  Object.entries(kids).forEach(([child, ps]) => { ps.sort(); const k = ps.join("|") + ">" + simWorldOf(child).name; (groups[k] ||= {ps, kids: []}).kids.push(child); });
  Object.values(groups).forEach(g => {
    const pw = [...new Set(g.ps.map(id => simWorldOf(id).name))].join(", "), kw = simWorldOf(g.kids[0]).name;
    const one = g.ps.length === 1 ? (relWord(g.kids[0], g.ps[0]) || "parent").toLowerCase() : "";
    out.push(`${namesOf(g.ps, fam)} (${esc(pw)}) ${g.ps.length > 1 ? "are the parents" : "is the " + esc(one)} of ${namesOf(g.kids, fam)} (${esc(kw)})`);
  });
  const couple = r => /^ex/.test(r) ? "are ex-spouses" : /late/.test(r) ? "were married" : /husband|wife|spouse/.test(r) ? "are married" : /partner|girlfriend|boyfriend/.test(r) ? "are partners" : /fianc|engaged/.test(r) ? "are engaged" : "";
  across.filter(([a, b]) => !isParent(a, b) && !isParent(b, a)).forEach(([a, b]) => { const r = (relWord(a, b) || "").toLowerCase(), w = id => esc(simWorldOf(id).name);
    out.push(couple(r) ? `${namesOf([a], fam)} (${w(a)}) and ${namesOf([b], fam)} (${w(b)}) ${couple(r)}` : `${namesOf([b], fam)} (${w(b)}) is the ${esc(r || "relative")} of ${namesOf([a], fam)} (${w(a)})`); });
  return out;
}
const simA = id => { const href = simLinkTo(id); return href ? `<a href="${href}">${esc(SIMS[id].name)}</a>` : esc(SIMS[id].name); };
function familiesAcrossPage(){
  const fs = crossFamilies();
  let h = acrossHero("#AE5578", "Across the worlds", "Families across the <em>worlds</em>", "Families whose Sims live in more than one world, joined by the family tree (parents, children and partners), not by surname alone.", [[fs.length, fs.length === 1 ? "family" : "families"], [new Set(fs.flatMap(f => f.ws)).size, "worlds"], [fs.reduce((n, f) => n + f.hhs.length, 0), "households"]]);
  if (!fs.length) return h + acrossEmpty("No family on the site lives in more than one world yet.");
  fs.forEach(f => {
    const shown = f.across.slice(0, 6), more = f.across.length - shown.length;
    h += `<section class="block"><div class="block-head"><h2>The <em>${esc(f.name)}</em> family</h2><span class="count">${plural(f.hhs.length, "household")} in ${f.ws.length} worlds</span></div>
      <div class="families">${f.hhs.map(x => `<a class="fam" href="#${x.id}" style="--h:${x.lots[0].hood.color}"><span class="mono">${initial(x.name)}</span><span><span class="rel">${esc(worldLabel(x.world))}</span><b>${esc(x.name)}</b><small>${esc(membersOf(x).length && membersOf(x).length <= 4 ? membersOf(x).map(id => SIMS[id].name.split(" ")[0]).join(", ") : whoCount(membersOf(x)))}</small></span></a>`).join("")}</div>
      ${f.loose.some(id => !f.across.some(([a, b]) => a === id || b === id)) ? `<p class="tr-line">${ic("users")}<span>Also on the family tree: ${f.loose.map(id => `${simA(id)} (${esc(worldLabel(simWorldOf(id)))})`).join(", ")}</span></p>` : ""}
      <p class="tr-line">${ic("network")}<span>${acrossLines(f.across, f.name).join("; ")}.</span></p></section>`;
  });
  return h;
}
// businesses: venues and shops with an owner household (residential rentals left out), by world
let BUSINESSES = null;
const ownedBusinesses = () => BUSINESSES ||= admOwned().filter(l => l.owned && l.hh && !isRental(l));
function businessesPage(){
  const bs = ownedBusinesses(), by = groupsBy([...bs].sort((a, b) => byWorldOrder(a.world, b.world)), l => l.world);
  let h = acrossHero("#B4573E", "Across the worlds", "The <em>businesses</em>", "Shops, restaurants and venues that a household owns and runs, world by world. The name under each one is who runs it.", [[bs.length, bs.length === 1 ? "business" : "businesses"], [by.size, by.size === 1 ? "world" : "worlds"], [new Set(bs.map(l => l.hh)).size, "households"]]);
  if (!bs.length) return h + acrossEmpty("No businesses with owners yet.");
  by.forEach((ls, w) => { h += `<section class="hood" style="--h:${w.color}"><div class="hood-head"><span class="label">${esc(w.name)}</span><div><h2>${esc(w.name)}</h2></div><span class="count">${plural(ls.length, "business", "businesses")}</span></div><div class="listings">${ls.map(listing).join("")}</div></section>`; });
  return h;
}

// ---------- the pages these sections draw (asked by route() in app.js) ----------
function sectionPage(key){
  const T = t => t + " · Jemma’s Sim World";
  const m = /^calendar(?:-(.+))?$/.exec(key);
  if (m) { const w = m[1] ? wById(m[1]) : null; if (m[1] && !w) return null;
    calState.world = w ? w.name : null;
    return {html: protoCal(w), active: "calendar", deep: w && w.deep, title: T(w ? "Calendar · " + w.name : "Calendar")}; }
  const pages = {clubs: [clubsPage, "Clubs"], dynasties: [dynastiesPage, "Dynasties"], organisations: [orgsPage, "University organisations"], families: [familiesAcrossPage, "Families"], businesses: [businessesPage, "Businesses"]};
  if (pages[key]) return {html: pages[key][0](), active: key, title: T(pages[key][1])};
  const st = /^stats(?:-(.+))?$/.exec(key);   // old Stats links open Admin's Progress page
  if (st) { const w = worlds.find(x => x.id === st[1]); if (!redrawing) statsPage(w ? w.name : null); const s = ADM_SECTIONS[1];
    return {html: adminPage(s), active: s.key, title: T("Progress · Admin")}; }
  const s = ADM_SECTIONS.find(x => x.key === key);
  if (s) return {html: adminPage(s), active: s.key, title: T(s.name + " · Admin")};
  return null;
}
// for tools/check_pages.js: these sections' own pages
const SECTION_KEYS = () => ["calendar", ...calWorlds().map(w => "calendar-" + w.id), ...ACROSS_KEYS, ...ADM_SECTIONS.map(s => s.key)];

route();   // again: app.js drew the first page before this file was loaded
