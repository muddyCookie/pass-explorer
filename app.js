const regionParks = {
  "East Region": [
    "Carowinds",
    "Dorney Park",
    "Kings Dominion",
    "Six Flags Great Adventure",
    "Six Flags Great Escape",
    "Six Flags New England",
    "Six Flags Over Georgia"
  ],
  "Midwest Region": [
    "Canada's Wonderland",
    "Cedar Point",
    "Kings Island",
    "La Ronde",
    "Michigan's Adventure",
    "Six Flags Darien Lake",
    "Six Flags Great America",
    "Six Flags St. Louis",
    "Valleyfair",
    "Worlds of Fun"
  ],
  "Texas Region": [
    "Frontier City",
    "Six Flags Fiesta Texas",
    "Six Flags Over Texas"
  ],
  "West Region": [
    "California's Great America",
    "Knott's Berry Farm",
    "Six Flags Discovery Kingdom",
    "Six Flags Magic Mountain",
    "Six Flags Mexico"
  ],
  "All Parks": [
    "California's Great America",
    "Canada's Wonderland",
    "Carowinds",
    "Cedar Point",
    "Dorney Park",
    "Frontier City",
    "Kings Dominion",
    "Kings Island",
    "Knott's Berry Farm",
    "La Ronde",
    "Michigan's Adventure",
    "Six Flags Darien Lake",
    "Six Flags Discovery Kingdom",
    "Six Flags Fiesta Texas",
    "Six Flags Great Adventure",
    "Six Flags Great America",
    "Six Flags Great Escape",
    "Six Flags Magic Mountain",
    "Six Flags Mexico",
    "Six Flags New England",
    "Six Flags Over Georgia",
    "Six Flags Over Texas",
    "Six Flags St. Louis",
    "Valleyfair",
    "Worlds of Fun"
  ]
};

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

const parkFilter = document.getElementById("parkFilter");
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

for (const park of allParks) {
  const option = document.createElement("option");
  option.value = park;
  option.textContent = park;
  parkFilter.appendChild(option);
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

function renderPasses(selectedPark = "all", selectedType = "all", selectedRegion = "all", selectedSort = "none") {
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
    node.querySelector(".pass-name").textContent = `${offer.homePark} - ${offer.passType} Pass`;
    node.querySelector(".pass-price").textContent = formatOfferPrice(offer);
    const cardEl = node.querySelector(".pass-card");

    const parksToDisplay = selectedRegion === "all"
      ? offer.expandedParks
      : offer.expandedParks.filter((park) => regionParks[selectedRegion].includes(park));

    const parkList = node.querySelector(".park-list");
    for (const parkName of parksToDisplay) {
      const li = document.createElement("li");
      li.textContent = parkName;
      parkList.appendChild(li);
    }

    const disclaimerEl = node.querySelector(".pass-disclaimer");
    const disclaimerText = buildParkingDisclaimer(offer, offer.expandedParks);
    if (disclaimerText) {
      disclaimerEl.textContent = disclaimerText;
      disclaimerEl.hidden = false;
    }

    passGrid.appendChild(node);
    setupParkToggle(cardEl);
  });
}

function applyFilters() {
  renderPasses(parkFilter.value, typeFilter.value, regionFilter.value, priceSort.value);
}

parkFilter.addEventListener("change", applyFilters);
typeFilter.addEventListener("change", applyFilters);
regionFilter.addEventListener("change", applyFilters);
priceSort.addEventListener("change", applyFilters);

renderPasses();
fetchExchangeRates().then(() => {
  renderPasses(parkFilter.value, typeFilter.value, regionFilter.value, priceSort.value);
});
