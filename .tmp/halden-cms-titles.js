const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(`Wrong project: ${info.name}`)

function textOf(n) {
    const a = n?.attributes || {}
    return {
        id: n?.id,
        name: n?.name,
        type: n?.type,
        text: a.text,
        textStylePreset: a.textStylePreset,
        visible: a.visible,
    }
}

const card = await framer.agent.serializeNodes(
    { ids: ["gSGwySyKV", "H9TnltXVB"], depth: 4 },
    { pagePath: "/" }
)

const collections = await framer.getCollections()
const workCol = (collections || []).find((c) =>
    /work/i.test(`${c.name || ""} ${c.id || ""}`)
)
let fields = []
let items = []
if (workCol) {
    try {
        const f = typeof workCol.getFields === "function" ? await workCol.getFields() : workCol.fields
        fields = (f || []).map((x) => ({ id: x.id, name: x.name, type: x.type }))
    } catch (e) {
        fields = [{ error: String(e) }]
    }
    try {
        const recs = typeof workCol.getItems === "function" ? await workCol.getItems() : workCol.items
        items = (recs || []).slice(0, 8).map((it) => ({
            id: it.id,
            slug: it.slug,
            fieldData: it.fieldData
                ? Object.fromEntries(
                      Object.entries(it.fieldData)
                          .filter(([k]) => /title|name|body|desc|type|slug/i.test(k) || true)
                          .slice(0, 20)
                          .map(([k, v]) => {
                              const val = v && typeof v === "object" && "value" in v ? v.value : v
                              const s = typeof val === "string" ? val.slice(0, 80) : val
                              return [k, s]
                          })
                  )
                : undefined,
        }))
    } catch (e) {
        items = [{ error: String(e) }]
    }
}

console.log(
    JSON.stringify(
        {
            project: info.name,
            col: workCol && { id: workCol.id, name: workCol.name },
            fields,
            items,
            card: card,
        },
        null,
        2
    )
)
