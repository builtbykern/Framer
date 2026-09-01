const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(`Wrong project: ${info.name}`)

const names = [
    "getCodeFile",
    "getCodeFiles",
    "createCodeFile",
    "isAllowed",
    "getPluginContext",
]
const has = {}
for (const n of names) has[n] = typeof framer[n]

let byName = null
try {
    byName = typeof framer.getCodeFile === "function"
        ? await framer.getCodeFile("Series_Stills.tsx")
        : "no-getCodeFile"
} catch (e) {
    byName = String(e)
}

let allowed = null
try {
    allowed = typeof framer.isAllowed === "function"
        ? {
              create: await framer.isAllowed("CodeFile.create"),
              set: await framer.isAllowed("CodeFile.setFileContent"),
          }
        : null
} catch (e) {
    allowed = String(e)
}

console.log(
    JSON.stringify(
        {
            project: info.name,
            has,
            byName:
                byName && typeof byName === "object"
                    ? { id: byName.id, name: byName.name, bytes: String(byName.content || "").length }
                    : byName,
            allowed,
        },
        null,
        2
    )
)
