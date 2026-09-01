const pages = await framer.getNodesWithType("WebPageNode")
const comps = await framer.getNodesWithType("ComponentNode")
const files = await framer.getCodeFiles()
const orphanIds = new Set([
    "DTpIPSC",
    "gKy5r76",
    "qAxfgzH",
    "zbud3PK",
    "AXjaz2Z",
    "NN1s2o1",
    "CbZkhOy",
    "TE5IJ7M",
])

function countHits(n, map) {
    if (!n) return
    const c = String(n.component || "")
    const m = c.match(/codeFile\/([^:]+)/)
    if (m && orphanIds.has(m[1])) map[m[1]] = (map[m[1]] || 0) + 1
    for (const ch of n.children || []) countHits(ch, map)
}

const pageHits = {}
const compHits = {}
for (const p of pages || []) {
    const ser = await framer.agent.serialize({ id: p.id, depth: 14 }, {})
    countHits(ser, pageHits)
}
for (const c of comps || []) {
    const ser = await framer.agent.serialize({ id: c.id, depth: 14 }, {})
    countHits(ser, compHits)
}

const orphanReport = (files || [])
    .filter((f) => orphanIds.has(f.id))
    .map((f) => ({
        id: f.id,
        name: f.name,
        pageHits: pageHits[f.id] || 0,
        designCompHits: compHits[f.id] || 0,
    }))

const unnamed = []
for (const path of ["/properties", "/about", "/contact"]) {
    const page = (pages || []).find((x) => x.path === path)
    const ser = await framer.agent.serialize({ id: page.id, depth: 2 }, {})
    const desk = (ser.children || []).find((c) => c.name === "Desktop")
    for (const c of desk.children || []) {
        if (!c.name) {
            const deep = await framer.agent.serialize({ id: c.id, depth: 1 }, {})
            unnamed.push({
                path,
                id: c.id,
                type: c.type,
                component: deep.component,
                display: deep.$componentDisplayName,
            })
        }
    }
}

const risks = []
for (const p of pages || []) {
    if (!p.path || p.path === "/404") continue
    const ser = await framer.agent.serialize({ id: p.id, depth: 12 }, {})
    function walk(n, linkAncestors, trail) {
        if (!n) return
        const isUL =
            n.type === "ComponentInstanceNode" &&
            ((n.name || "").includes("UnderlineLink") ||
                String(n.component || "").includes("Underline"))
        if (isUL && linkAncestors) {
            risks.push({ path: p.path, id: n.id, name: n.name, trail: trail.slice(-5) })
        }
        const next = linkAncestors || !!(n.attributes && n.attributes.link)
        for (const ch of n.children || []) walk(ch, next, trail.concat([n.name || n.type]))
    }
    walk(ser, false, [])
}

// Home blur placement
const home = (pages || []).find((x) => x.path === "/")
const hser = await framer.agent.serialize({ id: home.id, depth: 4 }, {})
const desk = (hser.children || []).find((c) => c.name === "Desktop")
const blurPlaces = []
function wb(n, trail) {
    if (!n) return
    if ((n.name || "").includes("ProgressiveBlur") || String(n.component || "").includes("fOrMtU2")) {
        blurPlaces.push({ id: n.id, name: n.name, trail })
    }
    for (const c of n.children || []) wb(c, trail.concat([n.name || n.type]))
}
wb(desk, [])

console.log(
    JSON.stringify({ orphanReport, unnamed, underlineNested: risks, homeBlurPlaces: blurPlaces }, null, 2),
)
