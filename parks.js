// Park records. Add new parks here using the same shape.
// Optional per-tier overrides:
// - parkAccess: { TierName: ["Group Name", "Park Name"] }
// - passPurchaseUrlByTier: { TierName: "absolute-or-relative-url" } (legacy)
// - urlFunCard: "absolute-or-relative-url" (Fun Card override)
// - parking: ["Tier Name"]
// - extraParking: { TierName: ["Group Name", "Park Name"] } (groups like "West", "United", or "AllSixFlagsParks" work)
const parkCatalog = [
  {
    park: "Carowinds",
    company: "Six Flags",
    url: "carowinds",
    group: "East",
    passes: {
      Silver: "$89",
      Gold: "$110",
      Prestige: "$165"
    }
  },
  {
    park: "Dorney Park",
    company: "Six Flags",
    url: "dorneypark",
    group: "East",
    passes: {
      Gold: "$105",
      Prestige: "$145"
    }
  },
  {
    park: "Kings Dominion",
    company: "Six Flags",
    url: "kingsdominion",
    group: "East",
    passes: {
      Silver: "$89",
      Gold: "$110",
      Prestige: "$199"
    }
  },
  {
    park: "Six Flags Great Adventure",
    company: "Six Flags",
    url: "greatadventure",
    group: "East",
    passes: {
      Silver: "$70",
      Gold: "$89",
      Prestige: "$155"
    }
  },
  {
    park: "Six Flags Great Escape",
    company: "Six Flags",
    url: "greatescape",
    group: "East",
    passes: {
      Gold: "$65",
      Prestige: "$135"
    }
  },
  {
    park: "Six Flags New England",
    company: "Six Flags",
    url: "newengland",
    group: "East",
    passes: {
      Silver: "$70",
      Gold: "$89",
      Prestige: "$145"
    }
  },
  {
    park: "Six Flags Over Georgia",
    company: "Six Flags",
    url: "overgeorgia",
    group: "East",
    passes: {
      Silver: "$65",
      Gold: "$89",
      Prestige: "$145"
    }
  },
  {
    park: "Canada's Wonderland",
    company: "Six Flags",
    url: "canadaswonderland",
    group: "Midwest",
    currency: "CAD",
    passes: {
      Silver: "$89",
      Gold: "$125",
      Prestige: "$210"
    }
  },
  {
    park: "Cedar Point",
    company: "Six Flags",
    url: "cedarpoint",
    group: "Midwest",
    passes: {
      Silver: "$99",
      Gold: "$150",
      Prestige: "$250"
    }
  },
  {
    park: "Kings Island",
    company: "Six Flags",
    url: "kingsisland",
    group: "Midwest",
    passes: {
      Silver: "$105",
      Gold: "$145",
      Prestige: "$225"
    }
  },
  {
    park: "La Ronde",
    company: "Six Flags",
    url: "laronde",
    urlPass: "passeports",
    group: "Midwest",
    currency: "CAD",
    passes: {
      Silver: "$73",
      Gold: "$95",
      Prestige: "$150"
    }
  },
  {
    park: "Michigan's Adventure",
    company: "Six Flags",
    url: "miadventure",
    group: "Midwest",
    passes: {
      Gold: "$110",
      Prestige: "$190"
    }
  },
  {
    park: "Six Flags Darien Lake",
    company: "Six Flags",
    url: "darienlake",
    group: "Midwest",
    passes: {
      Gold: "$75",
      Prestige: "$135"
    }
  },
  {
    park: "Six Flags Great America",
    company: "Six Flags",
    url: "greatamerica",
    group: "Midwest",
    passes: {
      Silver: "$79",
      Gold: "$99",
      Prestige: "$145"
    }
  },
  {
    park: "Six Flags St. Louis",
    company: "Six Flags",
    url: "stlouis",
    group: "Midwest",
    passes: {
      Silver: "$59",
      Gold: "$75",
      Prestige: "$135"
    }
  },
  {
    park: "Valleyfair",
    company: "Six Flags",
    url: "valleyfair",
    group: "Midwest",
    passes: {
      Gold: "$85",
      Prestige: "$125"
    }
  },
  {
    park: "Worlds of Fun",
    company: "Six Flags",
    url: "worldsoffun",
    group: "Midwest",
    passes: {
      Silver: "$65",
      Gold: "$90",
      Prestige: "$125"
    }
  },
  {
    park: "Frontier City",
    company: "Six Flags",
    url: "frontiercity",
    group: "Texas",
    passes: {
      Silver: "$55",
      Gold: "$79",
      Prestige: "$125"
    }
  },
  {
    park: "Six Flags Fiesta Texas",
    company: "Six Flags",
    url: "fiestatexas",
    group: "Texas",
    passes: {
      Silver: "$70",
      Gold: "$99",
      Prestige: "$145"
    }
  },
  {
    park: "Six Flags Over Texas",
    company: "Six Flags",
    url: "overtexas",
    group: "Texas",
    passes: {
      Silver: "$70",
      Gold: "$99",
      Prestige: "$155"
    }
  },
  {
    park: "California's Great America",
    company: "Six Flags",
    url: "cagreatamerica",
    group: "West",
    passes: {
      Gold: "$85"
    }
  },
  {
    park: "Knott's Berry Farm",
    company: "Six Flags",
    url: "knotts",
    group: "West",
    passes: {
      Silver: "$120",
      Gold: "$145",
      Prestige: "$300"
    }
  },
  {
    park: "Six Flags Discovery Kingdom",
    company: "Six Flags",
    url: "discoverykingdom",
    group: "West",
    passes: {
      Silver: "$65",
      Gold: "$79",
      Prestige: "$145"
    }
  },
  {
    park: "Six Flags Magic Mountain",
    company: "Six Flags",
    url: "magicmountain",
    group: "West",
    passes: {
      Silver: "$90",
      Gold: "$115",
      Prestige: "$250"
    }
  },
  {
    park: "Six Flags Mexico",
    company: "Six Flags",
    url: "mexico",
    group: "West",
    currency: "MXN",
    passes: {
      Silver: "$1100",
      Gold: "$1500",
      Prestige: "$1999"
    }
  },
  {
    park: "Adventureland",
    company: "Herschend",
    url: "adventurelandpark",
    group: "Herschend",
    passes: {
      Bronze: "$110",
      Silver: "$160",
      Gold: "$210",
      Platinum: "$250"
    },
    parking: ["Gold", "Platinum"],
    extraParking: {
      Platinum: ["HerschendFree"]
    }
  },
  {
    park: "Dollywood",
    company: "Herschend",
    url: "dollywood",
    urlPass: "tickets",
    passes: {
      Summer: "$135",
      Silver: "$170",
      Gold: "$245"
    },
    parking: ["Gold"]
  },
  {
    park: "Dutch Wonderland",
    company: "Herschend",
    url: "dutchwonderland",
    group: "Herschend",
    passes: {
      Bronze: "$110",
      Silver: "$130",
      Gold: "$170",
      Platinum: "$250"
    },
    parking: ["Gold", "Platinum"],
    extraParking: {
      Platinum: ["HerschendFree"]
    }
  },
  {
    park: "Idlewild",
    company: "Herschend",
    url: "idlewild",
    group: "HerschendFree",
    passes: {
      Bronze: "$100",
      Silver: "$110",
      Gold: "$139",
      Platinum: "$250"
    },
    extraParking: {
      Platinum: ["Dutch Wonderland", "HerschendFree"]
    }
  },
  {
    park: "Kennywood",
    company: "Herschend",
    url: "kennywood",
    group: "HerschendFree",
    passes: {
      Bronze: "$110",
      Silver: "$130",
      Gold: "$170",
      Platinum: "$250"
    },
    extraParking: {
      Platinum: ["Dutch Wonderland", "HerschendFree"]
    }
  },
  {
    park: "Kentucky Kingdom",
    company: "Herschend",
    url: "kentuckykingdom",
    urlPass: "tickets",
    passes: {
      Silver: "$80",
      Gold: "$100",
      Diamond: "$150"
    },
  },
  {
    park: "Lake Compounce",
    company: "Herschend",
    url: "lakecompounce",
    group: "Herschend",
    passes: {
      Silver: "$140",
      Gold: "$170",
      Platinum: "$210"
    },
    parking: ["Gold", "Platinum"],
    extraParking: {
      Platinum: ["HerschendFree"]
    }
  },
  {
    park: "Silver Dollar City",
    company: "Herschend",
    url: "silverdollarcity",
    urlPass: "tickets",
    passes: {
      Silver: "$159",
      Gold: "$219",
      Diamond: "$279"
    },
  },
  {
    park: "Story Land",
    company: "Herschend",
    url: "storylandnh",
    group: "HerschendFree",
    passes: {
      Bronze: "$110",
      Silver: "$120",
      Gold: "$140",
      Platinum: "$210"
    },
    extraParking: {
      Platinum: ["HerschendFree"]
    }
  },
  {
    park: "Wild Adventures",
    company: "Herschend",
    url: "wildadventures",
    passes: {
      Silver: "$120",
      Gold: "$170",
      Diamond: "$190"
    },
    parking: ["Gold", "Diamond"]
  },
  {
    park: "SeaWorld Orlando",
    company: "United Parks",
    url: "seaworld",
    urlFunCard: "tickets/fun-card",
    slug: "orlando",
    group: "United",
    passes: {
      "Fun Card": "$148",
      Bronze: "$198",
      Silver: "$279",
      Gold: "$315",
      Platinum: "$549"
    },
    parking: ["Silver", "Gold", "Platinum"],
    extraParking: {
      Platinum: ["United"]
    }
  },
  {
    park: "SeaWorld San Antonio",
    company: "United Parks",
    url: "seaworld",
    slug: "san-antonio",
    group: "United",
    passes: {
      Season: "$126",
      Silver: "$143",
      Gold: "$165",
      Platinum: "$265"
    },
    extraParking: {
      Platinum: ["United"]
    }
  },
  {
    park: "SeaWorld San Diego",
    company: "United Parks",
    url: "seaworld",
    urlFunCard: "tickets/fun-card",
    slug: "san-diego",
    group: "United",
    passes: {
      "Fun Card": "$127",
      Season: "$229",
      Silver: "$210",
      Gold: "$246",
      Platinum: "$375"
    },
    parkAccess: {
      Season: ["SeaWorld San Diego", "Sesame Place San Diego"]
    },
    parking: ["Silver", "Gold", "Platinum"],
    extraParking: {
      Platinum: ["United"]
    }
  },
  {
    park: "Busch Gardens Tampa Bay",
    company: "United Parks",
    url: "buschgardens",
    urlFunCard: "tickets/fun-card",
    slug: "tampa",
    group: "United",
    passes: {
      "Fun Card": "$148",
      Bronze: "$192",
      Silver: "$279",
      Gold: "$315",
      Platinum: "$549"
    },
    parking: ["Silver", "Gold", "Platinum"],
    extraParking: {
      Platinum: ["United"]
    }
  },
  {
    park: "Busch Gardens Williamsburg",
    company: "United Parks",
    url: "buschgardens",
    slug: "williamsburg",
    group: "United",
    passes: {
      "Fun Card": "$146",
      Basic: "$243",
      Unlimited: "$324",
      Premier: "$408",
      Platinum: "$537"
    },
    parking: ["Unlimited", "Premier", "Platinum"],
    extraParking: {
      Platinum: ["United"]
    }
  },
  {
    park: "Sesame Place Philadelphia",
    company: "United Parks",
    url: "sesameplace",
    urlPass: "season-pass",
    slug: "philadelphia",
    group: "United",
    passes: {
      Bronze: "$171",
      Silver: "$230",
      Gold: "$293",
      Platinum: "$374"
    },
    parking: ["Silver", "Gold", "Platinum"],
    extraParking: {
      Platinum: ["United"]
    }
  },
  {
    park: "Sesame Place San Diego",
    company: "United Parks",
    url: "sesameplace",
    urlPass: "season-pass",
    slug: "san-diego",
    group: "United",
    passes: {
      Season: "$229",
      Silver: "$210",
      Gold: "$246",
      Platinum: "$375"
    },
    parkAccess: {
      Season: ["SeaWorld San Diego", "Sesame Place San Diego"]
    },
    parking: ["Silver", "Gold", "Platinum"],
    extraParking: {
      Platinum: ["United"]
    }
  },
  {
    park: "Disney California Adventure",
    company: "Walt Disney",
    url: "disneyland",
    urlPass: "magic-key",
    slug: "california-adventure",
    group: "Disneyland",
    passes: {
      "Explore Key": "$999",
      "Believe Key": "$1,474",
      "Inspire Key": "$1,899"
    },
    parking: ["Inspire Key"],
    extraParking: {
      "Inspire Key": ["Disneyland"]
    }
  },
  {
    park: "Disneyland",
    company: "Walt Disney",
    url: "disneyland",
    urlPass: "magic-key",
    slug: "disneyland",
    group: "Disneyland",
    passes: {
      "Explore Key": "$999",
      "Believe Key": "$1,474",
      "Inspire Key": "$1,899"
    },
    parking: ["Inspire Key"],
    extraParking: {
      "Inspire Key": ["Disneyland"]
    }
  },
  {
    park: "Disney's Animal Kingdom",
    company: "Walt Disney",
    url: "disneyworld",
    slug: "animal-kingdom",
    group: "DisneyWorld",
    passes: {
      "Incredi-Pass": "$1,629",
    },
    parkAccess: {
      "Incredi-Pass": ["DisneyWorld"]
    },
    extraParking: {
      "Incredi-Pass": ["DisneyWorld"]
    }
  },
  {
    park: "Disney's Hollywood Studios",
    company: "Walt Disney",
    url: "disneyworld",
    slug: "hollywood-studios",
    group: "DisneyWorld",
    passes: {
      "Incredi-Pass": "$1,629",
    },
    parkAccess: {
      "Incredi-Pass": ["DisneyWorld"]
    },
    extraParking: {
      "Incredi-Pass": ["DisneyWorld"]
    }
  },
  {
    park: "Epcot",
    company: "Walt Disney",
    url: "disneyworld",
    slug: "epcot",
    group: "DisneyWorld",
    passes: {
      "Incredi-Pass": "$1,629",
    },
    parkAccess: {
      "Incredi-Pass": ["DisneyWorld"]
    },
    extraParking: {
      "Incredi-Pass": ["DisneyWorld"]
    }
  },
  {
    park: "Magic Kingdom",
    company: "Walt Disney",
    url: "disneyworld",
    slug: "magic-kingdom",
    group: "DisneyWorld",
    passes: {
      "Incredi-Pass": "$1,629",
    },
    parkAccess: {
      "Incredi-Pass": ["DisneyWorld"]
    },
    extraParking: {
      "Incredi-Pass": ["DisneyWorld"]
    } ["DisneyWorld"]
  }
  // Miral Experiences
  // {
  //   park: "Ferrari World Abu Dhabi",
  // },
  // {
  //   park: "SeaWorld Abu Dhabi",
  // },
  // {
  //   park: "Warner Bros. World Abu Dhabi",
  // },
  // {
  //   park: "Yas Waterworld Abu Dhabi",
  // }
];
