const pages = await framer.getNodesWithType("WebPageNode")

function attrs(n) {
    const a = n?.attributes || {}
    return {
        name: n?.name,
        id: n?.id,
        mw: a.maxWidth ?? null,
        w: a.width ?? null,
        pad: a.padding ?? null,
        h: a.height ?? null,
        fill: a.fill ? String(a.fill).slice(0, 36) : null,
    }
}

const home = pages.find((p) => p.path === "/")
const hser = await framer.agent.serialize({ id: home.id, depth: 3 }, {})
const hd = hser.children.find((b) => /Desktop/i.test(b.name || ""))
const hero = (hd.children || []).find((c) => c.name === "Hero Section")
const process = (hd.children || []).find((c) => /Process/i.test(c.name || ""))
const stats = (hd.children || []).find((c) => /StatsBand/i.test(c.name || ""))

const nb = pages.find((p) => p.path === "/neighbourhoods")
const nser = await framer.agent.serialize({ id: nb.id, depth: 3 }, {})
const nd = nser.children.find((b) => /Desktop/i.test(b.name || ""))
const content = (nd.children || []).find((c) => /Content/i.test(c.name || ""))
const alts = (content?.children || []).map(attrs)

const about = pages.find((p) => p.path === "/about")
const aser = await framer.agent.serialize({ id: about.id, depth: 6 }, {})
const ad = aser.children.find((b) => /Desktop/i.test(b.name || ""))
const principals = []
function walk(n, d = 0) {
    if (!n || d > 8) return
    if (/PrincipalProfile|Principal Profile/i.test(n.name || "") || String(n.componentIdentifier || "").includes("Principal")) {
        principals.push({ ...attrs(n), cid: String(n.componentIdentifier || "").slice(0, 50), type: n.type })
    }
    for (const c of n.children || []) walk(c, d + 1)
}
for (const t of ad.children || []) walk(t)

const navTop = await framer.agent.serialize({ id: "EJPuaSmlO", depth: 1 }, {})

const pp = (await framer.getNodesWithType("ComponentNode")).find((c) => c.name === "Arbour_PrincipalProfile")
const ppser = await framer.agent.serialize({ id: pp.id, depth: 2 }, {})
const ppVars = (ppser.children || []).map(attrs)

return {
    navTop: attrs(navTop),
    hero: attrs(hero),
    text: attrs((hero?.children || []).find((c) => c.name === "Text Content Column")),
    processKids: (process?.children || []).map(attrs),
    stats: attrs(stats),
    alts,
    principals,
    ppVars,
}
