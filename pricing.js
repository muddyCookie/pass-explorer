function parsePrice(rawPrice) {
  const normalized = String(rawPrice).replace(/[^\d.,]/g, "").replace(/,/g, "");
  return Number.parseFloat(normalized) || 0;
}

const currencyToUsdRate = { USD: 1 };
let exchangeRatesLoaded = false;
const userCurrency = detectUserCurrency();
let selectedCurrency = userCurrency;

function detectUserCurrency() {
  const locale = String(navigator?.language || "en-US");
  const region = locale.match(/[-_]([A-Z]{2}|\d{3})$/i)?.[1]?.toUpperCase();
  const map = { US: "USD", CA: "CAD", MX: "MXN", GB: "GBP", AU: "AUD", NZ: "NZD", IE: "EUR", DE: "EUR", FR: "EUR", ES: "EUR", IT: "EUR", NL: "EUR", JP: "JPY", CN: "CNY", KR: "KRW", IN: "INR", BR: "BRL", CH: "CHF", SE: "SEK", NO: "NOK", DK: "DKK", PL: "PLN", ZA: "ZAR" };
  return map[region] || "USD";
}

function convertToUsd(amount, currency = "USD") {
  const code = String(currency || "USD").toUpperCase();
  const rate = currencyToUsdRate[code];
  if (!Number.isFinite(rate) || rate <= 0) {
    return Number.NaN;
  }
  return amount * rate;
}

function formatUsd(amount) {
  const fractionDigits = Number.isFinite(amount) && Math.abs(amount % 1) > 1e-9 ? 2 : 0;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits
  }).format(amount);
}

function formatCurrency(amount, code = "USD") {
  const currency = String(code || "USD").toUpperCase();
  if (!Number.isFinite(amount) || amount <= 0) {
    return "";
  }

  const fractionDigits = Math.abs(amount % 1) > 1e-9 ? 2 : 0;
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: fractionDigits,
      maximumFractionDigits: fractionDigits
    }).format(amount);
  } catch {
    return currency === "USD"
      ? `$${amount.toFixed(fractionDigits)}`
      : `${currency} ${amount.toFixed(fractionDigits)}`;
  }
}

