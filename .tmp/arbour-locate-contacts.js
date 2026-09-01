/**
 * Locate mailto / social / email text nodes for soft-fix polish.
 */
const TARGETS = {
  mailtoLondon: "mailto:enquiries@arbour.london",
  mailtoEstate: "mailto:enquiries@arbour.estate",
  socials: ["https://instagram.com", "https://linkedin.com", "https://x.com"],
}

const hits = []

function walk(n, pagePath, trail = []) {
  if (!n || typeof n !== "object") return
  const name = n.name || n.$componentDisplayName || ""
  const href = n.attributes?.link?.href
  const controlLink = n.attributes?.["$control__link"]
  const text =
    typeof n.attributes?.text === "string"
      ? n.attributes.text
      : typeof n.attributes?.content === "string"
        ? n.attributes.content
        : null

  const interesting =
    (href &&
      (href.includes("mailto:") ||
        TARGETS.socials.includes(href) ||
        /instagram|linkedin|x\.com|twitter/i.test(href))) ||
    (typeof controlLink === "string" &&
      (controlLink.includes("mailto:") || TARGETS.socials.includes(controlLink))) ||
    (typeof text === "string" && /enquiries@arbour|arbour\.(london|estate)/i.test(text))

  if (interesting) {
    hits.push({
      pagePath,
      id: n.id,
      name,
      type: n.type,
      href: href || null,
      controlLink: controlLink || null,
      text: text && String(text).slice(0, 120),
      trail: trail.slice(-4),
    })
  }

  for (const c of n.children || []) walk(c, pagePath, [...trail, name || n.id])
  for (const b of n.$breakpoints || []) walk(b, pagePath, [...trail, "BP"])
  for (const v of n.$variants || n.variants || []) walk(v, pagePath, [...trail, "VAR"])
}

// Pages
for (const p of await framer.getNodesWithType("WebPageNode")) {
  const path = p.path ?? p?.attributes?.path
  const tree = await framer.agent.serialize({ id: p.id, depth: 20 }, {})
  walk(tree, path || p.id)
}

// Smart components Nav / Footer
for (const [label, id] of [
  ["Nav", "ynpqYJGOd"],
  ["Footer", "pXUahiblU"],
]) {
  try {
    const tree = await framer.agent.serialize({ id, depth: 16 }, {})
    walk(tree, `component:${label}`)
  } catch (e) {
    hits.push({ pagePath: `component:${label}`, error: String(e.message || e) })
  }
}

console.log(JSON.stringify({ count: hits.length, hits }, null, 2))
