// Admin, Progress (19 Nov): every filter and sort of its two tables (every lot, every household) gives counts that agree with
// each other and with the plan. Nothing here is a hard-coded number: the pages are compared with each other and with data.js.
const { test } = require('@playwright/test');
const { openApp, expect } = require('./helpers');

// in the page: choose a filter the way the select does (its change event), and read what the table shows
const TOOLS = () => {
  window.__t = {
    set(id, v) { const s = document.getElementById(id); s.value = v; if (s.value !== v) throw new Error(`${id} has no option ${v}`); s.dispatchEvent(new Event('change', {bubbles: true})); },
    opts: id => [...document.getElementById(id).options].map(o => o.value),
    shown(box) { const b = document.querySelector(`#${box} .showing b`), rows = document.querySelectorAll(`#${box} tbody tr`).length;
      const of = +/of (\d+)/.exec(document.querySelector(`#${box} .showing`).textContent)[1];
      if (+b.textContent !== rows) throw new Error(`${box}: says ${b.textContent}, shows ${rows} rows`); return {n: rows, of}; },
    sortBy(attr, key) { document.querySelector(`[${attr}="${key}"]`).click(); },
  };
};

test('every lot: each world, neighbourhood and status filter adds up, and agrees with the plan', async ({ page }) => {
  await openApp(page, 'admin-progress');
  await page.evaluate(TOOLS);
  const bad = await page.evaluate(() => {
    const t = window.__t, e = [], statuses = t.opts('f-status');
    const ok = {notbuilt: r => r.built === false, notshared: r => r.built === true && r.shared === false, nosims: r => r.sims === false, photos: r => !!r.photos, '': () => true};
    t.set('f-world', '');
    const total = t.shown('lot-rows').of;
    if (total !== ROWS.length) e.push(`"of ${total}" but the plan has ${ROWS.length} lots`);
    for (const s of statuses) {
      t.set('f-status', s);
      const all = t.shown('lot-rows').n, want = ROWS.filter(ok[s]).length;
      if (all !== want) e.push(`status "${s}": ${all} rows, the plan has ${want}`);
      let sumW = 0;
      for (const w of t.opts('f-world').filter(Boolean)) {
        t.set('f-world', w);
        if (document.getElementById('f-status').value !== s) e.push(`${w}: status filter lost`);
        const n = t.shown('lot-rows').n; sumW += n;
        if (n !== ROWS.filter(r => r.w === w && ok[s](r)).length) e.push(`${w} / "${s}": ${n} rows`);
        let sumH = 0;
        for (const h of t.opts('f-hood').filter(Boolean)) { t.set('f-hood', h); sumH += t.shown('lot-rows').n; }
        t.set('f-hood', '');
        if (sumH !== n) e.push(`${w} / "${s}": neighbourhoods add up to ${sumH}, the world shows ${n}`);
      }
      t.set('f-world', '');
      if (sumW !== all) e.push(`status "${s}": worlds add up to ${sumW}, all worlds show ${all}`);
    }
    t.set('f-status', '');
    return e;
  });
  expect(bad).toEqual([]);
});

test('every lot: each status shows only the rows it names (ticks in the table)', async ({ page }) => {
  await openApp(page, 'admin-progress');
  await page.evaluate(TOOLS);
  const bad = await page.evaluate(() => {
    const t = window.__t, e = [], cols = [...document.querySelectorAll('#lot-rows thead th')].map(th => th.textContent.replace(/[↑↓]/g, '').trim());
    const tick = (tr, name) => { const td = tr.children[cols.indexOf(name)], s = td.querySelector('.t'); return s ? (s.classList.contains('yes') ? true : s.classList.contains('no') ? false : 'n/a') : td.textContent.trim(); };
    const want = {notbuilt: tr => tick(tr, 'Built') === false, notshared: tr => tick(tr, 'Built') === true && tick(tr, 'Shared') === false,
      nosims: tr => tick(tr, 'Sims') === false, photos: tr => +tick(tr, 'Photos') > 0};
    for (const [s, f] of Object.entries(want)) {
      t.set('f-status', s);
      const rows = [...document.querySelectorAll('#lot-rows tbody tr')];
      if (!rows.length && s !== 'notbuilt') e.push(`${s}: no rows at all`);
      rows.filter(tr => !f(tr)).slice(0, 3).forEach(tr => e.push(`${s}: ${tr.innerText.replace(/\s+/g, ' ').slice(0, 80)}`));
    }
    return e;
  });
  expect(bad).toEqual([]);
});

