/**
 * Remove Arbour_SmoothScroll + BuiltByKern Scroll Blur from all pages,
 * then delete their code files.
 */
const NL = String.fromCharCode(10)
const notes = []

const pages = await framer.getNodesWithType("WebPageNode")
const delPrimary = []

for (const p of pages || []) {
    if (!p.path) continue
    const ser = await framer.agent.serialize({ id: p.id, depth: 5 }, {})
    for (const bp of ser.children || []) {
        if (bp.name !== "Desktop") continue
        function walk(n) {
            if (!n) return
            const name = n.name || ""
            if (
                /SmoothScroll/i.test(name) ||
                /^Scroll Blur$/i.test(name) ||
                /BuiltByKern_ScrollBlur|ScrollBlur/i.test(name)
            ) {
                delPrimary.push({ path: p.path, id: n.id, name })
            }
            for (const c of n.children || []) walk(c)
        }
        walk(bp)
    }
}

notes.push(`primary deletes: ${delPrimary.length}`)
const lines = delPrimary.map((d) => `DEL ${d.id};`)
let delResult = null
if (lines.length) {
    delResult = await framer.agent.applyChanges(lines.join(NL), {})
    notes.push(`DEL: ${delResult?.message}`)
}

// Verify no leftovers (any BP)
const left = []
for (const p of pages || []) {
    if (!p.path) continue
    const ser = await framer.agent.serialize({ id: p.id, depth: 5 }, {})
    for (const bp of ser.children || []) {
        function walk(n) {
            if (!n) return
            const name = n.name || ""
            if (
                /SmoothScroll/i.test(name) ||
                /^Scroll Blur$/i.test(name) ||
                /ScrollBlur/i.test(name)
            ) {
                left.push({ path: p.path, bp: bp.name, id: n.id, name })
            }
            for (const c of n.children || []) walk(c)
        }
        walk(bp)
    }
}

// If replicas linger, DEL those too
if (left.length) {
    const more = left.map((x) => `DEL ${x.id};`)
    const r2 = await framer.agent.applyChanges(more.join(NL), {})
    notes.push(`replica DEL: ${r2?.message} count=${left.length}`)
}

// Remove code files
const files = await framer.getCodeFiles()
const removedFiles = []
for (const name of ["Arbour_SmoothScroll.tsx", "BuiltByKern_ScrollBlur.tsx"]) {
    const f = files.find((x) => x.name === name)
    if (f) {
        await f.remove()
        removedFiles.push(name)
        notes.push(`removed file ${name}`)
    }
}

// Final check
const left2 = []
const pages2 = await framer.getNodesWithType("WebPageNode")
for (const p of pages2 || []) {
    if (!p.path) continue
    const ser = await framer.agent.serialize({ id: p.id, depth: 4 }, {})
    for (const bp of ser.children || []) {
        function walk(n) {
            if (!n) return
            if (/SmoothScroll|Scroll Blur|ScrollBlur/i.test(n.name || "")) {
                left2.push({ path: p.path, bp: bp.name, name: n.name, id: n.id })
            }
            for (const c of n.children || []) walk(c)
        }
        walk(bp)
    }
}

const files2 = await framer.getCodeFiles()
return {
    notes,
    deleted: delPrimary,
    removedFiles,
    leftAfter: left2,
    stillHasSmoothFile: !!files2.find((f) => /SmoothScroll/i.test(f.name)),
    stillHasScrollBlurFile: !!files2.find((f) => /ScrollBlur/i.test(f.name)),
}
