const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(`Wrong project: ${info.name}`)

const logoFile = await framer.getCodeFile("Logo_Menu_Roll.tsx")
if (!logoFile) throw new Error("Logo_Menu_Roll.tsx not found")

const nodes = await framer.agent.serializeNodes({
    ids: [
        "VBfODp8Ml",
        "lHV5aHgaZVBfODp8Ml",
        "Gz9TsJWVA",
        "lHV5aHgaZGz9TsJWVA",
        "augiA20Il",
    ],
    depth: 3,
    attributeFilter: ["name", "onTap", "tag", "text"],
})

const byId = new Map()
const walk = (node) => {
    byId.set(node.id, node)
    for (const child of node.children || []) walk(child)
}
for (const node of nodes) walk(node)

const activeActions = (node) =>
    (node?.attributes?.onTap || []).filter(
        (action) => action.action && action.action !== "NONE"
    )
const ownsMenuTransition = (node, variant, value, delay) => {
    const actions = activeActions(node)
    return (
        actions.length === 2 &&
        actions.some(
            (action) =>
                action.action === "SET_VARIABLE_VALUE" &&
                action.controls?.variable ===
                    "var(--variable-w1Hbz14bi)" &&
                action.controls?.value === value
        ) &&
        actions.some(
            (action) =>
                action.action === "SET_VARIANT" &&
                action.controls?.variant === variant &&
                (action.delay || "0s") === delay
        )
    )
}

const home = byId.get("augiA20Il")
const homeHeadings = (home?.children || []).filter(
    (child) =>
        child.name === "SEO H1" &&
        child.type === "RichTextNode"
)
const h1Block = homeHeadings[0]?.children?.find(
    (child) => child.type === "TextBlock" && child.attributes?.tag === "h1"
)
const h1Text = (h1Block?.children || [])
    .filter((child) => child.type === "TextRun")
    .map((child) => child.attributes?.text || "")
    .join("")

const checks = {
    onTapProp: logoFile.content.includes("onTap?: () => void"),
    buttonOwnsAction:
        logoFile.content.includes("onClick={onTap}") ||
        logoFile.content.includes("onClick={handleClick}"),
    closeEventBridge:
        logoFile.content.includes(
            'const MENU_EXIT_EVENT = "halden:menu-exit"'
        ) && logoFile.content.includes("window.dispatchEvent"),
    eventHandlerControl:
        logoFile.content.includes("type: ControlType.EventHandler"),
    wrappersNotInteractive:
        activeActions(byId.get("Gz9TsJWVA")).length === 0 &&
        activeActions(byId.get("lHV5aHgaZGz9TsJWVA")).length === 0,
    closedButtonOwnsOpen: ownsMenuTransition(
        byId.get("VBfODp8Ml"),
        "lHV5aHgaZ",
        true,
        "0s"
    ),
    openButtonOwnsClose: ownsMenuTransition(
        byId.get("lHV5aHgaZVBfODp8Ml"),
        "QZInDjV1k",
        false,
        "0.28s"
    ),
    onePageScopeH1:
        homeHeadings.length === 1 &&
        h1Text === "Halden — Photography and commissioned stills",
}

const failed = Object.entries(checks)
    .filter(([, ok]) => !ok)
    .map(([name]) => name)

console.log(JSON.stringify({ checks, failed }, null, 2))
if (failed.length > 0) {
    throw new Error(`Launch blocker test failed: ${failed.join(", ")}`)
}
