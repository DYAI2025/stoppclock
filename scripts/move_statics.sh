#!/usr/bin/env bash
# Verschiebt statische Dateien dauerhaft in public/ und fixiert Manifest-Link.
# Warum: Vite kopiert nur public/ -> dist/. So verhindern wir 404/Loading-Hänger.
set -euo pipefail

# Stelle sicher, dass wir IM REPO-ROOT sind
repo_root="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
cd "$repo_root"

mkdir -p public

# Manifest konsolidieren
if [ -f manifest.webmanifest ]; then
  git mv -f manifest.webmanifest public/manifest.webmanifest 2>/dev/null || mv -f manifest.webmanifest public/manifest.webmanifest
elif [ -f manifest.json ]; then
  git mv -f manifest.json public/manifest.webmanifest 2>/dev/null || mv -f manifest.json public/manifest.webmanifest
elif [ -f public/manifest.json ] && [ ! -f public/manifest.webmanifest ]; then
  git mv -f public/manifest.json public/manifest.webmanifest 2>/dev/null || mv -f public/manifest.json public/manifest.webmanifest
fi

# Statische Dateien verschieben (nur wenn vorhanden)
files=(ads.txt robots.txt sitemap.xml favicon.ico imprint.html impressum.html privacy.html privacy-policy.html faq.html faq-de.html placeholder.svg)
for f in "${files[@]}"; do
  if [ -f "$f" ]; then
    mkdir -p "public/$(dirname "$f")"
    git mv -f "$f" "public/$f" 2>/dev/null || mv -f "$f" "public/$f"
  fi
done

# Ordner verschieben (nur wenn vorhanden)
dirs=(icons consent)
for d in "${dirs[@]}"; do
  if [ -d "$d" ] && [ ! -d "public/$d" ]; then
    git mv -f "$d" "public/$d" 2>/dev/null || mv -f "$d" "public/$d"
  fi
done

# index.html: Manifest-Link sicherstellen (absoluter Pfad)
if [ -f index.html ]; then
  tmp="$(mktemp)"
  # alte Manifest-Links entfernen
  sed '/<link[^>]*rel=["'"'']manifest["'"''][^>]*>/Id' index.html > "$tmp"
  # neuen Link vor </head> einfügen
  awk 'BEGIN{IGNORECASE=1} /<\/head>/{print "  <link rel=\"manifest\" href=\"/manifest.webmanifest\">"}1' "$tmp" > index.html
fi

echo "Done. Bitte PR erstellen und mergen."
