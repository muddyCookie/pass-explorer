const parkDirectoryByRegion = {
  "East Region": [
    { name: "Carowinds", website: "https://www.sixflags.com/carowinds", passPurchaseUrl: "https://www.sixflags.com/carowinds/season-passes" },
    { name: "Dorney Park", website: "https://www.sixflags.com/dorneypark", passPurchaseUrl: "https://www.sixflags.com/dorneypark/season-passes" },
    { name: "Kings Dominion", website: "https://www.sixflags.com/kingsdominion", passPurchaseUrl: "https://www.sixflags.com/kingsdominion/season-passes" },
    { name: "Six Flags Great Adventure", website: "https://www.sixflags.com/greatadventure", passPurchaseUrl: "https://www.sixflags.com/greatadventure/season-passes" },
    { name: "Six Flags Great Escape", website: "https://www.sixflags.com/greatescape", passPurchaseUrl: "https://www.sixflags.com/greatescape/season-passes" },
    { name: "Six Flags New England", website: "https://www.sixflags.com/newengland", passPurchaseUrl: "https://www.sixflags.com/newengland/season-passes" },
    { name: "Six Flags Over Georgia", website: "https://www.sixflags.com/overgeorgia", passPurchaseUrl: "https://www.sixflags.com/overgeorgia/season-passes" }
  ],
  "Midwest Region": [
    { name: "Canada's Wonderland", website: "https://www.sixflags.com/canadaswonderland", passPurchaseUrl: "https://www.sixflags.com/canadaswonderland/season-passes" },
    { name: "Cedar Point", website: "https://www.sixflags.com/cedarpoint", passPurchaseUrl: "https://www.sixflags.com/cedarpoint/season-passes" },
    { name: "Kings Island", website: "https://www.sixflags.com/kingsisland", passPurchaseUrl: "https://www.sixflags.com/kingsisland/season-passes" },
    { name: "La Ronde", website: "https://www.sixflags.com/laronde", passPurchaseUrl: "https://www.sixflags.com/laronde/passeports" },
    { name: "Michigan's Adventure", website: "https://www.sixflags.com/miadventure", passPurchaseUrl: "https://www.sixflags.com/miadventure/season-passes" },
    { name: "Six Flags Darien Lake", website: "https://www.sixflags.com/darienlake", passPurchaseUrl: "https://www.sixflags.com/darienlake/season-passes" },
    { name: "Six Flags Great America", website: "https://www.sixflags.com/greatamerica", passPurchaseUrl: "https://www.sixflags.com/greatamerica/season-passes" },
    { name: "Six Flags St. Louis", website: "https://www.sixflags.com/stlouis", passPurchaseUrl: "https://www.sixflags.com/stlouis/season-passes" },
    { name: "Valleyfair", website: "https://www.sixflags.com/valleyfair", passPurchaseUrl: "https://www.sixflags.com/valleyfair/season-passes" },
    { name: "Worlds of Fun", website: "https://www.sixflags.com/worldsoffun", passPurchaseUrl: "https://www.sixflags.com/worldsoffun/season-passes" }
  ],
  "Texas Region": [
    { name: "Frontier City", website: "https://www.sixflags.com/frontiercity", passPurchaseUrl: "https://www.sixflags.com/frontiercity/season-passes" },
    { name: "Six Flags Fiesta Texas", website: "https://www.sixflags.com/fiestatexas", passPurchaseUrl: "https://www.sixflags.com/fiestatexas/season-passes" },
    { name: "Six Flags Over Texas", website: "https://www.sixflags.com/overtexas", passPurchaseUrl: "https://www.sixflags.com/overtexas/season-passes" }
  ],
  "West Region": [
    { name: "California's Great America", website: "https://www.sixflags.com/cagreatamerica", passPurchaseUrl: "https://www.sixflags.com/cagreatamerica/season-passes" },
    { name: "Knott's Berry Farm", website: "https://www.sixflags.com/knotts", passPurchaseUrl: "https://www.sixflags.com/knotts/season-passes" },
    { name: "Six Flags Discovery Kingdom", website: "https://www.sixflags.com/discoverykingdom", passPurchaseUrl: "https://www.sixflags.com/discoverykingdom/season-passes" },
    { name: "Six Flags Magic Mountain", website: "https://www.sixflags.com/magicmountain", passPurchaseUrl: "https://www.sixflags.com/magicmountain/season-passes" },
    { name: "Six Flags Mexico", website: "https://www.sixflags.com/mexico", passPurchaseUrl: "https://www.sixflags.com/mexico/season-passes" }
  ]
};

const parkDirectory = Object.values(parkDirectoryByRegion).flat();
const parkByName = Object.fromEntries(parkDirectory.map((park) => [park.name, park]));
const regionParks = Object.fromEntries(
  Object.entries(parkDirectoryByRegion).map(([region, parks]) => [region, parks.map((park) => park.name)])
);
regionParks["All Parks"] = parkDirectory.map((park) => park.name);

