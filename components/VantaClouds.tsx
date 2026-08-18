"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import CLOUDS from "vanta/dist/vanta.clouds.min";

export type CloudTheme = "classic" | "dark" | "light";

const PALETTES: Record<
  CloudTheme,
  { sky: number; cloud: number; shadow: number; sunlight: number }
> = {
  classic: {
    sky: 0x1e2c50,
    cloud: 0xebd098,
    shadow: 0x000000,
    sunlight: 0xe6b576,
  },
  dark: {
    sky: 0x060a14,
    cloud: 0x0f1830,
    shadow: 0x000000,
    sunlight: 0x1a2547,
  },
  light: {
    sky: 0x9aa8dd,
    cloud: 0xffd3e2,
    shadow: 0x5e4a94,
    sunlight: 0xffa3c4,
  },
};

export default function VantaClouds({
  className,
  theme = "classic",
}: {
  className?: string;
  theme?: CloudTheme;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const colors = PALETTES[theme];
    const vanta = CLOUDS({
      el,
      THREE,
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      minHeight: 200,
      minWidth: 200,
      skyColor: colors.sky,
      cloudColor: colors.cloud,
      cloudShadowColor: colors.shadow,
      sunlightColor: colors.sunlight,
      speed: 1.1,
    });
    return () => {
      if (vanta && typeof vanta.destroy === "function") vanta.destroy();
    };
  }, [theme]);

  return <div ref={containerRef} className={className} />;
}