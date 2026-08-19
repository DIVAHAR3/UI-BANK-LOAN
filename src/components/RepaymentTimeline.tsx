import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Clock, AlertTriangle, Flag, CalendarDays, BarChart3 } from "lucide-react";
import { CountUpNumber } from "./CountUpNumber";
import { repaymentTimeline } from "../data/contract";
import { formatEuro } from "../lib/format";
import { CARD_DELAY } from "../lib/motion";

const STATUSES = [
  {
    icon: CheckCircle2,
    label: "Paid",
    count: repaymentTimeline.paid,
    iconBg: "bg-emerald-strong",
    iconText: "text-white",
    fill: "#0b7a54",
  },
  {
    icon: AlertTriangle,
    label: "Overdue",
    count: repaymentTimeline.overdue,
    iconBg: "bg-amber-100",
    iconText: "text-amber-600",
    fill: "#d97706",
  },
  {
    icon: Clock,
    label: "Upcoming",
    count: repaymentTimeline.upcoming,
    iconBg: "bg-blue-100",
    iconText: "text-blue-600",
    fill: "#2563eb",
  },
];

const MATURES = {
  icon: Flag,
  label: "Matures",
  iconBg: "bg-violet-100",
  iconText: "text-violet-600",
  fill: "#7c3aed",
};

const INSTALLMENT_TOTAL = STATUSES.reduce((sum, s) => sum + s.count, 0);

let cumulative = 0;
const SEGMENTS = STATUSES.map((s) => {
  const pct = Math.round((s.count / INSTALLMENT_TOTAL) * 100);
  const segment = { ...s, pct, bottom: cumulative };
  cumulative += pct;
  return segment;
});

/** Nested inside Amortization Overview, beside the ring/rows — uses the
 * space freed up by the fixed-width label column there. */
