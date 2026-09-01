const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(info.name)

const work = (await framer.getCollections()).find((c) => c.name === "Work")
const items = await work.getItems()
const sample = items.map((it) => ({
    slug: it.slug,
    s1: it.fieldData?.YDvzMtarJ?.value?.url?.slice(-32),
    a1: it.fieldData?.YDvzMtarJ?.value?.altText,
    s2: Boolean(it.fieldData?.e_xsxTDiE?.value?.url),
    s3: Boolean(it.fieldData?.sFlCMgFPv?.value?.url),
    s4: Boolean(it.fieldData?.YgsGo3UQv?.value?.url),
}))

const file = await framer.getCodeFile("Series_Stills.tsx")
const typeErrors = await file.typecheck({ strict: true })

const controls = await framer.agent.readComponentControls({
    componentIds: ["codeFile/jeA2cvO:default"],
})

const inst = await framer.agent.getNode({ id: "afUswAq7g" }, { pagePath: "/work/:Work" })
const keys = Object.keys(inst?.attributes || {}).filter((k) => k.startsWith("$control__"))

console.log(
    JSON.stringify(
        {
            sample,
            typeErrors,
            instanceKeys: keys,
            instance: inst?.attributes,
            controlsSlice: JSON.stringify(controls).slice(0, 5000),
        },
        null,
        2
    )
)
