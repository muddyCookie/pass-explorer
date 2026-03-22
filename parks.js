// Example park record with all optional fields.
//
//const examplePark = [
//  {
//    park: "California's Great America",
//    company: "Six Flags",
//    slug: "cagreatamerica",
//    group: "Six Flags West",
//    passes: {
//      Gold: { 
//        price: "$85", 
//        access: "Six Flags West", 
//        noParking: "Knott's Berry Farm"
//      }
//    }
//  },
//];

// Six Flags Parking and Access
const SixFlagsPrestigeAccess = ["Six Flags East", "Six Flags Midwest", "Six Flags Texas", "Six Flags West"];

const parkCatalog = [
  {
    park: "California's Great America",
    company: "Six Flags",
    slug: "cagreatamerica",
    state: "California",
    group: "Six Flags West",
    passes: {
      Gold: { 
        price: "$85", 
        access: "Six Flags West", 
        noParking: "Knott's Berry Farm"
      }
    }
  },
  {
    park: "Canada's Wonderland",
    company: "Six Flags",
    slug: "canadaswonderland",
    currency: "CAD",
    country: "Canada",
    state: "Ontario",
    group: "Six Flags Midwest",
    passes: {
      Gold: { 
        price: "$125", 
        access: "Six Flags Midwest", 
        noParking: ["Canada's Wonderland", "La Ronde"]
      },
      Prestige: {
        price: "$210",
        access: SixFlagsPrestigeAccess,
        noParking: "La Ronde"
      }
    }
  },
  {
    park: "Carowinds",
    company: "Six Flags",
    slug: "carowinds",
    state: "North Carolina",
    group: "Six Flags East",
    passes: {
      Gold: { 
        price: "$110", 
        access: "Six Flags East"
      },
      Prestige: {
        price: "$225",
        access: SixFlagsPrestigeAccess,
        noParking: ["Canada's Wonderland", "La Ronde"]
      }
    }
  },
  {
    park: "Cedar Point",
    company: "Six Flags",
    slug: "cedarpoint",
    state: "Ohio",
    group: "Six Flags Midwest",
    passes: {
      Gold: { 
        price: "$195", 
        access: "Six Flags Midwest", 
        noParking: ["Canada's Wonderland", "La Ronde"]
      },
      Prestige: {
        price: "$299",
        access: SixFlagsPrestigeAccess,
        noParking: ["Canada's Wonderland", "La Ronde"]
      }
    }
  },
  {
    park: "Dorney Park",
    company: "Six Flags",
    slug: "dorneypark",
    state: "Pennsylvania",
    group: "Six Flags East",
    passes: {
      Gold: { 
        price: "$160", 
        access: "Six Flags East"
      },
      Prestige: {
        price: "$180",
        access: SixFlagsPrestigeAccess,
        noParking: ["Canada's Wonderland", "La Ronde"]
      }
    }
  },
  {
    park: "Frontier City",
    company: "Six Flags",
    slug: "frontiercity",
    state: "Oklahoma",
    group: "Six Flags Texas",
    passes: {
      Gold: { 
        price: "$79", 
        access: "Six Flags Texas"
      },
      Prestige: {
        price: "$125",
        access: SixFlagsPrestigeAccess,
        noParking: ["Canada's Wonderland", "La Ronde"]
      }
    }
  },
  {
    park: "Kings Dominion",
    company: "Six Flags",
    slug: "kingsdominion",
    state: "Virginia",
    group: "Six Flags East",
    passes: {
      Gold: { 
        price: "$110", 
        access: "Six Flags East"
      },
      Prestige: {
        price: "$225",
        access: SixFlagsPrestigeAccess,
        noParking: ["Canada's Wonderland", "La Ronde"]
      }
    }
  },
  {
    park: "Kings Island",
    company: "Six Flags",
    slug: "kingsisland",
    state: "Ohio",
    group: "Six Flags Midwest",
    passes: {
      Gold: { 
        price: "$180", 
        access: "Six Flags Midwest", 
        noParking: ["Canada's Wonderland", "La Ronde"]
      },
      Prestige: {
        price: "$299",
        access: SixFlagsPrestigeAccess,
        noParking: ["Canada's Wonderland", "La Ronde"]
      }
    }
  },
  {
    park: "Knott's Berry Farm",
    company: "Six Flags",
    slug: "knotts",
    state: "California",
    group: "Six Flags West",
    passes: {
      Gold: { 
        price: "$240", 
        access: "Six Flags West", 
        noParking: "Knott's Berry Farm"
      },
      Prestige: {
        price: "$399",
        access: SixFlagsPrestigeAccess,
        noParking: ["Canada's Wonderland", "La Ronde"]
      }
    }
  },
  {
    park: "La Ronde",
    company: "Six Flags",
    slug: "laronde",
    urlPass: "passeports",
    currency: "CAD",
    country: "Canada",
    state: "Quebec",
    group: "Six Flags Midwest",
    passes: {
      Gold: { 
        price: "$95", 
        access: "Six Flags Midwest", 
        noParking: ["Canada's Wonderland", "La Ronde"]
      },
      Prestige: {
        price: "$150",
        access: SixFlagsPrestigeAccess,
        noParking: "Canada's Wonderland"
      }
    }
  },
  {
    park: "Michigan's Adventure",
    company: "Six Flags",
    slug: "miadventure",
    state: "Michigan",
    group: "Six Flags Midwest",
    passes: {
      Gold: { 
        price: "$140", 
        access: "Six Flags Midwest", 
        noParking: ["Canada's Wonderland", "La Ronde"]
      },
      Prestige: {
        price: "$190",
        access: SixFlagsPrestigeAccess,
        noParking: ["Canada's Wonderland", "La Ronde"]
      }
    }
  },
  {
    park: "Six Flags Darien Lake",
    company: "Six Flags",
    slug: "darienlake",
    state: "New York",
    group: "Six Flags Midwest",
    passes: {
      Gold: { 
        price: "$95", 
        access: "Six Flags Midwest", 
        noParking: ["Canada's Wonderland", "La Ronde"]
      },
      Prestige: {
        price: "$200",
        access: SixFlagsPrestigeAccess,
        noParking: ["Canada's Wonderland", "La Ronde"]
      }
    }
  },
  {
    park: "Six Flags Discovery Kingdom",
    company: "Six Flags",
    slug: "discoverykingdom",
    state: "California",
    group: "Six Flags West",
    passes: {
      Gold: { 
        price: "$79", 
        access: "Six Flags West", 
        noParking: "Knott's Berry Farm"
      },
      Prestige: {
        price: "$200",
        access: SixFlagsPrestigeAccess,
        noParking: ["Canada's Wonderland", "La Ronde"]
      }
    }
  },
  {
    park: "Six Flags Fiesta Texas",
    company: "Six Flags",
    slug: "fiestatexas",
    state: "Texas",
    group: "Six Flags Texas",
    passes: {
      Gold: { 
        price: "$99", 
        access: "Six Flags Texas"
      },
      Prestige: {
        price: "$200",
        access: SixFlagsPrestigeAccess,
        noParking: ["Canada's Wonderland", "La Ronde"]
      }
    }
  },
  {
    park: "Six Flags Great Adventure",
    company: "Six Flags",
    slug: "greatadventure",
    state: "New Jersey",
    group: "Six Flags East",
    passes: {
      Gold: { 
        price: "$89",
        access: "Six Flags East"
      },
      Prestige: {
        price: "$200",
        access: SixFlagsPrestigeAccess,
        noParking: ["Canada's Wonderland", "La Ronde"]
      }
    }
  },
  {
    park: "Six Flags Great America",
    company: "Six Flags",
    slug: "greatamerica",
    state: "Illinois",
    group: "Six Flags Midwest",
    passes: {
      Gold: { 
        price: "$99", 
        access: "Six Flags Midwest", 
        noParking: ["Canada's Wonderland", "La Ronde"]
      },
      Prestige: {
        price: "$200",
        access: SixFlagsPrestigeAccess,
        noParking: ["Canada's Wonderland", "La Ronde"]
      }
    }
  },
  {
    park: "Six Flags Great Escape",
    company: "Six Flags",
    slug: "greatescape",
    state: "New York",
    group: "Six Flags East",
    passes: {
      Gold: { 
        price: "$79", 
        access: "Six Flags East"
      },
      Prestige: {
        price: "$200",
        access: SixFlagsPrestigeAccess,
        noParking: ["Canada's Wonderland", "La Ronde"]
      }
    }
  },
  {
    park: "Six Flags Magic Mountain",
    company: "Six Flags",
    slug: "magicmountain",
    state: "California",
    group: "Six Flags West",
    passes: {
      Gold: { 
        price: "$115", 
        access: "Six Flags West", 
        noParking: "Knott's Berry Farm"
      },
      Prestige: {
        price: "$275",
        access: SixFlagsPrestigeAccess,
        noParking: ["Canada's Wonderland", "La Ronde"]
      }
    }
  },
  {
    park: "Six Flags Mexico",
    company: "Six Flags",
    slug: "mexico",
    country: "Mexico",
    state: "Mexico City",
    group: "Six Flags West",
    currency: "MXN",
    passes: {
      Gold: { 
        price: "$1500", 
        access: "Six Flags West", 
        noParking: "Knott's Berry Farm"
      },
      Prestige: {
        price: "$2999",
        access: SixFlagsPrestigeAccess,
        noParking: ["Canada's Wonderland", "La Ronde"]
      }
    }
  },
  {
    park: "Six Flags New England",
    company: "Six Flags",
    slug: "newengland",
    state: "Massachusetts",
    group: "Six Flags East",
    passes: {
      Gold: { 
        price: "$89", 
        access: "Six Flags East"
      },
      Prestige: {
        price: "$200",
        access: SixFlagsPrestigeAccess,
        noParking: ["Canada's Wonderland", "La Ronde"]
      }
    }
  },
  {
    park: "Six Flags Over Georgia",
    company: "Six Flags",
    slug: "overgeorgia",
    state: "Georgia",
    group: "Six Flags East",
    passes: {
      Gold: { 
        price: "$89", 
        access: "Six Flags East"
      },
      Prestige: {
        price: "$200",
        access: SixFlagsPrestigeAccess,
        noParking: ["Canada's Wonderland", "La Ronde"]
      }
    }
  },
  {
    park: "Six Flags Over Texas",
    company: "Six Flags",
    slug: "overtexas",
    state: "Texas",
    group: "Six Flags Texas",
    passes: {
      Gold: { 
        price: "$99", 
        access: "Six Flags Texas"
      },
      Prestige: {
        price: "$200",
        access: SixFlagsPrestigeAccess,
        noParking: ["Canada's Wonderland", "La Ronde"]
      }
    }
  },
  {
    park: "Six Flags St. Louis",
    company: "Six Flags",
    slug: "stlouis",
    state: "Missouri",
    group: "Six Flags Midwest",
    passes: {
      Gold: { 
        price: "$75", 
        access: "Six Flags Midwest", 
        noParking: ["Canada's Wonderland", "La Ronde"]
      },
      Prestige: {
        price: "$200",
        access: SixFlagsPrestigeAccess,
        noParking: ["Canada's Wonderland", "La Ronde"]
      }
    }
  },
  {
    park: "Valleyfair",
    company: "Six Flags",
    slug: "valleyfair",
    state: "Minnesota",
    group: "Six Flags Midwest",
    passes: {
      Gold: { 
        price: "$140", 
        access: "Six Flags Midwest", 
        noParking: ["Canada's Wonderland", "La Ronde"]
      },
      Prestige: {
        price: "$180",
        access: SixFlagsPrestigeAccess,
        noParking: ["Canada's Wonderland", "La Ronde"]
      }
    }
  },
  {
    park: "Worlds of Fun",
    company: "Six Flags",
    slug: "worldsoffun",
    state: "Missouri",
    group: "Six Flags Midwest",
    passes: {
      Gold: { 
        price: "$90", 
        access: "Six Flags Midwest", 
        noParking: ["Canada's Wonderland", "La Ronde"]
      },
      Prestige: {
        price: "$180",
        access: SixFlagsPrestigeAccess,
        noParking: ["Canada's Wonderland", "La Ronde"]
      }
    }
  },
  {
    park: "Adventureland",
    company: "Herschend",
    url: "adventurelandpark",
    state: "Iowa",
    group: "Herschend",
    passes: {
      Platinum: {
        price: "$260",
        access: "Herschend",
        noParking: ["Dutch Wonderland", "Lake Compounce"]
      }
    }
  },
  {
    park: "Dutch Wonderland",
    company: "Herschend",
    url: "dutchwonderland",
    state: "Pennsylvania",
    group: "Herschend",
    passes: {
      Platinum: {
        price: "$250",
        access: "Herschend",
        noParking: ["Adventureland", "Lake Compounce"]
      }
    }
  },
  {
    park: "Idlewild", // Free Parking
    company: "Herschend",
    url: "idlewild",
    state: "Pennsylvania",
    group: "Herschend",
    passes: {
      Platinum: {
        price: "$250",
        access: "Herschend",
        noParking: ["Adventureland", "Lake Compounce"]
      }
    }

  },
  {
    park: "Kennywood", // Free Parking
    company: "Herschend",
    url: "kennywood",
    state: "Pennsylvania",
    group: "Herschend",
    passes: {
      Platinum: {
        price: "$250",
        access: "Herschend",
        noParking: ["Adventureland", "Lake Compounce"]
      }
    }
  },
  {
    park: "Lake Compounce",
    company: "Herschend",
    url: "lakecompounce",
    state: "Connecticut",
    group: "Herschend",
    passes: {
      Platinum: {
        price: "$210",
        access: "Herschend",
        noParking: ["Adventureland", "Dutch Wonderland"]
      }
    }
  },
  {
    park: "Story Land", // Free Parking
    company: "Herschend",
    url: "storylandnh",
    state: "New Hampshire",
    group: "Herschend",
    passes: {
      Platinum: {
        price: "$210",
        access: "Herschend",
        noParking: ["Adventureland", "Dutch Wonderland", "Lake Compounce"]
      }
    }
  },
  {
    park: "Fun Spot America Orlando", // Free Parking
    company: "Fun Spot America",
    slug: "orlando",
    state: "Florida",
    group: "Fun Spot America"
  },
  {
    park: "Fun Spot America Kissimmee", // Free Parking
    company: "Fun Spot America",
    slug: "kissimmee",
    state: "Florida",
    group: "Fun Spot America"
  },
  {
    park: "Fun Spot America Atlanta", // Free Parking
    company: "Fun Spot America",
    url: "funspotamericaatlanta",
    state: "Georgia",
    group: "Fun Spot America"
  },
  {
    park: "Fun Spot America", // Orlando, Kissimmee, Atlanta Combined due to shared season pass website
    company: "Fun Spot America",
    passes: {
      Season: {
        price: "$120",
        access: "Fun Spot America"
      },
      Ultimate: {
        price: "$290",
        access: "Fun Spot America"
      }
   }
  },
  {
    park: "Legoland California",
    company: "Merlin Entertainments",
    slug: "california",
    state: "California",
    group: "Legoland",
    passes: {
      Elite: {
        price: "$349",
        access: ["Legoland", "Legoland Florida"]
      }
    }
  },
  {
    park: "Legoland Florida",
    company: "Merlin Entertainments",
    slug: "florida",
    state: "Florida",
    group: "Merlin Florida",
    passes: {
      Silver: {
        price: "$199",
        access: "Merlin Florida",
        noParking: "Merlin Florida"
      },
      Gold: {
        price: "$259",
        access: ["Merlin Florida", "Legoland"]
      },
      Elite: {
        price: "$349",
        access: ["Merlin Florida", "Legoland", "Peppa Pig Dallas-Fort Worth"]
      }
    }
  },
  {
    park: "Legoland New York",
    company: "Merlin Entertainments",
    slug: "new-york",
    state: "New York",
    group: "Legoland",
    passes: {
      Elite: {
        price: "$349",
        access: ["Merlin Florida", "Legoland", "Peppa Pig Dallas-Fort Worth"]
      }
    }
  },
  {
    park: "Peppa Pig Florida",
    company: "Merlin Entertainments",
    url: "peppapigthemepark",
    slug: "florida",
    state: "Florida",
    group: "Merlin Florida",
    passes: {
      Silver: {
        price: "$199",
        access: "Merlin Florida",
        noParking: "Merlin Florida"
      },
      Gold: {
        price: "$259",
        access: "Merlin Florida"
      },
      Elite: {
        price: "$349",
        access: ["Merlin Florida", "Legoland"]
      }
    }
  },
  {
    park: "Peppa Pig Dallas-Fort Worth",
    company: "Merlin Entertainments",
    url: "peppapigthemepark",
    slug: "dallas-ft-worth",
    state: "Texas"
  },
  {
    park: "Sesame Place San Diego",
    company: "United Parks",
    url: "sesameplace",
    slug: "san-diego",
    urlPass: "season-pass",
    state: "California",
    group: "United",
    passes: {
      Season: {
        price: "$229",
        access: ["Sesame Place San Diego", "SeaWorld San Diego"]
      },
      Platinum: {
        price: "$375",
        access: "United"
      }
    }
  },
  {
    park: "Sesame Place Philadelphia",
    company: "United Parks",
    url: "sesameplace",
    slug: "philadelphia",
    urlPass: "season-pass",
    state: "California",
    group: "United",
    passes: {
      Platinum: {
        price: "$374",
        access: "United"
      }
    }
  }
];