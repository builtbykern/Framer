const assert = require("node:assert/strict")
const fs = require("node:fs")

const source = fs.readFileSync(
    "/Users/noel/Desktop/Framer/.tmp/halden-src/Menu_Paper_Reveal.tsx",
    "utf8"
)
const logoSource = fs.readFileSync(
    "/Users/noel/Desktop/Framer/.tmp/halden-src/Logo_Menu_Roll.tsx",
    "utf8"
)

assert(source.includes("const ENTER_MS = 490"))
assert(source.includes("const EXIT_MS = 280"))
assert(source.includes("const CONTENT_EXIT_MS = 180"))
assert(source.includes("const CONTENT_EXIT_Y = 24"))
assert(source.includes("translate3d(0, ${CONTENT_EXIT_Y}px, 0)"))
assert(source.includes("const motionMs = closing ? EXIT_MS : ENTER_MS"))
assert(source.includes('const MENU_EXIT_EVENT = "halden:menu-exit"'))
assert(logoSource.includes('const MENU_EXIT_EVENT = "halden:menu-exit"'))
assert(logoSource.includes("window.dispatchEvent"))
assert(logoSource.includes("onClick={handleClick}"))
assert(!source.includes("createPortal"))

console.log("menu exit regression passed")
