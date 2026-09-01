const fs = require("fs")
const dir = "/Users/noel/Desktop/Framer/.tmp/halden-shots"
fs.mkdirSync(dir, { recursive: true })

const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(`Wrong project: ${info.name}`)

const shots = await framer.agent.readProject([
    { type: "screenshot", id: "BjqrvIntT" },
    { type: "screenshot", id: "nyI5jW7lA" },
])

const results = shots.results || shots
const meta = []
for (const [i, r] of (Array.isArray(results) ? results : []).entries()) {
    const img = r?.image || r?.screenshot || r?.data || r
    const keys = img && typeof img === "object" ? Object.keys(img) : []
    let saved = null
    const b64 = img?.base64 || img?.data || (typeof img === "string" ? img : null)
    const url = img?.url || r?.url
    if (typeof b64 === "string" && b64.length > 80) {
        const raw = b64.replace(/^data:image\/\w+;base64,/, "")
        saved = `${dir}/${i === 0 ? "tablet" : "phone"}.png`
        fs.writeFileSync(saved, Buffer.from(raw, "base64"))
    }
    meta.push({
        i,
        status: r?.status,
        keys: Object.keys(r || {}),
        imgKeys: keys,
        url,
        saved,
        bytes: saved ? fs.statSync(saved).size : 0,
    })
}
console.log(JSON.stringify({ project: info.name, meta }, null, 2))
