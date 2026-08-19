import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

export function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: readonly string[];
  onChange?: (value: string) => void;
}) {
  const [selected, setSelected] = useState(value);
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState<{
    left: number;
    width: number;
    top?: number;
    bottom?: number;
    maxHeight: number;
  }>({ left: 0, width: 0, maxHeight: 280 });
  const rootRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  const positionPopover = () => {
    const el = rootRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const margin = 6;
    const spaceBelow = window.innerHeight - rect.bottom - margin;
    const spaceAbove = rect.top - margin;
    const openUp = spaceBelow < 160 && spaceAbove > spaceBelow;
    const maxHeight = Math.max(120, Math.min(280, openUp ? spaceAbove : spaceBelow));
    setCoords(
      openUp
        ? { left: rect.left, width: rect.width, bottom: window.innerHeight - rect.top + margin, maxHeight }
        : { left: rect.left, width: rect.width, top: rect.bottom + margin, maxHeight }
    );
  };

  useEffect(() => {
    if (!open) return;
    positionPopover();

    const onClick = (e: MouseEvent) => {
      if (
        rootRef.current &&
        !rootRef.current.contains(e.target as Node) &&
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    const onReposition = () => positionPopover();

    document.addEventListener("mousedown", onClick);
    window.addEventListener("scroll", onReposition, true);
    window.addEventListener("resize", onReposition);
    window.visualViewport?.addEventListener("resize", onReposition);
    window.visualViewport?.addEventListener("scroll", onReposition);
    return () => {
      document.removeEventListener("mousedown", onClick);
      window.removeEventListener("scroll", onReposition, true);
      window.removeEventListener("resize", onReposition);
      window.visualViewport?.removeEventListener("resize", onReposition);
      window.visualViewport?.removeEventListener("scroll", onReposition);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <label className="text-xs font-bold text-ink">{label}</label>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`mt-1 flex w-full items-center justify-between gap-2 rounded-full border bg-card px-4 py-2 text-sm font-semibold text-ink-soft transition-colors duration-150 ${
          open ? "border-emerald-strong ring-1 ring-emerald-strong" : "border-border"
        }`}
      >
        <span className="truncate">{selected}</span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0 text-ink-faint"
        >
          <ChevronDown size={15} />
        </motion.span>
      </button>

      {createPortal(
        <AnimatePresence>
          {open && (
            <motion.div
              ref={popoverRef}
              initial={{ opacity: 0, scale: 0.97, y: -6 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: -6 }}
              transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
              style={{
                position: "fixed",
                top: coords.top,
                bottom: coords.bottom,
                left: coords.left,
                width: coords.width,
                maxHeight: coords.maxHeight,
              }}
              className="z-[70] origin-top overflow-y-auto rounded-xl border border-border bg-card shadow-[0_20px_40px_-14px_rgba(15,28,23,0.25)]"
            >
              {options.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    setSelected(option);
                    onChange?.(option);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center px-4 py-2.5 text-left text-sm font-semibold transition-colors duration-150 ${
                    option === selected
                      ? "bg-emerald-strong text-white"
                      : "text-ink-soft hover:bg-mint-soft hover:text-emerald-deep"
                  }`}
                >
                  {option}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}
