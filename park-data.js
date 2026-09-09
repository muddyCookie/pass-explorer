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
            park: "Carowinds",
            slug: "carowinds",
            state: "North Carolina",
            parkCode: "ca",
            currencySymbol: "$",
            passes: {
              Gold: {
                access: "Six Flags East",
                  source: {
                    packageNamePattern: "^\\d{4} Gold Pass$",
                    target: "price",
                    jsonPaths: ["CT[name=Regular - New].retail_amount"]
                  }
                },
                Prestige: {
                  access: SixFlagsPrestigeAccess,
                  source: {
                    packageNamePattern: "^\\d{4} Prestige Pass$",
                    target: "price",
                    jsonPaths: ["CT[name=Regular - New].retail_amount"]
                  }   
                }
              }, 
            memberships: {
              "Gold Membership": {
                access: "Six Flags East",
                source: {
                  packageNamePattern: "^Gold Membership$",
                  target: "pricing.monthly",
                  jsonPaths: ["CT.retail_amount"],
                  downPaymentJsonPaths: [
                    "CT.PAYMENT_SCHEDULE.SP.fee_amount",
                    "CT.fee_total"
                  ],
                  minMonthsJsonPaths: [
                    "CT.PAYMENT_SCHEDULE.required_num_payments"
                  ]
                }
              },
              "Prestige Membership": {
                access: SixFlagsPrestigeAccess,
                source: {
                  seasonPassType: "PM",
                  target: "pricing.monthly",
                  jsonPaths: ["CT.retail_amount"],
                  downPaymentJsonPaths: [
                    "CT.PAYMENT_SCHEDULE.SP.fee_amount",
                    "CT.fee_total"
                  ],
                  minMonthsJsonPaths: [
                    "CT.PAYMENT_SCHEDULE.required_num_payments"
                  ]
                }
              }
            }
          },
          {
            park: "Dorney Park",
            slug: "dorneypark",
            state: "Pennsylvania",
            parkCode: "dp",
            currencySymbol: "$",
            passes: {
                Gold: {
                access: "Six Flags East",
                source: {
                    packageNamePattern: "^\\d{4} Gold Pass$",
                    target: "price",
                    jsonPaths: ["CT[name=Regular - New].retail_amount"]
                }
                },
                Prestige: {
                access: SixFlagsPrestigeAccess,
                source: {
                    packageNamePattern: "^\\d{4} Prestige Pass$",
                    target: "price",
                    jsonPaths: ["CT[name=Regular - New].retail_amount"]
                }
                }
            }
          },
          {
            park: "Kings Dominion",
            slug: "kingsdominion",
            state: "Virginia",
            parkCode: "kd",
            currencySymbol: "$",
            passes: {
              Gold: {
                access: "Six Flags East",
                source: {
                  packageNamePattern: "^\\d{4} Gold Pass$",
                  target: "price",
                  jsonPaths: ["CT[name=Regular - New].retail_amount"]
                }
              },
              Prestige: {
                access: SixFlagsPrestigeAccess,
                source: {
                  packageNamePattern: "^\\d{4} Prestige Pass$",
                  target: "price",
                  jsonPaths: ["CT[name=Regular - New].retail_amount"]
                }
              }
            }
          }
        ]
      },
      "Six Flags": {
        parks: [
          {
            park: "Six Flags Great Adventure",
            slug: "sixflagsgreatadventure",
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
            park: "Six Flags Hurricane Harbor New Jersey",
            slug: "sixflagshurricaneharbornewjersey",
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
            park: "Six Flags New England",
            slug: "sixflagsnewengland",
            state: "Massachusetts",
            parkCode: "ne",
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
            park: "Six Flags Over Georgia",
            slug: "sixflagsovergeorgia",
            state: "Georgia",
            parkCode: "og",
            currencySymbol: "$",
            passes: {
              Gold: {
                access: "Six Flags East",
                source: {
                  packageNamePattern: "^\\d{4} Gold Pass$",
                  target: "price",
                  jsonPaths: ["CT[name=Season Pass - New].retail_amount"]
                }
              },
              Prestige: {
                access: SixFlagsPrestigeAccess,
                source: {
                  packageNamePattern: "^\\d{4} Prestige Pass$",
                  target: "price",
                  jsonPaths: ["CT[name=Season Pass - New].retail_amount"]
                }
              }
            }
          },
          {
            park: "Six Flags White Water",
            slug: "sixflagswhitewater",
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
            park: "Six Flags Wild Safari",
            slug: "sixflagswildsafari",
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
            park: "Canada's Wonderland",
            slug: "canadaswonderland",
            state: "Ontario",
            parkCode: "cw",
            currencySymbol: "$",
            passes: {
              Gold: {
                access: "Six Flags Midwest",
                noParking: "Canada's Wonderland",
                source: {
                  packageNamePattern: "^\\d{4} Gold Pass$",
                  target: "price",
                  jsonPaths: ["CT[name=Regular - New].retail_amount"]
                }
              },
              Prestige: {
                access: SixFlagsPrestigeAccess,
                source: {
                  packageNamePattern: "^\\d{4} Prestige Pass$",
                  target: "price",
                  jsonPaths: ["CT[name=Regular - New].retail_amount"]
                }
              }
            },
            memberships: {
              "Gold Membership": {
                source: {
                  seasonPassType: "MGE",
                  target: "pricing.monthly",
                  jsonPaths: ["CT.retail_amount"],
                  downPaymentJsonPaths: ["CT.PAYMENT_SCHEDULE.SP.fee_amount", "CT.fee_total"],
                  minMonthsJsonPaths: ["CT.PAYMENT_SCHEDULE.required_num_payments"]
                }
              },
              "Prestige Membership": {
                source: {
                  seasonPassType: "PM",
                  target: "pricing.monthly",
                  jsonPaths: ["CT.retail_amount"],
                  downPaymentJsonPaths: ["CT.PAYMENT_SCHEDULE.SP.fee_amount", "CT.fee_total"],
                  minMonthsJsonPaths: ["CT.PAYMENT_SCHEDULE.required_num_payments"]
                }
              }
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
                source: {
                  packageNamePattern: "^\\d{4} Gold Pass$",
                  target: "price",
                  jsonPaths: ["CT[name=Regular - New].retail_amount"]
                }
              },
              Prestige: {
                access: SixFlagsPrestigeAccess,
                source: {
                  packageNamePattern: "^\\d{4} Prestige Pass$",
                  target: "price",
                  jsonPaths: ["CT[name=Regular - New].retail_amount"]
                }
              }
            }
          },
          {
            park: "Cedar Point Shores",
            slug: "cedarpointshores",
            state: "Ohio",
            parkCode: "cp",
            currencySymbol: "$",
            passes: {
              Gold: { access: "Six Flags Midwest" },
              Prestige: { access: SixFlagsPrestigeAccess }
            },
            memberships: {
              "Gold Membership": { access: "Six Flags Midwest" },
              "Prestige Membership": { access: SixFlagsPrestigeAccess }
            }
          },
          {
            park: "Kings Island",
            slug: "kingsisland",
            state: "Ohio",
            parkCode: "ki",
            currencySymbol: "$",
            passes: {
              Gold: { access: "Six Flags Midwest" },
              Prestige: { access: SixFlagsPrestigeAccess }
            },
            memberships: {
              "Gold Membership": {
                source: {
                  seasonPassType: "GM",
                  target: "pricing.monthly",
                  jsonPaths: ["CT.retail_amount"],
                  downPaymentJsonPaths: ["CT.PAYMENT_SCHEDULE.SP.fee_amount", "CT.fee_total"],
                  minMonthsJsonPaths: ["CT.PAYMENT_SCHEDULE.required_num_payments"]
                }
              },
              "Prestige Membership": {
                source: {
                  seasonPassType: "PM",
                  target: "pricing.monthly",
                  jsonPaths: ["CT.retail_amount"],
                  downPaymentJsonPaths: ["CT.PAYMENT_SCHEDULE.SP.fee_amount", "CT.fee_total"],
                  minMonthsJsonPaths: ["CT.PAYMENT_SCHEDULE.required_num_payments"]
                }
              }
            }
          }
        ]
      },
      "Six Flags": {
        parks: [
          {
            park: "Six Flags Darien Lake",
            slug: "darienlake",
            state: "New York",
            parkCode: "dl",
            currencySymbol: "$",
            passes: {
              Gold: {
                access: "Six Flags Midwest",
                source: {
                  packageNamePattern: "^\\d{4} Gold Pass$",
                  target: "price",
                  jsonPaths: ["CT[name=Season Pass - New].retail_amount"]
                }
              },
              Prestige: {
                access: SixFlagsPrestigeAccess,
                source: {
                  packageNamePattern: "^\\d{4} Prestige Pass$",
                  target: "price",
                  jsonPaths: ["CT[name=Season Pass - New].retail_amount"]
                }
              }
            }
          },
          {
            park: "Six Flags Great America",
            slug: "sixflagsgreatamerica",
            state: "Illinois",
            parkCode: "ga",
            currencySymbol: "$",
            passes: {
              Gold: {
                access: "Six Flags Midwest",
                source: {
                  packageNamePattern: "^\\d{4} Gold Pass$",
                  target: "price",
                  jsonPaths: ["CT[name=Season Pass - New].retail_amount"]
                }
              },
              Prestige: {
                access: SixFlagsPrestigeAccess,
                source: {
                  packageNamePattern: "^\\d{4} Prestige Pass$",
                  target: "price",
                  jsonPaths: ["CT[name=Season Pass - New].retail_amount"]
                }
              }
            }
          },
          {
            park: "Six Flags Hurricane Harbor Chicago",
            slug: "sixflagshurricaneharborchicago",
            state: "Illinois",
            parkCode: "ga",
            currencySymbol: "$",
            passes: {
              Gold: { access: "Six Flags Midwest" },
              Prestige: { access: SixFlagsPrestigeAccess }
            },
            memberships: {
              "Gold Membership": { access: "Six Flags Midwest" },
              "Prestige Membership": { access: SixFlagsPrestigeAccess }
            }
          },
          {
            park: "Six Flags Hurricane Harbor Rockford",
            slug: "sixflagshurricaneharborrockford",
            state: "Illinois",
            parkCode: "hhr",
            currencySymbol: "$",
            passes: {
              Gold: { access: "Six Flags Midwest" },
              Prestige: { access: SixFlagsPrestigeAccess }
            },
            memberships: {
              "Gold Membership": { access: "Six Flags Midwest" },
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
              Gold: { access: "Six Flags Texas" },
              Prestige: { access: SixFlagsPrestigeAccess }
            },
            memberships: {
              "Gold Membership": { access: "Six Flags Texas" },
              "Prestige Membership": { access: SixFlagsPrestigeAccess }
            }
          },
          {
            park: "Six Flags Fiesta Texas",
            slug: "sixflagsfiestatexas",
            state: "Texas",
            parkCode: "ft",
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
            park: "Six Flags Hurricane Harbor Arlington",
            slug: "sixflagshurricaneharborarlington",
            state: "Texas",
            parkCode: "ot",
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
            park: "Six Flags Hurricane Harbor Oklahoma City",
            slug: "sixflagshurricaneharboroklahomacity",
            state: "Oklahoma",
            parkCode: "fc",
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
            park: "Six Flags Hurricane Harbor Splashtown",
            slug: "sixflagshurricaneharborsplashtown",
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
            slug: "sixflagsovertexas",
            state: "Texas",
            parkCode: "ot",
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
      }
    },
    "Six Flags West": {
      "Cedar Fair": {
        parks: [
          {
            park: "California's Great America",
            slug: "californiasgreatamerica",
            state: "California",
            parkCode: "ga",
            currencySymbol: "$",
            passes: {
              Gold: { access: "Six Flags West" },
              Prestige: { access: SixFlagsPrestigeAccess }
            },
            memberships: {
              "Gold Membership": { access: "Six Flags West" },
              "Prestige Membership": { access: SixFlagsPrestigeAccess }
            }
          },
          {
            park: "Knott's Berry Farm",
            slug: "knottsberryfarm",
            state: "California",
            parkCode: "kbf",
            currencySymbol: "$",
            passes: {
              Gold: { access: "Six Flags West" },
              Prestige: { access: SixFlagsPrestigeAccess }
            }
          },
          {
            park: "Knott's Soak City",
            slug: "knottssoakcity",
            state: "California",
            parkCode: "kbf",
            currencySymbol: "$",
            passes: {
              Gold: { access: "Six Flags West" },
              Prestige: { access: SixFlagsPrestigeAccess }
            },
            memberships: {
              "Gold Membership": { access: "Six Flags West" },
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
              Gold: { access: "Six Flags West" },
              Prestige: { access: SixFlagsPrestigeAccess }
            },
            memberships: {
              "Gold Membership": { access: "Six Flags West" },
              "Prestige Membership": { access: SixFlagsPrestigeAccess }
            }
          },
          {
            park: "Six Flags Hurricane Harbor Concord",
            slug: "sixflagshurricaneharborconcord",
            state: "California",
            parkCode: "hhc",
            currencySymbol: "$",
            passes: {
              Gold: { access: "Six Flags West" },
              Prestige: { access: SixFlagsPrestigeAccess }
            },
            memberships: {
              "Gold Membership": { access: "Six Flags West" },
              "Prestige Membership": { access: SixFlagsPrestigeAccess }
            }
          },
          {
            park: "Six Flags Hurricane Harbor Los Angeles",
            slug: "sixflagshurricaneharborlosangeles",
            state: "California",
            parkCode: "mm",
            currencySymbol: "$",
            passes: {
              Gold: { access: "Six Flags West" },
              Prestige: { access: SixFlagsPrestigeAccess }
            },
            memberships: {
              "Gold Membership": { access: "Six Flags West" },
              "Prestige Membership": { access: SixFlagsPrestigeAccess }
            }
          },
          {
            park: "Six Flags Hurricane Harbor Oaxtepec",
            slug: "sixflagshurricaneharboroaxtepec",
            state: "Morelos",
            parkCode: "hhox",
            currencySymbol: "$",
            passes: {
              Gold: { access: "Six Flags West" },
              Prestige: { access: SixFlagsPrestigeAccess }
            },
            memberships: {
              "Gold Membership": { access: "Six Flags West" },
              "Prestige Membership": { access: SixFlagsPrestigeAccess }
            }
          },
          {
            park: "Six Flags Hurricane Harbor Phoenix",
            slug: "sixflagshurricaneharborphoenix",
            state: "Arizona",
            parkCode: "hhpx",
            currencySymbol: "$",
            passes: {
              Gold: { access: "Six Flags West" },
              Prestige: { access: SixFlagsPrestigeAccess }
            },
            memberships: {
              "Gold Membership": { access: "Six Flags West" },
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
              Gold: { access: "Six Flags West" },
              Prestige: { access: SixFlagsPrestigeAccess }
            },
            memberships: {
              "Gold Membership": { access: "Six Flags West" },
              "Prestige Membership": { access: SixFlagsPrestigeAccess }
            }
          },
          {
            park: "Six Flags Mexico",
            slug: "sixflagsmexico",
            state: "Mexico",
            parkCode: "cdmx",
            currencySymbol: "$",
            passes: {
              Gold: { access: "Six Flags West" },
              Prestige: { access: SixFlagsPrestigeAccess }
            },
            memberships: {
              "Gold Membership": { access: "Six Flags West" },
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

function createDefaultPassSource(portal, passType) {
  const rateName = portal === "Cedar Fair" ? "Regular - New" : "Season Pass - New";
  return {
    packageNamePattern: `^\\d{4} ${passType} Pass$`,
    target: "price",
    jsonPaths: [`CT[name=${rateName}].retail_amount`]
  };
}

function createDefaultMembershipSource(passType) {
  return {
    packageNamePattern: `^${passType} Membership$`,
    target: "pricing.monthly",
    jsonPaths: ["CT.retail_amount"],
    downPaymentJsonPaths: [
      "CT.PAYMENT_SCHEDULE.SP.fee_amount",
      "CT.fee_total"
    ],
    minMonthsJsonPaths: [
      "CT.PAYMENT_SCHEDULE.required_num_payments"
    ]
  };
}

for (const companyConfig of Object.values(parkData)) {
  for (const regionConfig of Object.values(companyConfig || {})) {
    for (const [portal, portalConfig] of Object.entries(regionConfig || {})) {
      for (const park of portalConfig.parks || []) {
        park.parkCode = String(park.parkCode || "");

        for (const [passType, pass] of Object.entries(park.passes || {})) {
          if (!pass.source) {
            pass.source = createDefaultPassSource(portal, passType);
          }
        }

        for (const [membershipType, membership] of Object.entries(park.memberships || {})) {
          if (!membership.source) {
            const passType = membershipType.replace(/ Membership$/, "");
            membership.source = createDefaultMembershipSource(passType);
          }
        }
      }
    }
  }
}
