// Starter Six Flags catalog.
// Add parks and pass pricing here as you rebuild the site.

const SixFlagsPrestigeAccess = [
  "Six Flags East",
  "Six Flags Midwest",
  "Six Flags Texas",
  "Six Flags West"
];

const parkCatalog = {
  "Six Flags": {
    "Six Flags West": [
      {
        park: "California's Great America",
        slug: "cagreatamerica",
        parkCode: "ga",
        state: "California",
        passes: {
          Gold: {
            access: "Six Flags West",
            noParking: "Knott's Berry Farm"
          },
          Prestige: {
            access: SixFlagsPrestigeAccess,
          }
        }
      }
    ],
    "Six Flags Midwest": [],
    "Six Flags East": [],
    "Six Flags Texas": []
  }
};
