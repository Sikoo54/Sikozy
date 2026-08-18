// (Cadangan, belum dirender) Section layanan/fitur.
"use client";

import { motion } from "framer-motion";

const DARK_VIDEO_URL =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4";

const LIGHT_VIDEO_URL =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260324_151826_c7218672-6e92-402c-9e45-f1e0f454bdc4.mp4";

export default function ServicesSection() {
  return (
    <section className="relative overflow-hidden bg-sky-night px-6 py-28 md:py-40">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(47,66,118,0.08)_0%,_transparent_60%)]" />

      <div className="relative mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="mb-12 md:mb-16"
        >
          <p className="mb-4 text-sm uppercase tracking-widest text-white/40">
            Appearance
          </p>
          <h2 className="text-3xl tracking-tight text-white md:text-5xl">
            Choose your{" "}
            <em
              className="italic text-white/40"
              style={{ fontFamily: "'Instrument Serif', serif" }}
            >
              theme
            </em>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
          <motion.article
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="liquid-glass group overflow-hidden rounded-3xl"
          >
            <div className="relative aspect-video overflow-hidden">
              <video
                src={DARK_VIDEO_URL}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                muted
                autoPlay
                loop
                playsInline
                preload="auto"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>

            <div className="p-6 md:p-8">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-xs uppercase tracking-widest text-white/40">
                  Dark
                </span>
                <span className="h-3 w-3 rounded-full bg-sky-night ring-1 ring-white/20" />
              </div>
              <h3 className="mb-3 text-xl tracking-tight text-white md:text-2xl">
                Night sky
              </h3>
              <p className="text-sm leading-relaxed text-white/50">
                Soft clouds and warm sunlight over a deep night sky — easy on
                the eyes when the lights are off and you&apos;re deep in a
                session.
              </p>
            </div>
          </motion.article>

          <motion.article
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="liquid-glass group overflow-hidden rounded-3xl"
          >
            <div className="relative aspect-video overflow-hidden">
              <video
                src={LIGHT_VIDEO_URL}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                muted
                autoPlay
                loop
                playsInline
                preload="auto"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            </div>

            <div className="p-6 md:p-8">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-xs uppercase tracking-widest text-white/40">
                  Light
                </span>
                <span className="h-3 w-3 rounded-full bg-white ring-1 ring-white/30" />
              </div>
              <h3 className="mb-3 text-xl tracking-tight text-white md:text-2xl">
                Daylight
              </h3>
              <p className="text-sm leading-relaxed text-white/50">
                A bright, airy look for daytime sessions. Same focus features,
                lighter atmosphere — pick whichever mood matches your day.
              </p>
            </div>
          </motion.article>
        </div>
      </div>
    </section>
  );
}