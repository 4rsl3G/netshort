import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

import { ns } from "../api/netshort";
import { useLoading } from "../state/loading";

import BottomSheet from "../components/BottomSheet";
import BufferingIndicator from "../components/BufferingIndicator";
import SwipeHint from "../components/SwipeHint";
import { SkelPlayerSlide } from "../components/Skeletons";

/* ---------------- helpers ---------------- */

function pickVariantsFromResponse(resp) {
  const variants = [];

  const topUrl = resp?.videoUrl || null;
  const topQ = resp?.playClarity || null;
  if (topUrl) variants.push({ quality: topQ || "Auto", url: topUrl });

  const list = resp?.done2?.data?.episodeList;
  if (Array.isArray(list)) {
    for (const it of list) {
      const url = it?.playVoucher;
      const q = it?.playClarity;
      if (url) variants.push({ quality: q || "Auto", url });
    }
  }

  const uniq = [];
  const seen = new Set();
  for (const v of variants) {
    if (seen.has(v.url)) continue;
    seen.add(v.url);
    uniq.push(v);
  }

  uniq.sort((a, b) => {
    const pa = parseInt(String(a.quality).replace(/\D/g, ""), 10);
    const pb = parseInt(String(b.quality).replace(/\D/g, ""), 10);
    if (Number.isFinite(pa) && Number.isFinite(pb)) return pa - pb;
    return String(a.quality).localeCompare(String(b.quality));
  });

  return uniq;
}

function formatTime(sec) {
  if (!Number.isFinite(sec)) return "0:00";
  const s = Math.max(0, Math.floor(sec));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${String(r).padStart(2, "0")}`;
}

function formatLikes(v) {
  const n = Number(v);
  if (!Number.isFinite(n) || n < 0) return "0";
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1).replace(/\.0$/, "")}K`;
  return String(Math.floor(n));
}

function parseLikeNums(raw) {
  if (raw == null) return 0;
  const s = String(raw).trim();
  if (!s) return 0;

  // "4.8K", "69.5K", "1.2M"
  const m = s.match(/^([\d.]+)\s*([kKmM])?$/);
  if (m) {
    const num = parseFloat(m[1]);
    const suf = (m[2] || "").toLowerCase();
    if (!Number.isFinite(num)) return 0;
    if (suf === "k") return Math.round(num * 1000);
    if (suf === "m") return Math.round(num * 1000000);
    return Math.round(num);
  }

  const n = Number(s);
  return Number.isFinite(n) ? Math.round(n) : 0;
}

function stableDummyLikes(shortPlayId, episodeNo) {
  const s = `${shortPlayId}-${episodeNo}`;
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return 1000 + (h % 119000); // 1K - 120K
}

function getLikeFromLocalStorage(shortPlayId) {
  try {
    const v =
      localStorage.getItem(`pansa_like_${shortPlayId}`) ||
      localStorage.getItem(`pansa_likenums_${shortPlayId}`) ||
      "";
    const n = parseLikeNums(v);
    return n > 0 ? n : 0;
  } catch {
    return 0;
  }
}

/* ---------------- Slide ---------------- */

