/**
 * b) DEL dead Noise inside Enquiry CTA (primary ids only)
 * c) Add Atmosphere Noise on Home + Notes listing (Desktop → replicas inherit)
 */
const INSERT =
    "https://framer.com/m/Arbour-NoiseEffect-RdBoJz.js@VFl8dDtXvv40qMRmnqMb"

const DEAD_PRIMARY = [
    "V_m88mojx", // /properties Enquiry
    "NBHyWELQz", // /about Enquiry
    "smtYX2w5u", // /properties/:slug Enquiry
]

const notes = []

await framer.removeNodes(DEAD_PRIMARY)
notes.push(`removed dead Enquiry Noise: ${DEAD_PRIMARY.join(", ")}`)

const noiseAttrs = {
    name: "Arbour_NoiseEffect",
    opacity: 0.04,
    locked: true,
    position: "absolute",
    top: "0px",
    left: "0px",
    width: "100%",
    height: "100%",
    pointerEvents: "none",
    controls: {
        grainOpacity: 0.05,
        animate: true,
        patternSize: 280,
        patternScaleX: 1,
        patternScaleY: 1,
        patternRefreshInterval: 4,
        blendMode: "soft-light",
    },
}

const pages = await framer.getNodesWithType("WebPageNode")

async function addNoiseToAtmosphere(path, atmDesktopId) {
    const created = await framer.addComponentInstance({
        url: INSERT,
        parentId: atmDesktopId,
        attributes: noiseAttrs,
    })
    // Ensure first among Atmosphere children (before ProgressiveBlur)
    if (created?.id) {
        await framer.setParent(created.id, atmDesktopId, 0)
    }
    notes.push(`${path}: added Noise ${created?.id} → Atmosphere ${atmDesktopId}`)
    return created
}

await addNoiseToAtmosphere("/", "NFy40_8W1")
await addNoiseToAtmosphere("/notes", "v0hRg6_73")

// Verify
const verify = {}
for (const path of ["/", "/notes", "/properties", "/about", "/properties/:slug"]) {
    const p = pages.find((x) => x.path === path)
    const ser = await framer.agent.serialize({ id: p.id, depth: 5 }, {})
    const noises = []
    for (const bp of ser.children || []) {
        function walk(n, chain) {
            if (!n) return
            if ((n.name || "") === "Arbour_NoiseEffect") {
                noises.push({
                    bp: bp.name,
                    id: n.id,
                    chain: chain.slice(-3).join(">"),
                    h: n.attributes?.height,
                    opacity: n.attributes?.opacity,
                })
            }
            for (const c of n.children || []) walk(c, chain.concat([n.name]))
        }
        walk(bp, [])
    }
    verify[path] = noises
}

return { notes, verify }
