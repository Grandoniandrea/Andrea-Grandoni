// End-to-end check of the Boxer demo in a phone-sized headless browser.
// Files are served straight from disk through Playwright routing (no server).
// Run: node boxer/tests/e2e.mjs
import { createRequire } from 'node:module';
import { readFile } from 'node:fs/promises';
import { extname, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';

const { chromium } = createRequire(import.meta.url)('playwright');
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.png': 'image/png' };
const BASE = 'http://boxer.test/boxer/';

const browser = await chromium.launch();
let failures = 0;
let passes = 0;

async function newPage(width = 390, height = 844) {
  const ctx = await browser.newContext({ viewport: { width, height } });
  await ctx.route('**', (route) => route.abort());
  await ctx.route('http://boxer.test/**', async (route) => {
    const u = new URL(route.request().url());
    try {
      const body = await readFile(ROOT + u.pathname.replace(/\/$/, '/index.html'));
      await route.fulfill({ body, contentType: TYPES[extname(u.pathname) || '.html'] || 'application/octet-stream' });
    } catch { await route.fulfill({ status: 404, body: 'not found' }); }
  });
  const page = await ctx.newPage();
  page.setDefaultTimeout(5000);
  page.errors = [];
  page.on('pageerror', (e) => page.errors.push(e.message));
  return page;
}

async function check(name, fn) {
  try { await fn(); passes++; console.log(`ok - ${name}`); }
  catch (e) { failures++; console.log(`not ok - ${name}\n  ${e.message.split('\n').slice(0, 4).join('\n  ')}`); }
}

const active = (page, screen) => page.locator(`[data-screen="${screen}"].active`);

// Answers every quiz step with the first option or the given numbers.
async function answerQuiz(page, numbers = { height: 178, weight: 84, target_weight: 76 }) {
  for (let guard = 0; guard < 30; guard++) {
    if (await active(page, 'building').count()) return;
    const type = await page.locator('#quiz').getAttribute('data-type');
    const id = await page.locator('#quiz').getAttribute('data-id');
    if (type === 'choice') await page.locator('#quiz .opt').first().click();
    else if (type === 'multi') { await page.locator('#quiz .opt').first().click(); await page.click('#q-next'); }
    else if (type === 'number') { await page.fill('#num', String(numbers[id])); await page.click('#q-next'); }
    else await page.click('#q-next');
    await page.waitForTimeout(80);
  }
  throw new Error('quiz never finished');
}

async function noHorizontalScroll(page, width) {
  const sw = await page.evaluate(() => document.documentElement.scrollWidth);
  assert.ok(sw <= width, `scrollWidth ${sw} > ${width}`);
}

async function runFunnel(page, width) {
  await page.goto(BASE + '?reset');
  await active(page, 'welcome').waitFor({ timeout: 3000 });
  await noHorizontalScroll(page, width);
  await page.click('#btn-start');
  await active(page, 'quiz').waitFor();
  await noHorizontalScroll(page, width);
  await answerQuiz(page);
  await active(page, 'plan').waitFor({ timeout: 7000 });
  const bmiText = await page.locator('#bmi-value').innerText();
  assert.match(bmiText, /\d+[.,]\d/);
  assert.match(await page.locator('#plan-date').innerText(), /\d/);
  await noHorizontalScroll(page, width);
  await page.click('#plan-next');
  await active(page, 'paywall').waitFor();
  assert.equal(await page.locator('.plan-card').count(), 3);
  assert.match((await page.locator('#countdown').innerText()).trim(), /^\d{2}:\d{2}$/);
  await noHorizontalScroll(page, width);
  await page.click('.plan-card[data-plan="w4"]');
  await page.click('#pay-btn');
  await active(page, 'checkout').waitFor();
  assert.match(await page.locator('[data-screen="checkout"]').innerText(), /Demo — nessun addebito/);
  await page.click('#confirm-pay');
  await active(page, 'challenge').waitFor({ timeout: 4000 });
  await noHorizontalScroll(page, width);
  assert.deepEqual(page.errors, []);
}

await check('full funnel on a 390px phone', async () => {
  const page = await newPage();
  await runFunnel(page, 390);
  await page.context().close();
});

await check('full funnel on a 320px phone without horizontal scroll', async () => {
  const page = await newPage(320, 640);
  await runFunnel(page, 320);
  await page.context().close();
});

await check('reload in the middle of the quiz resumes on the same question', async () => {
  const page = await newPage();
  await page.goto(BASE + '?reset');
  await page.click('#btn-start');
  for (let i = 0; i < 4; i++) { await page.locator('#quiz .opt').first().click(); await page.waitForTimeout(80); }
  const before = await page.locator('#q-title').innerText();
  await page.reload();
  await active(page, 'quiz').waitFor();
  assert.equal(await page.locator('#q-title').innerText(), before);
  await page.context().close();
});

await check('impossible height disables Avanti and shows a message', async () => {
  const page = await newPage();
  await page.goto(BASE + '?reset');
  await page.click('#btn-start');
  for (let guard = 0; guard < 20; guard++) {
    if ((await page.locator('#quiz').getAttribute('data-id')) === 'height') break;
    const type = await page.locator('#quiz').getAttribute('data-type');
    if (type === 'choice') await page.locator('#quiz .opt').first().click();
    else { if (type === 'multi') await page.locator('#quiz .opt').first().click(); await page.click('#q-next'); }
    await page.waitForTimeout(80);
  }
  await page.fill('#num', '0');
  assert.equal(await page.locator('#q-next').isDisabled(), true);
  assert.ok(await page.locator('#q-error').isVisible());
  await page.fill('#num', '178');
  assert.equal(await page.locator('#q-next').isDisabled(), false);
  await page.context().close();
});

// @@APP-TESTS@@

await browser.close();
console.log(`# pass ${passes}\n# fail ${failures}`);
process.exit(failures ? 1 : 0);
