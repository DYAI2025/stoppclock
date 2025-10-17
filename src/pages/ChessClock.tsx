import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Home, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useTimerContext } from "@/contexts/TimerContext";
import SEO from "@/components/SEO";

const TIMER_ID = "chess-1";

const clamp = (v: number, min: number, max: number) =>
  Math.min(Math.max(v, min), max);

const format = (ms: number) => {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
};

export default function ChessClock() {
  const { updateTimer, getTimer } = useTimerContext();
  const stored = getTimer(TIMER_ID);

  const [baseMinutes, setBaseMinutes] = useState<number>(
    typeof stored?.meta?.baseMinutes === "number" ? (stored.meta.baseMinutes as number) : 5
  );
  const [incrementSeconds, setIncrementSeconds] = useState<number>(
    typeof stored?.meta?.increment === "number" ? (stored.meta.increment as number) : 0
  );
  const [labelLeft, setLabelLeft] = useState<string>((stored?.meta?.labelLeft as string) || "Player A");
  const [labelRight, setLabelRight] = useState<string>((stored?.meta?.labelRight as string) || "Player B");

  const initialMs = baseMinutes * 60 * 1000;

  const [leftMs, setLeftMs] = useState<number>(
    typeof stored?.meta?.leftMs === "number" ? (stored.meta.leftMs as number) : initialMs
  );
  const [rightMs, setRightMs] = useState<number>(
    typeof stored?.meta?.rightMs === "number" ? (stored.meta.rightMs as number) : initialMs
  );
  const [activeSide, setActiveSide] = useState<"left" | "right">(
    stored?.meta?.activeSide === "right" ? "right" : "left"
  );
  const [isRunning, setIsRunning] = useState(stored?.isRunning ?? false);

  const intervalRef = useRef<number>();

  useEffect(() => {
    updateTimer({
      id: TIMER_ID,
      type: "chess",
      name: `Chess Clock` ,
      color: "chess",
      currentTime: activeSide === "left" ? leftMs : rightMs,
      isRunning,
      path: "/chess",
      meta: {
        baseMinutes,
        increment: incrementSeconds,
        leftMs,
        rightMs,
        activeSide,
        labelLeft,
        labelRight,
      },
    });
  }, [leftMs, rightMs, activeSide, isRunning, baseMinutes, incrementSeconds, labelLeft, labelRight, updateTimer]);

  useEffect(() => {
    if (!isRunning) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = window.setInterval(() => {
      if (activeSide === "left") {
        setLeftMs((prev) => {
          const next = prev - 20;
          if (next <= 0) {
            setIsRunning(false);
            return 0;
          }
          return next;
        });
      } else {
        setRightMs((prev) => {
          const next = prev - 20;
          if (next <= 0) {
            setIsRunning(false);
            return 0;
          }
          return next;
        });
      }
    }, 20);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [activeSide, isRunning]);

  const applyPreset = () => {
    const next = baseMinutes * 60 * 1000;
    setLeftMs(next);
    setRightMs(next);
    setActiveSide("left");
    setIsRunning(false);
  };

  const handleTap = (side: "left" | "right") => {
    if (!isRunning) return;
    if (side !== activeSide) return;
    if (side === "left") {
      setLeftMs((prev) => Math.max(0, prev + incrementSeconds * 1000));
      setActiveSide("right");
    } else {
      setRightMs((prev) => Math.max(0, prev + incrementSeconds * 1000));
      setActiveSide("left");
    }
  };

  const startMatch = () => {
    if (!isRunning) {
      setLeftMs((prev) => (prev === 0 ? baseMinutes * 60 * 1000 : prev));
      setRightMs((prev) => (prev === 0 ? baseMinutes * 60 * 1000 : prev));
      setActiveSide("left");
      setIsRunning(true);
    } else {
      setIsRunning(false);
    }
  };

  const resetMatch = () => {
    const next = baseMinutes * 60 * 1000;
    setLeftMs(next);
    setRightMs(next);
    setActiveSide("left");
    setIsRunning(false);
  };

  const leftLost = leftMs === 0 && isRunning === false && activeSide === "left";
  const rightLost = rightMs === 0 && isRunning === false && activeSide === "right";

  return (
    <div className="min-h-screen bg-gradient-hero p-6">
      <SEO
        title="Chess Clock – Online two-player timer with increments"
        description="Fast chess clock with configurable base time and increments. Works fullscreen and keeps running while you browse other tools."
        keywords={["chess clock","online chess timer","increment timer","blitz chess"]}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "Chess Clock",
          url: "https://www.stoppclock.com/chess",
          applicationCategory: "UtilitiesApplication",
        }}
      />
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <Link to="/">
            <Button variant="ghost" className="gap-2">
              <Home className="w-5 h-5" />
              Home
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-chess">Chess Clock</h1>
          <div className="w-24" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card
            className={`border-4 cursor-pointer transition-all ${
              activeSide === "left" ? "opacity-100" : "opacity-70"
            } ${leftLost ? "border-destructive" : "border-transparent"}`}
            style={{ borderColor: activeSide === "left" ? "hsl(var(--chess))" : undefined }}
            onClick={() => handleTap("left")}
          >
            <CardContent className="p-12 text-center space-y-4">
              <h2 className="text-3xl font-bold text-chess">
                {labelLeft}
              </h2>
              <div
                className={`timer-display text-7xl md:text-8xl font-bold ${
                  leftLost ? "text-destructive" : "text-chess"
                }`}
              >
                {format(leftMs)}
              </div>
            </CardContent>
          </Card>

          <Card
            className={`border-4 cursor-pointer transition-all ${
              activeSide === "right" ? "opacity-100" : "opacity-70"
            } ${rightLost ? "border-destructive" : "border-transparent"}`}
            style={{ borderColor: activeSide === "right" ? "hsl(var(--chess))" : undefined }}
            onClick={() => handleTap("right")}
          >
            <CardContent className="p-12 text-center space-y-4">
              <h2 className="text-3xl font-bold text-chess">
                {labelRight}
              </h2>
              <div
                className={`timer-display text-7xl md:text-8xl font-bold ${
                  rightLost ? "text-destructive" : "text-chess"
                }`}
              >
                {format(rightMs)}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="grid gap-4 md:grid-cols-5">
              <div className="space-y-1">
                <label className="text-xs uppercase text-muted-foreground">Base minutes</label>
                <Input
                  type="number"
                  min={1}
                  max={60}
                  value={baseMinutes}
                  onChange={(e) => setBaseMinutes(clamp(parseInt(e.target.value || "5", 10), 1, 60))}
                  aria-label="Base minutes per player"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs uppercase text-muted-foreground">Increment (seconds)</label>
                <Input
                  type="number"
                  min={0}
                  max={60}
                  value={incrementSeconds}
                  onChange={(e) => setIncrementSeconds(clamp(parseInt(e.target.value || "0", 10), 0, 60))}
                  aria-label="Increment seconds"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs uppercase text-muted-foreground">Player A name</label>
                <Input
                  value={labelLeft}
                  onChange={(e) => setLabelLeft(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs uppercase text-muted-foreground">Player B name</label>
                <Input
                  value={labelRight}
                  onChange={(e) => setLabelRight(e.target.value)}
                />
              </div>
              <div className="space-y-1 flex flex-col justify-end">
                <Button
                  onClick={applyPreset}
                  style={{ backgroundColor: "hsl(var(--chess))" }}
                >
                  Apply preset
                </Button>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={startMatch}
                className="gap-2"
                style={{ backgroundColor: "hsl(var(--chess))" }}
              >
                {isRunning ? "Pause" : "Start"}
              </Button>
              <Button
                variant="outline"
                onClick={resetMatch}
                className="gap-2"
                style={{ borderColor: "hsl(var(--chess))", color: "hsl(var(--chess))" }}
              >
                <RotateCcw className="w-4 h-4" /> Reset clocks
              </Button>
            </div>

            <p className="text-sm text-muted-foreground">
              Tap the active player’s clock after every move. The configured increment is added automatically when you hit the side toggle. Settings persist while you explore other timers.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
