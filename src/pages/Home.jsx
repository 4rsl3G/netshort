import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import { ns } from "../api/netshort";
import { useLoading } from "../state/loading";
import { useInfinite } from "../hooks/useInfinite";

import HeroSlider from "../components/HeroSlider";
import HorizontalRow from "../components/HorizontalRow";
import PosterCard from "../components/PosterCard";
import { SkelHero, SkelRow, SkelGrid } from "../components/Skeletons";
import { staggerWrap } from "../components/motionPresets";

export default function Home() {
  const nav = useNavigate();
  const loading = useLoading();

  const [items, setItems] = useState([]);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    (async () => {
      loading.show();
      try {
        const r = await ns.recommend({ limit: 12, offset: 0, lang: "id_ID" });
        const list = r.data?.data?.data?.dataList || [];
        setItems(list);
        setOffset(12);
      } finally {
        loading.hide();
      }
    })();
  }, []);

  const loadMore = useCallback(async () => {
    const r = await ns.recommend({ limit: 12, offset, lang: "id_ID" });
    const list = r.data?.data?.data?.dataList || [];
    if (list.length) {
      setItems((p) => [...p, ...list]);
      setOffset((o) => o + 12);
    }
  }, [offset]);

  const { sentinelRef } = useInfinite(loadMore, { enabled: true });

  if (!items.length) {
    return (
      <div className="pb-10">
        <SkelHero />
        <SkelRow />
        <SkelGrid />
      </div>
    );
  }

  return (
    <div className="pb-10">
      <HeroSlider items={items} onOpen={(s) => nav(`/detail/${s.shortPlayId}`)} />

      <HorizontalRow title="Rekomendasi Untukmu">
        {items.slice(0, 12).map((it) => (
          <PosterCard
            key={it.shortPlayId}
            item={it}
            badge={it.totalEpisode ? <span className="pansa-chip">{it.totalEpisode} eps</span> : null}
            onClick={() => nav(`/detail/${it.shortPlayId}`)}
          />
        ))}
      </HorizontalRow>

      <div className="max-w-6xl mx-auto px-4 md:px-6 mt-10">
        <div className="pansa-h2 flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-brand2" />
          Trending Hari Ini
        </div>

        <motion.div
          className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4"
          variants={staggerWrap}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
        >
          {items.slice(12, 32).map((it) => (
            <PosterCard key={it.shortPlayId} item={it} onClick={() => nav(`/detail/${it.shortPlayId}`)} />
          ))}
        </motion.div>
      </div>

      <div ref={sentinelRef} className="h-10" />
    </div>
  );
}