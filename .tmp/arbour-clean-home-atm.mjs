/**
 * Home Desktop got 3 Atmosphere frames (D/T/P creates leaked). Keep one.
 */
const NL = String.fromCharCode(10)
const pages = await framer.getNodesWithType("WebPageNode")
const home = pages.find((p) => p.path === "/")
const ser = await framer.agent.serialize({ id: home.id, depth: 2 }, {})
const desktop = (ser.children || []).find((c) => c.name === "Desktop")
const atms = (desktop.children || []).filter((c) => c.name === "Atmosphere")
const keep = atms[0]
const del = atms.slice(1).map((a) => a.id)
const lines = del.map((id) => `DEL ${id};`)

// Ensure order: Loading, Smooth, Atmosphere, Nav...
const byName = {}
for (const c of desktop.children || []) {
    if (c.name && !byName[c.name]) byName[c.name] = c
}
if (keep) {
    lines.push(`MOVE ${keep.id} parent="${desktop.id}" index="2";`)
}
const nav = byName["Nav"]
if (nav) lines.push(`MOVE ${nav.id} parent="${desktop.id}" index="3";`)

const result = lines.length
    ? await framer.agent.applyChanges(lines.join(NL), { pagePath: "/" })
    : { message: "noop" }

const ser2 = await framer.agent.serialize({ id: home.id, depth: 2 }, {})
const tops = {}
for (const bp of ser2.children || []) {
    tops[bp.name] = (bp.children || [])
        .filter((c) =>
            /Loading|Smooth|Atmosphere|^Nav$|ProgressiveBlur|^Footer$/i.test(c.name || ""),
        )
        .map((c) => c.name)
}
return { deleted: del, kept: keep?.id, result, tops }
