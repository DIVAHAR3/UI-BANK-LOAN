import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FileEdit, X, CheckCircle2 } from "lucide-react";
import { SegmentedToggle } from "./ConfigCards";
import { processing, recomputation } from "../data/contract";

type Stage = "form" | "saving" | "saved";
type SavingPhase = "flat" | "beating";

const UNIT_WIDTH = 150;

function ecgPath(beating: boolean) {
  const unit = beating
    ? `M0,30 L34,30 L42,30 L47,14 L52,46 L57,22 L62,30 L${UNIT_WIDTH},30`
    : `M0,30 L${UNIT_WIDTH - 6},30 L${UNIT_WIDTH - 3},27 L${UNIT_WIDTH},30`;
  const offsetUnit = beating
    ? `M${UNIT_WIDTH},30 L${UNIT_WIDTH + 34},30 L${UNIT_WIDTH + 42},30 L${UNIT_WIDTH + 47},14 L${
        UNIT_WIDTH + 52
      },46 L${UNIT_WIDTH + 57},22 L${UNIT_WIDTH + 62},30 L${UNIT_WIDTH * 2},30`
    : `M${UNIT_WIDTH},30 L${UNIT_WIDTH * 2 - 6},30 L${UNIT_WIDTH * 2 - 3},27 L${UNIT_WIDTH * 2},30`;
  return `${unit} ${offsetUnit.replace(/^M/, "L")}`;
}

