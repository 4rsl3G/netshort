import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import Home from "../pages/Home";
import Search from "../pages/Search";
import Detail from "../pages/Detail";
import Player from "../pages/Player";
import Favorite from "../pages/Favorite";
import History from "../pages/History";

const page = {
  initial: { opacity: 0, y: 10, filter: "blur(6px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  exit: { opacity: 0, y: -10, filter: "blur(6px)" },
};

function Page({ children }) {
  return (
    <motion.div
      variants={page}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.28, ease: [0.2, 0.8, 0.2, 1] }}
    >
      {children}
    </motion.div>
  );
}

export default function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Page><Home /></Page>} />
        <Route path="/search" element={<Page><Search /></Page>} />
        <Route path="/detail/:shortPlayId" element={<Page><Detail /></Page>} />
        <Route path="/player/:shortPlayId" element={<Page><Player /></Page>} />
        <Route path="/favorite" element={<Page><Favorite /></Page>} />
        <Route path="/history" element={<Page><History /></Page>} />
      </Routes>
    </AnimatePresence>
  );
}