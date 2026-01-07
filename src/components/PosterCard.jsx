import { motion } from "framer-motion";
import LazyImage from "./LazyImage";
import { popCard } from "./motionPresets";

export default function PosterCard({ item, onClick, badge, subtitle }) {
  return (
    <motion.button variants={popCard} onClick={onClick} className="text-left w-[170px] shrink-0 group">
      <div className="relative rounded-[26px] overflow-hidden border border-stroke/10 bg-panel/5 shadow-glow">
        <LazyImage
          src={item.shortPlayCover || item.episodeCover || item.cover}
          alt={item.shortPlayName || item.title}
          className="w-full aspect-[3/4] object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg/95 via-transparent to-transparent" />
        {badge ? <div className="absolute top-3 right-3">{badge}</div> : null}
      </div>

      <div className="mt-2 font-semibold text-sm line-clamp-1">{item.shortPlayName || item.title}</div>
      <div className="text-xs text-muted line-clamp-1">{subtitle || item.shotIntroduce || ""}</div>
    </motion.button>
  );
}