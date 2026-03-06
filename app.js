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
const currencyToUsdRate = { 
    "USD": 1,
    "EUR": 0.85,
    "JPY": 110,
    "GBP": 0.75,
    // ... other currencies
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

function parsePrice(rawPrice) {
  const normalized = String(rawPrice).replace(/[^\d.]/g, "");
  return Number.parseFloat(normalized) || 0;
}

// Update these rates whenever you want a closer USD conversion.
const currencyToUsdRate = {
  USD: 1,
  CAD: 0.74,
  MXN: 0.058
};

function convertToUsd(amount, currency = "USD") {
  const code = String(currency || "USD").toUpperCase();
  const rate = currencyToUsdRate[code] || 1;
  return amount * rate;
}

function formatUsd(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(amount);
}

function expandAccessibleParks(accessEntries) {
  const expanded = [];
  const seen = new Set();

  for (const rawEntry of accessEntries) {
    const entry = String(rawEntry || "").trim();
    if (!entry) {
      continue;
async function fetchExchangeRates() {
    try {
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        Object.keys(currencyToUsdRate).forEach(currency => {
            if (data.rates[currency]) {
                currencyToUsdRate[currency] = data.rates[currency];
            }
        });
    } catch (error) {
        console.error('Error fetching exchange rates:', error);
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

  const visibleOffers = passOffers
    .map((offer) => ({
      ...offer,
      expandedParks: expandAccessibleParks(offer.accessibleParks),
      numericPrice: convertToUsd(parsePrice(offer.price), offer.currency)
    }))
    .filter((offer) => {
      const matchesPark = selectedPark === "all" || offer.expandedParks.includes(selectedPark);
      const matchesType = selectedType === "all" || offer.passType === selectedType;
      const matchesRegion = selectedRegion === "all"
        || offer.expandedParks.some((park) => regionParks[selectedRegion].includes(park));
      return matchesPark && matchesType && matchesRegion;
    });

  if (selectedSort === "low-high") {
    visibleOffers.sort((a, b) => a.numericPrice - b.numericPrice);
  } else if (selectedSort === "high-low") {
    visibleOffers.sort((a, b) => b.numericPrice - a.numericPrice);
  }

  resultsMeta.textContent = `Showing ${visibleOffers.length} pass offer${visibleOffers.length === 1 ? "" : "s"}`;

  if (visibleOffers.length === 0) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = "No pass offers match this filter selection.";
    passGrid.appendChild(empty);
    return;
  }

  for (const offer of visibleOffers) {
    const node = template.content.cloneNode(true);
    node.querySelector(".pass-name").textContent = `${offer.homePark} - ${offer.passType} Pass`;
    const usdPrice = convertToUsd(parsePrice(offer.price), offer.currency);
    node.querySelector(".pass-price").textContent = `~${formatUsd(usdPrice)}`;
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
  }
}

function applyFilters() {
  renderPasses(parkFilter.value, typeFilter.value, regionFilter.value, priceSort.value);
}

parkFilter.addEventListener("change", applyFilters);
typeFilter.addEventListener("change", applyFilters);
regionFilter.addEventListener("change", applyFilters);
priceSort.addEventListener("change", applyFilters);

renderPasses();
// Call fetchExchangeRates after DOM elements are retrieved but before rendering passes
document.addEventListener('DOMContentLoaded', async () => {
    await fetchExchangeRates();
    // Call the function that renders your currencies here
    renderCurrencies();
});