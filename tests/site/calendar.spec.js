// The Calendar (19 Nov): every season's month of weeks, the holidays on their days, the world filter (each world's own
// calendar), the kinds ticked and remembered, and every event reachable from the whole-save calendar. Compared with the page's
// own data (CAL, calEvents), never with typed-in numbers.
const { test } = require('@playwright/test');
const { openApp, go, expect } = require('./helpers');

const evs = page => page.locator('#view .month a.m-ev');

test('each season shows its weeks, Monday to Sunday, with its holidays on the right days', async ({ page }) => {
  await openApp(page, 'calendar');
  const cal = await page.evaluate(() => ({seasons: CAL.seasons, weeks: CAL.seasonWeeks || 4, days: CAL_DAYS,
    hols: Object.fromEntries(CAL.seasons.map(s => [s, calHolidays(s).map(h => ({name: h.name, week: h.week, day: h.day}))]))}));
  expect(cal.days.length).toBe(7);
  for (const s of cal.seasons) {
    await page.locator(`[data-cal-season="${s}"]`).click();
    await expect(page.locator(`[data-cal-season="${s}"]`)).toHaveClass(/\bon\b/);
    await expect(page.locator('#view h1 .h1-sub')).toContainText(s);
    await expect(page.locator('#view .month .m-week')).toHaveCount(cal.weeks);
    await expect(page.locator('#view .month .m-day')).toHaveCount(cal.weeks * 7);
    const nums = await page.locator('#view .month .m-n').allInnerTexts();
    expect(nums.map(Number)).toEqual(Array.from({length: cal.weeks * 7}, (_, i) => i + 1));
    await expect(page.locator('#view .m-hol')).toHaveCount(cal.hols[s].length);
    for (const h of cal.hols[s]) {
      const day = page.locator('#view .month .m-day').nth((h.week - 1) * 7 + cal.days.indexOf(h.day));
      await expect(day, `${h.name}: week ${h.week}, ${h.day}`).toContainText(h.name.replace(/'/g, '’'));
      await expect(day).toHaveClass(/\bhol\b/);
    }
    // the figure in the banner counts the same holidays
    await expect(page.locator('#view .hero .figures')).toContainText(`${cal.hols[s].length}${cal.hols[s].length === 1 ? 'holiday' : 'holidays'}`);
  }
});

test('the world filter: each world’s calendar holds only its own events, and the worlds add up to the whole save', async ({ page }) => {
  test.setTimeout(120_000);
  await openApp(page, 'calendar');
  // tick every kind on the whole-save calendar
  for (const box of await page.locator('#view [data-cal-kind]').all()) if (!(await box.isChecked())) await box.check();
  const kinds = await page.evaluate(() => Object.keys(CAL_KINDS));
  expect(await page.evaluate(() => [...calState.kinds].sort())).toEqual(kinds.slice().sort());
  const chips = await page.locator('#view .wchips a.wchip[href^="#calendar-"]').evaluateAll(as => as.map(a => ({href: a.getAttribute('href'), name: a.textContent.trim()})));
  const withEvents = await page.evaluate(() => calWorlds().filter(w => calEvents().some(e => e.w === w.name)).map(w => w.name));
  expect(chips.map(c => c.name)).toEqual(withEvents);
  let sum = 0, whole = 0;
  for (const s of await page.evaluate(() => CAL.seasons)) {
    await go(page, 'calendar');
    await page.locator(`[data-cal-season="${s}"]`).click();
    whole += await evs(page).count();
    for (const c of chips) {
      await go(page, c.href.slice(1));
      await expect(page.locator('#view h1')).toContainText(c.name);
      await expect(page.locator('#view h1 .h1-sub')).toContainText(s);                     // the season stays as chosen
      const titles = await evs(page).evaluateAll(as => as.map(a => a.getAttribute('title')));
      expect(titles.filter(t => !t.includes(' · ' + c.name)), `${c.name}, ${s}: events from other worlds`).toEqual([]);
      sum += titles.length;
      await expect(page.locator('#view a.cal-back')).toHaveAttribute('href', '#calendar');
    }
  }
  expect(sum).toBe(whole);
  // and an event's link opens its own lot, neighbourhood or world
  await go(page, chips[0].href.slice(1));
  const href = await evs(page).first().getAttribute('href');
  await evs(page).first().click();
  await expect(page).toHaveURL(new RegExp(`${href}$`));
  await expect(page.locator('#view')).not.toContainText('Page not found');
});

test('the kinds she ticks are remembered in this browser; a world’s calendar keeps its own ticks', async ({ page }) => {
  await openApp(page, 'calendar');
  const kinds = await page.evaluate(() => Object.keys(CAL_KINDS));
  const off = await page.locator('#view [data-cal-kind]:checked').first().getAttribute('data-cal-kind');
  await page.locator(`#view [data-cal-kind="${off}"]`).uncheck();
  expect(JSON.parse(await page.evaluate(() => localStorage.getItem('jsw-calendar-4'))).kinds).not.toContain(off);
  const n = await evs(page).count();
  await page.reload();
  await page.waitForFunction(() => typeof SECTION_KEYS === 'function' && document.querySelector('#view').innerHTML.length > 0);
  await expect(page.locator(`#view [data-cal-kind="${off}"]`)).not.toBeChecked();
  expect(await evs(page).count()).toBe(n);
  // a world's calendar starts with every kind its world holds ticked, whatever the whole-save calendar has
  const w = await page.evaluate(() => calWorlds().find(w => calEvents().some(e => e.w === w.name)).id);
  await go(page, 'calendar-' + w);
  for (const box of await page.locator('#view [data-cal-kind]').all()) await expect(box).toBeChecked();
  expect(kinds.length).toBeGreaterThan(1);
  // unticking holidays empties the holiday days
  await page.locator('#view [data-cal-kind="holiday"]').uncheck();
  await expect(page.locator('#view .m-hol')).toHaveCount(0);
});

test('every event the game holds is on the whole-save calendar in some season, on the days it says', async ({ page }) => {
  await openApp(page, 'calendar');
  for (const box of await page.locator('#view [data-cal-kind]').all()) if (!(await box.isChecked())) await box.check();
  const bad = await page.evaluate(() => {
    const e = [], drawn = new Set();
    for (const s of CAL.seasons) { calState.season = s; redraw();
      document.querySelectorAll('#view .month .m-day').forEach((d, i) => d.querySelectorAll('a.m-ev').forEach(a => drawn.add(a.getAttribute('title').split(' · ')[0] + '|' + CAL_DAYS[i % 7]))); }
    calEvents().filter(ev => ev.days && !ev.special).forEach(ev => ev.days.forEach(d => { if (!drawn.has(curly(ev.label || (ev.kind === 'lot' ? ev.where + ': ' + ev.name : ev.name)) + '|' + d)) e.push(`${ev.name} (${ev.w}) on ${d}`); }));
    return e.slice(0, 20);
  });
  expect(bad).toEqual([]);
});
