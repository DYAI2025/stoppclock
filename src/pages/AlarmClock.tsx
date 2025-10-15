import { useState, useEffect } from "react";
import { Bell, Plus, Trash2, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Link } from "react-router-dom";
import SEO from "@/components/SEO";
import CrossLinks from "@/components/CrossLinks";
import { useTimerContext } from "@/contexts/TimerContext";
import { toast } from "sonner";
import { useI18n } from "@/contexts/I18nContext";

interface Alarm {
  id: string;
  time: string;
  label: string;
  enabled: boolean;
}

const STORAGE_KEY = "quick-times-alarms";

export default function AlarmClock() {
  const { updateTimer, removeTimer } = useTimerContext();
  const { t } = useI18n();
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [newTime, setNewTime] = useState("12:00");
  const [newLabel, setNewLabel] = useState("");

  // Load alarms from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setAlarms(parsed);
      } catch (e) {
        console.error("Failed to parse saved alarms:", e);
      }
    }
  }, []);

  // Save alarms to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(alarms));
  }, [alarms]);

  // Update timer context with enabled alarms
  useEffect(() => {
    const enabledAlarms = alarms.filter(a => a.enabled);
    
    if (enabledAlarms.length > 0) {
      // Show first enabled alarm in timer bar
      const nextAlarm = enabledAlarms[0];
      updateTimer({
        id: "alarm-1",
        type: "countdown",
        name: `Alarm: ${nextAlarm.time}`,
        color: "alarm",
        currentTime: getTimeUntilAlarm(nextAlarm.time),
        isRunning: true,
        targetTime: getTimeUntilAlarm(nextAlarm.time),
        path: "/alarm",
      });
    } else {
      removeTimer("alarm-1");
    }
  }, [alarms, updateTimer, removeTimer]);

  // Check for triggered alarms every second
  useEffect(() => {
    const checkAlarms = () => {
      const now = new Date();
      const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      
      alarms.forEach(alarm => {
        if (alarm.enabled && alarm.time === currentTime) {
          toast.success(`Alarm: ${alarm.label || 'Time is up!'}`, {
            duration: 10000,
          });
          
          const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIGWhz7eaeUBELUKXh8LhjHgU7kdv0yXkqBSd+zO/dj0IIFU+05uqqVBILRqHf8r5sIQYqf87x2Yo1Bxpr6+ehTxQKTqDh8LlfHAQ+kdnyzXcoBC1+y+7dkEAKFV+y5+uoVBELSKLg8L1sIQUsfsrv3JBCCBpov+zpnlESC0qh4PK+ayEFKoHK7dyQQQgaaKfs655NEQxLo+Lwr2MaBDqP1fLOeiYELYHH79yOPwkXaq7p7KRQEw1Mm+D0u2shBiuByO3cj0EJGmup6+qfTxILTKLg8r1rIAYrgcrw2481CBprqezqnlASC0uh4PK9ayEGK4HM7dyQQwcdaLXp66dTFA1Lo+HyvWkeBS2Bx+7ckUQIFWqt6uqgTxIMTKPi8rxrIQYrfsrw3I9CCBxot+rqp1MTDEuj4vC7aB4FL4HH7tyQQQkXaK3p66hSFAxKouDyu2shBSuAzO7dj0IHHW2y6euoURINTKPi8LtoHgYugMfv3I9DCBxosOnrqVQTDU2j4vC8aB4FL4HJ8NyQQgkXaK3p66hSFAxKouDyu2shBSuAzO7dj0IHHW2y6euoURINTKPi8LtoHgYugMfv3I9DCBxosOnrqVQTDU2j4vC8aB4FL4HJ8NyQQgkXaK3p66hSFAxKouDyu2shBSuAzO7dj0IHHW2y6euoURINTKPi8LtoHgYugMfv3I9DCBxosOnrqVQTDU2j4vC8aB4FL4HJ8NyQQgkXaK3p66hSFAxKouDyu2shBSuAzO7dj0IHHW2y6euoURINTKPi8LtoHgYugMfv3I9DCBxosOnrqVQTDU2j4vC8aB4FL4HJ8NyQQgkXaK3p66hSFAxKouDyu2shBSuAzO7dj0IHHW2y6euoURINTKPi8LtoHgYugMfv3I9DCBxosOnrqVQTDU2j4vC8aB4FL4HJ8NyQQgkXaK3p66hSFAxKouDyu2shBSuAzO7dj0IHHW2y6euoURINTKPi8LtoHgYugMfv3I9DCBxosOnrqVQTDU2j4vC8aB4FL4HJ8NyQQgkXaK3p66hSFAxKouDyu2shBSuAzO7dj0IHHW2y6euoURINTKPi8LtoHgYugMfv3I9DCBxosOnrqVQTDU2j4vC8aB4FL4HJ8NyQQgkXaK3p66hSFAxKouDyu2shBSuAzO7dj0IHHW2y6euoURINTKPi8LtoHgYugMfv3I9DCBxosOnrqVQTDU2j4vC8aB4FL4HJ8NyQQgkXaK3p66hSFAxKouDyu2shBSuAzO7dj0IHHW2y6euoURINTKPi8LtoHgYugMfv3I9DCBxosOnrqVQTDU2j4vC8aB4FL4HJ8NyQQgkXaK3p66hSFAxKouDyu2shBSuAzO7dj0IHHW2y6euoURINTKPi8LtoHgYugMfv');
          try {
            audio.play();
          } catch (e) {
            console.error("Failed to play alarm sound:", e);
          }

          toggleAlarm(alarm.id);
        }
      });
    };

    const interval = setInterval(checkAlarms, 1000);
    return () => clearInterval(interval);
  }, [alarms]);

  const getTimeUntilAlarm = (alarmTime: string): number => {
    const now = new Date();
    const [hours, minutes] = alarmTime.split(':').map(Number);
    
    const alarm = new Date();
    alarm.setHours(hours, minutes, 0, 0);
    
    if (alarm <= now) {
      alarm.setDate(alarm.getDate() + 1);
    }
    
    return alarm.getTime() - now.getTime();
  };

  const addAlarm = () => {
    const alarm: Alarm = {
      id: Date.now().toString(),
      time: newTime,
      label: newLabel || "Alarm",
      enabled: true
    };
    setAlarms([...alarms, alarm]);
    setNewLabel("");
    toast.success(t("alarm.added"));
  };

  const toggleAlarm = (id: string) => {
    setAlarms(alarms.map(a => a.id === id ? { ...a, enabled: !a.enabled } : a));
  };

  const deleteAlarm = (id: string) => {
    setAlarms(alarms.filter(a => a.id !== id));
    toast.success(t("alarm.deleted"));
  };

  return (
    <div className="min-h-screen bg-gradient-hero p-6">
      <SEO
        title="Alarm Clock – Simple online alarms | Stoppclock"
        description="Set alarms with a clear, minimal interface — optionally fullscreen. Great for focus sessions and breaks."
        keywords={["alarm clock","online alarm","reminder","timer"]}
        jsonLd={[
          {"@context":"https://schema.org","@type":"WebApplication","name":"Alarm Clock","url":"https://stoppclock.com/alarm","applicationCategory":"UtilitiesApplication"},
          {"@context":"https://schema.org","@type":"FAQPage","mainEntity":[
            {"@type":"Question","name":"Do alarms work if I switch tabs?","acceptedAnswer":{"@type":"Answer","text":"Yes, but keep the tab open and unmuted for reliable playback due to browser limits."}},
            {"@type":"Question","name":"Can I use fullscreen?","acceptedAnswer":{"@type":"Answer","text":"Yes. Use the fullscreen button for a distraction‑free alarm screen."}},
            {"@type":"Question","name":"Is it free?","acceptedAnswer":{"@type":"Answer","text":"Yes. Stoppclock is free. Analytics/ads only load with consent."}}
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
          <h1 className="text-3xl font-bold text-alarm">Alarm Clock</h1>
          <div className="w-24" />
        </div>

        <Card className="border-2" style={{ borderColor: `hsl(var(--alarm))` }}>
          <CardContent className="p-6 space-y-4">
            <h2 className="text-xl font-bold text-alarm">{t("alarm.addNew")}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                type="time"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                className="text-center"
              />
              <Input
                type="text"
                placeholder="Label (optional)"
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
              />
              <Button
                onClick={addAlarm}
                className="gap-2"
                style={{ backgroundColor: `hsl(var(--alarm))` }}
              >
                <Plus className="w-5 h-5" />
                {t("alarm.add")}
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {alarms.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Bell className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-xl text-muted-foreground">{t("alarm.none")}</p>
                <p className="text-sm text-muted-foreground mt-2">
                  {t("alarm.addToGet")}
                </p>
              </CardContent>
            </Card>
          ) : (
            alarms.map((alarm) => (
              <Card key={alarm.id} className={alarm.enabled ? "border-2" : ""} 
                style={alarm.enabled ? { borderColor: `hsl(var(--alarm))` } : {}}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Switch
                        checked={alarm.enabled}
                        onCheckedChange={() => toggleAlarm(alarm.id)}
                      />
                      <div>
                        <p className={`timer-display text-4xl font-bold ${
                          alarm.enabled ? 'text-alarm' : 'text-muted-foreground'
                        }`}>
                          {alarm.time}
                        </p>
                        <p className="text-sm text-muted-foreground">{alarm.label}</p>
                        {alarm.enabled && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {t("alarm.inMinutes", { m: Math.floor(getTimeUntilAlarm(alarm.time) / 1000 / 60) })}
                          </p>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteAlarm(alarm.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
