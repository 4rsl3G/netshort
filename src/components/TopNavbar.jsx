import { NavLink, useNavigate } from "react-router-dom";

export default function TopNavbar() {
  const nav = useNavigate();
  const name = import.meta.env.VITE_APP_NAME || "PANSA";

  const linkClass = ({ isActive }) =>
    isActive ? "pansa-navlink pansa-navlink-active" : "pansa-navlink";

  return (
    <div className="hidden md:block sticky top-0 z-40">
      <div className="backdrop-blur-xl bg-bg/70 border-b border-stroke/10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <button onClick={() => nav("/")} className="font-display font-black tracking-[0.25em]">
            <span className="text-brand">{name.slice(0,2)}</span>{name.slice(2)}
          </button>

          <div className="flex items-center gap-2">
            <NavLink to="/" className={linkClass}>Home</NavLink>
            <NavLink to="/search" className={linkClass}>Cari</NavLink>
            <NavLink to="/history" className={linkClass}>History</NavLink>
            <NavLink to="/favorite" className={linkClass}>Favorit</NavLink>
          </div>

          <button onClick={() => nav("/search")} className="pansa-chip">
            <i className="ri-search-line" /> Cari judul…
          </button>
        </div>
      </div>
    </div>
  );
}