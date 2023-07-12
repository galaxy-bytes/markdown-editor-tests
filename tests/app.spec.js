const { test, expect } = require('@playwright/test');
const { Eyes } = require('@applitools/eyes-playwright');
let page, eyes;

test.beforeEach(async ({ browser, page }) => {
  eyes = new Eyes();
  await eyes.open(browser, 'My App', 'My Test');
  await page.goto('http://localhost:3000');
}, { timeout: 60000 });

test('should render markdown preview', async () => {
  const markdown = '## Test Markdown';
  await page.fill('textarea', markdown);
  await page.waitForSelector('h2');
  const preview = await page.$eval('h2', (el) => el.textContent);
  expect(preview).toBe('Test Markdown');

  await eyes.check('Markdown Preview', Target.window().fully());
});

test('should update markdown preview on input change', async () => {
  const markdown = '## Test Markdown';
  await page.fill('textarea', markdown);
  await page.waitForSelector('h2');
  const preview = await page.$eval('h2', (el) => el.textContent);
  expect(preview).toBe('Test Markdown');

  const newMarkdown = '### Updated Markdown';
  await page.fill('textarea', newMarkdown);
  await page.waitForSelector('h3', { timeout: 5000 });
  const updatedPreview = await page.$eval('h3', (el) => el.textContent);
  expect(updatedPreview).toBe('Updated Markdown');

  await eyes.checkWindow('Markdown Preview');
});

test.afterEach(async () => {
  await eyes.close();
});