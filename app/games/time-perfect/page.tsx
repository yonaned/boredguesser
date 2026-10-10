"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { Bricolage_Grotesque } from "next/font/google";
import {
  ArrowLeft,
  ArrowClockwise,
  Timer,
  CheckCircle,
  Lightning,
  Play,
  HandPalm,
  TrendUp,
  Target,
} from "@phosphor-icons/react";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

type GameMode = "even-seconds" | "split-ms";
type GameState = "idle" | "running" | "stopped";

// Format ms to "0.000s"
function formatSeconds(ms: number): string {
  return (ms / 1000).toFixed(3) + "s";
}

// Generates target based on mode
function generateTarget(mode: GameMode): number {
  if (mode === "even-seconds") {
    // 3, 4, 5, 6, 7, or 8 seconds
    const seconds = Math.floor(Math.random() * 6) + 3;
    return seconds * 1000;
  }
  // Split ms: 3000ms to 7500ms rounded to 50ms intervals
  const raw = Math.floor(Math.random() * 4500) + 3000;
  return Math.round(raw / 50) * 50;
}

// Exponential decay scoring based on millisecond error
function computeTimeScore(deltaMs: number): number {
  if (deltaMs === 0) return 100;
  // ~25ms delta gives ~92pts, ~100ms gives ~73pts, ~300ms gives ~39pts
  const raw = 100 * Math.exp(-deltaMs / 320);
  return Math.max(0, Math.min(100, Math.round(raw)));
}

function getScoreRating(deltaMs: number) {
  if (deltaMs <= 15) return { title: "Chronometer God!", color: "#16a34a" };
  if (deltaMs <= 50) return { title: "Incredible Timing!", color: "#22c55e" };
  if (deltaMs <= 120) return { title: "Sharp Precision!", color: "#0ea5e9" };
  if (deltaMs <= 300) return { title: "Solid Sense of Tempo 👍", color: "#eab308" };
  if (deltaMs <= 600) return { title: "A Bit Off Cadence", color: "#f97316" };
  return { title: "Way Off Beat! 😅", color: "#ff1a53" };
}

