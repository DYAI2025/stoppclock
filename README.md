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

Prüft auf verbotene Vendor-Strings und 404s.

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
