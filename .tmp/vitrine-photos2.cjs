function urls(pack) {
    return (pack?.results || []).map((b) => ({
        url: b.url,
        alt: String(b.alt || "").replace(/"/g, ""),
    }))
}

const q = (query, orientation) =>
    framer.agent.queryImages({
        source: "unsplash",
        query,
        count: 3,
        orientation,
        width: 1400,
    })

const [a, b, c, d] = await Promise.all([
    q("handmade ceramic bowl empty", "squarish"),
    q("folded beige linen fabric", "landscape"),
    q("brass pendant on wood", "squarish"),
    q("clay cup on wooden table", "squarish"),
])
const A = urls(a)
const B = urls(b)
const C = urls(c)
const D = urls(d)

const pick = (arr, i) => arr[i] || arr[0]

const cmds = []
const sets = [
    ["tZytgw_pu", pick(A, 0), pick(A, 1)],
    ["N8rSuGdDW", pick(C, 0), pick(C, 1)],
    ["vWwUi2iXi", pick(B, 0), pick(B, 1)],
    ["EDUlD2m19", pick(D, 0), pick(D, 1)],
    ["X3kJRxUxX", pick(A, 2), pick(D, 2)],
]
for (const [id, cover, still] of sets) {
    if (!cover?.url || !still?.url) continue
    cmds.push(
        `SET ${id} $control__cover.src="${cover.url}" $control__cover.alt="${cover.alt || "piece"}" $control__still.src="${still.url}" $control__still.alt="${still.alt || "still"}";`
    )
}

const r = await framer.agent.applyChanges(cmds.join(" "), { pagePath: "/" })
const home = await framer.agent.serializeNodes({ ids: ["augiA20Il"], depth: 0 })
console.log(
    JSON.stringify(
        {
            counts: { A: A.length, B: B.length, C: C.length, D: D.length },
            alts: { A, B, C, D },
            r,
            homeAttrs: home[0]?.attributes,
        },
        null,
        2
    )
)
