const NL = String.fromCharCode(10)
const pages = await framer.getNodesWithType("WebPageNode")
const p404 = pages.find((p) => p.path === "/404")
const ser = await framer.agent.serialize({ id: p404.id, depth: 3 }, {})
const lines = []
const report = []

for (const bp of ser.children || []) {
    report.push({ bp: bp.name, id: bp.id, kids: [] })
    for (const c of bp.children || []) {
        const variant = c.attributes?.["$control__variant"]
        report[report.length - 1].kids.push({
            name: c.name,
            id: c.id,
            variant,
            pos: c.attributes?.position,
        })
        if (c.name === "Nav") {
            const want =
                bp.name === "Phone"
                    ? "Phone - Close"
                    : bp.name === "Tablet"
                      ? "Tablet - Close"
                      : "Desktop"
            if (variant !== want) {
                lines.push(`SET ${c.id} $control__variant="${want}";`)
            }
        }
        if (c.name === "Footer") {
            const want =
                bp.name === "Phone" ? "Phone" : bp.name === "Tablet" ? "Tablet" : "Desktop"
            if (variant !== want) {
                lines.push(`SET ${c.id} $control__variant="${want}";`)
            }
        }
    }
}

let result = { message: "noop" }
if (lines.length) result = await framer.agent.applyChanges(lines.join(NL), {})
return { report, lines, result }
