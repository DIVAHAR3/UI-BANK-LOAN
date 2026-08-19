import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, FileEdit, Search, Plus, Info, ChevronDown, Trash2, CheckCircle2 } from "lucide-react";
import { SelectField } from "./SelectField";
import { DateField } from "./DatePicker";
import { loanComponents, type LoanComponent } from "../data/components";

const FREQUENCY_OPTIONS = ["—", "Monthly", "Bi-Monthly", "Quarterly", "Half-Yearly", "Yearly"] as const;
const TYPE_OPTIONS = ["—", "Rate", "Rate Code", "Amount", "Slab", "Tier"] as const;

interface ScheduleRowDraft {
  id: number;
  from: string;
  to: string;
  amount: string;
  percent: string;
  payAtEnd: boolean;
}

let nextRowId = 1;
function makeDefaultRow(): ScheduleRowDraft {
  return { id: nextRowId++, from: "22-07-2026", to: "22-06-2027", amount: "", percent: "", payAtEnd: false };
}

interface BandDraft {
  id: number;
  from: string;
  to: string;
  rate: string;
  amount: string;
}

let nextBandId = 1;
function makeDefaultBand(isFirst: boolean): BandDraft {
  return { id: nextBandId++, from: isFirst ? "0" : "", to: "", rate: "", amount: "" };
}

