const sixFlagsPassPathByParkName = {
  "La Ronde": "passeports"
};

const regionOrder = ["East", "Midwest", "Texas", "West"];
const passTypeOrderList = ["Silver", "Gold", "Prestige"];
const passFieldByType = {
  Silver: "Silver",
  Gold: "Gold",
  Prestige: "Prestige"
};

const parkCatalog = {
  "Carowinds": { 
    Region: "East", 
    url: "carowinds", 
    "Silver": "$89", 
    "Gold": "$110", 
    "Prestige": "$165" },
  "Dorney Park": { 
    Region: "East", 
    url: "dorneypark", 
    "Gold": "$105", 
    "Prestige": "$145" },
  "Kings Dominion": { 
    Region: "East", 
    url: "kingsdominion", 
    "Silver": "$89", 
    "Gold": "$110", 
    "Prestige": "$199" },
  "Six Flags Great Adventure": { 
    Region: "East", 
    url: "greatadventure", 
    "Silver": "$70", 
    "Gold": "$89", 
    "Prestige": "$155" },
  "Six Flags Great Escape": { 
    Region: "East", 
    url: "greatescape", 
    "Gold": "$65", 
    "Prestige": "$135" },
  "Six Flags New England": { 
    Region: "East", 
    url: "newengland", 
    "Silver": "$70", 
    "Gold": "$89", 
    "Prestige": "$145" },
  "Six Flags Over Georgia": { 
    Region: "East", 
    url: "overgeorgia", 
    "Silver": "$65", 
    "Gold": "$89", 
    "Prestige": "$145" },
  "Canada's Wonderland": { 
    Region: "Midwest", 
    url: "canadaswonderland", 
    currency: "CAD", 
    "Silver": "$89", 
    "Gold": "$125", 
    "Prestige": "$210" },
  "Cedar Point": { 
    Region: "Midwest", 
    url: "cedarpoint", 
    "Silver": "$99", 
    "Gold": "$150", 
    "Prestige": "$250" },
  "Kings Island": { 
    Region: "Midwest", 
    url: "kingsisland", 
    "Silver": "$105", 
    "Gold": "$145", 
    "Prestige": "$225" },
  "La Ronde": { 
    Region: "Midwest", 
    url: "laronde", 
    currency: "CAD", 
    "Silver": "$73", 
    "Gold": "$95", 
    "Prestige": "$150" },
  "Michigan's Adventure": { 
    Region: "Midwest", 
    url: "miadventure", 
    "Gold": "$110", 
    "Prestige": "$190" },
  "Six Flags Darien Lake": { 
    Region: "Midwest", 
    url: "darienlake", 
    "Gold": "$75", 
    "Prestige": "$135" },
  "Six Flags Great America": { 
    Region: "Midwest", 
    url: "greatamerica", 
    "Silver": "$79", 
    "Gold": "$99", 
    "Prestige": "$145" },
  "Six Flags St. Louis": { 
    Region: "Midwest", 
    url: "stlouis", 
    "Silver": "$59", 
    "Gold": "$75", 
    "Prestige": "$135" },
  "Valleyfair": { 
    Region: "Midwest", 
    url: "valleyfair", 
    "Gold": "$85", 
    "Prestige": "$125" },
  "Worlds of Fun": { 
    Region: "Midwest", 
    url: "worldsoffun", 
    "Silver": "$65", 
    "Gold": "$90", 
    "Prestige": "$125" },
  "Frontier City": { 
    Region: "Texas", 
    url: "frontiercity", 
    "Silver": "$55", 
    "Gold": "$79", 
    "Prestige": "$125" },
  "Six Flags Fiesta Texas": { 
    Region: "Texas", 
    url: "fiestatexas", 
    "Silver": "$70", 
    "Gold": "$99", 
    "Prestige": "$145" },
  "Six Flags Over Texas": { 
    Region: "Texas", 
    url: "overtexas", 
    "Silver": "$70", 
    "Gold": "$99", 
    "Prestige": "$155" },
  "California's Great America": { 
    Region: "West", 
    url: "cagreatamerica", 
    "Gold": "$85" },
  "Knott's Berry Farm": { 
    Region: "West", 
    url: "knotts", 
    "Silver": "$110", 
    "Gold": "$140", 
    "Prestige": "$300" },
  "Six Flags Discovery Kingdom": { 
    Region: "West", 
    url: "discoverykingdom", 
    "Silver": "$65", 
    "Gold": "$79", 
    "Prestige": "$145" },
  "Six Flags Magic Mountain": { 
    Region: "West", 
    url: "magicmountain", 
    "Silver": "$90", 
    "Gold": "$115", 
    "Prestige": "$250" },
  "Six Flags Mexico": { 
    Region: "West", 
    url: "mexico", 
    currency: "MXN", 
    "Silver": "$1300", 
    "Gold": "$1500", 
    "Prestige": "$2900" }
};

