import React, { createContext, useContext, useState, useEffect, useRef } from "react";

export interface ActiveTimer {
  id: string;
  type: "stopwatch" | "countdown" | "interval" | "lap";
  name: string;
  color: string;
  currentTime: number;
  isRunning: boolean;
  targetTime?: number;
  isWorking?: boolean;
  path: string;
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

  // Update all running timers every 10ms
  useEffect(() => {
    intervalRef.current = window.setInterval(() => {
      setActiveTimers((timers) =>
        timers.map((timer) => {
          if (!timer.isRunning) return timer;

          if (timer.type === "stopwatch" || timer.type === "lap") {
            return { ...timer, currentTime: timer.currentTime + 10 };
          } else if (timer.type === "countdown") {
            const newTime = Math.max(0, timer.currentTime - 10);
            return { ...timer, currentTime: newTime, isRunning: newTime > 0 };
          } else if (timer.type === "interval") {
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
          }

          return timer;
        })
      );
    }, 10);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const updateTimer = (timer: ActiveTimer) => {
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
  };

  const removeTimer = (id: string) => {
    setActiveTimers((timers) => timers.filter((t) => t.id !== id));
  };

  const getTimer = (id: string) => {
    return activeTimers.find((t) => t.id === id);
  };

  return (
    <TimerContext.Provider value={{ activeTimers, updateTimer, removeTimer, getTimer }}>
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