test('every lot: each column sorts both ways, keeps every row, and puts blanks last', async ({ page }) => {
  await openApp(page, 'admin-progress');
  await page.evaluate(TOOLS);
  const bad = await page.evaluate(() => {
    const t = window.__t, e = [];
    const heads = [...document.querySelectorAll('#lot-rows thead th')].map(th => (th.querySelector('[data-sort]') || {dataset: {}}).dataset.sort);
    const col = {likes: heads.indexOf('likes'), dls: heads.indexOf('dls'), photos: heads.indexOf('photos')};
    const run = () => {
      const keys = [...document.querySelectorAll('#lot-rows [data-sort]')].map(b => b.dataset.sort);
      const rowsNow = () => [...document.querySelectorAll('#lot-rows tbody tr')].map(tr => [...tr.children].map(td => td.textContent).join('|'));   // text: links are checked in their own test
      const base = rowsNow().slice().sort();
      for (const k of keys) {
        t.sortBy('data-sort', k);
        if (statsState.sort !== k || statsState.dir !== 1) t.sortBy('data-sort', k);   // already sorted by it: one more click
        const up = rowsNow(), head = document.querySelector(`#lot-rows [data-sort="${k}"]`).textContent;
        if (!head.includes('↑')) e.push(`${k}: no ↑ on its header`);
        t.sortBy('data-sort', k);
        const down = rowsNow();
        if (!document.querySelector(`#lot-rows [data-sort="${k}"]`).textContent.includes('↓')) e.push(`${k}: no ↓ after a second click`);
        if (JSON.stringify(up.slice().sort()) !== JSON.stringify(base) || JSON.stringify(down.slice().sort()) !== JSON.stringify(base)) e.push(`${k}: rows lost or added`);
        // blanks (no Gallery numbers) stay at the end both ways; everything else is exactly reversed
        const blank = row => ['likes', 'dls'].includes(k) && row.split('|')[col[k]].trim() === '';   // no Gallery numbers (photos: an empty cell is 0)
        const fu = up.filter(h => !blank(h)), fd = down.filter(h => !blank(h));
        if (JSON.stringify(fu.slice().reverse()) !== JSON.stringify(fd)) e.push(`${k}: ↓ isn't ↑ reversed`);
        if (up.findIndex(blank) >= 0 && up.slice(up.findIndex(blank)).some(h => !blank(h))) e.push(`${k}: blanks not last going up`);
        if (down.findIndex(blank) >= 0 && down.slice(down.findIndex(blank)).some(h => !blank(h))) e.push(`${k}: blanks not last going down`);
        // numbers really go up
        if (['likes', 'dls', 'photos'].includes(k)) {
          const nums = down.map(r => r.split('|')[col[k]].trim()).filter(x => x || k === 'photos').map(Number);
          if (nums.some((x, j) => j && x > nums[j - 1])) e.push(`${k}: not going down after the second click`); }
      }
    };
    run();                                                        // all worlds
    t.set('f-world', worlds.find(w => w.owned && w.ready).name);   // and inside one world's filter
    run();
    t.set('f-world', '');
    return e;
  });
  expect(bad).toEqual([]);
});

test('every lot: search narrows the rows, and a world’s name finds at least that world’s lots', async ({ page }) => {
  await openApp(page, 'admin-progress');
  await page.evaluate(TOOLS);
  const w = await page.evaluate(() => { const w = worlds.find(w => w.owned && w.ready); window.__t.set('f-world', w.name); const n = window.__t.shown('lot-rows').n; window.__t.set('f-world', ''); return {name: w.name, n}; });
  const showing = () => page.locator('#lot-rows .showing b').innerText().then(Number);
  const all = await showing();
  await page.fill('#f-q', w.name.toUpperCase());
  await expect.poll(showing).toBeLessThan(all);
  expect(await showing()).toBeGreaterThanOrEqual(w.n);
  await page.fill('#f-q', 'zzzz no such lot');
  await expect.poll(showing).toBe(0);
  await page.fill('#f-q', '');
  await expect.poll(showing).toBe(all);
});

