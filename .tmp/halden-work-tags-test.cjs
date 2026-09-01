function fail(msg) {
    throw new Error(msg)
}

const tags = await framer.agent.getNode(
    { id: "ysMOpvpsd", depth: 3 },
    { pagePath: "/work/:Work" }
)
if (tags?.attributes?.gap !== "12px") {
    fail(`Tags gap must be 12px, got ${tags?.attributes?.gap}`)
}

const chips = (tags.children || []).filter((c) => c.type === "FrameNode")
if (chips.length !== 3) fail(`expected 3 tag chips, got ${chips.length}`)

for (const chip of chips) {
    const a = chip.attributes || {}
    const border = String(a.border || "")
    if (border && border !== "none" && !border.startsWith("0")) {
        fail(`${chip.id} must not keep pill border, got ${border}`)
    }
    if (a.radius && a.radius !== "0px" && a.radius !== 0) {
        fail(`${chip.id} must not keep pill radius, got ${a.radius}`)
    }
    const pad = String(a.padding || "0px")
    if (pad !== "0px" && pad !== "0px 0px 0px 0px") {
        fail(`${chip.id} must not keep pill padding, got ${pad}`)
    }
    const text = (chip.children || []).find((c) => c.type === "RichTextNode")
    if (text?.attributes?.textStylePreset !== "Label") {
        fail(`${text?.id} must use Label`)
    }
}

console.log(JSON.stringify({ ok: true, chips: chips.map((c) => c.id) }))
