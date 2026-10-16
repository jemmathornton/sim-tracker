// Jemma's Sim World: the page code. Everything is drawn from DATA (js/data.js, built by tools/build.py).
const FAMILY_LINKS = DATA.familyLinks;
const TENANTS = DATA.tenants;
const NAME_FIX = DATA.nameFix;
const ic = n => ICONS[n].replace("<svg ", '<svg class="i" aria-hidden="true" ');
// shown text uses curly apostrophes and single quotes (12 Oct); ids and links are untouched
const curly = s => String(s ?? "").replace(/(^|[\s(\[“"—-])'/g, "$1‘").replace(/'/g, "’");
const esc = s => curly(s).replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const slug = s => String(s).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/&/g,"and").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
// neighbourhood colours: muted jewel tones
const HOOD_COLORS = ["#B4573E","#6A5A9E","#2F6E9C","#B98A2E","#3C8459","#AE5578","#2B8A86","#8C7A3A"];

const worlds = DATA.worlds, lotIndex = {}, hhIndex = {}, hoodIndex = {};
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
        const hh = w.households[k] ||= {name: b, family: b, unsure: /\?/.test(l.who), lots: [], world: w, id: "h-" + w.id + "--" + k, sims: extra.sims || [], links: (extra.links || []).slice(), source: extra.source};
        hh.lots.push(l); hhIndex[hh.id] = hh; l.hh = hh; l.owned = true; }
      else if (l.who) {
        const b = base(l.who); seen[b] = (seen[b] || 0) + 1;
        const name = total[b] > 1 ? `${b} ${seen[b]}` : b, k = slug(name);
        const extra = (DATA.households[w.name] || {})[name] || {};
        const hh = w.households[k] ||= {name, family:b, unsure:/\?/.test(l.who), lots:[], world:w, id:"h-"+w.id+"--"+k, sims: extra.sims || [], links: (extra.links || []).slice(), source: extra.source};
        hh.lots.push(l); hhIndex[hh.id] = hh; l.hh = hh;
      }
    }); });
  // a family business joins the family's household (their first home), marked as owned rather than lived in
  biz.forEach(l => { const b = base(l.who), hh = Object.values(w.households).find(x => x.family === b); if (hh) { hh.lots.push(l); l.hh = hh; l.owned = true; } });
  // tenants renting a unit (13 Oct): their own household, living on the owners' lot
  w.hoods.forEach(h => h.lots.forEach(l => (TENANTS[w.name + "|" + l.lot] || []).forEach(t => { const k = slug(t.name);
    const hh = w.households[k] ||= {name: t.name, family: t.name, unsure: false, lots: [], world: w, id: "h-" + w.id + "--" + k, sims: [], links: [], note: t.note, tenantOf: l};
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
worlds.forEach(w => Object.values(w.households).forEach(hh => hh.sims.forEach(sm => { sm.hh = hh; sm.id = hh.id + "--" + slug(sm.name); simIndex[sm.name] = sm; })));

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
const titleWord = name => { const p = esc(name).split(" "); return p.length > 1 ? p.slice(0,-1).join(" ") + " <em>" + p.at(-1) + "</em>" : "<em>" + p[0] + "</em>"; };

// sidebar follows where things live: world → neighbourhood → lot → household → Sims
let navArgs = null;   // the page the sidebar belongs to, so it can come back after a search
function renderNav(active, key, ctx){
  navArgs = [active, key, ctx];
  const nav = document.getElementById("nav");
  const owned = worlds.filter(w => w.owned), notOwned = worlds.filter(w => !w.owned);
  let h = `<div class="nav-group"><a href="#home" class="${active==="home"?"on":""}">${ic("home")}Home</a></div><div class="nav-group"><div class="label">Worlds</div>`;
  // not-owned worlds open too (16 Oct, her request), still greyed in the "Not owned" group
  const navWorld = (w, grey) => { let h = "";
    const on = active === w.id, open = w.ready || grey;
    h += open ? `<a href="#w-${w.id}" class="${grey?"soon open ":""}${on?"on":""}" style="--c:${w.glow||w.color}"><span class="dot"></span>${esc(w.name)}</a>`
      : `<a class="soon" aria-disabled="true" style="--c:${w.glow||w.color}"><span class="dot"></span>${esc(w.name)}<span class="pct">soon</span></a>`;
    if (open && on) {
      h += `<div class="subnav">${w.hoods.map(x => {
        let t = `<a href="#n-${x.id}" class="${ctx.hood===x ? (ctx.lot ? "path" : "cur") : ""}">${esc(x.name)}</a>`;
        const seenB = new Set();
        if (ctx.hood === x) t += `<div class="lotnav">${x.lots.map(l => {
          let pre = "";
          if (l.building) { if (seenB.has(l.building)) return ""; seenB.add(l.building);
            const b = l.building, inB = b.units.includes(ctx.lot);
            return `<span class="bld-label ${inB?"path":""}">${ic("home")}${esc(b.name)}</span><div class="lotnav">${b.units.map(u2 => { let v = `<a href="#${u2.id}" class="${ctx.lot===u2 ? (ctx.hh ? "path" : "cur") : ""}">${esc(u2.name)}</a>`;
              if (ctx.lot === u2 && u2.hh) v += `<div class="lotnav"><a href="#${u2.hh.id}" class="fam-link ${ctx.hh===u2.hh ? "cur" : ""}">${ic("users")}${esc(u2.hh.name)}</a></div>`; return v; }).join("")}</div>`; }
          let u = pre + `<a href="#${l.id}" class="${ctx.lot===l ? (ctx.hh ? "path" : "cur") : ""}">${esc(l.name)}</a>`;
          if (ctx.lot === l && l.hh) u += `<div class="lotnav"><a href="#${l.hh.id}" class="fam-link ${ctx.hh===l.hh ? "cur" : ""}">${ic("users")}${esc(l.hh.name)}</a>${ctx.hh===l.hh && l.hh.sims.length ? `<div class="lotnav">${l.hh.sims.map(sm => `<a href="#${l.hh.id}" data-sim="${sm.id}">${esc(sm.name)}</a>`).join("")}</div>` : ""}</div>`;
          return u; }).join("")}</div>`;
        return t; }).join("")}<a class="hh-link ${key==="f-"+w.id?"cur":""}" href="#f-${w.id}">${ic("users")}Households</a></div>`;
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
      x.sims.forEach(sm => add("Sim", sm.name, x.name + " household", "#" + x.id, [], sm.id)); });
  });
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
  if (!w.owned) return `<a class="wt off notown" href="#w-${w.id}" style="--c:${w.glow||w.color}">${inner}</a>`;   // greyed, but opens (16 Oct)
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
// ---------- rental layout trial (16 Oct): a small switch on neighbourhood and lot pages with rentals lets her compare layout 1 (units listed) and 2 (badge + unit count) ----------
const RV_KEY = "jsw-rental-layout";
let RV = (() => { try { return localStorage.getItem(RV_KEY) || "1"; } catch (e) { return "1"; } })();   // 3-way trial: 1, 2 or u
const rvOf = l => RV;
const isRental = l => /residential rental/i.test(l.type || "");
const unitCount = l => { const m = /\((\d+)\)/.exec(l.type || ""); return isRental(l) && m ? +m[1] : null; };
// who lives in which unit isn't decided yet: the plan's household fills the first unit, tenants the next, the rest show as empty
const rentalUnits = l => { const n = unitCount(l), who = [];
  if (l.hh) who.push({hh: l.hh, role: l.tenants || /\sown\??$/i.test(l.who || "") ? "owners" : ""});
  (l.tenants || []).forEach(t => who.push({hh: t, role: "tenant"}));
  return Array.from({length: n}, (_, i) => who[i] || null); };
function rentalCard(l){
  const units = rentalUnits(l), cover = l.photos[0], lived = units.filter(Boolean).length;
  return `<div class="listing bcard" style="--h:${l.hood.color}"><div class="photo ${cover?"shot":""}" ${cover?`style="--img:url('${cover.thumb}')"`:""}>${cover ? "" : lotArt(l)}<span class="type">Rental</span><span class="size">${units.length} units</span></div>
    <h3><a href="#${l.id}">${esc(l.name)}</a></h3>
    <ul class="units">${units.map((u, i) => `<li><a href="#${u ? u.hh.id : l.id}"><span class="unit-no">${i + 1}</span><span class="unit-who">${u ? `${ic("users")}<b>${esc(u.hh.name)}</b>${u.role ? ` <small>${u.role}</small>` : ""}` : `<i>Empty</i>`}</span><span class="status"></span></a></li>`).join("")}</ul>
    <div class="meta"><span>${ic("home")}<b>${lived} of ${units.length}</b> units lived in</span></div></div>`;
}

// layout "u": every unit its own card, with its own picture (photos named flat-N or unit-N) or a placeholder
const unitPhotos = l => { const m = {}; l.photos.forEach(p => { const r = /(?:flat|unit)[-_ ]?(\d+)/i.exec(p.thumb || p.src || ""); if (r) (m[+r[1]] ||= []).push(p); }); return m; };
function unitCards(l){
  const units = rentalUnits(l), ph = unitPhotos(l), word = /flat/i.test(Object.values(l.photos).map(p => p.thumb).join(" ")) ? "Flat" : "Unit";
  return units.map((u, i) => { const p = (ph[i + 1] || [])[0];
    return `<a class="listing" href="#${u ? u.hh.id : l.id}" style="--h:${l.hood.color}"><div class="photo ${p?"shot":""}" ${p?`style="--img:url('${p.thumb}')"`:""}>${p ? "" : `<span class="apt-art">${ic("home")}</span>`}<span class="type">${word} ${i + 1}</span>${p ? "" : `<span class="size">No photo yet</span>`}</div>
      <h3>${esc(l.name)} · ${word.toLowerCase()} ${i + 1}</h3><div class="meta"><span>${ic("users")}${u ? `<b>${esc(u.hh.name)}</b>${u.role ? ` (${u.role})` : ""}` : "Empty"}</span></div></a>`; }).join("");
}

// layout "4": an ordinary card with the front picture, unit bubbles on top (like the lot circles on neighbourhood cards), and a plain landlord/units line
function rentalBubbles(l){
  const units = rentalUnits(l), ph = unitPhotos(l);
  return units.map((u, i) => { const p = (ph[i + 1] || [])[0], lab = `Unit ${i + 1}: ${u ? u.hh.name + (u.role ? ` (${u.role === "owners" ? "landlord" : u.role})` : "") : "Empty"}`, to = u ? u.hh.id : l.id;
    return p ? `<i data-lot-link="${to}" aria-label="${esc(lab)}" data-name="${esc(lab)}" class="${u && u.role === "tenant" ? "tenant" : ""}" style="background-image:url('${p.thumb}')"></i>`
      : `<i class="nb-none unit-no-pic ${u && u.role === "tenant" ? "tenant" : ""}" data-lot-link="${to}" aria-label="${esc(lab)}" data-name="${esc(lab)}"><b>${i + 1}</b></i>`; }).join("");
}
const rentalMeta = l => { const units = rentalUnits(l), owner = units.find(u => u && u.role === "owners"), tenants = units.filter(u => u && u.role === "tenant").length, lived = units.filter(Boolean).length;
  const lead = owner ? `<span>${ic("users")}<b>${esc(owner.hh.name)}</b> (landlord)</span>` : l.hh ? `<span>${ic("users")}<b>${esc(l.hh.name)}</b></span>` : "";
  return `${lead}<span>${ic("home")}${units.length - lived ? `${lived} let, ${units.length - lived} free` : "All let"}${tenants ? ` · ${tenants} ${tenants === 1 ? "tenant" : "tenants"}` : ""}</span>`; };

// layout "5": front picture, then a strip of small unit squares under it (gold dot = landlord's own unit, coloured ring = a tenant, faded = free)
const roleOf = u => "r-" + (u ? (u.role === "owners" ? "owner" : u.role === "tenant" ? "tenant" : "lives") : "empty");
const roleTxt = u => u ? (u.role === "owners" ? "Landlord" : u.role === "tenant" ? "Tenant" : "Lives here") : "Free";
function rentalStrip(l){
  const units = rentalUnits(l), ph = unitPhotos(l);
  return units.map((u, i) => { const p = (ph[i + 1] || [])[0];
    return `<i data-lot-link="${u ? u.hh.id : l.id}" class="${roleOf(u)}" title="Unit ${i + 1}: ${esc(u ? u.hh.name : "")}${u ? " · " : ""}${roleTxt(u)}" ${p ? `style="background-image:url('${p.thumb}')"` : ""}>${p ? "" : i + 1}</i>`; }).join("");
}
// the units as a table on the lot page (layouts 4, 5 and 6): picture, unit, who, and a landlord / tenant / free label
function unitsTable(l){
  const units = rentalUnits(l), ph = unitPhotos(l);
  return `<section class="block" style="--h:${l.hood.color}"><div class="block-head"><h2>The <em>units</em></h2><span class="count">${units.length} units</span></div><div class="unit-table">${units.map((u, i) => { const p = (ph[i + 1] || [])[0];
    return `<a class="unit-row" href="#${u ? u.hh.id : l.id}"><span class="u-pic" ${p ? `style="background-image:url('${p.thumb}')"` : ""}>${p ? "" : i + 1}</span><span class="u-name">Unit ${i + 1}</span><span class="u-who">${u ? `<b>${esc(u.hh.name)}</b>` : "<i>Nobody yet</i>"}</span><span class="role-chip ${roleOf(u)}">${roleTxt(u)}</span></a>`; }).join("")}</div></section>`;
}
// apartment buildings in layouts 4 and 5: one card with the building's front picture, its apartments as circles or a strip
function buildingFront(b, mode){
  const cover = (b.units.find(u => u.photos[0]) || {}).photos?.[0], lived = b.units.filter(u => u.hh).length;
  const circ = b.units.map(u => nbTile(u).replace("<i ", `<i data-lot-link="${u.id}" aria-label="${esc(u.name)}" `).replace(/ title="[^"]*"/, ` data-name="${esc(u.name)}"`)).join("");
  const strip = b.units.map(u => `<i data-lot-link="${u.id}" class="${u.hh ? "r-lives" : "r-empty"}" title="${esc(u.name)}${u.hh ? " · " + esc(u.hh.name) : " · Free"}" ${u.photos[0] ? `style="background-image:url('${u.photos[0].thumb}')"` : ""}>${u.photos[0] ? "" : esc(u.unit || "")}</i>`).join("");
  return `<div class="listing" style="--h:${b.hood.color}"><div class="photo ${cover?"shot":""}" ${cover?`style="--img:url('${cover.thumb}')"`:""}>${cover ? "" : plot("40x30", 120, false)}${mode === "4" ? `<span class="nb-bubbles${b.units.length > 5 ? " many" : ""}">${circ}</span>` : ""}<span class="type">Apartment building · ${b.units.length} apartments</span></div>${mode === "5" ? `<div class="unit-strip">${strip}</div>` : ""}
    <h3>${esc(b.name)}</h3><div class="meta"><span>${ic("home")}${lived} lived in, ${b.units.length - lived} free</span></div></div>`;
}

function rvSwitch(show){
  document.getElementById("rv-switch")?.remove(); if (!show) return;
  const d = document.createElement("div"); d.id = "rv-switch"; d.className = "rv-switch";
  d.innerHTML = `<b>Rental layout (trial)</b><div>${[["1", "1 · units listed"], ["2", "2 · badge + unit count"], ["u", "3 · each unit its own card"], ["4", "4 · front photo + unit circles"], ["5", "5 · front photo + unit strip"], ["6", "6 · house-style card + units table"]].map(([k, t]) => `<button type="button" data-rv="${k}" class="${RV === k ? "on" : ""}">${t}</button>`).join("")}</div>`;
  document.body.appendChild(d);
}
document.addEventListener("click", e => { const b = e.target.closest("[data-rv]"); if (!b) return; RV = b.dataset.rv; try { localStorage.setItem(RV_KEY, RV); } catch (err) {} const y = scrollY; route(); scrollTo(0, y); });

function listing(l){
  const cover = l.photos[0];
  return `<a class="listing" href="#${l.id}" style="--h:${l.hood.color}"><div class="photo ${cover?"shot":""}" ${cover?`data-lazy="--img" data-src="${cover.thumb}"`:""}>${cover ? "" : lotArt(l)}${rvOf(l) === "4" && unitCount(l) ? `<span class="nb-bubbles${unitCount(l) > 5 ? " many" : ""}">${rentalBubbles(l)}</span>` : ""}<span class="type">${["2", "4", "5", "6"].includes(rvOf(l)) && unitCount(l) ? `Rental · ${unitCount(l)} units` : esc(l.type || "Lot")}</span><span class="status">${statusDots(l)}</span>${sizeTxt(l.size) && !isApt(l) ? `<span class="size">${sizeTxt(l.size)}</span>` : ""}${cardPills(l)}</div>${rvOf(l) === "5" && unitCount(l) ? `<div class="unit-strip">${rentalStrip(l)}</div>` : ""}
    <h3>${esc(l.name)}</h3>
    <div class="meta">${["4", "5", "6"].includes(rvOf(l)) && unitCount(l) ? rentalMeta(l) : l.hh ? `<span>${ic("users")}<b>${esc(l.hh.name)}</b>${l.hh.unsure?" (unsure)":""}</span>` : l.whoNote ? `<span>${ic("users")}${esc(emptyNote(l.whoNote))}</span>` : ""}${l.gallery ? `<span title="Downloads on the Sims 4 Gallery">${ic("share")}${l.gallery.downloads} downloads</span>` : ""}</div></a>`;
}

function buildingCard(b){
  const cover = b.units.find(l => l.photos[0]), built = b.units.filter(l => l.built === true).length;
  return `<div class="listing bcard" style="--h:${b.hood.color}"><div class="photo ${cover?"shot":""}" ${cover?`style="--img:url('${cover.photos[0].thumb}')"`:""}>${cover ? "" : plot("40x30", 120, false)}<span class="type">Apartment building</span><span class="size">${b.units.length} apartments</span></div>
    <h3>${esc(b.name)}</h3>
    <ul class="units">${b.units.map(l => `<li><a href="#${l.id}"><span class="unit-no">${esc(l.unit)}</span><span class="unit-who">${l.hh ? `${ic("users")}<b>${esc(l.hh.name)}</b>` : `<i>${esc(l.whoNote ? emptyNote(l.whoNote) : "No household yet")}</i>`}</span><span class="status">${statusDots(l)}</span></a></li>`).join("")}</ul>
    <div class="meta"><span>${ic("hammer")}<b>${built} of ${b.units.length}</b> built</span></div></div>`;
}
// units of a building sit together under a small heading, each keeping its own card and picture
const hoodItems = x => { const seen = new Set(); return x.lots.flatMap(l => { if (!l.building) return [rvOf(l) === "1" && unitCount(l) ? rentalCard(l) : rvOf(l) === "u" && unitCount(l) ? `<div class="bgroup"><div class="bgroup-head">${ic("home")}<h3><a href="#${l.id}">${esc(l.name)}</a></h3><span>Rental · ${unitCount(l)} units · ${rentalUnits(l).filter(Boolean).length} lived in</span></div><div class="listings">${unitCards(l)}</div></div>` : listing(l)]; const b = l.building; if (seen.has(b)) return []; seen.add(b);
  const built = b.units.filter(u => u.built === true).length;
  if (RV === "4" || RV === "5") return [buildingFront(b, RV)];
  return [`<div class="bgroup"><div class="bgroup-head">${ic("home")}<h3>${esc(b.name)}</h3><span>${b.units.length} apartments · ${built} built</span></div><div class="listings">${b.units.map(listing).join("")}</div></div>`]; }); };
function mapHero(w, kicker, title, text, figures, chapters, small){
  return `<section class="hero ${w.map?"mapped":""} ${small?"hh-hero":""}" style="--c:${w.glow||w.color};${w.map?`--map:url('${w.map}')`:""}">${w.map?`<span class="credit">Map by 20th Century Plumbob</span>`:""}<div class="kicker"><i></i><span class="label">${kicker}</span></div>
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
function nbView(pt, zoom = ZOOM){
  const kx = zoom, ky = zoom * MAP_RATIO / CARD_RATIO, cl = v => Math.max(0, Math.min(1, v));
  const px = cl((pt[0]*kx - .5)/(kx - 1)), py = cl((pt[1]*ky - .5)/(ky - 1));
  return {bg: `${(px*100).toFixed(1)}% ${(py*100).toFixed(1)}%/${(zoom*100).toFixed(1)}% auto`, pin: [pt[0]*kx + px*(1-kx), pt[1]*ky + py*(1-ky)].map(v => (v*100).toFixed(1) + "%")};
}
const nbTile = l => l.photos[0] ? `<i style="background-image:url('${l.photos[0].thumb}')" title="${esc(l.name)}"></i>` : `<i class="nb-none" title="${esc(l.name)} (no picture yet)">${isApt(l) ? ic("home") : plot(l.size, 60, false)}</i>`;
// a lot circle on a neighbourhood card opens that lot (the rest of the card still opens the neighbourhood)
document.addEventListener("click", e => { const c = e.target.closest("[data-lot-link]"); if (!c) return; e.preventDefault(); e.stopPropagation(); location.hash = c.dataset.lotLink; }, true);
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
    w.hoods.filter(o => o !== x).map(o => `<a href="#n-${o.id}">${esc(o.name)}</a>`).join(""), true);
  h += `<section class="hood" style="--h:${x.color}"><div class="hood-head"><span class="label">${esc(x.name)}</span><div><h2>The <em>lots</em></h2><p>Open a home to meet the household who lives there.</p>${hoodExtras(x, true) ? `<div class="hood-extras">${hoodExtras(x, true)}</div>` : ""}<p class="dot-key"><span class="yes">${ic("hammer")}</span>Built <span class="yes">${ic("share")}</span>Shared <span class="yes">${ic("sim")}</span>Sims made <small>Faded means not yet.</small></p></div><span class="count">${built} of ${x.lots.length} built</span></div>
    <div class="listings">${hoodItems(x).join("")}</div></section>`;
  return h;
}


// screenshot carousel (replaces the lot plan); click the photo for full screen
function carousel(l){
  if (!l.photos.length) return `<div class="carousel empty-car"><div class="empty" style="margin:0;height:100%">${ic("image")}No screenshots yet. Photos of this build will go here.</div></div>`;
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
    <div><dl class="facts">${l.ea ? `<div><dt>In-game name</dt><dd>${esc(l.ea)}</dd></div>` : ""}<div><dt>Lot type</dt><dd>${esc(l.type || "Not set")}</dd></div>${isApt(l) ? "" : `<div><dt>Lot size</dt><dd>${esc(sizeTxt(l.size) || "Not checked yet")}</dd></div>`}${l.traits ? `<div><dt>Lot traits</dt><dd>${l.traits.map(esc).join(", ")}</dd></div>` : ""}${l.challenges ? `<div><dt>${l.challenges.length > 1 ? "Lot challenges" : "Lot challenge"}</dt><dd>${l.challenges.map(esc).join(", ")}</dd></div>` : ""}
      <div><dt>Neighbourhood</dt><dd>${esc(l.hood.name)}</dd></div>${progressRow(l)}${l.building ? `<div><dt>Building</dt><dd>${esc(l.building.name)} · ${l.building.units.length} apartments</dd></div>` : ""}
      ${l.hh || l.whoNote ? `<div><dt>${l.owned ? "Owned by" : "Household"}</dt><dd>${l.hh ? `<a href="#${l.hh.id}">${esc(l.hh.name)}</a>${l.hh.unsure?" (unsure)":""}${l.tenants && !l.owned ? " (owners)" : ""}` : esc(emptyNote(l.whoNote))}</dd></div>` : ""}${rvOf(l) && unitCount(l) ? (u => `<div><dt>Units</dt><dd>${u.length}: ${u.filter(Boolean).length} lived in, ${u.filter(x => !x).length} free</dd></div>`)(rentalUnits(l)) : ""}${l.tenants ? `<div><dt>${l.tenants.length > 1 ? "Tenants" : "Tenant"}</dt><dd>${l.tenants.map(t => `<a href="#${t.id}">${esc(t.name)}</a>${t.note ? ` <small>“${esc(t.note)}”</small>` : ""}`).join(", ")}</dd></div>` : ""}</dl>${l.versions ? versionTabs(l) : ""}
</div></div>
    ${l.hh ? `<section class="block" style="--h:${hc}"><div class="block-head"><h2>${l.owned ? "Who <em>owns it</em>" : "Who <em>lives here</em>"}</h2></div>
      <div class="lives"><div class="lives-card">${hhListing(l.hh)}</div>
      <div>${l.hh.sims.length ? `<span class="label">The Sims</span><ul class="sim-list">${l.hh.sims.map(sm => `<li><a href="#${l.hh.id}" data-sim="${sm.id}"><span class="mono">${initial(sm.name)}</span><span><b>${esc(sm.name)}</b><small>${esc([sm.age, sm.aspiration].filter(Boolean).join(" · "))}</small></span></a></li>`).join("")}</ul>` : `<div class="empty" style="margin-top:0">${ic("sim")}No Sims added for the ${esc(l.hh.name)} household yet.</div>`}
      <a class="more" href="#${l.hh.id}">Open the ${esc(l.hh.name)} household ${ic("arrow")}</a></div></div></section>` : ""}
    ${["4", "5", "6"].includes(rvOf(l)) && unitCount(l) ? unitsTable(l) : ""}${rvOf(l) === "u" && unitCount(l) ? `<section class="block" style="--h:${hc}"><div class="block-head"><h2>The <em>units</em></h2><span class="count">${unitCount(l)} units</span></div><div class="listings">${unitCards(l)}</div></section>` : ""}
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
function hhListing(x){
  const n = x.sims.length, hc = x.lots[0].hood.color, made = simsMade(x);
  return `<a class="listing" href="#${x.id}" style="--h:${hc}"><div class="photo"><span class="initial">${initial(x.name)}</span><span class="type">Household</span><span class="status">${x.unsure ? `<span class="flag">unsure</span>` : ""}<span class="${made?"yes":""}" title="Sims made: ${made?"yes":"not yet"}">${ic("sim")}</span></span><span class="size">${esc(x.lots.map(l => l.name).join(" & "))}</span></div>
    <h3>${esc(x.name)}</h3><p class="desc">${esc([...new Set(x.lots.map(l => l.hood.name))].join(", "))}</p>
    <div class="meta"><span class="${made?"made":""}">${ic("sim")}<b>${made ? "Sims made" : "Sims not made yet"}</b></span>${n ? `<span>${ic("users")}${n} Sim ${n===1?"profile":"profiles"}</span>` : ""}${x.links.length ? `<span>${ic("share")}${x.links.length} connected</span>` : ""}</div></a>`;
}
function families(w){
  const hhs = Object.values(w.households).sort((a,b) => a.name.localeCompare(b.name)), s = w.stats;
  let h = mapHero(w, esc(w.name), "The <em>households</em>", `Every family living in ${esc(w.name)}.`, [[hhs.length,"households"],[simCount(hhs),"Sims"]], "", true);
  h += `<section class="hood" style="--h:${w.color}"><div class="hood-head"><span class="label">${esc(w.name)}</span><div><h2>All <em>households</em></h2><p>Open a household to meet its Sims.</p></div><span class="count">${s.hhMade} of ${s.hh} with Sims made</span></div>
    <div class="listings">${hhs.map(hhListing).join("")}</div></section>`;
  return h;
}
const lotsLabel = hh => { const o = hh.lots.some(l => l.owned), n = hh.lots.filter(l => !l.owned).length; return (n > 1 ? "Homes" : "Home") + (o ? " & business" : ""); };
function household(hh){
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
const open = w => w.ready || !w.owned;   // pages that open: owned worlds, and not-owned ones as plans (16 Oct)
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
  rvSwitch((ctx.lot && unitCount(ctx.lot) && !ctx.hh) || (ctx.hood && !ctx.lot && ctx.hood.lots.some(l => unitCount(l) || l.building)));
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
