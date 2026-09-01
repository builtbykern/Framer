const fs = require("fs")
const src = fs.readFileSync("/Users/noel/Desktop/Framer/.tmp/halden-src/Series_Stills.tsx", "utf8")
const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(`Wrong project: ${info.name}`)

let typecheck = null
try {
    typecheck = await framer.typecheckCode("Series_Stills.tsx", src)
} catch (error) {
    typecheck = { error: String(error) }
}

let created = null
try {
    const file = await framer.createCodeFile("Series_Stills.tsx", src)
    created = {
        id: file.id,
        name: file.name,
        path: file.path,
        exports: (file.exports || []).map((e) => ({
            name: e.name,
            type: e.type,
            componentId: e.componentId,
        })),
    }
} catch (error) {
    created = { error: String(error) }
}

const files = await framer.getCodeFiles()
console.log(
    JSON.stringify(
        {
            project: info.name,
            typecheck,
            created,
            fileCount: files.length,
            names: files.map((f) => f.name),
        },
        null,
        2
    )
)
