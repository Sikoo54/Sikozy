// Timer fokus study mode: ring progres, preset 15/25/50m + custom menit, tombol start/pause/reset, chime saat selesai.
"use client";

import { useState } from "react";
import { Pause, Play, RotateCcw, X } from "lucide-react";

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
  onClose,
}: {
  duration: number;
  remaining: number;
  running: boolean;
  done: boolean;
  onSetDuration: (seconds: number) => void;
  onToggle: () => void;
  onReset: () => void;
  onClose?: () => void;
}) {
  const progress = duration > 0 ? remaining / duration : 0;
  const dashOffset = RING_CIRCUMFERENCE * (1 - progress);
  const [custom, setCustom] = useState("");
  const isCustomActive =
    !PRESETS.includes(duration / 60) && duration === Math.round(Number(custom) * 60) && custom !== "";

  const applyCustom = () => {
    const m = Number(custom);
    if (!Number.isFinite(m) || m <= 0 || m > 180) {
      setCustom("");
      return;
    }
    onSetDuration(Math.round(m * 60));
  };

  return (
    <div className="liquid-glass rounded-3xl p-4 md:p-8">
      <div className="mb-4 flex items-center justify-between md:mb-5">
        <p className="text-[10px] uppercase tracking-widest text-[var(--txt-faint)] md:text-xs">
          Focus timer
        </p>
        <div className="flex items-center gap-2">
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
          {onClose && (
            <button
              onClick={onClose}
              aria-label="Close timer"
              className="rounded-full bg-[var(--chip)] p-1.5 text-[var(--txt-soft)] transition-colors hover:bg-[var(--btn-bg-hover)] hover:text-[var(--txt)]"
            >
              <X size={13} />
            </button>
          )}
        </div>
      </div>

      <div className="relative mx-auto h-[120px] w-[120px] md:h-[148px] md:w-[148px]">
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
            className={`font-playfair text-3xl tracking-tight text-[var(--txt)] md:text-5xl ${
              done ? "italic" : ""
            }`}
          >
            {done ? "Done" : formatTime(remaining)}
          </span>
          <span className="mt-0.5 hidden text-[10px] uppercase tracking-[0.2em] text-[var(--txt-faint)] md:mt-1 md:block">
            {done ? "Session complete" : "min : sec"}
          </span>
        </div>
      </div>

      <div className="mt-4 flex justify-center gap-1.5 md:mt-6 md:gap-2.5">
        {PRESETS.map((minutes) => (
          <button
            key={minutes}
            onClick={() => onSetDuration(minutes * 60)}
            className={`rounded-full px-2.5 py-1 text-[11px] font-medium transition-all md:px-4 md:py-1.5 md:text-xs ${
              duration === minutes * 60 && !done
                ? "bg-gradient-to-br from-[var(--acc-from)] via-[var(--acc-mid)] to-[var(--acc-to)] text-[var(--acc-txt)] shadow-[0_4px_16px_var(--glow)]"
                : "bg-[var(--chip)] text-[var(--txt-soft)] hover:bg-[var(--btn-bg-hover)] hover:text-[var(--txt)]"
            }`}
          >
            {minutes}m
          </button>
        ))}
        <label
          className={`flex items-center gap-0.5 rounded-full px-2 py-1 text-[11px] font-medium transition-all md:px-3 md:py-1.5 md:text-xs ${
            isCustomActive && !done
              ? "bg-gradient-to-br from-[var(--acc-from)] via-[var(--acc-mid)] to-[var(--acc-to)] text-[var(--acc-txt)] shadow-[0_4px_16px_var(--glow)]"
              : "bg-[var(--chip)] text-[var(--txt-soft)] hover:bg-[var(--btn-bg-hover)] hover:text-[var(--txt)]"
          }`}
        >
          <input
            type="number"
            inputMode="decimal"
            min={1}
            max={180}
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                applyCustom();
                e.currentTarget.blur();
              }
            }}
            onBlur={applyCustom}
            placeholder="Custom"
            aria-label="Custom minutes"
            className={`w-11 bg-transparent text-center outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none ${
              isCustomActive ? "text-[var(--acc-txt)]" : "text-[var(--txt)]"
            } placeholder:opacity-60`}
          />
          <span className={isCustomActive ? "opacity-80" : "opacity-50"}>
            m
          </span>
        </label>
      </div>

      <div className="mt-4 flex items-center justify-center gap-2 md:mt-6 md:gap-3">
        <button
          onClick={onToggle}
          disabled={done}
          className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-medium text-[var(--acc-txt)] shadow-[0_8px_24px_var(--glow)] transition-all md:gap-2 md:px-6 md:py-2.5 md:text-sm disabled:cursor-not-allowed disabled:opacity-40 ${
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
          className="rounded-full bg-[var(--chip)] p-2 text-[var(--txt-soft)] transition-colors hover:bg-[var(--btn-bg-hover)] hover:text-[var(--txt)] md:p-3"
        >
          <RotateCcw size={14} className="md:hidden" />
          <RotateCcw size={15} className="hidden md:block" />
        </button>
      </div>

      {done && (
        <p className="mt-4 hidden text-center font-playfair text-sm italic text-[var(--acc)] md:mt-5 md:block">
          Session complete — nice focus. Pick a task or start again.
        </p>
      )}
    </div>
  );
}