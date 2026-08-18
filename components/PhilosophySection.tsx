"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const PHILOSOPHY_VIDEO_URL =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260307_083826_e938b29f-a43a-41ec-a153-3d4730578ab8.mp4";

export default function PhilosophySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const videoY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-sky-night px-6 py-28 md:py-40"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(47,66,118,0.08)_0%,_transparent_65%)]" />
      <div className="relative mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="mb-16 md:mb-24"
        >
          <p className="mb-4 text-sm uppercase tracking-widest text-white/40">
            Features
          </p>
          <h2 className="text-5xl tracking-tight text-white md:text-7xl lg:text-8xl">
            Everything you need to{" "}
            <em
              className="italic text-white/40"
              style={{ fontFamily: "'Instrument Serif', serif" }}
            >
              focus
            </em>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="aspect-[4/3] overflow-hidden rounded-3xl"
          >
            <motion.div style={{ y: videoY, scale: 1.12 }} className="h-full w-full">
              <video
                src={PHILOSOPHY_VIDEO_URL}
                className="h-full w-full object-cover"
                muted
                autoPlay
                loop
                playsInline
                preload="auto"
              />
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="flex flex-col justify-center"
          >
            <div>
              <p className="mb-4 text-xs uppercase tracking-widest text-white/40">
                Focus timer
              </p>
              <p className="text-base leading-relaxed text-white/70 md:text-lg">
                Pick 15, 25, or 50 minutes. Sikozy keeps time while you work,
                and a gentle chime marks the end of every session.
              </p>
            </div>

            <div className="my-10 h-px w-full bg-white/10" />

            <div>
              <p className="mb-4 text-xs uppercase tracking-widest text-white/40">
                Todo list
              </p>
              <p className="text-base leading-relaxed text-white/70 md:text-lg">
                While the timer runs, your tasks stay front and center. Tick
                them off as you go — no tab switching, no friction.
              </p>
            </div>

            <div className="my-10 h-px w-full bg-white/10" />

            <div>
              <p className="mb-4 text-xs uppercase tracking-widest text-white/40">
                Curated sounds
              </p>
              <p className="text-base leading-relaxed text-white/70 md:text-lg">
                Warm lofi hiphop and smooth jazz hiphop, hand-picked to melt
                into the background of your work.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}