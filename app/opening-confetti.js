"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const Confetti = dynamic(() => import("react-confetti"), { ssr: false });

const colors = ["#167657", "#39a77a", "#eca83c", "#b163db", "#4a8ee7"];

export default function OpeningConfetti() {
  const [viewport, setViewport] = useState(null);
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    if (complete) {
      return;
    }

    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motionPreference.matches) {
      return;
    }

    function stopOnReducedMotion(event) {
      if (event.matches) {
        setComplete(true);
      }
    }

    function measureViewport() {
      setViewport({
        width: document.documentElement.clientWidth,
        height: document.documentElement.clientHeight,
      });
    }

    measureViewport();
    window.addEventListener("resize", measureViewport);
    motionPreference.addEventListener("change", stopOnReducedMotion);

    // Bound the whole animation, including particles still falling after emission.
    const timeout = window.setTimeout(() => setComplete(true), 4000);

    return () => {
      window.clearTimeout(timeout);
      window.removeEventListener("resize", measureViewport);
      motionPreference.removeEventListener("change", stopOnReducedMotion);
    };
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
      gravity={0.6}
      numberOfPieces={120}
      recycle={false}
      tweenDuration={600}
      onConfettiComplete={() => setComplete(true)}
    />
  );
}
