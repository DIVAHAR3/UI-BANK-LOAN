import { motion } from "framer-motion";
import {
  FileBarChart2,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Percent,
  Landmark,
  ClipboardList,
  Coins,
  CalendarDays,
} from "lucide-react";
import { CountUpNumber } from "./CountUpNumber";
import { financialSummary, bookingItems } from "../data/contract";
import { formatEuro } from "../lib/format";
import { CARD_DELAY } from "../lib/motion";

const STATS = [
  { icon: TrendingUp, label: "Interest", value: financialSummary.interest, sub: "Total Interest Payable" },
  { icon: Percent, label: "Tax", value: financialSummary.tax, sub: "Applicable Tax" },
  { icon: Landmark, label: "Net Principal", value: financialSummary.netPrincipal, sub: "Net Principal Payable" },
];

export function FinancialSummary() {
  const delay = CARD_DELAY.financialSummary;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-2xl border border-border bg-gradient-to-b from-mint-soft to-white p-3 shadow-[0_1px_2px_rgba(15,28,23,0.05)]"
    >
      {/* Header banner */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: delay + 0.05, ease: [0.16, 1, 0.3, 1] }}
        className="relative mb-3 flex flex-wrap items-center justify-between gap-3 overflow-hidden rounded-xl bg-white/70 p-3"
      >
        <div className="flex items-center gap-2.5">
          <motion.span
            initial={{ scale: 0.4, rotate: -25, opacity: 0 }}
            whileInView={{ scale: 1, rotate: 0, opacity: 1 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.15, rotate: 8 }}
            transition={{ type: "spring", stiffness: 320, damping: 16, delay: delay + 0.1 }}
            className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-strong to-[#4D7A9E] text-white shadow-[0_6px_14px_-4px_rgba(11,122,84,0.45)]"
          >
            <FileBarChart2 size={15} />
          </motion.span>
          <div>
            <h2 className="inline-block bg-gradient-to-r from-emerald-strong to-[#4D7A9E] bg-clip-text px-1 py-1 text-sm font-extrabold tracking-tight text-transparent [filter:drop-shadow(0_1px_1px_rgba(15,28,23,0.12))]">
              Financial Summary
            </h2>
            <p className="text-[11px] text-ink-faint">Complete overview of your loan repayment</p>
          </div>
        </div>

        <div className="relative flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-emerald-strong text-white shadow-[0_6px_12px_-4px_rgba(11,122,84,0.5)]">
          <ShieldCheck size={14} />
          <Sparkles className="absolute -left-2.5 -top-1 text-emerald/60" size={9} />
        </div>
      </motion.div>

      {/* Content */}
      <div className="grid grid-cols-1 items-start gap-3 lg:grid-cols-2">
        <div className="flex flex-col gap-2.5">
          {STATS.map((stat, i) => (
            <StatCard key={stat.label} {...stat} delay={delay + 0.15 + i * 0.1} />
          ))}
        </div>

        <TotalRepaymentPanel delay={delay + 0.2} />
      </div>
    </motion.div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  delay,
}: {
  icon: typeof TrendingUp;
  label: string;
  value: number;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -2 }}
      className="flex items-center gap-2.5 rounded-xl bg-white p-2.5 shadow-[0_1px_2px_rgba(15,28,23,0.05)] transition-shadow duration-200 hover:shadow-[0_16px_32px_-16px_rgba(15,28,23,0.18)]"
    >
      <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-mint text-emerald-strong">
        <Icon size={14} />
      </span>
      <div className="min-w-0 flex-1">
        <div className="truncate text-[11px] text-ink-faint">{label}</div>
        <div className="truncate text-sm font-extrabold tracking-tight text-ink">
          <CountUpNumber
            value={value}
            decimals={2}
            duration={1200}
            delay={delay * 1000 + 200}
            formatter={(n) => formatEuro(n, 2)}
          />
        </div>
      </div>
      <span className="flex-shrink-0 rounded-md bg-mint px-1.5 py-0.5 text-[9px] font-bold text-emerald-strong">
        <Coins size={10} />
      </span>
    </motion.div>
  );
}

function TotalRepaymentPanel({ delay }: { delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
      className="relative flex flex-col items-center overflow-hidden rounded-xl border border-emerald/25 bg-gradient-to-b from-mint-soft to-white px-4 py-4 text-center"
    >
      <Sparkles className="absolute left-5 top-4 text-emerald/40" size={11} />
      <Sparkles className="absolute right-6 top-8 text-emerald/30" size={8} />

      <motion.div
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: delay + 0.6 }}
        className="relative z-10 flex h-11 w-11 items-center justify-center"
      >
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-strong text-white shadow-[0_10px_18px_-8px_rgba(11,122,84,0.5)]">
          <ClipboardList size={17} />
        </span>
        <span className="absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-emerald text-white shadow-md ring-2 ring-white">
          <Coins size={9} />
        </span>
      </motion.div>

      <h3 className="relative z-10 mt-2 text-sm font-extrabold text-ink">Total Repayment</h3>

      <div className="relative z-10 my-2.5 w-full max-w-[160px] border-t border-dashed border-emerald/30" />

      <div className="relative z-10">
        <div className="text-[11px] text-ink-faint">Total Amount Payable</div>
        <div className="mt-0.5 text-xl font-extrabold tracking-tight text-emerald-deep">
          <CountUpNumber
            value={financialSummary.totalRepayable}
            decimals={2}
            duration={1400}
            delay={delay * 1000 + 250}
            formatter={(n) => formatEuro(n, 2)}
          />
        </div>
      </div>

      <div className="relative z-10 my-2.5 w-full max-w-[160px] border-t border-border" />

      <div className="relative z-10 flex items-center gap-2 rounded-lg border border-border bg-white px-3 py-2 shadow-[0_1px_2px_rgba(15,28,23,0.05)]">
        <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md bg-mint text-emerald-strong">
          <CalendarDays size={12} />
        </span>
        <div className="text-left">
          <div className="text-[10px] text-ink-faint">Repayment Tenure</div>
          <div className="text-xs font-extrabold text-ink">{bookingItems.tenor} Months</div>
        </div>
      </div>

      <svg
        className="pointer-events-none absolute inset-x-0 bottom-0 h-10 w-full opacity-60"
        viewBox="0 0 400 100"
        preserveAspectRatio="none"
        aria-hidden
      >
        <path d="M0,60 C80,20 120,90 200,55 C280,20 320,80 400,45 L400,100 L0,100 Z" fill="var(--color-mint)" />
        <path d="M0,75 C90,50 140,95 220,70 C300,45 340,90 400,65 L400,100 L0,100 Z" fill="var(--color-mint-soft)" />
      </svg>
    </motion.div>
  );
}
