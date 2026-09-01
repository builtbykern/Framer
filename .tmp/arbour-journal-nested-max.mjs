/**
 * Deep: Home Journal Content Area + Bottom (image strip?) + Footer component internals
 * Find nested maxWidth 1200 and auto-width decks that cause right-shift.
 */
const pages = await framer.getNodesWithType("WebPageNode")
const home = pages.find((x) => x.path === "/")
const ser = await framer.agent.serialize({ id: home.id, depth: 6 }, {})
const desk = ser.children.find((b) => b.name === "Desktop")

function walk(n, depth = 0, path = "") {
    if (!n || depth > 5) return []
    const a = n.attributes || {}
    const here = `${path}/${n.name || "?"}`
    const rows = [
        {
            path: here,
            id: n.id,
            w: a.width,
            maxW: a.maxWidth,
            pad: a.padding,
            layout: a.layout,
            dir: a.stackDirection,
            align: a.stackAlignment,
            justify: a.stackDistribution,
            gap: a.gap,
            pos: a.position,
        },
    ]
    for (const c of n.children || []) {
        rows.push(...walk(c, depth + 1, here))
    }
    return rows
}

const journal = desk.children.find((c) => c.name === "Journal")
const bottom = desk.children.find((c) => c.name === "Bottom")
const footer = desk.children.find((c) => c.name === "Footer")

// Footer is component instance — get component description / master
let footerInfo = null
if (footer) {
    footerInfo = {
        id: footer.id,
        type: footer.type || footer.__class || null,
        componentId: footer.componentId || footer.attributes?.componentId,
        attrs: {
            w: footer.attributes?.width,
            maxW: footer.attributes?.maxWidth,
            pad: footer.attributes?.padding,
        },
    }
    // try serialize footer alone deeper
    try {
        const fs = await framer.agent.serialize({ id: footer.id, depth: 4 }, {})
        footerInfo.tree = walk(fs, 0, "Footer")
    } catch (e) {
        footerInfo.serError = String(e)
    }
}

// Also Notes Journal Content Area nesting
const notes = pages.find((x) => x.path === "/notes")
const nser = await framer.agent.serialize({ id: notes.id, depth: 6 }, {})
const ndesk = nser.children.find((b) => b.name === "Desktop")
const nJournal = ndesk.children.find((c) => c.name === "Journal")
const nMan = ndesk.children.find((c) => c.name === "Journal Manifesto")

return {
    homeJournal: walk(journal, 0, "Journal"),
    homeBottom: walk(bottom, 0, "Bottom"),
    footerInfo,
    notesJournal: walk(nJournal, 0, "Journal"),
    notesManifesto: walk(nMan, 0, "Manifesto"),
}
