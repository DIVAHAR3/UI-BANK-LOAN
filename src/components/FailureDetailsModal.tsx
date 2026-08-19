import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, AlertTriangle, Hash, ListChecks, RefreshCw } from "lucide-react";
import type { LedgerEntry } from "../data/entries";

export function FailureDetailsModal({ entry, onClose }: { entry: LedgerEntry | null; onClose: () => void }) {
  useEffect(() => {
    if (!entry) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [entry, onClose]);

  return (
    <AnimatePresence>
      {entry && (
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
            className="flex max-h-[85vh] w-full max-w-md flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-[0_30px_60px_-20px_rgba(15,28,23,0.35)]"
          >
            <div className="flex flex-shrink-0 items-center justify-between gap-4 border-b border-border px-6 py-4">
              <div className="flex items-center gap-3">
                <motion.span
                  initial={{ scale: 0.4, rotate: -25, opacity: 0 }}
                  animate={{ scale: 1, rotate: 0, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20, delay: 0.05 }}
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-rose-100 text-rose-600"
                >
                  <AlertTriangle size={17} />
                </motion.span>
                <div>
                  <h2 className="text-lg font-extrabold text-ink">Posting Failed</h2>
                  <span className="text-xs font-semibold text-ink-faint">
                    {entry.component} · {entry.tranCode}
                  </span>
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
                transition={{ duration: 0.3, delay: 0.08 }}
                className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3"
              >
                <div className="flex items-center gap-2 text-sm font-extrabold text-rose-700">
                  <Hash size={13} />
                  {entry.errorCode ?? "ERR-UNKNOWN"}
                </div>
                <p className="mt-1 text-sm font-bold text-rose-700">{entry.reason}</p>
              </motion.div>

              {entry.detail && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.14 }}
                  className="mt-4"
                >
                  <div className="text-[11px] font-bold uppercase tracking-wide text-ink-faint">What happened</div>
                  <p className="mt-1 text-sm leading-relaxed text-ink-soft">{entry.detail}</p>
                </motion.div>
              )}

              {entry.suggestedAction && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  className="mt-4 flex items-start gap-2 rounded-xl border border-border bg-page/50 px-4 py-3"
                >
                  <ListChecks size={14} className="mt-0.5 flex-shrink-0 text-emerald-strong" />
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-wide text-ink-faint">
                      Suggested action
                    </div>
                    <p className="mt-0.5 text-sm text-ink-soft">{entry.suggestedAction}</p>
                  </div>
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.26 }}
                className="mt-4 grid grid-cols-2 gap-3 rounded-xl border border-border bg-page/50 p-4"
              >
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wide text-ink-faint">GL Account</div>
                  <div className="mt-0.5 text-sm font-extrabold text-ink">{entry.glAccount}</div>
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wide text-ink-faint">Due Date</div>
                  <div className="mt-0.5 text-sm font-extrabold text-ink">{entry.dueDate}</div>
                </div>
                {entry.attempts && (
                  <div className="col-span-2 flex items-center gap-1.5">
                    <RefreshCw size={12} className="text-ink-faint" />
                    <span className="text-xs font-semibold text-ink-faint">{entry.attempts}</span>
                  </div>
                )}
              </motion.div>
            </div>

            <div className="flex flex-shrink-0 items-center justify-end gap-3 border-t border-border px-6 py-4">
              <motion.button
                type="button"
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.97 }}
                onClick={onClose}
                className="rounded-full border border-border px-5 py-2 text-sm font-semibold text-ink-soft transition-colors duration-150 hover:bg-page"
              >
                Close
              </motion.button>
              <motion.button
                type="button"
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.97 }}
                onClick={onClose}
                className="flex items-center gap-1.5 rounded-full bg-emerald-strong px-5 py-2 text-sm font-bold text-white transition-colors duration-150 hover:bg-emerald-deep"
              >
                <RefreshCw size={13} />
                Retry Posting
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
