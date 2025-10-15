export type Lang = "en" | "de";

type Dict = Record<string, Record<Lang, string>>;

export const dict: Dict = {
  // Global
  "footer.imprint": { en: "Imprint", de: "Impressum" },
  "footer.privacy": { en: "Privacy Policy", de: "Datenschutzerklärung" },
  "footer.faq": { en: "FAQ", de: "FAQ" },
  "footer.consent": { en: "Consent Settings", de: "Consent‑Einstellungen" },
  "footer.imprint.de": { en: "Impressum (DE)", de: "Impressum (DE)" },
  "footer.privacy.de": { en: "Datenschutz (DE)", de: "Datenschutz (DE)" },

  // Cross links
  "cross.more": { en: "More tools:", de: "Weitere Tools:" },
  "tool.stopwatch": { en: "Stopwatch", de: "Stoppuhr" },
  "tool.countdown": { en: "Countdown", de: "Countdown" },
  "tool.clock": { en: "Digital Clock", de: "Digitale Uhr" },
  "tool.alarm": { en: "Alarm", de: "Wecker" },
  "tool.chess": { en: "Chess Clock", de: "Schachuhr" },

  // ActiveTimerBar
  "bar.active": { en: "Active Timers", de: "Aktive Timer" },
  "bar.more": { en: "more", de: "weitere" },
  "bar.running": { en: "Running", de: "Läuft" },
  "bar.clickOpen": { en: "Click to open", de: "Klicken zum Öffnen" },
  "bar.interval.work": { en: "Work", de: "Arbeit" },
  "bar.interval.rest": { en: "Rest", de: "Pause" },

  // Cookie banner
  "cookie.title": { en: "Cookies & Analytics", de: "Cookies & Analytics" },
  "cookie.text": {
    en: "We use cookies for analytics and to provide the best possible experience. Your data is not sold.",
    de: "Wir verwenden Cookies für Analytics und um die bestmögliche Erfahrung zu bieten. Ihre Daten werden nicht verkauft.",
  },
  "cookie.accept": { en: "Accept", de: "Akzeptieren" },
  "cookie.decline": { en: "Decline", de: "Ablehnen" },
  "cookie.close": { en: "Close banner", de: "Banner schließen" },

  // Digital clock
  "clock.switch": { en: "Switch time zone", de: "Zeitzone wechseln" },
  "clock.available": { en: "Available time zones", de: "Verfügbare Zeitzonen" },
  "clock.namePrefix": { en: "Clock -", de: "Uhr -" },

  // Index hints
  "hint.startTimer": {
    en: "Start a timer and come back — it keeps running visibly.",
    de: "Starten Sie einen Timer und kehren Sie hierher zurück – er läuft sichtbar weiter!",
  },

  // Alarm clock
  "alarm.added": { en: "Alarm added", de: "Alarm hinzugefügt" },
  "alarm.deleted": { en: "Alarm deleted", de: "Alarm gelöscht" },
  "alarm.addNew": { en: "Add new alarm", de: "Neuen Alarm hinzufügen" },
  "alarm.add": { en: "Add alarm", de: "Alarm hinzufügen" },
  "alarm.none": { en: "No alarms set", de: "Keine Alarme gesetzt" },
  "alarm.addToGet": { en: "Add an alarm to get notified", de: "Fügen Sie einen Alarm hinzu, um benachrichtigt zu werden" },
  "alarm.inMinutes": { en: "In {m} minutes", de: "In {m} Minuten" },

  // Common buttons/labels
  "common.start": { en: "Start", de: "Start" },
  "common.pause": { en: "Pause", de: "Pause" },
  "common.reset": { en: "Reset", de: "Zurücksetzen" },
  "common.stop": { en: "Stop", de: "Stopp" },
  "common.home": { en: "Home", de: "Start" },

  // Interval timer
  "interval.workTime": { en: "Work Time", de: "Arbeitszeit" },
  "interval.restTime": { en: "Rest Time", de: "Pausenzeit" },
  "interval.roundsCompleted": { en: "Rounds completed: {r}", de: "Runden abgeschlossen: {r}" },
  "interval.rounds": { en: "Rounds: {r}", de: "Runden: {r}" },
  "interval.configure": { en: "Configure Intervals", de: "Intervalle konfigurieren" },
  "interval.workSeconds": { en: "Work Time (seconds)", de: "Arbeitszeit (Sekunden)" },
  "interval.restSeconds": { en: "Rest Time (seconds)", de: "Pausenzeit (Sekunden)" },

  // Metronome
  "metronome.title": { en: "Metronome", de: "Metronom" },
  "metronome.bpm": { en: "BPM", de: "BPM" },

  // Lap timer
  "lap.title": { en: "Lap Timer", de: "Runden-Timer" },
  "lap.record": { en: "Record Lap", de: "Runde speichern" },
  "lap.times": { en: "Lap Times", de: "Rundenzeiten" },
  "lap.total": { en: "Total", de: "Gesamt" },
  "lap.lap": { en: "Lap", de: "Runde" },
};
