function parsePrice(rawPrice) {
  const normalized = String(rawPrice).replace(/[^\d.,]/g, "").replace(/,/g, "");
  return Number.parseFloat(normalized) || 0;
}

const currencyToUsdRate = { USD: 1 };
let exchangeRatesLoaded = false;

function convertToUsd(amount, currency = "USD") {
  const code = String(currency || "USD").toUpperCase();
  const rate = currencyToUsdRate[code];
  if (!Number.isFinite(rate) || rate <= 0) {
    return Number.NaN;
  }
  return amount * rate;
}

function formatUsd(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(amount);
}

async function fetchExchangeRates() {
  const currencies = supportedCurrencies.filter((code) => code !== "USD");
  if (currencies.length === 0) {
    exchangeRatesLoaded = true;
    return;
  }

  const endpoint = new URL("https://api.frankfurter.app/latest");
  endpoint.searchParams.set("from", "USD");
  endpoint.searchParams.set("to", currencies.join(","));

  try {
    const response = await fetch(endpoint.toString());
    if (!response.ok) {
      throw new Error(`Exchange rate API request failed: ${response.status}`);
    }

    const data = await response.json();
    let allRatesResolved = true;
    for (const code of currencies) {
      const usdToCurrency = Number(data?.rates?.[code]);
      if (Number.isFinite(usdToCurrency) && usdToCurrency > 0) {
        currencyToUsdRate[code] = 1 / usdToCurrency;
      } else {
        allRatesResolved = false;
      }
    }
    exchangeRatesLoaded = allRatesResolved;
  } catch (error) {
    exchangeRatesLoaded = false;
    console.error("Error fetching exchange rates. Showing native currency prices.", error);
  }
}

function formatOfferPrice(offer) {
  const code = String(offer.currency || "USD").toUpperCase();
  const rawPrice = String(offer.price || "").trim();
  const numericPrice = parsePrice(rawPrice);
  if (numericPrice <= 0) {
    return rawPrice;
  }

  if (code === "USD") {
    return rawPrice;
  }

  if (!exchangeRatesLoaded) {
    return `${code} ${rawPrice}`;
  }

  const usdPrice = convertToUsd(numericPrice, code);
  if (Number.isFinite(usdPrice)) {
    return `~${formatUsd(usdPrice)}`;
  }

  return `${code} ${rawPrice}`;
}
