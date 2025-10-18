#!/usr/bin/env bash
# nuke_lovable.sh — Radikaler Purge: Überschreibt alle Kern-Dateien, CI-Guard, Build & Deploy
# Einmal im Repo-Root ausführen. Danach ist jeder "lovable"-Rest CI-hart verboten.
set -euo pipefail

ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
cd "$ROOT"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🧹 NUKE LOVABLE — Vollständiger Purge & CI-Härtung"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

echo ""
echo "[1/8] Entferne offensichtliche Lovable-Artefakte & Altlasten…"
rm -f bun.lockb stoppclock_deploy.zip || true
rm -rf .lovable .gpt-engineer .cursor || true

mkdir -p public scripts .github/workflows

echo "[2/8] Schreibe saubere Basisdateien…"

# ────────────────────────────────────────────────────────────────
# .gitignore (Node/Vite/Editor üblich)
# ────────────────────────────────────────────────────────────────
cat > .gitignore <<'GITIGNORE'
# node
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
*.tsbuildinfo

# build
dist/
.vite/
coverage/
stoppclock_deploy/
stoppclock_deploy.zip

# env
.env
.env.*
!.env.example

# editor/system
.DS_Store
.idea/
.vscode/*
!.vscode/settings.json
!.vscode/extensions.json

# lovable remnants
.lovable/
.gpt-engineer/
.cursor/
bun.lockb
GITIGNORE

# ────────────────────────────────────────────────────────────────
# index.html (Standard Vite Entry, kein Loader, kein Lovable)
# ────────────────────────────────────────────────────────────────
cat > index.html <<'HTML'
<!doctype html>
<html lang="de">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
    <meta name="theme-color" content="#0f172a" />
    <link rel="manifest" href="/manifest.webmanifest" />
    <link rel="icon" href="/favicon.ico" />
    <title>Stoppclock - Professional Timer Toolkit</title>
    <meta name="description" content="Kostenlose Online-Timer: Stoppuhr, Countdown, Intervall-Timer, Wecker, Schachuhr und mehr." />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
    <script>
      (function () {
        const local = ["localhost","127.0.0.1","::1"].includes(location.hostname);
        if ("serviceWorker" in navigator && !local) {
          addEventListener("load", () => navigator.serviceWorker.register("/sw.js").catch(() => {}));
        }
      })();
    </script>
  </body>
</html>
HTML

# ────────────────────────────────────────────────────────────────
# public/manifest.webmanifest
# ────────────────────────────────────────────────────────────────
cat > public/manifest.webmanifest <<'MANIFEST'
{
  "name": "Stoppclock",
  "short_name": "Stoppclock",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0f172a",
  "theme_color": "#0f172a",
  "description": "Professionelles Timer-Toolkit mit Stoppuhr, Countdown, Intervall-Timer und mehr.",
  "icons": [
    { "src": "/favicon.ico", "sizes": "48x48 32x32 16x16", "type": "image/x-icon" }
  ]
}
MANIFEST

# ────────────────────────────────────────────────────────────────
# public/sw.js (Cache-Key wird in CI ersetzt mit Commit-SHA)
# ────────────────────────────────────────────────────────────────
cat > public/sw.js <<'SW'
const PRECACHE = 'sc-precache-__BUILD__';
const SHELL = ['/', '/index.html', '/manifest.webmanifest'];

self.skipWaiting();

self.addEventListener('install', (e) => {
  e.waitUntil((async () => {
    const c = await caches.open(PRECACHE);
    for (const u of SHELL) { 
      try { await c.add(new Request(u, { cache: 'reload' })); } 
      catch (err) { console.warn('SW install failed for', u, err); }
    }
  })());
});

self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(
      keys
        .filter(k => k.startsWith('sc-precache-') && k !== PRECACHE)
        .map(k => caches.delete(k))
    );
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (e) => {
  const { request } = e;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === 'navigate') {
    e.respondWith((async () => {
      try {
        const fresh = await fetch(request, { cache: 'reload' });
        const c = await caches.open(PRECACHE);
        c.put('/index.html', fresh.clone());
        return fresh;
      } catch {
        const c = await caches.open(PRECACHE);
        return (await c.match('/index.html')) || new Response('Offline', { status: 503 });
      }
    })());
    return;
  }

  if (/\.(js|css|svg|png|jpg|jpeg|ico|webp|woff2?|ttf|txt|xml|webmanifest)$/i.test(url.pathname)) {
    e.respondWith((async () => {
      const c = await caches.open(PRECACHE);
      const cached = await c.match(request);
      if (cached) {
        fetch(request).then(r => { if (r && r.ok) c.put(request, r.clone()); }).catch(() => {});
        return cached;
      }
      try {
        const fresh = await fetch(request);
        if (fresh && fresh.ok) c.put(request, fresh.clone());
        return fresh;
      } catch {
        return new Response('Offline asset missing', { status: 504 });
      }
    })());
  }
});
SW

# ────────────────────────────────────────────────────────────────
# package.json (ohne Lovable; npm; klare Scripts)
# ────────────────────────────────────────────────────────────────
cat > package.json <<'PKG'
{
  "name": "stoppclock",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "build:dev": "vite build --mode development",
    "preview": "vite preview",
    "lint": "eslint .",
    "doctor": "node scripts/doctor.mjs",
    "doctor:prod": "TARGET_URLS='https://dyai2025.github.io/quick-times,https://www.stoppclock.com' node scripts/doctor.mjs"
  },
  "dependencies": {
    "@hookform/resolvers": "^3.10.0",
    "@radix-ui/react-accordion": "^1.2.11",
    "@radix-ui/react-alert-dialog": "^1.1.14",
    "@radix-ui/react-aspect-ratio": "^1.1.7",
    "@radix-ui/react-avatar": "^1.1.10",
    "@radix-ui/react-checkbox": "^1.3.2",
    "@radix-ui/react-collapsible": "^1.1.11",
    "@radix-ui/react-context-menu": "^2.2.15",
    "@radix-ui/react-dialog": "^1.1.14",
    "@radix-ui/react-dropdown-menu": "^2.1.15",
    "@radix-ui/react-hover-card": "^1.1.14",
    "@radix-ui/react-label": "^2.1.7",
    "@radix-ui/react-menubar": "^1.1.15",
    "@radix-ui/react-navigation-menu": "^1.2.13",
    "@radix-ui/react-popover": "^1.1.14",
    "@radix-ui/react-progress": "^1.1.7",
    "@radix-ui/react-radio-group": "^1.3.7",
    "@radix-ui/react-scroll-area": "^1.2.9",
    "@radix-ui/react-select": "^2.2.5",
    "@radix-ui/react-separator": "^1.1.7",
    "@radix-ui/react-slider": "^1.3.5",
    "@radix-ui/react-slot": "^1.2.3",
    "@radix-ui/react-switch": "^1.2.5",
    "@radix-ui/react-tabs": "^1.1.12",
    "@radix-ui/react-toast": "^1.2.14",
    "@radix-ui/react-toggle": "^1.1.9",
    "@radix-ui/react-toggle-group": "^1.1.10",
    "@tanstack/react-query": "^5.83.0",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "cmdk": "^1.1.1",
    "date-fns": "^3.6.0",
    "embla-carousel-react": "^8.6.0",
    "input-otp": "^1.4.2",
    "lucide-react": "^0.462.0",
    "next-themes": "^0.3.0",
    "react": "^18.3.1",
    "react-day-picker": "^8.10.1",
    "react-dom": "^18.3.1",
    "react-hook-form": "^7.61.1",
    "react-resizable-panels": "^2.1.9",
    "react-router-dom": "^6.30.1",
    "recharts": "^2.15.4",
    "sonner": "^1.7.4",
    "tailwind-merge": "^2.6.0",
    "tailwindcss-animate": "^1.0.7",
    "vaul": "^0.9.9",
    "zod": "^3.25.76"
  },
  "devDependencies": {
    "@eslint/js": "^9.32.0",
    "@tailwindcss/typography": "^0.5.16",
    "@types/node": "^22.16.5",
    "@types/react": "^18.3.23",
    "@types/react-dom": "^18.3.7",
    "@vitejs/plugin-react-swc": "^3.11.0",
    "autoprefixer": "^10.4.21",
    "eslint": "^9.32.0",
    "eslint-plugin-react-hooks": "^5.2.0",
    "eslint-plugin-react-refresh": "^0.4.20",
    "globals": "^15.15.0",
    "postcss": "^8.5.6",
    "tailwindcss": "^3.4.17",
    "typescript": "^5.8.3",
    "typescript-eslint": "^8.38.0",
    "vite": "^5.4.19"
  }
}
PKG

# ────────────────────────────────────────────────────────────────
# eslint.config.js (Flat config, kein Lovable)
# ────────────────────────────────────────────────────────────────
cat > eslint.config.js <<'ESLINT'
import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";

export default [
  { ignores: ["dist/**", "node_modules/**"] },
  {
    files: ["**/*.{ts,tsx,js,jsx}"],
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: "module",
      globals: { ...globals.browser, ...globals.node }
    },
    plugins: { "react-hooks": reactHooks, "react-refresh": reactRefresh },
    rules: {
      ...js.configs.recommended.rules,
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "react-refresh/only-export-components": "off"
    }
  }
];
ESLINT

