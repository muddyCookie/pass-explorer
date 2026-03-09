const parkCatalog = {
  "Carowinds": {
    Region: "East",
    company: "Six Flags",
    url: "carowinds",
    "Silver": "$89",
    "Gold": "$110",
    "Prestige": "$165"
  },
  "Dorney Park": {
    Region: "East",
    company: "Six Flags",
    url: "dorneypark",
    "Gold": "$105",
    "Prestige": "$145"
  },
  "Kings Dominion": {
    Region: "East",
    company: "Six Flags",
    url: "kingsdominion",
    "Silver": "$89",
    "Gold": "$110",
    "Prestige": "$199"
  },
  "Six Flags Great Adventure": {
    Region: "East",
    company: "Six Flags",
    url: "greatadventure",
    "Silver": "$70",
    "Gold": "$89",
    "Prestige": "$155"
  },
  "Six Flags Great Escape": {
    Region: "East",
    company: "Six Flags",
    url: "greatescape",
    "Gold": "$65",
    "Prestige": "$135"
  },
  "Six Flags New England": {
    Region: "East",
    company: "Six Flags",
    url: "newengland",
    "Silver": "$70",
    "Gold": "$89",
    "Prestige": "$145"
  },
  "Six Flags Over Georgia": {
    Region: "East",
    company: "Six Flags",
    url: "overgeorgia",
    "Silver": "$65",
    "Gold": "$89",
    "Prestige": "$145"
  },
  "Canada's Wonderland": {
    Region: "Midwest",
    company: "Six Flags",
    url: "canadaswonderland",
    currency: "CAD",
    "Silver": "$89",
    "Gold": "$125",
    "Prestige": "$210"
  },
  "Cedar Point": {
    Region: "Midwest",
    company: "Six Flags",
    url: "cedarpoint",
    "Silver": "$99",
    "Gold": "$150",
    "Prestige": "$250"
  },
  "Kings Island": {
    Region: "Midwest",
    company: "Six Flags",
    url: "kingsisland",
    "Silver": "$105",
    "Gold": "$145",
    "Prestige": "$225"
  },
  "La Ronde": {
    Region: "Midwest",
    company: "Six Flags",
    url: "laronde",
    currency: "CAD",
    "Silver": "$73",
    "Gold": "$95",
    "Prestige": "$150"
  },
  "Michigan's Adventure": {
    Region: "Midwest",
    company: "Six Flags",
    url: "miadventure",
    "Gold": "$110",
    "Prestige": "$190"
  },
  "Six Flags Darien Lake": {
    Region: "Midwest",
    company: "Six Flags",
    url: "darienlake",
    "Gold": "$75",
    "Prestige": "$135"
  },
  "Six Flags Great America": {
    Region: "Midwest",
    company: "Six Flags",
    url: "greatamerica",
    "Silver": "$79",
    "Gold": "$99",
    "Prestige": "$145"
  },
  "Six Flags St. Louis": {
    Region: "Midwest",
    company: "Six Flags",
    url: "stlouis",
    "Silver": "$59",
    "Gold": "$75",
    "Prestige": "$135"
  },
  "Valleyfair": {
    Region: "Midwest",
    company: "Six Flags",
    url: "valleyfair",
    "Gold": "$85",
    "Prestige": "$125"
  },
  "Worlds of Fun": {
    Region: "Midwest",
    company: "Six Flags",
    url: "worldsoffun",
    "Silver": "$65",
    "Gold": "$90",
    "Prestige": "$125"
  },
  "Frontier City": {
    Region: "Texas",
    company: "Six Flags",
    url: "frontiercity",
    "Silver": "$55",
    "Gold": "$79",
    "Prestige": "$125"
  },
  "Six Flags Fiesta Texas": {
    Region: "Texas",
    company: "Six Flags",
    url: "fiestatexas",
    "Silver": "$70",
    "Gold": "$99",
    "Prestige": "$145"
  },
  "Six Flags Over Texas": {
    Region: "Texas",
    company: "Six Flags",
    url: "overtexas",
    "Silver": "$70",
    "Gold": "$99",
    "Prestige": "$155"
  },
  "California's Great America": {
    Region: "West",
    company: "Six Flags",
    url: "cagreatamerica",
    "Gold": "$85"
  },
  "Knott's Berry Farm": {
    Region: "West",
    company: "Six Flags",
    url: "knotts",
    "Silver": "$110",
    "Gold": "$140",
    "Prestige": "$300"
  },
  "Six Flags Discovery Kingdom": {
    Region: "West",
    company: "Six Flags",
    url: "discoverykingdom",
    "Silver": "$65",
    "Gold": "$79",
    "Prestige": "$145"
  },
  "Six Flags Magic Mountain": {
    Region: "West",
    company: "Six Flags",
    url: "magicmountain",
    "Silver": "$90",
    "Gold": "$115",
    "Prestige": "$250"
  },
  "Six Flags Mexico": {
    Region: "West",
    company: "Six Flags",
    url: "mexico",
    currency: "MXN",
    "Silver": "$1300",
    "Gold": "$1500",
    "Prestige": "$2900"
  },
  "Adventureland": {
    company: "Herschend",
    url: "https://www.adventurelandpark.com",
    passPurchaseUrl: "https://www.adventurelandpark.com/buy-tickets/season-passes/",
    "Bronze": "$110",
    "Silver": "$160",
    "Gold": "$210",
    "Platinum": "$250"
  },
  "Dollywood": {
    company: "Herschend",
    url: "https://www.dollywood.com",
    passPurchaseUrl: "https://www.dollywood.com/tickets/season-passes/",
    "Summer": "$135",
    "Silver": "$170",
    "Gold": "$244",
  },
  "Dutch Wonderland": {
    company: "Herschend",
    url: "https://www.dutchwonderland.com",
    passPurchaseUrl: "https://www.dutchwonderland.com/buy-tickets/season-passes/",
    "Bronze": "$110",
    "Silver": "$130",
    "Gold": "$170",
    "Platinum": "$250"
  },
  "Idlewild": {
    company: "Herschend",
    url: "https://www.idlewild.com",
    passPurchaseUrl: "https://www.idlewild.com/buy-tickets/season-passes/",
    "Bronze": "$100",
    "Silver": "$110",
    "Gold": "$139",
    "Platinum": "$250"
  },
  "Kennywood": {
    company: "Herschend",
    url: "https://www.kennywood.com",
    passPurchaseUrl: "https://www.kennywood.com/buy-tickets/season-passes/",
    "Bronze": "$110",
    "Silver": "$130",
    "Gold": "$170",
    "Platinum": "$250"
  },
  "Kentucky Kingdom": {
    company: "Herschend",
    url: "https://www.kentuckykingdom.com",
    passPurchaseUrl: "https://www.kentuckykingdom.com/tickets/season-passes/",
    "Silver": "$80",
    "Gold": "$100",
    "Diamond": "$150"
  },
  "Lake Compounce": {
    company: "Herschend",
    url: "https://www.lakecompounce.com",
    passPurchaseUrl: "https://www.lakecompounce.com/buy-tickets/season-passes/",
    "Silver": "$140",
    "Gold": "$170",
    "Platinum": "$210"
  },
  "Silver Dollar City": {
    company: "Herschend",
    url: "https://www.silverdollarcity.com",
    passPurchaseUrl: "https://www.silverdollarcity.com/tickets/season-passes/",
    "Silver": "$159",
    "Gold": "$329",
    "Diamond": "$279"
  },
  "Story Land": {
    company: "Herschend",
    url: "https://www.storylandnh.com/",
    passPurchaseUrl: "https://www.storylandnh.com/buy-tickets/season-passes/",
    "Bronze": "$90",
    "Silver": "$100",
    "Gold": "$100",
    "Platinum": "$180"

  },
  "Wild Adventures": {
    company: "Herschend",
    url: "https://www.wildadventures.com",
    passPurchaseUrl: "https://www.wildadventures.com/buy-tickets/season-passes/",
    "Silver": "$107",
    "Gold": "$140",
    "Diamond": "$170"
  }
};