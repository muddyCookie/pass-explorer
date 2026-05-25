(function initFiltersModule() {
  const pe = window.PassExplorer = window.PassExplorer || {};

  pe.state = pe.state || {
    activeFilters: {
      company: [],
      park: [],
      country: [],
      state: [],
      type: []
    },
    highlightedOptionIndexByCategory: {
      company: 0,
      park: 0,
      country: 0,
      state: 0,
      type: 0
    }
  };

  const dropdownPortalState = new WeakMap();
  let activeDropdown = null;
  let dropdownListenersBound = false;
  let pendingDropdownReposition = false;
  let sidebarListenersBound = false;

  const filterConfig = {
    company: {
      label: "Company",
      inputKey: "companyFilterInput",
      listKey: "companyFilterList",
      selectKey: "companyFilterSelect",
      emptyText: "No matching companies",
      selectLabel: "Add Company Tag",
      matchMode: "any"
    },
    park: {
      label: "Park",
      inputKey: "parkFilterInput",
      listKey: "parkFilterList",
      selectKey: "parkFilterSelect",
      emptyText: "No matching parks",
      selectLabel: "Add Park Tag",
      matchMode: "all"
    },
    country: {
      label: "Country",
      inputKey: "countryFilterInput",
      listKey: "countryFilterList",
      selectKey: "countryFilterSelect",
      emptyText: "No matching countries",
      selectLabel: "Add Country Tag",
      matchMode: "all"
    },
    state: {
      label: "State",
      inputKey: "stateFilterInput",
      listKey: "stateFilterList",
      selectKey: "stateFilterSelect",
      emptyText: "No matching states / provinces",
      selectLabel: "Add State / Province Tag",
      matchMode: "all"
    },
    type: {
      label: "Tier",
      inputKey: "typeFilterInput",
      listKey: "typeFilterList",
      selectKey: "typeFilterSelect",
      emptyText: "No matching tiers",
      selectLabel: "Add Tier Tag",
      matchMode: "any"
    }
  };

  function setSelectOptions(selectElement, options, placeholderLabel) {
    if (!selectElement) {
      return;
    }

    const fragment = document.createDocumentFragment();
    const placeholderOption = document.createElement("option");
    placeholderOption.value = "";
    placeholderOption.textContent = placeholderLabel;
    fragment.appendChild(placeholderOption);

    for (const option of options) {
      const optionEl = document.createElement("option");
      optionEl.value = option.value;
      optionEl.textContent = option.label;
      fragment.appendChild(optionEl);
    }

    selectElement.innerHTML = "";
    selectElement.appendChild(fragment);
    selectElement.value = "";
  }

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
    listElement.style.left = `${rect.left}px`;
    listElement.style.top = `${rect.bottom + gap}px`;
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

    const SWIPE_CLOSE_MIN_X = 45;
    const SWIPE_MAX_Y = 40;
    let touchStartX = 0;
    let touchStartY = 0;
    let touchStartedWhenOpen = false;
    let isDesktopCollapsed = false;
    let pageScrollLocked = false;
    let lockedScrollY = 0;

    function syncSidebarAccessibility(isOpen) {
      backdrop?.classList.toggle("active", isOpen);
      backdrop?.setAttribute("aria-hidden", String(!isOpen));

      if (toggleBtn) {
        toggleBtn.setAttribute("aria-expanded", String(isOpen));
        toggleBtn.setAttribute("aria-label", isOpen ? "Close filters" : "Open filters");
      }
    }

    function lockPageScroll() {
      if (pageScrollLocked) {
        return;
      }
      pageScrollLocked = true;
      lockedScrollY = window.scrollY || window.pageYOffset || 0;

      document.body.classList.add("is-scroll-locked");
      document.body.style.position = "fixed";
      document.body.style.top = `-${lockedScrollY}px`;
      document.body.style.left = "0";
      document.body.style.right = "0";
      document.body.style.width = "100%";
    }

    function unlockPageScroll() {
      if (!pageScrollLocked) {
        return;
      }
      pageScrollLocked = false;

      document.body.classList.remove("is-scroll-locked");
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.width = "";
      window.scrollTo(0, lockedScrollY);
    }

    function setSidebarOpen(isOpen) {
      if (!controls) return;

      if (!mobileViewport.matches) {
        controls.classList.remove("open");
        syncSidebarAccessibility(false);
        document.documentElement.classList.remove("pe-sidebar-open");
        unlockPageScroll();
        return;
      }

      controls.classList.toggle("open", isOpen);
      syncSidebarAccessibility(isOpen);
      document.documentElement.classList.toggle("pe-sidebar-open", isOpen);
      if (isOpen) {
        lockPageScroll();
      } else {
        unlockPageScroll();
      }
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

    const SWIPE_OPEN_EDGE_PX = 72;

    const onTouchStart = (event) => {
      if (!mobileViewport.matches || !controls) return;
      touchStartedWhenOpen = controls.classList.contains("open");

      const touch = event.touches && event.touches[0];
      if (!touch) return;
      touchStartX = touch.clientX;
      touchStartY = touch.clientY;
    };

    const onTouchEnd = (event) => {
      if (!mobileViewport.matches || !controls) return;

      const touch = event.changedTouches && event.changedTouches[0];
      if (!touch) return;

      const dx = touch.clientX - touchStartX;
      const dy = touch.clientY - touchStartY;
      const isHorizontal = Math.abs(dy) <= SWIPE_MAX_Y && Math.abs(dx) >= SWIPE_CLOSE_MIN_X;
      const wasOpen = touchStartedWhenOpen;
      touchStartedWhenOpen = false;

      if (isHorizontal && wasOpen && dx > 0) {
        setSidebarOpen(false);
        return;
      }

      if (isHorizontal && !wasOpen && dx < 0) {
        const edgeStart = touchStartX >= (window.innerWidth - SWIPE_OPEN_EDGE_PX);
        if (edgeStart) {
          setSidebarOpen(true);
        }
      }
    };

    controls?.addEventListener("touchstart", onTouchStart, { passive: true });
    controls?.addEventListener("touchend", onTouchEnd, { passive: true });
    backdrop?.addEventListener("touchstart", onTouchStart, { passive: true });
    backdrop?.addEventListener("touchend", onTouchEnd, { passive: true });
    document.addEventListener("touchstart", onTouchStart, { passive: true });
    document.addEventListener("touchend", onTouchEnd, { passive: true });

    setDesktopCollapsed(false);
    setSidebarOpen(false);
  }

  function getCategoryElements(categoryKey) {
    const config = filterConfig[categoryKey];
    return {
      input: pe.dom[config.inputKey],
      list: pe.dom[config.listKey],
      select: pe.dom[config.selectKey]
    };
  }

  function getActiveFilters() {
    return pe.state.activeFilters;
  }

  function getFilterValues(categoryKey) {
    return Array.isArray(getActiveFilters()[categoryKey]) ? getActiveFilters()[categoryKey] : [];
  }

  function normalizeQuery(value) {
    return String(value || "").trim().toLowerCase();
  }

  function getOfferParkNames(offer) {
    return expandAccessibleParks(offer.accessibleParks);
  }

  function getOfferStateSet(offer) {
    const states = new Set();
    for (const parkName of getOfferParkNames(offer)) {
      const state = String(parkByName[parkName]?.state || "").trim();
      if (state && state !== "Unknown") {
        states.add(state);
      }
    }
    return states;
  }

  function getOfferCountrySet(offer) {
    const countries = new Set();
    for (const parkName of getOfferParkNames(offer)) {
      const country = String(parkByName[parkName]?.country || "").trim();
      if (country && country !== "Unknown") {
        countries.add(country);
      }
    }
    return countries;
  }

  function offerMatchesCategory(offer, categoryKey, values) {
    if (!values || values.length === 0) {
      return true;
    }

    if (categoryKey === "company") {
      return values.includes(offer.company);
    }

    if (categoryKey === "type") {
      return values.includes(offer.passType);
    }

    if (categoryKey === "park") {
      const parks = getOfferParkNames(offer);
      return values.every((value) => parks.includes(value));
    }

    if (categoryKey === "state") {
      const states = getOfferStateSet(offer);
      return values.every((value) => states.has(value));
    }

    if (categoryKey === "country") {
      const countries = getOfferCountrySet(offer);
      return values.every((value) => countries.has(value));
    }

    return true;
  }

  function offerMatchesFilters(offer, filters = getActiveFilters(), ignoredCategoryKey = "") {
    return Object.keys(filterConfig).every((categoryKey) => {
      if (categoryKey === ignoredCategoryKey) {
        return true;
      }
      return offerMatchesCategory(offer, categoryKey, filters[categoryKey]);
    });
  }

  function getOffersMatchingFilters(ignoredCategoryKey = "") {
    return passOffers.filter((offer) => offerMatchesFilters(offer, getActiveFilters(), ignoredCategoryKey));
  }

  function getOptionsForCategory(categoryKey) {
    const selectedValues = getFilterValues(categoryKey);
    const shouldKeepCurrentCategoryScope = selectedValues.length > 0
      && filterConfig[categoryKey].matchMode === "all";
    const offers = shouldKeepCurrentCategoryScope
      ? getOffersMatchingFilters()
      : getOffersMatchingFilters(categoryKey);

    if (categoryKey === "company") {
      return Array.from(new Set(offers.map((offer) => offer.company)))
        .sort((a, b) => a.localeCompare(b))
        .map((value) => ({ value, label: value }));
    }

    if (categoryKey === "type") {
      return Array.from(new Set(offers.map((offer) => offer.passType)))
        .sort((a, b) => a.localeCompare(b))
        .map((value) => ({ value, label: value }));
    }

    if (categoryKey === "park") {
      return Array.from(
        new Set(offers.flatMap((offer) => getOfferParkNames(offer)))
      )
        .sort((a, b) => a.localeCompare(b))
        .map((value) => ({ value, label: value }));
    }

    if (categoryKey === "country") {
      return Array.from(
        new Set(offers.flatMap((offer) => Array.from(getOfferCountrySet(offer))))
      )
        .sort((a, b) => a.localeCompare(b))
        .map((value) => ({ value, label: value }));
    }

    if (categoryKey === "state") {
      return Array.from(
        new Set(offers.flatMap((offer) => Array.from(getOfferStateSet(offer))))
      )
        .sort((a, b) => a.localeCompare(b))
        .map((value) => ({ value, label: value }));
    }

    return [];
  }

  function getFilteredOptions(categoryKey, query = "") {
    const options = getOptionsForCategory(categoryKey);
    const normalizedQuery = normalizeQuery(query);
    if (!normalizedQuery) {
      return options;
    }

    return options.filter((option) => option.label.toLowerCase().includes(normalizedQuery));
  }

  function clearAllInputQueries() {
    for (const categoryKey of Object.keys(filterConfig)) {
      const { input, select } = getCategoryElements(categoryKey);
      if (input) {
        input.value = "";
      }
      if (select) {
        select.value = "";
      }
    }
  }

  function closeDropdown(categoryKey) {
    const { input, list } = getCategoryElements(categoryKey);
    if (!input || !list) {
      return;
    }

    list.hidden = true;
    input.setAttribute("aria-expanded", "false");
    if (activeDropdown?.listElement === list) {
      setActiveDropdown(null, null);
    }
    restoreDropdown(list);
  }

  function closeAllDropdowns() {
    for (const categoryKey of Object.keys(filterConfig)) {
      closeDropdown(categoryKey);
    }
  }

  function openDropdown(categoryKey) {
    const { input, list } = getCategoryElements(categoryKey);
    if (!input || !list) {
      return;
    }

    bindDropdownPositionListeners();
    portalDropdown(list);
    setActiveDropdown(list, input);
    list.hidden = false;
    input.setAttribute("aria-expanded", "true");
  }

  function renderDropdownOptions(categoryKey, query = "") {
    const config = filterConfig[categoryKey];
    const { list } = getCategoryElements(categoryKey);
    if (!list) {
      return;
    }

    const options = getFilteredOptions(categoryKey, query);
    const selectedValues = new Set(getFilterValues(categoryKey));
    list.innerHTML = "";

    if (options.length === 0) {
      const emptyOption = document.createElement("li");
      emptyOption.className = "park-combobox-option is-empty";
      emptyOption.textContent = config.emptyText;
      list.appendChild(emptyOption);
      return;
    }

    const highlightedIndex = Math.min(
      pe.state.highlightedOptionIndexByCategory[categoryKey] || 0,
      Math.max(options.length - 1, 0)
    );
    pe.state.highlightedOptionIndexByCategory[categoryKey] = highlightedIndex;

    options.forEach((option, index) => {
      const item = document.createElement("li");
      item.className = "park-combobox-option";
      item.setAttribute("role", "option");
      item.dataset.value = option.value;
      item.textContent = option.label;

      if (selectedValues.has(option.value)) {
        item.classList.add("is-selected");
      }
      if (index === highlightedIndex) {
        item.classList.add("is-highlighted");
      }

      item.addEventListener("mousedown", (event) => {
        event.preventDefault();
        toggleFilterValue(categoryKey, option.value);
      });

      list.appendChild(item);
    });
  }

  function refreshFilterControls() {
    for (const categoryKey of Object.keys(filterConfig)) {
      const config = filterConfig[categoryKey];
      const { input, list, select } = getCategoryElements(categoryKey);
      const options = getOptionsForCategory(categoryKey);

      setSelectOptions(select, options, config.selectLabel);

      if (input && list && list.hidden === false) {
        renderDropdownOptions(categoryKey, input.value);
        openDropdown(categoryKey);
      }
    }
  }

  function renderActiveFilterTags() {
    const { activeFilterBar, activeFilterTags, clearActiveFiltersBtn } = pe.dom;
    if (!activeFilterBar || !activeFilterTags || !clearActiveFiltersBtn) {
      return;
    }

    const entries = [];
    for (const categoryKey of Object.keys(filterConfig)) {
      for (const value of getFilterValues(categoryKey)) {
        entries.push({
          categoryKey,
          label: `${filterConfig[categoryKey].label}: ${value}`,
          value
        });
      }
    }

    activeFilterTags.innerHTML = "";

    if (entries.length === 0) {
      activeFilterBar.hidden = true;
      clearActiveFiltersBtn.hidden = true;
      return;
    }

    for (const entry of entries) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "active-filter-tag";
      button.dataset.category = entry.categoryKey;
      button.dataset.value = entry.value;
      button.textContent = `${entry.label} x`;
      button.setAttribute("aria-label", `Remove filter ${entry.label}`);
      button.addEventListener("click", () => {
        removeFilterValue(entry.categoryKey, entry.value);
      });
      activeFilterTags.appendChild(button);
    }

    activeFilterBar.hidden = false;
    clearActiveFiltersBtn.hidden = false;
  }

  function applyFilters() {
    renderActiveFilterTags();
    refreshFilterControls();
    pe.renderPasses(getActiveFilters());
  }

  function addFilterValue(categoryKey, value) {
    const normalizedValue = String(value || "").trim();
    if (!normalizedValue) {
      return;
    }

    const activeValues = getFilterValues(categoryKey);
    if (!activeValues.includes(normalizedValue)) {
      activeValues.push(normalizedValue);
    }

    const { input, select } = getCategoryElements(categoryKey);
    if (input) {
      input.value = "";
    }
    if (select) {
      select.value = "";
    }

    closeDropdown(categoryKey);
    applyFilters();
  }

  function removeFilterValue(categoryKey, value) {
    pe.state.activeFilters[categoryKey] = getFilterValues(categoryKey)
      .filter((entry) => entry !== value);
    applyFilters();
  }

  function toggleFilterValue(categoryKey, value) {
    if (getFilterValues(categoryKey).includes(value)) {
      removeFilterValue(categoryKey, value);
      return;
    }
    addFilterValue(categoryKey, value);
  }

  function clearAllFilters() {
    for (const categoryKey of Object.keys(filterConfig)) {
      pe.state.activeFilters[categoryKey] = [];
    }
    clearAllInputQueries();
    closeAllDropdowns();
    applyFilters();
  }

  function chooseHighlightedOrBestOption(categoryKey) {
    const { input } = getCategoryElements(categoryKey);
    const options = getFilteredOptions(categoryKey, input?.value || "");
    if (options.length === 0) {
      return null;
    }

    const normalizedQuery = normalizeQuery(input?.value || "");
    const exactMatch = options.find((option) => option.label.toLowerCase() === normalizedQuery);
    if (exactMatch) {
      return exactMatch;
    }

    const highlightedIndex = pe.state.highlightedOptionIndexByCategory[categoryKey] || 0;
    return options[Math.min(highlightedIndex, options.length - 1)] || options[0];
  }

  function bindCategoryEvents(categoryKey) {
    const { input, list, select } = getCategoryElements(categoryKey);
    if (!input || !list) {
      return;
    }

    select?.addEventListener("change", () => {
      const value = String(select.value || "").trim();
      if (!value) {
        return;
      }
      addFilterValue(categoryKey, value);
    });

    input.addEventListener("focus", () => {
      pe.state.highlightedOptionIndexByCategory[categoryKey] = 0;
      renderDropdownOptions(categoryKey, input.value);
      openDropdown(categoryKey);
    });

    input.addEventListener("click", () => {
      renderDropdownOptions(categoryKey, input.value);
      openDropdown(categoryKey);
    });

    input.addEventListener("input", () => {
      pe.state.highlightedOptionIndexByCategory[categoryKey] = 0;
      renderDropdownOptions(categoryKey, input.value);
      openDropdown(categoryKey);
    });

    input.addEventListener("keydown", (event) => {
      const options = getFilteredOptions(categoryKey, input.value);

      if (event.key === "ArrowDown") {
        event.preventDefault();
        if (options.length > 0) {
          pe.state.highlightedOptionIndexByCategory[categoryKey] = Math.min(
            (pe.state.highlightedOptionIndexByCategory[categoryKey] || 0) + 1,
            options.length - 1
          );
        }
        renderDropdownOptions(categoryKey, input.value);
        openDropdown(categoryKey);
        return;
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();
        pe.state.highlightedOptionIndexByCategory[categoryKey] = Math.max(
          (pe.state.highlightedOptionIndexByCategory[categoryKey] || 0) - 1,
          0
        );
        renderDropdownOptions(categoryKey, input.value);
        openDropdown(categoryKey);
        return;
      }

      if (event.key === "Enter") {
        event.preventDefault();
        const option = chooseHighlightedOrBestOption(categoryKey);
        if (option) {
          addFilterValue(categoryKey, option.value);
        }
        return;
      }

      if (event.key === "Escape") {
        closeDropdown(categoryKey);
      }
    });

    input.addEventListener("blur", () => {
      setTimeout(() => {
        input.value = "";
        closeDropdown(categoryKey);
      }, 0);
    });
  }

  function bindFilterEvents() {
    bindSidebarToggle();

    for (const categoryKey of Object.keys(filterConfig)) {
      bindCategoryEvents(categoryKey);
    }

    pe.dom.priceSort?.addEventListener("change", () => {
      pe.renderPasses(getActiveFilters());
    });

    pe.dom.clearActiveFiltersBtn?.addEventListener("click", clearAllFilters);

    document.addEventListener("click", (event) => {
      const target = event.target;
      if (!(target instanceof Node)) {
        return;
      }

      const clickedInsideDropdown = Object.keys(filterConfig).some((categoryKey) => {
        const { input, list } = getCategoryElements(categoryKey);
        return Boolean(input?.contains(target) || list?.contains(target));
      });

      if (!clickedInsideDropdown) {
        closeAllDropdowns();
      }
    });
  }

  function getPassTypeOrderMap(activeFilters = getActiveFilters()) {
    const visibleTypes = Array.from(
      new Set(
        passOffers
          .filter((offer) => offerMatchesFilters(offer, activeFilters, "type"))
          .map((offer) => offer.passType)
      )
    ).sort((a, b) => a.localeCompare(b));

    return new Map(visibleTypes.map((tierName, index) => [tierName, index]));
  }

  pe.bindFilterEvents = bindFilterEvents;
  pe.refreshFilterControls = refreshFilterControls;
  pe.renderActiveFilterTags = renderActiveFilterTags;
  pe.clearAllFilters = clearAllFilters;
  pe.getActiveFilters = getActiveFilters;
  pe.offerMatchesFilters = offerMatchesFilters;
  pe.getPassTypeOrderMap = getPassTypeOrderMap;
})();
