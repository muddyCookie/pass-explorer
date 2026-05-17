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
  - optional `price-overrides.js` support (automated price updates)

### UI

- `filters.js` - filter UI + filter state (`window.PassExplorer.state`) + mobile filter sidebar toggle.
- `render.js` - renders the pass cards (`window.PassExplorer.renderPasses()`).
- `pricing.js` - price parsing + display formatting (`formatOfferPrice()`).
- `theme.js` - theme selection + theme toggle (persists `pe-theme`).
- `main.js` - app bootstrap / orchestration (wires DOM → binds events → initial render).

## Automating prices (optional)

This repo supports a generated `price-overrides.js` file (loaded after `parks.js`). Overrides replace the `price` (or membership `pricing`) defined in `parks.js` so you can keep `parks.js` as your stable base catalog.

- Copy `scripts/price-sources.example.json` to `scripts/price-sources.json` and configure sources.
- Run `node scripts/update-price-overrides.mjs` to regenerate `price-overrides.js`.
- Optional: enable the GitHub Action workflow in `.github/workflows/update-price-overrides.yml` to regenerate + push on a schedule.

For local testing, you can edit `price-overrides.local.js` (loaded after the generated file). The GitHub Action does not touch this file.

Notes:
- Some vendors use `POST` + a JSON request body for price endpoints; `scripts/price-sources.json` supports `method`, `headers`, and `body` per source.
- For Accesso endpoints, you can grab the payload by copying the `getpackageswaps` request as cURL from your browser devtools and translating the `--data-raw` JSON into `body`.
- For Accesso `getpackageswaps`, leave `request_token`, `cart_id`, `cart_key`, and `session_id` blank (`""`) and the updater will fetch fresh values via `getcartsummary` automatically.
