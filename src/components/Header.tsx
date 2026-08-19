import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { contract } from "../data/contract";
import { ReverseLoanModal } from "./ReverseLoanModal";
import { FinancialAmendmentModal } from "./FinancialAmendmentModal";
import { CopyToNewModal } from "./CopyToNewModal";
import { NonFinancialAmendmentModal } from "./NonFinancialAmendmentModal";

export function Header() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className="mb-6 flex flex-wrap items-start justify-between gap-4"
    >
      <div>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-extrabold tracking-tight text-ink sm:text-[28px]">
            Contract {contract.id}
          </h1>
          <span className="rounded-full border border-border bg-page px-3 py-1 text-xs font-semibold text-ink-soft">
            Version: {contract.version}
          </span>
          <span className="flex items-center gap-2">
            <span className="text-sm font-medium text-ink-faint">Status:</span>
            <StatusBadge />
          </span>
        </div>
      </div>

      <ActionButtons />
    </motion.header>
  );
}

function ActionButtons() {
  const [editOpen, setEditOpen] = useState(false);
  const [reverseOpen, setReverseOpen] = useState(false);
  const [financialAmendmentOpen, setFinancialAmendmentOpen] = useState(false);
  const [nonFinancialAmendmentOpen, setNonFinancialAmendmentOpen] = useState(false);
  const [copyOpen, setCopyOpen] = useState(false);
  const editRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!editOpen) return;
    const onClick = (e: MouseEvent) => {
      if (editRef.current && !editRef.current.contains(e.target as Node)) {
        setEditOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [editOpen]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-wrap items-center gap-2"
    >
      <ActionButton tone="violet">Authorization</ActionButton>

      <div ref={editRef} className="relative">
        <ActionButton tone="white" onClick={() => setEditOpen((v) => !v)}>
          Edit
          <motion.span animate={{ rotate: editOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronDown size={14} />
          </motion.span>
        </ActionButton>

        <AnimatePresence>
          {editOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -5 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -5 }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
              className="absolute right-0 top-11 z-20 w-60 origin-top-right overflow-hidden rounded-xl border border-border bg-card shadow-[0_18px_36px_-12px_rgba(15,28,23,0.2)]"
            >
              {["Financial Amendment", "Non-Financial Amendment"].map((label, i) => (
                <button
                  key={label}
                  onClick={() => {
                    setEditOpen(false);
                    if (label === "Financial Amendment") setFinancialAmendmentOpen(true);
                    if (label === "Non-Financial Amendment") setNonFinancialAmendmentOpen(true);
                  }}
                  className={`flex w-full items-center whitespace-nowrap px-4 py-3 text-left text-sm font-bold text-ink transition-colors duration-150 hover:bg-mint-soft hover:text-emerald-deep ${
                    i === 1 ? "border-t border-border" : ""
                  }`}
                >
                  {label}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <ActionButton tone="rose" onClick={() => setReverseOpen(true)}>
        Reverse Loan
      </ActionButton>
      <ActionButton tone="solid" onClick={() => setCopyOpen(true)}>
        Copy to new
      </ActionButton>

      <ReverseLoanModal open={reverseOpen} onClose={() => setReverseOpen(false)} />
      <FinancialAmendmentModal
        open={financialAmendmentOpen}
        onClose={() => setFinancialAmendmentOpen(false)}
      />
      <CopyToNewModal open={copyOpen} onClose={() => setCopyOpen(false)} />
      <NonFinancialAmendmentModal
        open={nonFinancialAmendmentOpen}
        onClose={() => setNonFinancialAmendmentOpen(false)}
      />
    </motion.div>
  );
}

const TONE_CLASSES = {
  violet: "border-violet-200 bg-violet-50 text-violet-700 hover:bg-violet-100",
  rose: "border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100",
  white: "border-border bg-white text-ink-soft hover:bg-page",
  solid: "border-transparent bg-emerald-strong text-white hover:bg-emerald-deep",
};

function ActionButton({
  tone,
  children,
  onClick,
}: {
  tone: "violet" | "rose" | "white" | "solid";
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.15 }}
      className={`flex items-center gap-1 rounded-full border px-4 py-2 text-sm font-semibold transition-colors duration-150 ${TONE_CLASSES[tone]}`}
    >
      {children}
    </motion.button>
  );
}

function StatusBadge() {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="inline-flex items-center gap-1.5 rounded-full bg-emerald-strong px-3 py-1 text-xs font-bold text-white"
    >
      <span className="relative flex h-4 w-4 items-center justify-center">
        <motion.span
          initial={{ opacity: 0.6, scale: 1 }}
          animate={{ opacity: 0, scale: 2.2 }}
          transition={{ duration: 0.9, delay: 0.55, ease: "easeOut" }}
          className="absolute inset-0 rounded-full bg-white"
        />
        <CheckCircle2 size={14} className="relative" />
      </span>
      REPAID
    </motion.span>
  );
}
