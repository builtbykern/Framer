const files = await framer.getCodeFiles()
console.log(
    "code",
    files.map((f) => `${f.name} ${f.id ?? ""}`).join(" | ")
)

let pub = null
try {
    pub = await framer.getPublishInfo()
} catch (e) {
    pub = String(e).slice(0, 200)
}
console.log("publish", JSON.stringify(pub).slice(0, 800))

const pages = await framer.getNodesWithType("WebPageNode")
console.log(
    "pages",
    pages
        .map((p) => `${p.id} ${p.name} ${p.path ?? p.attributes?.path ?? ""}`)
        .join("\n")
)

const glass = files.find((f) => f.name === "BuiltByKern_GlassType.tsx")
if (glass) {
    const errors = await glass.typecheck()
    console.log("typecheck", JSON.stringify(errors).slice(0, 2000))
}

const home = await framer.agent.serialize(
    { id: "WQLkyLRf1", depth: 2 },
    { pagePath: "/" }
)
function walk(n, acc) {
    if (!n) return acc
    acc.push({
        id: n.id,
        name: n.name,
        type: n.type,
        w: n.attributes?.width,
        h: n.attributes?.height,
    })
    for (const c of n.children || []) walk(c, acc)
    return acc
}
console.log("home layers", walk(home, []).map((n) => `${n.type} ${n.name} ${n.id}`).join("\n"))

const inst = await framer.agent.serialize(
    { id: "SpJLywBKC", depth: 0 },
    { pagePath: "/" }
)
console.log(
    "instance",
    JSON.stringify({
        name: inst.name,
        font: inst.attributes?.["$control__font"],
        content: inst.attributes?.["$control__content"],
        look: inst.attributes?.["$control__look"],
        layout: inst.attributes?.["$control__layout"],
        motion: inst.attributes?.["$control__motion"],
        w: inst.attributes?.width,
        h: inst.attributes?.height,
    }).slice(0, 2500)
)
