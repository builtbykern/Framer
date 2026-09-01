const lint = await framer.agent.applyChanges(
    'SET DxQm6fx1v initialValue="https://framerusercontent.com/images/erzXiD8x0aw5x8FISGgfLPOG4oQ.jpg"; SET MVYFn4kz9 initialValue="https://framerusercontent.com/images/uuqJtsVz2GJQEbive50JAThDsKs.jpg";',
    { pagePath: "/" }
)

const card = await framer.agent.serializeNodes({
    ids: ["OdvHkNWXz"],
    depth: 0,
})

const vars = (card[0]?.variables || [])
    .filter((v) => v.type === "image")
    .map((v) => ({ id: v.id, name: v.name, initialValue: v.initialValue }))

console.log(JSON.stringify({ lint, vars }, null, 2))
