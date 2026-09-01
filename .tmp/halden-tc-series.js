const files = await framer.getCodeFiles()
const series = files.find((f) => f.id === "jeA2cvO")
const tc = await series.typecheck()
console.log(JSON.stringify({ project: (await framer.getProjectInfo()).name, tc }, null, 2))
