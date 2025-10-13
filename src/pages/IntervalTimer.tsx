import { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FullscreenButton } from "@/components/FullscreenButton";
import { Link } from "react-router-dom";

export default function IntervalTimer() {
  const [workTime, setWorkTime] = useState(25000); // 25 seconds work
  const [restTime, setRestTime] = useState(5000); // 5 seconds rest
  const [currentTime, setCurrentTime] = useState(25000);
  const [isWorking, setIsWorking] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [rounds, setRounds] = useState(0);
  const intervalRef = useRef<number>();

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = window.setInterval(() => {
        setCurrentTime((t) => {
          const newTime = t - 10;
          if (newTime <= 0) {
            // Switch between work and rest
            if (isWorking) {
              setIsWorking(false);
              setRounds((r) => r + 1);
              return restTime;
            } else {
              setIsWorking(true);
              return workTime;
            }
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
  }, [isRunning, isWorking, workTime, restTime]);

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleStartPause = () => setIsRunning(!isRunning);
  
  const handleReset = () => {
    setIsRunning(false);
    setCurrentTime(workTime);
    setIsWorking(true);
    setRounds(0);
  };

  const toggleFullscreen = () => setIsFullscreen(!isFullscreen);

  const currentColor = isWorking ? 'interval' : 'stopwatch';

  if (isFullscreen) {
    return (
      <div className={`min-h-screen w-full flex flex-col items-center justify-center p-4 transition-colors duration-500`}
        style={{ background: `linear-gradient(135deg, hsl(var(--${currentColor}) / 0.1) 0%, hsl(var(--${currentColor}) / 0.3) 100%)` }}
      >
        <div className="w-full max-w-6xl flex flex-col items-center space-y-12">
          <h1 className="text-4xl font-bold" style={{ color: `hsl(var(--${currentColor}))` }}>
            {isWorking ? 'Work Time' : 'Rest Time'}
          </h1>
          <div className="timer-display text-[12rem] md:text-[16rem] font-bold leading-none" 
            style={{ color: `hsl(var(--${currentColor}))` }}
          >
            {formatTime(currentTime)}
          </div>
          <p className="text-2xl font-medium text-muted-foreground">Rounds completed: {rounds}</p>
          <div className="flex gap-6">
            <Button
              onClick={handleStartPause}
              size="lg"
              className="h-20 px-12 text-xl"
              style={{ backgroundColor: `hsl(var(--${currentColor}))` }}
            >
              {isRunning ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8" />}
            </Button>
            <Button
              onClick={handleReset}
              variant="outline"
              size="lg"
              className="h-20 px-12 text-xl"
              style={{ borderColor: `hsl(var(--${currentColor}))`, color: `hsl(var(--${currentColor}))` }}
            >
              <RotateCcw className="w-8 h-8" />
            </Button>
          </div>
          <FullscreenButton isFullscreen={isFullscreen} onToggle={toggleFullscreen} color={currentColor} />
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
          <h1 className="text-3xl font-bold text-interval">Interval Timer</h1>
          <div className="w-24" />
        </div>

        <Card className="border-2" style={{ borderColor: `hsl(var(--${currentColor}))` }}>
          <CardContent className="p-8 space-y-8">
            <div className="text-center space-y-4">
              <p className="text-2xl font-bold" style={{ color: `hsl(var(--${currentColor}))` }}>
                {isWorking ? 'Work Time' : 'Rest Time'}
              </p>
              <div className="timer-display text-7xl md:text-8xl font-bold" 
                style={{ color: `hsl(var(--${currentColor}))` }}
              >
                {formatTime(currentTime)}
              </div>
              <p className="text-xl text-muted-foreground">Rounds: {rounds}</p>
            </div>

            <div className="flex justify-center gap-4">
              <Button
                onClick={handleStartPause}
                size="lg"
                className="gap-2"
                style={{ backgroundColor: `hsl(var(--${currentColor}))` }}
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
                style={{ borderColor: `hsl(var(--interval))`, color: `hsl(var(--interval))` }}
              >
                <RotateCcw className="w-5 h-5" />
                Reset
              </Button>
            </div>

            <FullscreenButton isFullscreen={isFullscreen} onToggle={toggleFullscreen} color="interval" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 space-y-4">
            <h2 className="text-xl font-bold text-interval">Configure Intervals</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Work Time (seconds)</label>
                <Input
                  type="number"
                  min="1"
                  value={workTime / 1000}
                  onChange={(e) => setWorkTime((parseInt(e.target.value) || 1) * 1000)}
                  className="text-center"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Rest Time (seconds)</label>
                <Input
                  type="number"
                  min="1"
                  value={restTime / 1000}
                  onChange={(e) => setRestTime((parseInt(e.target.value) || 1) * 1000)}
                  className="text-center"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
