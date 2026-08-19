// Audio player bottom bar: judul lagu (expandable), tracklist, kontrol play/prev/next, shuffle & repeat, volume, equalizer + loading state. Warna mengikuti theme via CSS vars.
"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ListMusic,
  Maximize2,
  Pause,
  Play,
  Repeat,
  Shuffle,
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

function LoadingSpinner() {
  return (
    <motion.span
      className="h-3.5 w-3.5 shrink-0 rounded-full border-2 border-[var(--acc)] border-t-transparent"
      animate={{ rotate: 360 }}
      transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
    />
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
  shuffle = false,
  repeat = "all",
  loading = false,
  onToggleShuffle,
  onToggleRepeat,
  onSelect,
}: {
  tracks: Track[];
  currentIndex: number;
  playing: boolean;
  onPrev: () => void;
  onNext: () => void;
  onToggle: () => void;
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
  volume: number;
  onVolumeChange: (volume: number) => void;
  theme?: string;
  shuffle?: boolean;
  repeat?: "off" | "one" | "all";
  loading?: boolean;
  onToggleShuffle?: () => void;
  onToggleRepeat?: () => void;
  onSelect?: (index: number) => void;
}) {
  const track = tracks[currentIndex];
  const [expandedTitle, setExpandedTitle] = useState(false);
  const [listOpen, setListOpen] = useState(false);
  const isLight = theme === "light";
  const panelStyle = {
    "--panel": isLight
      ? "linear-gradient(180deg, rgba(255,255,255,0.98), rgba(240,236,255,0.94))"
      : "linear-gradient(180deg, rgba(18,24,46,0.97), rgba(10,16,32,0.92))",
  } as React.CSSProperties;

  return (
    <div className="liquid-glass relative w-full overflow-visible rounded-2xl px-5 py-3.5 md:px-6">
      <AnimatePresence>
        {expandedTitle && (
          <motion.div
            key="expanded-title"
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="liquid-glass absolute bottom-full left-0 right-0 z-30 mb-2 rounded-2xl p-5"
            style={panelStyle}
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
                onClick={() => setExpandedTitle(false)}
                aria-label="Close full title"
                className="shrink-0 rounded-full bg-[var(--chip)] p-2 text-[var(--txt-soft)] transition-colors hover:text-[var(--txt)]"
              >
                <X size={14} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {listOpen && (
          <motion.div
            key="tracklist"
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="liquid-glass absolute bottom-full left-0 right-0 z-30 mb-2 max-h-[55vh] overflow-y-auto rounded-2xl p-2.5"
            style={panelStyle}
          >
            <div className="flex items-center justify-between px-2 pb-1 pt-1.5">
              <p className="text-[10px] uppercase tracking-widest text-[var(--txt-faint)] md:text-xs">
                Tracklist
              </p>
              <button
                onClick={() => setListOpen(false)}
                aria-label="Close tracklist"
                className="rounded-full bg-[var(--chip)] p-1.5 text-[var(--txt-soft)] transition-colors hover:text-[var(--txt)]"
              >
                <X size={13} />
              </button>
            </div>
            <ul className="flex flex-col gap-1">
              {tracks.map((t, i) => {
                const active = i === currentIndex;
                return (
                  <li key={t.src}>
                    <button
                      onClick={() => {
                        onSelect?.(i);
                        setListOpen(false);
                      }}
                      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors ${
                        active
                          ? "bg-[var(--chip)] ring-1 ring-[var(--acc)]"
                          : "hover:bg-[var(--chip)]"
                      }`}
                    >
                      <span
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-medium ${
                          active
                            ? "bg-gradient-to-br from-[var(--acc-from)] via-[var(--acc-mid)] to-[var(--acc-to)] text-[var(--acc-txt)]"
                            : "bg-[var(--chip)] text-[var(--txt-faint)] ring-1 ring-[var(--ring)]"
                        }`}
                      >
                        {i + 1}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span
                          className={`block truncate text-sm ${
                            active ? "text-[var(--acc)]" : "text-[var(--txt)]"
                          }`}
                        >
                          {t.title}
                        </span>
                        <span className="block truncate text-xs text-[var(--txt-soft)]">
                          {t.artist}
                        </span>
                      </span>
                      {active && (loading ? <LoadingSpinner /> : playing ? <EqualizerBars /> : <Play size={13} className="text-[var(--acc)]" />)}
                    </button>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
        <div className="min-w-0">
          <button
            onClick={() => setExpandedTitle((v) => !v)}
            className="group flex max-w-full items-center gap-1.5 text-left"
          >
            <span className="font-playfair truncate text-base italic tracking-tight text-[var(--txt)] md:text-lg">
              {track.title}
            </span>
            <Maximize2
              size={12}
              className="shrink-0 text-[var(--txt-faint)] transition-colors group-hover:text-[var(--acc)] md:hidden"
            />
            {loading ? <LoadingSpinner /> : playing ? <EqualizerBars /> : null}
          </button>
          <p className="truncate text-xs text-[var(--txt-soft)]">
            {track.artist}
          </p>
        </div>

        <div className="flex shrink-0 items-center justify-center gap-1 md:gap-2">
          <button
            onClick={onToggleShuffle}
            aria-label="Toggle shuffle"
            className={`rounded-full p-1.5 transition-colors ${
              shuffle
                ? "text-[var(--acc)]"
                : "text-[var(--txt-soft)] hover:text-[var(--txt)]"
            }`}
          >
            <Shuffle size={14} />
          </button>
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
          <button
            onClick={onToggleRepeat}
            aria-label="Toggle repeat"
            className={`relative rounded-full p-1.5 transition-colors ${
              repeat !== "off"
                ? "text-[var(--acc)]"
                : "text-[var(--txt-soft)] hover:text-[var(--txt)]"
            }`}
          >
            <Repeat size={14} />
            {repeat === "one" && (
              <span className="absolute -right-0.5 -top-0.5 flex h-3 w-3 items-center justify-center rounded-full bg-gradient-to-br from-[var(--acc-from)] to-[var(--acc-to)] text-[7px] font-bold text-[var(--acc-txt)]">
                1
              </span>
            )}
          </button>
        </div>

        <div className="flex w-full shrink-0 items-center justify-center gap-1.5 sm:gap-2">
          <button
            onClick={() => setListOpen((v) => !v)}
            aria-label="Open tracklist"
            className={`rounded-full p-1.5 transition-colors ${
              listOpen
                ? "text-[var(--acc)]"
                : "text-[var(--txt-soft)] hover:text-[var(--txt)]"
            }`}
          >
            <ListMusic size={16} />
          </button>
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