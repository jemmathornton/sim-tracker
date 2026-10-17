// Prototype, 17 Oct: a save-wide "What's on" page, three ways. Reads the site's own data (site/js/data.js) and icons, and events.js.
// Changes nothing.
const SITE = "../../../site/";
const PIC = new URL(SITE, location.href).href;   // pictures in CSS variables need full addresses
const ic = n => (ICONS[n] || "").replace("<svg ", '<svg class="i" aria-hidden="true" ');
// as on the site: curly apostrophes in shown text (’n’ and ’Round are apostrophes, not opening quotes); ids and links stay straight
const curly = s => String(s ?? "").replace(/(^|[\s(])'(?=n'|Round\b|til\b|tis\b)/g, "$1’").replace(/(^|[\s(\[“"—-])'/g, "$1‘").replace(/'/g, "’");
const esc = s => curly(s).replace(/[&<>"]/g, c => ({"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;"}[c]));
const slug = s => String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const DAY_NAMES = {Mon: "Monday", Tue: "Tuesday", Wed: "Wednesday", Thu: "Thursday", Fri: "Friday", Sat: "Saturday", Sun: "Sunday"};
const OFTEN = {week: "every week", fortnight: "every other week", third: "every third week"};
const KINDS = {festival: "Festivals and world events", school: "Uni and high school", lot: "Lot nights (lounges, thrift stores)"};

const WORLDS = DATA.worlds.filter(w => w.owned);
const W = Object.fromEntries(WORLDS.map(w => [w.name, w]));
WORLDS.forEach(w => w.id = slug(w.name));
const colour = name => (W[name] || {}).color || "#888";   // the world colour (its "glow" is for dark backgrounds)
// text on a world-coloured chip: dark on the light colours (Sulani's yellow), white on the rest
const onColour = hex => { const n = parseInt(String(hex).slice(1), 16), [r, g, b] = [n >> 16 & 255, n >> 8 & 255, n & 255];
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.62 ? "#1A1F1C" : "#fff"; };
const hues = name => `--h:${colour(name)};--on:${onColour(colour(name))}`;
const worldLink = name => SITE + "index.html#w-" + slug(name);
const hoodLink = (w, h) => SITE + "index.html#n-" + slug(w) + "-" + slug(h);
// the site's name rule: her chosen spelling, then her Gallery title, then her own name (unless just "?"), then the in-game name
const lotName = (w, l) => { const mine = l.mine && l.mine.trim() && !/^\?+$/.test(l.mine.trim()) ? l.mine.trim() : null;
  return DATA.nameFix[w.name + "|" + l.lot] || l.gallery?.title || mine || l.lot; };

// lot nights, made from her lots
const ALL = EVENTS.map(e => ({...e}));
WORLDS.forEach(w => w.hoods.forEach(h => h.lots.forEach(l => LOT_EVENTS.forEach(t => {
  if (!t.type.test(l.type || "") || (t.trait && !(l.traits || []).includes(t.trait))) return;
  const name = lotName(w, l), combo = /\//.test(l.type);
  ALL.push({w: w.name, hood: h.name, name: t.name, days: t.days, time: t.time, start: t.start, kind: "lot", where: name, lotType: l.type.split("/")[0], trait: t.trait,
    link: SITE + "index.html#l-" + slug(w.name) + "--" + slug(l.lot),
    often: /^Lounge/.test(l.type) ? "lounge" : "week", built: l.built === true, pack: t.pack,
    note: [!l.built ? "not built yet" : "", combo ? `if it’s a ${l.type.split("/")[0]} in game` : ""].filter(Boolean).join("; "),
    needs: {txt: `${l.type.split("/")[0]}${t.trait ? " with " + t.trait : ""}: ${name}`, ok: true}});
}))));
OFTEN.lounge = "the game picks each week";
ALL.forEach((e, i) => { e.i = i; e.order = WORLDS.findIndex(w => w.name === e.w); });

// ---------- shared bits ----------
const often = e => OFTEN[e.often] || e.often || "";
const place = e => e.where || e.hood || "";
const dot = (...parts) => parts.filter(Boolean).join(" · ");
const tag = e => e.often === "fortnight" ? `<span class="often alt">${ic("repeat")}every other week</span>`
  : e.often === "third" ? `<span class="often alt">${ic("repeat")}every third week</span>` : "";
const star = e => e.star ? `<sup title="The game never shows this name; it’s made from the game’s settings">*</sup>` : "";
const pill = (e, showWorld = true) => `<div class="ev k-${e.kind} o-${slug(e.often)}${e.built === false ? " unbuilt" : ""}" style="${e.agg ? "--h:#9A7B3A" : hues(e.w)}">
  <span class="t">${esc(e.time)}</span><b>${esc(e.name)}${star(e)}</b>
  <small>${dot(showWorld && !e.agg ? `<a href="${worldLink(e.w)}">${esc(e.w)}</a>` : "", esc(place(e)))}${e.kind === "lot" && !e.agg && e.note ? ` <em>(${esc(e.note)})</em>` : ""}</small>${tag(e)}</div>`;
const dayChips = e => e.days ? `<span class="days">${DAYS.map(d => `<i class="${e.days.includes(d) ? "on" : ""}">${d.slice(0, 2)}</i>`).join("")}</span>`
  : `<span class="days special">${ic(e.special === "newmoon" || e.special === "fullmoon" ? "moon" : e.special === "daily" ? "repeat" : "calendar")}${esc(e.special === "daily" ? "Every day" : e.special === "newmoon" ? "New moon" : e.special === "fullmoon" ? "Full moon" : "No fixed day")}</span>`;

const state = {mode: "all", kinds: new Set(["festival"]), world: null, cWorld: "San Myshuno"};
try { const s = JSON.parse(localStorage.getItem("cal-proto") || "{}"); if (s.mode) state.mode = s.mode; if (s.kinds) state.kinds = new Set(s.kinds); if (s.cWorld && W[s.cWorld]) state.cWorld = s.cWorld; } catch (e) {}
{ const q = new URLSearchParams(location.search);   // e.g. ?mode=c&world=Ravenwood&kinds=festival,school,lot
  if (["all", "a", "b", "c"].includes(q.get("mode"))) state.mode = q.get("mode");
  if (W[q.get("world")]) state.cWorld = q.get("world");
  if (q.get("kinds")) state.kinds = new Set(q.get("kinds").split(",").filter(k => KINDS[k])); }
const keep = () => { try { localStorage.setItem("cal-proto", JSON.stringify({mode: state.mode, kinds: [...state.kinds], cWorld: state.cWorld})); } catch (e) {} };

// ---------- A: a week calendar, and the year ----------
function optionA(){
  const picked = ALL.filter(e => state.kinds.has(e.kind) && (!state.world || e.w === state.world)), groups = {};
  // lot nights: one pill per night, naming every lot that has it
  picked.filter(e => e.kind === "lot").forEach(e => (groups[e.name + "|" + e.time] ||= []).push(e));
  const shown = picked.filter(e => e.kind !== "lot").concat(Object.values(groups).map(list => ({...list[0], agg: true, built: list.some(e => e.built), order: 99,
    where: `${list[0].lotType}${list.length > 1 ? "s" : ""}: ${list.map(e => e.where + (e.built ? "" : " (not built)")).join(", ")}`})));
  const worldsWith = WORLDS.filter(w => ALL.some(e => e.w === w.name && state.kinds.has(e.kind)));
  const byStart = (a, b) => a.start - b.start || a.order - b.order;
  const daily = shown.filter(e => e.special === "daily").sort(byStart), loose = shown.filter(e => e.special && e.special !== "daily").sort(byStart);
  let h = `<div class="opt-head"><span class="no">A</span><div><h2>A week <em>calendar</em></h2><p>Every regular event in your owned worlds on one week, Monday to Sunday, then the year’s holidays. Faint outlines are every other week; which week depends on your save.</p></div></div>
  <div class="a-filters"><div class="kinds">${Object.entries(KINDS).map(([k, t]) => `<label><input type="checkbox" data-kind="${k}" ${state.kinds.has(k) ? "checked" : ""}> ${esc(t)}</label>`).join("")}</div>
  <div class="wchips"><button type="button" class="wchip ${state.world ? "" : "on"}" data-world="">All worlds</button>${worldsWith.map(w => `<button type="button" class="wchip ${state.world === w.name ? "on" : ""}" data-world="${esc(w.name)}" style="${hues(w.name)}"><i></i>${esc(w.name)}</button>`).join("")}</div></div>`;
  if (daily.length) h += `<div class="band"><span class="band-l">${ic("repeat")}Every day</span><div class="band-evs">${daily.map(e => pill(e)).join("")}</div></div>`;
  h += `<div class="week">${DAYS.map(d => { const evs = shown.filter(e => e.days && e.days.includes(d)).sort(byStart);
    return `<div class="day"><div class="day-h"><b>${DAY_NAMES[d]}</b><small>${evs.length || ""}</small></div>${evs.map(e => pill(e)).join("") || `<p class="none">Nothing on</p>`}</div>`; }).join("")}</div>`;
  if (loose.length) h += `<div class="band"><span class="band-l">${ic("moon")}No fixed day</span><div class="band-evs">${loose.map(e => pill(e).replace('<span class="t">', `<span class="t">${esc(often(e))} · `)).join("")}</div></div>`;
  h += `<div class="key"><span><i class="k1"></i>every week</span><span><i class="k2"></i>every other week</span><span><i class="k3"></i>every third week</span><span><sup>*</sup> the game never shows this name</span><span>Times are the game’s own; “about” where it shows none.</span></div>`;
  // the year
  h += `<div class="year"><h3>The <em>year</em> <small>in every world, with the game’s one-week seasons</small></h3><div class="seasons">${SEASONS.map(s => `<div class="season s-${s.season.toLowerCase()}">
      <div class="s-h">${ic(s.icon)}<b>${s.season}</b></div>
      <div class="mini">${DAYS.map(d => { const ho = s.holidays.find(x => x.day === d); return `<i class="${ho ? "on" : ""}" title="${ho ? esc(ho.name) : ""}">${d.slice(0, 1)}</i>`; }).join("")}</div>
      ${s.holidays.length ? s.holidays.map(x => `<p><b>${esc(x.name)}</b> ${DAY_NAMES[x.day]}${x.off ? ", a day off" : ""}</p>`).join("") : `<p class="none">No holiday</p>`}</div>`).join("")}</div>
    <p class="yr-note">${ic("clock")}Holidays run from 6 am to 2 am. With two- or four-week seasons the game moves them to other days.</p>
    <p class="yr-note">${ic("sparkle")}<span><b>Surprise holidays</b>, a few days’ notice, at random: ${SURPRISE.map(([d, n]) => `${esc(n)} (${d})`).join(", ")}.</span></p>
    <p class="yr-note">${ic("leaf")}<span><b>Neighbourhood action plan voting</b> every week from Friday 8 am to Monday 6 pm, in every neighbourhood with residents.</span></p></div>`;
  return h;
}

// ---------- B: a list by world ----------
function optionB(){
  let h = `<div class="opt-head"><span class="no">B</span><div><h2>By <em>world</em></h2><p>The same events as a list, world by world, with what each needs from your plan.</p></div></div>`;
  h += `<div class="b-world" style="--h:var(--brass)"><div class="b-title"><span>${ic("calendar")}</span><h3>Every world</h3><small>Seasons, Eco Lifestyle</small></div>
    <ul class="b-list">${SEASONS.filter(s => s.holidays.length).flatMap(s => s.holidays.map(x => `<li><span class="days">${DAYS.map(d => `<i class="${d === x.day ? "on" : ""}">${d.slice(0, 2)}</i>`).join("")}</span><div><b>${esc(x.name)}</b> <small>${s.season}, 6 am–2 am${x.off ? ", a day off" : ""}</small></div></li>`)).join("")}
    <li><span class="days special">${ic("sparkle")}At random</span><div><b>Surprise holidays</b> <small>${SURPRISE.length} of them, each on its own weekday</small></div></li>
    <li><span class="days">${DAYS.map(d => `<i class="${["Fri", "Sat", "Sun", "Mon"].includes(d) ? "on" : ""}">${d.slice(0, 2)}</i>`).join("")}</span><div><b>N.A.P. voting</b> <small>Friday 8 am to Monday 6 pm, every week</small></div></li></ul></div>`;
  WORLDS.forEach(w => {
    const mine = ALL.filter(e => e.w === w.name);
    if (!mine.length) return;
    // one row per event (the same event on other days or in the other neighbourhood joins it), and one row per lot for its nights
    const evs = [], byName = {}, lots = {};
    mine.filter(e => e.kind !== "lot").forEach(e => (byName[e.name] ||= []).push(e));
    Object.values(byName).forEach(list => { const f = list[0];
      if (list.length === 1 || list.some(e => !e.days)) return evs.push(...list);
      const same = list.every(e => place(e) === place(f));
      evs.push({...f, days: DAYS.filter(d => list.some(e => e.days.includes(d))), start: Math.min(...list.map(e => e.start)),
        what: list.map(e => dot(`${e.days.join(", ")} ${e.time}`, same ? "" : place(e))).join("; ") + (same ? " · " + place(f) : "")}); });
    mine.filter(e => e.kind === "lot").forEach(e => (lots[e.where] ||= []).push(e));
    Object.entries(lots).forEach(([lot, list]) => { const f = list[0], traits = [...new Set(list.map(e => e.trait).filter(Boolean))];
      evs.push({w: w.name, kind: "lot", name: lot, link: f.link, built: f.built, start: Math.min(...list.map(e => e.start)), days: DAYS.filter(d => list.some(e => e.days.includes(d))),
        what: `${f.lotType} nights: ${list.map(e => `${e.name} ${e.days.join(", ")}, ${e.time}`).join("; ")}`, often: f.often, note: f.note,
        needs: {txt: `${f.lotType}${traits.length ? " with " + traits.join(" and ") : ""}`, ok: true}}); });
    evs.sort((a, b) => (a.days ? DAYS.indexOf(a.days[0]) : 9) - (b.days ? DAYS.indexOf(b.days[0]) : 9) || a.start - b.start);
    const lost = LOST_LOUNGES.filter(x => x.w === w.name), fest = evs.filter(e => e.kind === "festival" && !e.needs).length;
    h += `<div class="b-world" style="${hues(w.name)}"><div class="b-title"><i></i><h3><a href="${worldLink(w.name)}">${esc(w.name)}</a></h3><small>${esc(w.pack)} · ${mine.length} ${mine.length === 1 ? "event" : "events"}</small></div>
      <ul class="b-list">${evs.map(e => `<li class="${e.built === false ? "unbuilt" : ""}">${dayChips(e)}<div><b>${e.link ? `<a href="${e.link}">${esc(e.name)}</a>` : esc(e.name)}${star(e)}</b> <small>${e.what ? dot(esc(e.what), e.often !== "week" ? esc(often(e)) : "", esc(e.note)) :
        dot(esc(e.time), e.hood && !e.where ? `<a href="${hoodLink(w.name, e.hood)}">${esc(e.hood)}</a>` : esc(place(e)), e.often !== "week" ? esc(often(e)) : "", esc(e.note))}</small>
        ${e.needs ? `<span class="need ${e.needs.ok === true ? "ok" : e.needs.ok === false ? "bad" : "ask"}">${ic(e.needs.ok === true ? "check" : "alert")}${esc(e.needs.txt)}</span>` : ""}</div></li>`).join("")}</ul>
      ${fest ? `<p class="b-note">${ic("pin")}${fest === 1 ? "It happens" : "They happen"} in the open world: ${fest === 1 ? "it doesn’t need" : "they don’t need"} a lot.</p>` : ""}
      ${lost.map(x => `<p class="b-note warn">${ic("alert")}The game’s lounge, ${esc(x.lot)}, is ${esc(x.now)} in your plan, so no lounge nights here.</p>`).join("")}</div>`;
  });
  const quiet = WORLDS.filter(w => !ALL.some(e => e.w === w.name));
  h += `<p class="b-quiet"><b>Nothing scheduled:</b> ${quiet.map(w => esc(w.name)).join(", ")}. Only holidays and N.A.P. voting there.</p>`;
  return h;
}

// ---------- C: a small box on a world page ----------
function optionC(){
  const withEvents = WORLDS.filter(w => ALL.some(e => e.w === w.name)), w = W[state.cWorld] || withEvents[0], evs = ALL.filter(e => e.w === w.name);
  const byStart = (a, b) => a.start - b.start;
  let h = `<div class="opt-head"><span class="no">C</span><div><h2>On each <em>world page</em></h2><p>A small box on the world page, below the neighbourhoods and above the weather. Pick a world to see it with its own events.</p></div></div>
    <label class="c-pick">World <select id="cWorld">${withEvents.map(x => `<option ${x === w ? "selected" : ""}>${esc(x.name)}</option>`).join("")}</select></label>`;
  h += `<div class="c-page" style="${hues(w.name)};--deep:${w.deep[0]};--deep-2:${w.deep[1]}">
    <div class="c-hero" style="--map:url('${PIC + w.map}');--y:${w.heroY ?? 40}%"><span class="label">${esc(w.pack)}</span><h3>${esc(w.name)}</h3></div>
    <div class="c-ghost">${ic("grid")}Neighbourhoods (as now)</div>
    <section class="block c-box"><div class="block-head"><h2>What’s <em>on</em></h2><span class="count">from the game</span></div><div class="c-days">`;
  DAYS.forEach(d => { const de = evs.filter(e => e.days && e.days.includes(d)).sort(byStart); if (!de.length) return;
    h += `<div class="c-day"><b>${DAY_NAMES[d]}</b><ul>${de.map(e => `<li class="${e.built === false ? "unbuilt" : ""}"><span>${esc(e.name)}${star(e)}</span> <small>${dot(esc(e.time), e.hood && !e.where ? `<a href="${hoodLink(w.name, e.hood)}">${esc(e.hood)}</a>` : e.link ? `<a href="${e.link}">${esc(place(e))}</a>` : esc(place(e)),
      e.often === "fortnight" || e.often === "third" ? esc(often(e)) : "", e.kind === "lot" ? esc(e.note) : "")}</small></li>`).join("")}</ul></div>`; });
  const loose = evs.filter(e => e.special);
  if (loose.length) h += `<div class="c-day"><b>Other times</b><ul>${loose.map(e => `<li><span>${esc(e.name)}</span> <small>${dot(esc(often(e)) + ", " + esc(e.time), esc(place(e)))}</small></li>`).join("")}</ul></div>`;
  h += `</div><p class="c-foot">${ic("calendar")}<span>Plus the holidays every world shares: Love Day, Harvestfest, Winterfest and New Year’s Eve. <a href="#" data-mode="a">See the whole save</a></span></p></section>`;
  // what is already on the page, for placing it
  if (w.weather || w.highlights) h += `<section class="block c-after"><div class="block-head"><h2>Weather and <em>highlights</em></h2><span class="count">as now</span></div>
    ${w.weather ? `<p class="home-to world-weather">${ic("weather")}<span>${esc(w.weather)}</span></p>` : ""}
    ${w.highlights ? `<div class="highlights">${w.highlights.map(x => `<div>${ic("landmark")}<b>${esc(x.name)}</b><span>${esc(x.text)}</span></div>`).join("")}</div>` : ""}</section>`;
  h += `</div>`;
  // and on a neighbourhood card: days next to the festival names
  const hood = w.hoods.find(x => (x.festivals || []).length && evs.some(e => e.hood === x.name && e.days));
  if (hood) { const he = evs.filter(e => e.hood === hood.name && e.days), seen = new Set();
    const withDays = he.filter(e => !seen.has(e.name) && seen.add(e.name)).map(e => `<b>${esc(e.name)}</b> (${e.days.map(d => DAY_NAMES[d]).join(", ")}${e.often === "fortnight" ? ", every other week" : ""})`);
    h += `<div class="c-card" style="--h:${hood.color || colour(w.name)}"><p class="label">And on the neighbourhood card: ${esc(hood.name)}</p>
      <div class="c-card-row"><div><small>Now</small><p class="home-to">${ic("party")}<span>Festivals and events: ${hood.festivals.slice(0, 3).map(n => `<b>${esc(n)}</b>`).join(", ")}${hood.festivals.length > 3 ? ` and ${hood.festivals.length - 3} more` : ""}</span></p></div>
      <div><small>With days</small><p class="home-to">${ic("party")}<span>${withDays.slice(0, 3).join(", ")}${withDays.length > 3 ? ` and ${withDays.length - 3} more` : ""}</span></p></div></div></div>`; }
  return h;
}

// ---------- page ----------
function render(){
  const el = document.getElementById("opts"), m = state.mode;
  document.querySelectorAll(".seg button").forEach(b => b.classList.toggle("on", b.dataset.mode === m));
  el.className = "opts mode-" + m;
  el.innerHTML = (m === "all" || m === "a" ? `<section class="opt opt-a">${optionA()}</section>` : "")
    + (m === "all" ? `<div class="opts-bc"><section class="opt opt-b">${optionB()}</section><section class="opt opt-c">${optionC()}</section></div>` : "")
    + (m === "b" ? `<section class="opt opt-b solo-opt">${optionB()}</section>` : "")
    + (m === "c" ? `<section class="opt opt-c solo-opt">${optionC()}</section>` : "");
  keep();
}
document.addEventListener("click", e => {
  const s = e.target.closest(".seg button, [data-mode]"); if (s) { e.preventDefault(); state.mode = s.dataset.mode; render(); if (s.closest(".c-foot")) document.getElementById("opts").scrollIntoView({behavior: "smooth"}); return; }
  const wc = e.target.closest(".wchip"); if (wc) { state.world = wc.dataset.world && state.world !== wc.dataset.world ? wc.dataset.world : null; render(); }
});
document.addEventListener("change", e => {
  if (e.target.dataset.kind) { const k = e.target.dataset.kind; e.target.checked ? state.kinds.add(k) : state.kinds.delete(k); if (!state.kinds.size) state.kinds.add("festival"); state.world = null; render(); }
  if (e.target.id === "cWorld") { state.cWorld = e.target.value; render(); }
});
render();
