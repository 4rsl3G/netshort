import TopNavbar from "./TopNavbar";
import BottomNavMobile from "./BottomNavMobile";
import LoadingOverlay from "./LoadingOverlay";

export default function AppShell({ children }) {
  return (
    <div className="pansa-shell">
      <TopNavbar />
      {children}
      <BottomNavMobile />
      <LoadingOverlay />
    </div>
  );
}