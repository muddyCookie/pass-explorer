import fs from "node:fs/promises";
import path from "node:path";

function stableStringify(value) {
  return JSON.stringify(value, null, 2) + "\n";
}

function formatTodayYmdUtc() {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, "0");
  const day = String(now.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function asUrl(value) {
  try {
    return new URL(String(value));
  } catch {
    return null;
  }
}

function getByDotPath(obj, dotPath) {
  const parts = String(dotPath || "").split(".").map((part) => part.trim()).filter(Boolean);
  let current = obj;
  for (const part of parts) {
    if (current == null || typeof current !== "object") return undefined;
    current = current[part];
  }
  return current;
}

function getFirstArrayByDotPaths(obj, dotPaths) {
  const paths = Array.isArray(dotPaths) ? dotPaths : [dotPaths];
  for (const dotPath of paths) {
    const value = getByDotPath(obj, dotPath);
    if (Array.isArray(value)) {
      return value;
    }
  }
  return null;
}

function collectAllArraysByDotPaths(obj, dotPaths) {
  const arrays = [];
  const seen = new Set();
  const paths = Array.isArray(dotPaths) ? dotPaths : [dotPaths];
  for (const dotPath of paths) {
    const value = getByDotPath(obj, dotPath);
    if (Array.isArray(value)) {
      const key = dotPath;
      if (!seen.has(key)) {
        seen.add(key);
        arrays.push(value);
      }
    }
  }
  return arrays;
}

function toIncludesNeedles(includesValue) {
  if (Array.isArray(includesValue)) {
    return includesValue.map((value) => String(value || "").toLowerCase()).filter(Boolean);
  }
  const single = String(includesValue || "").toLowerCase().trim();
  return single ? [single] : [];
}

function findFirstByIncludes(items, matchPath, includesValue) {
  if (!Array.isArray(items)) return null;
  const needles = toIncludesNeedles(includesValue);
  if (needles.length === 0) return null;
  const pathStr = String(matchPath || "").trim();
  if (!pathStr) return null;

  for (const item of items) {
    const candidate = String(getByDotPath(item, pathStr) ?? "").toLowerCase();
    if (needles.some((needle) => candidate.includes(needle))) {
      return item;
    }
  }
  return null;
}

function findFirstByIncludesInAnyArray(arrays, matchPath, includesValue) {
  for (const items of arrays) {
    const match = findFirstByIncludes(items, matchPath, includesValue);
    if (match) {
      return match;
    }
  }
  return null;
}

function deepFindFirstByIncludes(root, matchPath, includesValue) {
  const needles = toIncludesNeedles(includesValue);
  const pathStr = String(matchPath || "").trim();
  if (needles.length === 0 || !pathStr) {
    return null;
  }

  const stack = [root];
  while (stack.length > 0) {
    const current = stack.pop();
    if (!current || typeof current !== "object") {
      continue;
    }

    const candidateValue = getByDotPath(current, pathStr);
    if (candidateValue != null) {
      const candidate = String(candidateValue ?? "").toLowerCase();
      if (needles.some((needle) => candidate.includes(needle))) {
        return current;
      }
    }

    if (Array.isArray(current)) {
      for (const item of current) stack.push(item);
      continue;
    }

    for (const value of Object.values(current)) {
      if (value && typeof value === "object") {
        stack.push(value);
      }
    }
  }

  return null;
}

function normalizeRequestBody(body) {
  if (body == null) {
    return null;
  }
  if (typeof body === "string") {
    return body;
  }
  if (typeof body === "object") {
    return JSON.stringify(body);
  }
  return String(body);
}

function ensureJsonContentType(headers) {
  const normalized = { ...(headers || {}) };
  const existing = Object.keys(normalized).find((key) => key.toLowerCase() === "content-type");
  if (!existing) {
    normalized["content-type"] = "application/json";
  }
  return normalized;
}

function normalizeHeaderMap(headers) {
  const entries = headers && typeof headers === "object" ? Object.entries(headers) : [];
  const normalized = {};
  for (const [key, value] of entries) {
    const name = String(key || "").trim().toLowerCase();
    if (!name) continue;
    const valueString = String(value ?? "").trim();
    if (!valueString) continue;
    normalized[name] = valueString;
  }
  return normalized;
}

function findFirstStringByKeysDeep(obj, keysLowercase) {
  const needles = Array.isArray(keysLowercase) ? keysLowercase : [keysLowercase];
  const stack = [obj];
  while (stack.length > 0) {
    const current = stack.pop();
    if (!current || typeof current !== "object") continue;
    for (const [key, value] of Object.entries(current)) {
      const lower = String(key || "").toLowerCase();
      if (needles.includes(lower)) {
        const str = String(value ?? "").trim();
        if (str) return str;
      }
      if (value && typeof value === "object") {
        stack.push(value);
      }
    }
  }
  return "";
}

function fillBodyPlaceholders(body, replacements) {
  if (!body || typeof body !== "object") return body;
  const result = { ...body };
  for (const [key, replacement] of Object.entries(replacements || {})) {
    if (result[key] === "") {
      result[key] = replacement;
    }
  }
  return result;
}

function parseAccessoRetailAmount(value) {
  if (value == null) return "";
  if (typeof value === "string" || typeof value === "number") {
    return String(value).trim();
  }
  if (Array.isArray(value)) {
    for (const entry of value) {
      const candidate = parseAccessoRetailAmount(entry);
      if (candidate) return candidate;
    }
    return "";
  }
  if (typeof value === "object") {
    if (value.retail_amount != null) return String(value.retail_amount).trim();
    if (value.retailAmount != null) return String(value.retailAmount).trim();
  }
  return "";
}

async function fetchText(url, method = "GET", headers = {}, body = null) {
  const normalizedBody = normalizeRequestBody(body);
  const normalizedHeaders = normalizedBody ? ensureJsonContentType(headers) : headers;
  const response = await fetch(url, { method, headers: normalizedHeaders, body: normalizedBody });
  if (!response.ok) {
    throw new Error(`Fetch failed (${response.status}) for ${url}`);
  }
  return await response.text();
}

async function fetchJson(url, method = "GET", headers = {}, body = null) {
  const normalizedBody = normalizeRequestBody(body);
  const normalizedHeaders = normalizedBody ? ensureJsonContentType(headers) : headers;
  const response = await fetch(url, { method, headers: normalizedHeaders, body: normalizedBody });
  if (!response.ok) {
    throw new Error(`Fetch failed (${response.status}) for ${url}`);
  }
  return await response.json();
}

async function resolveAccessoSessionTokens(sourceUrl, sourceHeaders, sourceBody) {
  const urlObj = asUrl(sourceUrl);
  if (!urlObj) {
    throw new Error("Invalid source URL for Accesso resolver.");
  }

  const cartSummaryUrl = new URL(`https://${urlObj.host}/api/request/getcartsummary`);
  const headers = normalizeHeaderMap(sourceHeaders);

  const bodyBase = sourceBody && typeof sourceBody === "object" ? sourceBody : {};
  const cartBody = { ...bodyBase, request_type: "GetCartSummary" };
  cartBody.request_token = "";
  cartBody.cart_id = "";
  cartBody.cart_key = "";
  cartBody.session_id = "";

  const json = await fetchJson(cartSummaryUrl.toString(), "POST", headers, cartBody);
  const request_token = findFirstStringByKeysDeep(json, ["request_token", "requesttoken"]);
  const cart_id = findFirstStringByKeysDeep(json, ["cart_id", "cartid"]);
  const cart_key = findFirstStringByKeysDeep(json, ["cart_key", "cartkey"]);
  const session_id = findFirstStringByKeysDeep(json, ["session_id", "sessionid"]);

  return { request_token, cart_id, cart_key, session_id };
}

function extractViaRegex(text, pattern) {
  const regex = new RegExp(String(pattern), "i");
  const match = regex.exec(text);
  return match?.[1] ?? "";
}

function normalizePriceString(raw) {
  const value = String(raw || "").trim();
  if (!value) return "";
  const match = /(\$|USD|CAD|MXN|EUR|GBP)?\s*([0-9]+(?:[.,][0-9]{1,2})?)/i.exec(value);
  if (!match) return value;
  const symbol = match[1] || "$";
  const amount = match[2].replace(/,/g, "");
  return symbol.toUpperCase() === "USD" || symbol.toUpperCase() === "CAD"
    ? `$${amount}`
    : `${symbol}${amount}`;
}

async function main() {
  const repoRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
  const configPath = path.join(repoRoot, "scripts", "price-sources.json");
  const raw = await fs.readFile(configPath, "utf8");
  const config = JSON.parse(raw);

  const sources = Array.isArray(config?.sources) ? config.sources : [];
  const overrides = {};
  const updatedAt = formatTodayYmdUtc();
  let missingCount = 0;

  for (const source of sources) {
    const park = String(source?.park || "").trim();
    const passType = String(source?.passType || "").trim();
    if (!park || !passType) continue;

    const url = asUrl(source?.url);
    if (!url) continue;

    const method = String(source?.method || "GET").toUpperCase();
    const headersRaw = source?.headers && typeof source.headers === "object" ? source.headers : {};
    const headers = normalizeHeaderMap(headersRaw);
    let body = source?.body ?? null;
    const extract = source?.extract || {};
    const extractType = String(extract?.type || "regex");

    const isAccessoPackageSwaps = method === "POST"
      && /\/api\/request\/getpackageswaps/i.test(url.pathname)
      && body
      && typeof body === "object";
    if (isAccessoPackageSwaps) {
      const needsTokens = ["request_token", "cart_id", "cart_key", "session_id"].some((key) => body?.[key] === "");
      if (needsTokens) {
        const tokens = await resolveAccessoSessionTokens(url.toString(), headers, body);
        body = fillBodyPlaceholders(body, tokens);
      }
    }

    let extracted = "";
    if (extractType === "json") {
      const json = await fetchJson(url.toString(), method, headers, body);
      extracted = String(getByDotPath(json, extract?.path) ?? "").trim();
    } else if (extractType === "json-search") {
      const json = await fetchJson(url.toString(), method, headers, body);
      const arrays = collectAllArraysByDotPaths(json, extract?.arrayPath ?? extract?.arrayPaths);
      const matchPath = extract?.match?.path ?? extract?.matchPath;
      const includesValue = extract?.match?.includes ?? extract?.matchIncludes;
      const valuePath = extract?.value?.path ?? extract?.valuePath;
      const item = findFirstByIncludesInAnyArray(arrays, matchPath, includesValue);
      extracted = item && valuePath
        ? parseAccessoRetailAmount(getByDotPath(item, valuePath))
        : "";
    } else if (extractType === "json-deep-search") {
      const json = await fetchJson(url.toString(), method, headers, body);
      const matchPath = extract?.match?.path ?? extract?.matchPath;
      const includesValue = extract?.match?.includes ?? extract?.matchIncludes;
      const valuePath = extract?.value?.path ?? extract?.valuePath;
      const item = deepFindFirstByIncludes(json, matchPath, includesValue);
      extracted = item && valuePath
        ? parseAccessoRetailAmount(getByDotPath(item, valuePath))
        : "";
    } else {
      const text = await fetchText(url.toString(), method, headers, body);
      extracted = extractViaRegex(text, extract?.pattern);
    }

    const normalized = normalizePriceString(extracted);
    if (!normalized) {
      missingCount += 1;
      console.warn(`No price extracted for ${park} / ${passType} (${url.toString()})`);
      continue;
    }

    overrides[park] ??= {};
    overrides[park][passType] = {
      price: normalized,
      updatedAt
    };
  }

  if (sources.length > 0 && Object.keys(overrides).length === 0) {
    throw new Error("No overrides generated (all sources failed). Refusing to overwrite price-overrides.js.");
  }
  if (missingCount > 0) {
    throw new Error(`${missingCount} price source(s) failed to extract. Refusing to overwrite price-overrides.js.`);
  }

  const output = `// AUTO-GENERATED by scripts/update-price-overrides.mjs\n// Do not edit by hand (edit scripts/price-sources.json instead).\n\nwindow.priceOverrides = ${stableStringify(overrides)};\n`;
  await fs.writeFile(path.join(repoRoot, "price-overrides.js"), output, "utf8");
  console.log(`Wrote ${Object.keys(overrides).length} parks to price-overrides.js`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
