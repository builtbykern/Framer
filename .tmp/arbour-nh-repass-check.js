const res = await framer.agent.reviewChanges()
console.log(JSON.stringify({ errors: res?.errors, warnings: res?.warnings?.slice?.(0, 20) ?? res?.warnings }, null, 2))

const dossier = await framer.agent.serialize({ id: "QAa2V2fag", depth: 1 }, {})
console.log("---DOSSIER---")
console.log(JSON.stringify(dossier.attributes, null, 2))

// Try clearing border via empty / none style if still visible
const dsl = `SET QAa2V2fag border="none"; SET aJLpuUP0qQAa2V2fag border="none"; SET Qonafp_oDQAa2V2fag border="none"`
const apply = await framer.agent.applyChanges(dsl, { pagePath: "/neighbourhoods" })
const after = await framer.agent.serialize({ id: "QAa2V2fag", depth: 1 }, {})
console.log("---AFTER BORDER NONE---")
console.log(JSON.stringify({ message: apply?.message, errors: apply?.errors, border: after.attributes?.border }, null, 2))
