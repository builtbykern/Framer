/**
 * Collect section-level paddings across all pages and breakpoints.
 */
const fs = require("fs")
const pages = await framer.getNodesWithType("WebPageNode")
const rows = []

function isSectionish(n, depth) {
    if (!n || n.type !== "FrameNode") return false
    const name = n.name || ""
    if (!name || name === "Atmosphere" || name === "Desktop" || name === "Tablet" || name === "Phone")
        return false
    if (depth <= 2) return true
    return /section|hero|journal|portfolio|territor|bottom|recognition|testimonial|contact|chapter|beat|enquiry|gallery|particular|setting|manifesto|opening|pause|process|content|wrap|band|grid|cta|footer container/i.test(
        name,
    )
}

for (const p of pages || []) {
    if (!p.path || p.path === "/404") continue
    const ser = await framer.agent.serialize({ id: p.id, depth: 6 }, {})
    for (const bp of ser.children || []) {
        const bpName = bp.name
        function walk(n, depth) {
            if (!n || depth > 5) return
            if (isSectionish(n, depth)) {
                const pad = n.attributes?.padding || null
                if (pad) {
                    rows.push({
                        path: p.path,
                        bp: bpName,
                        id: n.id,
                        name: n.name,
                        depth,
                        padding: pad,
                        maxWidth: n.attributes?.maxWidth || null,
                        gap: n.attributes?.gap || null,
                    })
                }
            }
            for (const c of n.children || []) walk(c, depth + 1)
        }
        walk(bp, 0)
    }
}

fs.writeFileSync(
    "/Users/noel/Desktop/Framer/.tmp/arbour-padding-inventory.json",
    JSON.stringify({ collectedAt: new Date().toISOString(), rows }, null, 2),
)

// frequency by bp
const freq = {}
for (const r of rows) {
    const k = r.bp + "|" + r.padding
    freq[k] = (freq[k] || 0) + 1
}
const sorted = Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 40)

console.log(
    JSON.stringify(
        {
            count: rows.length,
            topPads: sorted,
            out: ".tmp/arbour-padding-inventory.json",
        },
        null,
        2,
    ),
)
