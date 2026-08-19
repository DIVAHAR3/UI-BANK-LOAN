export interface ScheduleRow {
  no: number;
  dueDate: string;
  opening: number;
  amount: number;
  dueAmount: number;
  status: "Paid" | "Upcoming";
  closing: number;
  principal?: number;
  interestSched?: number;
  accrued?: number | null;
  installment?: number;
  tax?: number;
  base?: number | null;
}

export interface ScheduleCategory {
  code: string;
  label: string;
  description: string;
  badgeCode?: string;
  dot: string;
  amountColumnLabel: string;
  taxColumnLabel?: string;
  kind?: "simple" | "extended" | "overdue";
  rows: ScheduleRow[];
  total: number;
  due: number;
}

const PERIODS = 50;
const PAID_COUNT = 15;
const START = { year: 2026, month: 5, day: 10 };
const PRINCIPAL_TOTAL = 240000;
const ANNUAL_RATE = 0.035;
const MONTHLY_RATE = ANNUAL_RATE / 12;
const TAX_RATE = 0.04;

function round2(n: number) {
  return Math.round(n * 100) / 100;
}

function addMonths(n: number) {
  const d = new Date(START.year, START.month - 1 + n, START.day);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${dd}`;
}

interface BaseRow {
  dueDate: string;
  opening: number;
  principal: number;
  interest: number;
  closing: number;
}

function buildAmortization(): BaseRow[] {
  const emi = (PRINCIPAL_TOTAL * MONTHLY_RATE) / (1 - Math.pow(1 + MONTHLY_RATE, -PERIODS));
  let balance = PRINCIPAL_TOTAL;
  const base: BaseRow[] = [];
  for (let i = 1; i <= PERIODS; i++) {
    const interest = balance * MONTHLY_RATE;
    const principal = emi - interest;
    const opening = balance;
    const closing = balance - principal;
    base.push({ dueDate: addMonths(i - 1), opening, principal, interest, closing });
    balance = closing;
  }
  return base;
}

const amortizationBase = buildAmortization();

export const INTEREST_ANNUAL_RATE_PERCENT = ANNUAL_RATE * 100;

function buildSimpleCategory(
  code: string,
  label: string,
  description: string,
  dot: string,
  amountColumnLabel: string,
  amountFn: (b: BaseRow, idx: number) => number,
  taxColumnLabel?: string,
  badgeCode?: string
): ScheduleCategory {
  const rows: ScheduleRow[] = amortizationBase.map((b, idx) => {
    const status: ScheduleRow["status"] = idx < PAID_COUNT ? "Paid" : "Upcoming";
    const amount = round2(amountFn(b, idx));
    const tax = taxColumnLabel ? (status === "Paid" ? 0 : round2(amount * TAX_RATE)) : undefined;
    const dueAmount = status === "Paid" ? 0 : round2(amount + (tax ?? 0));
    return {
      no: idx + 1,
      dueDate: b.dueDate,
      opening: b.opening,
      amount,
      dueAmount,
      status,
      closing: b.closing,
      tax,
    };
  });
  const total = rows.reduce((sum, r) => sum + r.amount, 0);
  const due = rows.reduce((sum, r) => sum + r.dueAmount, 0);
  return { code, label, description, badgeCode, dot, amountColumnLabel, taxColumnLabel, kind: "simple", rows, total, due };
}

function buildInterestCategory(): ScheduleCategory {
  const rows: ScheduleRow[] = amortizationBase.map((b, idx) => {
    const status: ScheduleRow["status"] = idx < PAID_COUNT ? "Paid" : "Upcoming";
    const tax = status === "Paid" ? 0 : round2(b.interest * TAX_RATE);
    const installment = round2(b.principal + b.interest + tax);
    const dueAmount = status === "Paid" ? 0 : round2(b.interest + tax);
    const accrued = status === "Paid" ? round2(b.interest) : idx === PAID_COUNT ? round2(b.interest * 0.05) : null;

    return {
      no: idx + 1,
      dueDate: b.dueDate,
      opening: b.opening,
      amount: b.interest,
      dueAmount,
      status,
      closing: b.closing,
      principal: b.principal,
      interestSched: b.interest,
      accrued,
      installment,
      tax,
    };
  });
  const total = rows.reduce((sum, r) => sum + (r.interestSched ?? 0), 0);
  const due = rows.reduce((sum, r) => sum + r.dueAmount, 0);
  return {
    code: "INTEREST",
    label: "Interest",
    description: "Interest",
    dot: "bg-violet-500",
    amountColumnLabel: "Interest",
    taxColumnLabel: "Interest Tax",
    kind: "extended",
    rows,
    total,
    due,
  };
}

const OVERDUE_PENALTY_RATE = 0.006;
const overdueSpikes = new Set([7, 14, 21, 28, 35, 42, 49]);

function buildOverdueCategory(): ScheduleCategory {
  const rows: ScheduleRow[] = amortizationBase.map((b, idx) => {
    const status: ScheduleRow["status"] = idx < PAID_COUNT ? "Paid" : "Upcoming";
    const spike = overdueSpikes.has(idx + 1);
    const base = spike ? round2(b.principal) : null;
    const amount = spike ? round2(b.principal * OVERDUE_PENALTY_RATE) : 0;
    const tax = spike ? round2(amount * TAX_RATE) : 0;
    const dueAmount = status === "Paid" ? 0 : round2(amount + tax);
    return {
      no: idx + 1,
      dueDate: b.dueDate,
      opening: 0,
      amount,
      dueAmount,
      status,
      closing: 0,
      tax,
      base,
    };
  });
  const total = rows.reduce((sum, r) => sum + r.amount, 0);
  const due = rows.reduce((sum, r) => sum + r.dueAmount, 0);
  return {
    code: "OVERDUEPRIN",
    label: "Overdue Principal",
    description: "Overdue Principal",
    badgeCode: "OVERDUE_PENALTY",
    dot: "bg-slate-500",
    amountColumnLabel: "OVERDUEPRIN",
    taxColumnLabel: "OVDPRINTAX",
    kind: "overdue",
    rows,
    total,
    due,
  };
}

const FEE_FLAT = 5;
const FEE_PERIODS = 20;

export const scheduleCategories: ScheduleCategory[] = [
  buildSimpleCategory("PRINCIPAL", "Principal", "Principal", "bg-blue-500", "Principal", (b) => b.principal),
  buildInterestCategory(),
  buildSimpleCategory(
    "PROCESSINGFEE",
    "Processing Fee",
    "Processing Fee",
    "bg-teal-500",
    "PROCESSINGFEE",
    (_b, idx) => (idx < FEE_PERIODS ? FEE_FLAT : 0),
    "PROCFEETAX",
    "FEE"
  ),
  buildOverdueCategory(),
];
