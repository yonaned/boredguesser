// app/components/Globe3D.tsx
"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import Globe, { GlobeMethods } from "react-globe.gl";
import { feature } from "topojson-client";

export interface GuessRecord {
  id: string;
  name: string;
  distanceKm: number;
  color: string;
}

interface Globe3DProps {
  guesses: Record<string, GuessRecord>;
  focusedLocation: { lat: number; lng: number } | null;
}

export default function Globe3D({ guesses, focusedLocation }: Globe3DProps) {
  const globeRef = useRef<GlobeMethods | undefined>(undefined);
  const [countriesGeoJson, setCountriesGeoJson] = useState<any[]>([]);
  const [dimensions, setDimensions] = useState({ width: 600, height: 600 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Resize listener
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        });
      }
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  // Fetch world polygons
  useEffect(() => {
    fetch("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json")
      .then((res) => res.json())
      .then((topology) => {
        const geojson: any = feature(topology, topology.objects.countries);
        setCountriesGeoJson(geojson.features);
      })
      .catch((err) => console.error("Error loading globe geometry:", err));
  }, []);

  // Fly-to animation when user makes a guess
  useEffect(() => {
    if (globeRef.current && focusedLocation) {
      globeRef.current.pointOfView(
        { lat: focusedLocation.lat, lng: focusedLocation.lng, altitude: 1.85 },
        1200
      );
    }
  }, [focusedLocation]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[420px] sm:h-[500px] lg:h-[620px] rounded-3xl overflow-hidden bg-[#0d131f] shadow-2xl flex items-center justify-center cursor-grab active:cursor-grabbing border border-[#1a1a1a]/15"
    >
      <Globe
        ref={globeRef}
        width={dimensions.width}
        height={dimensions.height}
        backgroundColor="rgba(0, 0, 0, 0)"
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-dark.jpg"
        polygonsData={countriesGeoJson}
        polygonGeoJsonGeometry="geometry"
        polygonAltitude={(d: any) => (guesses[String(d.id)] ? 0.035 : 0.005)}
        polygonCapColor={(d: any) => {
          const guess = guesses[String(d.id)];
          return guess ? guess.color : "#334155"; // Guessed heatmap color or default land color
        }}
        polygonSideColor={() => "rgba(0, 0, 0, 0.25)"}
        polygonStrokeColor={() => "#0f172a"}
        polygonLabel={({ properties: d }: any) => {
          const countryId = String(d?.id);
          const guess = guesses[countryId];
          return `
            <div style="background:#111827; color:#fff; padding:6px 12px; border-radius:8px; font-size:12px; font-family:sans-serif; border: 1px solid rgba(255,255,255,0.2);">
              <b>${d?.name || "Country"}</b>
              ${guess ? `<br/><span style="color:${guess.color};">${guess.distanceKm === 0 ? "Correct!" : `${guess.distanceKm.toLocaleString()} km`}</span>` : ""}
            </div>
          `;
        }}
        showAtmosphere={true}
        atmosphereColor="#38bdf8"
        atmosphereAltitude={0.16}
      />
    </div>
  );
}