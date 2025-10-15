import { useState, useEffect } from "react";
import { Play, Pause, RotateCcw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FullscreenButton } from "@/components/FullscreenButton";
import { Link } from "react-router-dom";
import { useTimerContext } from "@/contexts/TimerContext";

export default function PomodoroTimer() {
  const { updateTimer, getTimer, removeTimer } = useTimerContext();
  const timerId = "pomodoro-1";

  const [isFullscreen, setIsFullscreen] = useState(false);

  // Get current timer state from context
  const existingTimer = getTimer(timerId);
  const time = existingTimer?.currentTime || 60000; // 60 seconds default
  const isRunning = existingTimer?.isRunning || false;

  const seconds = Math.ceil(time / 1000);
  const isLastTen = seconds <= 10 && seconds > 0;
  const isExpired = time <= 0;

  const handleStartPause = () => {
    updateTimer({
      id: timerId,
      type: "countdown",
      name: "60s Timer",
      color: "alarm",
      currentTime: time,
      isRunning: !isRunning,
      targetTime: 60000,
      path: "/pomodoro",
    });
  };

  const handleReset = () => {
    removeTimer(timerId);
    // Re-add with 60 seconds
    updateTimer({
      id: timerId,
      type: "countdown",
      name: "60s Timer",
      color: "alarm",
      currentTime: 60000,
      isRunning: false,
      targetTime: 60000,
      path: "/pomodoro",
    });
  };

  const toggleFullscreen = () => setIsFullscreen(!isFullscreen);

  // Analog clock SVG
  const renderAnalogClock = () => {
    const radius = 140;
    const centerX = 160;
    const centerY = 160;
    const angle = ((60 - seconds) / 60) * 360 - 90; // Start from top
    const angleRad = (angle * Math.PI) / 180;
    const handX = centerX + radius * 0.8 * Math.cos(angleRad);
    const handY = centerY + radius * 0.8 * Math.sin(angleRad);

    return (
      <svg width="320" height="320" className="mx-auto">
        {/* Clock circle */}
        <circle
          cx={centerX}
          cy={centerY}
          r={radius}
          fill="none"
          stroke={isLastTen ? "hsl(var(--alarm))" : "hsl(var(--muted))"}
          strokeWidth="8"
          className={isLastTen ? "animate-pulse" : ""}
        />

        {/* Progress arc */}
        <circle
          cx={centerX}
          cy={centerY}
          r={radius}
          fill="none"
          stroke={
            isExpired
              ? "hsl(var(--alarm))"
              : isLastTen
              ? "hsl(var(--alarm))"
              : "hsl(var(--primary))"
          }
          strokeWidth="8"
          strokeDasharray={`${(2 * Math.PI * radius * seconds) / 60} ${
            2 * Math.PI * radius
          }`}
          strokeDashoffset={2 * Math.PI * radius * 0.25}
          transform={`rotate(-90 ${centerX} ${centerY})`}
          className={
            isLastTen ? "animate-pulse" : "transition-all duration-100"
          }
        />

        {/* Hour markers */}
        {[...Array(12)].map((_, i) => {
          const markerAngle = (i * 30 - 90) * (Math.PI / 180);
          const startX = centerX + (radius - 15) * Math.cos(markerAngle);
          const startY = centerY + (radius - 15) * Math.sin(markerAngle);
          const endX = centerX + (radius - 5) * Math.cos(markerAngle);
          const endY = centerY + (radius - 5) * Math.sin(markerAngle);

          return (
            <line
              key={i}
              x1={startX}
              y1={startY}
              x2={endX}
              y2={endY}
              stroke="hsl(var(--foreground))"
              strokeWidth="2"
              opacity="0.3"
            />
          );
        })}

        {/* Center dot */}
        <circle cx={centerX} cy={centerY} r="6" fill="hsl(var(--foreground))" />

        {/* Hand */}
        <line
          x1={centerX}
          y1={centerY}
          x2={handX}
          y2={handY}
          stroke={
            isExpired
              ? "hsl(var(--alarm))"
              : isLastTen
              ? "hsl(var(--alarm))"
              : "hsl(var(--primary))"
          }
          strokeWidth="4"
          strokeLinecap="round"
          className={isLastTen ? "animate-pulse" : ""}
        />

        {/* Digital display in center */}
        <text
          x={centerX}
          y={centerY + 50}
          textAnchor="middle"
          className="timer-display"
          style={{
            fontSize: "48px",
            fontWeight: "bold",
            fill: isExpired
              ? "hsl(var(--alarm))"
              : isLastTen
              ? "hsl(var(--alarm))"
              : "hsl(var(--primary))",
          }}
        >
          {seconds}s
        </text>
      </svg>
    );
  };

  if (isFullscreen) {
    return (
      <div
        className={`min-h-screen w-full flex flex-col items-center justify-center p-4 transition-colors duration-500 ${
          isExpired
            ? "bg-destructive/20"
            : isLastTen
            ? "bg-alarm/10"
            : "bg-gradient-to-br from-alarm/5 to-alarm/20"
        }`}
      >
        <div className="w-full max-w-6xl flex flex-col items-center space-y-12">
          <h1
            className={`text-4xl font-bold ${
              isExpired || isLastTen ? "text-alarm animate-pulse" : "text-alarm"
            }`}
          >
            {isExpired ? "Zeit abgelaufen!" : "60 Sekunden Timer"}
          </h1>

          {renderAnalogClock()}

          <div className="flex gap-6">
            <Button
              onClick={handleStartPause}
              size="lg"
              className="h-20 px-12 text-xl"
              disabled={isExpired}
              style={{ backgroundColor: `hsl(var(--alarm))` }}
            >
              {isRunning ? (
                <Pause className="w-8 h-8" />
              ) : (
                <Play className="w-8 h-8" />
              )}
            </Button>
            <Button
              onClick={handleReset}
              variant="outline"
              size="lg"
              className="h-20 px-12 text-xl"
              style={{
                borderColor: `hsl(var(--alarm))`,
                color: `hsl(var(--alarm))`,
              }}
            >
              <RotateCcw className="w-8 h-8" />
            </Button>
          </div>
          <FullscreenButton
            isFullscreen={isFullscreen}
            onToggle={toggleFullscreen}
            color="alarm"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Link to="/">
            <Button variant="ghost" className="gap-2">
              <Home className="w-5 h-5" />
              Home
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-alarm">60 Sekunden Timer</h1>
          <div className="w-24" />
        </div>

        <Card className="border-2" style={{ borderColor: `hsl(var(--alarm))` }}>
          <CardContent className="p-8 space-y-8">
            <div
              className={`text-center ${
                isExpired || isLastTen ? "animate-pulse" : ""
              }`}
            >
              {renderAnalogClock()}
            </div>

            {isExpired && (
              <div className="text-center">
                <p className="text-2xl font-bold text-destructive animate-pulse">
                  Zeit abgelaufen!
                </p>
              </div>
            )}

            <div className="flex justify-center gap-4">
              <Button
                onClick={handleStartPause}
                size="lg"
                className="gap-2"
                disabled={isExpired}
                style={{ backgroundColor: `hsl(var(--alarm))` }}
              >
                {isRunning ? (
                  <>
                    <Pause className="w-5 h-5" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5" />
                    Start
                  </>
                )}
              </Button>
              <Button
                onClick={handleReset}
                variant="outline"
                size="lg"
                className="gap-2"
                style={{
                  borderColor: `hsl(var(--alarm))`,
                  color: `hsl(var(--alarm))`,
                }}
              >
                <RotateCcw className="w-5 h-5" />
                Reset
              </Button>
            </div>

            <FullscreenButton
              isFullscreen={isFullscreen}
              onToggle={toggleFullscreen}
              color="alarm"
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-bold mb-2 text-alarm">About this timer</h3>
            <p className="text-muted-foreground">
              A visual 60‑second timer with analog display. The last 10 seconds blink red as a warning. Perfect for short tasks, presentations or games.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
