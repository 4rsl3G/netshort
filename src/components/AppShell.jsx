import { useLocation } from "react-router-dom";

import TopNavbar from "./TopNavbar";
import BottomNavMobile from "./BottomNavMobile";
import LoadingOverlay from "./LoadingOverlay";

export default function AppShell({ children }) {
  const { pathname } = useLocation();

  // hide bottom nav on player route
  const isPlayer = pathname.startsWith("/player");

  return (
    <div className="pansa-shell">
      <TopNavbar />
      {children}
      {!isPlayer && <BottomNavMobile />}
      <LoadingOverlay />
    </div>
  );
}
