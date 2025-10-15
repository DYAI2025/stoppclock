import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useI18n } from "@/contexts/I18nContext";

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

export function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const { t } = useI18n();

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      // Show banner after 1 second delay
      const timer = setTimeout(() => setShowBanner(true), 1000);
      return () => clearTimeout(timer);
    } else {
      // Apply saved consent
      updateConsent(consent === "accepted");
    }
  }, []);

  const updateConsent = (accepted: boolean) => {
    if (typeof window.gtag === "function") {
      window.gtag("consent", "update", {
        analytics_storage: accepted ? "granted" : "denied",
        ad_storage: accepted ? "granted" : "denied",
        ad_user_data: accepted ? "granted" : "denied",
        ad_personalization: accepted ? "granted" : "denied",
      });
    }
  };

  const handleAccept = () => {
    localStorage.setItem("cookie-consent", "accepted");
    updateConsent(true);
    setShowBanner(false);

    // Track consent event
    if (typeof window.gtag === "function") {
      window.gtag("event", "cookie_consent", {
        consent_action: "accepted",
      });
    }
  };

  const handleDecline = () => {
    localStorage.setItem("cookie-consent", "declined");
    updateConsent(false);
    setShowBanner(false);

    // Track consent event
    if (typeof window.gtag === "function") {
      window.gtag("event", "cookie_consent", {
        consent_action: "declined",
      });
    }
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md z-50 animate-in slide-in-from-bottom-5 duration-500">
      <div className="bg-card border-2 border-border rounded-xl shadow-2xl p-4 backdrop-blur-lg bg-opacity-95">
        <div className="flex items-start gap-3">
          <div className="flex-1 space-y-2">
            <h3 className="font-semibold text-sm">🍪 {t("cookie.title")}</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">{t("cookie.text")}</p>
            <div className="flex gap-2 pt-1">
              <Button
                onClick={handleAccept}
                size="sm"
                className="flex-1 h-8 text-xs"
              >
                {t("cookie.accept")}
              </Button>
              <Button
                onClick={handleDecline}
                size="sm"
                variant="outline"
                className="flex-1 h-8 text-xs"
              >
                {t("cookie.decline")}
              </Button>
            </div>
          </div>
          <button
            onClick={handleDecline}
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label={t("cookie.close")}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
