# GitHub Actions Workflows für Stoppclock

## Verfügbare Workflows

### 1. `gh-pages.yml` - Deployment zu GitHub Pages

**Zweck**: Baut das Projekt und deploys es zu einem GitHub Pages Branch

**Trigger**: Manuell über "Run workflow" oder bei Push zu bestimmten Branches (konfigurierbar)

**Schritte**:
1. Checkout des Repositorys
2. Setup von Node.js (Version 20)
3. Installation der Abhängigkeiten mit `npm ci`
4. Build des Projekts mit `npm run build`
5. Deployment des `dist/` Ordners zu GitHub Pages

**Hinweis**: Stellt sicher, dass die `postbuild`-Schritte in package.json ausgeführt werden, die `404.html` als SPA-Fallback erstellen.

### 2. `main.yml` - Auto-Fix Workflow

**Zweck**: Automatischer Fix von Build-Problemen und Service Worker Konfiguration

**Trigger**: Manuell über "Run workflow"

**Schritte**:
1. Checkout und Setup von Node.js und Python
2. Installation der Abhängigkeiten
3. Erster Test-Build (best effort)
4. Anwendung von Auto-Fixes:
   - Erstellung/Update der `public/sw.js` Datei
   - Korrektur der `postbuild` Skripts in package.json
   - Aktualisierung der Service Worker Registrierung
5. Re-Test und Build (muss erfolgreich sein)
6. Commit und Push der Änderungen zu main

## GitHub Pages Setup

1. **Branch Konfiguration**: 
   - Gehe zu Repository Settings → Pages
   - Wähle "Deploy from a branch"
   - Wähle den Branch `gh-pages` (wird vom Workflow erstellt) oder `main` mit `/dist` folder

2. **CNAME Konfiguration**:
   - Im Repository liegt bereits eine `CNAME` Datei mit `www.stoppclock.com`
   - GitHub Pages nutzt diese automatisch

3. **HTTPS**:
   - GitHub Pages aktiviert automatisch HTTPS für Custom Domains
   - Dies kann einige Minuten dauern

## Troubleshooting

**Wenn die Seite nach dem Deployment nicht läuft**:
1. Überprüfe den `gh-pages` Branch auf die erstellten Dateien
2. Stelle sicher, dass die `404.html` Datei erstellt wurde (notwendig für SPA Routing)
3. Prüfe die Browser-Konsole auf Fehlermeldungen
4. Führe ggf. den `main.yml` Workflow aus, um Auto-Fixes anzuwenden

**Wenn Assets nicht geladen werden**:
- Prüfe, ob die Pfade in `index.html` relativ sind (z.B. `./assets/...`)
- Stelle sicher, dass das Build-Ergebnis in `dist/` korrekt ist

**Custom Domain Probleme**:
- Stelle sicher, dass der DNS CNAME Eintrag auf `<dein-username>.github.io` zeigt
- Prüfe, ob die `CNAME` Datei im Repository korrekt ist