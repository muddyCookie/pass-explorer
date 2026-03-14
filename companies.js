// Example company record with all optional fields.
//
//const companyCatalog = [
//  {
//    name: "United Parks",
//    defaultCurrency: "USD",
//    tierOrder: ["Season", "Platinum"],
//    defaultUrl: "",
//    defaultUrlPass: "annual-pass",
//    passDisplayRules: { omitPassSuffixForTypes: ["Fun Card"] },
//    parkAccessGroups: { UnitedSanDiego: ["SeaWorld San Diego", "Sesame Place San Diego"] },
//    defaultAccessibleByTier: {
//      Season: (homePark) => [homePark],
//      Platinum: (homePark) => [parkGroupByName[homePark] || homePark]
//    }
//  }
//];
const urlRules = {
  // Generic URL rules used for all companies. Companies can override defaults by setting:
  // - `defaultUrl`: base host/path used to build park websites (e.g. "www.sixflags", "{parkUrl}.disney.go.com/destinations")
  // - `defaultUrlPass`: default pass path (e.g. "season-passes") or absolute URL template.
  parkTemplate: "https://{url}/{slug}",
  passTemplate: "https://{url}/{slug}/{urlPass}"
};
const groupOrder = [
  "Six Flags East",
  "Six Flags Midwest",
  "Six Flags Texas", 
  "Six Flags West",
  "Herschend",
  "Fun Spot America"
];

