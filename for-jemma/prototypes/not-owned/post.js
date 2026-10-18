// Prototype, 18-19 Oct: families in worlds she doesn't own yet. Runs after js/app.js. It wraps a few of the app's own
// functions (each wrapper says what it adds), so porting means folding those few lines into the same functions in app.js.
// A: household and Sim pages, listed under their world in the sidebar's Not owned list (suggested)
// B: the same pages, not in the sidebar (reached from family trees, dynasty pages and search)
// C: no household pages; Sims on an owned family's tree get a page as late relatives do, the rest show only as names
const pNotOwned = w => !!w && !w.owned;
const pSimWorld = id => { const s = SIMS[id]; return s ? (s.hh ? s.hh.world : s.world) : null; };
const pAway = id => !!SIMS[id] && !SIMS[id].ph && pNotOwned(pSimWorld(id));

// lots and neighbourhoods of not-owned worlds never get pages (the world doesn't open either); kept here to spot links to them
const P_LOTS = {}, P_HOODS = {};
Object.keys(lotIndex).forEach(k => { if (pNotOwned(lotIndex[k].world)) { P_LOTS[k] = lotIndex[k]; delete lotIndex[k]; } });
Object.keys(hoodIndex).forEach(k => { if (pNotOwned(hoodIndex[k].world)) { P_HOODS[k] = hoodIndex[k]; delete hoodIndex[k]; } });

// C: their households have no page. Sims become like people.json Sims (a world chip, no household link); those on an owned
// household's family tree keep a Sim page anchored there (Juliette, Romeo and Dante on the Capps' tree); the rest have none.
if (P_OPT.opt === "C") {
  Object.values(SIMS).forEach(s => { if (s.hh && pNotOwned(s.hh.world)) { s.hhName = s.hh.name; s.world = s.hh.world; s.hh = null; delete SIM_PAGES["s-" + s.id]; delete ANCHOR[s.id]; } });
  Object.keys(hhIndex).forEach(k => { if (pNotOwned(hhIndex[k].world)) delete hhIndex[k]; });
  worlds.filter(w => w.owned).forEach(w => Object.values(w.households).forEach(hh => { if (hh.sims.some(sm => sm.sid)) treeOf(hh).forEach(id => { ANCHOR[id] ||= hh; }); }));
  Object.values(SIMS).forEach(s => { if (!s.hh && !s.ph && !s.stub && ANCHOR[s.id]) SIM_PAGES["s-" + s.id] = s; });
  Object.values(GROUP_PAGES).forEach(g => { if (g.homeHh && pNotOwned(g.homeHh.world)) g.homeHh = null; });
}

// ---------- marks: a hollow dot or monogram, like the sidebar's not-owned worlds ----------
// homeChip: the chip gets class "notown" (hollow dot) and says so in its tooltip
const pHomeChip0 = homeChip;
homeChip = function (s, worldOnly) {
  const h = pHomeChip0(s, worldOnly), w = s.hh ? s.hh.world : s.world;
  if (!h || !pNotOwned(w)) return h;
  const who = s.hh ? s.hh.name + " household" : s.hhName ? s.hhName + " household" : "";
  return h.replace('class="hhchip"', 'class="hhchip notown"').replace(/title="[^"]*"/, `title="${esc((who ? who + ", " : "") + w.name)}, a world you don’t own yet"`);
};
// simWhere: "Monticapp household · Tartosa (not owned)"
const pSimWhere0 = simWhere;
simWhere = function (o) { const t = SIMS[o], out = pSimWhere0(o); return t && t.hh && pNotOwned(t.hh.world) ? out + " (not owned)" : out; };
// tree cards, family cards, relationship cards and dynasty member cards: class "notown" (hollow monogram)
const pMark = (html, id, cls) => pAway(id) ? html.replace(`class="${cls} `, `class="${cls} notown `) : html;
const pTreeCard0 = treeCard;     treeCard = (id, ...a) => pMark(pTreeCard0(id, ...a), id, "tc");
const pSimFamItem0 = simFamItem; simFamItem = (o, w) => pMark(pSimFamItem0(o, w), o, "card");
const pSimRelCard0 = simRelCard; simRelCard = r => pMark(pSimRelCard0(r), r.o, "rel-card");
const pMemberCard0 = memberCard; memberCard = (g, id, r) => pMark(pMemberCard0(g, id, r), id, "mcard");
// the tree key gets one more line when the tree has someone from a world she doesn't own
const pTreeKey0 = treeKey;
treeKey = function (ids, ...a) {
  const h = pTreeKey0(ids, ...a);
  return ids.some(pAway) ? h.replace(/<\/div>\s*$/, `<span><span class="k-notown"></span>In a world you don’t own yet</span></div>`) : h;
};

