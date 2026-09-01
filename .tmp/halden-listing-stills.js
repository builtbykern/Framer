const fs = require("fs")
const path = require("path")

const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(info.name)

let publish = null
try {
    publish = await framer.getPublishInfo()
} catch (e) {
    publish = { error: String(e?.message || e) }
}

let changed = null
try {
    changed = await framer.getChangedPaths()
} catch (e) {
    changed = { error: String(e?.message || e) }
}

const outDir = "/Users/noel/Desktop/Framer/docs/projects/halden/media/stills"
fs.mkdirSync(outDir, { recursive: true })

await framer.agent.applyChanges(
    'SET Yptm4PAEu $control__variant="closed" $control__menuOpen="false";',
    { pagePath: "/" }
)

const closed = [
    { id: "WQLkyLRf1", file: "d-home-plane.png", pagePath: "/" },
    { id: "BjqrvIntT", file: "t-home.png", pagePath: "/" },
    { id: "nyI5jW7lA", file: "m-home.png", pagePath: "/" },
    { id: "rtJNTCNFr", file: "d-detail.png", pagePath: "/work/:Work" },
    { id: "Tf2mbU7Bv", file: "m-detail.png", pagePath: "/work/:Work" },
    { id: "nACIEuvcP", file: "d-404.png", pagePath: "/404" },
]

const bytes = {}
for (const s of closed) {
    const r = await framer.screenshot(s.id, { format: "png", scale: 1 })
    fs.writeFileSync(path.join(outDir, s.file), r.data)
    bytes[s.file] = r.data.length
}

await framer.agent.applyChanges(
    'SET Yptm4PAEu $control__variant="open" $control__menuOpen="true";',
    { pagePath: "/" }
)
const nav = await framer.screenshot("WQLkyLRf1", { format: "png", scale: 1 })
fs.writeFileSync(path.join(outDir, "d-nav-open.png"), nav.data)
bytes["d-nav-open.png"] = nav.data.length

await framer.agent.applyChanges(
    'SET Yptm4PAEu $control__variant="closed" $control__menuOpen="false";',
    { pagePath: "/" }
)

function slimPublish(p) {
    if (!p || p.error) return p
    return {
        production: p.production
            ? {
                  url: p.production.url,
                  updatedAt: p.production.updatedAt,
                  status: p.production.status,
              }
            : null,
        staging: p.staging
            ? {
                  url: p.staging.url,
                  updatedAt: p.staging.updatedAt,
                  status: p.staging.status,
              }
            : null,
    }
}

console.log(
    JSON.stringify(
        {
            project: info.name,
            publish: slimPublish(publish),
            changed,
            bytes,
        },
        null,
        2
    )
)
