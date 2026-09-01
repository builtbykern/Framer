const fs = require("fs")
const path = require("path")
const dir = "/Users/noel/Desktop/Framer/.tmp/halden-shots"
fs.mkdirSync(dir, { recursive: true })

const shots = await framer.agent.readProject(
    [
        { type: "screenshot", id: "nyI5jW7lA" },
        { type: "screenshot", id: "BjqrvIntT" },
        { type: "screenshot", id: "H9TnltXVB" },
        { type: "screenshot", id: "WQLkyLRf1" },
    ],
    { pagePath: "/" }
)

const shotResults = shots.results || shots.queryResults || shots
const shotMeta = []
const list = Array.isArray(shotResults)
    ? shotResults
    : shotResults.results || []
for (const r of list) {
    const keys = Object.keys(r || {})
    let saved = null
    for (const k of ["image", "data", "screenshot", "png", "jpeg"]) {
        if (r && r[k]) {
            const raw = r[k]
            const buf = Buffer.isBuffer(raw)
                ? raw
                : typeof raw === "string"
                  ? Buffer.from(raw.replace(/^data:image\/\w+;base64,/, ""), "base64")
                  : null
            if (buf) {
                const id = r.id || r.nodeId || keys.join("-")
                const file = path.join(dir, `audit-vekter-${id}.png`)
                fs.writeFileSync(file, buf)
                saved = { file, bytes: buf.length, via: k }
            }
        }
    }
    shotMeta.push({ keys, saved, preview: JSON.stringify(r).slice(0, 400) })
}

const serialized = await framer.agent.serializeNodes(
    {
        ids: [
            "augiA20Il",
            "H9TnltXVB",
            "gSGwySyKV",
            "cMyCjMOpL",
            "nyI5jW7lARV7bjlgdh",
            "BjqrvIntTRV7bjlgdh",
            "RV7bjlgdh",
            "nyI5jW7lA",
            "BjqrvIntT",
            "WQLkyLRf1",
        ],
        depth: 3,
        attributeFilter: [
            "name",
            "visible",
            "left",
            "top",
            "width",
            "height",
            "layout",
            "overflow",
            "fill",
            "text",
            "collectionId",
            "filters",
            "sort",
            "$control__workList",
            "$control__view",
            "$control__images",
            "$control__cover",
            "$control__collection",
        ],
    },
    { pagePath: "/" }
)

console.log(
    JSON.stringify(
        {
            shotMeta,
            shotTopKeys: Object.keys(shots),
            serialized,
        },
        null,
        2
    )
)
