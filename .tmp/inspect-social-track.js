const info = await framer.getProjectInfo()
console.log("info", JSON.stringify(info, null, 2).slice(0, 1500))

const files = await framer.getCodeFiles()
console.log(
    "files",
    files.map((f) => f.name)
)

const nodes = await framer.agent.getNodesOfTypes(
    { types: ["WebPageNode", "FrameNode", "ComponentInstanceNode"] },
    { pagePath: "/" }
)
console.log("nodes", JSON.stringify(nodes, null, 2).slice(0, 8000))
