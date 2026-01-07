import { AnimatePresence, motion } from "framer-motion";

export default function SwipeHint({ show, direction = "up" }) {
  const text = direction === "up" ? "Next episode" : "Previous episode";
  const icon = direction === "up" ? "ri-arrow-up-s-line" : "ri-arrow-down-s-line";

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="absolute left-1/2 -translate-x-1/2 z-30"
          style={{ top: direction === "up" ? 18 : "auto", bottom: direction === "down" ? 18 : "auto" }}
          initial={{ opacity: 0, y: direction === "up" ? 8 : -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: direction === "up" ? 8 : -8 }}
          transition={{ duration: 0.18 }}
        >
          <div className="rounded-full bg-white/10 border border-white/10 backdrop-blur-xl px-4 py-2 text-xs text-white/80 flex items-center gap-2">
            <i className={icon} />
            {text}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}