// Halaman utama Sikozy: flow stage home -> pilih theme -> pilih mood (chill/study) -> player. Mengelola state audio, timer focus, todo, dan video background.
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ListTodo,
  Music,
  Timer,
} from "lucide-react";
import AudioPlayer from "@/components/player/AudioPlayer";
import type { Track } from "@/components/player/AudioPlayer";
import FocusTimer from "@/components/player/FocusTimer";
import TodoPanel from "@/components/player/TodoPanel";
import type { Todo } from "@/components/player/TodoPanel";
import ShinyText from "@/components/ShinyText";

const HERO_VIDEO_URL =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260405_170732_8a9ccda6-5cff-4628-b164-059c500a2b41.mp4";
const DARK_VIDEO_URL =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4";
const LIGHT_VIDEO_URL =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260324_151826_c7218672-6e92-402c-9e45-f1e0f454bdc4.mp4";

const TRACKS: Track[] = [
  {
    title: "Luv (sic) pt2 Instrumentals",
    artist: "Nujabes",
    src: "/audio/Luv (sic) pt2 Instrumentals.mp3",
  },
  {
    title: "Feelings, Mutual",
    artist: "LJones — Music For Your Soul",
    src: "/audio/LJones - Feelings, Mutual - Music For Your Soul (128k).mp3",
  },
  {
    title: "愛密集 (Instrumental)",
    artist: "Yakkle, Shing02",
    src: "/audio/愛密集 (Instrumental).mp3",
  },
  {
    title: "Coffee House No. 5",
    artist: "Nightingale Lofi",
    src: "/audio/Coffee House No. 5.mp3",
  },
  {
    title: "Soul Below",
    artist: "LJones",
    src: "/audio/Ljones - Soul Below.mp3",
  },
  {
    title: "Mother's Heart",
    artist: "Unknown",
    src: "/audio/Mother's Heart.mp3",
  },
  {
    title: "Reflection Eternal",
    artist: "Nujabes",
    src: "/audio/Nujabes - reflection eternal [Official Audio].mp3",
  },
];

const STORAGE_KEY = "sikozy-todos";

const EASE = [0.16, 1, 0.3, 1] as const;

const THEME_VARS: Record<ThemeKey, Record<string, string>> = {
  classic: {
    "--panel": "rgba(10,16,32,0.45)",
    "--ring": "rgba(255,255,255,0.1)",
    "--txt": "#e1e0cc",
    "--txt-soft": "rgba(225,224,204,0.6)",
    "--txt-faint": "rgba(225,224,204,0.35)",
    "--acc": "#e8c58f",
    "--acc-from": "#f7ecd4",
    "--acc-mid": "#e8c58f",
    "--acc-to": "#d9a05f",
    "--acc-txt": "#000000",
    "--glow": "rgba(232,197,143,0.35)",
    "--btn-bg": "rgba(10,16,32,0.25)",
    "--btn-bg-hover": "rgba(10,16,32,0.4)",
    "--chip": "rgba(255,255,255,0.05)",
    "--track": "rgba(255,255,255,0.08)",
    "--shine": "rgba(255,255,255,0.1)",
  },
  dark: {
    "--panel": "rgba(10,16,32,0.5)",
    "--ring": "rgba(255,255,255,0.1)",
    "--txt": "#e1e0cc",
    "--txt-soft": "rgba(225,224,204,0.6)",
    "--txt-faint": "rgba(225,224,204,0.35)",
    "--acc": "#e8c58f",
    "--acc-from": "#f7ecd4",
    "--acc-mid": "#e8c58f",
    "--acc-to": "#d9a05f",
    "--acc-txt": "#000000",
    "--glow": "rgba(232,197,143,0.35)",
    "--btn-bg": "rgba(10,16,32,0.25)",
    "--btn-bg-hover": "rgba(10,16,32,0.4)",
    "--chip": "rgba(255,255,255,0.05)",
    "--track": "rgba(255,255,255,0.08)",
    "--shine": "rgba(255,255,255,0.1)",
  },
  light: {
    "--panel": "rgba(255,255,255,0.6)",
    "--ring": "rgba(30,44,80,0.18)",
    "--txt": "#1e2c50",
    "--txt-soft": "rgba(30,44,80,0.6)",
    "--txt-faint": "rgba(30,44,80,0.35)",
    "--acc": "#5e4a94",
    "--acc-from": "#8b7bd6",
    "--acc-mid": "#6b5bd6",
    "--acc-to": "#45369b",
    "--acc-txt": "#ffffff",
    "--glow": "rgba(107,91,214,0.35)",
    "--btn-bg": "rgba(255,255,255,0.45)",
    "--btn-bg-hover": "rgba(255,255,255,0.65)",
    "--chip": "rgba(30,44,80,0.07)",
    "--track": "rgba(30,44,80,0.14)",
    "--shine": "rgba(30,44,80,0.12)",
  },
};

