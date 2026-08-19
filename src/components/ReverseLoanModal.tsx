import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, X, CheckCircle2 } from "lucide-react";
import { contract } from "../data/contract";

type Stage = "form" | "processing" | "success";

export function ReverseLoanModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [reason, setReason] = useState("");
  const [stage, setStage] = useState<Stage>("form");
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!open) return;
    setReason("");
    setStage("form");
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && stage !== "processing") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const startReversal = () => {
    setStage("processing");
    timerRef.current = window.setTimeout(() => setStage("success"), 5000);
  };

  const handleBackdropClick = () => {
    if (stage === "processing") return;
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/40 px-4 backdrop-blur-[2px]"
          onClick={handleBackdropClick}
        >
          <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md overflow-hidden rounded-2xl border border-border bg-card shadow-[0_30px_60px_-20px_rgba(15,28,23,0.35)]"
          >
            <AnimatePresence mode="wait">
              {stage === "form" && (
                <motion.div
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="p-6"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-rose-50 text-rose-600">
                        <AlertTriangle size={20} />
                      </span>
                      <h2 className="pt-1.5 text-lg font-extrabold text-ink">Reverse entire loan?</h2>
                    </div>
                    <button
                      type="button"
                      onClick={onClose}
                      className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-ink-faint transition-colors duration-150 hover:bg-page hover:text-ink"
                      aria-label="Close"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                    This will contra all accounting entries for{" "}
                    <span className="font-semibold text-ink">{contract.id}</span> — the disbursement,
                    every accrual, all fees, and any manual payments (reversed automatically) — and set
                    the contract to <span className="font-bold text-rose-600">REVERSED</span>. The
                    contract cannot be used again.{" "}
                    <span className="font-semibold text-ink">This action cannot be undone.</span>
                  </p>

                  <div className="mt-5">
                    <label className="text-sm font-bold text-ink">
                      Reversal reason <span className="text-rose-600">*</span>
                    </label>
                    <p className="mb-2 text-xs text-ink-faint">Why is this loan being reversed?</p>
                    <textarea
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      rows={3}
                      placeholder="Enter a reason..."
                      className="w-full resize-none rounded-xl border border-border bg-page/60 px-3 py-2.5 text-sm text-ink outline-none transition-colors duration-150 placeholder:text-ink-faint focus:border-rose-400 focus:ring-1 focus:ring-rose-400"
                    />
                  </div>

                  <div className="mt-6 flex items-center justify-end gap-3">
                    <motion.button
                      type="button"
                      whileHover={{ y: -1 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={onClose}
                      className="rounded-full border border-border px-5 py-2 text-sm font-semibold text-ink-soft transition-colors duration-150 hover:bg-page"
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      type="button"
                      whileHover={{ y: -1 }}
                      whileTap={{ scale: 0.97 }}
                      disabled={!reason.trim()}
                      onClick={startReversal}
                      className="rounded-full bg-rose-600 px-5 py-2 text-sm font-bold text-white transition-colors duration-150 hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Reverse Loan
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {stage === "processing" && (
                <motion.div
                  key="processing"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="flex flex-col items-center gap-4 px-6 py-14 text-center"
                >
                  <div className="relative h-14 w-full max-w-[230px]">
                    <motion.div
                      initial={{ x: 0, opacity: 1 }}
                      animate={{ x: [0, 0, 168, 168], opacity: [1, 1, 1, 0] }}
                      transition={{
                        duration: 2.5,
                        repeat: Infinity,
                        times: [0, 0.05, 0.75, 1],
                        ease: "easeInOut",
                      }}
                      className="absolute left-0 top-1/2 -translate-y-1/2 text-3xl"
                    >
                      <span className="inline-block scale-x-[-1]">🏃💰</span>
                    </motion.div>
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 text-4xl">🏦</div>
                  </div>
                  <div>
                    <div className="text-base font-extrabold text-ink">Reversing loan…</div>
                    <div className="mt-1 text-sm text-ink-faint">
                      Contra-posting accounting entries for {contract.id}
                    </div>
                  </div>
                </motion.div>
              )}

              {stage === "success" && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="flex flex-col items-center gap-2 px-6 py-10 text-center"
                >
                  <motion.span
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 18 }}
                    className="mb-1 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-strong text-white"
                  >
                    <CheckCircle2 size={28} />
                  </motion.span>
                  <h2 className="text-lg font-extrabold text-ink">Loan reversed.</h2>
                  <p className="text-sm text-ink-faint">
                    All accounting entries have been contra-posted.
                  </p>
                  <motion.button
                    type="button"
                    whileHover={{ y: -1 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={onClose}
                    className="mt-5 w-full rounded-full bg-emerald-strong px-5 py-2.5 text-sm font-bold text-white transition-colors duration-150 hover:bg-emerald-deep"
                  >
                    OK
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
