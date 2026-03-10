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

// Builds a normalized park directory from `parks.js`.
const parkDirectory = [];
const parkDirectoryByGroup = Object.fromEntries(groupOrder.map((group) => [group, []]));
for (const parkConfig of parkCatalog) {
  const parkName = String(parkConfig.park || "").trim();
  const company = String(parkConfig.company || "").trim();
  if (!parkName || !company) {
    continue;
  }

  const parkGroup = normalizeGroupName(parkConfig.group);
  const links = buildParkLinksForCompany(company, parkConfig);
  const parkEntry = {
    name: parkName,
    company,
    website: links.website,
    passPurchaseUrl: links.passPurchaseUrl
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

function getAccessibleParksForOffer(parkConfig, passType, homePark, companyName) {
  const tierAccessGroups = parkConfig.parkAccess?.[passType]
    ?? parkConfig.accessGroupsByTier?.[passType];
  if (Array.isArray(tierAccessGroups)) {
    return tierAccessGroups;
  }

  if (Array.isArray(parkConfig.accessibleParks)) {
    return parkConfig.accessibleParks;
  }

  return getDefaultAccessibleParks(passType, homePark, companyName);
}

function expandParkingParks(entries, homePark, includeHomePark = false) {
  const expanded = [];
  const seen = new Set();

  if (includeHomePark && homePark) {
    seen.add(homePark);
    expanded.push(homePark);
  }

  for (const rawEntry of entries || []) {
    const entry = String(rawEntry || "").trim();
    if (!entry) {
      continue;
    }

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

  for (const rawEntry of accessEntries) {
    const entry = String(rawEntry || "").trim();
    if (!entry) {
      continue;
    }

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
    const accessibleParks = getAccessibleParksForOffer(parkConfig, passType, parkName, company);
    const hasExplicitParkingConfig = Array.isArray(parkConfig.parking)
      || Boolean(parkConfig.extraParking);
    const hasHomeParkParking = Array.isArray(parkConfig.parking)
      && parkConfig.parking.includes(passType);
    const extraParkingEntries = parkConfig.extraParking?.[passType] || [];
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
      disclaimer: parkConfig.disclaimer || "",
      passPurchaseUrl: resolvedTierPassUrl || fallbackPassUrl,
      accessibleParks,
      explicitParkingIncludedParks: hasExplicitParkingConfig
        ? expandParkingParks(extraParkingEntries, parkName, hasHomeParkParking)
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
