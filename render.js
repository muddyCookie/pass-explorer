(function initRenderModule() {
  const pe = window.PassExplorer = window.PassExplorer || {};

  function formatDurationMonths(months) {
    const numeric = Number(months);
    if (!Number.isFinite(numeric) || numeric <= 0) {
      return "";
    }
    const rounded = Math.round(numeric);
    return rounded === 1 ? "1 month" : `${rounded} months`;
  }

  function getTodayUtcDateOnly() {
    const now = new Date();
    return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  }

  function addMonthsUtc(dateUtc, months) {
    if (!(dateUtc instanceof Date) || !Number.isFinite(dateUtc.getTime())) {
      return null;
    }
    const numericMonths = Number(months);
    if (!Number.isFinite(numericMonths) || numericMonths <= 0) {
      return null;
    }

    const roundedMonths = Math.round(numericMonths);
    const year = dateUtc.getUTCFullYear();
    const month = dateUtc.getUTCMonth();
    const day = dateUtc.getUTCDate();

    // Use the JS date overflow rules to handle month/year rollover, and clamp
    // to the last day-of-month when needed (e.g. Jan 31 + 1 mo => Feb 28/29).
    const tentative = new Date(Date.UTC(year, month + roundedMonths, 1));
    const lastDayOfTargetMonth = new Date(Date.UTC(tentative.getUTCFullYear(), tentative.getUTCMonth() + 1, 0)).getUTCDate();
    const clampedDay = Math.min(day, lastDayOfTargetMonth);
    return new Date(Date.UTC(tentative.getUTCFullYear(), tentative.getUTCMonth(), clampedDay));
  }

  function getOfferNumericPrice(offer) {
    if (!offer) {
      return Number.NaN;
    }

    const pricing = offer.pricing ?? null;
    if (pricing?.type === "membership") {
      const monthly = parsePrice(pricing.monthly);
      const downPayment = parsePrice(pricing.downPayment);
      const minMonthsRaw = pricing.minMonths;
      const minMonths = Number.isFinite(Number(minMonthsRaw)) ? Number(minMonthsRaw) : 12;
      const total = downPayment + (monthly * minMonths);
      if (!Number.isFinite(total) || total <= 0) {
        return Number.NaN;
      }

      const currency = String(offer.currency || "USD").toUpperCase();
      if (currency === "USD") {
        return total;
      }

      if (typeof convertToUsd === "function") {
        const usdTotal = convertToUsd(total, currency);
        return Number.isFinite(usdTotal) ? usdTotal : Number.NaN;
      }

      return Number.NaN;
    }

    const currency = String(offer.currency || "USD").toUpperCase();
    const numeric = parsePrice(offer.price);
    if (!Number.isFinite(numeric) || numeric <= 0) {
      return Number.NaN;
    }

    if (currency === "USD") {
      return numeric;
    }

    if (typeof convertToUsd === "function") {
      const usd = convertToUsd(numeric, currency);
      return Number.isFinite(usd) ? usd : Number.NaN;
    }

    return Number.NaN;
  }

  function shouldOmitPassSuffix(companyName, passType) {
    if (!passType) {
      return true;
    }

    if (/\bpass\b/i.test(String(passType).trim())) {
      return true;
    }

    if (/\bmembership\b/i.test(String(passType).trim())) {
      return true;
    }

    const rules = typeof getCompanyConfig === "function"
      ? getCompanyConfig(companyName)?.passDisplayRules
      : null;
    const omitList = rules?.omitPassSuffixForTypes || [];
    return Array.isArray(omitList) && omitList.includes(passType);
  }

  function formatPassCardTitle(offer) {
    const passType = String(offer?.passType || "").trim();
    const homePark = String(offer?.homePark || "").trim();
    if (!homePark) {
      return passType;
    }
    if (!passType) {
      return homePark;
    }

    return shouldOmitPassSuffix(offer.company, passType)
      ? `${homePark} - ${passType}`
      : `${homePark} - ${passType} Pass`;
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

  // Main renderer. Applies active filters and redraws all visible pass cards.
  function renderPasses(
    selectedCompany = "all",
    selectedPark = "all",
    selectedType = "all",
    selectedSort = "none",
    selectedCountry = "all",
    selectedState = "all"
  ) {
    const { passGrid, resultsMeta, template } = pe.dom;
    passGrid.innerHTML = "";
    const locationFilterActive = selectedCountry !== "all" || selectedState !== "all";

    const parkMatchesLocation = (park) => {
      if (!park) return false;
      if (selectedCountry !== "all" && park.country !== selectedCountry) {
        return false;
      }
      if (selectedState !== "all" && park.state !== selectedState) {
        return false;
      }
      return true;
    };

    let visibleOffers = passOffers
      .map((offer, index) => ({
        ...offer,
        originalIndex: index,
        homeParkEntry: parkByName[offer.homePark] || null,
        expandedParks: expandAccessibleParks(offer.accessibleParks),
        numericPrice: getOfferNumericPrice(offer)
      }))
      .filter((offer) => {
        const matchesCompany = selectedCompany === "all" || offer.company === selectedCompany;
        const matchesPark = selectedPark === "all" || offer.expandedParks.includes(selectedPark);
        const matchesType = selectedType === "all" || offer.passType === selectedType;

        const matchesCountry = selectedCountry === "all"
          || parkMatchesLocation(offer.homeParkEntry)
          || offer.expandedParks.some((parkName) => parkMatchesLocation(parkByName[parkName]));

        const matchesState = selectedState === "all"
          || parkMatchesLocation(offer.homeParkEntry)
          || offer.expandedParks.some((parkName) => parkMatchesLocation(parkByName[parkName]));

        return matchesCompany && matchesPark && matchesType && matchesCountry && matchesState;
      });

    const passTypeOrder = pe.getPassTypeOrderMap(selectedCompany, selectedPark);
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
      const aPriceMissing = !Number.isFinite(a.numericPrice);
      const bPriceMissing = !Number.isFinite(b.numericPrice);
      if (aPriceMissing || bPriceMissing) {
        if (aPriceMissing && bPriceMissing) {
          return compareByNameThenTierThenOriginal(a, b);
        }
        return aPriceMissing ? 1 : -1;
      }

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
    let locationDividerIndex = -1;
    let locationDividerText = "";

    if (locationFilterActive && selectedPark === "all") {
      const homeLocationOffers = [];
      const otherIncludingOffers = [];

      for (const offer of visibleOffers) {
        if (parkMatchesLocation(offer.homeParkEntry)) {
          homeLocationOffers.push(offer);
        } else {
          otherIncludingOffers.push(offer);
        }
      }

      homeLocationOffers.sort(compareBySelectedSort);
      otherIncludingOffers.sort(compareBySelectedSort);

      const label = selectedState !== "all"
        ? (selectedCountry !== "all" ? `${selectedState}, ${selectedCountry}` : selectedState)
        : selectedCountry;
      locationDividerText = label
        ? `Other passes that include parks in ${label}`
        : "Other passes that include matching parks";

      locationDividerIndex = homeLocationOffers.length > 0 && otherIncludingOffers.length > 0
        ? homeLocationOffers.length
        : -1;
      visibleOffers = [...homeLocationOffers, ...otherIncludingOffers];
    } else if (selectedPark !== "all") {
      const homeParkOffers = [];
      const otherMatchingOffers = [];

      for (const offer of visibleOffers) {
        if (offer.homePark === selectedPark) {
          homeParkOffers.push(offer);
        } else {
          otherMatchingOffers.push(offer);
        }
      }

      if (selectedSort === "none") {
        homeParkOffers.sort(compareByPassTypeThenOriginal);
      } else {
        homeParkOffers.sort(compareBySelectedSort);
      }
      otherMatchingOffers.sort(compareBySelectedSort);

      otherPassesDividerIndex = homeParkOffers.length > 0 && otherMatchingOffers.length > 0
        ? homeParkOffers.length
        : -1;
      visibleOffers = [...homeParkOffers, ...otherMatchingOffers];
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
      if (index === locationDividerIndex) {
        const divider = document.createElement("p");
        divider.className = "results-divider";
        divider.textContent = locationDividerText;
        passGrid.appendChild(divider);
      }

      if (index === otherPassesDividerIndex) {
        const divider = document.createElement("p");
        divider.className = "results-divider";
        divider.textContent = `Other passes that include ${selectedPark}`;
        passGrid.appendChild(divider);
      }

      const node = template.content.cloneNode(true);
      const passNameEl = node.querySelector(".pass-name");
      passNameEl.textContent = formatPassCardTitle(offer);
      node.querySelector(".pass-price").textContent = formatOfferPrice(offer);

      const priceSubEl = node.querySelector(".pass-price-sub");
      const priceNoteEl = node.querySelector(".pass-price-note");
      const membershipNote = typeof formatOfferPriceNote === "function" ? formatOfferPriceNote(offer) : "";
      const priceSub = typeof formatOfferPriceSub === "function" ? formatOfferPriceSub(offer) : "";

      if (priceSubEl) {
        // Only show the native-currency line under the main price for membership pricing.
        const showSub = Boolean(priceSub) && Boolean(membershipNote);
        priceSubEl.textContent = showSub ? priceSub : "";
        priceSubEl.hidden = !showSub;
      }

      const accessThruRaw = String(offer?.accessThru || "").trim();
      let accessThruText = "";
      if (accessThruRaw) {
        const isoYmd = /^(\d{4})-(\d{2})-(\d{2})$/.exec(accessThruRaw);
        const parsed = isoYmd
          ? new Date(Date.UTC(Number(isoYmd[1]), Number(isoYmd[2]) - 1, Number(isoYmd[3])))
          : new Date(accessThruRaw);

        if (!Number.isNaN(parsed.getTime())) {
          const month = parsed.toLocaleString("en-US", { month: "short", timeZone: "UTC" }).toUpperCase();
          const day = parsed.toLocaleString("en-US", { day: "2-digit", timeZone: "UTC" });
          const year = parsed.toLocaleString("en-US", { year: "numeric", timeZone: "UTC" });
          accessThruText = `PARK ACCESS THRU ${month}. ${day}, ${year}`;
        } else {
          accessThruText = `PARK ACCESS THRU ${accessThruRaw}`;
        }
      }

      const detailLabel = node.querySelector(".detail-label");
      if (detailLabel) {
        detailLabel.textContent = accessThruText || "Park Access";
      }

      if (priceNoteEl) {
        const detailNote = membershipNote || priceSub;
        priceNoteEl.textContent = detailNote;
        priceNoteEl.hidden = !detailNote;
      }
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
      buyLink.textContent = offer?.pricing?.type === "membership" ? "Buy This Membership" : "Buy This Pass";
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
