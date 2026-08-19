import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FileEdit, X, CalendarDays, ChevronRight, ListChecks, LineChart, RefreshCw, Info } from "lucide-react";

export function FinancialAmendmentModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [effectiveDate, setEffectiveDate] = useState("");
  const [amendedPrincipal, setAmendedPrincipal] = useState("");
  const [amendedMaturity, setAmendedMaturity] = useState("");
  const [remarks, setRemarks] = useState("");
  const [scheduleSimOpen, setScheduleSimOpen] = useState(false);
  const [componentsOpen, setComponentsOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    setEffectiveDate("");
    setAmendedPrincipal("");
    setAmendedMaturity("");
    setRemarks("");
    setScheduleSimOpen(false);
    setComponentsOpen(false);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

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
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="flex max-h-[88vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-[0_30px_60px_-20px_rgba(15,28,23,0.35)]"
          >
            {/* Header */}
            <div className="flex flex-shrink-0 items-center justify-between gap-4 border-b border-border px-6 py-4">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-mint text-[#4D7A9E]">
                  <FileEdit size={17} />
                </span>
                <h2 className="text-lg font-extrabold text-ink">Financial Amendment</h2>
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

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto px-6 py-5 scrollbar-thin">
              <Section index={0} number={1} title="Check effective-date eligibility">
                <div className="flex flex-wrap items-end gap-3">
                  <PlaceholderDateInput
                    label="Effective Date"
                    value={effectiveDate}
                    onChange={setEffectiveDate}
                  />
                  <motion.button
                    type="button"
                    whileHover={{ y: -1 }}
                    whileTap={{ scale: 0.97 }}
                    className="rounded-full border border-border px-5 py-2.5 text-sm font-bold text-ink-soft transition-colors duration-150 hover:bg-page"
                  >
                    Check Eligibility
                  </motion.button>
                </div>
              </Section>

              <Section index={1} number={2} title="Principal and maturity amendments" last>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <DisplayField label="Current Principal" value="-" />
                  <TextInput
                    label="Amended Principal (optional)"
                    value={amendedPrincipal}
                    onChange={setAmendedPrincipal}
                    placeholder="Enter amount"
                  />
                  <PlaceholderDateInput label="Current Maturity Date" value="" readOnly />
                  <PlaceholderDateInput
                    label="Amended Maturity Date (optional)"
                    value={amendedMaturity}
                    onChange={setAmendedMaturity}
                  />
                </div>

                <div className="mt-4">
                  <DisplayField label="Settlement Account" value="200CAS00234114" />
                </div>

                <div className="mt-4">
                  <label className="text-xs font-bold text-ink">Remarks</label>
                  <textarea
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    rows={3}
                    placeholder="Add any notes for this amendment..."
                    className="mt-1 w-full resize-none rounded-xl border border-border bg-page/60 px-3 py-2.5 text-sm text-ink outline-none transition-colors duration-150 placeholder:text-ink-faint focus:border-emerald-strong focus:ring-1 focus:ring-emerald-strong"
                  />
                </div>

                <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                  <LinkRow
                    icon={ListChecks}
                    label="Components"
                    expanded={componentsOpen}
                    onClick={() => setComponentsOpen((v) => !v)}
                  />
                  <LinkRow
                    icon={LineChart}
                    label="Schedule Simulation"
                    expanded={scheduleSimOpen}
                    onClick={() => setScheduleSimOpen((v) => !v)}
                  />
                </div>

                <AnimatePresence initial={false}>
                  {componentsOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="mt-3 rounded-xl border border-border bg-page/60 p-4">
                        <h4 className="text-sm font-extrabold text-ink">
                          Effective-dated component amendments
                        </h4>
                        <p className="mt-1 text-xs leading-relaxed text-ink-faint">
                          Reuse booking components without changing or removing existing records.
                        </p>
                        <motion.button
                          type="button"
                          whileHover={{ y: -1 }}
                          whileTap={{ scale: 0.97 }}
                          className="mt-3 rounded-full border border-border bg-card px-4 py-2 text-xs font-bold text-ink-soft transition-colors duration-150 hover:bg-page"
                        >
                          Edit / Modify Components
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence initial={false}>
                  {scheduleSimOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="mt-3 rounded-xl border border-border bg-page/60 p-4">
                        <h4 className="text-sm font-extrabold text-ink">Revised schedule simulation</h4>
                        <p className="mt-1 text-xs leading-relaxed text-ink-faint">
                          Calculated from the amended principal, effective interest component, and
                          amended maturity date. This is a preview only; no contract schedules are
                          changed.
                        </p>
                        <motion.button
                          type="button"
                          whileHover={{ y: -1 }}
                          whileTap={{ scale: 0.97 }}
                          className="mt-3 flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-xs font-bold text-ink-soft transition-colors duration-150 hover:bg-page"
                        >
                          <RefreshCw size={13} />
                          Refresh Simulation
                        </motion.button>

                        <div className="mt-3 flex items-start gap-2 rounded-lg bg-amber-50 px-3 py-2.5 text-xs text-amber-800">
                          <Info size={14} className="mt-0.5 flex-shrink-0" />
                          <span>
                            Check the effective-date eligibility first, then configure the amendment
                            in the Components tab.
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Section>
            </div>

            {/* Footer */}
            <div className="flex flex-shrink-0 flex-wrap items-center justify-end gap-3 border-t border-border px-6 py-4">
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
                className="rounded-full border border-border px-5 py-2 text-sm font-bold text-ink-soft transition-colors duration-150 hover:bg-page"
              >
                Generate Revised Schedule
              </motion.button>
              <motion.button
                type="button"
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.97 }}
                className="rounded-full bg-emerald-strong px-5 py-2 text-sm font-bold text-white transition-colors duration-150 hover:bg-emerald-deep"
              >
                Save Amendment
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Section({
  index,
  number,
  title,
  children,
  last,
}: {
  index: number;
  number: number;
  title: string;
  children: React.ReactNode;
  last?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.1 + index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className={`${last ? "" : "mb-6 border-b border-border pb-6"}`}
    >
      <div className="mb-3 flex items-center gap-2.5">
        <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-emerald-strong text-xs font-bold text-white">
          {number}
        </span>
        <h3 className="text-sm font-extrabold text-ink">{title}</h3>
      </div>
      {children}
    </motion.div>
  );
}

function DisplayField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <label className="text-xs font-bold text-ink">{label}</label>
      <div className="mt-1 flex items-center rounded-full border border-border bg-page/60 px-4 py-2 text-sm font-semibold text-ink-soft">
        {value}
      </div>
    </div>
  );
}

