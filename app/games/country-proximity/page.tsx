"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { Bricolage_Grotesque } from "next/font/google";
import {
  ArrowLeft,
  ArrowClockwise,
  Trophy,
  Flame,
  GlobeHemisphereWest,
  PaperPlaneRight,
} from "@phosphor-icons/react";
// @ts-expect-error The package is used through its documented JavaScript API.
import confetti from "canvas-confetti";
import GlobeWrapper from "@/app/components/GlobeWrapper";
import { COUNTRIES, Country } from "./countries";
import { getHaversineDistanceKm, getDistanceColor } from "./geo";
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
  const [showSuggestions, setShowSuggestions] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Pick mystery target country on first mount
  const startNewGame = () => {
    const randomPick = COUNTRIES[Math.floor(Math.random() * COUNTRIES.length)];
    setTargetCountry(randomPick);
    setGuesses([]);
    setHasWon(false);
    setInputValue("");
    setFocusedLocation(null);
  };

  useEffect(() => {
    startNewGame();
  }, []);

  // Filter autocomplete suggestions based on typing
  const matchingSuggestions = useMemo(() => {
    const clean = inputValue.trim().toLowerCase();
    if (!clean || hasWon) return [];
    const guessedIds = new Set(guesses.map((g) => g.id));

    return COUNTRIES.filter(
      (c) =>
        !guessedIds.has(c.id) &&
        (c.name.toLowerCase().includes(clean) ||
          c.aliases.some((a) => a.toLowerCase().includes(clean)))
    ).slice(0, 5);
  }, [inputValue, guesses, hasWon]);

  // Submit a country guess
  const makeGuess = (country: Country) => {
    if (!targetCountry || hasWon) return;
    if (guesses.some((g) => g.id === country.id)) return;

    const isMatch = country.id === targetCountry.id;
    const distanceKm = isMatch
      ? 0
      : getHaversineDistanceKm(country.lat, country.lng, targetCountry.lat, targetCountry.lng);

    const color = getDistanceColor(distanceKm, isMatch);

    const record: GuessRecord = {
      id: country.id,
      name: country.name,
      distanceKm,
      color,
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

  const handleInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (matchingSuggestions.length > 0) {
      makeGuess(matchingSuggestions[0]);
    }
  };

  // Convert guesses array to indexed record for the 3D globe polygons
  const guessesMap = useMemo(() => {
    const acc: Record<string, GuessRecord> = {};
    for (const g of guesses) {
      acc[g.id] = g;
    }
    return acc;
  }, [guesses]);

  // Closest country distance achieved so far
  const bestGuess = useMemo(() => {
    if (guesses.length === 0) return null;
    return [...guesses].sort((a, b) => a.distanceKm - b.distanceKm)[0];
  }, [guesses]);

  return (
    <div
      className={`${bricolage.className} min-h-screen bg-[#f0f3e8] text-[#1c1e1d] px-4 py-8 md:px-12`}
    >
      {/* Top Header */}
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

            {/* Live Stats */}
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

            {/* Input Form with Autocomplete */}
            {!hasWon ? (
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

                {/* Suggestions Dropdown */}
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
            ) : (
              <div className="bg-emerald-500/15 border border-emerald-600/30 rounded-2xl p-5 text-center space-y-2">
                <p className="text-emerald-900 font-bold text-lg">🎉 Mystery Country Found!</p>
                <p className="text-emerald-800 text-sm">
                  You found <span className="font-bold">{targetCountry?.name}</span> in {guesses.length} guesses.
                </p>
                <button
                  onClick={startNewGame}
                  className="mt-2 inline-flex items-center gap-2 bg-[#1a1a1a] hover:bg-black text-white px-5 py-2.5 rounded-full text-sm font-medium transition-colors"
                >
                  <ArrowClockwise size={16} />
                  <span>Play Again</span>
                </button>
              </div>
            )}

            {/* Restart Button */}
            {!hasWon && guesses.length > 0 && (
              <button
                type="button"
                onClick={startNewGame}
                className="flex items-center justify-center gap-2 text-xs font-semibold text-[#4a5048] hover:text-[#1a1a1a] transition-colors mt-4 w-full"
              >
                <ArrowClockwise size={14} />
                <span>Give up and pick a new country</span>
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
                      <div className="flex items-center gap-3">
                        <span
                          className="w-4 h-4 rounded-full border border-black/20 flex-shrink-0"
                          style={{ backgroundColor: g.color }}
                        />
                        <span className="font-semibold text-sm text-[#1a1a1a]">{g.name}</span>
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
              <span className="w-3 h-3 rounded-full bg-[#10b981]" /> Target
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}