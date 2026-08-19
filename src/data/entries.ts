export type EntryStatus = "Processed" | "Posted" | "Pending" | "Failed";

export interface LedgerEntry {
  dueDate: string;
  component: string;
  glAccount: string;
  glName: string;
  drCr: "DR" | "CR";
  tranCode: string;
  mode: string;
  status: EntryStatus;
  reason?: string;
  errorCode?: string;
  detail?: string;
  suggestedAction?: string;
  attempts?: string;
  amount: number;
}

export interface LedgerEvent {
  no: number;
  code: string;
  date: string;
  status: EntryStatus;
  entries: LedgerEntry[];
}

export const ledgerEvents: LedgerEvent[] = [
  {
    no: 1,
    code: "DSBR",
    date: "2026-03-12",
    status: "Processed",
    entries: [
      {
        dueDate: "2026-03-12",
        component: "UTILIZATIONFEE",
        glAccount: "200CAS00234114",
        glName: "Settle the Customer Account",
        drCr: "DR",
        tranCode: "UTT",
        mode: "—",
        status: "Processed",
        amount: 600,
      },
      {
        dueDate: "2026-03-12",
        component: "UTILIZATIONFEE",
        glAccount: "00000000513142",
        glName: "Stamp Duty Deposit GL",
        drCr: "CR",
        tranCode: "UTT",
        mode: "—",
        status: "Processed",
        amount: 600,
      },
      {
        dueDate: "2026-03-12",
        component: "PRINCIPAL",
        glAccount: "00000000100001",
        glName: "TEST2",
        drCr: "DR",
        tranCode: "PDC",
        mode: "—",
        status: "Processed",
        amount: 120000,
      },
      {
        dueDate: "2026-03-12",
        component: "PRINCIPAL",
        glAccount: "200CAS00234114",
        glName: "Settle the Customer Account",
        drCr: "CR",
        tranCode: "PDC",
        mode: "—",
        status: "Processed",
        amount: 120000,
      },
    ],
  },
  {
    no: 2,
    code: "RPAY",
    date: "2026-06-10",
    status: "Processed",
    entries: [
      {
        dueDate: "2026-06-10",
        component: "PRINCIPAL",
        glAccount: "200CAS00234114",
        glName: "Settle the Customer Account",
        drCr: "DR",
        tranCode: "RPY",
        mode: "MANUAL",
        status: "Processed",
        amount: 5835.44,
      },
      {
        dueDate: "2026-06-10",
        component: "PRINCIPAL",
        glAccount: "00000000100001",
        glName: "TEST2",
        drCr: "CR",
        tranCode: "RPY",
        mode: "MANUAL",
        status: "Processed",
        amount: 5835.44,
      },
    ],
  },
  {
    no: 3,
    code: "INSTL",
    date: "2026-06-08",
    status: "Failed",
    entries: [
      {
        dueDate: "2026-06-08",
        component: "PRIN",
        glAccount: "2010001",
        glName: "Customer Settlement Account",
        drCr: "CR",
        tranCode: "DISB",
        mode: "Auto",
        status: "Posted",
        amount: 200000,
      },
      {
        dueDate: "2026-06-08",
        component: "PROC_FEE",
        glAccount: "4020015",
        glName: "Fee Income — Processing",
        drCr: "DR",
        tranCode: "FEE",
        mode: "Auto",
        status: "Failed",
        reason: "GL account mismatch",
        errorCode: "ERR-GL-4021",
        detail:
          "The posting GL account configured for PROC_FEE does not match the chart-of-accounts mapping for this product code.",
        suggestedAction: "Verify the GL mapping for PROC_FEE and re-run the posting.",
        attempts: "Attempt 1 of 3",
        amount: 1200,
      },
      {
        dueDate: "2026-07-08",
        component: "PRIN",
        glAccount: "1100100",
        glName: "Loans Receivable — Principal",
        drCr: "DR",
        tranCode: "INSTL",
        mode: "Auto",
        status: "Failed",
        reason: "Insufficient funds",
        errorCode: "ERR-FND-1187",
        detail:
          "The customer settlement account 1100100 did not have sufficient available balance to cover the scheduled installment debit.",
        suggestedAction: "Ensure the settlement account has sufficient balance, then retry the posting.",
        attempts: "Attempt 2 of 3",
        amount: 8640.54,
      },
      {
        dueDate: "2026-08-08",
        component: "PRIN",
        glAccount: "1100100",
        glName: "Loans Receivable — Principal",
        drCr: "DR",
        tranCode: "INSTL",
        mode: "Auto",
        status: "Pending",
        amount: 8640.54,
      },
    ],
  },
];
