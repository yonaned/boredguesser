"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Bricolage_Grotesque } from "next/font/google";
import {
  ArrowLeft,
  ArrowClockwise,
  Trophy,
  Timer,
  CheckCircle,
  Sparkle,
} from "@phosphor-icons/react";
// @ts-expect-error untyped canvas-confetti
import confetti from "canvas-confetti";
import USMap from "@/app/components/USMap";
import { US_STATES, USState } from "./states";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export default function USAStatesGuesserPage() {
  const [inputValue, setInputValue] = useState("");
  // Stores both lowercase names and FIPS for guaranteed map match
  const [guessedSet, setGuessedSet] = useState<Set<string>>(new Set());
  const [guessedStatesList, setGuessedStatesList] = useState<USState[]>([]);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [isGameOver, setIsGameOver] = useState(false);

  useEffect(() => {
    if (timeLeft <= 0 || isGameOver) return;
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
  }, [timeLeft, isGameOver]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    const normalized = value.trim().toLowerCase();
    if (!normalized) return;

    const matchedState = US_STATES.find(
      (s) =>
        s.name.toLowerCase() === normalized ||
        s.aliases.includes(normalized)
    );

    if (matchedState && !guessedSet.has(matchedState.name.toLowerCase())) {
      const nextSet = new Set(guessedSet);
      nextSet.add(matchedState.name.toLowerCase());
      nextSet.add(matchedState.fips);
      nextSet.add(String(parseInt(matchedState.fips, 10))); // unpadded number support

      setGuessedSet(nextSet);
      setGuessedStatesList((prev) => [matchedState, ...prev]);
      setInputValue(""); // Auto-clear on match

      if (guessedStatesList.length + 1 === US_STATES.length) {
        setIsGameOver(true);
        confetti({
          particleCount: 140,
          spread: 80,
          origin: { y: 0.6 },
        });
      }
    }
  };

  const restartGame = () => {
    setGuessedSet(new Set());
    setGuessedStatesList([]);
    setTimeLeft(600);
    setIsGameOver(false);
    setInputValue("");
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div
      className={`${bricolage.className} min-h-screen bg-[#f0f3e8] text-[#1c1e1d] px-6 py-8 md:px-12`}
    >
      <header className="max-w-7xl mx-auto flex items-center justify-between mb-8">
        <Link
          href="/dashboard"
          className="group flex items-center gap-2 text-[#4a5048] hover:text-[#1a1a1a] text-sm font-medium transition-colors"
        >
          <ArrowLeft
            size={18}
            className="transition-transform group-hover:-translate-x-1"
          />
          <span>Back to Games</span>
        </Link>
        <h1 className="text-2xl font-bold tracking-tight">
          BoredGuesser<span className="text-[#ff1a53]">.</span>
        </h1>
      </header>

      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Controls & Input */}
        <div className="lg:col-span-5 flex flex-col gap-6 bg-white/60 border border-[#1a1a1a]/20 rounded-3xl p-6 sm:p-8 shadow-sm">
          <div>
            <h2 className="text-3xl font-bold text-[#1a1a1a] mb-2">
              Name the 50 US States
            </h2>
            <p className="text-sm text-[#4a5048]">
              Type as many US states as you can before time expires.
            </p>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 bg-[#e8e3d5] p-4 rounded-2xl border border-[#1a1a1a]/15">
              <Trophy size={28} className="text-[#ff1a53]" />
              <div>
                <p className="text-xs font-semibold text-[#4a5048]">Score</p>
                <p className="text-xl font-bold">
                  {guessedStatesList.length} / {US_STATES.length}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-[#e8e3d5] p-4 rounded-2xl border border-[#1a1a1a]/15">
              <Timer size={28} className="text-[#1a1a1a]" />
              <div>
                <p className="text-xs font-semibold text-[#4a5048]">Time Left</p>
                <p className="text-xl font-bold font-mono">
                  {formatTime(timeLeft)}
                </p>
              </div>
            </div>
          </div>

          {/* Input Box */}
          <div>
            <label className="block text-sm font-semibold mb-2 px-1">
              Enter State Name
            </label>
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              disabled={isGameOver || timeLeft <= 0}
              placeholder="e.g. California, Texas, Florida..."
              autoFocus
              className="w-full px-6 py-3.5 rounded-full border border-[#1a1a1a] bg-white outline-none focus:ring-2 focus:ring-[#ff1a53] transition-all text-base placeholder:text-[#8a8f88]"
            />
          </div>

          {isGameOver && guessedStatesList.length === US_STATES.length && (
            <div className="bg-emerald-500/15 border border-emerald-600/30 rounded-2xl p-4 flex items-center gap-3 text-emerald-900">
              <Sparkle size={28} weight="fill" className="text-emerald-600" />
              <div>
                <p className="font-bold text-sm">Perfect Score!</p>
                <p className="text-xs text-emerald-800">
                  All 50 states found with {formatTime(timeLeft)} to spare!
                </p>
              </div>
            </div>
          )}

          <button
            onClick={restartGame}
            className="flex items-center justify-center gap-2 bg-[#2a2c2b] hover:bg-black text-white font-medium py-3 rounded-full transition-colors cursor-pointer"
          >
            <ArrowClockwise size={18} />
            <span>Restart Game</span>
          </button>

          {guessedStatesList.length > 0 && (
            <div className="pt-2 border-t border-[#1a1a1a]/10">
              <h3 className="text-xs font-bold text-[#4a5048] uppercase tracking-wider mb-3">
                Guessed States ({guessedStatesList.length})
              </h3>
              <div className="flex flex-wrap gap-2 max-h-[220px] overflow-y-auto pr-1">
                {guessedStatesList.map((state) => (
                  <span
                    key={state.fips}
                    className="inline-flex items-center gap-1.5 bg-[#f0f3e8] border border-[#1a1a1a]/15 text-[#1a1a1a] text-xs font-semibold px-3 py-1.5 rounded-full"
                  >
                    <CheckCircle
                      size={14}
                      weight="fill"
                      className="text-emerald-600"
                    />
                    <span>{state.name}</span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Map Visualizer */}
        <div className="lg:col-span-7 w-full sticky top-8">
          <USMap guessedStates={guessedSet} />
        </div>
      </main>
    </div>
  );
}