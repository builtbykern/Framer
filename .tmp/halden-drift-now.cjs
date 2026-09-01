const fs = require("fs")
const path = require("path")
const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(info.name)

const dir = "/Users/noel/Desktop/Framer/.tmp/halden-shots"
fs.mkdirSync(dir, { recursive: true })

const desktop = await framer.agent.getNode({ id: "augiA20IlRV7bjlgdh" }, { pagePath: "/" })
const da = desktop?.attributes || {}
const out = {
    driftInstance: {
        view: da["$control__view"],
        w: da.width,
        h: da.height,
        workList: da["$control__workList"],
    },
}

const r = await framer.screenshot("augiA20Il", { format: "png", scale: 1 })
fs.writeFileSync(path.join(dir, "drift-now.png"), r.data)
out.driftShot = r.data.length

try {
    const vekter = await framer.agent.readProject(
        [{ type: "screenshot", id: "augiA20Il" }],
        { pagePath: "/" }
    )
    out.vekter = vekter
} catch (e) {
    out.vekter = String(e)
}

console.log(JSON.stringify(out, null, 2))
