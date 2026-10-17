// Prototype, 17 Oct: banner text over the maps. Reads the app's own files in site/ (data.js, app.js) and changes nothing.
// The banners are made by the app's own code (world() and hoodPage()), so "Now" is exactly what the app shows.
// They are drawn at her laptop's size (1280 × 800 window, banner 985 wide); measured.js holds the contrast measured by measure.py.
(function(){
const OPTS = [
  {k:"now", letter:"Now", name:"As it is now", note:"The app today."},
  {k:"a", letter:"A", name:"Soft shadow", note:"A soft dark shadow behind the small line, the title and the description. Colours unchanged."},
  {k:"b", letter:"B", name:"Darker fade", note:"The same deep shade, darker at the top and reaching further up the map."},
  {k:"c", letter:"C", name:"Dark side", note:"A dark wash on the left, behind the text only. The right of the map stays clear."},
  {k:"d", letter:"D", name:"Lighter text + shadow", note:"Slightly lighter brass and white, a brighter small line, and A’s shadow."},
  {k:"e", letter:"E", name:"C and D together", cls:"opt-c opt-d", note:"Added after measuring: the dark side from C with the lighter text and shadow from D."},
];
const SUBJECTS = [
  {key:"mt-komorebi", world:"mt-komorebi", why:"Snow behind the text, and the palest deep shade of all the worlds."},
  {key:"sulani", world:"sulani", why:"Bright sand and shallow sea. The whole title is brass."},
  {key:"oasis-springs", world:"oasis-springs", why:"Pale desert sand right behind the brass word."},
  {key:"britechester", world:"britechester", why:"A pale deep shade, so even the fade at the bottom is light."},
  {key:"san-myshuno", world:"san-myshuno", why:"Already dark (the night map): the options shouldn’t make it murky."},
  {key:"glimmerbrook", world:"glimmerbrook", why:"Bright sunset sky behind the small line and the title."},
  {key:"yukimatsu", hood:"mt-komorebi-yukimatsu", why:"Snowy slope and sky behind a white title."},
  {key:"crawdad-quarter", hood:"willow-creek-crawdad-quarter", why:"Willow Creek’s hardest banner: the white gazebo and pale paths sit right behind the small line."},
];
const RULE = {pack: 4.5, tw: 3, tb: 3, desc: 4.5};
const PART = {pack: "Small line", tw: "Title", tb: "Brass", desc: "Description"};
const M = window.MEASURED || null;
window.innerHeight = 800;   // her laptop's window height, which the app uses to zoom neighbourhood banners (measuring runs in a taller window)

// the app's own banner markup for a world or a neighbourhood
function heroFor(s){
  const t = document.createElement("template");
  if (s.world) t.innerHTML = world(worlds.find(w => w.id === s.world));
  else t.innerHTML = hoodPage(hoodIndex[s.hood]);
  return t.content.querySelector("section.hero").outerHTML;
}
const worldOf = s => s.world ? worlds.find(w => w.id === s.world) : hoodIndex[s.hood].world;
const titleOf = s => s.world ? esc(worldOf(s).name) : `${esc(hoodIndex[s.hood].name)}<small>Neighbourhood · ${esc(worldOf(s).name)}</small>`;
const frame = (s, o, hero) => { const w = worldOf(s);
  return `<div class="bp-scale"><div class="bp-frame ${o.cls || "opt-" + o.k}" data-opt="${o.k}" inert style="--deep:${w.deep[0]};--deep-2:${w.deep[1]}">${hero}</div></div>`; };
const letter = o => `<span class="bp-letter${o.k === "now" ? " now" : ""}">${o.letter}</span>`;
function nums(s, o){
  const m = M && M.subjects[s.key] && M.subjects[s.key][o.k];
  if (!m) return `<div class="bp-nums"><span>Not measured yet</span></div>`;
  return `<div class="bp-nums">${Object.keys(PART).filter(p => m[p] != null).map(p =>
    `<span class="${m[p] >= RULE[p] ? "ok" : "low"}" title="${PART[p]}: needs ${RULE[p]}">${PART[p]} <b>${m[p].toFixed(1)}</b></span>`).join("")}</div>`;
}

// measuring pass (measure.py): one subject, the five banners stacked at full size; the text's line boxes go in #rects
const q = new URLSearchParams(location.search), MK = q.get("measure");
if (MK) {
  document.body.classList.add("measuring");
  if (q.get("hide")) document.body.classList.add("hide-text");
  if (q.get("mark")) document.body.classList.add("mark-text");
  const s = SUBJECTS.find(x => x.key === MK) || (MK.startsWith("n:") ? {key: MK, hood: MK.slice(2)} : {key: MK, world: MK.slice(2)});
  const hero = heroFor(s);
  document.getElementById("bp").innerHTML = OPTS.map(o => frame(s, o, hero)).join("");
  const rectsOf = nodes => nodes.flatMap(n => { const r = document.createRange(); r.selectNodeContents(n);
    return [...r.getClientRects()].filter(b => b.width > 1 && b.height > 1).map(b => [b.left + scrollX, b.top + scrollY, b.width, b.height].map(v => +v.toFixed(2))); });
  const textNodes = (el, skip) => { const out = [], tw = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    while (tw.nextNode()) if (tw.currentNode.nodeValue.trim() && !(skip && tw.currentNode.parentElement.closest(skip))) out.push(tw.currentNode); return out; };
  document.fonts.ready.then(() => {
    const out = {subject: s.key, dpr: devicePixelRatio, fonts: document.fonts.check('128px "Instrument Serif"') && document.fonts.check('11px "Manrope"'),
      innerHeight, banners: [...document.querySelectorAll(".bp-frame")].map(f => {
      const h = f.querySelector(".hero"), lab = h.querySelector(".kicker .label"), h1 = h.querySelector("h1"), em = h1.querySelector("em"), p = h.querySelector(":scope>p");
      const b = h.getBoundingClientRect(), T = {};
      T.pack = {rects: rectsOf(textNodes(lab)), color: getComputedStyle(lab).color};
      const white = textNodes(h1, "em"); if (white.length) T.tw = {rects: rectsOf(white), color: getComputedStyle(h1).color};
      if (em) T.tb = {rects: rectsOf(textNodes(em)), color: getComputedStyle(em).color};
      if (p) T.desc = {rects: rectsOf(textNodes(p)), color: getComputedStyle(p).color};
      return {opt: f.dataset.opt, box: [b.left + scrollX, b.top + scrollY, b.width, b.height], view: h.style.getPropertyValue("--mapview"), targets: T};
    })};
    const el = document.createElement("script"); el.type = "application/json"; el.id = "rects"; el.textContent = JSON.stringify(out); document.body.append(el);
  });
  return;
}

// the page
const head = `<header class="bp-head"><span class="bp-tag">Prototype, 17 Oct</span>
  <h1>Banner text <em>over the maps</em></h1>
  <p>Six worlds and two neighbourhoods where the small line above the title (the pack name) and the brass word are hard to read, each as it is <b>now</b>, four ways to fix it (A to D), and C and D together (E). The fade at the bottom stays each world’s own deep shade in every option, so it still matches the neighbourhood cards.</p>
  <p>The numbers are the contrast measured behind the letters at 1280 wide (the faintest tenth of the background). The small line and the description need <b>4.5</b>, the big title <b>3</b>. Green dot: fine. Red dot: too faint.</p>
  <ul class="bp-opts">${OPTS.map(o => `<li><b>${letter(o)}${o.name}</b>${o.note}</li>`).join("")}</ul></header>`;
const bar = `<div class="bp-bar"><span class="label">Size</span><span class="bp-seg" role="group" aria-label="Banner size"><button type="button" data-size="half" aria-pressed="true">Side by side</button><button type="button" data-size="real" aria-pressed="false">Real size</button></span>
  <span class="label">Jump to</span><nav class="bp-jump">${SUBJECTS.map(s => `<a href="#s-${s.key}" data-jump="s-${s.key}">${s.world ? esc(worldOf(s).name) : esc(hoodIndex[s.hood].name)}</a>`).join("")}</nav></div>`;

function summary(){
  if (!M) return `<p class="bp-note">The contrast hasn’t been measured yet (run measure.py).</p>`;
  const row = o => { const c = p => { let n = 0, of = 0; SUBJECTS.forEach(s => { const m = (M.subjects[s.key] || {})[o.k]; if (m && m[p] != null) { of++; if (m[p] >= RULE[p]) n++; } }); return `${n} <small>of ${of}</small>`; };
    return `<tr><th>${letter(o)}${o.name}</th><td>${c("pack")}</td><td>${c("tw")}</td><td>${c("tb")}</td><td>${c("desc")}</td></tr>`; };
  return `<table class="bp-sum"><thead><tr><th>Readable on</th><th>Small line</th><th>Title (white)</th><th>Title (brass)</th><th>Description</th></tr></thead><tbody>${OPTS.map(row).join("")}</tbody></table>
    <p class="bp-note">${esc(M.note)}</p>`;
}
function section(s){
  const w = worldOf(s), hero = heroFor(s);
  return `<section class="bp-sec" id="s-${s.key}"><h2>${titleOf(s)}</h2><p>${s.why} Deep shade <span class="bp-swatch" style="background:${w.deep[0]}"></span>${w.deep[0]}, the same in every option.</p><div class="bp-grid">
    ${OPTS.map(o => `<figure class="bp-card"><figcaption>${letter(o)}${o.name}</figcaption>${frame(s, o, hero)}${nums(s, o)}</figure>`).join("")}
  </div></section>`;
}
document.getElementById("bp").innerHTML = head + bar + summary() + SUBJECTS.map(section).join("");

// size: side by side (half size, every option visible) or real size (as big as in the app)
const setSize = v => { document.body.classList.toggle("real", v === "real");
  document.querySelectorAll("[data-size]").forEach(b => b.setAttribute("aria-pressed", b.dataset.size === v)); try { localStorage.setItem("bp-size", v); } catch (e) {} };
document.addEventListener("click", e => { const b = e.target.closest("[data-size]"); if (b) setSize(b.dataset.size);
  // jump links scroll without changing the address (the app's code underneath would otherwise treat it as a page change)
  const j = e.target.closest("[data-jump]"); if (j) { e.preventDefault(); document.getElementById(j.dataset.jump).scrollIntoView({block: "start"}); } });
try { const v = localStorage.getItem("bp-size"); if (v) setSize(v); } catch (e) {}
})();