export function RepaymentStatusSection() {
  const delay = CARD_DELAY.amortization + 0.3;
  const [pinned, setPinned] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const active = hovered ?? pinned;
  const toggle = (label: string) => setPinned((prev) => (prev === label ? null : label));

  return (
    <div className="flex w-full min-w-0 flex-col gap-4 border-t border-border pt-5 sm:min-w-[172px] sm:flex-1 sm:self-start sm:border-l sm:border-t-0 sm:pl-6 sm:pt-0 sm:-mt-[72px]">
      <motion.div
        initial={{ opacity: 0, x: -8 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay, ease: [0.16, 1, 0.3, 1] }}
        className="flex items-center gap-2.5"
      >
        <motion.span
          initial={{ scale: 0.4, rotate: -25, opacity: 0 }}
          whileInView={{ scale: 1, rotate: 0, opacity: 1 }}
          viewport={{ once: true }}
          whileHover={{ scale: 1.15, rotate: 8 }}
          transition={{ type: "spring", stiffness: 320, damping: 16, delay: delay + 0.05 }}
          className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-strong to-[#4D7A9E] text-white shadow-[0_6px_14px_-4px_rgba(11,122,84,0.45)]"
        >
          <CalendarDays size={16} />
        </motion.span>
        <h3 className="bg-gradient-to-r from-emerald-strong to-[#4D7A9E] bg-clip-text px-1 py-1 text-[13px] font-extrabold uppercase tracking-wide text-transparent [filter:drop-shadow(0_1px_1px_rgba(15,28,23,0.12))]">
          Repayment Status
        </h3>
      </motion.div>

      <div className="flex gap-3">
        <EmiProgressGauge delay={delay} hovered={active} />

        <div className="flex min-w-0 flex-1 flex-col gap-2">
          {STATUSES.map((status, i) => (
            <StatusTile
              key={status.label}
              icon={status.icon}
              label={status.label}
              value={
                status.label === "Paid" ? (
                  <CountUpNumber value={status.count} duration={1000} delay={delay * 1000 + 250} />
                ) : (
                  status.count
                )
              }
              iconBg={status.iconBg}
              iconText={status.iconText}
              fill={status.fill}
              delay={delay + i * 0.08}
              active={pinned === status.label}
              onClick={() => toggle(status.label)}
              onHoverChange={(v) => setHovered(v ? status.label : null)}
            />
          ))}
          <StatusTile
            icon={MATURES.icon}
            label={MATURES.label}
            value={repaymentTimeline.maturesOn}
            iconBg={MATURES.iconBg}
            iconText={MATURES.iconText}
            fill={MATURES.fill}
            delay={delay + STATUSES.length * 0.08}
            active={pinned === MATURES.label}
            onClick={() => toggle(MATURES.label)}
            onHoverChange={(v) => setHovered(v ? MATURES.label : null)}
            large
          />
        </div>
      </div>

      <div className="flex flex-col gap-1 border-t border-border pt-3">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[11px] text-ink-faint">EMI</span>
          <span className="text-xs font-bold text-ink">
            <CountUpNumber
              value={repaymentTimeline.emiEach}
              decimals={2}
              duration={1100}
              delay={delay * 1000 + 350}
              formatter={(n) => formatEuro(n, 2)}
            />
          </span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <span className="text-[11px] text-ink-faint">Repayment</span>
          <span className="text-xs font-bold text-emerald-strong">
            <CountUpNumber
              value={repaymentTimeline.repaymentPercent}
              duration={1000}
              delay={delay * 1000 + 400}
              suffix="%"
            />
          </span>
        </div>
      </div>
    </div>
  );
}

const GAUGE_HEIGHT = 130;

const TICKS = [100, 50, 0];

function EmiProgressGauge({ delay, hovered }: { delay: number; hovered: string | null }) {
  const hoveredSegment = hovered ? SEGMENTS.find((s) => s.label === hovered) : undefined;
  const displayPercent = hoveredSegment
    ? hoveredSegment.pct
    : hovered === "Matures"
    ? 100
    : repaymentTimeline.repaymentPercent;
  const displayColor = hoveredSegment ? hoveredSegment.fill : hovered === "Matures" ? MATURES.fill : "#0b7a54";

  return (
    <div className="flex w-14 flex-shrink-0 flex-col items-center gap-1.5 rounded-lg border border-border bg-page/60 px-2 py-3">
      <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md bg-mint text-emerald-strong">
        <BarChart3 size={10} />
      </span>
      <motion.span
        key={hovered ?? "default"}
        initial={{ opacity: 0, y: -2 }}
        animate={{ opacity: 1, y: 0, color: displayColor }}
        transition={{ duration: 0.25 }}
        className="text-[11px] font-extrabold tracking-tight"
      >
        <CountUpNumber
          value={displayPercent}
          duration={hovered ? 400 : 900}
          delay={hovered ? 0 : delay * 1000 + 200}
          suffix="%"
        />
      </motion.span>
      <div className="relative">
        <div
          className="relative w-2.5 flex-shrink-0 overflow-hidden rounded-full bg-border/60"
          style={{ height: GAUGE_HEIGHT }}
        >
          {SEGMENTS.map((segment, i) => (
            <motion.div
              key={segment.label}
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true }}
              animate={{
                opacity: hovered === null || hovered === segment.label ? 1 : 0.3,
              }}
              transition={{
                scaleY: { duration: 0.7, delay: delay + 0.15 + i * 0.1, ease: [0.16, 1, 0.3, 1] },
                opacity: { duration: 0.25 },
              }}
              style={{
                height: `${segment.pct}%`,
                bottom: `${segment.bottom}%`,
                backgroundColor: segment.fill,
                originY: 1,
              }}
              className="absolute left-0 w-full"
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{
            opacity: hovered === "Matures" ? 1 : 0,
            y: hovered === "Matures" ? 0 : 4,
          }}
          transition={{ duration: 0.2 }}
          className="absolute left-1/2 top-0 flex h-4 w-4 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-white shadow-md"
          style={{ backgroundColor: MATURES.fill }}
        >
          <Flag size={9} />
        </motion.div>

        {TICKS.map((tick, i) => (
          <motion.div
            key={tick}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: delay + 0.3 + i * 0.08 }}
            className="absolute right-0 text-[8px] font-bold text-ink-faint"
            style={{
              top: `${(100 - tick) * (GAUGE_HEIGHT / 100)}px`,
              transform: "translate(100%, -50%)",
            }}
          >
            {tick}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function StatusTile({
  icon: Icon,
  label,
  value,
  iconBg,
  iconText,
  delay,
  active,
  onClick,
  onHoverChange,
  large,
  fill,
}: {
  icon: typeof CheckCircle2;
  label: string;
  value: React.ReactNode;
  iconBg: string;
  iconText: string;
  delay: number;
  active: boolean;
  onClick: () => void;
  onHoverChange: (hovered: boolean) => void;
  large?: boolean;
  fill: string;
}) {
  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, x: 8 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35, delay: delay + 0.15, ease: [0.16, 1, 0.3, 1] }}
      onClick={onClick}
      onMouseEnter={() => onHoverChange(true)}
      onMouseLeave={() => onHoverChange(false)}
      whileHover={{ x: 2 }}
      whileTap={{ scale: 0.97 }}
      aria-pressed={active}
      style={{ "--tile-fill": fill } as React.CSSProperties}
      className={`flex min-w-0 items-center rounded-md border text-left transition-colors duration-150 ${
        large ? "gap-3 px-[13px] py-[11px]" : "gap-[9px] px-[9px] py-[7px]"
      } ${
        active
          ? "border-[color:var(--tile-fill)] bg-[color:var(--tile-fill)]/10 shadow-[0_1px_2px_rgba(15,28,23,0.08)]"
          : "border-border bg-page/60 hover:border-[color:var(--tile-fill)] hover:bg-[color:var(--tile-fill)]/10"
      }`}
    >
      <span
        className={`flex flex-shrink-0 items-center justify-center rounded-full ${iconBg} ${iconText} ${
          large ? "h-[31px] w-[31px]" : "h-[22px] w-[22px]"
        }`}
      >
        <Icon size={large ? 14 : 11} />
      </span>
      <span className={`min-w-0 flex-1 truncate text-ink-faint ${large ? "text-[13px]" : "text-[11px]"}`}>{label}</span>
      <span className={`flex-shrink-0 truncate font-bold text-ink ${large ? "text-[15px]" : "text-[13px]"}`}>{value}</span>
    </motion.button>
  );
}
