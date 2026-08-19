import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Plus, Home, CheckCircle2, Unlink } from "lucide-react";
import { Card, CardHeading } from "./Card";
import { LinkCollateralModal, type LinkedCollateralResult } from "./LinkCollateralModal";
import { contract } from "../data/contract";

const LOAN_AMOUNT = 120000;
const numberFmt = new Intl.NumberFormat("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 2 });

export function CollateralPanel() {
  const delay = 0;
  const [linkOpen, setLinkOpen] = useState(false);
  const [linked, setLinked] = useState<LinkedCollateralResult[]>([]);

  const securedValue = linked.reduce((sum, c) => sum + c.linkedValue, 0);
  const coverage = LOAN_AMOUNT > 0 ? Math.min(100, (securedValue / LOAN_AMOUNT) * 100) : 0;

  const handleUnlink = (index: number) => {
    setLinked((cur) => cur.filter((_, i) => i !== index));
  };

  const stats = [
    { label: "Secured value", value: `EUR ${numberFmt.format(securedValue)}` },
    { label: "Loan amount", value: `EUR ${numberFmt.format(LOAN_AMOUNT)}` },
    { label: "Coverage", value: `${coverage.toFixed(0)}%` },
    { label: "Utilized", value: "EUR 0" },
  ];

  return (
    <Card delay={delay} hover={false}>
      <div className="flex flex-wrap items-start justify-between gap-3 px-5 pb-1 pt-5">
        <div>
          <CardHeading icon={<ShieldCheck size={16} />} title="Collateral" delay={delay} className="" />
          <p className="mt-1 pl-[42px] text-xs text-ink-faint">Collateral linked to this contract</p>
        </div>
        <motion.button
          type="button"
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setLinkOpen(true)}
          className="flex flex-shrink-0 items-center gap-1.5 rounded-full bg-emerald-strong px-4 py-2 text-xs font-bold text-white transition-colors duration-150 hover:bg-emerald-deep"
        >
          <Plus size={14} />
          Link collateral
        </motion.button>
      </div>

      <LinkCollateralModal
        open={linkOpen}
        customerId={contract.customer}
        onClose={() => setLinkOpen(false)}
        onLinked={(result) => setLinked((cur) => [...cur, result])}
      />

      <div className="grid grid-cols-2 gap-3 px-5 pb-5 pt-4 sm:grid-cols-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: delay + 0.1 + i * 0.06 }}
            className="rounded-xl border border-border bg-page/50 px-4 py-3.5"
          >
            <div className="text-[11px] font-bold uppercase tracking-wide text-ink-faint">{stat.label}</div>
            <div className="mt-1 text-lg font-extrabold text-ink">{stat.value}</div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {linked.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-t border-border"
          >
            <div className="flex flex-col gap-2 px-5 py-4">
              <AnimatePresence initial={false}>
                {linked.map((c, i) => (
                  <motion.div
                    key={`${c.id}-${i}`}
                    layout
                    initial={{ opacity: 0, scale: 0.96, y: 8 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, x: -12, transition: { duration: 0.2 } }}
                    transition={{ type: "spring", stiffness: 380, damping: 26, delay: i * 0.06 }}
                    className="flex items-center gap-3 rounded-xl border border-emerald/25 bg-mint-soft px-4 py-3"
                  >
                    <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-strong text-white">
                      <Home size={16} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-extrabold text-ink">
                        {c.id} · {c.description}
                      </div>
                      <div className="mt-0.5 text-[11px] text-ink-faint">
                        Linked EUR {numberFmt.format(c.linkedValue)} · {c.percent.toFixed(2)}% of lendable
                      </div>
                    </div>
                    <CheckCircle2 size={16} className="flex-shrink-0 text-emerald-strong" />
                    <motion.button
                      type="button"
                      whileHover={{ y: -1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleUnlink(i)}
                      className="flex flex-shrink-0 items-center gap-1.5 rounded-full border border-rose-200 bg-white px-3 py-1.5 text-[11px] font-bold text-rose-600 transition-colors duration-150 hover:bg-rose-50"
                    >
                      <Unlink size={12} />
                      De-collateralize
                    </motion.button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
