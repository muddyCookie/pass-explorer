const passOffers = [
  {
    id: "cga-gold",
    homePark: "California's Great America",
    passType: "Gold",
    price: "$85",
    disclaimer: "Parking is not included at Knott's Berry Farm",
    accessibleParks: ["West Region"]
  },
  {
    id: "cwl-silver",
    homePark: "Canada's Wonderland",
    passType: "Silver",
    price: "$89",
    disclaimer: "Parking is not included at Canada's Wonderland",
    accessibleParks: ["Canada's Wonderland"]
  },
  {
    id: "cwl-gold",
    homePark: "Canada's Wonderland",
    passType: "Gold",
    price: "$125",
    disclaimer: "Parking is not included at Canada's Wonderland",
    accessibleParks: ["Midwest Region"]
  },
  {
    id: "cwl-prestige",
    homePark: "Canada's Wonderland",
    passType: "Prestige",
    price: "$210",
    disclaimer: "Parking is not included at La Ronde",
    accessibleParks: ["All Parks"]
  },
  {
    id: "cw-silver",
    homePark: "Carowinds",
    passType: "Silver",
    price: "$89",
    disclaimer: "",
    accessibleParks: ["Carowinds"]
  },
  {
    id: "cw-gold",
    homePark: "Carowinds",
    passType: "Gold",
    price: "$110",
    disclaimer: "",
    accessibleParks: ["East Region"]
  },
  {
    id: "cw-prestige",
    homePark: "Carowinds",
    passType: "Prestige",
    price: "$165",
    disclaimer: "Parking is not included at Canada's Wonderland and La Ronde",
    accessibleParks: ["All Parks"]
  },
  {
    id: "cp-silver",
    homePark: "Cedar Point",
    passType: "Silver",
    price: "$99",
    disclaimer: "",
    accessibleParks: ["Cedar Point"]
  },
  {
    id: "cp-gold",
    homePark: "Cedar Point",
    passType: "Gold",
    price: "$150",
    disclaimer: "",
    accessibleParks: ["Midwest Region"]
  },
  {
    id: "cp-prestige",
    homePark: "Cedar Point",
    passType: "Prestige",
    price: "$250",
    disclaimer: "Parking is not included at Canada's Wonderland and La Ronde",
    accessibleParks: ["All Parks"]
  },
  {
    id: "dp-gold",
    homePark: "Dorney Park",
    passType: "Gold",
    price: "$105",
    disclaimer: "",
    accessibleParks: ["East Region"]
  },
  {
    id: "dp-prestige",
    homePark: "Dorney Park",
    passType: "Prestige",
    price: "$145",
    disclaimer: "Parking is not included at Canada's Wonderland and La Ronde",
    accessibleParks: ["All Parks"]
  },
  {
    id: "fc-silver",
    homePark: "Frontier City",
    passType: "Silver",
    price: "$55",
    disclaimer: "",
    accessibleParks: ["Frontier City"]
  },
  {
    id: "fc-gold",
    homePark: "Frontier City",
    passType: "Gold",
    price: "$79",
    disclaimer: "",
    accessibleParks: ["Texas Region"]
  },
  {
    id: "fc-prestige",
    homePark: "Frontier City",
    passType: "Prestige",
    price: "$125",
    disclaimer: "Parking is not included at Canada's Wonderland and La Ronde",
    accessibleParks: ["All Parks"]
  },
  {
    id: "kd-silver",
    homePark: "Kings Dominion",
    passType: "Silver",
    price: "$89",
    disclaimer: "",
    accessibleParks: ["Kings Dominion"]
  },
  {
    id: "kd-gold",
    homePark: "Kings Dominion",
    passType: "Gold",
    price: "$110",
    disclaimer: "",
    accessibleParks: ["East Region"]
  },
  {
    id: "kd-prestige",
    homePark: "Kings Dominion",
    passType: "Prestige",
    price: "$199",
    disclaimer: "Parking is not included at Canada's Wonderland and La Ronde",
    accessibleParks: ["All Parks"]
  },
  {
    id: "ki-silver",
    homePark: "Kings Island",
    passType: "Silver",
    price: "$105",
    disclaimer: "",
    accessibleParks: ["Kings Island"]
  },
  {
    id: "ki-gold",
    homePark: "Kings Island",
    passType: "Gold",
    price: "$145",
    disclaimer: "",
    accessibleParks: ["Midwest Region"]
  },
  {
    id: "ki-prestige",
    homePark: "Kings Island",
    passType: "Prestige",
    price: "$225",
    disclaimer: "Parking is not included at Canada's Wonderland and La Ronde",
    accessibleParks: ["All Parks"]
  },
  {
    id: "kbf-silver",
    homePark: "Knott's Berry Farm",
    passType: "Silver",
    price: "$110",
    disclaimer: "Parking is not included at Knott's Berry Farm",
    accessibleParks: ["Knott's Berry Farm"]
  },
  {
    id: "kbf-gold",
    homePark: "Knott's Berry Farm",
    passType: "Gold",
    price: "$140",
    disclaimer: "Parking is not included at Knott's Berry Farm",
    accessibleParks: ["West Region"]
  },
  {
    id: "kbf-prestige",
    homePark: "Knott's Berry Farm",
    passType: "Prestige",
    price: "$300",
    disclaimer: "Parking is not included at Canada's Wonderland and La Ronde",
    accessibleParks: ["All Parks"]
  },
  {
    id: "lr-silver",
    homePark: "La Ronde",
    passType: "Silver",
    price: "$73",
    disclaimer: "",
    accessibleParks: ["La Ronde"]
  },
  {
    id: "lr-gold",
    homePark: "La Ronde",
    passType: "Gold",
    price: "$95",
    disclaimer: "Parking is not included at Canada's Wonderland",
    accessibleParks: ["Midwest Region"]
  },
  {
    id: "lr-prestige",
    homePark: "La Ronde",
    passType: "Prestige",
    price: "$150",
    disclaimer: "Parking is not included at Canada's Wonderland",
    accessibleParks: ["All Parks"]
  }
];

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

const parkFilter = document.getElementById("parkFilter");
const typeFilter = document.getElementById("typeFilter");
const regionFilter = document.getElementById("regionFilter");
const priceSort = document.getElementById("priceSort");
const passGrid = document.getElementById("passGrid");
const resultsMeta = document.getElementById("resultsMeta");
const template = document.getElementById("passCardTemplate");

const passTypes = ["Silver", "Gold", "Prestige"];
const regions = Object.keys(regionParks);
const filterableRegions = regions.filter((region) => region !== "All Parks");

function parsePrice(rawPrice) {
  const normalized = String(rawPrice).replace(/[^\d.]/g, "");
  return Number.parseFloat(normalized) || 0;
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
      numericPrice: parsePrice(offer.price)
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
    node.querySelector(".pass-price").textContent = offer.price;

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
    if (offer.disclaimer && offer.disclaimer.trim()) {
      disclaimerEl.textContent = offer.disclaimer;
      disclaimerEl.hidden = false;
    }

    passGrid.appendChild(node);
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
