const assert = require("node:assert/strict")
const fs = require("node:fs")

const source = fs.readFileSync(
    "/Users/noel/Desktop/Framer/.tmp/halden-src/Drift_Plane.tsx",
    "utf8"
)

const layoutBlock = source.match(
    /const DEFAULT_LAYOUT: LayoutItem\[\] = \[([\s\S]*?)\n\]/
)?.[1]
assert(layoutBlock, "DEFAULT_LAYOUT not found")

const layout = [...layoutBlock.matchAll(
    /\{ x: (-?\d+), y: (-?\d+), w: (\d+), h: (\d+), layer: \d+ \}/g
)].map((match) => ({
    x: Number(match[1]),
    y: Number(match[2]),
    w: Number(match[3]),
    h: Number(match[4]),
}))
assert.equal(layout.length, 20)

const computeTile = (items, gap) => {
    const minX = Math.min(...items.map((item) => item.x))
    const minY = Math.min(...items.map((item) => item.y))
    const maxX = Math.max(...items.map((item) => item.x + item.w))
    const maxY = Math.max(...items.map((item) => item.y + item.h))
    return {
        minX: minX - gap / 2,
        minY: minY - gap / 2,
        tileW: maxX - minX + gap,
        tileH: maxY - minY + gap,
    }
}

const full = computeTile(layout, 200)
const center = {
    x: full.minX + full.tileW / 2,
    y: full.minY + full.tileH / 2,
}
const occupied = layout
    .map((item, index) => ({
        item,
        index,
        distance: Math.hypot(
            item.x + item.w / 2 - center.x,
            item.y + item.h / 2 - center.y
        ),
    }))
    .sort((a, b) => a.distance - b.distance || a.index - b.index)
    .slice(0, 12)
    .map((entry) => entry.item)
const adaptive = computeTile(occupied, 200)

assert.equal(full.tileW, 2400)
assert.equal(adaptive.tileW, 1600)
assert(
    source.includes("const occupiedTile = computeTile(occupied, TILE_GAP)"),
    "CMS world must derive bounds from occupied slots"
)
assert(
    /buildSlots\(\s*occupied,\s*occupiedTile,\s*unitScale,\s*spacingScale\s*\)/.test(
        source
    ),
    "CMS slots must use adaptive tile origin"
)

console.log(
    JSON.stringify({
        fullWidth: full.tileW,
        adaptiveWidth: adaptive.tileW,
        reclaimedWhitespace: full.tileW - adaptive.tileW,
    })
)
