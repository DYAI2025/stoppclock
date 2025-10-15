import { useState, useEffect } from "react";
import { Home, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FullscreenButton } from "@/components/FullscreenButton";
import { Link } from "react-router-dom";
import SEO from "@/components/SEO";
import CrossLinks from "@/components/CrossLinks";
import { useTimerContext } from "@/contexts/TimerContext";
import { useI18n } from "@/contexts/I18nContext";

const TIMEZONES = [
  { name: "Berlin", timezone: "Europe/Berlin" },
  { name: "London", timezone: "Europe/London" },
  { name: "New York", timezone: "America/New_York" },
  { name: "São Paulo", timezone: "America/Sao_Paulo" },
  { name: "Dubai", timezone: "Asia/Dubai" },
  { name: "Mumbai", timezone: "Asia/Kolkata" },
  { name: "Shanghai", timezone: "Asia/Shanghai" },
  { name: "Tokyo", timezone: "Asia/Tokyo" },
  { name: "Seoul", timezone: "Asia/Seoul" },
  { name: "Sydney", timezone: "Australia/Sydney" },
  { name: "Los Angeles", timezone: "America/Los_Angeles" },
  { name: "Chicago", timezone: "America/Chicago" },
];

export default function DigitalClock() {
  const { updateTimer, getTimer } = useTimerContext();
  const timerId = "clock-1";
  
  const [time, setTime] = useState(new Date());
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [timezoneIndex, setTimezoneIndex] = useState(0);

  const currentTimezone = TIMEZONES[timezoneIndex];
  const { t, locale } = useI18n();

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Always show clock in timer bar
  useEffect(() => {
    updateTimer({
      id: timerId,
      type: "stopwatch", // Use stopwatch type for display
      name: `${t("clock.namePrefix")} ${currentTimezone.name}`,
      color: "clock",
      currentTime: time.getTime(),
      isRunning: true,
      path: "/clock",
    });
  }, [time, currentTimezone, updateTimer, timerId, t]);

  const formatTime = () => {
    return time.toLocaleTimeString(locale, { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit',
      hour12: false,
      timeZone: currentTimezone.timezone
    });
  };

  const formatDate = () => {
    return time.toLocaleDateString(locale, { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      timeZone: currentTimezone.timezone
    });
  };

  const nextTimezone = () => {
    setTimezoneIndex((prev) => (prev + 1) % TIMEZONES.length);
  };

  const toggleFullscreen = () => setIsFullscreen(!isFullscreen);

  if (isFullscreen) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-clock/5 to-clock/20 p-4">
        <div className="w-full max-w-6xl flex flex-col items-center space-y-12">
          <div className="flex items-center gap-4">
            <Globe className="w-10 h-10 text-clock" />
            <h1 className="text-4xl font-bold text-clock">{currentTimezone.name}</h1>
          </div>
          <div className="timer-display text-[12rem] md:text-[16rem] font-bold text-clock leading-none">
            {formatTime()}
          </div>
          <p className="text-3xl text-muted-foreground">{formatDate()}</p>
          <Button
            onClick={nextTimezone}
            size="lg"
            className="h-16 px-12 text-xl gap-3"
            style={{ backgroundColor: `hsl(var(--clock))` }}
          >
            <Globe className="w-6 h-6" />
            {t("clock.switch")}
          </Button>
          <FullscreenButton isFullscreen={isFullscreen} onToggle={toggleFullscreen} color="clock" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero p-6">
      <SEO
        title="Digital Clock – Online time (local & international) | Stoppclock"
        description="Large digital clock for your screen. Ideal as a wall‑screen clock; helpful for planning across time zones (switch between cities/zones)."
        keywords={["digital clock","online clock","time","world time","time zones"]}
        jsonLd={[
          {"@context":"https://schema.org","@type":"WebApplication","name":"Digital Clock","url":"https://stoppclock.com/clock","applicationCategory":"UtilitiesApplication"},
          {"@context":"https://schema.org","@type":"FAQPage","mainEntity":[
            {"@type":"Question","name":"Can I switch between time zones?","acceptedAnswer":{"@type":"Answer","text":"Yes. Switch between cities/time zones directly on the page."}},
            {"@type":"Question","name":"Is there a fullscreen mode?","acceptedAnswer":{"@type":"Answer","text":"Yes. Use the fullscreen button for a clean, large clock display."}},
            {"@type":"Question","name":"Does it work offline?","acceptedAnswer":{"@type":"Answer","text":"Core pages are cached after the first visit or when installed (PWA)."}}
          ]}
        ]}
      />
      <CrossLinks />
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
              <div className="flex items-center justify-center gap-3 mb-4">
                <Globe className="w-8 h-8 text-clock" />
                <h2 className="text-3xl font-bold text-clock">{currentTimezone.name}</h2>
              </div>
              <div className="timer-display text-7xl md:text-8xl font-bold text-clock">
                {formatTime()}
              </div>
              <p className="text-2xl text-muted-foreground">{formatDate()}</p>
            </div>

            <div className="flex justify-center">
              <Button
                onClick={nextTimezone}
                size="lg"
                className="gap-2"
                style={{ backgroundColor: `hsl(var(--clock))` }}
              >
                <Globe className="w-5 h-5" />
                {t("clock.switch")}
              </Button>
            </div>

            <FullscreenButton isFullscreen={isFullscreen} onToggle={toggleFullscreen} color="clock" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-bold mb-4 text-clock">{t("clock.available")}</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {TIMEZONES.map((tz, index) => (
                <Button
                  key={tz.timezone}
                  variant={index === timezoneIndex ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTimezoneIndex(index)}
                  className="justify-start"
                  style={index === timezoneIndex ? { backgroundColor: `hsl(var(--clock))` } : {}}
                >
                  {tz.name}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
