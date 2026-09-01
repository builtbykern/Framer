const pages = await framer.getNodesWithType("WebPageNode")
const targets = ["/", "/properties/:slug", "/notes/:slug"]
const out = {}

for (const path of targets) {
    const page = pages.find((p) => p.path === path)
    if (!page) {
        out[path] = { error: "missing" }
        continue
    }
    const ser = await framer.agent.serialize({ id: page.id, depth: 2 }, {})
    const desk = (ser.children || []).find((c) => c.name === "Desktop")
    const tops = (desk?.children || []).map((c, i) => ({
        i,
        id: c.id,
        name: c.name || null,
        type: c.type,
        prev: desk.children[i - 1]?.name || null,
        next: desk.children[i + 1]?.name || null,
        kidNames: (c.children || []).map((k) => k.name || k.type).slice(0, 6),
    }))
    out[path] = { pageId: page.id, deskId: desk?.id, tops }
}

console.log(JSON.stringify(out, null, 2))