const VantaClouds = dynamic(() => import("@/components/VantaClouds"), {
  ssr: false,
});

function playChime() {
  const ctx = new AudioContext();
  const now = ctx.currentTime;
  for (let i = 0; i < 3; i++) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = 880;
    gain.gain.setValueAtTime(0.0001, now + i * 0.35);
    gain.gain.exponentialRampToValueAtTime(0.15, now + i * 0.35 + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.35 + 0.3);
    osc.connect(gain).connect(ctx.destination);
    osc.start(now + i * 0.35);
    osc.stop(now + i * 0.35 + 0.35);
  }
}

type Stage = "home" | "theme" | "mood" | "player";
type ThemeKey = "classic" | "dark" | "light";
type MoodKey = "chill" | "study";

const THEMES: {
  key: ThemeKey;
  label: string;
  name: string;
  src: string;
  dot: string;
}[] = [
  {
    key: "classic",
    label: "Classic",
    name: "Original",
    src: HERO_VIDEO_URL,
    dot: "bg-[#e8c58f]",
  },
  {
    key: "dark",
    label: "Dark",
    name: "Night sky",
    src: DARK_VIDEO_URL,
    dot: "bg-sky-night ring-1 ring-white/30",
  },
  {
    key: "light",
    label: "Light",
    name: "Daylight",
    src: LIGHT_VIDEO_URL,
    dot: "bg-white ring-1 ring-white/50",
  },
];

const MOODS: {
  key: MoodKey;
  title: string;
  description: string;
  icon: React.ReactNode;
}[] = [
  {
    key: "chill",
    title: "Chill",
    description:
      "Just the music — relax, and let the beats play in the background.",
    icon: <Music size={28} />,
  },
  {
    key: "study",
    title: "Study",
    description:
      "Focus session — a timer and todo list keep your tasks on track while you work.",
    icon: <Timer size={28} />,
  },
];

export default function Page() {
  const [introDone, setIntroDone] = useState(false);
  const [stage, setStage] = useState<Stage>("home");
  const [selectedTheme, setSelectedTheme] = useState<ThemeKey | null>(null);
  const [themeVideo, setThemeVideo] = useState(HERO_VIDEO_URL);
  const [selectedMood, setSelectedMood] = useState<MoodKey | null>(null);
  const [showMobileTimer, setShowMobileTimer] = useState(false);
  const [showMobileTodo, setShowMobileTodo] = useState(false);

const audioRef = useRef<HTMLAudioElement>(null);

  const [trackIndex, setTrackIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState<"off" | "one" | "all">("all");

  const [todos, setTodos] = useState<Todo[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as Todo[]) : [];
    } catch {
      return [];
    }
  });

const [timerDuration, setTimerDuration] = useState(25 * 60);
  const [remaining, setRemaining] = useState(25 * 60);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerDone, setTimerDone] = useState(false);

  const todosRef = useRef(todos);
  useEffect(() => {
    todosRef.current = todos;
  }, [todos]);

  const sessionStartDoneIds = useRef<string[]>([]);
  const [sessionCompletedTodos, setSessionCompletedTodos] = useState<Todo[]>([]);
  const [summaryOpen, setSummaryOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = volume;
  }, [volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.play().catch(() => setPlaying(false));
    } else {
      audio.pause();
    }
  }, [playing, trackIndex]);

