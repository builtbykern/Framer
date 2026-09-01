/**
 * Batch 2b: MOVE shell FX to front; padding; maxWidth; Nav 1fr
 */
const NL = String.fromCharCode(10)
const pages = await framer.getNodesWithType("WebPageNode")
const byPath = {}
for (const p of pages || []) if (p.path) byPath[p.path] = p

async function apply(path, lines, noPath = false) {
    const dsl = lines.filter(Boolean).join(NL)
    try {
        const r = await framer.agent.applyChanges(dsl, noPath ? {} : { pagePath: path })
        return { path, errors: r.errors || [], ok: !r.errors || !Object.keys(r.errors || {}).length }
    } catch (e) {
        return { path, err: String(e.message || e), ok: false }
    }
}

const results = []

// Reorder Loading/Smooth/Atmosphere to start of Desktop
for (const path of ["/", "/notes", "/neighbourhoods"]) {
    const ser = await framer.agent.serialize({ id: byPath[path].id, depth: 2 }, {})
    const desk = (ser.children || []).find((c) => c.name === "Desktop")
    const byName = Object.fromEntries((desk.children || []).map((c) => [c.name, c]))
    const lines = []
    let idx = 0
    for (const n of ["Arbour_LoadingScreen", "Arbour_SmoothScroll", "Atmosphere"]) {
        if (byName[n]) {
            lines.push(`MOVE ${byName[n].id} parent="${desk.id}" index="${idx}";`)
            idx++
        }
    }
    if (lines.length) results.push(await apply(path, lines))
}

// Padding remaps — collect ids by name walk
const padJobs = []

async function findByName(path, name) {
    const ser = await framer.agent.serialize({ id: byPath[path].id, depth: 6 }, {})
    let hit = null
    function walk(n) {
        if (!n || hit) return
        if (n.name === name) hit = n
        for (const c of n.children || []) walk(c)
    }
    walk(ser)
    return hit
}

// Property detail pads
for (const [name, pad] of [
    ["The Setting", "128px 48px 128px 48px"],
    ["Property Particulars", "128px 48px 128px 48px"],
    ["Cinematic Gallery", "0px 48px 128px 48px"],
    ["Property Hero", "128px 48px 128px 48px"],
    ["Chapter Intro", "128px 48px 128px 48px"],
]) {
    const n = await findByName("/properties/:slug", name)
    if (n) padJobs.push({ path: "/properties/:slug", id: n.id, name, pad, noPath: true })
}

// Notes journal
{
    const n = await findByName("/notes", "Journal")
    if (n) padJobs.push({ path: "/notes", id: n.id, name: "Journal", pad: "128px 48px 0px 48px" })
}
// Neighbourhoods — find 124px shell via metrics: Neighbourhoods Hero or content top
{
    const ser = await framer.agent.serialize({ id: byPath["/neighbourhoods"].id, depth: 5 }, {})
    function walk(n) {
        if (!n) return
        const pad = n.attributes?.padding
        if (pad && String(pad).includes("124px")) {
            padJobs.push({
                path: "/neighbourhoods",
                id: n.id,
                name: n.name,
                pad: "128px 48px 128px 48px",
            })
        }
        for (const c of n.children || []) walk(c)
    }
    walk(ser)
}

// Phone notes journal
{
    const ser = await framer.agent.serialize({ id: byPath["/notes"].id, depth: 3 }, {})
    const phone = (ser.children || []).find((c) => c.name === "Phone")
    const journal = (phone?.children || []).find((c) => c.name === "Journal")
    if (journal) {
        padJobs.push({
            path: "/notes",
            id: journal.id,
            name: "Journal Phone",
            pad: "64px 16px 0px 16px",
        })
    }
}

// Apply pads (group by path)
const byP = {}
for (const j of padJobs) {
    const k = j.noPath ? "__nopath__" : j.path
    ;(byP[k] = byP[k] || []).push(j)
}
for (const [k, jobs] of Object.entries(byP)) {
    const lines = jobs.map((j) => `SET ${j.id} padding="${j.pad}";`)
    results.push({
        padJobs: jobs.map((j) => j.name),
        ...(await apply(k === "__nopath__" ? "/properties/:slug" : k, lines, k === "__nopath__")),
    })
}

// maxWidth editorial → 1200; keep Beat 2 at 1440
const maxJobs = []
for (const path of ["/", "/about", "/contact", "/neighbourhoods", "/properties/:slug", "/notes/:slug"]) {
    if (!byPath[path]) continue
    const ser = await framer.agent.serialize({ id: byPath[path].id, depth: 6 }, {})
    function walk(n) {
        if (!n) return
        const mw = n.attributes?.maxWidth
        const name = n.name || ""
        if (mw === "1440px" && !/Beat 2|Cinematic Image/i.test(name)) {
            maxJobs.push({ path, id: n.id, name, from: mw, to: "1200px", noPath: path.includes(":") })
        }
        if (mw === "1104px") {
            maxJobs.push({ path, id: n.id, name, from: mw, to: "1200px", noPath: path.includes(":") })
        }
        for (const c of n.children || []) walk(c)
    }
    walk(ser)
}
results.push({ maxJobsFound: maxJobs.map((j) => ({ path: j.path, name: j.name, from: j.from })) })
{
    const groups = {}
    for (const j of maxJobs) {
        const k = j.noPath ? "__np__" : j.path
        ;(groups[k] = groups[k] || []).push(j)
    }
    for (const [k, jobs] of Object.entries(groups)) {
        const lines = jobs.map((j) => `SET ${j.id} maxWidth="1200px";`)
        results.push(
            await apply(k === "__np__" ? jobs[0].path : k, lines, k === "__np__"),
        )
    }
}

// Nav width 1fr all pages
for (const path of Object.keys(byPath)) {
    if (path === "/404") continue
    const ser = await framer.agent.serialize({ id: byPath[path].id, depth: 3 }, {})
    const lines = []
    function walk(n) {
        if (!n) return
        if (
            n.type === "ComponentInstanceNode" &&
            (n.name === "Nav" || n.component === "ynpqYJGOd" || n.$componentDisplayName === "Nav")
        ) {
            if (n.attributes?.width !== "1fr") {
                lines.push(`SET ${n.id} width="1fr";`)
            }
        }
        for (const c of n.children || []) walk(c)
    }
    walk(ser)
    if (lines.length) {
        results.push({
            nav: path,
            count: lines.length,
            ...(await apply(path, lines, path.includes(":"))),
        })
    }
}

console.log(JSON.stringify(results, null, 2))
