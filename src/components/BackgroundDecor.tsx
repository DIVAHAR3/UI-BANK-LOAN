import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { useEffect, useState } from "react";

export function BackgroundDecor() {
  const reduceMotion = useReducedMotion();
  const [enableParallax, setEnableParallax] = useState(false);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 40, damping: 20 });
  const sy = useSpring(my, { stiffness: 40, damping: 20 });
  const x1 = useTransform(sx, [-1, 1], [-6, 6]);
  const y1 = useTransform(sy, [-1, 1], [-6, 6]);
  const x2 = useTransform(sx, [-1, 1], [5, -5]);
  const y2 = useTransform(sy, [-1, 1], [5, -5]);

  useEffect(() => {
    if (reduceMotion) return;
    const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
    setEnableParallax(isDesktop);
    if (!isDesktop) return;

    const onMove = (e: MouseEvent) => {
      const nx = e.clientX / window.innerWidth - 0.5;
      const ny = e.clientY / window.innerHeight - 0.5;
      mx.set(nx * 2);
      my.set(ny * 2);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [reduceMotion, mx, my]);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <motion.div
        style={enableParallax ? { x: x1, y: y1 } : undefined}
        animate={reduceMotion ? undefined : { scale: [1, 1.06, 1] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -left-32 -top-32 h-[520px] w-[520px] rounded-full bg-emerald opacity-[0.05] blur-3xl"
      />
      <motion.div
        style={enableParallax ? { x: x2, y: y2 } : undefined}
        animate={reduceMotion ? undefined : { scale: [1, 1.08, 1] }}
        transition={{ duration: 26, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute right-[-160px] top-[220px] h-[460px] w-[460px] rounded-full bg-emerald-strong opacity-[0.04] blur-3xl"
      />
      <motion.div
        style={enableParallax ? { x: x1, y: y2 } : undefined}
        animate={reduceMotion ? undefined : { scale: [1, 1.05, 1] }}
        transition={{ duration: 30, repeat: Infinity, ease: "easeInOut", delay: 4 }}
        className="absolute bottom-[-140px] left-[30%] h-[420px] w-[420px] rounded-full bg-emerald opacity-[0.04] blur-3xl"
      />
      <svg
        className="absolute inset-0 h-full w-full opacity-[0.03]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="grid" width="64" height="64" patternUnits="userSpaceOnUse">
            <path d="M0 64 L64 64 L64 0" fill="none" stroke="#0f9d6d" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
    </div>
  );
}
