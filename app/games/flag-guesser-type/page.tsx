"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import Link from "next/link";
import { Bricolage_Grotesque } from "next/font/google";
import {
  ArrowLeft,
  ArrowClockwise,
  Trophy,
  Flame,
  Lightbulb,
  FastForward,
  Check,
  X,
  Sparkle,
} from "@phosphor-icons/react";
// @ts-expect-error untyped canvas-confetti
import confetti from "canvas-confetti";
import * as Flags from "country-flag-icons/react/3x2";
import { FLAG_COUNTRIES, FlagCountry } from "../flag-guesser/countries";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const CONTINENTS = ["All", "Europe", "Americas", "Asia", "Africa", "Oceania"] as const;

export default function FlagTypeGuesserPage() {
  const [selectedContinent, setSelectedContinent] = useState<string>("All");
  const [currentCountry, setCurrentCountry] = useState<FlagCountry | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [totalSolved, setTotalSolved] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [status, setStatus] = useState<"idle" | "correct" | "skipped">("idle");
  const [revealedName, setRevealedName] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);

  // Load high score from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("boredguesser_flag_type_best");
    if (saved) setBestStreak(parseInt(saved, 10));
  }, []);

  // Filter pool by continent
  const pool = useMemo(() => {
    if (selectedContinent === "All") return FLAG_COUNTRIES;
    return FLAG_COUNTRIES.filter((c) => c.continent === selectedContinent);
  }, [selectedContinent]);

  // Pick random country
  const pickNextCountry = useCallback(
    (customPool = pool) => {
      if (customPool.length === 0) return;
      const random = customPool[Math.floor(Math.random() * customPool.length)];
      setCurrentCountry(random);
      setInputValue("");
      setShowHint(false);
      setStatus("idle");
      setRevealedName("");
      setTimeout(() => inputRef.current?.focus(), 50);
    },
    [pool]
  );

  const startNewGame = useCallback(() => {
    setStreak(0);
    setTotalSolved(0);
    pickNextCountry();
  }, [pickNextCountry]);

  useEffect(() => {
    startNewGame();
  }, [selectedContinent, startNewGame]);

  // Instant Typing Engine
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (status !== "idle" || !currentCountry) return;

    const val = e.target.value;
    setInputValue(val);

    const normalized = val.trim().toLowerCase();
    if (!normalized) return;

    // Check against country name or any alias
    const isCorrect =
      currentCountry.name.toLowerCase() === normalized ||
      currentCountry.aliases.includes(normalized);

    if (isCorrect) {
      handleSuccess();
    }
  };

  const handleSuccess = () => {
    setStatus("correct");
    const nextStreak = streak + 1;
    const nextTotal = totalSolved + 1;

    setStreak(nextStreak);
    setTotalSolved(nextTotal);

    if (nextStreak > bestStreak) {
      setBestStreak(nextStreak);
      localStorage.setItem("boredguesser_flag_type_best", nextStreak.toString());
    }

    if (nextStreak % 5 === 0) {
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    }

    setTimeout(() => {
      pickNextCountry();
    }, 700);
  };

  const handleSkip = () => {
    if (status !== "idle" || !currentCountry) return;

    setStatus("skipped");
    setRevealedName(currentCountry.name);
    setStreak(0); // Reset streak on skip

    setTimeout(() => {
      pickNextCountry();
    }, 1400);
  };

  // Resolve vector flag component dynamically
  const FlagComponent = currentCountry
    ? (Flags as Record<string, React.ComponentType<{ className?: string; title?: string }>>)[
        currentCountry.code
      ]
    : null;

  return (
    <div className={`${bricolage.className} min-h-screen bg-[#f0f3e8] text-[#1c1e1d] px-4 py-8 md:px-12`}>
      {/* Header */}
      <header className="max-w-4xl mx-auto flex items-center justify-between mb-8">
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
      </header>

      <main className="max-w-2xl mx-auto flex flex-col gap-6">
        {/* Continent Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {CONTINENTS.map((cont) => (
            <button
              key={cont}
              onClick={() => setSelectedContinent(cont)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                selectedContinent === cont
                  ? "bg-[#1a1a1a] text-white border border-[#1a1a1a]"
                  : "bg-white/60 text-[#4a5048] border border-[#1a1a1a]/20 hover:border-[#1a1a1a]"
              }`}
            >
              {cont}
            </button>
          ))}
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-[#e8e3d5] p-3.5 rounded-2xl border border-[#1a1a1a]/15 flex items-center gap-3">
            <Flame size={26} className="text-[#ff1a53]" />
            <div>
              <p className="text-[11px] font-semibold text-[#4a5048] uppercase tracking-wider">Streak</p>
              <p className="text-xl font-bold">{streak}</p>
            </div>
          </div>

          <div className="bg-[#e8e3d5] p-3.5 rounded-2xl border border-[#1a1a1a]/15 flex items-center gap-3">
            <Trophy size={26} className="text-amber-600" />
            <div>
              <p className="text-[11px] font-semibold text-[#4a5048] uppercase tracking-wider">Best</p>
              <p className="text-xl font-bold">{bestStreak}</p>
            </div>
          </div>

          <div className="bg-[#e8e3d5] p-3.5 rounded-2xl border border-[#1a1a1a]/15 flex items-center gap-3">
            <Sparkle size={26} className="text-emerald-700" />
            <div>
              <p className="text-[11px] font-semibold text-[#4a5048] uppercase tracking-wider">Solved</p>
              <p className="text-xl font-bold">{totalSolved}</p>
            </div>
          </div>
        </div>

        {/* Flag Card */}
        <div className="bg-white/80 border border-[#1a1a1a]/20 rounded-3xl p-6 sm:p-10 shadow-sm flex flex-col items-center justify-center relative overflow-hidden">
          {/* Success Banner */}
          {status === "correct" && (
            <div className="absolute top-4 bg-emerald-500 text-white font-bold text-xs px-4 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm animate-bounce">
              <Check size={16} weight="bold" />
              <span>Correct! +1 Streak</span>
            </div>
          )}

          {/* Skipped Banner */}
          {status === "skipped" && (
            <div className="absolute top-4 bg-rose-500 text-white font-bold text-xs px-4 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
              <X size={16} weight="bold" />
              <span>Skipped! That was {revealedName}</span>
            </div>
          )}

          {/* Flag SVG Render */}
          <div className="w-full max-w-xs sm:max-w-sm aspect-[3/2] rounded-2xl overflow-hidden border border-[#1a1a1a]/20 shadow-xl my-4 bg-slate-100 flex items-center justify-center">
            {FlagComponent ? (
              <FlagComponent className="w-full h-full object-cover" title={currentCountry?.name} />
            ) : currentCountry ? (
              <img
                src={`https://purecatamphetamine.github.io/country-flag-icons/3x2/${currentCountry.code}.svg`}
                alt={currentCountry.name}
                className="w-full h-full object-cover"
              />
            ) : null}
          </div>

          {/* Hint Readout */}
          {showHint && currentCountry && (
            <div className="mt-2 text-xs font-mono font-bold tracking-widest text-[#4a5048] bg-[#f0f3e8] px-4 py-1.5 rounded-full border border-[#1a1a1a]/10">
              Starts with &quot;{currentCountry.name.charAt(0)}&quot; • {currentCountry.name.length} letters
            </div>
          )}
        </div>

        {/* Type Input Section */}
        <div className="space-y-4">
          <div className="relative flex items-center">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              disabled={status !== "idle"}
              autoFocus
              placeholder="Type country name..."
              className={`w-full px-6 py-4 rounded-full border bg-white outline-none transition-all text-lg font-medium placeholder:text-[#8a8f88] ${
                status === "correct"
                  ? "border-emerald-500 ring-2 ring-emerald-400 bg-emerald-50/50"
                  : status === "skipped"
                  ? "border-rose-400 bg-rose-50/50"
                  : "border-[#1a1a1a] focus:ring-2 focus:ring-[#ff1a53]"
              }`}
            />
          </div>

          {/* Action Buttons: Hint & Skip */}
          <div className="flex items-center justify-between px-2">
            <button
              type="button"
              onClick={() => setShowHint(true)}
              disabled={showHint || status !== "idle"}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#4a5048] hover:text-[#1a1a1a] disabled:opacity-40 transition-colors cursor-pointer"
            >
              <Lightbulb size={16} />
              <span>{showHint ? "Hint revealed" : "Need a hint?"}</span>
            </button>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleSkip}
                disabled={status !== "idle"}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#4a5048] hover:text-[#ff1a53] disabled:opacity-40 transition-colors cursor-pointer"
              >
                <FastForward size={16} />
                <span>Skip flag</span>
              </button>

              <button
                type="button"
                onClick={startNewGame}
                className="inline-flex items-center gap-1 text-xs font-semibold text-stone-400 hover:text-[#1a1a1a] transition-colors"
                title="Reset session"
              >
                <ArrowClockwise size={14} />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}