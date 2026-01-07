import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { lists } from "../state/lists";
import PosterCard from "../components/PosterCard";

export default function History() {
  const nav = useNavigate();
  const [his, setHis] = useState([]);

  useEffect(() => setHis(lists.getHistory()), []);

  const clear = () => {
    lists.clearHistory();
    setHis([]);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="pansa-h2">History</div>
          <div className="mt-2 text-muted text-sm">Yang terakhir kamu buka.</div>
        </div>
        <button onClick={clear} className="pansa-btn-ghost">
          <i className="ri-delete-bin-6-line" /> Bersihkan
        </button>
      </div>

      {his.length === 0 ? (
        <div className="mt-8 pansa-card p-6 text-muted">Belum ada history.</div>
      ) : (
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {his.map((it) => (
            <PosterCard key={it.shortPlayId} item={it} onClick={() => nav(`/detail/${it.shortPlayId}`)} />
          ))}
        </div>
      )}
    </div>
  );
}