async function fetchExchangeRates() {
  const available = typeof supportedCurrencies !== "undefined" ? supportedCurrencies : [];
  const currencies = Array.from(new Set([...(Array.isArray(available) ? available : []), userCurrency, "USD", "CAD", "MXN", "GBP", "EUR", "AUD", "NZD", "JPY"]))
    .filter((code) => String(code || "").toUpperCase() !== "USD");

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

// Legacy USD-converted formatter retained for easy rollback.
function formatOfferPriceUsd(offer) {
  const code = String(offer?.currency || "USD").toUpperCase();
  const rawPrice = String(offer?.price || "").trim();
  const pricing = offer?.pricing ?? null;

  if (pricing?.type === "membership" || Boolean(pricing?.monthly)) {
    const monthly = String(pricing.monthly || "").trim();

    if (!monthly) {
      return "";
    }

    if (code === "USD") {
      return `${monthly}/mo`;
    }

    const monthlyAmount = parsePrice(monthly);
    const usdMonthly = convertToUsd(monthlyAmount, code);
    return Number.isFinite(usdMonthly) ? `~${formatUsd(usdMonthly)}/mo` : `${code} ${monthly}/mo`;
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
  if (pricing?.type !== "membership" && !pricing?.monthly) {
    return "";
  }

  const monthly = String(pricing.monthly || "").trim();
  const downPayment = String(pricing.downPayment || "").trim();
  const minMonths = Number.isFinite(Number(pricing.minMonths)) ? Number(pricing.minMonths) : 12;

  if (!monthly) {
    return "";
  }

  const monthlyAmount = parsePrice(monthly);
  const feeAmount = parsePrice(downPayment);
  const totalAmount = feeAmount + (monthlyAmount * minMonths);
  const code = String(offer?.currency || "USD").toUpperCase();
  let totalText = "";
  if (Number.isFinite(totalAmount) && totalAmount > 0) {
    if (code === "USD") {
      totalText = formatUsd(totalAmount);
    } else {
      const usdTotal = convertToUsd(totalAmount, code);
      const nativeFractionDigits = Math.abs(totalAmount % 1) > 1e-9 ? 2 : 0;
      const nativeTotal = `$${totalAmount.toFixed(nativeFractionDigits)} ${code}`;
      totalText = Number.isFinite(usdTotal)
        ? `${formatUsd(usdTotal)} USD/${nativeTotal}`
        : nativeTotal;
    }
  }

  const sourceCode = offer?.currency || "USD";
  const convertedFee = convertToUserCurrency(feeAmount, sourceCode);
  const feeText = feeAmount <= 0
    ? "$0.00 initiation fee"
    : (convertedFee == null
      ? `${downPayment} initiation fee`
      : `${convertedCurrencyPrefix(sourceCode)}${formatCurrency(convertedFee, selectedCurrency)} initiation fee`);
  return `${feeText} + min ${minMonths} mo`;
}

// Display the currency charged by the park as the primary price.
function formatOfferPrice(offer) {
  const code = String(offer?.currency || "USD").toUpperCase();
  const pricing = offer?.pricing ?? null;
  if (pricing?.type === "membership" || Boolean(pricing?.monthly)) {
    const monthly = String(pricing.monthly || "").trim();
    if (!monthly) return "";
    const amount = parsePrice(monthly);
    const converted = convertToUserCurrency(amount, code);
    return converted == null ? `${monthly}/mo ${code}` : `${convertedCurrencyPrefix(code)}${formatCurrency(converted, selectedCurrency)}/mo`;
  }
  const rawPrice = String(offer?.price || "").trim();
  if (!rawPrice) return "";
  const amount = parsePrice(rawPrice);
  const converted = convertToUserCurrency(amount, code);
  return converted == null ? `${code} ${rawPrice}` : `${convertedCurrencyPrefix(code)}${formatCurrency(converted, selectedCurrency)}`;
}

function convertToUserCurrency(amount, sourceCurrency) {
  const usdAmount = convertToUsd(amount, sourceCurrency);
  if (!Number.isFinite(usdAmount)) return null;
  if (selectedCurrency === "USD") return usdAmount;
  const targetRate = currencyToUsdRate[selectedCurrency];
  return Number.isFinite(targetRate) ? usdAmount / targetRate : null;
}

function convertedCurrencyPrefix(sourceCurrency) {
  return String(sourceCurrency || "USD").toUpperCase() === selectedCurrency ? "" : "~";
}

function formatOfferMembershipTotal(offer) {
  const pricing = offer?.pricing ?? null;
  if (pricing?.type !== "membership" && !pricing?.monthly) return "";
  const monthlyAmount = parsePrice(pricing.monthly);
  const feeAmount = parsePrice(pricing.downPayment);
  const minMonths = Number.isFinite(Number(pricing.minMonths)) ? Number(pricing.minMonths) : 12;
  const totalAmount = feeAmount + (monthlyAmount * minMonths);
  if (!Number.isFinite(totalAmount) || totalAmount <= 0) return "";
  const code = String(offer?.currency || "USD").toUpperCase();
  const converted = convertToUserCurrency(totalAmount, code);
  return converted == null ? `${formatCurrency(totalAmount, code)} total` : `${convertedCurrencyPrefix(code)}${formatCurrency(converted, selectedCurrency)} total`;
}

function setSelectedCurrency(currency) { selectedCurrency = String(currency || "USD").toUpperCase(); }
function getSelectedCurrency() { return selectedCurrency; }

function formatOfferPriceSub(offer) {
  if (!offer) {
    return "";
  }

  return "";
}
