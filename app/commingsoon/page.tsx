import Link from "next/link";
import { Bricolage_Grotesque } from "next/font/google";
import InteractiveEye from "../components/InteractiveEye"; // adjust path if needed

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export default function ComingSoon() {
  return (
    <div
      className={`${bricolage.className} flex min-h-screen flex-col items-center justify-center bg-[#f0f3e8] text-[#1c1e1d] px-6 py-12 md:px-16`}
    >
      <main className="w-full max-w-6xl flex flex-col-reverse md:flex-row items-center justify-between gap-12 md:gap-16">
        {/* Left Column - Content */}
        <div className="flex-1 flex flex-col items-start text-left space-y-6">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#1a1a1a]">
            BoredGuesser<span className="text-[#ff1a53]">.com</span>
          </h1>

          <p className="max-w-xl text-base sm:text-lg md:text-xl text-[#4a5048] leading-relaxed font-normal">
            We’re building the most addictive way to cure your downtime. From
            trivia to visual puzzles, BoredGuesser keeps your mind sharp and your
            friends competing. Be among the first to play.
          </p>

          <Link
            href="/commingsoon/beta"
            className="group flex items-center gap-3 bg-[#2a2c2b] text-white font-medium text-base sm:text-lg px-6 py-3.5 rounded-xl shadow-sm hover:bg-black transition-all duration-200 active:scale-95 cursor-pointer mt-2"
          >
            <span>Be a Beta Tester</span>
            <span className="text-xl transition-transform duration-200 group-hover:translate-x-1">
              &rarr;
            </span>
          </Link>
        </div>

        {/* Right Column - Interactive Mascot Eye */}
        <div className="flex-1 flex items-center justify-center w-full max-w-xs sm:max-w-sm md:max-w-md">
          <InteractiveEye className="w-64 h-64 sm:w-80 sm:h-80 md:w-[380px] md:h-[380px]" />
        </div>
      </main>
    </div>
  );
}