"use client";

import React from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";

const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

interface USMapProps {
  guessedStates: Set<string>; // Set of state names (lowercase) and/or FIPS codes
}

export default function USMap({ guessedStates }: USMapProps) {
  return (
    <div className="w-full h-full bg-[#f0f3e8] rounded-3xl border border-[#1a1a1a]/20 overflow-hidden shadow-inner flex items-center justify-center p-4">
      <ComposableMap
        projection="geoAlbersUsa"
        className="w-full h-auto max-h-[500px]"
      >
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const rawId = String(geo.id ?? "");
              const paddedFips = rawId.padStart(2, "0");
              const stateName = geo.properties?.name?.toLowerCase() ?? "";

              // Check FIPS (both padded "06" and raw "6") as well as state name ("california")
              const isGuessed =
                guessedStates.has(paddedFips) ||
                guessedStates.has(rawId) ||
                guessedStates.has(stateName);

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  style={{
                    fill: isGuessed ? "#ff1a53" : "#d8dec8",
                    stroke: "#1a1a1a",
                    strokeWidth: 0.5,
                    outline: "none",
                    transition: "all 250ms ease",
                    cursor: "default",
                  }}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>
    </div>
  );
}