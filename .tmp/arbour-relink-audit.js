/**
 * Full relink audit: any /properties-2 → candidates for SET to /properties.
 * Also list page paths + current redirects.
 */
const hits = []
const pagePaths = []

function consider(n, pagePath, field, value) {
  if (typeof value !== "string") return
  if (!value.includes("properties-2") && value !== "/properties-2") return
  hits.push({
    pagePath,
    id: n.id,
    name: n.name || n.$componentDisplayName || null,
    type: n.type,
    field,
    value,
  })
}

function walk(n, pagePath) {
  if (!n || typeof n !== "object") return
  const attrs = n.attributes || {}
  consider(n, pagePath, "link.href", attrs.link?.href)
  consider(n, pagePath, "$control__link", attrs["$control__link"])
  consider(n, pagePath, "$control__href", attrs["$control__href"])
  // nested controls often store linkBase etc
  for (const [k, v] of Object.entries(attrs)) {
    if (typeof v === "string") consider(n, pagePath, k, v)
    else if (v && typeof v === "object") {
      const s = JSON.stringify(v)
      if (s.includes("properties-2")) {
        hits.push({
          pagePath,
          id: n.id,
          name: n.name,
          type: n.type,
          field: k + "(object)",
          value: s.slice(0, 200),
        })
      }
    }
  }
  for (const c of n.children || []) walk(c, pagePath)
  for (const b of n.$breakpoints || []) walk(b, pagePath)
  for (const v of n.$variants || n.variants || []) walk(v, pagePath)
}

for (const p of await framer.getNodesWithType("WebPageNode")) {
  const path = p.path ?? p.attributes?.path ?? null
  pagePaths.push({ id: p.id, name: p.name, path })
  walk(await framer.agent.serialize({ id: p.id, depth: 22 }, {}), path || p.id)
}

for (const [label, id] of [
  ["Nav", "ynpqYJGOd"],
  ["Footer", "pXUahiblU"],
]) {
  try {
    walk(await framer.agent.serialize({ id, depth: 18 }, {}), `component:${label}`)
  } catch (e) {
    hits.push({ pagePath: `component:${label}`, error: String(e.message || e) })
  }
}

// Code files
const codeHits = []
try {
  const files = await framer.getCodeFiles()
  for (const f of files) {
    const content = await f.getFileContent?.() ?? f.content
    if (typeof content === "string" && content.includes("properties-2")) {
      codeHits.push({ id: f.id, name: f.name, path: f.path, count: (content.match(/properties-2/g) || []).length })
    }
  }
} catch (e) {
  codeHits.push({ error: String(e.message || e) })
}

const redirects = await framer.getRedirects()

// Also harvest ALL /properties links for sanity
const propsLinks = []
function walkProps(n, pagePath) {
  if (!n || typeof n !== "object") return
  const href = n.attributes?.link?.href
  const cl = n.attributes?.["$control__link"]
  for (const h of [href, cl]) {
    if (typeof h === "string" && (h === "/properties" || h.startsWith("/properties/") || h.includes("/properties"))) {
      propsLinks.push({ pagePath, id: n.id, name: n.name, href: h })
    }
  }
  for (const c of n.children || []) walkProps(c, pagePath)
  for (const b of n.$breakpoints || []) walkProps(b, pagePath)
  for (const v of n.$variants || n.variants || []) walkProps(v, pagePath)
}
for (const p of await framer.getNodesWithType("WebPageNode")) {
  walkProps(await framer.agent.serialize({ id: p.id, depth: 14 }, {}), p.path || p.id)
}
for (const id of ["ynpqYJGOd", "pXUahiblU"]) {
  try {
    walkProps(await framer.agent.serialize({ id, depth: 14 }, {}), id)
  } catch {}
}

const uniqueProps = [...new Set(propsLinks.map((x) => x.href))]

console.log(
  JSON.stringify(
    {
      pagePaths,
      properties2Hits: hits,
      codeHits,
      redirects: redirects.map((r) => ({ id: r.id, from: r.from, to: r.to, expand: r.expandToAllLocales })),
      uniquePropsHrefs: uniqueProps,
      propsLinkCount: propsLinks.length,
    },
    null,
    2
  )
)
