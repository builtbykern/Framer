const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(`Wrong project: ${info.name}`)

const cols = await framer.getCollections()
const out = []
for (const c of cols) {
    const fields = typeof c.getFields === "function" ? await c.getFields() : c.fields
    out.push({
        id: c.id,
        name: c.name,
        keys: Object.keys(c).slice(0, 20),
        fieldNames: Array.isArray(fields)
            ? fields.map((f) => ({
                  id: f.id,
                  name: f.name,
                  type: f.type,
              }))
            : fields,
    })
}

const workPage = await framer.agent.getNode({ id: "MI_ZHE7kH" }, { pagePath: "/work" }).catch(() => null)
const workAlt = await framer.agent.serialize(
    { id: "yn0nMGJJL", depth: 3, attributeFilter: ["name", "collectionList", "fill"] },
    { pagePath: "/work/:Work" }
).catch((e) => ({ error: String(e) }))

console.log(
    JSON.stringify(
        {
            project: info.name,
            collections: out,
            workGalNode: workPage
                ? {
                      id: workPage.id,
                      name: workPage.name,
                      collectionList: workPage.attributes?.collectionList,
                  }
                : null,
            workAlt,
        },
        null,
        2
    )
)