export function NonFinancialAmendmentModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [stage, setStage] = useState<Stage>("form");
  const [savingPhase, setSavingPhase] = useState<SavingPhase>("flat");
  const timers = useRef<number[]>([]);

  useEffect(() => {
    if (!open) return;
    setStage("form");
    setSavingPhase("flat");
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && stage !== "saving") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      timers.current.forEach((t) => window.clearTimeout(t));
      timers.current = [];
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const handleSave = () => {
    setStage("saving");
    setSavingPhase("flat");

    timers.current.push(
      window.setTimeout(() => setSavingPhase("beating"), 1100),
      window.setTimeout(() => setStage("saved"), 2500)
    );
  };

  const handleBackdropClick = () => {
    if (stage === "saving") return;
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
          className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/40 px-4 py-8 backdrop-blur-[2px]"
          onClick={handleBackdropClick}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="flex max-h-[88vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-[0_30px_60px_-20px_rgba(15,28,23,0.35)]"
          >
            <div className="flex flex-shrink-0 items-center justify-between gap-4 border-b border-border px-6 py-4">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-mint text-[#4D7A9E]">
                  <FileEdit size={17} />
                </span>
                <h2 className="text-lg font-extrabold text-ink">Non-Financial Amendment</h2>
              </div>
              {stage !== "saving" && (
                <button
                  type="button"
                  onClick={onClose}
                  className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-ink-faint transition-colors duration-150 hover:bg-page hover:text-ink"
                  aria-label="Close"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            <AnimatePresence mode="wait">
            {stage === "form" && (
            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
            <div className="flex-1 overflow-y-auto px-6 py-5 scrollbar-thin">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.06 }}
              >
                <label className="text-xs font-bold text-ink">Customer Account Number</label>
                <div className="mt-1 flex items-center rounded-full border border-border bg-page/60 px-4 py-2 text-sm font-semibold text-ink-soft">
                  200CAS00234114
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.12 }}
                className="mt-4"
              >
                <div className="mb-1.5 text-xs font-semibold text-ink">Liquidation Mode</div>
                <SegmentedToggle value={processing.liquidationMode} options={["Auto", "Manual"] as const} />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.18 }}
                className="mt-4"
              >
                <div className="mb-1.5 text-xs font-semibold text-ink">Amendment Action Basis</div>
                <SegmentedToggle
                  value={recomputation.amendmentActionBasis}
                  options={["Installment", "Tenure"] as const}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.24 }}
                className="mt-4"
              >
                <div className="mb-1.5 text-xs font-semibold text-ink">Prepayment Recomputation Basis</div>
                <SegmentedToggle
                  value={recomputation.prepaymentRecomputationBasis}
                  options={["Installment", "Tenure"] as const}
                />
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
                Cancel
              </motion.button>
              <motion.button
                type="button"
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleSave}
                className="rounded-full bg-emerald-strong px-5 py-2 text-sm font-bold text-white transition-colors duration-150 hover:bg-emerald-deep"
              >
                Save Amendment
              </motion.button>
            </div>
            </motion.div>
            )}

            {stage === "saving" && (
              <motion.div
                key="saving"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  x: savingPhase === "beating" ? [0, -9, 9, -6, 6, -2, 2, 0] : 0,
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: savingPhase === "beating" ? 0.5 : 0.15 }}
                className="relative flex flex-col items-center gap-5 overflow-hidden px-6 py-14 text-center"
              >
                <AnimatePresence>
                  {savingPhase === "beating" && (
                    <motion.div
                      key="flash"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0, 1, 0] }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.35, times: [0, 0.25, 1] }}
                      className="pointer-events-none absolute inset-0 z-20 bg-white"
                    />
                  )}
                </AnimatePresence>

                <div className="relative flex h-16 items-center justify-center gap-2">
                  {savingPhase === "flat" && (
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1.6, repeat: Infinity, ease: "linear" }}
                      className="absolute h-16 w-16 rounded-full border-2 border-dashed border-rose-300"
                    />
                  )}

                  <AnimatePresence>
                    {savingPhase === "beating" && (
                      <>
                        <motion.span
                          key="zap-left"
                          initial={{ x: -50, opacity: 0, scale: 0.5 }}
                          animate={{ x: -26, opacity: [0, 1, 0], scale: 1.1 }}
                          transition={{ duration: 0.35 }}
                          className="absolute text-2xl"
                        >
                          ⚡
                        </motion.span>
                        <motion.span
                          key="zap-right"
                          initial={{ x: 50, opacity: 0, scale: 0.5 }}
                          animate={{ x: 26, opacity: [0, 1, 0], scale: 1.1 }}
                          transition={{ duration: 0.35 }}
                          className="absolute text-2xl"
                        >
                          ⚡
                        </motion.span>
                      </>
                    )}
                  </AnimatePresence>

                  <motion.span
                    animate={
                      savingPhase === "beating"
                        ? { rotate: [90, -18, 6, 0], scale: [0.9, 1.2, 0.95, 1], y: [0, -10, 2, 0] }
                        : { rotate: 90, scale: 0.95, y: 0 }
                    }
                    transition={
                      savingPhase === "beating"
                        ? { duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }
                        : { duration: 0.7, ease: "easeIn" }
                    }
                    className={`text-5xl leading-none transition-[filter,opacity] duration-500 ${
                      savingPhase === "flat" ? "opacity-60 grayscale" : "opacity-100"
                    }`}
                  >
                    🧍
                  </motion.span>

                  <AnimatePresence>
                    {savingPhase === "beating" && (
                      <motion.span
                        initial={{ scale: 0, opacity: 0, y: 0 }}
                        animate={{ scale: [0, 1.4, 1], opacity: 1, y: [-6, -14, -10] }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ duration: 0.6, delay: 0.25 }}
                        className="absolute -right-6 -top-1 text-xl"
                      >
                        ❤️
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>

                <div className="relative h-14 w-full max-w-[280px] overflow-hidden rounded-lg bg-page/70">
                  <motion.div
                    key={savingPhase}
                    className="absolute inset-y-0 left-0"
                    style={{ width: UNIT_WIDTH * 2 }}
                    animate={{ x: [0, -UNIT_WIDTH] }}
                    transition={{
                      duration: savingPhase === "beating" ? 0.85 : 1.4,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <svg viewBox={`0 0 ${UNIT_WIDTH * 2} 60`} width={UNIT_WIDTH * 2} height={56}>
                      <path
                        d={ecgPath(savingPhase === "beating")}
                        fill="none"
                        stroke={savingPhase === "beating" ? "#0b7a54" : "#e11d48"}
                        strokeWidth={2.5}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </motion.div>
                </div>

                <div>
                  <div className="text-base font-extrabold text-ink">
                    {savingPhase === "flat" ? "Checking amendment vitals…" : "It’s alive — saving…"}
                  </div>
                  <div className="mt-1 text-sm text-ink-faint">
                    {savingPhase === "flat"
                      ? "Validating liquidation mode and recomputation basis"
                      : "Applying non-financial amendment to the contract"}
                  </div>
                </div>
              </motion.div>
            )}

            {stage === "saved" && (
              <motion.div
                key="saved"
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
                <h2 className="text-lg font-extrabold text-ink">Saved</h2>
                <p className="text-sm text-ink-faint">Non-financial amendment applied — not dead, fully saved.</p>
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
