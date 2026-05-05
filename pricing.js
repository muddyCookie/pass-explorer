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

function formatCurrency(amount, code = "USD") {
  const currency = String(code || "USD").toUpperCase();
  if (!Number.isFinite(amount) || amount <= 0) {
    return "";
  }

  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 0
    }).format(amount);
  } catch {
    return currency === "USD"
      ? `$${Math.round(amount)}`
      : `${currency} ${Math.round(amount)}`;
  }
}

async function fetchExchangeRates() {
  const available = typeof supportedCurrencies !== "undefined" ? supportedCurrencies : [];
  const currencies = Array.isArray(available)
    ? available.filter((code) => String(code || "").toUpperCase() !== "USD")
    : [];

  if (currencies.length === 0) {
    exchangeRatesLoaded = true;
    return;
  }

  const endpoint = new URL("https://open.er-api.com/v6/latest/USD");

  try {
    const response = await fetch(endpoint.toString());
    if (!response.ok) {
      throw new Error(`Exchange rate API request failed: ${response.status}`);
    }

    const data = await response.json();
    let anyRateResolved = false;
    for (const code of currencies) {
      const normalizedCode = String(code || "").toUpperCase();
      const usdToCurrency = Number(data?.rates?.[normalizedCode] ?? data?.conversion_rates?.[normalizedCode]);
      if (Number.isFinite(usdToCurrency) && usdToCurrency > 0) {
        currencyToUsdRate[normalizedCode] = 1 / usdToCurrency;
        anyRateResolved = true;
      } else {
        // Keep going: some currencies may not be supported by the provider.
      }
    }
    exchangeRatesLoaded = anyRateResolved;
  } catch (error) {
    exchangeRatesLoaded = false;
    console.error("Error fetching exchange rates. Showing native currency prices.", error);
  }
}

function formatOfferPrice(offer) {
  const code = String(offer?.currency || "USD").toUpperCase();
  const rawPrice = String(offer?.price || "").trim();
  const pricing = offer?.pricing ?? null;

  if (pricing?.type === "membership") {
    const monthly = String(pricing.monthly || "").trim();
    const downPayment = String(pricing.downPayment || "").trim();
    const minMonths = Number.isFinite(Number(pricing.minMonths)) ? Number(pricing.minMonths) : 12;

    if (!monthly) {
      return "";
    }

    const monthlyAmount = parsePrice(monthly);
    const downAmount = parsePrice(downPayment);
    const totalAmount = downAmount + (monthlyAmount * minMonths);
    if (code === "USD") {
      return formatUsd(totalAmount);
    }

    const usdTotal = convertToUsd(totalAmount, code);
    return Number.isFinite(usdTotal)
      ? `~${formatUsd(usdTotal)}`
      : `${code} ${formatCurrency(totalAmount, code)}`.trim();
  }

  if (!rawPrice) {
    return "";
  }

  const numericPrice = parsePrice(rawPrice);
  if (numericPrice <= 0) {
    return code === "USD" ? rawPrice : `${code} ${rawPrice}`;
  }

  if (code === "USD") {
    return rawPrice;
  }

  const usdPrice = convertToUsd(numericPrice, code);
  if (Number.isFinite(usdPrice)) {
    return `~${formatUsd(usdPrice)}`;
  }

  return `${code} ${rawPrice}`;
}

function formatOfferPriceNote(offer) {
  const pricing = offer?.pricing ?? null;
  if (pricing?.type !== "membership") {
    return "";
  }

  const monthly = String(pricing.monthly || "").trim();
  const downPayment = String(pricing.downPayment || "").trim();
  const minMonths = Number.isFinite(Number(pricing.minMonths)) ? Number(pricing.minMonths) : 12;

  if (!monthly) {
    return "";
  }

  const monthlyText = `${monthly}/mo`;
  const downText = downPayment ? `${downPayment} down` : "";
  const breakdown = downText ? `${monthlyText} + ${downText}` : monthlyText;
  return `${breakdown}, ${minMonths} mo min`;
}

function formatOfferPriceSub(offer) {
  if (!offer) {
    return "";
  }

  const code = String(offer.currency || "USD").toUpperCase();
  if (code === "USD") {
    return "";
  }

  const pricing = offer.pricing ?? null;
  if (pricing?.type === "membership") {
    const monthly = String(pricing.monthly || "").trim();
    const downPayment = String(pricing.downPayment || "").trim();
    const minMonths = Number.isFinite(Number(pricing.minMonths)) ? Number(pricing.minMonths) : 12;
    if (!monthly) {
      return "";
    }
    const monthlyText = `${monthly}/mo`;
    const downText = downPayment ? `${downPayment} down` : "";
    const breakdown = downText ? `${monthlyText} + ${downText}` : monthlyText;
    return `${code} ${breakdown}, ${minMonths} mo min`;
  }

  const rawPrice = String(offer.price || "").trim();
  return rawPrice ? `${code} ${rawPrice}` : "";
}