function TextInput({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="text-xs font-bold text-ink">{label}</label>
      <div className="mt-1 flex items-center rounded-full border border-border bg-card px-4 py-2 transition-colors duration-150 focus-within:border-emerald-strong focus-within:ring-1 focus-within:ring-emerald-strong">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full min-w-0 bg-transparent text-sm font-semibold text-ink-soft outline-none placeholder:font-normal placeholder:text-ink-faint"
        />
      </div>
    </div>
  );
}

function PlaceholderDateInput({
  label,
  value,
  onChange,
  readOnly,
}: {
  label: string;
  value: string;
  onChange?: (v: string) => void;
  readOnly?: boolean;
}) {
  return (
    <div>
      <label className="text-xs font-bold text-ink">{label}</label>
      <div
        className={`mt-1 flex items-center gap-2 rounded-full border border-border px-4 py-2 transition-colors duration-150 ${
          readOnly ? "bg-page/60" : "bg-card focus-within:border-emerald-strong focus-within:ring-1 focus-within:ring-emerald-strong"
        }`}
      >
        <input
          type="text"
          value={value}
          readOnly={readOnly}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder="dd-mm-yyyy"
          className="w-full min-w-0 bg-transparent text-sm font-semibold text-ink-soft outline-none placeholder:font-normal placeholder:text-ink-faint"
        />
        <CalendarDays size={14} className="flex-shrink-0 text-ink-faint" />
      </div>
    </div>
  );
}

function LinkRow({
  icon: Icon,
  label,
  expanded,
  onClick,
}: {
  icon: typeof ListChecks;
  label: string;
  expanded?: boolean;
  onClick?: () => void;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.98 }}
      aria-expanded={expanded}
      className={`flex flex-1 items-center gap-2.5 rounded-xl border px-4 py-3 text-left transition-colors duration-150 ${
        expanded ? "border-emerald/30 bg-mint-soft" : "border-border bg-page/60 hover:bg-mint-soft"
      }`}
    >
      <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-mint text-emerald-strong">
        <Icon size={15} />
      </span>
      <span className="flex-1 text-sm font-bold text-ink">{label}</span>
      <motion.span animate={{ rotate: expanded ? 90 : 0 }} transition={{ duration: 0.2 }}>
        <ChevronRight size={15} className="text-ink-faint" />
      </motion.span>
    </motion.button>
  );
}
