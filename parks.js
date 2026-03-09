// Park records. Add new parks here using the same shape.
const parkCatalog = [
  {
    "park": "Carowinds",
    "company": "Six Flags",
    "url": "carowinds",
    "region": "East",
    "currency": "USD",
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
    "region": "East",
    "currency": "USD",
    "passes": {
      "Gold": "$105",
      "Prestige": "$145"
    }
  },
  {
    "park": "Kings Dominion",
    "company": "Six Flags",
    "url": "kingsdominion",
    "region": "East",
    "currency": "USD",
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
    "region": "East",
    "currency": "USD",
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
    "region": "East",
    "currency": "USD",
    "passes": {
      "Gold": "$65",
      "Prestige": "$135"
    }
  },
  {
    "park": "Six Flags New England",
    "company": "Six Flags",
    "url": "newengland",
    "region": "East",
    "currency": "USD",
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
    "region": "East",
    "currency": "USD",
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
    "region": "Midwest",
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
    "region": "Midwest",
    "currency": "USD",
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
    "region": "Midwest",
    "currency": "USD",
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
    "region": "Midwest",
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
    "region": "Midwest",
    "currency": "USD",
    "passes": {
      "Gold": "$110",
      "Prestige": "$190"
    }
  },
  {
    "park": "Six Flags Darien Lake",
    "company": "Six Flags",
    "url": "darienlake",
    "region": "Midwest",
    "currency": "USD",
    "passes": {
      "Gold": "$75",
      "Prestige": "$135"
    }
  },
  {
    "park": "Six Flags Great America",
    "company": "Six Flags",
    "url": "greatamerica",
    "region": "Midwest",
    "currency": "USD",
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
    "region": "Midwest",
    "currency": "USD",
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
    "region": "Midwest",
    "currency": "USD",
    "passes": {
      "Gold": "$85",
      "Prestige": "$125"
    }
  },
  {
    "park": "Worlds of Fun",
    "company": "Six Flags",
    "url": "worldsoffun",
    "region": "Midwest",
    "currency": "USD",
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
    "region": "Texas",
    "currency": "USD",
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
    "region": "Texas",
    "currency": "USD",
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
    "region": "Texas",
    "currency": "USD",
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
    "region": "West",
    "currency": "USD",
    "passes": {
      "Gold": "$85"
    }
  },
  {
    "park": "Knott's Berry Farm",
    "company": "Six Flags",
    "url": "knotts",
    "region": "West",
    "currency": "USD",
    "passes": {
      "Silver": "$110",
      "Gold": "$140",
      "Prestige": "$300"
    }
  },
  {
    "park": "Six Flags Discovery Kingdom",
    "company": "Six Flags",
    "url": "discoverykingdom",
    "region": "West",
    "currency": "USD",
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
    "region": "West",
    "currency": "USD",
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
    "region": "West",
    "currency": "MXN",
    "passes": {
      "Silver": "$1300",
      "Gold": "$1500",
      "Prestige": "$2900"
    }
  },
  {
    "park": "Adventureland",
    "company": "Herschend",
    "url": "https://www.adventurelandpark.com",
    "region": "",
    "currency": "USD",
    "passes": {
      "Bronze": "$110",
      "Silver": "$160",
      "Gold": "$210",
      "Platinum": "$250"
    },
    "urlPass": "buy-tickets/season-passes/"
  },
  {
    "park": "Dollywood",
    "company": "Herschend",
    "url": "https://www.dollywood.com",
    "region": "",
    "currency": "USD",
    "passes": {
      "Summer": "$135",
      "Silver": "$170",
      "Gold": "$244"
    },
    "urlPass": "tickets/season-passes/"
  },
  {
    "park": "Dutch Wonderland",
    "company": "Herschend",
    "url": "https://www.dutchwonderland.com",
    "region": "",
    "currency": "USD",
    "passes": {
      "Bronze": "$110",
      "Silver": "$130",
      "Gold": "$170",
      "Platinum": "$250"
    },
    "urlPass": "buy-tickets/season-passes/"
  },
  {
    "park": "Idlewild",
    "company": "Herschend",
    "url": "https://www.idlewild.com",
    "region": "",
    "currency": "USD",
    "passes": {
      "Bronze": "$100",
      "Silver": "$110",
      "Gold": "$139",
      "Platinum": "$250"
    },
    "urlPass": "buy-tickets/season-passes/"
  },
  {
    "park": "Kennywood",
    "company": "Herschend",
    "url": "https://www.kennywood.com",
    "region": "",
    "currency": "USD",
    "passes": {
      "Bronze": "$110",
      "Silver": "$130",
      "Gold": "$170",
      "Platinum": "$250"
    },
    "urlPass": "buy-tickets/season-passes/"
  },
  {
    "park": "Kentucky Kingdom",
    "company": "Herschend",
    "url": "https://www.kentuckykingdom.com",
    "region": "",
    "currency": "USD",
    "passes": {
      "Silver": "$80",
      "Gold": "$100",
      "Diamond": "$150"
    },
    "urlPass": "tickets/season-passes/"
  },
  {
    "park": "Lake Compounce",
    "company": "Herschend",
    "url": "https://www.lakecompounce.com",
    "region": "",
    "currency": "USD",
    "passes": {
      "Silver": "$140",
      "Gold": "$170",
      "Platinum": "$210"
    },
    "urlPass": "buy-tickets/season-passes/"
  },
  {
    "park": "Silver Dollar City",
    "company": "Herschend",
    "url": "https://www.silverdollarcity.com",
    "region": "",
    "currency": "USD",
    "passes": {
      "Silver": "$159",
      "Gold": "$329",
      "Diamond": "$279"
    },
    "urlPass": "tickets/season-passes/"
  },
  {
    "park": "Story Land",
    "company": "Herschend",
    "url": "https://www.storylandnh.com/",
    "region": "",
    "currency": "USD",
    "passes": {
      "Bronze": "$90",
      "Silver": "$100",
      "Gold": "$100",
      "Platinum": "$180"
    },
    "urlPass": "buy-tickets/season-passes/"
  },
  {
    "park": "Wild Adventures",
    "company": "Herschend",
    "url": "https://www.wildadventures.com",
    "region": "",
    "currency": "USD",
    "passes": {
      "Silver": "$107",
      "Gold": "$140",
      "Diamond": "$170"
    },
    "urlPass": "buy-tickets/season-passes/"
  }
];
