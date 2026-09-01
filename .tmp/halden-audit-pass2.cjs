const fs = require("fs")
const out = "/Users/noel/Desktop/Framer/.tmp/halden-audit"

const cols = await framer.getCollections()
const work = cols[0]
const fields = await work.getFields()
fs.writeFileSync(`${out}/cms-fields.json`, JSON.stringify(fields, null, 2))

const items = await work.getItems()
const itemAudit = []
for (const item of items) {
    const fd = item.fieldData || {}
    const row = { id: item.id, slug: item.slug, draft: item.draft, fields: {} }
    for (const [k, v] of Object.entries(fd)) {
        const t = v?.type
        let empty = false
        let extra = null
        if (t === "string" || t === "formattedText") empty = !v.value
        else if (t === "image") {
            empty = !v.value?.url
            extra = { alt: v.value?.altText || "", url: Boolean(v.value?.url) }
        } else if (t === "array") {
            const arr = v.value || []
            extra = {
                n: arr.length,
                alts: arr.map((g) => {
                    const img = Object.values(g.fieldData || {})[0]
                    return img?.value?.altText || ""
                }),
                missingUrl: arr.filter((g) => {
                    const img = Object.values(g.fieldData || {})[0]
                    return !img?.value?.url
                }).length,
            }
            empty = arr.length === 0
        } else extra = v?.value
        row.fields[k] = { t, empty, extra }
    }
    itemAudit.push(row)
}
fs.writeFileSync(`${out}/cms-items.json`, JSON.stringify(itemAudit, null, 2))

const files = await framer.getCodeFiles()
const checks = []
for (const f of files) {
    const errors = await f.typecheck({ strict: true })
    const c = f.content || ""
    checks.push({
        name: f.name,
        typeErrors: errors,
        innerFixed: (c.match(/position:\s*["']fixed["']/g) || []).length,
        freeze: /useIsStaticRenderer/.test(c),
        reduced: /useReducedMotion/.test(c),
        firstReturnHasFixed: /return\s*\(\s*<div[\s\S]{0,400}position:\s*["']fixed["']/.test(c),
    })
}
fs.writeFileSync(`${out}/code-check.json`, JSON.stringify(checks, null, 2))

function findLinks(n, acc, page) {
    const a = n.attributes || {}
    const dump = {}
    for (const k of Object.keys(a)) {
        if (/link|href|url|openIn/i.test(k)) dump[k] = a[k]
    }
    if (Object.keys(dump).length) acc.push({ page, id: n.id, type: n.type, name: a.name, dump })
    for (const c of n.children || []) findLinks(c, acc, page)
}

const linkHits = []
for (const [id, page] of [
    ["augiA20Il", "/"],
    ["nizhx6wAX", "/404"],
    ["fpoP3kuA4", "/work/:Work"],
    ["Ebz57iEJS", "Nav"],
]) {
    try {
        const opts = page.startsWith("/") ? { pagePath: page } : {}
        const tree = await framer.agent.serialize({ id, depth: 14 }, opts)
        findLinks(tree, linkHits, page)
    } catch (e) {
        linkHits.push({ page, id, error: String(e) })
    }
}
fs.writeFileSync(`${out}/links.json`, JSON.stringify(linkHits, null, 2))

let grain = null
try {
    grain = await framer.agent.getNode({ id: "i4aFUkETP" }, { pagePath: "/work/:Work" })
} catch (e) {
    grain = { error: String(e) }
}

console.log(JSON.stringify({
    fieldNames: fields.map((f) => ({ name: f.name, type: f.type, id: f.id })),
    items: items.length,
    drafts: items.filter((i) => i.draft).length,
    emptyImages: itemAudit.filter((i) => Object.values(i.fields).some((f) => f.t === "image" && f.empty)).map((i) => i.slug),
    emptyAlts: itemAudit.flatMap((i) => {
        const hits = []
        for (const [k, f] of Object.entries(i.fields)) {
            if (f.t === "image" && f.extra && !f.extra.alt) hits.push(i.slug + ":" + k)
            if (f.t === "array" && f.extra?.alts?.some((a) => !a)) hits.push(i.slug + ":gallery-missing-alt")
        }
        return hits
    }),
    emptyGalleries: itemAudit.filter((i) => Object.values(i.fields).some((f) => f.t === "array" && f.empty)).map((i) => i.slug),
    typeErrors: checks,
    linkHits: linkHits.length,
    grainOk: grain && !grain.error,
    grainPointer: grain?.attributes?.pointerEvents,
    grainAmount: grain?.attributes?.["$control__amount"],
}, null, 2))
