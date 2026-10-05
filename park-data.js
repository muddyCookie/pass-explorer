const parkData = {
  "Six Flags": {
    "Six Flags East": {
      "Cedar Fair": {
        parks: [
          {
            park: "Carowinds & Carolina Harbor",
            parkType: ["Amusement / Theme", "Water"],
            slug: "carowinds",
            state: "North Carolina",
            parkCode: "ca",
            currencySymbol: "$",
            passes: {
              Silver: {
                access: "Carowinds & Carolina Harbor",
              },
              Gold: {
                access: "Six Flags East"
              },
              Prestige: {
                access: SixFlagsPrestigeAccess
              }
            },
            memberships: {
              "Gold Membership": {
                access: "Six Flags East"
              },
              "Prestige Membership": {
                access: SixFlagsPrestigeAccess
              }
            }
          },
          {
            park: "Dorney Park & Wildwater Kingdom",
            parkType: ["Amusement / Theme", "Water"],
            slug: "dorneypark",
            state: "Pennsylvania",
            parkCode: "dp",
            currencySymbol: "$",
            passes: {
              Silver: {
                access: "Dorney Park & Wildwater Kingdom",
              },
              Gold: {
                access: "Six Flags East"
              },
              Prestige: {
                access: SixFlagsPrestigeAccess
              }
            },
            memberships: {
              "Gold Membership": {
                access: "Six Flags East"
              },
              "Prestige Membership": {
                access: SixFlagsPrestigeAccess
              }
            }
          },
          {
            park: "Kings Dominion & Soak City",
            parkType: ["Amusement / Theme", "Water"],
            slug: "kingsdominion",
            state: "Virginia",
            parkCode: "kd",
            currencySymbol: "$",
            passes: {
              Silver: {
                access: "Kings Dominion & Soak City",
              },
              Gold: {
                access: "Six Flags East"
              },
              Prestige: {
                access: SixFlagsPrestigeAccess
              }
            },
            memberships: {
              "Gold Membership": {
                access: "Six Flags East"
              },
              "Prestige Membership": {
                access: SixFlagsPrestigeAccess
              }
            }
          }
        ]
      },

      "Six Flags": {
        parks: [
          {
            park: "Hurricane Harbor New Jersey",
            parkType: ["Water"],
            slug: "greatadventure",
            state: "New Jersey",
            parkCode: "nj",
            currencySymbol: "$",
            passes: {
              Silver: {
                access: "Hurricane Harbor New Jersey",
              },
              Gold: {
                access: "Six Flags East"
              },
              Prestige: {
                access: SixFlagsPrestigeAccess
              }
            },
            memberships: {
              "Gold Membership": {
                access: "Six Flags East"
              },
              "Prestige Membership": {
                access: SixFlagsPrestigeAccess
              }
            }
          },
          {
            park: "Six Flags Great Adventure",
            parkType: ["Amusement / Theme"],
            slug: "greatadventure",
            state: "New Jersey",
            parkCode: "nj",
            currencySymbol: "$",
            passes: {
              Silver: {
                access: "Six Flags Great Adventure",
              },
              Gold: {
                access: "Six Flags East"
              },
              Prestige: {
                access: SixFlagsPrestigeAccess
              }
            },
            memberships: {
              "Gold Membership": {
                access: "Six Flags East"
              },
              "Prestige Membership": {
                access: SixFlagsPrestigeAccess
              }
            }
          },
          {
            park: "Six Flags New England & Hurricane Harbor",
            parkType: ["Amusement / Theme", "Water"],
            slug: "newengland",
            state: "Massachusetts",
            parkCode: "ne",
            currencySymbol: "$",
            passes: {
              Silver: {
                access: "Six Flags New England & Hurricane Harbor",
              },
              Gold: {
                access: "Six Flags East"
              },
              Prestige: {
                access: SixFlagsPrestigeAccess
              }
            },
            memberships: {
              "Gold Membership": {
                access: "Six Flags East"
              },
              "Prestige Membership": {
                access: SixFlagsPrestigeAccess
              },
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
            parkType: ["Amusement / Theme", "Water"],
            slug: "overgeorgia",
            state: "Georgia",
            parkCode: "og",
            currencySymbol: "$",
            passes: {
              Silver: {
                access: "Six Flags Over Georgia & Hurricane Harbor",
              },
              Gold: {
                access: "Six Flags East"
              },
              Prestige: {
                access: SixFlagsPrestigeAccess
              }
            },
            memberships: {
              "Gold Membership": {
                access: "Six Flags East"
              },
              "Prestige Membership": {
                access: SixFlagsPrestigeAccess
              }
            }
          },
          {
            park: "Six Flags White Water",
            parkType: ["Water"],
            slug: "whitewater",
            state: "Georgia",
            parkCode: "ww",
            currencySymbol: "$",
            passes: {
              Silver: {
                access: "Six Flags White Water",
              },
              Gold: {
                access: "Six Flags East"
              },
              Prestige: {
                access: SixFlagsPrestigeAccess
              }
            },
            memberships: {
              "Gold Membership": {
                access: "Six Flags East"
              },
              "Prestige Membership": {
                access: SixFlagsPrestigeAccess
              }
            }
          },
          {
            park: "Six Flags Wild Safari",
            parkType: ["Wildlife"],
            slug: "greatadventure",
            state: "New Jersey",
            parkCode: "nj",
            currencySymbol: "$",
            passes: {
              Silver: {
                access: "Six Flags Wild Safari",
              },
              Gold: {
                access: "Six Flags East"
              },
              Prestige: {
                access: SixFlagsPrestigeAccess
              }
            },
            memberships: {
              "Gold Membership": {
                access: "Six Flags East"
              },
              "Prestige Membership": {
                access: SixFlagsPrestigeAccess
              }
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
            parkType: ["Amusement / Theme", "Water"],
            slug: "canadaswonderland",
            country: "Canada",
            state: "Ontario",
            parkCode: "cw",
            currency: "CAD",
            passes: {
              Silver: {
                access: "Canada's Wonderland & Splash Works",
                noParking: "Canada's Wonderland & Splash Works"
              },
              Gold: {
                access: "Six Flags Midwest",
                noParking: "Canada's Wonderland"
              },
              Prestige: {
                access: SixFlagsPrestigeAccess
              }
            },
            memberships: {
              "Gold Membership": {
                access: "Six Flags Midwest",
                noParking: "Canada's Wonderland"
              },
              "Prestige Membership": {
                access: SixFlagsPrestigeAccess
              }
            }
          },
          {
            park: "Cedar Point",
            parkType: ["Amusement / Theme"],
            slug: "cedarpoint",
            state: "Ohio",
            parkCode: "cp",
            currencySymbol: "$",
            passes: {
              Silver: {
                access: "Cedar Point",
              },
              Gold: {
                access: "Six Flags Midwest",
                noParking: "Canada's Wonderland"
              },
              Prestige: {
                access: SixFlagsPrestigeAccess
              }
            }
          },
          {
            park: "Cedar Point Shores",
            parkType: ["Water"],
            slug: "cedarpoint",
            state: "Ohio",
            parkCode: "cp",
            currencySymbol: "$",
            passes: {
              Gold: {
                access: "Six Flags Midwest",
                noParking: "Canada's Wonderland"
              },
              Prestige: {
                access: SixFlagsPrestigeAccess
              }
            }
          },
          {
            park: "Kings Island & Soak City",
            parkType: ["Amusement / Theme", "Water"],
            slug: "kingsisland",
            state: "Ohio",
            parkCode: "ki",
            currencySymbol: "$",
            passes: {
              Silver: {
                access: "Kings Island & Soak City",
              },
              Gold: {
                access: "Six Flags Midwest",
                noParking: "Canada's Wonderland"
              },
              Prestige: {
                access: SixFlagsPrestigeAccess
              }
            },
            memberships: {
              "Gold Membership": {
                access: "Six Flags Midwest",
                noParking: "Canada's Wonderland"
              },
              "Prestige Membership": {
                access: SixFlagsPrestigeAccess
              }
            }
          }
        ]
      },

      "Six Flags": {
        parks: [
          {
            park: "Hurricane Harbor Chicago",
            parkType: ["Water"],
            slug: "greatamerica",
            state: "Illinois",
            parkCode: "ga",
            currencySymbol: "$",
            passes: {
              Silver: {
                access: "Hurricane Harbor Chicago",
              },
              Gold: {
                access: "Six Flags Midwest",
                noParking: "Canada's Wonderland"
              },
              Prestige: {
                access: SixFlagsPrestigeAccess
              }
            },
            memberships: {
              "Gold Membership": {
                access: "Six Flags Midwest",
                noParking: "Canada's Wonderland"
              },
              "Prestige Membership": {
                access: SixFlagsPrestigeAccess
              }
            }
          },
          {
            park: "Hurricane Harbor Rockford",
            parkType: ["Water"],
            slug: "hurricaneharborrockford",
            state: "Illinois",
            parkCode: "hhr",
            currencySymbol: "$",
            passes: {
              Silver: {
                access: "Hurricane Harbor Rockford",
              },
              Gold: {
                access: "Six Flags Midwest",
                noParking: "Canada's Wonderland"
              },
              Prestige: {
                access: SixFlagsPrestigeAccess
              }
            },
            memberships: {
              "Gold Membership": {
                access: "Six Flags Midwest",
                noParking: "Canada's Wonderland"
              },
              "Prestige Membership": {
                access: SixFlagsPrestigeAccess
              }
            }
          },
          {
            park: "Six Flags Darien Lake & Hurricane Harbor",
            parkType: ["Amusement / Theme", "Water"],
            slug: "darienlake",
            state: "New York",
            parkCode: "dl",
            currencySymbol: "$",
            passes: {
              Silver: {
                access: "Six Flags Darien Lake & Hurricane Harbor",
              },
              Gold: {
                access: "Six Flags Midwest",
                noParking: "Canada's Wonderland"
              },
              Prestige: {
                access: SixFlagsPrestigeAccess
              }
            },
            memberships: {
              "Gold Membership": {
                access: "Six Flags Midwest",
                noParking: "Canada's Wonderland"
              },
              "Prestige Membership": {
                access: SixFlagsPrestigeAccess
              }
            }
          },
          {
            park: "Six Flags Great America",
            parkType: ["Amusement / Theme"],
            slug: "greatamerica",
            state: "Illinois",
            parkCode: "ga",
            currencySymbol: "$",
            passes: {
              Silver: {
                access: "Six Flags Great America",
              },
              Gold: {
                access: "Six Flags Midwest",
                noParking: "Canada's Wonderland"
              },
              Prestige: {
                access: SixFlagsPrestigeAccess
              }
            },
            memberships: {
              "Gold Membership": {
                access: "Six Flags Midwest",
                noParking: "Canada's Wonderland"
              },
              "Prestige Membership": {
                access: SixFlagsPrestigeAccess
              }
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
            parkType: ["Water"],
            slug: "schlitterbahnnewbraunfels",
            state: "Texas",
            parkCode: "nb",
            currencySymbol: "$",
            passes: {
              Silver: {
                access: "Schlitterbahn New Braunfels",
              },
              Gold: {
                access: "Six Flags Texas"
              },
              Prestige: {
                access: SixFlagsPrestigeAccess
              }
            },
            memberships: {
              "Gold Membership": {
                access: "Six Flags Texas"
              },
              "Prestige Membership": {
                access: SixFlagsPrestigeAccess
              }
            }
          }
        ]
      },

      "Six Flags": {
        parks: [
          {
            park: "Frontier City",
            parkType: ["Amusement / Theme"],
            slug: "frontiercity",
            state: "Oklahoma",
            parkCode: "fc",
            currencySymbol: "$",
            passes: {
              Silver: {
                access: "Frontier City",
              },
              Gold: {
                access: "Six Flags Texas",
                priceOverride: "$59.00"
              },
              Prestige: {
                access: SixFlagsPrestigeAccess
              }
            },
            memberships: {
              "Gold Membership": {
                access: "Six Flags Texas"
              },
              "Prestige Membership": {
                access: SixFlagsPrestigeAccess
              }
            }
          },
          {
            park: "Hurricane Harbor Arlington",
            parkType: ["Water"],
            slug: "hurricaneharbortexas",
            state: "Texas",
            parkCode: "ot",
            currencySymbol: "$",
            passes: {
              Silver: {
                access: ["Six Flags Over Texas", "Hurricane Harbor Arlington"]
              },
              Gold: {
                access: "Six Flags Texas"
              },
              Prestige: {
                access: SixFlagsPrestigeAccess
              }
            },
            memberships: {
              "Gold Membership": {
                access: "Six Flags Texas"
              },
              "Prestige Membership": {
                access: SixFlagsPrestigeAccess
              },
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
            parkType: ["Water"],
            slug: "hurricaneharborokc",
            state: "Oklahoma",
            parkCode: "fc",
            currencySymbol: "$",
            passes: {
              Silver: {
                access: "Hurricane Harbor Oklahoma City",
              },
              Gold: {
                access: "Six Flags Texas",
                priceOverride: "$59.00"
              },
              Prestige: {
                access: SixFlagsPrestigeAccess
              }
            },
            memberships: {
              "Gold Membership": {
                access: "Six Flags Texas"
              },
              "Prestige Membership": {
                access: SixFlagsPrestigeAccess
              }
            }
          },
          {
            park: "Hurricane Harbor Splashtown",
            parkType: ["Water"],
            slug: "splashtown",
            state: "Texas",
            parkCode: "hhs",
            currencySymbol: "$",
            passes: {
              Silver: {
                access: "Hurricane Harbor Splashtown",
              },
              Gold: {
                access: "Six Flags Texas"
              },
              Prestige: {
                access: SixFlagsPrestigeAccess
              }
            },
            memberships: {
              "Gold Membership": {
                access: "Six Flags Texas"
              },
              "Prestige Membership": {
                access: SixFlagsPrestigeAccess
              }
            }
          },
          {
            park: "Six Flags Fiesta Texas & Hurricane Harbor",
            parkType: ["Amusement / Theme", "Water"],
            slug: "fiestatexas",
            state: "Texas",
            parkCode: "ft",
            currencySymbol: "$",
            passes: {
              Silver: {
                access: "Six Flags Fiesta Texas & Hurricane Harbor",
              },
              Gold: {
                access: "Six Flags Texas"
              },
              Prestige: {
                access: SixFlagsPrestigeAccess
              }
            },
            memberships: {
              "Gold Membership": {
                access: "Six Flags Texas"
              },
              "Prestige Membership": {
                access: SixFlagsPrestigeAccess
              },
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
            park: "Six Flags Over Texas",
            parkType: ["Amusement / Theme"],
            slug: "overtexas",
            state: "Texas",
            parkCode: "ot",
            currencySymbol: "$",
            passes: {
              Silver: {
                access: ["Six Flags Over Texas", "Hurricane Harbor Arlington"]
              },
              Gold: {
                access: "Six Flags Texas"
              },
              Prestige: {
                access: SixFlagsPrestigeAccess
              }
            },
            memberships: {
              "Gold Membership": {
                access: "Six Flags Texas"
              },
              "Prestige Membership": {
                access: SixFlagsPrestigeAccess
              },
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
            parkType: ["Amusement / Theme", "Water"],
            slug: "cagreatamerica",
            state: "California",
            parkCode: "ga",
            currencySymbol: "$",
            passes: {
              Silver: {
                access: "California's Great America & South Bay Shores",
              },
              Gold: {
                access: ["Six Flags West", "Gilroy Gardens"],
                noParking: ["Gilroy Gardens", "Knott's Berry Farm", "Knott's Soak City"]
              },
              Prestige: {
                access: SixFlagsPrestigeAccess
              }
            },
            memberships: {
              "Gold Membership": {
                access: ["Six Flags West", "Gilroy Gardens"],
                noParking: ["Knott's Berry Farm", "Knott's Soak City"]
              },
              "Prestige Membership": {
                access: SixFlagsPrestigeAccess
              }
            }
          },
          {
            park: "Knott's Berry Farm",
            parkType: ["Amusement / Theme"],
            slug: "knotts",
            state: "California",
            parkCode: "kbf",
            currencySymbol: "$",
            passes: {
              Gold: {
                access: "Six Flags West",
                noParking: ["Knott's Berry Farm", "Knott's Soak City"]
              },
              Prestige: {
                access: SixFlagsPrestigeAccess
              },
              Season: {
                access: "Knott's Berry Farm",
                noParking: ["Knott's Berry Farm"]
              }
            },
            memberships: {
              "Gold Membership": {
                access: "Six Flags West",
                noParking: ["Knott's Berry Farm", "Knott's Soak City"]
              },
              "Prestige Membership": {
                access: SixFlagsPrestigeAccess
              },
              "Regular Membership": {
                access: "Knott's Berry Farm",
                noParking: ["Knott's Berry Farm"]
              }
            }
          },
          {
            park: "Knott's Soak City",
            parkType: ["Water"],
            slug: "knotts",
            state: "California",
            parkCode: "kbf",
            currencySymbol: "$",
            passes: {
              Silver: {
                access: "Knott's Soak City",
              },
              Gold: {
                access: "Six Flags West",
                noParking: ["Knott's Berry Farm", "Knott's Soak City"]
              },
              Prestige: {
                access: SixFlagsPrestigeAccess
              }
            },
            memberships: {
              "Gold Membership": {
                access: "Six Flags West",
                noParking: ["Knott's Berry Farm", "Knott's Soak City"]
              },
              "Prestige Membership": {
                access: SixFlagsPrestigeAccess
              }
            }
          }
        ]
      },

      "Six Flags": {
        parks: [
          {
            park: "Hurricane Harbor Concord",
            parkType: ["Water"],
            slug: "hurricaneharborconcord",
            state: "California",
            parkCode: "hhc",
            currencySymbol: "$",
            passes: {
              Silver: {
                access: "Hurricane Harbor Concord",
              },
              Gold: {
                access: "Six Flags West",
                noParking: ["Knott's Berry Farm", "Knott's Soak City"]
              },
              Prestige: {
                access: SixFlagsPrestigeAccess
              }
            },
            memberships: {
              "Gold Membership": {
                access: "Six Flags West",
                noParking: ["Knott's Berry Farm", "Knott's Soak City"]
              },
              "Prestige Membership": {
                access: SixFlagsPrestigeAccess
              }
            }
          },
          {
            park: "Hurricane Harbor Los Angeles",
            parkType: ["Water"],
            slug: "magicmountain",
            state: "California",
            parkCode: "mm",
            currencySymbol: "$",
            passes: {
              Silver: {
                access: ["Six Flags Magic Mountain","Hurricane Harbor Los Angeles"]
              },
              Gold: {
                access: "Six Flags West",
                noParking: ["Knott's Berry Farm", "Knott's Soak City"]
              },
              Prestige: {
                access: SixFlagsPrestigeAccess
              }
            },
            memberships: {
              "Gold Membership": {
                access: "Six Flags West",
                noParking: ["Knott's Berry Farm", "Knott's Soak City"]
              },
              "Prestige Membership": {
                access: SixFlagsPrestigeAccess
              }
            }
          },
          {
            park: "Hurricane Harbor Oaxtepec",
            parkType: ["Water"],
            slug: "hurricaneharborox",
            country: "Mexico",
            state: "Morelos",
            parkCode: "hhox",
            currency: "MXN",
            passes: {
              Silver: {
                access: ["Hurricane Harbor Oaxtepec", "Six Flags Mexico"],
                noParking: ["Hurricane Harbor Oaxtepec", "Six Flags Mexico"]
              },
              Gold: {
                access: "Six Flags West",
                noParking: ["Knott's Berry Farm", "Knott's Soak City"]
              },
              Prestige: {
                access: SixFlagsPrestigeAccess
              }
            },
            memberships: {
              "Gold Membership": {
                access: "Six Flags West",
                noParking: ["Knott's Berry Farm", "Knott's Soak City"]
              },
              "Prestige Membership": {
                access: SixFlagsPrestigeAccess
              }
            }
          },
          {
            park: "Hurricane Harbor Phoenix",
            parkType: ["Water"],
            slug: "phoenix",
            state: "Arizona",
            parkCode: "hhpx",
            currencySymbol: "$",
            passes: {
              Silver: {
                access: "Hurricane Harbor Phoenix",
              },
              Gold: {
                access: "Six Flags West",
                noParking: ["Knott's Berry Farm", "Knott's Soak City"]
              },
              Prestige: {
                access: SixFlagsPrestigeAccess
              }
            },
            memberships: {
              "Gold Membership": {
                access: "Six Flags West",
                noParking: ["Knott's Berry Farm", "Knott's Soak City"]
              },
              "Prestige Membership": {
                access: SixFlagsPrestigeAccess
              }
            }
          },
          {
            park: "Six Flags Discovery Kingdom",
            parkType: ["Amusement / Theme", "Wildlife"],
            slug: "discoverykingdom",
            state: "California",
            parkCode: "dk",
            currencySymbol: "$",
            passes: {
              Silver: {
                access: "Six Flags Discovery Kingdom",
              },
              Gold: {
                access: "Six Flags West",
                noParking: ["Knott's Berry Farm", "Knott's Soak City"]
              },
              Prestige: {
                access: SixFlagsPrestigeAccess
              }
            },
            memberships: {
              "Gold Membership": {
                access: "Six Flags West",
                noParking: ["Knott's Berry Farm", "Knott's Soak City"]
              },
              "Prestige Membership": {
                access: SixFlagsPrestigeAccess
              }
            }
          },
          {
            park: "Six Flags Magic Mountain",
            parkType: ["Amusement / Theme"],
            slug: "magicmountain",
            state: "California",
            parkCode: "mm",
            currencySymbol: "$",
            passes: {
              Silver: {
                access: ["Six Flags Magic Mountain", "Hurricane Harbor Los Angeles"]
              },
              Gold: {
                access: "Six Flags West",
                noParking: ["Knott's Berry Farm", "Knott's Soak City"]
              },
              Prestige: {
                access: SixFlagsPrestigeAccess
              }
            }
          },
          {
            park: "Six Flags Mexico",
            parkType: ["Amusement / Theme"],
            slug: "mexico",
            country: "Mexico",
            state: "Mexico City",
            parkCode: "cdmx",
            currency: "MXN",
            passes: {
              Silver: {
                access: ["Six Flags Mexico", "Hurricane Harbor Oaxtepec"],
                noParking: ["Six Flags Mexico", "Hurricane Harbor Oaxtepec"]
              },
              Gold: {
                access: "Six Flags West",
                noParking: ["Knott's Berry Farm", "Knott's Soak City"]
              },
              Prestige: {
                access: SixFlagsPrestigeAccess
              }
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
