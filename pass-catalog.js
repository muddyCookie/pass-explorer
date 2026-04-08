function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeGroupName(groupValue) {
  const raw = String(groupValue || "").trim();
  if (!raw) {
    return "";
  }

  const match = groupOrder.find((group) => group.toLowerCase() === raw.toLowerCase());
  return match || raw;
}

function normalizeLocationPart(value) {
  const trimmed = String(value || "").trim();
  return trimmed || "";
}

function getParkLocationForConfig(parkName, parkConfig) {
  const fromMap = typeof parkLocationByName === "object" && parkLocationByName
    ? parkLocationByName[parkName]
    : null;
  const country = normalizeLocationPart(parkConfig?.country) || getCompanyDefaultCountry(parkConfig?.company);
  const state = normalizeLocationPart(parkConfig?.state ?? parkConfig?.province) || normalizeLocationPart(fromMap?.state);
  return {
    country: country || "Unknown",
    state: state || "Unknown"
  };
}

function getExpandedParkCatalogEntries() {
  return Object.entries(parkCatalog || {}).flatMap(([company, groups]) =>
    Object.entries(groups || {}).flatMap(([group, groupConfig]) => {
      const normalizedGroupConfig = Array.isArray(groupConfig)
        ? { defaults: {}, parks: groupConfig }
        : {
            defaults: groupConfig?.defaults || {},
            parks: groupConfig?.parks || []
          };

      return normalizedGroupConfig.parks.map((parkConfig) => ({
        company,
        group,
        ...normalizedGroupConfig.defaults,
        ...parkConfig
      }));
    })
  );
}

// Builds a normalized park directory from `parks.js`.
const parkDirectory = [];
const parkDirectoryByGroup = Object.fromEntries(groupOrder.map((group) => [group, []]));
for (const parkConfig of getExpandedParkCatalogEntries()) {
  const parkName = String(parkConfig.park || "").trim();
  const company = String(parkConfig.company || "").trim();
  if (!parkName || !company) {
    continue;
  }

  const parkGroup = normalizeGroupName(parkConfig.group);
  const links = buildParkLinksForCompany(company, parkConfig);
  const location = getParkLocationForConfig(parkName, parkConfig);
  const parkEntry = {
    name: parkName,
    company,
    website: links.website,
    passPurchaseUrl: links.passPurchaseUrl,
    country: location.country,
    state: location.state
  };

  parkDirectory.push(parkEntry);

  if (parkGroup && !parkDirectoryByGroup[parkGroup]) {
    parkDirectoryByGroup[parkGroup] = [];
  }
  if (parkGroup) {
    parkDirectoryByGroup[parkGroup].push(parkEntry);
  }
}

const parkByName = Object.fromEntries(parkDirectory.map((park) => [park.name, park]));
const groupParks = Object.fromEntries(
  Object.entries(parkDirectoryByGroup).map(([group, parks]) => [
    group,
    parks.map((park) => park.name).sort((a, b) => a.localeCompare(b))
  ])
);

const parkGroupByName = {};
for (const [group, parks] of Object.entries(groupParks)) {
  for (const park of parks) {
    parkGroupByName[park] = group;
  }
}

const parkAccessGroups = Object.fromEntries(
  Object.entries(companyConfig).flatMap(([, config]) =>
    Object.entries(config.parkAccessGroups || {}).map(([groupName, groupBuilder]) => {
      const resolvedGroup = typeof groupBuilder === "function" ? groupBuilder() : groupBuilder;
      const parks = Array.isArray(resolvedGroup)
        ? resolvedGroup
          .map((parkName) => String(parkName || "").trim())
          .filter(Boolean)
          .sort((a, b) => a.localeCompare(b))
        : [];
      return [groupName, parks];
    })
  )
);

const parkCollectionsByName = {
  ...groupParks,
  ...parkAccessGroups
};

