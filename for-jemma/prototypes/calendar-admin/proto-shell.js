// Prototype, 23 Oct: runs the app as it is (site/js/app.js, read only) and lets a prototype take over some pages and the sidebar.
// Nothing in site/ is changed. The switch at the bottom right picks an option; "Now" is the app as it is today.
const PROTO = {opts: [], mode: "now", page: null, navHook: null, after: null};
const appRoute = route, appNav = renderNav;
window.renderNav = function(active, key, ctx){ appNav(active, key, ctx); if (PROTO.navHook) PROTO.navHook(active, key, ctx || {}, document.getElementById("nav")); };
window.route = function(){
  const key = location.hash.slice(1) || "home", p = PROTO.page && PROTO.page(key);
  if (!p) { appRoute(); if (PROTO.after) PROTO.after(key, document.getElementById("view")); return; }
  closeLightbox();
  const view = document.getElementById("view"), root = document.documentElement.style, y = scrollY;
  if (p.deep) { root.setProperty("--deep", p.deep[0]); root.setProperty("--deep-2", p.deep[1]); } else { root.removeProperty("--deep"); root.removeProperty("--deep-2"); }
  view.innerHTML = p.html; document.title = curly(p.title || "Jemma’s Sim World");
  notOwnedLinks(view); initialsContrast(view); lazyPics(view); keyLinks(view); clearSearch();
  renderNav(p.active || "", key, p.ctx || {});
  window.scrollTo(0, p.keepScroll ? y : 0);
  document.body.classList.remove("nav-open");
};
addEventListener("hashchange", () => window.route());   // runs after the app's own listener, so the prototype has the last word

// the option switch
function protoSwitch(){
  const el = document.getElementById("pswitch");
  el.innerHTML = `<span class="ps-l">Prototype</span>${PROTO.opts.map(o => `<button type="button" class="${PROTO.mode === o.k ? "on" : ""}" data-opt="${o.k}" title="${esc(o.note)}">${esc(o.name)}</button>`).join("")}
    <p class="ps-note">${esc((PROTO.opts.find(o => o.k === PROTO.mode) || {}).note || "")}</p>`;
}
document.addEventListener("click", e => { const b = e.target.closest("#pswitch [data-opt]"); if (!b) return;
  PROTO.mode = b.dataset.opt; const u = new URL(location.href); u.searchParams.set("opt", PROTO.mode); history.replaceState(null, "", u);
  document.body.dataset.opt = PROTO.mode; protoSwitch(); window.route(); });
function protoStart(){
  const q = new URLSearchParams(location.search).get("opt");
  if (q && PROTO.opts.some(o => o.k === q)) PROTO.mode = q;
  document.body.dataset.opt = PROTO.mode; protoSwitch(); window.route();
}
// The page uses <base href="../../../site/"> so the app's pictures load; that would send "#..." links to site/index.html.
// Keep them here instead (runs last, after the app's own click handlers have had their say).
window.addEventListener("click", e => { if (e.defaultPrevented || e.button !== 0 || e.ctrlKey || e.metaKey || e.shiftKey) return;
  const a = e.target.closest && e.target.closest("a[href^='#']"); if (!a) return;
  e.preventDefault(); const h = a.getAttribute("href"); if (location.hash !== h) location.hash = h; });
const hereHash = h => location.pathname + location.search + h;
