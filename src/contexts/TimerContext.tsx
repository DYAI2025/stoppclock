import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";

export interface ActiveTimer {
  id: string;
  type: "stopwatch" | "countdown" | "rounds" | "analog" | "chess" | "clock" | "lap";
  name: string;
  color: string;
  currentTime: number;
  isRunning: boolean;
  targetTime?: number;
  isWorking?: boolean;
  path: string;
  meta?: Record<string, unknown>;
}

interface TimerContextType {
  activeTimers: ActiveTimer[];
  updateTimer: (timer: ActiveTimer) => void;
  removeTimer: (id: string) => void;
  getTimer: (id: string) => ActiveTimer | undefined;
}

const TimerContext = createContext<TimerContextType | undefined>(undefined);

export const TimerProvider = ({ children }: { children: React.ReactNode }) => {
  const [activeTimers, setActiveTimers] = useState<ActiveTimer[]>([]);
  const intervalRef = useRef<number>();

  // Hydrate timers from localStorage to keep session across reloads
  useEffect(() => {
    try {
      const stored = localStorage.getItem("stoppclock-active-timers");
      if (stored) {
        const parsed = JSON.parse(stored) as ActiveTimer[];
        if (Array.isArray(parsed)) {
          setActiveTimers(parsed);
        }
      }
    } catch (error) {
      console.warn("[TimerContext] Failed to restore timers:", error);
    }
  }, []);

  // Update all running timers every 10ms for precise timing
  useEffect(() => {
    intervalRef.current = window.setInterval(() => {
      setActiveTimers((timers) =>
        timers.map((timer) => {
          if (!timer.isRunning) return timer;

          if (timer.type === "stopwatch" || timer.type === "lap") {
            return { ...timer, currentTime: timer.currentTime + 10 };
          } else if (timer.type === "countdown" || timer.type === "analog") {
            const newTime = Math.max(0, timer.currentTime - 10);
            // Keep timer running state even at 0 to show completion
            return { ...timer, currentTime: newTime, isRunning: newTime > 0 };
          } else if (timer.type === "rounds") {
            const newTime = timer.currentTime - 10;
            if (newTime <= 0) {
              // Switch between work and rest
              const targetTime = timer.isWorking ? 5000 : 25000; // Default values
              return {
                ...timer,
                currentTime: targetTime,
                isWorking: !timer.isWorking,
              };
            }
            return { ...timer, currentTime: newTime };
          } else if (timer.type === "chess") {
            // chess timers manage individual clocks, expect meta with player info
            const update = timer.meta as { activeSide: "left" | "right"; leftMs: number; rightMs: number } | undefined;
            if (!update) return timer;
            const { activeSide, leftMs, rightMs } = update;
            const updated = activeSide === "left" ? Math.max(0, leftMs - 10) : Math.max(0, rightMs - 10);
            const nextMeta = activeSide === "left"
              ? { ...update, leftMs: updated, activeSide, outOfTime: updated === 0 }
              : { ...update, rightMs: updated, activeSide, outOfTime: updated === 0 };
            return {
              ...timer,
              currentTime: updated,
              isRunning: !nextMeta.outOfTime,
              meta: nextMeta,
            };
          }

          return timer;
        })
      );
    }, 10);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // Persist timers
  useEffect(() => {
    try {
      localStorage.setItem("stoppclock-active-timers", JSON.stringify(activeTimers));
    } catch (error) {
      console.warn("[TimerContext] Failed to persist timers:", error);
    }
  }, [activeTimers]);

  const updateTimer = useCallback((timer: ActiveTimer) => {
    setActiveTimers((timers) => {
      const existingIndex = timers.findIndex((t) => t.id === timer.id);
      if (existingIndex >= 0) {
        const newTimers = [...timers];
        newTimers[existingIndex] = timer;
        return newTimers;
      } else {
        return [...timers, timer];
      }
    });
  }, []);

  const removeTimer = useCallback((id: string) => {
    setActiveTimers((timers) => timers.filter((t) => t.id !== id));
  }, []);

  const getTimer = useCallback(
    (id: string) => activeTimers.find((t) => t.id === id),
    [activeTimers]
  );

  return (
    <TimerContext.Provider
      value={{ activeTimers, updateTimer, removeTimer, getTimer }}
    >
      {children}
    </TimerContext.Provider>
  );
};

export const useTimerContext = () => {
  const context = useContext(TimerContext);
  if (!context) {
    throw new Error("useTimerContext must be used within TimerProvider");
  }
  return context;
};