const countries = Array.from(new Set(parkDirectory.map((park) => park.country))).sort((a, b) => a.localeCompare(b));
const countryFilterOptions = [
  { value: "all", label: "All Countries" },
  ...countries.map((country) => ({ value: country, label: country }))
];

function getStateOptionsForCountry(countryValue = "all") {
  const normalizedCountry = String(countryValue || "all");
  const parksInScope = normalizedCountry === "all"
    ? parkDirectory
    : parkDirectory.filter((park) => park.country === normalizedCountry);
  const states = Array.from(
    new Set(
      parksInScope
        .map((park) => park.state)
        .filter((state) => state && state !== "Unknown")
    )
  ).sort((a, b) => a.localeCompare(b));
  return [
    { value: "all", label: "All States / Provinces" },
    ...states.map((state) => ({ value: state, label: state }))
  ];
}

function getParkWebsiteUrl(parkName) {
  return parkByName[parkName]?.website || "#";
}

function getPassPurchaseUrl(offer) {
  return offer.passPurchaseUrl
    || parkByName[offer.homePark]?.passPurchaseUrl
    || getParkWebsiteUrl(offer.homePark);
}

function getDefaultAccessibleParks(passType, homePark, companyName) {
  const companyDefaults = companyConfig[companyName]?.defaultAccessibleByTier || {};
  const accessBuilder = companyDefaults[passType];
  if (typeof accessBuilder === "function") {
    return accessBuilder(homePark);
  }

  return [homePark];
}

function normalizePassDefinition(rawPassDefinition) {
  if (rawPassDefinition == null) {
    return null;
  }

  if (typeof rawPassDefinition === "string" || typeof rawPassDefinition === "number") {
    return { price: String(rawPassDefinition).trim() };
  }

  if (typeof rawPassDefinition === "object" && !Array.isArray(rawPassDefinition)) {
    const price = rawPassDefinition.price ?? rawPassDefinition.cost ?? rawPassDefinition.value ?? "";
    const rawAccess = rawPassDefinition.access ?? rawPassDefinition.accessibleParks ?? rawPassDefinition.parkAccess ?? null;
    const access = Array.isArray(rawAccess)
      ? rawAccess
      : (typeof rawAccess === "string" && rawAccess.trim() ? [rawAccess.trim()] : null);
    return {
      price: String(price || "").trim(),
      access,
      parking: rawPassDefinition.noParking != null
        ? { exclude: rawPassDefinition.noParking }
        : (rawPassDefinition.parking ?? null),
      disclaimer: rawPassDefinition.disclaimer ?? ""
    };
  }

  return null;
}

function normalizeParkingConfig(rawParking) {
  if (rawParking == null) {
    return null;
  }

  if (typeof rawParking === "string") {
    const entry = rawParking.trim();
    return entry ? { mode: "include", includeHomePark: false, entries: [entry] } : null;
  }

  if (rawParking === true) {
    return { mode: "include", includeHomePark: true, entries: [] };
  }

  if (rawParking === false) {
    return { mode: "include", includeHomePark: false, entries: [] };
  }

  if (Array.isArray(rawParking)) {
    return { mode: "include", includeHomePark: false, entries: rawParking };
  }

  if (typeof rawParking === "object") {
    const includeHomePark = Boolean(
      rawParking.includeHomePark
      ?? rawParking.includesHomePark
      ?? rawParking.home
      ?? rawParking.homePark
      ?? false
    );
    const excludedEntries = rawParking.exclude
      ?? rawParking.excludedAt
      ?? rawParking.notIncludedAt
      ?? rawParking.notIncluded
      ?? null;
    const entries = excludedEntries
      ?? rawParking.entries
      ?? rawParking.extra
      ?? rawParking.include
      ?? rawParking.includedAt
      ?? rawParking.parks
      ?? [];
    return {
      mode: excludedEntries ? "exclude" : "include",
      includeHomePark,
      entries: Array.isArray(entries)
        ? entries
        : (entries == null ? [] : [entries])
    };
  }

  return null;
}

