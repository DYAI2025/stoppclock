import { useState } from "react";
import { Bell, Plus, Trash2, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Link } from "react-router-dom";

interface Alarm {
  id: string;
  time: string;
  label: string;
  enabled: boolean;
}

export default function AlarmClock() {
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [newTime, setNewTime] = useState("12:00");
  const [newLabel, setNewLabel] = useState("");

  const addAlarm = () => {
    const alarm: Alarm = {
      id: Date.now().toString(),
      time: newTime,
      label: newLabel || "Alarm",
      enabled: true
    };
    setAlarms([...alarms, alarm]);
    setNewLabel("");
  };

  const toggleAlarm = (id: string) => {
    setAlarms(alarms.map(a => a.id === id ? { ...a, enabled: !a.enabled } : a));
  };

  const deleteAlarm = (id: string) => {
    setAlarms(alarms.filter(a => a.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-hero p-6">
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
            <h2 className="text-xl font-bold text-alarm">Add New Alarm</h2>
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
                Add Alarm
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {alarms.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Bell className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-xl text-muted-foreground">No alarms set</p>
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
