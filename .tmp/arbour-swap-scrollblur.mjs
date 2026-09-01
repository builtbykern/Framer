/**
 * Replace Arbour_ProgressiveBlur with BuiltByKern_ScrollBlur across Arbour.
 * 1) createCodeFile from local source
 * 2) add Scroll Blur at each Desktop ProgressiveBlur parent
 * 3) DEL ProgressiveBlur primaries
 * 4) remove ProgressiveBlur code file
 */
const fs = require("fs")
const NL = String.fromCharCode(10)

const CODE = fs.readFileSync(
    "/Users/noel/Desktop/Framer/code-components/BuiltByKern_ScrollBlur.tsx",
    "utf8",
)

const notes = []

// --- 1) Create or update code file ---
let files = await framer.getCodeFiles()
let scrollFile = files.find((f) => f.name === "BuiltByKern_ScrollBlur.tsx")
if (!scrollFile) {
    scrollFile = await framer.createCodeFile("BuiltByKern_ScrollBlur.tsx", CODE)
    notes.push(`created code file ${scrollFile.id}`)
} else {
    await scrollFile.setFileContent(CODE)
    notes.push(`updated code file ${scrollFile.id}`)
}

files = await framer.getCodeFiles()
scrollFile = files.find((f) => f.name === "BuiltByKern_ScrollBlur.tsx")
const insertURL = scrollFile.exports?.[0]?.insertURL
if (!insertURL) throw new Error("No insertURL for ScrollBlur")
notes.push(`insertURL ${insertURL}`)

// --- 2) Inventory ProgressiveBlur Desktop primaries ---
const pages = await framer.getNodesWithType("WebPageNode")
const targets = []

for (const p of pages || []) {
    if (!p.path) continue
    const ser = await framer.agent.serialize({ id: p.id, depth: 5 }, {})
    const desk = (ser.children || []).find((c) => c.name === "Desktop")
    if (!desk) continue
    function walk(n, parent) {
        if (!n) return
        if ((n.name || "").includes("ProgressiveBlur")) {
            const a = n.attributes || {}
            targets.push({
                path: p.path,
                id: n.id,
                parentId: parent?.id || desk.id,
                parentName: parent?.name || "Desktop",
                opacity: a.opacity != null ? Number(a.opacity) : 1,
                w: a.width || "100%",
                h: a.height || "120px",
                pos: a.position || "absolute",
                bottom: a.bottom === "null" ? null : a.bottom || "0px",
                top: a.top === "null" ? null : a.top,
                left: a.left === "null" ? null : a.left,
                right: a.right === "null" ? null : a.right,
                z: a.zIndex != null ? Number(a.zIndex) : undefined,
                oldStrength: Number(a["$control__strength"] || 2),
            })
        }
        for (const c of n.children || []) walk(c, n)
    }
    walk(desk, null)
}

notes.push(`targets ${targets.length}`)

const created = []
const failed = []

for (const t of targets) {
    // Map soft ProgressiveBlur → ScrollBlur strength (min 2)
    const strength = t.path === "/" ? 3 : 2
    const attrs = {
        name: "Scroll Blur",
        opacity: t.opacity,
        position: t.pos === "fixed" ? "fixed" : "absolute",
        width: t.w === "auto" ? "100%" : t.w,
        height: t.h,
        bottom: t.bottom || "0px",
        left: t.left || "0px",
        right: t.right || "0px",
        pointerEvents: "none",
        controls: {
            shape: "edge",
            position: "bottom",
            strength,
            mode: "Always On",
            settleMs: 280,
        },
    }
    if (t.z != null) attrs.zIndex = t.z
    if (t.pos === "fixed") {
        attrs.top = null
        // fixed home bar
    }

    try {
        const node = await framer.addComponentInstance({
            url: insertURL,
            parentId: t.parentId,
            attributes: attrs,
        })
        if (node?.id) {
            created.push({ path: t.path, newId: node.id, oldId: t.id, parentId: t.parentId })
            notes.push(`added ScrollBlur on ${t.path} → ${node.id}`)
        } else {
            failed.push({ path: t.path, reason: "null node", parentId: t.parentId })
        }
    } catch (e) {
        failed.push({ path: t.path, reason: String(e).slice(0, 120), parentId: t.parentId })
    }
}

// Retry failures via DUPE from first success
if (failed.length && created.length) {
    const donor = created[0]
    const dupeLines = []
    for (const f of failed) {
        const t = targets.find((x) => x.path === f.path)
        if (!t) continue
        const tmpId = `ScrollBlur_${t.path.replace(/[^a-zA-Z0-9]/g, "_")}`
        dupeLines.push(
            `DUPE ${donor.newId} newId="${tmpId}" parent="${t.parentId}" index="1";`,
        )
        // layout after
        dupeLines.push(
            `SET ${tmpId} name="Scroll Blur" opacity="${t.opacity}" position="${t.pos === "fixed" ? "fixed" : "absolute"}" width="100%" height="${t.h}" bottom="0px" left="0px" right="0px";`,
        )
        dupeLines.push(
            `SET ${tmpId} \$control__shape="edge" \$control__position="bottom" \$control__strength="${t.path === "/" ? 3 : 2}" \$control__mode="Always On";`,
        )
    }
    if (dupeLines.length) {
        const r = await framer.agent.applyChanges(dupeLines.join(NL), {})
        notes.push(`dupe retry: ${r?.message}`)
        // mark failed as attempted
    }
}

// --- 3) DEL all ProgressiveBlur primaries ---
const delIds = targets.map((t) => t.id)
const delLines = delIds.map((id) => `DEL ${id};`)
const delResult = await framer.agent.applyChanges(delLines.join(NL), {})
notes.push(`deleted ProgressiveBlur: ${delResult?.message}`)

// --- 4) Remove code file ---
files = await framer.getCodeFiles()
const old = files.find((f) => f.name === "Arbour_ProgressiveBlur.tsx")
let removedFile = null
if (old) {
    await old.remove()
    removedFile = old.id
    notes.push(`removed code file ${old.id}`)
}

// --- Verify ---
const left = []
const scrollHits = []
for (const p of pages || []) {
    if (!p.path) continue
    const ser = await framer.agent.serialize({ id: p.id, depth: 5 }, {})
    for (const bp of ser.children || []) {
        function walk(n) {
            if (!n) return
            const name = n.name || ""
            if (/ProgressiveBlur/i.test(name)) left.push({ path: p.path, bp: bp.name, id: n.id })
            if (/Scroll Blur|ScrollBlur/i.test(name)) {
                scrollHits.push({
                    path: p.path,
                    bp: bp.name,
                    id: n.id,
                    h: n.attributes?.height,
                    strength: n.attributes?.["$control__strength"],
                    mode: n.attributes?.["$control__mode"],
                })
            }
            for (const c of n.children || []) walk(c)
        }
        walk(bp)
    }
}

return {
    notes,
    created,
    failed,
    removedFile,
    leftProgressive: left,
    scrollHits: scrollHits.filter((h) => h.bp === "Desktop"),
}
