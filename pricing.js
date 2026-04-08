function parsePrice(rawPrice) {
  const normalized = String(rawPrice).replace(/[^\d.,]/g, "").replace(/,/g, "");
  return Number.parseFloat(normalized) || 0;
}

function formatOfferPrice(offer) {
  const code = String(offer?.currency || "USD").toUpperCase();
  const rawPrice = String(offer?.price || "").trim();
  if (!rawPrice) {
    return "";
  }

  return code === "USD" ? rawPrice : `${code} ${rawPrice}`;
}
