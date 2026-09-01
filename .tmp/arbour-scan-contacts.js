// Scan mailto / social / tel / href soft issues across Arbour pages
const pages = await framer.getPages()
const out = {
  mailto: [],
  social: [],
  tel: [],
  externalHttp: [],
  internal: [],
  footerHome: [],
}

const SOCIAL_HOSTS = ["instagram.com", "linkedin.com", "x.com", "twitter.com", "facebook.com"]

function walk(node, pagePath, depth = 0) {
  if (!node || depth > 40) return
  const link = node.link
  if (link && typeof link === "object") {
    const href = link.href ?? link.url ?? null
    const type = link.type ?? null
    const entry = {
      pagePath,
      nodeId: node.id,
      name: node.name ?? null,
      type,
      href,
      link,
    }
    if (typeof href === "string") {
      if (href.startsWith("mailto:")) out.mailto.push(entry)
      else if (href.startsWith("tel:")) out.tel.push(entry)
      else if (/^https?:\/\//i.test(href)) {
        out.externalHttp.push(entry)
        try {
          const u = new URL(href)
          if (SOCIAL_HOSTS.some((h) => u.hostname.replace(/^www\./, "").endsWith(h))) {
            out.social.push(entry)
          }
        } catch {}
      } else if (href.startsWith("/")) out.internal.push({ pagePath, nodeId: node.id, name: node.name, href })
    }
  }
  // also check attributes that might store url text
  for (const key of ["url", "href", "link"]) {
    const v = node[key]
    if (typeof v === "string" && (v.startsWith("mailto:") || /^https?:\/\//i.test(v))) {
      // already covered via link usually
    }
  }
  const children = node.children ?? []
  for (const c of children) walk(c, pagePath, depth + 1)
}

for (const p of pages) {
  if (p.path == null) continue
  await framer.setCurrentPage(p.id)
  const root = await framer.getCanvasRoot()
  walk(root, p.path)
}

// Deduplicate by page+node+href
function dedupe(arr) {
  const seen = new Set()
  return arr.filter((e) => {
    const k = `${e.pagePath}|${e.nodeId}|${e.href}`
    if (seen.has(k)) return false
    seen.add(k)
    return true
  })
}

console.log(
  JSON.stringify(
    {
      mailto: dedupe(out.mailto),
      social: dedupe(out.social),
      tel: dedupe(out.tel),
      externalHttp: dedupe(out.externalHttp),
      sampleInternalHome: dedupe(out.internal).filter((e) => e.href === "/").slice(0, 20),
      counts: {
        mailto: dedupe(out.mailto).length,
        social: dedupe(out.social).length,
        tel: dedupe(out.tel).length,
        external: dedupe(out.externalHttp).length,
      },
    },
    null,
    2
  )
)
