"use client";

import Link from "next/link";
import { useState } from "react";
import { Bricolage_Grotesque } from "next/font/google";
import {
  ArrowRight,
  Sparkle,
  Fire,
  Trophy,
  Lightning,
  MagnifyingGlass,
  Tag,
  GlobeHemisphereWest,
  GameController,
  Play,
  CheckCircle,
} from "@phosphor-icons/react";
import InteractiveEye from "@/app/components/InteractiveEye";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

interface GameMode {
  id: string;
  title: string;
  badge: string;
  tagColor: string;
  description: string;
  icon: typeof MagnifyingGlass;
  stat: string;
}

const GAME_MODES: GameMode[] = [
  {
    id: "macro-peek",
    title: "Macro Peek",
    badge: "Daily Drop",
    tagColor: "bg-[#ff1a53] text-white",
    description: "Identify everyday objects magnified at 500x zoom before pixels reveal the truth.",
    icon: MagnifyingGlass,
    stat: "4 Clues",
  },
  {
    id: "price-oracle",
    title: "Price Oracle",
    badge: "Fan Favorite",
    tagColor: "bg-[#2a2c2b] text-white",
    description: "Guess vintage catalog listings, rare memorabilia auctions, and luxury items.",
    icon: Tag,
    stat: "+/- 10% Range",
  },
  {
    id: "silhouette-geo",
    title: "Geo Silhouette",
    badge: "Geography",
    tagColor: "bg-[#d8e2c8] text-[#1a1a1a]",
    description: "Recognize global skylines, islands, and border outlines from abstract shadows.",
    icon: GlobeHemisphereWest,
    stat: "1 Minute",
  },
  {
    id: "speed-clues",
    title: "Trivia Blitz",
    badge: "Multiplayer",
    tagColor: "bg-[#ffd43f] text-[#1a1a1a]",
    description: "Rapid-fire 3-clue deductions. The fewer hints you burn, the higher your score.",
    icon: Lightning,
    stat: "Top 5% Ranks",
  },
];

