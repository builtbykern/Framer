/**
 * Finish palette: link code-component color controls + remaining overlays.
 * Create Racing Wash 60 if not exists for rgba(10,22,15,0.6).
 */
const NL = String.fromCharCode(10)

const T = {
    Paper: "d5b3c09d-0364-4ed0-8804-e56957faa275",
    "Paper 72": "1dfffd49-52d9-48d0-9ba9-c92684e4378c",
    Chartreuse: "db86917b-d19e-4fd7-8dc5-e260f1f35cb1",
    "Racing Deep": "9d3d6ca5-f3ad-4d88-afc8-fc5bce03bd04",
    "Cream On Dark": "537bd017-a079-4a2b-9afa-25208d628840",
    "Racing Deep 60": "612aec4a-d13e-4b68-b16f-3fed40b13658",
    "Cream 28": "7d3beae8-d687-4ee4-8ac3-07bca7a55e2e",
    "Cream 16": "486f59ec-3e6b-474c-87fc-47347f1491f9",
}
const tok = (id) => `var(--token-${id})`

// Ensure Racing Wash for 10,22,15 overlays (slightly cooler than Racing Deep)
let wash = (await framer.getColorStyles()).find((s) => s.name === "Racing Wash 60")
if (!wash) {
    wash = await framer.createColorStyle({
        name: "Arbour/Racing Wash 60",
        light: "rgba(10, 22, 15, 0.6)",
        dark: "rgba(10, 22, 15, 0.6)",
    })
}
T["Racing Wash 60"] = wash.id

const lines = []

// ScrollCue instances — find all
const pages = await framer.getNodesWithType("WebPageNode")
const cueFixes = []
const edFixes = []
const railFixes = []
const overlayFixes = []

for (const p of pages || []) {
    if (!p.path) continue
    const ser = await framer.agent.serialize({ id: p.id, depth: 5 }, {})
    for (const bp of ser.children || []) {
        function walk(n) {
            if (!n) return
            const name = n.name || ""
            const a = n.attributes || {}
            if (name === "Arbour_ScrollCue") {
                lines.push(
                    `SET ${n.id} \$control__textColor="${tok(T["Paper 72"])}";`,
                )
                lines.push(
                    `SET ${n.id} \$control__labelColor="${tok(T.Paper)}";`,
                )
                lines.push(
                    `SET ${n.id} \$control__accentColor="${tok(T.Chartreuse)}";`,
                )
                cueFixes.push(n.id)
            }
            if (name === "Arbour_EditorialReveal") {
                lines.push(
                    `SET ${n.id} \$control__kickerColor="${tok(T.Chartreuse)}";`,
                )
                lines.push(
                    `SET ${n.id} \$control__inkColor="${tok(T["Cream On Dark"])}";`,
                )
                lines.push(
                    `SET ${n.id} \$control__inkMutedColor="${tok(T.Chartreuse)}";`,
                )
                edFixes.push(n.id)
            }
            if (name === "Arbour_TerritoryRail") {
                // Prefer instance.setAttributes via API after — collect ids
                railFixes.push(n.id)
            }
            // overlays
            for (const [k, v] of Object.entries(a)) {
                if (typeof v !== "string") continue
                if (/token-/i.test(v)) continue
                if (v.includes("rgba(10, 22, 15, 0.6)") || v.includes("rgba(10,22,15,0.6)")) {
                    lines.push(`SET ${n.id} ${k}="${tok(T["Racing Wash 60"])}";`)
                    overlayFixes.push(`${n.id}:${k}`)
                }
                if (v.includes("rgba(242, 237, 231, 0.28)")) {
                    lines.push(`SET ${n.id} ${k}="${tok(T["Cream 28"])}";`)
                    overlayFixes.push(`${n.id}:${k}`)
                }
                if (v.includes("rgba(242, 237, 231, 0.16)")) {
                    lines.push(`SET ${n.id} ${k}="${tok(T["Cream 16"])}";`)
                    overlayFixes.push(`${n.id}:${k}`)
                }
            }
            for (const c of n.children || []) walk(c)
        }
        walk(bp)
    }
}

// TerritoryRail colors object — set via node API on primaries only
const railPrimary = [...new Set(railFixes.filter((id) => !/^[A-Z]{2}/.test(id) || id.length < 20))]
// Better: only Desktop-looking ids without replica prefixes — use getNode
const railDone = []
for (const id of railFixes) {
    const n = await framer.getNode(id)
    if (!n || n.originalId) continue // skip replicas if originalId set
    // Only set primary: originalId null
    if (n.originalId) continue
    const colors = {
        ...(n.controls?.colors || {}),
        titleColor: tok(T.Paper),
        metaColor: tok(T["Paper 72"]),
        accentColor: tok(T.Chartreuse),
        stageBackground: tok(T["Racing Deep"]),
        scrimColor: tok(T["Racing Deep 60"]),
    }
    // Framer component instance controls update
    if (typeof n.setAttributes === "function") {
        await n.setAttributes({ controls: { colors } })
        railDone.push(id)
    } else if (typeof framer.setAttributes === "function") {
        await framer.setAttributes(id, { controls: { colors } })
        railDone.push(id)
    }
}

const result = await framer.agent.applyChanges(lines.join(NL), {})

// Verify ScrollCue
const cue = await framer.getNode("Ztf5as0HE")
const rail = await framer.getNode("CDv8aL5JZ")

return {
    washId: wash.id,
    cueFixes: cueFixes.length,
    edFixes: edFixes.length,
    overlayFixes: overlayFixes.length,
    railDone,
    lineCount: lines.length,
    result: result?.message,
    cueCheck: {
        textColor: cue?.controls?.textColor,
        labelColor: cue?.controls?.labelColor,
        accentColor: cue?.controls?.accentColor,
    },
    railCheck: rail?.controls?.colors,
}
