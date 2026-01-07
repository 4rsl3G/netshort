import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import LazyImage from "./LazyImage";

export default function HeroSlider({ items = [], onOpen }) {
  const slides = useMemo(() => items.slice(0, 6), [items]);
  const [i, setI] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const t = setInterval(() => setI((x) => (x + 1) % slides.length), 5200);
    return () => clearInterval(t);
  }, [slides.length]);

  const s = slides[i];
  if (!s) return null;

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 pt-4 md:pt-8">
      <div className="relative rounded-[30px] overflow-hidden border border-stroke/10 bg-panel/5 shadow-glow">
        <AnimatePresence mode="wait">
          <motion.div
            key={s.shortPlayId}
            initial={{ opacity: 0, x: 18, scale: 1.01 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -18, scale: 0.99 }}
            transition={{ duration: 0.35 }}
            className="relative"
          >
            <LazyImage src={s.shortPlayCover || s.episodeCover} alt={s.shortPlayName} className="w-full h-[430px] md:h-[540px] object-cover" />
            <div className="absolute inset-0 bg-gradient-to-tr from-bg via-bg/20 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-bg/95 via-bg/10 to-transparent" />

            <div className="absolute bottom-0 left-0 right-0 p-5 md:p-8">
              <div className="flex flex-wrap gap-2">
                <span className="pansa-chip"><span className="inline-block w-2 h-2 rounded-full bg-brand" /> Spotlight</span>
                {s.totalEpisode ? <span className="pansa-chip">{s.totalEpisode} eps</span> : null}
              </div>

              <div className="mt-3 pansa-h1">{s.shortPlayName}</div>
              <div className="mt-3 text-sm md:text-base text-muted max-w-2xl line-clamp-2">{s.shotIntroduce || "—"}</div>

              <div className="mt-5 flex gap-3">
                <button onClick={() => onOpen?.(s)} className="pansa-btn-primary"><i className="ri-play-fill text-lg" /> Tonton</button>
                <button className="pansa-btn-ghost"><i className="ri-add-line text-lg" /> Simpan</button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="absolute left-0 right-0 bottom-0 p-4">
          <div className="pansa-gradline opacity-60" />
        </div>
      </div>
    </div>
  );
}