export default function TimeGuesserPage() {
  const [mode, setMode] = useState<GameMode>("even-seconds");
  const [targetMs, setTargetMs] = useState<number>(() => generateTarget("even-seconds"));
  const [gameState, setGameState] = useState<GameState>("idle");

  // Timer trackers
  const [elapsedMs, setElapsedMs] = useState<number>(0);
  const [stoppedMs, setStoppedMs] = useState<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Statistics
  const [rounds, setRounds] = useState<number>(0);
  const [totalScore, setTotalScore] = useState<number>(0);
  const [bestScore, setBestScore] = useState<number>(0);
  const [bestDelta, setBestDelta] = useState<number | null>(null);

  // Animation frame loop
  const updateTick = useCallback(() => {
    if (!startTimeRef.current) return;
    const now = performance.now();
    const currentElapsed = now - startTimeRef.current;
    setElapsedMs(currentElapsed);
    animFrameRef.current = requestAnimationFrame(updateTick);
  }, []);

  const handleStart = useCallback(() => {
    if (gameState === "running") return;
    setGameState("running");
    setStoppedMs(null);
    setElapsedMs(0);
    startTimeRef.current = performance.now();
    animFrameRef.current = requestAnimationFrame(updateTick);
  }, [gameState, updateTick]);

  const handleStop = useCallback(() => {
    if (gameState !== "running" || !startTimeRef.current) return;
    const finalElapsed = performance.now() - startTimeRef.current;
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);

    const roundedElapsed = Math.round(finalElapsed);
    setStoppedMs(roundedElapsed);
    setElapsedMs(roundedElapsed);
    setGameState("stopped");

    const delta = Math.abs(roundedElapsed - targetMs);
    const score = computeTimeScore(delta);

    setRounds((prev) => prev + 1);
    setTotalScore((prev) => prev + score);
    setBestScore((prev) => Math.max(prev, score));
    setBestDelta((prev) => (prev === null ? delta : Math.min(prev, delta)));
  }, [gameState, targetMs]);

  const handleNextRound = () => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    setTargetMs(generateTarget(mode));
    setGameState("idle");
    setElapsedMs(0);
    setStoppedMs(null);
    startTimeRef.current = null;
  };

  const handleModeSwitch = (newMode: GameMode) => {
    if (newMode === mode) return;
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    setMode(newMode);
    setTargetMs(generateTarget(newMode));
    setGameState("idle");
    setElapsedMs(0);
    setStoppedMs(null);
    startTimeRef.current = null;
  };

  const handleRestart = () => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    setTargetMs(generateTarget(mode));
    setGameState("idle");
    setElapsedMs(0);
    setStoppedMs(null);
    startTimeRef.current = null;
    setRounds(0);
    setTotalScore(0);
    setBestScore(0);
    setBestDelta(null);
  };

  // Keyboard Spacebar trigger
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        if (gameState === "idle") {
          handleStart();
        } else if (gameState === "running") {
          handleStop();
        } else if (gameState === "stopped") {
          handleNextRound();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameState, handleStart, handleStop, mode]);

  // Clean-up animation loop
  useEffect(() => {
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  const delta = stoppedMs !== null ? Math.abs(stoppedMs - targetMs) : null;
  const signedDelta = stoppedMs !== null ? stoppedMs - targetMs : null;
  const roundScore = delta !== null ? computeTimeScore(delta) : null;
  const rating = delta !== null ? getScoreRating(delta) : null;

  // Mask the timer after 1500ms to test player's internal clock
  const isMasked = gameState === "running" && elapsedMs > 1500;

  return (
    <div
      className={`${bricolage.className} min-h-screen bg-[#f0f3e8] text-[#1c1e1d] px-6 py-8 md:px-12 selection:bg-[#ff1a53] selection:text-white`}
    >
      {/* Header */}
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

      {/* Main Grid */}
      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column */}
        <div className="flex flex-col gap-6 bg-white/60 border border-[#1a1a1a]/20 rounded-3xl p-6 sm:p-8 backdrop-blur-sm shadow-sm">
          {/* Mode Switcher */}
          <div className="flex bg-[#e8e3d5] p-1.5 rounded-full border border-[#1a1a1a]/15">
            <button
              onClick={() => handleModeSwitch("even-seconds")}
              disabled={gameState === "running"}
              className={`flex-1 py-2 px-3 text-xs font-bold rounded-full transition-all flex items-center justify-center gap-1.5 ${
                mode === "even-seconds"
                  ? "bg-[#2a2c2b] text-white shadow-sm"
                  : "text-[#4a5048] hover:text-[#1a1a1a]"
              } ${gameState === "running" ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <Timer size={16} />
              <span>Even Seconds</span>
            </button>
            <button
              onClick={() => handleModeSwitch("split-ms")}
              disabled={gameState === "running"}
              className={`flex-1 py-2 px-3 text-xs font-bold rounded-full transition-all flex items-center justify-center gap-1.5 ${
                mode === "split-ms"
                  ? "bg-[#2a2c2b] text-white shadow-sm"
                  : "text-[#4a5048] hover:text-[#1a1a1a]"
              } ${gameState === "running" ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <Lightning size={16} />
              <span>Split Milliseconds</span>
            </button>
          </div>

          <div>
            <h2 className="text-3xl font-bold text-[#1a1a1a] mb-2">
              Master Your Clock
            </h2>
            <p className="text-sm text-[#4a5048]">
              {mode === "even-seconds"
                ? "Start the clock and hit STOP at the exact millisecond mark. The timer display fades after 1.5s to test your cadence."
                : "A random sub-second target duration. Lock into the timing and hit STOP as close to 0ms deviation as possible."}
            </p>
          </div>

          {/* Target Time Banner */}
          <div className="flex flex-col items-center justify-center p-6 bg-[#e8e3d5] rounded-2xl border border-[#1a1a1a]/15 text-center">
            <span className="text-xs font-semibold text-[#4a5048] uppercase tracking-wider mb-1">
              Target Duration
            </span>
            <span className="text-4xl font-extrabold tracking-widest text-[#1a1a1a] font-mono">
              {formatSeconds(targetMs)}
            </span>
            <span className="text-xs font-medium text-[#4a5048] mt-1">
              ({targetMs.toLocaleString()} milliseconds)
            </span>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 bg-[#e8e3d5] p-4 rounded-2xl border border-[#1a1a1a]/15">
              <div>
                <p className="text-xs font-semibold text-[#4a5048]">Best Score</p>
                <p className="text-xl font-bold">{bestScore} / 100</p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-[#e8e3d5] p-4 rounded-2xl border border-[#1a1a1a]/15">
              <div>
                <p className="text-xs font-semibold text-[#4a5048]">Closest Delta</p>
                <p className="text-xl font-bold font-mono">
                  {bestDelta !== null ? `±${bestDelta}ms` : "--"}
                </p>
              </div>
            </div>
          </div>

          {/* Primary Action Button */}
          {gameState === "idle" && (
            <button
              onClick={handleStart}
              className="flex items-center justify-center gap-2 bg-[#ff1a53] hover:bg-[#e01445] text-white font-medium py-3.5 px-6 rounded-full transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <Play size={20} weight="fill" />
              <span>Start Timer (Space)</span>
            </button>
          )}

          {gameState === "running" && (
            <button
              onClick={handleStop}
              className="flex items-center justify-center gap-2 bg-[#ff1a53] hover:bg-[#e01445] text-white font-medium py-3.5 px-6 rounded-full transition-all shadow-lg active:scale-95 cursor-pointer animate-pulse"
            >
              <HandPalm size={22} weight="bold" />
              <span>STOP NOW! (Space)</span>
            </button>
          )}

          {gameState === "stopped" && (
            <button
              onClick={handleNextRound}
              className="flex items-center justify-center gap-2 bg-[#ff1a53] hover:bg-[#e01445] text-white font-medium py-3.5 px-6 rounded-full transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <span>Next Round (Space)</span>
            </button>
          )}

          {/* Reset Game */}
          <button
            onClick={handleRestart}
            disabled={gameState === "running"}
            className="flex items-center justify-center gap-2 bg-[#2a2c2b] hover:bg-black text-white font-medium py-3 rounded-full transition-colors disabled:opacity-50"
          >
            <ArrowClockwise size={18} />
            <span>Reset Stats</span>
          </button>
        </div>

        {/* Right Column: Visualizer & Results */}
        <div className="lg:col-span-2 flex flex-col gap-6 bg-white/60 border border-[#1a1a1a]/20 rounded-3xl p-6 sm:p-8 backdrop-blur-sm shadow-sm">
          {/* Targets & Stopwatch Comparison Row */}
          <div className="grid grid-cols-2 gap-4">
            {/* Target Display Swatch */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center px-1">
                <span className="text-xs font-bold uppercase tracking-wider text-[#4a5048]">
                  Goal Time
                </span>
                <span className="font-mono text-xs text-[#1a1a1a] font-semibold">
                  Exact Target
                </span>
              </div>
              <div className="h-40 sm:h-48 rounded-2xl bg-[#e8e3d5] border border-[#1a1a1a]/20 shadow-inner flex flex-col items-center justify-center p-4">
                <Target size={28} className="text-[#4a5048] mb-2 opacity-70" />
                <span className="font-mono text-3xl sm:text-4xl font-extrabold text-[#1a1a1a] tracking-tight">
                  {formatSeconds(targetMs)}
                </span>
                <span className="text-xs text-[#4a5048] font-medium mt-1">
                  Preset Reference
                </span>
              </div>
            </div>

            {/* Stopped / Active Timer Swatch */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center px-1">
                <span className="text-xs font-bold uppercase tracking-wider text-[#4a5048]">
                  Your Chrono
                </span>
                <span className="font-mono text-xs text-[#1a1a1a] font-semibold">
                  {gameState === "stopped" ? "Recorded" : gameState === "running" ? "Running" : "Standby"}
                </span>
              </div>
              <div
                className={`h-40 sm:h-48 rounded-2xl border border-[#1a1a1a]/20 shadow-inner flex flex-col items-center justify-center p-4 transition-colors duration-300 ${
                  gameState === "running"
                    ? "bg-[#ff1a53]/10 border-[#ff1a53]/40"
                    : "bg-[#e8e3d5]"
                }`}
              >
                {gameState === "idle" && (
                  <span className="font-mono text-3xl sm:text-4xl font-extrabold text-[#8a8f88]">
                    0.000s
                  </span>
                )}

                {gameState === "running" && (
                  <>
                    {isMasked ? (
                      <div className="flex flex-col items-center gap-1.5 animate-pulse">
                        <span className="font-mono text-3xl sm:text-4xl font-extrabold text-[#ff1a53] tracking-widest">
                          ••.•••s
                        </span>
                        <span className="text-xs font-bold uppercase tracking-widest text-[#ff1a53]">
                          Blind Mode Active
                        </span>
                      </div>
                    ) : (
                      <span className="font-mono text-3xl sm:text-4xl font-extrabold text-[#1a1a1a] tabular-nums">
                        {formatSeconds(elapsedMs)}
                      </span>
                    )}
                  </>
                )}

                {gameState === "stopped" && stoppedMs !== null && (
                  <>
                    <span className="font-mono text-3xl sm:text-4xl font-extrabold text-[#1a1a1a] tabular-nums">
                      {formatSeconds(stoppedMs)}
                    </span>
                    <span
                      className="text-xs font-bold font-mono mt-1 px-2.5 py-0.5 rounded-full"
                      style={{
                        backgroundColor:
                          signedDelta && signedDelta > 0
                            ? "#fee2e2"
                            : signedDelta && signedDelta < 0
                            ? "#ffedd5"
                            : "#dcfce7",
                        color:
                          signedDelta && signedDelta > 0
                            ? "#dc2626"
                            : signedDelta && signedDelta < 0
                            ? "#c2410c"
                            : "#15803d",
                      }}
                    >
                      {signedDelta! > 0
                        ? `+${signedDelta}ms late`
                        : signedDelta! < 0
                        ? `${signedDelta}ms early`
                        : "0ms bullseye!"}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Submission Feedback Banner */}
          {gameState === "stopped" && roundScore !== null && rating && delta !== null && (
            <div className="flex items-center justify-between p-5 rounded-2xl bg-[#e8e3d5] border border-[#1a1a1a]/15 animate-in fade-in duration-300">
              <div>
                <p className="text-xs font-bold text-[#4a5048] uppercase tracking-wider">
                  Result
                </p>
                <p className="text-lg font-bold text-[#1a1a1a]">{rating.title}</p>
                <p className="text-xs text-[#4a5048] mt-0.5 font-mono">
                  Offset: <span className="font-bold text-[#1a1a1a]">{delta} ms</span> off
                </p>
              </div>
              <div className="text-right">
                <span className="text-3xl font-extrabold text-[#ff1a53]">
                  {roundScore}
                </span>
                <span className="text-sm font-semibold text-[#4a5048]"> / 100</span>
              </div>
            </div>
          )}

          {/* Timeline Visualizer & Offset Gauge */}
          <div className="flex flex-col gap-5 bg-[#f0f3e8] border border-[#1a1a1a]/15 p-6 rounded-2xl">
            <div>
              <p className="text-sm font-bold text-[#1a1a1a]">Precision Offset Gauge</p>
              <p className="text-xs text-[#4a5048]">
                Visual alignment comparison relative to the target time
              </p>
            </div>

            {/* Gauge Track */}
            <div className="relative w-full h-12 bg-[#e8e3d5] rounded-xl border border-[#1a1a1a]/20 flex items-center px-4 overflow-hidden shadow-inner">
              {/* Center Target Line */}
              <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-[#1a1a1a]/80 -translate-x-1/2 z-10">
                <div className="absolute top-1 left-1/2 -translate-x-1/2 text-[9px] font-bold uppercase tracking-wider text-[#1a1a1a] bg-white px-1 rounded border border-[#1a1a1a]/20">
                  Target
                </div>
              </div>

              {/* Sub-ranges indicators */}
              <div className="absolute left-[35%] right-[35%] top-0 bottom-0 bg-green-500/10 pointer-events-none" />

              {/* User Click Needle */}
              {gameState === "stopped" && signedDelta !== null && (
                <div
                  className="absolute top-0 bottom-0 w-1 bg-[#ff1a53] -translate-x-1/2 z-20 transition-all duration-500 shadow-sm"
                  style={{
                    // Map -1000ms to +1000ms delta across 0% to 100%
                    left: `${Math.max(5, Math.min(95, 50 + (signedDelta / 1000) * 50))}%`,
                  }}
                >
                  <div className="absolute bottom-1 left-1/2 -translate-x-1/2 whitespace-nowrap bg-[#2a2c2b] text-white text-[10px] font-mono font-bold px-1.5 py-0.5 rounded shadow">
                    {signedDelta > 0 ? `+${signedDelta}ms` : `${signedDelta}ms`}
                  </div>
                </div>
              )}

              {/* Idle Placeholder Track Needle */}
              {gameState !== "stopped" && (
                <div className="w-full flex justify-between text-[11px] text-[#4a5048]/60 font-mono select-none">
                  <span>-1000ms early</span>
                  <span className="opacity-0">Target</span>
                  <span>+1000ms late</span>
                </div>
              )}
            </div>

            {/* Tip Banner */}
            <div className="flex items-center gap-3 bg-white/70 p-3.5 rounded-xl border border-[#1a1a1a]/10">
              <TrendUp size={20} className="text-[#ff1a53] flex-shrink-0" />
              <p className="text-xs text-[#4a5048] leading-relaxed">
                <strong>Tip:</strong> Use the <strong className="text-[#1a1a1a]">[Spacebar]</strong> for near-zero finger release latency.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}