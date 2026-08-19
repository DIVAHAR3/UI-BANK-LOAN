import { AnimatePresence, motion } from "framer-motion";
import { Download } from "lucide-react";

export function ExportButton({ expanded = true }: { expanded?: boolean }) {
  return (
    <motion.button
      initial="init"
      animate="rest"
      whileHover="hover"
      whileTap="tap"
      variants={{
        init: { opacity: 0, y: 8 },
        rest: { opacity: 1, y: 0, transition: { duration: 0.4, delay: 0.5 } },
        hover: { y: -2, transition: { duration: 0.2 } },
        tap: { scale: 0.97, transition: { duration: 0.12 } },
      }}
      title="Export Report"
      className="group flex w-full items-center justify-center gap-2 rounded-xl bg-mint px-4 py-3 text-sm font-semibold text-emerald-deep transition-colors duration-200 hover:bg-emerald-strong hover:text-white"
    >
      <motion.span
        className="flex flex-shrink-0 items-center"
        variants={{ rest: { y: 0, x: 0 }, hover: { y: 2, x: 1 } }}
        transition={{ duration: 0.18 }}
      >
        <Download size={16} />
      </motion.span>
      <AnimatePresence>
        {expanded && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="whitespace-nowrap"
          >
            Export Report
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
