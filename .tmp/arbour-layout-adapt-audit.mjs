/**
 * Read-only layout adaptation audit — Arbour content pages × Desktop/Tablet/Phone.
 * 1) Nav: fixed, w=100%, z>=10 (skip /404)
 * 2) width|maxWidth 90% + horizontal padding → BAD
 * 3) Alt-fill shells (distinct fill vs paper parent) still maxWidth 90% → should be 100%
 * 4) Home Hero Section uncapped; Text Content Column 90%
 * 5) Footer instance no maxWidth; Editorial Grid 90%
 * 6) Leftover maxWidth 1200/1440/1680/80%/85% on content nodes
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
]

const PAPER_TOKEN = "d5b3c09d-0364-4ed0-8804-e56957faa275"
const SKIP_ATMOS = /Atmosphere|Cue|ScrollCue|Noise|Mesh|Gradient Overlay|Image Layer|Bottom Parallax|Drawer|Menu Icon|logo|hamburger|Status|Arbour_StopScroll/i
const BP_KEEP = /^(Desktop|Tablet|Phone)$/i
const LEFTOVER_MW = /^(1200|1440|1680|1100|1000|1280)px$|^80%$|^85%$/

function fillStr(a = {}) {
    const f = a.fill ?? a.backgroundColor
    if (f == null || f === "" || f === "null" || f === "none") return null
    return String(f)
}

function isPaperish(f) {
    if (!f) return false
    return f.includes(PAPER_TOKEN)
}

function hasFill(a = {}) {
    return !!fillStr(a)
}

function parsePad(pad) {
    if (!pad) return null
    const p = String(pad).trim().split(/\s+/)
    if (p.length === 4) return { t: p[0], r: p[1], b: p[2], l: p[3], raw: String(pad) }
    if (p.length === 2) return { t: p[0], r: p[1], b: p[0], l: p[1], raw: String(pad) }
    if (p.length === 1) return { t: p[0], r: p[0], b: p[0], l: p[0], raw: String(pad) }
    if (p.length === 3) return { t: p[0], r: p[1], b: p[2], l: p[1], raw: String(pad) }
    return null
}

function hasHorizontalPad(p) {
    if (!p) return false
    const z = (v) => v === "0" || v === "0px"
    return !z(p.r) || !z(p.l)
}

function is90(a = {}) {
    const w = a.width != null ? String(a.width) : ""
    const mw = a.maxWidth != null ? String(a.maxWidth) : ""
    return w === "90%" || mw === "90%"
}

function isContentBp(name) {
    // Framer page breakpoint frames are Desktop / Tablet / Phone
    return BP_KEEP.test(String(name || "").trim())
}

function navAttrs(n) {
    const a = n?.attributes || {}
    return {
        id: n?.id,
        name: n?.name,
        pos: a.position ?? null,
        w: a.width ?? null,
        mw: a.maxWidth ?? null,
        z: a.zIndex ?? null,
        top: a.top ?? null,
        left: a.left ?? null,
    }
}

function isNavNode(n) {
    return (
        n?.name === "Nav" ||
        String(n?.componentIdentifier || "").includes("ynpqYJGOd") ||
        /canvasComponent\/ynpqYJGOd/i.test(String(n?.componentIdentifier || ""))
    )
}

function isFooterNode(n) {
    return (
        n?.name === "Footer" ||
        String(n?.componentIdentifier || "").includes("pXUahiblU") ||
        /canvasComponent\/pXUahiblU/i.test(String(n?.componentIdentifier || ""))
    )
}

const navBad = []
const navOk = []
const hpadBad = []
const altFillBad = []
const homeHero = []
const footerInstanceBad = []
const footerGrid = []
const leftovers = []
const missingPages = []
const bpMatrix = []

const pages = await framer.getNodesWithType("WebPageNode")
const comps = await framer.getNodesWithType("ComponentNode")

for (const path of CONTENT) {
    const p = pages.find((x) => x.path === path)
    if (!p) {
        missingPages.push(path)
        continue
    }
    const ser = await framer.agent.serialize({ id: p.id, depth: 12 }, {})

    for (const bp of ser.children || []) {
        if (!isContentBp(bp.name)) continue
        const bpName = bp.name
        bpMatrix.push({ path, bp: bpName })

        // --- 1) Nav ---
        const kids = bp.children || []
        const navs = kids.filter(isNavNode)
        if (navs.length === 0) {
            navBad.push({ path, bp: bpName, kind: "missing-nav", id: null })
        } else {
            for (const nav of navs) {
                const info = navAttrs(nav)
                const zNum = info.z == null ? null : Number(info.z)
                const issues = []
                if (info.pos !== "fixed") issues.push(`pos=${info.pos}`)
                if (info.w !== "100%") issues.push(`w=${info.w}`)
                if (zNum == null || Number.isNaN(zNum) || zNum < 10) issues.push(`z=${info.z}`)
                const entry = { path, bp: bpName, ...info, issues }
                if (issues.length) navBad.push(entry)
                else navOk.push(entry)
            }
            if (navs.length > 1) {
                navBad.push({
                    path,
                    bp: bpName,
                    kind: "duplicate-nav",
                    ids: navs.map((n) => n.id),
                })
            }
        }

        // --- 5) Footer instance ---
        const footers = kids.filter(isFooterNode)
        for (const f of footers) {
            const a = f.attributes || {}
            const mw = a.maxWidth != null ? String(a.maxWidth) : null
            if (mw && mw !== "null" && mw !== "none" && mw !== "100%") {
                footerInstanceBad.push({
                    path,
                    bp: bpName,
                    id: f.id,
                    name: f.name,
                    mw,
                    w: a.width ?? null,
                })
            }
        }

        // Walk tree for 2, 3, 4, 6
        function walk(n, trail, d, parentFill) {
            if (!n || d > 12) return
            const name = n.name || "(unnamed)"
            const a = n.attributes || {}
            const fill = fillStr(a)
            const mw = a.maxWidth != null ? String(a.maxWidth) : null
            const w = a.width != null ? String(a.width) : null
            const pad = a.padding != null ? String(a.padding) : null
            const nextTrail = trail + "/" + name

            if (SKIP_ATMOS.test(name) && d > 0 && name !== "Nav" && name !== "Footer") {
                // still scan leftovers lightly under atmos? skip deep content rules
                for (const c of n.children || []) walk(c, nextTrail, d + 1, fill ?? parentFill)
                return
            }

            // --- 2) 90% + horizontal pad ---
            if (is90(a) && hasHorizontalPad(parsePad(pad))) {
                hpadBad.push({
                    path,
                    bp: bpName,
                    name,
                    id: n.id,
                    w,
                    mw,
                    pad,
                    trail: nextTrail,
                })
            }

            // --- 3) Alt-fill shell wrongly capped at 90% ---
            // Filled shells with DISTINCT fill from paper parent (or non-paper fill at top)
            // that still have maxWidth/width 90% — should bleed 100%
            const distinctFromPaperParent =
                fill &&
                !isPaperish(fill) &&
                (parentFill == null || isPaperish(parentFill) || fill !== parentFill)
            const looksShell =
                d <= 4 &&
                !/Image|Media|Portrait|Photo|Card|Icon|Button|Link|Label|Badge/i.test(name) &&
                n.attributes?.position !== "absolute"
            if (
                distinctFromPaperParent &&
                looksShell &&
                (mw === "90%" || w === "90%") &&
                !isNavNode(n) &&
                !isFooterNode(n)
            ) {
                altFillBad.push({
                    path,
                    bp: bpName,
                    name,
                    id: n.id,
                    w,
                    mw,
                    fill: fill.slice(0, 72),
                    parentFill: parentFill ? String(parentFill).slice(0, 72) : null,
                    pad,
                    trail: nextTrail,
                    depth: d,
                })
            }

            // --- 4) Home Hero ---
            if (path === "/" && name === "Hero Section") {
                const textCol = (n.children || []).find((c) => c.name === "Text Content Column")
                const shellOk =
                    (w === "100%" || w === "1fr" || !w) &&
                    (!mw || mw === "100%" || mw === "null" || mw === "none")
                const tc = textCol
                    ? {
                          id: textCol.id,
                          w: textCol.attributes?.width ?? null,
                          mw: textCol.attributes?.maxWidth ?? null,
                          pad: textCol.attributes?.padding ?? null,
                      }
                    : null
                const tcOk = tc && (String(tc.mw) === "90%" || String(tc.w) === "90%")
                homeHero.push({
                    path,
                    bp: bpName,
                    id: n.id,
                    w,
                    mw,
                    pad,
                    shellOk,
                    textCol: tc,
                    textColOk: !!tcOk,
                    issues: [
                        ...(!shellOk ? [`shell w=${w} mw=${mw}`] : []),
                        ...(!textCol ? ["missing Text Content Column"] : []),
                        ...(textCol && !tcOk ? [`Text Content Column w=${tc.w} mw=${tc.mw}`] : []),
                    ],
                })
            }

            // --- 6) leftover maxWidth ---
            if (mw && LEFTOVER_MW.test(mw)) {
                leftovers.push({
                    path,
                    bp: bpName,
                    name,
                    id: n.id,
                    mw,
                    w,
                    filled: hasFill(a),
                    trail: nextTrail,
                    depth: d,
                })
            }

            for (const c of n.children || []) {
                walk(c, nextTrail, d + 1, fill ?? parentFill)
            }
        }

        const pageFill = fillStr(bp.attributes || {})
        for (const top of kids) {
            walk(top, path, 1, pageFill)
        }
    }
}

// --- 5b) Footer component Editorial Grid ---
const footComp = comps.find((c) => c.name === "Footer")
if (footComp) {
    const ser = await framer.agent.serialize({ id: footComp.id, depth: 5 }, {})
    for (const v of ser.children || []) {
        // Footer variants often named Desktop / Tablet / Phone
        const grids = []
        function findGrid(n, d = 0) {
            if (!n || d > 6) return
            if (/Editorial Grid/i.test(n.name || "")) grids.push(n)
            for (const c of n.children || []) findGrid(c, d + 1)
        }
        findGrid(v)
        for (const g of grids) {
            const a = g.attributes || {}
            const mw = a.maxWidth != null ? String(a.maxWidth) : null
            const w = a.width != null ? String(a.width) : null
            const ok = mw === "90%" || w === "90%"
            footerGrid.push({
                variant: v.name,
                id: g.id,
                name: g.name,
                w,
                mw,
                pad: a.padding ?? null,
                ok,
                issue: ok ? null : `expected 90%, got w=${w} mw=${mw}`,
            })
        }
        // also leftover MW inside footer variants
        function walkFoot(n, trail, d = 0) {
            if (!n || d > 8) return
            const a = n.attributes || {}
            const mw = a.maxWidth != null ? String(a.maxWidth) : null
            if (mw && LEFTOVER_MW.test(mw)) {
                leftovers.push({
                    path: "comp:Footer",
                    bp: v.name,
                    name: n.name || "(unnamed)",
                    id: n.id,
                    mw,
                    w: a.width ?? null,
                    filled: hasFill(a),
                    trail: trail + "/" + (n.name || "?"),
                    depth: d,
                })
            }
            if (is90(a) && hasHorizontalPad(parsePad(a.padding))) {
                hpadBad.push({
                    path: "comp:Footer",
                    bp: v.name,
                    name: n.name || "(unnamed)",
                    id: n.id,
                    w: a.width ?? null,
                    mw,
                    pad: a.padding != null ? String(a.padding) : null,
                    trail: trail + "/" + (n.name || "?"),
                })
            }
            for (const c of n.children || []) walkFoot(c, trail + "/" + (n.name || "?"), d + 1)
        }
        walkFoot(v, "Footer/" + (v.name || "?"), 0)
    }
}

// Nav component: also check 90%+hpad on top bars (optional signal)
const navComp = comps.find((c) => c.name === "Nav")
if (navComp) {
    const ser = await framer.agent.serialize({ id: navComp.id, depth: 6 }, {})
    for (const v of ser.children || []) {
        function walkNav(n, trail, d = 0) {
            if (!n || d > 8) return
            const a = n.attributes || {}
            const mw = a.maxWidth != null ? String(a.maxWidth) : null
            if (mw && LEFTOVER_MW.test(mw)) {
                leftovers.push({
                    path: "comp:Nav",
                    bp: v.name,
                    name: n.name || "(unnamed)",
                    id: n.id,
                    mw,
                    w: a.width ?? null,
                    filled: hasFill(a),
                    trail,
                    depth: d,
                })
            }
            if (is90(a) && hasHorizontalPad(parsePad(a.padding))) {
                hpadBad.push({
                    path: "comp:Nav",
                    bp: v.name,
                    name: n.name || "(unnamed)",
                    id: n.id,
                    w: a.width ?? null,
                    mw,
                    pad: a.padding != null ? String(a.padding) : null,
                    trail,
                })
            }
            for (const c of n.children || []) {
                walkNav(c, trail + "/" + (n.name || "?"), d + 1)
            }
        }
        walkNav(v, "Nav/" + (v.name || "?"), 0)
    }
}

const homeHeroBad = homeHero.filter((h) => !h.shellOk || !h.textColOk)
const footerGridBad = footerGrid.filter((g) => !g.ok)

return {
    meta: {
        contentPages: CONTENT.length,
        missingPages,
        bpChecks: bpMatrix.length,
        note: "Read-only; skip /404 for Nav rule",
    },
    counts: {
        navBad: navBad.length,
        navOk: navOk.length,
        hpadBad: hpadBad.length,
        altFillBad: altFillBad.length,
        homeHeroChecked: homeHero.length,
        homeHeroBad: homeHeroBad.length,
        footerInstanceBad: footerInstanceBad.length,
        footerGridChecked: footerGrid.length,
        footerGridBad: footerGridBad.length,
        leftovers: leftovers.length,
    },
    navBad,
    hpadBad,
    altFillBad,
    homeHero,
    homeHeroBad,
    footerInstanceBad,
    footerGrid,
    footerGridBad,
    leftovers,
}
