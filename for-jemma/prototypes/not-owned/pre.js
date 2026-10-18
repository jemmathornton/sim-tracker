// Prototype, 18-19 Oct: families in worlds she doesn't own yet. Runs after js/data.js and before js/app.js, and changes only
// the copy of DATA in this page (nothing on disk). Names start with p / P_ so they never clash with the app's own.
// Settings come from the address: ?opt=A|B|C (which way to show them) and &sis=0 to leave out the Juliette-Tybalt link.
const P_OPT = (() => { const q = new URLSearchParams(location.search), o = (q.get("opt") || "A").toUpperCase();
  return {opt: ["A", "B", "C"].includes(o) ? o : "A", sis: q.get("sis") !== "0"}; })();

// 1. The build keeps a not-owned world's lots only in DATA.stats. Give those worlds back the neighbourhoods and lots their
//    households live on (homes only), so app.js makes the households, Sims, trees and dynasties exactly as for owned worlds.
//    Port: in tools/build.py, keep the household lots of not-owned worlds (marked "notOwned") instead of `continue`.
DATA.worlds.filter(w => !w.owned && DATA.households[w.name]).forEach(w => {
  const names = Object.keys(DATA.households[w.name]), hoods = {};
  DATA.stats.filter(r => r.w === w.name && r.who && names.includes(r.who.replace(/\?$/, "").trim())).forEach(r =>
    (hoods[r.n] ||= {name: r.n, desc: "", color: w.color, lots: []}).lots.push({lot: r.lot, mine: r.mine, type: r.type, size: r.size,
      who: r.who, whoNote: null, built: r.built, shared: r.shared, sims: r.sims, gallery: null, photos: []}));
  w.hoods = Object.values(hoods);
});

// 2. Juliette is Tybalt Capp's sister in the game, but nothing links them, so she can't be on the Capp tree without it.
//    Shown here as two empty parent boxes (audit question 9: "share two empty parent boxes?"). Turn off with &sis=0.
if (P_OPT.sis) {
  DATA.people["p-capp-father"] = {name: "Unknown", sex: "m", placeholder: true};
  DATA.people["p-capp-mother"] = {name: "Unknown", sex: "f", placeholder: true};
  const capp = ((DATA.households.Ondarion || {}).Capp || {}).sims || [], mc = ((DATA.households.Tartosa || {}).Monticapp || {}).sims || [];
  [...capp, ...mc].filter(s => s.id === "tybalt-capp" || s.id === "juliette-monty").forEach(s => s.parents = ["p-capp-father", "p-capp-mother"]);
}