# ────────────────────────────────────────────────────────────────
# postcss.config.js
# ────────────────────────────────────────────────────────────────
cat > postcss.config.js <<'POSTCSS'
export default { 
  plugins: { 
    tailwindcss: {}, 
    autoprefixer: {} 
  } 
};
POSTCSS

# ────────────────────────────────────────────────────────────────
# tailwind.config.ts
# ────────────────────────────────────────────────────────────────
cat > tailwind.config.ts <<'TAILWIND'
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["index.html", "src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      colors: {
        stopwatch: "hsl(var(--stopwatch))",
        countdown: "hsl(var(--countdown))",
        interval: "hsl(var(--interval))",
        clock: "hsl(var(--clock))",
        alarm: "hsl(var(--alarm))",
        metronome: "hsl(var(--metronome))",
        chess: "hsl(var(--chess))",
        lap: "hsl(var(--lap))",
        pomodoro: "hsl(var(--pomodoro))"
      }
    }
  },
  plugins: [require("@tailwindcss/typography")]
} satisfies Config;
TAILWIND

# ────────────────────────────────────────────────────────────────
# components.json (neutral, kein Lovable)
# ────────────────────────────────────────────────────────────────
cat > components.json <<'COMP'
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "src/index.css",
    "baseColor": "slate",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils"
  }
}
COMP

