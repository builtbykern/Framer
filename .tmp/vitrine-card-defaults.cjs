function textOf(n) {
    const t = n.attributes?.text
    if (typeof t === "string") return t
    if (t && typeof t === "object") return JSON.stringify(t)
    return ""
}

const card = await framer.agent.serializeNodes({
    ids: ["OdvHkNWXz"],
    depth: 0,
})

const texts = await framer.agent.serializeNodes({
    ids: [
        "QhfNwiny9",
        "odgkshwbV",
        "oSHXrizqB",
        "FnQbHIoGD",
        "DZIMTQiKB",
        "BU8_2gg2U",
        "axW_NfbLI",
        "ebjghUxzc",
        "o7hTHauuw",
        "JN7M7ldcs",
        "i5CphXhmV",
    ],
    depth: 0,
    attributeFilter: ["name", "text", "link"],
})

const leftovers = ["Glass Hours", "Halden", "Quarto", "Mill Ledger", "letterpress", "lorem", "Lorem"]
const found = []
for (const n of texts) {
    const t = textOf(n)
    for (const needle of leftovers) {
        if (t.includes(needle)) found.push({ id: n.id, name: n.name, needle })
    }
}

console.log(
    JSON.stringify(
        {
            vars: (card[0]?.variables || []).map((v) => ({
                id: v.id,
                name: v.name,
                type: v.type,
                initialValue: v.initialValue,
            })),
            texts: texts.map((n) => ({
                id: n.id,
                name: n.name,
                text: textOf(n).slice(0, 240),
                link: n.attributes?.link,
            })),
            found,
        },
        null,
        2
    )
)
