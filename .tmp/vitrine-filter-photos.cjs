const BAD =
    /hair|camera|egg|mushroom|pillow|pine|candle|shadow|person|people|man |woman|food|dslr|kinfolk|plant on/i
const GOOD =
    /ceramic|bowl|ring|linen|cloth|brass|wood|mug|cup|wire|metal|clay|potter|textile|fabric|jewel|hook|tray|vase|silver|copper|pottery/i

function urls(pack) {
    return (pack?.results || []).map((b) => ({
        url: b.url,
        alt: String(b.alt || ""),
    }))
}

function pickN(list, n) {
    const ok = list.filter((x) => x.url && GOOD.test(x.alt) && !BAD.test(x.alt))
    const pool = ok.length >= n ? ok : list.filter((x) => x.url && !BAD.test(x.alt))
    const out = pool.slice(0, n)
    while (out.length < n && list[out.length]) out.push(list[out.length])
    return out
}

const q = (query, orientation) =>
    framer.agent.queryImages({
        source: "unsplash",
        query,
        count: 6,
        orientation,
        width: 1400,
    })

const packs = await Promise.all([
    q("ceramic bowl empty table", "squarish"),
    q("linen fabric folded", "landscape"),
    q("metal hook on wood", "portrait"),
    q("silver ring linen", "squarish"),
    q("handmade pottery cup", "squarish"),
    q("copper wire on table", "portrait"),
])

const bowl = pickN(urls(packs[0]), 2)
const linen = pickN(urls(packs[1]), 2)
const hook = pickN(urls(packs[2]), 2)
const ring = pickN(urls(packs[3]), 2)
const cup = pickN(urls(packs[4]), 2)
const wire = pickN(urls(packs[5]), 2)

const cmds = []
function setItem(id, cover, still) {
    if (!cover?.url || !still?.url) return
    cmds.push(
        `SET ${id} $control__cover.src="${cover.url}" $control__cover.alt="${cover.alt.replace(/"/g, "")}" $control__still.src="${still.url}" $control__still.alt="${still.alt.replace(/"/g, "")}";`
    )
}

setItem("tZytgw_pu", bowl[0], cup[0])
setItem("vWwUi2iXi", linen[0], linen[1] || linen[0])
setItem("zyvPp0qI0", hook[0], wire[0])
setItem("RXZYU_SGB", wire[0], ring[0])
setItem("X3kJRxUxX", bowl[1] || bowl[0], cup[1] || cup[0])
cmds.push('SET augiA20Il layoutTemplate="null";')

const r = await framer.agent.applyChanges(cmds.join(" "), { pagePath: "/" })
console.log(
    JSON.stringify(
        {
            bowl: bowl.map((x) => x.alt),
            linen: linen.map((x) => x.alt),
            hook: hook.map((x) => x.alt),
            ring: ring.map((x) => x.alt),
            cup: cup.map((x) => x.alt),
            wire: wire.map((x) => x.alt),
            r,
        },
        null,
        2
    )
)
