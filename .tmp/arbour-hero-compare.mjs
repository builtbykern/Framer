const pages = await framer.getNodesWithType("WebPageNode")
const contact = pages.find((p) => p.path === "/contact")
const props = pages.find((p) => p.path === "/properties")
const notes = pages.find((p) => p.path === "/notes")

async function heroTree(page, heroName) {
    const ser = await framer.agent.serialize({ id: page.id, depth: 5 }, {})
    const bp = ser.children.find((c) => c.name === "Desktop")
    function find(n) {
        if (!n) return null
        if (n.name === heroName) return n
        for (const c of n.children || []) {
            const f = find(c)
            if (f) return f
        }
        return null
    }
    const hero = find(bp)
    function sum(n, d = 0) {
        if (!n || d > 2) return null
        return {
            name: n.name,
            pad: n.attributes?.padding,
            gap: n.attributes?.gap,
            fill: n.attributes?.backgroundColor || n.attributes?.fill,
            kids: (n.children || []).slice(0, 4).map((c) => sum(c, d + 1)),
        }
    }
    return sum(hero)
}

return {
    contact: await heroTree(contact, "Contact Hero"),
    properties: await heroTree(props, "Properties Hero"),
    notes: await heroTree(notes, "Notes Hero"),
}
