"use client";

import { useEffect } from "react";
import Lenis from "lenis";

export default function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
      autoRaf: true,
    });
    return () => lenis.destroy();
  }, []);

  return null;
}