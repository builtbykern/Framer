const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(info.name)

const homeInstances = await framer.agent.getNodesOfTypes(
    { types: ["ComponentInstanceNode"] },
    { pagePath: "/" }
)
const homeStills = (homeInstances || []).filter((n) =>
    /still|jeA2cvO/i.test(`${n.name} ${n.component} ${n.id}`)
)

const cover = await framer.agent.getNode({ id: "lgPBjlVA8" }, { pagePath: "/work/:Work" })

const pagePath = "/work/:Work"
const probe = await framer.agent.applyChanges(
    `+FrameNode auditImg parent="yn0nMGJJL" name="Audit Native Still" overflow="clip" position="relative" width="100%" height="fit-image" fill="var(--variable-YDvzMtarJ)"; +RichTextNode auditCap parent="yn0nMGJJL" name="Audit Caption" width="auto" height="auto" text="var(--variable-YDvzMtarJ)";`,
    { pagePath }
)

console.log(
    JSON.stringify(
        {
            homeStills: homeStills.map((n) => ({
                id: n.id,
                name: n.name,
                component: n.component,
            })),
            homeCount: (homeInstances || []).length,
            cover: {
                fill: cover?.attributes?.fill,
                height: cover?.attributes?.height,
                width: cover?.attributes?.width,
                overflow: cover?.attributes?.overflow,
            },
            probe: {
                errors: probe.errors,
                message: probe.message,
                renamedIds: probe.renamedIds,
            },
        },
        null,
        2
    )
)
