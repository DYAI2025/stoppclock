import { useEffect, useMemo, useRef, useState } from "react";
import { Play, Pause, RotateCcw, Home } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FullscreenButton } from "@/components/FullscreenButton";
import { useTimerContext } from "@/contexts/TimerContext";
import SEO from "@/components/SEO";

const TIMER_ID = "countdown-1";

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const toMs = (h: number, m: number, s: number) =>
  (h * 3600 + m * 60 + s) * 1000;

const format = (ms: number) => {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const hours = Math.floor(totalSeconds / 3600)
    .toString()
    .padStart(2, "0");
  const minutes = Math.floor((totalSeconds % 3600) / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  return hours !== "00" ? `${hours}:${minutes}:${seconds}` : `${minutes}:${seconds}`;
};

export default function Countdown() {
  const { updateTimer, getTimer } = useTimerContext();
  const stored = getTimer(TIMER_ID);

  const initialTarget = stored?.targetTime ?? 5 * 60 * 1000;
  const initialHours = Math.floor(initialTarget / 3600000);
  const initialMinutes = Math.floor((initialTarget % 3600000) / 60000);
  const initialSeconds = Math.floor((initialTarget % 60000) / 1000);

  const [hours, setHours] = useState(initialHours);
  const [minutes, setMinutes] = useState(initialMinutes);
  const [seconds, setSeconds] = useState(initialSeconds);
  const [remaining, setRemaining] = useState(stored?.currentTime ?? initialTarget);
  const [isRunning, setIsRunning] = useState(stored?.isRunning ?? false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const intervalRef = useRef<number>();

  const targetTime = useMemo(() => {
    const ms = toMs(hours, minutes, seconds);
    return ms > 0 ? ms : 1000;
  }, [hours, minutes, seconds]);

  useEffect(() => {
    updateTimer({
      id: TIMER_ID,
      type: "countdown",
      name: "Countdown",
      color: "countdown",
      currentTime: remaining,
      isRunning,
      targetTime,
      path: "/countdown",
    });
  }, [remaining, isRunning, targetTime, updateTimer]);

  useEffect(() => {
    if (!isRunning) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = window.setInterval(() => {
      setRemaining((prev) => {
        const next = prev - 20;
        if (next <= 0) {
          setIsRunning(false);
          return 0;
        }
        return next;
      });
    }, 20);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  const applyDuration = () => {
    setRemaining(targetTime);
    setIsRunning(false);
  };

  const toggleRun = () => {
    if (remaining === 0) {
      setRemaining(targetTime);
    }
    setIsRunning((prev) => !prev);
  };

  const resetCurrent = () => {
    setRemaining(targetTime);
    setIsRunning(false);
  };

  const expired = remaining === 0;

  return (
    <div className="min-h-screen bg-gradient-hero p-6">
      <SEO
        title="Countdown Timer – Reliable timer for events & study | Stoppclock"
        description="Set precise countdowns up to 99 hours. Fullscreen friendly, keeps running while you browse other tools, ideal for events, exams and workshops."
        keywords={["countdown timer","online timer","event timer","exam timer"]}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "Countdown Timer",
          url: "https://www.stoppclock.com/countdown",
          applicationCategory: "UtilitiesApplication",
        }}
      />
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <Link to="/">
            <Button variant="ghost" className="gap-2">
              <Home className="w-5 h-5" />
              Home
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-countdown">Countdown Timer</h1>
          <div className="w-24" />
        </div>

        <Card className="border-2" style={{ borderColor: "hsl(var(--countdown))" }}>
          <CardContent className="p-8 space-y-8">
            <div
              className={`timer-display text-7xl md:text-8xl font-bold text-center ${
                expired ? "text-destructive animate-pulse" : "text-countdown"
              }`}
            >
              {format(remaining)}
            </div>

            <div className="flex justify-center gap-4">
              <Button
                size="lg"
                className="gap-2"
                onClick={toggleRun}
                style={{ backgroundColor: "hsl(var(--countdown))" }}
              >
                {isRunning ? (
                  <>
                    <Pause className="w-5 h-5" /> Pause
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5" /> Start
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="gap-2"
                onClick={resetCurrent}
                style={{ borderColor: "hsl(var(--countdown))", color: "hsl(var(--countdown))" }}
              >
                <RotateCcw className="w-5 h-5" /> Reset
              </Button>
            </div>

            <FullscreenButton isFullscreen={isFullscreen} onToggle={setIsFullscreen} color="countdown" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 space-y-4">
            <h2 className="text-xl font-bold text-countdown">Set duration</h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Hours</label>
                <Input
                  type="number"
                  min={0}
                  max={99}
                  value={hours}
                  onChange={(e) => setHours(clamp(parseInt(e.target.value || "0", 10), 0, 99))}
                  className="text-center"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Minutes</label>
                <Input
                  type="number"
                  min={0}
                  max={59}
                  value={minutes}
                  onChange={(e) => setMinutes(clamp(parseInt(e.target.value || "0", 10), 0, 59))}
                  className="text-center"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Seconds</label>
                <Input
                  type="number"
                  min={0}
                  max={59}
                  value={seconds}
                  onChange={(e) => setSeconds(clamp(parseInt(e.target.value || "0", 10), 0, 59))}
                  className="text-center"
                />
              </div>
            </div>
            <Button
              onClick={applyDuration}
              className="w-full"
              style={{ backgroundColor: "hsl(var(--countdown))" }}
            >
              Apply
            </Button>
            <p className="text-sm text-muted-foreground">
              Tip: set the duration and leave the page – the timer keeps running and appears in the active timer bar so you can jump back quickly.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
