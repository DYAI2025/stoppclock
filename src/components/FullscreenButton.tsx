import { Maximize, Minimize } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FullscreenButtonProps {
  isFullscreen: boolean;
  onToggle: () => void;
  color?: string;
}

export const FullscreenButton = ({ isFullscreen, onToggle, color = "primary" }: FullscreenButtonProps) => {
  return (
    <Button
      onClick={onToggle}
      variant="outline"
      size="lg"
      className="gap-2 transition-all duration-300 hover:scale-105"
      style={{ 
        borderColor: `hsl(var(--${color}))`,
        color: `hsl(var(--${color}))`
      }}
    >
      {isFullscreen ? (
        <>
          <Minimize className="w-5 h-5" />
          Exit Fullscreen
        </>
      ) : (
        <>
          <Maximize className="w-5 h-5" />
          Fullscreen
        </>
      )}
    </Button>
  );
};
