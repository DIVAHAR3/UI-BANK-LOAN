import { useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import { Card } from "./Card";
import { SelectField } from "./SelectField";
import { FailureDetailsModal } from "./FailureDetailsModal";
import { ledgerEvents, type EntryStatus, type LedgerEntry } from "../data/entries";

const numberFmt = new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const STATUS_TONES: Record<EntryStatus, string> = {
  Processed: "bg-emerald-100 text-emerald-700",
  Posted: "bg-emerald-100 text-emerald-700",
  Pending: "bg-amber-100 text-amber-700",
  Failed: "bg-rose-100 text-rose-700",
};

function eventLabel(no: number, code: string, date: string, status: string) {
  return `${no} · ${code} — ${date} · ${status.toUpperCase()}`;
}

const EVENT_OPTIONS = ledgerEvents.map((e) => eventLabel(e.no, e.code, e.date, e.status));

export function EntriesPanel() {
  const [selectedLabel, setSelectedLabel] = useState(EVENT_OPTIONS[0]);
  const [failure, setFailure] = useState<LedgerEntry | null>(null);
  const active = ledgerEvents.find((e) => eventLabel(e.no, e.code, e.date, e.status) === selectedLabel) ?? ledgerEvents[0];

  return (
    <Card delay={0} hover={false}>
      <div className="px-5 pt-5">
        <SelectField label="Event" value={EVENT_OPTIONS[0]} options={EVENT_OPTIONS} onChange={setSelectedLabel} />
      </div>

      <div className="flex items-center gap-2.5 px-5 pb-3 pt-4">
        <span
          className={`rounded-full px-3 py-1 text-[11px] font-extrabold uppercase tracking-wide ${STATUS_TONES[active.status]}`}
        >
          {active.status}
        </span>
        <span className="text-xs text-ink-faint">{active.entries.length} entries</span>
      </div>

      <div className="overflow-x-auto px-5 pb-5">
        <table className="w-full min-w-[900px] border-separate border-spacing-0 text-left">
          <thead>
            <tr>
              {["Due Date", "Component", "GL Account", "GL Name", "DR/CR", "Tran Code", "Mode", "Status", "Amount"].map(
                (col, i) => (
                  <th
                    key={col}
                    className={`border-b border-border px-3 py-2.5 text-[11px] font-bold uppercase tracking-wide text-ink-faint ${
                      i === 8 ? "text-right" : i === 4 ? "text-center" : "text-left"
                    }`}
                  >
                    {col}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {active.entries.map((entry, i) => (
              <motion.tr
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.06 * i }}
                className="transition-colors duration-150 hover:bg-mint-soft"
              >
                <td className="border-b border-border px-3 py-3 text-sm font-bold text-ink">{entry.dueDate}</td>
                <td className="border-b border-border px-3 py-3 text-sm font-semibold text-ink-soft">
                  {entry.component}
                </td>
                <td className="border-b border-border px-3 py-3 text-sm font-semibold text-blue-700">
                  {entry.glAccount}
                </td>
                <td className="border-b border-border px-3 py-3 text-sm text-ink-soft">{entry.glName}</td>
                <td className="border-b border-border px-3 py-3 text-center">
                  <span
                    className={`text-xs font-extrabold ${entry.drCr === "DR" ? "text-blue-600" : "text-emerald-strong"}`}
                  >
                    {entry.drCr}
                  </span>
                </td>
                <td className="border-b border-border px-3 py-3 text-sm font-semibold text-ink-soft">
                  {entry.tranCode}
                </td>
                <td className="border-b border-border px-3 py-3 text-sm text-ink-faint">{entry.mode}</td>
                <td className="border-b border-border px-3 py-3">
                  <span
                    className={`inline-block rounded-full px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wide ${STATUS_TONES[entry.status]}`}
                  >
                    {entry.status}
                  </span>
                  {entry.status === "Failed" && entry.reason && (
                    <button
                      type="button"
                      onClick={() => setFailure(entry)}
                      className="mt-1 flex items-center gap-1.5 text-[11px] font-semibold text-rose-600 underline decoration-rose-300 decoration-dotted underline-offset-2 transition-colors duration-150 hover:text-rose-700"
                    >
                      <AlertTriangle size={12} className="flex-shrink-0" />
                      {entry.reason}
                    </button>
                  )}
                </td>
                <td className="border-b border-border px-3 py-3 text-right text-sm font-extrabold text-ink">
                  €{numberFmt.format(entry.amount)}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      <FailureDetailsModal entry={failure} onClose={() => setFailure(null)} />
    </Card>
  );
}
