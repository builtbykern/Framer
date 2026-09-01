/**
 * Open Footer component master + Home Journal Content Area children (CMS grid).
 * Also Contact Journal for same pattern.
 */
const pages = await framer.getNodesWithType("WebPageNode")
const home = pages.find((x) => x.path === "/")
const ser = await framer.agent.serialize({ id: home.id, depth: 7 }, {})
const desk = ser.children.find((b) => b.name === "Desktop")
const journal = desk.children.find((c) => c.name === "Journal")
const footer = desk.children.find((c) => c.name === "Footer")

function shallow(n, depth = 0) {
    if (!n || depth > 4) return null
    const a = n.attributes || {}
    return {
        id: n.id,
        name: n.name,
        type: n.type,
        componentId: n.componentId,
        w: a.width,
        maxW: a.maxWidth,
        pad: a.padding,
        layout: a.layout,
        dir: a.stackDirection,
        align: a.stackAlignment,
        justify: a.stackDistribution,
        gap: a.gap,
        children: (n.children || []).slice(0, 12).map((c) => shallow(c, depth + 1)),
    }
}

// Resolve footer component
let footerMaster = null
const compId = footer?.componentId || footer?.attributes?.componentId
if (compId) {
    try {
        const fs = await framer.agent.serialize({ id: compId, depth: 5 }, {})
        footerMaster = shallow(fs, 0)
    } catch (e) {
        footerMaster = { error: String(e), compId }
    }
}

// Also try getComponent or list components named Footer
let footerAlts = []
try {
    const comps = await framer.getNodesWithType("ComponentNode")
    footerAlts = (comps || [])
        .filter((c) => /Footer|footer/i.test(c.name || ""))
        .map((c) => ({ id: c.id, name: c.name }))
} catch (e) {
    footerAlts = [{ err: String(e) }]
}

// For each footer component, serialize
const footerTrees = []
for (const f of footerAlts.slice(0, 3)) {
    try {
        const fs = await framer.agent.serialize({ id: f.id, depth: 5 }, {})
        footerTrees.push({ name: f.name, id: f.id, tree: shallow(fs, 0) })
    } catch (e) {
        footerTrees.push({ name: f.name, id: f.id, error: String(e) })
    }
}

return {
    journalContent: shallow(journal, 0),
    footerInstance: shallow(footer, 0),
    footerMaster,
    footerAlts,
    footerTrees,
}