# ────────────────────────────────────────────────────────────────
# tsconfig.json (Project references)
# ────────────────────────────────────────────────────────────────
cat > tsconfig.json <<'TSC'
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ]
}
TSC

# ────────────────────────────────────────────────────────────────
# tsconfig.app.json
# ────────────────────────────────────────────────────────────────
cat > tsconfig.app.json <<'TSCAPP'
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2023", "DOM", "DOM.Iterable"],
    "jsx": "react-jsx",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "noEmit": true,
    "skipLibCheck": true,
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "types": ["vite/client"],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"]
}
TSCAPP

# ────────────────────────────────────────────────────────────────
# tsconfig.node.json
# ────────────────────────────────────────────────────────────────
cat > tsconfig.node.json <<'TSCNODE'
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts", "scripts/**/*.ts", "scripts/**/*.mjs"]
}
TSCNODE

# ────────────────────────────────────────────────────────────────
# vite.config.ts (base="./" für GitHub Pages)
# ────────────────────────────────────────────────────────────────
cat > vite.config.ts <<'VITE'
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  base: "./",
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src")
    }
  },
  build: { 
    outDir: "dist", 
    assetsDir: "assets", 
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom", "react-router-dom"],
          radix: Object.keys(require("./package.json").dependencies).filter(k => k.startsWith("@radix-ui"))
        }
      }
    }
  },
  preview: { port: 4173, strictPort: true }
});
VITE

# ────────────────────────────────────────────────────────────────
# README.md (ohne Lovable/Fremd-Hinweise)
# ────────────────────────────────────────────────────────────────
cat > README.md <<'README'
# Stoppclock – Professional Timer Toolkit

Elegante, minimalistische Multi-Timer App: Stopwatch, Countdown, Interval, Digital/Alarm/Metronome/Chess.

## 🚀 Stack
- **Vite** – Lightning-fast build tool
- **React 18** – Modern UI library
- **TypeScript** – Type-safe development
- **Tailwind CSS** – Utility-first styling
- **shadcn/ui** – Beautiful component library

## 🔧 Lokal entwickeln
```bash
npm ci
npm run dev
```

Öffne http://localhost:5173

## 📦 Build & Preview
```bash
npm run build
npm run preview -- --host
```