function buildParkLinks(parkName, parkConfig) {
  if (parkConfig.url) {
    const baseUrl = `https://www.sixflags.com/${parkConfig.url}`;
    const passPath = sixFlagsPassPathByParkName[parkName] || "season-passes";
    return {
      website: baseUrl,
      passPurchaseUrl: `${baseUrl}/${passPath}`
    };
  }

  const website = parkConfig.website || "#";
  return {
    website,
    passPurchaseUrl: parkConfig.passPurchaseUrl || website
  };
}

const parkDirectoryByRegion = Object.fromEntries(regionOrder.map((region) => [region, []]));
for (const [parkName, parkConfig] of Object.entries(parkCatalog)) {
  const region = parkConfig.Region;
  const links = buildParkLinks(parkName, parkConfig);
  if (!parkDirectoryByRegion[region]) {
    parkDirectoryByRegion[region] = [];
  }
  parkDirectoryByRegion[region].push({
    name: parkName,
    website: links.website,
    passPurchaseUrl: links.passPurchaseUrl
  });
}

const parkDirectory = Object.values(parkDirectoryByRegion).flat();
const parkByName = Object.fromEntries(parkDirectory.map((park) => [park.name, park]));
const regionParks = Object.fromEntries(
  Object.entries(parkDirectoryByRegion).map(([region, parks]) => [region, parks.map((park) => park.name)])
);
regionParks["All Parks"] = parkDirectory.map((park) => park.name);

const passCatalog = Object.fromEntries(passTypeOrderList.map((passType) => [passType, []]));
for (const [parkName, parkConfig] of Object.entries(parkCatalog)) {
  for (const passType of passTypeOrderList) {
    const passField = passFieldByType[passType];
    const configuredValue = parkConfig[passField];
    if (!configuredValue) {
      continue;
    }

    const offer = {
      park: parkName,
      price: configuredValue
    };
    if (parkConfig.currency && parkConfig.currency !== "USD") {
      offer.currency = parkConfig.currency;
    }

    passCatalog[passType].push(offer);
  }
}

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getParkWebsiteUrl(parkName) {
  return parkByName[parkName]?.website || "#";
}

function getPassPurchaseUrl(offer) {
  return parkByName[offer.homePark]?.passPurchaseUrl || getParkWebsiteUrl(offer.homePark);
}

const parkRegionByName = {};
for (const [region, parks] of Object.entries(regionParks)) {
  if (region === "All Parks") {
    continue;
  }
  for (const park of parks) {
    parkRegionByName[park] = region;
  }
}

function getDefaultAccessibleParks(passType, homePark) {
  if (passType === "Silver") {
    return [homePark];
  }
  if (passType === "Gold") {
    return [parkRegionByName[homePark] || homePark];
  }
  return ["All Parks"];
}

const homePrestigeOnlyParkingParks = new Set(["Canada's Wonderland", "La Ronde"]);
const prestigeParkingOnlyParks = new Set(["Knott's Berry Farm"]);

