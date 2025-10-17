import { useEffect, useMemo, useRef, useState } from "react";
import { Play, Pause, RotateCcw, Home } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { FullscreenButton } from "@/components/FullscreenButton";
import { useTimerContext } from "@/contexts/TimerContext";
import SEO from "@/components/SEO";

const MAX_HOURS = 12;
const ANALOG_ID = "analog-1";

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const msFromParts = (h: number, m: number, s: number) =>
  (h * 3600 + m * 60 + s) * 1000;

export default function AnalogTimer() {
  const { updateTimer, getTimer } = useTimerContext();
  const stored = getTimer(ANALOG_ID);

  const [hours, setHours] = useState(() => {
    if (stored?.targetTime) {
      const total = stored.targetTime / 1000;
      return Math.floor(total / 3600);
    }
    return 0;
  });
  const [minutes, setMinutes] = useState(() => {
    if (stored?.targetTime) {
      const total = stored.targetTime / 1000;
      return Math.floor((total % 3600) / 60);
    }
    return 5;
  });
  const [seconds, setSeconds] = useState(() => {
    if (stored?.targetTime) {
      const total = stored.targetTime / 1000;
      return Math.floor(total % 60);
    }
    return 0;
  });

  const [isRunning, setIsRunning] = useState(stored?.isRunning ?? false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [remaining, setRemaining] = useState(() => {
    if (stored) return stored.currentTime;
    return msFromParts(hours, minutes, seconds);
  });

  const intervalRef = useRef<number>();

  const totalTarget = useMemo(
    () =>
      clamp(
        msFromParts(hours, minutes, seconds),
        1000,
        MAX_HOURS * 3600 * 1000
      ),
    [hours, minutes, seconds]
  );

  useEffect(() => {
    updateTimer({
      id: ANALOG_ID,
      type: "analog",
      name: "Analog Timer",
      color: "analog",
      currentTime: remaining,
      isRunning,
      targetTime: totalTarget,
      path: "/analog",
    });
  }, [remaining, isRunning, totalTarget, updateTimer]);

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

  const handleApply = () => {
    const next = totalTarget;
    setRemaining(next);
    setIsRunning(false);
  };

  const handleReset = () => {
    const base = msFromParts(0, 5, 0);
    setHours(0);
    setMinutes(5);
    setSeconds(0);
    setRemaining(base);
    setIsRunning(false);
  };

  const formatDigital = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return [h, m, s]
      .map((unit) => unit.toString().padStart(2, "0"))
      .join(":");
  };

  const renderAnalog = () => {
    const radius = 180;
    const center = 200;
    const progress = remaining / totalTarget;
    const secondsAngle = (1 - progress) * 360 - 90;
    const angleRad = (secondsAngle * Math.PI) / 180;
    const handLength = radius * 0.8;

    const handX = center + handLength * Math.cos(angleRad);
    const handY = center + handLength * Math.sin(angleRad);

    const displayLabel = formatDigital(remaining);

    return (
      <svg width="400" height="400" className="mx-auto drop-shadow-sm">
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={"hsl(var(--analog))"}
          strokeWidth={10}
          strokeOpacity={0.3}
        />

        {Array.from({ length: 60 }).map((_, idx) => {
          const angle = (idx * 6 - 90) * (Math.PI / 180);
          const outer = radius - (idx % 5 === 0 ? 8 : 4);
          const startX = center + outer * Math.cos(angle);
          const startY = center + outer * Math.sin(angle);
          const endX = center + radius * Math.cos(angle);
          const endY = center + radius * Math.sin(angle);

          return (
            <line
              key={idx}
              x1={startX}
              y1={startY}
              x2={endX}
              y2={endY}
              stroke="hsl(var(--foreground))"
              strokeWidth={idx % 5 === 0 ? 3 : 1}
              opacity={idx % 5 === 0 ? 0.5 : 0.2}
            />
          );
        })}

        <circle cx={center} cy={center} r={6} fill="hsl(var(--foreground))" />

        <line
          x1={center}
          y1={center}
          x2={handX}
          y2={handY}
          stroke={remaining === 0 ? "hsl(var(--destructive))" : "hsl(var(--analog))"}
          strokeWidth={6}
          strokeLinecap="round"
        />

        <text
          x={center}
          y={center + 14}
          textAnchor="middle"
          fontSize={48}
          fontWeight="700"
          fill={remaining === 0 ? "hsl(var(--destructive))" : "hsl(var(--foreground))"}
          className="timer-display"
        >
          {displayLabel}
        </text>
      </svg>
    );
  };

  const minutesSliderValue = minutes + seconds / 60;

  return (
    <div className="min-h-screen bg-gradient-hero p-6">
      <SEO
        title="Analog Timer – 12 hour visual countdown | Stoppclock"
        description="Crisp analog timer that stays visible from across the room. Set up to 12 hours, keep alarms active while you browse other tools."
        keywords={["analog timer","visual countdown","workshop timer","large countdown","classroom timer"]}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "Analog Timer",
          url: "https://www.stoppclock.com/analog",
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
          <h1 className="text-3xl font-bold text-analog">Analog Timer</h1>
          <div className="w-24" />
        </div>

        <Card className="border-2" style={{ borderColor: "hsl(var(--analog))" }}>
          <CardContent className="p-8 space-y-8">
            <div className="flex flex-col lg:flex-row gap-8 items-start">
              <div className="flex-1 space-y-6">
                <div>
                  <label className="text-sm font-semibold uppercase tracking-wide">
                    Duration
                  </label>
                  <div className="mt-3 grid grid-cols-3 gap-3">
                    <div>
                      <span className="text-xs text-muted-foreground">Hours</span>
                      <Input
                        type="number"
                        min={0}
                        max={MAX_HOURS}
                        value={hours}
                        onChange={(e) => setHours(clamp(parseInt(e.target.value || "0", 10), 0, MAX_HOURS))}
                      />
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground">Minutes</span>
                      <Input
                        type="number"
                        min={0}
                        max={59}
                        value={minutes}
                        onChange={(e) => setMinutes(clamp(parseInt(e.target.value || "0", 10), 0, 59))}
                      />
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground">Seconds</span>
                      <Input
                        type="number"
                        min={0}
                        max={59}
                        value={seconds}
                        onChange={(e) => setSeconds(clamp(parseInt(e.target.value || "0", 10), 0, 59))}
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <Slider
                      value={[minutesSliderValue]}
                      max={59}
                      step={1}
                      onValueChange={([value]) => {
                        const whole = Math.floor(value);
                        const fractional = value - whole;
                        setMinutes(whole);
                        setSeconds(Math.round(fractional * 60));
                      }}
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={handleApply}
                    style={{ backgroundColor: "hsl(var(--analog))" }}
                  >
                    Apply duration
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleReset}
                    style={{ borderColor: "hsl(var(--analog))", color: "hsl(var(--analog))" }}
                  >
                    <RotateCcw className="w-4 h-4" />
                    Reset
                  </Button>
                </div>

                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    The analog face is readable from a distance. Set your duration, hit start and keep working — switching back to the home screen won’t reset the timer.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Maximum length: 12 hours. The timer keeps running in the background and also works fullscreen.
                  </p>
                </div>
              </div>

              <div className="flex-1 flex flex-col items-center gap-6">
                {renderAnalog()}
                <div className="flex gap-4">
                  <Button
                    size="lg"
                    className="gap-2"
                    style={{ backgroundColor: "hsl(var(--analog))" }}
                    onClick={() => {
                      if (remaining === 0) setRemaining(totalTarget);
                      setIsRunning((prev) => !prev);
                    }}
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
                    onClick={() => setRemaining(totalTarget)}
                    style={{ borderColor: "hsl(var(--analog))", color: "hsl(var(--analog))" }}
                  >
                    Reset Position
                  </Button>
                </div>
                <FullscreenButton
                  isFullscreen={isFullscreen}
                  onToggle={setIsFullscreen}
                  color="analog"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
