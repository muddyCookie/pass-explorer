const sixFlagsPassPathByParkName = {
  "La Ronde": "passeports"
};

const defaultCompany = "Six Flags";
const companyOrder = [defaultCompany, "Herschend"];
const regionOrder = ["East", "Midwest", "Texas", "West"];

const companyConfig = {
  [defaultCompany]: {
    usesRegionFilter: true,
    tierOrder: ["Bronze", "Silver", "Gold", "Platinum", "Prestige"],
    passFieldByType: {
      Silver: "Silver",
      Gold: "Gold",
      Prestige: "Prestige"
    },
    defaultAccessibleByTier: {
      Silver: (homePark) => [homePark],
      Gold: (homePark) => [parkRegionByName[homePark] || homePark],
      Prestige: () => ["All Parks"]
    }
  },
  Herschend: {
    usesRegionFilter: false,
    tierOrder: ["Bronze", "Silver", "Gold", "Platinum", "Prestige"],
    passFieldByType: {
      Bronze: "Bronze",
      Silver: "Silver",
      Gold: "Gold",
      Platinum: "Platinum"
    },
    defaultAccessibleByTier: {
      Bronze: (homePark) => [homePark],
      Silver: (homePark) => [homePark],
      Gold: (homePark) => [homePark],
      Platinum: (homePark) => [homePark]
    }
  }
};

const parkingRulesByCompany = {
  [defaultCompany]: {
    homePrestigeOnlyParkingParks: new Set(["Canada's Wonderland", "La Ronde"]),
    prestigeOnlyParkingParks: new Set(["Knott's Berry Farm"]),
    homeOnlyPassTypes: new Set(["Silver"])
  },
  Herschend: {
    homePrestigeOnlyParkingParks: new Set(),
    prestigeOnlyParkingParks: new Set(),
    homeOnlyPassTypes: new Set()
  }
};
