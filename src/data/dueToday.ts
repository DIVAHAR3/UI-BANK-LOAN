export interface DueTodayEntry {
  dueDate: string;
  component: string;
  glAccount: string;
  glName: string;
  drCr: "DR" | "CR";
  amount: number;
}

export interface DueTodayEvent {
  no: number;
  code: string;
  label: string;
  date: string;
  entries: DueTodayEntry[];
}

export const dueTodayEvents: DueTodayEvent[] = [
  {
    no: 1,
    code: "ACCR",
    label: "Inst 5",
    date: "2026-08-11",
    entries: [
      {
        dueDate: "2026-08-11",
        component: "INTEREST",
        glAccount: "00000000100004",
        glName: "TEST 4",
        drCr: "DR",
        amount: 6.2182,
      },
      {
        dueDate: "2026-08-11",
        component: "INTEREST",
        glAccount: "00000000100001",
        glName: "TEST2",
        drCr: "CR",
        amount: 6.2182,
      },
    ],
  },
];
