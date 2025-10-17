import { useEffect, useMemo, useState } from "react";
import { Home, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import SEO from "@/components/SEO";

const PRESET_ZONES = [
  { city: "UTC", tz: "UTC" },
  { city: "San Francisco", tz: "America/Los_Angeles" },
  { city: "New York", tz: "America/New_York" },
  { city: "São Paulo", tz: "America/Sao_Paulo" },
  { city: "London", tz: "Europe/London" },
  { city: "Berlin", tz: "Europe/Berlin" },
  { city: "Dubai", tz: "Asia/Dubai" },
  { city: "Mumbai", tz: "Asia/Kolkata" },
  { city: "Singapore", tz: "Asia/Singapore" },
  { city: "Tokyo", tz: "Asia/Tokyo" },
  { city: "Sydney", tz: "Australia/Sydney" },
];

const pad = (value: number) => value.toString().padStart(2, "0");

export default function WorldClock() {
  const [now, setNow] = useState(() => new Date());
  const [search, setSearch] = useState("");

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const locale = typeof navigator !== "undefined" ? navigator.language : "en-US";

  const clocks = useMemo(() => {
    const list = PRESET_ZONES.filter((zone) =>
      zone.city.toLowerCase().includes(search.trim().toLowerCase())
    );

    return list.map((zone) => {
      const formatter = new Intl.DateTimeFormat(locale, {
        timeZone: zone.tz,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      const dateFormatter = new Intl.DateTimeFormat(locale, {
        timeZone: zone.tz,
        weekday: "short",
        day: "2-digit",
        month: "short",
      });
      const offsetMinutes = (new Date(now.toLocaleString("en-US", { timeZone: zone.tz })).getTime() - now.getTime()) / 60000;
      const offsetHours = Math.round((offsetMinutes / 60) * 10) / 10;
      const offsetLabel = offsetHours >= 0 ? `+${offsetHours}` : offsetHours;
      return {
        ...zone,
        time: formatter.format(now),
        date: dateFormatter.format(now),
        offsetLabel,
      };
    });
  }, [now, search, locale]);

  const localTime = now.toLocaleTimeString(locale, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <div className="min-h-screen bg-gradient-hero p-6">
      <SEO
        title="World Clock – Track global time zones | Stoppclock"
        description="Monitor multiple time zones at a glance. Designed for remote teams, global events and travellers."
        keywords={["world clock","international time","global time zones","remote work"]}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "World Clock",
          url: "https://www.stoppclock.com/world-clock",
          description: "Clear overview of major world cities with current local time and offsets.",
        }}
      />
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <Link to="/">
            <Button variant="ghost" className="gap-2">
              <Home className="w-5 h-5" />
              Home
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-clock">World Clock</h1>
          <div className="w-24" />
        </div>

        <Card>
          <CardHeader className="pb-2">
            <p className="text-sm uppercase tracking-widest text-muted-foreground">Local time</p>
            <p className="timer-display text-5xl font-bold text-clock">{localTime}</p>
          </CardHeader>
        </Card>

        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
              <div>
                <p className="text-sm font-semibold">Quick search</p>
                <p className="text-xs text-muted-foreground">Filter the preset list by city name.</p>
              </div>
              <div className="flex gap-2 items-center">
                <input
                  className="w-full md:w-64 rounded-md border border-border bg-background px-3 py-2 text-sm shadow-sm"
                  placeholder="Search city…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <Button
                  variant="outline"
                  className="gap-2"
                  onClick={() => setSearch("")}
                >
                  <RefreshCw className="w-4 h-4" />
                  Clear
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {clocks.map((clock) => (
                <Card
                  key={clock.city}
                  className="border border-border/60 hover:shadow-lg transition-shadow"
                >
                  <CardContent className="p-5 space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-lg font-semibold">{clock.city}</p>
                      <span className="text-xs font-medium text-muted-foreground uppercase">
                        UTC {clock.offsetLabel}
                      </span>
                    </div>
                    <p className="timer-display text-3xl font-bold text-clock">
                      {clock.time}
                    </p>
                    <p className="text-sm text-muted-foreground">{clock.date}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
