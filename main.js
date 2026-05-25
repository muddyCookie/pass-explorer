(async function bootstrapPassExplorer() {
  const pe = window.PassExplorer = window.PassExplorer || {};

  // `main.js` is the orchestration layer: collect DOM refs, bind handlers, then render.
  const parkFilterInput = document.getElementById("parkFilterInput");
  const parkFilterList = document.getElementById("parkFilterList");
  const companyFilterInput = document.getElementById("companyFilterInput");
  const companyFilterList = document.getElementById("companyFilterList");

  const pricingNoticeBanner = document.getElementById("pricingNoticeBanner");
  const pricingNoticeBannerDetails = document.getElementById("pricingNoticeBannerDetails");
  const pricingNoticeBannerDismiss = document.getElementById("pricingNoticeBannerDismiss");
  const pricingNoticeHeaderDetails = document.getElementById("pricingNoticeHeaderDetails");
  const pricingNoticeFooterDetails = document.getElementById("pricingNoticeFooterDetails");
  const pricingNoticeDialog = document.getElementById("pricingNoticeDialog");
  const pricingNoticeDialogClose = document.getElementById("pricingNoticeDialogClose");

  pe.dom = {
    parkFilterInput,
    parkFilterList,
    parkFilterSelect: document.getElementById("parkFilterSelect"),
    companyFilterInput,
    companyFilterList,
    companyFilterSelect: document.getElementById("companyFilterSelect"),
    countryFilterInput: document.getElementById("countryFilterInput"),
    countryFilterList: document.getElementById("countryFilterList"),
    countryFilterSelect: document.getElementById("countryFilterSelect"),
    stateFilterInput: document.getElementById("stateFilterInput"),
    stateFilterList: document.getElementById("stateFilterList"),
    stateFilterSelect: document.getElementById("stateFilterSelect"),
    typeFilterInput: document.getElementById("typeFilterInput"),
    typeFilterList: document.getElementById("typeFilterList"),
    typeFilterSelect: document.getElementById("typeFilterSelect"),
    priceSort: document.getElementById("priceSort"),
    passGrid: document.getElementById("passGrid"),
    resultsMeta: document.getElementById("resultsMeta"),
    activeFilterBar: document.getElementById("activeFilterBar"),
    activeFilterTags: document.getElementById("activeFilterTags"),
    clearActiveFiltersBtn: document.getElementById("clearActiveFiltersBtn"),
    template: document.getElementById("passCardTemplate"),
    pricingNoticeBanner,
    pricingNoticeFooterDetails,
    pricingNoticeDialog
  };

  function bindPricingNotice() {
    if (!pricingNoticeBanner || !pricingNoticeDialog) return;

    const storageKey = "pe-pricing-notice-dismissed-v1";
    const supportsDialog = typeof pricingNoticeDialog.showModal === "function";

    if (!supportsDialog) {
      pricingNoticeDialog.style.display = "none";
    }

    function setNoticeOffset(px) {
      const value = Number.isFinite(px) && px > 0 ? `${Math.round(px)}px` : "0px";
      document.documentElement.style.setProperty("--pe-notice-offset", value);
    }

    function updateNoticeOffset() {
      if (pricingNoticeBanner.hidden) {
        setNoticeOffset(0);
        return;
      }
      const rect = pricingNoticeBanner.getBoundingClientRect();
      // Add a small buffer so the sticky filters never visually touch the banner.
      setNoticeOffset(rect.height + 12);
    }

    function updateHeaderDetailsButton() {
      if (!pricingNoticeHeaderDetails) return;
      // While the banner is visible, we already have a "Details" button up top.
      // After dismissing, surface the details button next to the results title.
      pricingNoticeHeaderDetails.hidden = !pricingNoticeBanner.hidden;
    }

    function openDialog() {
      if (supportsDialog) {
        if (!pricingNoticeDialog.open) pricingNoticeDialog.showModal();
        return;
      }

      pricingNoticeDialog.setAttribute("open", "");
      pricingNoticeDialog.style.display = "block";
    }

    function closeDialog() {
      if (supportsDialog) {
        if (pricingNoticeDialog.open) pricingNoticeDialog.close();
        return;
      }

      pricingNoticeDialog.removeAttribute("open");
      pricingNoticeDialog.style.display = "none";
    }

    function dismissBanner() {
      pricingNoticeBanner.hidden = true;
      updateNoticeOffset();
      updateHeaderDetailsButton();
      try {
        window.localStorage.setItem(storageKey, "1");
      } catch {
        // ignore storage failures
      }
    }

    function bannerShouldShow() {
      try {
        return window.localStorage.getItem(storageKey) !== "1";
      } catch {
        return true;
      }
    }

    pricingNoticeBanner.hidden = !bannerShouldShow();
    updateNoticeOffset();
    updateHeaderDetailsButton();

    pricingNoticeBannerDetails?.addEventListener("click", openDialog);
    pricingNoticeHeaderDetails?.addEventListener("click", openDialog);
    pricingNoticeFooterDetails?.addEventListener("click", openDialog);
    pricingNoticeBannerDismiss?.addEventListener("click", dismissBanner);
    pricingNoticeDialogClose?.addEventListener("click", closeDialog);

    pricingNoticeDialog.addEventListener("click", (event) => {
      // Close when clicking the backdrop (dialog itself).
      if (event.target === pricingNoticeDialog) {
        closeDialog();
      }
    });

    // Non-dialog fallback: close on Escape.
    if (!supportsDialog) {
      document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") closeDialog();
      });
    }

    if (typeof ResizeObserver !== "undefined") {
      const ro = new ResizeObserver(() => updateNoticeOffset());
      ro.observe(pricingNoticeBanner);
    } else {
      window.addEventListener("resize", () => updateNoticeOffset(), { passive: true });
    }

    pe.openPricingNotice = openDialog;
    pe.dismissPricingNoticeBanner = dismissBanner;
  }

  pe.bindFilterEvents();
  bindPricingNotice();

  if (typeof fetchExchangeRates === "function") {
    await fetchExchangeRates();
  }

  // Start in an unscoped state: no single company is selected by default.
  pe.refreshFilterControls();
  pe.renderActiveFilterTags();
  pe.renderPasses();
})();
