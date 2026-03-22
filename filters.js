(function initFiltersModule() {
  const pe = window.PassExplorer = window.PassExplorer || {};

  // Central filter state. All UI handlers write here, and render reads from here.
  pe.state = pe.state || {
    selectedParkFilterValue: "all",
    highlightedParkOptionIndex: 0,
    selectedCompanyFilterValue: "all",
    highlightedCompanyOptionIndex: 0,
    selectedCountryFilterValue: "all",
    highlightedCountryOptionIndex: 0,
    selectedStateFilterValue: "all",
    highlightedStateOptionIndex: 0,
    selectedTypeFilterValue: "all",
    highlightedTypeOptionIndex: 0
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
    const companyTierSet = new Set(
      getVisibleOffersForFilters(companyName, parkName).map((offer) => offer.passType)
    );
    return Array.from(companyTierSet).sort((a, b) => a.localeCompare(b));
  }

  function getPassTypeOrderMap(selectedCompany, selectedPark = "all") {
    return new Map(getCompanyTierOptions(selectedCompany, selectedPark).map((tierName, index) => [tierName, index]));
  }

  function getTypeFilterOptions(selectedCompany, selectedPark = "all") {
    const availableTiers = getCompanyTierOptions(selectedCompany, selectedPark);
    return [
      { value: "all", label: "All Tiers" },
      ...availableTiers.map((tierName) => ({ value: tierName, label: tierName }))
    ];
  }

  function ensureTypeSelectionIsVisible(selectedCompany, selectedPark = "all") {
    const options = getTypeFilterOptions(selectedCompany, selectedPark);
    const selectionExists = options.some((option) => option.value === pe.state.selectedTypeFilterValue);
    if (!selectionExists) {
      pe.state.selectedTypeFilterValue = "all";
    }
  }

  function syncTypeInputWithSelection() {
    const { typeFilterInput } = pe.dom;
    if (!typeFilterInput) {
      return;
    }

    if (pe.state.selectedTypeFilterValue === "all") {
      typeFilterInput.value = "";
      return;
    }

    const options = getTypeFilterOptions(pe.state.selectedCompanyFilterValue, pe.state.selectedParkFilterValue);
    const selectedOption = options.find((option) => option.value === pe.state.selectedTypeFilterValue);
    typeFilterInput.value = selectedOption ? selectedOption.label : "";
  }

  function getFilteredTypeOptions(query) {
    const normalizedQuery = String(query || "").trim().toLowerCase();
    const options = getTypeFilterOptions(pe.state.selectedCompanyFilterValue, pe.state.selectedParkFilterValue);
    if (!normalizedQuery) {
      return options;
    }

    const matchingOptions = options.filter(
      (option) => option.value !== "all" && option.label.toLowerCase().includes(normalizedQuery)
    );
    const allOption = options.find((option) => option.value === "all");
    return allOption ? [...matchingOptions, allOption] : matchingOptions;
  }

  function closeTypeFilterDropdown() {
    const { typeFilterList, typeFilterInput } = pe.dom;
    if (!typeFilterList || !typeFilterInput) {
      return;
    }
    typeFilterList.hidden = true;
    typeFilterInput.setAttribute("aria-expanded", "false");
    if (activeDropdown?.listElement === typeFilterList) {
      setActiveDropdown(null, null);
    }
    restoreDropdown(typeFilterList);
  }

  function openTypeFilterDropdown() {
    const { typeFilterList, typeFilterInput } = pe.dom;
    if (!typeFilterList || !typeFilterInput) {
      return;
    }
    bindDropdownPositionListeners();
    portalDropdown(typeFilterList);
    setActiveDropdown(typeFilterList, typeFilterInput);
    typeFilterList.hidden = false;
    typeFilterInput.setAttribute("aria-expanded", "true");
  }

  function renderTypeFilterDropdownOptions(query = "") {
    const { typeFilterList } = pe.dom;
    if (!typeFilterList) {
      return;
    }

    const filteredOptions = getFilteredTypeOptions(query);
    typeFilterList.innerHTML = "";

    if (filteredOptions.length === 0) {
      const emptyOption = document.createElement("li");
      emptyOption.className = "park-combobox-option is-empty";
      emptyOption.textContent = "No matching tiers";
      typeFilterList.appendChild(emptyOption);
      return;
    }

    pe.state.highlightedTypeOptionIndex = Math.min(pe.state.highlightedTypeOptionIndex, filteredOptions.length - 1);

    filteredOptions.forEach((option, index) => {
      const item = document.createElement("li");
      item.className = "park-combobox-option";
      item.setAttribute("role", "option");
      item.dataset.value = option.value;
      item.textContent = option.label;
      if (option.value === pe.state.selectedTypeFilterValue) {
        item.classList.add("is-selected");
      }
      if (index === pe.state.highlightedTypeOptionIndex) {
        item.classList.add("is-highlighted");
      }
      item.addEventListener("mousedown", (event) => {
        event.preventDefault();
        pe.state.selectedTypeFilterValue = option.value;
        syncTypeInputWithSelection();
        closeTypeFilterDropdown();
        applyFilters();
      });
      typeFilterList.appendChild(item);
    });
  }

  // Keeps the type combobox in sync with the active Company/Park scope.
  function renderTypeFilterOptions(selectedCompany, selectedPark = "all") {
    ensureTypeSelectionIsVisible(selectedCompany, selectedPark);
    syncTypeInputWithSelection();

    const { typeFilterInput, typeFilterList } = pe.dom;
    if (typeFilterInput && typeFilterList && typeFilterList.hidden === false) {
      renderTypeFilterDropdownOptions(typeFilterInput.value);
      openTypeFilterDropdown();
    }
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
      pe.state.selectedTypeFilterValue,
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
    renderCountryFilterOptions();
    handleCountryFilterChange();
  }

  function handleParkFilterChange() {
    renderTypeFilterOptions(pe.state.selectedCompanyFilterValue, pe.state.selectedParkFilterValue);
  }

  function syncCountryInputWithSelection() {
    const { countryFilterInput } = pe.dom;
    if (!countryFilterInput) {
      return;
    }

    if (pe.state.selectedCountryFilterValue === "all") {
      countryFilterInput.value = "";
      return;
    }

    const selectedOption = getScopedCountryOptions().find((option) => option.value === pe.state.selectedCountryFilterValue);
    countryFilterInput.value = selectedOption ? selectedOption.label : "";
  }

  function getScopedCountryOptions() {
    const companyValue = pe.state.selectedCompanyFilterValue;
    if (companyValue === "all") {
      return countryFilterOptions;
    }

    const countriesForCompany = new Set(
      passOffers
        .filter((offer) => offer.company === companyValue)
        .flatMap((offer) => [offer.homePark, ...expandAccessibleParks(offer.accessibleParks)])
        .map((parkName) => parkByName[parkName]?.country)
        .filter(Boolean)
    );

    const allOption = countryFilterOptions.find((option) => option.value === "all")
      || { value: "all", label: "All Countries" };
    const scoped = countryFilterOptions.filter(
      (option) => option.value !== "all" && countriesForCompany.has(option.value)
    );
    return [allOption, ...scoped];
  }

  function getFilteredCountryOptions(query) {
    const normalizedQuery = String(query || "").trim().toLowerCase();
    if (!normalizedQuery) {
      return getScopedCountryOptions();
    }

    const scopedOptions = getScopedCountryOptions();
    const matchingOptions = scopedOptions.filter(
      (option) => option.value !== "all" && option.label.toLowerCase().includes(normalizedQuery)
    );
    const allOption = scopedOptions.find((option) => option.value === "all");
    return allOption ? [...matchingOptions, allOption] : matchingOptions;
  }

  function closeCountryFilterDropdown() {
    const { countryFilterList, countryFilterInput } = pe.dom;
    if (!countryFilterList || !countryFilterInput) {
      return;
    }
    countryFilterList.hidden = true;
    countryFilterInput.setAttribute("aria-expanded", "false");
    if (activeDropdown?.listElement === countryFilterList) {
      setActiveDropdown(null, null);
    }
    restoreDropdown(countryFilterList);
  }

  function openCountryFilterDropdown() {
    const { countryFilterList, countryFilterInput } = pe.dom;
    if (!countryFilterList || !countryFilterInput) {
      return;
    }
    bindDropdownPositionListeners();
    portalDropdown(countryFilterList);
    setActiveDropdown(countryFilterList, countryFilterInput);
    countryFilterList.hidden = false;
    countryFilterInput.setAttribute("aria-expanded", "true");
  }

  function renderCountryFilterDropdownOptions(query = "") {
    const { countryFilterList } = pe.dom;
    if (!countryFilterList) {
      return;
    }

    const filteredOptions = getFilteredCountryOptions(query);
    countryFilterList.innerHTML = "";

    if (filteredOptions.length === 0) {
      const emptyOption = document.createElement("li");
      emptyOption.className = "park-combobox-option is-empty";
      emptyOption.textContent = "No matching countries";
      countryFilterList.appendChild(emptyOption);
      return;
    }

    pe.state.highlightedCountryOptionIndex = Math.min(pe.state.highlightedCountryOptionIndex, filteredOptions.length - 1);

    filteredOptions.forEach((option, index) => {
      const item = document.createElement("li");
      item.className = "park-combobox-option";
      item.setAttribute("role", "option");
      item.dataset.value = option.value;
      item.textContent = option.label;
      if (option.value === pe.state.selectedCountryFilterValue) {
        item.classList.add("is-selected");
      }
      if (index === pe.state.highlightedCountryOptionIndex) {
        item.classList.add("is-highlighted");
      }
      item.addEventListener("mousedown", (event) => {
        event.preventDefault();
        pe.state.selectedCountryFilterValue = option.value;
        syncCountryInputWithSelection();
        closeCountryFilterDropdown();
        handleCountryFilterChange();
        applyFilters();
      });
      countryFilterList.appendChild(item);
    });
  }

  function renderCountryFilterOptions() {
    const scopedOptions = getScopedCountryOptions();
    const selectionExists = scopedOptions.some((option) => option.value === pe.state.selectedCountryFilterValue);
    if (!selectionExists) {
      pe.state.selectedCountryFilterValue = "all";
    }

    syncCountryInputWithSelection();

    const { countryFilterInput, countryFilterList } = pe.dom;
    if (countryFilterInput && countryFilterList && countryFilterList.hidden === false) {
      renderCountryFilterDropdownOptions(countryFilterInput.value);
      openCountryFilterDropdown();
    }
  }

  function ensureStateSelectionIsVisible() {
    if (pe.state.selectedStateFilterValue === "all") {
      return;
    }

    const options = getScopedStateOptions(pe.state.selectedCountryFilterValue);
    const selectionExists = options.some((option) => option.value === pe.state.selectedStateFilterValue);
    if (!selectionExists) {
      pe.state.selectedStateFilterValue = "all";
    }
  }

  function getScopedStateOptions(countryValue = "all") {
    const companyValue = pe.state.selectedCompanyFilterValue;
    const scopedOffers = companyValue === "all"
      ? passOffers
      : passOffers.filter((offer) => offer.company === companyValue);

    const states = new Set();
    for (const offer of scopedOffers) {
      const parkNames = [offer.homePark, ...expandAccessibleParks(offer.accessibleParks)];
      for (const parkName of parkNames) {
        const park = parkByName[parkName];
        if (!park) continue;
        if (countryValue !== "all" && park.country !== countryValue) continue;
        const state = park.state;
        if (!state || state === "Unknown") continue;
        states.add(state);
      }
    }

    const stateList = Array.from(states).sort((a, b) => a.localeCompare(b));
    return [
      { value: "all", label: "All States / Provinces" },
      ...stateList.map((state) => ({ value: state, label: state }))
    ];
  }

  function syncStateInputWithSelection() {
    const { stateFilterInput } = pe.dom;
    if (!stateFilterInput) {
      return;
    }

    if (pe.state.selectedStateFilterValue === "all") {
      stateFilterInput.value = "";
      return;
    }

    const options = getScopedStateOptions(pe.state.selectedCountryFilterValue);
    const selectedOption = options.find((option) => option.value === pe.state.selectedStateFilterValue);
    stateFilterInput.value = selectedOption ? selectedOption.label : "";
  }

  function getFilteredStateOptions(query) {
    const normalizedQuery = String(query || "").trim().toLowerCase();
    const options = getScopedStateOptions(pe.state.selectedCountryFilterValue);
    if (!normalizedQuery) {
      return options;
    }

    const matchingOptions = options.filter(
      (option) => option.value !== "all" && option.label.toLowerCase().includes(normalizedQuery)
    );
    const allOption = options.find((option) => option.value === "all");
    return allOption ? [...matchingOptions, allOption] : matchingOptions;
  }

  function closeStateFilterDropdown() {
    const { stateFilterList, stateFilterInput } = pe.dom;
    if (!stateFilterList || !stateFilterInput) {
      return;
    }
    stateFilterList.hidden = true;
    stateFilterInput.setAttribute("aria-expanded", "false");
    if (activeDropdown?.listElement === stateFilterList) {
      setActiveDropdown(null, null);
    }
    restoreDropdown(stateFilterList);
  }

  function openStateFilterDropdown() {
    const { stateFilterList, stateFilterInput } = pe.dom;
    if (!stateFilterList || !stateFilterInput) {
      return;
    }
    bindDropdownPositionListeners();
    portalDropdown(stateFilterList);
    setActiveDropdown(stateFilterList, stateFilterInput);
    stateFilterList.hidden = false;
    stateFilterInput.setAttribute("aria-expanded", "true");
  }

  function renderStateFilterDropdownOptions(query = "") {
    const { stateFilterList } = pe.dom;
    if (!stateFilterList) {
      return;
    }

    const filteredOptions = getFilteredStateOptions(query);
    stateFilterList.innerHTML = "";

    if (filteredOptions.length === 0) {
      const emptyOption = document.createElement("li");
      emptyOption.className = "park-combobox-option is-empty";
      emptyOption.textContent = "No matching states / provinces";
      stateFilterList.appendChild(emptyOption);
      return;
    }

    pe.state.highlightedStateOptionIndex = Math.min(pe.state.highlightedStateOptionIndex, filteredOptions.length - 1);

    filteredOptions.forEach((option, index) => {
      const item = document.createElement("li");
      item.className = "park-combobox-option";
      item.setAttribute("role", "option");
      item.dataset.value = option.value;
      item.textContent = option.label;
      if (option.value === pe.state.selectedStateFilterValue) {
        item.classList.add("is-selected");
      }
      if (index === pe.state.highlightedStateOptionIndex) {
        item.classList.add("is-highlighted");
      }
      item.addEventListener("mousedown", (event) => {
        event.preventDefault();
        pe.state.selectedStateFilterValue = option.value;
        syncStateInputWithSelection();
        closeStateFilterDropdown();
        handleStateFilterChange();
        applyFilters();
      });
      stateFilterList.appendChild(item);
    });
  }

  function renderStateFilterOptions() {
    ensureStateSelectionIsVisible();
    syncStateInputWithSelection();

    const { stateFilterInput, stateFilterList } = pe.dom;
    if (stateFilterInput && stateFilterList && stateFilterList.hidden === false) {
      renderStateFilterDropdownOptions(stateFilterInput.value);
      openStateFilterDropdown();
    }
  }

  function handleCountryFilterChange() {
    renderStateFilterOptions();
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
      countryFilterInput,
      countryFilterList,
      stateFilterInput,
      stateFilterList,
      typeFilterInput,
      typeFilterList,
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

    countryFilterInput?.addEventListener("focus", () => {
      pe.state.highlightedCountryOptionIndex = 0;
      renderCountryFilterDropdownOptions(countryFilterInput.value);
      openCountryFilterDropdown();
    });

    countryFilterInput?.addEventListener("click", () => {
      renderCountryFilterDropdownOptions(countryFilterInput.value);
      openCountryFilterDropdown();
    });

    countryFilterInput?.addEventListener("input", () => {
      const query = countryFilterInput.value;
      const normalizedQuery = String(query || "").trim().toLowerCase();
      pe.state.highlightedCountryOptionIndex = 0;
      renderCountryFilterDropdownOptions(query);
      openCountryFilterDropdown();

      if (!normalizedQuery) {
        pe.state.selectedCountryFilterValue = "all";
        handleCountryFilterChange();
        applyFilters();
        return;
      }

      const matchingCountries = getScopedCountryOptions().filter(
        (option) => option.value !== "all" && option.label.toLowerCase().includes(normalizedQuery)
      );
      const exactMatch = matchingCountries.find((option) => option.label.toLowerCase() === normalizedQuery);
      const autoSelectedOption = exactMatch || (matchingCountries.length === 1 ? matchingCountries[0] : null);
      if (!autoSelectedOption) {
        return;
      }

      pe.state.selectedCountryFilterValue = autoSelectedOption.value;
      handleCountryFilterChange();
      applyFilters();
    });

    countryFilterInput?.addEventListener("keydown", (event) => {
      const filteredOptions = getFilteredCountryOptions(countryFilterInput.value);
      if (filteredOptions.length === 0) {
        if (event.key === "Escape") {
          closeCountryFilterDropdown();
        }
        return;
      }

      if (event.key === "ArrowDown") {
        event.preventDefault();
        pe.state.highlightedCountryOptionIndex = Math.min(
          pe.state.highlightedCountryOptionIndex + 1,
          filteredOptions.length - 1
        );
        renderCountryFilterDropdownOptions(countryFilterInput.value);
        openCountryFilterDropdown();
        return;
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();
        pe.state.highlightedCountryOptionIndex = Math.max(pe.state.highlightedCountryOptionIndex - 1, 0);
        renderCountryFilterDropdownOptions(countryFilterInput.value);
        openCountryFilterDropdown();
        return;
      }

      if (event.key === "Enter") {
        event.preventDefault();
        const normalizedQuery = String(countryFilterInput.value || "").trim().toLowerCase();
        if (!normalizedQuery) {
          pe.state.selectedCountryFilterValue = "all";
        } else {
          const countryOnlyOptions = filteredOptions.filter((option) => option.value !== "all");
          const exactMatch = countryOnlyOptions.find((option) => option.label.toLowerCase() === normalizedQuery);
          const highlightedOption = filteredOptions[pe.state.highlightedCountryOptionIndex];
          const fallbackOption = countryOnlyOptions[0];
          const selectedOption = exactMatch
            || (highlightedOption && highlightedOption.value !== "all" ? highlightedOption : null)
            || fallbackOption;

          pe.state.selectedCountryFilterValue = selectedOption ? selectedOption.value : "all";
        }

        syncCountryInputWithSelection();
        closeCountryFilterDropdown();
        handleCountryFilterChange();
        applyFilters();
        return;
      }

      if (event.key === "Escape") {
        closeCountryFilterDropdown();
      }
    });

    stateFilterInput?.addEventListener("focus", () => {
      pe.state.highlightedStateOptionIndex = 0;
      renderStateFilterDropdownOptions(stateFilterInput.value);
      openStateFilterDropdown();
    });

    stateFilterInput?.addEventListener("click", () => {
      renderStateFilterDropdownOptions(stateFilterInput.value);
      openStateFilterDropdown();
    });

    stateFilterInput?.addEventListener("input", () => {
      const query = stateFilterInput.value;
      const normalizedQuery = String(query || "").trim().toLowerCase();
      pe.state.highlightedStateOptionIndex = 0;
      renderStateFilterDropdownOptions(query);
      openStateFilterDropdown();

      if (!normalizedQuery) {
        pe.state.selectedStateFilterValue = "all";
        handleStateFilterChange();
        applyFilters();
        return;
      }

      const options = getScopedStateOptions(pe.state.selectedCountryFilterValue);
      const matchingStates = options.filter(
        (option) => option.value !== "all" && option.label.toLowerCase().includes(normalizedQuery)
      );
      const exactMatch = matchingStates.find((option) => option.label.toLowerCase() === normalizedQuery);
      const autoSelectedOption = exactMatch || (matchingStates.length === 1 ? matchingStates[0] : null);
      if (!autoSelectedOption) {
        return;
      }

      pe.state.selectedStateFilterValue = autoSelectedOption.value;
      handleStateFilterChange();
      applyFilters();
    });

    stateFilterInput?.addEventListener("keydown", (event) => {
      const filteredOptions = getFilteredStateOptions(stateFilterInput.value);
      if (filteredOptions.length === 0) {
        if (event.key === "Escape") {
          closeStateFilterDropdown();
        }
        return;
      }

      if (event.key === "ArrowDown") {
        event.preventDefault();
        pe.state.highlightedStateOptionIndex = Math.min(
          pe.state.highlightedStateOptionIndex + 1,
          filteredOptions.length - 1
        );
        renderStateFilterDropdownOptions(stateFilterInput.value);
        openStateFilterDropdown();
        return;
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();
        pe.state.highlightedStateOptionIndex = Math.max(pe.state.highlightedStateOptionIndex - 1, 0);
        renderStateFilterDropdownOptions(stateFilterInput.value);
        openStateFilterDropdown();
        return;
      }

      if (event.key === "Enter") {
        event.preventDefault();
        const normalizedQuery = String(stateFilterInput.value || "").trim().toLowerCase();
        if (!normalizedQuery) {
          pe.state.selectedStateFilterValue = "all";
        } else {
          const stateOnlyOptions = filteredOptions.filter((option) => option.value !== "all");
          const exactMatch = stateOnlyOptions.find((option) => option.label.toLowerCase() === normalizedQuery);
          const highlightedOption = filteredOptions[pe.state.highlightedStateOptionIndex];
          const fallbackOption = stateOnlyOptions[0];
          const selectedOption = exactMatch
            || (highlightedOption && highlightedOption.value !== "all" ? highlightedOption : null)
            || fallbackOption;

          pe.state.selectedStateFilterValue = selectedOption ? selectedOption.value : "all";
        }

        syncStateInputWithSelection();
        closeStateFilterDropdown();
        handleStateFilterChange();
        applyFilters();
        return;
      }

      if (event.key === "Escape") {
        closeStateFilterDropdown();
      }
    });

    typeFilterInput?.addEventListener("focus", () => {
      pe.state.highlightedTypeOptionIndex = 0;
      renderTypeFilterDropdownOptions(typeFilterInput.value);
      openTypeFilterDropdown();
    });

    typeFilterInput?.addEventListener("click", () => {
      renderTypeFilterDropdownOptions(typeFilterInput.value);
      openTypeFilterDropdown();
    });

    typeFilterInput?.addEventListener("input", () => {
      const query = typeFilterInput.value;
      const normalizedQuery = String(query || "").trim().toLowerCase();
      pe.state.highlightedTypeOptionIndex = 0;
      renderTypeFilterDropdownOptions(query);
      openTypeFilterDropdown();

      if (!normalizedQuery) {
        pe.state.selectedTypeFilterValue = "all";
        applyFilters();
        return;
      }

      const options = getTypeFilterOptions(pe.state.selectedCompanyFilterValue, pe.state.selectedParkFilterValue);
      const matchingTypes = options.filter(
        (option) => option.value !== "all" && option.label.toLowerCase().includes(normalizedQuery)
      );
      const exactMatch = matchingTypes.find((option) => option.label.toLowerCase() === normalizedQuery);
      const autoSelectedOption = exactMatch || (matchingTypes.length === 1 ? matchingTypes[0] : null);
      if (!autoSelectedOption) {
        return;
      }

      pe.state.selectedTypeFilterValue = autoSelectedOption.value;
      applyFilters();
    });

    typeFilterInput?.addEventListener("keydown", (event) => {
      const filteredOptions = getFilteredTypeOptions(typeFilterInput.value);
      if (filteredOptions.length === 0) {
        if (event.key === "Escape") {
          closeTypeFilterDropdown();
        }
        return;
      }

      if (event.key === "ArrowDown") {
        event.preventDefault();
        pe.state.highlightedTypeOptionIndex = Math.min(
          pe.state.highlightedTypeOptionIndex + 1,
          filteredOptions.length - 1
        );
        renderTypeFilterDropdownOptions(typeFilterInput.value);
        openTypeFilterDropdown();
        return;
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();
        pe.state.highlightedTypeOptionIndex = Math.max(pe.state.highlightedTypeOptionIndex - 1, 0);
        renderTypeFilterDropdownOptions(typeFilterInput.value);
        openTypeFilterDropdown();
        return;
      }

      if (event.key === "Enter") {
        event.preventDefault();
        const normalizedQuery = String(typeFilterInput.value || "").trim().toLowerCase();
        if (!normalizedQuery) {
          pe.state.selectedTypeFilterValue = "all";
        } else {
          const typeOnlyOptions = filteredOptions.filter((option) => option.value !== "all");
          const exactMatch = typeOnlyOptions.find((option) => option.label.toLowerCase() === normalizedQuery);
          const highlightedOption = filteredOptions[pe.state.highlightedTypeOptionIndex];
          const fallbackOption = typeOnlyOptions[0];
          const selectedOption = exactMatch
            || (highlightedOption && highlightedOption.value !== "all" ? highlightedOption : null)
            || fallbackOption;

          pe.state.selectedTypeFilterValue = selectedOption ? selectedOption.value : "all";
        }

        syncTypeInputWithSelection();
        closeTypeFilterDropdown();
        applyFilters();
        return;
      }

      if (event.key === "Escape") {
        closeTypeFilterDropdown();
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
        && !countryFilterInput?.contains(target)
        && !countryFilterList?.contains(target)
        && !stateFilterInput?.contains(target)
        && !stateFilterList?.contains(target)
        && !typeFilterInput?.contains(target)
        && !typeFilterList?.contains(target)
      ) {
        closeParkFilterDropdown();
        closeCompanyFilterDropdown();
        closeCountryFilterDropdown();
        closeStateFilterDropdown();
        closeTypeFilterDropdown();
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

    countryFilterInput?.addEventListener("blur", () => {
      setTimeout(() => {
        syncCountryInputWithSelection();
        closeCountryFilterDropdown();
      }, 0);
    });

    stateFilterInput?.addEventListener("blur", () => {
      setTimeout(() => {
        syncStateInputWithSelection();
        closeStateFilterDropdown();
      }, 0);
    });

    typeFilterInput?.addEventListener("blur", () => {
      setTimeout(() => {
        syncTypeInputWithSelection();
        closeTypeFilterDropdown();
      }, 0);
    });

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
