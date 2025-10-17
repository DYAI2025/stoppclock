import {
  Timer,
  Hourglass,
  Zap,
  Gauge,
  Globe,
  Swords,
  Clock as ClockIcon,
} from "lucide-react";
import { ToolCard } from "@/components/ToolCard";
import { ActiveTimerBar } from "@/components/ActiveTimerBar";
import { useTimerContext } from "@/contexts/TimerContext";
import SEO from "@/components/SEO";

const tools = [
  {
    title: "Stopwatch",
    description: "Accurate stopwatch with lap times and fullscreen mode.",
    icon: Timer,
    color: "stopwatch",
    path: "/stopwatch",
  },
  {
    title: "Countdown",
    description: "Flexible countdown up to 99 hours with background running.",
    icon: Hourglass,
    color: "countdown",
    path: "/countdown",
  },
  {
    title: "Rounds Timer",
    description: "Set custom work & rest rounds for workouts or speeches.",
    icon: Zap,
    color: "interval",
    path: "/rounds",
  },
  {
    title: "Analog Timer",
    description: "Large 12‑hour analog face, readable from across the room.",
    icon: Gauge,
    color: "analog",
    path: "/analog",
  },
  {
    title: "World Clock",
    description: "Follow world time for key cities with offset overview.",
    icon: Globe,
    color: "clock",
    path: "/world-clock",
  },
  {
    title: "Digital Clock",
    description: "Minimal digital clock with 24h/12h display toggle.",
    icon: ClockIcon,
    color: "clock",
    path: "/clock",
  },
  {
    title: "Chess Clock",
    description: "Two-player clock with increments for casual games.",
    icon: Swords,
    color: "chess",
    path: "/chess",
  },
];

export default function Index() {
  const { activeTimers } = useTimerContext();

  return (
    <div className="min-h-screen bg-gradient-hero">
      <SEO
        title="Stoppclock – Minimal timers for focus, sport and events"
        description="Instant access to stopwatch, countdown, rounds timer, analog wall timer, world clock and chess clock. Built for speed, accuracy and clear visibility."
        keywords={[
          "online timer",
          "analog timer",
          "rounds timer",
          "stopwatch",
          "world clock",
          "chess clock",
          "countdown",
        ]}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Stoppclock",
          url: "https://www.stoppclock.com/",
          description:
            "Minimalist timer suite covering countdowns, stopwatches, rounds, analog displays and world clocks.",
        }}
      />
      <div
        className={`container mx-auto px-4 py-12 space-y-12 transition-all duration-300 ${
          activeTimers.length > 0 ? "pb-64" : "pb-20"
        }`}
      >
        <header className="text-center space-y-4">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Stoppclock
          </h1>
          <p className="max-w-2xl mx-auto text-base text-muted-foreground">
            Quick, reliable and distraction-free timers for global teams, classrooms and creators. Everything is available offline after your first visit and keeps running while you switch tools.
          </p>
        </header>

        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tools.map((tool) => (
              <ToolCard key={tool.path} {...tool} />
            ))}
          </div>
        </section>
      </div>

      <ActiveTimerBar />
    </div>
  );
}
