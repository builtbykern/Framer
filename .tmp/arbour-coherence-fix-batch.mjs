/**
 * Coherence fix batch (skip TerritoryRail):
 * 1) Home: add Atmosphere shell (no Noise) after SmoothScroll — order gold
 * 2) /404: Loading + Smooth + Atmosphere + Nav(fixed) + Footer
 * 3) Neighbourhoods TerritoryHoverMedia accent → Chartreuse token
 */
const NL = String.fromCharCode(10)
const CHARTREUSE = "var(--token-db86917b-d19e-4fd7-8dc5-e260f1f35cb1)"
const LOAD = "codeFile/QsH9B_M:default"
const SMOOTH = "codeFile/lKYHG0I:default"
const NAV = "ynpqYJGOd"
const FOOTER = "pXUahiblU"

function rid(prefix) {
    return prefix + Math.random().toString(36).slice(2, 9)
}

const pages = await framer.getNodesWithType("WebPageNode")
const lines = []
const notes = []

// --- Home Atmosphere ---
const home = pages.find((p) => p.path === "/")
const serH = await framer.agent.serialize({ id: home.id, depth: 2 }, {})
for (const bp of serH.children || []) {
    const hasAtm = (bp.children || []).some((c) => c.name === "Atmosphere")
    if (hasAtm) {
        notes.push(`Home ${bp.name}: Atmosphere already present`)
        continue
    }
    const smooth = (bp.children || []).find((c) => /SmoothScroll/i.test(c.name || ""))
    const nav = (bp.children || []).find((c) => c.name === "Nav")
    const atmId = rid("atmH")
    // insert at index of Nav (pushes Nav down) — prefer after Smooth
    const idx = smooth
        ? (bp.children || []).findIndex((c) => c.id === smooth.id) + 1
        : 2
    lines.push(
        `+FrameNode ${atmId} parent="${bp.id}" index="${idx}" name="Atmosphere" position="absolute" left="0px" top="0px" width="100%" height="100%" pointerEvents="none" zIndex="1";`,
    )
    notes.push(`Home ${bp.name}: +Atmosphere ${atmId} @${idx}`)
}

// --- 404 shell ---
const p404 = pages.find((p) => p.path === "/404")
const ser404 = await framer.agent.serialize({ id: p404.id, depth: 3 }, {})
for (const bp of ser404.children || []) {
    const kids = bp.children || []
    const hasNav = kids.some((c) => c.name === "Nav")
    const hasLoad = kids.some((c) => /LoadingScreen/i.test(c.name || ""))
    if (hasNav && hasLoad) {
        notes.push(`404 ${bp.name}: shell already present`)
        continue
    }
    const loadId = rid("ld4")
    const smoothId = rid("sm4")
    const atmId = rid("at4")
    const navId = rid("nv4")
    const footId = rid("ft4")
    // Prepend chrome; keep existing content; append footer
    let i = 0
    if (!hasLoad) {
        lines.push(
            `+ComponentInstanceNode ${loadId} parent="${bp.id}" index="${i++}" name="Arbour_LoadingScreen" component="${LOAD}" position="relative" width="1fr" height="auto";`,
        )
        lines.push(
            `+ComponentInstanceNode ${smoothId} parent="${bp.id}" index="${i++}" name="Arbour_SmoothScroll" component="${SMOOTH}" position="relative" width="1fr" height="auto";`,
        )
        lines.push(
            `+FrameNode ${atmId} parent="${bp.id}" index="${i++}" name="Atmosphere" position="absolute" left="0px" top="0px" width="100%" height="100%" pointerEvents="none" zIndex="1";`,
        )
    }
    if (!hasNav) {
        lines.push(
            `+ComponentInstanceNode ${navId} parent="${bp.id}" index="${i++}" name="Nav" component="${NAV}" position="fixed" top="0px" left="0px" width="100%" height="auto" zIndex="10" $control__variant="Desktop";`,
        )
    }
    const hasFooter = kids.some((c) => c.name === "Footer")
    if (!hasFooter) {
        lines.push(
            `+ComponentInstanceNode ${footId} parent="${bp.id}" index="${kids.length + 8}" name="Footer" component="${FOOTER}" position="relative" width="1fr" height="auto";`,
        )
    }
    notes.push(`404 ${bp.name}: shell chrome added`)
}

// --- Hover media accent token ---
const nh = pages.find((p) => p.path === "/neighbourhoods")
const serN = await framer.agent.serialize({ id: nh.id, depth: 8 }, {})
function walkHover(n) {
    if (!n) return
    const display = n.attributes?.$componentDisplayName || ""
    if (/TerritoryHover/i.test(n.name || display)) {
        const accent = n.attributes?.$control__accent || ""
        if (accent.startsWith("#") || accent.startsWith("rgb")) {
            lines.push(`SET ${n.id} $control__accent="${CHARTREUSE}";`)
            notes.push(`HoverMedia ${n.id} accent → Chartreuse token`)
        }
    }
    for (const c of n.children || []) walkHover(c)
}
for (const bp of serN.children || []) walkHover(bp)

const result = await framer.agent.applyChanges(lines.join(NL), {})
return { n: lines.length, notes, result }
