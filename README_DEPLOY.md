# Deployment Hilfsdateien für stoppclock.com

Enthält vorbereitete Dateien, die du in dein Projekt kopieren und committen kannst:

- `public/CNAME` → enthält `www.stoppclock.com`
- `public/ads.txt` → enthält deine Publisher-ID für Google (wichtig für AdSense)
- `.github/workflows/deploy.yml` → GitHub Action, die `npm run build` ausführt und `dist/` nach `gh-pages` deployed
- `public/consent/consent.js` + `public/consent/consent.css` → kleines Consent-Snippet zum Laden von GA4 & AdSense nach Zustimmung (liegen in `public/`, werden zur Laufzeit unter `/consent/consent.js` bzw. `/consent/consent.css` ausgeliefert)
- `public/privacy.html`, `public/impressum.html` → Minimalvorlagen (bitte anpassen!) (liegen in `public/`, werden zur Laufzeit unter `/privacy.html` bzw. `/impressum.html` ausgeliefert)

## Schritte (kurz)
1. Kopiere die Dateien in dein Repo (z. B. unter `quick-times-main/`). Commit & push.
2. Stelle sicher, dass `public/` in deinem Vite-Projekt existiert (wird beim Build nach `dist/` kopiert).
3. GitHub Actions führt den Build und Deployment auf `gh-pages` aus. In GitHub repo -> Settings -> Pages wähle `gh-pages` branch als Source, oder Action erledigt das.
4. DNS: setze CNAME `www` -> `<dein-github-username>.github.io.`. Optional: A-Records für Root domain (siehe unten).
5. Warte, bis GitHub Pages HTTPS ausgestellt hat (Let's Encrypt).

## DNS (Registrar) – Einträge
- `www` CNAME → `<your-github-username>.github.io.`
- Root (`stopclock.com`) (optional) → A-Records auf GitHub Pages IPs:
  185.199.108.153
  185.199.109.153
  185.199.110.153
  185.199.111.153

## Hinweise
- Entferne keine API-Keys/Secrets (es sollten keine im Repo sein).
- Trage in `public/ads.txt` die korrekte `pub-...` ID ein (ist bereits gesetzt).
- Passe `impressum.html` an gesetzliche Anforderungen an.

## GitHub Pages Fix für Stoppclock SPA

### Problem
Vor dem Fix hatten wir 404-Fehler beim Laden von JavaScript-Assets auf GitHub Pages, da das Client-seitige Routing in der React SPA nicht korrekt mit GitHub Pages funktioniert hat.

### Lösungen implementiert

1. **Verbesserter Service Worker (public/sw.js)**:
   - Für Navigation requests (Seitenaufrufe) wird jetzt immer `index.html` zurückgegeben, um Client-seitiges Routing zu ermöglichen
   - Statische Assets (JS, CSS, Bilder) werden effizient gecached und verwaltet
   - Offline-Unterstützung bleibt erhalten

2. **Build-Konfiguration**:
   - Vite-Konfiguration verwendet `base: "./"` für korrekte relative Pfade
   - Postbuild-Skript erstellt `404.html` als SPA-Fallback (kopiert index.html)
   - Assets werden mit relativen Pfaden referenziert

3. **GitHub Actions Workflow**:
   - Workflow in `.github/workflows/gh-pages.yml` korrekt eingerichtet
   - Baut das Projekt und deployed den `dist/` Ordner
   - Stellt sicher, dass der SPA-Fallback bereitgestellt wird

### Deployment nach den Änderungen

1. Stellen Sie sicher, dass alle Änderungen commited sind
2. Der GitHub Actions Workflow (gh-pages.yml) wird automatisch ausgeführt bei:
   - Push zu einem ausgewählten Branch (z.B. main)
   - Manueller Auslösung über "Run workflow" in GitHub Actions

3. GitHub Pages Einstellungen:
   - Source: Wähle "Deploy from a branch"  
   - Branch: Wählen Sie den Branch (z.B. main)
   - Folder: `/ (root)` oder `/dist` je nach Konfiguration

### Resultat

Nach dem Deployment sollte:
- ✅ Die Hauptseite (stoppclock.com) korrekt laden
- ✅ Alle Timer-Seiten (stoppclock.com/stopwatch, etc.) direkt aufrufbar sein
- ✅ Keine 404-Fehler für JS/CSS-Dateien mehr auftreten
- ✅ SPA-Router korrekt funktionieren
- ✅ Offline-Unterstützung verfügbar sein
- ✅ GitHub Pages korrekt alle Client-seitigen Routen unterstützen