useEffect(() => {
    if (!timerRunning) return;
    if (remaining <= 0) return;
    const id = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          setTimerRunning(false);
          setTimerDone(true);
          setSessionCompletedTodos(
            todosRef.current.filter(
              (t) => t.done && !sessionStartDoneIds.current.includes(t.id)
            )
          );
          setSummaryOpen(true);
          playChime();
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [timerRunning, remaining]);

  const togglePlay = useCallback(() => setPlaying((p) => !p), []);
  const selectTrack = useCallback((i: number) => {
    setTrackIndex(i);
    setPlaying(true);
  }, []);
  const pickRandom = useCallback((exclude: number) => {
    if (TRACKS.length <= 1) return exclude;
    let i = exclude;
    while (i === exclude) i = Math.floor(Math.random() * TRACKS.length);
    return i;
  }, []);
  const nextTrack = useCallback(() => {
    if (shuffle) setTrackIndex((i) => pickRandom(i));
    else setTrackIndex((i) => (i + 1) % TRACKS.length);
  }, [shuffle, pickRandom]);
  const prevTrack = useCallback(() => {
    if (shuffle) setTrackIndex((i) => pickRandom(i));
    else setTrackIndex((i) => (i - 1 + TRACKS.length) % TRACKS.length);
  }, [shuffle, pickRandom]);
  const handleEnded = useCallback(() => {
    if (repeat === "one") {
      const audio = audioRef.current;
      if (audio) {
        audio.currentTime = 0;
        audio.play().catch(() => setPlaying(false));
      }
      return;
    }
    if (repeat === "off" && trackIndex === TRACKS.length - 1) {
      setPlaying(false);
      return;
    }
    if (shuffle) {
      setTrackIndex((i) => pickRandom(i));
      setPlaying(true);
    } else {
      setTrackIndex((i) => (i + 1) % TRACKS.length);
    }
  }, [repeat, shuffle, trackIndex, pickRandom]);
  const toggleShuffle = useCallback(() => setShuffle((s) => !s), []);
  const toggleRepeat = useCallback(
    () =>
      setRepeat((r) => (r === "off" ? "all" : r === "all" ? "one" : "off")),
    []
  );

  const setTimerDurationSafe = useCallback((seconds: number) => {
    setTimerDuration(seconds);
    setRemaining(seconds);
    setTimerRunning(false);
    setTimerDone(false);
    setSummaryOpen(false);
    setSessionCompletedTodos([]);
    sessionStartDoneIds.current = [];
  }, []);
  const toggleTimer = useCallback(() => {
    if (timerDone) return;
    setTimerRunning((r) => {
      if (!r) sessionStartDoneIds.current = todos.filter((t) => t.done).map((t) => t.id);
      return !r;
    });
  }, [timerDone, todos]);
  const resetTimer = useCallback(() => {
    setTimerRunning(false);
    setTimerDone(false);
    setRemaining(timerDuration);
    setSummaryOpen(false);
    setSessionCompletedTodos([]);
    sessionStartDoneIds.current = [];
  }, [timerDuration]);

  const addTodo = useCallback((text: string) => {
    setTodos((prev) => [
      ...prev,
      {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        text,
        done: false,
      },
    ]);
  }, []);
  const toggleTodo = useCallback((id: string) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  }, []);
  const removeTodo = useCallback((id: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const handleThemeNext = useCallback(() => {
    if (!selectedTheme) return;
    const theme = THEMES.find((t) => t.key === selectedTheme);
    if (!theme) return;
    setThemeVideo(theme.src);
    setStage("mood");
  }, [selectedTheme]);

const handleMoodNext = useCallback(() => {
    if (!selectedMood) return;
    setStage("player");
    setPlaying(true);
  }, [selectedMood]);

  return (
    <>
      <AnimatePresence>
        {!introDone && (
          <motion.div
            key="intro"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, delay: 1.4, ease: "easeInOut" }}
            onAnimationStart={() => setIntroDone(true)}
            onAnimationComplete={() => setIntroDone(true)}
          >
            <motion.span
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
              className="relative inline-block pb-[0.18em] font-playfair text-6xl tracking-[-0.02em] text-primary md:text-8xl"
            >
              Sikozy
              <ShinyText
                text="Sikozy"
                className="absolute inset-0 inline-block font-playfair text-6xl tracking-[-0.02em] md:text-8xl"
              />
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>

<audio
        ref={audioRef}
        src={TRACKS[trackIndex].src}
        preload="auto"
        onLoadStart={() => setLoading(true)}
        onWaiting={() => setLoading(true)}
        onCanPlay={() => setLoading(false)}
        onPlaying={() => setLoading(false)}
        onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onEnded={handleEnded}
      />

      <section className="relative h-dvh overflow-hidden overscroll-none bg-sky-night">
        <VantaClouds
          className="pointer-events-none absolute inset-0"
          theme={selectedTheme ?? "classic"}
        />

        <motion.video
          key={themeVideo}
          src={themeVideo}
          className={`absolute left-1/2 top-1/2 aspect-video w-full max-w-4xl -translate-x-1/2 -translate-y-1/2 object-cover transition-opacity duration-500 [mask-image:radial-gradient(ellipse_at_center,black_55%,transparent_100%)] ${
            stage === "theme" || stage === "mood" ? "opacity-0" : "opacity-100"
          }`}
          autoPlay
          loop
          muted
          playsInline
        />

        {stage === "home" && (
          <motion.div
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative z-10 flex h-full flex-col items-center justify-between px-6 pt-20 pb-3 md:py-24"
          >
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={introDone ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.5, ease: EASE }}
            >
              <span className="relative inline-block bg-gradient-to-br from-[#f7ecd4] via-[#e8c58f] to-[#d9a05f] bg-clip-text pb-[0.18em] font-playfair text-6xl leading-[0.9] tracking-[-0.03em] text-transparent drop-shadow-[0_2px_20px_rgba(217,160,95,0.3)] md:text-8xl">
                Sikozy
                <ShinyText
                  text="Sikozy"
                  className="absolute inset-0 inline-block font-playfair text-6xl leading-[0.9] tracking-[-0.03em] md:text-8xl"
                />
</span>
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={introDone ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.8, ease: EASE }}
              className="mt-5 text-center font-playfair text-sm italic tracking-wide text-white/50 md:text-lg"
            >
              lofi hiphop for your soul
            </motion.p>

            <motion.button
              onClick={() => setStage("theme")}
              initial={{ opacity: 0, y: 20 }}
              animate={introDone ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.65, ease: EASE }}
              className="group mb-16 flex items-center gap-2 rounded-full bg-primary py-2 pl-6 pr-2 text-sm font-medium text-black shadow-[0_8px_32px_rgba(0,0,0,0.35)] transition-all hover:gap-3 sm:text-base md:mb-0"
            >
              Play music
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black transition-transform group-hover:scale-110 sm:h-10 sm:w-10">
                <ArrowRight size={18} className="text-primary" />
              </span>
            </motion.button>
          </motion.div>
        )}

        <AnimatePresence>
          {stage === "theme" && (
            <motion.div
              key="theme"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 z-20 flex items-center justify-center bg-black/70"
            >
              <div className="w-full max-w-4xl p-4 py-6 md:p-6">
                <h2 className="text-center text-xl tracking-tight text-white md:text-5xl">
                  Choose your{" "}
                  <em
                    className="text-white/40"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    theme
                  </em>
                </h2>

                <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-2 md:mt-10 md:grid-cols-3 md:gap-6">
                  {THEMES.map((t, i) => (
                    <motion.button
                      key={t.key}
                      onClick={() => setSelectedTheme(t.key)}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, ease: EASE }}
                      className={`group relative overflow-hidden rounded-2xl text-left transition-all md:rounded-3xl ${
                        i === 2
                          ? "col-span-2 mx-auto w-[calc(50%-4px)] sm:col-span-1 sm:mx-0 sm:w-auto md:col-span-1"
                          : ""
                      } ${
                        selectedTheme === t.key
                          ? "ring-2 ring-primary"
                          : "ring-1 ring-white/10 hover:ring-white/30"
                      }`}
                    >
                      <div className="relative aspect-video overflow-hidden">
                        <video
                          src={t.src}
                          className="h-full w-full object-cover"
                          muted
                          autoPlay
                          loop
                          playsInline
                          preload="auto"
                        />
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <span className="absolute left-2 top-1.5 text-[9px] font-medium tracking-tight text-white drop-shadow md:hidden">
                          {t.name}
                        </span>
                        <span
                          className={`absolute right-1.5 top-1.5 h-2.5 w-2.5 rounded-full md:hidden ${t.dot} ${
                            selectedTheme === t.key ? "ring-1 ring-primary" : ""
                          }`}
                        />
                      </div>
                      <div className="hidden items-center justify-between p-5 md:flex">
                        <div>
                          <p className="text-xs uppercase tracking-widest text-white/40">
                            {t.label}
                          </p>
                          <p className="mt-1 text-xl tracking-tight text-white">
                            {t.name}
                          </p>
                        </div>
                        <span
                          className={`h-4 w-4 rounded-full ${t.dot} ${
                            selectedTheme === t.key ? "ring-2 ring-primary" : ""
                          }`}
                        />
                      </div>
                    </motion.button>
                  ))}
                </div>

                <div className="mt-6 flex justify-center md:mt-10">
                  <button
                    onClick={handleThemeNext}
                    disabled={!selectedTheme}
                    className={`group flex items-center gap-2 rounded-full py-1.5 pl-4 pr-1.5 text-xs font-medium transition-all sm:text-base md:py-2 md:pl-6 md:pr-2 ${
                      selectedTheme
                        ? "bg-primary text-black shadow-[0_8px_32px_rgba(0,0,0,0.35)] hover:gap-3"
                        : "cursor-not-allowed bg-white/10 text-white/30"
                    }`}
                  >
                    Next
                    <span
                      className={`flex h-7 w-7 items-center justify-center rounded-full md:h-10 md:w-10 ${
                        selectedTheme ? "bg-black" : "bg-white/10"
                      }`}
                    >
                      <ArrowRight
                        size={16}
                        className={
                          selectedTheme ? "text-primary" : "text-white/30"
                        }
                      />
                    </span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {stage === "mood" && (
            <motion.div
              key="mood"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 z-20 flex items-center justify-center bg-black/70"
            >
              <div className="w-full max-w-3xl p-4 py-6 md:p-6">
                <h2 className="text-center text-xl tracking-tight text-white md:text-5xl">
                  Choose your{" "}
                  <em
                    className="text-white/40"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    mood
                  </em>
                </h2>

                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 md:mt-10 md:gap-6">
                  {MOODS.map((m) => (
                    <motion.button
                      key={m.key}
                      onClick={() => setSelectedMood(m.key)}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, ease: EASE }}
                      className={`liquid-glass flex flex-col items-start gap-3 rounded-3xl p-4 text-left transition-all md:gap-6 md:p-8 ${
                        selectedMood === m.key
                          ? "ring-2 ring-primary"
                          : "ring-1 ring-white/10 hover:ring-white/30"
                      }`}
                    >
                      <span
                        className={`flex h-10 w-10 items-center justify-center rounded-2xl md:h-14 md:w-14 ${
                          selectedMood === m.key
                            ? "bg-primary text-black"
                            : "bg-white/5 text-primary"
                        }`}
                      >
                        {m.icon}
                      </span>
                      <div>
                        <h3 className="text-base tracking-tight text-white md:text-2xl">
                          {m.title}
                        </h3>
                        <p className="mt-1 text-xs leading-relaxed text-white/50 md:mt-2 md:text-sm">
                          {m.description}
                        </p>
                      </div>
                      {selectedMood === m.key && (
                        <ListTodo className="absolute right-5 top-5 h-4 w-4 text-primary md:h-5 md:w-5" />
                      )}
                    </motion.button>
                  ))}
                </div>

                <div className="mt-6 flex justify-center gap-3 md:mt-10">
                  <button
                    onClick={() => setStage("theme")}
                    className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-medium text-white/70 transition-colors hover:text-white md:px-6 md:py-2 md:text-sm"
                  >
                    <ArrowLeft size={14} />
                    Theme
                  </button>
                  <button
                    onClick={handleMoodNext}
                    disabled={!selectedMood}
                    className={`group flex items-center gap-2 rounded-full py-1.5 pl-4 pr-1.5 text-xs font-medium transition-all md:py-2 md:pl-6 md:pr-2 md:text-sm ${
                      selectedMood
                        ? "bg-primary text-black shadow-[0_8px_32px_rgba(0,0,0,0.35)] hover:gap-3"
                        : "cursor-not-allowed bg-white/10 text-white/30"
                    }`}
                  >
                    Next
                    <span
                      className={`flex h-7 w-7 items-center justify-center rounded-full md:h-10 md:w-10 ${
                        selectedMood ? "bg-black" : "bg-white/10"
                      }`}
                    >
                      <ArrowRight
                        size={18}
                        className={
                          selectedMood ? "text-primary" : "text-white/30"
                        }
                      />
                    </span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {stage === "player" && (
            <motion.div
              key="player"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.5, ease: EASE }}
              className="absolute inset-0 z-20"
              style={THEME_VARS[selectedTheme ?? "classic"] as React.CSSProperties}
            >
              <button
                onClick={() => setStage("theme")}
                className="liquid-glass absolute right-4 top-4 z-30 flex items-center gap-2 rounded-full bg-[var(--btn-bg)] px-4 py-2 text-sm text-[var(--txt)] backdrop-blur-md ring-1 ring-[var(--ring)] transition-colors hover:bg-[var(--btn-bg-hover)] md:right-6 md:top-6"
              >
                Customize
                <ArrowRight size={16} className="rotate-90" />
              </button>
              <button
                onClick={() => setStage("home")}
                className="liquid-glass absolute left-4 top-4 z-30 flex items-center gap-2 rounded-full bg-[var(--btn-bg)] px-4 py-2 text-sm text-[var(--txt)] backdrop-blur-md ring-1 ring-[var(--ring)] transition-colors hover:bg-[var(--btn-bg-hover)] md:left-6 md:top-6"
              >
                <ArrowLeft size={16} />
                Back to home
              </button>

              {selectedMood === "study" && (
                <>
                  <div className="absolute left-4 top-1/2 z-20 hidden w-60 -translate-y-1/2 md:left-[calc((50%-min(448px,50vw)-288px)/2)] md:block md:w-72">
                    <FocusTimer
                      duration={timerDuration}
                      remaining={remaining}
                      running={timerRunning}
                      done={timerDone}
                      onSetDuration={setTimerDurationSafe}
                      onToggle={toggleTimer}
                      onReset={resetTimer}
                    />
                  </div>
                  <div className="absolute right-4 top-1/2 z-20 hidden w-60 -translate-y-1/2 md:right-[calc((50%-min(448px,50vw)-288px)/2)] md:block md:w-72">
                    <TodoPanel
                      todos={todos}
                      timerActive={timerRunning || timerDone}
                      onAdd={addTodo}
                      onToggle={toggleTodo}
                      onRemove={removeTodo}
                    />
                  </div>
                </>
              )}

              <div className="absolute inset-x-0 bottom-0 z-20 px-4 pb-4 md:px-6 md:pb-6">
                <div className="mx-auto w-full max-w-4xl space-y-2.5">
                  {selectedMood === "study" && (
                    <div className="md:hidden">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setShowMobileTimer((v) => !v)}
                          className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-medium ring-1 transition-all ${
                            showMobileTimer
                              ? "bg-[var(--acc)] text-[var(--acc-txt)] ring-transparent"
                              : "bg-[var(--chip)] text-[var(--txt-soft)] ring-[var(--ring)]"
                          }`}
                        >
                          <Timer size={13} />
                          Timer
                        </button>
                        <button
                          onClick={() => setShowMobileTodo((v) => !v)}
                          className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-medium ring-1 transition-all ${
                            showMobileTodo
                              ? "bg-[var(--acc)] text-[var(--acc-txt)] ring-transparent"
                              : "bg-[var(--chip)] text-[var(--txt-soft)] ring-[var(--ring)]"
                          }`}
                        >
                          <ListTodo size={13} />
                          Todo
                        </button>
                      </div>
                      <AnimatePresence initial={false}>
                        {showMobileTimer && (
                          <motion.div
                            key="mobile-timer"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: EASE }}
                            className="overflow-hidden"
                            style={{
                              "--panel":
                                selectedTheme === "light"
                                  ? "linear-gradient(180deg, rgba(255,255,255,0.98), rgba(240,236,255,0.94))"
                                  : "linear-gradient(180deg, rgba(18,24,46,0.97), rgba(10,16,32,0.92))",
                            } as React.CSSProperties}
                          >
                            <div className="pt-2.5">
                              <FocusTimer
                                duration={timerDuration}
                                remaining={remaining}
                                running={timerRunning}
                                done={timerDone}
                                onSetDuration={setTimerDurationSafe}
                                onToggle={toggleTimer}
                                onReset={resetTimer}
                                onClose={() => setShowMobileTimer(false)}
                              />
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                      <AnimatePresence initial={false}>
                        {showMobileTodo && (
                          <motion.div
                            key="mobile-todo"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: EASE }}
                            className="overflow-hidden"
                            style={{
                              "--panel":
                                selectedTheme === "light"
                                  ? "linear-gradient(180deg, rgba(255,255,255,0.98), rgba(240,236,255,0.94))"
                                  : "linear-gradient(180deg, rgba(18,24,46,0.97), rgba(10,16,32,0.92))",
                            } as React.CSSProperties}
                          >
                            <div className="pt-2.5">
                              <TodoPanel
                                todos={todos}
                                timerActive={timerRunning || timerDone}
                                onAdd={addTodo}
                                onToggle={toggleTodo}
                                onRemove={removeTodo}
                                onClose={() => setShowMobileTodo(false)}
                              />
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}
                  <AudioPlayer
                    tracks={TRACKS}
                    currentIndex={trackIndex}
                    playing={playing}
                    onSelect={selectTrack}
                    onPrev={prevTrack}
                    onNext={nextTrack}
                    onToggle={togglePlay}
                    currentTime={currentTime}
                    duration={duration}
                    onSeek={(t) => {
                      if (audioRef.current) audioRef.current.currentTime = t;
                    }}
