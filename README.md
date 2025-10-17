# Stoppclock - Professional Timer Toolkit

Eine elegante, minimalistische Timer-Anwendung mit Vollbildmodus und Multi-Timer-Unterstützung.

**Verfügbar unter: [stoppclock.com](https://stoppclock.com)**

## ✨ Features

### 🎯 Multi-Timer-Unterstützung

- **Bis zu 3 gleichzeitige Timer** können parallel laufen
- **Live-Synchronisation** - Timer laufen im Hintergrund weiter, auch wenn Sie zur Startseite zurückkehren
- **Elegante Timer-Bar** - Zeigt alle aktiven Timer in der unteren Bildschirmhälfte

### ⏱️ Timer-Typen

- **Stopwatch** - Präzise Zeitmessung mit Rundenzähler
- **Countdown** - Benutzerdefinierte Countdown-Timer
- **Interval Timer** - Wechsel zwischen Arbeits- und Pausenzeiten
- **Digital Clock** - Echtzeit-Digitaluhr
- **Alarm Clock** - Wecker und Erinnerungen
- **Metronome** - Musikalischer Tempo- und Rhythmushalter
- **Chess Clock** - Zwei-Spieler-Timer
- **Lap Timer** - Rundenzeiten verfolgen

### 🎨 Design

- ✨ **Minimalistisch & Modern** - Klare Linien und sanfte Farben
- 🎭 **Glasmorphismus-Effekte** - Elegante Transparenz und Blur
- 🌈 **Farbcodierung** - Jeder Timer hat seine eigene Farbe
- 📱 **Responsive** - Funktioniert auf allen Geräten
- 🖼️ **Vollbildmodus** - Für Präsentationen und große Displays

### ⚡ Performance

- 🎯 **Präzise** - 10ms Update-Intervall für exakte Zeitmessung
- 💪 **Zuverlässig** - Stabile Timer-Synchronisation
- 🚀 **Schnell** - Optimierte Performance

## 🚀 Quick Start

```bash
# Installation
bun install

# Development Server starten
bun run dev

# Production Build
bun run build
```

## 📖 Verwendung

1. **Timer auswählen** - Klicken Sie auf einen Timer-Typ auf der Startseite
2. **Konfigurieren** - Stellen Sie Zeit und Parameter ein
3. **Starten** - Drücken Sie Start
4. **Multitasking** - Kehren Sie zur Startseite zurück - Timer läuft weiter!
5. **Verwalten** - Sehen Sie alle aktiven Timer in der unteren Bar

Mehr Details finden Sie in [FEATURES.md](./FEATURES.md)

---

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Deployments run automatically via GitHub Actions when you push to `main`. The workflow builds the Vite app, inlines the hashed assets, and publishes the output to GitHub Pages. To build locally, run `npm run build` and preview with `npm run preview -- --host`.
