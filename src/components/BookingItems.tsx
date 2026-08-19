import { useState } from "react";
import { motion } from "framer-motion";
import { ClipboardList, ChevronUp, ChevronDown } from "lucide-react";
import { Card, CardHeading } from "./Card";
import { DateField } from "./DatePicker";
import { SelectField } from "./SelectField";
import { bookingItems } from "../data/contract";
import { CARD_DELAY } from "../lib/motion";

const FREQUENCY_OPTIONS = ["Monthly", "Bi-Monthly", "Quarterly", "Half-Yearly", "Yearly"] as const;

type FieldKind = "text" | "tenor" | "frequency" | "date";

const FIELDS: { label: string; value: string; kind: FieldKind }[] = [
  { label: "Loan Amount", value: bookingItems.loanAmount, kind: "text" },
  { label: "Disbursed Amount", value: bookingItems.disbursedAmount, kind: "text" },
  { label: "Tenor", value: bookingItems.tenor, kind: "tenor" },
  { label: "Frequency", value: bookingItems.frequency, kind: "frequency" },
  { label: "Book Date", value: bookingItems.bookDate, kind: "date" },
  { label: "Value Date", value: bookingItems.valueDate, kind: "date" },
  { label: "Maturity Date", value: bookingItems.maturityDate, kind: "date" },
  { label: "Customer Account No", value: bookingItems.customerAccountNo, kind: "text" },
];

export function BookingItems() {
  const delay = CARD_DELAY.bookingItems;
  const [clearBackdatedDues, setClearBackdatedDues] = useState(false);

  return (
    <Card delay={delay} hover={false}>
      <CardHeading icon={<ClipboardList size={16} />} title="Booking Items" delay={delay} />
      <div className="grid grid-cols-2 gap-x-4 gap-y-4 px-5 pb-4 pt-2 sm:grid-cols-4">
        {FIELDS.map((field, i) => (
          <motion.div
            key={field.label}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: delay + 0.1 + i * 0.04 }}
            className="min-w-0"
          >
            {field.kind === "date" ? (
              <DateField label={field.label} value={field.value} />
            ) : field.kind === "frequency" ? (
              <SelectField label={field.label} value={field.value} options={FREQUENCY_OPTIONS} />
            ) : field.kind === "tenor" ? (
              <TenorField label={field.label} value={field.value} />
            ) : (
              <TextField label={field.label} value={field.value} />
            )}
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.35, delay: delay + 0.1 + FIELDS.length * 0.04 }}
        className="flex items-center justify-between gap-3 border-t border-border px-5 py-3"
      >
        <div>
          <div className="text-xs font-bold text-ink">Clear Backdated Dues</div>
          <div className="text-[11px] text-ink-faint">Settle past-due installments at booking</div>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={clearBackdatedDues}
          onClick={() => setClearBackdatedDues((v) => !v)}
          className={`relative inline-flex h-5 w-9 flex-shrink-0 items-center rounded-full transition-colors duration-200 ${
            clearBackdatedDues ? "bg-emerald-strong" : "bg-border"
          }`}
        >
          <motion.span
            animate={{ x: clearBackdatedDues ? 18 : 2 }}
            transition={{ type: "spring", stiffness: 500, damping: 35 }}
            className="absolute h-4 w-4 rounded-full bg-white shadow-sm"
          />
        </button>
      </motion.div>
    </Card>
  );
}

function TextField({ label, value }: { label: string; value: string }) {
  return (
    <>
      <label className="text-xs font-bold text-ink">{label}</label>
      <div className="mt-1 flex max-w-full items-center rounded-full border border-border bg-card px-4 py-2 transition-colors duration-150 focus-within:border-emerald-strong focus-within:ring-1 focus-within:ring-emerald-strong">
        <input
          type="text"
          defaultValue={value}
          className="w-full min-w-0 bg-transparent text-sm font-semibold text-ink-soft outline-none"
        />
      </div>
    </>
  );
}

function TenorField({ label, value }: { label: string; value: string }) {
  const [tenor, setTenor] = useState(() => Number(value) || 0);

  return (
    <>
      <label className="text-xs font-bold text-ink">{label}</label>
      <div className="mt-1 flex max-w-full items-center gap-1.5 rounded-full border border-border bg-card py-2 pl-4 pr-2 transition-colors duration-150 focus-within:border-emerald-strong focus-within:ring-1 focus-within:ring-emerald-strong">
        <input
          type="text"
          value={tenor}
          onChange={(e) => setTenor(Number(e.target.value.replace(/\D/g, "")) || 0)}
          className="w-full min-w-0 bg-transparent text-sm font-semibold text-ink-soft outline-none"
        />
        <span className="flex-shrink-0 text-sm text-ink-faint">mo</span>
        <div className="flex flex-shrink-0 flex-col">
          <button
            type="button"
            onClick={() => setTenor((v) => v + 1)}
            aria-label="Increase tenor"
            className="flex h-3.5 w-5 items-center justify-center text-ink-faint transition-colors duration-150 hover:text-emerald-strong"
          >
            <ChevronUp size={12} />
          </button>
          <button
            type="button"
            onClick={() => setTenor((v) => Math.max(0, v - 1))}
            aria-label="Decrease tenor"
            className="flex h-3.5 w-5 items-center justify-center text-ink-faint transition-colors duration-150 hover:text-emerald-strong"
          >
            <ChevronDown size={12} />
          </button>
        </div>
      </div>
    </>
  );
}