function getAccessibleParksForOffer(parkConfig, passType, homePark, companyName) {
  const passDefinition = normalizePassDefinition(parkConfig.passes?.[passType]);
  const passAccessGroups = passDefinition?.access;
  if (Array.isArray(passAccessGroups)) {
    return passAccessGroups;
  }

  return getDefaultAccessibleParks(passType, homePark, companyName);
}

function flattenEntryList(values) {
  const flattened = [];
  const stack = Array.isArray(values) ? [...values] : [];

  while (stack.length > 0) {
    const next = stack.shift();
    if (Array.isArray(next)) {
      stack.unshift(...next);
      continue;
    }

    const text = String(next || "").trim();
    if (text) {
      flattened.push(text);
    }
  }

  return flattened;
}

function expandParkingParks(entries, homePark, includeHomePark = false) {
  const expanded = [];
  const seen = new Set();

  if (includeHomePark && homePark) {
    seen.add(homePark);
    expanded.push(homePark);
  }

  for (const entry of flattenEntryList(entries || [])) {
    const parks = parkCollectionsByName[entry] ?? [entry];

    for (const rawPark of parks) {
      const park = String(rawPark || "").trim();
      if (!park || seen.has(park)) {
        continue;
      }
      seen.add(park);
      expanded.push(park);
    }
  }

  return expanded;
}

function resolveExplicitParkingIncludedParks(accessibleParks, parkingConfig, homePark) {
  if (!parkingConfig) {
    return null;
  }

  if (parkingConfig.mode === "exclude") {
    const excludedParks = new Set(expandParkingParks(parkingConfig.entries, homePark, false));
    const includedParks = [];

    for (const parkName of accessibleParks || []) {
      const normalizedParkName = String(parkName || "").trim();
      if (normalizedParkName && !excludedParks.has(normalizedParkName)) {
        includedParks.push(normalizedParkName);
      }
    }

    return includedParks;
  }

  return expandParkingParks(
    parkingConfig.entries,
    homePark,
    Boolean(parkingConfig.includeHomePark)
  );
}

function hasIncludedParking(offer, parkName) {
  if (Array.isArray(offer.explicitParkingIncludedParks)) {
    return offer.explicitParkingIncludedParks.includes(parkName);
  }

  const companyParkingRules = parkingRulesByCompany[offer.company];
  if (!companyParkingRules) {
    return true;
  }

  if (companyParkingRules.homePrestigeOnlyParkingParks.has(parkName)) {
    return offer.passType === "Prestige" && offer.homePark === parkName;
  }

  if (companyParkingRules.prestigeOnlyParkingParks.has(parkName)) {
    return offer.passType === "Prestige";
  }

  if (companyParkingRules.homeOnlyPassTypes.has(offer.passType)) {
    return offer.homePark === parkName;
  }

  return true;
}

function formatParkList(parks) {
  if (parks.length === 0) {
    return "";
  }
  if (parks.length === 1) {
    return parks[0];
  }
  if (parks.length === 2) {
    return `${parks[0]} and ${parks[1]}`;
  }
  return `${parks.slice(0, -1).join(", ")}, and ${parks[parks.length - 1]}`;
}

function buildParkingDisclaimer(offer, expandedParks) {
  if (offer.disclaimer && offer.disclaimer.trim()) {
    return offer.disclaimer.trim();
  }

  const excludedParks = expandedParks.filter((parkName) => !hasIncludedParking(offer, parkName));
  if (excludedParks.length === 0) {
    return "";
  }

  return `Parking is not included at ${formatParkList(excludedParks)}`;
}

function expandAccessibleParks(accessEntries) {
  const expanded = [];
  const seen = new Set();

  for (const entry of flattenEntryList(accessEntries || [])) {
    const parks = parkCollectionsByName[entry] ?? [entry];
    for (const rawPark of parks) {
      const park = String(rawPark || "").trim();
      if (!park || seen.has(park)) {
        continue;
      }
      seen.add(park);
      expanded.push(park);
    }
  }

  return expanded;
}

