/**
 * Audit code file usage across pages + smart components.
 * A file is USED if any ComponentInstance references its componentId / insertURL / name.
 */
const files = await framer.getCodeFiles()
const pages = await framer.getNodesWithType("WebPageNode")
const comps = await framer.getNodesWithType("ComponentNode")

const usedComponentIds = new Set()
const usedNames = new Set()
const hits = []

function scanNode(n, scope) {
    if (!n) return
    const a = n.attributes || {}
    const name = n.name || a.$componentDisplayName || ""
    const comp = a.$component || ""
    // Component instances often expose via getNode better — serialize has limited attrs
    if (n.type === "ComponentInstanceNode" || /Arbour_|BuiltByKern_|Scroll Blur/i.test(name)) {
        hits.push({ scope, id: n.id, name, comp: String(comp).slice(0, 100) })
        if (name) usedNames.add(name)
        const m = String(comp).match(/codeFile\/([^:]+)/)
        if (m) usedComponentIds.add(m[1])
    }
    for (const c of n.children || []) scanNode(c, scope)
}

for (const p of pages || []) {
    if (!p.path) continue
    const ser = await framer.agent.serialize({ id: p.id, depth: 8 }, {})
    for (const bp of ser.children || []) scanNode(bp, p.path)
}

for (const c of comps || []) {
    const ser = await framer.agent.serialize({ id: c.id, depth: 8 }, {})
    scanNode(ser, `comp:${c.name}`)
}

// Also probe getNode on known instance ids from hits for componentIdentifier
const byGetNode = []
for (const h of hits.slice(0, 80)) {
    try {
        const n = await framer.getNode(h.id)
        if (n?.componentIdentifier) {
            byGetNode.push({
                id: h.id,
                name: n.name || h.name,
                comp: n.componentIdentifier,
                insert: n.insertURL,
            })
            const m = String(n.componentIdentifier).match(/codeFile\/([^:]+)/)
            if (m) usedComponentIds.add(m[1])
            if (n.name) usedNames.add(n.name)
            if (n.componentName) usedNames.add(n.componentName)
        }
    } catch {}
}

// Broader: walk ALL component instances via serialize dump for codeFile/
const allRefs = new Set()
for (const p of pages || []) {
    if (!p.path) continue
    const ser = await framer.agent.serialize({ id: p.id, depth: 8 }, {})
    const dump = JSON.stringify(ser)
    for (const m of dump.matchAll(/codeFile\/([A-Za-z0-9_]+)/g)) {
        allRefs.add(m[1])
        usedComponentIds.add(m[1])
    }
}
for (const c of comps || []) {
    const ser = await framer.agent.serialize({ id: c.id, depth: 8 }, {})
    const dump = JSON.stringify(ser)
    for (const m of dump.matchAll(/codeFile\/([A-Za-z0-9_]+)/g)) {
        allRefs.add(m[1])
        usedComponentIds.add(m[1])
    }
}

const report = files.map((f) => {
    const exportIds = (f.exports || []).map((e) => {
        const m = String(e.componentId || "").match(/codeFile\/([^:]+)/)
        return m ? m[1] : f.id
    })
    const exportNames = (f.exports || []).map((e) => e.name)
    const usedById = exportIds.some((id) => usedComponentIds.has(id) || usedComponentIds.has(f.id))
    const usedByName = exportNames.some(
        (n) =>
            usedNames.has(n) ||
            [...usedNames].some((u) => u.includes(n) || n.includes(u.replace(/^Arbour_/, ""))),
    )
    return {
        id: f.id,
        name: f.name,
        exports: exportNames,
        used: usedById || usedByName,
        usedById,
        usedByName,
    }
})

return {
    files: report,
    unused: report.filter((r) => !r.used),
    used: report.filter((r) => r.used),
    usedComponentIds: [...usedComponentIds],
    sampleHits: byGetNode.slice(0, 25),
}
