const pages = await framer.agent.getNodesOfTypes(
    { types: ["WebPageNode"] },
    { pagePath: "/" }
)
console.log("pages", JSON.stringify(pages, null, 2).slice(0, 2000))

const desk = await framer.agent.serialize(
    { id: "WQLkyLRf1", depth: 2 },
    { pagePath: "/" }
)
console.log("desk", JSON.stringify(desk, null, 2).slice(0, 4000))

const files = await framer.getCodeFiles()
console.log(
    "files",
    files.map((f) => ({ name: f.name, id: f.id }))
)

try {
    const pub = await framer.getPublishInfo()
    console.log("publish", JSON.stringify(pub).slice(0, 800))
} catch (e) {
    console.log("publish_err", String(e).slice(0, 400))
}
