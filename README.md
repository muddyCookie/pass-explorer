# Pass Explorer

Static (no-build) app for comparing season passes.

## Where everything is

- `index.html` - page markup + script load order.
- `styles.css` - all styling (light/dark via `data-theme` on `<html>`).

### Data / catalog

- `companies.js` - company configuration + URL building helpers.
- `park-data.js` - the canonical nested company -> portal -> group -> park data, including portal codes and pricing source definitions.
- `parks.js` - derives the browser park catalog (`parkCatalog`) from `park-data.js`.
- `price-overrides.js` - generated pricing overrides, kept separate from the park definitions.
- `scripts/price-sources.json` - shared portal URL rules used by the daily price updater.
- `pass-catalog.js` - builds the derived catalog used by the app:
  - `passOffers` (the main list rendered on screen)
  - `companyFilterOptions`, `allParkFilterOptions`
  - park link helpers like `getParkWebsiteUrl()`, `getPassPurchaseUrl()`
  - location helpers like `countryFilterOptions`, `getStateOptionsForCountry()`

### UI

- `filters.js` - filter UI + filter state (`window.PassExplorer.state`) + mobile filter sidebar toggle.
- `render.js` - renders the pass cards (`window.PassExplorer.renderPasses()`).
- `pricing.js` - price parsing + display formatting (`formatOfferPrice()`).
- `theme.js` - theme selection + theme toggle (persists `pe-theme`).
- `main.js` - app bootstrap / orchestration (wires DOM → binds events → initial render).

## Starting Fresh

The app is set up as a blank slate for manual park entry and pricing work.

- Add park data directly in `parks.js`.
- Put current prices in `price-overrides.js` so the park catalog stays clean.
- Keep the theme, filters, and layout as-is while you rebuild the catalog.

## Daily Pricing Updates

- `scripts/update-price-overrides.mjs` fetches the live park pages listed in `scripts/price-sources.json`.
- `park-data.js` is the single place to add a park. Nest parks under their company, portal, and catalog group.
- `scripts/price-sources.json` contains only shared portal hosts and URL suffixes.
- The script rewrites `price-overrides.js` so the app always reads current prices from the generated layer.
- `.github/workflows/update-price-overrides.yml` runs the script daily and commits any price changes back to the repo.