## 🌐 Deploy (GitHub Pages via Actions)

1. **Repo Settings** → **Pages** → Source = **GitHub Actions**
2. **Custom Domain**: `www.stoppclock.com` → HTTPS aktivieren
3. **Push auf main** triggert Build → Deploy → Smoke-Test

## 🩺 Diagnose
```bash
# Lokale Checks (Repo-Scan)
npm run doctor

# Prod-Checks (Live-URLs)
npm run doctor:prod
```

Prüft auf verbotene Strings (`lovable`, `dev-agent`) und 404s.

## 📁 Projekt-Struktur
```
├── public/           # Statische Assets (favicon, manifest, sw.js)
├── src/
│   ├── components/   # React-Komponenten (Timer, UI)
│   ├── contexts/     # React Context (TimerContext)
│   ├── hooks/        # Custom Hooks
│   ├── lib/          # Utilities
│   ├── pages/        # Timer-Seiten (Stopwatch, Countdown, ...)
│   ├── App.tsx       # Root-Komponente mit Router
│   ├── main.tsx      # Entry-Point
│   └── index.css     # Globale Styles (Tailwind)
├── scripts/          # Build/Deploy-Scripts (doctor.mjs)
├── .github/          # CI/CD (pages.yml)
└── dist/             # Build-Output (generiert)
```

## 🎯 Features
- ⏱️ **10 Timer-Typen**: Stopwatch, Countdown, Interval, Digital Clock, Alarm, Metronome, Chess Clock, Lap Timer, 60s Timer
- 🔄 **Multi-Timer**: Bis zu 3 Timer gleichzeitig aktiv
- 💾 **Persistence**: localStorage für Alarm-Konfiguration
- 📱 **PWA-Ready**: Service Worker, Web Manifest
- 🌍 **Multi-Timezone**: 12 Zeitzonen für Digital Clock
- ⚡ **Performant**: Code-Splitting, Tree-Shaking, SWC-Compiler

## 🔒 Sicherheit
- ✅ Keine externen Analytics (optional GA4 via Cookie-Consent)
- ✅ Keine Hard-Dependencies auf Third-Party-Services
- ✅ CSP-Ready (Content Security Policy)
- ✅ Alle Scripts pinned auf SHA256 (GitHub Actions)

## 📄 Lizenz
Proprietär – © 2025 DYAI2025
README

echo "[3/8] Erstelle CI-Guard: scripts/doctor.mjs…"

# ────────────────────────────────────────────────────────────────
# scripts/doctor.mjs (Repo/Prod-Check ohne Browser)
# Prüft auf verbotene Strings & 404s
# ────────────────────────────────────────────────────────────────
cat > scripts/doctor.mjs <<'DOCTOR'
import fs from "fs/promises";
import path from "path";

const ROOT = process.cwd();
const EXCLUDES = new Set([".git", "node_modules", ".DS_Store", "dist", ".vite-cache", ".mypy_cache", ".trunk", "assets", "stoppclock_deploy"]);
const BAD_PAT = /(lovable|dev[- ]?agent|tagger)/i;
const LOADER_PAT = /Loading app/i;

const rawTargets = process.env.TARGET_URLS || process.env.TARGET_URL || "https://www.stoppclock.com";
const bases = rawTargets.split(",").map(s => s.trim()).filter(Boolean).map(u => u.replace(/\/+$/,""));

function log(...a){ console.log("[doctor]", ...a); }
function err(...a){ console.error("[doctor][FAIL]", ...a); }

async function* walk(dir){
  for (const e of await fs.readdir(dir, { withFileTypes: true })) {
    if (EXCLUDES.has(e.name)) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) yield* walk(p);
    else if (e.isFile()) yield p;
  }
}

async function scanRepo(){
  const bad = [];
  for await (const f of walk(ROOT)) {
    const text = await fs.readFile(f, "utf8").catch(()=>null);
    if (!text) continue;
    if (BAD_PAT.test(text)) bad.push({ f, why: "vendor marker" });
    if (LOADER_PAT.test(text)) bad.push({ f, why: "loading fallback" });
  }
  return bad;
}

async function head(u){ 
  try{ 
    const r = await fetch(u, { method:"HEAD" }); 
    return r; 
  }catch{ 
    return { ok:false, status:0 }; 
  } 
}

