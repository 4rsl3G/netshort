import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { ns } from "../api/netshort";
import { useLoading } from "../state/loading";
import PosterCard from "../components/PosterCard";
import { SkelSearchGrid } from "../components/Skeletons";

export default function Search() {
  const nav = useNavigate();
  const loading = useLoading();

  const [q, setQ] = useState("");
  const [items, setItems] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const search = async () => {
    if (!q.trim()) return;
    setIsSearching(true);
    loading.show();
    try {
      const r = await ns.search({ keyword: q, limit: 20, offset: 0, lang: "id_ID" });
      const list = r.data?.data?.data || [];
      setItems(list.map((x) => ({
        shortPlayId: x.shortPlayId,
        shortPlayName: x.shortPlayName,
        shortPlayCover: x.shortPlayCover,
        shotIntroduce: x.shotIntroduce,
      })));
    } finally {
      loading.hide();
      setIsSearching(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 pt-6">
      <div className="pansa-h2">Cari</div>

      <div className="mt-4 flex gap-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Cari judul / keyword…"
          className="pansa-input"
          onKeyDown={(e) => e.key === "Enter" && search()}
        />
        <button onClick={search} className="pansa-btn-primary">
          <i className="ri-search-line" /> Cari
        </button>
      </div>

      {isSearching ? (
        <SkelSearchGrid />
      ) : (
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {items.map((it) => (
            <PosterCard key={it.shortPlayId} item={it} onClick={() => nav(`/detail/${it.shortPlayId}`)} />
          ))}
        </div>
      )}
    </div>
  );
}