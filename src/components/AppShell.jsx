import { useLocation } from "react-router-dom";

import TopNavbar from "./TopNavbar";
import BottomNavMobile from "./BottomNavMobile";
import LoadingOverlay from "./LoadingOverlay";

export default function AppShell({ children }) {
  const { pathname } = useLocation();
  const isPlayer = pathname.startsWith("/player");

  return (
    <div className="pansa-shell">
      {!isPlayer && <TopNavbar />}
      {children}
      {!isPlayer && <BottomNavMobile />}
      <LoadingOverlay />
    </div>
  );
}
