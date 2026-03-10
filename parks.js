// Park records. Add new parks here using the same shape.
// Optional per-tier overrides:
// - accessGroupsByTier: { TierName: ["Group Name", "Park Name"] }
// - parking: ["Tier Name"]
// - extraParking: { TierName: ["Group Name", "Park Name"] }
const parkCatalog = [
  {
    "park": "Carowinds",
    "company": "Six Flags",
    "url": "carowinds",
    "group": "East",
    "passes": {
      "Silver": "$89",
      "Gold": "$110",
      "Prestige": "$165"
    }
  },
  {
    "park": "Dorney Park",
    "company": "Six Flags",
    "url": "dorneypark",
    "group": "East",
    "passes": {
      "Gold": "$105",
      "Prestige": "$145"
    }
  },
  {
    "park": "Kings Dominion",
    "company": "Six Flags",
    "url": "kingsdominion",
    "group": "East",
    "passes": {
      "Silver": "$89",
      "Gold": "$110",
      "Prestige": "$199"
    }
  },
  {
    "park": "Six Flags Great Adventure",
    "company": "Six Flags",
    "url": "greatadventure",
    "group": "East",
    "passes": {
      "Silver": "$70",
      "Gold": "$89",
      "Prestige": "$155"
    }
  },
  {
    "park": "Six Flags Great Escape",
    "company": "Six Flags",
    "url": "greatescape",
    "group": "East",
    "passes": {
      "Gold": "$65",
      "Prestige": "$135"
    }
  },
  {
    "park": "Six Flags New England",
    "company": "Six Flags",
    "url": "newengland",
    "group": "East",
    "passes": {
      "Silver": "$70",
      "Gold": "$89",
      "Prestige": "$145"
    }
  },
  {
    "park": "Six Flags Over Georgia",
    "company": "Six Flags",
    "url": "overgeorgia",
    "group": "East",
    "passes": {
      "Silver": "$65",
      "Gold": "$89",
      "Prestige": "$145"
    }
  },
  {
    "park": "Canada's Wonderland",
    "company": "Six Flags",
    "url": "canadaswonderland",
    "group": "Midwest",
    "currency": "CAD",
    "passes": {
      "Silver": "$89",
      "Gold": "$125",
      "Prestige": "$210"
    }
  },
  {
    "park": "Cedar Point",
    "company": "Six Flags",
    "url": "cedarpoint",
    "group": "Midwest",
    "passes": {
      "Silver": "$99",
      "Gold": "$150",
      "Prestige": "$250"
    }
  },
  {
    "park": "Kings Island",
    "company": "Six Flags",
    "url": "kingsisland",
    "group": "Midwest",
    "passes": {
      "Silver": "$105",
      "Gold": "$145",
      "Prestige": "$225"
    }
  },
  {
    "park": "La Ronde",
    "company": "Six Flags",
    "url": "laronde",
    "urlPass": "passeports",
    "group": "Midwest",
    "currency": "CAD",
    "passes": {
      "Silver": "$73",
      "Gold": "$95",
      "Prestige": "$150"
    }
  },
  {
    "park": "Michigan's Adventure",
    "company": "Six Flags",
    "url": "miadventure",
    "group": "Midwest",
    "passes": {
      "Gold": "$110",
      "Prestige": "$190"
    }
  },
  {
    "park": "Six Flags Darien Lake",
    "company": "Six Flags",
    "url": "darienlake",
    "group": "Midwest",
    "passes": {
      "Gold": "$75",
      "Prestige": "$135"
    }
  },
  {
    "park": "Six Flags Great America",
    "company": "Six Flags",
    "url": "greatamerica",
    "group": "Midwest",
    "passes": {
      "Silver": "$79",
      "Gold": "$99",
      "Prestige": "$145"
    }
  },
  {
    "park": "Six Flags St. Louis",
    "company": "Six Flags",
    "url": "stlouis",
    "group": "Midwest",
    "passes": {
      "Silver": "$59",
      "Gold": "$75",
      "Prestige": "$135"
    }
  },
  {
    "park": "Valleyfair",
    "company": "Six Flags",
    "url": "valleyfair",
    "group": "Midwest",
    "passes": {
      "Gold": "$85",
      "Prestige": "$125"
    }
  },
  {
    "park": "Worlds of Fun",
    "company": "Six Flags",
    "url": "worldsoffun",
    "group": "Midwest",
    "passes": {
      "Silver": "$65",
      "Gold": "$90",
      "Prestige": "$125"
    }
  },
  {
    "park": "Frontier City",
    "company": "Six Flags",
    "url": "frontiercity",
    "group": "Texas",
    "passes": {
      "Silver": "$55",
      "Gold": "$79",
      "Prestige": "$125"
    }
  },
  {
    "park": "Six Flags Fiesta Texas",
    "company": "Six Flags",
    "url": "fiestatexas",
    "group": "Texas",
    "passes": {
      "Silver": "$70",
      "Gold": "$99",
      "Prestige": "$145"
    }
  },
  {
    "park": "Six Flags Over Texas",
    "company": "Six Flags",
    "url": "overtexas",
    "group": "Texas",
    "passes": {
      "Silver": "$70",
      "Gold": "$99",
      "Prestige": "$155"
    }
  },
  {
    "park": "California's Great America",
    "company": "Six Flags",
    "url": "cagreatamerica",
    "group": "West",
    "passes": {
      "Gold": "$85"
    }
  },
  {
    "park": "Knott's Berry Farm",
    "company": "Six Flags",
    "url": "knotts",
    "group": "West",
      "passes": {
      "Silver": "$120",
      "Gold": "$145",
      "Prestige": "$300"
    }
  },
  {
    "park": "Six Flags Discovery Kingdom",
    "company": "Six Flags",
    "url": "discoverykingdom",
    "group": "West",
    "passes": {
      "Silver": "$65",
      "Gold": "$79",
      "Prestige": "$145"
    }
  },
  {
    "park": "Six Flags Magic Mountain",
    "company": "Six Flags",
    "url": "magicmountain",
    "group": "West",
    "passes": {
      "Silver": "$90",
      "Gold": "$115",
      "Prestige": "$250"
    }
  },
  {
    "park": "Six Flags Mexico",
    "company": "Six Flags",
    "url": "mexico",
    "group": "West",
    "currency": "MXN",
    "passes": {
      "Silver": "$1100",
      "Gold": "$1500",
      "Prestige": "$1999"
    }
  },
  {
    "park": "Adventureland",
    "company": "Herschend",
    "url": "adventurelandpark",
    "group": "Platinum",
    "passes": {
      "Bronze": "$110",
      "Silver": "$160",
      "Gold": "$210",
      "Platinum": "$250"
    },
    "parking": ["Gold", "Platinum"],
    "extraParking": {
      "Platinum": ["Idlewild", "Kennywood", "Story Land"]
    }
  },
  {
    "park": "Dollywood",
    "company": "Herschend",
    "url": "dollywood",
    "urlPass": "tickets",
    "passes": {
      "Summer": "$135",
      "Silver": "$170",
      "Gold": "$245"
    },
    "parking": ["Gold"]
  },
  {
    "park": "Dutch Wonderland",
    "company": "Herschend",
    "url": "dutchwonderland",
    "group": "Platinum",
    "passes": {
      "Bronze": "$110",
      "Silver": "$130",
      "Gold": "$170",
      "Platinum": "$250"
    },
    "parking": ["Gold", "Platinum"],
    "extraParking": {
      "Platinum": ["Idlewild", "Kennywood", "Story Land"]
    }
  },
  {
    "park": "Idlewild",
    "company": "Herschend",
    "url": "idlewild",
    "group": "Platinum",
    "passes": {
      "Bronze": "$100",
      "Silver": "$110",
      "Gold": "$139",
      "Platinum": "$250"
    },
    "parking": ["Bronze", "Silver", "Gold", "Platinum"],
    "extraParking": {
      "Platinum": ["Dutch Wonderland", "Kennywood", "Story Land"]
    }
  },
  {
    "park": "Kennywood",
    "company": "Herschend",
    "url": "kennywood",
    "group": "Platinum",
    "passes": {
      "Bronze": "$110",
      "Silver": "$130",
      "Gold": "$170",
      "Platinum": "$250"
    },
    "parking": ["Bronze", "Silver", "Gold", "Platinum"],
    "extraParking": {
      "Platinum": ["Dutch Wonderland", "Idlewild", "Kennywood", "Story Land"]
    }
  },
  {
    "park": "Kentucky Kingdom",
    "company": "Herschend",
    "url": "kentuckykingdom",
    "urlPass": "tickets",
    "passes": {
      "Silver": "$80",
      "Gold": "$100",
      "Diamond": "$150"
    },
    "parking": ["Silver", "Gold", "Diamond"]
  },
  {
    "park": "Lake Compounce",
    "company": "Herschend",
    "url": "lakecompounce",
    "group": "Platinum",
    "passes": {
      "Silver": "$140",
      "Gold": "$170",
      "Platinum": "$210"
    },
    "parking": ["Gold", "Platinum"],
    "extraParking": {
      "Platinum": ["Idlewild", "Kennywood", "Story Land"]
    }
  },
  {
    "park": "Silver Dollar City",
    "company": "Herschend",
    "url": "silverdollarcity",
    "urlPass": "tickets",
    "passes": {
      "Silver": "$159",
      "Gold": "$219",
      "Diamond": "$279"
    },
    "parking": ["Silver", "Gold", "Diamond"]
  },
  {
    "park": "Story Land",
    "company": "Herschend",
    "url": "storylandnh",
    "group": "Platinum",
    "passes": {
      "Bronze": "$110",
      "Silver": "$120",
      "Gold": "$140",
      "Platinum": "$210"
    },
    "parking": ["Bronze", "Silver", "Gold", "Platinum"],
    "extraParking": {
      "Platinum": ["Idlewild", "Kennywood"]
    }
  },
  {
    "park": "Wild Adventures",
    "company": "Herschend",
    "url": "wildadventures",
    "passes": {
      "Silver": "$120",
      "Gold": "$170",
      "Diamond": "$190"
    },
    "parking": ["Gold", "Diamond"]
  }
];
