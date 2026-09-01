const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(`Wrong project: ${info.name}`)
const files = await framer.getCodeFiles()
const names = files.map((f) => ({
    id: f.id,
    name: f.name,
    path: f.path,
    keys: Object.keys(f).slice(0, 30),
    proto: Object.getOwnPropertyNames(Object.getPrototypeOf(f) || {}).slice(0, 40),
}))
console.log(JSON.stringify({ project: info.name, names }, null, 2))
