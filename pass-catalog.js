function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeRegionName(regionValue) {
  const raw = String(regionValue || "").trim();
  if (!raw) {
    return "";
  }

  const match = regionOrder.find((region) => region.toLowerCase() === raw.toLowerCase());
  return match || raw;
}

// Builds a normalized park directory from `parks.js`.
const parkDirectory = [];
const parkDirectoryByRegion = Object.fromEntries(regionOrder.map((region) => [region, []]));
for (const parkConfig of parkCatalog) {
  const parkName = String(parkConfig.park || "").trim();
  const company = String(parkConfig.company || "").trim();
  if (!parkName || !company) {
    continue;
  }

  const region = normalizeRegionName(parkConfig.region);
  const links = buildParkLinksForCompany(company, parkConfig);
  const parkEntry = {
    name: parkName,
    company,
    website: links.website,
    passPurchaseUrl: links.passPurchaseUrl
  };

  parkDirectory.push(parkEntry);

  const companyUsesRegions = Boolean(companyConfig[company]?.usesRegionFilter);
  if (region && companyUsesRegions && !parkDirectoryByRegion[region]) {
    parkDirectoryByRegion[region] = [];
  }
  if (region && companyUsesRegions) {
    parkDirectoryByRegion[region].push(parkEntry);
  }
}

const parkByName = Object.fromEntries(parkDirectory.map((park) => [park.name, park]));
const regionParks = Object.fromEntries(
  Object.entries(parkDirectoryByRegion).map(([region, parks]) => [
    region,
    parks.map((park) => park.name).sort((a, b) => a.localeCompare(b))
  ])
);
regionParks["All Parks"] = parkDirectory
  .filter((park) => park.company === "Six Flags")
  .map((park) => park.name)
  .sort((a, b) => a.localeCompare(b));

const parkRegionByName = {};
for (const [region, parks] of Object.entries(regionParks)) {
  if (region === "All Parks") {
    continue;
  }
  for (const park of parks) {
    parkRegionByName[park] = region;
  }
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

function hasIncludedParking(offer, parkName) {
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

  for (const rawEntry of accessEntries) {
    const entry = String(rawEntry || "").trim();
    if (!entry) {
      continue;
    }

    const parks = regionParks[entry] ?? [entry];
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
for (const parkConfig of parkCatalog) {
  const parkName = String(parkConfig.park || "").trim();
  const company = String(parkConfig.company || "").trim();
  if (!parkName || !company) {
    continue;
  }

  const links = buildParkLinksForCompany(company, parkConfig);
  const tierOffers = Object.entries(parkConfig.passes || {}).filter(([, price]) => Boolean(price));
  const passUrlByTier = parkConfig.passPurchaseUrlByTier || parkConfig.buyPassUrlByTier || {};
  const fallbackPassUrl = links.passPurchaseUrl || parkConfig.passPurchaseUrl || parkConfig.buyPassUrl || null;
  for (const [passType, price] of tierOffers) {
    passOffers.push({
      id: `${slugify(parkName)}-${slugify(passType)}-${slugify(company)}`,
      homePark: parkName,
      company,
      passType,
      price,
      currency: parkConfig.currency || getCompanyDefaultCurrency(company),
      disclaimer: parkConfig.disclaimer || "",
      passPurchaseUrl: passUrlByTier[passType] || fallbackPassUrl,
      accessibleParks: parkConfig.accessibleParks || getDefaultAccessibleParks(passType, parkName, company)
    });
  }
}

const supportedCurrencies = Array.from(
  new Set(passOffers.map((offer) => String(offer.currency || "USD").toUpperCase()))
);

const companies = Array.from(new Set(passOffers.map((offer) => offer.company))).sort((a, b) => {
  const aIndex = companyOrder.indexOf(a);
  const bIndex = companyOrder.indexOf(b);
  if (aIndex !== -1 || bIndex !== -1) {
    return (aIndex === -1 ? Number.MAX_SAFE_INTEGER : aIndex)
      - (bIndex === -1 ? Number.MAX_SAFE_INTEGER : bIndex);
  }
  return a.localeCompare(b);
});

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
