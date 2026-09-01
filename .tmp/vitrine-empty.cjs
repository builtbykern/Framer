const empty = await framer.agent.serializeNodes({
    ids: ["i5CphXhmV", "yAd2lMDSW"],
    depth: 2,
})
function dump(n, acc = []) {
    const t = n.attributes?.text
    acc.push({ id: n.id, name: n.name, type: n.type, text: t })
    for (const c of n.children || []) dump(c, acc)
    return acc
}
console.log(JSON.stringify(empty.flatMap((n) => dump(n)), null, 2))
