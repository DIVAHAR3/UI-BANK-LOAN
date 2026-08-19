import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, ShieldCheck, Search, CheckCircle2, Home, Link2 } from "lucide-react";

export interface LinkedCollateralResult {
  id: string;
  description: string;
  linkedValue: number;
  percent: number;
}

interface CollateralOption {
  id: string;
  description: string;
  owner: string;
  market: number;
  haircutPercent: number;
  lendable: number;
}

const COLLATERAL_OPTIONS: CollateralOption[] = [
  {
    id: "COL110000114",
    description: "Residential flat",
    owner: "000000872",
    market: 5000000,
    haircutPercent: 10,
    lendable: 4091026.86,
  },
];

const numberFmt = new Intl.NumberFormat("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 2 });

export function LinkCollateralModal({
  open,
  customerId,
  onClose,
  onLinked,
}: {
  open: boolean;
  customerId: string;
  onClose: () => void;
  onLinked?: (result: LinkedCollateralResult) => void;
}) {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [linkedValue, setLinkedValue] = useState("");
  const [percent, setPercent] = useState("");
  const [stage, setStage] = useState<"form" | "linking">("form");

  const selected = COLLATERAL_OPTIONS.find((c) => c.id === selectedId) ?? null;

  const filtered = COLLATERAL_OPTIONS.filter(
    (c) =>
      c.id.toLowerCase().includes(query.toLowerCase()) ||
      c.description.toLowerCase().includes(query.toLowerCase()) ||
      c.owner.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    if (!open) return;
    setQuery("");
    setSelectedId(null);
    setLinkedValue("");
    setPercent("");
    setStage("form");
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const handleLink = () => {
    if (!selected) return;
    const n = Number(linkedValue.replace(/,/g, "")) || 0;
    const p = Number(percent) || 0;
    setStage("linking");
    window.setTimeout(() => {
      onLinked?.({ id: selected.id, description: selected.description, linkedValue: n, percent: p });
      onClose();
    }, 1800);
  };

  const handleLinkedValueChange = (value: string) => {
    setLinkedValue(value);
    const n = Number(value.replace(/,/g, ""));
    if (selected && !Number.isNaN(n) && selected.lendable > 0) {
      setPercent(((n / selected.lendable) * 100).toFixed(2));
    }
  };

  const handlePercentChange = (value: string) => {
    setPercent(value);
    const n = Number(value);
    if (selected && !Number.isNaN(n)) {
      setLinkedValue(((n / 100) * selected.lendable).toFixed(2));
    }
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
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 28 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ type: "spring", stiffness: 340, damping: 28, mass: 0.8 }}
            onClick={(e) => e.stopPropagation()}
            className="flex max-h-[88vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-[0_30px_60px_-20px_rgba(15,28,23,0.35)]"
          >
            <div className="flex flex-shrink-0 items-center justify-between gap-4 border-b border-border px-6 py-4">
              <div className="flex items-center gap-3">
                <motion.span
                  initial={{ scale: 0.4, rotate: -25, opacity: 0 }}
                  animate={{ scale: 1, rotate: 0, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20, delay: 0.05 }}
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-mint text-[#4D7A9E]"
                >
                  <ShieldCheck size={17} />
                </motion.span>
                <h2 className="text-lg font-extrabold text-ink">Link Collateral</h2>
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

            {stage === "linking" ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-5 px-6 py-16">
                <div className="flex items-center gap-5">
                  <motion.span
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
                    className="flex h-12 w-12 items-center justify-center rounded-xl bg-mint text-emerald-strong"
                  >
                    <Home size={20} />
                  </motion.span>
                  <div className="relative h-0.5 w-20 overflow-hidden rounded-full bg-border">
                    <motion.span
                      animate={{ x: ["-100%", "300%"] }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-y-0 left-0 w-1/3 rounded-full bg-emerald-strong"
                    />
                  </div>
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }}
                    className="flex h-12 w-12 items-center justify-center rounded-xl bg-mint text-emerald-strong"
                  >
                    <Link2 size={20} />
                  </motion.span>
                  <div className="relative h-0.5 w-20 overflow-hidden rounded-full bg-border">
                    <motion.span
                      animate={{ x: ["-100%", "300%"] }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear", delay: 0.3 }}
                      className="absolute inset-y-0 left-0 w-1/3 rounded-full bg-emerald-strong"
                    />
                  </div>
                  <motion.span
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 1, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                    className="flex h-12 w-12 items-center justify-center rounded-xl bg-mint text-[#4D7A9E]"
                  >
                    <ShieldCheck size={20} />
                  </motion.span>
                </div>
                <div className="text-center">
                  <p className="text-sm font-extrabold text-ink">Linking collateral…</p>
                  <p className="mt-1 text-xs text-ink-faint">
                    {selected?.id} · {selected?.description}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto px-6 py-5 scrollbar-thin">
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="text-xs font-semibold text-ink-faint"
              >
                Active collateral for customer {customerId}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.14 }}
                className="mt-3 flex items-center gap-2 rounded-full border border-border bg-page/60 px-4 py-2.5"
              >
                <Search size={14} className="flex-shrink-0 text-ink-faint" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by id, description or owner"
                  className="w-full min-w-0 bg-transparent text-sm text-ink outline-none placeholder:text-ink-faint"
                />
              </motion.div>

              <div className="mt-3 flex flex-col gap-2">
                {filtered.map((c, i) => {
                  const isSelected = c.id === selectedId;
                  return (
                    <motion.button
                      key={c.id}
                      type="button"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.18 + i * 0.06 }}
                      onClick={() => {
                        setSelectedId(c.id);
                        setLinkedValue("");
                        setPercent("");
                      }}
                      className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition-colors duration-150 ${
                        isSelected ? "border-emerald-strong bg-mint-soft" : "border-border bg-card hover:bg-page/60"
                      }`}
                    >
                      <span
                        className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg ${
                          isSelected ? "bg-emerald-strong text-white" : "bg-mint text-emerald-strong"
                        }`}
                      >
                        <Home size={16} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-extrabold text-ink">
                          {c.id} · {c.description}
                        </div>
                        <div className="mt-0.5 truncate text-[11px] text-ink-faint">
                          Market {numberFmt.format(c.market)} · haircut {c.haircutPercent}% · lendable{" "}
                          {numberFmt.format(c.lendable)}
                        </div>
                      </div>
                      {isSelected && <CheckCircle2 size={18} className="flex-shrink-0 text-emerald-strong" />}
                    </motion.button>
                  );
                })}
                {filtered.length === 0 && (
                  <p className="py-6 text-center text-sm text-ink-faint">No collateral matches “{query}”.</p>
                )}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
                className="mt-4 grid grid-cols-2 gap-3"
              >
                <div>
                  <label className="text-xs font-bold text-ink">Linked value</label>
                  <div
                    className={`mt-1 flex items-center rounded-full border bg-card px-4 py-2 transition-colors duration-150 ${
                      selected
                        ? "border-border focus-within:border-emerald-strong focus-within:ring-1 focus-within:ring-emerald-strong"
                        : "border-border opacity-50"
                    }`}
                  >
                    <input
                      type="text"
                      value={linkedValue}
                      disabled={!selected}
                      onChange={(e) => handleLinkedValueChange(e.target.value)}
                      placeholder="0.00"
                      className="w-full min-w-0 bg-transparent text-sm font-semibold text-ink-soft outline-none placeholder:font-normal placeholder:text-ink-faint disabled:cursor-not-allowed"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-ink">Percent (%)</label>
                  <div
                    className={`mt-1 flex items-center rounded-full border bg-card px-4 py-2 transition-colors duration-150 ${
                      selected
                        ? "border-border focus-within:border-emerald-strong focus-within:ring-1 focus-within:ring-emerald-strong"
                        : "border-border opacity-50"
                    }`}
                  >
                    <input
                      type="text"
                      value={percent}
                      disabled={!selected}
                      onChange={(e) => handlePercentChange(e.target.value)}
                      placeholder="0"
                      className="w-full min-w-0 bg-transparent text-sm font-semibold text-ink-soft outline-none placeholder:font-normal placeholder:text-ink-faint disabled:cursor-not-allowed"
                    />
                  </div>
                </div>
              </motion.div>
              </div>
            )}

            {stage === "form" && (
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
                  whileHover={selected ? { y: -1 } : undefined}
                  whileTap={selected ? { scale: 0.97 } : undefined}
                  disabled={!selected}
                  onClick={handleLink}
                  className="rounded-full bg-emerald-strong px-5 py-2 text-sm font-bold text-white transition-colors duration-150 hover:bg-emerald-deep disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Link
                </motion.button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
