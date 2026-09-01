const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(`Wrong project: ${info.name}`)

const files = await framer.getCodeFiles()
const slim = (files || []).map((f) => ({
    id: f.id,
    name: f.name,
    path: f.path,
    exports: (f.exports || []).map((e) => ({
        id: e.id,
        name: e.name,
        type: e.type,
    })),
    bytes: typeof f.content === "string" ? f.content.length : 0,
}))

const plane = await framer.agent.serializeNodes(
    { ids: ["RV7bjlgdh", "yGFlVus2I", "afUswAq7g"], depth: 0 },
    { pagePath: "/" }
)
const workStill = await framer.agent.serializeNodes(
    { ids: ["afUswAq7g"], depth: 0 },
    { pagePath: "/work/:Work" }
)

console.log(
    JSON.stringify(
        {
            fileCount: slim.length,
            files: slim,
            plane,
            workStill,
            methods: Object.getOwnPropertyNames(framer)
                .filter((k) => /code|Code|file|File/i.test(k))
                .sort(),
        },
        null,
        2
    )
)
