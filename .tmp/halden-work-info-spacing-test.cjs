function fail(msg) {
    throw new Error(msg)
}

const info = await framer.agent.getNode(
    { id: "rT9WGdFVR", depth: 2 },
    { pagePath: "/work/:Work" }
)
if (info?.attributes?.gap !== "32px") {
    fail(`Info gap must be 32px, got ${info?.attributes?.gap}`)
}

const kids = info.children || []
const identity = kids.find((c) => {
    const presets = (c.children || []).map((x) => x.attributes?.textStylePreset)
    return presets.includes("Label") && presets.includes("Title")
})
if (!identity) fail("Info must wrap type + title in Identity")
if (identity.attributes?.gap !== "8px") {
    fail(`Identity gap must be 8px, got ${identity.attributes?.gap}`)
}

const identKids = identity.children || []
const presets = identKids.map((c) => c.attributes?.textStylePreset)
if (!presets.includes("Label") || !presets.includes("Title")) {
    fail(`Identity must hold Label + Title, got ${presets.join(",")}`)
}

if (kids[0]?.id !== "DPXJnwuEB") fail("Index return must stay first in Info")

const credits = kids.find((c) => c.id === "XSeOzvyqJ")
if (credits?.attributes?.gap !== "10px") {
    fail("Credits internal gap must stay 10px")
}

for (const id of ["LSqc1L2WHrT9WGdFVR", "Tf2mbU7BvrT9WGdFVR"]) {
    const replica = await framer.agent.getNode(
        { id, depth: 0 },
        { pagePath: "/work/:Work" }
    )
    if (replica?.attributes?.gap !== "32px") {
        fail(`${id} gap must be 32px, got ${replica?.attributes?.gap}`)
    }
}

console.log(JSON.stringify({ ok: true, identityId: identity.id }))
