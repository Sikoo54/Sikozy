"use client";

import { motion } from "framer-motion";
import { Pause, Play, SkipBack, SkipForward, Volume2 } from "lucide-react";

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
}) {
  const track = tracks[currentIndex];

  return (
    <div className="liquid-glass w-full rounded-2xl px-5 py-3.5 md:px-6">
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-playfair truncate text-base italic tracking-tight text-[var(--txt)] md:text-lg">
              {track.title}
            </p>
            {playing && <EqualizerBars />}
          </div>
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

        <div className="hidden w-full shrink-0 items-center justify-end gap-2 sm:flex">
          <Volume2 size={16} className="shrink-0 text-[var(--txt-faint)]" />
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={(e) => onVolumeChange(Number(e.target.value))}
            className="w-24 [accent-color:var(--acc)] md:w-28"
            aria-label="Volume"
          />
        </div>
      </div>

      <div className="mt-2.5 flex items-center gap-3">
        <input
          type="range"
          min={0}
          max={duration || 0}
          step={0.1}
          value={currentTime}
          onChange={(e) => onSeek(Number(e.target.value))}
          className="min-w-0 flex-1 [accent-color:var(--acc)]"
          aria-label="Seek"
        />
        <span className="shrink-0 text-[11px] tabular-nums text-[var(--txt-faint)] md:text-xs">
          {formatTime(currentTime)} / {formatTime(duration)}
        </span>
      </div>
    </div>
  );
}