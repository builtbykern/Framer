const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(info.name)

const pagePath = "/work/:Work"
const probes = [
    `SET lktcbNgBF collectionList.collection="var(--variable-WTTAaEd5y)";`,
    `SET lktcbNgBF collectionList.collection="Gallery";`,
    `SET lktcbNgBF collectionList.collection="WTTAaEd5y";`,
    `SET lktcbNgBF variableBinding="var(--variable-WTTAaEd5y)";`,
    `SET lktcbNgBF collectionList.gallery="WTTAaEd5y";`,
    `SET lktcbNgBF collectionList.source="var(--variable-WTTAaEd5y)";`,
]

const results = []
for (const dsl of probes) {
    try {
        const out = await framer.agent.applyChanges(dsl, { pagePath })
        results.push({ dsl, ok: true, out: JSON.stringify(out).slice(0, 1500) })
        await framer.agent.applyChanges(
            `SET lktcbNgBF collectionList.collection="Work" collectionList.repeatedDescendantId="Lcpket8Fj" collectionList.limit="1";`,
            { pagePath }
        )
    } catch (e) {
        results.push({ dsl, ok: false, err: String(e).slice(0, 2000) })
    }
}

const computed = await framer.agent.readProject([
    { type: "implementation-guide-from-index", name: "Computed Values" },
])
const text = JSON.stringify(computed)
const names = [...text.matchAll(/"name":"([^"]+)"/g)].map((m) => m[1])
const unique = [...new Set(names)]

console.log(
    JSON.stringify(
        {
            probes: results,
            transformNames: unique.slice(0, 80),
            computedHits: {
                gallery: (text.match(/galler/gi) || []).length,
                array: (text.match(/array/gi) || []).length,
                index: (text.match(/index/gi) || []).length,
                get: (text.match(/getItem|itemAt|atIndex|nth/gi) || []).length,
            },
            computedSlice: text.slice(0, 8000),
        },
        null,
        2
    )
)
