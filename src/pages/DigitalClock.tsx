import { useState, useEffect } from "react";
import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FullscreenButton } from "@/components/FullscreenButton";
import { Link } from "react-router-dom";

export default function DigitalClock() {
  const [time, setTime] = useState(new Date());
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = () => {
    return time.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit',
      hour12: false 
    });
  };

  const formatDate = () => {
    return time.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const toggleFullscreen = () => setIsFullscreen(!isFullscreen);

  if (isFullscreen) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-clock/5 to-clock/20 p-4">
        <div className="w-full max-w-6xl flex flex-col items-center space-y-12">
          <h1 className="text-4xl font-bold text-clock">Digital Clock</h1>
          <div className="timer-display text-[12rem] md:text-[16rem] font-bold text-clock leading-none">
            {formatTime()}
          </div>
          <p className="text-3xl text-muted-foreground">{formatDate()}</p>
          <FullscreenButton isFullscreen={isFullscreen} onToggle={toggleFullscreen} color="clock" />
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
          <h1 className="text-3xl font-bold text-clock">Digital Clock</h1>
          <div className="w-24" />
        </div>

        <Card className="border-2" style={{ borderColor: `hsl(var(--clock))` }}>
          <CardContent className="p-8 space-y-8">
            <div className="text-center space-y-6">
              <div className="timer-display text-7xl md:text-8xl font-bold text-clock">
                {formatTime()}
              </div>
              <p className="text-2xl text-muted-foreground">{formatDate()}</p>
            </div>

            <FullscreenButton isFullscreen={isFullscreen} onToggle={toggleFullscreen} color="clock" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
