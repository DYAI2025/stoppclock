import { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";

interface ToolCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  path: string;
}

export const ToolCard = ({ title, description, icon: Icon, color, path }: ToolCardProps) => {
  return (
    <Link to={path} className="group">
      <Card className="h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-2 hover:border-current" style={{ borderColor: `hsl(var(--${color}))` }}>
        <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
          <div 
            className="w-16 h-16 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
            style={{ backgroundColor: `hsl(var(--${color}) / 0.1)` }}
          >
            <Icon className="w-8 h-8" style={{ color: `hsl(var(--${color}))` }} />
          </div>
          <div>
            <h3 className="text-xl font-bold mb-2" style={{ color: `hsl(var(--${color}))` }}>
              {title}
            </h3>
            <p className="text-sm text-muted-foreground">
              {description}
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
