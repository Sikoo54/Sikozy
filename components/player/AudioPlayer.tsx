// Player audio bottom bar: judul lagu, kontrol play/prev/next, equalizer, volume. Warna mengikuti theme via CSS vars.
"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Maximize2,
  Pause,
  Play,
  SkipBack,
  SkipForward,
  Volume2,
  X,
} from "lucide-react";
import { useState } from "react";

export type Track = {
  title: string;
  artist: string;
  src: string;
};

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function EqualizerBars() {
  return (
    <span className="flex h-3 items-end gap-[2px]">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="w-[3px] rounded-full bg-[var(--acc)]"
          animate={{ height: ["30%", "100%", "45%", "30%"] }}
          transition={{
            duration: 0.9,
            repeat: Infinity,
            delay: i * 0.15,
            ease: "easeInOut",
          }}
        />
      ))}
    </span>
  );
}

export default function AudioPlayer({
  tracks,
  currentIndex,
  playing,
  onPrev,
  onNext,
  onToggle,
  currentTime,
  duration,
  onSeek,
volume,
  onVolumeChange,
  theme = "classic",
}: {
  tracks: Track[];
  currentIndex: number;
  playing: boolean;
  onSelect: (index: number) => void;
  onPrev: () => void;
  onNext: () => void;
  onToggle: () => void;
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
  volume: number;
  onVolumeChange: (volume: number) => void;
  theme?: string;
}) {
  const track = tracks[currentIndex];
  const [expanded, setExpanded] = useState(false);
  const isLight = theme === "light";

  return (
    <div className="liquid-glass relative w-full overflow-visible rounded-2xl px-5 py-3.5 md:px-6">
      <AnimatePresence>
        {expanded && (
          <motion.div
            key="expanded-title"
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="liquid-glass absolute bottom-full left-0 right-0 z-30 mb-2 rounded-2xl p-5"
            style={
              {
                "--panel": isLight
                  ? "linear-gradient(180deg, rgba(255,255,255,0.98), rgba(240,236,255,0.94))"
                  : "linear-gradient(180deg, rgba(18,24,46,0.97), rgba(10,16,32,0.92))",
              } as React.CSSProperties
            }
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-playfair text-xl italic leading-snug tracking-tight text-[var(--txt)] md:text-2xl">
                  {track.title}
                </p>
                <p className="mt-1.5 text-sm text-[var(--txt-soft)]">
                  {track.artist}
                </p>
              </div>
              <button
                onClick={() => setExpanded(false)}
                aria-label="Close full title"
                className="shrink-0 rounded-full bg-[var(--chip)] p-2 text-[var(--txt-soft)] transition-colors hover:text-[var(--txt)]"
              >
                <X size={14} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
        <div className="min-w-0">
          <button
            onClick={() => setExpanded((v) => !v)}
            className="group flex max-w-full items-center gap-1.5 text-left"
          >
            <span className="font-playfair truncate text-base italic tracking-tight text-[var(--txt)] md:text-lg">
              {track.title}
            </span>
            <Maximize2
              size={12}
              className="shrink-0 text-[var(--txt-faint)] transition-colors group-hover:text-[var(--acc)] md:hidden"
            />
            {playing && <EqualizerBars />}
          </button>
          <p className="truncate text-xs text-[var(--txt-soft)]">
            {track.artist}
          </p>
        </div>

        <div className="flex shrink-0 items-center justify-center gap-2 md:gap-3">
          <button
            onClick={onPrev}
            aria-label="Previous track"
            className="rounded-full p-1.5 text-[var(--txt-soft)] transition-colors hover:text-[var(--txt)]"
          >
            <SkipBack size={18} />
          </button>
          <button
            onClick={onToggle}
            aria-label={playing ? "Pause" : "Play"}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--acc)] text-[var(--acc-txt)] shadow-[0_4px_24px_var(--glow)] transition-transform hover:scale-105"
          >
            {playing ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
          </button>
          <button
            onClick={onNext}
            aria-label="Next track"
            className="rounded-full p-1.5 text-[var(--txt-soft)] transition-colors hover:text-[var(--txt)]"
          >
            <SkipForward size={18} />
          </button>
        </div>

<div className="flex w-full shrink-0 items-center justify-center gap-1.5 sm:gap-2">
          <Volume2 size={16} className="shrink-0 text-[var(--txt-faint)]" />
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={(e) => onVolumeChange(Number(e.target.value))}
            className="w-14 [accent-color:var(--acc)] sm:w-24 md:w-28"
            aria-label="Volume"
          />
        </div>
      </div>
    </div>
  );
}