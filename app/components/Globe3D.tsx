// app/components/Globe3D.tsx
"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import Globe, { GlobeMethods } from "react-globe.gl";
import { feature } from "topojson-client";
import { MeshPhongMaterial } from "three";

export interface GuessRecord {
  id: string;
  name: string;
  distanceKm: number;
  color: string;
  isNeighbor?: boolean; // Added
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

  const globeMaterial = useMemo(() => {
    return new MeshPhongMaterial({
      color: "#f0f3e8",
      emissive: "#20221e",
      emissiveIntensity: 0.08,
      shininess: 12,
    });
  }, []);

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

  useEffect(() => {
    fetch("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json")
      .then((res) => res.json())
      .then((topology) => {
        const geojson: any = feature(topology, topology.objects.countries);
        setCountriesGeoJson(geojson.features);
      })
      .catch((err) => console.error("Error loading globe geometry:", err));
  }, []);

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
      className="relative w-full h-[420px] sm:h-[500px] lg:h-[620px] rounded-3xl overflow-hidden bg-[#f0f3e8] shadow-inner flex items-center justify-center cursor-grab active:cursor-grabbing border border-[#1a1a1a]/20"
    >
      <Globe
  ref={globeRef}
  width={dimensions.width}
  height={dimensions.height}
  backgroundColor="rgba(0, 0, 0, 0)"
  globeMaterial={globeMaterial}
  polygonsData={countriesGeoJson}
  polygonGeoJsonGeometry="geometry"
  polygonAltitude={(d: any) => {
    const guess = guesses[String(d.id)];
    if (!guess) return 0.006;
    return guess.isNeighbor ? 0.04 : 0.035;
  }}
  polygonCapColor={(d: any) => {
    const guess = guesses[String(d.id)];
    return guess ? guess.color : "#d8dec8"; // Automatically paints #a855f7 for neighbors
  }}
  polygonSideColor={() => "rgba(26, 26, 26, 0.18)"}
  polygonStrokeColor={() => "#1a1a1a"}
  showAtmosphere={false}
/>
    </div>
  );
}