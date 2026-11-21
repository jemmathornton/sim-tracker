/* ================================================================================================================================
   TEMPORARY TRIAL (21 Nov 2026), while Jemma chooses. Remove once she has picked: delete this file and its <script> line in
   index.html (then rebuild); if she keeps an option, move its styles into site.css first.
   A small "Try" switch, bottom right, with two choices (her rule: show both in the running app):
     a. Lot, Sim and household pages: "As now" or "Town plan" (the S1f-a look of the home and neighbourhood pages: white plates
        edged in the world's colour with a striped top edge, section rules with a purple start, squared tags and lot cards)
     b. The name's second word in the sidebar and Menu bar ("Jemma’s Sim World"): "Gold" (as now) or "Purple"
        (contrast on the sidebar: gold 3.3:1 light / 7.3:1 dark, large text; purple 5.8:1 light / 8.4:1 dark)
   Choices are remembered in this browser (localStorage jsw-try-inner, jsw-try-name). Nothing here touches her data.
   ================================================================================================================================ */
(function(){
  const root = document.documentElement;
  const OPTIONS = [
    {key: "jsw-try-inner", attr: "tryInner", label: "Lot, Sim and household pages", opts: [["now", "As now"], ["plan", "Town plan"]]},
    {key: "jsw-try-name", attr: "tryName", label: "Name in the sidebar", opts: [["gold", "Gold"], ["purple", "Purple"]]},
  ];
  // the town-plan styles apply only on lot (#l-…), Sim (#s-…) and household (#h-…) pages
  const P = 'html[data-try-inner="plan"][data-try-page]';
  const plate = "border-radius:2px;border:1px solid color-mix(in srgb,var(--h) 45%,var(--card-line));box-shadow:3px 4px 0 color-mix(in srgb,var(--h) 18%,transparent)";
  const small = "border-radius:2px;border:1px solid color-mix(in srgb,var(--h) 40%,var(--card-line));box-shadow:2px 3px 0 color-mix(in srgb,var(--h) 14%,transparent)";
  // the striped top edge, as on the home and neighbourhood cards, drawn as a background so it suits scrolling boxes too
  const stripe = "repeating-linear-gradient(90deg,var(--h) 0 28px,color-mix(in srgb,var(--h) 35%,var(--strip-pale)) 28px 56px) 0 0/100% 9px no-repeat,"
    + "linear-gradient(color-mix(in srgb,var(--h) 70%,#1F2B33),color-mix(in srgb,var(--h) 70%,#1F2B33)) 0 9px/100% 1px no-repeat";
  const css = `
${P} .block-head{border-bottom:1px solid var(--rule);padding-bottom:12px;background:linear-gradient(var(--plum),var(--plum)) left bottom/56px 3px no-repeat}
${P} .crumbs a,${P} .crumbs span,${P} .sim-chips>span:not(.otag){border-radius:2px}
${P} .detail .facts{${plate};background:${stripe},var(--surface);padding:10px 16px 0}
${P} .detail .facts div:last-child{border-bottom:0}
${P} .detail .facts dt{flex:none}
${P} .detail .facts div{border-bottom-style:dashed}
${P} .gallery-card,${P} .tree-box,${P} .sim{${plate};background:${stripe},var(--surface);padding-top:26px}
${P} .sheet-wrap{${plate};background:var(--surface)}
${P} .car-view,${P} .shot-btn,${P} .hh-pic,${P} .portrait{${plate};border-radius:2px}
${P} .hh-pic.none{border-style:dashed;box-shadow:none}
${P} .car-thumbs button{border-radius:1px}
${P} .sim-list a,${P} .fam,${P} .homes li,${P} .g-comments li,${P} .g-others a,${P} .bcard .units a{${small}}
${P} .rel-card{${small};border-left:3px solid var(--g)}
${P} .g-comments li{border-left:3px solid var(--h)}
${P} .fam:hover,${P} .sim-list a:hover{transform:none;border-color:color-mix(in srgb,var(--h) 70%,var(--card-line))}
${P} .traits span,${P} .tags span,${P} .packs span,${P} .roster .lvl,${P} .state{border-radius:2px}
${P} .traits span{box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--h) 28%,transparent)}
${P} .gal-link,${P} .tick,${P} .empty,${P} .note{border-radius:2px}
${P} .mini a{--k:var(--h);position:relative;gap:8px;padding:18px 8px 12px;background:var(--surface);${small.replace(/var\(--h\)/g, "var(--k)")}}
${P} .mini a::before{content:"";position:absolute;left:-1px;right:-1px;top:-1px;height:9px;border:1px solid color-mix(in srgb,var(--k) 70%,#1F2B33);
  background:repeating-linear-gradient(90deg,var(--k) 0 28px,color-mix(in srgb,var(--k) 35%,var(--strip-pale)) 28px 56px)}
${P} .mini .photo{border-radius:1px;box-shadow:inset 0 0 0 1px rgba(31,43,51,.35)}
${P} .mini b{display:flex;align-items:center;gap:9px;padding:0 4px;font-size:17px;text-transform:uppercase;letter-spacing:.11em}
${P} .mini b::before{content:"";flex:none;width:11px;height:11px;margin-top:-3px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);
  background:radial-gradient(circle,#FBF8F0 0 1.6px,var(--k) 2.1px);box-shadow:0 0 0 1px var(--pin-ring)}
${P} .mini a:hover b{color:var(--water)}
${P} .mini small{margin:0;padding:6px 4px 0;border-top:1px dashed var(--line);font-size:11px;letter-spacing:.1em;text-transform:uppercase;font-weight:600}
html[data-try-name="purple"] .brand b em,html[data-try-name="purple"] .topbar .brand-bar em{color:#5B4BB0}
html[data-try-name="purple"][data-mode="dark"] .brand b em,html[data-try-name="purple"][data-mode="dark"] .topbar .brand-bar em{color:#B7A8F7}
#jsw-try{position:fixed;z-index:60;right:14px;bottom:14px;display:grid;gap:6px;max-width:calc(100vw - 28px);padding:8px 10px;border-radius:12px;
  background:#fff;color:#1A1F2C;border:1px solid #E1E4EA;box-shadow:0 10px 30px -8px rgba(0,0,0,.35);font:600 12.5px system-ui,"Segoe UI",sans-serif}
#jsw-try>b{font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:#5B6170}
#jsw-try [role=group]{display:flex;flex-wrap:wrap;align-items:center;gap:3px}
#jsw-try [role=group]>span{font-size:11.5px;color:#4B5160;margin-right:4px;font-weight:500}
#jsw-try button{font:inherit;border:0;background:none;padding:5px 10px;min-height:28px;border-radius:99px;cursor:pointer;color:#1A1F2C}
#jsw-try button:hover{background:#F1F2F5}
#jsw-try button[aria-pressed="true"]{background:#1A1F2C;color:#fff}
#jsw-try button:focus-visible{outline:2px solid #5B4BB0;outline-offset:1px}
@media (max-width:700px){#jsw-try{right:8px;bottom:8px;padding:6px 8px}#jsw-try [role=group]>span{flex-basis:100%}}
@media print{#jsw-try{display:none}}`;
  const style = document.createElement("style");
  style.id = "jsw-try-style"; style.textContent = css;
  document.head.appendChild(style);

  const page = () => { if (/^#[lsh]-/.test(location.hash)) root.dataset.tryPage = ""; else delete root.dataset.tryPage; };
  addEventListener("hashchange", page); page();

  const box = document.createElement("div");
  box.id = "jsw-try"; box.setAttribute("aria-label", "Try");
  box.innerHTML = `<b>Try</b>` + OPTIONS.map((o, n) => `<div role="group" aria-label="${o.label}"><span>${o.label}</span>${o.opts.map(([v, t]) => `<button type="button" data-n="${n}" data-v="${v}">${t}</button>`).join("")}</div>`).join("");
  const set = (n, v, save) => {
    const o = OPTIONS[n]; if (!o.opts.some(x => x[0] === v)) v = o.opts[0][0];
    root.dataset[o.attr] = v;
    box.querySelectorAll(`button[data-n="${n}"]`).forEach(b => b.setAttribute("aria-pressed", String(b.dataset.v === v)));
    if (save) try { localStorage.setItem(o.key, v); } catch (e) {}
  };
  OPTIONS.forEach((o, n) => { let v = null; try { v = localStorage.getItem(o.key); } catch (e) {} set(n, v, false); });
  box.addEventListener("click", e => { const b = e.target.closest("button[data-v]"); if (b) set(+b.dataset.n, b.dataset.v, true); });
  document.body.appendChild(box);
})();
