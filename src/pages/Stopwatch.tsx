import { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, Flag, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FullscreenButton } from "@/components/FullscreenButton";
import { Link } from "react-router-dom";

export default function Stopwatch() {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState<number[]>([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const intervalRef = useRef<number>();

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = window.setInterval(() => {
        setTime((t) => t + 10);
      }, 10);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const milliseconds = Math.floor((ms % 1000) / 10);

    if (hours > 0) {
      return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}.${milliseconds.toString().padStart(2, "0")}`;
    }
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}.${milliseconds.toString().padStart(2, "0")}`;
  };

  const handleStartPause = () => setIsRunning(!isRunning);
  const handleReset = () => {
    setTime(0);
    setIsRunning(false);
    setLaps([]);
  };
  const handleLap = () => {
    if (isRunning) setLaps([time, ...laps]);
  };

  const toggleFullscreen = () => setIsFullscreen(!isFullscreen);

  if (isFullscreen) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-stopwatch/5 to-stopwatch/20 p-4">
        <div className="w-full max-w-6xl flex flex-col items-center space-y-12">
          <h1 className="text-4xl font-bold text-stopwatch">Stopwatch</h1>
          <div className="timer-display text-[12rem] md:text-[16rem] font-bold text-stopwatch leading-none">
            {formatTime(time)}
          </div>
          <div className="flex gap-6">
            <Button
              onClick={handleStartPause}
              size="lg"
              className="h-20 px-12 text-xl"
              style={{ backgroundColor: `hsl(var(--stopwatch))` }}
            >
              {isRunning ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8" />}
            </Button>
            <Button
              onClick={handleReset}
              variant="outline"
              size="lg"
              className="h-20 px-12 text-xl"
              style={{ borderColor: `hsl(var(--stopwatch))`, color: `hsl(var(--stopwatch))` }}
            >
              <RotateCcw className="w-8 h-8" />
            </Button>
            <Button
              onClick={handleLap}
              variant="outline"
              size="lg"
              className="h-20 px-12 text-xl"
              disabled={!isRunning}
              style={{ borderColor: `hsl(var(--stopwatch))`, color: `hsl(var(--stopwatch))` }}
            >
              <Flag className="w-8 h-8" />
            </Button>
          </div>
          <FullscreenButton isFullscreen={isFullscreen} onToggle={toggleFullscreen} color="stopwatch" />
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
          <h1 className="text-3xl font-bold text-stopwatch">Stopwatch</h1>
          <div className="w-24" />
        </div>

        <Card className="border-2" style={{ borderColor: `hsl(var(--stopwatch))` }}>
          <CardContent className="p-8 space-y-8">
            <div className="timer-display text-7xl md:text-8xl font-bold text-center text-stopwatch">
              {formatTime(time)}
            </div>

            <div className="flex justify-center gap-4">
              <Button
                onClick={handleStartPause}
                size="lg"
                className="gap-2"
                style={{ backgroundColor: `hsl(var(--stopwatch))` }}
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
                style={{ borderColor: `hsl(var(--stopwatch))`, color: `hsl(var(--stopwatch))` }}
              >
                <RotateCcw className="w-5 h-5" />
                Reset
              </Button>
              <Button
                onClick={handleLap}
                variant="outline"
                size="lg"
                className="gap-2"
                disabled={!isRunning}
                style={{ borderColor: `hsl(var(--stopwatch))`, color: `hsl(var(--stopwatch))` }}
              >
                <Flag className="w-5 h-5" />
                Lap
              </Button>
            </div>

            <FullscreenButton isFullscreen={isFullscreen} onToggle={toggleFullscreen} color="stopwatch" />
          </CardContent>
        </Card>

        {laps.length > 0 && (
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4 text-stopwatch">Lap Times</h2>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {laps.map((lap, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-3 bg-muted rounded-lg"
                  >
                    <span className="font-medium">Lap {laps.length - index}</span>
                    <span className="timer-display text-lg font-bold text-stopwatch">
                      {formatTime(lap)}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
