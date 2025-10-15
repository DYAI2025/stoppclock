import { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, Flag, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FullscreenButton } from "@/components/FullscreenButton";
import { Link } from "react-router-dom";
import { useTimerContext } from "@/contexts/TimerContext";
import { useI18n } from "@/contexts/I18nContext";

export default function LapTimer() {
  const { updateTimer, getTimer, removeTimer } = useTimerContext();
  const { t } = useI18n();
  const timerId = "lap-1";
  const existingTimer = getTimer(timerId);
  
  const [time, setTime] = useState(existingTimer?.currentTime || 0);
  const [isRunning, setIsRunning] = useState(existingTimer?.isRunning || false);
  const [laps, setLaps] = useState<{ time: number; split: number }[]>([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const intervalRef = useRef<number>();
  const lastLapTime = useRef(0);

  // Sync with global timer state
  useEffect(() => {
    const timer = getTimer(timerId);
    if (timer) {
      setTime(timer.currentTime);
      setIsRunning(timer.isRunning);
    }
  }, []);

  // Update global state whenever local state changes
  useEffect(() => {
    if (isRunning || time > 0) {
      updateTimer({
        id: timerId,
        type: "lap",
        name: "Lap Timer",
        color: "lap",
        currentTime: time,
        isRunning: isRunning,
        path: "/lap",
      });
    } else if (time === 0 && !isRunning) {
      removeTimer(timerId);
    }
  }, [time, isRunning]);

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
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const milliseconds = Math.floor((ms % 1000) / 10);
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}.${milliseconds.toString().padStart(2, "0")}`;
  };

  const handleStartPause = () => setIsRunning(!isRunning);
  
  const handleReset = () => {
    setTime(0);
    setIsRunning(false);
    setLaps([]);
    lastLapTime.current = 0;
    removeTimer(timerId);
  };

  const handleLap = () => {
    if (isRunning) {
      const splitTime = time - lastLapTime.current;
      setLaps([{ time, split: splitTime }, ...laps]);
      lastLapTime.current = time;
    }
  };

  const toggleFullscreen = () => setIsFullscreen(!isFullscreen);

  if (isFullscreen) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-lap/5 to-lap/20 p-4">
        <div className="w-full max-w-6xl flex flex-col items-center space-y-12">
          <h1 className="text-4xl font-bold text-lap">{t('lap.title')}</h1>
          <div className="timer-display text-[12rem] md:text-[16rem] font-bold text-lap leading-none">
            {formatTime(time)}
          </div>
          <div className="flex gap-6">
            <Button
              onClick={handleStartPause}
              size="lg"
              className="h-20 px-12 text-xl"
              style={{ backgroundColor: `hsl(var(--lap))` }}
            >
              {isRunning ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8" />}
            </Button>
            <Button
              onClick={handleReset}
              variant="outline"
              size="lg"
              className="h-20 px-12 text-xl"
              style={{ borderColor: `hsl(var(--lap))`, color: `hsl(var(--lap))` }}
            >
              <RotateCcw className="w-8 h-8" />
            </Button>
            <Button
              onClick={handleLap}
              variant="outline"
              size="lg"
              className="h-20 px-12 text-xl"
              disabled={!isRunning}
              style={{ borderColor: `hsl(var(--lap))`, color: `hsl(var(--lap))` }}
            >
              <Flag className="w-8 h-8" />
            </Button>
          </div>
          <FullscreenButton isFullscreen={isFullscreen} onToggle={toggleFullscreen} color="lap" />
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
              {t('common.home')}
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-lap">{t('lap.title')}</h1>
          <div className="w-24" />
        </div>

        <Card className="border-2" style={{ borderColor: `hsl(var(--lap))` }}>
          <CardContent className="p-8 space-y-8">
            <div className="timer-display text-7xl md:text-8xl font-bold text-center text-lap">
              {formatTime(time)}
            </div>

            <div className="flex justify-center gap-4">
              <Button
                onClick={handleStartPause}
                size="lg"
                className="gap-2"
                style={{ backgroundColor: `hsl(var(--lap))` }}
              >
                {isRunning ? (
                  <>
                    <Pause className="w-5 h-5" />
                    {t('common.pause')}
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5" />
                    {t('common.start')}
                  </>
                )}
              </Button>
              <Button
                onClick={handleReset}
                variant="outline"
                size="lg"
                className="gap-2"
                style={{ borderColor: `hsl(var(--lap))`, color: `hsl(var(--lap))` }}
              >
                <RotateCcw className="w-5 h-5" />
                {t('common.reset')}
              </Button>
              <Button
                onClick={handleLap}
                variant="outline"
                size="lg"
                className="gap-2"
                disabled={!isRunning}
                style={{ borderColor: `hsl(var(--lap))`, color: `hsl(var(--lap))` }}
              >
                <Flag className="w-5 h-5" />
                {t('lap.record')}
              </Button>
            </div>

            <FullscreenButton isFullscreen={isFullscreen} onToggle={toggleFullscreen} color="lap" />
          </CardContent>
        </Card>

        {laps.length > 0 && (
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4 text-lap">{t('lap.times')}</h2>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {laps.map((lap, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-3 gap-4 p-3 bg-muted rounded-lg"
                  >
                    <span className="font-medium">{t('lap.lap')} {laps.length - index}</span>
                    <span className="timer-display text-lg font-bold text-lap text-center">
                      {formatTime(lap.split)}
                    </span>
                    <span className="timer-display text-sm text-muted-foreground text-right">
                      {t('lap.total')}: {formatTime(lap.time)}
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
