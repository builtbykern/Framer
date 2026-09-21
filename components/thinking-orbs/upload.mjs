const fs = require("fs")
const path = require("path")

const info = await framer.getProjectInfo()
const src = fs.readFileSync(
    path.join("/Users/noel/Desktop/Framer", "components/thinking-orbs/Kern_ThinkingOrbs.tsx"),
    "utf8"
)
const remoteName = "Kern_ThinkingOrbs.tsx"
const existing = await framer.getCodeFiles()
const already = existing.find(
    (f) =>
        f.name === remoteName ||
        (f.path && (f.path === remoteName || f.path.endsWith("/" + remoteName)))
)
const file = already
    ? await already.setFileContent(src)
    : await framer.createCodeFile(remoteName, src)
const typeErrors = await file.typecheck({ strict: true })
state.codeFileId = file.id
state.codeFilePath = file.path
state.codeFileName = file.name
state.exports = (file.exports || []).map((e) => ({
    name: e.name,
    type: e.type,
    componentId: e.componentId,
    insertURL: e.insertURL,
    isDefaultExport: e.isDefaultExport,
}))
state.typecheck = typeErrors
console.log(
    JSON.stringify(
        {
            project: info.name,
            projectId: info.id,
            id: file.id,
            name: file.name,
            path: file.path,
            exports: state.exports,
            typeErrors,
        },
        null,
        2
    )
)
