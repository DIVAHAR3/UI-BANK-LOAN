export interface RateRow {
  effectiveDate: string;
  baseRate: string;
  spread: string;
  effectiveRate: string;
  type: string;
  status: "Current" | "Upcoming" | "Expired";
}

export const rateHistory: RateRow[] = [
  {
    effectiveDate: "2026-04-10",
    baseRate: "3.5000",
    spread: "—",
    effectiveRate: "3.5000",
    type: "LOCAL",
    status: "Current",
  },
  {
    effectiveDate: "2027-04-10",
    baseRate: "3.5000",
    spread: "—",
    effectiveRate: "3.5000",
    type: "LOCAL",
    status: "Upcoming",
  },
];
