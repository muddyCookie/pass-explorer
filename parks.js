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
        price: "$150", 
        access: "Six Flags Midwest", 
        noParking: ["Canada's Wonderland", "La Ronde"]
      },
      Prestige: {
        price: "$300",
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
        price: "$105", 
        access: "Six Flags East"
      },
      Prestige: {
        price: "$145",
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
        price: "$199",
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
        price: "$145", 
        access: "Six Flags Midwest", 
        noParking: ["Canada's Wonderland", "La Ronde"]
      },
      Prestige: {
        price: "$275",
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
        price: "$145", 
        access: "Six Flags West", 
        noParking: "Knott's Berry Farm"
      },
      Prestige: {
        price: "$300",
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
        price: "$135",
        access: SixFlagsPrestigeAccess,
        noParking: "Canada's Wonderland"
      }
    }
  },
  {
    park: "Michigan's Adventure",
    company: "Enchanted Parks",
    url: "miadventure.enchantedparks.com",
    state: "Michigan",
    group: "Enchanted Parks",
    passes: {
      Hero: { 
        price: "$65", 
        access: "Enchanted Parks", 
      },
      Legend: {
        price: "$90",
        access: "Enchanted Parks"
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
        price: "$75", 
        access: "Six Flags Midwest", 
        noParking: ["Canada's Wonderland", "La Ronde"]
      },
      Prestige: {
        price: "$135",
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
        price: "$145",
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
        price: "$145",
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
        price: "$155",
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
        price: "$145",
        access: SixFlagsPrestigeAccess,
        noParking: ["Canada's Wonderland", "La Ronde"]
      }
    }
  },
  {
    park: "Six Flags Great Escape",
    company: "Enchanted Parks",
    url: "greatescapeparks.enchantedparks.com",
    state: "New York",
    group: "Enchanted Parks",
    passes: {
      Hero: { 
        price: "$65", 
        access: "Enchanted Parks"
      },
      Legend: {
        price: "$90",
        access: "Enchanted Parks"
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
        price: "$250",
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
        price: "$1999",
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
        price: "$145",
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
        price: "$145",
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
        price: "$155",
        access: SixFlagsPrestigeAccess,
        noParking: ["Canada's Wonderland", "La Ronde"]
      }
    }
  },
  {
    park: "Six Flags St. Louis",
    company: "Enchanted Parks",
    url: "mid-americaparks.enchantedparks.com",
    state: "Missouri",
    group: "Enchanted Parks",
    passes: {
      Hero: { 
        price: "$65", 
        access: "Enchanted Parks"
      },
      Legend: {
        price: "$90",
        access: "Enchanted Parks"
      }
    }
  },
  {
    park: "Valleyfair",
    company: "Enchanted Parks",
    url: "valleyfair.enchantedparks.com",
    state: "Minnesota",
    group: "Enchanted Parks",
    passes: {
      Hero: { 
        price: "$65", 
        access: "Enchanted Parks"
      },
      Legend: {
        price: "$90",
        access: "Enchanted Parks"
      }
    }
  },
  {
    park: "Worlds of Fun",
    company: "Enchanted Parks",
    url: "worldsoffun.enchantedparks.com",
    state: "Missouri",
    group: "Enchanted Parks",
    passes: {
      Hero: { 
        price: "$90", 
        access: "Enchanted Parks"
      },
      Legend: {
        price: "$180",
        access: "Enchanted Parks"
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
    park: "Fun Spot America", // Orlando, Kissimmee, Atlanta combined due to shared season pass website
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
        access: ["Sesame Place San Diego", "SeaWorld San Diego"],
        noParking: ["Sesame Place San Diego", "SeaWorld San Diego"]
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
  },
  {
    park: "Busch Gardens Williamsburg",
    company: "United Parks",
    url: "buschgardens",
    slug: "williamsburg",
    state: "Virginia",
    group: "United",
    passes: {
      Platinum: {
        price: "$537",
        access: "United"
      }
    }
  },
  {
    park: "Busch Gardens Tampa Bay",
    company: "United Parks",
    url: "buschgardens",
    slug: "tampa",
    state: "Florida",
    group: "United",
    passes: {
      price: "$549",
      access: "United"
    }
  },
  {
    park: "SeaWorld San Diego",
    company: "United Parks",
    slug: "san-diego",
    state: "California",
    group: "United",
    passes: {
      Season: {
        price: "$229",
        access: ["Sesame Place San Diego", "SeaWorld San Diego"],
        noParking: ["Sesame Place San Diego", "SeaWorld San Diego"]
      },
      Platinum: {
        price: "$375",
        access: "United"
      }
    }
  },
  {
    park: "SeaWorld San Antonio",
    company: "United Parks",
    slug: "san-antonio",
    state: "Texas",
    group: "United",
    passes: {
      Platinum: {
        price: "$273",
        access: "United"
      }
    }
  },
  {
    park: "SeaWorld Orlando",
    company: "United Parks",
    slug: "orlando",
    state: "Florida",
    group: "United",
    passes: {
      Platinum: {
        price: "$549",
        access: "United"
      }
    }
  },
  {
    park: "Magic Kingdom",
    company: "Walt Disney",
    url: "disneyworld.disney.go.com",
    slug: "destinations/magic-kingdom",
    state: "Florida",
    group: "Disney World"
  },
  {
    park: "Hollywood Studios",
    company: "Walt Disney",
    url: "disneyworld.disney.go.com",
    slug: "destinations/hollywood-studios",
    state: "Florida",
    group: "Disney World"
  },
  {
    park: "Epcot",
    company: "Walt Disney",
    url: "disneyworld.disney.go.com",
    slug: "destinations/epcot",
    state: "Florida",
    group: "Disney World"
  },
  {
    park: "Animal Kingdom",
    company: "Walt Disney",
    url: "disneyworld.disney.go.com",
    slug: "destinations/animal-kingdom",
    state: "Florida",
    group: "Disney World"
  },
  {
    park: "Disney World", // Magic Kingdom, Epcot, Hollywood Studios, Animal Kingdom combined due to shared season pass website
    company: "Walt Disney",
    url: "disneyworld.disney.go.com",
    passes: {
      "Incredi-Pass": {
        price: "$1629",
        access: "Disney World"
      }
    }    
  },
  {
    park: "Disneyland",
    company: "Walt Disney",
    url: "disneyland.disney.go.com",
    slug: "destinations/disneyland",
    state: "California",
    group: "Disneyland"
  },
  {
    park: "California Adventure",
    company: "Walt Disney",
    url: "disneyland.disney.go.com",
    slug: "destinations/disney-california-adventure",
    state: "California",
    group: "Disneyland"
  },
  {
    park: "Disneyland", // California Adventure, Disneyland combined due to shared season pass website
    company: "Walt Disney",
    url: "disneyland.disney.go.com",
    passes: {
      "Explore Key": {
        price: "$999",
        access: "Disneyland",
        noParking: "Disneyland"
      },
      "Believe Key": {
        price: "$1,474",
        access: "Disneyland",
        noParking: "Disneyland",
      },
      "Inspire Key": {
        price: "$1,899",
        access: "Disneyland"
      }
    }
  },
  {
    park: "Universal Studios Florida",
    company: "Universal",
    slug: "web/en/us/theme-parks/universal-studios-florida",
    state: "Florida",
    group: "Universal Orlando"
  },
  {
    park: "Islands of Adventure",
    company: "Universal",
    slug: "web/en/us/theme-parks/islands-of-adventure",
    state: "Florida",
    group: "Universal Orlando"
  },
  {
    park: "Universal Orlando", // Universal Studios Florida, Islands of Adventure combined due to shared season pass website
    company: "Universal",
    passes: {
      "Seasonal": {
        price: "$425",
        access: "Universal Orlando",
        noParking: "Universal Orlando"
      },
      "Power": {
        price: "$475",
        access: "Universal Orlando",
        noParking: "Universal Orlando"
      },
      "Preferred": {
        price: "$630",
        access: "Universal Orlando",
      },
      "Premier": {
        price: "$905",
        access: "Universal Orlando",
      },
      "Seasonal Water": {
        price: "$475",
        access: "Universal Orlando",
        noParking: "Universal Orlando"
      },
      "Power Water": {
        price: "$435",
        access: "Universal Orlando",
        noParking: "Universal Orlando"
      },
      "Preferred Water": {
        price: "$690",
        access: "Universal Orlando",
      },
      "Premier Water": {
        price: "$1015",
        access: "Universal Orlando",
      },
    }
  }
];