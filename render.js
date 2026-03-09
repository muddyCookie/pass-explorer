(function initRenderModule() {
  const pe = window.PassExplorer = window.PassExplorer || {};

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

  // Main renderer. Applies active filters and redraws all visible pass cards.
  function renderPasses(
    selectedCompany = "all",
    selectedPark = "all",
    selectedType = "all",
    selectedSort = "none"
  ) {
    const { passGrid, resultsMeta, template } = pe.dom;
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

    const passTypeOrder = pe.getPassTypeOrderMap(selectedCompany);
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

      const sortedParksToDisplay = [...offer.expandedParks].sort((a, b) => a.localeCompare(b));
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

  pe.renderPasses = renderPasses;
})();
