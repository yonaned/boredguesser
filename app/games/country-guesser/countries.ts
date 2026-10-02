export interface Country {
  id: string; // ISO numeric code used by world-atlas (e.g., "840")
  name: string;
  aliases: string[];
}

export const COUNTRIES: Country[] = [
  // A
  { id: "004", name: "Afghanistan", aliases: ["afghanistan", "afganistan", "afghanstan"] },
  { id: "008", name: "Albania", aliases: ["albania", "albenia", "albanien"] },
  { id: "012", name: "Algeria", aliases: ["algeria", "algerie", "algria"] },
  { id: "024", name: "Angola", aliases: ["angola", "angolla"] },
  { id: "020", name: "Andorra", aliases: ["andorra", "andora"] },
  { id: "028", name: "Antigua and Barbuda", aliases: ["antigua and barbuda", "antigua", "antigua & barbuda", "antegua"] },
  { id: "032", name: "Argentina", aliases: ["argentina", "agentina", "argentine", "argentinia"] },
  { id: "051", name: "Armenia", aliases: ["armenia", "aremenia"] },
  { id: "036", name: "Australia", aliases: ["australia", "austrialia", "aussie", "austrilia", "astralia"] },
  { id: "040", name: "Austria", aliases: ["austria", "ostereich", "austrialia"] },
  { id: "031", name: "Azerbaijan", aliases: ["azerbaijan", "azerbajian", "azerbaichan", "azrbaijan"] },

  // B
  { id: "044", name: "Bahamas", aliases: ["bahamas", "the bahamas"] },
  { id: "050", name: "Bahrain", aliases: ["bahrain", "bahrein", "bahrin", "bahrian"] },
  { id: "052", name: "Barbados", aliases: ["barbados", "barbedos", "barbadoes"] },
  { id: "048", name: "Bangladesh", aliases: ["bangladesh", "banglades", "bangaledesh", "bangla"] },
  { id: "112", name: "Belarus", aliases: ["belarus", "belrussia", "byelarus"] },
  { id: "056", name: "Belgium", aliases: ["belgium", "belgie", "belgum", "belguium"] },
  { id: "084", name: "Belize", aliases: ["belize", "beleeze", "belise"] },
  { id: "204", name: "Benin", aliases: ["benin", "benen", "benen republic"] },
  { id: "064", name: "Bhutan", aliases: ["bhutan", "bhuddist", "butan", "bootan"] },
  { id: "070", name: "Bosnia and Herzegovina", aliases: ["bosnia and herzegovina", "bosnia", "bosnia & herzegovina", "herzegovina", "bosnie", "bosnia herzegovina"] },
  { id: "072", name: "Botswana", aliases: ["botswana", "botwsana"] },
  { id: "076", name: "Brazil", aliases: ["brazil", "brasil", "brazill", "brazzil", "brazel"] },
  { id: "096", name: "Brunei Darussalam", aliases: ["brunei darussalam", "brunei", "brunie", "borneo"] },
  { id: "100", name: "Bulgaria", aliases: ["bulgaria", "bulgarija", "bulgaryia"] },
  { id: "854", name: "Burkina Faso", aliases: ["burkina faso", "burkina", "burkino faso", "burkena faso"] },
  { id: "108", name: "Burundi", aliases: ["burundi", "burundie"] },

  // C
  { id: "116", name: "Cambodia", aliases: ["cambodia", "cambogia", "kampuchea"] },
  { id: "120", name: "Cameroon", aliases: ["cameroon", "camaroon", "cameroom"] },
  { id: "124", name: "Canada", aliases: ["canada", "canda", "kanada", "canadia"] },
  { id: "140", name: "Central African Republic", aliases: ["central african republic", "car", "central africa republic", "central aftrican republic"] },
  { id: "148", name: "Chad", aliases: ["chad", "chadd", "tchad"] },
  { id: "152", name: "Chile", aliases: ["chile", "chilli", "chille", "chilly"] },
  { id: "156", name: "China", aliases: ["china", "prc", "peoples republic of china", "chinnese", "chinea"] },
  { id: "170", name: "Colombia", aliases: ["colombia", "columbia", "colombian"] },
  { id: "174", name: "Comoros", aliases: ["comoros", "comorros", "comores"] },
  { id: "184", name: "Cook Islands", aliases: ["cook islands", "cook island"] },
  { id: "178", name: "Congo", aliases: ["congo", "republic of congo", "congobrazzaville", "congo brazzaville"] },
  { id: "180", name: "Democratic Republic of the Congo", aliases: ["democratic republic of the congo", "drc", "democratic republic of congo", "congo kinshasa", "kinshasa"] }, 
  { id: "188", name: "Costa Rica", aliases: ["costa rica", "costarica", "costa rico", "costarico"] },
  { id: "384", name: "Cote d'Ivoire", aliases: ["cote d'ivoire", "cote divoire", "ivory coast", "ivorycoast"] },
  { id: "191", name: "Croatia", aliases: ["croatia", "hrvatska", "croatie"] },
  { id: "192", name: "Cuba", aliases: ["cuba", "cuban", "kuba"] },
  { id: "196", name: "Cyprus", aliases: ["cyprus", "ciprus", "cypruss", "kypros"] },
  { id: "203", name: "Czechia", aliases: ["czechia", "czech republic", "czech", "chechia"] },

  // D
  { id: "208", name: "Denmark", aliases: ["denmark", "danmark", "denmarrk", "denmmark"] },
  { id: "262", name: "Djibouti", aliases: ["djibouti", "jibouti", "djibuti", "djibooti"] },
  { id: "212", name: "Dominica", aliases: ["dominica", "dominican island"] },
  { id: "214", name: "Dominican Republic", aliases: ["dominican republic", "dr", "dominican rep", "dominican republc", "dominican"] },

  // E
  { id: "218", name: "Ecuador", aliases: ["ecuador", "equador", "eucador"] },
  { id: "818", name: "Egypt", aliases: ["egypt", "egipt", "ejipt", "arab republic of egypt"] },
  { id: "222", name: "El Salvador", aliases: ["el salvador", "elsalvador", "el salvadore", "salvador"] },
  { id: "226", name: "Equatorial Guinea", aliases: ["equatorial guinea", "eq guinea", "equatorial guine", "equitorial guinea"] },
  { id: "232", name: "Eritrea", aliases: ["eritrea", "eritrean", "eritria"] },
  { id: "233", name: "Estonia", aliases: ["estonia", "eesti", "estoneia"] },
  { id: "748", name: "Eswatini", aliases: ["eswatini", "swaziland", "eswatnie"] },
  { id: "231", name: "Ethiopia", aliases: ["ethiopia", "ethiopie", "ethiopea", "itopia"] },

  // F
  { id: "238", name: "Falkland Islands (Malvinas)", aliases: ["falkland islands", "falkland islands (malvinas)", "malvinas", "falklands", "falkland island"] },
  { id: "242", name: "Fiji", aliases: ["fiji", "fiji islands", "fijji", "feejee"] },
  { id: "246", name: "Finland", aliases: ["finland", "suomi", "finlnd", "finlandia"] },
  { id: "250", name: "France", aliases: ["france", "frnace", "frence", "franse", "republic of france"] },
  { id: "254", name: "French Guiana", aliases: ["french guiana"] },
  { id: "258", name: "French Polynesia", aliases: ["french polynesia", "polynesia"] },

  // G
  { id: "266", name: "Gabon", aliases: ["gabon", "gobon"] },
  { id: "270", name: "Gambia", aliases: ["gambia", "the gambia", "gambie", "gambila"] },
  { id: "268", name: "Georgia", aliases: ["georgia", "georgie", "gorgeia", "gruzia"] },
  { id: "276", name: "Germany", aliases: ["germany", "ger", "deutschland", "germony", "germany republic", "deudsland"] },
  { id: "288", name: "Ghana", aliases: ["ghana", "gana", "ghanna", "gahna"] },
  { id: "300", name: "Greece", aliases: ["greece", "greeze", "grece", "hellas", "ellada"] },
  { id: "304", name: "Greenland", aliases: ["greenland", "green land", "greenlen", "gronland"] },
  { id: "320", name: "Guatemala", aliases: ["guatemala", "guatamala", "guetemala", "guatelmala"] },
  { id: "312", name: "Guinea", aliases: ["guinea", "guinee", "gunea"] },
  { id: "324", name: "Guinea-Bissau", aliases: ["guinea-bissau", "guinea bissau", "guinea-bisau"] },
  { id: "328", name: "Guyana", aliases: ["guyana", "guiana"] },

  // H
  { id: "332", name: "Haiti", aliases: ["haiti", "haitie", "hayti"] },
  { id: "340", name: "Honduras", aliases: ["honduras", "hondouras", "hondoras", "hondurus"] },
  { id: "348", name: "Hungary", aliases: ["hungary", "hungrie", "magyarorsag"] },

  // I
  { id: "356", name: "India", aliases: ["india", "bharat", "indea"] },
  { id: "360", name: "Indonesia", aliases: ["indonesia", "indonesie", "indonesa", "indo"] },
  { id: "364", name: "Iran", aliases: ["iran", "persia", "iran islamic republic", "iram"] },
  { id: "368", name: "Iraq", aliases: ["iraq", "irak", "iraque"] },
  { id: "372", name: "Ireland", aliases: ["ireland", "eire", "irland", "irelande"] },
  { id: "376", name: "Israel", aliases: ["israel", "isreal", "state of israel"] },
  { id: "380", name: "Italy", aliases: ["italy", "italia", "itly", "italey"] },

  // J
  { id: "388", name: "Jamaica", aliases: ["jamaica", "jamacia", "jamaika"] },
  { id: "392", name: "Japan", aliases: ["japan", "nippon", "jappan", "jappen"] },
  { id: "400", name: "Jordan", aliases: ["jordan", "jordania", "jordn"] },

  // K
  { id: "398", name: "Kazakhstan", aliases: ["kazakhstan", "kazakstan", "kazahkstan"] },
  { id: "404", name: "Kenya", aliases: ["kenya", "kenia", "kenyia", "kennya"] },
  { id: "296", name: "Kiribati", aliases: ["kiribati", "kiribas"] },
  { id: "408", name: "North Korea", aliases: ["north korea", "dprk", "democratic people's republic of korea", "korea north"] },
  { id: "410", name: "South Korea", aliases: ["south korea", "republic of korea", "korea south", "korea"] },
  { id: "414", name: "Kuwait", aliases: ["kuwait", "kuwate"] },
  { id: "417", name: "Kyrgyzstan", aliases: ["kyrgyzstan", "kirghizia", "kyrgystan", "kirgistan"] },

  // L
  { id: "418", name: "Laos", aliases: ["laos", "lao people's democratic republic"] },
  { id: "428", name: "Latvia", aliases: ["latvia", "latvija", "latveja"] },
  { id: "422", name: "Lebanon", aliases: ["lebanon", "lebanese republic", "lebanan"] },
  { id: "426", name: "Lesotho", aliases: ["lesotho", "lesuto"] },
  { id: "430", name: "Liberia", aliases: ["liberia", "libearia", "lberia"] },
  { id: "434", name: "Libya", aliases: ["libya", "libian arab jamahiriya", "lybia"] },
  { id: "438", name: "Liechtenstein", aliases: ["liechtenstein", "lichtenstein"] },
  { id: "440", name: "Lithuania", aliases: ["lithuania", "lithuanie", "litwa", "lithuaniya"] },
  { id: "442", name: "Luxembourg", aliases: ["luxembourg", "luxemburg", "luxembourgh"] },

  // M
  { id: "807", name: "North Macedonia", aliases: ["north macedonia", "fyrom", "macedonia", "makedonija"] },
  { id: "450", name: "Madagascar", aliases: ["madagascar", "madagaskar", "madagacar"] },
  { id: "454", name: "Malawi", aliases: ["malawi", "malawie", "malawwi"] },
  { id: "458", name: "Malaysia", aliases: ["malaysia", "malayesia", "malaisia", "malysia"] },
  { id: "462", name: "Maldives", aliases: ["maldives", "maldive islands", "maldive"] },
  { id: "466", name: "Mali", aliases: ["mali", "mali republic", "malli"] },
  { id: "470", name: "Malta", aliases: ["malta", "maltees"] },
  { id: "584", name: "Marshall Islands", aliases: ["marshall islands", "marshal islands"] },
  { id: "478", name: "Mauritania", aliases: ["mauritania", "mauritnia"] },
  { id: "480", name: "Mauritius", aliases: ["mauritius", "mauritious", "mauritias"] },
  { id: "484", name: "Mexico", aliases: ["mexico", "mexiko", "mehico", "united mexican states"] },
  { id: "583", name: "Micronesia", aliases: ["micronesia", "fsm", "micro"] },
  { id: "498", name: "Moldova", aliases: ["moldova", "moldavia", "moldovan"] },
  { id: "492", name: "Monaco", aliases: ["monaco", "moncao", "monnaco"] },
  { id: "496", name: "Mongolia", aliases: ["mongolia", "mongolla", "mongol"] },
  { id: "499", name: "Montenegro", aliases: ["montenegro", "crna gora"] },
  { id: "504", name: "Morocco", aliases: ["morocco", "maroc", "morrocco", "morocko", "morroco"] },
  { id: "508", name: "Mozambique", aliases: ["mozambique", "mosambique", "mozambiqu", "mosambik"] },
  { id: "104", name: "Myanmar", aliases: ["myanmar", "burma", "myanma", "myammar"] },

  // N
  { id: "516", name: "Namibia", aliases: ["namibia", "nambia", "namibie"] },
  { id: "520", name: "Nauru", aliases: ["nauru", "naru"] },
  { id: "524", name: "Nepal", aliases: ["nepal", "nepall", "neppal"] },
  { id: "528", name: "Netherlands", aliases: ["netherlands", "holland", "the netherlands", "nederlands", "netherland"] },
  { id: "540", name: "New Caledonia", aliases: ["new caledonia", "nouvelle caledonie"] },
  { id: "554", name: "New Zealand", aliases: ["new zealand", "newzealand", "new zeland", "kiwiland"] },
  { id: "558", name: "Nicaragua", aliases: ["nicaragua", "nikaragua", "nicuragua", "nigaragua"] },
  { id: "562", name: "Niger", aliases: ["niger", "niger republic", "nigre"] },
  { id: "566", name: "Nigeria", aliases: ["nigeria", "nigeria republic", "niger area"] },
  { id: "570", name: "Niue", aliases: ["niue", "newe"] },
  { id: "580", name: "Northern Mariana Islands", aliases: ["northern mariana islands", "mariana islands", "northern marianas"] },
  { id: "578", name: "Norway", aliases: ["norway", "norge", "norvege"] },

  // O
  { id: "512", name: "Oman", aliases: ["oman", "omaan", "sultanate of oman", "umann"] },

  // P
  { id: "586", name: "Pakistan", aliases: ["pakistan", "pakestan", "pakisstan"] },
  { id: "585", name: "Palau", aliases: ["palau", "palou"] },
  { id: "275", name: "Palestine", aliases: ["palestine", "palestinian territories", "west bank", "gaza", "palestina"] },
  { id: "591", name: "Panama", aliases: ["panama", "panamma", "panamá"] },
  { id: "598", name: "Papua New Guinea", aliases: ["papua new guinea", "papua new guniea"] },
  { id: "600", name: "Paraguay", aliases: ["paraguay", "paraguy", "paragay", "paragau"] },
  { id: "604", name: "Peru", aliases: ["peru", "perou", "peruu"] },
  { id: "608", name: "Philippines", aliases: ["philippines", "philipines", "philippine islands", "phillipines", "filipinas"] },
  { id: "616", name: "Poland", aliases: ["poland", "polska", "polonia", "polend", "polland"] },
  { id: "620", name: "Portugal", aliases: ["portugal", "portugeal", "portugual"] },
  { id: "630", name: "Puerto Rico", aliases: ["puerto rico", "puertorico", "porto rico", "puerto riko"] },

  // Q
  { id: "634", name: "Qatar", aliases: ["qatar", "katar", "qataar", "qutari"] },

  // R
  { id: "642", name: "Romania", aliases: ["romania", "rumania", "romaina", "románia"] },
  { id: "643", name: "Russia", aliases: ["russia", "russian federation", "russa", "rossiya", "russland"] },
  { id: "646", name: "Rwanda", aliases: ["rwanda", "rwandese republic", "ruanda", "rwandaa"] },

  // S
  { id: "659", name: "Saint Kitts and Nevis", aliases: ["saint kitts and nevis", "saint kitts", "st kitts and nevis", "nevis", "st kitts"] },
  { id: "662", name: "Saint Lucia", aliases: ["saint lucia", "st lucia"] },
  { id: "670", name: "Saint Vincent and the Grenadines", aliases: ["saint vincent and the grenadines", "st vincent", "saint vincent", "st vincent & the grenadines", "grenadines"] },
  { id: "882", name: "Samoa", aliases: ["samoa", "western samoa"] },
  { id: "674", name: "San Marino", aliases: ["san marino", "sann marino", "san marina"] },
  { id: "678", name: "Sao Tome and Principe", aliases: ["sao tome and principe", "sao tome", "sao tome & principe", "sao tomé"] },
  { id: "682", name: "Saudi Arabia", aliases: ["saudi arabia", "saudi", "saudia arabia", "k.s.a", "ksa"] },
  { id: "686", name: "Senegal", aliases: ["senegal", "senegale", "senegal republic"] },
  { id: "688", name: "Serbia", aliases: ["serbia", "serbia and montenegro"] },
  { id: "690", name: "Seychelles", aliases: ["seychelles", "seychelles islands"] },
  { id: "694", name: "Sierra Leone", aliases: ["sierra leone", "sieraleone"] },
  { id: "703", name: "Slovakia", aliases: ["slovakia", "slovensko", "slovak republic"] },
  { id: "705", name: "Slovenia", aliases: ["slovenia", "slovenija", "slovena"] },
  { id: "090", name: "Solomon Islands", aliases: ["solomon islands", "solomons", "soloman islands"] },
  { id: "706", name: "Somalia", aliases: ["somalia", "somaila", "somalie"] },
  { id: "710", name: "South Africa", aliases: ["south africa", "suid-afrika", "southafrica"] },
  { id: "728", name: "South Sudan", aliases: ["south sudan", "southsudan", "sudan south"] },
  { id: "724", name: "Spain", aliases: ["spain", "espana", "españia", "espanole"] },
  { id: "144", name: "Sri Lanka", aliases: ["sri lanka", "ceylon", "sri lank", "srilanka"] },
  { id: "729", name: "Sudan", aliases: ["sudan", "soudan", "sudann", "sudaan"] },
  { id: "740", name: "Suriname", aliases: ["suriname", "surinam"] },
  { id: "752", name: "Sweden", aliases: ["sweden", "sverige", "swedan"] },
  { id: "756", name: "Switzerland", aliases: ["switzerland", "swiss", "suisse", "schwyz"] },
  { id: "760", name: "Syria", aliases: ["syria", "syrian arab republic", "siria", "syra"] },

  // T
  { id: "158", name: "Taiwan", aliases: ["taiwan", "chinese taipei", "taiwan province of china"] },
  { id: "762", name: "Tajikistan", aliases: ["tajikistan", "tadzhikistan", "tajikstan"] },
  { id: "834", name: "Tanzania", aliases: ["tanzania", "tanganyika", "tanzanie", "tanzanania"] },
  { id: "764", name: "Thailand", aliases: ["thailand", "siam", "thailnd", "tailand"] },
  { id: "626", name: "Timor-Leste", aliases: ["timor-leste", "east timor", "timor leste"] },
  { id: "768", name: "Togo", aliases: ["togo", "togolese republic", "toggo", "toogo"] },
  { id: "776", name: "Tonga", aliases: ["tonga", "tongha", "tongga"] },
  { id: "780", name: "Trinidad and Tobago", aliases: ["trinidad and tobago", "trinidad", "trinidad & tobago", "trindad and tobago"] },
  { id: "788", name: "Tunisia", aliases: ["tunisia", "tunisie", "tunisa", "tunnisia"] },
  { id: "792", name: "Turkey", aliases: ["turkey", "türkiye", "turkiye", "turkie", "turky"] },
  { id: "795", name: "Turkmenistan", aliases: ["turkmenistan", "turkomenistan", "turkmanistan", "turkmenestan"] },
  { id: "798", name: "Tuvalu", aliases: ["tuvalu", "tuvulu"] },

  // U
  { id: "800", name: "Uganda", aliases: ["uganda", "ugandha", "youganda"] },
  { id: "804", name: "Ukraine", aliases: ["ukraine", "ukrain", "ukraina", "ukrane"] },
  { id: "784", name: "United Arab Emirates", aliases: ["united arab emirates", "uae", "emirates", "u.a.e"] },
  { id: "826", name: "United Kingdom", aliases: ["united kingdom", "uk", "britain", "great britain", "u.k.", "england", "united kindom"] },
  { id: "840", name: "United States", aliases: ["united states", "usa", "united states of america", "u.s.a.", "u.s.", "america", "the united states"] },
  { id: "858", name: "Uruguay", aliases: ["uruguay", "urguay", "urugay", "urugau"] },
  { id: "860", name: "Uzbekistan", aliases: ["uzbekistan", "uzbakistan", "ozbekiston", "uzbekstan", "usbekistan"] },

  // V
  { id: "548", name: "Vanuatu", aliases: ["vanuatu", "new hebrides"] },
  { id: "862", name: "Venezuela", aliases: ["venezuela", "venezuala", "venezela"] },
  { id: "704", name: "Vietnam", aliases: ["vietnam", "viet nam", "vietname"] },

  // Y
  { id: "887", name: "Yemen", aliases: ["yemen", "yeman", "yemen republic"] },

  // Z
  { id: "894", name: "Zambia", aliases: ["zambia", "zambie", "zambbia", "zambea"] },
  { id: "716", name: "Zimbabwe", aliases: ["zimbabwe", "zimbawe", "zimbabve"] }
];