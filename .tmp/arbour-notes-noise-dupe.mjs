/**
 * Add Noise to Notes Atmosphere via DUPE from Properties gold (cross-page DSL).
 * Also ensure Home Noise attrs match (100% fill).
 */
const NL = String.fromCharCode(10)

const lines = [
    // Duplicate Properties Atmosphere Noise into Notes Atmosphere as first child
    `DUPE BkebzBLil newId="NotesAtmNoise" parent="v0hRg6_73" index="0";`,
    `SET NotesAtmNoise name="Arbour_NoiseEffect" opacity="0.04" position="absolute" top="0px" left="0px" width="100%" height="100%";`,
    `SET NotesAtmNoise \$control__grainOpacity="0.05";`,
    `SET NotesAtmNoise \$control__animate="true";`,
    `SET NotesAtmNoise \$control__patternSize="280";`,
    `SET NotesAtmNoise \$control__patternRefreshInterval="4";`,
    `SET NotesAtmNoise \$control__blendMode="soft-light";`,
]

const result = await framer.agent.applyChanges(lines.join(NL), {})

const pages = await framer.getNodesWithType("WebPageNode")
const notes = pages.find((p) => p.path === "/notes")
const ser = await framer.agent.serialize({ id: notes.id, depth: 4 }, {})
const check = (ser.children || []).map((bp) => {
    function findAtm(n) {
        if (!n) return null
        if (n.name === "Atmosphere") return n
        for (const c of n.children || []) {
            const f = findAtm(c)
            if (f) return f
        }
        return null
    }
    const atm = findAtm(bp)
    return {
        bp: bp.name,
        kids: (atm?.children || []).map((c) => ({
            id: c.id,
            name: c.name,
            opacity: c.attributes?.opacity,
            w: c.attributes?.width,
            h: c.attributes?.height,
        })),
    }
})

return { result: result?.message || result, parseErrors: result?.parseErrors || result?.linter, check }
