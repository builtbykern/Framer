const cols = {}
for (const c of await framer.getCollections()) {
    const fields = await c.getFields()
    const items = await c.getItems()
    const gaps = []
    for (const it of items) {
        const g = []
        for (const f of fields) {
            if (!f.required) continue
            const v = it.fieldData?.[f.id]
            const empty =
                v == null ||
                v.value == null ||
                v.value === "" ||
                (Array.isArray(v.value) && !v.value.length)
            if (empty) g.push(f.name)
        }
        if (g.length) gaps.push({ slug: it.slug, g })
    }
    cols[c.name] = {
        id: c.id,
        n: items.length,
        fields: fields.map((f) => ({
            name: f.name,
            req: !!f.required,
            type: f.type,
        })),
        gaps,
    }
}

const card = await framer.agent.serialize({ id: "i56eWdACt", depth: 0 }, {})
const notes = await framer.agent.serialize({ id: "TERtNoUYH", depth: 0 }, {})
const pc = await framer.getCodeFile("Arbour_PropertyCard.tsx")
const home = await framer.agent.serialize({ id: "augiA20Il", depth: 12 }, {})
const fx = []
function walkFx(n) {
    if (!n) return
    const c = String(n.component || "")
    const name = n.name || n.$componentDisplayName || ""
    if (
        /EditorialReveal|ProgressiveBlur|TerritoryRail|Scroll Blur|Stop Scroll|P52cq|eITAB|MxeAzs|gHPemNT|il4DSn9|PaGRz/i.test(
            name + c,
        )
    ) {
        fx.push({ id: n.id, name, component: n.component })
    }
    for (const ch of n.children || []) walkFx(ch)
    for (const b of n.$breakpoints || []) walkFx(b)
}
walkFx(home)

const pageIds = [
    "augiA20Il",
    "uBAGmujMa",
    "dZfxmFpqB",
    "s8RpZIiJ8",
    "OdFhPn9yz",
    "c7qpzB7hR",
    "OhRUQROL4",
    "YPPO8pJ92",
    "ojmcAsLyM",
]
const paths = [
    "/",
    "/properties-2",
    "/neighbourhoods",
    "/notes",
    "/about",
    "/contact",
    "/properties-2/:slug",
    "/notes/:slug",
    "/404",
]
const nested = []
for (let i = 0; i < pageIds.length; i++) {
    const page = await framer.agent.serialize({ id: pageIds[i], depth: 12 }, {})
    let risks = 0
    let ul = 0
    function walk(n, linked) {
        if (!n || typeof n !== "object") return
        const name = n.name || n.$componentDisplayName || ""
        const href = n.attributes?.link?.href
        const next = href ? linked + 1 : linked
        const isUL =
            /UnderlineLink/i.test(name) ||
            String(n.component || "").includes("zCa0pzg")
        if (isUL) {
            ul++
            const d = String(n.attributes?.["$control__decorative"])
            if (d !== "true" && linked > 0) risks++
        }
        for (const c of n.children || []) walk(c, next)
        for (const b of n.$breakpoints || []) walk(b, linked)
    }
    walk(page, 0)
    nested.push({ path: paths[i], ul, risks })
}

console.log(
    JSON.stringify(
        {
            cols,
            nhCard: {
                link: card.attributes?.link,
                cursor: card.attributes?.cursor,
                onTap: card.attributes?.onTap,
            },
            notesUL: notes?.attributes?.["$control__decorative"],
            pc: { static: pc.content.includes("useIsStaticRenderer") },
            homeFX: fx,
            nested,
        },
        null,
        2,
    ),
)
