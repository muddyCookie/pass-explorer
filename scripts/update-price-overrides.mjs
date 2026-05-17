import fs from "node:fs/promises";
import path from "node:path";

function stableStringify(value) {
  return JSON.stringify(value, null, 2) + "\n";
}

function deepMerge(base, override) {
  if (override == null) return base;
  if (base == null) return override;
  if (Array.isArray(base) || Array.isArray(override)) return override;
  if (typeof base !== "object" || typeof override !== "object") return override;

  const result = { ...base };
  for (const [key, value] of Object.entries(override)) {
    if (key in result) {
      result[key] = deepMerge(result[key], value);
    } else {
      result[key] = value;
    }
  }
  return result;
}

function applyTemplateString(template, vars) {
  return String(template || "").replace(/\{(\w+)\}/g, (_, key) => {
    const value = vars?.[key];
    return value == null ? `{${key}}` : String(value);
  });
}

function applyTemplatesDeep(value, vars) {
  if (value == null) return value;
  if (typeof value === "string") return applyTemplateString(value, vars);
  if (typeof value === "number" || typeof value === "boolean") return value;
  if (Array.isArray(value)) return value.map((entry) => applyTemplatesDeep(entry, vars));
  if (typeof value === "object") {
    const result = {};
    for (const [key, entry] of Object.entries(value)) {
      result[key] = applyTemplatesDeep(entry, vars);
    }
    return result;
  }
  return value;
}

function tryLoadExistingOverrides(fileText) {
  const text = String(fileText || "");
  const match = /window\\.priceOverrides\\s*=\\s*({[\\s\\S]*?})\\s*;?\\s*$/m.exec(text);
  if (!match) return null;
  try {
    return JSON.parse(match[1]);
  } catch {
    return null;
  }
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
    if (Object.prototype.hasOwnProperty.call(current, part)) {
      current = current[part];
      continue;
    }
    const lower = part.toLowerCase();
    const fallbackKey = Object.keys(current).find((key) => key.toLowerCase() === lower);
    current = fallbackKey ? current[fallbackKey] : undefined;
  }
  return current;
}

