"use client";

import { useEffect, useState } from "react";
import Confetti from "react-confetti";

const colors = ["#167657", "#39a77a", "#eca83c", "#b163db", "#4a8ee7"];

export default function OpeningConfetti() {
  const [viewport, setViewport] = useState(null);
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    if (
      complete ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    function measureViewport() {
      setViewport({
        width: document.documentElement.clientWidth,
        height: document.documentElement.clientHeight,
      });
    }

    measureViewport();
    window.addEventListener("resize", measureViewport);
    return () => window.removeEventListener("resize", measureViewport);
  }, [complete]);

  if (!viewport || complete) {
    return null;
  }

  return (
    <Confetti
      {...viewport}
      className="opening-confetti"
      style={{ position: "fixed" }}
      aria-hidden="true"
      colors={colors}
      numberOfPieces={120}
      recycle={false}
      tweenDuration={600}
      onConfettiComplete={() => setComplete(true)}
    />
  );
}
