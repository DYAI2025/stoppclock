# Deployment Hilfsdateien für stopclock.com

Enthält vorbereitete Dateien, die du in dein Projekt kopieren und committen kannst:

- `public/CNAME` → enthält `www.stopclock.com`
- `public/ads.txt` → enthält deine Publisher-ID für Google (wichtig für AdSense)
- `.github/workflows/deploy.yml` → GitHub Action, die `npm run build` ausführt und `dist/` nach `gh-pages` deployed
- `consent/consent.js` + `consent/consent.css` → kleines Consent-Snippet zum Laden von GA4 & AdSense nach Zustimmung
- `privacy.html`, `impressum.html` → Minimalvorlagen (bitte anpassen!)

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
