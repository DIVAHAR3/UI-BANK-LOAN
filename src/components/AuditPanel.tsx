import { motion } from "framer-motion";
import { History, FileEdit, ShieldCheck, Copy, Landmark, CreditCard } from "lucide-react";
import { Card, CardHeading } from "./Card";
import { auditTrail, type AuditKind } from "../data/audit";

const KIND_STYLES: Record<AuditKind, { icon: typeof History; bg: string; text: string }> = {
  system: { icon: Landmark, bg: "bg-page", text: "text-ink-faint" },
  amendment: { icon: FileEdit, bg: "bg-blue-100", text: "text-blue-700" },
  collateral: { icon: ShieldCheck, bg: "bg-mint", text: "text-emerald-strong" },
  copy: { icon: Copy, bg: "bg-violet-100", text: "text-violet-700" },
  reversal: { icon: History, bg: "bg-rose-100", text: "text-rose-700" },
  payment: { icon: CreditCard, bg: "bg-amber-100", text: "text-amber-700" },
};

export function AuditPanel() {
  const delay = 0;

  return (
    <Card delay={delay} hover={false}>
      <div className="px-5 pb-1 pt-5">
        <CardHeading icon={<History size={16} />} title="Audit Trail" delay={delay} className="" />
        <p className="mt-1 pl-[42px] text-xs text-ink-faint">Actions performed on this contract</p>
      </div>

      <div className="relative px-5 pb-5 pt-4">
        <div className="absolute bottom-5 left-[31px] top-4 w-px bg-border" aria-hidden />
        <div className="flex flex-col gap-4">
          {auditTrail.map((entry, i) => {
            const style = KIND_STYLES[entry.kind];
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: delay + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="relative flex gap-3"
              >
                <span
                  className={`relative z-10 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ring-4 ring-card ${style.bg} ${style.text}`}
                >
                  <style.icon size={14} />
                </span>
                <div className="min-w-0 flex-1 pb-1 pt-0.5">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                    <span className="text-sm font-extrabold text-ink">{entry.action}</span>
                    <span className="text-[11px] font-semibold text-ink-faint">{entry.timestamp}</span>
                  </div>
                  <p className="mt-0.5 text-xs leading-relaxed text-ink-soft">{entry.description}</p>
                  <span className="mt-1 inline-block text-[11px] font-semibold text-ink-faint">
                    by {entry.actor}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
