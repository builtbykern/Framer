const NL = String.fromCharCode(10)
const pages = await framer.getNodesWithType("WebPageNode")
const p404 = pages.find((p) => p.path === "/404")
const ser = await framer.agent.serialize({ id: p404.id, depth: 3 }, {})
const report = []
const lines = []

for (const bp of ser.children || []) {
    const kids = (bp.children || []).map((c) => ({
        name: c.name,
        id: c.id,
        variant: c.attributes?.["$control__variant"],
    }))
    report.push({ bp: bp.name, kids })
    const nav = (bp.children || []).find((c) => c.name === "Nav")
    const footer = (bp.children || []).find((c) => c.name === "Footer")
    if (nav) {
        const want =
            bp.name === "Phone"
                ? "Phone - Close"
                : bp.name === "Tablet"
                  ? "Tablet - Close"
                  : "Desktop"
        if (nav.attributes?.["$control__variant"] !== want) {
            lines.push(`SET ${nav.id} $control__variant="${want}";`)
        }
    }
    if (footer) {
        const want =
            bp.name === "Phone" ? "Phone" : bp.name === "Tablet" ? "Tablet" : "Desktop"
        if (footer.attributes?.["$control__variant"] !== want) {
            lines.push(`SET ${footer.id} $control__variant="${want}";`)
        }
    }
}

let result = { message: "noop" }
if (lines.length) result = await framer.agent.applyChanges(lines.join(NL), {})
return { report, lines, result }
