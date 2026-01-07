import { motion } from "framer-motion";
import { fadeUp, staggerWrap } from "./motionPresets";

export default function HorizontalRow({ title, rightText="Lihat semua", onRight, children }) {
  return (
    <motion.section
      className="mt-8"
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
    >
      <div className="max-w-6xl mx-auto px-4 md:px-6 flex items-center justify-between">
        <div className="pansa-h2 flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-brand" />
          {title}
        </div>
        <button onClick={onRight} className="text-sm text-muted hover:text-text">
          {rightText} <i className="ri-arrow-right-line" />
        </button>
      </div>

      <motion.div
        className="max-w-6xl mx-auto px-4 md:px-6 mt-4 flex gap-4 overflow-x-auto pb-2"
        variants={staggerWrap}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
      >
        {children}
      </motion.div>
    </motion.section>
  );
}