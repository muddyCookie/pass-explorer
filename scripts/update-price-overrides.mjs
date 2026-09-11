#!/usr/bin/env node
import { readFile, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { runInNewContext } from "node:vm";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "..");
const configPath = join(__dirname, "price-sources.json");
const outputPath = join(repoRoot, "price-overrides.js");

const args = new Set(process.argv.slice(2));
const dryRun = args.has("--dry-run");
const REQUEST_TIMEOUT_MS = 30000;

function requestOptions(headers) {
  return {
    headers,
    redirect: "follow",
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS)
  };
}

function utcDateOnly(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

function utcIsoTimestamp(date = new Date()) {
  return date.toISOString();
}

function normalizePriceText(rawValue, currencySymbol = "$") {
  const text = String(rawValue || "").trim();
  if (!text) {
    return "";
  }

  const match = /([0-9][0-9,]*(?:\.[0-9]{1,2})?)/.exec(text);
  if (!match) {
    return text;
  }

  return `${currencySymbol}${match[1].replace(/,/g, "")}`;
}

function compileMatcher(matcher) {
  if (typeof matcher === "string") {
    return {
      pattern: matcher,
      flags: "i",
      group: 1
    };
  }

  if (!matcher || typeof matcher !== "object") {
    return null;
  }

  const pattern = String(matcher.pattern || matcher.regex || "").trim();
  if (!pattern) {
    return null;
  }

  return {
    pattern,
    flags: String(matcher.flags || "i"),
    group: Number.isFinite(Number(matcher.group)) ? Number(matcher.group) : 1
  };
}

function applyTemplate(template, values) {
  return String(template || "").replace(/\{(\w+)\}/g, (_, key) => String(values[key] || ""));
}

function resolveSourceUrl(source, config = {}) {
  const template = String(source.sourceUrlTemplate || source.source_url_template || "").trim();
  const rawUrl = String(source.sourceUrl || source.url || "").trim();
  const rootLink = String(config.link || config.portalLink || config.sourceLink || "").trim();
  const sourceLink = String(source.link || source.portalLink || source.sourceLink || "").trim();
  const portalLink = sourceLink || rootLink;
  const rootHostTemplates = config.portalHostTemplates || config.hostTemplates || {};
  const hostTemplateKey = String(source.portalHost || source.hostTemplateKey || source.portalHostKey || "").trim();
  const hostTemplate = String(
    source.portalHostTemplate
    || source.hostTemplate
    || rootHostTemplates[hostTemplateKey]
    || ""
  ).trim();
  const values = {
    parkCode: String(source.parkCode || source.park_code || "").trim(),
    park: String(source.park || "").trim(),
    passType: String(source.passType || "").trim(),
    seasonPassType: String(source.seasonPassType || source.season_pass_type || "").trim()
  };

  if (template) {
    return applyTemplate(template, values);
  }

  if (hostTemplate && portalLink) {
    const host = applyTemplate(hostTemplate, values).trim();
    const link = applyTemplate(portalLink, values).trim();
    if (host && link) {
      return `https://${host}.${link}`;
    }
  }

  if (portalLink && rawUrl && !/\{|\}/.test(rawUrl)) {
    const host = String(rawUrl).trim();
    const link = applyTemplate(portalLink, values).trim();
    if (host && link) {
      return `https://${host}.${link}`;
    }
  }

  if (rawUrl && /\{\w+\}/.test(rawUrl)) {
    return applyTemplate(rawUrl, values);
  }

  return rawUrl;
}

function stripNestedSourceFields(source) {
  const {
    portalHosts,
    portals,
    parks,
    passes,
    memberships,
    urlTemplates,
    linkSuffixes,
    ...rest
  } = source || {};
  return rest;
}

function flattenSharedParkData(parkData) {
  if (Array.isArray(parkData)) {
    return parkData;
  }

  if (!parkData || typeof parkData !== "object") {
    return [];
  }

  return Object.entries(parkData).flatMap(([company, companyConfig]) =>
    Object.entries(companyConfig || {}).flatMap(([group, regionConfig]) =>
      Object.entries(regionConfig || {}).flatMap(([portal, portalConfig]) =>
        (portalConfig?.parks || []).map((park) => ({
          ...park,
          company,
          group,
          portal
        }))
      )
    )
  );
}

function flattenParkSources(sourceKind, sourceConfig, parkData = []) {
  if (!sourceConfig?.portals || typeof sourceConfig.portals !== "object") {
    return [];
  }

  const flattened = [];
  const categories = [
    ["passes", "Season Passes"],
    ["memberships", "Memberships"]
  ];

  for (const [portalName, portalConfig] of Object.entries(sourceConfig.portals)) {
    if (!portalConfig || typeof portalConfig !== "object") {
      continue;
    }

    const sharedParks = flattenSharedParkData(parkData);
    const parks = Array.isArray(portalConfig.parks)
      ? portalConfig.parks
      : sharedParks.filter((park) => park && park.portal === portalName);

    for (const park of parks) {
      if (!park || typeof park !== "object") {
        continue;
      }

      const parkCode = String(park.parkCode || park.park_code || "").trim();
      if (!parkCode) {
        continue;
      }

      for (const [categoryKey, sourceGroup] of categories) {
        const entries = park[categoryKey];
        if (!entries || typeof entries !== "object" || Array.isArray(entries)) {
          continue;
        }

        const linkSuffix = sourceConfig.linkSuffixes?.[categoryKey];
        const sourceUrlTemplate = `https://${portalConfig.host || ""}{linkSuffix}`.replace("{linkSuffix}", linkSuffix || "");
        const defaultTarget = categoryKey === "memberships" ? "pricing.monthly" : "price";
        for (const [passType, entry] of Object.entries(entries)) {
          if (!entry || typeof entry !== "object" || Array.isArray(entry)) {
            continue;
          }

          const source = entry.source && typeof entry.source === "object"
            ? entry.source
            : entry;
          const isAccesso = String(sourceKind || "").toLowerCase() === "accesso-portal";
          if (!isAccesso && !source.jsonPaths && !source.jsonPath && !source.priceMatchers && !source.pricePattern && !source.sourceUrl && !source.sourceUrlTemplate) {
            continue;
          }

          flattened.push({
            ...stripNestedSourceFields(sourceConfig),
            ...stripNestedSourceFields(park),
            target: defaultTarget,
            ...source,
            sourceKind,
            sourceGroup,
            passType,
            sourceUrlTemplate,
            portalHost: portalName,
            parkCode
          });
        }
      }
    }
  }

  return flattened;
}

function flattenNestedSources(config, parkData = []) {
  const rootSources = config.sources;

  if (Array.isArray(rootSources)) {
    return rootSources;
  }

  if (!rootSources || typeof rootSources !== "object") {
    return [];
  }

  const isLeafConfig = (value) => {
    if (!value || typeof value !== "object" || Array.isArray(value)) {
      return false;
    }

    return [
      "portalHosts",
      "parks",
      "parkCodes",
      "jsonPaths",
      "jsonPath",
      "priceMatchers",
      "pricePattern",
      "sourceUrl",
      "sourceUrlTemplate",
      "bootstrapUrl",
      "responseType",
      "target",
      "targetPath",
      "seasonPassType",
      "price",
      "pricing"
    ].some((key) => Object.prototype.hasOwnProperty.call(value, key));
  };

  const flattened = [];

  const visit = (node, path = [], inherited = {}) => {
    if (!node || typeof node !== "object" || Array.isArray(node)) {
      return;
    }

    const nodeDefaults = {
      ...inherited,
      ...stripNestedSourceFields(node)
    };
    const childEntries = Object.entries(node).filter(([, value]) => value && typeof value === "object" && !Array.isArray(value));

    for (const [key, value] of childEntries) {
      const nextPath = path.concat(key);
      const nextDefaults = {
        ...nodeDefaults,
        ...stripNestedSourceFields(value)
      };

      if (isLeafConfig(value)) {
        const sourceKind = String(nextPath[0] || nextDefaults.sourceKind || "").trim();
        const passType = String(nextPath.length > 2 ? nextPath[2] : nextPath[1] || nextDefaults.passType || "").trim();
        const sourceGroup = nextPath.length > 2 ? String(nextPath[1] || "").trim() : "";
        const seasonPassType = String(value.seasonPassType || value.season_pass_type || nextDefaults.seasonPassType || "").trim();
        const portalHosts = value.portalHosts || value.portal_hosts || {};

        for (const [portalHost, hostConfig] of Object.entries(portalHosts)) {
          if (!hostConfig || typeof hostConfig !== "object") {
            continue;
          }

          const hostDefaults = {
            ...nextDefaults,
            ...stripNestedSourceFields(hostConfig)
          };
          const parks = hostConfig.parks || hostConfig.parkCodes || {};

          for (const [parkCode, parkConfig] of Object.entries(parks)) {
            if (!parkConfig || typeof parkConfig !== "object") {
              continue;
            }

            flattened.push({
              ...nodeDefaults,
              ...stripNestedSourceFields(value),
              ...stripNestedSourceFields(hostConfig),
              ...stripNestedSourceFields(parkConfig),
              sourceKind: String(value.sourceKind || hostConfig.sourceKind || parkConfig.sourceKind || sourceKind).trim(),
              sourceGroup,
              passType: String(value.passType || hostConfig.passType || parkConfig.passType || passType).trim(),
              seasonPassType: String(value.seasonPassType || hostConfig.seasonPassType || parkConfig.seasonPassType || seasonPassType).trim(),
              portalHost: String(hostConfig.portalHost || parkConfig.portalHost || portalHost).trim(),
              parkCode: String(parkConfig.parkCode || parkConfig.park_code || parkCode).trim()
            });
          }
        }
        continue;
      }

      visit(value, nextPath, nextDefaults);
    }
  }

  for (const [sourceKind, sourceConfig] of Object.entries(rootSources)) {
    const parkSources = flattenParkSources(sourceKind, sourceConfig, parkData);
    if (parkSources.length > 0) {
      flattened.push(...parkSources);
      continue;
    }

    visit(sourceConfig, [sourceKind], { sourceKind });
  }

  return flattened;
}

function resolvePath(source, rawPath) {
  const path = String(rawPath || "").trim();
  if (!path) {
    return undefined;
  }

  return path.split(".").reduce((value, rawKey) => {
    if (value == null) {
      return undefined;
    }

    const selectorMatch = /^([^[]+)\[([^=]+)=(.*)\]$/.exec(rawKey);
    if (selectorMatch) {
      const [, collectionKey, property, expectedValue] = selectorMatch;
      const collection = value[collectionKey];
      if (!Array.isArray(collection)) {
        return undefined;
      }

      const normalizedExpected = expectedValue.trim().toLowerCase();
      return collection.find((item) => String(item?.[property] || "").trim().toLowerCase() === normalizedExpected);
    }

    const key = rawKey;
    if (Array.isArray(value) && /^\d+$/.test(key)) {
      return value[Number(key)];
    }
    return value[key];
  }, source);
}

function setByDotPath(obj, rawPath, value) {
  const path = String(rawPath || "").trim();
  if (!path || !obj || typeof obj !== "object" || Array.isArray(obj)) {
    return;
  }

  const parts = path.split(".").map((part) => part.trim()).filter(Boolean);
  if (parts.length === 0) {
    return;
  }

  let current = obj;
  for (let index = 0; index < parts.length - 1; index += 1) {
    const part = parts[index];
    if (!current[part] || typeof current[part] !== "object" || Array.isArray(current[part])) {
      current[part] = {};
    }
    current = current[part];
  }

  current[parts[parts.length - 1]] = value;
}

async function loadJson(filePath) {
  const raw = await readFile(filePath, "utf8");
  return JSON.parse(raw);
}

async function loadParkData() {
  const parkDataPath = join(repoRoot, "park-data.js");
  const source = await readFile(parkDataPath, "utf8");
  const sandbox = {};
  runInNewContext(`${source}\nglobalThis.__parkData = parkData;`, sandbox);
  return sandbox.__parkData && typeof sandbox.__parkData === "object"
    ? sandbox.__parkData
    : {};
}

function extractPriceFromText(text, source) {
  const matchers = Array.isArray(source.priceMatchers)
    ? source.priceMatchers
    : (source.pricePattern ? [source.pricePattern] : []);
  const normalizedMatchers = matchers
    .map(compileMatcher)
    .filter(Boolean);

  for (const matcher of normalizedMatchers) {
    try {
      const regex = new RegExp(matcher.pattern, matcher.flags);
      const match = regex.exec(text);
      if (!match) {
        continue;
      }

      const rawValue = match[matcher.group] ?? match[1] ?? match[0];
      const price = normalizePriceText(rawValue, source.currencySymbol || "$");
      if (price) {
        return price;
      }
    } catch {
      // Try the next matcher.
    }
  }

  return "";
}

function extractPriceFromJson(jsonValue, source) {
  const paths = Array.isArray(source.jsonPaths)
    ? source.jsonPaths
    : (source.jsonPath ? [source.jsonPath] : []);

  for (const path of paths) {
    const value = resolvePath(jsonValue, path);
    const price = normalizePriceText(value, source.currencySymbol || "$");
    if (price) {
      return price;
    }
  }

  return "";
}

function extractBootstrapUrlFromHtml(html) {
  const normalizedHtml = String(html || "").replace(/\\\//g, "/");
  const patterns = [
    /fetch\("([^"]+\/static-api\/bootstrap\?m=[^"]+)"/i,
    /fetch\('([^']+\/static-api\/bootstrap\?m=[^']+)'/i,
    /static-api\/bootstrap\?m=[^"']+/i
  ];

  for (const pattern of patterns) {
    const match = pattern.exec(normalizedHtml);
    if (match) {
      return match[1] || match[0];
    }
  }

  return "";
}

function parsePriceNumber(val) {
  const num = parseFloat(String(val || "").replace(/[^\d.]/g, ""));
  return Number.isFinite(num) ? num : 0;
}

function extractDisplayedPrice(rawValue) {
  const label = String(rawValue || "").trim();
  if (!label) {
    return 0;
  }

  const newMatch = /New:\s*\$?([0-9][0-9,]*(?:\.[0-9]{1,2})?)/i.exec(label);
  const match = newMatch || /\$?([0-9][0-9,]*(?:\.[0-9]{1,2})?)/.exec(label);
  return match ? parsePriceNumber(match[1]) : 0;
}

function extractHiddenPassPrice(rawValue) {
  const matches = String(rawValue || "").match(/\$([0-9][0-9,]*(?:\.[0-9]{1,2})?)/g) || [];
  const prices = matches.map(parsePriceNumber).filter((price) => price > 0);
  return prices.length > 0 ? Math.max(...prices) : 0;
}

function extractPassPriceFromPackage(pkg, currencySymbol = "$") {
  if (!pkg) return "";

  // Prefer the selected new rate. Package-level labels can describe a bundle
  // rather than the base package (as Cedar Point currently does for Prestige).
  const ctList = Array.isArray(pkg.CT) ? pkg.CT : (pkg.CT ? [pkg.CT] : []);
  if (ctList.length === 0) return "";

  // Prefer rate with renewal_flag == "0" or "New" or "Nuevo" or "Regular"
  const newRate = ctList.find(c => String(c.renewal_flag) === "0" || /new|nuevo|regular/i.test(c.name || "")) || ctList[0];

  if (newRate.price_label_override) {
    const displayedPrice = extractDisplayedPrice(newRate.price_label_override);
    if (displayedPrice > 0) return `${currencySymbol}${displayedPrice.toFixed(2)}`;
  }

  // Some Cedar Fair packages expose the real card price in this rendered
  // label while their general price_label_override describes an upsell.
  const hiddenPrice = extractHiddenPassPrice(pkg.CHARACS?.hide_price_label);
  if (hiddenPrice > 0) return `${currencySymbol}${hiddenPrice.toFixed(2)}`;

  const labelOverride = pkg.CHARACS?.price_label_override || pkg.price_label_override;
  const displayedPrice = extractDisplayedPrice(labelOverride);
  if (displayedPrice > 0) return `${currencySymbol}${displayedPrice.toFixed(2)}`;

  const amt = parsePriceNumber(newRate.retail_amount);
  const val = parsePriceNumber(newRate.retail_value);

  if (amt > 0 && val > 0) {
    const amtDecimals = Math.round((amt % 1) * 100);
    const valDecimals = Math.round((val % 1) * 100);

    // If retail_value is a round amount (e.g. $229.00 or $329.00) and retail_amount has odd tax cents ($227.80, $327.05)
    if (valDecimals === 0 && amtDecimals !== 0) {
      return `${currencySymbol}${val.toFixed(2)}`;
    }
    // E.g. retail_amount is $89.00 or $115.00, while retail_value includes tax ($94.90 or $96.34)
    return `${currencySymbol}${amt.toFixed(2)}`;
  }

  if (amt > 0) return `${currencySymbol}${amt.toFixed(2)}`;
  if (val > 0) return `${currencySymbol}${val.toFixed(2)}`;

  return "";
}

function findAccessoPackage(jsonValue, source) {
  const packages = jsonValue?.GetMerchantPackageList?.SERVICE?.PS?.P;
  const packageList = Array.isArray(packages)
    ? packages
    : (packages && typeof packages === "object" ? Object.values(packages) : []);

  if (packageList.length === 0) {
    return null;
  }

  const passType = String(source.passType || "").trim();
  const isMembership = /membership/i.test(passType) || String(source.targetPath || source.target || "").startsWith("pricing.");

  if (isMembership) {
    const isPrestige = /prestige/i.test(passType);
    const requiresNoInitiationFee = source.noInitiationFee === true;
    const candidates = [];

    const membershipRegex = new RegExp(`^(?:\\d{4}\\s*\\*?\\s*)?${isPrestige ? "Prestige" : "Gold"}\\s+Membership(?:\\s*\\*?\\s*\\d{4})?$`, "i");
    for (const pkg of packageList) {
      const name = String(pkg?.name || "").trim();
      if (/dining|drink\s+(?:plan\s+)?plus|haunted|add-?on|paper\s+cup|deposit/i.test(name)) {
        continue;
      }
      if (isPrestige && !/prestige/i.test(name)) continue;
      if (!isPrestige && (!/gold/i.test(name) || /prestige/i.test(name))) continue;
      if (!membershipRegex.test(name) && String(pkg.CHARACS?.package_type).toLowerCase() !== "membership") {
        continue;
      }
      candidates.push(pkg);
    }

    const pricedCandidates = [];
    for (const pkg of candidates) {
      const pricing = extractAccessoMembershipPricing(jsonValue, { ...source, _pkg: pkg });
      if (pricing && parsePriceNumber(pricing.monthly) > 0) {
        pricedCandidates.push({ pkg, pricing });
      }
    }

    const feeMatches = pricedCandidates.filter(({ pricing }) => {
      const hasNoInitiationFee = parsePriceNumber(pricing.downPayment) === 0;
      return requiresNoInitiationFee ? hasNoInitiationFee : !hasNoInitiationFee;
    });
    // A no-initiation-fee membership must never fall back to the regular
    // membership package; doing so silently copies the wrong monthly price.
    if (requiresNoInitiationFee) {
      return feeMatches[0]?.pkg || null;
    }

    return feeMatches[0]?.pkg || pricedCandidates[0]?.pkg || candidates[0] || null;
  }

  // Season Passes (Gold, Prestige, etc.)
  const normalizedTier = passType.replace(/\s*Pass$/i, "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const passRegex = new RegExp(`^(?:\\d{4}\\s*\\*?\\s*)?${normalizedTier}\\s+Pass(?:\\s*\\*?\\s*\\d{4})?$`, "i");
  const candidates = [];

  for (const pkg of packageList) {
    const name = String(pkg?.name || "").trim();
    if (/add-?on|dining|bundle|ticket|haunted|military|pre-?k|drink\s+plan|cabana|upgrade|meal/i.test(name)) {
      continue;
    }
    if (!passRegex.test(name)) {
      continue;
    }

    const yearMatch = /(\d{4})/.exec(name);
    const year = yearMatch ? parseInt(yearMatch[1], 10) : 0;
    candidates.push({ pkg, year });
  }

  const validCandidates = [];
  for (const { pkg, year } of candidates) {
    const price = extractPassPriceFromPackage(pkg, source.currencySymbol || "$");
    const num = parsePriceNumber(price);
    if (num > 0) {
      validCandidates.push({ pkg, year, price, num });
    }
  }

  if (validCandidates.length === 0) {
    return candidates[0]?.pkg || null;
  }

  // The catalog is for the current 2027 season. If a store has not published it,
  // fall back to its newest available base pass.
  const preferredYear = validCandidates.some((candidate) => candidate.year === 2027)
    ? 2027
    : Math.max(...validCandidates.map((candidate) => candidate.year));
  const maxYearCandidates = validCandidates.filter((candidate) => candidate.year === preferredYear);
  maxYearCandidates.sort((a, b) => a.num - b.num);

  return maxYearCandidates[0].pkg;
}

function extractPriceFromAccessoBootstrap(jsonValue, source) {
  const pkg = findAccessoPackage(jsonValue, source);
  if (!pkg) {
    return "";
  }

  const isMembership = /membership/i.test(source.passType || "") || String(source.targetPath || source.target || "").startsWith("pricing.");
  if (isMembership) {
    const pricing = extractAccessoMembershipPricing(jsonValue, { ...source, _pkg: pkg });
    return pricing?.monthly || "";
  }

  const price = extractPassPriceFromPackage(pkg, source.currencySymbol || "$");
  if (price) {
    return price;
  }

  const candidatePaths = Array.isArray(source.jsonPaths) ? source.jsonPaths : [];
  for (const path of candidatePaths) {
    const value = resolvePath(pkg, path);
    const resolvedPrice = normalizePriceText(value, source.currencySymbol || "$");
    if (resolvedPrice) {
      return resolvedPrice;
    }
  }

  return "";
}

function extractAccessoMembershipPricing(jsonValue, source) {
  const isMembership = /membership/i.test(source.passType || "") || String(source.targetPath || source.target || "").startsWith("pricing.");
  if (!isMembership) {
    return null;
  }

  const pkg = source._pkg || findAccessoPackage(jsonValue, source);
  if (!pkg) {
    return null;
  }

  const ctList = Array.isArray(pkg.CT) ? pkg.CT : (pkg.CT ? [pkg.CT] : []);
  if (ctList.length === 0) return null;
  const ct = ctList[0];

  const monthlyVal = extractDisplayedPrice(
    ct.price_label_override || pkg.CHARACS?.price_label_override || pkg.price_label_override
  ) || parsePriceNumber(ct.retail_amount) || parsePriceNumber(ct.retail_value);
  if (monthlyVal <= 0) return null;
  const currencySymbol = source.currencySymbol || "$";
  const monthly = `${currencySymbol}${monthlyVal.toFixed(2)}`;

  // Find non-refundable initiation fee in COMP
  const rawComponents = ct.COMP || pkg.COMP;
  const compList = Array.isArray(rawComponents) ? rawComponents : (rawComponents ? [rawComponents] : []);
  const initComp = compList.find(c =>
    String(c.CHARACS?.package_type).toLowerCase() === "deposit" ||
    /initiation\s+fee/i.test(c.name || "")
  );
  let downPayment = `${currencySymbol}0.00`;
  if (initComp) {
    const initCt = Array.isArray(initComp.CT) ? initComp.CT[0] : initComp.CT;
    const feeAmt = parsePriceNumber(initCt?.retail_amount);
    const feeVal = parsePriceNumber(initCt?.retail_value);
    const feeFinal = (Math.round((feeVal % 1) * 100) === 0 && Math.round((feeAmt % 1) * 100) !== 0)
      ? feeVal
      : (feeAmt || feeVal);
    if (feeFinal > 0) {
      downPayment = `${currencySymbol}${feeFinal.toFixed(2)}`;
    }
  }

  const minMonths = parseInt(ct.PAYMENT_SCHEDULE?.required_num_payments, 10) || 12;

  return {
    monthly,
    downPayment,
    minMonths
  };
}

async function fetchSourcePrice(source) {
  const url = String(source.bootstrapUrl || resolveSourceUrl(source)).trim();
  if (!url) {
    throw new Error("Missing sourceUrl");
  }

  const response = await fetch(url, requestOptions({
      "user-agent": source.userAgent || "Pass Explorer Price Updater",
      "accept": source.accept || "text/html,application/json;q=0.9,*/*;q=0.8"
    }));

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  const contentType = String(response.headers.get("content-type") || "").toLowerCase();
  const responseText = await response.text();

  if (source.responseType === "accesso-bootstrap") {
    const jsonValue = JSON.parse(responseText);
    return extractPriceFromAccessoBootstrap(jsonValue, source);
  }

  if (source.responseType === "json" || contentType.includes("application/json")) {
    const jsonValue = JSON.parse(responseText);
    return extractPriceFromJson(jsonValue, source);
  }

  return extractPriceFromText(responseText, source);
}

async function main() {
  if (typeof fetch !== "function") {
    throw new Error("This script requires a Node.js version with built-in fetch.");
  }

  const config = await loadJson(configPath);
  const parkData = await loadParkData();
  const sources = flattenNestedSources(config, parkData);
  if (sources.length === 0) {
    throw new Error("No price sources configured in scripts/price-sources.json");
  }

  const today = utcDateOnly();
  const generatedAt = utcIsoTimestamp();
  const overrides = {};
  const summary = [];
  const unavailable = [];
  const errors = [];
  const bootstrapCache = new Map();

  for (const source of sources) {
    const park = String(source.park || "").trim();
    const passType = String(source.passType || "").trim();
    if (!park || !passType) {
      errors.push(`Skipping source with missing park or passType: ${JSON.stringify(source)}`);
      continue;
    }

    let price = "";
    let error = "";
    let membershipPricing = null;
    try {
      if (String(source.sourceKind || "").toLowerCase() === "accesso-portal") {
        const portalUrl = String(resolveSourceUrl(source, config)).trim();
        let bootstrapJson = bootstrapCache.get(portalUrl);
        if (!bootstrapJson) {
          const portalResponse = await fetch(portalUrl, requestOptions({
              "user-agent": source.userAgent || "Pass Explorer Price Updater",
              "accept": source.accept || "text/html,application/json;q=0.9,*/*;q=0.8"
            }));

          if (!portalResponse.ok) {
            throw new Error(`Portal request failed with status ${portalResponse.status}`);
          }

          const portalHtml = await portalResponse.text();
          const bootstrapUrl = extractBootstrapUrlFromHtml(portalHtml);
          if (!bootstrapUrl) {
            throw new Error("Could not find Accesso bootstrap URL in portal HTML");
          }

          const bootstrapResponse = await fetch(bootstrapUrl, requestOptions({
              "user-agent": source.userAgent || "Pass Explorer Price Updater",
              "accept": "application/json,text/plain,*/*"
            }));

          if (!bootstrapResponse.ok) {
            throw new Error(`Bootstrap request failed with status ${bootstrapResponse.status}`);
          }

          bootstrapJson = await bootstrapResponse.json();
          bootstrapCache.set(portalUrl, bootstrapJson);
        }

        price = extractPriceFromAccessoBootstrap(bootstrapJson, source);
        membershipPricing = extractAccessoMembershipPricing(bootstrapJson, source);
      } else {
        price = await fetchSourcePrice(source);
      }
    } catch (caughtError) {
      error = caughtError instanceof Error ? caughtError.message : String(caughtError || "Unknown error");
    }

    if (!price) {
      const message = `${park} / ${passType}: could not determine a price${error ? ` (${error})` : ""}`;
      // Some catalog aliases deliberately point to portals that do not sell a
      // separate membership. They are not scraper failures and must not make a
      // successful refresh fail.
      if (String(source.sourceKind || "").toLowerCase() === "accesso-portal" && !error) {
        unavailable.push(message);
      } else {
        errors.push(message);
      }
      continue;
    }

    const targetPath = String(source.targetPath || source.target || "price").trim() || "price";
    if (source.priceOverride && !/membership/i.test(passType)) {
      price = String(source.priceOverride).trim();
    }
    if (!overrides[park]) {
      overrides[park] = {};
    }

    const override = {
      updatedAt: today,
    };
    setByDotPath(override, targetPath, price);
    if (membershipPricing) {
      setByDotPath(override, "pricing.type", "membership");
      if (membershipPricing.downPayment) {
        setByDotPath(override, "pricing.downPayment", membershipPricing.downPayment);
      }
      if (membershipPricing.minMonths) {
        setByDotPath(override, "pricing.minMonths", membershipPricing.minMonths);
      }
    }
    overrides[park][passType] = override;

    summary.push(`${park} / ${passType}: ${price}`);
  }

  const output = [
    "// AUTO-GENERATED pricing overrides.",
    "// Keep park definitions in `parks.js` price-free and update prices here.",
    "",
    "window.priceOverridesMeta = " + JSON.stringify({
      generatedAt,
      timezone: "UTC"
    }, null, 2) + ";",
    "",
    "window.priceOverrides = " + JSON.stringify(overrides, null, 2) + ";",
    ""
  ].join("\n");

  if (!dryRun) {
    await writeFile(outputPath, output, "utf8");
  }

  console.log(dryRun ? "[dry-run] price-overrides.js would be updated." : "Updated price-overrides.js.");
  for (const line of summary) {
    console.log(`- ${line}`);
  }
  for (const line of unavailable) {
    console.log(`~ ${line} (not offered by this portal)`);
  }
  for (const line of errors) {
    console.warn(`! ${line}`);
  }

  if (errors.length > 0) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
