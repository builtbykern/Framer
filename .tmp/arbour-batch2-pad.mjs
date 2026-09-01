const NL = String.fromCharCode(10)
const pages = await framer.getNodesWithType("WebPageNode")
const byPath = {}
for (const p of pages || []) if (p.path) byPath[p.path] = p

async function apply(label, lines, pagePath) {
    if (!lines.length) return { label, skipped: true }
    try {
        const r = await framer.agent.applyChanges(lines.join(NL), pagePath ? { pagePath } : {})
        return { label, ok: true, errors: r.errors || [] }
    } catch (e) {
        return { label, ok: false, err: String(e.message || e) }
    }
}

async function findByName(path, name) {
    const page = byPath[path]
    if (!page) return null
    const ser = await framer.agent.serialize({ id: page.id, depth: 6 }, {})
    let hit = null
    function walk(n) {
        if (!n || hit) return
        if (n.name === name) hit = n
        for (const c of n.children || []) walk(c)
    }
    walk(ser)
    return hit
}

const results = []

// Padding property detail
{
    const lines = []
    for (const [name, pad] of [
        ["The Setting", "128px 48px 128px 48px"],
        ["Property Particulars", "128px 48px 128px 48px"],
        ["Cinematic Gallery", "0px 48px 128px 48px"],
        ["Property Hero", "128px 48px 128px 48px"],
        ["Chapter Intro", "128px 48px 128px 48px"],
    ]) {
        const n = await findByName("/properties/:slug", name)
        if (n?.id) lines.push(`SET ${n.id} padding="${pad}";`)
        else results.push({ miss: name, path: "/properties/:slug" })
    }
    results.push(await apply("pad-prop-detail", lines, null))
}

// Notes Journal desktop + phone
{
    const lines = []
    const n = await findByName("/notes", "Journal")
    if (n?.id) lines.push(`SET ${n.id} padding="128px 48px 0px 48px";`)
    const ser = await framer.agent.serialize({ id: byPath["/notes"].id, depth: 3 }, {})
    const phone = (ser.children || []).find((c) => c.name === "Phone")
    const journal = (phone?.children || []).find((c) => c.name === "Journal")
    if (journal?.id) lines.push(`SET ${journal.id} padding="64px 16px 0px 16px";`)
    results.push(await apply("pad-notes", lines, "/notes"))
}

// Neighbourhoods 124px → 128
{
    const ser = await framer.agent.serialize({ id: byPath["/neighbourhoods"].id, depth: 5 }, {})
    const lines = []
    function walk(n) {
        if (!n) return
        const pad = n.attributes?.padding
        if (pad && String(pad).includes("124px") && n.id) {
            lines.push(`SET ${n.id} padding="128px 48px 128px 48px";`)
        }
        // also catch 112/144 on this page if any
        if (pad && (/^112px |^144px /.test(String(pad))) && n.id) {
            lines.push(`SET ${n.id} padding="128px 48px 128px 48px";`)
        }
        for (const c of n.children || []) walk(c)
    }
    walk(ser)
    results.push(await apply("pad-nh", lines, "/neighbourhoods"))
}

// Property detail also fix remaining 112/144 via scan
{
    const ser = await framer.agent.serialize({ id: byPath["/properties/:slug"].id, depth: 5 }, {})
    const lines = []
    function walk(n) {
        if (!n) return
        const pad = String(n.attributes?.padding || "")
        if ((pad.includes("112px") || pad.includes("144px")) && n.id) {
            // keep horizontal 48; normalize vertical to 128 except zero tops for gallery
            if (pad.startsWith("0px")) {
                lines.push(`SET ${n.id} padding="0px 48px 128px 48px";`)
            } else {
                lines.push(`SET ${n.id} padding="128px 48px 128px 48px";`)
            }
        }
        for (const c of n.children || []) walk(c)
    }
    walk(ser)
    results.push({ scan112: lines.length, ...(await apply("pad-prop-scan", lines, null)) })
}

console.log(JSON.stringify(results, null, 2))
