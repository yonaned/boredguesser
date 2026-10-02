export function getHaversineDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

export function getDistanceColor(distanceKm: number, isWinner: boolean): string {
  if (isWinner) return "#10b981"; // Emerald Green for target hit
  if (distanceKm < 1000) return "#7f1d1d"; // Boiling Dark Red
  if (distanceKm < 2500) return "#dc2626"; // Crimson
  if (distanceKm < 4500) return "#f97316"; // Bright Orange
  if (distanceKm < 7500) return "#facc15"; // Warm Amber
  if (distanceKm < 10500) return "#fef08a"; // Pale Yellow
  return "#94a3b8"; // Cold Ice Grey
}