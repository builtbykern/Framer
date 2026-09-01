/**
 * Read-only link audit for Arbour — pages, hrefs, CMS detail paths.
 */
const pages = []
for (const p of await framer.getNodesWithType("WebPageNode")) {
    pages.push({
        id: p.id,
        path: p.path,
        collectionId: p.collectionId,
        draft: p.draft,
    })
}
const pathSet = new Set(pages.map((p) => p.path).filter(Boolean))

// Normalize for matching: /properties-2/:slug vs /properties-2/:Properties
function pathExists(href) {
    if (!href || typeof href !== "string") return { ok: false, reason: "empty" }
    if (href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("tel:")) {
        return { ok: true, kind: "external" }
    }
    if (href.startsWith("#")) return { ok: true, kind: "hash" }
    const clean = href.split("?")[0].split("#")[0]
    if (pathSet.has(clean)) return { ok: true, kind: "exact" }
    // CMS detail pattern: /foo/:slug style pages
    for (const p of pathSet) {
        if (!p.includes(":")) continue
        const prefix = p.slice(0, p.indexOf(":"))
        if (clean.startsWith(prefix) && clean.length > prefix.length) {
            return { ok: true, kind: "cms-detail", page: p }
        }
    }
    // static page missing
    if ([...pathSet].some((p) => !p.includes(":") && p === clean)) {
        return { ok: true, kind: "exact" }
    }
    return { ok: false, reason: "no-matching-page", clean }
}

const links = []
const broken = []
const byPage = {}

for (const page of pages) {
    const tree = await framer.agent.serialize({ id: page.id, depth: 14 }, {})
    const pageLinks = []
    function walk(n, trail) {
        if (!n || typeof n !== "object") return
        const href = n.attributes?.link?.href
        const collectionItem = n.attributes?.link?.collectionItem
        if (href) {
            const check = pathExists(href)
            const entry = {
                id: n.id,
                name: n.name || n.$componentDisplayName || n.type,
                href,
                collectionItem: collectionItem || null,
                ...check,
            }
            pageLinks.push(entry)
            links.push({ path: page.path, ...entry })
            if (!check.ok && check.kind !== "external") {
                broken.push({ path: page.path, ...entry })
            }
        }
        for (const c of n.children || []) walk(c, trail)
        for (const b of n.$breakpoints || []) walk(b, trail)
    }
    walk(tree, [])
    byPage[page.path] = {
        count: pageLinks.length,
        hrefs: [...new Set(pageLinks.map((l) => l.href))],
    }
}

// Key exemplars
const navSample = links.filter((l) => /nav|footer|underline|territory|property|article/i.test(l.name || "")).slice(0, 40)
const nhCard = await framer.agent.serialize({ id: "i56eWdACt", depth: 0 }, {})
const propLink = await framer.agent.serialize({ id: "lIX6py1V0", depth: 0 }, {})

// Unique internal hrefs sitewide
const internal = [...new Set(links.map((l) => l.href).filter((h) => h && h.startsWith("/")))]

console.log(
    JSON.stringify(
        {
            sitemap: pages.map((p) => p.path),
            linkCount: links.length,
            uniqueInternalHrefs: internal.sort(),
            broken,
            byPage,
            nhCard: nhCard.attributes?.link,
            propertyCardLink: propLink.attributes?.link,
            notesUL: (
                await framer.agent.serialize({ id: "TERtNoUYH", depth: 0 }, {})
            )?.attributes?.["$control__decorative"],
        },
        null,
        2,
    ),
)
