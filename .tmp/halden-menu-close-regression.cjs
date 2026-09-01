const assert = require("node:assert/strict")
const fs = require("node:fs")

const source = fs.readFileSync(
    "/Users/noel/Desktop/Framer/.tmp/halden-src/Menu_Paper_Reveal.tsx",
    "utf8"
)

assert(
    !source.includes("createPortal"),
    "Menu veil must stay inside the Nav variant instead of escaping to document.body"
)
assert(
    !source.includes('html.style.overflow = "hidden"') &&
        !source.includes('body.style.overflow = "hidden"'),
    "Scroll lock must follow the active Nav variant, not stale component state"
)
assert(
    source.includes('html:has(nav[data-framer-name="open"])') &&
        source.includes('body:has(nav[data-framer-name="open"])'),
    "Active open Nav variant must own the scroll lock"
)
assert(
    source.includes("{frost}") && !source.includes("{frostTree}"),
    "The veil must render within Dossier Clip"
)

console.log("menu-close lifecycle regression passed")
