// Try switch (23 Nov 2026): filipesims made some worlds in more than one version; she picks one each here.
// Temporary: once she has picked, set MAPS in tools/filipesims_maps.py, then delete this file, its <script> in index.html,
// the "Try switch" block in site.css and site/maps/try/ (the other versions, made by `tools/filipesims_maps.py --try`).
(() => {
  const TRY = [   // world id, [version key, label]; the first version is the one already in site/maps/
    ["willow-creek", [["full", "Full"], ["lite", "Lite"]]],
    ["oasis-springs", [["full", "Full"], ["lite", "Lite"]]],
    ["newcrest", [["full", "Full"], ["lite", "Lite"]]],
    ["san-myshuno", [["day", "Day"], ["midnight", "Midnight"], ["sunset", "Sunset"]]],
    ["evergreen-harbor", [["hd", "HD"], ["nap", "NAP"]]],
    ["san-sequoia", [["grey", "Grey bridge"], ["red", "Red bridge"]]],
    ["tartosa", [["day", "Day"], ["sunset", "Sunset"]]],
  ];
  const KEY = "jsw-try-maps";
  let pick = {}; try { pick = JSON.parse(localStorage.getItem(KEY) || "{}") || {}; } catch (e) {}
  const orig = {};
  const apply = () => TRY.forEach(([id, vs]) => {
    const w = worlds.find(x => x.id === id); if (!w) return;
    if (!orig[id]) orig[id] = {map: w.map, mapPhone: w.mapPhone, thumb: w.thumb};
    const k = pick[id], o = orig[id];
    if (!k || k === vs[0][0]) Object.assign(w, o);
    else Object.assign(w, {map: o.map ? `maps/try/${id}--${k}.jpg` : "", mapPhone: "", thumb: `maps/try/${id}--${k}.thumb.jpg`});
  });
  const box = document.createElement("aside");
  box.className = "try"; box.setAttribute("aria-label", "Try map versions");
  const rows = TRY.map(([id, vs]) => {
    const w = worlds.find(x => x.id === id); if (!w) return "";
    const cur = pick[id] || vs[0][0];
    const link = w.owned ? `<a href="#w-${id}">${esc(w.name)}</a>` : `<a href="#home">${esc(w.name)}</a> <small>(not owned: home card)</small>`;
    return `<div class="try-row"><span class="try-name">${link}</span><span class="try-opts" role="group" aria-label="${esc(w.name)}">${vs.map(([k, label]) =>
      `<button type="button" data-try-world="${id}" data-try-version="${k}" aria-pressed="${k === cur}">${label}</button>`).join("")}</span></div>`;
  }).join("");
  const open = !matchMedia("(max-width:700px)").matches;   // folded on phones, so it never sits over the page
  box.innerHTML = `<button type="button" class="try-toggle" aria-expanded="${open}">Try: map versions</button><div class="try-body"${open ? "" : " hidden"}>${rows}</div>`;
  document.body.appendChild(box); document.body.classList.add("has-try");
  box.addEventListener("click", e => {
    const t = e.target.closest(".try-toggle");
    if (t) { const open = t.getAttribute("aria-expanded") !== "true"; t.setAttribute("aria-expanded", open); box.querySelector(".try-body").hidden = !open; return; }
    const b = e.target.closest("[data-try-world]"); if (!b) return;
    pick[b.dataset.tryWorld] = b.dataset.tryVersion;
    try { localStorage.setItem(KEY, JSON.stringify(pick)); } catch (err) {}
    box.querySelectorAll(`[data-try-world="${b.dataset.tryWorld}"]`).forEach(x => x.setAttribute("aria-pressed", x === b));
    apply(); route();
  });
  apply();
  if (Object.keys(pick).length) route();
})();
