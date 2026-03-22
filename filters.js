(function initFiltersModule() {
  const pe = window.PassExplorer = window.PassExplorer || {};

  // Central filter state. All UI handlers write here, and render reads from here.
  pe.state = pe.state || {
    selectedParkFilterValue: "all",
    highlightedParkOptionIndex: 0,
    selectedCompanyFilterValue: "all",
    highlightedCompanyOptionIndex: 0,
    selectedCountryFilterValue: "all",
    selectedStateFilterValue: "all"
  };

  const dropdownPortalState = new WeakMap();
  let activeDropdown = null;
  let dropdownListenersBound = false;
  let pendingDropdownReposition = false;
  let sidebarListenersBound = false;

  function portalDropdown(listElement) {
    if (!listElement || dropdownPortalState.has(listElement)) {
      return;
    }

    dropdownPortalState.set(listElement, { parent: listElement.parentNode, next: listElement.nextSibling });
    document.body.appendChild(listElement);
    listElement.classList.add("is-portaled");
  }

  function restoreDropdown(listElement) {
    const state = dropdownPortalState.get(listElement);
    if (!state) {
      return;
    }

    state.parent.insertBefore(listElement, state.next);
    dropdownPortalState.delete(listElement);
    listElement.classList.remove("is-portaled");
    listElement.style.left = "";
    listElement.style.top = "";
    listElement.style.width = "";
    listElement.style.maxHeight = "";
  }

  function positionDropdown(listElement, inputElement) {
    if (!listElement || !inputElement) {
      return;
    }

    const rect = inputElement.getBoundingClientRect();
    const gap = 6;
    const top = rect.bottom + gap;

    listElement.style.left = `${rect.left}px`;
    listElement.style.top = `${top}px`;
    listElement.style.width = `${rect.width}px`;
  }

  function scheduleActiveDropdownPositionUpdate() {
    if (!activeDropdown || pendingDropdownReposition) {
      return;
    }

    pendingDropdownReposition = true;
    requestAnimationFrame(() => {
      pendingDropdownReposition = false;
      if (!activeDropdown) {
        return;
      }
      positionDropdown(activeDropdown.listElement, activeDropdown.inputElement);
    });
  }

  function setActiveDropdown(listElement, inputElement) {
    activeDropdown = listElement && inputElement ? { listElement, inputElement } : null;
    scheduleActiveDropdownPositionUpdate();
  }

  function bindDropdownPositionListeners() {
    if (dropdownListenersBound) {
      return;
    }
    dropdownListenersBound = true;

    window.addEventListener("resize", scheduleActiveDropdownPositionUpdate, { passive: true });
    window.addEventListener("scroll", scheduleActiveDropdownPositionUpdate, true);

    const controlsPanel = document.getElementById("controls") || document.querySelector(".controls");
    controlsPanel?.addEventListener("scroll", scheduleActiveDropdownPositionUpdate, { passive: true });
  }

  function bindSidebarToggle() {
    if (sidebarListenersBound) {
      return;
    }
    sidebarListenersBound = true;

    const toggleBtn = document.getElementById("toggleBtn");
    const controls = document.getElementById("controls") || document.querySelector(".controls");
    const backdrop = document.getElementById("sidebarBackdrop");
    const closeBtn = document.getElementById("closeFiltersBtn");
    const mobileViewport = window.matchMedia("(max-width: 979px)");

    const SWIPE_CLOSE_MIN_X = 60;
    const SWIPE_MAX_Y = 40;
    let touchStartX = 0;
    let touchStartY = 0;
    let touchStartedWhenOpen = false;
    let isDesktopCollapsed = false;

    function syncSidebarAccessibility(isOpen) {
      backdrop?.classList.toggle("active", isOpen);
      backdrop?.setAttribute("aria-hidden", String(!isOpen));

      if (toggleBtn) {
        toggleBtn.setAttribute("aria-expanded", String(isOpen));
        toggleBtn.setAttribute("aria-label", isOpen ? "Close filters" : "Open filters");
      }
    }

    function setSidebarOpen(isOpen) {
      if (!controls) return;

      if (!mobileViewport.matches) {
        controls.classList.remove("open");
        syncSidebarAccessibility(false);
        return;
      }

      controls.classList.toggle("open", isOpen);
      syncSidebarAccessibility(isOpen);
    }

    function setDesktopCollapsed(collapsed) {
      if (!controls) return;
      isDesktopCollapsed = Boolean(collapsed);
      controls.classList.toggle("is-collapsed", isDesktopCollapsed);
      if (closeBtn) {
        closeBtn.textContent = isDesktopCollapsed ? "Open" : "Close";
      }
    }

    function toggleDesktopCollapsed() {
      setDesktopCollapsed(!isDesktopCollapsed);
    }

    function toggleSidebar() {
      if (!controls || !mobileViewport.matches) return;
      setSidebarOpen(!controls.classList.contains("open"));
    }

    toggleBtn?.addEventListener("click", toggleSidebar);
    backdrop?.addEventListener("click", () => setSidebarOpen(false));
    closeBtn?.addEventListener("click", () => {
      if (mobileViewport.matches) {
        setSidebarOpen(false);
        return;
      }
      toggleDesktopCollapsed();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        setSidebarOpen(false);
      }
    });

    mobileViewport.addEventListener("change", () => {
      setSidebarOpen(false);
      setDesktopCollapsed(false);
    });

    const onTouchStart = (event) => {
      if (!mobileViewport.matches) return;
      if (!controls) return;
      touchStartedWhenOpen = controls.classList.contains("open");
      if (!touchStartedWhenOpen) return;

      const touch = event.touches && event.touches[0];
      if (!touch) return;
      touchStartX = touch.clientX;
      touchStartY = touch.clientY;
    };

    const onTouchEnd = (event) => {
      if (!mobileViewport.matches) return;
      if (!controls) return;
      if (!touchStartedWhenOpen) return;
      touchStartedWhenOpen = false;

      const touch = event.changedTouches && event.changedTouches[0];
      if (!touch) return;

      const dx = touch.clientX - touchStartX;
      const dy = touch.clientY - touchStartY;
      const isHorizontal = Math.abs(dy) <= SWIPE_MAX_Y && Math.abs(dx) >= SWIPE_CLOSE_MIN_X;
      if (isHorizontal && dx > 0) {
        setSidebarOpen(false);
      }
    };

    controls?.addEventListener("touchstart", onTouchStart, { passive: true });
    controls?.addEventListener("touchend", onTouchEnd, { passive: true });
    backdrop?.addEventListener("touchstart", onTouchStart, { passive: true });
    backdrop?.addEventListener("touchend", onTouchEnd, { passive: true });

    // Desktop starts expanded by default.
    setDesktopCollapsed(false);
    setSidebarOpen(false);
  }

  function getVisibleOffersForFilters(companyName = "all", parkName = "all") {
    return passOffers.filter((offer) => {
      const matchesCompany = companyName === "all" || offer.company === companyName;
      const matchesPark = parkName === "all" || expandAccessibleParks(offer.accessibleParks).includes(parkName);
      return matchesCompany && matchesPark;
    });
  }

  function getCompanyTierOptions(companyName, parkName = "all") {
    const preferredTierOrder = ["Gold", "Prestige"];
    const companyTierSet = new Set(
      getVisibleOffersForFilters(companyName, parkName).map((offer) => offer.passType)
    );
    const orderedTiers = preferredTierOrder.filter((tierName) => companyTierSet.has(tierName));
    const unorderedTiers = Array.from(companyTierSet)
      .filter((tierName) => !preferredTierOrder.includes(tierName))
      .sort((a, b) => a.localeCompare(b));
    return [...orderedTiers, ...unorderedTiers];
  }

  function getPassTypeOrderMap(selectedCompany, selectedPark = "all") {
    return new Map(getCompanyTierOptions(selectedCompany, selectedPark).map((tierName, index) => [tierName, index]));
  }

  function renderTypeFilterOptions(selectedCompany, selectedPark = "all") {
    const { typeFilter } = pe.dom;
    const availableTiers = getCompanyTierOptions(selectedCompany, selectedPark);
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
    if (activeDropdown?.listElement === companyFilterList) {
      setActiveDropdown(null, null);
    }
    restoreDropdown(companyFilterList);
  }

  function openCompanyFilterDropdown() {
    const { companyFilterList, companyFilterInput } = pe.dom;
    if (!companyFilterList || !companyFilterInput) {
      return;
    }
    bindDropdownPositionListeners();
    portalDropdown(companyFilterList);
    setActiveDropdown(companyFilterList, companyFilterInput);
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
    const { selectedCountryFilterValue, selectedStateFilterValue } = pe.state;

    const matchesLocation = (parkName) => {
      const location = parkByName[parkName] || null;
      if (!location) {
        return selectedCountryFilterValue === "all" && selectedStateFilterValue === "all";
      }

      const matchesCountry = selectedCountryFilterValue === "all"
        || location.country === selectedCountryFilterValue;
      const matchesState = selectedStateFilterValue === "all"
        || location.state === selectedStateFilterValue;
      return matchesCountry && matchesState;
    };

    const baseOptions = selectedCompanyFilterValue === "all"
      ? allParkFilterOptions
      : (() => {
        const parksForCompany = new Set(
          passOffers
            .filter((offer) => offer.company === selectedCompanyFilterValue)
            .flatMap((offer) => expandAccessibleParks(offer.accessibleParks))
        );
        return allParkFilterOptions.filter((option) => option.value === "all" || parksForCompany.has(option.value));
      })();

    if (selectedCountryFilterValue === "all" && selectedStateFilterValue === "all") {
      return baseOptions;
    }

    return baseOptions.filter((option) => option.value === "all" || matchesLocation(option.value));
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
    if (activeDropdown?.listElement === parkFilterList) {
      setActiveDropdown(null, null);
    }
    restoreDropdown(parkFilterList);
  }

  function openParkFilterDropdown() {
    const { parkFilterList, parkFilterInput } = pe.dom;
    bindDropdownPositionListeners();
    portalDropdown(parkFilterList);
    setActiveDropdown(parkFilterList, parkFilterInput);
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
      pe.dom.priceSort.value,
      pe.state.selectedCountryFilterValue,
      pe.state.selectedStateFilterValue
    );
  }

  function handleCompanyFilterChange() {
    renderTypeFilterOptions(pe.state.selectedCompanyFilterValue, pe.state.selectedParkFilterValue);
    ensureParkSelectionIsVisible();
    syncParkInputWithSelection();
    renderParkFilterOptions(pe.dom.parkFilterInput.value);
  }

  function handleParkFilterChange() {
    renderTypeFilterOptions(pe.state.selectedCompanyFilterValue, pe.state.selectedParkFilterValue);
  }

  function renderCountryFilterOptions() {
    const { countryFilter } = pe.dom;
    if (!countryFilter) return;

    const currentSelection = countryFilter.value || pe.state.selectedCountryFilterValue || "all";
    countryFilter.innerHTML = "";

    for (const option of countryFilterOptions) {
      const el = document.createElement("option");
      el.value = option.value;
      el.textContent = option.label;
      countryFilter.appendChild(el);
    }

    const isValid = countryFilterOptions.some((option) => option.value === currentSelection);
    const nextValue = isValid ? currentSelection : "all";
    countryFilter.value = nextValue;
    pe.state.selectedCountryFilterValue = nextValue;
  }

  function ensureStateSelectionIsVisible() {
    if (pe.state.selectedStateFilterValue === "all") {
      return;
    }

    const stateOptions = getStateOptionsForCountry(pe.state.selectedCountryFilterValue);
    const selectionExists = stateOptions.some((option) => option.value === pe.state.selectedStateFilterValue);
    if (!selectionExists) {
      pe.state.selectedStateFilterValue = "all";
    }
  }

  function renderStateFilterOptions() {
    const { stateFilter } = pe.dom;
    if (!stateFilter) return;

    const options = getStateOptionsForCountry(pe.state.selectedCountryFilterValue);
    const currentSelection = stateFilter.value || pe.state.selectedStateFilterValue || "all";
    stateFilter.innerHTML = "";

    for (const option of options) {
      const el = document.createElement("option");
      el.value = option.value;
      el.textContent = option.label;
      stateFilter.appendChild(el);
    }

    const isValid = options.some((option) => option.value === currentSelection);
    const nextValue = isValid ? currentSelection : "all";
    stateFilter.value = nextValue;
    pe.state.selectedStateFilterValue = nextValue;
  }

  function handleCountryFilterChange() {
    renderStateFilterOptions();
    ensureStateSelectionIsVisible();
    renderParkFilterOptions(pe.dom.parkFilterInput.value);
    ensureParkSelectionIsVisible();
    syncParkInputWithSelection();
  }

  function handleStateFilterChange() {
    renderParkFilterOptions(pe.dom.parkFilterInput.value);
    ensureParkSelectionIsVisible();
    syncParkInputWithSelection();
  }

  function bindFilterEvents() {
    bindSidebarToggle();

    const {
      companyFilterInput,
      companyFilterList,
      parkFilterInput,
      parkFilterList,
      countryFilter,
      stateFilter,
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
        handleParkFilterChange();
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
      handleParkFilterChange();
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
        handleParkFilterChange();
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

    countryFilter?.addEventListener("change", () => {
      pe.state.selectedCountryFilterValue = countryFilter.value || "all";
      handleCountryFilterChange();
      applyFilters();
    });

    stateFilter?.addEventListener("change", () => {
      pe.state.selectedStateFilterValue = stateFilter.value || "all";
      handleStateFilterChange();
      applyFilters();
    });

    typeFilter.addEventListener("change", applyFilters);
    priceSort.addEventListener("change", applyFilters);
  }

  pe.getPassTypeOrderMap = getPassTypeOrderMap;
  pe.renderTypeFilterOptions = renderTypeFilterOptions;
  pe.syncCompanyInputWithSelection = syncCompanyInputWithSelection;
  pe.renderCompanyFilterOptions = renderCompanyFilterOptions;
  pe.syncParkInputWithSelection = syncParkInputWithSelection;
  pe.renderParkFilterOptions = renderParkFilterOptions;
  pe.applyFilters = applyFilters;
  pe.handleCompanyFilterChange = handleCompanyFilterChange;
  pe.handleParkFilterChange = handleParkFilterChange;
  pe.renderCountryFilterOptions = renderCountryFilterOptions;
  pe.renderStateFilterOptions = renderStateFilterOptions;
  pe.bindFilterEvents = bindFilterEvents;
})();
