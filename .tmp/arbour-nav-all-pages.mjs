/**
 * Audit Nav instances across all pages × breakpoints.
 * Check: presence, position fixed, width, zIndex, top/left, maxWidth on instance,
 * componentIdentifier consistency, missing replicas.
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

const pages = await framer.getNodesWithType("WebPageNode")
const report = { pages: [], issues: [], summary: {} }

function attrs(n) {
    const a = n?.attributes || {}
    return {
        name: n?.name,
        id: n?.id,
        w: a.width ?? null,
        mw: a.maxWidth ?? null,
        h: a.height ?? null,
        pos: a.position ?? null,
        top: a.top ?? null,
        left: a.left ?? null,
        right: a.right ?? null,
        bottom: a.bottom ?? null,
        z: a.zIndex ?? null,
        pad: a.padding ?? null,
        opacity: a.opacity ?? null,
        visible: a.visible ?? null,
    }
}

for (const path of CONTENT) {
    const p = pages.find((x) => x.path === path)
    if (!p) {
        report.issues.push({ path, kind: "missing-page" })
        continue
    }
    const ser = await framer.agent.serialize({ id: p.id, depth: 2 }, {})
    const pageEntry = { path, breakpoints: [] }

    for (const bp of ser.children || []) {
        const bpName = bp.name || "?"
        const kids = bp.children || []
        const navs = kids.filter(
            (c) =>
                c.name === "Nav" ||
                String(c.componentIdentifier || "").includes("ynpqYJGOd") ||
                /canvasComponent\/ynpqYJGOd/i.test(String(c.componentIdentifier || ""))
        )
        // also deep-ish: sometimes Nav not top-level? depth 2 should catch top
        const topNames = kids.map((c) => c.name)

        const navInfos = []
        for (const nav of navs) {
            const info = {
                ...attrs(nav),
                cid: String(nav.componentIdentifier || "").slice(0, 80),
                index: kids.indexOf(nav),
            }
            navInfos.push(info)

            // Expected: fixed, full width, top/left 0, z high
            if (info.pos !== "fixed") {
                report.issues.push({ path, bp: bpName, id: info.id, kind: "not-fixed", pos: info.pos })
            }
            if (info.w !== "100%" && info.w !== "1fr") {
                // fixed often needs 100%
                report.issues.push({ path, bp: bpName, id: info.id, kind: "width", w: info.w })
            }
            if (info.mw && info.mw !== "100%" && info.mw !== "none") {
                report.issues.push({ path, bp: bpName, id: info.id, kind: "instance-maxWidth", mw: info.mw })
            }
            if (info.top != null && String(info.top) !== "0px" && String(info.top) !== "0") {
                report.issues.push({ path, bp: bpName, id: info.id, kind: "top", top: info.top })
            }
            if (info.left != null && String(info.left) !== "0px" && String(info.left) !== "0") {
                report.issues.push({ path, bp: bpName, id: info.id, kind: "left", left: info.left })
            }
            if (info.z == null || Number(info.z) < 10) {
                report.issues.push({ path, bp: bpName, id: info.id, kind: "zIndex", z: info.z })
            }
            if (info.visible === false) {
                report.issues.push({ path, bp: bpName, id: info.id, kind: "hidden" })
            }
        }

        if (navs.length === 0) {
            report.issues.push({ path, bp: bpName, kind: "missing-nav", topNames })
        } else if (navs.length > 1) {
            report.issues.push({
                path,
                bp: bpName,
                kind: "duplicate-nav",
                count: navs.length,
                ids: navs.map((n) => n.id),
            })
        }

        pageEntry.breakpoints.push({
            bp: bpName,
            navCount: navs.length,
            navs: navInfos,
            navIndex: navInfos[0]?.index ?? null,
            topCount: kids.length,
        })
    }
    report.pages.push(pageEntry)
}

// Component health
const comps = await framer.getNodesWithType("ComponentNode")
const navComp = comps.find((c) => c.name === "Nav")
let compHealth = null
if (navComp) {
    const ser = await framer.agent.serialize({ id: navComp.id, depth: 3 }, {})
    compHealth = {
        id: navComp.id,
        variants: (ser.children || []).map((v) => {
            const a = v.attributes || {}
            const top = (v.children || []).find((c) => c.name === "top")
            const container = (v.children || []).find((c) => c.name === "container")
            const split = container && (container.children || []).find((c) => /Drawer Split/i.test(c.name || ""))
            return {
                name: v.name,
                w: a.width,
                h: a.height,
                pad: a.padding,
                align: a.stackAlignment,
                top: top
                    ? { w: top.attributes?.width, mw: top.attributes?.maxWidth, pad: top.attributes?.padding }
                    : null,
                container: container
                    ? {
                          w: container.attributes?.width,
                          mw: container.attributes?.maxWidth,
                          h: container.attributes?.height,
                      }
                    : null,
                split: split
                    ? {
                          w: split.attributes?.width,
                          mw: split.attributes?.maxWidth,
                          pad: split.attributes?.padding,
                      }
                    : null,
            }
        }),
    }
}

// Matrix for quick scan
const matrix = []
for (const p of report.pages) {
    for (const b of p.breakpoints) {
        const n = b.navs[0]
        matrix.push({
            path: p.path,
            bp: b.bp,
            ok: b.navCount === 1 && n?.pos === "fixed" && (n?.w === "100%" || n?.w === "1fr"),
            pos: n?.pos,
            w: n?.w,
            mw: n?.mw,
            z: n?.z,
            top: n?.top,
            left: n?.left,
            idx: b.navIndex,
        })
    }
}

report.summary = {
    issueCount: report.issues.length,
    matrixOk: matrix.filter((m) => m.ok).length,
    matrixTotal: matrix.length,
}
report.matrix = matrix
report.compHealth = compHealth

return report
