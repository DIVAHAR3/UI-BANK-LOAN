import { useState } from "react";
import { motion } from "framer-motion";
import { Landmark, User, Package, Car, Euro, FileText } from "lucide-react";
import { Card, CardHeading } from "./Card";
import { contract } from "../data/contract";
import { CARD_DELAY } from "../lib/motion";

const FIELDS = [
  { icon: Landmark, label: "Branch", value: contract.branch },
  { icon: User, label: "Customer", value: contract.customer },
  { icon: Package, label: "Product", value: contract.productCode, sub: contract.productLabel },
  { icon: Car, label: "Product Name", value: contract.productName },
  { icon: Euro, label: "Currency", value: contract.currency },
  { icon: FileText, label: "Contract ID", value: contract.id },
];

export function ContractSummary() {
  const delay = CARD_DELAY.contractSummary;
  return (
    <Card delay={delay} hover={false} className="col-span-full">
      <CardHeading
        icon={<FileText size={16} />}
        title="Contract Summary"
        delay={delay}
        titleClassName="[filter:drop-shadow(0_2px_4px_rgba(15,28,23,0.22))]"
      />
      <div className="grid grid-cols-2 gap-x-4 gap-y-5 px-5 py-5 sm:grid-cols-3 lg:grid-cols-6">
        {FIELDS.map((field, i) => (
          <motion.div
            key={field.label}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: delay + 0.08 + i * 0.05 }}
            className="flex items-start gap-2.5"
          >
            <motion.span
              whileHover={{ scale: 1.08 }}
              transition={{ duration: 0.15 }}
              className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-mint text-emerald-strong"
            >
              <field.icon size={15} />
            </motion.span>
            <div className="min-w-0 flex-1">
              <label className="text-sm font-bold text-ink">{field.label}</label>
              <EditableValue defaultValue={field.value} />
              {field.sub && <div className="mt-1 text-xs text-ink-faint">{field.sub}</div>}
            </div>
          </motion.div>
        ))}
      </div>
    </Card>
  );
}

function EditableValue({ defaultValue }: { defaultValue: string }) {
  const [value, setValue] = useState(defaultValue);

  return (
    <input
      type="text"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      className="mt-1 w-full max-w-full rounded-md border border-border bg-card px-2.5 py-1 text-base font-bold text-ink outline-none transition-colors duration-150 focus:border-emerald-strong focus:ring-1 focus:ring-emerald-strong"
    />
  );
}
