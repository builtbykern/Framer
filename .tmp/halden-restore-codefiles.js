const fs = require("fs")
const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(`Wrong project: ${info.name}`)

const MINIMAL = `import { addPropertyControls, ControlType } from "framer"

/**
 * @framerSupportedLayoutWidth any-prefer-fixed
 * @framerSupportedLayoutHeight any-prefer-fixed
 */
export default function Drift_Plane(props) {
    return (
        <div style={{ position: "relative", width: "100%", height: "100%" }}>
            {props.children}
        </div>
    )
}

Drift_Plane.defaultProps = {}

addPropertyControls(Drift_Plane, {})
`

async function upsert(name, code) {
    const files = await framer.getCodeFiles()
    const existing = (files || []).find(
        (f) => f.name === name || f.id === (name === "Drift_Plane.tsx" ? "Og5966a" : "jeA2cvO")
    )
    if (existing) {
        const updated = await existing.setFileContent(code)
        const typeErrors = await updated.typecheck({ strict: true })
        return {
            action: "update",
            id: updated.id,
            name: updated.name,
            exports: (updated.exports || []).map((e) => ({ id: e.id, name: e.name, type: e.type })),
            typeErrors,
            bytes: code.length,
        }
    }
    try {
        const created = await framer.createCodeFile(name, code)
        const typeErrors = await created.typecheck({ strict: true })
        return {
            action: "create",
            id: created.id,
            name: created.name,
            exports: (created.exports || []).map((e) => ({ id: e.id, name: e.name, type: e.type })),
            typeErrors,
            bytes: code.length,
        }
    } catch (e) {
        return { action: "create-failed", name, error: String(e) }
    }
}

const driftCode = fs.readFileSync(
    "/Users/noel/Desktop/Framer/.tmp/halden-src/Drift_Plane.tsx",
    "utf8"
)
const stillsCode = fs.readFileSync(
    "/Users/noel/Desktop/Framer/.tmp/halden-src/Series_Stills.tsx",
    "utf8"
)

const probe = await upsert("Halden_Probe.tsx", MINIMAL)
const drift = await upsert("Drift_Plane.tsx", driftCode)
const stills = await upsert("Series_Stills.tsx", stillsCode)
const after = (await framer.getCodeFiles()).map((f) => ({
    id: f.id,
    name: f.name,
    bytes: typeof f.content === "string" ? f.content.length : 0,
}))

console.log(JSON.stringify({ project: info.name, probe, drift, stills, after }, null, 2))
