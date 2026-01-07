import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { ns } from "../api/netshort";
import { useLoading } from "../state/loading";
import { lists } from "../state/lists";

import LazyImage from "../components/LazyImage";
import { VIP_EFFECT } from "../config/ui";
import { SkelDetail, SkelEpisodeList } from "../components/Skeletons";

export default function Detail() {
  const { shortPlayId } = useParams();
  const nav = useNavigate();
  const loading = useLoading();

  const [meta, setMeta] = useState(null);

  useEffect(() => {
    (async () => {
      loading.show();
      try {
        const r = await ns.episodes(shortPlayId);
        setMeta(r.data);
      } finally {
        loading.hide();
      }
    })();
  }, [shortPlayId]);

  if (!meta) return <SkelDetail />;

  const title = meta?.title || "Judul tidak ada";
  const cover = meta?.cover || "";
  const episodeCount = meta?.episodeCount || meta?.episodes?.length || 0;
  const episodes = meta?.episodes || [];

  const synopsis = meta?.shotIntroduce || null;
  const casts = meta?.actorList || null;

  const favItem = useMemo(() => ({
    shortPlayId,
    shortPlayName: title,
    shortPlayCover: cover,
  }), [shortPlayId, title, cover]);

  const [fav, setFav] = useState(() => lists.isFavorite(shortPlayId));

  const toggleFav = () => {
    lists.toggleFavorite(favItem);
    setFav(lists.isFavorite(shortPlayId));
  };

  const play = (epNo = 1) => {
    lists.pushHistory(favItem);
    nav(`/player/${shortPlayId}?ep=${epNo}`);
  };

  const vipClass = VIP_EFFECT === 2 ? "vip-e2" : "";

  return (
    <div className="pb-10">
      <div className="relative">
        <LazyImage src={cover} alt={title} className="w-full h-[420px] md:h-[520px] object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-bg/95 via-bg/30 to-bg/10" />
        <div className="absolute top-4 left-4 flex gap-2">
          <button onClick={() => nav(-1)} className="pansa-chip">
            <i className="ri-arrow-left-line" /> Kembali
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-6 -mt-24 relative z-10">
        <div className="pansa-h1">{title}</div>
        <div className="mt-2 text-muted text-sm">{episodeCount ? `${episodeCount} episode` : ""}</div>

        <div className="mt-5 flex gap-3">
          <button onClick={() => play(1)} className="pansa-btn-primary">
            <i className="ri-play-fill text-lg" /> Tonton Sekarang
          </button>
          <button onClick={toggleFav} className="pansa-btn-ghost">
            <i className={fav ? "ri-heart-3-fill text-lg text-[rgb(var(--brand))]" : "ri-heart-3-line text-lg"} />
            {fav ? "Disimpan" : "Favorit"}
          </button>
        </div>

        <div className="mt-6 pansa-card p-5">
          <div className="pansa-h2">Sinopsis</div>
          <div className="mt-2 text-sm text-muted leading-relaxed">
            {synopsis ? synopsis : "Data tidak ada"}
          </div>
        </div>

        <div className="mt-6 pansa-card p-5">
          <div className="pansa-h2">Pemeran</div>
          <div className="mt-3">
            {Array.isArray(casts) && casts.length ? (
              <div className="flex gap-4 overflow-x-auto pb-2">
                {casts.slice(0, 10).map((c, idx) => (
                  <div key={idx} className="w-24 shrink-0 text-center">
                    <div className="w-16 h-16 mx-auto rounded-full bg-panel/10 border border-brand2/20" />
                    <div className="mt-2 text-xs text-muted line-clamp-2">{c.name || "—"}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-muted">Data tidak ada</div>
            )}
          </div>
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between">
            <div className="pansa-h2">Daftar Episode</div>
            <button onClick={() => play(1)} className="text-sm text-muted hover:text-text">
              Putar dari awal <i className="ri-arrow-right-line" />
            </button>
          </div>

          {episodes.length ? (
            <div className="mt-4 grid grid-cols-6 sm:grid-cols-8 md:grid-cols-12 gap-2">
              {episodes.map((ep) => (
                <button
                  key={ep.episodeId}
                  onClick={() => play(ep.episodeNo)}  /* ✅ no lock */
                  className="ep-btn"
                  title="Play"
                >
                  <div className="flex items-center justify-center gap-2">
                    <span>{ep.episodeNo}</span>
                    {ep.isLock && (
                      <span className={`vip-badge ${vipClass}`}>
                        <span className="vip-dot" />
                        VIP
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <SkelEpisodeList />
          )}
        </div>
      </div>
    </div>
  );
}