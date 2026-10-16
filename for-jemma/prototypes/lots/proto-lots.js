// Prototypes, 17 Oct: shared helpers for the pages in this folder.
// They read the site's own data (site/js/data.js) and icons (site/js/icons.js) and change nothing.
const SITE = "../../../site/";
// pictures go into CSS variables that site.css reads, so they need full addresses (a short path would be read from site.css's folder)
const PIC = new URL(SITE, location.href).href;
const ic = n => (ICONS[n] || "").replace("<svg ", '<svg class="i" aria-hidden="true" ');
// as on the site: curly apostrophes in shown text; ids, links and data keys stay straight
const curly = s => String(s ?? "").replace(/(^|[\s(\[“"—-])'/g, "$1‘").replace(/'/g, "’");
const esc = s => curly(s).replace(/[&<>"]/g, c => ({"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;"}[c]));
const attr = s => String(s ?? "").replace(/[&<>"]/g, c => ({"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;"}[c]));
const slug = s => String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const count = (n, one, many = one + "s") => `${n} ${n === 1 ? one : many}`;
const sizeTxt = s => s && s !== "N/A" ? s.replace("x", " × ") : "";

// Rentals whose plan names a group rather than households (TODO §2, 16 Oct): how many households, and which units, isn't decided
const GROUP_LABELS = {"Oasis Springs|Rio Verde": "Elders", "Newcrest|Fern Park": "BFF", "Newcrest|Midtown Meadows": "Single Mum Friends",
  "Del Sol Valley|Inner Circle": "Roomies", "Del Sol Valley|Upland Place": "Eclectic Arts", "Tomarang|Sungai Point": "Linh-Sadya & Linh",
  "Tomarang|Isda Riverfront": "Rochana/Caberry"};
// Bedrooms per unit where her Building save has them for every unit (research/rental-units.md; shared rentals only)
const SAVE_UNIT_BEDS = {"San Sequoia|Manzanita Terrace": [3, 3], "Nordhaven|Old Torget House": [3, 3]};   // [bedrooms, bathrooms]

const WORLDS = DATA.worlds.filter(w => w.owned), LOTS = [];
WORLDS.forEach(w => { w.id = slug(w.name); w.hoods.forEach(h => h.lots.forEach(l => { l.world = w; l.hood = h; LOTS.push(l); }));
  // as on the site, a surname on more than one home is numbered: "Davidson 1", "Davidson 2"
  const homes = w.hoods.flatMap(h => h.lots).filter(l => l.who && l.sims !== "N/A" && !/\s+own\??$/i.test(l.who)), base = l => l.who.replace(/\?$/, "").trim(), total = {}, seen = {};
  homes.forEach(l => total[base(l)] = (total[base(l)] || 0) + 1);
  homes.forEach(l => { const b = base(l); l.hhName = total[b] > 1 ? `${b} ${seen[b] = (seen[b] || 0) + 1}` : b; }); });
LOTS.forEach(prep);

function prep(l){
  const w = l.world, key = w.name + "|" + l.lot;
  l.key = key; l.link = SITE + "index.html#l-" + slug(w.name) + "--" + slug(l.lot);
  // the name rule: her chosen spelling, then her Gallery title, then her own name (unless just "?"), then the in-game name
  const mine = l.mine && l.mine.trim() && !/^\?+$/.test(l.mine.trim()) ? l.mine.trim() : null;
  l.name = DATA.nameFix[key] || l.gallery?.title || mine || l.lot; l.ea = l.name !== l.lot ? l.lot : null;
  // the type without her bracketed planning notes or unit counts, as a filter needs it
  l.kind = (l.type || "To be decided").replace(/\s*\([^)]*\)?/g, "").trim() || "To be decided";
  l.apt = /apartment|penthouse/i.test(l.kind);
  l.home = l.sims !== "N/A" && l.kind !== "To be decided";
  l.traitList = [...new Set([...(l.traits || []), ...(l.units || []).flatMap(u => u.traits || [])])];
  l.challengeList = [...new Set([...(l.challenges || []), ...(l.units || []).flatMap(u => u.challenges || [])])];
  // who lives here in the plan: the household (a landlord who lives on another lot doesn't count), then any tenants
  const who = [];
  if (l.who) { const own = /\s+own\??$/i.test(l.who), base = l.who.replace(/\s+own\??$/i, "").trim();
    const elsewhere = own && w.hoods.some(h => h.lots.some(o => o !== l && o.who === base && o.sims !== "N/A"));
    l.landlord = own || (DATA.tenants[key] && !(DATA.noLandlord || []).includes(key)) ? base : null; l.landlordAway = elsewhere;
    l.hhName ||= base;
    if (!elsewhere) who.push({name: l.hhName, landlord: !!l.landlord}); }
  (DATA.tenants[key] || []).forEach(t => who.push({name: t.name}));
  l.residents = who;
  // a rental's units: names and traits from her save, the count from her plan's "(N)"; households fill the first units, as on the rental cards
  const n = /residential rental/i.test(l.type || "") ? +((/\((\d+)\)/.exec(l.type) || [])[1] || (l.units || []).length) : 0;
  if (n) l.unitList = Array.from({length: n}, (_, i) => { const u = (l.units || [])[i] || {}, nm = u.name;
    return {name: !nm ? `Unit ${i + 1}` : nm.length <= 4 ? `Unit ${nm}` : nm, traits: u.traits || [], challenges: u.challenges || [], who: who[i] || null,
      beds: SAVE_UNIT_BEDS[key]}; });
  l.free = l.unitList ? l.unitList.filter(u => !u.who).length : 0;
  // a note when a household is planned but not decided
  l.planNote = /to be decided/i.test(l.whoNote) ? "Household to be decided"
    : /uni sims/i.test(l.whoNote) ? "Planned for current uni Sims; which ones isn’t decided"
    : GROUP_LABELS[key] && l.free ? `Planned for ${GROUP_LABELS[key]}: how many households, and which units, isn’t decided` : "";
}
// two special lots have "N/A" for built and shared (Plumbob Pictures, the secret lab)
const progressOf = l => l.shared === true ? "Shared" : l.built === true ? "Built, not shared" : l.built === false ? "Not built yet" : "Not applicable";

// bedrooms where known: her in-game count on the Gallery card (shared lots), else her plan note ("2 Bed")
// (short: "2 bed · 1 bath", for tables)
function bedrooms(l, short){
  const g = l.gallery, b = short ? n => `${n} bed` : n => count(n, "bedroom"), ba = short ? n => `${n} bath` : n => count(n, "bathroom");
  if (g?.beds) return `${b(g.beds)}${g.baths ? ` · ${ba(g.baths)}` : ""}${l.unitList ? " in all" : ""}`;
  if (/\bbed/i.test(l.whoNote || "")) return `<span class="plan">Plan: “${esc(l.whoNote)}”</span>`;
  return "";
}
const unitBeds = (u, short) => !u.beds ? "" : short ? `${u.beds[0]} bed · ${u.beds[1]} bath` : `${count(u.beds[0], "bedroom")} · ${count(u.beds[1], "bathroom")}`;
// lot traits as pills (cards), challenges dashed; or as plain text (tables), challenges in italics
const traitText = (traits, challenges) => [...traits.map(esc), ...challenges.map(t => `<i class="ch-txt" title="Lot challenge">${esc(t)}</i>`)].join(", ");
const traitPills = (traits, challenges) => traits.length || challenges.length
  ? `<span class="traits">${traits.map(t => `<span>${esc(t)}</span>`).join("")}${challenges.map(t => `<span class="bonus" title="Lot challenge">${esc(t)}</span>`).join("")}</span>` : "";

// the lot plan drawing the site shows when there's no picture (copied from site/js/app.js)
function plot(size, px){
  const m = /^(\d+)x(\d+)$/.exec(size || ""), pad = 4, box = px - pad * 2;
  if (!m) return `<svg class="plot-svg" viewBox="0 0 ${px} ${px}" aria-hidden="true"><rect class="frame" x="${pad}" y="${pad}" width="${box}" height="${box}" rx="4"/></svg>`;
  const W = +m[1], D = +m[2], s = box / 64, w = W * s, d = D * s, x = pad + (box - w) / 2, y = pad + (box - d) / 2;
  let t = ""; for (let i = 5; i < W; i += 5) t += `<line x1="${x + i * s}" y1="${y}" x2="${x + i * s}" y2="${y + d}"/>`; for (let j = 5; j < D; j += 5) t += `<line x1="${x}" y1="${y + j * s}" x2="${x + w}" y2="${y + j * s}"/>`;
  return `<svg class="plot-svg" viewBox="0 0 ${px} ${px}" role="img" aria-label="${W} by ${D} lot"><rect class="frame" x="${pad}" y="${pad}" width="${box}" height="${box}" rx="4"/><rect class="ground" x="${x}" y="${y}" width="${w}" height="${d}" rx="2"/>${t}</svg>`;
}
const dots = l => [["built", "hammer", "Built"], ["shared", "share", "Shared"], ["sims", "sim", "Sims made"]].filter(([k]) => l[k] === true || l[k] === false)
  .map(([k, n, t]) => `<span class="${l[k] ? "yes" : ""}" title="${t}: ${l[k] ? "yes" : "not yet"}">${ic(n)}</span>`).join("");
const typeLabel = l => l.unitList ? `Residential Rental · ${l.unitList.length} units` : l.kind;
// the picture part of a lot card, as on the site
function photo(l){
  const p = l.photos[0];
  return `<div class="photo ${p ? "shot" : ""}" ${p ? `style="--img:url('${attr(PIC + p.thumb)}')"` : ""}>${p ? "" : l.apt ? `<span class="apt-art">${ic("home")}</span>` : plot(l.size, 120)}
    <span class="type">${esc(typeLabel(l))}</span><span class="status">${dots(l)}</span>${sizeTxt(l.size) && !l.apt ? `<span class="size">${sizeTxt(l.size)}</span>` : ""}</div>`;
}