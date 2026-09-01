/**
 * /404: remove Nav + Footer (keep page self-contained Identity Rail).
 */
const NL = String.fromCharCode(10)
const pages = await framer.getNodesWithType("WebPageNode")
const p404 = pages.find((p) => p.path === "/404")
const ser = await framer.agent.serialize({ id: p404.id, depth: 3 }, {})
const del = []

for (const bp of ser.children || []) {
    for (const c of bp.children || []) {
        if (c.name === "Nav" || c.name === "Footer") del.push(c.id)
    }
}

const uniq = [...new Set(del)]
const lines = uniq.map((id) => `DEL ${id};`)
const result = lines.length
    ? await framer.agent.applyChanges(lines.join(NL), { pagePath: "/404" })
    : { message: "noop" }

const ser2 = await framer.agent.serialize({ id: p404.id, depth: 2 }, {})
const after = {}
for (const bp of ser2.children || []) {
    after[bp.name] = (bp.children || []).map((c) => c.name)
}
return { deleted: uniq, result, after }