function Slide({
  data,
  active,
  onEnded,
  onRequestNext,
  onRequestPrev,
  onToggleMute,
  onToggleLike,
  onOpenQuality,
}) {
  const videoRef = useRef(null);
  const tapRef = useRef({ t: 0 });

  const [paused, setPaused] = useState(false);
  const [burst, setBurst] = useState(false);
  const [buffering, setBuffering] = useState(false);
  const [progress, setProgress] = useState({ t: 0, d: 0 });

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    if (active) {
      const p = v.play();
      if (p?.catch) p.catch(() => {});
      setPaused(false);
    } else {
      v.pause();
      setPaused(true);
    }
  }, [active, data.videoUrl]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    let raf = 0;
    const tick = () => {
      setProgress({ t: v.currentTime || 0, d: v.duration || 0 });
      raf = requestAnimationFrame(tick);
    };
    if (active) raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active]);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play().catch(() => {});
      setPaused(false);
    } else {
      v.pause();
      setPaused(true);
    }
  };

  const handleTap = () => {
    const now = Date.now();
    const last = tapRef.current.t;
    tapRef.current.t = now;

    // double tap = like
    if (now - last < 260) {
      setBurst(true);
      onToggleLike?.();
      setTimeout(() => setBurst(false), 240);
      return;
    }

    // single tap = play/pause
    setTimeout(() => {
      if (Date.now() - tapRef.current.t >= 240) togglePlay();
    }, 240);
  };

  const pct = progress.d > 0 ? Math.min(100, (progress.t / progress.d) * 100) : 0;

  return (
    <div className="pansa-slide">
      <video
        ref={videoRef}
        className="h-full w-full object-cover"
        src={data.videoUrl}
        playsInline
        muted={!active || data.muted}
        controls={false}
        loop={false}
        preload={active ? "auto" : "metadata"}
        onEnded={onEnded}
        onClick={handleTap}
        onWaiting={() => setBuffering(true)}
        onStalled={() => setBuffering(true)}
        onPlaying={() => setBuffering(false)}
        onCanPlay={() => setBuffering(false)}
      />

      <div className="absolute inset-x-0 top-0 h-40 player-topfade" />
      <div className="absolute inset-x-0 bottom-0 h-64 player-botfade" />

      <BufferingIndicator show={buffering && active} />

      {/* like burst */}
      <div
        className={`absolute inset-0 flex items-center justify-center pointer-events-none transition ${
          burst ? "opacity-100 scale-100" : "opacity-0 scale-90"
        }`}
        style={{ transitionDuration: "220ms" }}
      >
        <div className="text-7xl drop-shadow-[0_20px_50px_rgba(0,0,0,0.6)]">💚</div>
      </div>

      {/* top right controls */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-end gap-2">
        <button
          className="glass-pill"
          onClick={data.qualities?.length ? onOpenQuality : undefined}
          style={{ opacity: data.qualities?.length ? 1 : 0.55 }}
          title="Kualitas"
        >
          <i className="ri-settings-3-line" /> <span className="text-xs">Kualitas</span>
        </button>

        <button className="glass-pill" onClick={onToggleMute} title="Mute">
          <i className={data.muted ? "ri-volume-mute-line" : "ri-volume-up-line"} />
        </button>
      </div>

      {/* right actions */}
      <div className="absolute right-4 bottom-28 flex flex-col gap-3 items-center">
        {/* EP above like */}
        <div className="glass-pill px-3 py-2 text-xs font-semibold">EP {data.episodeNo}</div>

        <div className="flex flex-col items-center gap-1">
          <button
            onClick={onToggleLike}
            className="w-12 h-12 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-xl"
            title="Like"
          >
            <i
              className={
                data.liked
                  ? "ri-heart-3-fill text-[rgb(var(--brand))] text-xl"
                  : "ri-heart-3-line text-xl"
              }
            />
          </button>
          <div className="text-[11px] text-white/75 select-none">{formatLikes(data.likeCount || 0)}</div>
        </div>

        <button className="w-12 h-12 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-xl" title="Share">
          <i className="ri-share-forward-line text-xl" />
        </button>

        <button
          onClick={onRequestNext}
          className="w-12 h-12 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-xl"
          title="Next"
        >
          <i className="ri-skip-down-line text-xl" />
        </button>
      </div>

      {/* bottom info (no hint text) */}
      <div className="absolute left-4 right-20 bottom-24">
        <div className="font-display font-bold text-xl md:text-2xl">{data.title}</div>

        <div className="mt-4">
          <div className="progress-rail">
            <div className="progress-fill" style={{ width: `${pct}%` }} />
          </div>
          <div className="mt-2 flex justify-between text-[11px] text-white/65">
            <span>{formatTime(progress.t)}</span>
            <span>{formatTime(progress.d)}</span>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-2">
          <button onClick={onRequestPrev} className="glass-pill text-xs">
            <i className="ri-arrow-down-s-line" /> Prev
          </button>
          <button onClick={onRequestNext} className="glass-pill text-xs">
            <i className="ri-arrow-up-s-line" /> Next
          </button>
        </div>
      </div>

      {paused && active ? (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="glass-pill px-4 py-2 text-sm">
            <i className="ri-pause-circle-line" /> Paused
          </div>
        </div>
      ) : null}
    </div>
  );
}

/* ---------------- Player ---------------- */

