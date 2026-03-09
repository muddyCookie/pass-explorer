function ensureCompanyFilterCombobox() {
  let companyFilterInput = document.getElementById("companyFilterInput");
  let companyFilterList = document.getElementById("companyFilterList");
  if (companyFilterInput && companyFilterList) {
    return { companyFilterInput, companyFilterList };
  }

  const controls = document.querySelector(".controls");
  if (!controls) {
    return { companyFilterInput: null, companyFilterList: null };
  }

  let companyControl = document.getElementById("companyFilter")?.closest(".control")
    || document.getElementById("companyFilterInput")?.closest(".control");
  if (!companyControl) {
    companyControl = document.createElement("div");
    companyControl.className = "control";
    controls.insertBefore(companyControl, controls.firstElementChild);
  }

  companyControl.innerHTML = `
    <label for="companyFilterInput">Company</label>
    <div class="park-combobox">
      <input
        id="companyFilterInput"
        type="search"
        placeholder="Search companies"
        autocomplete="off"
        aria-haspopup="listbox"
        aria-expanded="false"
        aria-controls="companyFilterList"
      >
      <ul id="companyFilterList" class="park-combobox-list" role="listbox" hidden></ul>
    </div>
  `;

  companyFilterInput = document.getElementById("companyFilterInput");
  companyFilterList = document.getElementById("companyFilterList");
  return { companyFilterInput, companyFilterList };
}

const parkFilterInput = document.getElementById("parkFilterInput");
const parkFilterList = document.getElementById("parkFilterList");
const { companyFilterInput, companyFilterList } = ensureCompanyFilterCombobox();
const typeFilter = document.getElementById("typeFilter");
const priceSort = document.getElementById("priceSort");
const passGrid = document.getElementById("passGrid");
const resultsMeta = document.getElementById("resultsMeta");
const template = document.getElementById("passCardTemplate");

let selectedParkFilterValue = "all";
let highlightedParkOptionIndex = 0;
let selectedCompanyFilterValue = "all";
let highlightedCompanyOptionIndex = 0;

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

function getCompanyTierOptions(companyName) {
  const preferredTierOrder = ["Summer", "Bronze", "Silver", "Gold", "Diamond", "Platinum", "Prestige"];
  if (companyName === "all") {
    const availableTierSet = new Set();
    for (const company of companies) {
      for (const tierName of tierSetByCompany[company] || []) {
        availableTierSet.add(tierName);
      }
    }

    const orderedPreferredTiers = preferredTierOrder.filter((tierName) => availableTierSet.has(tierName));
    const unorderedTiers = Array.from(availableTierSet)
      .filter((tierName) => !preferredTierOrder.includes(tierName))
      .sort((a, b) => a.localeCompare(b));
    return [...orderedPreferredTiers, ...unorderedTiers];
  }

  const companyTierSet = tierSetByCompany[companyName] || new Set();
  const orderedTiers = preferredTierOrder.filter((tierName) => companyTierSet.has(tierName));
  const unorderedTiers = Array.from(companyTierSet)
    .filter((tierName) => !preferredTierOrder.includes(tierName))
    .sort((a, b) => a.localeCompare(b));
  return [...orderedTiers, ...unorderedTiers];
}

function getPassTypeOrderMap(selectedCompany) {
  return new Map(getCompanyTierOptions(selectedCompany).map((tierName, index) => [tierName, index]));
}

function renderTypeFilterOptions(selectedCompany) {
  const availableTiers = getCompanyTierOptions(selectedCompany);
  const currentSelection = typeFilter.value;
  typeFilter.innerHTML = "";

  const allOption = document.createElement("option");
  allOption.value = "all";
  allOption.textContent = "All Tiers";
  typeFilter.appendChild(allOption);

  for (const tierName of availableTiers) {
    const option = document.createElement("option");
    option.value = tierName;
    option.textContent = tierName;
    typeFilter.appendChild(option);
  }

  const isSelectionStillValid = currentSelection === "all"
    || availableTiers.includes(currentSelection);
  typeFilter.value = isSelectionStillValid ? currentSelection : "all";
}

function syncCompanyInputWithSelection() {
  if (!companyFilterInput) {
    return;
  }
  if (selectedCompanyFilterValue === "all") {
    companyFilterInput.value = "";
    return;
  }

  const selectedOption = companyFilterOptions.find((option) => option.value === selectedCompanyFilterValue);
  companyFilterInput.value = selectedOption ? selectedOption.label : "";
}

function getFilteredCompanyOptions(query) {
  const normalizedQuery = String(query || "").trim().toLowerCase();
  if (!normalizedQuery) {
    return companyFilterOptions;
  }

  const matchingOptions = companyFilterOptions.filter(
    (option) => option.value !== "all" && option.label.toLowerCase().includes(normalizedQuery)
  );
  const allCompaniesOption = companyFilterOptions.find((option) => option.value === "all");
  return allCompaniesOption ? [...matchingOptions, allCompaniesOption] : matchingOptions;
}

