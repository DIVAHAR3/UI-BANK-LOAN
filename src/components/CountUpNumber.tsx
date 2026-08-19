import { useCountUp } from "../hooks/useCountUp";

interface CountUpNumberProps {
  value: number;
  decimals?: number;
  duration?: number;
  delay?: number;
  prefix?: string;
  suffix?: string;
  formatter?: (n: number) => string;
}

export function CountUpNumber({
  value,
  decimals = 0,
  duration = 1000,
  delay = 0,
  prefix = "",
  suffix = "",
  formatter,
}: CountUpNumberProps) {
  const current = useCountUp(value, { duration, delay, decimals });
  const body = formatter
    ? formatter(current)
    : current.toLocaleString("en-IE", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      });

  return (
    <span>
      {prefix}
      {body}
      {suffix}
    </span>
  );
}
