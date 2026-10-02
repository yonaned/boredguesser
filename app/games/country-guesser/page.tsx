"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Bricolage_Grotesque } from "next/font/google";
import { ArrowLeft, ArrowClockwise, Trophy, Timer } from "@phosphor-icons/react";
import WorldMap from "@/app/components/WorldMap";
import { COUNTRIES } from "./countries";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export default function CountryGuesserPage() {
  const [inputValue, setInputValue] = useState("");
  const [guessedIds, setGuessedIds] = useState<Set<string>>(new Set());
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(900); // 15-minute timer (in seconds)
  const [isGameOver, setIsGameOver] = useState(false);

  // Timer countdown
  useEffect(() => {
    if (timeLeft <= 0 || isGameOver) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft, isGameOver]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    const normalized = value.trim().toLowerCase();
    if (!normalized) return;

    // Find match by primary name or alias
    const matchedCountry = COUNTRIES.find((c:any) =>
      c.name.toLowerCase() === normalized || c.aliases.includes(normalized)
    );

    if (matchedCountry && !guessedIds.has(matchedCountry.id)) {
      const nextGuessed = new Set(guessedIds).add(matchedCountry.id);
      setGuessedIds(nextGuessed);
      setScore(nextGuessed.size);
      setInputValue(""); // Clear input on success

      if (nextGuessed.size === COUNTRIES.length) {
        setIsGameOver(true);
      }
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div className={`${bricolage.className} min-h-screen bg-[#f0f3e8] text-[#1c1e1d] px-6 py-8 md:px-12`}>
      <header className="max-w-7xl mx-auto flex items-center justify-between mb-8">
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

      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column: Game Controls & Input */}
        <div className="flex flex-col gap-6 bg-white/60 border border-[#1a1a1a]/20 rounded-3xl p-6 sm:p-8">
          <div>
            <h2 className="text-3xl font-bold text-[#1a1a1a] mb-2">Name the Countries</h2>
            <p className="text-sm text-[#4a5048]">
              Type as many countries of the world as you can before time runs out.
            </p>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 bg-[#e8e3d5] p-4 rounded-2xl border border-[#1a1a1a]/15">
              <Trophy size={28} className="text-[#ff1a53]" />
              <div>
                <p className="text-xs font-semibold text-[#4a5048]">Score</p>
                <p className="text-xl font-bold">{score} / {COUNTRIES.length}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-[#e8e3d5] p-4 rounded-2xl border border-[#1a1a1a]/15">
              <Timer size={28} className="text-[#1a1a1a]" />
              <div>
                <p className="text-xs font-semibold text-[#4a5048]">Time Left</p>
                <p className="text-xl font-bold">{formatTime(timeLeft)}</p>
              </div>
            </div>
          </div>

          {/* Input Box */}
          <div>
            <label className="block text-sm font-semibold mb-2 px-1">
              Enter Country Name
            </label>
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              disabled={isGameOver || timeLeft <= 0}
              placeholder="e.g. Japan, Canada, Brazil..."
              autoFocus
              className="w-full px-6 py-3.5 rounded-full border border-[#1a1a1a] bg-white outline-none focus:ring-2 focus:ring-[#ff1a53] transition-all text-base placeholder:text-[#8a8f88]"
            />
          </div>

          <button
            onClick={() => {
              setGuessedIds(new Set());
              setScore(0);
              setTimeLeft(900);
              setIsGameOver(false);
            }}
            className="flex items-center justify-center gap-2 bg-[#2a2c2b] hover:bg-black text-white font-medium py-3 rounded-full transition-colors mt-2"
          >
            <ArrowClockwise size={18} />
            <span>Restart Game</span>
          </button>
        </div>

        {/* Right Column: World Map Visualizer */}
        <div className="lg:col-span-2 w-full">
          <WorldMap guessedCodes={guessedIds} />
        </div>
      </main>
    </div>
  );
}