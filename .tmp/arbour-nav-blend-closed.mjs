/**
 * Nav closed: no background + difference blend (adaptive over hero/paper).
 * Restore light chrome (white) on closed so blend reads correctly.
 * Open variants: keep Paper fill, no blend, Ink chrome.
 */
const NL = String.fromCharCode(10)
const PAPER = "var(--token-d5b3c09d-0364-4ed0-8804-e56957faa275)"
const INK = "var(--token-e2f9a9eb-668a-4021-80d9-b04413b5f392)"
const WHITE = "#FFFFFF"

const closedShells = [
    "YrKq9_bDB", // Desktop
    "I3SpHi24v", // Tablet - Close
    "GBmgkcS5c", // Phone - Close
]

const openShells = [
    "dzeGSJmBB", // Desktop - Open
    "rL2ZHlVqg", // Tablet - Open
    "WLQAqm0Qz", // Phone - Open
]

const lines = []

for (const id of closedShells) {
    lines.push(`SET ${id} backgroundColor=null blendingMode="difference";`)
}

for (const id of openShells) {
    lines.push(`SET ${id} backgroundColor="${PAPER}" blendingMode=null;`)
}

// Desktop closed logo + visible menu icon → white (works with difference)
lines.push(`SET IWDst2nAr textColor="${WHITE}";`)
lines.push(`SET KXUslQmE1 $control__color="${WHITE}";`)
// hidden twin can stay
lines.push(`SET tmJAAugFF $control__color="${WHITE}";`)

// Tablet/Phone Close logos were Parchment — white is cleaner with difference
lines.push(`SET I3SpHi24vIWDst2nAr textColor="${WHITE}";`)
lines.push(`SET GBmgkcS5cIWDst2nAr textColor="${WHITE}";`)
lines.push(`SET I3SpHi24vKXUslQmE1 $control__color="${WHITE}";`)
lines.push(`SET GBmgkcS5cKXUslQmE1 $control__color="${WHITE}";`)

// Open logos stay Ink
lines.push(`SET dzeGSJmBBIWDst2nAr textColor="${INK}";`)
lines.push(`SET rL2ZHlVqgIWDst2nAr textColor="${INK}";`)
lines.push(`SET WLQAqm0QzIWDst2nAr textColor="${INK}";`)

const result = await framer.agent.applyChanges(lines.join(NL), {})
return { n: lines.length, lines, result }
