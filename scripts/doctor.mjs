import fs from "fs/promises";
import path from "path";

const ROOT = process.cwd();
const EXCLUDES = new Set([
  ".git",
  "node_modules",
  ".DS_Store",
  "dist",
  ".vite-cache",
  ".mypy_cache",
  ".trunk",
  "assets",
  "stoppclock_deploy",
  "purge.log",
]);
const SKIP_FILES = new Set([
  "nuke_lovable.sh",
  "NUKE_LOVABLE.md",
  "PURGE_QUICK_START.md",
  "doctor.mjs",
]); // Meta-Dateien über Vendor-Strings
const BAD_PAT = /(lovable|dev[- ]?agent|tagger)/i;
const LOADER_PAT = /Loading app/i;

const rawTargets =
  process.env.TARGET_URLS ||
  process.env.TARGET_URL ||
  "https://www.stoppclock.com";
const bases = rawTargets
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean)
  .map((u) => u.replace(/\/+$/, ""));

function log(...a) {
  console.log("[doctor]", ...a);
}
function err(...a) {
  console.error("[doctor][FAIL]", ...a);
}

async function* walk(dir) {
  for (const e of await fs.readdir(dir, { withFileTypes: true })) {
    if (EXCLUDES.has(e.name)) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) yield* walk(p);
    else if (e.isFile()) yield p;
  }
}

async function scanRepo() {
  const bad = [];
  for await (const f of walk(ROOT)) {
    const basename = f.split("/").pop();
    if (SKIP_FILES.has(basename)) continue; // Skip Meta-Dateien
    const text = await fs.readFile(f, "utf8").catch(() => null);
    if (!text) continue;
    if (BAD_PAT.test(text)) bad.push({ f, why: "vendor marker" });
    if (LOADER_PAT.test(text)) bad.push({ f, why: "loading fallback" });
  }
  return bad;
}

async function head(u) {
  try {
    const r = await fetch(u, { method: "HEAD" });
    return r;
  } catch {
    return { ok: false, status: 0 };
  }
}

async function text(u) {
  try {
    const r = await fetch(u);
    return { ok: r.ok, status: r.status, body: await r.text() };
  } catch {
    return { ok: false, status: 0, body: "" };
  }
}

(async () => {
  log("scan repo…");
  const repoHits = await scanRepo();
  if (repoHits.length) {
    repoHits.forEach((h) => console.error(`  ${h.f}: ${h.why}`));
  } else {
    log("repo OK ✅");
  }

  log("scan prod…");
  const failures = [];
  for (const base of bases) {
    const idx = await text(base + "/");
    if (!idx.ok) {
      failures.push(`${base}/ -> HTTP ${idx.status}`);
      continue;
    }
    if (BAD_PAT.test(idx.body))
      failures.push(`${base}/ -> contains vendor markers`);
    if (LOADER_PAT.test(idx.body))
      failures.push(`${base}/ -> contains loading fallback`);

    const m = idx.body.match(
      /<script[^>]*type=["']module["'][^>]*src=["']([^"']+)["']/i
    );
    if (!m) {
      failures.push(`${base}/ -> no module script`);
    } else {
      const src = m[1].startsWith("/") ? m[1] : "/" + m[1].replace(/^\.\//, "");
      const h = await head(base + src);
      if (!h.ok) failures.push(`${base}${src} -> HTTP ${h.status}`);
    }

    for (const p of ["/manifest.webmanifest", "/imprint.html", "/sw.js"]) {
      const h = await head(base + p);
      if (!h.ok) failures.push(`${base}${p} -> HTTP ${h.status}`);
    }
  }

  if (repoHits.length || failures.length) {
    if (failures.length) failures.forEach((f) => console.error("  " + f));
    err("issues found");
    process.exit(2);
  }

  log("all good ✅");
})();
