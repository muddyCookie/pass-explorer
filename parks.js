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
//        access: GoldWestAccess, 
//        parking: "Six Flags West"
//      }
//    }
//  },
//];

// Six Flags Parking and Access
const PrestigeParking = ["Six Flags East", "Knott's Berry Farm", "Six Flags Midwest", "Six Flags Texas", "Six Flags West"];
const CanadasWonderlandParking = [ PrestigeParking, "Canada's Wonderland" ];
const LaRondeParking = [ PrestigeParking, "La Ronde" ];
const GoldMidwestAccess = [ "Six Flags Midwest", "Canada's Wonderland", "La Ronde" ];
const GoldWestAccess = [ "Six Flags West", "Knott's Berry Farm" ];
const PrestigeAccess = [ PrestigeParking, "Canada's Wonderland", "La Ronde" ];
const FreeParkingHerschend = [ "Idlewild", "Kennywood", "Story Land" ];


const parkCatalog = [
  {
    park: "California's Great America",
    company: "Six Flags",
    slug: "cagreatamerica",
    group: "Six Flags West",
    passes: {
      Gold: { 
        price: "$85", 
        access: GoldWestAccess, 
        parking: "Six Flags West"
      }
    }
  },
  {
    park: "Canada's Wonderland",
    company: "Six Flags",
    slug: "canadaswonderland",
    currency: "CAD",
    passes: {
      Gold: { 
        price: "$89", 
        access: GoldMidwestAccess, 
        parking: "Six Flags Midwest"
      },
      Prestige: {
        price: "$210",
        access: PrestigeAccess,
        parking: CanadasWonderlandParking
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
        access: "Six Flags East", 
        parking: "Six Flags East"
      },
      Prestige: {
        price: "$225",
        access: PrestigeAccess,
        parking: PrestigeParking
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
        access: GoldMidwestAccess, 
        parking: "Six Flags Midwest"
      },
      Prestige: {
        price: "$299",
        access: PrestigeAccess,
        parking: PrestigeParking
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
        access: "Six Flags East", 
        parking: "Six Flags East"
      },
      Prestige: {
        price: "$180",
        access: PrestigeAccess,
        parking: PrestigeParking
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
        access: "Six Flags Texas", 
        parking: "Six Flags Texas"
      },
      Prestige: {
        price: "$125",
        access: PrestigeAccess,
        parking: PrestigeParking
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
        access: "Six Flags East", 
        parking: "Six Flags East"
      },
      Prestige: {
        price: "$225",
        access: PrestigeAccess,
        parking: PrestigeParking
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
        access: GoldMidwestAccess, 
        parking: "Six Flags Midwest"
      },
      Prestige: {
        price: "$299",
        access: PrestigeAccess,
        parking: PrestigeParking
      }
    }
  },
  {
    park: "Knott's Berry Farm",
    company: "Six Flags",
    slug: "knotts",
    passes: {
      Gold: { 
        price: "$240", 
        access: GoldWestAccess, 
        parking: "Six Flags West"
      },
      Prestige: {
        price: "$125",
        access: PrestigeAccess,
        parking: PrestigeParking
      }
    }
  },
  {
    park: "La Ronde",
    company: "Six Flags",
    slug: "laronde",
    urlPass: "passeports",
    currency: "CAD",
    passes: {
      Gold: { 
        price: "$95", 
        access: GoldMidwestAccess, 
        parking: "Six Flags Midwest"
      },
      Prestige: {
        price: "$150",
        access: PrestigeAccess,
        parking: LaRondeParking
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
        access: GoldMidwestAccess, 
        parking: "Six Flags Midwest"
      },
      Prestige: {
        price: "$190",
        access: PrestigeAccess,
        parking: PrestigeParking
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
        access: GoldMidwestAccess, 
        parking: "Six Flags Midwest"
      },
      Prestige: {
        price: "$200",
        access: PrestigeAccess,
        parking: PrestigeParking
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
        access: GoldWestAccess, 
        parking: "Six Flags West"
      },
      Prestige: {
        price: "$200",
        access: PrestigeAccess,
        parking: PrestigeParking
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
        access: "Six Flags Texas", 
        parking: "Six Flags Texas"
      },
      Prestige: {
        price: "$200",
        access: PrestigeAccess,
        parking: PrestigeParking
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
        access: "Six Flags East", 
        parking: "Six Flags East"
      },
      Prestige: {
        price: "$200",
        access: PrestigeAccess,
        parking: PrestigeParking
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
        access: GoldMidwestAccess, 
        parking: "Six Flags Midwest"
      },
      Prestige: {
        price: "$200",
        access: PrestigeAccess,
        parking: PrestigeParking
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
        access: "Six Flags East", 
        parking: "Six Flags East"
      },
      Prestige: {
        price: "$200",
        access: PrestigeAccess,
        parking: PrestigeParking
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
        access: GoldWestAccess, 
        parking: "Six Flags West"
      },
      Prestige: {
        price: "$275",
        access: PrestigeAccess,
        parking: PrestigeParking
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
        access: GoldWestAccess, 
        parking: "Six Flags West"
      },
      Prestige: {
        price: "$2999",
        access: PrestigeAccess,
        parking: PrestigeParking
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
        access: "Six Flags East", 
        parking: "Six Flags East"
      },
      Prestige: {
        price: "$200",
        access: PrestigeAccess,
        parking: PrestigeParking
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
        access: "Six Flags East", 
        parking: "Six Flags East"
      },
      Prestige: {
        price: "$200",
        access: PrestigeAccess,
        parking: PrestigeParking
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
        access: "Six Flags Texas", 
        parking: "Six Flags Texas"
      },
      Prestige: {
        price: "$200",
        access: PrestigeAccess,
        parking: PrestigeParking
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
        access: GoldMidwestAccess, 
        parking: "Six Flags Midwest"
      },
      Prestige: {
        price: "$200",
        access: PrestigeAccess,
        parking: PrestigeParking
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
        access: GoldMidwestAccess, 
        parking: "Six Flags Midwest"
      },
      Prestige: {
        price: "$180",
        access: PrestigeAccess,
        parking: PrestigeParking
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
        access: GoldMidwestAccess, 
        parking: "Six Flags Midwest"
      },
      Prestige: {
        price: "$180",
        access: PrestigeAccess,
        parking: PrestigeParking
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
        parking: ["Adventureland", FreeParkingHerschend]
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
        parking: ["Dutch Wonderland", FreeParkingHerschend]
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
        parking: ["Dutch Wonderland", FreeParkingHerschend]
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
        parking: ["Dutch Wonderland", FreeParkingHerschend]
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
        parking: ["Lake Compounce", FreeParkingHerschend]
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
        parking: FreeParkingHerschend
      }
    }
  }
];
