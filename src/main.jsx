import React from "react";
import { createRoot } from "react-dom/client";
import { domAnimation, LazyMotion, MotionConfig } from "motion/react";
import App from "./App.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* Os componentes usam m em vez de motion; domAnimation traz só animações, gestos e exit. */}
    <LazyMotion features={domAnimation} strict>
      {/* reducedMotion="user" desliga as animações de transformação para quem pede menos movimento no sistema. */}
      <MotionConfig reducedMotion="user">
        <App />
      </MotionConfig>
    </LazyMotion>
  </React.StrictMode>
);
