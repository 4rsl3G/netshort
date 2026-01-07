import { NavLink } from "react-router-dom";

const item = ({ isActive }) =>
  `flex flex-col items-center gap-1 text-[11px] ${isActive ? "text-text" : "text-text/50"}`;

export default function BottomNavMobile() {
  return (
    <div className="md:hidden fixed bottom-4 left-0 right-0 z-50 px-4">
      <div className="mx-auto max-w-md rounded-3xl bg-panel/10 backdrop-blur-xl border border-stroke/10 px-6 py-3 flex justify-between shadow-glow">
        <NavLink to="/" className={item}><i className="ri-home-5-line text-xl" /><span>Home</span></NavLink>
        <NavLink to="/search" className={item}><i className="ri-search-line text-xl" /><span>Cari</span></NavLink>
        <NavLink to="/history" className={item}><i className="ri-time-line text-xl" /><span>History</span></NavLink>
        <NavLink to="/favorite" className={item}><i className="ri-heart-3-line text-xl" /><span>Favorit</span></NavLink>
      </div>
    </div>
  );
}