function closeCompanyFilterDropdown() {
  if (!companyFilterList || !companyFilterInput) {
    return;
  }
  companyFilterList.hidden = true;
  companyFilterInput.setAttribute("aria-expanded", "false");
}

function openCompanyFilterDropdown() {
  if (!companyFilterList || !companyFilterInput) {
    return;
  }
  companyFilterList.hidden = false;
  companyFilterInput.setAttribute("aria-expanded", "true");
}

function renderCompanyFilterOptions(query = "") {
  if (!companyFilterList) {
    return;
  }
  const filteredOptions = getFilteredCompanyOptions(query);
  companyFilterList.innerHTML = "";

  if (filteredOptions.length === 0) {
    const emptyOption = document.createElement("li");
    emptyOption.className = "park-combobox-option is-empty";
    emptyOption.textContent = "No matching companies";
    companyFilterList.appendChild(emptyOption);
    return;
  }

  highlightedCompanyOptionIndex = Math.min(highlightedCompanyOptionIndex, filteredOptions.length - 1);

  filteredOptions.forEach((option, index) => {
    const item = document.createElement("li");
    item.className = "park-combobox-option";
    item.setAttribute("role", "option");
    item.dataset.value = option.value;
    item.textContent = option.label;
    if (option.value === selectedCompanyFilterValue) {
      item.classList.add("is-selected");
    }
    if (index === highlightedCompanyOptionIndex) {
      item.classList.add("is-highlighted");
    }
    item.addEventListener("mousedown", (event) => {
      event.preventDefault();
      selectedCompanyFilterValue = option.value;
      syncCompanyInputWithSelection();
      closeCompanyFilterDropdown();
      handleCompanyFilterChange();
      applyFilters();
    });
    companyFilterList.appendChild(item);
  });
}

function getScopedParkOptions() {
  const selectedCompany = selectedCompanyFilterValue;
  if (selectedCompany === "all") {
    return allParkFilterOptions;
  }

  const parksForCompany = new Set(
    passOffers
      .filter((offer) => offer.company === selectedCompany)
      .flatMap((offer) => expandAccessibleParks(offer.accessibleParks))
  );
  return allParkFilterOptions.filter((option) => option.value === "all" || parksForCompany.has(option.value));
}

function ensureParkSelectionIsVisible() {
  if (selectedParkFilterValue === "all") {
    return;
  }
  const scopedOptions = getScopedParkOptions();
  const selectionExists = scopedOptions.some((option) => option.value === selectedParkFilterValue);
  if (!selectionExists) {
    selectedParkFilterValue = "all";
  }
}

function syncParkInputWithSelection() {
  if (selectedParkFilterValue === "all") {
    parkFilterInput.value = "";
    return;
  }

  const selectedOption = getScopedParkOptions().find((option) => option.value === selectedParkFilterValue);
  parkFilterInput.value = selectedOption ? selectedOption.label : "";
}

function getFilteredParkOptions(query) {
  const scopedParkOptions = getScopedParkOptions();
  const normalizedQuery = String(query || "").trim().toLowerCase();
  if (!normalizedQuery) {
    return scopedParkOptions;
  }

  const matchingParkOptions = scopedParkOptions.filter(
    (option) => option.value !== "all" && option.label.toLowerCase().includes(normalizedQuery)
  );
  const allParksOption = scopedParkOptions.find((option) => option.value === "all");
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

function renderPasses(
  selectedCompany = "all",
  selectedPark = "all",
  selectedType = "all",
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
      const matchesCompany = selectedCompany === "all" || offer.company === selectedCompany;
      const matchesPark = selectedPark === "all" || offer.expandedParks.includes(selectedPark);
      const matchesType = selectedType === "all" || offer.passType === selectedType;
      return matchesCompany && matchesPark && matchesType;
    });

  const passTypeOrder = getPassTypeOrderMap(selectedCompany);
  const compareByNameThenTierThenOriginal = (a, b) => {
    const parkNameDiff = a.homePark.localeCompare(b.homePark);
    if (parkNameDiff !== 0) {
      return parkNameDiff;
    }
    const typeOrderDiff = (passTypeOrder.get(a.passType) ?? Number.MAX_SAFE_INTEGER)
      - (passTypeOrder.get(b.passType) ?? Number.MAX_SAFE_INTEGER);
    if (typeOrderDiff !== 0) {
      return typeOrderDiff;
    }
    return a.originalIndex - b.originalIndex;
  };
  const compareBySelectedSort = (a, b) => {
    if (selectedSort === "low-high") {
      return a.numericPrice - b.numericPrice;
    }
    if (selectedSort === "high-low") {
      return b.numericPrice - a.numericPrice;
    }
    return compareByNameThenTierThenOriginal(a, b);
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

    const parksToDisplay = offer.expandedParks;
    const sortedParksToDisplay = [...parksToDisplay].sort((a, b) => a.localeCompare(b));

    const parkList = node.querySelector(".park-list");
    for (const parkName of sortedParksToDisplay) {
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
      disclaimerEl.appendChild(document.createTextNode(` - ${disclaimerText}`));
    }

    passGrid.appendChild(node);
    setupParkToggle(cardEl);
  });
}

