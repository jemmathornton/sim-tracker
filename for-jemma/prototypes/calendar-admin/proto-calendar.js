// Prototype, 23 Oct: the Calendar as part of the rebuild. Two options, plus "Now" (the app as it is).
//  A  One calendar, at the top of the sidebar under Home. A map banner like the world pages: a strip of every world with
//     something on (click one to see only that world, and the banner becomes that world's map and colours). Seasons sit in the
//     banner like a world's neighbourhoods. Every event in the month opens its lot or neighbourhood. World pages get a
//     "What's on" line; neighbourhood and lot pages link their festivals and lot nights to it.
//  B  A calendar for each world, under the world in the sidebar (next to Households), with the world's own map banner.
//     The calendar for the whole save stays, at the top of the sidebar, for an overview.
// Uses the app's own calendar data and code (calEvents, calState, calPill, calWeeks, calHolidays); the month is the app's, with links added.
PROTO.opts = [
  {k: "now", name: "Now", note: "The app today: Calendar at the bottom of the sidebar, small purple banner."},
  {k: "a", name: "A · One calendar", note: "One calendar, under Home. A map banner of the worlds with something on; pick a world and the banner becomes its map. Events link to their places."},
  {k: "b", name: "B · One per world", note: "A calendar under each world, next to Households, with the world’s own map banner. The whole-save calendar stays under Home."},
];
const calWorlds = () => worlds.filter(w => w.owned && w.ready);
const wById = id => calWorlds().find(w => w.id === id);
const calLink = (w, mode = PROTO.mode) => !w ? "#calendar" : mode === "b" ? "#c-" + w.id : "#calendar-" + w.id;
// where an event takes you: its lot, else its neighbourhood, else its world
const evHref = e => { const w = calW(e.w), hid = w && e.hood ? w.id + "-" + slug(e.hood) : null;
  return e.link || (hid && hoodIndex[hid] ? "#n-" + hid : w ? "#w-" + w.id : ""); };
const KIND_WORD = {festival: ["festival", "festivals"], community: ["community event", "community events"], school: ["educational event", "educational events"], lot: ["lot night", "lot nights"]};

