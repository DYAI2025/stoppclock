import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TimerProvider } from "@/contexts/TimerContext";
import { CookieBanner } from "@/components/CookieBanner";
import Index from "./pages/Index";
import Stopwatch from "./pages/Stopwatch";
import Countdown from "./pages/Countdown";
import IntervalTimer from "./pages/IntervalTimer";
import DigitalClock from "./pages/DigitalClock";
import AlarmClock from "./pages/AlarmClock";
import Metronome from "./pages/Metronome";
import ChessClock from "./pages/ChessClock";
import LapTimer from "./pages/LapTimer";
import PomodoroTimer from "./pages/PomodoroTimer";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <TimerProvider>
        <Toaster />
        <Sonner />
        <CookieBanner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/stopwatch" element={<Stopwatch />} />
            <Route path="/countdown" element={<Countdown />} />
            <Route path="/interval" element={<IntervalTimer />} />
            <Route path="/clock" element={<DigitalClock />} />
            <Route path="/alarm" element={<AlarmClock />} />
            <Route path="/metronome" element={<Metronome />} />
            <Route path="/chess" element={<ChessClock />} />
            <Route path="/lap" element={<LapTimer />} />
            <Route path="/pomodoro" element={<PomodoroTimer />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TimerProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
