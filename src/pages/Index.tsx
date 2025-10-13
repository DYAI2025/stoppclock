import { Timer, Clock, Zap, Bell, Activity, Hourglass, Timer as TimerIcon, Swords } from "lucide-react";
import { ToolCard } from "@/components/ToolCard";
import { ActiveTimerBar } from "@/components/ActiveTimerBar";
import { useTimerContext } from "@/contexts/TimerContext";

const tools = [
  {
    title: "Stopwatch",
    description: "Precise time measurement with lap tracking",
    icon: Timer,
    color: "stopwatch",
    path: "/stopwatch"
  },
  {
    title: "Countdown Timer",
    description: "Set custom countdown timers",
    icon: Hourglass,
    color: "countdown",
    path: "/countdown"
  },
  {
    title: "Interval Timer",
    description: "Alternate between work and rest periods",
    icon: Zap,
    color: "interval",
    path: "/interval"
  },
  {
    title: "Digital Clock",
    description: "Real-time digital clock display",
    icon: Clock,
    color: "clock",
    path: "/clock"
  },
  {
    title: "Alarm Clock",
    description: "Set alarms and reminders",
    icon: Bell,
    color: "alarm",
    path: "/alarm"
  },
  {
    title: "Metronome",
    description: "Musical tempo and rhythm keeper",
    icon: Activity,
    color: "metronome",
    path: "/metronome"
  },
  {
    title: "Chess Clock",
    description: "Two-player game timer",
    icon: Swords,
    color: "chess",
    path: "/chess"
  },
  {
    title: "Lap Timer",
    description: "Track multiple lap times",
    icon: TimerIcon,
    color: "lap",
    path: "/lap"
  }
];

export default function Index() {
  const { activeTimers } = useTimerContext();

  return (
    <div className="min-h-screen bg-gradient-hero">
      <div className={`container mx-auto px-4 py-12 space-y-12 ${activeTimers.length > 0 ? 'pb-48' : ''}`}>
        <header className="text-center space-y-4">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Time Tools
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Professional timer toolkit with fullscreen displays for presentations, classrooms, and large audiences
          </p>
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

        <footer className="text-center text-sm text-muted-foreground pt-12 border-t">
          <p>All timers feature fullscreen mode for maximum visibility</p>
        </footer>
      </div>

      <ActiveTimerBar />
    </div>
  );
}
