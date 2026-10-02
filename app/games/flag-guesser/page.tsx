"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import { Bricolage_Grotesque } from "next/font/google";
import {
  ArrowLeft,
  ArrowClockwise,
  Trophy,
  Flame,
  Heart,
  PaperPlaneRight,
  Check,
  X,
  Sparkle,
} from "@phosphor-icons/react";
// @ts-expect-error canvas-confetti untyped import
import confetti from "canvas-confetti";
import { FLAG_COUNTRIES, FlagCountry } from "./countries";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const CONTINENTS = ["All", "Europe", "Americas", "Asia", "Africa", "Oceania"] as const;

export default function FlagGuesserPage() {
  const [selectedContinent, setSelectedContinent] = useState<string>("All");
  const [gameMode, setGameMode] = useState<"choice" | "type">("choice");
  const [currentCountry, setCurrentCountry] = useState<FlagCountry | null>(null);
  const [options, setOptions] = useState<FlagCountry[]>([]);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [lives, setLives] = useState(3);
  const [isGameOver, setIsGameOver] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<FlagCountry | null>(null);
  const [answerState, setAnswerState] = useState<"idle" | "correct" | "incorrect">("idle");
  const [inputValue, setInputValue] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("boredguesser_flag_best");
    if (saved) setBestStreak(parseInt(saved, 10));
  }, []);

  const pool = useMemo(() => {
    if (selectedContinent === "All") return FLAG_COUNTRIES;
    return FLAG_COUNTRIES.filter((c) => c.continent === selectedContinent);
  }, [selectedContinent]);

  const nextQuestion = useCallback(
    (customPool = pool) => {
      if (customPool.length < 4) return;
      const target = customPool[Math.floor(Math.random() * customPool.length)];
      setCurrentCountry(target);

      const distractors = customPool
        .filter((c) => c.code !== target.code)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);

      const shuffledOptions = [target, ...distractors].sort(() => Math.random() - 0.5);
      setOptions(shuffledOptions);
      setSelectedAnswer(null);
      setAnswerState("idle");
      setInputValue("");
      setShowSuggestions(false);
    },
    [pool]
  );

  const startNewGame = useCallback(() => {
    setStreak(0);
    setLives(3);
    setIsGameOver(false);
    nextQuestion();
  }, [nextQuestion]);

  useEffect(() => {
    startNewGame();
  }, [selectedContinent, startNewGame]);

  const handleGuess = (country: FlagCountry) => {
    if (answerState !== "idle" || !currentCountry || isGameOver) return;

    setSelectedAnswer(country);
    const isCorrect = country.code === currentCountry.code;

    if (isCorrect) {
      setAnswerState("correct");
      const nextStreak = streak + 1;
      setStreak(nextStreak);

      if (nextStreak > bestStreak) {
        setBestStreak(nextStreak);
        localStorage.setItem("boredguesser_flag_best", nextStreak.toString());
      }

      if (nextStreak % 5 === 0) {
        confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
      }

      setTimeout(() => {
        nextQuestion();
      }, 900);
    } else {
      setAnswerState("incorrect");
      const remainingLives = lives - 1;
      setLives(remainingLives);

      if (remainingLives <= 0) {
        setIsGameOver(true);
      } else {
        setTimeout(() => {
          nextQuestion();
        }, 1300);
      }
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameMode !== "choice" || answerState !== "idle" || isGameOver) return;
      const keyIndex = parseInt(e.key, 10) - 1;
      if (keyIndex >= 0 && keyIndex < options.length) {
        handleGuess(options[keyIndex]);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [options, answerState, isGameOver, gameMode]);

  const matchingSuggestions = useMemo(() => {
    const clean = inputValue.trim().toLowerCase();
    if (!clean || answerState !== "idle") return [];
    return pool
      .filter(
        (c) =>
          c.name.toLowerCase().includes(clean) ||
          c.aliases.some((a) => a.toLowerCase().includes(clean))
      )
      .slice(0, 5);
  }, [inputValue, pool, answerState]);

  const handleTypeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (matchingSuggestions.length > 0) {
      handleGuess(matchingSuggestions[0]);
    }
  };

  return (
    <div className={`${bricolage.className} min-h-screen bg-[#f0f3e8] text-[#1c1e1d] px-4 py-8 md:px-12`}>
      <header className="max-w-5xl mx-auto flex items-center justify-between mb-8">
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

      <main className="max-w-4xl mx-auto flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            {CONTINENTS.map((cont) => (
              <button
                key={cont}
                onClick={() => setSelectedContinent(cont)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  selectedContinent === cont
                    ? "bg-[#1a1a1a] text-white border border-[#1a1a1a]"
                    : "bg-white/60 text-[#4a5048] border border-[#1a1a1a]/20 hover:border-[#1a1a1a]"
                }`}
              >
                {cont}
              </button>
            ))}
          </div>

          <div className="bg-white/70 border border-[#1a1a1a]/20 p-1 rounded-full flex items-center gap-1 text-xs font-semibold">
            <button
              onClick={() => setGameMode("choice")}
              className={`px-3 py-1.5 rounded-full transition-all cursor-pointer ${
                gameMode === "choice" ? "bg-[#1a1a1a] text-white shadow-sm" : "text-[#4a5048]"
              }`}
            >
              Multiple Choice
            </button>
            <button
              onClick={() => setGameMode("type")}
              className={`px-3 py-1.5 rounded-full transition-all cursor-pointer ${
                gameMode === "type" ? "bg-[#1a1a1a] text-white shadow-sm" : "text-[#4a5048]"
              }`}
            >
              Type Name
            </button>
          </div>
        </div>

        {/* Stats */}
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
            <div className="flex gap-1">
              {[1, 2, 3].map((heart) => (
                <Heart
                  key={heart}
                  size={20}
                  weight={heart <= lives ? "fill" : "regular"}
                  className={heart <= lives ? "text-[#ff1a53]" : "text-stone-400"}
                />
              ))}
            </div>
            <div>
              <p className="text-[11px] font-semibold text-[#4a5048] uppercase tracking-wider">Lives</p>
              <p className="text-xl font-bold">{lives} / 3</p>
            </div>
          </div>
        </div>

        {/* Flag Card */}
        <div className="bg-white/80 border border-[#1a1a1a]/20 rounded-3xl p-6 sm:p-10 shadow-sm flex flex-col items-center justify-center relative overflow-hidden">
          {answerState === "correct" && (
            <div className="absolute top-4 bg-emerald-500 text-white font-bold text-xs px-4 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm animate-bounce">
              <Check size={16} weight="bold" />
              <span>Correct! +1 Streak</span>
            </div>
          )}

          {answerState === "incorrect" && (
            <div className="absolute top-4 bg-rose-500 text-white font-bold text-xs px-4 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
              <X size={16} weight="bold" />
              <span>It was {currentCountry?.name}!</span>
            </div>
          )}

          {/* FlagCDN SVG */}
          <div className="w-full max-w-sm sm:max-w-md aspect-[3/2] rounded-2xl overflow-hidden border border-[#1a1a1a]/20 shadow-xl my-4 bg-slate-100 flex items-center justify-center">
            {currentCountry && (
              <img
                src={`https://flagcdn.com/${currentCountry.code.toLowerCase()}.svg`}
                alt={currentCountry.name}
                className="w-full h-full object-cover"
              />
            )}
          </div>

          <p className="text-sm font-medium text-[#4a5048] mt-2">
            Which country does this flag belong to?
          </p>
        </div>

        {!isGameOver ? (
          <div>
            {gameMode === "choice" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {options.map((option, index) => {
                  let btnStyle =
                    "bg-white/80 border-[#1a1a1a]/20 hover:border-[#1a1a1a] hover:bg-white text-[#1a1a1a]";

                  if (answerState !== "idle") {
                    if (option.code === currentCountry?.code) {
                      btnStyle = "bg-emerald-500 text-white border-emerald-600 shadow-md";
                    } else if (selectedAnswer?.code === option.code) {
                      btnStyle = "bg-rose-500 text-white border-rose-600";
                    } else {
                      btnStyle = "bg-white/40 text-stone-400 border-stone-200 opacity-60";
                    }
                  }

                  return (
                    <button
                      key={option.code}
                      onClick={() => handleGuess(option)}
                      disabled={answerState !== "idle"}
                      className={`group flex items-center justify-between p-4 rounded-2xl border text-left font-semibold text-base transition-all duration-150 active:scale-[0.98] cursor-pointer ${btnStyle}`}
                    >
                      <span className="flex items-center gap-3">
                        <span className="w-7 h-7 rounded-lg bg-[#f0f3e8] border border-[#1a1a1a]/15 text-xs flex items-center justify-center text-[#1a1a1a] font-bold group-hover:bg-[#1a1a1a] group-hover:text-white transition-colors">
                          {index + 1}
                        </span>
                        <span>{option.name}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <form onSubmit={handleTypeSubmit} className="relative">
                <div className="relative flex items-center">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => {
                      setInputValue(e.target.value);
                      setShowSuggestions(true);
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    disabled={answerState !== "idle"}
                    placeholder="Type country name (e.g. France, Japan...)"
                    autoFocus
                    className="w-full px-6 py-4 pr-14 rounded-full border border-[#1a1a1a] bg-white outline-none focus:ring-2 focus:ring-[#ff1a53] transition-all text-base placeholder:text-[#8a8f88]"
                  />
                  <button
                    type="submit"
                    aria-label="Submit"
                    className="absolute right-2.5 w-10 h-10 rounded-full bg-[#1a1a1a] text-white flex items-center justify-center hover:bg-[#ff1a53] transition-colors cursor-pointer"
                  >
                    <PaperPlaneRight size={18} weight="fill" />
                  </button>
                </div>

                {showSuggestions && matchingSuggestions.length > 0 && (
                  <div className="absolute z-20 left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-[#1a1a1a]/15 overflow-hidden">
                    {matchingSuggestions.map((c) => (
                      <button
                        key={c.code}
                        type="button"
                        onClick={() => handleGuess(c)}
                        className="w-full text-left px-5 py-3 text-sm hover:bg-[#f0f3e8] transition-colors flex items-center justify-between border-b last:border-b-0 border-[#1a1a1a]/10 cursor-pointer"
                      >
                        <span className="font-semibold text-[#1a1a1a]">{c.name}</span>
                        <span className="text-xs text-stone-400">Select</span>
                      </button>
                    ))}
                  </div>
                )}
              </form>
            )}
          </div>
        ) : (
          <div className="bg-white border border-[#1a1a1a]/20 rounded-3xl p-8 text-center space-y-4 shadow-lg">
            <div className="w-16 h-16 bg-[#ff1a53]/15 text-[#ff1a53] rounded-full flex items-center justify-center mx-auto">
              <Sparkle size={32} weight="fill" />
            </div>
            <h2 className="text-3xl font-bold text-[#1a1a1a]">Game Over!</h2>
            <p className="text-base text-[#4a5048]">
              You achieved a streak of <span className="font-bold text-[#1a1a1a]">{streak}</span>.
              {streak === bestStreak && streak > 0 && " That's a new personal best!"}
            </p>

            <button
              onClick={startNewGame}
              className="inline-flex items-center gap-2 bg-[#1a1a1a] hover:bg-black text-white font-medium px-6 py-3.5 rounded-full text-base transition-colors cursor-pointer"
            >
              <ArrowClockwise size={18} />
              <span>Play Again</span>
            </button>
          </div>
        )}
      </main>
    </div>
  );
}