import { chromium } from 'playwright';
import fs from 'fs/promises';
import path from 'path';

const rawTargets = process.env.TARGET_URLS || process.env.TARGET_URL || 'https://www.stoppclock.com';
const bases = rawTargets
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean)
  .map((u) => u.replace(/\/+$/, ''));

if (bases.length === 0) {
  throw new Error('No TARGET_URLS/TARGET_URL given');
}

const pathsToCheck = ['/', '/manifest.webmanifest', '/imprint.html', '/sw.js'];
const artifactsDir = path.resolve('artifacts/playwright');
let anyBasePassed = false;
const failures = [];
const navTimeout = 30_000;

async function ensureDir() { await fs.mkdir(artifactsDir, { recursive: true }); }
async function saveShot(page, name) { await ensureDir(); await page.screenshot({ path: path.join(artifactsDir, `${name}.png`), fullPage: true }); }
function slugify(s){ return s.replace(/[^a-z0-9]+/gi,'-').replace(/^-+|-+$/g,'').toLowerCase() || 'root'; }
function log(msg){ console.log(`[SMOKE] ${msg}`); }
function warn(msg){ console.warn(`[SMOKE][WARN] ${msg}`); }

const allowedConsole = [
  'net::ERR_BLOCKED_BY_CLIENT',
  'adsbygoogle',
  'googletagservices',
  'googletagmanager',
  'gtag/js?id=',
  'cookieconsent',
];

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({ ignoreHTTPSErrors: true });
  const page = await context.newPage();

  for (const base of bases) {
    const consoleOwnErrors = [];
    const pageErrors = [];
    const badResponses = [];
    const baseFailures = [];
    const host = new URL(base).host;

    log(`--- BASE: ${base} ---`);

    page.removeAllListeners('console');
    page.removeAllListeners('pageerror');
    page.removeAllListeners('response');
    page.on('console', (m) => {
      const type = m.type();
      const text = (m.text && m.text()) || '';
      if (type !== 'error') return;
      if (allowedConsole.some((w) => text.includes(w))) return;
      const isOwn = text.includes(host) || text.includes('/assets/') || text.includes('/sw.js');
      if (isOwn) consoleOwnErrors.push(text);
      else console.warn('[IGNORED 3P]', text);
    });
    page.on('pageerror', (err) => {
      pageErrors.push(String(err?.message || err));
    });
    page.on('response', (resp) => {
      const status = resp.status();
      if (status >= 400) {
        const url = resp.url();
        if (
          url.includes('/assets/') ||
          url.includes('/src/') ||
          url.endsWith('.js') ||
          url.endsWith('.css')
        ) {
          badResponses.push(`${status} ${url}`);
        }
      }
    });

    for (const p of pathsToCheck) {
      const url = base + p;
      log(`Visiting ${url}`);
      const resp = await page.goto(url, { waitUntil: 'networkidle', timeout: navTimeout });
      const status = resp?.status() || 0;
      if (status !== 200) {
        await saveShot(page, `http-${status}-${slugify(host)}-${slugify(p)}`);
        baseFailures.push(`HTTP ${status} at ${url}`);
        continue;
      }
      const content = await page.content();
      if (!content || content.length < 100) {
        await saveShot(page, `short-html-${slugify(host)}-${slugify(p)}`);
        baseFailures.push(`Short HTML at ${url}`);
      }
    }

    try {
      const head = await context.request.fetch(`${base}/sw.js`, { method: 'HEAD' });
      const cc = head.headers()['cache-control'] || head.headers()['Cache-Control'] || '';
      if (!cc) warn(`[${host}] Cache-Control header for /sw.js is missing.`);
      else {
        const m = /max-age\s*=\s*(\d+)/i.exec(cc);
        const age = m ? parseInt(m[1], 10) : null;
        if (age === null) warn(`[${host}] Cache-Control for /sw.js unparsed: "${cc}"`);
        else if (age > 300) warn(`[${host}] Cache-Control for /sw.js too long (max-age=${age}). Consider shorter caching.`);
        else log(`[${host}] Cache-Control for /sw.js OK: ${cc}`);
      }
    } catch (e) {
      warn(`[${host}] HEAD /sw.js failed: ${e?.message || e}`);
    }

    if (badResponses.length) {
      await saveShot(page, `responses-${slugify(host)}`);
      baseFailures.push(`[${host}] bad responses:\n  - ${badResponses.join('\n  - ')}`);
    }
    if (pageErrors.length) {
      baseFailures.push(`[${host}] pageerror: ${pageErrors.join(' | ')}`);
    }
    if (consoleOwnErrors.length) {
      baseFailures.push(`[${host}] console-errors: ${consoleOwnErrors.join(' | ')}`);
    }

    if (baseFailures.length === 0) {
      anyBasePassed = true;
      log(`[OK] Base passed: ${base}`);
      break;
    } else {
      log(`[INFO] Base failed: ${base} -> ${baseFailures.join(' ; ')}`);
      failures.push(...baseFailures);
    }
  }

  await browser.close();
  if (anyBasePassed) {
    log('All checks passed for at least one base. If the custom domain still fails, fix Pages domain binding or DNS.');
    process.exit(0);
  } else {
    console.error('[FAIL] All bases failed:\n' + failures.join('\n'));
    process.exit(2);
  }
})().catch(async (e) => {
  console.error('[FAIL] Uncaught error in smoke:', e);
  process.exit(5);
});
