const fs = require("fs")
const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(info.name)

const work = (await framer.getCollections()).find((c) => c.name === "Work")
const stillIds = ["YDvzMtarJ", "e_xsxTDiE", "sFlCMgFPv", "YgsGo3UQv"]
const items = await work.getItems()

function esc(s) {
    return String(s || "").replace(/"/g, '\\"')
}

const commands = []
for (const item of items) {
    const rows = Array.isArray(item.fieldData?.WTTAaEd5y?.value)
        ? item.fieldData.WTTAaEd5y.value
        : []
    stillIds.forEach((id, i) => {
        const img = rows[i]?.fieldData?.ZkP9UsFFL?.value
        if (!img?.url) return
        commands.push(
            `SET ${item.id} $control__${id}.src="${img.url}" $control__${id}.alt="${esc(img.altText || img.alt || "")}";`
        )
    })
}

const migrate = await framer.agent.applyChanges(commands.join(" "), { pagePath: "/" })

const src = fs.readFileSync(
    "/Users/noel/Desktop/Framer/.tmp/halden-src/Series_Stills.tsx",
    "utf8"
)
if (!src.includes("still1:")) throw new Error("src missing still1")
const file = await framer.getCodeFile("Series_Stills.tsx")
await file.setFileContent(src)
const typeErrors = await file.typecheck({ strict: true })

const controls = await framer.agent.getComponentControls({
    componentIds: ["codeFile/jeA2cvO:default"],
})

console.log(
    JSON.stringify(
        {
            migrate: {
                n: commands.length,
                errors: migrate.errors,
                message: migrate.message,
            },
            typeErrors,
            controlTitles: JSON.stringify(controls).slice(0, 5000),
        },
        null,
        2
    )
)
