"use client";

import { Pause, Play, RotateCcw } from "lucide-react";

const PRESETS = [15, 25, 50];
const RING_RADIUS = 62;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

function formatTime(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60);
  const s = Math.floor(totalSeconds % 60);
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export default function FocusTimer({
  duration,
  remaining,
  running,
  done,
  onSetDuration,
  onToggle,
  onReset,
}: {
  duration: number;
  remaining: number;
  running: boolean;
  done: boolean;
  onSetDuration: (seconds: number) => void;
  onToggle: () => void;
  onReset: () => void;
}) {
  const progress = duration > 0 ? remaining / duration : 0;
  const dashOffset = RING_CIRCUMFERENCE * (1 - progress);

  return (
    <div className="liquid-glass rounded-3xl p-6 md:p-8">
      <div className="mb-5 flex items-center justify-between">
        <p className="text-xs uppercase tracking-widest text-[var(--txt-faint)]">
          Focus timer
        </p>
        {running && (
          <span className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--acc)] opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--acc)]" />
            </span>
            <span className="text-[10px] uppercase tracking-widest text-[var(--acc)]">
              In session
            </span>
          </span>
        )}
      </div>

      <div className="relative mx-auto h-[148px] w-[148px] md:h-[164px] md:w-[164px]">
        <svg
          viewBox="0 0 148 148"
          className="h-full w-full -rotate-90"
          aria-hidden
        >
          <circle
            cx="74"
            cy="74"
            r={RING_RADIUS}
            fill="none"
            stroke="var(--track)"
            strokeWidth="4"
          />
          <circle
            cx="74"
            cy="74"
            r={RING_RADIUS}
            fill="none"
            stroke="url(#timerGradient)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={RING_CIRCUMFERENCE}
            strokeDashoffset={dashOffset}
            className="transition-[stroke-dashoffset] duration-1000 ease-linear"
          />
          <defs>
            <linearGradient id="timerGradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="var(--acc-from)" />
              <stop offset="50%" stopColor="var(--acc-mid)" />
              <stop offset="100%" stopColor="var(--acc-to)" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className={`font-playfair text-4xl tracking-tight text-[var(--txt)] md:text-5xl ${
              done ? "italic" : ""
            }`}
          >
            {done ? "Done" : formatTime(remaining)}
          </span>
          <span className="mt-1 text-[10px] uppercase tracking-[0.2em] text-[var(--txt-faint)]">
            {done ? "Session complete" : "min : sec"}
          </span>
        </div>
      </div>

      <div className="mt-6 flex justify-center gap-2.5">
        {PRESETS.map((minutes) => (
          <button
            key={minutes}
            onClick={() => onSetDuration(minutes * 60)}
            className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all ${
              duration === minutes * 60 && !done
                ? "bg-gradient-to-br from-[var(--acc-from)] via-[var(--acc-mid)] to-[var(--acc-to)] text-[var(--acc-txt)] shadow-[0_4px_16px_var(--glow)]"
                : "bg-[var(--chip)] text-[var(--txt-soft)] hover:bg-[var(--btn-bg-hover)] hover:text-[var(--txt)]"
            }`}
          >
            {minutes}m
          </button>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-center gap-3">
        <button
          onClick={onToggle}
          disabled={done}
          className={`flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-medium text-[var(--acc-txt)] shadow-[0_8px_24px_var(--glow)] transition-all disabled:cursor-not-allowed disabled:opacity-40 ${
            running
              ? "bg-[var(--acc)] hover:brightness-110"
              : "bg-gradient-to-br from-[var(--acc-from)] via-[var(--acc-mid)] to-[var(--acc-to)] hover:brightness-110"
          }`}
        >
          {running ? <Pause size={16} /> : <Play size={16} />}
          {running ? "Pause" : done ? "Done" : "Start"}
        </button>
        <button
          onClick={onReset}
          aria-label="Reset timer"
          className="rounded-full bg-[var(--chip)] p-3 text-[var(--txt-soft)] transition-colors hover:bg-[var(--btn-bg-hover)] hover:text-[var(--txt)]"
        >
          <RotateCcw size={15} />
        </button>
      </div>

      {done && (
        <p className="mt-5 text-center font-playfair text-sm italic text-[var(--acc)]">
          Session complete — nice focus. Pick a task or start again.
        </p>
      )}
    </div>
  );
}