const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(`Wrong project: ${info.name}`)

const keys = [
    "Series_Stills.tsx",
    "Drift_Plane.tsx",
    "codeFile/jeA2cvO",
    "codeFile/Og5966a",
    "jeA2cvO",
    "Og5966a",
    "codeFile/jeA2cvO:default",
]

const results = []
for (const key of keys) {
    try {
        const f = await framer.getCodeFile(key)
        results.push(
            f
                ? {
                      key,
                      id: f.id,
                      name: f.name,
                      path: f.path,
                      bytes: String(f.content || "").length,
                  }
                : { key, found: false }
        )
    } catch (e) {
        results.push({ key, error: String(e) })
    }
}

console.log(JSON.stringify({ project: info.name, results }, null, 2))
