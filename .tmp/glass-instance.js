const node = await framer.agent.serialize({ id: "bN4Wnq0cg", depth: 1 }, { pagePath: "/" })
console.log(JSON.stringify(node, null, 2).slice(0, 5000))

const files = await framer.getCodeFiles()
const f = files.find((x) => x.name === "BuiltByKern_GlassType.tsx")
console.log("file", f && { id: f.id, name: f.name, exports: f.exports })
