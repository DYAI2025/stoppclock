import { useEffect, useMemo, useRef, useState } from "react";
import { Play, Pause, RotateCcw, Home } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FullscreenButton } from "@/components/FullscreenButton";
import { useTimerContext } from "@/contexts/TimerContext";
import SEO from "@/components/SEO";

const TIMER_ID = "rounds-1";

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const format = (ms: number) => {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
};

const toMs = (m: number, s: number) => (m * 60 + s) * 1000;

export default function RoundsTimer() {
  const { updateTimer, getTimer } = useTimerContext();
  const stored = getTimer(TIMER_ID);

  const [roundMinutes, setRoundMinutes] = useState(stored?.meta?.roundMinutes as number ?? 0);
  const [roundSeconds, setRoundSeconds] = useState(stored?.meta?.roundSeconds as number ?? 40);
  const [restMinutes, setRestMinutes] = useState(stored?.meta?.restMinutes as number ?? 0);
  const [restSeconds, setRestSeconds] = useState(stored?.meta?.restSeconds as number ?? 20);
  const [totalRounds, setTotalRounds] = useState(stored?.meta?.totalRounds as number ?? 10);

  const [phase, setPhase] = useState<"work" | "rest">(stored?.isWorking === false ? "rest" : "work");
  const [currentRound, setCurrentRound] = useState(stored?.meta?.currentRound as number ?? 1);
  const [isRunning, setIsRunning] = useState(stored?.isRunning ?? false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [remaining, setRemaining] = useState(() => {
    if (stored) return stored.currentTime;
    return toMs(roundMinutes, roundSeconds);
  });

  const intervalRef = useRef<number>();

  const workMs = useMemo(
    () => toMs(clamp(roundMinutes, 0, 59), clamp(roundSeconds, 0, 59)),
    [roundMinutes, roundSeconds]
  );
  const restMs = useMemo(
    () => toMs(clamp(restMinutes, 0, 59), clamp(restSeconds, 0, 59)),
    [restMinutes, restSeconds]
  );

  useEffect(() => {
    updateTimer({
      id: TIMER_ID,
      type: "rounds",
      name: "Rounds Timer",
      color: "interval",
      currentTime: remaining,
      isRunning,
      isWorking: phase === "work",
      targetTime: phase === "work" ? workMs : restMs,
      path: "/rounds",
      meta: {
        roundMinutes,
        roundSeconds,
        restMinutes,
        restSeconds,
        totalRounds,
        currentRound,
      },
    });
  }, [remaining, isRunning, phase, workMs, restMs, roundMinutes, roundSeconds, restMinutes, restSeconds, totalRounds, currentRound, updateTimer]);

  useEffect(() => {
    if (!isRunning) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = window.setInterval(() => {
      setRemaining((prev) => {
        const next = prev - 20;
        if (next <= 0) {
          if (phase === "work") {
            if (restMs <= 0) {
              setCurrentRound((r) => Math.min(totalRounds, r + 1));
              return workMs;
            }
            setPhase("rest");
            return restMs;
          }
          // rest phase
          const nextRound = currentRound + 1;
          if (nextRound > totalRounds) {
            setIsRunning(false);
            return 0;
          }
          setCurrentRound(nextRound);
          setPhase("work");
          return workMs;
        }
        return next;
      });
    }, 20);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, phase, workMs, restMs, currentRound, totalRounds]);

  const toggleRun = () => {
    if (remaining === 0) {
      setCurrentRound(1);
      setPhase("work");
      setRemaining(workMs);
    }
    setIsRunning((prev) => !prev);
  };

  const handleReset = () => {
    setIsRunning(false);
    setPhase("work");
    setCurrentRound(1);
    setRemaining(workMs);
  };

  const sessionComplete = currentRound > totalRounds || (currentRound === totalRounds && phase === "rest" && remaining === 0);

  return (
    <div className="min-h-screen bg-gradient-hero p-6">
      <SEO
        title="Rounds Timer – Work & rest intervals for training | Stoppclock"
        description="Program custom work and rest intervals that continue running while you browse. Great for workouts, classes and speaking sessions."
        keywords={["round timer","interval timer","EMOM","boxing timer","workout timer"]}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "Rounds Timer",
          url: "https://www.stoppclock.com/rounds",
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
          <h1 className="text-3xl font-bold text-interval">Rounds Timer</h1>
          <div className="w-24" />
        </div>

        <Card className="border-2" style={{ borderColor: "hsl(var(--interval))" }}>
          <CardContent className="p-8 space-y-8">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div>
                  <h2 className="text-lg font-semibold">Work interval</h2>
                  <div className="flex gap-3 mt-2">
                    <Input
                      type="number"
                      min={0}
                      max={59}
                      value={roundMinutes}
                      onChange={(e) => setRoundMinutes(clamp(parseInt(e.target.value || "0", 10), 0, 59))}
                      aria-label="Work minutes"
                    />
                    <Input
                      type="number"
                      min={0}
                      max={59}
                      value={roundSeconds}
                      onChange={(e) => setRoundSeconds(clamp(parseInt(e.target.value || "0", 10), 0, 59))}
                      aria-label="Work seconds"
                    />
                  </div>
                </div>

                <div>
                  <h2 className="text-lg font-semibold">Rest interval</h2>
                  <div className="flex gap-3 mt-2">
                    <Input
                      type="number"
                      min={0}
                      max={59}
                      value={restMinutes}
                      onChange={(e) => setRestMinutes(clamp(parseInt(e.target.value || "0", 10), 0, 59))}
                      aria-label="Rest minutes"
                    />
                    <Input
                      type="number"
                      min={0}
                      max={59}
                      value={restSeconds}
                      onChange={(e) => setRestSeconds(clamp(parseInt(e.target.value || "0", 10), 0, 59))}
                      aria-label="Rest seconds"
                    />
                  </div>
                </div>

                <div>
                  <h2 className="text-lg font-semibold">Rounds</h2>
                  <Input
                    type="number"
                    min={1}
                    max={99}
                    value={totalRounds}
                    onChange={(e) => setTotalRounds(clamp(parseInt(e.target.value || "1", 10), 1, 99))}
                    aria-label="Total rounds"
                  />
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={() => {
                      setCurrentRound(1);
                      setPhase("work");
                      setRemaining(workMs);
                    }}
                    style={{ backgroundColor: "hsl(var(--interval))" }}
                  >
                    Apply settings
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleReset}
                    style={{ borderColor: "hsl(var(--interval))", color: "hsl(var(--interval))" }}
                  >
                    <RotateCcw className="w-4 h-4" />
                    Reset
                  </Button>
                </div>
              </div>

              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <p className="text-sm uppercase tracking-widest text-muted-foreground">
                    {sessionComplete ? "Session complete" : phase === "work" ? "Work" : "Rest"}
                  </p>
                  <div className="timer-display text-7xl font-bold" style={{ color: `hsl(var(--${phase === "work" ? "interval" : "stopwatch"}))` }}>
                    {format(remaining)}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Round {Math.min(currentRound, totalRounds)} of {totalRounds}
                  </p>
                </div>

                <div className="flex gap-4 justify-center">
                  <Button
                    size="lg"
                    className="gap-2"
                    onClick={toggleRun}
                    disabled={sessionComplete && !isRunning}
                    style={{ backgroundColor: `hsl(var(--interval))` }}
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
                    onClick={handleReset}
                    style={{ borderColor: `hsl(var(--interval))`, color: `hsl(var(--interval))` }}
                  >
                    <RotateCcw className="w-5 h-5" />
                    Reset timer
                  </Button>
                </div>

                <FullscreenButton
                  isFullscreen={isFullscreen}
                  onToggle={setIsFullscreen}
                  color="interval"
                />

                <p className="text-sm text-muted-foreground">
                  Tip: Create your warm-up and rest presets, hit start and move to another tool — the active bar at the bottom keeps the rounds timer running and lets you jump back instantly.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
