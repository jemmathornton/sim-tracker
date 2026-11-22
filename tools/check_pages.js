// Page check: open the app in the browser preview (launch config "app"), then run this file's contents in the page
// (Claude: javascript_tool with the text of this file). It draws every page and reports:
//   errors     - code errors while drawing a page
//   badLinks   - links to pages that don't exist
//   junk       - "undefined", "NaN", "null" or "[object Object]" showing as text
//   overflow   - pages wider than the window (at the current window width)
// Expect: {"pages": 1,100+, "problems": []}. Takes a few seconds.
(() => {
  // draw a page directly (changing the address hundreds of times in a row gets throttled by the browser)
  const render = (0, eval)('(' + route.toString().replace(/^function route\(\)\{/, 'function(key0){').replace('location.hash.slice(1) || "home"', 'key0') + ')');
  const keys = ['home', 'stats', 'calendar', ...worlds.filter(w => w.ready).flatMap(w => ['stats-' + w.id, 'w-' + w.id, 'f-' + w.id, ...w.hoods.map(h => 'n-' + h.id)]),
    ...Object.keys(lotIndex), ...Object.keys(hhIndex), ...Object.keys(typeof SIM_PAGES === 'object' ? SIM_PAGES : {}), ...Object.keys(typeof GROUP_PAGES === 'object' ? GROUP_PAGES : {}),
    ...(typeof SECTION_KEYS === 'function' ? SECTION_KEYS() : [])];   // js/sections.js: Calendar, Across the worlds and Admin pages
  const valid = new Set(keys), problems = [], view = document.getElementById('view');
  for (const k of keys) {
    const p = {k};
    try { render(k); } catch (e) { p.error = e.message; }
    const bad = [...document.querySelectorAll('a[href^="#"]:not([data-jj-top])')].map(a => a.getAttribute('href').slice(1)).filter(h => h && !valid.has(h));   // the footer's Back to top (data-jj-top, the family's) scrolls, it never opens #top
    if (bad.length) p.badLinks = [...new Set(bad)].slice(0, 5);
    const junk = view.innerText.match(/\b(undefined|NaN|null|\[object Object\])\b/g);
    if (junk) p.junk = junk.slice(0, 3);
    if (!view.innerText.trim()) p.empty = true;
    const over = document.documentElement.scrollWidth - document.documentElement.clientWidth;
    if (over > 1) p.overflow = over;
    if (Object.keys(p).length > 1) problems.push(p);
  }
  render(location.hash.slice(1) || 'home');
  return {pages: keys.length, problems: problems.slice(0, 30), more: Math.max(0, problems.length - 30)};
})()
