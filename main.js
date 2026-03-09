(function bootstrapPassExplorer() {
  const pe = window.PassExplorer = window.PassExplorer || {};

  // `main.js` is the orchestration layer: collect DOM refs, bind handlers, then render.
  const parkFilterInput = document.getElementById("parkFilterInput");
  const parkFilterList = document.getElementById("parkFilterList");
  const { companyFilterInput, companyFilterList } = pe.ensureCompanyFilterCombobox();

  pe.dom = {
    parkFilterInput,
    parkFilterList,
    companyFilterInput,
    companyFilterList,
    typeFilter: document.getElementById("typeFilter"),
    priceSort: document.getElementById("priceSort"),
    passGrid: document.getElementById("passGrid"),
    resultsMeta: document.getElementById("resultsMeta"),
    template: document.getElementById("passCardTemplate")
  };

  pe.bindFilterEvents();

  // Start in an unscoped state: no single company is selected by default.
  pe.renderTypeFilterOptions("all");
  pe.renderCompanyFilterOptions();
  pe.syncCompanyInputWithSelection();
  pe.renderParkFilterOptions();
  pe.syncParkInputWithSelection();
  pe.renderPasses("all");

  fetchExchangeRates().finally(() => {
    pe.applyFilters();
  });
})();