test('every household: each world, neighbourhood and status filter adds up, and the statuses split them cleanly', async ({ page }) => {
  await openApp(page, 'admin-progress');
  await page.evaluate(TOOLS);
  const bad = await page.evaluate(() => {
    const t = window.__t, e = [], n = () => t.shown('hh-rows').n, all = hhList().length;
    t.set('h-status', '');
    if (n() !== all || t.shown('hh-rows').of !== all) e.push(`all: ${n()} of ${t.shown('hh-rows').of}, the plan has ${all}`);
    const count = {};
    for (const s of t.opts('h-status')) {
      t.set('h-status', s); count[s] = n();
      let sumW = 0;
      for (const w of t.opts('h-world').filter(Boolean)) {
        t.set('h-world', w);
        if (document.getElementById('h-status').value !== s) e.push(`${w}: status filter lost`);
        const nw = n(); sumW += nw; let sumH = 0;
        for (const h of t.opts('h-hood').filter(Boolean)) { t.set('h-hood', h); sumH += n(); }
        t.set('h-hood', '');
        if (sumH !== nw) e.push(`${w} / "${s}": neighbourhoods add up to ${sumH}, the world shows ${nw}`);
      }
      t.set('h-world', '');
      if (sumW !== count[s]) e.push(`status "${s}": worlds add up to ${sumW}, all worlds show ${count[s]}`);
    }
    t.set('h-status', '');
    if (count.made + count.notmade !== all) e.push(`made ${count.made} + not made ${count.notmade} ≠ ${all}`);
    if (count.ea + count.yours > all) e.push(`EA ${count.ea} + yours ${count.yours} > ${all}`);
    if (count.nosims > count.notmade) e.push(`no Sims ${count.nosims} > not made ${count.notmade}`);
    // the header line agrees with the filters
    const head = document.querySelector('#hh-sheet .block-head .count').textContent;
    if (!head.includes(`${count.made} of ${all} with Sims made`) || !head.includes(`${count.nosims} with no Sims yet`)) e.push(`header: ${head}`);
    return e;
  });
  expect(bad).toEqual([]);
});

test('every household: each column sorts both ways and keeps every row; search finds households by a Sim’s name', async ({ page }) => {
  await openApp(page, 'admin-progress');
  await page.evaluate(TOOLS);
  const bad = await page.evaluate(() => {
    const t = window.__t, e = [], rowsNow = () => [...document.querySelectorAll('#hh-rows tbody tr')].map(tr => tr.innerHTML);
    const base = rowsNow().slice().sort();
    for (const k of [...document.querySelectorAll('#hh-rows [data-hsort]')].map(b => b.dataset.hsort)) {
      t.sortBy('data-hsort', k); if (hhState.sort !== k || hhState.dir !== 1) t.sortBy('data-hsort', k);
      const up = rowsNow(); t.sortBy('data-hsort', k); const down = rowsNow();
      if (JSON.stringify(up.slice().sort()) !== JSON.stringify(base) || JSON.stringify(down.slice().sort()) !== JSON.stringify(base)) e.push(`${k}: rows lost or added`);
      if (JSON.stringify(up.slice().reverse()) !== JSON.stringify(down)) e.push(`${k}: ↓ isn't ↑ reversed`);
      if (k === 'sims') { const nums = [...document.querySelectorAll('#hh-rows tbody tr td.num')].map(td => +td.textContent); if (nums.some((x, j) => j && x > nums[j - 1])) e.push('sims: not going down'); }
    }
    return e;
  });
  expect(bad).toEqual([]);
  const hh = await page.evaluate(() => { const h = hhList().find(h => h.sims.length > 1 && h.sims.every(s => !h.name.includes(s.name.split(' ')[0])));
    return h && {id: h.id, sim: h.sims[0].name.split(' ')[0]}; });
  await page.fill('#h-q', hh.sim);
  await expect(page.locator(`#hh-rows tbody a[href="#${hh.id}"]`)).toHaveCount(1);
  const n = await page.locator('#hh-rows .showing b').innerText();
  expect(await page.locator('#hh-rows tbody tr').count()).toBe(+n);
});

// fixed 19 Nov: notOwnedLinks() runs only when a page is drawn, so after a sort or filter the not-owned worlds' lots on Progress become links to "Page not found"
test('every lot: after sorting or filtering, lots in worlds she doesn’t own are still plain text, not links', async ({ page }) => {
  await openApp(page, 'admin-progress');
  const dead = () => page.evaluate(() => [...document.querySelectorAll('#lot-rows a[href^="#"]')].map(a => a.getAttribute('href').slice(1))
    .filter(k => !lotIndex[k] && !hhIndex[k] && !SIM_PAGES[k] && !GROUP_PAGES[k]).length);
  expect(await dead()).toBe(0);
  await page.locator('#lot-rows [data-sort="name"]').click();
  expect(await dead()).toBe(0);
});