export default function Player() {
  const { shortPlayId } = useParams();
  const [sp] = useSearchParams();
  const nav = useNavigate();
  const loading = useLoading();

  const startEp = Math.max(1, Number(sp.get("ep") || "1"));
  const wrapRef = useRef(null);

  const [meta, setMeta] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [items, setItems] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const [hintUp, setHintUp] = useState(false);
  const [hintDown, setHintDown] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);

  const title = meta?.title || "";

  const baseLikeCount = useMemo(() => {
    // Prioritas: localStorage (disimpan dari list sebelumnya) -> meta.likeNums -> 0
    const fromLS = getLikeFromLocalStorage(shortPlayId);
    if (fromLS > 0) return fromLS;
    const fromMeta = parseLikeNums(meta?.likeNums ?? meta?.likeCount ?? 0);
    return fromMeta > 0 ? fromMeta : 0;
  }, [meta, shortPlayId]);

  const mapEpisode = (ep, url, qualities = []) => {
    const qPick = qualities?.[qualities.length - 1] || qualities?.[0] || null;
    const likeCount = baseLikeCount > 0 ? baseLikeCount : stableDummyLikes(shortPlayId, ep.episodeNo);

    return {
      episodeNo: ep.episodeNo,
      episodeId: ep.episodeId,
      title,
      videoUrl: qPick?.url || url,
      qualities: qualities.length ? qualities : url ? [{ quality: "Auto", url }] : [],
      muted: false,
      liked: false,
      likeCount,
    };
  };

  const fetchVideoAndVariants = async (ep) => {
    try {
      const r = await ns.videoUrl({ shortPlayId, episodeId: ep.episodeId, episodeNo: ep.episodeNo });
      if (r.data?.unlockResult?.data === false) return { url: null, qualities: [] };

      const url =
        r.data?.videoUrl ||
        r.data?.done2?.possibleVideo ||
        r.data?.done2?.data?.episodeList?.[0]?.playVoucher ||
        null;

      const qualities = pickVariantsFromResponse(r.data);
      return { url, qualities };
    } catch {
      return { url: null, qualities: [] };
    }
  };

  const goToIndex = (idx) => {
    const root = wrapRef.current;
    if (!root) return;
    const el = root.querySelector(`[data-index="${idx}"]`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  useEffect(() => {
    (async () => {
      loading.show();
      try {
        const r = await ns.episodes(shortPlayId);
        setMeta(r.data);

        const eps = r.data?.episodes || [];
        setEpisodes(eps);

        const startIndex = Math.max(0, startEp - 1);
        const firstBatch = eps.slice(startIndex, startIndex + 3);

        const fetched = [];
        for (const ep of firstBatch) {
          const { url, qualities } = await fetchVideoAndVariants(ep);
          if (url) fetched.push(mapEpisode(ep, url, qualities));
        }

        if (!fetched.length) {
          for (let k = startIndex; k < eps.length; k++) {
            const { url, qualities } = await fetchVideoAndVariants(eps[k]);
            if (url) {
              fetched.push(mapEpisode(eps[k], url, qualities));
              break;
            }
          }
        }

        setItems(fetched);
        setActiveIndex(0);
        requestAnimationFrame(() => wrapRef.current?.scrollTo({ top: 0, behavior: "auto" }));
      } finally {
        loading.hide();
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shortPlayId]);

  useEffect(() => {
    const root = wrapRef.current;
    if (!root) return;

    const io = new IntersectionObserver(
      (entries) => {
        const best = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (b.intersectionRatio || 0) - (a.intersectionRatio || 0))[0];
        if (!best) return;
        const idx = Number(best.target.getAttribute("data-index"));
        if (!Number.isNaN(idx)) setActiveIndex(idx);
      },
      { root, threshold: [0.55, 0.7, 0.85] }
    );

    const nodes = root.querySelectorAll("[data-index]");
    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, [items.length]);

  useEffect(() => {
    const root = wrapRef.current;
    if (!root) return;

    let t = 0;
    const onScroll = () => {
      setHintUp(true);
      setHintDown(true);
      clearTimeout(t);
      t = setTimeout(() => {
        setHintUp(false);
        setHintDown(false);
      }, 260);
    };

    root.addEventListener("scroll", onScroll, { passive: true });
    return () => root.removeEventListener("scroll", onScroll);
  }, []);

  // infinite: preload next when near end
  useEffect(() => {
    (async () => {
      if (!episodes.length || !items.length) return;
      const nearEnd = items.length - 1 - activeIndex <= 1;
      if (!nearEnd) return;

      const lastLoadedEpNo = items[items.length - 1]?.episodeNo || 0;
      let nextEpNo = lastLoadedEpNo + 1;

      while (true) {
        const ep = episodes.find((x) => x.episodeNo === nextEpNo);
        if (!ep) return;

        const already = items.some((x) => x.episodeNo === nextEpNo);
        if (already) return;

        const { url, qualities } = await fetchVideoAndVariants(ep);
        if (url) {
          setItems((prev) => [...prev, mapEpisode(ep, url, qualities)]);
          return;
        }
        nextEpNo += 1;
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex, episodes, items]);

  const requestNext = useCallback(async () => {
    if (!episodes.length || !items.length) return;

    const lastLoadedEpNo = items[items.length - 1]?.episodeNo || 0;
    let nextEpNo = lastLoadedEpNo + 1;

    loading.show();
    try {
      while (true) {
        const ep = episodes.find((x) => x.episodeNo === nextEpNo);
        if (!ep) return;

        const { url, qualities } = await fetchVideoAndVariants(ep);
        if (url) {
          setItems((prev) => {
            const newArr = [...prev, mapEpisode(ep, url, qualities)];
            requestAnimationFrame(() => goToIndex(newArr.length - 1));
            return newArr;
          });
          return;
        }
        nextEpNo += 1;
      }
    } finally {
      loading.hide();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [episodes, items, loading]);

  const requestPrev = useCallback(() => {
    const prev = Math.max(0, activeIndex - 1);
    goToIndex(prev);
  }, [activeIndex]);

  // auto next when video ended
  const handleEnded = (idx) => {
    const next = idx + 1;
    if (next < items.length) {
      goToIndex(next);
      return;
    }
    requestNext();
  };

  const toggleMute = (idx) =>
    setItems((prev) => prev.map((x, i) => (i === idx ? { ...x, muted: !x.muted } : x)));

  const toggleLike = (idx) =>
    setItems((prev) =>
      prev.map((x, i) => {
        if (i !== idx) return x;
        const nextLiked = !x.liked;
        const base = Number(x.likeCount || 0);
        const nextCount = nextLiked ? base + 1 : Math.max(0, base - 1);
        return { ...x, liked: nextLiked, likeCount: nextCount };
      })
    );

  const setQuality = (idx, choice) => {
    if (!choice?.url) return;
    setItems((prev) => prev.map((x, i) => (i === idx ? { ...x, videoUrl: choice.url } : x)));
  };

  if (!items.length) {
    return (
      <div className="h-screen">
        <div className="absolute top-4 left-4 z-50">
          <button onClick={() => nav(-1)} className="glass-pill text-sm">
            <i className="ri-arrow-left-line" /> Detail
          </button>
        </div>
        <SkelPlayerSlide />
      </div>
    );
  }

  const activeSlide = items[activeIndex];

  return (
    <div className="h-screen">
      <div className="absolute top-4 left-4 z-50">
        <button onClick={() => nav(-1)} className="glass-pill text-sm">
          <i className="ri-arrow-left-line" /> Detail
        </button>
      </div>

      <SwipeHint show={hintUp} direction="up" />
      <SwipeHint show={hintDown} direction="down" />

      <div ref={wrapRef} className="pansa-snap">
        {items.map((it, idx) => (
          <div key={`${it.episodeId}-${it.episodeNo}`} data-index={idx}>
            <Slide
              data={it}
              active={idx === activeIndex}
              onEnded={() => handleEnded(idx)}
              onRequestNext={requestNext}
              onRequestPrev={requestPrev}
              onToggleMute={() => toggleMute(idx)}
              onToggleLike={() => toggleLike(idx)}
              onOpenQuality={() => setSheetOpen(true)}
            />
          </div>
        ))}
      </div>

      <BottomSheet open={sheetOpen} title="Pilih Kualitas" onClose={() => setSheetOpen(false)} height="58vh">
        <div className="text-sm text-white/70">Pilih kualitas streaming (jika tersedia).</div>

        <div className="mt-4 grid gap-2">
          {(activeSlide?.qualities || []).length ? (
            activeSlide.qualities.map((q) => {
              const selected = activeSlide.videoUrl === q.url;
              return (
                <button
                  key={q.url}
                  onClick={() => {
                    setQuality(activeIndex, q);
                    setSheetOpen(false);
                  }}
                  className={`w-full text-left rounded-2xl px-4 py-4 border transition ${
                    selected ? "bg-white/12 border-white/20" : "bg-white/6 border-white/10 hover:bg-white/10"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="font-semibold">
                      {q.quality || "Auto"}
                      {selected ? <span className="ml-2 text-[11px] text-[rgb(var(--brand))]">Selected</span> : null}
                    </div>
                    <i className={selected ? "ri-check-line text-[rgb(var(--brand))]" : "ri-arrow-right-s-line"} />
                  </div>
                  <div className="mt-1 text-xs text-white/60 line-clamp-1">Streaming quality option</div>
                </button>
              );
            })
          ) : (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-white/70">
              Kualitas tidak tersedia dari server (hanya 1 stream).
            </div>
          )}
        </div>

        <div className="mt-4 text-xs text-white/50">Tips: pilih kualitas lebih rendah untuk jaringan lambat.</div>
      </BottomSheet>
    </div>
  );
}
