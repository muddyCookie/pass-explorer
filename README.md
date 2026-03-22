# Pass Explorer

Static (no-build) app for comparing amusement park season passes.

## Where everything is

- `index.html` - page markup + script load order.
- `styles.css` - all styling (light/dark via `data-theme` on `<html>`).

### Data / catalog

- `companies.js` - company configuration + URL building helpers.
- `parks.js` - the park list (`parkCatalog`).
- `pass-catalog.js` - builds the derived catalog used by the app:
  - `passOffers` (the main list rendered on screen)
  - `companyFilterOptions`, `allParkFilterOptions`
  - park link helpers like `getParkWebsiteUrl()`, `getPassPurchaseUrl()`
  - location helpers like `countryFilterOptions`, `getStateOptionsForCountry()`

### UI

- `filters.js` - filter UI + filter state (`window.PassExplorer.state`) + mobile filter sidebar toggle.
- `render.js` - renders the pass cards (`window.PassExplorer.renderPasses()`).
- `pricing.js` - price parsing + exchange-rate conversion (`fetchExchangeRates()`, `formatOfferPrice()`).
- `theme.js` - theme selection + theme toggle (persists `pe-theme`).
- `main.js` - app bootstrap / orchestration (wires DOM → binds events → initial render).
