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
    group: "Six Flags Midwest",
    passes: {
      Gold: { 
        price: "$89", 
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
    group: "Six Flags West",
    passes: {
      Gold: { 
        price: "$240", 
        access: "Six Flags West", 
        noParking: "Knott's Berry Farm"
      },
      Prestige: {
        price: "$125",
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
    group: "Fun Spot America"
  },
  {
    park: "Fun Spot America Kissimmee", // Free Parking
    company: "Fun Spot America",
    slug: "kissimmee",
    group: "Fun Spot America"
  },
  {
    park: "Fun Spot America Atlanta", // Free Parking
    company: "Fun Spot America",
    url: "funspotamericaatlanta",
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
   }
];
