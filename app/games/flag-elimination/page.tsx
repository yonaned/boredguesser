"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { Bricolage_Grotesque } from "next/font/google";
import {
  ArrowLeft,
  ArrowClockwise,
  Trophy,
  Timer,
  Check,
  EyeSlash,
  Eye,
  Sparkle,
} from "@phosphor-icons/react";
// @ts-expect-error canvas-confetti untyped import
import confetti from "canvas-confetti";
import { ALL_FLAGS, WorldFlag } from "./countries";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const CONTINENTS = ["All", "Europe", "Asia", "Africa", "Americas", "Oceania"] as const;

export default function FlagEliminationPage() {
  const [selectedContinent, setSelectedContinent] = useState<string>("All");
  const [inputValue, setInputValue] = useState("");
  const [eliminatedCodes, setEliminatedCodes] = useState<Set<string>>(new Set());
  const [hideEliminated, setHideEliminated] = useState(false);
  const [lastEliminated, setLastEliminated] = useState<WorldFlag | null>(null);
  const [timeLeft, setTimeLeft] = useState(900); // 15-minute countdown (in seconds)
  const [isGameOver, setIsGameOver] = useState(false);
  const [isTimerRunning, setIsTimerRunning] = useState(true);

  const inputRef = useRef<HTMLInputElement>(null);

  // Active pool filtered by selected continent
  const activePool = useMemo(() => {
    if (selectedContinent === "All") return ALL_FLAGS;
    return ALL_FLAGS.filter((f) => f.continent === selectedContinent);
  }, [selectedContinent]);

  const remainingCount = activePool.length - eliminatedCodes.size;
  const progressPercent = Math.round((eliminatedCodes.size / activePool.length) * 100) || 0;

  // Countdown timer effect
  useEffect(() => {
    if (!isTimerRunning || timeLeft <= 0 || isGameOver) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsGameOver(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft, isTimerRunning, isGameOver]);

  const restartGame = () => {
    setEliminatedCodes(new Set());
    setInputValue("");
    setLastEliminated(null);
    setTimeLeft(900);
    setIsGameOver(false);
    setIsTimerRunning(true);
    inputRef.current?.focus();
  };

  // Instant typing elimination handler
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isGameOver) return;
    const value = e.target.value;
    setInputValue(value);

    const normalized = value.trim().toLowerCase();
    if (!normalized) return;

    // Check against active, non-eliminated countries in this continent view
    const matched = activePool.find(
      (country) =>
        !eliminatedCodes.has(country.code) &&
        (country.name.toLowerCase() === normalized ||
          country.aliases.includes(normalized))
    );

    if (matched) {
      const nextSet = new Set(eliminatedCodes).add(matched.code);
      setEliminatedCodes(nextSet);
      setLastEliminated(matched);
      setInputValue(""); // Instantly clear input on match

      if (nextSet.size === activePool.length) {
        setIsGameOver(true);
        setIsTimerRunning(false);
        confetti({
          particleCount: 160,
          spread: 80,
          origin: { y: 0.5 },
        });
      }
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div className={`${bricolage.className} min-h-screen bg-[#f0f3e8] text-[#1c1e1d] pb-24`}>
      {/* Top Header */}
      <header className="px-4 py-6 md:px-12 border-b border-[#1a1a1a]/10 bg-white/40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link
            href="/dashboard"
            className="group flex items-center gap-2 text-[#4a5048] hover:text-[#1a1a1a] text-sm font-medium transition-colors"
          >
            <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" />
            <span>Back to Games</span>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">
            BoredGuesser<span className="text-[#ff1a53]">.</span>
          </h1>
        </div>
      </header>

      {/* Sticky Controller & Typing Bar */}
      <div className="sticky top-0 z-40 bg-[#f0f3e8]/95 backdrop-blur-md border-b border-[#1a1a1a]/15 px-4 py-4 md:px-12 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col gap-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                <span>World Flags Elimination</span>
                <span className="text-xs bg-[#ff1a53] text-white px-2.5 py-0.5 rounded-full font-bold">
                  {remainingCount} Left
                </span>
              </h2>
              <p className="text-xs text-[#555a53] hidden sm:block">
                Type any country name. Matching flags get eliminated instantly from the board.
              </p>
            </div>

            {/* Quick Stats */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-white/80 border border-[#1a1a1a]/15 px-4 py-2 rounded-2xl text-xs font-semibold">
                <Trophy size={18} className="text-[#ff1a53]" />
                <span>
                  {eliminatedCodes.size} / {activePool.length} ({progressPercent}%)
                </span>
              </div>

              <div className="flex items-center gap-2 bg-white/80 border border-[#1a1a1a]/15 px-4 py-2 rounded-2xl text-xs font-semibold">
                <Timer size={18} className="text-[#1a1a1a]" />
                <span className="font-mono">{formatTime(timeLeft)}</span>
              </div>

              <button
                onClick={() => setHideEliminated(!hideEliminated)}
                className="flex items-center gap-1.5 bg-white/80 hover:bg-white border border-[#1a1a1a]/15 px-3 py-2 rounded-2xl text-xs font-semibold transition-colors cursor-pointer"
                title="Toggle hidden eliminated flags"
              >
                {hideEliminated ? <Eye size={16} /> : <EyeSlash size={16} />}
                <span className="hidden sm:inline">
                  {hideEliminated ? "Show Eliminated" : "Hide Eliminated"}
                </span>
              </button>

              <button
                onClick={restartGame}
                className="p-2 rounded-2xl bg-[#1a1a1a] hover:bg-black text-white transition-colors cursor-pointer"
                title="Restart Game"
              >
                <ArrowClockwise size={18} />
              </button>
            </div>
          </div>

          {/* Input Bar & Notification */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            <div className="md:col-span-8 relative">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                disabled={isGameOver}
                autoFocus
                placeholder="Type country name (e.g. France, Japan, Brazil, Ethiopia)..."
                className="w-full px-6 py-3.5 rounded-full border border-[#1a1a1a] bg-white text-base font-medium outline-none focus:ring-2 focus:ring-[#ff1a53] shadow-sm transition-all placeholder:text-[#8a8f88]"
              />
            </div>

            {/* Indicator of Most Recently Eliminated Country */}
            <div className="md:col-span-4 flex items-center justify-between sm:justify-start gap-2 bg-white/70 border border-[#1a1a1a]/15 px-4 py-2.5 rounded-full text-xs font-semibold">
              <span className="text-[#555a53] uppercase tracking-wider text-[10px]">Last:</span>
              {lastEliminated ? (
                <div className="flex items-center gap-2 text-emerald-700 animate-fadeIn">
                  <Check size={14} weight="bold" />
                  <span className="font-bold text-[#1a1a1a] truncate">{lastEliminated.name}</span>
                  <span className="text-[10px] text-emerald-600 font-mono">Eliminated!</span>
                </div>
              ) : (
                <span className="text-stone-400">Start typing...</span>
              )}
            </div>
          </div>

          {/* Continent Filter Bar */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            {CONTINENTS.map((cont) => (
              <button
                key={cont}
                onClick={() => {
                  setSelectedContinent(cont);
                  setEliminatedCodes(new Set());
                  setLastEliminated(null);
                }}
                className={`px-3.5 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  selectedContinent === cont
                    ? "bg-[#1a1a1a] text-white border border-[#1a1a1a]"
                    : "bg-white/60 text-[#4a5048] border border-[#1a1a1a]/20 hover:border-[#1a1a1a]"
                }`}
              >
                {cont}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Flags Grid */}
      <main className="max-w-7xl mx-auto px-4 md:px-12 mt-8">
        {/* Victory Celebration Card */}
        {isGameOver && eliminatedCodes.size === activePool.length && (
          <div className="mb-8 bg-emerald-500 text-white rounded-3xl p-8 text-center space-y-3 shadow-xl">
            <Sparkle size={48} weight="fill" className="mx-auto" />
            <h3 className="text-3xl font-extrabold">All Flags Eliminated!</h3>
            <p className="text-sm text-emerald-100 max-w-md mx-auto">
              Incredible knowledge! You cleared all {activePool.length} flags with{" "}
              {formatTime(timeLeft)} remaining.
            </p>
            <button
              onClick={restartGame}
              className="mt-2 bg-[#1a1a1a] hover:bg-black text-white px-6 py-2.5 rounded-full text-sm font-semibold transition-colors inline-flex items-center gap-2 cursor-pointer"
            >
              <ArrowClockwise size={16} />
              <span>Play Again</span>
            </button>
          </div>
        )}

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 sm:gap-4">
          {activePool.map((country) => {
            const isEliminated = eliminatedCodes.has(country.code);

            if (hideEliminated && isEliminated) {
              return null;
            }

            const flagSvgUrl = `https://flagcdn.com/${country.code.toLowerCase()}.svg`;

            return (
              <div
                key={country.code}
                className={`relative flex flex-col items-center justify-between p-2 rounded-2xl border transition-all duration-300 ${
                  isEliminated
                    ? "bg-emerald-50/70 border-emerald-400 opacity-40 scale-95"
                    : "bg-white/80 border-[#1a1a1a]/20 hover:border-[#1a1a1a] shadow-sm hover:scale-[1.03]"
                }`}
              >
                {/* Checkmark Stamp when eliminated */}
                {isEliminated && (
                  <div className="absolute top-1 right-1 z-10 w-5 h-5 bg-emerald-600 text-white rounded-full flex items-center justify-center shadow">
                    <Check size={12} weight="bold" />
                  </div>
                )}

                {/* Flag SVG Render */}
                <div className="w-full aspect-[3/2] rounded-lg overflow-hidden border border-black/10 shadow-xs bg-slate-100 flex items-center justify-center">
                  <img
                    src={flagSvgUrl}
                    alt={isEliminated ? country.name : "Flag"}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>

                {/* Country Name (hidden until eliminated) */}
                <span
                  className={`mt-1.5 text-[11px] font-semibold text-center leading-tight line-clamp-1 ${
                    isEliminated ? "text-emerald-900 font-bold" : "text-transparent select-none"
                  }`}
                >
                  {isEliminated ? country.name : "???"}
                </span>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}