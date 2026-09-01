/**
 * Canon: BGs full-bleed (no maxWidth); content sections maxWidth 1200.
 * - Clear Footer instance + Footer variant-root maxWidth
 * - Cap Footer Editorial Grid + copyright row at 1200; center variant stacks
 * - Keep Rail + Paper Mesh uncapped
 * - Fix Atmosphere width=1200 → 100%; clear maxWidth on BG page shells
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
const BG_NAME = /Atmosphere|Noise|Blur|Mesh|Progressive|Loading|Smooth/i

const pages = await framer.getNodesWithType("WebPageNode")
const comps = await framer.getNodesWithType("ComponentNode")
const footerComp = comps.find((c) => c.name === "Footer")

const lines = []
const notes = []

if (footerComp) {
    const ser = await framer.agent.serialize({ id: footerComp.id, depth: 3 }, {})
    for (const bp of ser.children || []) {
        if (bp.attributes?.maxWidth) {
            lines.push(`SET ${bp.id} maxWidth="null";`)
            notes.push(`FooterComp|${bp.name} root clear maxW`)
        }
        if (bp.attributes?.stackAlignment !== "center") {
            lines.push(`SET ${bp.id} stackAlignment="center";`)
            notes.push(`FooterComp|${bp.name} align→center`)
        }

        for (const c of bp.children || []) {
            const name = c.name || ""
            if (/Editorial Property Rail|Paper Mesh|Atmosphere/i.test(name)) {
                if (c.attributes?.maxWidth) {
                    lines.push(`SET ${c.id} maxWidth="null";`)
                    notes.push(`FooterComp|${bp.name}|${name} BG clear`)
                }
                // rail/mesh should be full width of footer
                if (c.attributes?.width !== "100%" && c.attributes?.width !== "1fr") {
                    lines.push(`SET ${c.id} width="100%";`)
                    notes.push(`FooterComp|${bp.name}|${name} width→100%`)
                }
                continue
            }

            if (/Footer Editorial Grid/i.test(name)) {
                if (c.attributes?.maxWidth !== "1200px") {
                    lines.push(`SET ${c.id} maxWidth="1200px";`)
                    notes.push(`FooterComp|${bp.name}|Grid →1200`)
                }
                if (c.attributes?.width !== "1fr" && c.attributes?.width !== "100%") {
                    lines.push(`SET ${c.id} width="1fr";`)
                    notes.push(`FooterComp|${bp.name}|Grid width→1fr`)
                }
                continue
            }

            // Copyright / bottom bar: pad includes horizontal gutter, not rail/mesh
            const pad = String(c.attributes?.padding || "")
            const looksLikeBar =
                (/24px/.test(pad) && /(48|40|16)px/.test(pad)) ||
                /Copyright|Legal Bar|Bottom Bar|Footer Bar/i.test(name)
            if (looksLikeBar) {
                if (c.attributes?.maxWidth !== "1200px") {
                    lines.push(`SET ${c.id} maxWidth="1200px";`)
                    notes.push(
                        `FooterComp|${bp.name}|${name || "bar"} →1200 pad=${pad}`,
                    )
                }
                if (c.attributes?.width !== "1fr" && c.attributes?.width !== "100%") {
                    lines.push(`SET ${c.id} width="1fr";`)
                }
            }
        }
    }
}

for (const path of CONTENT) {
    const p = pages.find((x) => x.path === path)
    if (!p) continue
    const ser = await framer.agent.serialize({ id: p.id, depth: 2 }, {})
    for (const bp of ser.children || []) {
        for (const c of bp.children || []) {
            if (c.name === "Footer" && c.attributes?.maxWidth) {
                lines.push(`SET ${c.id} maxWidth="null";`)
                notes.push(`${path}|${bp.name}|Footer clear maxW`)
            }
            if (BG_NAME.test(c.name || "") && c.attributes?.maxWidth) {
                lines.push(`SET ${c.id} maxWidth="null";`)
                notes.push(`${path}|${bp.name}|${c.name} BG clear maxW`)
            }
            if (/Atmosphere/i.test(c.name || "") && c.attributes?.width === "1200px") {
                lines.push(`SET ${c.id} width="100%";`)
                notes.push(`${path}|${bp.name}|${c.name} width→100%`)
            }
        }
    }
}

if (!lines.length) return { applied: 0, notes: ["noop"] }

const result = await framer.agent.applyChanges(lines.join("\n"), {})
return { applied: lines.length, notes, result: result?.message || result }
