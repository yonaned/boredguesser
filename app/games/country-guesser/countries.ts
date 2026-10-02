export interface Country {
  id: string; // ISO numeric code used by world-atlas (e.g., "840")
  name: string;
  aliases: string[];
}

export const COUNTRIES: Country[] = [
  { id: "840", name: "United States", aliases: ["usa", "us", "united states of america"] },
  { id: "124", name: "Canada", aliases: ["canada"] },
  { id: "484", name: "Mexico", aliases: ["mexico"] },
  { id: "076", name: "Brazil", aliases: ["brazil"] },
  { id: "250", name: "France", aliases: ["france"] },
  { id: "276", name: "Germany", aliases: ["germany"] },
  { id: "356", name: "India", aliases: ["india"] },
  { id: "156", name: "China", aliases: ["china"] },
  { id: "392", name: "Japan", aliases: ["japan"] },
  { id: "036", name: "Australia", aliases: ["australia"] },
  // ... Expand to all 197 countries
];