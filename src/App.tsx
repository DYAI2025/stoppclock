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
import RoundsTimer from "./pages/RoundsTimer";
import DigitalClock from "./pages/DigitalClock";
import WorldClock from "./pages/WorldClock";
import ChessClock from "./pages/ChessClock";
import AnalogTimer from "./pages/AnalogTimer";
import NotFound from "./pages/NotFound";
import FooterLegal from "@/components/FooterLegal";
import { I18nProvider } from "@/contexts/I18nContext";
import LanguageToggle from "@/components/LanguageToggle";

const queryClient = new QueryClient();

const basePath = import.meta.env.BASE_URL === "/" ? "/" : import.meta.env.BASE_URL.replace(/\/$/, "");

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <I18nProvider>
      <TimerProvider>
        <Toaster />
        <Sonner />
        <CookieBanner />
        <LanguageToggle />
        <BrowserRouter basename={basePath}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/stopwatch" element={<Stopwatch />} />
            <Route path="/countdown" element={<Countdown />} />
            <Route path="/rounds" element={<RoundsTimer />} />
            <Route path="/clock" element={<DigitalClock />} />
            <Route path="/world-clock" element={<WorldClock />} />
            <Route path="/chess" element={<ChessClock />} />
            <Route path="/analog" element={<AnalogTimer />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <FooterLegal />
        </BrowserRouter>
      </TimerProvider>
      </I18nProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
