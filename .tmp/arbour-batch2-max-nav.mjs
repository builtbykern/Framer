const NL = String.fromCharCode(10)
const pages = await framer.getNodesWithType("WebPageNode")
const byPath = {}
for (const p of pages || []) if (p.path) byPath[p.path] = p

async function apply(label, lines, pagePath) {
    if (!lines.length) return { label, skipped: true }
    try {
        const r = await framer.agent.applyChanges(lines.join(NL), pagePath ? { pagePath } : {})
        return { label, ok: true, errors: r.errors || [] }
    } catch (e) {
        return { label, ok: false, err: String(e.message || e) }
    }
}

const results = []
const maxJobs = []

for (const path of [
    "/",
    "/about",
    "/contact",
    "/neighbourhoods",
    "/properties",
    "/notes",
    "/properties/:slug",
    "/notes/:slug",
]) {
    const page = byPath[path]
    if (!page) continue
    const ser = await framer.agent.serialize({ id: page.id, depth: 6 }, {})
    function walk(n) {
        if (!n) return
        const mw = n.attributes?.maxWidth
        const name = n.name || ""
        if (mw === "1440px" && !/Beat 2|Cinematic Image/i.test(name) && n.id) {
            maxJobs.push({ path, id: n.id, name, from: mw })
        }
        if (mw === "1104px" && n.id) maxJobs.push({ path, id: n.id, name, from: mw })
        for (const c of n.children || []) walk(c)
    }
    walk(ser)
}

results.push({ maxJobs: maxJobs.map((j) => ({ path: j.path, name: j.name, from: j.from })) })

const withPath = maxJobs.filter((j) => !j.path.includes(":"))
const noPath = maxJobs.filter((j) => j.path.includes(":"))
const groups = {}
for (const j of withPath) (groups[j.path] = groups[j.path] || []).push(j)
for (const [path, jobs] of Object.entries(groups)) {
    results.push(
        await apply(
            "max-" + path,
            jobs.map((j) => `SET ${j.id} maxWidth="1200px";`),
            path,
        ),
    )
}
if (noPath.length) {
    results.push(
        await apply(
            "max-details",
            noPath.map((j) => `SET ${j.id} maxWidth="1200px";`),
            null,
        ),
    )
}

// Nav 1fr
for (const path of Object.keys(byPath)) {
    if (path === "/404") continue
    const ser = await framer.agent.serialize({ id: byPath[path].id, depth: 3 }, {})
    const lines = []
    function walk(n) {
        if (!n) return
        const isNav =
            n.type === "ComponentInstanceNode" &&
            (n.name === "Nav" ||
                n.component === "ynpqYJGOd" ||
                n.$componentDisplayName === "Nav")
        if (isNav && n.id && n.attributes?.width !== "1fr") {
            lines.push(`SET ${n.id} width="1fr";`)
        }
        for (const c of n.children || []) walk(c)
    }
    walk(ser)
    if (lines.length) {
        results.push({
            navPath: path,
            n: lines.length,
            ...(await apply("nav-" + path, lines, path.includes(":") ? null : path)),
        })
    }
}

console.log(JSON.stringify(results, null, 2))
