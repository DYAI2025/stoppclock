#!/usr/bin/env bash
# Erzwingt absolute SW-Registrierung auf /sw.js (verhindert /assets/sw.js).
# Warum: Wenn der Registrierungs-Code gebundlet wird, zeigt import.meta.url auf /assets/*.js.
set -euo pipefail
repo_root="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
cd "$repo_root"

pattern="new\\s+URL\\(\\s*['\\\"]sw\\.js['\\\"]\\s*,\\s*import\\.meta\\.url\\s*\\)"

# 1) index.html inline-Module: ersetze new URL(...) durch Root-Pfad
if [ -f index.html ]; then
  perl -0777 -pe 's#new\s+URL\(\s*["\047]sw\.js["\047]\s*,\s*import\.meta\.url\s*\)#"/sw.js"#g' -i index.html
  perl -0777 -pe 's#navigator\.serviceWorker\.register\(\s*new\s+URL\(\s*["\047]sw\.js["\047].*?\)\s*\)#navigator.serviceWorker.register("/sw.js")#gs' -i index.html
fi

# 2) Alle Source-Dateien durchsuchen (falls Registrierung in JS/TS liegt)
mapfile -t sw_refs < <(rg --files-with-matches "$pattern" --iglob '*.{js,ts,tsx,jsx,mjs}' || true)
for f in "${sw_refs[@]}"; do
  perl -0777 -pe 's#new\s+URL\(\s*["\047]sw\.js["\047]\s*,\s*import\.meta\.url\s*\)#"/sw.js"#g' -i "$f"
  perl -0777 -pe 's#navigator\.serviceWorker\.register\(\s*new\s+URL\(\s*["\047]sw\.js["\047].*?\)\s*\)#navigator.serviceWorker.register("/sw.js")#gs' -i "$f"
 done

echo "SW registration forced to /sw.js. Commit & push."
