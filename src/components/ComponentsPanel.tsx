import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, Search } from "lucide-react";
import { Card } from "./Card";
import { ComponentDetailsModal } from "./ComponentDetailsModal";
import { loanComponents, type LoanComponent } from "../data/components";

const BADGE_TONES: Record<LoanComponent["badgeTone"], string> = {
  blue: "bg-blue-100 text-blue-700",
  green: "bg-emerald-100 text-emerald-700",
  amber: "bg-amber-100 text-amber-700",
  gray: "bg-slate-100 text-slate-600",
  rose: "bg-rose-100 text-rose-700",
};

const BORDER_TONES: Record<LoanComponent["border"], string> = {
  blue: "border-blue-400",
  violet: "border-violet-400",
  teal: "border-teal-400",
  cyan: "border-cyan-400",
  rose: "border-rose-400",
};

const RADIAL_TONES: Record<LoanComponent["border"], string> = {
  blue: "rgba(96,165,250,0.28)",
  violet: "rgba(167,139,250,0.28)",
  teal: "rgba(45,212,191,0.28)",
  cyan: "rgba(34,211,238,0.28)",
  rose: "rgba(251,113,133,0.28)",
};

export function ComponentsPanel() {
  const [query, setQuery] = useState("");
  const [bannerOpen, setBannerOpen] = useState(true);
  const [selected, setSelected] = useState<LoanComponent | null>(null);

  const filtered = loanComponents.filter(
    (c) =>
      c.code.toLowerCase().includes(query.toLowerCase()) ||
      c.description.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <Card delay={0} hover={false} className="overflow-hidden">
      <motion.button
        type="button"
        onClick={() => setBannerOpen((v) => !v)}
        className="flex w-full flex-wrap items-center gap-3 border-b border-border bg-mint-soft px-5 py-3.5 text-left"
      >
        <motion.span animate={{ rotate: bannerOpen ? 0 : -90 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={15} className="text-emerald-strong" />
        </motion.span>
        <span className="rounded-md bg-blue-100 px-2 py-0.5 text-xs font-extrabold uppercase tracking-wide text-blue-700">
          Booking &middot; Value Date
        </span>
        <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide text-emerald-700">
          Current
        </span>
        <span className="text-sm font-extrabold text-blue-700">2026-04-01</span>
        <span className="text-sm text-ink-faint">{loanComponents.length} components</span>
      </motion.button>

      {bannerOpen && (
        <div className="px-5 py-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-sm font-extrabold text-ink">{loanComponents.length} components</h3>
            <div className="flex items-center gap-2 rounded-full border border-border bg-page/60 px-4 py-2 sm:w-72">
              <Search size={14} className="flex-shrink-0 text-ink-faint" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search components..."
                className="w-full min-w-0 bg-transparent text-sm text-ink outline-none placeholder:text-ink-faint"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
            {filtered.map((component, i) => (
              <ComponentCard
                key={component.code}
                component={component}
                index={i}
                onClick={() => setSelected(component)}
              />
            ))}
          </div>

          {filtered.length === 0 && (
            <p className="py-8 text-center text-sm text-ink-faint">No components match “{query}”.</p>
          )}
        </div>
      )}

      <ComponentDetailsModal component={selected} onClose={() => setSelected(null)} />
    </Card>
  );
}

function ComponentCard({
  component,
  index,
  onClick,
}: {
  component: LoanComponent;
  index: number;
  onClick: () => void;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.03, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -2 }}
      className={`group relative flex min-h-[112px] flex-col gap-1.5 overflow-hidden rounded-lg border border-l-4 bg-card p-2.5 text-left shadow-[0_1px_2px_rgba(15,28,23,0.05)] transition-shadow duration-200 hover:shadow-[0_14px_28px_-14px_rgba(15,28,23,0.18)] ${
        BORDER_TONES[component.border]
      }`}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(circle at 25% 15%, ${RADIAL_TONES[component.border]}, transparent 70%)`,
        }}
        aria-hidden
      />

      <div className="relative z-10 min-w-0">
        <span className="block truncate text-xs font-extrabold tracking-tight text-ink">
          {component.code}
        </span>
        <span
          className={`mt-1 inline-block max-w-full truncate rounded-full px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wide ${
            BADGE_TONES[component.badgeTone]
          }`}
        >
          {component.badge}
        </span>
      </div>

      <p className="relative z-10 truncate text-[11px] text-ink-faint">{component.description}</p>

      {component.meta && (
        <div className="relative z-10 flex items-center gap-1.5 text-[11px]">
          <span className="font-bold uppercase tracking-wide text-ink-faint">{component.meta.label}</span>
          <span className="font-extrabold text-ink">{component.meta.value}</span>
        </div>
      )}

      {component.tags && component.tags.length > 0 && (
        <div className="relative z-10 mt-auto truncate whitespace-nowrap text-[9px] font-semibold text-amber-700">
          {component.tags.join(" · ")}
        </div>
      )}
    </motion.button>
  );
}
