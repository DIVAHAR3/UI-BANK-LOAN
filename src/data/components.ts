export interface LoanComponent {
  code: string;
  badge: string;
  badgeTone: "blue" | "green" | "amber" | "gray" | "rose";
  border: "blue" | "violet" | "teal" | "cyan" | "rose";
  description: string;
  meta?: { label: string; value: string };
  tags?: string[];
  repayOrder?: number;
  forceDebit?: boolean;
  negotiable?: boolean;
  schedulesRequired?: boolean;
  userDefinedSchedule?: boolean;
  scheduleFrequency?: string;
  parentCode?: string;
}

export const loanComponents: LoanComponent[] = [
  {
    code: "PRINCIPAL",
    badge: "PRINCIPAL",
    badgeTone: "blue",
    border: "blue",
    description: "Principal",
    repayOrder: 12,
    forceDebit: true,
    negotiable: false,
    schedulesRequired: true,
    userDefinedSchedule: false,
    scheduleFrequency: "—",
  },
  {
    code: "INTEREST",
    badge: "INTEREST",
    badgeTone: "green",
    border: "violet",
    description: "Interest",
    meta: { label: "METHOD", value: "AMORTIZED" },
  },
  {
    code: "PROCESSINGFEE",
    badge: "FEE",
    badgeTone: "amber",
    border: "teal",
    description: "Processing Fee",
    meta: { label: "AMOUNT", value: "5" },
  },
  {
    code: "UTILIZATIONFEE",
    badge: "FEE",
    badgeTone: "amber",
    border: "cyan",
    description: "Utilization Fee",
    meta: { label: "RATE", value: "0.5%" },
  },
  {
    code: "INTERESTTAX",
    badge: "TAX",
    badgeTone: "gray",
    border: "rose",
    description: "Tax for Interest",
    meta: { label: "RATE", value: "4%" },
    tags: ["of INTEREST", "rides parent"],
    parentCode: "INTEREST",
  },
  {
    code: "OVDPRINTAX",
    badge: "TAX",
    badgeTone: "gray",
    border: "rose",
    description: "Tax for Overdue Principal",
    meta: { label: "RATE", value: "4%" },
    tags: ["of OVERDUEPRIN", "rides parent"],
    parentCode: "OVERDUEPRIN",
  },
  {
    code: "PARTIALPAYTAX",
    badge: "TAX",
    badgeTone: "gray",
    border: "rose",
    description: "Tax for Partial Pre Payment",
    meta: { label: "RATE", value: "4%" },
    tags: ["of PARTIALPAY", "rides parent"],
    parentCode: "PARTIALPAY",
  },
  {
    code: "PRECLOSURETAX",
    badge: "TAX",
    badgeTone: "gray",
    border: "rose",
    description: "Tax for Pre Closure",
    meta: { label: "RATE", value: "4%" },
    tags: ["of PRECLOSURE", "rides parent"],
    parentCode: "PRECLOSURE",
  },
  {
    code: "PROCFEETAX",
    badge: "TAX",
    badgeTone: "gray",
    border: "rose",
    description: "Processing Fee Tax",
    meta: { label: "RATE", value: "4%" },
    tags: ["of PROCESSINGFEE", "rides parent"],
    parentCode: "PROCESSINGFEE",
  },
  {
    code: "OVDINT",
    badge: "Overdue Penalty",
    badgeTone: "rose",
    border: "rose",
    description: "Overdue Interest",
    meta: { label: "RATE", value: "4%" },
  },
  {
    code: "OVDINTTAX",
    badge: "Overdue Penalty",
    badgeTone: "rose",
    border: "rose",
    description: "Tax for Overdue Interest",
    meta: { label: "RATE", value: "4%" },
  },
  {
    code: "OVERDUEPRIN",
    badge: "Overdue Penalty",
    badgeTone: "rose",
    border: "rose",
    description: "Overdue Principal",
    meta: { label: "RATE", value: "4%" },
  },
  {
    code: "PARTIALPAY",
    badge: "Pre-Payment Penalty",
    badgeTone: "rose",
    border: "rose",
    description: "Partial Payment Penalty Fee",
    meta: { label: "RATE", value: "3%" },
  },
  {
    code: "PRECLOSURE",
    badge: "Pre-Closure Penalty",
    badgeTone: "rose",
    border: "rose",
    description: "Preclosure Fee",
    meta: { label: "RATE", value: "5%" },
  },
];
