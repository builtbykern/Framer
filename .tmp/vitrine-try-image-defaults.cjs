await framer.agent.serializeNodes({ ids: ["OdvHkNWXz"], depth: 0 })

const attempts = []

const cmds = [
    ['no-page', 'SET DxQm6fx1v initialValue="https://framerusercontent.com/images/erzXiD8x0aw5x8FISGgfLPOG4oQ.jpg";', undefined],
    ['src', 'SET DxQm6fx1v initialValue.src="https://framerusercontent.com/images/erzXiD8x0aw5x8FISGgfLPOG4oQ.jpg";', "/"],
    ['with-title', 'SET NoEH4ZcYo initialValue="Dish Two"; SET DxQm6fx1v initialValue="https://framerusercontent.com/images/erzXiD8x0aw5x8FISGgfLPOG4oQ.jpg";', "/"],
]

for (const [label, dsl, pagePath] of cmds) {
    const opts = pagePath === undefined ? undefined : { pagePath }
    const r = await framer.agent.applyChanges(dsl, opts)
    attempts.push({
        label,
        message: r.message,
        errors: r.linter?.errors,
        warnings: r.linter?.warnings,
    })
}

const card = await framer.agent.serializeNodes({ ids: ["OdvHkNWXz", "QYwZhiOCq"], depth: 0 })
const vars = (card.find((n) => n.id === "OdvHkNWXz")?.variables || [])
    .filter((v) => v.type === "image")
    .map((v) => ({ id: v.id, name: v.name, initialValue: v.initialValue }))
const cover = card.find((n) => n.id === "QYwZhiOCq")?.attributes?.fill

console.log(JSON.stringify({ attempts, vars, cover }, null, 2))
