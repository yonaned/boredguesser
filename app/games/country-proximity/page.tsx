// app/games/country-proximity/page.tsx
"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { Bricolage_Grotesque } from "next/font/google";
import {
  ArrowLeft,
  ArrowClockwise,
  Trophy,
  Flame,
  PaperPlaneRight,
} from "@phosphor-icons/react";
// @ts-expect-error untyped canvas-confetti
import confetti from "canvas-confetti";
import GlobeWrapper from "@/app/components/GlobeWrapper";
import { COUNTRIES, Country } from "./countries";
import { getHaversineDistanceKm, getDistanceColor } from "./geo";
import { checkIsNeighbor } from "./borders";
import { GuessRecord } from "@/app/components/Globe3D";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export default function CountryGuesserPage() {
  const [targetCountry, setTargetCountry] = useState<Country | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [guesses, setGuesses] = useState<GuessRecord[]>([]);
  const [focusedLocation, setFocusedLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [hasWon, setHasWon] = useState(false);
  const [hasGivenUp, setHasGivenUp] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const startNewGame = () => {
    const randomPick = COUNTRIES[Math.floor(Math.random() * COUNTRIES.length)];
    setTargetCountry(randomPick);
    setGuesses([]);
    setHasWon(false);
    setHasGivenUp(false);
    setInputValue("");
    setFocusedLocation(null);
  };

  useEffect(() => {
    startNewGame();
  }, []);

  const matchingSuggestions = useMemo(() => {
    const clean = inputValue.trim().toLowerCase();
    if (!clean || hasWon || hasGivenUp) return [];
    const guessedIds = new Set(guesses.map((g) => g.id));

    return COUNTRIES.filter(
      (c) =>
        !guessedIds.has(c.id) &&
        (c.name.toLowerCase().includes(clean) ||
          c.aliases.some((a) => a.toLowerCase().includes(clean)))
    ).slice(0, 5);
  }, [inputValue, guesses, hasWon, hasGivenUp]);

  const makeGuess = (country: Country) => {
    if (!targetCountry || hasWon || hasGivenUp) return;
    if (guesses.some((g) => g.id === country.id)) return;

    const isMatch = country.id === targetCountry.id;
    const isNeighbor = !isMatch && checkIsNeighbor(country.id, targetCountry.id);
    const distanceKm = isMatch
      ? 0
      : getHaversineDistanceKm(country.lat, country.lng, targetCountry.lat, targetCountry.lng);

    const color = getDistanceColor(distanceKm, isMatch, isNeighbor);

    const record: GuessRecord = {
      id: country.id,
      name: country.name,
      distanceKm,
      color,
      isNeighbor,
    };

    setGuesses((prev) => [record, ...prev]);
    setFocusedLocation({ lat: country.lat, lng: country.lng });
    setInputValue("");
    setShowSuggestions(false);

    if (isMatch) {
      setHasWon(true);
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  };

  const handleGiveUp = () => {
    if (!targetCountry || hasWon || hasGivenUp) return;

    setHasGivenUp(true);
    setShowSuggestions(false);
    setInputValue("");

    // Add target country to guesses to paint it emerald on the globe and focus on it
    const revealedTarget: GuessRecord = {
      id: targetCountry.id,
      name: targetCountry.name,
      distanceKm: 0,
      color: "#10b981",
      isNeighbor: false,
    };

    setGuesses((prev) => [revealedTarget, ...prev]);
    setFocusedLocation({ lat: targetCountry.lat, lng: targetCountry.lng });
  };

  const handleInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (matchingSuggestions.length > 0) {
      makeGuess(matchingSuggestions[0]);
    }
  };

  const guessesMap = useMemo(() => {
    const acc: Record<string, GuessRecord> = {};
    for (const g of guesses) {
      acc[g.id] = g;
    }
    return acc;
  }, [guesses]);

  const bestGuess = useMemo(() => {
    if (guesses.length === 0) return null;
    return [...guesses].sort((a, b) => a.distanceKm - b.distanceKm)[0];
  }, [guesses]);

  const latestGuess = guesses[0] ?? null;

  return (
    <div
      className={`${bricolage.className} min-h-screen bg-[#f0f3e8] text-[#1c1e1d] px-4 py-8 md:px-12`}
    >
      <header className="max-w-7xl mx-auto flex items-center justify-between mb-6">
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

      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Input, Stats & Guess History */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="bg-white/70 border border-[#1a1a1a]/20 rounded-3xl p-6 sm:p-7 shadow-sm">
            <h2 className="text-3xl font-bold text-[#1a1a1a] mb-1">Globle Quest</h2>
            <p className="text-sm text-[#4a5048] mb-5">
              Find the mystery country. Every guess colors the globe based on how hot or cold you are.
            </p>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-[#e8e3d5] p-3.5 rounded-2xl border border-[#1a1a1a]/15 flex items-center gap-3">
                <Trophy size={26} className="text-[#ff1a53]" />
                <div>
                  <p className="text-[11px] font-semibold text-[#4a5048] uppercase">Guesses</p>
                  <p className="text-xl font-bold">{guesses.length}</p>
                </div>
              </div>

              <div className="bg-[#e8e3d5] p-3.5 rounded-2xl border border-[#1a1a1a]/15 flex items-center gap-3">
                <Flame size={26} className="text-orange-600" />
                <div>
                  <p className="text-[11px] font-semibold text-[#4a5048] uppercase">Closest</p>
                  <p className="text-xl font-bold">
                    {bestGuess ? `${bestGuess.distanceKm.toLocaleString()} km` : "—"}
                  </p>
                </div>
              </div>
            </div>

            {/* Purple Neighbor Notification Banner */}
            {latestGuess && latestGuess.isNeighbor && !hasWon && !hasGivenUp && (
              <div className="mb-4 bg-purple-50 border border-purple-300 rounded-2xl p-3 flex items-center gap-2.5 text-purple-950 shadow-sm animate-fadeIn">
                <span className="w-2.5 h-2.5 rounded-full bg-[#a855f7] flex-shrink-0" />
                <p className="text-xs font-semibold leading-tight">
                  <span className="font-bold">{latestGuess.name}</span> borders the mystery country!
                </p>
              </div>
            )}

            {!hasWon && !hasGivenUp ? (
              <form onSubmit={handleInputSubmit} className="relative">
                <label className="block text-xs font-bold text-[#1a1a1a] uppercase mb-1.5 px-1">
                  Enter Country Name
                </label>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => {
                      setInputValue(e.target.value);
                      setShowSuggestions(true);
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    placeholder="e.g. Argentina, Germany, Japan..."
                    autoFocus
                    className="w-full px-5 py-3.5 pr-12 rounded-full border border-[#1a1a1a] bg-white outline-none focus:ring-2 focus:ring-[#ff1a53] transition-all text-base placeholder:text-[#8a8f88]"
                  />
                  <button
                    type="submit"
                    aria-label="Submit guess"
                    className="absolute right-2 w-9 h-9 rounded-full bg-[#1a1a1a] text-white flex items-center justify-center hover:bg-[#ff1a53] transition-colors"
                  >
                    <PaperPlaneRight size={16} weight="fill" />
                  </button>
                </div>

                {showSuggestions && matchingSuggestions.length > 0 && (
                  <div
                    ref={dropdownRef}
                    className="absolute z-30 left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-[#1a1a1a]/15 overflow-hidden"
                  >
                    {matchingSuggestions.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => makeGuess(c)}
                        className="w-full text-left px-5 py-3 text-sm hover:bg-[#f0f3e8] transition-colors flex items-center justify-between border-b last:border-b-0 border-[#1a1a1a]/10"
                      >
                        <span className="font-semibold text-[#1a1a1a]">{c.name}</span>
                        <span className="text-xs text-stone-400">Select</span>
                      </button>
                    ))}
                  </div>
                )}
              </form>
            ) : hasWon ? (
              <div className="bg-emerald-500/15 border border-emerald-600/30 rounded-2xl p-5 text-center space-y-2">
                <p className="text-emerald-900 font-bold text-lg">🎉 Mystery Country Found!</p>
                <p className="text-emerald-800 text-sm">
                  You found <span className="font-bold">{targetCountry?.name}</span> in {guesses.length} guesses.
                </p>
                <button
                  onClick={startNewGame}
                  className="mt-2 inline-flex items-center gap-2 bg-[#1a1a1a] hover:bg-black text-white px-5 py-2.5 rounded-full text-sm font-medium transition-colors cursor-pointer"
                >
                  <ArrowClockwise size={16} />
                  <span>Play Again</span>
                </button>
              </div>
            ) : (
              /* Given Up Reveal Banner */
              <div className="bg-amber-500/15 border border-amber-600/30 rounded-2xl p-5 text-center space-y-2">
                <p className="text-amber-950 font-bold text-lg">Better luck next time!</p>
                <p className="text-amber-900 text-sm">
                  The mystery country was{" "}
                  <span className="font-bold underline decoration-amber-600 underline-offset-4">
                    {targetCountry?.name}
                  </span>
                  .
                </p>
                <button
                  onClick={startNewGame}
                  className="mt-2 inline-flex items-center gap-2 bg-[#1a1a1a] hover:bg-black text-white px-5 py-2.5 rounded-full text-sm font-medium transition-colors cursor-pointer"
                >
                  <ArrowClockwise size={16} />
                  <span>Play Next Country</span>
                </button>
              </div>
            )}

            {/* Give Up Button */}
            {!hasWon && !hasGivenUp && guesses.length > 0 && (
              <button
                type="button"
                onClick={handleGiveUp}
                className="flex items-center justify-center gap-2 text-xs font-semibold text-[#4a5048] hover:text-[#ff1a53] transition-colors mt-4 w-full cursor-pointer"
              >
                <ArrowClockwise size={14} />
                <span>Give up and reveal answer</span>
              </button>
            )}
          </div>

          {/* Guesses Table */}
          {guesses.length > 0 && (
            <div className="bg-white/70 border border-[#1a1a1a]/20 rounded-3xl p-5 shadow-sm">
              <h3 className="text-xs font-bold text-[#4a5048] uppercase tracking-wider mb-3 px-1">
                Your Guesses (Closest First)
              </h3>
              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                {[...guesses]
                  .sort((a, b) => a.distanceKm - b.distanceKm)
                  .map((g) => (
                    <div
                      key={g.id}
                      onClick={() => {
                        const country = COUNTRIES.find((c) => c.id === g.id);
                        if (country) {
                          setFocusedLocation({ lat: country.lat, lng: country.lng });
                        }
                      }}
                      className="cursor-pointer flex items-center justify-between p-3 rounded-2xl bg-[#f0f3e8]/70 border border-[#1a1a1a]/10 hover:border-[#1a1a1a]/30 transition-all"
                    >
                      <div className="flex items-center gap-2.5">
                        <span
                          className="w-4 h-4 rounded-full border border-black/20 flex-shrink-0"
                          style={{ backgroundColor: g.color }}
                        />
                        <span className="font-semibold text-sm text-[#1a1a1a]">{g.name}</span>
                        {g.isNeighbor && (
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-purple-800 border border-purple-300 px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                            Neighbor
                          </span>
                        )}
                        {hasGivenUp && g.id === targetCountry?.id && (
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                            Answer
                          </span>
                        )}
                      </div>
                      <span className="text-xs font-bold font-mono text-[#4a5048]">
                        {g.distanceKm === 0 ? "TARGET!" : `${g.distanceKm.toLocaleString()} km`}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: 3D Interactive World Globe */}
        <div className="lg:col-span-7 flex flex-col gap-3">
          <GlobeWrapper guesses={guessesMap} focusedLocation={focusedLocation} />

          {/* Heatmap Legend */}
          <div className="bg-white/60 border border-[#1a1a1a]/15 rounded-2xl p-3 flex flex-wrap items-center justify-between gap-2 text-xs font-semibold text-[#4a5048]">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#7f1d1d]" /> &lt; 1,000 km
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#dc2626]" /> &lt; 2,500 km
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#f97316]" /> &lt; 4,500 km
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#facc15]" /> &lt; 7,500 km
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#94a3b8]" /> &gt; 10,000 km
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#a855f7]" /> Neighbor
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#10b981]" /> Target
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}