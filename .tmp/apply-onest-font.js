const variants = [
    () =>
        framer.agent.applyChanges(
            'SET SpJLywBKC $control__font={"fontSelector":"GF;Onest-regular"}'
        ),
    () =>
        framer.agent.applyChanges(
            'SET SpJLywBKC font={"fontSelector":"GF;Onest-regular"}'
        ),
]
for (const [i, fn] of variants.entries()) {
    try {
        const r = await fn()
        console.log("ok", i, JSON.stringify(r).slice(0, 300))
    } catch (e) {
        console.log("fail", i, String(e).slice(0, 400))
    }
}
const node = await framer.agent.serialize(
    { id: "SpJLywBKC", depth: 0 },
    { pagePath: "/" }
)
console.log("font", JSON.stringify(node.attributes?.["$control__font"]).slice(0, 400))
