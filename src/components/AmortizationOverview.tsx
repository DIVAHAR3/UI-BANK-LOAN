import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Wallet, Receipt, CalendarClock, Scale, PieChart } from "lucide-react";
import { Card, CardHeading } from "./Card";
import { CountUpNumber } from "./CountUpNumber";
import { RepaymentStatusSection } from "./RepaymentTimeline";
import { amortization } from "../data/contract";
import { formatEuro } from "../lib/format";
import { CARD_DELAY } from "../lib/motion";

const SIZE = 168;
const STROKE = 14;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const ROWS = [
  {
    icon: Wallet,
    label: "Principal",
    value: amortization.principal,
    decimals: 0,
    from: "#3fd39a",
    to: "#0b7a54",
    hoverBg: "bg-mint-soft",
    iconBg: "bg-mint",
    iconText: "text-emerald-strong",
  },
  {
    icon: Receipt,
    label: "Fees",
    value: amortization.fees,
    decimals: 2,
    from: "#fbbf24",
    to: "#d97706",
    hoverBg: "bg-amber-50",
    iconBg: "bg-amber-100",
    iconText: "text-amber-600",
  },
  {
    icon: CalendarClock,
    label: "EMI",
    value: amortization.emi,
    decimals: 2,
    from: "#60a5fa",
    to: "#2563eb",
    hoverBg: "bg-blue-50",
    iconBg: "bg-blue-100",
    iconText: "text-blue-600",
  },
  {
    icon: Scale,
    label: "Balance",
    value: amortization.balance,
    decimals: 0,
    from: "#a78bfa",
    to: "#7c3aed",
    hoverBg: "bg-violet-50",
    iconBg: "bg-violet-100",
    iconText: "text-violet-600",
  },
];

export function AmortizationOverview() {
  const delay = CARD_DELAY.amortization;
  const reduceMotion = useReducedMotion();
  const [pinned, setPinned] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const active = hovered ?? pinned;

  const activeRow = active ? ROWS.find((r) => r.label === active) : undefined;
  const percent = activeRow
    ? Math.round((activeRow.value / amortization.balance) * 100)
    : amortization.percent;
  const ringLabel = activeRow ? activeRow.label : "Amortization";
  const offset = CIRCUMFERENCE * (1 - percent / 100);
  const ringDuration = reduceMotion ? 0 : active ? 0.6 : 1.3;
  const ringDelay = active ? 0 : delay + 0.1;

  return (
    <Card delay={delay} hover={false} className="flex flex-col">
      <CardHeading icon={<PieChart size={16} />} title="Amortization Overview" delay={delay} />
      <div className="flex flex-1 flex-col items-center gap-6 px-5 pb-6 pt-12 sm:flex-row sm:flex-wrap sm:items-start sm:gap-4 lg:items-stretch">
        <div className="relative flex h-[168px] w-[168px] flex-shrink-0 items-center justify-center">
          <svg width={SIZE} height={SIZE} className="-rotate-90">
            <defs>
              <linearGradient id="ringGradient" x1="0" y1="0" x2="0" y2="1">
                <motion.stop
                  offset="0%"
                  animate={{ stopColor: activeRow ? activeRow.from : ROWS[0].from }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                />
                <motion.stop
                  offset="100%"
                  animate={{ stopColor: activeRow ? activeRow.to : ROWS[0].to }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                />
              </linearGradient>
              <linearGradient id="trackGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-mint)" />
                <stop offset="100%" stopColor="var(--color-mint-soft)" />
              </linearGradient>
            </defs>
            <circle
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={RADIUS}
              fill="none"
              stroke="url(#trackGradient)"
              strokeWidth={STROKE}
            />
            <motion.circle
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={RADIUS}
              fill="none"
              stroke="url(#ringGradient)"
              strokeWidth={STROKE}
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              initial={{ strokeDashoffset: CIRCUMFERENCE }}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: ringDuration, delay: ringDelay, ease: [0.16, 1, 0.3, 1] }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-extrabold tracking-tight text-ink">
              <CountUpNumber
                key={ringLabel}
                value={percent}
                duration={active ? 500 : 1300}
                delay={active ? 0 : delay * 1000 + 100}
                suffix="%"
              />
            </span>
            <span className="mt-1 text-xs font-semibold uppercase tracking-wide text-ink-faint">
              {ringLabel}
            </span>
          </div>
        </div>

        <div className="flex w-full flex-col gap-1.5 sm:w-auto sm:flex-shrink-0">
          {ROWS.map((row, i) => (
            <motion.button
              key={row.label}
              type="button"
              initial={{ opacity: 0, x: 12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: delay + 0.2 + i * 0.08 }}
              onClick={() => setPinned((prev) => (prev === row.label ? null : row.label))}
              onMouseEnter={() => setHovered(row.label)}
              onMouseLeave={() => setHovered(null)}
              whileTap={{ scale: 0.98 }}
              aria-pressed={pinned === row.label}
              className={`flex w-full items-center gap-3 rounded-lg px-2 py-1 -mx-2 text-left transition-colors duration-150 hover:bg-page ${
                active === row.label ? row.hoverBg : ""
              }`}
            >
              <span
                className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg transition-colors duration-150 ${
                  active === row.label ? row.iconBg : "bg-mint"
                } ${active === row.label ? row.iconText : "text-emerald-strong"}`}
              >
                <row.icon size={15} />
              </span>
              <span className="w-[62px] flex-shrink-0 text-sm text-ink-soft">{row.label}</span>
              <span className="text-sm font-bold text-ink">
                <CountUpNumber
                  value={row.value}
                  decimals={row.decimals}
                  duration={1100}
                  delay={delay * 1000 + 200 + i * 80}
                  formatter={(n) => formatEuro(n, row.decimals)}
                />
              </span>
            </motion.button>
          ))}
        </div>

        <RepaymentStatusSection />
      </div>
    </Card>
  );
}
