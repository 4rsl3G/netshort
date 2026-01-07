export const staggerWrap = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.06, delayChildren: 0.06 },
  },
};

export const popCard = {
  hidden: { opacity: 0, y: 16, scale: 0.98, filter: "blur(7px)" },
  show: {
    opacity: 1, y: 0, scale: 1, filter: "blur(0px)",
    transition: { duration: 0.36, ease: [0.2, 0.8, 0.2, 1] },
  },
};

export const fadeUp = {
  hidden: { opacity: 0, y: 14, filter: "blur(6px)" },
  show: {
    opacity: 1, y: 0, filter: "blur(0px)",
    transition: { duration: 0.38, ease: [0.2, 0.8, 0.2, 1] },
  },
};