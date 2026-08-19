import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, Filter, CalendarDays, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { Card } from "./Card";
import { DateField } from "./DatePicker";
import { SettlementDetailsModal, type SettlementDetails } from "./SettlementDetailsModal";
import { AccrualBreakdownModal, type AccrualBreakdown } from "./AccrualBreakdownModal";
import {
  scheduleCategories,
  INTEREST_ANNUAL_RATE_PERCENT,
  type ScheduleCategory,
  type ScheduleRow,
} from "../data/schedules";
import { formatEuro } from "../lib/format";

function daysBetween(fromIso: string, toIso: string) {
  const from = new Date(fromIso);
  const to = new Date(toIso);
  return Math.round((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24));
}

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100] as const;

const STATUS_OPTIONS = ["All statuses", "Paid", "Upcoming"] as const;
type StatusFilter = (typeof STATUS_OPTIONS)[number];

function ddmmyyyyToIso(value: string) {
  const match = value.match(/^(\d{2})-(\d{2})-(\d{4})$/);
  if (!match) return null;
  const [, dd, mm, yyyy] = match;
  return `${yyyy}-${mm}-${dd}`;
}

const numberFmt = new Intl.NumberFormat("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 2 });

function fmt(n: number) {
  return numberFmt.format(n);
}

function fmtOrDash(n: number | null | undefined) {
  return n === null || n === undefined ? "—" : numberFmt.format(n);
}

function buildSettlementDetails(category: ScheduleCategory, row: ScheduleRow): SettlementDetails {
  const interestRow = scheduleCategories.find((c) => c.code === "INTEREST")?.rows[row.no - 1];
  const transferAmount = interestRow?.installment ?? row.amount;

  return {
    installmentNo: row.no,
    status: "PROCESSED",
    transferAmount,
    debtorAccount: "200CAS00234114",
    creditors: [
      {
        account: "00000000100001",
        component: category.code,
        narration: `${category.description} settlement`,
        amount: row.amount,
      },
      {
        account: "200CAS00234114",
        component: category.code,
        narration: "Settle the Customer Account",
        amount: row.amount,
      },
    ],
    settledDate: row.dueDate,
    paymentMode: "MANUAL",
    transactionRef: `CL00200126-RPAY-${row.no}`,
  };
}

function buildAccrualBreakdown(interestRows: ScheduleRow[], row: ScheduleRow): AccrualBreakdown {
  const prevDueDate = row.no > 1 ? interestRows[row.no - 2].dueDate : "2026-04-10";
  const days = daysBetween(prevDueDate, row.dueDate);
  const accrued = row.interestSched ?? 0;
  return {
    installmentNo: row.no,
    rows: [
      {
        from: prevDueDate,
        to: row.dueDate,
        principal: row.opening,
        rate: INTEREST_ANNUAL_RATE_PERCENT,
        days,
        accrued,
      },
    ],
    totalDays: days,
    totalAccrued: accrued,
  };
}

function Th({ children, align = "left" }: { children: React.ReactNode; align?: "left" | "right" | "center" }) {
  const alignClass = align === "right" ? "text-right" : align === "center" ? "text-center" : "text-left";
  return (
    <th
      className={`whitespace-nowrap border-b border-border px-4 py-2.5 text-[11px] font-bold uppercase tracking-wide text-ink-faint ${alignClass}`}
    >
      {children}
    </th>
  );
}

export function SchedulesPanel() {
  const [activeCode, setActiveCode] = useState(scheduleCategories[0].code);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All statuses");
  const [statusOpen, setStatusOpen] = useState(false);
  const [goToDate, setGoToDate] = useState("");
  const [highlightedRow, setHighlightedRow] = useState<number | null>(null);
  const [settlement, setSettlement] = useState<SettlementDetails | null>(null);
  const [accrualBreakdown, setAccrualBreakdown] = useState<AccrualBreakdown | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(25);
  const [customRows, setCustomRows] = useState("");
  const [pendingScroll, setPendingScroll] = useState<number | null>(null);
  const rowRefs = useRef<Record<number, HTMLTableRowElement | null>>({});

  const active = scheduleCategories.find((c) => c.code === activeCode) ?? scheduleCategories[0];

  const filteredRows = useMemo(() => {
    if (statusFilter === "All statuses") return active.rows;
    return active.rows.filter((r) => r.status === statusFilter);
  }, [active, statusFilter]);

  const filteredTotal = useMemo(() => filteredRows.reduce((sum, r) => sum + r.amount, 0), [filteredRows]);
  const filteredDue = useMemo(() => filteredRows.reduce((sum, r) => sum + r.dueAmount, 0), [filteredRows]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize));
  const pagedRows = useMemo(
    () => filteredRows.slice((currentPage - 1) * pageSize, currentPage * pageSize),
    [filteredRows, currentPage, pageSize]
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [activeCode, statusFilter, pageSize]);

  useEffect(() => {
    if (pendingScroll == null) return;
    const el = rowRefs.current[pendingScroll];
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      setHighlightedRow(pendingScroll);
      window.setTimeout(() => setHighlightedRow((cur) => (cur === pendingScroll ? null : cur)), 1400);
    }
    setPendingScroll(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, pendingScroll]);

  const handleGoToDate = (value: string) => {
    setGoToDate(value);
    const iso = ddmmyyyyToIso(value);
    if (!iso) return;
    const idx = filteredRows.findIndex((r) => r.dueDate >= iso);
    const matchIdx = idx === -1 ? filteredRows.length - 1 : idx;
    if (matchIdx < 0) return;
    const match = filteredRows[matchIdx];
    const page = Math.floor(matchIdx / pageSize) + 1;
    if (page !== currentPage) {
      setCurrentPage(page);
      setPendingScroll(match.no);
    } else {
      const el = rowRefs.current[match.no];
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        setHighlightedRow(match.no);
        window.setTimeout(() => setHighlightedRow((cur) => (cur === match.no ? null : cur)), 1400);
      }
    }
  };

  return (
    <Card delay={0} hover={false} className="overflow-hidden">
      <div className="flex flex-wrap items-center gap-1 border-b border-border bg-page/60 p-2">
        {scheduleCategories.map((cat) => {
          const isActive = cat.code === active.code;
          return (
            <button
              key={cat.code}
              type="button"
              onClick={() => setActiveCode(cat.code)}
              className={`relative flex items-center gap-2 rounded-xl px-3.5 py-2 text-left transition-colors duration-150 ${
                isActive ? "" : "hover:bg-card/60"
              }`}
            >
              {isActive && (
                <motion.span
                  layoutId="schedule-tab-active-bg"
                  transition={{ type: "spring", stiffness: 500, damping: 38 }}
                  className="absolute inset-0 rounded-xl bg-card shadow-[0_4px_12px_-4px_rgba(15,28,23,0.18)] ring-1 ring-border"
                />
              )}
              <motion.span
                animate={isActive ? { scale: [1, 1.4, 1] } : { scale: 1 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className={`relative z-10 h-2 w-2 flex-shrink-0 rounded-full ${cat.dot}`}
              />
              <span className="relative z-10 flex flex-col leading-tight">
                <span className={`text-xs font-extrabold tracking-wide ${isActive ? "text-ink" : "text-ink-faint"}`}>
                  {cat.code}
                </span>
                <span className="text-[10px] text-ink-faint">{cat.description}</span>
              </span>
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={active.code}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex flex-wrap items-center gap-3 border-b border-border px-5 py-3">
            <div className="flex items-center gap-2.5">
              <span className={`h-2.5 w-2.5 flex-shrink-0 rounded-full ${active.dot}`} />
              <h3 className="text-sm font-extrabold tracking-wide text-ink">{active.code}</h3>
              <span className="rounded-full border border-border bg-page px-2.5 py-0.5 text-[11px] font-semibold text-ink-faint">
                {active.description} · {active.badgeCode ?? active.code}
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-ink-faint">
              <Filter size={13} />
              <span className="text-xs font-semibold">Status</span>
            </div>
            <div className="relative">
              <button
                type="button"
                onClick={() => setStatusOpen((v) => !v)}
                className={`flex items-center gap-2 rounded-full border bg-card px-3 py-1.5 text-xs font-semibold text-ink-soft transition-colors duration-150 ${
                  statusOpen ? "border-emerald-strong ring-1 ring-emerald-strong" : "border-border"
                }`}
              >
                {statusFilter}
                <motion.span animate={{ rotate: statusOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                  <ChevronDown size={13} className="text-ink-faint" />
                </motion.span>
              </button>
              <AnimatePresence>
                {statusOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setStatusOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, scale: 0.97, y: -6 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.97, y: -6 }}
                      transition={{ duration: 0.15 }}
                      className="absolute left-0 top-full z-50 mt-1.5 w-36 origin-top overflow-hidden rounded-xl border border-border bg-card shadow-[0_16px_32px_-12px_rgba(15,28,23,0.25)]"
                    >
                      {STATUS_OPTIONS.map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => {
                            setStatusFilter(option);
                            setStatusOpen(false);
                          }}
                          className={`flex w-full items-center px-3.5 py-2 text-left text-xs font-semibold transition-colors duration-150 ${
                            option === statusFilter
                              ? "bg-emerald-strong text-white"
                              : "text-ink-soft hover:bg-mint-soft hover:text-emerald-deep"
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            <div className="flex items-center gap-1.5 text-ink-faint">
              <CalendarDays size={13} />
              <span className="text-xs font-semibold">Go to date</span>
            </div>
            <div className="w-32">
              <DateField label="Go to date" value={goToDate || "10-05-2026"} onChange={handleGoToDate} hideLabel compact />
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-ink-faint">Rows</span>
              <div className="inline-flex items-center gap-0.5 rounded-full border border-border bg-page p-0.5">
                {PAGE_SIZE_OPTIONS.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => {
                      setPageSize(size);
                      setCustomRows("");
                    }}
                    className={`rounded-full px-2.5 py-1 text-[11px] font-bold transition-colors duration-150 ${
                      pageSize === size && !customRows
                        ? "bg-emerald-strong text-white"
                        : "text-ink-faint hover:text-ink"
                    }`}
                  >
                    {size}
                  </button>
                ))}
                <input
                  type="text"
                  inputMode="numeric"
                  value={customRows}
                  onChange={(e) => setCustomRows(e.target.value.replace(/\D/g, "").slice(0, 4))}
                  onKeyDown={(e) => {
                    if (e.key !== "Enter") return;
                    const n = Number(customRows);
                    if (n > 0) setPageSize(n);
                  }}
                  onBlur={() => {
                    const n = Number(customRows);
                    if (n > 0) setPageSize(n);
                    else setCustomRows("");
                  }}
                  placeholder="Custom"
                  aria-label="Custom rows per page"
                  className={`w-14 rounded-full px-2 py-1 text-center text-[11px] font-bold outline-none transition-colors duration-150 placeholder:font-normal placeholder:text-ink-faint ${
                    customRows ? "bg-emerald-strong text-white placeholder:text-white/70" : "bg-transparent text-ink-faint"
                  }`}
                />
              </div>
            </div>

            <span className="ml-auto text-xs text-ink-faint">
              Total <span className="font-extrabold text-ink">{formatEuro(filteredTotal, 2)}</span>
              {" · "}
              Due <span className="font-extrabold text-rose-600">{formatEuro(filteredDue, 2)}</span>
            </span>
          </div>

          <div className="max-h-[520px] overflow-y-auto scrollbar-thin">
            <table className="w-full min-w-[720px] border-separate border-spacing-0 text-left">
              <thead>
                <tr className="sticky top-0 z-10 bg-card">
                  <Th>#</Th>
                  <Th>Due Date</Th>
                  {active.kind === "overdue" ? (
                    <Th align="right">Base - Overdue Principal</Th>
                  ) : (
                    <Th align="right">Opening</Th>
                  )}
                  {active.kind === "extended" ? (
                    <>
                      <Th align="right">Principal</Th>
                      <Th align="right">Interest (Sched.)</Th>
                      <Th align="right">Accrued</Th>
                      <Th align="right">Installment</Th>
                      <Th align="right">{active.taxColumnLabel}</Th>
                    </>
                  ) : (
                    <>
                      <Th align="right">{active.amountColumnLabel}</Th>
                      {active.taxColumnLabel && <Th align="right">{active.taxColumnLabel}</Th>}
                    </>
                  )}
                  <Th align="right">Due Amount</Th>
                  <Th align="center">Status</Th>
                  {active.kind !== "overdue" && <Th align="right">Closing</Th>}
                </tr>
              </thead>
              <tbody>
                {pagedRows.map((row) => (
                  <tr
                    key={row.no}
                    ref={(el) => {
                      rowRefs.current[row.no] = el;
                    }}
                    className={`transition-colors duration-300 hover:bg-mint-soft ${
                      highlightedRow === row.no ? "bg-mint" : ""
                    }`}
                  >
                    <td className="border-b border-border px-4 py-2.5 text-sm font-semibold text-ink-faint">
                      {row.no}
                    </td>
                    <td className="border-b border-border px-4 py-2.5 text-sm font-bold text-ink">{row.dueDate}</td>
                    {active.kind === "overdue" ? (
                      <td className="border-b border-border px-4 py-2.5 text-right text-sm font-semibold text-ink-soft">
                        {fmtOrDash(row.base)}
                      </td>
                    ) : (
                      <td className="border-b border-border px-4 py-2.5 text-right text-sm font-semibold text-ink-soft">
                        {fmt(row.opening)}
                      </td>
                    )}
                    {active.kind === "extended" ? (
                      <>
                        <td className="border-b border-border px-4 py-2.5 text-right text-sm font-semibold text-ink-soft">
                          {fmt(row.principal ?? 0)}
                        </td>
                        <td className="border-b border-border px-4 py-2.5 text-right text-sm font-semibold text-ink-soft">
                          {fmt(row.interestSched ?? 0)}
                        </td>
                        <td className="border-b border-border px-4 py-2.5 text-right text-sm">
                          <div className="flex items-center justify-end gap-1.5">
                            <span
                              className={
                                row.accrued !== null && row.accrued !== undefined
                                  ? "font-bold text-violet-600"
                                  : "text-ink-faint"
                              }
                            >
                              {fmtOrDash(row.accrued)}
                            </span>
                            {row.accrued !== null && row.accrued !== undefined && (
                              <button
                                type="button"
                                onClick={() => setAccrualBreakdown(buildAccrualBreakdown(active.rows, row))}
                                className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-ink-faint transition-colors duration-150 hover:bg-page hover:text-violet-600"
                                aria-label={`View accrual breakdown for row ${row.no}`}
                              >
                                <Eye size={13} />
                              </button>
                            )}
                          </div>
                        </td>
                        <td className="border-b border-border px-4 py-2.5 text-right text-sm font-bold text-ink">
                          {fmt(row.installment ?? 0)}
                        </td>
                        <td className="border-b border-border px-4 py-2.5 text-right text-sm text-ink-faint">
                          {fmt(row.tax ?? 0)}
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="border-b border-border px-4 py-2.5 text-right text-sm font-semibold text-ink-soft">
                          {fmt(row.amount)}
                        </td>
                        {active.taxColumnLabel && (
                          <td className="border-b border-border px-4 py-2.5 text-right text-sm text-ink-faint">
                            {fmt(row.tax ?? 0)}
                          </td>
                        )}
                      </>
                    )}
                    <td
                      className={`border-b border-border px-4 py-2.5 text-right text-sm font-bold ${
                        row.dueAmount > 0 ? "text-rose-600" : "text-ink-faint"
                      }`}
                    >
                      {fmt(row.dueAmount)}
                    </td>
                    <td className="border-b border-border px-4 py-2.5">
                      <div className="flex items-center justify-center gap-1.5">
                        <span
                          className={`rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ${
                            row.status === "Paid"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {row.status === "Paid" ? "Paid" : "Upcoming"}
                        </span>
                        {row.status === "Paid" && (
                          <button
                            type="button"
                            onClick={() => setSettlement(buildSettlementDetails(active, row))}
                            className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-ink-faint transition-colors duration-150 hover:bg-page hover:text-emerald-strong"
                            aria-label={`View settlement details for row ${row.no}`}
                          >
                            <Eye size={13} />
                          </button>
                        )}
                      </div>
                    </td>
                    {active.kind !== "overdue" && (
                      <td className="border-b border-border px-4 py-2.5 text-right text-sm font-extrabold text-ink">
                        {fmt(row.closing)}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredRows.length === 0 && (
              <p className="py-8 text-center text-sm text-ink-faint">No rows match this filter.</p>
            )}
          </div>

          {filteredRows.length > 0 && (
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-5 py-3">
              <span className="text-xs text-ink-faint">
                Showing{" "}
                <span className="font-bold text-ink">
                  {(currentPage - 1) * pageSize + 1}–{Math.min(currentPage * pageSize, filteredRows.length)}
                </span>{" "}
                of <span className="font-bold text-ink">{filteredRows.length}</span>
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="flex h-7 w-7 items-center justify-center rounded-full text-ink-faint transition-colors duration-150 hover:bg-page hover:text-ink disabled:cursor-not-allowed disabled:opacity-30"
                  aria-label="Previous page"
                >
                  <ChevronLeft size={14} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => setCurrentPage(page)}
                    className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-colors duration-150 ${
                      page === currentPage
                        ? "bg-emerald-strong text-white"
                        : "text-ink-faint hover:bg-mint-soft hover:text-emerald-deep"
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="flex h-7 w-7 items-center justify-center rounded-full text-ink-faint transition-colors duration-150 hover:bg-page hover:text-ink disabled:cursor-not-allowed disabled:opacity-30"
                  aria-label="Next page"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <SettlementDetailsModal details={settlement} onClose={() => setSettlement(null)} />
      <AccrualBreakdownModal details={accrualBreakdown} onClose={() => setAccrualBreakdown(null)} />
    </Card>
  );
}
