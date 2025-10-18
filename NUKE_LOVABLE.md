# 🧹 NUKE LOVABLE – Kompletter Purge & CI-Härtung

## 🎯 Was macht dieses Script?

Das `nuke_lovable.sh` Script führt einen **radikalen, reproduzierbaren Purge** aller Lovable-Reste durch:

### ✅ Was wird überschrieben:

- ✅ `.gitignore` – Lovable-Ordner blockiert
- ✅ `index.html` – Kein Loader, kein Lovable-Tracking
- ✅ `package.json` – Keine Lovable-Dependencies
- ✅ `vite.config.ts` – `base: "./"` für GitHub Pages
- ✅ `tailwind.config.ts` – Custom Timer-Farben
- ✅ `tsconfig*.json` – Saubere TypeScript-Config
- ✅ `eslint.config.js` – Flat Config ohne Lovable
- ✅ `public/manifest.webmanifest` – PWA-Manifest
- ✅ `public/sw.js` – Service Worker (Cache-Key wird in CI ersetzt)
- ✅ `scripts/doctor.mjs` – **CI-Guard**: Scannt Repo & Prod auf verbotene Strings
- ✅ `.github/workflows/pages.yml` – GitHub Actions mit Guard-Step

### 🚫 Was wird CI-hart verboten:

- ❌ `lovable` (case-insensitive)
- ❌ `dev-agent` / `dev agent`
- ❌ `tagger`
- ❌ `Loading app` (Lovable-Fallback)

### 🔒 CI-Pipeline (nach Purge):

```
Push → Guard (doctor scan) → Build (SW-Cache-Bump) → Deploy → Postcheck (prod scan)
```

Wenn `doctor` einen verbotenen String findet → **Build failt** → Kein Deploy!

---

## 🚀 Ausführung

### Einmalig im Repo-Root:

```bash
cd /home/dyai/Dokumente/DYAI_home/Web/Timer-page/quick-times
./nuke_lovable.sh
```

### Was passiert:

1. **[1/8]** Entfernt `bun.lockb`, `.lovable/`, `.gpt-engineer/`, `.cursor/`
2. **[2/8]** Überschreibt **alle Kern-Dateien** (siehe oben)
3. **[3/8]** Erstellt `scripts/doctor.mjs` (CI-Guard)
4. **[4/8]** Erstellt `.github/workflows/pages.yml` (Actions)
5. **[5/8]** Entfernt `package-lock.json` (wird neu generiert)
6. **[6/8]** `npm install` – Fresh Install
7. **[7/8]** `npm run build` – Test-Build
8. **[8/8]** `git commit` + `git push origin main`

---

## 🩺 Nach dem Purge: Diagnose

### Lokale Checks (Repo-Scan):

```bash
npm run doctor
```

Scannt **alle Dateien** im Repo auf:

- Verbotene Strings (`lovable`, `dev-agent`, `Loading app`)
- Ausnahmen: `.git/`, `node_modules/`, `dist/`, `assets/`

### Prod-Checks (Live-URLs):

```bash
npm run doctor:prod
```

Scannt **Live-Seiten**:

- `https://dyai2025.github.io/quick-times`
- `https://www.stoppclock.com`

Prüft:

- ✅ HTTP 200 für `/`, `/manifest.webmanifest`, `/imprint.html`, `/sw.js`
- ✅ Keine verbotenen Strings in HTML
- ✅ Module-Script lädt erfolgreich

**Wenn Fehler:** Exit-Code 2 → CI failt → Kein Deploy!

---

## 📋 GitHub Actions Workflow

### Trigger:

- Push auf `main` Branch
- Manueller Workflow-Dispatch

### Jobs:

#### 1. **guard** (CI-Guard)

```yaml
- Checkout
- Setup Node 22
- npm ci
- npm run doctor # ← Repo-Scan, failt bei verbotenen Strings
```

#### 2. **build** (nur wenn guard OK)

```yaml
- Checkout
- Setup Node 22
- npm ci
- sed -i "s/__BUILD__/${{ github.sha }}/g" public/sw.js # ← Cache-Key-Bump
- npm run build
- Add CNAME (www.stoppclock.com)
- Upload dist/ artifact
```

