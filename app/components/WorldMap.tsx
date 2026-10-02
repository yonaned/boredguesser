"use client";

import React from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from "react-simple-maps";

// TopoJSON world map data
const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

interface WorldMapProps {
  guessedCodes: Set<string>; // Set of ISO numeric or alpha-3 codes for guessed countries
}

export default function WorldMap({ guessedCodes }: WorldMapProps) {
  return (
    <div className="w-full h-full bg-[#f0f3e8] rounded-3xl border border-[#1a1a1a]/20 overflow-hidden shadow-inner flex items-center justify-center p-4">
      <ComposableMap
        projectionConfig={{ scale: 147 }}
        className="w-full h-auto max-h-[500px]"
      >
        <ZoomableGroup center={[0, 20]} zoom={1}>
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const isGuessed =
                  geo.id !== undefined && guessedCodes.has(String(geo.id)); // geo.id is the 3-digit numeric ISO code

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
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>
    </div>
  );
}