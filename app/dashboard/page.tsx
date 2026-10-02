"use client";

import { useState } from "react";
import Link from "next/link";
import { Bricolage_Grotesque } from "next/font/google";
import { ArrowUpRight, Play } from "@phosphor-icons/react";
import InteractiveEye from "@/app/components/InteractiveEye";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const CATEGORIES = ["All", "Visual Puzzles", "Trivia", "Geography", "Daily Challenge"];

const GAMES = [
  {
    id: "pixel-blur",
    title: "Pixel Blur",
    category: "Visual Puzzles",
    players: "12 players",
    difficulty: "Low",
    color: "bg-[#2a4d44]",
    description: "Pixel orregutrador reload the dragon pixel blur.",
    hasTopIcon: true,
  },
  {
    id: "where-world",
    title: "Where in the World",
    category: "Geography",
    players: "72 players",
    difficulty: "High",
    color: "bg-[#233538]",
    description: "Where in the news words, early in the World in the USA.",
  },
  {
    id: "climpd-state",
    title: "Climpd State",
    category: "Geography",
    players: "43 players",
    difficulty: "High",
    color: "bg-[#18392b]",
    description: "Comparte the comnestands of the chre to and your campoay.",
  },
  {
    id: "pixiel-puzzles",
    title: "Pixiel Puzzles",
    category: "Visual Puzzles",
    players: "27 players",
    difficulty: "Low",
    color: "bg-[#ba3d3b]",
    description: "How smany games can invecided to the letters!?",
  },
  {
    id: "visual-puzzles",
    title: "Visual Puzzles",
    category: "Visual Puzzles",
    players: "23 players",
    difficulty: "High",
    color: "bg-[#278659]",
    description: "Where igeography foar to compare is but you can efttend school.",
  },
  {
    id: "daily-challenge",
    title: "Daily Challenge",
    category: "Daily Challenge",
    players: "33 players",
    difficulty: "Loved",
    color: "bg-[#2c3e50]",
    description: "Visual browser games what does now challenge?",
  },
];

export default function GamesDashboard() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredGames =
    activeCategory === "All"
      ? GAMES
      : GAMES.filter((game) => game.category === activeCategory);

  return (
    <div className={`${bricolage.className} min-h-screen bg-[#e8e3d5] text-[#1a1a1a]`}>
      {/* Top Header Navbar */}
      <header className="border-b border-[#1a1a1a]/15 px-6 py-4 sm:px-12">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link href="/commingsoon" className="flex items-center gap-3 group">
            <div className="w-8 h-8">
              <InteractiveEye />
            </div>
            <span className="text-2xl font-bold tracking-tight text-[#1a1a1a]">
              BoredGuesser<span className="text-[#ff1a53]">.</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-8 text-sm font-medium text-[#4a5048] md:flex">
            <Link href="#games" className="text-[#1a1a1a] transition-colors hover:text-[#ff1a53]">
              Games
            </Link>
            <Link href="#leaderboard" className="transition-colors hover:text-[#1a1a1a]">
              Leaderboards
            </Link>
            <Link href="#community" className="transition-colors hover:text-[#1a1a1a]">
              Community
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <button className="text-sm font-medium text-[#1a1a1a] hover:underline">
              Log In
            </button>
            <Link
              href="/commingsoon/beta"
              className="group flex items-center gap-1.5 rounded-full border border-[#1a1a1a] px-4 py-1.5 text-sm font-medium transition-colors hover:bg-[#1a1a1a] hover:text-white"
            >
              <span>Beta Access</span>
              <ArrowUpRight size={16} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-10 sm:px-12">
        {/* Title Section */}
        <h1 className="text-6xl  font-normal tracking-tight text-[#1a1a1a] mb-6">
          Games
        </h1>

        {/* Category Filter Pills */}
        <div className="mb-8 flex flex-wrap gap-2.5">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 text-sm font-medium rounded-full transition-all ${
                  isActive
                    ? "bg-[#1a1a1a] text-white border border-[#1a1a1a]"
                    : "bg-transparent text-[#2a2c2b] border border-[#1a1a1a]/40 hover:border-[#1a1a1a]"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Dashboard Grid */}
        <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredGames.map((game) => (
            <div
              key={game.id}
              className="group flex flex-col justify-between rounded-2xl border border-[#1a1a1a]/30 p-3.5 transition-all"
            >
              <div>
                {/* Visual Image / Banner Box */}
                <div
                  className={`relative aspect-[16/9] w-full rounded-xl ${game.color} overflow-hidden flex items-center justify-center`}
                >
                  <div className="w-16 h-16 opacity-85 transition-transform duration-300 group-hover:scale-110">
                    <InteractiveEye />
                  </div>

                  
                </div>

                {/* Card Content Header */}
                <div className="p-1 pt-4">
                  <h2 className="text-xl font-semibold tracking-tight text-[#1a1a1a] leading-tight">
                    {game.title}
                  </h2>
                  <p className="mt-1.5 text-xs text-[#555a53] leading-relaxed line-clamp-2">
                    {game.description}
                  </p>
                </div>
              </div>

              {/* Card Bottom Bar */}
              <div className="mt-4 px-1 pb-1 flex items-center justify-between text-xs font-medium text-[#2a2c2b]">
                <span>
                  {game.players} • Difficulty: {game.difficulty}
                </span>

                <button
                  aria-label={`Play ${game.title}`}
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#222423] text-white transition-transform group-hover:scale-105 active:scale-95"
                >
                  <Play size={14} weight="fill" />
                </button>
              </div>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}