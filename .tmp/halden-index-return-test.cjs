function fail(msg) {
    throw new Error(msg)
}

async function textOf(id, pagePath) {
    const n = await framer.agent.serialize({ id, depth: 3 }, { pagePath })
    const runs = []
    function walk(node) {
        if (!node) return
        if (node.type === "TextRun" && node.attributes?.text) runs.push(node.attributes.text)
        for (const c of node.children || []) walk(c)
    }
    walk(n)
    return runs.join("")
}

const home404 = await textOf("dyBeOeyiJ", "/404")
if (home404 !== "← INDEX") fail(`404 return must be ← INDEX, got ${JSON.stringify(home404)}`)

const n404 = await framer.agent.getNode({ id: "dyBeOeyiJ", depth: 0 }, { pagePath: "/404" })
if (n404?.attributes?.textStylePreset !== "Label") fail("404 return must use Label")
if (n404?.attributes?.linkStylePreset !== "Info Link") fail("404 return must use Info Link")
if (n404?.attributes?.link?.href !== "/") fail("404 return must link to /")

const indexWork = await textOf("tCeuqaScL", "/work/:Work")
if (indexWork !== "← INDEX") fail(`Work return must be ← INDEX, got ${JSON.stringify(indexWork)}`)

const nWork = await framer.agent.getNode(
    { id: "tCeuqaScL", depth: 0 },
    { pagePath: "/work/:Work" }
)
if (nWork?.attributes?.textStylePreset !== "Label") fail("Work return must use Label")
if (nWork?.attributes?.linkStylePreset !== "Info Link") fail("Work return must use Info Link")
if (nWork?.attributes?.link?.href !== "/") fail("Work return must link to /")

console.log(JSON.stringify({ ok: true, home404, indexWork }))
