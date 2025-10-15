import { useTimerContext } from "@/contexts/TimerContext";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import {
  X,
  Timer,
  Clock,
  Hourglass,
  Zap,
  Timer as TimerIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/contexts/I18nContext";
import { Badge } from "@/components/ui/badge";

export const ActiveTimerBar = () => {
  const { activeTimers, removeTimer } = useTimerContext();
  const navigate = useNavigate();
  const { t, locale } = useI18n();

  const formatTime = (ms: number, type: string, timerName?: string) => {
    // Special handling for clocks - display as actual time
    if (timerName?.startsWith("Clock -") || timerName?.startsWith("Uhr -")) {
      const date = new Date(ms);
      return date.toLocaleTimeString(locale, {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      });
    }

    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (type === "stopwatch" || type === "lap") {
      const milliseconds = Math.floor((ms % 1000) / 10);
      if (hours > 0) {
        return `${hours.toString().padStart(2, "0")}:${minutes
          .toString()
          .padStart(2, "0")}:${seconds
          .toString()
          .padStart(2, "0")}.${milliseconds.toString().padStart(2, "0")}`;
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
      return `${minutes.toString().padStart(2, "0")}:${seconds
        .toString()
        .padStart(2, "0")}`;
    }
  };

  const getTimerIcon = (type: string) => {
    switch (type) {
      case "stopwatch":
        return Timer;
      case "countdown":
        return Hourglass;
      case "interval":
        return Zap;
      case "lap":
        return TimerIcon;
      default:
        return Clock;
    }
  };

  if (activeTimers.length === 0) return null;

  // Limit to maximum 3 timers
  const displayTimers = activeTimers.slice(0, 3);
  const hasMoreTimers = activeTimers.length > 3;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-background via-background/98 to-background/95 backdrop-blur-md border-t border-border/50 shadow-2xl z-50">
      <div className="container mx-auto px-4 py-6 max-w-5xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="h-1 w-8 rounded-full bg-primary/40" />
            <h3 className="text-sm font-semibold text-foreground/80 tracking-wide uppercase">
              {t("bar.active")}
            </h3>
            <Badge variant="secondary" className="text-xs px-2 py-0.5">
              {displayTimers.length}
            </Badge>
          </div>
          {hasMoreTimers && (
            <span className="text-xs text-muted-foreground italic">
              +{activeTimers.length - 3} {t("bar.more")}
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {displayTimers.map((timer) => {
            const Icon = getTimerIcon(timer.type);
            const isExpiring =
              timer.type === "countdown" && timer.currentTime < 10000;

            return (
              <Card
                key={timer.id}
                className="relative cursor-pointer group overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-xl border-2"
                style={{
                  borderColor: `hsl(var(--${timer.color}) / 0.3)`,
                  background: `linear-gradient(135deg, hsl(var(--${timer.color}) / 0.03) 0%, hsl(var(--${timer.color}) / 0.08) 100%)`,
                }}
                onClick={() => navigate(timer.path)}
              >
                {/* Animated background for running timers */}
                {timer.isRunning && (
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background: `radial-gradient(circle at 50% 50%, hsl(var(--${timer.color}) / 0.1) 0%, transparent 70%)`,
                    }}
                  />
                )}

                <CardContent className="p-5 relative">
                  {/* Close button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-destructive/10 hover:text-destructive z-10"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeTimer(timer.id);
                    }}
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>

                  {/* Timer header */}
                  <div className="flex items-center gap-2 mb-3">
                    <div
                      className="p-1.5 rounded-lg"
                      style={{
                        backgroundColor: `hsl(var(--${timer.color}) / 0.15)`,
                      }}
                    >
                      <Icon
                        className="h-4 w-4"
                        style={{ color: `hsl(var(--${timer.color}))` }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-xs font-semibold tracking-wide truncate"
                        style={{ color: `hsl(var(--${timer.color}))` }}
                      >
                        {timer.name}
                      </p>
                      {timer.type === "interval" && (
                        <Badge
                          variant="outline"
                          className="mt-0.5 text-[10px] px-1.5 py-0"
                          style={{
                            borderColor: `hsl(var(--${timer.color}) / 0.4)`,
                            color: `hsl(var(--${timer.color}))`,
                          }}
                        >
                          {timer.isWorking ? t("bar.interval.work") : t("bar.interval.rest")}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Timer display */}
                  <div
                    className={`timer-display text-3xl font-bold mb-2 transition-all ${
                      isExpiring ? "animate-pulse text-destructive" : ""
                    }`}
                    style={
                      !isExpiring ? { color: `hsl(var(--${timer.color}))` } : {}
                    }
                  >
                    {formatTime(timer.currentTime, timer.type, timer.name)}
                  </div>

                  {/* Running indicator */}
                  {timer.isRunning && (
                    <div className="flex items-center gap-1.5 mb-2">
                      <div
                        className="h-1.5 w-1.5 rounded-full animate-pulse"
                        style={{
                          backgroundColor: `hsl(var(--${timer.color}))`,
                        }}
                      />
                      <span
                        className="text-[10px] font-medium uppercase tracking-wider"
                        style={{ color: `hsl(var(--${timer.color}) / 0.8)` }}
                      >
                        {t("bar.running")}
                      </span>
                    </div>
                  )}

                  {/* Progress bar for countdown */}
                  {timer.type === "countdown" && timer.targetTime && (
                    <div className="mt-3">
                      <div
                        className="h-1.5 rounded-full overflow-hidden"
                        style={{
                          backgroundColor: `hsl(var(--${timer.color}) / 0.15)`,
                        }}
                      >
                        <div
                          className="h-full rounded-full transition-all duration-300 ease-linear"
                          style={{
                            width: `${
                              (timer.currentTime / timer.targetTime) * 100
                            }%`,
                            backgroundColor: `hsl(var(--${timer.color}))`,
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Hover hint */}
                  <div className="absolute bottom-2 left-0 right-0 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <span
                      className="text-[10px] font-medium"
                      style={{ color: `hsl(var(--${timer.color}) / 0.6)` }}
                    >
                      {t("bar.clickOpen")}
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};
