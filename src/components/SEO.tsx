import { useEffect } from "react";

type SEOProps = {
  title: string;
  description?: string;
  keywords?: string[];
  jsonLd?: Record<string, any> | Record<string, any>[];
};

export default function SEO({ title, description, keywords, jsonLd }: SEOProps) {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = title;

    const ensureMeta = (selector: string, attrs: Record<string, string>) => {
      let el = document.head.querySelector(selector) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        Object.entries(attrs).forEach(([k, v]) => el!.setAttribute(k, v));
        document.head.appendChild(el);
      } else if (attrs["content"]) {
        el.setAttribute("content", attrs["content"]);
      }
      return el;
    };

    if (description) {
      ensureMeta('meta[name="description"]', { name: "description", content: description });
      ensureMeta('meta[property="og:description"]', { property: "og:description", content: description });
    }
    ensureMeta('meta[property="og:title"]', { property: "og:title", content: title });
    if (keywords && keywords.length) {
      ensureMeta('meta[name="keywords"]', { name: "keywords", content: keywords.join(", ") });
    }

    let ldScript: HTMLScriptElement | null = null;
    if (jsonLd) {
      ldScript = document.createElement("script");
      ldScript.type = "application/ld+json";
      ldScript.text = JSON.stringify(jsonLd, null, 0);
      document.head.appendChild(ldScript);
    }

    return () => {
      document.title = prevTitle;
      if (ldScript && document.head.contains(ldScript)) {
        document.head.removeChild(ldScript);
      }
    };
  }, [title, description, JSON.stringify(keywords), JSON.stringify(jsonLd)]);

  return null;
}

