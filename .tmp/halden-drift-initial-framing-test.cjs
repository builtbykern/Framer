const assert = require("node:assert/strict")
const fs = require("node:fs")

const source = fs.readFileSync(
    "/Users/noel/Desktop/Framer/.tmp/halden-src/Drift_Plane.tsx",
    "utf8"
)

assert.match(
    source,
    /function initialFramingY\(viewH:\s*number\):\s*number/,
    "initialFramingY helper must exist"
)
assert.match(
    source,
    /Math\.min\(\s*viewH\s*\*\s*0\.1\s*,\s*96\s*\)/,
    "framing offset must be min(viewH * 0.1, 96)"
)

const fnMatch = source.match(
    /function initialFramingY\(viewH:\s*number\):\s*number\s*\{([\s\S]*?)\n\}/
)
assert(fnMatch, "initialFramingY body not found")
const initialFramingY = new Function(
    "viewH",
    fnMatch[1].replace(/:\s*number/g, "")
)

assert.equal(initialFramingY(800), 80)
assert.equal(initialFramingY(1200), 96)
assert.equal(initialFramingY(0), 0)

assert.match(
    source,
    /y \+= opts\.viewH \/ 2\s*\+\s*initialFramingY\(opts\.viewH\)/,
    "tileScreenXY must apply framing after wrap + view center"
)
assert.match(
    source,
    /top:\s*calc\(50%\s*\+\s*\$\{wrappedY\}px\s*\+\s*min\(10%,\s*96px\)\)/,
    "freezeScatterCss must mirror framing for canvas first paint"
)
assert.doesNotMatch(
    source,
    /tileH:[^\n]*initialFramingY|tileW:[^\n]*initialFramingY/,
    "tile dimensions must not include framing offset"
)

console.log(
    JSON.stringify({
        framingAt800: initialFramingY(800),
        framingAt1200: initialFramingY(1200),
        ok: true,
    })
)
