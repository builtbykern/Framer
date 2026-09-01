/**
 * Inspect Nav/Footer component links + notes journal cards.
 */
const comps = []
for (const type of ["ComponentNode"]) {
    try {
        const nodes = await framer.getNodesWithType(type)
        for (const n of nodes) {
            const s = await framer.agent.serialize({ id: n.id, depth: 0 }, {})
            const name = s.name || n.name || ""
            if (/nav|footer/i.test(name)) {
                comps.push({ id: n.id, name, type: s.type })
            }
        }
    } catch (_) {}
}

// Also search by walking home for Nav/Footer instance ids then get component
const home = await framer.agent.serialize({ id: "augiA20Il", depth: 3 }, {})
const chrome = []
function walkChrome(n) {
    if (!n) return
    const name = n.name || n.$componentDisplayName || ""
    if (/^Nav$|^Footer$/i.test(name) || name === "Nav" || name === "Footer") {
        chrome.push({
            id: n.id,
            name,
            component: n.component,
            type: n.type,
        })
    }
    for (const c of n.children || []) walkChrome(c)
}
walkChrome(home)

async function harvestLinks(rootId, label) {
    const tree = await framer.agent.serialize({ id: rootId, depth: 12 }, {})
    const out = []
    function walk(n) {
        if (!n || typeof n !== "object") return
        const href = n.attributes?.link?.href
        if (href) {
            out.push({
                id: n.id,
                name: n.name || n.$componentDisplayName,
                href,
                collectionItem: n.attributes?.link?.collectionItem || null,
            })
        }
        // underline link controls
        const cHref = n.attributes?.["$control__link"] || n.attributes?.["$control__href"]
        if (cHref) out.push({ id: n.id, name: n.name, controlLink: cHref })
        for (const c of n.children || []) walk(c)
        for (const b of n.$breakpoints || []) walk(b)
        // component variants
        for (const v of n.$variants || n.variants || []) walk(v)
        for (const v of n.children || []) {
            /* already */
        }
    }
    walk(tree)
    return { label, rootId, links: out, unique: [...new Set(out.map((l) => l.href || JSON.stringify(l.controlLink)))] }
}

const results = { chrome, comps }
if (chrome[0]) {
    // serialize component master if component id looks like component node
    const navInst = chrome.find((c) => c.name === "Nav")
    const footInst = chrome.find((c) => c.name === "Footer")
    if (navInst?.component) {
        // component property might be component node id
        results.nav = await harvestLinks(navInst.component, "Nav component " + navInst.component)
    }
    if (footInst?.component) {
        results.footer = await harvestLinks(footInst.component, "Footer " + footInst.component)
    }
    // also try known ids from earlier audits
}

// Try explicit known component ids from prior work
for (const [label, id] of [
    ["Nav ynpqYJGOd", "ynpqYJGOd"],
    ["Footer pXUahiblU", "pXUahiblU"],
]) {
    try {
        results[label] = await harvestLinks(id, label)
    } catch (e) {
        results[label] = { error: String(e.message || e) }
    }
}

// Notes journal cards — look for links to notes/:slug
const notes = await framer.agent.serialize({ id: "s8RpZIiJ8", depth: 12 }, {})
const notesLinks = []
function walkN(n) {
    if (!n || typeof n !== "object") return
    if (n.attributes?.link?.href) {
        notesLinks.push({
            id: n.id,
            name: n.name,
            href: n.attributes.link.href,
            collectionItem: n.attributes.link.collectionItem,
        })
    }
    for (const c of n.children || []) walkN(c)
    for (const b of n.$breakpoints || []) walkN(b)
}
walkN(notes)
results.notesPageLinks = notesLinks

console.log(JSON.stringify(results, null, 2))
