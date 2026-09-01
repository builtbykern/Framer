const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(info.name)
const moved = await framer.agent.applyChanges(
    `MOVE DtZHJ8qW_ parent="amTC8pcIG" index="13";`,
    { pagePath: "/" }
)
const work = (await framer.getCollections()).find((c) => c.name === "Work")
const fields = await work.getFields()
console.log(
    JSON.stringify(
        {
            moved: moved.message,
            fields: fields.map((f) => f.name),
        },
        null,
        2
    )
)
