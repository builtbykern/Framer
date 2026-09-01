/**
 * Shell chrome + SEO + publish snapshot for template audit.
 */
const CONTENT = [
    "/",
    "/properties",
    "/neighbourhoods",
    "/notes",
    "/about",
    "/contact",
    "/properties/:slug",
    "/notes/:slug",
    "/404",
]

const WANT = [
    "Atmosphere",
    "Noise",
    "Scroll Blur",
    "ScrollCue",
    "Nav",
    "Footer",
]

const pages = await framer.getNodesWithType("WebPageNode")
const shell = []
const seo = []

for (const path of CONTENT) {
    const p = pages.find((x) => x.path === path)
    if (!p) {
        shell.push({ path, missing: true })
        continue
    }
    seo.push({
        path,
        title: p.title || p.attributes?.title || null,
        description: p.description || p.attributes?.description || null,
        id: p.id,
    })
    // try serialize metadata
    try {
        const meta = await framer.getPage?.(p.id)
    } catch (_) {}

    const ser = await framer.agent.serialize({ id: p.id, depth: 2 }, {})
    for (const bp of ser.children || []) {
        const names = (bp.children || []).map((c) => c.name || "")
        const hit = {}
        for (const w of WANT) {
            hit[w] = names.some((n) => {
                if (w === "Noise") return /Noise/i.test(n)
                if (w === "Scroll Blur") return /Scroll\s*Blur|ScrollBlur/i.test(n)
                if (w === "ScrollCue") return /ScrollCue|Scroll Cue/i.test(n)
                return n === w || new RegExp(w, "i").test(n)
            })
        }
        // also code instances
        for (const c of bp.children || []) {
            const cid = String(c.componentIdentifier || "")
            if (/Noise|IwchU7y|kmpDjW2|u52bylu/i.test(cid + (c.name || ""))) hit["Noise"] = true
            if (/ScrollBlur|duUI10n|yC_uQFE|Scroll Blur/i.test(cid + (c.name || ""))) hit["Scroll Blur"] = true
            if (/ScrollCue|GruqKYi/i.test(cid + (c.name || ""))) hit["ScrollCue"] = true
            if (/ynpqYJGOd/i.test(cid)) hit["Nav"] = true
            if (/pXUahiblU|Footer/i.test(cid + (c.name || ""))) hit["Footer"] = true
        }
        shell.push({ path, bp: bp.name, hit, top: names.slice(0, 14) })
    }
}

// Page SEO via agent if available
const seo2 = []
for (const path of CONTENT) {
    const p = pages.find((x) => x.path === path)
    if (!p) continue
    let title = null
    let description = null
    try {
        const s = await framer.agent.serialize({ id: p.id, depth: 0 }, {})
        title = s.attributes?.title ?? s.title ?? null
        description = s.attributes?.description ?? s.description ?? null
    } catch (_) {}
    // framer.getPublishInfo / page fields
    seo2.push({
        path,
        name: p.name,
        title: p.title ?? title,
        description: p.description ?? description,
        keys: Object.keys(p).slice(0, 20),
    })
}

const pub = await framer.getPublishInfo()

return {
    shell,
    seo2,
    publish: {
        production: pub?.production,
        staging: pub?.staging,
    },
}
