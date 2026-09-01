const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(info.name)
const files = await framer.getCodeFiles()
console.log(JSON.stringify({ name: info.name, n: files.length, files: files.map((f) => f.name) }))
