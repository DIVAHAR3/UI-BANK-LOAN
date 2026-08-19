import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

interface UseCountUpOptions {
  duration?: number;
  delay?: number;
  decimals?: number;
  start?: boolean;
}

export function useCountUp(
  target: number,
  { duration = 1000, delay = 0, decimals = 0, start = true }: UseCountUpOptions = {}
) {
  const [value, setValue] = useState(0);
  const reduceMotion = useReducedMotion();
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!start) return;

    if (reduceMotion) {
      setValue(target);
      return;
    }

    let startTime: number | null = null;
    let timeoutId: number | null = null;

    const tick = (now: number) => {
      if (startTime === null) startTime = now;
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutExpo(progress);
      setValue(target * eased);
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setValue(target);
      }
    };

    timeoutId = window.setTimeout(() => {
      rafRef.current = requestAnimationFrame(tick);
    }, delay);

    return () => {
      if (timeoutId) window.clearTimeout(timeoutId);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, duration, delay, start, reduceMotion]);

  return Number(value.toFixed(decimals));
}
