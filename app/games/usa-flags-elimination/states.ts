export interface USStateFlag {
  postal: string; // 2-letter uppercase postal code (e.g., "CA", "TX")
  name: string;
  region: "Northeast" | "Midwest" | "South" | "West";
  aliases: string[];
}

export const USA_STATE_FLAGS: USStateFlag[] = [
  // Northeast
  { postal: "CT", name: "Connecticut", region: "Northeast", aliases: ["connecticut", "ct", "conneticut"] },
  { postal: "ME", name: "Maine", region: "Northeast", aliases: ["maine", "me"] },
  { postal: "MA", name: "Massachusetts", region: "Northeast", aliases: ["massachusetts", "ma", "mass"] },
  { postal: "NH", name: "New Hampshire", region: "Northeast", aliases: ["new hampshire", "nh", "newhampshire"] },
  { postal: "RI", name: "Rhode Island", region: "Northeast", aliases: ["rhode island", "ri", "rhodeisland"] },
  { postal: "VT", name: "Vermont", region: "Northeast", aliases: ["vermont", "vt"] },
  { postal: "NJ", name: "New Jersey", region: "Northeast", aliases: ["new jersey", "nj", "newjersey"] },
  { postal: "NY", name: "New York", region: "Northeast", aliases: ["new york", "ny", "newyork"] },
  { postal: "PA", name: "Pennsylvania", region: "Northeast", aliases: ["pennsylvania", "pa", "pensylvania"] },

  // Midwest
  { postal: "IL", name: "Illinois", region: "Midwest", aliases: ["illinois", "il", "ilinois"] },
  { postal: "IN", name: "Indiana", region: "Midwest", aliases: ["indiana", "in"] },
  { postal: "MI", name: "Michigan", region: "Midwest", aliases: ["michigan", "mi"] },
  { postal: "OH", name: "Ohio", region: "Midwest", aliases: ["ohio", "oh"] },
  { postal: "WI", name: "Wisconsin", region: "Midwest", aliases: ["wisconsin", "wi"] },
  { postal: "IA", name: "Iowa", region: "Midwest", aliases: ["iowa", "ia"] },
  { postal: "KS", name: "Kansas", region: "Midwest", aliases: ["kansas", "ks"] },
  { postal: "MN", name: "Minnesota", region: "Midwest", aliases: ["minnesota", "mn"] },
  { postal: "MO", name: "Missouri", region: "Midwest", aliases: ["missouri", "mo"] },
  { postal: "NE", name: "Nebraska", region: "Midwest", aliases: ["nebraska", "ne"] },
  { postal: "ND", name: "North Dakota", region: "Midwest", aliases: ["north dakota", "nd", "northdakota"] },
  { postal: "SD", name: "South Dakota", region: "Midwest", aliases: ["south dakota", "sd", "southdakota"] },

  // South
  { postal: "DE", name: "Delaware", region: "South", aliases: ["delaware", "de"] },
  { postal: "FL", name: "Florida", region: "South", aliases: ["florida", "fl", "fla"] },
  { postal: "GA", name: "Georgia", region: "South", aliases: ["georgia", "ga"] },
  { postal: "MD", name: "Maryland", region: "South", aliases: ["maryland", "md"] },
  { postal: "NC", name: "North Carolina", region: "South", aliases: ["north carolina", "nc", "northcarolina"] },
  { postal: "SC", name: "South Carolina", region: "South", aliases: ["south carolina", "sc", "southcarolina"] },
  { postal: "VA", name: "Virginia", region: "South", aliases: ["virginia", "va"] },
  { postal: "WV", name: "West Virginia", region: "South", aliases: ["west virginia", "wv", "westvirginia"] },
  { postal: "AL", name: "Alabama", region: "South", aliases: ["alabama", "al"] },
  { postal: "KY", name: "Kentucky", region: "South", aliases: ["kentucky", "ky"] },
  { postal: "MS", name: "Mississippi", region: "South", aliases: ["mississippi", "ms"] },
  { postal: "TN", name: "Tennessee", region: "South", aliases: ["tennessee", "tn"] },
  { postal: "AR", name: "Arkansas", region: "South", aliases: ["arkansas", "ar"] },
  { postal: "LA", name: "Louisiana", region: "South", aliases: ["louisiana", "la"] },
  { postal: "OK", name: "Oklahoma", region: "South", aliases: ["oklahoma", "ok"] },
  { postal: "TX", name: "Texas", region: "South", aliases: ["texas", "tx"] },

  // West
  { postal: "AZ", name: "Arizona", region: "West", aliases: ["arizona", "az"] },
  { postal: "CO", name: "Colorado", region: "West", aliases: ["colorado", "co"] },
  { postal: "ID", name: "Idaho", region: "West", aliases: ["idaho", "id"] },
  { postal: "MT", name: "Montana", region: "West", aliases: ["montana", "mt"] },
  { postal: "NV", name: "Nevada", region: "West", aliases: ["nevada", "nv"] },
  { postal: "NM", name: "New Mexico", region: "West", aliases: ["new mexico", "nm", "newmexico"] },
  { postal: "UT", name: "Utah", region: "West", aliases: ["utah", "ut"] },
  { postal: "WY", name: "Wyoming", region: "West", aliases: ["wyoming", "wy"] },
  { postal: "AK", name: "Alaska", region: "West", aliases: ["alaska", "ak"] },
  { postal: "CA", name: "California", region: "West", aliases: ["california", "ca", "cali"] },
  { postal: "HI", name: "Hawaii", region: "West", aliases: ["hawaii", "hi"] },
  { postal: "OR", name: "Oregon", region: "West", aliases: ["oregon", "or"] },
  { postal: "WA", name: "Washington", region: "West", aliases: ["washington", "wa"] },
];