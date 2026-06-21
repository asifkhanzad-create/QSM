"use client";

import { useEffect, useState } from "react";

/** Keeps an element mounted long enough to play a CSS exit transition. */
export function useAnimatedPresence(isOpen: boolean, durationMs = 320) {
  const [mounted, setMounted] = useState(isOpen);
  const [visible, setVisible] = useState(isOpen);

  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      const frame = requestAnimationFrame(() => {
        requestAnimationFrame(() => setVisible(true));
      });
      return () => cancelAnimationFrame(frame);
    }

    setVisible(false);
    const timer = window.setTimeout(() => setMounted(false), durationMs);
    return () => window.clearTimeout(timer);
  }, [isOpen, durationMs]);

  return { mounted, visible };
}
