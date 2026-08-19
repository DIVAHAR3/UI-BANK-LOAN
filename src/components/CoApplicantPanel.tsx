import { motion } from "framer-motion";
import { Users } from "lucide-react";
import { Card, CardHeading } from "./Card";

const PRINCIPAL = 120000;
const principalFmt = new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export function CoApplicantPanel() {
  const delay = 0;
  const allocatedPercent = 0;
  const remainingPercent = 100 - allocatedPercent;
  const applicantCount = 0;

  const stats = [
    { label: "Allocated", value: `${allocatedPercent.toFixed(2)}%`, accent: true },
    { label: "Remaining", value: `${remainingPercent.toFixed(2)}%` },
    { label: "Applicants", value: String(applicantCount) },
    { label: "Principal", value: `EUR ${principalFmt.format(PRINCIPAL)}` },
  ];

  return (
    <Card delay={delay} hover={false}>
      <div className="px-5 pb-1 pt-5">
        <CardHeading icon={<Users size={16} />} title="Applicant allocation" delay={delay} className="" />
        <p className="mt-1 pl-[42px] text-xs text-ink-faint">
          Assign the loan principal across borrowers and guarantors.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 px-5 pb-4 pt-4 sm:grid-cols-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: delay + 0.1 + i * 0.06 }}
          >
            <div className="text-[11px] font-bold uppercase tracking-wide text-ink-faint">{stat.label}</div>
            <div className={`mt-1 text-lg font-extrabold ${stat.accent ? "text-blue-600" : "text-ink"}`}>
              {stat.value}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="px-5 pb-2">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-page">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${allocatedPercent}%` }}
            transition={{ duration: 0.9, delay: delay + 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="h-full rounded-full bg-blue-500"
          />
        </div>
      </div>

      <div className="flex items-center justify-between px-5 pb-5 text-[11px] text-ink-faint">
        <span>{remainingPercent.toFixed(2)}% still to allocate</span>
        <span>Target 100%</span>
      </div>
    </Card>
  );
}
