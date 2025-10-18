# 🧹 Lovable Purge – Quick Start

## TL;DR

Einmaliges Script, das alle Lovable-Reste entfernt, CI-Guards einrichtet und zu GitHub Pages deployt.

## Ausführung

```bash
cd /home/dyai/Dokumente/DYAI_home/Web/Timer-page/quick-times
./nuke_lovable.sh
```

## Was passiert

1. Entfernt `bun.lockb`, `.lovable/`, `.cursor/`
2. Überschreibt alle Configs (vite, tsconfig, eslint, tailwind, package.json)
3. Erstellt `scripts/doctor.mjs` (CI-Guard gegen Lovable-Strings)
4. Erstellt `.github/workflows/pages.yml` (Auto-Deploy mit Guard)
5. `npm install` + `npm run build`
6. Git commit + push

## Nach dem Push

GitHub Actions läuft automatisch:

```
✅ guard     → Scannt Repo auf "lovable", "dev-agent", "Loading app"
✅ build     → Baut dist/ mit SW-Cache-Key = Commit-SHA
✅ deploy    → Deployt zu GitHub Pages
✅ postcheck → Scannt Live-URLs auf 404s & verbotene Strings
```

## Diagnose

```bash
npm run doctor          # Lokaler Repo-Scan
npm run doctor:prod     # Live-URL-Scan (nach Deploy)
```

## Ergebnis

- ✅ Lovable-frei
- ✅ CI-hart geschützt (Build failt bei Lovable-Resten)
- ✅ Auto-deployed via GitHub Actions
- ✅ Live auf `www.stoppclock.com`

## Dokumentation

Siehe `NUKE_LOVABLE.md` für Details.
