const list = await framer.agent.getNode({ id: "H9TnltXVB" }, { pagePath: "/" })
const a = list?.attributes || {}
const keys = [
    "name",
    "width",
    "height",
    "left",
    "top",
    "position",
    "overflow",
    "visible",
    "layout",
]
const out = { id: list?.id }
for (const k of keys) out[k] = a[k]
for (const k of Object.keys(a)) {
    if (k.startsWith("$") || k.includes("collection")) out[k] = a[k]
}
console.log(JSON.stringify(out, null, 2))
