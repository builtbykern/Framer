const fs = require("fs")

const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(`Wrong project: ${info.name}`)

const menuFile = await framer.getCodeFile("Menu_Paper_Reveal.tsx")
const logoFile = await framer.getCodeFile("Logo_Menu_Roll.tsx")
if (!menuFile || !logoFile) throw new Error("Nav code files not found")

const [menuErrors, logoErrors] = await Promise.all([
    menuFile.typecheck({ strict: true }),
    logoFile.typecheck({ strict: true }),
])

const nodes = await framer.agent.serializeNodes({
    ids: [
        "VBfODp8Ml",
        "lHV5aHgaZVBfODp8Ml",
        "Gz9TsJWVA",
        "lHV5aHgaZGz9TsJWVA",
        "WQLkyLRf1",
        "BjqrvIntT",
        "nyI5jW7lA",
    ],
    depth: 3,
})

const byId = new Map()
const walk = (node) => {
    byId.set(node.id, node)
    for (const child of node.children || []) walk(child)
}
for (const node of nodes) walk(node)

const closedLogo = byId.get("VBfODp8Ml")
const openLogo = byId.get("lHV5aHgaZVBfODp8Ml")
const closedWrapper = byId.get("Gz9TsJWVA")
const openTrigger = byId.get("lHV5aHgaZGz9TsJWVA")
const activeActions = (node) =>
    (node?.attributes?.onTap ?? []).filter(
        (action) => action.action && action.action !== "NONE"
    )

const expectedFont = "IBMPlexSans-semibold"
const checks = {
    strictTypecheck: menuErrors.length === 0 && logoErrors.length === 0,
    veilBelowNav: menuFile.content.includes("const VEIL_Z = 9"),
    coherentDuration: menuFile.content.includes("const MS = 490"),
    responsiveStack:
        menuFile.content.includes("const STACK_MAX = 1199") &&
        menuFile.content.includes("@media (max-width: 479px)"),
    reducedMotion:
        menuFile.content.includes("reduceMotion") &&
        logoFile.content.includes("reduceMotion"),
    staticRenderer:
        menuFile.content.includes("useIsStaticRenderer") &&
        logoFile.content.includes("useIsStaticRenderer"),
    pressFeedback:
        logoFile.content.includes("const PRESS_SCALE = 0.98") &&
        logoFile.content.includes("const PRESS_MS = 120"),
    semanticButton:
        logoFile.content.includes("<button") &&
        logoFile.content.includes('type="button"') &&
        logoFile.content.includes("onClick={onTap}") &&
        logoFile.content.includes("type: ControlType.EventHandler") &&
        logoFile.content.includes(
            'aria-label={open ? "Close menu" : "Open menu"}'
        ),
    opticalKerning:
        logoFile.content.includes("AL: -0.1") &&
        logoFile.content.includes("LD: -0.06"),
    closedFont: String(closedLogo?.attributes?.$control__font).includes(
        expectedFont
    ),
    openFont: String(openLogo?.attributes?.$control__font).includes(
        expectedFont
    ),
    immediateClose: (activeActions(openLogo)[0]?.delay ?? "0s") === "0s",
    idempotentClose: activeActions(openLogo)
        .every(
            (action) =>
                action.action === "SET_VARIANT" &&
                action.controls?.variant === "QZInDjV1k" &&
                (action.delay ?? "0s") === "0s"
        ),
    actionsOwnedByButtons:
        activeActions(closedWrapper).length === 0 &&
        activeActions(openTrigger).length === 0 &&
        activeActions(closedLogo).some(
            (action) =>
                action.action === "SET_VARIANT" &&
                action.controls?.variant === "lHV5aHgaZ"
        ) &&
        activeActions(openLogo).some(
            (action) =>
                action.action === "SET_VARIANT" &&
                action.controls?.variant === "QZInDjV1k"
        ),
    wrapperAriaCleared:
        byId.get("Gz9TsJWVA")?.attributes?.ariaLabel == null &&
        openTrigger?.attributes?.ariaLabel == null,
}

const failed = Object.entries(checks)
    .filter(([, ok]) => !ok)
    .map(([name]) => name)
if (failed.length > 0) {
    throw new Error(`Final Nav audit failed: ${failed.join(", ")}`)
}

const outputDir = "/Users/noel/Desktop/Framer/.tmp/halden-nav-final"
fs.mkdirSync(outputDir, { recursive: true })
const screenshots = {}
for (const [id, filename] of [
    ["WQLkyLRf1", "desktop-home.jpg"],
    ["BjqrvIntT", "tablet-home.jpg"],
    ["nyI5jW7lA", "phone-home.jpg"],
    ["QZInDjV1k", "wordmark-closed.jpg"],
    ["lHV5aHgaZ", "nav-open.jpg"],
]) {
    const shot = await framer.screenshot(id, { format: "jpeg", scale: 1 })
    fs.writeFileSync(`${outputDir}/${filename}`, shot.data)
    screenshots[filename] = shot.data.length
}
const review =
    typeof framer.agent.reviewChanges === "function"
        ? await framer.agent.reviewChanges()
        : { available: false }

console.log(
    JSON.stringify(
        {
            ok: true,
            project: info.name,
            checks,
            typeErrors: { menuErrors, logoErrors },
            screenshots,
            review,
        },
        null,
        2
    )
)
