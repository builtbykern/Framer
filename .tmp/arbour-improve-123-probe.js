/**
 * 1) Redirects  2) NH detail probe  3) Footer home-link candidates
 */
const out = { redirects: null, nh: null, footer: null }

// --- Redirects ---
try {
  const before = await framer.getRedirects()
  let added = null
  let err = null
  try {
    added = await framer.addRedirects([
      { from: "/properties-2", to: "/properties", expandToAllLocales: true },
      { from: "/properties-2/*", to: "/properties/:1", expandToAllLocales: true },
    ])
  } catch (e) {
    err = String(e.message || e)
  }
  out.redirects = {
    before: before.map((r) => ({ id: r.id, from: r.from, to: r.to })),
    added: added?.map?.((r) => ({ id: r.id, from: r.from, to: r.to })) ?? added,
    error: err,
    after: (await framer.getRedirects()).map((r) => ({ id: r.id, from: r.from, to: r.to })),
  }
} catch (e) {
  out.redirects = { fatal: String(e.message || e) }
}

// --- NH detail probe (read-only first) ---
const pages = await framer.getNodesWithType("WebPageNode")
out.nh = {
  existing: pages
    .filter((p) => String(p.path || "").includes("neighbourhood"))
    .map((p) => ({ id: p.id, path: p.path, collectionId: p.collectionId })),
  collections: (await framer.getCollections()).map((c) => ({ id: c.id, name: c.name })),
}

// Probe APIs available
out.nh.apis = {
  createWebPage: typeof framer.createWebPage,
  createPage: typeof framer.createPage,
  setAttributes: typeof framer.setAttributes,
  agentCreate: typeof framer.agent?.createWebPage,
}

// --- Footer: find logo / wordmark / brand link candidates ---
const foot = await framer.agent.serialize({ id: "pXUahiblU", depth: 14 }, {})
const candidates = []
function walk(n, trail = []) {
  if (!n || typeof n !== "object") return
  const name = (n.name || n.$componentDisplayName || "").toString()
  const href = n.attributes?.link?.href
  const looksBrand =
    /logo|wordmark|arbour|brand|mark|home/i.test(name) ||
    (typeof n.attributes?.text === "string" && /arbour/i.test(n.attributes.text))
  if (looksBrand || href === "/" || (!href && /logo|wordmark|arbour/i.test(name))) {
    candidates.push({
      id: n.id,
      name,
      type: n.type,
      href: href ?? null,
      text: typeof n.attributes?.text === "string" ? n.attributes.text.slice(0, 40) : null,
      trail: trail.slice(-5),
    })
  }
  // also capture top-level left column frames
  for (const c of n.children || []) walk(c, [...trail, name || n.id])
  for (const b of n.$breakpoints || []) walk(b, [...trail, "BP"])
  for (const v of n.$variants || n.variants || []) walk(v, [...trail, "VAR"])
}
walk(foot)
out.footer = { candidates: candidates.slice(0, 40), rootName: foot.name, rootType: foot.type }

console.log(JSON.stringify(out, null, 2))
