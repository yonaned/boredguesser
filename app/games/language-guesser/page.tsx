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
    Lightbulb,
    Compass,
    Quotes,
    CheckCircle,
    XCircle,
} from "@phosphor-icons/react";
// @ts-expect-error untyped canvas-confetti
import confetti from "canvas-confetti";
import GlobeWrapper from "@/app/components/GlobeWrapper";
import { COUNTRIES, Country } from "../country-proximity/countries";
import { getHaversineDistanceKm, getDistanceColor } from "../country-proximity/geo";
import { checkIsNeighbor } from "../country-proximity/borders";
import { GuessRecord } from "@/app/components/Globe3D";
import rawLanguagesData from "./languages.json";

const bricolage = Bricolage_Grotesque({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700", "800"],
    display: "swap",
});

// --- Types ---
export interface LanguageCountry {
    name?: string | null;
    alpha_2?: string | null;
    alpha_3?: string | null;
}

export interface LanguageEntry {
    language_name: string;
    countries: LanguageCountry[];
    sentences: string[];
}

export interface LanguageGuessAttempt {
    id: string;
    guessedName: string;
    isCorrect: boolean;
    scorePenalty: number;
}

// Cast dataset
const LANGUAGES_DATA = rawLanguagesData as Record<string, LanguageEntry>;

// Precompute reverse lookup: Country code / name -> Languages spoken (null-safe)
const COUNTRY_TO_LANGUAGES: Record<string, string[]> = {};
for (const entry of Object.values(LANGUAGES_DATA)) {
    if (!entry || !Array.isArray(entry.countries)) continue;

    for (const c of entry.countries) {
        if (!c) continue;

        const idKey = typeof c.alpha_2 === "string" ? c.alpha_2.trim().toUpperCase() : "";
        const nameKey = typeof c.name === "string" ? c.name.trim().toLowerCase() : "";

        if (idKey) {
            if (!COUNTRY_TO_LANGUAGES[idKey]) COUNTRY_TO_LANGUAGES[idKey] = [];
            if (!COUNTRY_TO_LANGUAGES[idKey].includes(entry.language_name)) {
                COUNTRY_TO_LANGUAGES[idKey].push(entry.language_name);
            }
        }
        if (nameKey) {
            if (!COUNTRY_TO_LANGUAGES[nameKey]) COUNTRY_TO_LANGUAGES[nameKey] = [];
            if (!COUNTRY_TO_LANGUAGES[nameKey].includes(entry.language_name)) {
                COUNTRY_TO_LANGUAGES[nameKey].push(entry.language_name);
            }
        }
    }
}

const getLanguagesForCountry = (c: Country): string[] => {
    const fromId = (typeof c.id === "string" && COUNTRY_TO_LANGUAGES[c.id.toUpperCase()]) || [];
    const fromName = (typeof c.name === "string" && COUNTRY_TO_LANGUAGES[c.name.toLowerCase()]) || [];
    return Array.from(new Set([...fromId, ...fromName]));
};

const STARTING_SCORE = 1500;
const WRONG_GUESS_PENALTY = 200;
const COUNTRY_HINT_PENALTY = 250;
const SENTENCE_HINT_PENALTY = 100;

