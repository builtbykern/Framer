function fail(msg) {
    throw new Error(msg)
}

const INK = "24aaa6c6-0b98-4eac-b695-5f20471f6b92"

function checkMotion(node, label) {
    const hover = node.attributes?.hoverEffect
    const tap = node.attributes?.tapEffect
    if (!hover) fail(`${label} missing hoverEffect`)
    if (hover.y !== "-2px") fail(`${label} hover.y ${hover.y}`)
    if (hover.opacity !== undefined && hover.opacity !== 1) {
        fail(`${label} hover opacity ${hover.opacity}`)
    }
    if (!String(hover.transition || "").includes("0.2s")) {
        fail(`${label} hover transition ${hover.transition}`)
    }
    if (!tap) fail(`${label} missing tapEffect`)
    if (tap.scale !== 0.97) fail(`${label} tap.scale ${tap.scale}`)
}

const types = await framer.agent.getNodesOfTypes({ types: ["LinkStylePresetNode"] })
const byName = {}
for (const n of types || []) {
    const s = await framer.agent.serialize({ id: n.id, depth: 0 })
    byName[s.name || s.attributes?.name] = s.attributes?.link || {}
}
const infoHover = byName["Info Link"]?.hover?.textColor || ""
if (!String(infoHover).includes(INK)) {
    fail(`Info Link hover must stay ink, got ${infoHover}`)
}

const workIds = [
    ["tCeuqaScL", "INDEX"],
    ["bcSjKaIc9", "Previous"],
    ["NxVQqH3rS", "Next"],
    ["LSqc1L2WHtCeuqaScL", "INDEX tablet"],
    ["LSqc1L2WHbcSjKaIc9", "Previous tablet"],
    ["LSqc1L2WHNxVQqH3rS", "Next tablet"],
    ["Tf2mbU7BvtCeuqaScL", "INDEX phone"],
    ["Tf2mbU7BvbcSjKaIc9", "Previous phone"],
    ["Tf2mbU7BvNxVQqH3rS", "Next phone"],
]
for (const [id, label] of workIds) {
    checkMotion(await framer.agent.serialize({ id, depth: 0 }, { pagePath: "/work/:Work" }), label)
}

const fourIds = [
    ["dyBeOeyiJ", "404 INDEX"],
    ["BV5dxVKN3dyBeOeyiJ", "404 INDEX tablet"],
    ["h0q8NyaAQdyBeOeyiJ", "404 INDEX phone"],
]
for (const [id, label] of fourIds) {
    checkMotion(await framer.agent.serialize({ id, depth: 0 }, { pagePath: "/404" }), label)
}

const navIds = [
    ["sWU5I6bKH", "Nav work title"],
    ["OSaBHYPYg", "Nav mailto"],
    ["AkMxCySBQ", "Nav lead A"],
    ["Hc2be91vS", "Nav lead C"],
    ["lHV5aHgaZsWU5I6bKH", "Nav work title tablet"],
    ["lHV5aHgaZOSaBHYPYg", "Nav mailto tablet"],
    ["lHV5aHgaZAkMxCySBQ", "Nav lead A tablet"],
    ["lHV5aHgaZHc2be91vS", "Nav lead C tablet"],
]
for (const [id, label] of navIds) {
    checkMotion(await framer.agent.serialize({ id, depth: 0 }), label)
}

const def = await framer.agent.serialize({ id: "Bzw0bxdQh", depth: 0 })
const hover = await framer.agent.serialize({ id: "s9AfX4tbC", depth: 0 })
const pressed = await framer.agent.serialize({ id: "SOqi4P9YF", depth: 0 })
if (def.attributes?.hoverEffect) fail("Submit Default must not hover-animate the whole button")
if (String(hover.attributes?.fill || "").includes("0.86")) {
    fail(`Submit Hover still uses faded fill ${hover.attributes.fill}`)
}
if (!String(hover.attributes?.fill || "").includes(INK) && !String(hover.attributes?.fill || "").includes("24aaa6c6")) {
    // fill may be rgb equivalent; accept ink token or rgb(17, 17, 17)
    const fill = String(hover.attributes?.fill || "")
    if (!/rgb\(\s*17,\s*17,\s*17\s*\)/.test(fill) && !fill.includes(INK)) {
        fail(`Submit Hover fill should stay ink, got ${fill}`)
    }
}
const defGap = parseFloat(def.attributes?.gap)
const hoverGap = parseFloat(hover.attributes?.gap)
if (!(hoverGap > defGap)) fail(`Submit Hover gap should move the arrow (${defGap} → ${hoverGap})`)
const pressedGap = parseFloat(pressed.attributes?.gap)
if (!(pressedGap > defGap)) fail(`Submit Pressed gap should keep the arrow out (${pressedGap})`)

console.log(JSON.stringify({ ok: true }))