function applyFilters() {
  renderPasses(selectedCompanyFilterValue, selectedParkFilterValue, typeFilter.value, priceSort.value);
}

function handleCompanyFilterChange() {
  renderTypeFilterOptions(selectedCompanyFilterValue);
  ensureParkSelectionIsVisible();
  syncParkInputWithSelection();
  renderParkFilterOptions(parkFilterInput.value);
}

companyFilterInput?.addEventListener("focus", () => {
  highlightedCompanyOptionIndex = 0;
  renderCompanyFilterOptions(companyFilterInput.value);
  openCompanyFilterDropdown();
});

companyFilterInput?.addEventListener("click", () => {
  renderCompanyFilterOptions(companyFilterInput.value);
  openCompanyFilterDropdown();
});

companyFilterInput?.addEventListener("input", () => {
  const query = companyFilterInput.value;
  const normalizedQuery = String(query || "").trim().toLowerCase();
  highlightedCompanyOptionIndex = 0;
  renderCompanyFilterOptions(query);
  openCompanyFilterDropdown();

  if (!normalizedQuery) {
    selectedCompanyFilterValue = "all";
    handleCompanyFilterChange();
    applyFilters();
    return;
  }

  const matchingCompanies = companyFilterOptions.filter(
    (option) => option.value !== "all" && option.label.toLowerCase().includes(normalizedQuery)
  );
  const exactMatch = matchingCompanies.find((option) => option.label.toLowerCase() === normalizedQuery);
  const autoSelectedOption = exactMatch || (matchingCompanies.length === 1 ? matchingCompanies[0] : null);

  if (!autoSelectedOption) {
    return;
  }

  selectedCompanyFilterValue = autoSelectedOption.value;
  handleCompanyFilterChange();
  applyFilters();
});

companyFilterInput?.addEventListener("keydown", (event) => {
  const filteredOptions = getFilteredCompanyOptions(companyFilterInput.value);
  if (filteredOptions.length === 0) {
    if (event.key === "Escape") {
      closeCompanyFilterDropdown();
    }
    return;
  }

  if (event.key === "ArrowDown") {
    event.preventDefault();
    highlightedCompanyOptionIndex = Math.min(highlightedCompanyOptionIndex + 1, filteredOptions.length - 1);
    renderCompanyFilterOptions(companyFilterInput.value);
    openCompanyFilterDropdown();
    return;
  }

  if (event.key === "ArrowUp") {
    event.preventDefault();
    highlightedCompanyOptionIndex = Math.max(highlightedCompanyOptionIndex - 1, 0);
    renderCompanyFilterOptions(companyFilterInput.value);
    openCompanyFilterDropdown();
    return;
  }

  if (event.key === "Enter") {
    event.preventDefault();
    const normalizedQuery = String(companyFilterInput.value || "").trim().toLowerCase();
    if (!normalizedQuery) {
      selectedCompanyFilterValue = "all";
    } else {
      const companyOnlyOptions = filteredOptions.filter((option) => option.value !== "all");
      const exactMatch = companyOnlyOptions.find((option) => option.label.toLowerCase() === normalizedQuery);
      const highlightedOption = filteredOptions[highlightedCompanyOptionIndex];
      const fallbackOption = companyOnlyOptions[0];
      const selectedOption = exactMatch
        || (highlightedOption && highlightedOption.value !== "all" ? highlightedOption : null)
        || fallbackOption;

      selectedCompanyFilterValue = selectedOption ? selectedOption.value : "all";
    }

    syncCompanyInputWithSelection();
    closeCompanyFilterDropdown();
    handleCompanyFilterChange();
    applyFilters();
    return;
  }

  if (event.key === "Escape") {
    closeCompanyFilterDropdown();
  }
});

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

  const matchingParks = getScopedParkOptions().filter(
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
  if (
    target instanceof Node
    && !parkFilterInput.contains(target)
    && !parkFilterList.contains(target)
    && !companyFilterInput?.contains(target)
    && !companyFilterList?.contains(target)
  ) {
    closeParkFilterDropdown();
    closeCompanyFilterDropdown();
  }
});

companyFilterInput?.addEventListener("blur", () => {
  setTimeout(() => {
    syncCompanyInputWithSelection();
    closeCompanyFilterDropdown();
  }, 0);
});

parkFilterInput.addEventListener("blur", () => {
  setTimeout(() => {
    syncParkInputWithSelection();
    closeParkFilterDropdown();
  }, 0);
});

typeFilter.addEventListener("change", applyFilters);
priceSort.addEventListener("change", applyFilters);

renderTypeFilterOptions("all");
renderCompanyFilterOptions();
syncCompanyInputWithSelection();
renderParkFilterOptions();
syncParkInputWithSelection();
renderPasses("all");
fetchExchangeRates().finally(() => {
  applyFilters();
});
