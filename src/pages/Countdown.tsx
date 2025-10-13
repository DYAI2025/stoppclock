import { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FullscreenButton } from "@/components/FullscreenButton";
import { Link } from "react-router-dom";
import { useTimerContext } from "@/contexts/TimerContext";

export default function Countdown() {
  const { updateTimer, getTimer, removeTimer } = useTimerContext();
  const timerId = "countdown-1";
  const existingTimer = getTimer(timerId);
  
  const [targetTime, setTargetTime] = useState(existingTimer?.targetTime || 60000);
  const [remainingTime, setRemainingTime] = useState(existingTimer?.currentTime || 60000);
  const [isRunning, setIsRunning] = useState(existingTimer?.isRunning || false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(1);
  const [seconds, setSeconds] = useState(0);
  const intervalRef = useRef<number>();

  // Sync with global timer state
  useEffect(() => {
    const timer = getTimer(timerId);
    if (timer) {
      setRemainingTime(timer.currentTime);
      setIsRunning(timer.isRunning);
      if (timer.targetTime) setTargetTime(timer.targetTime);
    }
  }, []);

  // Update global state whenever local state changes
  useEffect(() => {
    if (isRunning || remainingTime < targetTime) {
      updateTimer({
        id: timerId,
        type: "countdown",
        name: "Countdown",
        color: "countdown",
        currentTime: remainingTime,
        isRunning: isRunning,
        targetTime: targetTime,
        path: "/countdown",
      });
    } else if (remainingTime === targetTime && !isRunning) {
      removeTimer(timerId);
    }
  }, [remainingTime, isRunning, targetTime]);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = window.setInterval(() => {
        setRemainingTime((t) => {
          const newTime = t - 10;
          if (newTime <= 0) {
            setIsRunning(false);
            return 0;
          }
          return newTime;
        });
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
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;

    if (h > 0) {
      return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    }
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleStartPause = () => setIsRunning(!isRunning);
  
  const handleReset = () => {
    setIsRunning(false);
    setRemainingTime(targetTime);
    removeTimer(timerId);
  };

  const handleSetTime = () => {
    const totalMs = (hours * 3600 + minutes * 60 + seconds) * 1000;
    setTargetTime(totalMs);
    setRemainingTime(totalMs);
    setIsRunning(false);
    removeTimer(timerId);
  };

  const toggleFullscreen = () => setIsFullscreen(!isFullscreen);

  const isExpired = remainingTime === 0;

  if (isFullscreen) {
    return (
      <div className={`min-h-screen w-full flex flex-col items-center justify-center p-4 transition-colors duration-500 ${
        isExpired ? 'bg-destructive/20' : 'bg-gradient-to-br from-countdown/5 to-countdown/20'
      }`}>
        <div className="w-full max-w-6xl flex flex-col items-center space-y-12">
          <h1 className={`text-4xl font-bold ${isExpired ? 'text-destructive animate-pulse' : 'text-countdown'}`}>
            {isExpired ? 'Time\'s Up!' : 'Countdown Timer'}
          </h1>
          <div className={`timer-display text-[12rem] md:text-[16rem] font-bold leading-none ${
            isExpired ? 'text-destructive animate-pulse' : 'text-countdown'
          }`}>
            {formatTime(remainingTime)}
          </div>
          <div className="flex gap-6">
            <Button
              onClick={handleStartPause}
              size="lg"
              className="h-20 px-12 text-xl"
              disabled={isExpired}
              style={{ backgroundColor: `hsl(var(--countdown))` }}
            >
              {isRunning ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8" />}
            </Button>
            <Button
              onClick={handleReset}
              variant="outline"
              size="lg"
              className="h-20 px-12 text-xl"
              style={{ borderColor: `hsl(var(--countdown))`, color: `hsl(var(--countdown))` }}
            >
              <RotateCcw className="w-8 h-8" />
            </Button>
          </div>
          <FullscreenButton isFullscreen={isFullscreen} onToggle={toggleFullscreen} color="countdown" />
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
          <h1 className="text-3xl font-bold text-countdown">Countdown Timer</h1>
          <div className="w-24" />
        </div>

        <Card className="border-2" style={{ borderColor: `hsl(var(--countdown))` }}>
          <CardContent className="p-8 space-y-8">
            <div className={`timer-display text-7xl md:text-8xl font-bold text-center transition-colors ${
              isExpired ? 'text-destructive animate-pulse' : 'text-countdown'
            }`}>
              {formatTime(remainingTime)}
            </div>

            {isExpired && (
              <div className="text-center">
                <p className="text-2xl font-bold text-destructive animate-pulse">Time's Up!</p>
              </div>
            )}

            <div className="flex justify-center gap-4">
              <Button
                onClick={handleStartPause}
                size="lg"
                className="gap-2"
                disabled={isExpired}
                style={{ backgroundColor: `hsl(var(--countdown))` }}
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
                style={{ borderColor: `hsl(var(--countdown))`, color: `hsl(var(--countdown))` }}
              >
                <RotateCcw className="w-5 h-5" />
                Reset
              </Button>
            </div>

            <FullscreenButton isFullscreen={isFullscreen} onToggle={toggleFullscreen} color="countdown" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 space-y-4">
            <h2 className="text-xl font-bold text-countdown">Set Time</h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Hours</label>
                <Input
                  type="number"
                  min="0"
                  max="99"
                  value={hours}
                  onChange={(e) => setHours(parseInt(e.target.value) || 0)}
                  className="text-center"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Minutes</label>
                <Input
                  type="number"
                  min="0"
                  max="59"
                  value={minutes}
                  onChange={(e) => setMinutes(parseInt(e.target.value) || 0)}
                  className="text-center"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Seconds</label>
                <Input
                  type="number"
                  min="0"
                  max="59"
                  value={seconds}
                  onChange={(e) => setSeconds(parseInt(e.target.value) || 0)}
                  className="text-center"
                />
              </div>
            </div>
            <Button
              onClick={handleSetTime}
              className="w-full"
              style={{ backgroundColor: `hsl(var(--countdown))` }}
            >
              Set Timer
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
