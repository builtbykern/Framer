/**
 * Apply BuiltByKern Scroll Blur subtly on all content pages.
 * Create/update local code file, then place instances.
 */
const fs = require("fs")
const NL = String.fromCharCode(10)

const CODE = fs.readFileSync(
    "/Users/noel/Desktop/Framer/code-components/BuiltByKern_ScrollBlur.tsx",
    "utf8",
)

const notes = []

let files = await framer.getCodeFiles()
let scrollFile = files.find((f) => f.name === "BuiltByKern_ScrollBlur.tsx")
if (!scrollFile) {
    scrollFile = await framer.createCodeFile("BuiltByKern_ScrollBlur.tsx", CODE)
    notes.push(`created ${scrollFile.id}`)
} else {
    await scrollFile.setFileContent(CODE)
    notes.push(`updated ${scrollFile.id}`)
}

files = await framer.getCodeFiles()
scrollFile = files.find((f) => f.name === "BuiltByKern_ScrollBlur.tsx")
const insertURL = scrollFile.exports?.[0]?.insertURL
if (!insertURL) throw new Error("missing insertURL")
notes.push(`insert ${insertURL}`)

// Subtle defaults
const SUBTLE = {
    shape: "edge",
    position: "bottom",
    strength: 2,
    mode: "Always On",
    settleMs: 280,
}

const pages = await framer.getNodesWithType("WebPageNode")
const CONTENT = [
    "/",
    "/properties",
    "/neighbourhoods",
    "/notes",
    "/about",
    "/contact",
    "/properties/:slug",
    "/notes/:slug",
]

const created = []
const failed = []

for (const path of CONTENT) {
    const p = pages.find((x) => x.path === path)
    if (!p) {
        failed.push({ path, reason: "missing page" })
        continue
    }
    const ser = await framer.agent.serialize({ id: p.id, depth: 3 }, {})
    const desk = (ser.children || []).find((c) => c.name === "Desktop")
    if (!desk) {
        failed.push({ path, reason: "no desktop" })
        continue
    }

    // Prefer Atmosphere if present; else page Desktop (Home-style fixed)
    const atm = (desk.children || []).find((c) => c.name === "Atmosphere")
    const parentId = atm?.id || desk.id
    const onHome = path === "/"

    const attrs = {
        name: "Scroll Blur",
        opacity: onHome ? 0.55 : 0.4,
        position: onHome ? "fixed" : "absolute",
        width: "100%",
        height: onHome ? "64px" : "100px",
        bottom: "0px",
        left: "0px",
        right: "0px",
        pointerEvents: "none",
        zIndex: onHome ? 3 : undefined,
        controls: { ...SUBTLE },
    }

    try {
        const node = await framer.addComponentInstance({
            url: insertURL,
            parentId,
            attributes: attrs,
        })
        if (!node?.id) {
            failed.push({ path, reason: "null node" })
            continue
        }
        created.push({ path, id: node.id, parentId, onHome })
        notes.push(`+ ${path} ${node.id}`)
    } catch (e) {
        failed.push({ path, reason: String(e).slice(0, 140) })
    }
}

// Pin layout (addComponentInstance sometimes drops fixed/absolute)
const pinLines = []
for (const c of created) {
    if (c.onHome) {
        pinLines.push(
            `SET ${c.id} position="fixed" bottom="0px" left="0px" right="0px" width="100%" height="64px" opacity="0.55" zIndex="3";`,
        )
    } else {
        pinLines.push(
            `SET ${c.id} position="absolute" bottom="0px" left="0px" right="0px" width="100%" height="100px" opacity="0.4";`,
        )
    }
    pinLines.push(
        `SET ${c.id} \$control__shape="edge" \$control__position="bottom" \$control__strength="2" \$control__mode="Always On";`,
    )
}
if (pinLines.length) {
    const r = await framer.agent.applyChanges(pinLines.join(NL), {})
    notes.push(`pin: ${r?.message}`)
}

// Verify matrix
const matrix = []
for (const path of CONTENT) {
    const p = pages.find((x) => x.path === path)
    const ser = await framer.agent.serialize({ id: p.id, depth: 4 }, {})
    const row = { path, bps: {} }
    for (const bp of ser.children || []) {
        let n = 0
        let sample = null
        function walk(node) {
            if (!node) return
            if (/^Scroll Blur$/i.test(node.name || "") || /ScrollBlur/i.test(node.name || "")) {
                n++
                if (bp.name === "Desktop") {
                    const a = node.attributes || {}
                    sample = {
                        id: node.id,
                        pos: a.position,
                        h: a.height,
                        opacity: a.opacity,
                        strength: a["$control__strength"],
                        mode: a["$control__mode"],
                    }
                }
            }
            for (const c of node.children || []) walk(c)
        }
        walk(bp)
        row.bps[bp.name] = n
        if (sample) row.desktop = sample
    }
    matrix.push(row)
}

return { notes, created, failed, matrix }
