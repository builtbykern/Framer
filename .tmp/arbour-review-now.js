/**
 * Quick review: properties paths, redirects, soft contact, publish delta.
 */
const report = {
  at: new Date().toISOString(),
  publish: null,
  pages: [],
  propertiesPaths: [],
  redirects: null,
  soft: { mailto: new Set(), http: new Set(), estateText: [] },
  hrefHits: { properties2: [], properties: [] },
}

const info = await framer.getPublishInfo()
const preview = await framer.getUnpublishedPageChanges?.()
report.publish = {
  production: info?.production?.url,
  staging: info?.staging?.url,
  unpublished: preview
    ? [...preview].map((c) => ({
        type: c.type,
        name: c.name,
        nodeId: c.nodeId ?? c.id,
        status: c.status,
      }))
    : null,
}

try {
  const review = await framer.agent.reviewChanges?.()
  report.review = {
    changesCount: review?.changesCount ?? review?.changes?.length,
    errors: review?.errors ?? [],
    status: review?.status,
    changes: (review?.changes || []).map((c) => ({
      type: c.type,
      name: c.name,
      nodeId: c.nodeId,
      status: c.status,
    })),
  }
} catch (e) {
  report.reviewError = String(e.message || e)
}

// Redirects probe
for (const method of ["getRedirects", "getRedirectRules", "listRedirects"]) {
  try {
    if (typeof framer[method] === "function") {
      report.redirects = { method, value: await framer[method]() }
      break
    }
    if (typeof framer.agent?.[method] === "function") {
      report.redirects = { method: `agent.${method}`, value: await framer.agent[method]() }
      break
    }
  } catch (e) {
    report.redirects = { method, error: String(e.message || e) }
  }
}

function walk(n, pagePath) {
  if (!n || typeof n !== "object") return
  const href = n.attributes?.link?.href
  const cl = n.attributes?.["$control__link"]
  for (const h of [href, cl]) {
    if (typeof h !== "string") continue
    if (h.startsWith("mailto:")) report.soft.mailto.add(h)
    if (/^https?:\/\//i.test(h)) report.soft.http.add(h)
    if (h === "/properties-2" || h.startsWith("/properties-2/") || h.includes("/properties-2")) {
      report.hrefHits.properties2.push({ pagePath, id: n.id, name: n.name, href: h })
    }
    if (
      (h === "/properties" || h.startsWith("/properties/") || h.includes("/properties?")) &&
      !h.includes("/properties-2")
    ) {
      report.hrefHits.properties.push({ pagePath, id: n.id, name: n.name, href: h })
    }
  }
  const t = n.attributes?.text
  if (typeof t === "string" && /arbour\.estate/i.test(t)) {
    report.soft.estateText.push({ pagePath, id: n.id, text: t })
  }
  for (const c of n.children || []) walk(c, pagePath)
  for (const b of n.$breakpoints || []) walk(b, pagePath)
  for (const v of n.$variants || n.variants || []) walk(v, pagePath)
}

for (const p of await framer.getNodesWithType("WebPageNode")) {
  const path = p.path ?? p.attributes?.path ?? null
  report.pages.push({ id: p.id, name: p.name, path })
  if (typeof path === "string" && path.includes("propert")) {
    report.propertiesPaths.push({ id: p.id, name: p.name, path })
  }
  walk(await framer.agent.serialize({ id: p.id, depth: 20 }, {}), path || p.id)
}

for (const [label, id] of [
  ["Nav", "ynpqYJGOd"],
  ["Footer", "pXUahiblU"],
]) {
  try {
    walk(await framer.agent.serialize({ id, depth: 16 }, {}), `component:${label}`)
  } catch (e) {
    report[`component_${label}_error`] = String(e.message || e)
  }
}

// Deduplicate hit lists
for (const key of ["properties2", "properties"]) {
  const seen = new Set()
  report.hrefHits[key] = report.hrefHits[key].filter((h) => {
    const k = `${h.pagePath}|${h.id}|${h.href}`
    if (seen.has(k)) return false
    seen.add(k)
    return true
  })
}

report.soft = {
  mailto: [...report.soft.mailto],
  http: [...report.soft.http],
  estateText: report.soft.estateText,
  softOk:
    report.soft.mailto.length === 1 &&
    report.soft.mailto[0] === "mailto:enquiries@arbour.london" &&
    report.soft.estateText.length === 0 &&
    !report.soft.http.some((h) =>
      ["https://instagram.com", "https://linkedin.com", "https://x.com"].includes(h)
    ),
}

report.summary = {
  listingPath: report.propertiesPaths.map((p) => p.path),
  stillUsesProperties2: report.hrefHits.properties2.length,
  alreadyUsesProperties: report.hrefHits.properties.length,
  softOk: report.soft.softOk,
  unpublishedCount: report.review?.changesCount ?? report.publish?.unpublished?.length ?? null,
}

console.log(JSON.stringify(report, null, 2))
