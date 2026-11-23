// Try switch (23 Nov 2026): the overlay on map banners, now that filipesims' maps have a pale haze at the top.
// Her idea: no overlay over the top right, a bit less over the bottom left. The looks are CSS (site.css, after the map banner rules),
// keyed on data-try-overlay on <html>. Temporary: once she has picked, make that the banner's own CSS, then delete this file,
// its <script> in index.html and the two "Try switch" blocks in site.css.
(() => {
  const OPTS = [["now", "As now"], ["clear", "Clear top right"], ["less-left", "Less on the left"], ["bottom", "Bottom only"], ["bottom-light", "Bottom only, lighter"]];
  const KEY = "jsw-try-overlay";
  let pick = "now"; try { pick = localStorage.getItem(KEY) || "now"; } catch (e) {}
  const set = k => { pick = k; if (k === "now") delete document.documentElement.dataset.tryOverlay; else document.documentElement.dataset.tryOverlay = k; };
  set(pick);
  const box = document.createElement("aside");
  box.className = "try"; box.setAttribute("aria-label", "Try the map banner overlay");
  const open = !matchMedia("(max-width:700px)").matches;   // folded on phones, so it never sits over the page
  box.innerHTML = `<button type="button" class="try-toggle" aria-expanded="${open}">Try: map banner overlay</button>
    <div class="try-body"${open ? "" : " hidden"}><p>Open any world or neighbourhood page and switch.</p><div class="try-opts" role="group" aria-label="Overlay">${
    OPTS.map(([k, label]) => `<button type="button" data-try="${k}" aria-pressed="${k === pick}">${label}</button>`).join("")}</div></div>`;
  document.body.appendChild(box); document.body.classList.add("has-try");
  const room = () => { document.body.style.paddingBottom = (box.offsetHeight + 32) + "px"; };   // the footer's buttons never sit under the switch
  room(); new ResizeObserver(room).observe(box);
  box.addEventListener("click", e => {
    const t = e.target.closest(".try-toggle");
    if (t) { const o = t.getAttribute("aria-expanded") !== "true"; t.setAttribute("aria-expanded", o); box.querySelector(".try-body").hidden = !o; return; }
    const b = e.target.closest("[data-try]"); if (!b) return;
    set(b.dataset.try);
    try { localStorage.setItem(KEY, pick); } catch (err) {}
    box.querySelectorAll("[data-try]").forEach(x => x.setAttribute("aria-pressed", x === b));
  });
})();
