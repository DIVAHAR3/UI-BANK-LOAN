import { motion } from "framer-motion";
import { RefreshCw, ArrowRight } from "lucide-react";

export function PageFooterBar() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-card px-5 py-4 shadow-[0_1px_2px_rgba(15,28,23,0.05)]"
    >
      <div className="flex items-center gap-2 text-sm text-ink-faint">
        <RefreshCw size={14} className="text-emerald-strong" />
        Last updated by <span className="font-semibold text-ink">M. Alves</span>
        <span className="text-ink-faint/60">&middot;</span>
        1:32 PM
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <motion.button
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.97 }}
          className="rounded-full border border-border px-5 py-2 text-sm font-semibold text-ink-soft transition-colors duration-150 hover:bg-page"
        >
          Cancel
        </motion.button>
        <motion.button
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.97 }}
          className="rounded-full border border-border px-5 py-2 text-sm font-semibold text-ink-soft transition-colors duration-150 hover:bg-page"
        >
          Save Changes
        </motion.button>
        <motion.button
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.97 }}
          className="flex items-center gap-2 rounded-full bg-emerald-strong px-5 py-2 text-sm font-bold text-white transition-colors duration-150 hover:bg-emerald-deep"
        >
          Submit for Authorization
          <ArrowRight size={15} />
        </motion.button>
      </div>
    </motion.div>
  );
}
