(function initFiltersModule() {
  const pe = window.PassExplorer = window.PassExplorer || {};

  // Central filter state. All UI handlers write here, and render reads from here.
  pe.state = pe.state || {
    selectedParkFilterValue: "all",
    highlightedParkOptionIndex: 0,
    selectedCompanyFilterValue: "all",
    highlightedCompanyOptionIndex: 0
  };

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

  function getCompanyTierOptions(companyName) {
    const preferredTierOrder = ["Fun Card", "Basic", "Season", "Summer", "Bronze", "Unlimited", "Silver", "Premier", "Gold", "Diamond", "Platinum", "Prestige"];
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
    const { typeFilter } = pe.dom;
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
    const { companyFilterInput } = pe.dom;
    const { selectedCompanyFilterValue } = pe.state;

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
    const { companyFilterList, companyFilterInput } = pe.dom;
    if (!companyFilterList || !companyFilterInput) {
      return;
    }
    companyFilterList.hidden = true;
    companyFilterInput.setAttribute("aria-expanded", "false");
  }

  function openCompanyFilterDropdown() {
    const { companyFilterList, companyFilterInput } = pe.dom;
    if (!companyFilterList || !companyFilterInput) {
      return;
    }
    companyFilterList.hidden = false;
    companyFilterInput.setAttribute("aria-expanded", "true");
  }

  function renderCompanyFilterOptions(query = "") {
    const { companyFilterList } = pe.dom;
    const { selectedCompanyFilterValue } = pe.state;

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

    pe.state.highlightedCompanyOptionIndex = Math.min(
      pe.state.highlightedCompanyOptionIndex,
      filteredOptions.length - 1
    );

    filteredOptions.forEach((option, index) => {
      const item = document.createElement("li");
      item.className = "park-combobox-option";
      item.setAttribute("role", "option");
      item.dataset.value = option.value;
      item.textContent = option.label;
      if (option.value === selectedCompanyFilterValue) {
        item.classList.add("is-selected");
      }
      if (index === pe.state.highlightedCompanyOptionIndex) {
        item.classList.add("is-highlighted");
      }
      item.addEventListener("mousedown", (event) => {
        event.preventDefault();
        pe.state.selectedCompanyFilterValue = option.value;
        syncCompanyInputWithSelection();
        closeCompanyFilterDropdown();
        handleCompanyFilterChange();
        applyFilters();
      });
      companyFilterList.appendChild(item);
    });
  }

  function getScopedParkOptions() {
    const { selectedCompanyFilterValue } = pe.state;
    if (selectedCompanyFilterValue === "all") {
      return allParkFilterOptions;
    }

    const parksForCompany = new Set(
      passOffers
        .filter((offer) => offer.company === selectedCompanyFilterValue)
        .flatMap((offer) => expandAccessibleParks(offer.accessibleParks))
    );
    return allParkFilterOptions.filter((option) => option.value === "all" || parksForCompany.has(option.value));
  }

  function ensureParkSelectionIsVisible() {
    if (pe.state.selectedParkFilterValue === "all") {
      return;
    }
    const scopedOptions = getScopedParkOptions();
    const selectionExists = scopedOptions.some((option) => option.value === pe.state.selectedParkFilterValue);
    if (!selectionExists) {
      pe.state.selectedParkFilterValue = "all";
    }
  }

  function syncParkInputWithSelection() {
    const { parkFilterInput } = pe.dom;
    const { selectedParkFilterValue } = pe.state;

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
    const { parkFilterList, parkFilterInput } = pe.dom;
    parkFilterList.hidden = true;
    parkFilterInput.setAttribute("aria-expanded", "false");
  }

  function openParkFilterDropdown() {
    const { parkFilterList, parkFilterInput } = pe.dom;
    parkFilterList.hidden = false;
    parkFilterInput.setAttribute("aria-expanded", "true");
  }

  function renderParkFilterOptions(query = "") {
    const { parkFilterList } = pe.dom;
    const filteredOptions = getFilteredParkOptions(query);
    parkFilterList.innerHTML = "";

    if (filteredOptions.length === 0) {
      const emptyOption = document.createElement("li");
      emptyOption.className = "park-combobox-option is-empty";
      emptyOption.textContent = "No matching parks";
      parkFilterList.appendChild(emptyOption);
      return;
    }

    pe.state.highlightedParkOptionIndex = Math.min(pe.state.highlightedParkOptionIndex, filteredOptions.length - 1);

    filteredOptions.forEach((option, index) => {
      const item = document.createElement("li");
      item.className = "park-combobox-option";
      item.setAttribute("role", "option");
      item.dataset.value = option.value;
      item.textContent = option.label;
      if (option.value === pe.state.selectedParkFilterValue) {
        item.classList.add("is-selected");
      }
      if (index === pe.state.highlightedParkOptionIndex) {
        item.classList.add("is-highlighted");
      }
      item.addEventListener("mousedown", (event) => {
        event.preventDefault();
        pe.state.selectedParkFilterValue = option.value;
        syncParkInputWithSelection();
        closeParkFilterDropdown();
        applyFilters();
      });
      parkFilterList.appendChild(item);
    });
  }

  function applyFilters() {
    pe.renderPasses(
      pe.state.selectedCompanyFilterValue,
      pe.state.selectedParkFilterValue,
      pe.dom.typeFilter.value,
      pe.dom.priceSort.value
    );
  }

  function handleCompanyFilterChange() {
    renderTypeFilterOptions(pe.state.selectedCompanyFilterValue);
    ensureParkSelectionIsVisible();
    syncParkInputWithSelection();
    renderParkFilterOptions(pe.dom.parkFilterInput.value);
  }

  function bindFilterEvents() {
    const {
      companyFilterInput,
      companyFilterList,
      parkFilterInput,
      parkFilterList,
      typeFilter,
      priceSort
    } = pe.dom;

    companyFilterInput?.addEventListener("focus", () => {
      pe.state.highlightedCompanyOptionIndex = 0;
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
      pe.state.highlightedCompanyOptionIndex = 0;
      renderCompanyFilterOptions(query);
      openCompanyFilterDropdown();

      if (!normalizedQuery) {
        pe.state.selectedCompanyFilterValue = "all";
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

      pe.state.selectedCompanyFilterValue = autoSelectedOption.value;
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
        pe.state.highlightedCompanyOptionIndex = Math.min(
          pe.state.highlightedCompanyOptionIndex + 1,
          filteredOptions.length - 1
        );
        renderCompanyFilterOptions(companyFilterInput.value);
        openCompanyFilterDropdown();
        return;
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();
        pe.state.highlightedCompanyOptionIndex = Math.max(pe.state.highlightedCompanyOptionIndex - 1, 0);
        renderCompanyFilterOptions(companyFilterInput.value);
        openCompanyFilterDropdown();
        return;
      }

      if (event.key === "Enter") {
        event.preventDefault();
        const normalizedQuery = String(companyFilterInput.value || "").trim().toLowerCase();
        if (!normalizedQuery) {
          pe.state.selectedCompanyFilterValue = "all";
        } else {
          const companyOnlyOptions = filteredOptions.filter((option) => option.value !== "all");
          const exactMatch = companyOnlyOptions.find((option) => option.label.toLowerCase() === normalizedQuery);
          const highlightedOption = filteredOptions[pe.state.highlightedCompanyOptionIndex];
          const fallbackOption = companyOnlyOptions[0];
          const selectedOption = exactMatch
            || (highlightedOption && highlightedOption.value !== "all" ? highlightedOption : null)
            || fallbackOption;

          pe.state.selectedCompanyFilterValue = selectedOption ? selectedOption.value : "all";
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
      pe.state.highlightedParkOptionIndex = 0;
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
      pe.state.highlightedParkOptionIndex = 0;
      renderParkFilterOptions(query);
      openParkFilterDropdown();

      if (!normalizedQuery) {
        pe.state.selectedParkFilterValue = "all";
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

      pe.state.selectedParkFilterValue = autoSelectedOption.value;
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
        pe.state.highlightedParkOptionIndex = Math.min(pe.state.highlightedParkOptionIndex + 1, filteredOptions.length - 1);
        renderParkFilterOptions(parkFilterInput.value);
        openParkFilterDropdown();
        return;
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();
        pe.state.highlightedParkOptionIndex = Math.max(pe.state.highlightedParkOptionIndex - 1, 0);
        renderParkFilterOptions(parkFilterInput.value);
        openParkFilterDropdown();
        return;
      }

      if (event.key === "Enter") {
        event.preventDefault();
        const normalizedQuery = String(parkFilterInput.value || "").trim().toLowerCase();
        if (!normalizedQuery) {
          pe.state.selectedParkFilterValue = "all";
        } else {
          const parkOnlyOptions = filteredOptions.filter((option) => option.value !== "all");
          const exactMatch = parkOnlyOptions.find((option) => option.label.toLowerCase() === normalizedQuery);
          const highlightedOption = filteredOptions[pe.state.highlightedParkOptionIndex];
          const fallbackOption = parkOnlyOptions[0];
          const selectedOption = exactMatch
            || (highlightedOption && highlightedOption.value !== "all" ? highlightedOption : null)
            || fallbackOption;

          pe.state.selectedParkFilterValue = selectedOption ? selectedOption.value : "all";
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
  }

  pe.ensureCompanyFilterCombobox = ensureCompanyFilterCombobox;
  pe.getPassTypeOrderMap = getPassTypeOrderMap;
  pe.renderTypeFilterOptions = renderTypeFilterOptions;
  pe.syncCompanyInputWithSelection = syncCompanyInputWithSelection;
  pe.renderCompanyFilterOptions = renderCompanyFilterOptions;
  pe.syncParkInputWithSelection = syncParkInputWithSelection;
  pe.renderParkFilterOptions = renderParkFilterOptions;
  pe.applyFilters = applyFilters;
  pe.handleCompanyFilterChange = handleCompanyFilterChange;
  pe.bindFilterEvents = bindFilterEvents;
})();
