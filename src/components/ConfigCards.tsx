import { motion } from "framer-motion";
import { useState } from "react";
import {
  Settings2,
  MapPin,
  Cog,
  RefreshCw,
  Upload,
  Calculator,
  CheckCircle2,
  ReceiptText,
  BadgePercent,
  Coins,
} from "lucide-react";
import { Card, CardHeading } from "./Card";
import { CountUpNumber } from "./CountUpNumber";
import { SelectField } from "./SelectField";
import {
  rateChange,
  processing,
  recomputation,
  quickInfo,
} from "../data/contract";
import { formatEuro } from "../lib/format";
import { CARD_DELAY } from "../lib/motion";

const FREQUENCY_OPTIONS = ["Monthly", "Bi-Monthly", "Quarterly", "Half-Yearly", "Yearly"] as const;

export function RateChangeCard() {
  const delay = CARD_DELAY.configCards;

  return (
    <Card delay={delay} hover={false}>
      <CardHeading icon={<Settings2 size={16} />} title="Rate Change" delay={delay} />
      <div className="flex flex-col gap-4 px-5 pb-5 pt-2">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.35, delay: delay + 0.1 }}
        >
          <div className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-ink">
            <MapPin size={12} className="text-ink-faint" />
            Rate Change Type
          </div>
          <SegmentedToggle value={rateChange.type} options={["Local", "Global"] as const} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.35, delay: delay + 0.17 }}
        >
          <SelectField label="Rate Change Frequency" value={rateChange.frequency} options={FREQUENCY_OPTIONS} />
        </motion.div>
      </div>
    </Card>
  );
}

export function ProcessingCard() {
  const delay = CARD_DELAY.configCards + 0.06;
  const modes = [
    { icon: RefreshCw, label: "Liquidation Mode", value: processing.liquidationMode },
    { icon: Upload, label: "Disbursement Mode", value: processing.disbursementMode },
  ];

  return (
    <Card delay={delay} hover={false}>
      <CardHeading icon={<Cog size={16} />} title="Processing" delay={delay} />
      <div className="flex flex-col gap-4 px-5 pb-5 pt-2">
        {modes.map((mode, i) => (
          <motion.div
            key={mode.label}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: delay + 0.1 + i * 0.07 }}
          >
            <div className="mb-1.5 text-xs font-semibold text-ink">{mode.label}</div>
            <SegmentedToggle value={mode.value} options={["Auto", "Manual"] as const} />
          </motion.div>
        ))}
      </div>
    </Card>
  );
}

export function SegmentedToggle({ value, options }: { value: string; options: readonly string[] }) {
  const [mode, setMode] = useState(value);
  return (
    <div className="flex items-center gap-2">
      <motion.button
        type="button"
        onClick={() => setMode("Null")}
        whileTap={{ scale: 0.9 }}
        aria-pressed={mode === "Null"}
        className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold transition-colors duration-150 ${
          mode === "Null" ? "bg-border text-ink" : "text-ink-faint hover:text-ink"
        }`}
      >
        —
      </motion.button>
      <div className="inline-flex items-center gap-0.5 rounded-full border border-border bg-page p-0.5">
        {options.map((option) => (
          <motion.button
            key={option}
            type="button"
            onClick={() => setMode(option)}
            whileTap={{ scale: 0.95 }}
            aria-pressed={mode === option}
            className={`rounded-full px-3 py-1 text-xs font-bold transition-colors duration-150 ${
              mode === option ? "bg-emerald-strong text-white" : "text-ink-faint hover:text-ink"
            }`}
          >
            {option}
          </motion.button>
        ))}
      </div>
    </div>
  );
}

export function RecomputationCard() {
  const delay = CARD_DELAY.configCards + 0.12;
  const fields = [
    {
      label: "Amendment Action Basis",
      value: recomputation.amendmentActionBasis,
      options: ["Installment", "Tenure"] as const,
    },
    {
      label: "Prepayment Recomputation Basis",
      value: recomputation.prepaymentRecomputationBasis,
      options: ["Installment", "Tenure"] as const,
    },
  ];

  return (
    <Card delay={delay} hover={false}>
      <CardHeading icon={<Calculator size={16} />} title="Recomputation" delay={delay} />
      <div className="flex flex-col gap-4 px-5 pb-5 pt-2">
        {fields.map((field, i) => (
          <motion.div
            key={field.label}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: delay + 0.1 + i * 0.07 }}
          >
            <div className="mb-1.5 text-xs font-semibold text-ink">{field.label}</div>
            <SegmentedToggle value={field.value} options={field.options} />
          </motion.div>
        ))}
      </div>
    </Card>
  );
}

export function QuickInfoCard() {
  const delay = CARD_DELAY.configCards + 0.18;
  const rows = [
    { icon: CheckCircle2, label: "Contract Status", value: quickInfo.contractStatus },
    {
      icon: ReceiptText,
      label: "EMI Amount",
      value: (
        <CountUpNumber
          value={quickInfo.emiAmount}
          decimals={2}
          duration={1000}
          delay={delay * 1000 + 300}
          formatter={(n) => formatEuro(n, 2)}
        />
      ),
    },
    {
      icon: BadgePercent,
      label: "Repayment",
      value: (
        <CountUpNumber value={quickInfo.repaymentPercent} duration={900} delay={delay * 1000 + 350} suffix="%" />
      ),
    },
    { icon: Coins, label: "Currency", value: quickInfo.currency },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -3 }}
      className="flex w-full flex-col rounded-xl border border-emerald/20 bg-mint-soft px-4 py-4 shadow-[0_1px_2px_rgba(15,28,23,0.05)] transition-shadow duration-200 hover:shadow-[0_18px_36px_-16px_rgba(15,28,23,0.16)]"
    >
      <h3 className="mb-2.5 text-[11px] font-bold uppercase tracking-wide text-emerald-deep">Quick Info</h3>
      <div className="flex flex-col gap-2">
        {rows.map((row, i) => (
          <motion.div
            key={row.label}
            initial={{ opacity: 0, x: 10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: delay + 0.1 + i * 0.07 }}
            className="flex items-center justify-between gap-2"
          >
            <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-deep">
              <row.icon size={12} />
              {row.label}
            </span>
            <span className="rounded-md border border-emerald/25 bg-card/70 px-1.5 py-0.5 text-xs font-extrabold text-emerald-deep">
              {row.value}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
