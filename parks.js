// Example park catalog source with optional group defaults.
//
// const parkCatalog = {
//   "Six Flags": {
//     "Six Flags West": [
//       {
//         park: "California's Great America",
//         slug: "cagreatamerica",
//         state: "California",
//         passes: {
//           Gold: {
//             price: "$85",
//             access: "Six Flags West",
//             noParking: "Knott's Berry Farm"
//           }
//         }
//       }
//     ]
//   },
//   "Walt Disney": {
//     "Disney World": {
//       defaults: { hostSlug: "disneyworld", state: "Florida" },
//       parks: [
//         { park: "Magic Kingdom", slug: "destinations/magic-kingdom" }
//       ]
//     }
//   }
// };

// Six Flags Parking and Access
const SixFlagsPrestigeAccess = ["Six Flags East", "Six Flags Midwest", "Six Flags Texas", "Six Flags West"];

const parkCatalog = {
  "Six Flags": {
    "Six Flags West": [
      {
        park: "California's Great America",
        slug: "cagreatamerica",
        state: "California",
        passes: {
          Gold: {
            price: "$85",
            access: "Six Flags West",
            noParking: "Knott's Berry Farm"
          }
        }
      },
      {
        park: "Knott's Berry Farm",
        slug: "knotts",
        state: "California",
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
        park: "Six Flags Discovery Kingdom",
        slug: "discoverykingdom",
        state: "California",
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
        park: "Six Flags Magic Mountain",
        slug: "magicmountain",
        state: "California",
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
        slug: "mexico",
        country: "Mexico",
        state: "Mexico City",
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
      }
    ],
    "Six Flags Midwest": [
      {
        park: "Canada's Wonderland",
        slug: "canadaswonderland",
        currency: "CAD",
        country: "Canada",
        state: "Ontario",
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
        park: "Cedar Point",
        slug: "cedarpoint",
        state: "Ohio",
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
        park: "Kings Island",
        slug: "kingsisland",
        state: "Ohio",
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
        park: "La Ronde",
        slug: "laronde",
        urlPass: "passeports",
        currency: "CAD",
        country: "Canada",
        state: "Quebec",
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
        park: "Six Flags Darien Lake",
        slug: "darienlake",
        state: "New York",
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
        park: "Six Flags Great America",
        slug: "greatamerica",
        state: "Illinois",
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
      }
    ],
    "Six Flags East": [
      {
        park: "Carowinds",
        slug: "carowinds",
        state: "North Carolina",
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
        park: "Dorney Park",
        slug: "dorneypark",
        state: "Pennsylvania",
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
        park: "Kings Dominion",
        slug: "kingsdominion",
        state: "Virginia",
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
        park: "Six Flags Great Adventure",
        slug: "greatadventure",
        state: "New Jersey",
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
        park: "Six Flags New England",
        slug: "newengland",
        state: "Massachusetts",
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
        slug: "overgeorgia",
        state: "Georgia",
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
      }
    ],
    "Six Flags Texas": [
      {
        park: "Frontier City",
        slug: "frontiercity",
        state: "Oklahoma",
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
        park: "Six Flags Fiesta Texas",
        slug: "fiestatexas",
        state: "Texas",
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
        park: "Six Flags Over Texas",
        slug: "overtexas",
        state: "Texas",
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
      }
    ]
  },
  "Enchanted Parks": {
    "Enchanted Parks": [
      {
        park: "Michigan's Adventure",
        slug: "miadventure",
        state: "Michigan",
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
        park: "Six Flags Great Escape",
        slug: "greatescapeparks",
        state: "New York",
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
        park: "Six Flags St. Louis",
        slug: "mid-americaparks",
        state: "Missouri",
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
        slug: "valleyfair",
        state: "Minnesota",
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
        slug: "worldsoffun",
        state: "Missouri",
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
      }
    ]
  },
  "Herschend": {
    "Herschend": [
      {
        park: "Adventureland",
        url: "adventurelandpark",
        state: "Iowa",
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
        url: "dutchwonderland",
        state: "Pennsylvania",
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
        url: "idlewild",
        state: "Pennsylvania",
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
        url: "kennywood",
        state: "Pennsylvania",
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
        url: "lakecompounce",
        state: "Connecticut",
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
        url: "storylandnh",
        state: "New Hampshire",
        passes: {
          Platinum: {
            price: "$210",
            access: "Herschend",
            noParking: ["Adventureland", "Dutch Wonderland", "Lake Compounce"]
          }
        }
      }
    ]
  },
  "Fun Spot America": {
    "Fun Spot America": [
      {
        park: "Fun Spot America Orlando", // Free Parking
        slug: "orlando",
        state: "Florida"
      },
      {
        park: "Fun Spot America Kissimmee", // Free Parking
        slug: "kissimmee",
        state: "Florida"
      },
      {
        park: "Fun Spot America Atlanta", // Free Parking
        url: "funspotamericaatlanta",
        state: "Georgia"
      },
      {
        park: "Fun Spot America", // Orlando, Kissimmee, Atlanta combined due to shared season pass website
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
    ]
  },
  "Merlin Entertainments": {
    "Legoland": [
      {
        park: "Legoland California",
        slug: "california",
        state: "California",
        passes: {
          Elite: {
            price: "$349",
            access: ["Legoland", "Legoland Florida"]
          }
        }
      },
      {
        park: "Legoland New York",
        slug: "new-york",
        state: "New York",
        passes: {
          Elite: {
            price: "$349",
            access: ["Merlin Florida", "Legoland", "Peppa Pig Dallas-Fort Worth"]
          }
        }
      }
    ],
    "Merlin Florida": [
      {
        park: "Legoland Florida",
        slug: "florida",
        state: "Florida",
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
        park: "Peppa Pig Florida",
        url: "peppapigthemepark",
        slug: "florida",
        state: "Florida",
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
      }
    ],
    "Peppa Pig Dallas-Fort Worth": [
      {
        park: "Peppa Pig Dallas-Fort Worth",
        url: "peppapigthemepark",
        slug: "dallas-ft-worth",
        state: "Texas"
      }
    ]
  },
  "United Parks": {
    "United": [
      {
        park: "Sesame Place San Diego",
        url: "sesameplace",
        slug: "san-diego",
        urlPass: "season-pass",
        state: "California",
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
        url: "sesameplace",
        slug: "philadelphia",
        urlPass: "season-pass",
        state: "California",
        passes: {
          Platinum: {
            price: "$374",
            access: "United"
          }
        }
      },
      {
        park: "Busch Gardens Williamsburg",
        url: "buschgardens",
        slug: "williamsburg",
        state: "Virginia",
        passes: {
          Platinum: {
            price: "$537",
            access: "United"
          }
        }
      },
      {
        park: "Busch Gardens Tampa Bay",
        url: "buschgardens",
        slug: "tampa",
        state: "Florida",
        passes: {
          price: "$549",
          access: "United"
        }
      },
      {
        park: "SeaWorld San Diego",
        slug: "san-diego",
        state: "California",
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
        slug: "san-antonio",
        state: "Texas",
        passes: {
          Platinum: {
            price: "$273",
            access: "United"
          }
        }
      },
      {
        park: "SeaWorld Orlando",
        slug: "orlando",
        state: "Florida",
        passes: {
          Platinum: {
            price: "$549",
            access: "United"
          }
        }
      }
    ]
  },
  "Walt Disney": {
    "Disney World": {
      defaults: {
        hostSlug: "disneyworld",
        state: "Florida"
      },
      parks: [
        {
          park: "Magic Kingdom",
          slug: "destinations/magic-kingdom"
        },
        {
          park: "Hollywood Studios",
          slug: "destinations/hollywood-studios"
        },
        {
          park: "Epcot",
          slug: "destinations/epcot"
        },
        {
          park: "Animal Kingdom",
          slug: "destinations/animal-kingdom"
        },
        {
          park: "Disney World", // Magic Kingdom, Epcot, Hollywood Studios, Animal Kingdom combined due to shared season pass website
          passes: {
            "Incredi-Pass": {
              price: "$1629",
              access: "Disney World"
            }
          }
        }
      ]
    },
    "Disneyland": {
      defaults: {
        hostSlug: "disneyland",
        state: "California"
      },
      parks: [
        {
          park: "Disneyland",
          slug: "destinations/disneyland"
        },
        {
          park: "California Adventure",
          slug: "destinations/disney-california-adventure"
        },
        {
          park: "Disneyland", // California Adventure, Disneyland combined due to shared season pass website
          passes: {
            "Explore Key": {
              price: "$999",
              access: "Disneyland",
              noParking: "Disneyland"
            },
            "Believe Key": {
              price: "$1,474",
              access: "Disneyland",
              noParking: "Disneyland"
            },
            "Inspire Key": {
              price: "$1,899",
              access: "Disneyland"
            }
          }
        }
      ]
    }
  },
  "Universal": {
    "Universal Orlando": [
      {
        park: "Universal Studios Florida",
        slug: "web/en/us/theme-parks/universal-studios-florida",
        state: "Florida"
      },
      {
        park: "Islands of Adventure",
        slug: "web/en/us/theme-parks/islands-of-adventure",
        state: "Florida"
      },
      {
        park: "Universal Orlando", // Universal Studios Florida, Islands of Adventure combined due to shared season pass website
        passes: {
          Seasonal: {
            price: "$425",
            access: "Universal Orlando",
            noParking: "Universal Orlando"
          },
          Power: {
            price: "$475",
            access: "Universal Orlando",
            noParking: "Universal Orlando"
          },
          Preferred: {
            price: "$630",
            access: "Universal Orlando"
          },
          Premier: {
            price: "$905",
            access: "Universal Orlando"
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
            access: "Universal Orlando"
          },
          "Premier Water": {
            price: "$1015",
            access: "Universal Orlando"
          }
        }
      }
    ]
  }
};
