export type AuditKind = "system" | "amendment" | "collateral" | "copy" | "reversal" | "payment";

export interface AuditEntry {
  timestamp: string;
  actor: string;
  action: string;
  description: string;
  kind: AuditKind;
}

export const auditTrail: AuditEntry[] = [
  {
    timestamp: "2026-03-07 09:12",
    actor: "System",
    action: "Contract Booked",
    description: "Loan CL00200173 booked for EUR 240,000 over 36 months at 3.5% p.a.",
    kind: "system",
  },
  {
    timestamp: "2026-03-12 10:03",
    actor: "System",
    action: "Disbursement Posted",
    description: "DSBR event posted — principal and utilization fee settled to the customer account.",
    kind: "payment",
  },
  {
    timestamp: "2026-06-08 14:20",
    actor: "System",
    action: "Installment Accrual",
    description: "ACCR posted for Inst 5 — interest accrual entries generated for EOD processing.",
    kind: "system",
  },
  {
    timestamp: "2026-06-10 08:41",
    actor: "System",
    action: "Repayment Posted",
    description: "RPAY event posted — installment settled from the customer account.",
    kind: "payment",
  },
  {
    timestamp: "2026-07-15 11:45",
    actor: "divahar.saravanan",
    action: "Financial Amendment",
    description: "Amended principal and maturity date via Financial Amendment.",
    kind: "amendment",
  },
  {
    timestamp: "2026-08-02 16:30",
    actor: "divahar.saravanan",
    action: "Collateral Linked",
    description: "Linked COL110000114 (Residential flat) — EUR 4,091,026.86 lendable value.",
    kind: "collateral",
  },
  {
    timestamp: "2026-08-11 09:00",
    actor: "divahar.saravanan",
    action: "Copied to New Contract",
    description: "Contract duplicated — booking items, components and schedules copied to a new draft.",
    kind: "copy",
  },
];