const passCatalog = {
  Silver: [
    { park: "Canada's Wonderland", price: "$89", currency: "CAD" },
    { park: "Carowinds", price: "$89" },
    { park: "Cedar Point", price: "$99" },
    { park: "Frontier City", price: "$55" },
    { park: "Kings Dominion", price: "$89" },
    { park: "Kings Island", price: "$105" },
    { park: "Knott's Berry Farm", price: "$110" },
    { park: "La Ronde", price: "$73", currency: "CAD" },
    { park: "Six Flags Discovery Kingdom", price: "$65" },
    { park: "Six Flags Fiesta Texas", price: "$70" },
    { park: "Six Flags Great Adventure", price: "$70" },
    { park: "Six Flags Great America", price: "$79" },
    { park: "Six Flags Magic Mountain", price: "$90" },
    { park: "Six Flags Mexico", price: "$1300", currency: "MXN" },
    { park: "Six Flags New England", price: "$70" },
    { park: "Six Flags Over Georgia", price: "$65" },
    { park: "Six Flags Over Texas", price: "$70" },
    { park: "Six Flags St. Louis", price: "$59" },
    { park: "Worlds of Fun", price: "$65" }
  ],
  Gold: [
    { park: "California's Great America", price: "$85" },
    { park: "Canada's Wonderland", price: "$125", currency: "CAD" },
    { park: "Carowinds", price: "$110" },
    { park: "Cedar Point", price: "$150" },
    { park: "Dorney Park", price: "$105" },
    { park: "Frontier City", price: "$79" },
    { park: "Kings Dominion", price: "$110" },
    { park: "Kings Island", price: "$145" },
    { park: "Knott's Berry Farm", price: "$140" },
    { park: "La Ronde", price: "$95", currency: "CAD" },
    { park: "Michigan's Adventure", price: "$110" },
    { park: "Six Flags Darien Lake", price: "$75" },
    { park: "Six Flags Discovery Kingdom", price: "$79" },
    { park: "Six Flags Fiesta Texas", price: "$99" },
    { park: "Six Flags Great Adventure", price: "$89" },
    { park: "Six Flags Great America", price: "$99" },
    { park: "Six Flags Great Escape", price: "$65" },
    { park: "Six Flags Magic Mountain", price: "$115" },
    { park: "Six Flags Mexico", price: "$1500", currency: "MXN" },
    { park: "Six Flags New England", price: "$89" },
    { park: "Six Flags Over Georgia", price: "$89" },
    { park: "Six Flags Over Texas", price: "$99" },
    { park: "Six Flags St. Louis", price: "$75" },
    { park: "Valleyfair", price: "$85" },
    { park: "Worlds of Fun", price: "$90" }
  ],
  Prestige: [
    { park: "Canada's Wonderland", price: "$210", currency: "CAD" },
    { park: "Carowinds", price: "$165" },
    { park: "Cedar Point", price: "$250" },
    { park: "Dorney Park", price: "$145" },
    { park: "Frontier City", price: "$125" },
    { park: "Kings Dominion", price: "$199" },
    { park: "Kings Island", price: "$225" },
    { park: "Knott's Berry Farm", price: "$300" },
    { park: "La Ronde", price: "$150", currency: "CAD" },
    { park: "Michigan's Adventure", price: "$190" },
    { park: "Six Flags Darien Lake", price: "$135" },
    { park: "Six Flags Discovery Kingdom", price: "$145" },
    { park: "Six Flags Fiesta Texas", price: "$145" },
    { park: "Six Flags Great Adventure", price: "$155" },
    { park: "Six Flags Great America", price: "$145" },
    { park: "Six Flags Great Escape", price: "$135" },
    { park: "Six Flags Magic Mountain", price: "$250" },
    { park: "Six Flags Mexico", price: "$2900", currency: "MXN" },
    { park: "Six Flags New England", price: "$145" },
    { park: "Six Flags Over Georgia", price: "$145" },
    { park: "Six Flags Over Texas", price: "$155" },
    { park: "Six Flags St. Louis", price: "$135" },
    { park: "Valleyfair", price: "$125" },
    { park: "Worlds of Fun", price: "$125" }
  ]
};

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
  const normalized = String(rawPrice).replace(/[^\d.]/g, "");
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
  if (code === "USD") {
    return rawPrice;
  }

  if (!exchangeRatesLoaded) {
    return `${code} ${rawPrice}`;
  }

  const usdPrice = convertToUsd(parsePrice(rawPrice), code);
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

  return parkFilterOptions.filter((option) => option.value === "all" || option.label.toLowerCase().includes(normalizedQuery));
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
  option.textContent = region;
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
  highlightedParkOptionIndex = 0;
  renderParkFilterOptions(parkFilterInput.value);
  openParkFilterDropdown();
  selectedParkFilterValue = "all";
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
    const selectedOption = filteredOptions[highlightedParkOptionIndex] || filteredOptions[0];
    selectedParkFilterValue = selectedOption.value;
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
fetchExchangeRates().then(() => {
  applyFilters();
});
