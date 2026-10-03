"use client";

import { useState, useRef, useMemo } from "react";
import Link from "next/link";
import { Bricolage_Grotesque } from "next/font/google";
import {
  ArrowLeft,
  ArrowClockwise,
  Palette,
  CheckCircle,
  Hash,
  ArrowsLeftRight,
} from "@phosphor-icons/react";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

type GameMode = "hex-to-color" | "color-to-hex";
type RGB = [number, number, number];

// --- Perceptual Color Math (CIELAB ΔE) ---

function hexToRgb(hex: string): RGB {
  const clean = hex.replace("#", "");
  const num = parseInt(clean, 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

function rgbToHex(r: number, g: number, b: number): string {
  return (
    "#" +
    [r, g, b]
      .map((val) =>
        Math.max(0, Math.min(255, Math.round(val)))
          .toString(16)
          .padStart(2, "0")
      )
      .join("")
      .toUpperCase()
  );
}

// Convert HSV (Hue: 0-360, Sat: 0-1, Val: 0-1) to RGB
function hsvToRgb(h: number, s: number, v: number): RGB {
  const f = (n: number) => {
    const k = (n + h / 60) % 6;
    return v - v * s * Math.max(Math.min(k, 4 - k, 1), 0);
  };
  return [
    Math.round(f(5) * 255),
    Math.round(f(3) * 255),
    Math.round(f(1) * 255),
  ];
}

function rgbToXyz(r: number, g: number, b: number): [number, number, number] {
  let [sr, sg, sb] = [r / 255, g / 255, b / 255].map((val) =>
    val > 0.04045 ? Math.pow((val + 0.055) / 1.055, 2.4) : val / 12.92
  );

  sr *= 100;
  sg *= 100;
  sb *= 100;

  const x = sr * 0.4124564 + sg * 0.3575761 + sb * 0.1804375;
  const y = sr * 0.2126729 + sg * 0.7151522 + sb * 0.072175;
  const z = sr * 0.0193339 + sg * 0.119192 + sb * 0.9503041;

  return [x, y, z];
}

function xyzToLab(x: number, y: number, z: number): [number, number, number] {
  x /= 95.047;
  y /= 100.0;
  z /= 108.883;

  const f = (t: number) => (t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116);
  const fx = f(x);
  const fy = f(y);
  const fz = f(z);

  return [116 * fy - 16, 500 * (fx - fy), 200 * (fy - fz)];
}

function calculateDeltaE(hex1: string, hex2: string): number {
  const lab1 = xyzToLab(...rgbToXyz(...hexToRgb(hex1)));
  const lab2 = xyzToLab(...rgbToXyz(...hexToRgb(hex2)));

  return Math.sqrt(
    Math.pow(lab1[0] - lab2[0], 2) +
      Math.pow(lab1[1] - lab2[1], 2) +
      Math.pow(lab1[2] - lab2[2], 2)
  );
}

function computeScore(deltaE: number): number {
  const rawScore = 100 - deltaE;
  return Math.max(0, Math.min(100, Math.round(rawScore)));
}

function getRandomHex(): string {
  const randomInt = Math.floor(Math.random() * 16777215);
  return "#" + randomInt.toString(16).padStart(6, "0").toUpperCase();
}

function isValidHex(hex: string): boolean {
  return /^#[0-9A-Fa-f]{6}$/.test(hex);
}

export default function HexGuesserPage() {
  const [mode, setMode] = useState<GameMode>("hex-to-color");
  const [targetHex, setTargetHex] = useState<string>(() => getRandomHex());

  // Visual HSV state for "Hex -> Color" mode
  const [hue, setHue] = useState<number>(210);
  const [sat, setSat] = useState<number>(0.5);
  const [val, setVal] = useState<number>(0.5);
  const [isDraggingSV, setIsDraggingSV] = useState(false);
  const svBoxRef = useRef<HTMLDivElement>(null);

  // Text input for "Color -> Hex" mode
  const [textHexInput, setTextHexInput] = useState<string>("");

  const [submitted, setSubmitted] = useState<boolean>(false);
  const [roundScore, setRoundScore] = useState<number | null>(null);

  // Statistics
  const [rounds, setRounds] = useState<number>(0);
  const [totalScore, setTotalScore] = useState<number>(0);
  const [bestScore, setBestScore] = useState<number>(0);

  // Derive visual color from HSV
  const visualGuessHex = useMemo(() => {
    return rgbToHex(...hsvToRgb(hue, sat, val));
  }, [hue, sat, val]);

  const formattedTextHex = textHexInput.startsWith("#")
    ? textHexInput.toUpperCase()
    : ("#" + textHexInput).toUpperCase();

  // Swatch color logic: In reverse mode, hide color until submitted
  const getGuessSwatchBg = () => {
    if (mode === "hex-to-color") {
      return visualGuessHex;
    }
    // Reverse mode: only reveal after submission
    if (!submitted) {
      return "#e8e3d5";
    }
    return isValidHex(formattedTextHex) ? formattedTextHex : "#e8e3d5";
  };

  // 2D Visual Pad Drag Handlers
  const updateSV = (clientX: number, clientY: number) => {
    if (!svBoxRef.current) return;
    const rect = svBoxRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, (clientY - rect.top) / rect.height));
    setSat(x);
    setVal(1 - y);
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (submitted) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDraggingSV(true);
    updateSV(e.clientX, e.clientY);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingSV || submitted) return;
    updateSV(e.clientX, e.clientY);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDraggingSV(false);
  };

  const handleModeSwitch = (newMode: GameMode) => {
    if (newMode === mode) return;
    setMode(newMode);
    setTargetHex(getRandomHex());
    setHue(210);
    setSat(0.5);
    setVal(0.5);
    setTextHexInput("");
    setSubmitted(false);
    setRoundScore(null);
  };

  const handleSubmit = () => {
    if (submitted) return;

    const guess = mode === "hex-to-color" ? visualGuessHex : formattedTextHex;
    if (!isValidHex(guess)) return;

    const delta = calculateDeltaE(targetHex, guess);
    const score = computeScore(delta);

    setRoundScore(score);
    setSubmitted(true);
    setRounds((prev) => prev + 1);
    setTotalScore((prev) => prev + score);
    setBestScore((prev) => Math.max(prev, score));
  };

  const handleNextRound = () => {
    setTargetHex(getRandomHex());
    setHue(Math.floor(Math.random() * 360));
    setSat(0.5);
    setVal(0.5);
    setTextHexInput("");
    setSubmitted(false);
    setRoundScore(null);
  };

  const handleRestart = () => {
    setTargetHex(getRandomHex());
    setHue(210);
    setSat(0.5);
    setVal(0.5);
    setTextHexInput("");
    setSubmitted(false);
    setRoundScore(null);
    setRounds(0);
    setTotalScore(0);
    setBestScore(0);
  };

  const getScoreMessage = (score: number) => {
    if (score >= 98) return "Flawless Eye! 🎯";
    if (score >= 90) return "Incredible Precision! ✨";
    if (score >= 80) return "Great Guess! 👍";
    if (score >= 60) return "Pretty Close! 🎨";
    return "Way Off! 😅";
  };

  const canSubmit =
    mode === "hex-to-color" ? true : isValidHex(formattedTextHex);

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
              onClick={() => handleModeSwitch("hex-to-color")}
              className={`flex-1 py-2 px-3 text-xs font-bold rounded-full transition-all flex items-center justify-center gap-1.5 ${
                mode === "hex-to-color"
                  ? "bg-[#2a2c2b] text-white shadow-sm"
                  : "text-[#4a5048] hover:text-[#1a1a1a]"
              }`}
            >
              <Palette size={16} />
              <span>Hex → Color</span>
            </button>
            <button
              onClick={() => handleModeSwitch("color-to-hex")}
              className={`flex-1 py-2 px-3 text-xs font-bold rounded-full transition-all flex items-center justify-center gap-1.5 ${
                mode === "color-to-hex"
                  ? "bg-[#2a2c2b] text-white shadow-sm"
                  : "text-[#4a5048] hover:text-[#1a1a1a]"
              }`}
            >
              <Hash size={16} />
              <span>Color → Hex</span>
            </button>
          </div>

          <div>
            <h2 className="text-3xl font-bold text-[#1a1a1a] mb-2">
              {mode === "hex-to-color" ? "Guess the Shade" : "Decode the Color"}
            </h2>
            <p className="text-sm text-[#4a5048]">
              {mode === "hex-to-color"
                ? "Given the HEX code, adjust the visual spectrum to match what you think it looks like."
                : "Study the target swatch and type your 6-digit hex estimate. The color is revealed on submission."}
            </p>
          </div>

          {/* Mode Target Prompt */}
          {mode === "hex-to-color" ? (
            <div className="flex flex-col items-center justify-center p-6 bg-[#e8e3d5] rounded-2xl border border-[#1a1a1a]/15 text-center">
              <span className="text-xs font-semibold text-[#4a5048] uppercase tracking-wider mb-1">
                Target Hex Code
              </span>
              <span className="text-4xl font-extrabold tracking-widest text-[#1a1a1a] font-mono">
                {targetHex}
              </span>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <label className="block text-sm font-semibold px-1">
                Enter 6-Digit Hex
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-5 font-mono text-lg font-bold text-[#4a5048]">
                  #
                </span>
                <input
                  type="text"
                  maxLength={6}
                  value={textHexInput.replace("#", "")}
                  disabled={submitted}
                  onChange={(e) =>
                    setTextHexInput(e.target.value.replace(/[^0-9A-Fa-f]/g, ""))
                  }
                  placeholder="e.g. 3B82F6"
                  className="w-full pl-10 pr-6 py-3.5 rounded-full border border-[#1a1a1a] bg-white outline-none focus:ring-2 focus:ring-[#ff1a53] transition-all font-mono text-base uppercase tracking-widest placeholder:text-[#8a8f88]"
                />
              </div>
            </div>
          )}

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
                <p className="text-xs font-semibold text-[#4a5048]">Average</p>
                <p className="text-xl font-bold">
                  {rounds > 0 ? Math.round(totalScore / rounds) : 0}
                </p>
              </div>
            </div>
          </div>

          {/* Submit / Next Round Button */}
          {!submitted ? (
            <button
              onClick={handleSubmit}
              disabled={!canSubmit}
              className={`flex items-center justify-center gap-2 font-medium py-3.5 px-6 rounded-full transition-all shadow-md active:scale-95 ${
                canSubmit
                  ? "bg-[#ff1a53] hover:bg-[#e01445] text-white cursor-pointer"
                  : "bg-[#1a1a1a]/20 text-[#4a5048]/60 cursor-not-allowed shadow-none"
              }`}
            >
              <CheckCircle size={20} />
              <span>Submit Guess</span>
            </button>
          ) : (
            <button
              onClick={handleNextRound}
              className="flex items-center justify-center gap-2 bg-[#ff1a53] hover:bg-[#e01445] text-white font-medium py-3.5 px-6 rounded-full transition-all shadow-md active:scale-95"
            >
              <span>Next Color →</span>
            </button>
          )}

          {/* Reset Game */}
          <button
            onClick={handleRestart}
            className="flex items-center justify-center gap-2 bg-[#2a2c2b] hover:bg-black text-white font-medium py-3 rounded-full transition-colors"
          >
            <ArrowClockwise size={18} />
            <span>Restart Game</span>
          </button>
        </div>

        {/* Right Column: Visualizer & Swatches */}
        <div className="lg:col-span-2 flex flex-col gap-6 bg-white/60 border border-[#1a1a1a]/20 rounded-3xl p-6 sm:p-8 backdrop-blur-sm shadow-sm">
          {/* Swatches Comparison Section */}
          <div className="grid grid-cols-2 gap-4">
            {/* Player's Guess Swatch */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center px-1">
                <span className="text-xs font-bold uppercase tracking-wider text-[#4a5048]">
                  Your Guess
                </span>
                <span className="font-mono text-xs text-[#1a1a1a] font-semibold">
                  {mode === "hex-to-color"
                    ? submitted
                      ? visualGuessHex
                      : "Visual Pick"
                    : submitted
                    ? formattedTextHex
                    : "???"}
                </span>
              </div>
              <div
                className="h-40 sm:h-48 rounded-2xl border border-[#1a1a1a]/20 shadow-inner flex items-center justify-center transition-all duration-300"
                style={{ backgroundColor: getGuessSwatchBg() }}
              >
                {mode === "color-to-hex" && !submitted && (
                  <span className="text-xs font-semibold text-[#4a5048]/60 uppercase tracking-widest px-4 text-center">
                    Hidden until submit
                  </span>
                )}
              </div>
            </div>

            {/* Target Color Swatch */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center px-1">
                <span className="text-xs font-bold uppercase tracking-wider text-[#4a5048]">
                  Target Color
                </span>
                <span className="font-mono text-xs text-[#1a1a1a] font-semibold">
                  {submitted ? targetHex : "???"}
                </span>
              </div>
              <div
                className="h-40 sm:h-48 rounded-2xl border border-[#1a1a1a]/20 shadow-inner flex items-center justify-center transition-all duration-500"
                style={{
                  backgroundColor:
                    mode === "color-to-hex" || submitted
                      ? targetHex
                      : "#e8e3d5",
                }}
              >
                {mode === "hex-to-color" && !submitted && (
                  <span className="text-4xl font-extrabold text-[#4a5048]/40">
                    ?
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Submission Feedback Banner */}
          {submitted && roundScore !== null && (
            <div className="flex items-center justify-between p-5 rounded-2xl bg-[#e8e3d5] border border-[#1a1a1a]/15">
              <div>
                <p className="text-xs font-bold text-[#4a5048] uppercase tracking-wider">
                  Result
                </p>
                <p className="text-lg font-bold text-[#1a1a1a]">
                  {getScoreMessage(roundScore)}
                </p>
              </div>
              <div className="text-right">
                <span className="text-3xl font-extrabold text-[#ff1a53]">
                  {roundScore}
                </span>
                <span className="text-sm font-semibold text-[#4a5048]">
                  {" "}
                  / 100
                </span>
              </div>
            </div>
          )}

          {/* Custom Visual Picker Canvas (Zero RGB / Zero Hex) */}
          {mode === "hex-to-color" ? (
            <div className="flex flex-col gap-4 bg-[#f0f3e8] border border-[#1a1a1a]/15 p-5 rounded-2xl">
              <div>
                <p className="text-sm font-bold text-[#1a1a1a]">Visual Color Pad</p>
                <p className="text-xs text-[#4a5048]">
                  Drag across the pad to adjust shade; slide below to change hue
                </p>
              </div>

              {/* 2D Saturation / Value Gradient Area */}
              <div
                ref={svBoxRef}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                className="relative w-full h-48 sm:h-56 rounded-xl border border-[#1a1a1a]/20 shadow-inner cursor-crosshair overflow-hidden touch-none select-none"
                style={{ backgroundColor: `hsl(${hue}, 100%, 50%)` }}
              >
                {/* Horizontal white to transparent (Saturation) */}
                <div className="absolute inset-0 bg-gradient-to-r from-white to-transparent pointer-events-none" />
                {/* Vertical transparent to black (Value) */}
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent pointer-events-none" />

                {/* Draggable Circle Reticle */}
                <div
                  className="absolute w-5 h-5 rounded-full border-2 border-white shadow-md -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                  style={{
                    left: `${sat * 100}%`,
                    top: `${(1 - val) * 100}%`,
                    backgroundColor: visualGuessHex,
                  }}
                />
              </div>

              {/* 1D Rainbow Hue Spectrum Slider */}
              <div className="flex flex-col gap-1.5">
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={hue}
                  disabled={submitted}
                  onChange={(e) => setHue(Number(e.target.value))}
                  className="w-full h-4 rounded-full cursor-pointer appearance-none border border-[#1a1a1a]/20 outline-none"
                  style={{
                    background:
                      "linear-gradient(to right, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)",
                  }}
                />
              </div>
            </div>
          ) : (
            <div className="bg-[#f0f3e8] border border-[#1a1a1a]/15 p-5 rounded-2xl flex items-center gap-4">
              <ArrowsLeftRight size={28} className="text-[#ff1a53] flex-shrink-0" />
              <p className="text-xs leading-relaxed text-[#4a5048]">
                <strong>Reverse Mode:</strong> Look at the target color on the right
                and type in your 6-digit hex estimate. Both your guess swatch and the target hex code remain hidden until you submit.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}