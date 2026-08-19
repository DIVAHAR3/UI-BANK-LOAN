import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, TrendingUp } from "lucide-react";

export interface AccrualRow {
  from: string;
  to: string;
  principal: number;
  rate: number;
  days: number;
  accrued: number;
}

export interface AccrualBreakdown {
  installmentNo: number;
  rows: AccrualRow[];
  totalDays: number;
  totalAccrued: number;
}

const amountFmt = new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const accruedFmt = new Intl.NumberFormat("en-US", { minimumFractionDigits: 4, maximumFractionDigits: 4 });

export function AccrualBreakdownModal({
  details,
  onClose,
}: {
  details: AccrualBreakdown | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!details) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [details, onClose]);

  return (
    <AnimatePresence>
      {details && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/40 px-4 py-8 backdrop-blur-[2px]"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 28 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ type: "spring", stiffness: 340, damping: 28, mass: 0.8 }}
            onClick={(e) => e.stopPropagation()}
            className="flex max-h-[88vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-[0_30px_60px_-20px_rgba(15,28,23,0.35)]"
          >
            <div className="flex flex-shrink-0 items-center justify-between gap-4 border-b border-border px-6 py-4">
              <div className="flex items-center gap-3">
                <motion.span
                  initial={{ scale: 0.4, rotate: -25, opacity: 0 }}
                  animate={{ scale: 1, rotate: 0, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20, delay: 0.05 }}
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-mint text-violet-600"
                >
                  <TrendingUp size={17} />
                </motion.span>
                <div>
                  <motion.h2
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    className="text-lg font-extrabold text-ink"
                  >
                    Accrual Breakdown
                  </motion.h2>
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.14 }}
                    className="text-xs font-semibold text-ink-faint"
                  >
                    Installment {details.installmentNo}
                  </motion.span>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-ink-faint transition-colors duration-150 hover:bg-page hover:text-ink"
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-5 scrollbar-thin">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.1 }}
                className="overflow-hidden rounded-xl border border-border"
              >
                <table className="w-full min-w-[560px] border-separate border-spacing-0 text-left">
                  <thead>
                    <tr className="bg-page/60">
                      <th className="border-b border-border px-4 py-2.5 text-[11px] font-bold uppercase tracking-wide text-ink-faint">
                        From
                      </th>
                      <th className="border-b border-border px-4 py-2.5 text-[11px] font-bold uppercase tracking-wide text-ink-faint">
                        To
                      </th>
                      <th className="border-b border-border px-4 py-2.5 text-right text-[11px] font-bold uppercase tracking-wide text-ink-faint">
                        Principal
                      </th>
                      <th className="border-b border-border px-4 py-2.5 text-right text-[11px] font-bold uppercase tracking-wide text-ink-faint">
                        Rate (%)
                      </th>
                      <th className="border-b border-border px-4 py-2.5 text-right text-[11px] font-bold uppercase tracking-wide text-ink-faint">
                        Days
                      </th>
                      <th className="border-b border-border px-4 py-2.5 text-right text-[11px] font-bold uppercase tracking-wide text-ink-faint">
                        Accrued
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {details.rows.map((r, i) => (
                      <motion.tr
                        key={i}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.16 + i * 0.06 }}
                      >
                        <td className="border-b border-border px-4 py-2.5 text-sm font-bold text-ink">{r.from}</td>
                        <td className="border-b border-border px-4 py-2.5 text-sm font-bold text-ink">{r.to}</td>
                        <td className="border-b border-border px-4 py-2.5 text-right text-sm font-semibold text-ink-soft">
                          {amountFmt.format(r.principal)}
                        </td>
                        <td className="border-b border-border px-4 py-2.5 text-right text-sm font-semibold text-ink-soft">
                          {r.rate.toFixed(4)}
                        </td>
                        <td className="border-b border-border px-4 py-2.5 text-right text-sm font-semibold text-ink-soft">
                          {r.days}
                        </td>
                        <td className="border-b border-border px-4 py-2.5 text-right text-sm font-extrabold text-violet-600">
                          {accruedFmt.format(r.accrued)}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan={4} className="border-t border-border bg-page/50 px-4 py-2.5 text-right text-xs font-extrabold uppercase tracking-wide text-ink">
                        Total accrued
                      </td>
                      <td className="border-t border-border bg-page/50 px-4 py-2.5 text-right text-sm font-extrabold text-ink">
                        {details.totalDays}
                      </td>
                      <td className="border-t border-border bg-page/50 px-4 py-2.5 text-right text-sm font-extrabold text-violet-600">
                        {accruedFmt.format(details.totalAccrued)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </motion.div>
            </div>

            <div className="flex flex-shrink-0 items-center justify-end border-t border-border px-6 py-4">
              <motion.button
                type="button"
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.97 }}
                onClick={onClose}
                className="rounded-full border border-border px-5 py-2 text-sm font-semibold text-ink-soft transition-colors duration-150 hover:bg-page"
              >
                Close
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
