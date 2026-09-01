const assert = require("node:assert/strict")
const fs = require("node:fs")

const source = fs.readFileSync(
    "/Users/noel/Desktop/Framer/.tmp/halden-src/Drift_Plane.tsx",
    "utf8"
)

assert(source.includes("spacing?: number"))
assert(
    /const spacingScale = clamp\(\s*coerceNumber\(layoutGroup\.spacing, unitScale\)/.test(
        source
    )
)
assert(source.includes("baseX: (layoutItem.x - tile.minX) * spacingScale"))
assert(source.includes("baseY: (layoutItem.y - tile.minY) * spacingScale"))
assert(source.includes("widthPx: layoutItem.w * sizeScale"))
assert(source.includes("heightPx: layoutItem.h * sizeScale"))
assert(source.includes("tile.tileW * spacingScale"))
assert(source.includes('title: "Spacing"'))

const adaptiveTile = { w: 1600, h: 1720 }
const tablet = {
    maxCardWidth: 240 * 0.86,
    worldWidth: adaptiveTile.w * 0.74,
    worldHeight: adaptiveTile.h * 0.74,
}
const phone = {
    maxCardWidth: 240 * 0.7,
    worldWidth: adaptiveTile.w * 0.58,
    worldHeight: adaptiveTile.h * 0.58,
}
const assertClose = (actual, expected) =>
    assert(Math.abs(actual - expected) < 0.000001)

assertClose(tablet.maxCardWidth, 206.4)
assertClose(tablet.worldWidth, 1184)
assertClose(tablet.worldHeight, 1272.8)
assertClose(phone.maxCardWidth, 168)
assertClose(phone.worldWidth, 928)
assertClose(phone.worldHeight, 997.6)

console.log(JSON.stringify({ tablet, phone }))
