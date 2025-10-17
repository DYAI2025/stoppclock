#!/usr/bin/env bash
# Verschiebt statische Dateien dauerhaft in public/ und fixiert Manifest-Link.
# Warum: Vite kopiert nur public/ -> dist/. So verhindern wir 404 und "Loading..."-Hänger.
set -euo pipefail

root_dir="$(git rev-parse --show-toplevel 2>/dev/null || echo ".")"
cd "$root_dir"

mkdir -p public

# --- Manifest konsolidieren ---
if [ -f manifest.webmanifest ]; then
  mv -f manifest.webmanifest public/manifest.webmanifest
elif [ -f manifest.json ]; then
  mv -f manifest.json public/manifest.webmanifest
elif [ -f public/manifest.json ] && [ ! -f public/manifest.webmanifest ]; then
  mv -f public/manifest.json public/manifest.webmanifest
fi

# --- Statische Dateien nach public/ verschieben ---
files=(ads.txt robots.txt sitemap.xml favicon.ico imprint.html impressum.html privacy.html privacy-policy.html faq.html faq-de.html placeholder.svg)
for f in "${files[@]}"; do
  if [ -f "$f" ]; then
    mkdir -p "public/$(dirname "$f")"
    git mv -f "$f" "public/${f}" 2>/dev/null || mv -f "$f" "public/${f}"
  fi
done

# --- Ordner nach public/ verschieben ---
dirs=(icons consent)
for d in "${dirs[@]}"; do
  if [ -d "$d" ] && [ ! -d "public/$d" ]; then
    git mv -f "$d" "public/$d" 2>/dev/null || mv -f "$d" "public/$d"
  fi
done

# --- index.html: Manifest-Link sicherstellen ---
if [ -f index.html ]; then
  tmp="$(mktemp)"
  sed '/rel=["'\'']manifest["'\'']/Id' index.html > "$tmp"
  awk 'BEGIN{IGNORECASE=1}
    /<\/head>/{
      print "  <link rel=\"manifest\" href=\"/manifest.webmanifest\">"
    }1' "$tmp" > index.html
fi

# --- Git-Commit (lokal) ---
if git rev-parse --git-dir >/dev/null 2>&1; then
  git add -A
  git commit -m "chore(public): move static assets & manifest into public/ for Vite/GitHub Pages" || true
fi

echo "Done. Bitte PR erstellen und mergen."
