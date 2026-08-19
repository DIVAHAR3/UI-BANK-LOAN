import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

interface DateValue {
  day: number;
  month: number; // 0-11
  year: number;
}

function parse(ddmmyyyy: string): DateValue | null {
  const [d, m, y] = ddmmyyyy.split("-").map(Number);
  if (!d || !m || !y) return null;
  return { day: d, month: m - 1, year: y };
}

function format(value: DateValue) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(value.day)}-${pad(value.month + 1)}-${value.year}`;
}

function buildGrid(year: number, month: number) {
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const cells: { day: number; inMonth: boolean }[] = [];
  for (let i = firstWeekday - 1; i >= 0; i--) {
    cells.push({ day: daysInPrevMonth - i, inMonth: false });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, inMonth: true });
  }
  while (cells.length < 42) {
    cells.push({ day: cells.length - (firstWeekday + daysInMonth) + 1, inMonth: false });
  }
  return cells;
}

export function DateField({
  label,
  value,
  onChange,
  hideLabel,
  compact,
}: {
  label: string;
  value: string;
  onChange?: (value: string) => void;
  hideLabel?: boolean;
  compact?: boolean;
}) {
  const parsed = parse(value) ?? { day: 1, month: 0, year: 2026 };
  const [selected, setSelected] = useState<DateValue>(parsed);
  const [viewYear, setViewYear] = useState(parsed.year);
  const [viewMonth, setViewMonth] = useState(parsed.month);
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<"days" | "months" | "years">("days");
  const [yearRangeStart, setYearRangeStart] = useState(() => Math.floor(parsed.year / 12) * 12);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const rootRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  const positionPopover = () => {
    const el = rootRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setCoords({ top: rect.bottom + window.scrollY + 8, left: rect.left + window.scrollX });
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

  const goMonth = (delta: number) => {
    let m = viewMonth + delta;
    let y = viewYear;
    if (m < 0) {
      m = 11;
      y -= 1;
    } else if (m > 11) {
      m = 0;
      y += 1;
    }
    setViewMonth(m);
    setViewYear(y);
  };

  const grid = buildGrid(viewYear, viewMonth);

  return (
    <div ref={rootRef} className="relative">
      {!hideLabel && <label className="text-xs font-bold text-ink">{label}</label>}
      <div
        className={`flex max-w-full items-center gap-2 rounded-full border bg-card transition-colors duration-150 ${
          hideLabel ? "" : "mt-1"
        } ${compact ? "px-3 py-1.5" : "px-4 py-2"} ${
          open ? "border-emerald-strong ring-1 ring-emerald-strong" : "border-border"
        }`}
      >
        <input
          type="text"
          value={format(selected)}
          readOnly
          className={`w-full min-w-0 cursor-default bg-transparent font-semibold text-ink-soft outline-none ${
            compact ? "text-xs" : "text-sm"
          }`}
        />
        <button
          type="button"
          onClick={() => {
            setViewYear(selected.year);
            setViewMonth(selected.month);
            setView("days");
            setOpen((v) => !v);
          }}
          className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md bg-mint text-emerald-strong transition-colors duration-150 hover:bg-emerald-strong hover:text-white"
          aria-label={`Choose ${label}`}
        >
          <CalendarDays size={13} />
        </button>
      </div>

      {createPortal(
        <AnimatePresence>
          {open && (
            <motion.div
              ref={popoverRef}
              initial={{ opacity: 0, scale: 0.95, y: -6 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -6 }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
              style={{ position: "absolute", top: coords.top, left: coords.left }}
              className="z-[70] w-64 origin-top-left overflow-hidden rounded-2xl border border-border bg-card p-3 shadow-[0_20px_40px_-14px_rgba(15,28,23,0.25)]"
            >
              <div className="mb-2 flex items-center justify-between">
                {view === "days" ? (
                  <button
                    type="button"
                    onClick={() => setView("months")}
                    className="rounded-md px-1.5 py-0.5 text-sm font-extrabold text-ink transition-colors duration-150 hover:bg-mint-soft hover:text-emerald-deep"
                  >
                    {MONTH_NAMES[viewMonth]} {viewYear}
                  </button>
                ) : (
                  <span className="px-1.5 text-sm font-extrabold text-ink">
                    {view === "months" ? viewYear : `${yearRangeStart} – ${yearRangeStart + 11}`}
                  </span>
                )}
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      if (view === "days") goMonth(-1);
                      else if (view === "months") setViewYear((y) => y - 1);
                      else setYearRangeStart((y) => y - 12);
                    }}
                    className="flex h-6 w-6 items-center justify-center rounded-md text-ink-faint transition-colors duration-150 hover:bg-mint hover:text-emerald-strong"
                  >
                    <ChevronLeft size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (view === "days") goMonth(1);
                      else if (view === "months") setViewYear((y) => y + 1);
                      else setYearRangeStart((y) => y + 12);
                    }}
                    className="flex h-6 w-6 items-center justify-center rounded-md text-ink-faint transition-colors duration-150 hover:bg-mint hover:text-emerald-strong"
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>

              {view === "days" && (
                <div className="grid grid-cols-7 gap-y-1 text-center">
                  {WEEKDAYS.map((wd) => (
                    <span key={wd} className="text-[10px] font-bold uppercase tracking-wide text-ink-faint">
                      {wd}
                    </span>
                  ))}
                  {grid.map((cell, i) => {
                    const isSelected =
                      cell.inMonth &&
                      cell.day === selected.day &&
                      viewMonth === selected.month &&
                      viewYear === selected.year;
                    return (
                      <button
                        key={i}
                        type="button"
                        disabled={!cell.inMonth}
                        onClick={() => {
                          const next = { day: cell.day, month: viewMonth, year: viewYear };
                          setSelected(next);
                          onChange?.(format(next));
                          setOpen(false);
                        }}
                        className={`mx-auto flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold transition-colors duration-150 ${
                          isSelected
                            ? "bg-emerald-strong text-white"
                            : cell.inMonth
                            ? "text-ink hover:bg-mint-soft"
                            : "text-ink-faint/40"
                        }`}
                      >
                        {cell.day}
                      </button>
                    );
                  })}
                </div>
              )}

              {view === "months" && (
                <div className="grid grid-cols-3 gap-1.5">
                  {MONTH_NAMES.map((name, i) => (
                    <button
                      key={name}
                      type="button"
                      onClick={() => {
                        setViewMonth(i);
                        setView("days");
                      }}
                      className={`rounded-lg py-2 text-xs font-semibold transition-colors duration-150 ${
                        i === viewMonth
                          ? "bg-emerald-strong text-white"
                          : "text-ink hover:bg-mint-soft"
                      }`}
                    >
                      {name.slice(0, 3)}
                    </button>
                  ))}
                </div>
              )}

              {view === "years" && (
                <div className="grid grid-cols-3 gap-1.5">
                  {Array.from({ length: 12 }, (_, i) => yearRangeStart + i).map((y) => (
                    <button
                      key={y}
                      type="button"
                      onClick={() => {
                        setViewYear(y);
                        setView("months");
                      }}
                      className={`rounded-lg py-2 text-xs font-semibold transition-colors duration-150 ${
                        y === viewYear ? "bg-emerald-strong text-white" : "text-ink hover:bg-mint-soft"
                      }`}
                    >
                      {y}
                    </button>
                  ))}
                </div>
              )}

              {view === "months" && (
                <button
                  type="button"
                  onClick={() => setView("years")}
                  className="mt-2 w-full rounded-md py-1 text-center text-[11px] font-bold text-emerald-strong transition-colors duration-150 hover:bg-mint-soft hover:text-emerald-deep"
                >
                  Choose year
                </button>
              )}

              <div className="mt-2 flex items-center justify-between border-t border-border pt-2">
                <button
                  type="button"
                  onClick={() => {
                    const today = new Date();
                    const next = { day: today.getDate(), month: today.getMonth(), year: today.getFullYear() };
                    setSelected(next);
                    onChange?.(format(next));
                    setViewYear(today.getFullYear());
                    setViewMonth(today.getMonth());
                    setOpen(false);
                  }}
                  className="text-xs font-bold text-emerald-strong hover:text-emerald-deep"
                >
                  Today
                </button>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="text-xs font-semibold text-ink-faint hover:text-ink"
                >
                  Close
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}