export default function DemoLandingPage() {
  const [interactiveGuess, setInteractiveGuess] = useState<string | null>(null);

  return (
    <div
      className={`${bricolage.className} min-h-screen bg-[#f0f3e8] text-[#1a1a1a] selection:bg-[#ff1a53] selection:text-white flex flex-col justify-between`}
    >
      {/* 1. Navigation Bar */}
      <header className="w-full border-b border-[#1a1a1a]/15 bg-[#f0f3e8]/80 backdrop-blur-md sticky top-0 z-50 px-6 py-4 md:px-12">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-2xl font-extrabold tracking-tight flex items-center gap-1">
            BoredGuesser<span className="text-[#ff1a53]">.com</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-[#4a5048]">
            <a href="#modes" className="hover:text-[#1a1a1a] transition-colors">
              Game Modes
            </a>
            <a href="#daily" className="hover:text-[#1a1a1a] transition-colors">
              Daily Drop
            </a>
            <a href="#about" className="hover:text-[#1a1a1a] transition-colors">
              Why Us
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/commingsoon/beta"
              className="group flex items-center gap-2 text-sm font-semibold bg-[#2a2c2b] text-white px-5 py-2.5 rounded-full hover:bg-black transition-all active:scale-95 shadow-sm"
            >
              <span>Join Beta</span>
              <ArrowRight
                size={16}
                className="transition-transform duration-200 group-hover:translate-x-1"
              />
            </Link>
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="px-6 pt-12 pb-16 md:pt-20 md:pb-24 max-w-6xl mx-auto w-full">
        <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-12 lg:gap-16">
          {/* Hero Copy */}
          <div className="flex-1 flex flex-col items-start space-y-6 text-left">
            <div className="inline-flex items-center gap-2 bg-white/70 border border-[#1a1a1a] rounded-full px-4 py-1.5 text-xs font-semibold tracking-wide uppercase shadow-[2px_2px_0px_#1a1a1a]">
              <Sparkle size={14} className="text-[#ff1a53]" weight="fill" />
              <span>Next Game Drop in 04:12:35</span>
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.05] text-[#1a1a1a]">
              Kill your boredom,{" "}
              <span className="text-[#ff1a53] underline decoration-4 underline-offset-4">
                one guess
              </span>{" "}
              at a time.
            </h1>

            <p className="text-lg sm:text-xl text-[#4a5048] max-w-xl font-normal leading-relaxed">
              Fast, addictive guessing games built for quick desk breaks and friendly rivalries.
              Macro zoom-ins, obscure auction prices, and visual mysteries updated daily.
            </p>

            {/* Hero CTAs & Social Proof */}
            <div className="flex flex-wrap items-center gap-4 pt-2 w-full sm:w-auto">
              <Link
                href="/commingsoon/beta"
                className="group flex items-center justify-center gap-3 bg-[#ff1a53] text-white font-bold text-base sm:text-lg px-8 py-4 rounded-full shadow-[4px_4px_0px_#1a1a1a] border-2 border-[#1a1a1a] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#1a1a1a] transition-all cursor-pointer w-full sm:w-auto"
              >
                <span>Play Today's Beta Drop</span>
                <Play size={18} weight="fill" />
              </Link>
              <a
                href="#modes"
                className="flex items-center justify-center gap-2 bg-white/70 text-[#1a1a1a] font-semibold text-base px-6 py-4 rounded-full border-2 border-[#1a1a1a] hover:bg-white transition-all w-full sm:w-auto"
              >
                <GameController size={20} />
                <span>Explore Modes</span>
              </a>
            </div>

            <div className="flex items-center gap-6 pt-4 text-xs sm:text-sm text-[#4a5048] font-medium">
              <div className="flex items-center gap-1.5">
                <CheckCircle size={18} weight="fill" className="text-[#ff1a53]" />
                <span>Zero paywalls</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle size={18} weight="fill" className="text-[#ff1a53]" />
                <span>60-second games</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle size={18} weight="fill" className="text-[#ff1a53]" />
                <span>Daily streaks</span>
              </div>
            </div>
          </div>

          {/* Hero Visual: Mascot + Floating Badge */}
          <div className="flex-1 flex flex-col items-center justify-center relative w-full max-w-xs sm:max-w-sm md:max-w-md">
            <div className="relative">
              <InteractiveEye className="w-64 h-64 sm:w-80 sm:h-80 md:w-[380px] md:h-[380px]" />
              {/* Floating Interactive Speech Bubble */}
              <div className="absolute -bottom-4 -left-4 sm:-bottom-6 sm:-left-6 bg-white border-2 border-[#1a1a1a] rounded-2xl p-4 shadow-[4px_4px_0px_#1a1a1a] max-w-[200px] text-xs font-semibold">
                <p className="text-[#1a1a1a]">
                  "Move your mouse or tap me. I&apos;m watching your guesses!"
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Micro Demo / Interactive Teaser Section */}
      <section id="daily" className="px-6 py-12 bg-white/60 border-y border-[#1a1a1a]/15">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-2 text-left">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#ff1a53] uppercase tracking-wider">
              <Fire size={16} weight="fill" />
              <span>Sample Question #084</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1a1a1a]">
              What everyday item is this?
            </h2>
            <p className="text-[#4a5048] text-sm sm:text-base">
              Hint: You probably used it this morning.
            </p>
          </div>

          {/* Interactive Guess Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            {["Coffee Filter", "Toothbrush Bristles", "Ballpoint Pen"].map((option) => (
              <button
                key={option}
                onClick={() => setInteractiveGuess(option)}
                className={`px-5 py-3 rounded-full text-sm font-semibold border border-[#1a1a1a] transition-all cursor-pointer ${
                  interactiveGuess === option
                    ? option === "Toothbrush Bristles"
                      ? "bg-[#2a2c2b] text-white shadow-[2px_2px_0px_#ff1a53]"
                      : "bg-[#ff1a53]/15 text-[#ff1a53] line-through"
                    : "bg-white hover:bg-[#f0f3e8]"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
        {interactiveGuess && (
          <div className="max-w-4xl mx-auto mt-4 text-sm font-medium text-center text-[#4a5048]">
            {interactiveGuess === "Toothbrush Bristles" ? (
              <span className="text-[#1a1a1a] font-bold">
                🎯 Correct! Micro-zoom reveals nylon filament ends.
              </span>
            ) : (
              <span>Not quite! Try another guess or join the beta for the daily drop.</span>
            )}
          </div>
        )}
      </section>

      {/* 4. Game Modes Grid */}
      <section id="modes" className="px-6 py-16 md:py-24 max-w-6xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#1a1a1a]">
            Curated games for restless brains.
          </h2>
          <p className="text-[#4a5048] text-base sm:text-lg">
            No 20-minute tutorials or filler storylines. Jump in, test your intuition, and flex your
            streak.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {GAME_MODES.map((mode) => {
            const Icon = mode.icon;
            return (
              <div
                key={mode.id}
                className="group flex flex-col justify-between p-6 bg-white/70 border-2 border-[#1a1a1a] rounded-3xl shadow-[4px_4px_0px_#1a1a1a] hover:-translate-y-1 hover:shadow-[6px_6px_0px_#1a1a1a] transition-all duration-200"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-[#f0f3e8] border border-[#1a1a1a] flex items-center justify-center">
                      <Icon size={24} className="text-[#1a1a1a]" weight="bold" />
                    </div>
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full border border-[#1a1a1a] ${mode.tagColor}`}
                    >
                      {mode.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-[#1a1a1a]">{mode.title}</h3>
                  <p className="text-sm text-[#4a5048] leading-relaxed">{mode.description}</p>
                </div>

                <div className="pt-6 mt-6 border-t border-[#1a1a1a]/10 flex items-center justify-between text-xs font-semibold text-[#8a8f88]">
                  <span>Format: {mode.stat}</span>
                  <Link
                    href="/commingsoon/beta"
                    className="text-[#1a1a1a] group-hover:text-[#ff1a53] flex items-center gap-1 transition-colors"
                  >
                    <span>Play</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. Features / Why It Works */}
      <section id="about" className="px-6 py-16 bg-[#e5ebd9]/60 border-t border-[#1a1a1a]/15">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          <div className="space-y-2 p-4">
            <div className="text-[#ff1a53] font-bold text-2xl">01.</div>
            <h4 className="text-lg font-bold text-[#1a1a1a]">Built for Micro-Breaks</h4>
            <p className="text-sm text-[#4a5048]">
              Designed to take under 2 minutes. Get that satisfying dopamine hit between tasks
              without getting sucked into a doomscroll spiral.
            </p>
          </div>

          <div className="space-y-2 p-4">
            <div className="text-[#ff1a53] font-bold text-2xl">02.</div>
            <h4 className="text-lg font-bold text-[#1a1a1a]">Bragging Rights Only</h4>
            <p className="text-sm text-[#4a5048]">
              Shareable spoiler-free score grids. See how your deductive powers compare to players
              worldwide every single midnight.
            </p>
          </div>

          <div className="space-y-2 p-4">
            <div className="text-[#ff1a53] font-bold text-2xl">03.</div>
            <h4 className="text-lg font-bold text-[#1a1a1a]">Always Fresh Clues</h4>
            <p className="text-sm text-[#4a5048]">
              Handcrafted puzzles that reward lateral thinking, observation, and intuition over
              stuffy textbook memorization.
            </p>
          </div>
        </div>
      </section>

      {/* 6. Pre-Launch Beta Banner */}
      <section className="px-6 py-16 max-w-5xl mx-auto w-full">
        <div className="bg-[#2a2c2b] text-white rounded-3xl p-8 sm:p-12 border-2 border-[#1a1a1a] shadow-[6px_6px_0px_#ff1a53] flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 text-left">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#ff1a53] uppercase tracking-wider">
              <Trophy size={16} weight="fill" />
              <span>Founding Cohort</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Get early access to BoredGuesser.
            </h2>
            <p className="text-[#8a8f88] text-base max-w-lg">
              Help test early mechanics, unlock the "Genesis Guesser" badge, and vote on upcoming game
              categories.
            </p>
          </div>

          <Link
            href="/commingsoon/beta"
            className="group flex-shrink-0 flex items-center gap-3 bg-[#ff1a53] text-white font-bold text-base px-8 py-4 rounded-full border border-black hover:bg-[#ff3366] transition-all active:scale-95 shadow-md"
          >
            <span>Apply for Beta</span>
            <ArrowRight
              size={18}
              className="transition-transform duration-200 group-hover:translate-x-1"
            />
          </Link>
        </div>
      </section>

      {/* 7. Footer */}
      <footer className="border-t border-[#1a1a1a]/15 bg-[#f0f3e8] px-6 py-8 md:px-12 text-sm text-[#4a5048]">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-medium">
            © {new Date().getFullYear()} BoredGuesser.com. Keep your mind sharp.
          </p>
          <div className="flex items-center gap-6 font-semibold">
            <Link href="/commingsoon" className="hover:text-[#1a1a1a] transition-colors">
              Coming Soon
            </Link>
            <Link href="/commingsoon/beta" className="hover:text-[#1a1a1a] transition-colors">
              Beta Access
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}