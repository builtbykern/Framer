const TITLE = "Arbour — Independent Estate Agency London"
const DESC =
    "Curated residences across London and the country. Discreet acquisition, disposal, and counsel since 1999."
const NL = String.fromCharCode(10)
const homeId = "kZL5hI0oT"

const attempts = []

// 1) applyChanges metadata.*
{
    const dsl = [
        `SET ${homeId} metadata.title=${JSON.stringify(TITLE)};`,
        `SET ${homeId} metadata.description=${JSON.stringify(DESC)};`,
    ].join(NL)
    const r = await framer.agent.applyChanges(dsl, { pagePath: "/" })
    attempts.push({
        via: "applyChanges metadata",
        errors: r.errors,
        warnings: r.warnings,
    })
}

let h = await framer.agent.serialize({ id: homeId, depth: 0 }, {})
attempts.push({ after1: h.attributes })

if (!h.attributes?.metadata?.title) {
    // 2) setAttributes nested metadata
    try {
        await framer.setAttributes(homeId, {
            metadata: { title: TITLE, description: DESC },
        })
        attempts.push({ via: "setAttributes metadata object", ok: true })
    } catch (e) {
        attempts.push({
            via: "setAttributes metadata object",
            err: String(e.message || e),
        })
    }
    h = await framer.agent.serialize({ id: homeId, depth: 0 }, {})
    attempts.push({ after2: h.attributes })
}

if (!h.attributes?.metadata?.title) {
    // 3) page node API if any
    try {
        const node = await framer.getNode(homeId)
        if (node?.setAttributes) {
            await node.setAttributes({ title: TITLE, description: DESC })
            attempts.push({ via: "node.setAttributes title", ok: true })
        } else {
            attempts.push({
                via: "node.setAttributes",
                err: "no method",
                keys: node ? Object.keys(node) : null,
            })
        }
    } catch (e) {
        attempts.push({ via: "node.setAttributes", err: String(e.message || e) })
    }
    h = await framer.agent.serialize({ id: homeId, depth: 0 }, {})
    attempts.push({ after3: h.attributes })
}

console.log(JSON.stringify({ attempts, finalMeta: h.attributes }, null, 2))
