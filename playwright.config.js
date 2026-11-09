// Playwright tests of the site (9 Nov): tests/site/*.spec.js. Run them through tools/run_tests.py (Python tests first, then these).
// They drive the Microsoft Edge already on the PC (no Playwright browser download) against site/ served on port 8011.
const { defineConfig } = require('@playwright/test');
const PY = 'C:/Users/Jemma/AppData/Local/Programs/Python/Python313/python.exe';
module.exports = defineConfig({
  testDir: 'tests/site',
  timeout: 120_000,
  expect: { timeout: 10_000 },
  workers: 3,
  reporter: [['list']],
  use: { baseURL: 'http://127.0.0.1:8011/', channel: 'msedge', viewport: { width: 1280, height: 800 }, trace: 'off', actionTimeout: 10_000 },
  webServer: { command: `"${PY}" tests/site/serve.py 8011`, url: 'http://127.0.0.1:8011/index.html', reuseExistingServer: true, timeout: 30_000, stdout: 'ignore', stderr: 'ignore' },
});
