import { AnimatePresence, motion } from "framer-motion";

export default function BufferingIndicator({ show }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="rounded-2xl bg-white/10 border border-white/10 backdrop-blur-xl px-4 py-3 flex items-center gap-3">
            <motion.div
              className="w-5 h-5 rounded-full border-2 border-white/25 border-t-white/80"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 0.85, ease: "linear" }}
            />
            <div className="text-sm text-white/80">Buffering…</div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}