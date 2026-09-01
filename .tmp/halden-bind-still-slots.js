const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(info.name)

const pagePath = "/work/:Work"
const ids = ["afUswAq7g", "LSqc1L2WHafUswAq7g", "Tf2mbU7BvafUswAq7g"]
const bind = [
    `$control__still1="var(--variable-YDvzMtarJ)"`,
    `$control__still2="var(--variable-e_xsxTDiE)"`,
    `$control__still3="var(--variable-sFlCMgFPv)"`,
    `$control__still4="var(--variable-YgsGo3UQv)"`,
].join(" ")

const dsl = ids.map((id) => `SET ${id} ${bind};`).join(" ")
const r = await framer.agent.applyChanges(dsl, { pagePath })

const check = await framer.agent.getNode({ id: "afUswAq7g" }, { pagePath })

console.log(
    JSON.stringify(
        {
            r: { errors: r.errors, message: r.message, lint: r.linter },
            stills: {
                s1: check?.attributes?.$control__still1,
                s2: check?.attributes?.$control__still2,
                s3: check?.attributes?.$control__still3,
                s4: check?.attributes?.$control__still4,
                images: check?.attributes?.$control__images,
            },
        },
        null,
        2
    )
)