const companyCatalog = [
  {
    name: "Six Flags",
    defaultCurrency: "USD",
    tierOrder: ["Gold", "Prestige"],
    defaultUrl: "sixflags",
    defaultUrlPass: "season-passes"
  },
  {
    name: "Herschend",
    defaultCurrency: "USD",
    tierOrder: ["Platinum"],
    defaultSlug: "buy-tickets",
    defaultUrlPass: "season-passes"
  },
  {
  name: "Fun Spot America",
  defaultCurrency: "USD",
  tierOrder: ["Season", "Ultimate"],
  defaultUrl: "fun-spot",
  defaultUrlPass: "buy-tickets"
  }
  // {
  //   name: "Merlin",
  //     Legoland Florida
  //     Legoland New York
  //     Legoland California
  //     Peppa Pig Florida
  // },
  // {
  //   name: "United Parks",
  //     Busch Gardens Tampa Bay
  //     Busch Gardens Williamsburg
  //     SeaWorld Orlando
  //     SeaWorld San Antonio
  //     SeaWorld San Diego
  //     Sesame Place Philadelphia
  //     Sesame Place San Diego
  // },
  // {
  //   name: "Universal",
  //     ???
  // },
  // {
  //   name: "Fun Spot America",
  //     Orlando, Atlanta, Kissimmee
  // }
  // {
  //   name: "Walt Disney",
  // }
];

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
  const companyDefaultSlug = String(company?.defaultSlug || "").trim();

  const originalParkUrlValue = String(parkConfig.url || parkConfig.website || "").trim();
  let parkUrlValue = originalParkUrlValue;
  const hasAbsoluteParkUrl = /^https?:\/\//i.test(parkUrlValue);
  let rawSlug = String(parkConfig.slug || "").trim();
  const slugMode = String(parkConfig.slugMode || "").trim().toLowerCase();

  const companyDefaultUrl = String(company?.defaultUrl || "").trim();
  // Prefer park-level `url` as the `{url}` value; fall back to company `defaultUrl`.
  // `slug` is always used as `{slug}`; it is never inferred from `url`.
  const baseUrlTemplateOrValue = parkUrlValue || companyDefaultUrl;

  const expandUrlTemplate = (value, templateValues) => {
    const text = String(value || "").trim();
    if (!text) {
      return "";
    }
    return /\{\w+\}/.test(text) ? applyUrlTemplate(text, templateValues) : text;
  };

  const normalizeHostPath = (value) => {
    const text = trimSlashes(String(value || "").trim());
    if (!text) {
      return "";
    }
    if (/^https?:\/\//i.test(text)) {
      return text.replace(/^https?:\/\//i, "");
    }
    if (/[./]/.test(text)) {
      return text;
    }
    return `${text}.com`;
  };

  const resolvedUrlValue = slugMode === "suffix" && rawSlug
    ? `${parkUrlValue}${rawSlug}`
    : parkUrlValue;
  const resolvedWebsiteSlugValue = slugMode === "suffix"
    ? ""
    : rawSlug;
  const resolvedPassSlugValue = slugMode === "suffix"
    ? ""
    : (rawSlug || companyDefaultSlug);
  const templateValuesBase = {
    url: normalizeHostPath(expandUrlTemplate(baseUrlTemplateOrValue, { url: resolvedUrlValue, parkUrl: originalParkUrlValue, slug: rawSlug })),
    urlRoot: "",
    urlPass: String(parkConfig.urlPass || "").trim(),
    parkUrl: originalParkUrlValue
  };
  templateValuesBase.urlRoot = String(templateValuesBase.url || "").split("/")[0] || "";
  const websiteTemplateValues = { ...templateValuesBase, slug: resolvedWebsiteSlugValue };
  const passTemplateValues = { ...templateValuesBase, slug: resolvedPassSlugValue };

  let website = "#";
  if (hasAbsoluteParkUrl) {
    website = originalParkUrlValue;
  } else if (websiteTemplateValues.url && urlRules.parkTemplate) {
    const templatedUrl = normalizeUrlSlashes(applyUrlTemplate(urlRules.parkTemplate, websiteTemplateValues)).trim();
    website = templatedUrl || (websiteTemplateValues.url ? `https://${websiteTemplateValues.url}` : "#");
  } else if (websiteTemplateValues.url) {
    website = `https://${websiteTemplateValues.url}`;
  }

  const defaultUrlPass = String(urlRules.defaultUrlPass || "").trim();
  const parkUrlPass = String(parkConfig.urlPass || "").trim();

  let resolvedUrlPass = "";
  if (parkUrlPass && /^https?:\/\//i.test(parkUrlPass)) {
    resolvedUrlPass = parkUrlPass;
  } else if (parkUrlPass && /^https?:\/\//i.test(defaultUrlPass) && /\{urlPass\}/.test(defaultUrlPass)) {
    resolvedUrlPass = applyUrlTemplate(defaultUrlPass, { ...passTemplateValues, urlPass: parkUrlPass });
  } else if (parkUrlPass && /\{\w+\}/.test(defaultUrlPass) && /\{urlPass\}/.test(defaultUrlPass)) {
    resolvedUrlPass = applyUrlTemplate(defaultUrlPass, { ...passTemplateValues, urlPass: parkUrlPass });
  } else {
    resolvedUrlPass = parkUrlPass || defaultUrlPass;
  }

  if (resolvedUrlPass && /^https?:\/\//i.test(resolvedUrlPass)) {
    const templatedAbsolute = normalizeUrlSlashes(applyUrlTemplate(resolvedUrlPass, {
      ...passTemplateValues,
      urlPass: parkUrlPass || defaultUrlPass
    })).trim();
    return { website, passPurchaseUrl: templatedAbsolute || resolvedUrlPass };
  }

  if (resolvedUrlPass && hasAbsoluteParkUrl && /^https?:\/\//i.test(website)) {
    return { website, passPurchaseUrl: joinUrl(website, trimSlashes(resolvedUrlPass)) };
  }

  if (resolvedUrlPass) {
    // Park-level `urlPass` should attach to the park website (which already includes the slug).
    if (parkUrlPass && !/\{urlPass\}/.test(defaultUrlPass) && /^https?:\/\//i.test(website)) {
      return { website, passPurchaseUrl: joinUrl(website, trimSlashes(resolvedUrlPass)) };
    }

    if (urlRules.passTemplate) {
      const templatedPassUrl = normalizeUrlSlashes(applyUrlTemplate(urlRules.passTemplate, {
        ...passTemplateValues,
        urlPass: String(resolvedUrlPass || "").trim()
      })).trim();
      if (templatedPassUrl) {
        return { website, passPurchaseUrl: templatedPassUrl };
      }
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
      tierOrder: company.tierOrder || [],
      passDisplayRules: company.passDisplayRules || {},
      defaultSlug: String(company.defaultSlug || "").trim(),
      defaultUrl: String(company.defaultUrl || "").trim(),
      urlRules: {
        ...urlRules,
        ...(company.urlRules || {}),
        defaultUrlPass: String(company.defaultUrlPass || "").trim()
      },
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
