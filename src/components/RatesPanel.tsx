import { motion } from "framer-motion";
import { Percent } from "lucide-react";
import { Card, CardHeading } from "./Card";
import { rateHistory, type RateRow } from "../data/rates";

const STATUS_TONES: Record<RateRow["status"], string> = {
  Current: "bg-emerald-100 text-emerald-700",
  Upcoming: "bg-blue-100 text-blue-700",
  Expired: "bg-slate-100 text-slate-500",
};

const COLUMNS = ["Effective Date", "Base Rate (%)", "Spread (%)", "Effective Rate (%)", "Type", "Status"];

export function RatesPanel() {
  const delay = 0;

  return (
    <Card delay={delay} hover={false}>
      <CardHeading icon={<Percent size={16} />} title="Rate History" delay={delay} />
      <div className="overflow-x-auto px-5 pb-5 pt-2">
        <table className="w-full min-w-[640px] border-separate border-spacing-0 text-left">
          <thead>
            <tr>
              {COLUMNS.map((col) => (
                <th
                  key={col}
                  className="border-b border-border px-3 py-2.5 text-[11px] font-bold uppercase tracking-wide text-ink-faint"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rateHistory.map((row, i) => (
              <motion.tr
                key={row.effectiveDate}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: delay + 0.1 + i * 0.06 }}
                className="transition-colors duration-150 hover:bg-mint-soft"
              >
                <td className="border-b border-border px-3 py-3 text-sm font-bold text-ink">
                  {row.effectiveDate}
                </td>
                <td className="border-b border-border px-3 py-3 text-sm font-semibold text-ink-soft">
                  {row.baseRate}
                </td>
                <td className="border-b border-border px-3 py-3 text-sm font-semibold text-ink-faint">
                  {row.spread}
                </td>
                <td className="border-b border-border px-3 py-3 text-sm font-extrabold text-emerald-strong">
                  {row.effectiveRate}
                </td>
                <td className="border-b border-border px-3 py-3">
                  <span className="rounded-full bg-page px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-ink-soft">
                    {row.type}
                  </span>
                </td>
                <td className="border-b border-border px-3 py-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ${STATUS_TONES[row.status]}`}
                  >
                    {row.status}
                  </span>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
