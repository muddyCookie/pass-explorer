// Company definitions live here. Add operators (Disney, Universal, etc.) in this file.
// This file also owns URL rules and default currency behavior per company.
const companyCatalog = [
  {
    name: "Six Flags",
    defaultCurrency: "USD",
    usesGroupFilter: true,
    tierOrder: ["Silver", "Gold", "Prestige"],
    urlRules: {
      // `url` in parks.js becomes https://www.sixflags.com/{url}
      parkTemplate: "https://www.sixflags.com/{url}",
      // Buy URL defaults to https://www.sixflags.com/{url}/season-passes
      passTemplate: "https://www.sixflags.com/{url}/{urlPass}",
      defaultUrlPass: "season-passes"
    },
    parkAccessGroups: {
      // Explicit company-wide group so parks without published passes are not
      // automatically treated as included by all-park tiers.
      AllSixFlagsParks: () => parkCatalog
        .filter((park) => {
          if (park.company !== "Six Flags") {
            return false;
          }

          return Object.values(park.passes || {}).some(Boolean);
        })
        .map((park) => String(park.park || "").trim())
        .filter(Boolean)
        .sort((a, b) => a.localeCompare(b))
    },
    defaultAccessibleByTier: {
      Silver: (homePark) => [homePark],
      Gold: (homePark) => [parkGroupByName[homePark] || homePark],
      Prestige: () => ["AllSixFlagsParks"]
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
    usesGroupFilter: true,
    tierOrder: ["Summer", "Bronze", "Silver", "Gold", "Diamond", "Platinum"],
    urlRules: {
      // For Herschend, parks.js uses full URLs in `url`.
      parkTemplate: "https://{url}.com",
      // `urlPass` can now replace explicit passPurchaseUrl, e.g. "buy-tickets/season-passes/".
      passTemplate: "https://{url}.com/{urlPass}/season-passes",
      defaultUrlPass: "buy-tickets"
    },
    defaultAccessibleByTier: {
      Summer: (homePark) => [homePark],
      Bronze: (homePark) => [homePark],
      Silver: (homePark) => [homePark],
      Gold: (homePark) => [homePark],
      Diamond: (homePark) => [homePark],
      Platinum: (homePark) => [parkGroupByName[homePark] || homePark]
    }
  },
  {
    name: "United Parks",
    defaultCurrency: "USD",
    usesGroupFilter: true,
    tierOrder: ["Fun Card", "Basic", "Season", "Bronze", "Unlimited", "Silver", "Premier", "Gold", "Platinum"],
    passDisplayRules: {
      omitPassSuffixForTypes: ["Fun Card"]
    },
    urlRules: {
      // URL format: https://{url}.com/{slug}
      parkTemplate: "https://{url}.com/{slug}",
      // Default pass URL format: https://{url}.com/{slug}/{urlPass}/
      passTemplate: "https://{url}.com/{slug}/{urlPass}/",
      defaultUrlPass: "annual-pass"
    },
    defaultAccessibleByTier: {
      "Fun Card": (homePark) => [homePark],
      Basic: (homePark) => [homePark],
      Season: (homePark) => [homePark],
      Bronze: (homePark) => [homePark],
      Unlimited: (homePark) => [homePark],
      Silver: (homePark) => [homePark],
      Premier: (homePark) => [homePark],
      Gold: (homePark) => [homePark],
      Platinum: (homePark) => [parkGroupByName[homePark] || homePark]
    }
  }
];

const groupOrder = ["East", "Midwest", "Texas", "West", "HerschendFree", "Herschend", "United"];

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

function normalizeUrlSlashes(value) {
  return String(value || "").replace(/([^:]\/)\/+/g, "$1");
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
  const rawSlug = String(parkConfig.slug || "").trim();
  const slugMode = String(parkConfig.slugMode || "").trim().toLowerCase();
  const resolvedUrlValue = slugMode === "suffix" && rawSlug
    ? `${parkUrlValue}${rawSlug}`
    : parkUrlValue;
  const resolvedSlugValue = slugMode === "suffix"
    ? ""
    : rawSlug;
  const templateValues = {
    url: resolvedUrlValue,
    slug: resolvedSlugValue,
    urlPass: String(parkConfig.urlPass || "").trim()
  };

  let website = "#";
  if (parkUrlValue) {
    if (hasAbsoluteParkUrl) {
      website = parkUrlValue;
    } else if (urlRules.parkTemplate) {
      const templatedUrl = normalizeUrlSlashes(applyUrlTemplate(urlRules.parkTemplate, templateValues)).trim();
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

  if (resolvedUrlPass && hasAbsoluteParkUrl && /^https?:\/\//i.test(website)) {
    return { website, passPurchaseUrl: joinUrl(website, trimSlashes(resolvedUrlPass)) };
  }

  if (resolvedUrlPass && urlRules.passTemplate) {
    const templatedPassUrl = normalizeUrlSlashes(applyUrlTemplate(urlRules.passTemplate, {
      ...templateValues,
      urlPass: resolvedUrlPass
    })).trim();
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
      usesGroupFilter: Boolean(company.usesGroupFilter),
      tierOrder: company.tierOrder || [],
      passDisplayRules: company.passDisplayRules || {},
      urlRules: company.urlRules || {},
      parkAccessGroups: company.parkAccessGroups || {},
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