export function ComponentDetailsModal({
  component,
  onClose,
}: {
  component: LoanComponent | null;
  onClose: () => void;
}) {
  const [userDefinedSchedule, setUserDefinedSchedule] = useState(false);
  const [scheduleRows, setScheduleRows] = useState<ScheduleRowDraft[]>([]);
  const [configType, setConfigType] = useState<string>("Rate");
  const [bands, setBands] = useState<BandDraft[]>([]);
  const [stage, setStage] = useState<"form" | "applying" | "applied">("form");

  useEffect(() => {
    if (!component) return;
    setUserDefinedSchedule(component.userDefinedSchedule ?? false);
    setScheduleRows(component.userDefinedSchedule ? [makeDefaultRow(), makeDefaultRow()] : []);
    setConfigType("Rate");
    setBands([]);
    setStage("form");
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && stage !== "applying") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [component, onClose]);

  const handleApply = () => {
    setStage("applying");
    window.setTimeout(() => setStage("applied"), 2200);
  };

  const handleBackdropClick = () => {
    if (stage === "applying") return;
    onClose();
  };

  const addBand = () => setBands((cur) => [...cur, makeDefaultBand(cur.length === 0)]);
  const updateBand = (id: number, patch: Partial<BandDraft>) =>
    setBands((cur) => cur.map((b) => (b.id === id ? { ...b, ...patch } : b)));
  const removeBand = (id: number) => setBands((cur) => cur.filter((b) => b.id !== id));

  const handleToggleUserDefined = (next: boolean) => {
    setUserDefinedSchedule(next);
    if (next && scheduleRows.length === 0) {
      setScheduleRows([makeDefaultRow(), makeDefaultRow()]);
    }
  };

  const updateRow = (id: number, patch: Partial<ScheduleRowDraft>) => {
    setScheduleRows((rows) => rows.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  };

  const removeRow = (id: number) => {
    setScheduleRows((rows) => rows.filter((r) => r.id !== id));
  };

  const addRow = () => {
    setScheduleRows((rows) => [...rows, makeDefaultRow()]);
  };

  return (
    <AnimatePresence>
      {component && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-[60] flex items-start justify-center bg-ink/40 px-4 py-8 backdrop-blur-[2px]"
          onClick={handleBackdropClick}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 28 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ type: "spring", stiffness: 340, damping: 28, mass: 0.8 }}
            onClick={(e) => e.stopPropagation()}
            className="flex max-h-[88vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-border bg-teal-50 shadow-[0_30px_60px_-20px_rgba(15,28,23,0.35)]"
          >
            <div className="h-1 flex-shrink-0 bg-gradient-to-r from-emerald-strong via-teal-400 to-[#4D7A9E]" />
            <div className="flex flex-shrink-0 items-center justify-between gap-4 border-b border-border bg-card/70 px-6 py-4 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <motion.span
                  initial={{ scale: 0.4, rotate: -25, opacity: 0 }}
                  animate={{ scale: 1, rotate: 0, opacity: 1 }}
                  whileHover={{ scale: 1.1, rotate: 6 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20, delay: 0.05 }}
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-strong to-[#4D7A9E] text-white shadow-[0_6px_14px_-4px_rgba(11,122,84,0.45)]"
                >
                  <FileEdit size={17} />
                </motion.span>
                <motion.h2
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className="bg-gradient-to-r from-emerald-strong to-[#4D7A9E] bg-clip-text text-lg font-extrabold text-transparent [filter:drop-shadow(0_1px_1px_rgba(15,28,23,0.12))]"
                >
                  Component Details
                </motion.h2>
              </div>
              {stage !== "applying" && (
                <button
                  type="button"
                  onClick={onClose}
                  className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-ink-faint transition-colors duration-150 hover:bg-page hover:text-ink"
                  aria-label="Close"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            <AnimatePresence mode="wait">
            {stage === "form" && (
            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} className="flex min-h-0 flex-1 flex-col">
            <div className="flex-1 overflow-y-auto px-6 py-5 scrollbar-thin">
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <Panel icon={<FileEdit size={13} />} title="General Information" delay={0}>
                  <div className="grid grid-cols-2 gap-4">
                    <DisplayField index={0} label="Component ID" value={component.code} />
                    <DisplayField index={1} label="Component Name" value={toTitle(component.description)} />
                    <ReadonlySelect index={2} label="Component Type" value={component.code} />
                    <DisplayField index={3} label="Repay Order" value={String(component.repayOrder ?? 1)} />
                  </div>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.35 }}
                    className="mt-2 text-[11px] leading-relaxed text-ink-faint"
                  >
                    Liquidation order for REPAY — lower number is paid first
                  </motion.p>
                </Panel>

                <Panel icon={<Search size={13} />} title="Schedule & Validation" delay={0.06}>
                  <div className="flex flex-col divide-y divide-border">
                    <ToggleRow index={0} label="Force Debit" checked={component.forceDebit ?? true} />
                    <ToggleRow
                      index={1}
                      label="Negotiable"
                      caption="product controlled"
                      checked={component.negotiable ?? false}
                      disabled
                    />
                    <ToggleRow index={2} label="Schedules Required" checked={component.schedulesRequired ?? true} />
                    <ToggleRow
                      index={3}
                      label="User-defined schedule"
                      caption="booking"
                      checked={userDefinedSchedule}
                      onChange={handleToggleUserDefined}
                    />
                  </div>
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.4 }}
                    className="mt-3"
                  >
                    <SelectField
                      label="Schedule Frequency"
                      value={component.scheduleFrequency ?? "—"}
                      options={FREQUENCY_OPTIONS}
                    />
                  </motion.div>
                </Panel>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.12 }}
                className="mt-4 overflow-hidden rounded-2xl border border-border bg-card shadow-[0_2px_10px_-4px_rgba(15,28,23,0.08)]"
              >
                <div className="flex items-center justify-between gap-3 border-b border-border bg-page/40 px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-strong to-[#4D7A9E] text-white shadow-[0_4px_10px_-3px_rgba(11,122,84,0.4)]">
                      <Plus size={13} />
                    </span>
                    <h3 className="text-xs font-extrabold uppercase tracking-wide text-emerald-deep">
                      User-defined Schedule
                    </h3>
                  </div>
                  <span className="rounded-full border border-emerald/25 bg-mint px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-deep">
                    Booking only
                  </span>
                </div>
                {userDefinedSchedule ? (
                  <div className="px-4 py-4">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <h4 className="text-[11px] font-extrabold uppercase tracking-wide text-ink-faint">
                        Schedule Rows
                      </h4>
                      <motion.button
                        type="button"
                        whileHover={{ y: -1 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={addRow}
                        className="flex items-center gap-1.5 rounded-full border border-border bg-page/60 px-3 py-1.5 text-[11px] font-bold text-ink-soft transition-colors duration-150 hover:bg-page"
                      >
                        <Plus size={12} />
                        Add Row
                      </motion.button>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[640px] border-separate border-spacing-y-2 text-left">
                        <thead>
                          <tr>
                            {["From Date", "To Date", "Amount", "Percent", "Pay At End", ""].map((col) => (
                              <th
                                key={col}
                                className="px-2 pb-1 text-[10px] font-bold uppercase tracking-wide text-ink-faint"
                              >
                                {col}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          <AnimatePresence initial={false}>
                            {scheduleRows.map((row) => (
                              <motion.tr
                                key={row.id}
                                initial={{ opacity: 0, y: -6 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, x: -12 }}
                                transition={{ duration: 0.2 }}
                              >
                                <td className="px-2 py-1 align-top">
                                  <DateField label="From Date" value={row.from} hideLabel compact />
                                </td>
                                <td className="px-2 py-1 align-top">
                                  <DateField label="To Date" value={row.to} hideLabel compact />
                                </td>
                                <td className="px-2 py-1 align-top">
                                  <input
                                    type="text"
                                    value={row.amount}
                                    onChange={(e) => updateRow(row.id, { amount: e.target.value })}
                                    placeholder="—"
                                    className="w-full rounded-full border border-border bg-page/60 px-3 py-1.5 text-xs font-semibold text-ink-soft outline-none transition-colors duration-150 placeholder:font-normal placeholder:text-ink-faint focus:border-emerald-strong focus:ring-1 focus:ring-emerald-strong"
                                  />
                                </td>
                                <td className="px-2 py-1 align-top">
                                  <input
                                    type="text"
                                    value={row.percent}
                                    onChange={(e) => updateRow(row.id, { percent: e.target.value })}
                                    placeholder="—"
                                    className="w-full rounded-full border border-border bg-page/60 px-3 py-1.5 text-xs font-semibold text-ink-soft outline-none transition-colors duration-150 placeholder:font-normal placeholder:text-ink-faint focus:border-emerald-strong focus:ring-1 focus:ring-emerald-strong"
                                  />
                                </td>
                                <td className="px-2 py-1 text-center align-top">
                                  <input
                                    type="checkbox"
                                    checked={row.payAtEnd}
                                    onChange={(e) => updateRow(row.id, { payAtEnd: e.target.checked })}
                                    className="h-4 w-4 cursor-pointer rounded border-border text-emerald-strong focus:ring-emerald-strong"
                                  />
                                </td>
                                <td className="px-2 py-1 align-top">
                                  <button
                                    type="button"
                                    onClick={() => removeRow(row.id)}
                                    aria-label="Remove schedule row"
                                    className="flex h-8 w-8 items-center justify-center rounded-full border border-rose-200 bg-rose-50 text-rose-600 transition-colors duration-150 hover:bg-rose-100"
                                  >
                                    <Trash2 size={13} />
                                  </button>
                                </td>
                              </motion.tr>
                            ))}
                          </AnimatePresence>
                        </tbody>
                      </table>
                      {scheduleRows.length === 0 && (
                        <p className="py-6 text-center text-xs text-ink-faint">
                          No schedule rows yet — click &ldquo;Add Row&rdquo; to define one.
                        </p>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center px-4 py-8 text-center">
                    <p className="text-xs text-ink-faint">
                      Turn on &ldquo;User-defined schedule&rdquo; in Schedule &amp; Validation to define custom
                      rows.
                    </p>
                  </div>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.18 }}
                className="mt-4 rounded-2xl border border-border bg-card px-4 py-4 shadow-[0_2px_10px_-4px_rgba(15,28,23,0.08)]"
              >
                <div className="mb-3 flex items-center gap-2.5">
                  <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-strong to-[#4D7A9E] text-white shadow-[0_4px_10px_-3px_rgba(11,122,84,0.4)]">
                    <Info size={13} />
                  </span>
                  <h3 className="text-xs font-extrabold uppercase tracking-wide text-emerald-deep">Configuration</h3>
                </div>
                {component.parentCode ? (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div>
                      <SelectField label="Type" value={configType} options={TYPE_OPTIONS} onChange={setConfigType} />
                    </div>
                    <div>
                      <DisplayField
                        label="Rate (% of parent)"
                        value={component.meta?.value.replace("%", "") ?? "—"}
                      />
                      <p className="mt-1.5 text-[11px] text-ink-faint">
                        Tax is calculated on the parent component&rsquo;s amount
                      </p>
                    </div>
                    <div>
                      <ReadonlySelect
                        label="Parent Component"
                        value={`${component.parentCode} · ${
                          loanComponents.find((c) => c.code === component.parentCode)?.description ??
                          component.parentCode
                        }`}
                      />
                      <p className="mt-1.5 text-[11px] text-ink-faint">
                        Tax is levied on this component&rsquo;s amount each installment
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    <DisplayField label="Rate" value={component.meta?.label === "RATE" ? component.meta.value : "—"} />
                    <p className="mt-2 flex items-center gap-1.5 text-[11px] text-ink-faint">
                      <Info size={12} className="flex-shrink-0" />
                      Rate applies to Interest / Fee / Tax / Penalty only
                    </p>
                  </>
                )}
              </motion.div>

              {component.parentCode && (configType === "Slab" || configType === "Tier") && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: 0.22 }}
                  className="mt-4 overflow-hidden rounded-2xl border border-border bg-card shadow-[0_2px_10px_-4px_rgba(15,28,23,0.08)]"
                >
                  <div className="flex items-center justify-between gap-3 border-b border-border bg-page/40 px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-strong to-[#4D7A9E] text-white shadow-[0_4px_10px_-3px_rgba(11,122,84,0.4)]">
                        <Plus size={13} />
                      </span>
                      <h3 className="text-xs font-extrabold uppercase tracking-wide text-emerald-deep">
                        {configType} Bands
                      </h3>
                    </div>
                    <motion.button
                      type="button"
                      whileHover={{ y: -1 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={addBand}
                      className="flex items-center gap-1.5 text-sm font-bold text-blue-600 transition-colors duration-150 hover:text-blue-700"
                    >
                      <Plus size={14} />
                      Add band
                    </motion.button>
                  </div>

                  {bands.length === 0 ? (
                    <div className="flex items-center justify-center px-4 py-8 text-center">
                      <p className="text-xs text-ink-faint">
                        No bands yet — click &ldquo;Add band&rdquo; to define them.
                      </p>
                    </div>
                  ) : (
                    <div className="px-4 py-4">
                      <div className="mb-1.5 hidden grid-cols-[1fr_1fr_1fr_1fr_auto] gap-2 sm:grid">
                        {["From", "To", "Rate %", "Flat Amount", ""].map((col) => (
                          <span key={col} className="px-3 text-[10px] font-bold uppercase tracking-wide text-ink-faint">
                            {col}
                          </span>
                        ))}
                      </div>
                      <div className="flex flex-col gap-2">
                        <AnimatePresence initial={false}>
                          {bands.map((band) => (
                            <motion.div
                              key={band.id}
                              initial={{ opacity: 0, y: -6 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, x: -12 }}
                              transition={{ duration: 0.2 }}
                              className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_1fr_1fr_1fr_auto] sm:items-center"
                            >
                              <input
                                type="text"
                                value={band.from}
                                onChange={(e) => updateBand(band.id, { from: e.target.value })}
                                placeholder="0"
                                className="w-full rounded-full border border-border bg-page/60 px-3 py-1.5 text-xs font-semibold text-ink-soft outline-none transition-colors duration-150 placeholder:font-normal placeholder:text-ink-faint focus:border-emerald-strong focus:ring-1 focus:ring-emerald-strong"
                              />
                              <input
                                type="text"
                                value={band.to}
                                onChange={(e) => updateBand(band.id, { to: e.target.value })}
                                placeholder="∞ (open)"
                                className="w-full rounded-full border border-border bg-page/60 px-3 py-1.5 text-xs font-semibold text-ink-soft outline-none transition-colors duration-150 placeholder:font-normal placeholder:text-ink-faint focus:border-emerald-strong focus:ring-1 focus:ring-emerald-strong"
                              />
                              <input
                                type="text"
                                value={band.rate}
                                onChange={(e) => updateBand(band.id, { rate: e.target.value })}
                                placeholder="%"
                                className="w-full rounded-full border border-border bg-page/60 px-3 py-1.5 text-xs font-semibold text-ink-soft outline-none transition-colors duration-150 placeholder:font-normal placeholder:text-ink-faint focus:border-emerald-strong focus:ring-1 focus:ring-emerald-strong"
                              />
                              <input
                                type="text"
                                value={band.amount}
                                onChange={(e) => updateBand(band.id, { amount: e.target.value })}
                                placeholder="—"
                                className="w-full rounded-full border border-border bg-page/60 px-3 py-1.5 text-xs font-semibold text-ink-soft outline-none transition-colors duration-150 placeholder:font-normal placeholder:text-ink-faint focus:border-emerald-strong focus:ring-1 focus:ring-emerald-strong"
                              />
                              <button
                                type="button"
                                onClick={() => removeBand(band.id)}
                                aria-label="Remove band"
                                className="flex h-8 w-8 flex-shrink-0 items-center justify-center justify-self-start rounded-full border border-rose-200 bg-rose-50 text-rose-600 transition-colors duration-150 hover:bg-rose-100 sm:justify-self-center"
                              >
                                <Trash2 size={13} />
                              </button>
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between gap-3 border-t border-border bg-page/40 px-4 py-2.5">
                    <p className="text-[11px] text-ink-faint">
                      Rate or Amount per band (Amount wins). The matched band applies to the whole base amount.
                    </p>
                    <span className="flex-shrink-0 rounded-full bg-page px-2.5 py-1 text-[11px] font-bold text-ink-soft">
                      {bands.length} {bands.length === 1 ? "band" : "bands"}
                    </span>
                  </div>
                </motion.div>
              )}
            </div>

            <div className="flex flex-shrink-0 items-center justify-end gap-3 border-t border-border bg-card/70 px-6 py-4 backdrop-blur-sm">
              <motion.button
                type="button"
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.97 }}
                onClick={onClose}
                className="rounded-full border border-border bg-card px-5 py-2 text-sm font-semibold text-ink-soft shadow-[0_1px_2px_rgba(15,28,23,0.05)] transition-colors duration-150 hover:bg-page"
              >
                Cancel
              </motion.button>
              <motion.button
                type="button"
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleApply}
                className="rounded-full bg-blue-600 px-5 py-2 text-sm font-bold text-white shadow-[0_4px_10px_-3px_rgba(37,99,235,0.4)] transition-colors duration-150 hover:bg-blue-700"
              >
                Apply
              </motion.button>
            </div>
            </motion.div>
            )}

            {stage === "applying" && (
              <motion.div
                key="applying"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="flex flex-col items-center gap-5 px-6 py-16 text-center"
              >
                <div className="relative h-16 w-full max-w-[260px]">
                  <motion.div
                    initial={{ x: 0, opacity: 1 }}
                    animate={{ x: [0, 0, 190, 190], opacity: [1, 1, 1, 0] }}
                    transition={{ duration: 2.2, repeat: Infinity, times: [0, 0.06, 0.78, 1], ease: "easeInOut" }}
                    className="absolute left-0 top-1/2 -translate-y-1/2 text-4xl"
                  >
                    <span className="inline-block scale-x-[-1]">🏃📄</span>
                  </motion.div>
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 text-4xl">📋</div>
                </div>
                <div>
                  <div className="text-base font-extrabold text-ink">Applying changes…</div>
                  <div className="mt-1 text-sm text-ink-faint">
                    Delivering {configType.toLowerCase()} configuration to the component form
                  </div>
                </div>
              </motion.div>
            )}

            {stage === "applied" && (
              <motion.div
                key="applied"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="flex flex-col items-center gap-2 px-6 py-14 text-center"
              >
                <motion.span
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 18 }}
                  className="mb-1 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-strong text-white"
                >
                  <CheckCircle2 size={28} />
                </motion.span>
                <h2 className="text-lg font-extrabold text-ink">Applied</h2>
                <p className="text-sm text-ink-faint">
                  Component configuration updated for {component.code}.
                </p>
                <motion.button
                  type="button"
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={onClose}
                  className="mt-5 w-full max-w-[240px] rounded-full bg-emerald-strong px-5 py-2.5 text-sm font-bold text-white transition-colors duration-150 hover:bg-emerald-deep"
                >
                  OK
                </motion.button>
              </motion.div>
            )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function toTitle(s: string) {
  return s;
}

function Panel({
  icon,
  title,
  delay,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  delay: number;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.35, delay, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-2xl border border-border bg-card px-4 py-4 shadow-[0_2px_10px_-4px_rgba(15,28,23,0.08)] transition-shadow duration-200 hover:shadow-[0_12px_28px_-12px_rgba(15,28,23,0.18)]"
    >
      <div className="mb-3 flex items-center gap-2.5">
        <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-strong to-[#4D7A9E] text-white shadow-[0_4px_10px_-3px_rgba(11,122,84,0.4)]">
          {icon}
        </span>
        <h3 className="text-xs font-extrabold uppercase tracking-wide text-emerald-deep">{title}</h3>
      </div>
      {children}
    </motion.div>
  );
}

function DisplayField({ label, value, index = 0 }: { label: string; value: string; index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.16 + index * 0.05, ease: [0.16, 1, 0.3, 1] }}
      className="min-w-0"
    >
      <label className="text-xs font-bold text-ink">{label}</label>
      <div className="mt-1 flex items-center truncate rounded-full border border-border bg-page/60 px-4 py-2 text-sm font-normal text-ink-faint shadow-[inset_0_1px_2px_rgba(15,28,23,0.04)]">
        {value}
      </div>
    </motion.div>
  );
}

function ReadonlySelect({ label, value, index = 0 }: { label: string; value: string; index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.16 + index * 0.05, ease: [0.16, 1, 0.3, 1] }}
      className="min-w-0"
    >
      <label className="text-xs font-bold text-ink">{label}</label>
      <div className="mt-1 flex items-center justify-between gap-2 truncate rounded-full border border-border bg-page/60 px-4 py-2 text-sm font-normal text-ink-faint shadow-[inset_0_1px_2px_rgba(15,28,23,0.04)]">
        <span className="truncate">{value}</span>
        <ChevronDown size={15} className="flex-shrink-0 text-ink-faint" />
      </div>
    </motion.div>
  );
}

function ToggleRow({
  label,
  caption,
  checked,
  onChange,
  disabled,
  index = 0,
}: {
  label: string;
  caption?: string;
  checked: boolean;
  onChange?: (v: boolean) => void;
  disabled?: boolean;
  index?: number;
}) {
  const [state, setState] = useState(checked);

  useEffect(() => setState(checked), [checked]);

  const toggle = () => {
    if (disabled) return;
    const next = !state;
    setState(next);
    onChange?.(next);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: 0.2 + index * 0.05, ease: [0.16, 1, 0.3, 1] }}
      className="flex items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0"
    >
      <span className="text-sm font-semibold text-ink">
        {label}
        {caption && <span className="ml-1.5 text-[11px] font-normal text-ink-faint">· {caption}</span>}
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={state}
        onClick={toggle}
        disabled={disabled}
        className={`relative inline-flex h-5 w-9 flex-shrink-0 items-center rounded-full transition-colors duration-200 ${
          disabled ? "cursor-not-allowed opacity-50" : ""
        } ${state ? "bg-emerald-strong" : "bg-border"}`}
      >
        <motion.span
          animate={{ x: state ? 18 : 2 }}
          transition={{ type: "spring", stiffness: 500, damping: 35 }}
          className="absolute h-4 w-4 rounded-full bg-white shadow-sm"
        />
      </button>
    </motion.div>
  );
}