function hasIncludedParking(offer, parkName) {
  if (homePrestigeOnlyParkingParks.has(parkName)) {
    return offer.passType === "Prestige" && offer.homePark === parkName;
  }

  if (prestigeParkingOnlyParks.has(parkName)) {
    return offer.passType === "Prestige";
  }

  if (offer.passType === "Silver") {
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

const passOffers = Object.entries(passCatalog).flatMap(([passType, offers]) =>
  offers.map((offer) => ({
    id: `${slugify(offer.park)}-${slugify(passType)}`,
    homePark: offer.park,
    passType,
    price: offer.price,
    currency: offer.currency || "USD",
    disclaimer: offer.disclaimer || "",
    accessibleParks: offer.accessibleParks || getDefaultAccessibleParks(passType, offer.park)
  }))
);
const supportedCurrencies = Array.from(
  new Set(passOffers.map((offer) => String(offer.currency || "USD").toUpperCase()))
);

const parkFilterInput = document.getElementById("parkFilterInput");
const parkFilterList = document.getElementById("parkFilterList");
const typeFilter = document.getElementById("typeFilter");
const regionFilter = document.getElementById("regionFilter");
const priceSort = document.getElementById("priceSort");
const passGrid = document.getElementById("passGrid");
const resultsMeta = document.getElementById("resultsMeta");
const template = document.getElementById("passCardTemplate");

const passTypes = Object.keys(passCatalog);
const regions = Object.keys(regionParks);
const filterableRegions = regions.filter((region) => region !== "All Parks");
const passTypeOrder = new Map(passTypes.map((passType, index) => [passType, index]));

function parsePrice(rawPrice) {
  const normalized = String(rawPrice).replace(/[^\d.,]/g, "").replace(/,/g, "");
  return Number.parseFloat(normalized) || 0;
}

const currencyToUsdRate = { USD: 1 };
let exchangeRatesLoaded = false;

function convertToUsd(amount, currency = "USD") {
  const code = String(currency || "USD").toUpperCase();
  const rate = currencyToUsdRate[code];
  if (!Number.isFinite(rate) || rate <= 0) {
    return Number.NaN;
  }
  return amount * rate;
}

function formatUsd(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(amount);
}

async function fetchExchangeRates() {
  const currencies = supportedCurrencies.filter((code) => code !== "USD");
  if (currencies.length === 0) {
    exchangeRatesLoaded = true;
    return;
  }

  const endpoint = new URL("https://api.frankfurter.app/latest");
  endpoint.searchParams.set("from", "USD");
  endpoint.searchParams.set("to", currencies.join(","));

  try {
    const response = await fetch(endpoint.toString());
    if (!response.ok) {
      throw new Error(`Exchange rate API request failed: ${response.status}`);
    }

    const data = await response.json();
    let allRatesResolved = true;
    for (const code of currencies) {
      const usdToCurrency = Number(data?.rates?.[code]);
      if (Number.isFinite(usdToCurrency) && usdToCurrency > 0) {
        currencyToUsdRate[code] = 1 / usdToCurrency;
      } else {
        allRatesResolved = false;
      }
    }
    exchangeRatesLoaded = allRatesResolved;
  } catch (error) {
    exchangeRatesLoaded = false;
    console.error("Error fetching exchange rates. Showing native currency prices.", error);
  }
}

function formatOfferPrice(offer) {
  const code = String(offer.currency || "USD").toUpperCase();
  const rawPrice = String(offer.price || "").trim();
  const numericPrice = parsePrice(rawPrice);
  if (numericPrice <= 0) {
    return rawPrice;
  }

  if (code === "USD") {
    return rawPrice;
  }

  if (!exchangeRatesLoaded) {
    return `${code} ${rawPrice}`;
  }

  const usdPrice = convertToUsd(numericPrice, code);
  if (Number.isFinite(usdPrice)) {
    return `~${formatUsd(usdPrice)}`;
  }

  return `${code} ${rawPrice}`;
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

function setupParkToggle(cardEl) {
  const parkList = cardEl.querySelector(".park-list");
  const parkToggle = cardEl.querySelector(".park-toggle");
  if (!parkList || !parkToggle) {
    return;
  }

  const setCollapsed = (collapsed) => {
    parkList.classList.toggle("is-collapsed", collapsed);
    parkToggle.textContent = collapsed ? "More Parks" : "Less Parks";
    parkToggle.setAttribute("aria-expanded", String(!collapsed));
  };

  setCollapsed(true);
  requestAnimationFrame(() => {
    const hasHorizontalOverflow = parkList.scrollWidth > parkList.clientWidth + 2;
    const hasVerticalOverflow = parkList.scrollHeight > parkList.clientHeight + 2;
    const hasOverflow = hasHorizontalOverflow || hasVerticalOverflow;
    if (!hasOverflow) {
      parkList.classList.remove("is-collapsed");
      parkToggle.hidden = true;
      return;
    }

    parkToggle.hidden = false;
    setCollapsed(true);
    parkToggle.addEventListener("click", () => {
      const isCollapsed = parkList.classList.contains("is-collapsed");
      setCollapsed(!isCollapsed);
    });
  });
}

const allParks = Array.from(
  new Set(passOffers.flatMap((offer) => expandAccessibleParks(offer.accessibleParks)))
).sort((a, b) => a.localeCompare(b));

const parkFilterOptions = [{ value: "all", label: "All Parks" }, ...allParks.map((park) => ({ value: park, label: park }))];
let selectedParkFilterValue = "all";
let highlightedParkOptionIndex = 0;

function syncParkInputWithSelection() {
  if (selectedParkFilterValue === "all") {
    parkFilterInput.value = "";
    return;
  }

  const selectedOption = parkFilterOptions.find((option) => option.value === selectedParkFilterValue);
  parkFilterInput.value = selectedOption ? selectedOption.label : "";
}

function getFilteredParkOptions(query) {
  const normalizedQuery = String(query || "").trim().toLowerCase();
  if (!normalizedQuery) {
    return parkFilterOptions;
  }

  const matchingParkOptions = parkFilterOptions.filter(
    (option) => option.value !== "all" && option.label.toLowerCase().includes(normalizedQuery)
  );
  const allParksOption = parkFilterOptions.find((option) => option.value === "all");
  return allParksOption ? [...matchingParkOptions, allParksOption] : matchingParkOptions;
}

function closeParkFilterDropdown() {
  parkFilterList.hidden = true;
  parkFilterInput.setAttribute("aria-expanded", "false");
}

function openParkFilterDropdown() {
  parkFilterList.hidden = false;
  parkFilterInput.setAttribute("aria-expanded", "true");
}

function renderParkFilterOptions(query = "") {
  const filteredOptions = getFilteredParkOptions(query);
  parkFilterList.innerHTML = "";

  if (filteredOptions.length === 0) {
    const emptyOption = document.createElement("li");
    emptyOption.className = "park-combobox-option is-empty";
    emptyOption.textContent = "No matching parks";
    parkFilterList.appendChild(emptyOption);
    return;
  }

  highlightedParkOptionIndex = Math.min(highlightedParkOptionIndex, filteredOptions.length - 1);

  filteredOptions.forEach((option, index) => {
    const item = document.createElement("li");
    item.className = "park-combobox-option";
    item.setAttribute("role", "option");
    item.dataset.value = option.value;
    item.textContent = option.label;
    if (option.value === selectedParkFilterValue) {
      item.classList.add("is-selected");
    }
    if (index === highlightedParkOptionIndex) {
      item.classList.add("is-highlighted");
    }
    item.addEventListener("mousedown", (event) => {
      event.preventDefault();
      selectedParkFilterValue = option.value;
      syncParkInputWithSelection();
      closeParkFilterDropdown();
      applyFilters();
    });
    parkFilterList.appendChild(item);
  });
}

for (const passType of passTypes) {
  const option = document.createElement("option");
  option.value = passType;
  option.textContent = passType;
  typeFilter.appendChild(option);
}

for (const region of filterableRegions) {
  const option = document.createElement("option");
  option.value = region;
  option.textContent = `${region} Region`;
  regionFilter.appendChild(option);
}

function renderPasses(
  selectedPark = "all",
  selectedType = "all",
  selectedRegion = "all",
  selectedSort = "none"
) {
  passGrid.innerHTML = "";

  let visibleOffers = passOffers
    .map((offer, index) => ({
      ...offer,
      originalIndex: index,
      expandedParks: expandAccessibleParks(offer.accessibleParks),
      numericPrice: exchangeRatesLoaded
        ? convertToUsd(parsePrice(offer.price), offer.currency)
        : parsePrice(offer.price)
    }))
    .filter((offer) => {
      const matchesPark = selectedPark === "all" || offer.expandedParks.includes(selectedPark);
      const matchesType = selectedType === "all" || offer.passType === selectedType;
      const matchesRegion = selectedRegion === "all"
        || offer.expandedParks.some((park) => regionParks[selectedRegion].includes(park));
      return matchesPark && matchesType && matchesRegion;
    });

  const compareBySelectedSort = (a, b) => {
    if (selectedSort === "low-high") {
      return a.numericPrice - b.numericPrice;
    }
    if (selectedSort === "high-low") {
      return b.numericPrice - a.numericPrice;
    }
    return a.originalIndex - b.originalIndex;
  };
  const compareByPassTypeThenOriginal = (a, b) => {
    const typeOrderDiff = (passTypeOrder.get(a.passType) ?? Number.MAX_SAFE_INTEGER)
      - (passTypeOrder.get(b.passType) ?? Number.MAX_SAFE_INTEGER);
    if (typeOrderDiff !== 0) {
      return typeOrderDiff;
    }
    return a.originalIndex - b.originalIndex;
  };

  let otherPassesDividerIndex = -1;
  if (selectedPark !== "all") {
    const selectedParkRegion = parkRegionByName[selectedPark] || "";
    const homeParkOffers = [];
    const sameRegionOffers = [];
    const otherOffers = [];

    for (const offer of visibleOffers) {
      if (offer.homePark === selectedPark) {
        homeParkOffers.push(offer);
      } else if (
        selectedParkRegion
        && parkRegionByName[offer.homePark] === selectedParkRegion
      ) {
        sameRegionOffers.push(offer);
      } else {
        otherOffers.push(offer);
      }
    }

    homeParkOffers.sort(compareByPassTypeThenOriginal);
    sameRegionOffers.sort(compareBySelectedSort);
    otherOffers.sort(compareBySelectedSort);

    otherPassesDividerIndex = homeParkOffers.length > 0 && (sameRegionOffers.length + otherOffers.length) > 0
      ? homeParkOffers.length
      : -1;
    visibleOffers = [...homeParkOffers, ...sameRegionOffers, ...otherOffers];
  } else {
    visibleOffers.sort(compareBySelectedSort);
  }

  resultsMeta.textContent = `Showing ${visibleOffers.length} pass offer${visibleOffers.length === 1 ? "" : "s"}`;

  if (visibleOffers.length === 0) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = "No pass offers match this filter selection.";
    passGrid.appendChild(empty);
    return;
  }

  visibleOffers.forEach((offer, index) => {
    if (index === otherPassesDividerIndex) {
      const divider = document.createElement("p");
      divider.className = "results-divider";
      divider.textContent = "Other passes that include this park";
      passGrid.appendChild(divider);
    }

    const node = template.content.cloneNode(true);
    const passNameEl = node.querySelector(".pass-name");
    passNameEl.textContent = `${offer.homePark} - ${offer.passType} Pass`;
    node.querySelector(".pass-price").textContent = formatOfferPrice(offer);
    const cardEl = node.querySelector(".pass-card");

    const parksToDisplay = selectedRegion === "all"
      ? offer.expandedParks
      : offer.expandedParks.filter((park) => regionParks[selectedRegion].includes(park));

    const parkList = node.querySelector(".park-list");
    for (const parkName of parksToDisplay) {
      const li = document.createElement("li");
      const parkLink = document.createElement("a");
      parkLink.className = "park-tag-link";
      parkLink.href = getParkWebsiteUrl(parkName);
      parkLink.target = "_blank";
      parkLink.rel = "noopener noreferrer";
      parkLink.textContent = parkName;
      li.appendChild(parkLink);
      parkList.appendChild(li);
    }

    const disclaimerEl = node.querySelector(".pass-disclaimer");
    const disclaimerText = buildParkingDisclaimer(offer, offer.expandedParks);
    disclaimerEl.hidden = false;
    const buyLink = document.createElement("a");
    buyLink.className = "pass-buy-link";
    buyLink.href = getPassPurchaseUrl(offer);
    buyLink.target = "_blank";
    buyLink.rel = "noopener noreferrer";
    buyLink.textContent = "Buy This Pass";
    disclaimerEl.textContent = "";
    disclaimerEl.appendChild(buyLink);
    if (disclaimerText) {
      disclaimerEl.appendChild(document.createTextNode(` • ${disclaimerText}`));
    }

    passGrid.appendChild(node);
    setupParkToggle(cardEl);
  });
}

function applyFilters() {
  renderPasses(selectedParkFilterValue, typeFilter.value, regionFilter.value, priceSort.value);
}

parkFilterInput.addEventListener("focus", () => {
  highlightedParkOptionIndex = 0;
  renderParkFilterOptions(parkFilterInput.value);
  openParkFilterDropdown();
});

parkFilterInput.addEventListener("click", () => {
  renderParkFilterOptions(parkFilterInput.value);
  openParkFilterDropdown();
});

parkFilterInput.addEventListener("input", () => {
  const query = parkFilterInput.value;
  const normalizedQuery = String(query || "").trim().toLowerCase();
  highlightedParkOptionIndex = 0;
  renderParkFilterOptions(query);
  openParkFilterDropdown();

  if (!normalizedQuery) {
    selectedParkFilterValue = "all";
    applyFilters();
    return;
  }

  const matchingParks = parkFilterOptions.filter(
    (option) => option.value !== "all" && option.label.toLowerCase().includes(normalizedQuery)
  );
  const exactMatch = matchingParks.find((option) => option.label.toLowerCase() === normalizedQuery);
  const autoSelectedOption = exactMatch || (matchingParks.length === 1 ? matchingParks[0] : null);

  if (!autoSelectedOption) {
    return;
  }

  selectedParkFilterValue = autoSelectedOption.value;
  applyFilters();
});

parkFilterInput.addEventListener("keydown", (event) => {
  const filteredOptions = getFilteredParkOptions(parkFilterInput.value);
  if (filteredOptions.length === 0) {
    if (event.key === "Escape") {
      closeParkFilterDropdown();
    }
    return;
  }

  if (event.key === "ArrowDown") {
    event.preventDefault();
    highlightedParkOptionIndex = Math.min(highlightedParkOptionIndex + 1, filteredOptions.length - 1);
    renderParkFilterOptions(parkFilterInput.value);
    openParkFilterDropdown();
    return;
  }

  if (event.key === "ArrowUp") {
    event.preventDefault();
    highlightedParkOptionIndex = Math.max(highlightedParkOptionIndex - 1, 0);
    renderParkFilterOptions(parkFilterInput.value);
    openParkFilterDropdown();
    return;
  }

  if (event.key === "Enter") {
    event.preventDefault();
    const normalizedQuery = String(parkFilterInput.value || "").trim().toLowerCase();
    if (!normalizedQuery) {
      selectedParkFilterValue = "all";
    } else {
      const parkOnlyOptions = filteredOptions.filter((option) => option.value !== "all");
      const exactMatch = parkOnlyOptions.find((option) => option.label.toLowerCase() === normalizedQuery);
      const highlightedOption = filteredOptions[highlightedParkOptionIndex];
      const fallbackOption = parkOnlyOptions[0];
      const selectedOption = exactMatch
        || (highlightedOption && highlightedOption.value !== "all" ? highlightedOption : null)
        || fallbackOption;

      selectedParkFilterValue = selectedOption ? selectedOption.value : "all";
    }

    syncParkInputWithSelection();
    closeParkFilterDropdown();
    applyFilters();
    return;
  }

  if (event.key === "Escape") {
    closeParkFilterDropdown();
  }
});

document.addEventListener("click", (event) => {
  const target = event.target;
  if (target instanceof Node && !parkFilterInput.contains(target) && !parkFilterList.contains(target)) {
    closeParkFilterDropdown();
  }
});

parkFilterInput.addEventListener("blur", () => {
  setTimeout(() => {
    syncParkInputWithSelection();
    closeParkFilterDropdown();
  }, 0);
});

typeFilter.addEventListener("change", applyFilters);
regionFilter.addEventListener("change", applyFilters);
priceSort.addEventListener("change", applyFilters);

renderParkFilterOptions();
syncParkInputWithSelection();
renderPasses();
fetchExchangeRates().finally(() => {
  applyFilters();
});
