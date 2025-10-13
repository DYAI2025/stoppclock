import { useTimerContext } from "@/contexts/TimerContext";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

export const ActiveTimerBar = () => {
  const { activeTimers, removeTimer } = useTimerContext();
  const navigate = useNavigate();

  const formatTime = (ms: number, type: string) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (type === "stopwatch" || type === "lap") {
      const milliseconds = Math.floor((ms % 1000) / 10);
      if (hours > 0) {
        return `${hours.toString().padStart(2, "0")}:${minutes
          .toString()
          .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}.${milliseconds
          .toString()
          .padStart(2, "0")}`;
      }
      return `${minutes.toString().padStart(2, "0")}:${seconds
        .toString()
        .padStart(2, "0")}.${milliseconds.toString().padStart(2, "0")}`;
    } else {
      if (hours > 0) {
        return `${hours.toString().padStart(2, "0")}:${minutes
          .toString()
          .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
      }
      return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    }
  };

  if (activeTimers.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t shadow-lg p-4 z-50">
      <div className="container mx-auto">
        <h3 className="text-sm font-medium text-muted-foreground mb-3">Aktive Timer</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {activeTimers.map((timer) => (
            <Card
              key={timer.id}
              className="cursor-pointer hover:shadow-lg transition-all border-2 relative group"
              style={{ borderColor: `hsl(var(--${timer.color}))` }}
              onClick={() => navigate(timer.path)}
            >
              <CardContent className="p-4">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeTimer(timer.id);
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
                <div className="space-y-1">
                  <p className="text-xs font-medium" style={{ color: `hsl(var(--${timer.color}))` }}>
                    {timer.name}
                    {timer.type === "interval" && (
                      <span className="ml-2 text-[10px]">
                        ({timer.isWorking ? "Arbeit" : "Pause"})
                      </span>
                    )}
                  </p>
                  <p
                    className="timer-display text-2xl font-bold"
                    style={{ color: `hsl(var(--${timer.color}))` }}
                  >
                    {formatTime(timer.currentTime, timer.type)}
                  </p>
                  {timer.type === "countdown" && timer.targetTime && (
                    <div className="mt-1">
                      <div
                        className="h-1 rounded-full bg-muted"
                        style={{ backgroundColor: `hsl(var(--${timer.color}) / 0.2)` }}
                      >
                        <div
                          className="h-1 rounded-full transition-all"
                          style={{
                            width: `${(timer.currentTime / timer.targetTime) * 100}%`,
                            backgroundColor: `hsl(var(--${timer.color}))`,
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
