// Company definitions live here. Add operators (Disney, Universal, etc.) in this file.
// This file also owns URL rules and default currency behavior per company.
const companyCatalog = [
  {
    name: "Six Flags",
    defaultCurrency: "USD",
    usesRegionFilter: true,
    tierOrder: ["Silver", "Gold", "Prestige"],
    urlRules: {
      // `url` in parks.js becomes https://www.sixflags.com/{url}
      parkTemplate: "https://www.sixflags.com/{url}",
      // Buy URL defaults to https://www.sixflags.com/{url}/season-passes
      passTemplate: "https://www.sixflags.com/{url}/{urlPass}",
      defaultUrlPass: "season-passes"
    },
    defaultAccessibleByTier: {
      Silver: (homePark) => [homePark],
      Gold: (homePark) => [parkRegionByName[homePark] || homePark],
      Prestige: () => ["All Parks"]
    },
    parkingRules: {
      homePrestigeOnlyParkingParks: ["Canada's Wonderland", "La Ronde"],
      prestigeOnlyParkingParks: ["Knott's Berry Farm"],
      homeOnlyPassTypes: ["Silver"]
    }
  },
  {
    name: "Herschend",
    defaultCurrency: "USD",
    usesRegionFilter: false,
    tierOrder: ["Summer", "Bronze", "Silver", "Gold", "Diamond", "Platinum"],
    urlRules: {
      // For Herschend, parks.js uses full URLs in `url`.
      parkTemplate: "{url}",
      // `urlPass` can now replace explicit passPurchaseUrl, e.g. "buy-tickets/season-passes/".
      passTemplate: "{url}/{urlPass}",
      defaultUrlPass: ""
    },
    defaultAccessibleByTier: {
      Bronze: (homePark) => [homePark],
      Silver: (homePark) => [homePark],
      Gold: (homePark) => [homePark],
      Platinum: (homePark) => [homePark]
    },
    parkingRules: {
      homePrestigeOnlyParkingParks: [],
      prestigeOnlyParkingParks: [],
      homeOnlyPassTypes: []
    }
  }
];

const regionOrder = ["East", "Midwest", "Texas", "West"];
const companyOrder = companyCatalog.map((company) => company.name);

function trimSlashes(value) {
  return String(value || "").replace(/^\/+|\/+$/g, "");
}

function joinUrl(base, path) {
  const normalizedBase = String(base || "").replace(/\/+$/, "");
  const normalizedPath = String(path || "").replace(/^\/+/, "");
  if (!normalizedPath) {
    return normalizedBase;
  }
  return `${normalizedBase}/${normalizedPath}`;
}

function applyUrlTemplate(template, values) {
  return String(template || "").replace(/\{(\w+)\}/g, (_, key) => String(values[key] || ""));
}

function getCompanyConfig(companyName) {
  return companyConfig[companyName] || null;
}

function getCompanyDefaultCurrency(companyName) {
  return getCompanyConfig(companyName)?.defaultCurrency || "USD";
}

// Builds website + buy URLs for a park using company-level URL rules and optional park-level `urlPass`.
function buildParkLinksForCompany(companyName, parkConfig) {
  const company = getCompanyConfig(companyName);
  const urlRules = company?.urlRules || {};

  const parkUrlValue = String(parkConfig.url || parkConfig.website || "").trim();
  const hasAbsoluteParkUrl = /^https?:\/\//i.test(parkUrlValue);
  const templateValues = {
    url: parkUrlValue,
    urlPass: String(parkConfig.urlPass || "").trim()
  };

  let website = "#";
  if (parkUrlValue) {
    if (urlRules.parkTemplate) {
      const templatedUrl = applyUrlTemplate(urlRules.parkTemplate, templateValues).trim();
      website = templatedUrl || (hasAbsoluteParkUrl ? parkUrlValue : "#");
    } else {
      website = hasAbsoluteParkUrl ? parkUrlValue : "#";
    }
  }

  const defaultUrlPass = String(urlRules.defaultUrlPass || "").trim();
  const parkUrlPass = String(parkConfig.urlPass || "").trim();
  const resolvedUrlPass = parkUrlPass || defaultUrlPass;

  if (resolvedUrlPass && /^https?:\/\//i.test(resolvedUrlPass)) {
    return { website, passPurchaseUrl: resolvedUrlPass };
  }

  if (resolvedUrlPass && urlRules.passTemplate) {
    const templatedPassUrl = applyUrlTemplate(urlRules.passTemplate, {
      ...templateValues,
      urlPass: resolvedUrlPass
    }).trim();
    if (templatedPassUrl) {
      return { website, passPurchaseUrl: templatedPassUrl };
    }
  }

  if (resolvedUrlPass && /^https?:\/\//i.test(website)) {
    return { website, passPurchaseUrl: joinUrl(website, trimSlashes(resolvedUrlPass)) };
  }

  return { website, passPurchaseUrl: website };
}

const companyConfig = Object.fromEntries(
  companyCatalog.map((company) => [
    company.name,
    {
      defaultCurrency: company.defaultCurrency || "USD",
      usesRegionFilter: Boolean(company.usesRegionFilter),
      tierOrder: company.tierOrder || [],
      urlRules: company.urlRules || {},
      defaultAccessibleByTier: company.defaultAccessibleByTier || {}
    }
  ])
);

const parkingRulesByCompany = Object.fromEntries(
  companyCatalog.map((company) => [
    company.name,
    {
      homePrestigeOnlyParkingParks: new Set(company.parkingRules?.homePrestigeOnlyParkingParks || []),
      prestigeOnlyParkingParks: new Set(company.parkingRules?.prestigeOnlyParkingParks || []),
      homeOnlyPassTypes: new Set(company.parkingRules?.homeOnlyPassTypes || [])
    }
  ])
);
