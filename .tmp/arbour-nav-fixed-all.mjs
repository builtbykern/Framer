/**
 * Force Nav fixed on every page / breakpoint.
 * Fixed rejects 1fr — use width 100%, top 0, left 0, zIndex 10.
 */
const NL = String.fromCharCode(10)
const pages = await framer.getNodesWithType("WebPageNode")
const jobs = []

for (const p of pages || []) {
    if (!p.path || p.path === "/404") continue
    const ser = await framer.agent.serialize({ id: p.id, depth: 4 }, {})
    for (const bp of ser.children || []) {
        function walk(n) {
            if (!n) return
            if (n.name === "Nav" && n.type === "ComponentInstanceNode") {
                jobs.push({
                    path: p.path,
                    bp: bp.name,
                    id: n.id,
                    from: {
                        pos: n.attributes?.position,
                        w: n.attributes?.width,
                        z: n.attributes?.zIndex,
                    },
                })
            }
            for (const c of n.children || []) walk(c)
        }
        walk(bp)
    }
}

const byId = new Map()
for (const j of jobs) byId.set(j.id, j)
const unique = [...byId.values()]

const lines = unique.map(
    (j) =>
        `SET ${j.id} position="fixed" positionStickyTop=null top="0px" left="0px" right="null" width="100%" height="auto" zIndex="10";`,
)

const result = await framer.agent.applyChanges(lines.join(NL), {})
return {
    n: unique.length,
    sample: unique,
    result,
}
