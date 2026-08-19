import { AnimatePresence, motion } from "framer-motion";
import {
  Building2,
  Boxes,
  Percent,
  CalendarDays,
  ShieldCheck,
  Users,
  BarChart3,
  Clock,
  History,
  ChevronRight,
  LayoutPanelLeft,
  Landmark,
} from "lucide-react";
import { useRef, useState } from "react";
import { ExportButton } from "./ExportButton";

const NAV_ICONS: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  overview: LayoutPanelLeft,
  general: Building2,
  component: Boxes,
  rates: Percent,
  schedules: CalendarDays,
  collateral: ShieldCheck,
  "co-applicant": Users,
  entries: BarChart3,
  "due-today": Clock,
  audit: History,
};

const NAV_ITEMS = [
  { key: "overview", label: "Contract Overview", hasChevron: true },
  { key: "general", label: "General" },
  { key: "component", label: "Component", count: 14 },
  { key: "rates", label: "Rates", count: 37 },
  { key: "schedules", label: "Schedules", count: 36 },
  { key: "collateral", label: "Collateral" },
  { key: "co-applicant", label: "Co-Applicant" },
  { key: "entries", label: "Entries", count: 0 },
  { key: "due-today", label: "Due Today", count: 1 },
  { key: "audit", label: "Audit" },
];

const COLLAPSED_WIDTH = 80;
const EXPANDED_WIDTH = 264;
const CLOSE_DELAY = 160;

export function Sidebar() {
  const [active, setActive] = useState("overview");
  const [expanded, setExpanded] = useState(false);
  const closeTimer = useRef<number | null>(null);

  const open = () => {
    if (closeTimer.current) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
    setExpanded(true);
  };

  const close = () => {
    closeTimer.current = window.setTimeout(() => setExpanded(false), CLOSE_DELAY);
  };

  return (
    <motion.aside
      onMouseEnter={open}
      onMouseLeave={close}
      initial={{ opacity: 0, x: -20 }}
      animate={{
        opacity: 1,
        x: 0,
        width: expanded ? EXPANDED_WIDTH : COLLAPSED_WIDTH,
      }}
      transition={{
        opacity: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
        x: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
        width: { duration: 0.28, ease: [0.16, 1, 0.3, 1] },
      }}
      className={`fixed left-0 top-0 z-40 hidden h-screen flex-col overflow-hidden border-r border-border bg-card lg:flex ${
        expanded ? "shadow-[0_24px_60px_-20px_rgba(15,28,23,0.25)]" : ""
      }`}
      style={{ willChange: "width" }}
    >
      <div className="flex h-[68px] flex-shrink-0 items-center gap-2.5 overflow-hidden px-6">
        <motion.span
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-strong text-white"
        >
          <Landmark size={18} />
        </motion.span>
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -6 }}
              transition={{ duration: 0.18 }}
              className="whitespace-nowrap text-left leading-tight"
            >
              <div className="text-lg font-extrabold tracking-tight text-ink">CAIXA</div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-faint">
                Core Banking
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <nav className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-2 scrollbar-thin">
        <ul className="flex flex-col gap-0.5">
          {NAV_ITEMS.map((item, i) => {
            const Icon = NAV_ICONS[item.key];
            const isActive = active === item.key;
            return (
              <motion.li
                key={item.key}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.15 + i * 0.03, ease: [0.16, 1, 0.3, 1] }}
              >
                <button
                  onClick={() => setActive(item.key)}
                  title={item.label}
                  className="group relative flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-left text-sm"
                >
                  {isActive && (
                    <motion.span
                      layoutId="sidebar-active"
                      className="absolute inset-0 rounded-xl bg-mint"
                      transition={{ type: "spring", stiffness: 500, damping: 40 }}
                    />
                  )}
                  {isActive && (
                    <motion.span
                      layoutId="sidebar-active-bar"
                      className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-full bg-emerald"
                      transition={{ type: "spring", stiffness: 500, damping: 40 }}
                    />
                  )}
                  <motion.span
                    className={`relative z-10 flex flex-shrink-0 items-center justify-center ${
                      isActive ? "text-emerald-strong" : "text-ink-faint"
                    }`}
                    whileHover={{ x: 2 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Icon size={17} />
                  </motion.span>
                  <AnimatePresence>
                    {expanded && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        className={`relative z-10 flex-1 truncate whitespace-nowrap font-medium ${
                          isActive
                            ? "text-emerald-deep font-semibold"
                            : "text-ink-soft group-hover:text-ink"
                        }`}
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                  {expanded && typeof item.count === "number" && (
                    <span
                      className={`relative z-10 flex-shrink-0 rounded-full px-1.5 py-0.5 text-[11px] font-bold ${
                        isActive ? "bg-emerald text-white" : "bg-page text-ink-faint"
                      }`}
                    >
                      {item.count}
                    </span>
                  )}
                  {expanded && item.hasChevron && (
                    <span className="relative z-10 flex-shrink-0 text-emerald-strong">
                      <ChevronRight size={15} />
                    </span>
                  )}
                </button>
              </motion.li>
            );
          })}
        </ul>
      </nav>

      <div className="flex-shrink-0 px-4 pb-6 pt-2">
        <ExportButton expanded={expanded} />
      </div>
    </motion.aside>
  );
}
