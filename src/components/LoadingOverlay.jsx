import { AnimatePresence, motion } from "framer-motion";
import { useLoading } from "../state/loading";

export default function LoadingOverlay() {
  const { isLoading } = useLoading();
  const name = import.meta.env.VITE_APP_NAME || "PANSA";

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="fixed inset-0 z-[999] bg-bg/80 backdrop-blur-md flex items-center justify-center"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        >
          <motion.div
            className="pansa-card px-8 py-7"
            initial={{ y: 10, scale: 0.98 }}
            animate={{ y: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 240, damping: 18 }}
          >
            <div className="font-display font-black tracking-[0.35em] text-2xl">{name}</div>
            <div className="mt-2 text-muted text-sm">Loading…</div>
            <div className="mt-4 h-1.5 w-56 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full"
                style={{ width: "40%", background: "linear-gradient(90deg, rgb(var(--brand)), rgb(var(--brand2)))" }}
                initial={{ x: "-50%" }}
                animate={{ x: ["-50%", "130%"] }}
                transition={{ repeat: Infinity, duration: 1.05, ease: "linear" }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}