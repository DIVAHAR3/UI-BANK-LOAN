import { useState } from "react";
import { motion } from "framer-motion";
import { Clock, Info } from "lucide-react";
import { Card } from "./Card";
import { SelectField } from "./SelectField";
import { dueTodayEvents } from "../data/dueToday";

const numberFmt = new Intl.NumberFormat("en-US", { minimumFractionDigits: 4, maximumFractionDigits: 4 });

function eventLabel(e: (typeof dueTodayEvents)[number]) {
  return `${e.no} · ${e.code} (${e.label}) — ${e.date}`;
}

const EVENT_OPTIONS = dueTodayEvents.map(eventLabel);

export function DueTodayPanel() {
  const [selectedLabel, setSelectedLabel] = useState(EVENT_OPTIONS[0]);
  const active = dueTodayEvents.find((e) => eventLabel(e) === selectedLabel) ?? dueTodayEvents[0];

  return (
    <Card delay={0} hover={false}>
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="mx-5 mt-5 flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3"
      >
        <motion.span
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-amber-200 text-amber-700"
        >
          <Clock size={12} />
        </motion.span>
        <p className="text-sm font-semibold text-amber-800">
          Pending — these entries would post at today&rsquo;s EOD. Not yet processed.
        </p>
      </motion.div>

      <div className="px-5 pt-4">
        <SelectField label="Event" value={EVENT_OPTIONS[0]} options={EVENT_OPTIONS} onChange={setSelectedLabel} />
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.15 }}
        className="px-5 pb-3 pt-3 text-xs text-ink-faint"
      >
        {active.entries.length} entries
      </motion.p>

      <div className="overflow-x-auto px-5 pb-5">
        <table className="w-full min-w-[720px] border-separate border-spacing-0 text-left">
          <thead>
            <tr>
              {["Due Date", "Component", "GL Account", "GL Name", "Status", "Dr/Cr", "Amount"].map((col, i) => (
                <th
                  key={col}
                  className={`border-b border-border px-3 py-2.5 text-[11px] font-bold uppercase tracking-wide text-ink-faint ${
                    i === 6 ? "text-right" : i === 5 ? "text-center" : "text-left"
                  }`}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {active.entries.map((entry, i) => (
              <motion.tr
                key={i}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.35, delay: 0.2 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ backgroundColor: "rgba(11,122,84,0.05)" }}
                className="group"
              >
                <td className="border-b border-border px-3 py-3 text-sm font-bold text-ink">{entry.dueDate}</td>
                <td className="border-b border-border px-3 py-3 text-sm font-semibold text-ink-soft">
                  {entry.component}
                </td>
                <td className="border-b border-border px-3 py-3 text-sm font-semibold text-blue-700">
                  {entry.glAccount}
                </td>
                <td className="border-b border-border px-3 py-3 text-sm text-ink-soft">{entry.glName}</td>
                <td className="border-b border-border px-3 py-3">
                  <motion.span
                    animate={{ opacity: [1, 0.55, 1] }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut", delay: i * 0.2 }}
                    className="inline-block rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wide text-amber-700"
                  >
                    Pending
                  </motion.span>
                </td>
                <td className="border-b border-border px-3 py-3 text-center">
                  <span
                    className={`text-xs font-extrabold ${entry.drCr === "DR" ? "text-blue-600" : "text-emerald-strong"}`}
                  >
                    {entry.drCr}
                  </span>
                </td>
                <td className="border-b border-border px-3 py-3 text-right text-sm font-extrabold text-ink transition-transform duration-200 group-hover:scale-105">
                  {numberFmt.format(entry.amount)}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.5 }}
        className="flex items-center gap-1.5 border-t border-border px-5 py-3 text-[11px] text-ink-faint"
      >
        <Info size={12} className="flex-shrink-0" />
        Entries will move to the Entries tab once posted at end of day.
      </motion.div>
    </Card>
  );
}
