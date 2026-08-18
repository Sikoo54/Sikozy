// (Cadangan, belum dirender) Section tentang Sikozy.
"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

export default function AboutSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section className="relative overflow-hidden bg-sky-night px-6 pb-10 pt-32 md:pb-14 md:pt-44">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(47,66,118,0.12)_0%,_transparent_70%)]" />

      <div ref={sectionRef} className="relative mx-auto max-w-6xl">
        <motion.p
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-sm uppercase tracking-widest text-white/40"
        >
          About Sikozy
        </motion.p>

        <motion.h2
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="mt-6 text-4xl leading-[1.1] tracking-tight text-white md:text-6xl lg:text-7xl"
        >
          The audio player that keeps you in{" "}
          <em
            className="italic text-white/60"
            style={{ fontFamily: "'Instrument Serif', serif" }}
          >
            flow
          </em>
        </motion.h2>

        <motion.p
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.25 }}
          className="mt-8 max-w-xl text-sm leading-relaxed text-white/60 sm:text-base"
        >
          Sikozy is a lofi hiphop &amp; jazz hiphop audio player made for deep
          work. It pairs curated beats with a built-in focus timer and a todo
          list, so you can pick a sound, start a session, and keep your tasks
          close while you work.
        </motion.p>
      </div>
    </section>
  );
}