#### 3. **deploy** (nur wenn build OK)

```yaml
- Deploy to GitHub Pages
- Environment: github-pages
- URL: https://www.stoppclock.com
```

#### 4. **postcheck** (nur wenn deploy OK)

```yaml
- Checkout
- Setup Node 22
- npm ci
- sleep 30 # ← DNS propagation
- npm run doctor:prod # ← Live-Scan, failt bei 404 oder verbotenen Strings
```

**Wenn postcheck failt:** Workflow-Status = Failed (aber Deploy bleibt live, weil bereits deployed)

---

## 🔍 Was prüft doctor.mjs?

### Repo-Scan (npm run doctor):

```javascript
BAD_PAT = /(lovable|dev[- ]?agent|tagger)/i;
LOADER_PAT = /Loading app/i;
```

Scannt alle Dateien (außer `.git/`, `node_modules/`, `dist/`) auf:

- ✅ Keine `lovable` in Kommentaren/Code
- ✅ Kein `dev-agent` / `dev agent`
- ✅ Kein `Loading app` (Lovable-Fallback in HTML)

### Prod-Scan (npm run doctor:prod):

```javascript
TARGET_URLS =
  "https://www.stoppclock.com,https://dyai2025.github.io/quick-times";
```

Für jede URL:

1. **GET /** → Prüfe HTTP 200
2. **Scan HTML** → Keine verbotenen Strings
3. \*\*Find `<script type="module" src="...">` → Prüfe HTTP 200
4. **HEAD /manifest.webmanifest** → Prüfe HTTP 200
5. **HEAD /imprint.html** → Prüfe HTTP 200
6. **HEAD /sw.js** → Prüfe HTTP 200

**Wenn 404 oder verboten:** Exit 2 → CI failt

---

## 🛠️ Manuelle Checks nach Purge

### 1. Lokaler Build:

```bash
npm run build
npm run preview -- --host
```

Öffne: http://localhost:4173

### 2. Lokale Doctor-Checks:

```bash
npm run doctor          # Repo-Scan
npm run doctor:prod     # Live-Scan (nach Deploy)
```

### 3. GitHub Actions prüfen:

```
https://github.com/DYAI2025/quick-times/actions
```

### 4. Live-Seite testen:

```
https://www.stoppclock.com
https://dyai2025.github.io/quick-times
```

Erwartung:

- ✅ Keine "Loading app..." Spinner
- ✅ Timer funktionieren
- ✅ Service Worker registriert (DevTools → Application → Service Workers)
- ✅ Manifest lädt (DevTools → Application → Manifest)

---

## 🚨 Troubleshooting

### Problem: `npm run doctor` failt lokal

```bash
# Zeige gefundene Dateien:
grep -r "lovable" --exclude-dir={.git,node_modules,dist} .
grep -r "Loading app" --exclude-dir={.git,node_modules,dist} .
```

**Lösung:** Entferne die Datei oder editiere sie.

### Problem: `npm run build` failt

```bash
# Check TypeScript-Fehler:
npx tsc --noEmit

# Check ESLint:
npm run lint
```

**Lösung:** Fixe TypeScript/ESLint-Fehler in `src/`.

### Problem: GitHub Actions failt bei `guard`

```
Error: [doctor][FAIL] issues found
  ./some-file.js: vendor marker
```

**Lösung:**

1. Lokaler Check: `npm run doctor`
2. Entferne die Datei oder editiere sie
3. Push erneut

### Problem: GitHub Actions failt bei `postcheck`

```
Error: [doctor][FAIL] issues found
  https://www.stoppclock.com/manifest.webmanifest -> HTTP 404
```

**Mögliche Ursachen:**

- DNS noch nicht propagiert → Warte 5-10 Minuten
- Datei fehlt in `dist/` → Check `public/manifest.webmanifest`
- Base-Path falsch → Check `vite.config.ts` (`base: "./"`)

**Lösung:**

1. Warte 5 Minuten
2. Manueller Test: `curl -I https://www.stoppclock.com/manifest.webmanifest`
3. Re-run Workflow (GitHub Actions UI)

### Problem: Service Worker cached alte Version

```bash
# Chrome DevTools → Application → Service Workers → Unregister
# Oder:
chrome://serviceworker-internals/
```

**Lösung:**

1. Unregister alten SW
2. Hard-Reload (Ctrl+Shift+R)
3. Prüfe Cache-Key in DevTools → Application → Cache Storage

---

## 📊 Erwartete Ergebnisse

### ✅ Nach erfolgreichem Purge:

#### Repo-Status:

```bash
$ npm run doctor
[doctor] scan repo…
[doctor] repo OK ✅
[doctor] scan prod…
[doctor] all good ✅
```

#### GitHub Actions:

```
✅ guard     (1m 23s)
✅ build     (2m 14s)
✅ deploy    (0m 45s)
✅ postcheck (1m 12s)
```

#### Live-Seite:

```
https://www.stoppclock.com/
  ✅ HTTP 200
  ✅ Keine "Loading app" Spinner
  ✅ Timer funktionieren
  ✅ Service Worker registriert
  ✅ Manifest lädt
```

#### Browser DevTools (Console):

```
[SW] Registered successfully
[SW] Cache: sc-precache-<commit-sha>
```

---

## 🎯 Zusammenfassung

| Phase            | Aktion                             | Ergebnis                                       |
| ---------------- | ---------------------------------- | ---------------------------------------------- |
| **1. Pre-Purge** | Backup-Branch erstellen (optional) | `git checkout -b backup-pre-purge`             |
| **2. Purge**     | `./nuke_lovable.sh` ausführen      | Alle Dateien überschrieben, committed, gepusht |
| **3. CI-Guard**  | GitHub Actions `guard` job         | Scannt Repo auf verbotene Strings              |
| **4. Build**     | `npm run build` + SW-Cache-Bump    | `dist/` generiert mit Commit-SHA               |
| **5. Deploy**    | GitHub Pages Deploy                | Live auf `www.stoppclock.com`                  |
| **6. Postcheck** | `npm run doctor:prod`              | Scannt Live-URLs auf 404 & verbotene Strings   |
| **7. Verify**    | Manuelle Browser-Tests             | Timer funktionieren, SW registriert            |

---

## 🔐 Sicherheit & Härtung

### Was ist jetzt CI-hart geschützt?

✅ **Kein Lovable-Tracking:** Alle Analytics/Tracking-Codes entfernt (außer opt-in GA4)  
✅ **Keine Fremd-Dependencies:** Nur npm-Registry, keine Lovable-CDNs  
✅ **Pinned Actions:** Alle GitHub Actions auf SHA256 gepinnt (nicht `@v4`, sondern `@abc123...`)  
✅ **SW-Cache-Invalidierung:** Cache-Key = Commit-SHA → Jeder Deploy invalidiert Cache  
✅ **CI-Guard:** Jeder Push wird gescannt → Lovable-Reste blockieren Deploy  
✅ **Postcheck:** Nach Deploy wird Live-Seite gescannt → 404s blockieren Workflow-Success

### Was ist NICHT geschützt?

⚠️ **Manuelle Edits:** Wenn du nach Purge manuell Lovable-Code einfügst → CI failt  
⚠️ **DNS-Hijacking:** Wenn `www.stoppclock.com` DNS kompromittiert wird → Doctor kann es nicht verhindern  
⚠️ **GitHub Secrets:** Wenn GitHub-Token geleakt werden → Angreifer kann Actions manipulieren

**Best Practices:**

1. Nie Lovable-Code manuell einfügen
2. DNS-Records regelmäßig prüfen (Cloudflare/GitHub)
3. GitHub Token rotieren (Settings → Developer settings → Personal access tokens)

---

## 🎉 Erfolg!

Nach erfolgreichem Purge ist dein Repo:

- ✅ **Lovable-frei**
- ✅ **CI-hart geschützt**
- ✅ **Reproduzierbar gebaut**
- ✅ **Auto-deployed** via GitHub Actions
- ✅ **Live** auf `www.stoppclock.com`

**Nächste Schritte:**

1. Teste Live-Seite: https://www.stoppclock.com
2. Prüfe Actions: https://github.com/DYAI2025/quick-times/actions
3. Monitor: `npm run doctor:prod` regelmäßig ausführen
4. Enjoy: Lovable-freies, selbst-gehostetes Timer-Toolkit! 🚀