const passOffers = [];
const OMIT_HOME_ONLY_PASSES = true;
for (const parkConfig of getExpandedParkCatalogEntries()) {
  const parkName = String(parkConfig.park || "").trim();
  const company = String(parkConfig.company || "").trim();
  if (!parkName || !company) {
    continue;
  }

  const links = buildParkLinksForCompany(company, parkConfig);
  const tierOffers = Object.entries(parkConfig.passes || {})
    .map(([passType, rawPassDefinition]) => [passType, normalizePassDefinition(rawPassDefinition)])
    .filter(([, passDefinition]) => Boolean(passDefinition?.price));
  const passUrlByTier = parkConfig.passPurchaseUrlByTier || parkConfig.buyPassUrlByTier || {};
  const fallbackPassUrl = links.passPurchaseUrl || parkConfig.passPurchaseUrl || parkConfig.buyPassUrl || null;
  for (const [passType, passDefinition] of tierOffers) {
    const price = passDefinition.price;
    const accessibleParks = getAccessibleParksForOffer(parkConfig, passType, parkName, company);

    const expandedAccessibleParks = expandAccessibleParks(accessibleParks);
    if (
      OMIT_HOME_ONLY_PASSES
      && expandedAccessibleParks.length === 1
      && expandedAccessibleParks[0] === parkName
    ) {
      continue;
    }

    const passParkingConfig = normalizeParkingConfig(passDefinition.parking);
    const hasExplicitParkingConfig = Boolean(passParkingConfig);
    const funCardOverride = passType === "Fun Card"
      ? String(parkConfig.urlFunCard || "").trim()
      : "";
    const rawTierUrl = funCardOverride || passUrlByTier[passType] || null;
    const tierUrl = rawTierUrl
      ? String(rawTierUrl || "").trim()
      : "";
    const resolvedTierPassUrl = tierUrl
      ? (
        /^https?:\/\//i.test(tierUrl)
          ? tierUrl
          : (/^https?:\/\//i.test(links.website) ? joinUrl(links.website, trimSlashes(tierUrl)) : tierUrl)
      )
      : null;
    passOffers.push({
      id: `${slugify(parkName)}-${slugify(passType)}-${slugify(company)}`,
      homePark: parkName,
      company,
      passType,
      price,
      currency: parkConfig.currency || getCompanyDefaultCurrency(company),
      disclaimer: String(passDefinition.disclaimer || parkConfig.disclaimer || "").trim(),
      passPurchaseUrl: resolvedTierPassUrl || fallbackPassUrl,
      accessibleParks,
      explicitParkingIncludedParks: hasExplicitParkingConfig
        ? resolveExplicitParkingIncludedParks(expandedAccessibleParks, passParkingConfig, parkName)
        : null
    });
  }
}

const supportedCurrencies = Array.from(
  new Set(passOffers.map((offer) => String(offer.currency || "USD").toUpperCase()))
);

const companies = Array.from(new Set(passOffers.map((offer) => offer.company))).sort((a, b) => a.localeCompare(b));

const tierSetByCompany = Object.fromEntries(
  companies.map((company) => [company, new Set(passOffers.filter((offer) => offer.company === company).map((offer) => offer.passType))])
);

const allParks = Array.from(
  new Set(passOffers.flatMap((offer) => expandAccessibleParks(offer.accessibleParks)))
).sort((a, b) => a.localeCompare(b));

const allParkFilterOptions = [
  { value: "all", label: "All Parks" },
  ...allParks.map((park) => ({ value: park, label: park }))
];

const companyFilterOptions = [
  { value: "all", label: "All Companies" },
  ...companies.map((company) => ({ value: company, label: company }))
];
