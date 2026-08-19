import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { ENTRANCE_EASE } from "../lib/motion";

interface CardProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  hover?: boolean;
}

export function Card({ children, delay = 0, className = "", hover = true }: CardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay, ease: ENTRANCE_EASE }}
      whileHover={hover ? { y: -3 } : undefined}
      whileTap={hover ? { y: -1 } : undefined}
      className={`rounded-2xl border border-border bg-card shadow-[0_1px_2px_rgba(15,28,23,0.05)] transition-shadow duration-200 hover:shadow-[0_18px_36px_-16px_rgba(15,28,23,0.16)] ${className}`}
      style={hover ? { willChange: "transform" } : undefined}
    >
      {children}
    </motion.div>
  );
}

export function CardHeading({
  icon,
  title,
  delay = 0,
  className = "px-5 pt-5 pb-1",
  titleClassName = "",
}: {
  icon: ReactNode;
  title: string;
  delay?: number;
  className?: string;
  titleClassName?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay, ease: ENTRANCE_EASE }}
      className={`flex items-center gap-2.5 ${className}`}
    >
      <motion.span
        initial={{ scale: 0.4, rotate: -25, opacity: 0 }}
        whileInView={{ scale: 1, rotate: 0, opacity: 1 }}
        viewport={{ once: true }}
        whileHover={{ scale: 1.15, rotate: 8 }}
        transition={{ type: "spring", stiffness: 320, damping: 16, delay: delay + 0.05 }}
        className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-strong to-[#4D7A9E] text-white shadow-[0_6px_14px_-4px_rgba(11,122,84,0.45)]"
      >
        {icon}
      </motion.span>
      <motion.h3
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.3, delay: delay + 0.15 }}
        className={`bg-gradient-to-r from-emerald-strong to-[#4D7A9E] bg-clip-text px-1 py-1 text-[13px] font-extrabold uppercase tracking-wide text-transparent [filter:drop-shadow(0_1px_1px_rgba(15,28,23,0.12))] ${titleClassName}`}
      >
        {title}
      </motion.h3>
    </motion.div>
  );
}
