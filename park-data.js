const SixFlagsPrestigeAccess = [
  "Six Flags East",
  "Six Flags Midwest",
  "Six Flags Texas",
  "Six Flags West"
];

const parkData = {
  "Six Flags": {
    "Six Flags East": {
      "Cedar Fair": {
        parks: [
          {
            park: "Carowinds & Carolina Harbor",
            slug: "carowinds",
            state: "North Carolina",
            parkCode: "ca",
            currencySymbol: "$",
            passes: {
              Gold: { access: "Six Flags East" },
              Prestige: { access: SixFlagsPrestigeAccess }
            },
            memberships: {
              "Gold Membership": { access: "Six Flags East" },
              "Prestige Membership": { access: SixFlagsPrestigeAccess }
            }
          },
          {
            park: "Dorney Park & Wildwater Kingdom",
            slug: "dorneypark",
            state: "Pennsylvania",
            parkCode: "dp",
            currencySymbol: "$",
            passes: {
              Gold: { access: "Six Flags East" },
              Prestige: { access: SixFlagsPrestigeAccess }
            },
            memberships: {
              "Gold Membership": { access: "Six Flags East" },
              "Prestige Membership": { access: SixFlagsPrestigeAccess }
            }
          },
          {
            park: "Kings Dominion & Soak City",
            slug: "kingsdominion",
            state: "Virginia",
            parkCode: "kd",
            currencySymbol: "$",
            passes: {
              Gold: { access: "Six Flags East" },
              Prestige: { access: SixFlagsPrestigeAccess }
            },
            memberships: {
              "Gold Membership": { access: "Six Flags East" },
              "Prestige Membership": { access: SixFlagsPrestigeAccess }
            }
          }
        ]
      },
      "Six Flags": {
        parks: [
          {
            park: "Six Flags Great Adventure",
            slug: "greatadventure",
            state: "New Jersey",
            parkCode: "nj",
            currencySymbol: "$",
            passes: {
              Gold: { access: "Six Flags East" },
              Prestige: { access: SixFlagsPrestigeAccess }
            },
            memberships: {
              "Gold Membership": { access: "Six Flags East" },
              "Prestige Membership": { access: SixFlagsPrestigeAccess }
            }
          },
          {
            park: "Hurricane Harbor New Jersey",
            slug: "greatadventure",
            state: "New Jersey",
            parkCode: "nj",
            currencySymbol: "$",
            passes: {
              Gold: { access: "Six Flags East" },
              Prestige: { access: SixFlagsPrestigeAccess }
            },
            memberships: {
              "Gold Membership": { access: "Six Flags East" },
              "Prestige Membership": { access: SixFlagsPrestigeAccess }
            }
          },
          {
            park: "Six Flags New England & Hurricane Harbor",
            slug: "newengland",
            state: "Massachusetts",
            parkCode: "ne",
            currencySymbol: "$",
            passes: {
              Gold: { access: "Six Flags East" },
              Prestige: { access: SixFlagsPrestigeAccess }
            },
            memberships: {
              "Gold Membership": { access: "Six Flags East" },
              "Prestige Membership": { access: SixFlagsPrestigeAccess },
              "Gold Membership (No Initiation Fee)": {
                access: "Six Flags East",
                noInitiationFee: true
              },
              "Prestige Membership (No Initiation Fee)": {
                access: SixFlagsPrestigeAccess,
                noInitiationFee: true
              }
            }
          },
          {
            park: "Six Flags Over Georgia & Hurricane Harbor",
            slug: "overgeorgia",
            state: "Georgia",
            parkCode: "og",
            currencySymbol: "$",
            passes: {
              Gold: { access: "Six Flags East" },
              Prestige: { access: SixFlagsPrestigeAccess }
            },
            memberships: {
              "Gold Membership": { access: "Six Flags East" },
              "Prestige Membership": { access: SixFlagsPrestigeAccess }
            }
          },
          {
            park: "Six Flags White Water",
            slug: "whitewater",
            state: "Georgia",
            parkCode: "ww",
            currencySymbol: "$",
            passes: {
              Gold: { access: "Six Flags East" },
              Prestige: { access: SixFlagsPrestigeAccess }
            },
            memberships: {
              "Gold Membership": { access: "Six Flags East" },
              "Prestige Membership": { access: SixFlagsPrestigeAccess }
            }
          },
          {
            park: "Wild Safari",
            slug: "greatadventure",
            state: "New Jersey",
            parkCode: "nj",
            currencySymbol: "$",
            passes: {
              Gold: { access: "Six Flags East" },
              Prestige: { access: SixFlagsPrestigeAccess }
            },
            memberships: {
              "Gold Membership": { access: "Six Flags East" },
              "Prestige Membership": { access: SixFlagsPrestigeAccess }
            }
          }
        ]
      }
    },
    "Six Flags Midwest": {
      "Cedar Fair": {
        parks: [
          {
            park: "Canada's Wonderland & Splash Works",
            slug: "canadaswonderland",
            country: "Canada",
            state: "Ontario",
            parkCode: "cw",
            currency: "CAD",
            passes: {
              Gold: {
                access: "Six Flags Midwest",
                noParking: "Canada's Wonderland"
              },
              Prestige: { access: SixFlagsPrestigeAccess }
            },
            memberships: {
              "Gold Membership": { 
                access: "Six Flags Midwest", 
                noParking: "Canada's Wonderland" 
              },
              "Prestige Membership": { access: SixFlagsPrestigeAccess }
            }
          },
          {
            park: "Cedar Point",
            slug: "cedarpoint",
            state: "Ohio",
            parkCode: "cp",
            currencySymbol: "$",
            passes: {
              Gold: { 
                access: "Six Flags Midwest",
                noParking: "Canada's Wonderland"
              },
              Prestige: { access: SixFlagsPrestigeAccess }
            }
          },
          {
            park: "Cedar Point Shores",
            slug: "cedarpoint",
            state: "Ohio",
            parkCode: "cp",
            currencySymbol: "$",
            passes: {
              Gold: { 
                access: "Six Flags Midwest" ,
                noParking: "Canada's Wonderland"
              },
              Prestige: { access: SixFlagsPrestigeAccess }
            }
          },
          {
            park: "Kings Island & Soak City",
            slug: "kingsisland",
            state: "Ohio",
            parkCode: "ki",
            currencySymbol: "$",
            passes: {
              Gold: { 
                access: "Six Flags Midwest",
                noParking: "Canada's Wonderland"
              },
              Prestige: { access: SixFlagsPrestigeAccess }
            },
            memberships: {
              "Gold Membership": { 
                access: "Six Flags Midwest",
                noParking: "Canada's Wonderland"
              },
              "Prestige Membership": { access: SixFlagsPrestigeAccess }
            }
          }
        ]
      },
      "Six Flags": {
        parks: [
          {
            park: "Six Flags Darien Lake & Hurricane Harbor",
            slug: "darienlake",
            state: "New York",
            parkCode: "dl",
            currencySymbol: "$",
            passes: {
              Gold: { 
                access: "Six Flags Midwest", 
                noParking: "Canada's Wonderland"
              },
              Prestige: { access: SixFlagsPrestigeAccess }
            },
            memberships: {
              "Gold Membership": { 
                access: "Six Flags Midwest",
                noParking: "Canada's Wonderland" 
              },
              "Prestige Membership": { access: SixFlagsPrestigeAccess }
            }
          },
          {
            park: "Six Flags Great America",
            slug: "greatamerica",
            state: "Illinois",
            parkCode: "ga",
            currencySymbol: "$",
            passes: {
              Gold: { 
                access: "Six Flags Midwest",
                noParking: "Canada's Wonderland"
              },
              Prestige: { access: SixFlagsPrestigeAccess }
            },
            memberships: {
              "Gold Membership": { 
                access: "Six Flags Midwest",
                noParking: "Canada's Wonderland" 
              },
              "Prestige Membership": { access: SixFlagsPrestigeAccess }
            }
          },
          {
            park: "Hurricane Harbor Chicago",
            slug: "greatamerica",
            state: "Illinois",
            parkCode: "ga",
            currencySymbol: "$",
            passes: {
              Gold: { 
                access: "Six Flags Midwest",
                noParking: "Canada's Wonderland"
              },
              Prestige: { access: SixFlagsPrestigeAccess }
            },
            memberships: {
              "Gold Membership": { 
                access: "Six Flags Midwest", 
                noParking: "Canada's Wonderland"
              },
              "Prestige Membership": { access: SixFlagsPrestigeAccess }
            }
          },
          {
            park: "Hurricane Harbor Rockford",
            slug: "hurricaneharborrockford",
            state: "Illinois",
            parkCode: "hhr",
            currencySymbol: "$",
            passes: {
              Gold: { 
                access: "Six Flags Midwest", 
                noParking: "Canada's Wonderland"
              },
              Prestige: { access: SixFlagsPrestigeAccess }
            },
            memberships: {
              "Gold Membership": { 
                access: "Six Flags Midwest", 
                noParking: "Canada's Wonderland"
              },
              "Prestige Membership": { access: SixFlagsPrestigeAccess }
            }
          }
        ]
      }
    },
    "Six Flags Texas": {
      "Cedar Fair": {
        parks: [
          {
            park: "Schlitterbahn New Braunfels",
            slug: "schlitterbahnnewbraunfels",
            state: "Texas",
            parkCode: "nb",
            currencySymbol: "$",
            passes: {
              Gold: { access: "Six Flags Texas" },
              Prestige: { access: SixFlagsPrestigeAccess }
            },
            memberships: {
              "Gold Membership": { access: "Six Flags Texas" },
              "Prestige Membership": { access: SixFlagsPrestigeAccess }
            }
          }
        ]
      },
      "Six Flags": {
        parks: [
          {
            park: "Frontier City",
            slug: "frontiercity",
            state: "Oklahoma",
            parkCode: "fc",
            currencySymbol: "$",
            passes: {
              Gold: { access: "Six Flags Texas", priceOverride: "$59.00" },
              Prestige: { access: SixFlagsPrestigeAccess }
            },
            memberships: {
              "Gold Membership": { access: "Six Flags Texas" },
              "Prestige Membership": { access: SixFlagsPrestigeAccess }
            }
          },
          {
            park: "Six Flags Fiesta Texas & Hurricane Harbor",
            slug: "fiestatexas",
            state: "Texas",
            parkCode: "ft",
            currencySymbol: "$",
            passes: {
              Gold: { access: "Six Flags Texas" },
              Prestige: { access: SixFlagsPrestigeAccess }
            },
            memberships: {
              "Gold Membership": { access: "Six Flags Texas" },
              "Prestige Membership": { access: SixFlagsPrestigeAccess },
              "Gold Membership (No Initiation Fee)": {
                access: "Six Flags Texas",
                noInitiationFee: true
              },
              "Prestige Membership (No Initiation Fee)": {
                access: SixFlagsPrestigeAccess,
                noInitiationFee: true
              }
            }
          },
          {
            park: "Hurricane Harbor Arlington",
            slug: "hurricaneharbortexas",
            state: "Texas",
            parkCode: "ot",
            currencySymbol: "$",
            passes: {
              Gold: { access: "Six Flags Texas" },
              Prestige: { access: SixFlagsPrestigeAccess }
            },
            memberships: {
              "Gold Membership": { access: "Six Flags Texas" },
              "Prestige Membership": { access: SixFlagsPrestigeAccess },
              "Gold Membership (No Initiation Fee)": {
                access: "Six Flags Texas",
                noInitiationFee: true
              },
              "Prestige Membership (No Initiation Fee)": {
                access: SixFlagsPrestigeAccess,
                noInitiationFee: true
              }
            }
          },
          {
            park: "Hurricane Harbor Oklahoma City",
            slug: "hurricaneharborokc",
            state: "Oklahoma",
            parkCode: "fc",
            currencySymbol: "$",
            passes: {
              Gold: { access: "Six Flags Texas", priceOverride: "$59.00" },
              Prestige: { access: SixFlagsPrestigeAccess }
            },
            memberships: {
              "Gold Membership": { access: "Six Flags Texas" },
              "Prestige Membership": { access: SixFlagsPrestigeAccess }
            }
          },
          {
            park: "Hurricane Harbor Splashtown",
            slug: "splashtown",
            state: "Texas",
            parkCode: "hhs",
            currencySymbol: "$",
            passes: {
              Gold: { access: "Six Flags Texas" },
              Prestige: { access: SixFlagsPrestigeAccess }
            },
            memberships: {
              "Gold Membership": { access: "Six Flags Texas" },
              "Prestige Membership": { access: SixFlagsPrestigeAccess }
            }
          },
          {
            park: "Six Flags Over Texas",
            slug: "overtexas",
            state: "Texas",
            parkCode: "ot",
            currencySymbol: "$",
            passes: {
              Gold: { access: "Six Flags Texas" },
              Prestige: { access: SixFlagsPrestigeAccess }
            },
            memberships: {
              "Gold Membership": { access: "Six Flags Texas" },
              "Prestige Membership": { access: SixFlagsPrestigeAccess },
              "Gold Membership (No Initiation Fee)": {
                access: "Six Flags Texas",
                noInitiationFee: true
              },
              "Prestige Membership (No Initiation Fee)": {
                access: SixFlagsPrestigeAccess,
                noInitiationFee: true
              }
            }
          }
        ]
      }
    },
    "Six Flags West": {
      "Cedar Fair": {
        parks: [
          {
            park: "California's Great America & South Bay Shores",
            slug: "cagreatamerica",
            state: "California",
            parkCode: "ga",
            currencySymbol: "$",
            passes: {
              Gold: { 
                access: ["Six Flags West", "Gilroy Gardens"], 
                noParking: ["Gilroy Gardens", "Knott's Berry Farm", "Knott's Soak City"]
              },
              Prestige: { access: SixFlagsPrestigeAccess }
            },
            memberships: {
              "Gold Membership": { 
                access: "Six Flags West",
                noParking: ["Knott's Berry Farm", "Knott's Soak City"] 
              },
              "Prestige Membership": { access: SixFlagsPrestigeAccess }
            }
          },
          {
            park: "Knott's Berry Farm",
            slug: "knotts",
            state: "California",
            parkCode: "kbf",
            currencySymbol: "$",
            passes: {
              Gold: { 
                access: "Six Flags West", 
                noParking: ["Knott's Berry Farm", "Knott's Soak City"]
              },
              Prestige: { access: SixFlagsPrestigeAccess }
            },
            memberships: {
              "Gold Membership": { 
                access: "Six Flags West", 
                noParking: ["Knott's Berry Farm", "Knott's Soak City"]
              },
              "Prestige Membership": { access: SixFlagsPrestigeAccess }
            }
          },
          {
            park: "Knott's Soak City",
            slug: "knotts",
            state: "California",
            parkCode: "kbf",
            currencySymbol: "$",
            passes: {
              Gold: { 
                access: "Six Flags West",
                noParking: ["Knott's Berry Farm", "Knott's Soak City"] 
              },
              Prestige: { access: SixFlagsPrestigeAccess }
            },
            memberships: {
              "Gold Membership": { 
                access: "Six Flags West",
                noParking: ["Knott's Berry Farm", "Knott's Soak City"] 
              },
              "Prestige Membership": { access: SixFlagsPrestigeAccess }
            }
          }
        ]
      },
      "Six Flags": {
        parks: [
          {
            park: "Six Flags Discovery Kingdom",
            slug: "sixflagsdiscoverykingdom",
            state: "California",
            parkCode: "dk",
            currencySymbol: "$",
            passes: {
              Gold: { 
                access: "Six Flags West",
                noParking: ["Knott's Berry Farm", "Knott's Soak City"]
              },
              Prestige: { access: SixFlagsPrestigeAccess }
            },
            memberships: {
              "Gold Membership": { 
                access: "Six Flags West",
                noParking: ["Knott's Berry Farm", "Knott's Soak City"]
              },
              "Prestige Membership": { access: SixFlagsPrestigeAccess }
            }
          },
          {
            park: "Hurricane Harbor Concord",
            slug: "hurricaneharborconcord",
            state: "California",
            parkCode: "hhc",
            currencySymbol: "$",
            passes: {
              Gold: { 
                access: "Six Flags West",
                noParking: ["Knott's Berry Farm", "Knott's Soak City"]
              },
              Prestige: { access: SixFlagsPrestigeAccess }
            },
            memberships: {
              "Gold Membership": { 
                access: "Six Flags West", 
                noParking: ["Knott's Berry Farm", "Knott's Soak City"]
              },
              "Prestige Membership": { access: SixFlagsPrestigeAccess }
            }
          },
          {
            park: "Hurricane Harbor Los Angeles",
            slug: "magicmountain",
            state: "California",
            parkCode: "mm",
            currencySymbol: "$",
            passes: {
              Gold: { 
                access: "Six Flags West",
                noParking: ["Knott's Berry Farm", "Knott's Soak City"]
              },
              Prestige: { access: SixFlagsPrestigeAccess }
            },
            memberships: {
              "Gold Membership": { 
                access: "Six Flags West",
                noParking: ["Knott's Berry Farm", "Knott's Soak City"]
              },
              "Prestige Membership": { access: SixFlagsPrestigeAccess }
            }
          },
          {
            park: "Hurricane Harbor Oaxtepec",
            slug: "hurricaneharborox",
            country: "Mexico",
            state: "Morelos",
            parkCode: "hhox",
            currency: "MXN",
            passes: {
              Gold: { 
                access: "Six Flags West",
                noParking: ["Knott's Berry Farm", "Knott's Soak City"]
              },
              Prestige: { access: SixFlagsPrestigeAccess }
            },
            memberships: {
              "Gold Membership": { 
                access: "Six Flags West",
                noParking: ["Knott's Berry Farm", "Knott's Soak City"]
              },
              "Prestige Membership": { access: SixFlagsPrestigeAccess }
            }
          },
          {
            park: "Hurricane Harbor Phoenix",
            slug: "phoenix",
            state: "Arizona",
            parkCode: "hhpx",
            currencySymbol: "$",
            passes: {
              Gold: { 
                access: "Six Flags West",
                noParking: ["Knott's Berry Farm", "Knott's Soak City"]
              },
              Prestige: { access: SixFlagsPrestigeAccess }
            },
            memberships: {
              "Gold Membership": { 
                access: "Six Flags West", 
                noParking: ["Knott's Berry Farm", "Knott's Soak City"]
              },
              "Prestige Membership": { access: SixFlagsPrestigeAccess }
            }
          },
          {
            park: "Six Flags Magic Mountain",
            slug: "sixflagsmagicmountain",
            state: "California",
            parkCode: "mm",
            currencySymbol: "$",
            passes: {
              Gold: { 
                access: "Six Flags West", 
                noParking: ["Knott's Berry Farm", "Knott's Soak City"]
              },
              Prestige: { access: SixFlagsPrestigeAccess }
            },
            memberships: {
              "Gold Membership": { 
                access: "Six Flags West",
                noParking: ["Knott's Berry Farm", "Knott's Soak City"]
              },
              "Prestige Membership": { access: SixFlagsPrestigeAccess }
            }
          },
          {
            park: "Six Flags Mexico",
            slug: "sixflagsmexico",
            country: "Mexico",
            state: "Mexico City",
            parkCode: "cdmx",
            currency: "MXN",
            passes: {
              Gold: { 
                access: "Six Flags West",
                noParking: ["Knott's Berry Farm", "Knott's Soak City"]
              },
              Prestige: { access: SixFlagsPrestigeAccess }
            },
            memberships: {
              "Gold Membership": { 
                access: "Six Flags West",
                noParking: ["Knott's Berry Farm", "Knott's Soak City"]
              },
              "Prestige Membership": { access: SixFlagsPrestigeAccess }
            }
          }
        ]
      }
    }
  }
};

for (const companyConfig of Object.values(parkData)) {
  for (const regionConfig of Object.values(companyConfig || {})) {
    for (const portalConfig of Object.values(regionConfig || {})) {
      portalConfig.parks?.sort((left, right) => left.park.localeCompare(right.park));
    }
  }
}
