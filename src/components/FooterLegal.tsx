import React from "react";

const FooterLegal: React.FC = () => {
  const handleOpenConsent = () => {
    try {
      const fn = (window as any)?.openConsent;
      if (typeof fn === "function") {
        fn();
        return;
      }
    } catch {}
    // Fallback: navigate to privacy page where the button is available
    window.location.assign("/privacy.html");
  };

  return (
    <footer
      className="text-center text-xs text-muted-foreground opacity-70 py-4 border-t border-border/50 mt-8"
      aria-label="Legal and privacy links"
    >
      <nav className="flex flex-wrap items-center justify-center gap-2">
        <a className="hover:underline" href="/imprint.html">Imprint</a>
        <span aria-hidden>·</span>
        <a className="hover:underline" href="/privacy-policy.html">Privacy Policy</a>
        <span aria-hidden>·</span>
        <a className="hover:underline" href="/faq.html">FAQ</a>
        <span aria-hidden>·</span>
        <button type="button" onClick={handleOpenConsent} className="hover:underline">
          Consent Settings
        </button>
        <span aria-hidden>·</span>
        <a className="hover:underline" href="/impressum.html">Impressum (DE)</a>
        <span aria-hidden>·</span>
        <a className="hover:underline" href="/privacy.html">Datenschutz (DE)</a>
      </nav>
    </footer>
  );
};

export default FooterLegal;
