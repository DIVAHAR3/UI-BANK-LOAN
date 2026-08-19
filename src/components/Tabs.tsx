import { motion } from "framer-motion";
import { tabs } from "../data/contract";
import { CARD_DELAY } from "../lib/motion";

export function Tabs({ active, onChange }: { active: string; onChange: (label: string) => void }) {
  const delay = CARD_DELAY.configCards + 0.24;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
      className="mt-2 flex flex-wrap items-center gap-1 overflow-x-auto rounded-2xl border border-border bg-card px-2 py-1.5 scrollbar-thin"
    >
      {tabs.map((tab) => {
        const isActive = active === tab.label;
        return (
          <button
            key={tab.label}
            onClick={() => onChange(tab.label)}
            className="relative flex-shrink-0 rounded-xl px-3.5 py-2 text-sm font-semibold transition-colors duration-150"
          >
            {isActive && (
              <motion.span
                layoutId="tab-active-bg"
                className="absolute inset-0 rounded-xl bg-mint"
                transition={{ type: "spring", stiffness: 500, damping: 40 }}
              />
            )}
            <span
              className={`relative z-10 flex items-center gap-1.5 ${
                isActive ? "text-emerald-deep" : "text-ink-faint hover:text-ink"
              }`}
            >
              {tab.label}
              {typeof tab.count === "number" && (
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[11px] font-bold ${
                    isActive ? "bg-emerald-strong text-white" : "bg-page text-ink-faint"
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </span>
            {isActive && (
              <motion.span
                layoutId="tab-active-underline"
                className="absolute -bottom-1.5 left-3 right-3 h-[2.5px] rounded-full bg-emerald-strong"
                transition={{ type: "spring", stiffness: 500, damping: 40 }}
              />
            )}
          </button>
        );
      })}
    </motion.div>
  );
}
