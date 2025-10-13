import {
  Timer,
  Clock,
  Zap,
  Bell,
  Activity,
  Hourglass,
  Timer as TimerIcon,
  Swords,
} from "lucide-react";
import { ToolCard } from "@/components/ToolCard";
import { ActiveTimerBar } from "@/components/ActiveTimerBar";
import { useTimerContext } from "@/contexts/TimerContext";

const tools = [
  {
    title: "Stopwatch",
    description: "Precise time measurement with lap tracking",
    icon: Timer,
    color: "stopwatch",
    path: "/stopwatch",
  },
  {
    title: "Countdown Timer",
    description: "Set custom countdown timers",
    icon: Hourglass,
    color: "countdown",
    path: "/countdown",
  },
  {
    title: "Interval Timer",
    description: "Alternate between work and rest periods",
    icon: Zap,
    color: "interval",
    path: "/interval",
  },
  {
    title: "Digital Clock",
    description: "Real-time digital clock display",
    icon: Clock,
    color: "clock",
    path: "/clock",
  },
  {
    title: "Alarm Clock",
    description: "Set alarms and reminders",
    icon: Bell,
    color: "alarm",
    path: "/alarm",
  },
  {
    title: "Metronome",
    description: "Musical tempo and rhythm keeper",
    icon: Activity,
    color: "metronome",
    path: "/metronome",
  },
  {
    title: "Chess Clock",
    description: "Two-player game timer",
    icon: Swords,
    color: "chess",
    path: "/chess",
  },
  {
    title: "60s Timer",
    description: "Quick 60-second analog countdown",
    icon: TimerIcon,
    color: "alarm",
    path: "/pomodoro",
  },
];

export default function Index() {
  const { activeTimers } = useTimerContext();

  return (
    <div className="min-h-screen bg-gradient-hero">
      <div
        className={`container mx-auto px-4 py-12 space-y-12 transition-all duration-300 ${
          activeTimers.length > 0 ? "pb-64" : "pb-12"
        }`}
      >
        <header className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Stoppclock
          </h1>
        </header>

        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tools.map((tool) => (
              <ToolCard
                key={tool.path}
                title={tool.title}
                description={tool.description}
                icon={tool.icon}
                color={tool.color}
                path={tool.path}
              />
            ))}
          </div>
        </section>

        {activeTimers.length === 0 && (
          <div className="text-center p-8 rounded-2xl bg-muted/30 border border-border/50 max-w-2xl mx-auto">
            <p className="text-sm text-muted-foreground">
              💡 Starten Sie einen Timer und kehren Sie hierher zurück – er
              läuft sichtbar weiter!
            </p>
          </div>
        )}

        <footer className="text-center text-sm text-muted-foreground pt-12 border-t">
          <p>
            Alle Timer verfügen über einen Vollbildmodus für maximale
            Sichtbarkeit
          </p>
        </footer>
      </div>

      <ActiveTimerBar />
    </div>
  );
}
