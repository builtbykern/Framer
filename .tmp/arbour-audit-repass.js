/**
 * Read-only recon for Arbour template-audit re-pass after 123/124.
 */
const pages = []
for (const p of await framer.getNodesWithType("WebPageNode")) {
    const s = await framer.agent.serialize({ id: p.id, depth: 0 }, {})
    pages.push({
        id: p.id,
        path: p.path,
        collectionId: p.collectionId,
        draft: p.draft,
        title: s.attributes?.metadata?.title,
        desc: s.attributes?.metadata?.description,
        bp: (s.$breakpoints || []).length,
    })
}

const preview = await framer.agent.publish({ action: "preview" })
const ctx = await framer.agent.getContext({ pagePath: "/" })
const str = typeof ctx === "string" ? ctx : JSON.stringify(ctx)
const i = str.indexOf("Current Project External Components")
const j = str.indexOf("### Additionally")
const externals = i >= 0 ? str.slice(i, j > i ? j : i + 500) : null

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
    const nhField = fields.find((f) => f.name === "Neighbourhood")
    cols[c.name] = {
        id: c.id,
        n: items.length,
        requiredGaps: gaps,
        nhSample:
            c.name === "Properties"
                ? items.map((it) => ({
                      slug: it.slug,
                      nh: it.fieldData?.[nhField?.id],
                  }))
                : undefined,
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
        /EditorialReveal|ProgressiveBlur|TerritoryRail|Scroll Blur|Stop Scroll|P52cq|eITAB|MxeAzs|gHPemNT|il4DSn9|PaGRz|fOrMtU2/i.test(
            name + c,
        )
    ) {
        fx.push({ id: n.id, name, component: n.component })
    }
    for (const ch of n.children || []) walkFx(ch)
    for (const b of n.$breakpoints || []) walkFx(b)
}
walkFx(home)

const pageIds = pages.map((p) => p.id)
const nested = []
for (const p of pages) {
    const page = await framer.agent.serialize({ id: p.id, depth: 12 }, {})
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
        for (const ch of n.children || []) walk(ch, next)
        for (const b of n.$breakpoints || []) walk(b, linked)
    }
    walk(page, 0)
    nested.push({ path: p.path, ul, risks })
}

// properties filter still wired?
const grid = await framer.agent.serialize({ id: "D1P7aRrFn", depth: 0 }, {})

console.log(
    JSON.stringify(
        {
            pages,
            publish: {
                changesCount: preview.changesCount,
                changes: preview.changes,
                errors: preview.errors,
                status: preview.status,
            },
            externals,
            cols,
            nhCard: {
                link: card.attributes?.link,
                cursor: card.attributes?.cursor,
            },
            notesUL: notes?.attributes?.["$control__decorative"],
            pcStatic: pc.content.includes("useIsStaticRenderer"),
            homeFX: fx,
            nested,
            propertiesFilters: grid.attributes?.collectionList?.filters?.length,
            propertiesCollection:
                grid.attributes?.collectionList?.collection,
        },
        null,
        2,
    ),
)
