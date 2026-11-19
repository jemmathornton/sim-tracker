// "New since you looked" with a remembered visit (19 Nov): the browser's memory (localStorage "jsw-seen-v1") is set up as if she
// last looked a while ago, then the pages are checked: At a glance, the New pills on cards, the lot page itself, and opening a
// lot clearing it. The memory is made from the page's own numbers, so new Gallery numbers each week never break it.
// Each test runs in a fresh browser profile, so nothing remembered here reaches another test.
const { test } = require('@playwright/test');
const { openApp, go, expect } = require('./helpers');

const reload = async page => { await page.reload(); await page.waitForFunction(() => typeof SECTION_KEYS === 'function' && document.querySelector('#view').innerHTML.length > 0); };

test('a remembered visit: new uploads, more favourites and new comments are New until each lot is opened', async ({ page }) => {
  await openApp(page);
  const p = await page.evaluate(() => {
    const L = admOwned().filter(l => l.gallery), used = new Set(), pick = f => { const l = L.find(l => !used.has(l) && f(l)); if (l) used.add(l); return l; };
    const fresh = pick(l => !l.versions), favs = pick(l => !l.versions && l.gallery.likes >= 3), com = pick(l => !l.versions && theirs(l).length >= 1),
      cs = pick(l => l.versions), fewer = pick(l => !l.versions);
    const mem = JSON.parse(localStorage.getItem('jsw-seen-v1'));
    delete mem[fresh.id];
    mem[favs.id] = [favs.gallery.likes - 3, theirs(favs).length];
    mem[com.id] = [com.gallery.likes, theirs(com).length - 1];
    mem[cs.id] = [cs.versions.reduce((n, v) => n + v.likes, 0) - 1, theirs(cs).length];
    mem[fewer.id] = [fewer.gallery.likes + 2, theirs(fewer).length];   // EA sometimes takes a favourite or two away: not new
    localStorage.setItem('jsw-seen-v1', JSON.stringify(mem));
    const x = l => ({id: l.id, name: curly(l.name), hood: l.hood.id});
    return {fresh: x(fresh), favs: x(favs), com: x(com), cs: x(cs), fewer: x(fewer)};
  });
  await reload(page);
  const fresh = () => page.evaluate(() => admOwned().filter(l => newSince(l)).map(l => [l.id, newTxt(newSince(l))]));
  expect(Object.fromEntries(await fresh())).toEqual({[p.fresh.id]: 'New on the Gallery', [p.favs.id]: '3 new favourites', [p.com.id]: '1 new comment', [p.cs.id]: '1 new favourite'});

  // At a glance lists them
  await go(page, 'admin');
  const card = page.locator('#view .adm-card', {hasText: 'New since you looked'});
  await expect(card.locator('b.big')).toHaveText('4');
  for (const k of ['fresh', 'favs', 'com', 'cs']) await expect(card.locator(`a[href="#${p[k].id}"]`)).toHaveCount(1);
  await expect(card).toContainText('3 new favourites');

  // the New pill on its neighbourhood card, with what's new in its tooltip; none on the lot that lost favourites
  await go(page, 'n-' + p.favs.hood);
  await expect(page.locator(`#view a.listing[href="#${p.favs.id}"] .pill.new`)).toHaveAttribute('title', '3 new favourites since you last looked');
  await go(page, 'n-' + p.fewer.hood);
  await expect(page.locator(`#view a.listing[href="#${p.fewer.id}"] .pill.new`)).toHaveCount(0);

  // the lot page says it once, and opening it clears it
  await go(page, p.favs.id);
  await expect(page.locator('#view .new-since')).toHaveText('3 new favourites since you last looked');
  await go(page, 'n-' + p.favs.hood);
  await expect(page.locator(`#view a.listing[href="#${p.favs.id}"] .pill.new`)).toHaveCount(0);
  await go(page, p.favs.id);
  await expect(page.locator('#view .new-since')).toHaveCount(0);

  // a Community Space lot: switching its version tab doesn't bring it back
  await go(page, p.cs.id);
  await page.locator('[data-ver="1"]').click();
  await go(page, 'admin');
  await expect(card.locator('b.big')).toHaveText('2');

  // remembered across a reload (her browser keeps it)
  await reload(page);
  expect((await fresh()).map(([id]) => id).sort()).toEqual([p.fresh.id, p.com.id].sort());
});

test('a lot that is new again shows only what changed since it was last opened', async ({ page }) => {
  await openApp(page);
  const id = await page.evaluate(() => { const l = admOwned().find(l => l.gallery && !l.versions && l.gallery.likes >= 1 && theirs(l).length >= 2);
    if (!l) return null; const mem = JSON.parse(localStorage.getItem('jsw-seen-v1')); mem[l.id] = [l.gallery.likes - 1, theirs(l).length - 2];
    localStorage.setItem('jsw-seen-v1', JSON.stringify(mem)); return l.id; });
  test.skip(!id, 'no lot with comments from others');
  await reload(page);
  await go(page, id);
  await expect(page.locator('#view .new-since')).toHaveText('1 new favourite, 2 new comments since you last looked');
});

test('a broken memory in the browser is treated as a first visit, not an error', async ({ page }) => {
  await page.addInitScript(() => { try { if (!sessionStorage.getItem('x')) { localStorage.setItem('jsw-seen-v1', '{not json'); sessionStorage.setItem('x', '1'); } } catch (e) {} });
  const errors = await openApp(page);
  expect(errors).toEqual([]);
  expect(await page.evaluate(() => admOwned().filter(l => newSince(l)).length)).toBe(0);
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('jsw-seen-v1')) !== null)).toBe(true);
});
