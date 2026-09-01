function fail(msg) {
    throw new Error(msg)
}

const INK = "24aaa6c6-0b98-4eac-b695-5f20471f6b92"
const MUTED = "8028b435-146d-4074-967e-823e6635036f"
const PAPER = "38f71e00-788a-47bd-a813-10d6b48f262b"

const types = await framer.agent.getNodesOfTypes({ types: ["LinkStylePresetNode"] })
const byName = {}
for (const n of types || []) {
    const s = await framer.agent.serialize({ id: n.id, depth: 0 })
    byName[s.name || s.attributes?.name] = s.attributes?.link || {}
}

function usesToken(value, token) {
    return String(value || "").includes(token)
}

const info = byName["Info Link"]
if (!usesToken(info?.textColor, INK)) fail(`Info Link rest must use ink token, got ${info?.textColor}`)
if (!usesToken(info?.hover?.textColor, MUTED)) fail(`Info Link hover must use muted token, got ${info?.hover?.textColor}`)
if (!usesToken(info?.current?.textColor, INK)) fail(`Info Link current must use ink token, got ${info?.current?.textColor}`)

const contact = byName["Contact Link"]
if (!usesToken(contact?.textColor, INK)) fail(`Contact Link rest must use ink token, got ${contact?.textColor}`)
if (!usesToken(contact?.hover?.textColor, MUTED)) fail(`Contact Link hover must use muted token, got ${contact?.hover?.textColor}`)

const native = byName["Native Navigation Link"]
if (!usesToken(native?.textColor, PAPER)) fail(`Native Navigation rest must use paper token, got ${native?.textColor}`)

const seo = await framer.agent.getNode({ id: "TRSPZ1XN3", depth: 0 }, { pagePath: "/" })
if (!usesToken(seo?.attributes?.textColor, INK)) {
    fail(`SEO H1 must use ink token, got ${seo?.attributes?.textColor}`)
}

console.log(JSON.stringify({ ok: true, presets: Object.keys(byName) }))