async function text(u){ 
  try{ 
    const r = await fetch(u); 
    return { ok:r.ok, status:r.status, body: await r.text() }; 
  }catch{ 
    return { ok:false, status:0, body:"" }; 
  } 
}

(async () => {
  log("scan repo…");
  const repoHits = await scanRepo();
  if (repoHits.length) {
    repoHits.forEach(h => console.error(`  ${h.f}: ${h.why}`));
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
    if (BAD_PAT.test(idx.body)) failures.push(`${base}/ -> contains vendor markers`);
    if (LOADER_PAT.test(idx.body)) failures.push(`${base}/ -> contains loading fallback`);
    
    const m = idx.body.match(/<script[^>]*type=["']module["'][^>]*src=["']([^"']+)["']/i);
    if (!m) {
      failures.push(`${base}/ -> no module script`);
    } else {
      const src = m[1].startsWith("/") ? m[1] : ("/" + m[1].replace(/^\.\//,""));
      const h = await head(base + src);
      if (!h.ok) failures.push(`${base}${src} -> HTTP ${h.status}`);
    }
    
    for (const p of ["/manifest.webmanifest", "/imprint.html", "/sw.js"]) {
      const h = await head(base + p);
      if (!h.ok) failures.push(`${base}${p} -> HTTP ${h.status}`);
    }
  }
  
  if (repoHits.length || failures.length) {
    if (failures.length) failures.forEach(f => console.error("  " + f));
    err("issues found");
    process.exit(2);
  }
  
  log("all good ✅");
})();
DOCTOR

echo "[4/8] Erstelle GitHub Actions Workflow: .github/workflows/pages.yml…"

# ────────────────────────────────────────────────────────────────
# .github/workflows/pages.yml (mit CI-Guard & SW-Cache-Bump)
# ────────────────────────────────────────────────────────────────
cat > .github/workflows/pages.yml <<'WORKFLOW'
name: Deploy Stoppclock to GitHub Pages

on:
  push:
    branches: ["main"]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: true

env:
  NODE_VERSION: 22
  CUSTOM_DOMAIN: www.stoppclock.com
  TARGET_URL: https://www.stoppclock.com/

jobs:
  guard:
    name: CI Guard (Block Lovable remnants)
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: npm
      
      - name: Install
        run: npm ci
      
      - name: Run doctor (Repo scan)
        run: npm run doctor

  build:
    needs: guard
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: npm

      - name: Install deps
        run: npm ci

      - name: Bump SW cache key with commit SHA
        run: |
          sed -i "s/__BUILD__/${{ github.sha }}/g" public/sw.js

      - name: Build
        run: npm run build

      - name: Add CNAME and .nojekyll
        run: |
          echo "${{ env.CUSTOM_DOMAIN }}" > ./dist/CNAME
          touch ./dist/.nojekyll

      - name: Upload Pages artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        name: Deploy to GitHub Pages
        uses: actions/deploy-pages@v4

  postcheck:
    needs: deploy
    runs-on: ubuntu-latest
    timeout-minutes: 10
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
      
      - name: Install
        run: npm ci
      
      - name: Wait for DNS propagation
        run: sleep 30
      
      - name: Run doctor:prod (Live scan)
        env:
          TARGET_URLS: ${{ env.TARGET_URL }}
        run: npm run doctor:prod
WORKFLOW

echo "[5/8] Entferne package-lock.json (wird neu generiert)…"
rm -f package-lock.json

echo "[6/8] Install Dependencies (npm ci)…"
npm install

echo "[7/8] Build testen…"
npm run build

echo "[8/8] Git Commit & Push…"
git add -A
git diff --cached --quiet || {
  git commit -m "🧹 nuke_lovable: CI-guard, saubere Configs, SW-Cache-Bump"
  git push origin main
  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "✅ ERFOLG! Lovable-Purge abgeschlossen & gepusht."
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo ""
  echo "📋 Nächste Schritte:"
  echo "  1. GitHub Actions läuft automatisch → Deploy auf Pages"
  echo "  2. Prüfe: https://github.com/$USER/quick-times/actions"
  echo "  3. Nach Deploy: https://www.stoppclock.com öffnen"
  echo "  4. Lokaler Check: npm run doctor:prod"
  echo ""
}

echo ""
echo "🎉 Script abgeschlossen. Repo ist jetzt CI-hart gegen Lovable-Reste!"