// ---------- the pages: a lighter banner and one plain line under it ----------
const pNote = w => `<div class="note notown-note">This family lives in ${esc(w.name)} (${esc(w.pack)}), a world you don’t own yet. Their home and the world will open once the pack is in.</div>`;
const pAfterHero = (h, extra) => { const i = h.indexOf("</section>") + 10; return h.slice(0, i).replace('class="hero small"', 'class="hero small notown"') + extra + h.slice(i); };
const pHouseholdNew0 = householdNew;
householdNew = hh => pNotOwned(hh.world) ? pAfterHero(pHouseholdNew0(hh), pNote(hh.world)) : pHouseholdNew0(hh);
const pHousehold0 = household;
household = hh => pNotOwned(hh.world) && !hh.sims.some(sm => sm.sid) ? pAfterHero(pHousehold0(hh), pNote(hh.world)) : pHousehold0(hh);
const pSimPage0 = simPage;
simPage = function (s) {
  const w = pSimWorld(s.id); if (!pNotOwned(w)) return pSimPage0(s);
  // A/B: the household is in that world too, so it reads like the household page; C: say where they live instead
  if (s.hh) return pAfterHero(pSimPage0(s), `<div class="note notown-note">Lives in ${esc(w.name)} (${esc(w.pack)}), a world you don’t own yet.</div>`);
  return pAfterHero(pSimPage0(s), `<div class="note notown-note">Lives with the ${esc(s.hhName)} household in ${esc(w.name)} (${esc(w.pack)}), a world you don’t own yet, so the household has no page.</div>`);
};

// links to lots, neighbourhoods and worlds that don't open become plain text (the world crumb says "(not owned)", as dynasty pages already do)
function pDeadLinks(root) {
  root.querySelectorAll('a[href^="#"]').forEach(a => {
    const k = a.getAttribute("href").slice(1);
    const w = P_LOTS[k] ? P_LOTS[k].world : k.startsWith("n-") && P_HOODS[k.slice(2)] ? P_HOODS[k.slice(2)].world : /^[wf]-/.test(k) ? worlds.find(x => x.id === k.slice(2)) : null;
    if (!w || w.ready) return;
    const s = document.createElement("span"); s.className = (a.className + " nolink").trim(); s.innerHTML = a.innerHTML;
    if (k.startsWith("w-") && a.closest(".crumbs")) s.append(" (not owned)");
    a.replaceWith(s);
  });
}

// ---------- sidebar (A only): a not-owned world with families unfolds to its households, like an owned world's list ----------
const pRenderNav0 = renderNav;
renderNav = function (active, key, ctx) {
  pRenderNav0(active, key, ctx);
  if (P_OPT.opt !== "A") return;
  const cur = ctx && ctx.hh && pNotOwned(ctx.hh.world) ? ctx.hh.world : null;
  document.querySelectorAll("#nav .nav-group.dim a.soon").forEach(a => {
    const w = worlds.find(x => x.name === a.textContent.trim()), hhs = w ? Object.values(w.households).sort(byHh) : [];
    if (!hhs.length) return;
    const open = w === cur || P_FOLD.has(w.id);
    a.classList.add("has-hh"); a.dataset.pfold = w.id; a.setAttribute("role", "button"); a.setAttribute("aria-expanded", open); a.removeAttribute("aria-disabled");
    a.insertAdjacentHTML("beforeend", `<span class="pct">${hhs.length}</span>`);
    a.insertAdjacentHTML("afterend", `<div class="subnav" ${open ? "" : "hidden"}>${hhs.map(hx => `<a href="#${hx.id}" class="${ctx.hh === hx ? (ctx.sim ? "path" : "cur") : ""}">${esc(hhListName(hx))}</a>${ctx.hh === hx ? `<div class="lotnav">${hx.sims.map(sm => `<a href="#s-${sm.sid}" class="${ctx.sim === sm ? "cur" : ""}">${esc(sm.name)}</a>`).join("")}</div>` : ""}`).join("")}</div>`);
  });
};
const P_FOLD = new Set();
document.addEventListener("click", e => { const a = e.target.closest("#nav a[data-pfold]"); if (!a) return; e.preventDefault();
  const id = a.dataset.pfold, list = a.nextElementSibling, show = list.hidden; list.hidden = !show; a.setAttribute("aria-expanded", show); show ? P_FOLD.add(id) : P_FOLD.delete(id); });

