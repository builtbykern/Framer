const NL = String.fromCharCode(10)
const renames = [
    // Home
    ["CLzbrTVVb", "Nav"],
    ["H_KIxioFT", "Process Section"],
    ["CMv32_lLx", "Arbour_StatsBand"],
    // Property detail
    ["W57T5rQpL", "Nav"],
    ["lODMk6Egu", "Property Hero"],
    ["aqUTeKNkU", "Property Specs Band"],
    ["ubrig7P0R", "Chapter Intro"],
    ["CIYq_FTjP", "Footer"],
    // Notes detail
    ["zoiRFt077", "Nav"],
    ["TYvLnLN5L", "Article Hero Meta"],
    ["OE3uHiT52", "Specs Strip"],
    ["VeGntwuIg", "Closing Chapter"],
    ["WsEwAIpxM", "Footer"],
]

const dsl = renames.map(([id, name]) => `SET ${id} name=${JSON.stringify(name)};`).join(NL)
const r = await framer.agent.applyChanges(dsl, {})
console.log(
    JSON.stringify(
        {
            errors: r.errors,
            warnings: r.warnings,
            renamed: renames.length,
            changed: r.changedNodeIds?.length ?? r.renamedIds,
        },
        null,
        2,
    ),
)

// verify unnamed tops
const pages = await framer.getNodesWithType("WebPageNode")
const check = {}
for (const path of ["/", "/properties/:slug", "/notes/:slug"]) {
    const page = pages.find((p) => p.path === path)
    const ser = await framer.agent.serialize({ id: page.id, depth: 2 }, {})
    const desk = (ser.children || []).find((c) => c.name === "Desktop")
    check[path] = (desk?.children || [])
        .filter((c) => !c.name)
        .map((c) => ({ id: c.id, type: c.type }))
}
console.log("remainingUnnamed", JSON.stringify(check))
