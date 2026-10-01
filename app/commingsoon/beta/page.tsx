"use client";

import { useState } from "react";
import Link from "next/link";
import { Bricolage_Grotesque } from "next/font/google";
import { ArrowLeft, ArrowRight, Check } from "@phosphor-icons/react";
import InteractiveEye from "@/app/components/InteractiveEye";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export default function BetaPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    reason: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <div
      className={`${bricolage.className} flex min-h-screen flex-col items-center justify-center bg-[#f0f3e8] text-[#1c1e1d] px-6 py-12 md:px-16`}
    >
      <main className="w-full max-w-6xl flex flex-col-reverse md:flex-row items-center justify-between gap-12 md:gap-16">
        {/* Left Column - Form Content */}
        <div className="flex-1 flex flex-col items-start text-left space-y-6 w-full max-w-lg">
          <Link
            href="/commingsoon"
            className="group flex items-center gap-2 text-[#4a5048] hover:text-[#1a1a1a] text-sm font-medium transition-colors"
          >
            <ArrowLeft
              size={18}
              className="transition-transform duration-200 group-hover:-translate-x-1"
            />
            <span>Back to Home</span>
          </Link>

          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#1a1a1a]">
              Become a <span className="text-[#ff1a53]">Beta Tester</span>
            </h1>
            <p className="text-base sm:text-lg text-[#4a5048]">
              Sign up to get early access to BoredGuesser and shape our product before launch.
            </p>
          </div>

          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="w-full space-y-5 pt-2">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-semibold text-[#1a1a1a] mb-2 px-1"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  placeholder="Jane Doe"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-6 py-3.5 rounded-full border border-[#1a1a1a] bg-transparent outline-none focus:outline-none focus:ring-0 transition-all text-base text-[#1a1a1a] placeholder:text-[#8a8f88]"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-[#1a1a1a] mb-2 px-1"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  placeholder="jane@example.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-6 py-3.5 rounded-full border border-[#1a1a1a] bg-transparent outline-none focus:outline-none focus:ring-0 transition-all text-base text-[#1a1a1a] placeholder:text-[#8a8f88]"
                />
              </div>

              <div>
                <label
                  htmlFor="reason"
                  className="block text-sm font-semibold text-[#1a1a1a] mb-2 px-1"
                >
                  Why are you interested? (Optional)
                </label>
                <textarea
                  id="reason"
                  rows={3}
                  placeholder="I love guessing games..."
                  value={formData.reason}
                  onChange={(e) =>
                    setFormData({ ...formData, reason: e.target.value })
                  }
                  className="w-full px-6 py-3.5 rounded-3xl border border-[#1a1a1a] bg-transparent outline-none focus:outline-none focus:ring-0 transition-all text-base text-[#1a1a1a] placeholder:text-[#8a8f88] resize-none"
                />
              </div>

              <button
                type="submit"
                className="group flex items-center justify-center gap-3 w-full bg-[#2a2c2b] text-white font-medium text-base sm:text-lg px-6 py-3.5 rounded-full shadow-sm hover:bg-black transition-all duration-200 active:scale-95 cursor-pointer mt-4"
              >
                <span>Submit Application</span>
                <ArrowRight
                  size={20}
                  className="transition-transform duration-200 group-hover:translate-x-1"
                />
              </button>
            </form>
          ) : (
            <div className="w-full bg-white/60 border border-[#1a1a1a] rounded-3xl p-8 text-center space-y-4 mt-2">
              <div className="w-14 h-14 bg-[#ff1a53]/10 text-[#ff1a53] rounded-full flex items-center justify-center mx-auto">
                <Check size={28} weight="bold" />
              </div>
              <h2 className="text-2xl font-bold text-[#1a1a1a]">
                You&apos;re on the list!
              </h2>
              <p className="text-base text-[#4a5048]">
                Thank you for applying,{" "}
                <span className="font-semibold text-[#1a1a1a]">
                  {formData.name}
                </span>
                . We&apos;ll notify you at{" "}
                <span className="font-semibold text-[#ff1a53]">
                  {formData.email}
                </span>{" "}
                when testing begins.
              </p>
              <Link
                href="/commingsoon"
                className="inline-block mt-4 bg-[#2a2c2b] text-white px-6 py-3 rounded-full text-base font-medium hover:bg-black transition-colors"
              >
                Back to Home
              </Link>
            </div>
          )}
        </div>

        {/* Right Column - Logo Image */}
        <div className="flex-1 flex items-center justify-center w-full max-w-xs sm:max-w-sm md:max-w-md">
          <InteractiveEye className="w-64 h-64 sm:w-80 sm:h-80 md:w-[380px] md:h-[380px]" />
        </div>
      </main>
    </div>
  );
}