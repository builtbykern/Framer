function fail(msg) {
    throw new Error(msg)
}

function walk(node, acc, depth = 0) {
    if (!node || depth > 16) return acc
    const a = node.attributes || {}
    if (node.type === "RichTextNode" || a.fontName || a.textStylePreset) {
        acc.push({
            id: node.id,
            textStylePreset: a.textStylePreset,
            fontName: a.fontName,
            fontSize: a.fontSize,
        })
    }
    for (const c of node.children || []) walk(c, acc, depth + 1)
    return acc
}

const styles = await framer.getTextStyles()
const lead = (styles || []).find((s) => s.name === "Lead")
if (!lead) fail("Lead text style must exist")

const family = lead.font?.family || lead.font?.fontFamily
if (family !== "Syne") fail(`Lead must be Syne, got ${family}`)
const size = String(lead.fontSize || lead.size)
if (size !== "27px") fail(`Lead size 27px, got ${size}`)

const n404 = await framer.agent.getNode(
    { id: "TvxbdlTzw", depth: 0 },
    { pagePath: "/404" }
)
if (n404?.attributes?.textStylePreset !== "Lead") {
    fail(`404 TvxbdlTzw must use Lead, got ${n404?.attributes?.textStylePreset}`)
}

const navRoot = await framer.agent.getNode({ id: "Ebz57iEJS", depth: 14 })
const navTexts = walk(navRoot, [])
for (const id of ["AkMxCySBQ", "sWU5I6bKH", "Hc2be91vS"]) {
    const n = navTexts.find((t) => t.id === id)
    if (!n) fail(`Nav ${id} missing`)
    if (n.textStylePreset !== "Lead") fail(`Nav ${id} must use Lead, got ${n.textStylePreset}`)
}

const workRoot = await framer.agent.getNode(
    { id: "fpoP3kuA4", depth: 14 },
    { pagePath: "/work/:Work" }
)
const workTexts = walk(workRoot, [])
const interLeft = workTexts.filter((t) => t.fontName === "Inter")
if (interLeft.length !== 0) {
    fail(`Work still has Inter: ${interLeft.map((t) => t.id).join(",")}`)
}

for (const id of ["Ty40f0R2F", "qrIQI0oZQ", "bN50dgn5u", "wbokoK9Xt"]) {
    const n = workTexts.find((t) => t.id === id)
    if (!n) fail(`Work ${id} missing`)
    if (n.textStylePreset !== "Body") fail(`Work ${id} must use Body, got ${n.textStylePreset}`)
}

console.log(JSON.stringify({ ok: true, leadId: lead.id }))
