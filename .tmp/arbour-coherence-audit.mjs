/**
 * Arbour coherence audit (skip TerritoryRail internals).
 * Shell FX matrix, dark-on-dark text risk, cards, 404, link samples.
 */
const fs = require("fs")
const pages = await framer.getNodesWithType("WebPageNode")

const SHELL = [
    "Arbour_LoadingScreen",
    "Arbour_SmoothScroll",
    "Atmosphere",
    "Arbour_NoiseEffect",
    "Arbour_ProgressiveBlur",
    "Arbour_ScrollCue",
    "Nav",
    "Footer",
]

const GOLD_ORDER = [
    "Arbour_LoadingScreen",
    "Arbour_SmoothScroll",
    "Atmosphere",
    "Nav",
]

const shellMatrix = []
const darkTextRisk = []
const cards = []
const page404 = null
const linkHits = []

const DARK_FILL =
    /425191b0|fa6ec05f|9d3d6ca5|rgb\(\s*21\s*,\s*43\s*,\s*30|rgb\(\s*10\s*,\s*22|Racing|Parchment/i

function isShellish(name, display) {
    const s = `${name || ""} ${display || ""}`
    return SHELL.some((x) => s.includes(x) || name === x)
}

function shellKey(n) {
    const name = n.name || ""
    const display = n.attributes?.$componentDisplayName || ""
    if (name === "Nav" || display === "Nav") return "Nav"
    if (name === "Footer" || display === "Footer") return "Footer"
    if (name === "Atmosphere") return "Atmosphere"
    if (/LoadingScreen/i.test(name + display)) return "Arbour_LoadingScreen"
    if (/SmoothScroll/i.test(name + display)) return "Arbour_SmoothScroll"
    if (/NoiseEffect/i.test(name + display)) return "Arbour_NoiseEffect"
    if (/ProgressiveBlur/i.test(name + display)) return "Arbour_ProgressiveBlur"
    if (/ScrollCue/i.test(name + display)) return "Arbour_ScrollCue"
    return null
}

for (const p of pages || []) {
    if (!p.path) continue
    const ser = await framer.agent.serialize({ id: p.id, depth: 8 }, {})

    for (const bp of ser.children || []) {
        const tops = (bp.children || []).map((c, i) => ({
            i,
            id: c.id,
            name: c.name,
            key: shellKey(c),
            pos: c.attributes?.position,
            z: c.attributes?.zIndex,
        }))
        const present = {}
        for (const k of SHELL) present[k] = false
        const orderKeys = []
        for (const t of tops) {
            if (t.key) {
                present[t.key] = true
                orderKeys.push(t.key)
            }
        }
        // also deep-scan for ProgressiveBlur/Noise/ScrollCue not only tops
        function deepShell(n) {
            if (!n) return
            const k = shellKey(n)
            if (k) present[k] = true
            for (const c of n.children || []) deepShell(c)
        }
        deepShell(bp)

        const goldIdx = GOLD_ORDER.map((g) => orderKeys.indexOf(g)).filter((x) => x >= 0)
        let orderOk = true
        for (let i = 1; i < goldIdx.length; i++) {
            if (goldIdx[i] < goldIdx[i - 1]) orderOk = false
        }

        shellMatrix.push({
            path: p.path,
            bp: bp.name,
            present,
            topOrder: tops.filter((t) => t.key).map((t) => t.key),
            orderOk,
        })

        // dark text: Body/Meta preset with Ink on dark parent fill
        function walkText(n, ancestors) {
            if (!n) return
            const a = n.attributes || {}
            const fill = a.backgroundColor || a.fill || ""
            const nextAnc = fill ? ancestors.concat([{ id: n.id, name: n.name, fill }]) : ancestors
            if (n.type === "RichTextNode" || n.type === "TextNode") {
                const preset = a.textStylePreset || ""
                const color = String(a.textColor || "")
                const onDark = nextAnc.some((x) => DARK_FILL.test(String(x.fill)))
                const looksInk =
                    /e2f9a9eb|Ink|rgb\(\s*28\s*,\s*27\s*,\s*22/i.test(color) ||
                    (!color && /Body|Meta|Tags|Heading|Display|Subhead|Price/.test(preset))
                // Body/Meta default Ink — risk if no explicit light color
                if (
                    onDark &&
                    /Body|Meta|Tags|Heading|Subhead|Display|Price/.test(preset) &&
                    !/d5b3c09d|Paper|252,\s*250,\s*244|255,\s*255,\s*255|f4f4f4/i.test(color)
                ) {
                    darkTextRisk.push({
                        path: p.path,
                        bp: bp.name,
                        id: n.id,
                        name: n.name,
                        preset,
                        color: color || "(preset default)",
                        darkParent: nextAnc.filter((x) => DARK_FILL.test(String(x.fill))).slice(-1)[0],
                    })
                }
            }
            // cards
            const display = a.$componentDisplayName || ""
            if (
                /PropertyCard|ArticleCard|TerritoryCard|TerritoryHover|Journal Card|Property Card/i.test(
                    `${n.name || ""} ${display}`,
                ) ||
                /PropertyCard|ArticleCard|Territory/i.test(n.component || "")
            ) {
                cards.push({
                    path: p.path,
                    bp: bp.name,
                    id: n.id,
                    name: n.name,
                    display,
                    component: n.component || a.componentId,
                    controls: Object.fromEntries(
                        Object.entries(a)
                            .filter(([k, v]) => k.startsWith("$control") && typeof v === "string")
                            .slice(0, 20),
                    ),
                })
            }
            // links sample
            if (a.link?.href || (typeof a.link === "string" && a.link)) {
                const href = a.link?.href || a.link
                if (/mailto:|arbour|properties|notes|contact|neighbour/i.test(String(href))) {
                    linkHits.push({ path: p.path, bp: bp.name, name: n.name, href })
                }
            }
            for (const c of n.children || []) walkText(c, nextAnc)
        }
        walkText(bp, [])
    }
}

const out = {
    collectedAt: new Date().toISOString(),
    shellMatrix,
    darkTextRisk: darkTextRisk.slice(0, 80),
    darkTextCount: darkTextRisk.length,
    cards: cards.filter((c) => c.bp === "Desktop"),
    linksSample: linkHits.filter((l) => l.bp === "Desktop").slice(0, 40),
    paths: [...new Set((pages || []).map((p) => p.path))],
}

fs.writeFileSync(
    "/Users/noel/Desktop/Framer/.tmp/arbour-coherence-audit.json",
    JSON.stringify(out, null, 2),
)

// Summaries
const shellGaps = shellMatrix.filter((r) => r.bp === "Desktop")
console.log(
    JSON.stringify(
        {
            out: ".tmp/arbour-coherence-audit.json",
            shellDesktop: shellGaps.map((r) => ({
                path: r.path,
                present: r.present,
                topOrder: r.topOrder,
                orderOk: r.orderOk,
            })),
            darkTextCount: darkTextRisk.length,
            darkSample: darkTextRisk.slice(0, 15),
            cardNames: [...new Set(cards.filter((c) => c.bp === "Desktop").map((c) => c.name + "|" + c.display))],
            has404: (pages || []).some((p) => p.path === "/404"),
        },
        null,
        2,
    ),
)
