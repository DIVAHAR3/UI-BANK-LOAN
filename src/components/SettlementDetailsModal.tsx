import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, ArrowDownToLine, ArrowRight, Landmark, CheckCircle2, CalendarCheck, CreditCard, Hash } from "lucide-react";

export interface CreditorPosting {
  account: string;
  component: string;
  narration: string;
  amount: number;
}

export interface SettlementDetails {
  installmentNo: number;
  status: string;
  transferAmount: number;
  debtorAccount: string;
  creditors: CreditorPosting[];
  settledDate: string;
  paymentMode: string;
  transactionRef: string;
}

const numberFmt = new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export function SettlementDetailsModal({
  details,
  onClose,
}: {
  details: SettlementDetails | null;
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
            className="flex max-h-[88vh] w-full max-w-xl flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-[0_30px_60px_-20px_rgba(15,28,23,0.35)]"
          >
            <div className="flex flex-shrink-0 items-center justify-between gap-4 border-b border-border px-6 py-4">
              <div className="flex items-center gap-3">
                <motion.span
                  initial={{ scale: 0.4, rotate: -25, opacity: 0 }}
                  animate={{ scale: 1, rotate: 0, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20, delay: 0.05 }}
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-mint text-[#4D7A9E]"
                >
                  <ArrowDownToLine size={17} />
                </motion.span>
                <div>
                  <motion.h2
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    className="text-lg font-extrabold text-ink"
                  >
                    Settlement Details
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
              <div className="flex items-center gap-2">
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 22, delay: 0.16 }}
                  className="flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wide text-emerald-700"
                >
                  <CheckCircle2 size={12} />
                  {details.status}
                </motion.span>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-ink-faint transition-colors duration-150 hover:bg-page hover:text-ink"
                  aria-label="Close"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-5 scrollbar-thin">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.1 }}
                className="rounded-xl border border-emerald/25 bg-mint-soft px-5 py-4 text-center"
              >
                <div className="text-[11px] font-bold uppercase tracking-wide text-emerald-deep">
                  Transfer Amount
                </div>
                <div className="mt-1 text-2xl font-extrabold text-emerald-deep">
                  {numberFmt.format(details.transferAmount)}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.16 }}
                className="mt-4 flex items-center gap-3 rounded-xl border border-border bg-page/50 px-4 py-3"
              >
                <div className="min-w-0 flex-1">
                  <div className="text-[10px] font-bold uppercase tracking-wide text-ink-faint">Debtor</div>
                  <div className="mt-0.5 flex items-center gap-1.5 truncate text-sm font-extrabold text-ink">
                    <Landmark size={13} className="flex-shrink-0 text-ink-faint" />
                    {details.debtorAccount}
                  </div>
                </div>
                <motion.span
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                  className="flex-shrink-0 text-ink-faint"
                >
                  <ArrowRight size={16} />
                </motion.span>
                <div className="flex-1 text-right text-xs font-semibold text-ink-faint">
                  Settle the Customer Account
                </div>
              </motion.div>

              <motion.h3
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.22 }}
                className="mb-2 mt-5 text-xs font-extrabold uppercase tracking-wide text-ink-faint"
              >
                Creditors
              </motion.h3>
              <div className="flex flex-col gap-2">
                {details.creditors.map((c, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.26 + i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                    className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3"
                  >
                    <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
                      <CreditCard size={14} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-extrabold text-ink">{c.account}</div>
                      <div className="mt-0.5 flex items-center gap-1.5">
                        <span className="rounded-full bg-mint px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-deep">
                          {c.component}
                        </span>
                        <span className="truncate text-[11px] text-ink-faint">{c.narration}</span>
                      </div>
                    </div>
                    <div className="flex-shrink-0 text-sm font-extrabold text-ink">{numberFmt.format(c.amount)}</div>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.4 }}
                className="mt-5 grid grid-cols-2 gap-3 rounded-xl border border-border bg-page/50 p-4 sm:grid-cols-4"
              >
                <MetaField icon={<CalendarCheck size={12} />} label="Settled Date" value={details.settledDate} />
                <MetaField icon={<CreditCard size={12} />} label="Payment Mode" value={details.paymentMode} />
                <MetaField
                  icon={<Hash size={12} />}
                  label="Transaction Ref"
                  value={details.transactionRef}
                  className="col-span-2 sm:col-span-2"
                />
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

function MetaField({
  icon,
  label,
  value,
  className = "",
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-ink-faint">
        {icon}
        {label}
      </div>
      <div className="mt-1 truncate text-sm font-extrabold text-ink">{value}</div>
    </div>
  );
}
