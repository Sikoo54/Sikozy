// Kursor kustom: titik emas + ring yang mengikuti mouse dengan animasi spring (hanya aktif di perangkat pointer fine / desktop).
"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [pressed, setPressed] = useState(false);

  // Posisi langsung (titik) & versi spring (ring) supaya ring mengejar dengan halus
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 260, damping: 26, mass: 0.6 });
  const ringY = useSpring(y, { stiffness: 260, damping: 26, mass: 0.6 });

  useEffect(() => {
    // Nonaktif di layar sentuh — biarkan cursor native
    if (!window.matchMedia("(pointer: fine)").matches) return;
    setEnabled(true);

    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const target = e.target as HTMLElement | null;
      setHovering(
        !!target?.closest("button, a, input, label, select, textarea, [role='button']")
      );
    };
    const down = () => setPressed(true);
    const up = () => setPressed(false);

    window.addEventListener("mousemove", move, { passive: true });
    window.addEventListener("mousedown", down);
    window.addEventListener("mouseup", up);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mousedown", down);
      window.removeEventListener("mouseup", up);
    };
  }, [x, y]);

  if (!enabled) return null;

  return (
    <>
      {/* Titik utama: mengikuti mouse 1:1 */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[100] -ml-1 -mt-1 h-2 w-2 rounded-full bg-[#f7ecd4] shadow-[0_0_8px_rgba(232,197,143,0.8)]"
        style={{ x, y }}
        animate={{ scale: pressed ? 0.6 : hovering ? 0.5 : 1 }}
        transition={{ duration: 0.15 }}
      />
      {/* Ring pelengkap: mengejar dengan spring, membesar saat hover elemen interaktif */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[100] -ml-4 -mt-4 h-8 w-8 rounded-full border border-[#e8c58f]/60"
        style={{ x: ringX, y: ringY }}
        animate={{
          scale: pressed ? 0.75 : hovering ? 1.6 : 1,
          opacity: hovering ? 0.9 : 0.45,
          backgroundColor: hovering
            ? "rgba(232,197,143,0.12)"
            : "rgba(232,197,143,0)",
        }}
        transition={{ duration: 0.2 }}
      />
    </>
  );
}