// ---------- search (A and B): their households and Sims can be found, marked "not owned" ----------
const pSearchIndex0 = searchIndex;
searchIndex = function () {
  const out = pSearchIndex0();
  if (P_OPT.opt === "C") return out;
  const add = (kind, name, where, href) => out.push({kind, name, where, href, keys: [[name, fold(name)]]});
  worlds.filter(w => !w.owned).forEach(w => Object.values(w.households).forEach(x => { add("Household", x.name, w.name + " (not owned)", "#" + x.id);
    x.sims.forEach(sm => add("Sim", sm.name, x.name + " household · not owned", sm.sid ? "#s-" + sm.sid : "#" + x.id)); }));
  return out;
};

// ---------- routing: the page's own links stay in this page (the <base> points at site/) ----------
removeEventListener("hashchange", route);
const pRoute0 = route;
route = function () {
  if (!location.hash) { history.replaceState(null, "", location.pathname + location.search + "#" + (P_OPT.opt === "C" ? "s-juliette-monty" : "h-tartosa--monticapp")); }
  pRoute0(); pDeadLinks(document.getElementById("view")); pBar();
};
addEventListener("hashchange", route);
document.addEventListener("click", e => {
  const a = e.target.closest('a[href^="#"]'); if (!a || e.defaultPrevented) return;
  e.preventDefault(); const h = a.getAttribute("href"); setTimeout(() => { if (location.hash !== h) location.hash = h; }, 0);
}, true);

// ---------- the prototype bar ----------
const P_OPTS = {A: "Pages for every household and Sim, listed under their world in the sidebar’s Not owned list.",
  B: "The same pages, but not in the sidebar: reached from family trees, dynasty pages and search.",
  C: "No household pages. Sims on an owned family’s tree get a page, as late relatives do; the rest show only as names."};
const P_GO = [["h-tartosa--monticapp", "Monticapp household"], ["s-juliette-monty", "Juliette"], ["h-ondarion--capp", "Capp household (tree)"], ["g-dynasty-capp", "Capp dynasty"], ["h-forgotten-hollow--vatore", "Vatores (Lily Zhu link)"]];
const pUrl = (o, s) => `${location.pathname}?opt=${o}${s ? "" : "&sis=0"}${location.hash}`;
function pBar() {
  const key = location.hash.slice(1);
  const go = P_GO.map(([k, t]) => { const ok = hhIndex[k] || SIM_PAGES[k] || GROUP_PAGES[k];
    return ok ? `<a href="#${k}" class="${k === key ? "on" : ""}">${t}</a>` : `<span class="off" title="No page in this option">${t}</span>`; }).join("");
  document.getElementById("pbar").innerHTML = `<div class="pbar-row"><span class="ptag">Prototype</span><b>Families in worlds you don’t own</b>
    <div class="pseg"><span>Option</span>${["A", "B", "C"].map(o => `<a class="pbtn ${o === P_OPT.opt ? "on" : ""}" href="${pUrl(o, P_OPT.sis)}">${o}${o === "A" ? " <i>suggested</i>" : ""}</a>`).join("")}</div>
    <label class="pchk"><input type="checkbox" ${P_OPT.sis ? "checked" : ""} id="psis"> Juliette as Tybalt’s sister</label></div>
    <div class="pbar-row small"><span class="pdesc">${P_OPTS[P_OPT.opt]}</span><span class="pgo">${go}</span></div>`;
  document.getElementById("psis").onchange = e => { location.href = pUrl(P_OPT.opt, e.target.checked); };
}
// option buttons are ordinary links to ?opt=… (a full reload, as the data is set up once)
route();
