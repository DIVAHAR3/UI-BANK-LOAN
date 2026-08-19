import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FileText, Plus, CheckCircle2, X } from "lucide-react";
import { contract } from "../data/contract";

type Stage = "processing" | "success";

export function CopyToNewModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [stage, setStage] = useState<Stage>("processing");
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!open) return;
    setStage("processing");
    timerRef.current = window.setTimeout(() => setStage("success"), 2600);
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
              {stage === "processing" && (
                <motion.div
                  key="processing"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="flex flex-col items-center gap-6 px-6 py-14 text-center"
                >
                  <div className="relative flex h-16 w-full max-w-[260px] items-center justify-between">
                    <div className="flex h-16 w-16 flex-shrink-0 flex-col items-center justify-center gap-1 rounded-xl border-2 border-emerald-strong bg-mint text-emerald-strong">
                      <FileText size={18} />
                      <span className="text-[9px] font-extrabold">{contract.id}</span>
                    </div>

                    <div className="absolute left-1/2 top-1/2 h-px w-[132px] -translate-x-1/2 -translate-y-1/2 border-t-2 border-dashed border-border" />

                    <motion.div
                      initial={{ left: 0, opacity: 0, scale: 0.7 }}
                      animate={{ left: [0, 0, 196, 196], opacity: [0, 1, 1, 0], scale: [0.7, 1, 1, 0.7] }}
                      transition={{ duration: 1.8, repeat: Infinity, times: [0, 0.12, 0.82, 1], ease: "easeInOut" }}
                      className="absolute top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-lg bg-emerald-strong text-white shadow-[0_10px_20px_-6px_rgba(11,122,84,0.5)]"
                    >
                      <FileText size={18} />
                    </motion.div>

                    <motion.div
                      animate={{
                        borderColor: ["#D8DFDB", "#0B7A54", "#D8DFDB"],
                        color: ["#94A3A8", "#0B7A54", "#94A3A8"],
                      }}
                      transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                      className="flex h-16 w-16 flex-shrink-0 flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed"
                    >
                      <Plus size={18} />
                      <span className="text-[9px] font-extrabold">New</span>
                    </motion.div>
                  </div>

                  <div>
                    <div className="text-base font-extrabold text-ink">Copying to a new contract…</div>
                    <div className="mt-1 text-sm text-ink-faint">
                      Duplicating booking items, components and schedules
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
                  className="relative flex flex-col items-center gap-2 px-6 py-10 text-center"
                >
                  <button
                    type="button"
                    onClick={onClose}
                    className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-full text-ink-faint transition-colors duration-150 hover:bg-page hover:text-ink"
                    aria-label="Close"
                  >
                    <X size={15} />
                  </button>
                  <motion.span
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 18 }}
                    className="mb-1 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-strong text-white"
                  >
                    <CheckCircle2 size={28} />
                  </motion.span>
                  <h2 className="text-lg font-extrabold text-ink">Success</h2>
                  <p className="text-sm text-ink-faint">Copied to a new contract — review and book</p>
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
