"use client";

import { useRef } from "react";
import type { ReactNode } from "react";
import { motion, useInView } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1] as const;

export default function WordsPullUp({
  text,
  className = "",
  suffix,
  started = true,
}: {
  text: string;
  className?: string;
  suffix?: ReactNode;
  started?: boolean;
}) {
  const ref = useRef<HTMLHeadingElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const words = text.split(" ");
  const active = isInView && started;

  return (
    <motion.h1 ref={ref} className={className}>
      {words.map((word, index) => {
        const isLast = index === words.length - 1;
        return (
          <span
            key={index}
            className="inline-block -mb-[0.15em] overflow-hidden pb-[0.15em] align-bottom"
          >
            <motion.span
              className="relative inline-block"
              animate={
                active ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
              }
              transition={{
                duration: 0.6,
                delay: index * 0.08,
                ease: EASE,
              }}
            >
              {word}
              {isLast && suffix}
            </motion.span>
          </span>
        );
      })}
    </motion.h1>
  );
}