function setByDotPath(obj, dotPath, value) {
  const parts = String(dotPath || "").split(".").map((part) => part.trim()).filter(Boolean);
  if (parts.length === 0) return;
  let current = obj;
  for (let index = 0; index < parts.length - 1; index += 1) {
    const part = parts[index];
    const next = current[part];
    if (!next || typeof next !== "object" || Array.isArray(next)) {
      current[part] = {};
    }
    current = current[part];
  }
  current[parts[parts.length - 1]] = value;
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

function toMatchPaths(matchPath) {
  if (Array.isArray(matchPath)) {
    return matchPath.map((value) => String(value || "").trim()).filter(Boolean);
  }
  const single = String(matchPath || "").trim();
  return single ? [single] : [];
}

function buildMatchPredicate(match) {
  const matchObj = match && typeof match === "object" ? match : {};
  const includes = matchObj.includes ?? matchObj.contains ?? null;
  const equals = matchObj.equals ?? matchObj.eq ?? null;
  const regex = matchObj.regex ?? matchObj.pattern ?? null;
  const caseSensitive = Boolean(matchObj.caseSensitive ?? false);

  if (regex != null && String(regex).trim()) {
    const flags = String(matchObj.flags || (caseSensitive ? "" : "i"));
    const re = new RegExp(String(regex), flags.includes("i") || caseSensitive ? flags : `${flags}i`);
    return (candidate) => {
      const value = String(candidate ?? "");
      return re.test(value);
    };
  }

  if (equals != null && (Array.isArray(equals) ? equals.length > 0 : String(equals).trim())) {
    const needles = Array.isArray(equals) ? equals : [equals];
    const normalizedNeedles = needles
      .map((value) => String(value ?? "").trim())
      .filter(Boolean)
      .map((value) => caseSensitive ? value : value.toLowerCase());
    return (candidate) => {
      const value = String(candidate ?? "").trim();
      if (!value) return false;
      const normalizedValue = caseSensitive ? value : value.toLowerCase();
      return normalizedNeedles.some((needle) => normalizedValue === needle);
    };
  }

  const needles = toIncludesNeedles(includes);
  if (needles.length > 0) {
    return (candidate) => {
      const value = String(candidate ?? "").toLowerCase();
      return needles.some((needle) => value.includes(needle));
    };
  }

  return null;
}

function normalizeMatchSpec(matchSpecOrIncludes) {
  if (matchSpecOrIncludes && typeof matchSpecOrIncludes === "object") {
    return matchSpecOrIncludes;
  }
  return { includes: matchSpecOrIncludes };
}

function findFirstByIncludes(items, matchPath, matchSpecOrIncludes) {
  if (!Array.isArray(items)) return null;
  const matchPaths = toMatchPaths(matchPath);
  if (matchPaths.length === 0) return null;
  const matchSpec = normalizeMatchSpec(matchSpecOrIncludes);
  const predicate = buildMatchPredicate(matchSpec);
  if (!predicate) return null;

  for (const item of items) {
    for (const pathStr of matchPaths) {
      const candidate = getByDotPath(item, pathStr);
      if (predicate(candidate)) {
        return item;
      }
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

function deepFindFirstValueByKey(root, keyName) {
  const needle = String(keyName || "").trim().toLowerCase();
  if (!needle) return undefined;
  if (!root || typeof root !== "object") return undefined;

  const stack = [root];
  while (stack.length > 0) {
    const current = stack.pop();
    if (!current || typeof current !== "object") continue;

    if (!Array.isArray(current)) {
      const directKey = Object.keys(current).find((key) => key.toLowerCase() === needle);
      if (directKey != null) {
        return current[directKey];
      }
    }

    if (Array.isArray(current)) {
      for (const entry of current) stack.push(entry);
      continue;
    }

    for (const value of Object.values(current)) {
      if (value && typeof value === "object") {
        stack.push(value);
      }
    }
  }

  return undefined;
}

function deepFindFirstByKeyEqualsWithValue(root, keyName, keyValue, valuePath) {
  const keyNeedle = String(keyName || "").trim().toLowerCase();
  if (!keyNeedle) return null;
  if (keyValue == null || keyValue === "") return null;
  const valuePathStr = String(valuePath || "").trim();
  if (!valuePathStr) return null;

  const normalizedKeyValue = String(keyValue).trim().toLowerCase();
  if (!normalizedKeyValue) return null;

  const stack = [root];
  while (stack.length > 0) {
    const current = stack.pop();
    if (!current || typeof current !== "object") continue;

    if (!Array.isArray(current)) {
      const matchingKey = Object.keys(current).find((key) => key.toLowerCase() === keyNeedle);
      if (matchingKey != null) {
        const candidateId = String(current[matchingKey] ?? "").trim().toLowerCase();
        if (candidateId && candidateId === normalizedKeyValue) {
          let valueAtPath = getByDotPath(current, valuePathStr);
          if (!valueAtPath && !valuePathStr.includes(".")) {
            valueAtPath = deepFindFirstValueByKey(current, valuePathStr);
          }
          const valueCandidate = parseAccessoRetailAmount(valueAtPath);
          if (valueCandidate) {
            return current;
          }
        }
      }
    }

    if (Array.isArray(current)) {
      for (const entry of current) stack.push(entry);
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

function extractAccessoAmountFromNode(node, valuePathStr) {
  const pathStr = String(valuePathStr || "").trim();
  if (!node || typeof node !== "object" || !pathStr) return "";

  let valueAtPath = getByDotPath(node, pathStr);
  if (!valueAtPath && !pathStr.includes(".")) {
    valueAtPath = deepFindFirstValueByKey(node, pathStr);
  }

  let valueCandidate = parseAccessoRetailAmount(valueAtPath);
  if (valueCandidate) return valueCandidate;

  const retailFallback = deepFindFirstValueByKey(node, "retail_amount")
    ?? deepFindFirstValueByKey(node, "retailAmount")
    ?? deepFindFirstValueByKey(node, "retail_value")
    ?? deepFindFirstValueByKey(node, "retailValue");
  valueCandidate = parseAccessoRetailAmount(retailFallback);
  return valueCandidate || "";
}

function deepFindFirstByIncludesWithValue(root, matchPath, includesValue, valuePath) {
  const matchPaths = toMatchPaths(matchPath);
  const valuePathStr = String(valuePath || "").trim();
  const matchSpec = normalizeMatchSpec(includesValue);
  const predicate = buildMatchPredicate(matchSpec);
  if (!predicate || matchPaths.length === 0 || !valuePathStr) {
    return null;
  }

  const stack = [root];
  while (stack.length > 0) {
    const current = stack.pop();
    if (!current || typeof current !== "object") {
      continue;
    }

    for (const pathStr of matchPaths) {
      const candidateValue = getByDotPath(current, pathStr);
      if (candidateValue == null) {
        continue;
      }
      if (!predicate(candidateValue)) continue;

      // Debug helper: we found a node that matches the name/label selector, but we still need pricing.
      // To help diagnose structure differences, we can optionally dump minimal hints when extraction fails.
      const debugHints = {
        matchPath: pathStr,
        matchValue: String(candidateValue ?? "").slice(0, 120)
      };

      let valueCandidate = extractAccessoAmountFromNode(current, valuePathStr);
      if (valueCandidate) {
        return current;
      }

      // Some bootstrap payloads include "alias" objects with the right name/label but without pricing.
      // Try to resolve the "real" package by common id keys and then read the pricing from there.
      const idKeys = ["id", "package_id", "packageId", "vendor_product_id", "vendorProductId"];
      for (const idKey of idKeys) {
        const idValue = getByDotPath(current, idKey);
        if (typeof idValue !== "string" && typeof idValue !== "number") {
          continue;
        }
        const resolved = deepFindFirstByKeyEqualsWithValue(root, idKey, idValue, valuePathStr);
        if (resolved) {
          return resolved;
        }
      }

      // If we got here, we matched a node but could not find pricing. Expose a small hint upstream by
      // attaching a non-enumerable property, so we can log it without bloating normal output.
      try {
        Object.defineProperty(root, "__pe_lastMatchHint", {
          value: {
            ...debugHints,
            valuePath: valuePathStr,
            hasCT: deepFindFirstValueByKey(current, "CT") != null,
            hasRetailAmount: deepFindFirstValueByKey(current, "retail_amount") != null,
            id: getByDotPath(current, "id") ?? getByDotPath(current, "vendor_product_id") ?? null
          },
          configurable: true
        });
      } catch {
        // ignore
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

function deepCollectMatchCandidates(root, matchPath, limit = 20) {
  const matchPaths = toMatchPaths(matchPath);
  if (!root || typeof root !== "object" || matchPaths.length === 0) return [];

  const results = [];
  const seen = new Set();
  const stack = [root];

  while (stack.length > 0 && results.length < limit) {
    const current = stack.pop();
    if (!current || typeof current !== "object") {
      continue;
    }

    for (const pathStr of matchPaths) {
      const value = getByDotPath(current, pathStr);
      if (typeof value === "string" || typeof value === "number") {
        const text = String(value).trim();
        if (!text) continue;
        const key = text.toLowerCase();
        if (seen.has(key)) continue;
        seen.add(key);
        results.push(text);
        if (results.length >= limit) break;
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

  return results;
}

function deepCollectPricingCandidates(root, limit = 20) {
  if (!root || typeof root !== "object") return [];

  const results = [];
  const seen = new Set();
  const stack = [root];

  while (stack.length > 0 && results.length < limit) {
    const current = stack.pop();
    if (!current || typeof current !== "object") {
      continue;
    }

    if (!Array.isArray(current)) {
      const retailAmount = deepFindFirstValueByKey(current, "retail_amount") ?? deepFindFirstValueByKey(current, "retailAmount");
      if (retailAmount != null) {
        const amountText = String(retailAmount).trim();
        if (amountText) {
          const name = deepFindFirstValueByKey(current, "name");
          const nameText = name != null ? String(name).trim() : "";
          const key = `${nameText.toLowerCase()}|${amountText}`;
          if (!seen.has(key)) {
            seen.add(key);
            results.push({ name: nameText || null, retail_amount: amountText });
          }
        }
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

  return results;
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
    if (value.retail_value != null) return String(value.retail_value).trim();
    if (value.retailValue != null) return String(value.retailValue).trim();

    const keyMap = Object.fromEntries(
      Object.entries(value).map(([key, entry]) => [String(key).toLowerCase(), entry])
    );
    if (keyMap["retail_amount"] != null) return String(keyMap["retail_amount"]).trim();
    if (keyMap["retailamount"] != null) return String(keyMap["retailamount"]).trim();
    if (keyMap["retail_value"] != null) return String(keyMap["retail_value"]).trim();
    if (keyMap["retailvalue"] != null) return String(keyMap["retailvalue"]).trim();
  }
  return "";
}

function expandSourcesFromConfig(config) {
  const explicit = Array.isArray(config?.sources) ? config.sources : [];
  const templates = config?.templates && typeof config.templates === "object" ? config.templates : {};
  const generated = Array.isArray(config?.generatedSources) ? config.generatedSources : [];
  if (generated.length === 0) return explicit;

  const expanded = [];

  for (const gen of generated) {
    const parks = Array.isArray(gen?.parks) ? gen.parks : [];
    const passes = Array.isArray(gen?.passes) ? gen.passes : [];
    const genDefaults = gen?.defaults && typeof gen.defaults === "object" ? gen.defaults : {};

    let template = null;
    if (typeof gen?.template === "string") {
      template = templates?.[gen.template] || null;
    } else if (gen?.template && typeof gen.template === "object") {
      template = gen.template;
    }

    if (!template || parks.length === 0 || passes.length === 0) {
      continue;
    }

    for (const parkEntry of parks) {
      const park = String(parkEntry?.park || "").trim();
      if (!park) continue;

      for (const passEntry of passes) {
        const passType = String(passEntry?.passType || "").trim();
        if (!passType) continue;

        const passLabel = String(passEntry?.passLabel || passType).trim();

        const currency = String(
          passEntry?.currency || parkEntry?.currency || genDefaults?.currency || ""
        ).trim();

        const merchant = String(parkEntry?.merchant ?? genDefaults?.merchant ?? "").trim();
        const apiHost = String(parkEntry?.apiHost ?? genDefaults?.apiHost ?? "").trim();

        const vars = {
          park,
          passType,
          passLabel,
          currency,
          merchant,
          merchantLower: merchant.toLowerCase(),
          apiHost,
          storeHost: parkEntry?.storeHost ?? genDefaults?.storeHost ?? "",
          origin: parkEntry?.origin ?? genDefaults?.origin ?? "",
          referer: parkEntry?.referer ?? genDefaults?.referer ?? ""
        };

        const merged = deepMerge(template, deepMerge(genDefaults, deepMerge(parkEntry, passEntry)));
        if (!merged.apiHost && apiHost) {
          merged.apiHost = apiHost;
        }
        const rendered = applyTemplatesDeep(merged, vars);

        expanded.push({
          ...rendered,
          park,
          passType,
          currency: currency || rendered.currency
        });
      }
    }
  }

  return [...explicit, ...expanded];
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
    const responseText = await response.text().catch(() => "");
    throw new Error(`Fetch failed (${response.status}) for ${url}${responseText ? `\n${responseText.slice(0, 400)}` : ""}`);
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
  const cartBody = {
    // Flags seen commonly in Accesso storefronts; harmless when ignored.
    check_cart: "1",
    include_checkout_keywords: "1",
    promo_codes: "",
    skip_requests: "SetExpressCheckout",
    ...bodyBase,
    request_type: "GetCartSummary"
  };
  cartBody.request_token = "";
  cartBody.cart_id = "";
  cartBody.cart_key = "";
  cartBody.session_id = "";

  const json = await fetchJson(cartSummaryUrl.toString(), "POST", headers, cartBody);
  const request_token = findFirstStringByKeysDeep(json, ["request_token", "requesttoken"]);
  const cart_id = findFirstStringByKeysDeep(json, ["cart_id", "cartid"]);
  const cart_key = findFirstStringByKeysDeep(json, ["cart_key", "cartkey"]);
  const session_id = findFirstStringByKeysDeep(json, ["session_id", "sessionid"]);

  if (!request_token || !cart_id || !cart_key || !session_id) {
    const snippet = JSON.stringify(json).slice(0, 400);
    throw new Error(`Failed to resolve Accesso session tokens from getcartsummary (${cartSummaryUrl}). Response starts with: ${snippet}`);
  }

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

  const sources = expandSourcesFromConfig(config);
  const overrides = {};
  const updatedAt = formatTodayYmdUtc();
  let missingCount = 0;

  const existingPath = path.join(repoRoot, "price-overrides.js");
  let existingOverrides = null;
  try {
    const existingText = await fs.readFile(existingPath, "utf8");
    existingOverrides = tryLoadExistingOverrides(existingText);
  } catch {
    existingOverrides = null;
  }

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
    let jsonForDebug = null;
    if (extractType === "json") {
      const json = await fetchJson(url.toString(), method, headers, body);
      jsonForDebug = json;
      extracted = String(getByDotPath(json, extract?.path) ?? "").trim();
    } else if (extractType === "json-search") {
      const json = await fetchJson(url.toString(), method, headers, body);
      jsonForDebug = json;
      const arrays = collectAllArraysByDotPaths(json, extract?.arrayPath ?? extract?.arrayPaths);
      const matchPath = extract?.match?.path ?? extract?.matchPath;
      const matchSpec = extract?.match ?? extract?.matchSpec ?? { includes: extract?.matchIncludes };
      const valuePath = extract?.value?.path ?? extract?.valuePath;
      const item = findFirstByIncludesInAnyArray(arrays, matchPath, matchSpec);
      extracted = item && valuePath
        ? parseAccessoRetailAmount(getByDotPath(item, valuePath))
        : "";
    } else if (extractType === "json-deep-search") {
      const json = await fetchJson(url.toString(), method, headers, body);
      jsonForDebug = json;
      const matchPath = extract?.match?.path ?? extract?.matchPath;
      const matchSpec = extract?.match ?? extract?.matchSpec ?? { includes: extract?.matchIncludes };
      const valuePath = extract?.value?.path ?? extract?.valuePath;
      const item = deepFindFirstByIncludesWithValue(json, matchPath, matchSpec, valuePath);
      extracted = item ? extractAccessoAmountFromNode(item, valuePath) : "";
    } else {
      const text = await fetchText(url.toString(), method, headers, body);
      extracted = extractViaRegex(text, extract?.pattern);
    }

    const normalized = normalizePriceString(extracted);
    if (!normalized) {
      missingCount += 1;
      console.warn(`No price extracted for ${park} / ${passType} (${url.toString()})`);
      if (missingCount <= 3) {
        const matchSpecDebug = extract?.match ?? extract?.matchSpec ?? null;
        const valuePathDebug = extract?.value?.path ?? extract?.valuePath ?? null;
        console.warn(`Debug match spec: ${matchSpecDebug ? JSON.stringify(matchSpecDebug) : "null"}; valuePath: ${valuePathDebug ? JSON.stringify(valuePathDebug) : "null"}`);
      }
      if (jsonForDebug && (extractType === "json-search" || extractType === "json-deep-search")) {
        const matchPath = extract?.match?.path ?? extract?.matchPath;
        const samples = deepCollectMatchCandidates(jsonForDebug, matchPath, 12);
        if (samples.length > 0) {
          console.warn(`Sample match candidates (${Array.isArray(matchPath) ? matchPath.join(",") : String(matchPath || "")}): ${samples.map((s) => JSON.stringify(s)).join(", ")}`);
        }
        const pricingSamples = deepCollectPricingCandidates(jsonForDebug, 8);
        if (pricingSamples.length > 0) {
          console.warn(`Sample pricing candidates: ${pricingSamples.map((entry) => `${entry.name ? JSON.stringify(entry.name) + " " : ""}${JSON.stringify(entry.retail_amount)}`).join(", ")}`);
        }
        const hint = jsonForDebug?.__pe_lastMatchHint;
        if (hint) {
          console.warn(`Last match hint: ${JSON.stringify(hint)}`);
        }
      }
      const targetPath = String(source?.target || "price").trim() || "price";
      const fallback = getByDotPath(existingOverrides?.[park]?.[passType], targetPath);
      if (fallback != null && String(fallback).trim()) {
        overrides[park] ??= {};
        overrides[park][passType] ??= { updatedAt: existingOverrides?.[park]?.[passType]?.updatedAt || updatedAt };
        setByDotPath(overrides[park][passType], targetPath, String(fallback).trim());
        overrides[park][passType].updatedAt = existingOverrides?.[park]?.[passType]?.updatedAt || updatedAt;
      }
      continue;
    }

    overrides[park] ??= {};
    const targetPath = String(source?.target || "price").trim() || "price";
    overrides[park][passType] ??= { updatedAt };
    setByDotPath(overrides[park][passType], targetPath, normalized);
    overrides[park][passType].updatedAt = updatedAt;
  }

  if (sources.length > 0 && Object.keys(overrides).length === 0) {
    throw new Error("No overrides generated (all sources failed). Refusing to overwrite price-overrides.js.");
  }

  const output = `// AUTO-GENERATED by scripts/update-price-overrides.mjs\n// Do not edit by hand (edit scripts/price-sources.json instead).\n\nwindow.priceOverrides = ${stableStringify(overrides)};\n`;
  await fs.writeFile(path.join(repoRoot, "price-overrides.js"), output, "utf8");
  console.log(`Wrote ${Object.keys(overrides).length} parks to price-overrides.js`);

  if (missingCount > 0) {
    console.warn(`${missingCount} source(s) failed to extract; kept existing values where available.`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
