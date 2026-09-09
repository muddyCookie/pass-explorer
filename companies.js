// Six Flags-only configuration for the current catalog.
const urlRules = {
  // Generic URL rules used for all companies. Companies can override defaults by setting:
  // - `defaultUrl`: base host/path used to build park websites.
  // - `defaultUrlPass`: default pass path (e.g. "season-passes") or absolute URL template.
  parkTemplate: "https://{url}/{slug}",
  passTemplate: "https://{url}/{slug}/{urlPass}"
};
const groupOrder = [
  "Six Flags East",
  "Six Flags Midwest",
  "Six Flags Texas",
  "Six Flags West"
];

const companyCatalog = [
  {
    name: "Six Flags",
    defaultCurrency: "USD",
    defaultCountry: "United States",
    defaultDate: "2027-12-31",
    defaultUrl: "sixflags",
    defaultUrlPass: "season-passes",
    defaultMembershipUrlPass: "memberships"
  }
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

function resolveTemplatedValue(rawValue, templateValues) {
  const text = String(rawValue || "").trim();
  if (!text) {
    return "";
  }
  return /\{\w+\}/.test(text) ? applyUrlTemplate(text, templateValues) : text;
}

function getCompanyConfig(companyName) {
  return companyConfig[companyName] || null;
}

function getCompanyDefaultCurrency(companyName) {
  return getCompanyConfig(companyName)?.defaultCurrency || "USD";
}

function getCompanyDefaultCountry(companyName) {
  return getCompanyConfig(companyName)?.defaultCountry || "United States";
}

function getCompanyDefaultDate(companyName) {
  const rawDate = String(getCompanyConfig(companyName)?.defaultDate || "").trim();

  const formatUtcDate = (date) => {
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const day = String(date.getUTCDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Handle dynamic date expressions like "today+1y"
  const todayMatch = /^today\+([0-9]+)y$/.exec(rawDate);
  if (todayMatch) {
    const years = Number(todayMatch[1]);
    const now = new Date();
    const target = new Date(Date.UTC(now.getUTCFullYear() + years, now.getUTCMonth(), now.getUTCDate()));
    const lastDayOfMonth = new Date(Date.UTC(target.getUTCFullYear(), target.getUTCMonth() + 1, 0)).getUTCDate();
    if (target.getUTCDate() !== now.getUTCDate()) {
      target.setUTCDate(Math.min(now.getUTCDate(), lastDayOfMonth));
    }
    return formatUtcDate(target);
  }

  // Handle year-relative expressions like "year+1-12-31".
  const yearMatch = /^year([+-]\d+)?-(\d{2})-(\d{2})$/.exec(rawDate);
  if (yearMatch) {
    const yearOffset = Number(yearMatch[1] || 0);
    const monthIndex = Number(yearMatch[2]) - 1;
    const day = Number(yearMatch[3]);
    const now = new Date();
    const target = new Date(Date.UTC(now.getUTCFullYear() + yearOffset, monthIndex + 1, 0));
    target.setUTCDate(Math.min(day, target.getUTCDate()));
    return formatUtcDate(target);
  }

  return rawDate;
}

// Builds website + buy URLs for a park using company-level URL rules and optional park-level templates.
function buildParkLinksForCompany(companyName, parkConfig) {
  const company = getCompanyConfig(companyName);
  const urlRules = company?.urlRules || {};
  const companyDefaultSlug = String(company?.defaultSlug || "").trim();

  const originalParkUrlValue = String(parkConfig.url || parkConfig.website || "").trim();
  let parkUrlValue = originalParkUrlValue;
  const hasAbsoluteParkUrl = /^https?:\/\//i.test(parkUrlValue);
  let rawSlug = String(parkConfig.slug || "").trim();
  const rawHostSlug = String(parkConfig.hostSlug || "").trim();
  const slugMode = String(parkConfig.slugMode || "").trim().toLowerCase();

  const companyDefaultUrl = String(company?.defaultUrl || "").trim();
  // Prefer park-level `url` as the `{url}` value; fall back to company `defaultUrl`.
  // `slug` is always used as `{slug}`; it is never inferred from `url`.
  const baseUrlTemplateOrValue = parkUrlValue || companyDefaultUrl;

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
  const parkCodeValue = String(parkConfig.parkCode || parkConfig.code || "").trim();
  const templateValuesBase = {
    url: normalizeHostPath(resolveTemplatedValue(baseUrlTemplateOrValue, { url: resolvedUrlValue, parkUrl: originalParkUrlValue, slug: rawSlug, parkCode: parkCodeValue })),
    urlRoot: "",
    urlPass: String(parkConfig.urlPass || "").trim(),
    parkCode: parkCodeValue,
    parkUrl: originalParkUrlValue,
    hostSlug: rawHostSlug || (!rawSlug.includes("/") ? rawSlug : "")
  };
  templateValuesBase.urlRoot = String(templateValuesBase.url || "").split("/")[0] || "";
  const websiteTemplateValues = { ...templateValuesBase, slug: resolvedWebsiteSlugValue };
  const passTemplateValues = { ...templateValuesBase, slug: resolvedPassSlugValue };

  let website = "#";
  if (hasAbsoluteParkUrl) {
    website = originalParkUrlValue;
  } else if ((websiteTemplateValues.url || websiteTemplateValues.hostSlug) && urlRules.parkTemplate) {
    const templatedUrl = normalizeUrlSlashes(applyUrlTemplate(urlRules.parkTemplate, websiteTemplateValues)).trim();
    website = templatedUrl || (websiteTemplateValues.url ? `https://${websiteTemplateValues.url}` : "#");
  } else if (websiteTemplateValues.url) {
    website = `https://${websiteTemplateValues.url}`;
  }

  const parkUrlPassTemplate = String(parkConfig.urlPassTemplate || parkConfig.portalTemplate || "").trim();
  const defaultUrlPass = String(urlRules.defaultUrlPass || "").trim();
  const parkUrlPass = String(parkConfig.urlPass || "").trim();

  let resolvedUrlPass = "";
  if (parkUrlPassTemplate) {
    const templatedPassUrl = normalizeUrlSlashes(applyUrlTemplate(parkUrlPassTemplate, {
      ...passTemplateValues,
      urlPass: parkUrlPass || defaultUrlPass
    })).trim();
    if (templatedPassUrl) {
      return { website, passPurchaseUrl: templatedPassUrl };
    }
  }

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
      defaultCountry: company.defaultCountry || "United States",
      defaultDate: String(company.defaultDate || "").trim(),
      tierOrder: company.tierOrder || [],
      passDisplayRules: company.passDisplayRules || {},
      defaultSlug: String(company.defaultSlug || "").trim(),
      defaultUrl: String(company.defaultUrl || "").trim(),
      defaultMembershipUrlPass: String(company.defaultMembershipUrlPass || "").trim(),
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
