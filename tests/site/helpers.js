// Shared bits for the site tests.
const fs = require('fs'), path = require('path');
const { expect } = require('@playwright/test');

// a 1×1 GIF served instead of every picture: drawing 1,000+ pages would otherwise ask the test server for thousands of
// photos and slow the other tests to a crawl. pictures.spec.js loads the real ones.
const DOT = Buffer.from('R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==', 'base64');

// open the app on a page (optionally at a hash), failing on any console error or page error while it loads
async function openApp(page, hash = '', {pictures = false} = {}) {
  const errors = [];
  page.on('pageerror', e => errors.push('page error: ' + e.message));
  page.on('console', m => { if (m.type() === 'error') errors.push('console: ' + m.text()); });
  if (!pictures) await page.route(/\.(jpe?g|png|webp|gif)(\?.*)?$/i, r => r.fulfill({status: 200, contentType: 'image/gif', body: DOT}));
  await page.goto('/index.html' + (hash ? '#' + hash : ''));
  await page.waitForFunction(() => typeof SECTION_KEYS === 'function' && document.querySelector('#view').innerHTML.length > 0, null, {timeout: 30_000, polling: 100});
  return errors;
}

// go to a page the way a click on a link does
async function go(page, hash) {
  await page.evaluate(h => { location.hash = h; }, hash);
  await page.waitForFunction(h => location.hash === '#' + h, hash, {polling: 50});
}

// tools/check_pages.js, run as it is (one copy of the rules: the same script Claude runs by hand in the preview)
const CHECK_PAGES = fs.readFileSync(path.join(__dirname, '..', '..', 'tools', 'check_pages.js'), 'utf8');
const checkPages = page => page.evaluate(CHECK_PAGES);

const viewText = page => page.locator('#view').innerText();

module.exports = { openApp, go, checkPages, viewText, expect };
