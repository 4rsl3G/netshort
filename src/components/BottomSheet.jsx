import { AnimatePresence, motion } from "framer-motion";

export default function BottomSheet({ open, title, children, onClose, height = "58vh" }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            className="fixed inset-0 z-[500] bg-black/55 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            aria-label="Close sheet"
          />

          <motion.div
            className="fixed left-0 right-0 bottom-0 z-[550] px-4 pb-4"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
          >
            <motion.div
              className="mx-auto max-w-md rounded-[28px] border border-white/10 bg-[rgba(255,255,255,0.07)] backdrop-blur-2xl shadow-[0_22px_70px_rgba(0,0,0,0.75)] overflow-hidden"
              style={{ height }}
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={0.12}
              onDragEnd={(_, info) => {
                if (info.offset.y > 110 || info.velocity.y > 900) onClose?.();
              }}
            >
              <div className="pt-3 pb-2 flex justify-center">
                <div className="w-12 h-1.5 rounded-full bg-white/20" />
              </div>

              <div className="px-5 pb-3 flex items-center justify-between">
                <div className="font-display font-bold text-lg">{title}</div>
                <button onClick={onClose} className="w-10 h-10 rounded-2xl bg-white/10 border border-white/10" aria-label="Close">
                  <i className="ri-close-line text-xl" />
                </button>
              </div>

              <div className="px-5 pb-5 overflow-y-auto h-[calc(100%-64px)]">
                {children}
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}