volume={volume}
                    onVolumeChange={setVolume}
                    theme={selectedTheme ?? "classic"}
                    shuffle={shuffle}
                    repeat={repeat}
                    loading={loading}
                    onToggleShuffle={toggleShuffle}
                    onToggleRepeat={toggleRepeat}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      <AnimatePresence>
          {summaryOpen && selectedMood === "study" && (
            <motion.div
              key="summary"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 z-40 flex items-center justify-center bg-black/60 p-6"
            >
              <motion.div
                initial={{ scale: 0.94, y: 12, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.94, y: 12, opacity: 0 }}
                transition={{ duration: 0.35, ease: EASE }}
                className="liquid-glass w-full max-w-sm rounded-3xl p-6 text-center md:p-8"
                style={
                  {
                    "--panel":
                      selectedTheme === "light"
                        ? "linear-gradient(180deg, rgba(255,255,255,0.98), rgba(240,236,255,0.96))"
                        : "linear-gradient(180deg, rgba(18,24,46,0.98), rgba(10,16,32,0.94))",
                  } as React.CSSProperties
                }
              >
                <p className="text-xs uppercase tracking-widest text-[var(--txt-faint)]">
                  Session complete
                </p>
                <p className="mt-2 font-playfair text-2xl italic tracking-tight text-[var(--acc)] md:text-3xl">
                  {Math.round(timerDuration / 60)} minutes focused
                </p>

                {sessionCompletedTodos.length > 0 ? (
                  <>
                    <p className="mt-5 text-xs uppercase tracking-widest text-[var(--txt-faint)]">
                      Tasks completed this session
                    </p>
                    <ul className="mt-3 flex flex-col gap-2">
                      {sessionCompletedTodos.map((t) => (
                        <li
                          key={t.id}
                          className="flex items-center gap-2 rounded-xl bg-[var(--chip)] px-3 py-2 text-left text-sm text-[var(--txt)] ring-1 ring-[var(--ring)]"
                        >
                          <Check size={14} className="shrink-0 text-[var(--acc)]" />
                          <span className="truncate">{t.text}</span>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <p className="mt-4 text-sm text-[var(--txt-soft)]">
                    No tasks completed this session — next time!
                  </p>
                )}

                <div className="mt-6 flex justify-center gap-3">
                  <button
                    onClick={() => setSummaryOpen(false)}
                    className="rounded-full bg-[var(--chip)] px-5 py-2 text-sm font-medium text-[var(--txt-soft)] ring-1 ring-[var(--ring)] transition-colors hover:text-[var(--txt)]"
                  >
                    Nice
                  </button>
                  <button
                    onClick={() => {
                      resetTimer();
                    }}
                    className="rounded-full bg-gradient-to-br from-[var(--acc-from)] via-[var(--acc-mid)] to-[var(--acc-to)] px-5 py-2 text-sm font-medium text-[var(--acc-txt)] shadow-[0_8px_24px_var(--glow)] transition-transform hover:scale-105"
                  >
                    Start again
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </>
  );
}