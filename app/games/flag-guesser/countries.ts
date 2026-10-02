export interface FlagCountry {
  code: string; // ISO 3166-1 alpha-2 (e.g., "US", "FR", "JP", "ET")
  name: string;
  aliases: string[];
  continent: "Europe" | "Asia" | "Africa" | "Americas" | "Oceania";
}

export const FLAG_COUNTRIES: FlagCountry[] = [
  // Europe
  { code: "FR", name: "France", aliases: ["france", "french republic"], continent: "Europe" },
  { code: "DE", name: "Germany", aliases: ["germany", "deutschland"], continent: "Europe" },
  { code: "IT", name: "Italy", aliases: ["italy", "italia"], continent: "Europe" },
  { code: "ES", name: "Spain", aliases: ["spain", "espana"], continent: "Europe" },
  { code: "GB", name: "United Kingdom", aliases: ["uk", "united kingdom", "great britain", "england"], continent: "Europe" },
  { code: "PT", name: "Portugal", aliases: ["portugal"], continent: "Europe" },
  { code: "NL", name: "Netherlands", aliases: ["netherlands", "holland"], continent: "Europe" },
  { code: "BE", name: "Belgium", aliases: ["belgium"], continent: "Europe" },
  { code: "CH", name: "Switzerland", aliases: ["switzerland", "swiss"], continent: "Europe" },
  { code: "SE", name: "Sweden", aliases: ["sweden"], continent: "Europe" },
  { code: "NO", name: "Norway", aliases: ["norway"], continent: "Europe" },
  { code: "DK", name: "Denmark", aliases: ["denmark"], continent: "Europe" },
  { code: "FI", name: "Finland", aliases: ["finland"], continent: "Europe" },
  { code: "IE", name: "Ireland", aliases: ["ireland", "eire"], continent: "Europe" },
  { code: "PL", name: "Poland", aliases: ["poland", "polska"], continent: "Europe" },
  { code: "GR", name: "Greece", aliases: ["greece", "hellas"], continent: "Europe" },
  { code: "AT", name: "Austria", aliases: ["austria"], continent: "Europe" },
  { code: "UA", name: "Ukraine", aliases: ["ukraine"], continent: "Europe" },
  { code: "HR", name: "Croatia", aliases: ["croatia"], continent: "Europe" },
  { code: "CZ", name: "Czechia", aliases: ["czechia", "czech republic"], continent: "Europe" },
  { code: "RO", name: "Romania", aliases: ["romania"], continent: "Europe" },
  { code: "HU", name: "Hungary", aliases: ["hungary"], continent: "Europe" },
  { code: "IS", name: "Iceland", aliases: ["iceland"], continent: "Europe" },

  // Americas
  { code: "US", name: "United States", aliases: ["usa", "united states", "america"], continent: "Americas" },
  { code: "CA", name: "Canada", aliases: ["canada"], continent: "Americas" },
  { code: "MX", name: "Mexico", aliases: ["mexico"], continent: "Americas" },
  { code: "BR", name: "Brazil", aliases: ["brazil", "brasil"], continent: "Americas" },
  { code: "AR", name: "Argentina", aliases: ["argentina"], continent: "Americas" },
  { code: "CO", name: "Colombia", aliases: ["colombia"], continent: "Americas" },
  { code: "CL", name: "Chile", aliases: ["chile"], continent: "Americas" },
  { code: "PE", name: "Peru", aliases: ["peru"], continent: "Americas" },
  { code: "VE", name: "Venezuela", aliases: ["venezuela"], continent: "Americas" },
  { code: "UY", name: "Uruguay", aliases: ["uruguay"], continent: "Americas" },
  { code: "CU", name: "Cuba", aliases: ["cuba"], continent: "Americas" },
  { code: "JM", name: "Jamaica", aliases: ["jamaica"], continent: "Americas" },
  { code: "CR", name: "Costa Rica", aliases: ["costa rica"], continent: "Americas" },
  { code: "PA", name: "Panama", aliases: ["panama"], continent: "Americas" },
  { code: "EC", name: "Ecuador", aliases: ["ecuador"], continent: "Americas" },
  { code: "DO", name: "Dominican Republic", aliases: ["dominican republic", "dr"], continent: "Americas" },

  // Asia
  { code: "JP", name: "Japan", aliases: ["japan", "nippon"], continent: "Asia" },
  { code: "KR", name: "South Korea", aliases: ["south korea", "korea"], continent: "Asia" },
  { code: "CN", name: "China", aliases: ["china", "prc"], continent: "Asia" },
  { code: "IN", name: "India", aliases: ["india", "bharat"], continent: "Asia" },
  { code: "ID", name: "Indonesia", aliases: ["indonesia"], continent: "Asia" },
  { code: "TH", name: "Thailand", aliases: ["thailand", "siam"], continent: "Asia" },
  { code: "VN", name: "Vietnam", aliases: ["vietnam"], continent: "Asia" },
  { code: "PH", name: "Philippines", aliases: ["philippines"], continent: "Asia" },
  { code: "MY", name: "Malaysia", aliases: ["malaysia"], continent: "Asia" },
  { code: "SG", name: "Singapore", aliases: ["singapore"], continent: "Asia" },
  { code: "SA", name: "Saudi Arabia", aliases: ["saudi arabia", "ksa"], continent: "Asia" },
  { code: "AE", name: "United Arab Emirates", aliases: ["uae", "emirates"], continent: "Asia" },
  { code: "TR", name: "Turkey", aliases: ["turkey", "turkiye"], continent: "Asia" },
  { code: "IL", name: "Israel", aliases: ["israel"], continent: "Asia" },
  { code: "PK", name: "Pakistan", aliases: ["pakistan"], continent: "Asia" },
  { code: "BD", name: "Bangladesh", aliases: ["bangladesh"], continent: "Asia" },
  { code: "NP", name: "Nepal", aliases: ["nepal"], continent: "Asia" },
  { code: "LK", name: "Sri Lanka", aliases: ["sri lanka"], continent: "Asia" },

  // Africa
  { code: "ET", name: "Ethiopia", aliases: ["ethiopia"], continent: "Africa" },
  { code: "EG", name: "Egypt", aliases: ["egypt"], continent: "Africa" },
  { code: "ZA", name: "South Africa", aliases: ["south africa"], continent: "Africa" },
  { code: "NG", name: "Nigeria", aliases: ["nigeria"], continent: "Africa" },
  { code: "KE", name: "Kenya", aliases: ["kenya"], continent: "Africa" },
  { code: "GH", name: "Ghana", aliases: ["ghana"], continent: "Africa" },
  { code: "MA", name: "Morocco", aliases: ["morocco"], continent: "Africa" },
  { code: "DZ", name: "Algeria", aliases: ["algeria"], continent: "Africa" },
  { code: "SN", name: "Senegal", aliases: ["senegal"], continent: "Africa" },
  { code: "CI", name: "Ivory Coast", aliases: ["ivory coast", "cote divoire"], continent: "Africa" },
  { code: "CM", name: "Cameroon", aliases: ["cameroon"], continent: "Africa" },
  { code: "RW", name: "Rwanda", aliases: ["rwanda"], continent: "Africa" },
  { code: "UG", name: "Uganda", aliases: ["uganda"], continent: "Africa" },
  { code: "TZ", name: "Tanzania", aliases: ["tanzania"], continent: "Africa" },

  // Oceania
  { code: "AU", name: "Australia", aliases: ["australia", "aussie"], continent: "Oceania" },
  { code: "NZ", name: "New Zealand", aliases: ["new zealand", "kiwi"], continent: "Oceania" },
  { code: "FJ", name: "Fiji", aliases: ["fiji"], continent: "Oceania" },
  { code: "PG", name: "Papua New Guinea", aliases: ["papua new guinea"], continent: "Oceania" },
];