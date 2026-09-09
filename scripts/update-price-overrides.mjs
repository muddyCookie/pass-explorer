#!/usr/bin/env node
import { readFile, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "..");
const configPath = join(__dirname, "price-sources.json");
const outputPath = join(repoRoot, "price-overrides.js");

const args = new Set(process.argv.slice(2));
const dryRun = args.has("--dry-run");

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
    parks,
    ...rest
  } = source || {};
  return rest;
}

function flattenNestedSources(config) {
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
    visit(sourceConfig, [sourceKind], { sourceKind });
  }

  return flattened;
}

function resolvePath(source, rawPath) {
  const path = String(rawPath || "").trim();
  if (!path) {
    return undefined;
  }

  return path.split(".").reduce((value, key) => {
    if (value == null) {
      return undefined;
    }
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

function findAccessoPackage(jsonValue, source) {
  const packages = jsonValue?.GetMerchantPackageList?.SERVICE?.PS?.P;
  const packageList = Array.isArray(packages)
    ? packages
    : (packages && typeof packages === "object" ? Object.values(packages) : []);

  if (packageList.length === 0) {
    return null;
  }

  const packageName = String(source.packageName || "").trim().toLowerCase();
  const packageKeyword = String(source.packageKeyword || source.packageKeywords || "").trim().toLowerCase();
  const seasonPassType = String(source.seasonPassType || source.season_pass_type || "").trim().toUpperCase();
  const packageClass = String(source.packageClass || source.package_class || "").trim().toLowerCase();

  return packageList.find((pkg) => {
    const name = String(pkg?.name || "").trim().toLowerCase();
    const keyword = String(pkg?.keyword || pkg?.assoc_keywords || "").trim().toLowerCase();
    const pkgSeasonPassType = String(pkg?.CHARACS?.season_pass_type || "").trim().toUpperCase();
    const pkgClass = String(pkg?.package_class || "").trim().toLowerCase();
    return (
      (packageName && name === packageName)
      || (packageKeyword && keyword.includes(packageKeyword))
      || (seasonPassType && pkgSeasonPassType === seasonPassType)
      || (packageClass && pkgClass === packageClass)
    );
  }) || null;
}

function extractPriceFromAccessoBootstrap(jsonValue, source) {
  const pkg = findAccessoPackage(jsonValue, source);
  if (!pkg) {
    return "";
  }

  const candidatePaths = Array.isArray(source.jsonPaths) ? source.jsonPaths : [];
  if (candidatePaths.length === 0) {
    throw new Error("Accesso source is missing explicit jsonPaths");
  }

  for (const path of candidatePaths) {
    const value = resolvePath(pkg, path);
    const price = normalizePriceText(value, source.currencySymbol || "$");
    if (price) {
      return price;
    }
  }

  return "";
}

async function fetchSourcePrice(source) {
  const url = String(source.bootstrapUrl || resolveSourceUrl(source)).trim();
  if (!url) {
    throw new Error("Missing sourceUrl");
  }

  const response = await fetch(url, {
    headers: {
      "user-agent": source.userAgent || "Pass Explorer Price Updater",
      "accept": source.accept || "text/html,application/json;q=0.9,*/*;q=0.8"
    },
    redirect: "follow"
  });

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
  const sources = flattenNestedSources(config);
  if (sources.length === 0) {
    throw new Error("No price sources configured in scripts/price-sources.json");
  }

  const today = utcDateOnly();
  const generatedAt = utcIsoTimestamp();
  const overrides = {};
  const summary = [];
  const errors = [];

  for (const source of sources) {
    const park = String(source.park || "").trim();
    const passType = String(source.passType || "").trim();
    if (!park || !passType) {
      errors.push(`Skipping source with missing park or passType: ${JSON.stringify(source)}`);
      continue;
    }

    let price = "";
    let error = "";
    try {
      if (String(source.sourceKind || "").toLowerCase() === "accesso-portal") {
        const portalUrl = String(resolveSourceUrl(source, config)).trim();
        const portalResponse = await fetch(portalUrl, {
          headers: {
            "user-agent": source.userAgent || "Pass Explorer Price Updater",
            "accept": source.accept || "text/html,application/json;q=0.9,*/*;q=0.8"
          },
          redirect: "follow"
        });

        if (!portalResponse.ok) {
          throw new Error(`Portal request failed with status ${portalResponse.status}`);
        }

        const portalHtml = await portalResponse.text();
        const bootstrapUrl = extractBootstrapUrlFromHtml(portalHtml);
        if (!bootstrapUrl) {
          throw new Error("Could not find Accesso bootstrap URL in portal HTML");
        }

        const bootstrapResponse = await fetch(bootstrapUrl, {
          headers: {
            "user-agent": source.userAgent || "Pass Explorer Price Updater",
            "accept": "application/json,text/plain,*/*"
          },
          redirect: "follow"
        });

        if (!bootstrapResponse.ok) {
          throw new Error(`Bootstrap request failed with status ${bootstrapResponse.status}`);
        }

        const bootstrapJson = await bootstrapResponse.json();
        price = extractPriceFromAccessoBootstrap(bootstrapJson, source);
      } else {
        price = await fetchSourcePrice(source);
      }
    } catch (caughtError) {
      error = caughtError instanceof Error ? caughtError.message : String(caughtError || "Unknown error");
    }

    if (!price) {
      errors.push(`${park} / ${passType}: could not determine a price${error ? ` (${error})` : ""}`);
      continue;
    }

    const targetPath = String(source.targetPath || source.target || "price").trim() || "price";
    if (!overrides[park]) {
      overrides[park] = {};
    }

    const override = {
      updatedAt: today,
    };
    setByDotPath(override, targetPath, price);
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
