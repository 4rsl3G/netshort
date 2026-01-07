import { useEffect, useRef, useState } from "react";

export function useInfinite(loadMore, { enabled = true, rootMargin = "900px" } = {}) {
  const sentinelRef = useRef(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    const el = sentinelRef.current;
    if (!el) return;

    const io = new IntersectionObserver(async ([e]) => {
      if (!e.isIntersecting || busy) return;
      setBusy(true);
      try { await loadMore(); }
      finally { setBusy(false); }
    }, { rootMargin });

    io.observe(el);
    return () => io.disconnect();
  }, [enabled, loadMore, busy, rootMargin]);

  return { sentinelRef, busy };
}