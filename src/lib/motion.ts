export const ENTRANCE_EASE = [0.16, 1, 0.3, 1] as const;

// Sequential card entrance delays (seconds), per design spec.
export const CARD_DELAY = {
  contractSummary: 0.1,
  amortization: 0.18,
  financialSummary: 0.26,
  repaymentTimeline: 0.34,
  loanCompletion: 0.42,
  generalDetails: 0.5,
  bookingItems: 0.58,
  configCards: 0.66,
};

export const cardEntrance = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.5, delay, ease: ENTRANCE_EASE },
});

export const staggerContainer = (delayChildren = 0.06, delayStart = 0) => ({
  initial: "hidden",
  whileInView: "visible",
  viewport: { once: true, margin: "-40px" },
  variants: {
    hidden: {},
    visible: {
      transition: { staggerChildren: delayChildren, delayChildren: delayStart },
    },
  },
});

export const staggerRow = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: ENTRANCE_EASE } },
};
