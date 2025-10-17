import { chromium } from 'playwright';
import fs from 'fs/promises';
import path from 'path';

const base = (process.env.TARGET_URL || 'https://www.stoppclock.com').replace(/\/+$/,'');
const host = new URL(base).host;
const pathsToCheck = ['/', '/manifest.webmanifest', '/imprint.html', '/sw.js'];
const artifactsDir = path.resolve('artifacts/playwright');
const consoleOwnErrors = [];
const pageErrors = [];
const navTimeout = 30_000;

async function ensureDir() { await fs.mkdir(artifactsDir, { recursive: true }); }
async function saveShot(page, name) { await ensureDir(); await page.screenshot({ path: path.join(artifactsDir, `${name}.png`), fullPage: true }); }
function slugify(s){ return s.replace(/[^a-z0-9]+/gi,'-').replace(/^-+|-+$/g,'').toLowerCase() || 'root'; }
function log(msg){ console.log(`[SMOKE] ${msg}`); }
function warn(msg){ console.warn(`[SMOKE][WARN] ${msg}`); }

const allowedConsole = [
  'net::ERR_BLOCKED_BY_CLIENT',
  'adsbygoogle', 'googletagservices', 'googletagmanager',
  'gtag/js?id=',
  'cookieconsent',
];

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({ ignoreHTTPSErrors: true });
  const page = await context.newPage();

  page.on('console', (m) => {
    const type = m.type();
    const text = (m.text && m.text()) || '';
    if (type !== 'error') return;
    if (allowedConsole.some(w => text.includes(w))) return;
    const isOwn = text.includes(host) || text.includes('/assets/') || text.includes('/sw.js');
    if (isOwn) consoleOwnErrors.push(text); else console.warn('[IGNORED 3P]', text);
  });

  page.on('pageerror', (err) => {
    pageErrors.push(String(err?.message || err));
  });

  for (const p of pathsToCheck) {
    const url = base + p;
    log(`Visiting ${url}`);
    const resp = await page.goto(url, { waitUntil: 'networkidle', timeout: navTimeout });
    const status = resp?.status() || 0;
    if (status !== 200) {
      await saveShot(page, `http-${status}-${slugify(p)}`);
      await browser.close();
      console.error(`[FAIL] HTTP ${status} for ${url}`);
      process.exit(2);
    }
    const content = await page.content();
    if (!content || content.length < 100) {
      await saveShot(page, `short-html-${slugify(p)}`);
      await browser.close();
      console.error(`[FAIL] Empty/short HTML at ${url}`);
      process.exit(3);
    }
  }

  const head = await context.request.fetch(`${base}/sw.js`, { method: 'HEAD' });
  const cc = head.headers()['cache-control'] || head.headers()['Cache-Control'] || '';
  if (!cc) {
    warn('Cache-Control header for /sw.js is missing.');
  } else {
    const m = /max-age\s*=\s*(\d+)/i.exec(cc);
    const age = m ? parseInt(m[1], 10) : null;
    if (age === null) warn(`Cache-Control for /sw.js unparsed: "${cc}"`);
    else if (age > 300) warn(`Cache-Control for /sw.js too long (max-age=${age}). Consider shorter caching.`);
    else log(`Cache-Control for /sw.js OK: ${cc}`);
  }

  if (pageErrors.length) {
    await saveShot(page, `pageerror`);
    await browser.close();
    console.error('[FAIL] Uncaught page errors:\n' + pageErrors.join('\n---\n'));
    process.exit(4);
  }
  if (consoleOwnErrors.length) {
    await saveShot(page, `console-errors`);
    await browser.close();
    console.error('[FAIL] Console errors from own app:\n' + consoleOwnErrors.join('\n---\n'));
    process.exit(6);
  }

  await browser.close();
  log('All checks passed.');
})().catch(async (e) => {
  console.error('[FAIL] Uncaught error in smoke:', e);
  process.exit(5);
});