// a world's calendar shows every kind held there to start with (its own ticks, kept apart from the whole-save calendar's)
const worldKinds = new Set(Object.keys(CAL_KINDS));
function protoCal(w, perWorld){
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
    h = mapHero(w, `Calendar · ${esc(w.name)}`, `What’s <em>on</em><small class="h1-sub">${esc(sn)} in ${esc(w.name)}</small>`, text, figs, seasons, true);
    if (!perWorld) h = h.replace('<div class="kicker">', `<a class="cal-back" href="#calendar">${ic("arrow")}All worlds</a><div class="kicker">`);
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
    ${`<p class="yr-note">${ic("leaf")}<span><b>Neighbourhood action plan voting</b> every week from Friday 8 am to Monday 6 pm, in every neighbourhood with residents.</span></p>`}</section>`;
  if (perWorld) h += `<a class="stats-link" href="#calendar"><span>${ic("calendar")}Every world at once</span><span class="go">See the calendar for the whole save ${ic("arrow")}</span></a>`;
  return h;
}

// pages the prototype draws
PROTO.page = key => {
  if (PROTO.mode === "now") return null;
  const m = /^calendar(?:-(.+))?$/.exec(key);
  if (m) { const w = m[1] ? wById(m[1]) : null; if (m[1] && !w) return null;
    calState.world = w ? w.name : null;
    return {html: protoCal(w, false), active: "calendar", deep: w && w.deep, title: (w ? "Calendar · " + w.name : "Calendar") + " · Jemma’s Sim World", keepScroll: PROTO.keep}; }
  const c = /^c-(.+)$/.exec(key);
  if (c && PROTO.mode === "b" && wById(c[1])) { const w = wById(c[1]); calState.world = null;
    return {html: protoCal(w, true), active: w.id, deep: w.deep, title: "Calendar · " + w.name + " · Jemma’s Sim World", keepScroll: PROTO.keep}; }
  return null;
};
// seasons, kinds and the school filter redraw the prototype's page, not the app's (caught before the app's own listeners)
const onProtoCal = () => PROTO.mode !== "now" && /^#(calendar|c-)/.test(location.hash);
const redraw = () => { PROTO.keep = true; window.route(); PROTO.keep = false; };
document.addEventListener("click", e => { if (!onProtoCal()) return;
  const s = e.target.closest("[data-cal-season]"), sc = e.target.closest("[data-cal-school]");
  if (s) { e.stopPropagation(); calState.season = s.dataset.calSeason; redraw(); }
  else if (sc) { e.stopPropagation(); calState.school = sc.getAttribute("data-cal-school") || null; redraw(); } }, true);
document.addEventListener("change", e => { if (!onProtoCal()) return; const k = e.target.dataset && e.target.dataset.calKind; if (!k) return;
  e.stopPropagation(); const set = /^#(calendar-|c-)/.test(location.hash) ? worldKinds : calState.kinds; e.target.checked ? set.add(k) : set.delete(k); if (set === calState.kinds) calKeep(); redraw(); }, true);

// the sidebar: Calendar moves up under Home (A and B); B adds a Calendar under the open world, next to Households
PROTO.navHook = (active, key, ctx, nav) => {
  if (PROTO.mode === "now") return;
  const bottom = nav.querySelector(".stats-nav"), cal = bottom && bottom.querySelector('a[href="#calendar"]');
  if (cal) { cal.remove(); const homeGroup = nav.querySelector(".nav-group"); homeGroup.insertAdjacentHTML("beforeend", `<a href="#calendar" class="${active === "calendar" ? "on" : ""}">${ic("calendar")}Calendar</a>`); }
  if (PROTO.mode === "b") { const w = wById(active); const hh = w && nav.querySelector(`.subnav a.hh-link[href="#f-${w.id}"]`);
    if (hh) { let after = hh.nextElementSibling && hh.nextElementSibling.classList.contains("lotnav") ? hh.nextElementSibling : hh;
      after.insertAdjacentHTML("afterend", `<a class="hh-link ${key === "c-" + w.id ? "cur" : ""}" href="#c-${w.id}">${ic("calendar")}Calendar</a>`); } }
};

// links from the other pages (A and B)
const whatsOnLine = w => { const evs = calEvents().filter(e => e.w === w.name), names = [...new Set(evs.filter(e => e.kind === "festival").map(e => e.name))];
  const others = new Set(evs.filter(e => e.kind !== "festival").map(e => e.name + "|" + (e.where || ""))).size;
  const txt = names.length ? names.map(n => `<b>${esc(n)}</b>`).join(", ") + (others ? ` and ${others} regular ${others === 1 ? "event" : "events"}` : "")
    : others ? `${others} regular ${others === 1 ? "event" : "events"} (no festivals)` : "the save’s holidays (no festivals or regular events here)";
  return `<div class="wx-whatson">${ic("party")}<b>What’s on:</b><span>${txt}.</span><a href="${calLink(w)}">${esc(w.name)}’s calendar ${ic("arrow")}</a></div>`; };
PROTO.after = (key, view) => {
  if (PROTO.mode === "now") return;
  const wm = /^w-(.+)$/.exec(key), w = wm && wById(wm[1]);
  if (w) { const strip = view.querySelector(".world-strip"); if (strip) strip.insertAdjacentHTML("beforeend", whatsOnLine(w));
    const sl = view.querySelector(".stats-link"); if (sl) sl.remove(); }   // "Progress, lot by lot" goes with Stats (see the admin prototype)
  const hm = /^n-(.+)$/.exec(key), x = hm && hoodIndex[hm[1]];
  if (x && wById(x.world.id)) view.querySelectorAll(".hood-extras .home-to").forEach(p => { if (!/Festivals and events/.test(p.textContent)) return;
    p.querySelectorAll("b").forEach(b => b.outerHTML = `<a class="fest-link" href="${calLink(x.world)}">${b.outerHTML}</a>`); });
  const l = lotIndex[key];
  if (l && wById(l.world.id)) { const nights = calEvents().filter(e => e.kind === "lot" && e.link === "#" + l.id), dl = view.querySelector("dl.facts");
    if (nights.length && dl) dl.insertAdjacentHTML("beforeend", `<div><dt>Lot nights</dt><dd>${nights.map(e => `${esc(e.name)}, ${e.days.map(d => CAL_DAY_NAMES[d]).join(" and ")} ${esc(e.time)}`).join("; ")} · <a href="${calLink(l.world)}">calendar</a></dd></div>`); }
};
protoStart();
