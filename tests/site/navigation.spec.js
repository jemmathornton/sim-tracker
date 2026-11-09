// Getting around: the sidebar, world → neighbourhood → lot → household → Sim by clicking, back and forward,
// the Across the worlds and Admin sections, old Stats links, unknown links and search.
const { test } = require('@playwright/test');
const { openApp, go, viewText, expect } = require('./helpers');

// a path through the data that exists today (picked live, so it never goes stale): a lot on its own card with a
// household that lives there and has a Sim with a page
const pickPath = page => page.evaluate(() => {
  for (const w of worlds.filter(w => w.owned && w.ready)) for (const x of w.hoods) for (const l of x.lots) {
    if (l.building || !l.hh || l.owned || l.hh.tenantOf) continue;
    const sm = l.hh.sims.find(s => s.sid && SIM_PAGES['s-' + s.sid]);
    if (sm) return {world: w.id, worldName: w.name, hood: x.id, lot: l.id, lotName: l.name, hh: l.hh.id, sim: 's-' + sm.sid, simName: sm.name};
  }
});

test('world → neighbourhood → lot → household → Sim by clicking, then back and forward', async ({ page }) => {
  const errors = await openApp(page);
  const p = await pickPath(page);
  expect(p).toBeTruthy();
  await page.locator(`#nav a[href="#w-${p.world}"]`).click();
  await expect(page).toHaveURL(new RegExp(`#w-${p.world}$`));
  await expect(page.locator(`#nav a[href="#w-${p.world}"]`)).toHaveClass(/\bon\b/);
  await page.locator(`#view a[href="#n-${p.hood}"]`).first().click();
  await expect(page).toHaveURL(new RegExp(`#n-${p.hood}$`));
  await page.locator(`#view a.listing[href="#${p.lot}"]`).click();
  await expect(page).toHaveURL(new RegExp(`#${p.lot}$`));
  await expect(page.locator('#view h1')).toContainText(p.lotName.split(' ').at(-1).replace(/'/g, '’'));
  await expect(page.locator(`#nav a[href="#${p.lot}"]`)).toHaveClass(/\bcur\b/);
  await page.locator(`#view a[href="#${p.hh}"]`).first().click();
  await expect(page).toHaveURL(new RegExp(`#${p.hh}$`));
  await page.locator(`#view a[href="#${p.sim}"]`).first().click();
  await expect(page).toHaveURL(new RegExp(`#${p.sim}$`));
  await expect(page.locator('#view')).toContainText(p.simName.replace(/'/g, '’'));
  await expect(page).toHaveTitle(/Jemma’s Sim World/);
  for (const back of [p.hh, p.lot, 'n-' + p.hood, 'w-' + p.world]) { await page.goBack(); await expect(page).toHaveURL(new RegExp(`#${back}$`)); }
  await page.goForward();
  await expect(page).toHaveURL(new RegExp(`#n-${p.hood}$`));
  await expect(page.locator(`#view a.listing[href="#${p.lot}"]`)).toBeVisible();
  expect(errors).toEqual([]);
});

test('every Across the worlds and Admin link in the sidebar opens its page', async ({ page }) => {
  const errors = await openApp(page);
  const links = [['calendar', 'Calendar'], ['clubs', 'Clubs'], ['dynasties', 'Dynasties'], ['organisations', 'University organisations'],
    ['families', 'Families'], ['businesses', 'Businesses'], ['admin', 'At a glance'], ['admin-progress', 'Progress'], ['admin-game', 'Notes']];
  for (const [key, name] of links) {
    const a = page.locator(`#nav a[href="#${key}"]`);
    await expect(a, name).toContainText(name);
    await a.click();
    await expect(page).toHaveURL(new RegExp(`#${key}$`));
    await expect(page.locator(`#nav a[href="#${key}"]`)).toHaveClass(/\bon\b/);
    expect((await viewText(page)).trim().length, name).toBeGreaterThan(20);
  }
  expect(errors).toEqual([]);
});

test('old Stats links open Admin, Progress', async ({ page }) => {
  await openApp(page);
  const w = await page.evaluate(() => worlds.find(w => w.owned && w.ready).id);
  for (const key of ['stats', 'stats-' + w]) {
    await go(page, key);
    await expect(page).toHaveTitle(/^Progress · Admin/);
    await expect(page.locator('#nav a[href="#admin-progress"]')).toHaveClass(/\bon\b/);
    await expect(page.locator('#view #lot-rows')).toBeAttached();
  }
});

test('a link to nothing shows Page not found, with a way home', async ({ page }) => {
  await openApp(page, 'l-nowhere--no-such-lot');
  await expect(page.locator('#view')).toContainText('Page not found');
  await page.locator('#view a[href="#home"]').click();
  await expect(page.locator('#view')).not.toContainText('Page not found');
});

test('worlds you don’t own are greyed in the sidebar and don’t open', async ({ page }) => {
  await openApp(page);
  const notOwned = await page.evaluate(() => worlds.filter(w => !w.owned).map(w => w.id));
  for (const id of notOwned.slice(0, 3)) {
    await expect(page.locator(`#nav a[href="#w-${id}"]`)).toHaveCount(0);
    await go(page, 'w-' + id);
    await expect(page.locator('#view')).toContainText('Page not found');
  }
});

test('search finds a lot by name and Enter opens it; Escape puts the sidebar back', async ({ page }) => {
  await openApp(page);
  const p = await pickPath(page);
  await page.fill('#q', p.lotName);
  await expect(page.locator(`#nav a.hit[href="#${p.lot}"]`)).toBeVisible();
  // the first hit is the best match: move to this lot's hit, then Enter
  const i = await page.locator('#nav a.hit').evaluateAll((as, id) => as.findIndex(a => a.getAttribute('href') === '#' + id), p.lot);
  for (let k = 0; k < i; k++) await page.press('#q', 'ArrowDown');
  await page.press('#q', 'Enter');
  await expect(page).toHaveURL(new RegExp(`#${p.lot}$`));
  await expect(page.locator('#q')).toHaveValue('');
  await page.fill('#q', 'zzzz no such thing');
  await expect(page.locator('#nav')).toContainText('Nothing found');
  await page.press('#q', 'Escape');
  await expect(page.locator('#nav a[href="#admin"]')).toBeVisible();
});

test('search ignores accents, apostrophes and case', async ({ page }) => {
  await openApp(page);
  const r = await page.evaluate(() => {
    const l = Object.values(lotIndex).find(l => l.world.owned && l.world.ready && /[’'é]/.test(l.name));
    if (!l) return null;
    const plain = l.name.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[’']/g, '').toUpperCase();
    return {id: l.id, plain, found: search(plain).some(h => h.href === '#' + l.id)};
  });
  test.skip(!r, 'no lot with an accent or apostrophe');
  expect(r.found, r.plain).toBe(true);
});
