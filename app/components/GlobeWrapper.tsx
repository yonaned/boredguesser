// app/components/GlobeWrapper.tsx
"use client";

import dynamic from "next/dynamic";
import { GuessRecord } from "./Globe3D";

const GlobeInternal = dynamic(() => import("./Globe3D"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[420px] sm:h-[500px] lg:h-[620px] rounded-3xl bg-[#0f172a] flex flex-col items-center justify-center text-slate-400 gap-3">
      <div className="w-10 h-10 border-4 border-[#ff1a53] border-t-transparent rounded-full animate-spin" />
      <p className="text-sm font-medium">Generating 3D Globe...</p>
    </div>
  ),
});

export default function GlobeWrapper(props: {
  guesses: Record<string, GuessRecord>;
  focusedLocation: { lat: number; lng: number } | null;
}) {
  return <GlobeInternal {...props} />;
}