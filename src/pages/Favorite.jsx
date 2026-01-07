import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { lists } from "../state/lists";
import PosterCard from "../components/PosterCard";

export default function Favorite() {
  const nav = useNavigate();
  const [fav, setFav] = useState([]);

  useEffect(() => setFav(lists.getFavorites()), []);

  const remove = (id) => {
    const all = lists.getFavorites();
    const item = all.find((x) => x.shortPlayId === id);
    if (item) lists.toggleFavorite(item);
    setFav(lists.getFavorites());
  };

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 pt-6">
      <div className="pansa-h2">Favorit</div>
      <div className="mt-2 text-muted text-sm">Daftar yang kamu simpan.</div>

      {fav.length === 0 ? (
        <div className="mt-8 pansa-card p-6 text-muted">Belum ada favorit.</div>
      ) : (
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {fav.map((it) => (
            <div key={it.shortPlayId} className="relative">
              <PosterCard item={it} onClick={() => nav(`/detail/${it.shortPlayId}`)} />
              <button onClick={() => remove(it.shortPlayId)} className="absolute top-2 right-2 pansa-chip" title="Hapus">
                <i className="ri-delete-bin-6-line" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}