import { Link, useLocation } from "react-router-dom";
import { useI18n } from "@/contexts/I18nContext";

const links = [
  { to: "/stopwatch", key: "tool.stopwatch" },
  { to: "/countdown", key: "tool.countdown" },
  { to: "/clock", key: "tool.clock" },
  { to: "/alarm", key: "tool.alarm" },
  { to: "/chess", key: "tool.chess" }
];

export default function CrossLinks() {
  const { pathname } = useLocation();
  const { t } = useI18n();
  const items = links.filter((l) => l.to !== pathname);
  return (
    <nav className="mt-8 text-xs text-muted-foreground/80 text-center">
      {t("cross.more")} {items.map((l, i) => (
        <span key={l.to}>
          {i > 0 && <span aria-hidden> · </span>}
          <Link className="hover:underline" to={l.to}>{t(l.key)}</Link>
        </span>
      ))}
    </nav>
  );
}
