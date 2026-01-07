import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import "remixicon/fonts/remixicon.css";

import "./index.css";
import Router from "./router/Router";
import { LoadingProvider } from "./state/loading";

AOS.init({ duration: 650, once: true, easing: "ease-out" });

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <LoadingProvider>
      <BrowserRouter>
        <Router />
      </BrowserRouter>
    </LoadingProvider>
  </React.StrictMode>
);