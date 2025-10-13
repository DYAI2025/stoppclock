import { useState, useEffect, useRef } from "react";
import { RotateCcw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";

export default function ChessClock() {
  const [player1Time, setPlayer1Time] = useState(300000); // 5 minutes
  const [player2Time, setPlayer2Time] = useState(300000);
  const [activePlayer, setActivePlayer] = useState<1 | 2 | null>(null);
  const [initialTime, setInitialTime] = useState(5);
  const intervalRef = useRef<number>();

  useEffect(() => {
    if (activePlayer) {
      intervalRef.current = window.setInterval(() => {
        if (activePlayer === 1) {
          setPlayer1Time((t) => Math.max(0, t - 10));
        } else {
          setPlayer2Time((t) => Math.max(0, t - 10));
        }
      }, 10);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [activePlayer]);

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const handlePlayerClick = (player: 1 | 2) => {
    if (player1Time === 0 || player2Time === 0) return;
    setActivePlayer(player === 1 ? 2 : 1);
  };

  const handleReset = () => {
    const timeMs = initialTime * 60000;
    setPlayer1Time(timeMs);
    setPlayer2Time(timeMs);
    setActivePlayer(null);
  };

  const handleSetTime = () => {
    const timeMs = initialTime * 60000;
    setPlayer1Time(timeMs);
    setPlayer2Time(timeMs);
    setActivePlayer(null);
  };

  return (
    <div className="min-h-screen bg-gradient-hero p-6">
      <div className="max-w-6xl mx-auto space-y-6">
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
              activePlayer === 1 ? 'opacity-100' : 'opacity-60'
            } ${player1Time === 0 ? 'border-destructive' : ''}`}
            style={{ borderColor: activePlayer === 1 ? `hsl(var(--chess))` : undefined }}
            onClick={() => handlePlayerClick(1)}
          >
            <CardContent className="p-12 text-center space-y-4">
              <h2 className="text-3xl font-bold text-chess">Player 1</h2>
              <div className={`timer-display text-7xl md:text-8xl font-bold ${
                player1Time === 0 ? 'text-destructive' : 'text-chess'
              }`}>
                {formatTime(player1Time)}
              </div>
              {player1Time === 0 && (
                <p className="text-2xl font-bold text-destructive">Time's Up!</p>
              )}
            </CardContent>
          </Card>

          <Card
            className={`border-4 cursor-pointer transition-all ${
              activePlayer === 2 ? 'opacity-100' : 'opacity-60'
            } ${player2Time === 0 ? 'border-destructive' : ''}`}
            style={{ borderColor: activePlayer === 2 ? `hsl(var(--chess))` : undefined }}
            onClick={() => handlePlayerClick(2)}
          >
            <CardContent className="p-12 text-center space-y-4">
              <h2 className="text-3xl font-bold text-chess">Player 2</h2>
              <div className={`timer-display text-7xl md:text-8xl font-bold ${
                player2Time === 0 ? 'text-destructive' : 'text-chess'
              }`}>
                {formatTime(player2Time)}
              </div>
              {player2Time === 0 && (
                <p className="text-2xl font-bold text-destructive">Time's Up!</p>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="flex flex-col md:flex-row gap-4 items-end">
              <div className="flex-1 space-y-2">
                <label className="text-sm font-medium">Time per player (minutes)</label>
                <Input
                  type="number"
                  min="1"
                  max="60"
                  value={initialTime}
                  onChange={(e) => setInitialTime(parseInt(e.target.value) || 5)}
                  className="text-center"
                />
              </div>
              <Button
                onClick={handleSetTime}
                className="gap-2"
                style={{ backgroundColor: `hsl(var(--chess))` }}
              >
                Set Time
              </Button>
              <Button
                onClick={handleReset}
                variant="outline"
                className="gap-2"
                style={{ borderColor: `hsl(var(--chess))`, color: `hsl(var(--chess))` }}
              >
                <RotateCcw className="w-5 h-5" />
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
