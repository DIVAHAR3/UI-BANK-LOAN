import { loanComponents } from "./components";
import { rateHistory } from "./rates";
import { scheduleCategories } from "./schedules";
import { ledgerEvents } from "./entries";
import { dueTodayEvents } from "./dueToday";
import { auditTrail } from "./audit";

export const contract = {
  id: "CL00200173",
  version: "v1",
  status: "REPAID" as const,
  branch: "200",
  customer: "000000872",
  productCode: "CL001",
  productLabel: "Consumer Loan",
  productName: "Car Loan",
  currency: "EUR",
};

export const amortization = {
  percent: 88,
  principal: 240000,
  fees: 60000,
  emi: 70000,
  balance: 271920,
};

export const financialSummary = {
  interest: 10512.34,
  tax: 1227.79,
  netPrincipal: 240000,
  totalRepayable: 271920,
};

export const repaymentTimeline = {
  paid: 38,
  upcoming: 10,
  overdue: 14,
  maturesOn: "May 29",
  emiEach: 7165.7,
  repaymentPercent: 61,
};

export const generalDetails = {
  loanAmount: "240,000",
  disbursedAmount: "Disbursed Amount",
  tenor: "36",
  frequency: "Monthly",
  bookDate: "03-07-2026",
  valueDate: "01-05-2026",
  maturityDate: "01-05-2029",
  customerAccountNo: "00000087284",
  clearBackdatedDues: false,
};

export const bookingItems = {
  loanAmount: "240000",
  disbursedAmount: "Disbursed Amount",
  tenor: "36",
  frequency: "Monthly",
  bookDate: "03-07-2026",
  valueDate: "01-07-2026",
  maturityDate: "01-05-2026",
  customerAccountNo: "00000087284",
  clearBackdatedDues: false,
};

export const rateChange = {
  type: "Local",
  frequency: "Monthly",
};

export const processing = {
  liquidationMode: "Auto",
  disbursementMode: "Auto",
};

export const recomputation = {
  amendmentActionBasis: "Installment",
  prepaymentRecomputationBasis: "Installment",
};

export const quickInfo = {
  contractStatus: "REPAID",
  emiAmount: 7165.7,
  repaymentPercent: 61,
  currency: "EUR",
};

const componentCount = loanComponents.length;
const rateCount = rateHistory.length;
const scheduleCount = scheduleCategories[0]?.rows.length ?? 0;
const entriesCount = ledgerEvents.length;
const dueTodayCount = dueTodayEvents.length;
const auditCount = auditTrail.length;

export const tabs = [
  { label: "General", count: null },
  { label: "Component", count: componentCount },
  { label: "Rates", count: rateCount },
  { label: "Schedules", count: scheduleCount },
  { label: "Collateral", count: null },
  { label: "Co-Applicant", count: null },
  { label: "Entries", count: entriesCount },
  { label: "Due Today", count: dueTodayCount },
  { label: "Audit", count: auditCount },
];

export const sidebarNav = [
  { label: "Contract Overview", key: "overview", hasChevron: true },
  { label: "General", key: "general" },
  { label: "Component", key: "component", count: componentCount },
  { label: "Rates", key: "rates", count: rateCount },
  { label: "Schedules", key: "schedules", count: scheduleCount },
  { label: "Collateral", key: "collateral" },
  { label: "Co-Applicant", key: "co-applicant" },
  { label: "Entries", key: "entries", count: entriesCount },
  { label: "Due Today", key: "due-today", count: dueTodayCount },
  { label: "Audit", key: "audit" },
];