export default function LanguageGuesserPage() {
    const [targetCode, setTargetCode] = useState<string>("");
    const [sentenceIndex, setSentenceIndex] = useState(0);

    // Inputs
    const [langInput, setLangInput] = useState("");
    const [countryHintInput, setCountryHintInput] = useState("");
    const [showLangDropdown, setShowLangDropdown] = useState(false);
    const [showCountryDropdown, setShowCountryDropdown] = useState(false);

    // Game state
    const [score, setScore] = useState(STARTING_SCORE);
    const [langGuesses, setLangGuesses] = useState<LanguageGuessAttempt[]>([]);
    const [globeGuesses, setGlobeGuesses] = useState<GuessRecord[]>([]);
    const [focusedLocation, setFocusedLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [hasWon, setHasWon] = useState(false);
    const [hasGivenUp, setHasGivenUp] = useState(false);
    const [revealedSentenceCount, setRevealedSentenceCount] = useState(1);

    const langContainerRef = useRef<HTMLDivElement>(null);
    const countryContainerRef = useRef<HTMLDivElement>(null);

    const targetLang = useMemo(() => {
        return LANGUAGES_DATA[targetCode] ?? null;
    }, [targetCode]);

    // Close dropdowns on outside clicks
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (langContainerRef.current && !langContainerRef.current.contains(e.target as Node)) {
                setShowLangDropdown(false);
            }
            if (countryContainerRef.current && !countryContainerRef.current.contains(e.target as Node)) {
                setShowCountryDropdown(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Null-safe matching of target language's country codes to coordinates in COUNTRIES
    const targetCountryObjects = useMemo(() => {
        if (!targetLang || !Array.isArray(targetLang.countries)) return [];
        return COUNTRIES.filter((c) =>
            targetLang.countries.some((tc) => {
                if (!tc) return false;
                const matchAlpha2 =
                    typeof tc.alpha_2 === "string" &&
                    typeof c.id === "string" &&
                    tc.alpha_2.trim().toUpperCase() === c.id.trim().toUpperCase();
                const matchName =
                    typeof tc.name === "string" &&
                    typeof c.name === "string" &&
                    tc.name.trim().toLowerCase() === c.name.trim().toLowerCase();
                return matchAlpha2 || matchName;
            })
        );
    }, [targetLang]);

    // Start / Reset Game
    const startNewGame = () => {
        const keys = Object.keys(LANGUAGES_DATA);
        const randomKey = keys[Math.floor(Math.random() * keys.length)];
        setTargetCode(randomKey);
        setSentenceIndex(0);
        setRevealedSentenceCount(1);
        setScore(STARTING_SCORE);
        setLangGuesses([]);
        setGlobeGuesses([]);
        setHasWon(false);
        setHasGivenUp(false);
        setLangInput("");
        setCountryHintInput("");
        setFocusedLocation(null);
    };

    useEffect(() => {
        startNewGame();
    }, []);

    // Language suggestions: safely matches language name OR countries where spoken
    const matchingLanguages = useMemo(() => {
        const clean = langInput.trim().toLowerCase();
        if (!clean || hasWon || hasGivenUp) return [];
        const guessedSet = new Set(langGuesses.map((g) => g.guessedName.toLowerCase()));

        const matches: Array<{
            entry: LanguageEntry;
            matchedBy: "name" | "country";
            matchedCountryName?: string;
        }> = [];

        for (const entry of Object.values(LANGUAGES_DATA)) {
            if (!entry || !entry.language_name) continue;
            if (guessedSet.has(entry.language_name.toLowerCase())) continue;

            const nameMatches = entry.language_name.toLowerCase().includes(clean);

            const matchedCountry = (entry.countries || []).find((c) => {
                if (!c) return false;
                const nameMatchesCountry =
                    typeof c.name === "string" && c.name.toLowerCase().includes(clean);
                const alpha2MatchesCountry =
                    typeof c.alpha_2 === "string" && c.alpha_2.toLowerCase() === clean;
                const alpha3MatchesCountry =
                    typeof c.alpha_3 === "string" && c.alpha_3.toLowerCase() === clean;

                return nameMatchesCountry || alpha2MatchesCountry || alpha3MatchesCountry;
            });

            if (nameMatches) {
                matches.push({ entry, matchedBy: "name" });
            } else if (matchedCountry) {
                matches.push({
                    entry,
                    matchedBy: "country",
                    matchedCountryName: matchedCountry.name || undefined,
                });
            }
        }

        return matches
            .sort((a, b) => {
                const aName = a.entry.language_name.toLowerCase();
                const bName = b.entry.language_name.toLowerCase();
                if (aName === clean) return -1;
                if (bName === clean) return 1;
                if (aName.startsWith(clean) && !bName.startsWith(clean)) return -1;
                if (!aName.startsWith(clean) && bName.startsWith(clean)) return 1;
                if (a.matchedBy === "name" && b.matchedBy === "country") return -1;
                if (a.matchedBy === "country" && b.matchedBy === "name") return 1;
                return aName.localeCompare(bName);
            })
            .slice(0, 6);
    }, [langInput, langGuesses, hasWon, hasGivenUp]);

    // Country hint suggestions: safely matches country name/aliases OR languages spoken there
    const matchingCountries = useMemo(() => {
        const clean = countryHintInput.trim().toLowerCase();
        if (!clean || hasWon || hasGivenUp) return [];
        const testedSet = new Set(globeGuesses.map((g) => g.id));

        const matches: Array<{
            country: Country;
            languages: string[];
            matchedBy: "country" | "language";
            matchedLanguageName?: string;
        }> = [];

        for (const c of COUNTRIES) {
            if (!c || testedSet.has(c.id)) continue;

            const countryMatches =
                (typeof c.name === "string" && c.name.toLowerCase().includes(clean)) ||
                (Array.isArray(c.aliases) &&
                    c.aliases.some((a) => typeof a === "string" && a.toLowerCase().includes(clean)));

            const langs = getLanguagesForCountry(c);
            const matchedLang = langs.find((l) => typeof l === "string" && l.toLowerCase().includes(clean));

            if (countryMatches) {
                matches.push({ country: c, languages: langs, matchedBy: "country" });
            } else if (matchedLang) {
                matches.push({
                    country: c,
                    languages: langs,
                    matchedBy: "language",
                    matchedLanguageName: matchedLang,
                });
            }
        }

        return matches
            .sort((a, b) => {
                const aName = a.country.name.toLowerCase();
                const bName = b.country.name.toLowerCase();
                if (aName === clean) return -1;
                if (bName === clean) return 1;
                if (aName.startsWith(clean) && !bName.startsWith(clean)) return -1;
                if (!aName.startsWith(clean) && bName.startsWith(clean)) return 1;
                if (a.matchedBy === "country" && b.matchedBy === "language") return -1;
                if (a.matchedBy === "language" && b.matchedBy === "country") return 1;
                return aName.localeCompare(bName);
            })
            .slice(0, 6);
    }, [countryHintInput, globeGuesses, hasWon, hasGivenUp]);

    // Handle guessing a language
    const handleGuessLanguage = (guessedName: string) => {
        if (!targetLang || hasWon || hasGivenUp) return;
        if (langGuesses.some((g) => g.guessedName.toLowerCase() === guessedName.toLowerCase())) return;

        const isCorrect = guessedName.toLowerCase() === targetLang.language_name.toLowerCase();

        if (isCorrect) {
            setHasWon(true);
            setLangGuesses((prev) => [
                { id: String(Date.now()), guessedName, isCorrect: true, scorePenalty: 0 },
                ...prev,
            ]);
            targetCountryObjects.forEach((tc) => {
                setGlobeGuesses((prev) => [
                    {
                        id: tc.id,
                        name: tc.name,
                        distanceKm: 0,
                        color: "#10b981",
                        isNeighbor: false,
                    },
                    ...prev,
                ]);
            });
            if (targetCountryObjects.length > 0) {
                setFocusedLocation({
                    lat: targetCountryObjects[0].lat,
                    lng: targetCountryObjects[0].lng,
                });
            }
            confetti({
                particleCount: 140,
                spread: 80,
                origin: { y: 0.6 },
            });
        } else {
            setScore((prev) => Math.max(50, prev - WRONG_GUESS_PENALTY));
            setLangGuesses((prev) => [
                {
                    id: String(Date.now()),
                    guessedName,
                    isCorrect: false,
                    scorePenalty: WRONG_GUESS_PENALTY,
                },
                ...prev,
            ]);
        }

        setLangInput("");
        setShowLangDropdown(false);
    };

    // Handle country proximity hint
    const handleCountryDistanceHint = (country: Country) => {
        if (!targetLang || hasWon || hasGivenUp) return;
        if (globeGuesses.some((g) => g.id === country.id)) return;

        let minDistance = Infinity;
        let isNeighborOfAny = false;
        let isExactMatch = false;

        for (const tc of targetCountryObjects) {
            if (tc.id === country.id) {
                isExactMatch = true;
                minDistance = 0;
                break;
            }
            const d = getHaversineDistanceKm(country.lat, country.lng, tc.lat, tc.lng);
            if (d < minDistance) {
                minDistance = d;
            }
            if (checkIsNeighbor(country.id, tc.id)) {
                isNeighborOfAny = true;
            }
        }

        if (minDistance === Infinity) minDistance = 5000;

        const color = getDistanceColor(minDistance, isExactMatch, isNeighborOfAny);

        const record: GuessRecord = {
            id: country.id,
            name: country.name,
            distanceKm: Math.round(minDistance),
            color,
            isNeighbor: isNeighborOfAny,
        };

        setGlobeGuesses((prev) => [record, ...prev]);
        setFocusedLocation({ lat: country.lat, lng: country.lng });
        setScore((prev) => Math.max(50, prev - COUNTRY_HINT_PENALTY));
        setCountryHintInput("");
        setShowCountryDropdown(false);
    };

    const handleRevealSentenceHint = () => {
        if (!targetLang || hasWon || hasGivenUp) return;
        if (revealedSentenceCount < targetLang.sentences.length) {
            setRevealedSentenceCount((c) => c + 1);
            setScore((s) => Math.max(50, s - SENTENCE_HINT_PENALTY));
        }
    };

    const handleGiveUp = () => {
        if (!targetLang || hasWon || hasGivenUp) return;
        setHasGivenUp(true);
        setScore(0);
        setShowLangDropdown(false);
        setShowCountryDropdown(false);

        targetCountryObjects.forEach((tc) => {
            setGlobeGuesses((prev) => [
                {
                    id: tc.id,
                    name: tc.name,
                    distanceKm: 0,
                    color: "#10b981",
                    isNeighbor: false,
                },
                ...prev,
            ]);
        });
        if (targetCountryObjects.length > 0) {
            setFocusedLocation({
                lat: targetCountryObjects[0].lat,
                lng: targetCountryObjects[0].lng,
            });
        }
    };

    const globeMap = useMemo(() => {
        const acc: Record<string, GuessRecord> = {};
        for (const g of globeGuesses) {
            acc[g.id] = g;
        }
        return acc;
    }, [globeGuesses]);

    const bestDistanceHint = useMemo(() => {
        if (globeGuesses.length === 0) return null;
        return [...globeGuesses].sort((a, b) => a.distanceKm - b.distanceKm)[0];
    }, [globeGuesses]);

    return (
        <div
            className={`${bricolage.className} min-h-screen bg-[#f0f3e8] text-[#1c1e1d] px-4 py-8 md:px-12`}
        >
            {/* Header */}
            <header className="max-w-7xl mx-auto flex items-center justify-between mb-6">
                <Link
                    href="/dashboard"
                    className="group flex items-center gap-2 text-[#4a5048] hover:text-[#1a1a1a] text-sm font-medium transition-colors"
                >
                    <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" />
                    <span>Back to Games</span>
                </Link>
                <div className="flex items-center gap-3">
                    <div className="bg-white/80 border border-[#1a1a1a]/15 px-3 py-1.5 rounded-full flex items-center gap-2 shadow-xs">
                        <Trophy size={16} className="text-[#ff1a53]" />
                        <span className="text-xs font-bold uppercase tracking-wider text-[#4a5048]">Score:</span>
                        <span className="text-sm font-black text-[#1a1a1a]">{score}</span>
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        ScriptGuesser<span className="text-[#ff1a53]">.</span>
                    </h1>
                </div>
            </header>

            <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left Column */}
                <div className="lg:col-span-5 flex flex-col gap-5">
                    {/* Script Card */}
                    <div className="bg-white/80 border border-[#1a1a1a]/20 rounded-3xl p-6 sm:p-7 shadow-sm relative overflow-hidden">
                        <div className="flex items-center justify-between mb-3">
                            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#4a5048] bg-[#e8e3d5] px-3 py-1 rounded-full border border-[#1a1a1a]/10">
                                <Quotes size={14} weight="fill" className="text-[#ff1a53]" />
                                Mystery Script Snippet
                            </span>
                            <span className="text-xs text-[#4a5048] font-semibold">
                                Sentence 1 of {targetLang?.sentences?.length || 1}
                            </span>
                        </div>

                        {/* Mystery Text Display */}
                        <div className="my-4 p-5 rounded-2xl bg-[#f0f3e8]/90 border border-[#1a1a1a]/10">
                            <p className="text-2xl sm:text-3xl font-medium leading-relaxed tracking-wide text-[#1a1a1a] break-words text-center select-all">
                                "{targetLang?.sentences?.[sentenceIndex] ?? "Loading..."}"
                            </p>
                        </div>

                        {/* Secondary revealed sentences */}
                        {revealedSentenceCount > 1 &&
                            targetLang?.sentences?.slice(1, revealedSentenceCount).map((sentence, idx) => (
                                <div
                                    key={idx}
                                    className="mt-2.5 p-3.5 rounded-xl bg-[#e8e3d5]/70 border border-[#1a1a1a]/10 text-center"
                                >
                                    <p className="text-sm font-medium text-[#4a5048]">"{sentence}"</p>
                                </div>
                            ))}

                        {/* Extra Sentence Hint Trigger */}
                        {!hasWon &&
                            !hasGivenUp &&
                            targetLang &&
                            revealedSentenceCount < (targetLang.sentences?.length || 0) && (
                                <button
                                    type="button"
                                    onClick={handleRevealSentenceHint}
                                    className="mt-3 flex items-center justify-center gap-1.5 text-xs font-semibold text-[#4a5048] hover:text-[#ff1a53] transition-colors w-full cursor-pointer"
                                >
                                    <Lightbulb size={15} />
                                    <span>Reveal extra sentence hint (-{SENTENCE_HINT_PENALTY} pts)</span>
                                </button>
                            )}
                    </div>

                    {/* Guesser & Globe Proximity Hint Box */}
                    <div className="bg-white/70 border border-[#1a1a1a]/20 rounded-3xl p-6 sm:p-7 shadow-sm space-y-5">
                        {/* Stats Row */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-[#e8e3d5] p-3 rounded-2xl border border-[#1a1a1a]/15 flex items-center gap-3">
                                <Trophy size={24} className="text-[#ff1a53]" />
                                <div>
                                    <p className="text-[10px] font-bold text-[#4a5048] uppercase">Guesses</p>
                                    <p className="text-lg font-bold">{langGuesses.length}</p>
                                </div>
                            </div>
                            <div className="bg-[#e8e3d5] p-3 rounded-2xl border border-[#1a1a1a]/15 flex items-center gap-3">
                                <Flame size={24} className="text-orange-600" />
                                <div>
                                    <p className="text-[10px] font-bold text-[#4a5048] uppercase">Nearest Hint</p>
                                    <p className="text-lg font-bold">
                                        {bestDistanceHint ? `${bestDistanceHint.distanceKm.toLocaleString()} km` : "—"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Input Forms */}
                        {!hasWon && !hasGivenUp ? (
                            <div className="space-y-4">
                                {/* 1. Language Guess Form */}
                                <div ref={langContainerRef} className="relative">
                                    <form
                                        onSubmit={(e) => {
                                            e.preventDefault();
                                            if (matchingLanguages.length > 0) {
                                                handleGuessLanguage(matchingLanguages[0].entry.language_name);
                                            }
                                        }}
                                    >
                                        <div className="flex items-center justify-between mb-1.5 px-1">
                                            <label className="block text-xs font-bold text-[#1a1a1a] uppercase">
                                                Guess The Language
                                            </label>
                                            <span className="text-[10px] text-[#4a5048] font-medium">
                                                Search language or country
                                            </span>
                                        </div>
                                        <div className="relative flex items-center">
                                            <input
                                                type="text"
                                                value={langInput}
                                                onChange={(e) => {
                                                    setLangInput(e.target.value);
                                                    setShowLangDropdown(true);
                                                }}
                                                onFocus={() => setShowLangDropdown(true)}
                                                placeholder="e.g. Serbian, Greek (or country: Brazil, Japan)..."
                                                className="w-full px-5 py-3 pr-12 rounded-full border border-[#1a1a1a] bg-white outline-none focus:ring-2 focus:ring-[#ff1a53] transition-all text-sm font-medium"
                                            />
                                            <button
                                                type="submit"
                                                aria-label="Submit language guess"
                                                className="absolute right-1.5 w-8 h-8 rounded-full bg-[#1a1a1a] text-white flex items-center justify-center hover:bg-[#ff1a53] transition-colors"
                                            >
                                                <PaperPlaneRight size={15} weight="fill" />
                                            </button>
                                        </div>
                                    </form>

                                    {showLangDropdown && matchingLanguages.length > 0 && (
                                        <div className="absolute z-40 left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-[#1a1a1a]/15 overflow-hidden max-h-72 overflow-y-auto">
                                            {matchingLanguages.map(({ entry, matchedBy, matchedCountryName }) => {
                                                const countryList = (entry.countries || [])
                                                    .map((c) => c?.name)
                                                    .filter((name): name is string => typeof name === "string");
                                                const countryPreview = countryList.slice(0, 3).join(", ");
                                                const remainingCount = countryList.length - 3;

                                                return (
                                                    <button
                                                        key={entry.language_name}
                                                        type="button"
                                                        onClick={() => handleGuessLanguage(entry.language_name)}
                                                        className="w-full text-left px-4 py-2.5 hover:bg-[#f0f3e8] transition-colors flex items-center justify-between border-b last:border-b-0 border-[#1a1a1a]/10 group"
                                                    >
                                                        <div className="flex flex-col min-w-0 pr-2">
                                                            <div className="flex items-center gap-2">
                                                                <span className="font-bold text-[#1a1a1a] text-sm group-hover:text-[#ff1a53] transition-colors">
                                                                    {entry.language_name}
                                                                </span>
                                                                {matchedBy === "country" && matchedCountryName && (
                                                                    <span className="text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200 px-1.5 py-0.2 rounded-full">
                                                                        via {matchedCountryName}
                                                                    </span>
                                                                )}
                                                            </div>
                                                            {countryList.length > 0 && (
                                                                <span className="text-[11px] text-[#4a5048] truncate">
                                                                    🌍 Spoken in: {countryPreview}
                                                                    {remainingCount > 0 ? ` +${remainingCount}` : ""}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <span className="text-xs font-semibold text-stone-400 group-hover:text-[#1a1a1a] flex-shrink-0">
                                                            Guess
                                                        </span>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>

                                {/* 2. Globe Distance Hint Probe */}
                                <div ref={countryContainerRef} className="pt-3 border-t border-[#1a1a1a]/10 relative">
                                    <form
                                        onSubmit={(e) => {
                                            e.preventDefault();
                                            if (matchingCountries.length > 0) {
                                                handleCountryDistanceHint(matchingCountries[0].country);
                                            }
                                        }}
                                    >
                                        <div className="flex items-center justify-between mb-1.5 px-1">
                                            <label className="text-xs font-bold text-[#4a5048] uppercase flex items-center gap-1.5">
                                                <Compass size={15} className="text-[#ff1a53]" />
                                                Globe Radar Hint
                                            </label>
                                            <span className="text-[10px] font-bold text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">
                                                -{COUNTRY_HINT_PENALTY} pts
                                            </span>
                                        </div>
                                        <p className="text-[11px] text-[#4a5048] mb-2 px-1">
                                            Pick a country (or language) to calculate distance to target language region.
                                        </p>

                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={countryHintInput}
                                                onChange={(e) => {
                                                    setCountryHintInput(e.target.value);
                                                    setShowCountryDropdown(true);
                                                }}
                                                onFocus={() => setShowCountryDropdown(true)}
                                                placeholder="Type country or language (e.g. Italy, Arabic, French)..."
                                                className="w-full px-4 py-2.5 rounded-full border border-[#1a1a1a]/40 bg-[#f0f3e8]/50 outline-none focus:ring-2 focus:ring-orange-500 transition-all text-xs"
                                            />
                                        </div>
                                    </form>

                                    {showCountryDropdown && matchingCountries.length > 0 && (
                                        <div className="absolute z-40 left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-[#1a1a1a]/15 overflow-hidden max-h-72 overflow-y-auto">
                                            {matchingCountries.map(({ country, languages, matchedBy, matchedLanguageName }) => {
                                                const langPreview = languages.slice(0, 3).join(", ");
                                                const remainingLangCount = languages.length - 3;

                                                return (
                                                    <button
                                                        key={country.id}
                                                        type="button"
                                                        onClick={() => handleCountryDistanceHint(country)}
                                                        className="w-full text-left px-4 py-2.5 text-xs hover:bg-[#f0f3e8] transition-colors flex items-center justify-between border-b last:border-b-0 border-[#1a1a1a]/10 group"
                                                    >
                                                        <div className="flex flex-col min-w-0 pr-2">
                                                            <div className="flex items-center gap-2">
                                                                <span className="font-bold text-[#1a1a1a] group-hover:text-orange-600 transition-colors">
                                                                    {country.name}
                                                                </span>
                                                                {matchedBy === "language" && matchedLanguageName && (
                                                                    <span className="text-[10px] font-semibold bg-amber-50 text-amber-800 border border-amber-200 px-1.5 py-0.2 rounded-full">
                                                                        speaks {matchedLanguageName}
                                                                    </span>
                                                                )}
                                                            </div>
                                                            {languages.length > 0 && (
                                                                <span className="text-[11px] text-[#4a5048] truncate">
                                                                    🗣️ {langPreview}
                                                                    {remainingLangCount > 0 ? ` +${remainingLangCount}` : ""}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <span className="text-[11px] text-orange-600 font-bold flex-shrink-0">
                                                            Test Distance
                                                        </span>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : hasWon ? (
                            <div className="bg-emerald-500/15 border border-emerald-600/30 rounded-2xl p-5 text-center space-y-2">
                                <p className="text-emerald-900 font-bold text-lg">🎉 Correct Language!</p>
                                <p className="text-emerald-800 text-sm">
                                    It was <span className="font-extrabold">{targetLang?.language_name}</span>! Final
                                    Score: <span className="font-black text-emerald-950">{score} pts</span>
                                </p>
                                <p className="text-xs text-emerald-700">
                                    Spoken in:{" "}
                                    {targetLang?.countries
                                        ?.map((c) => c?.name)
                                        .filter(Boolean)
                                        .join(", ")}
                                </p>
                                <button
                                    onClick={startNewGame}
                                    className="mt-2 inline-flex items-center gap-2 bg-[#1a1a1a] hover:bg-black text-white px-5 py-2.5 rounded-full text-sm font-medium transition-colors cursor-pointer"
                                >
                                    <ArrowClockwise size={16} />
                                    <span>Play Another Language</span>
                                </button>
                            </div>
                        ) : (
                            <div className="bg-amber-500/15 border border-amber-600/30 rounded-2xl p-5 text-center space-y-2">
                                <p className="text-amber-950 font-bold text-lg">Revealed!</p>
                                <p className="text-amber-900 text-sm">
                                    The language was{" "}
                                    <span className="font-bold underline decoration-amber-600 underline-offset-4">
                                        {targetLang?.language_name}
                                    </span>
                                    .
                                </p>
                                <p className="text-xs text-amber-800">
                                    Spoken in:{" "}
                                    {targetLang?.countries
                                        ?.map((c) => c?.name)
                                        .filter(Boolean)
                                        .join(", ")}
                                </p>
                                <button
                                    onClick={startNewGame}
                                    className="mt-2 inline-flex items-center gap-2 bg-[#1a1a1a] hover:bg-black text-white px-5 py-2.5 rounded-full text-sm font-medium transition-colors cursor-pointer"
                                >
                                    <ArrowClockwise size={16} />
                                    <span>Try Next Script</span>
                                </button>
                            </div>
                        )}

                        {/* Give Up Option */}
                        {!hasWon && !hasGivenUp && (langGuesses.length > 0 || globeGuesses.length > 0) && (
                            <button
                                type="button"
                                onClick={handleGiveUp}
                                className="flex items-center justify-center gap-2 text-xs font-semibold text-[#4a5048] hover:text-[#ff1a53] transition-colors mt-2 w-full cursor-pointer"
                            >
                                <ArrowClockwise size={14} />
                                <span>Give up and reveal answer</span>
                            </button>
                        )}
                    </div>

                    {/* Guess History: Languages & Probed Countries */}
                    {(langGuesses.length > 0 || globeGuesses.length > 0) && (
                        <div className="bg-white/70 border border-[#1a1a1a]/20 rounded-3xl p-5 shadow-sm space-y-4">
                            {/* Language Attempts */}
                            {langGuesses.length > 0 && (
                                <div>
                                    <h3 className="text-xs font-bold text-[#4a5048] uppercase tracking-wider mb-2.5 px-1">
                                        Language Guesses
                                    </h3>
                                    <div className="space-y-1.5 max-h-[140px] overflow-y-auto pr-1">
                                        {langGuesses.map((g) => (
                                            <div
                                                key={g.id}
                                                className="flex items-center justify-between p-2.5 rounded-xl bg-[#f0f3e8]/70 border border-[#1a1a1a]/10"
                                            >
                                                <div className="flex items-center gap-2">
                                                    {g.isCorrect ? (
                                                        <CheckCircle size={18} className="text-emerald-600" weight="fill" />
                                                    ) : (
                                                        <XCircle size={18} className="text-red-500" weight="fill" />
                                                    )}
                                                    <span className="text-sm font-semibold text-[#1a1a1a]">
                                                        {g.guessedName}
                                                    </span>
                                                </div>
                                                <span className="text-xs font-bold font-mono text-[#4a5048]">
                                                    {g.isCorrect ? "MATCH!" : `-${g.scorePenalty} pts`}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Globe Country Distance Radar History */}
                            {globeGuesses.length > 0 && (
                                <div>
                                    <h3 className="text-xs font-bold text-[#4a5048] uppercase tracking-wider mb-2.5 px-1">
                                        Tested Proximity Hints (Closest First)
                                    </h3>
                                    <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-1">
                                        {[...globeGuesses]
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
                                                    className="cursor-pointer flex items-center justify-between p-2.5 rounded-xl bg-[#f0f3e8]/70 border border-[#1a1a1a]/10 hover:border-[#1a1a1a]/30 transition-all"
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <span
                                                            className="w-3.5 h-3.5 rounded-full border border-black/20 flex-shrink-0"
                                                            style={{ backgroundColor: g.color }}
                                                        />
                                                        <span className="font-semibold text-xs text-[#1a1a1a]">{g.name}</span>
                                                        {g.isNeighbor && (
                                                            <span className="text-[9px] font-bold uppercase tracking-wider bg-purple-100 text-purple-800 border border-purple-300 px-1.5 py-0.2 rounded-full">
                                                                Neighbor
                                                            </span>
                                                        )}
                                                    </div>
                                                    <span className="text-xs font-mono font-bold text-[#4a5048]">
                                                        {g.distanceKm === 0 ? "SPOKEN HERE" : `${g.distanceKm.toLocaleString()} km`}
                                                    </span>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Right Column: 3D Interactive World Globe */}
                <div className="lg:col-span-7 flex flex-col gap-3">
                    <GlobeWrapper guesses={globeMap} focusedLocation={focusedLocation} />

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
                            <span className="w-3 h-3 rounded-full bg-[#10b981]" /> Spoken Here
                        </span>
                    </div>
                </div>
            </main>
        </div>
    );
}