import { useState, useEffect, useRef } from "react";
import { Play, Pause, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { FullscreenButton } from "@/components/FullscreenButton";
import { Link } from "react-router-dom";

export default function Metronome() {
  const [bpm, setBpm] = useState(120);
  const [isRunning, setIsRunning] = useState(false);
  const [beat, setBeat] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const intervalRef = useRef<number>();

  useEffect(() => {
    if (isRunning) {
      const interval = 60000 / bpm;
      intervalRef.current = window.setInterval(() => {
        setBeat((b) => (b + 1) % 4);
      }, interval);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setBeat(0);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, bpm]);

  const handleStartPause = () => setIsRunning(!isRunning);
  const toggleFullscreen = () => setIsFullscreen(!isFullscreen);

  if (isFullscreen) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-metronome/5 to-metronome/20 p-4">
        <div className="w-full max-w-6xl flex flex-col items-center space-y-12">
          <h1 className="text-4xl font-bold text-metronome">Metronome</h1>
          <div className="timer-display text-[12rem] md:text-[16rem] font-bold text-metronome leading-none">
            {bpm}
          </div>
          <p className="text-3xl text-muted-foreground">BPM</p>
          <div className="w-full max-w-2xl flex justify-center gap-8 mb-8">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={`w-16 h-16 md:w-24 md:h-24 rounded-full transition-all duration-100 ${
                  beat === i ? 'scale-125' : 'scale-100'
                }`}
                style={{
                  backgroundColor: beat === i ? `hsl(var(--metronome))` : `hsl(var(--metronome) / 0.2)`,
                }}
              />
            ))}
          </div>
          <div className="flex gap-6">
            <Button
              onClick={handleStartPause}
              size="lg"
              className="h-20 px-12 text-xl"
              style={{ backgroundColor: `hsl(var(--metronome))` }}
            >
              {isRunning ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8" />}
            </Button>
          </div>
          <FullscreenButton isFullscreen={isFullscreen} onToggle={toggleFullscreen} color="metronome" />
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
          <h1 className="text-3xl font-bold text-metronome">Metronome</h1>
          <div className="w-24" />
        </div>

        <Card className="border-2" style={{ borderColor: `hsl(var(--metronome))` }}>
          <CardContent className="p-8 space-y-8">
            <div className="text-center space-y-4">
              <div className="timer-display text-7xl md:text-8xl font-bold text-metronome">
                {bpm}
              </div>
              <p className="text-2xl text-muted-foreground">BPM</p>
            </div>

            <div className="flex justify-center gap-4 mb-8">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`w-12 h-12 rounded-full transition-all duration-100 ${
                    beat === i ? 'scale-125' : 'scale-100'
                  }`}
                  style={{
                    backgroundColor: beat === i ? `hsl(var(--metronome))` : `hsl(var(--metronome) / 0.2)`,
                  }}
                />
              ))}
            </div>

            <div className="space-y-4">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>40 BPM</span>
                <span>240 BPM</span>
              </div>
              <Slider
                value={[bpm]}
                onValueChange={(value) => setBpm(value[0])}
                min={40}
                max={240}
                step={1}
                className="w-full"
              />
            </div>

            <div className="flex justify-center gap-4">
              <Button
                onClick={handleStartPause}
                size="lg"
                className="gap-2"
                style={{ backgroundColor: `hsl(var(--metronome))` }}
              >
                {isRunning ? (
                  <>
                    <Pause className="w-5 h-5" />
                    Stop
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5" />
                    Start
                  </>
                )}
              </Button>
            </div>

            <FullscreenButton isFullscreen={isFullscreen} onToggle={toggleFullscreen} color="metronome" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
