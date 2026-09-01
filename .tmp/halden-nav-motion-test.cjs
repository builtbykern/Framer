const triggers = await framer.agent.serializeNodes({
    ids: [
        "VBfODp8Ml",
        "lHV5aHgaZVBfODp8Ml",
        "Gz9TsJWVA",
        "lHV5aHgaZGz9TsJWVA",
    ],
    depth: 0,
    attributeFilter: ["name", "onTap"],
})

const closeTrigger = triggers.find(
    (node) => node.id === "lHV5aHgaZVBfODp8Ml"
)
if (!closeTrigger) throw new Error("Close trigger not found")

const closeActions = (closeTrigger.attributes?.onTap ?? []).filter(
    (action) => action.action !== "NONE"
)
const EXPECTED_CLOSE_DELAY = "0.28s"
if (closeActions.length === 0) {
    throw new Error("Close trigger has no active action")
}
const closeVariantAction = closeActions.find(
    (action) => action.action === "SET_VARIANT"
)
const closeVariableAction = closeActions.find(
    (action) => action.action === "SET_VARIABLE_VALUE"
)
if (
    closeActions.length !== 2 ||
    closeVariantAction?.controls?.variant !== "QZInDjV1k" ||
    (closeVariantAction?.delay ?? "0s") !== EXPECTED_CLOSE_DELAY ||
    closeVariableAction?.controls?.variable !==
        "var(--variable-w1Hbz14bi)" ||
    closeVariableAction?.controls?.value !== false
) {
    throw new Error(`Conflicting close actions: ${JSON.stringify(closeActions)}`)
}
const closeDelay = closeVariantAction.delay ?? "0s"
if (closeDelay !== EXPECTED_CLOSE_DELAY) {
    throw new Error(`Close handoff is ${closeDelay}`)
}
for (const wrapperId of ["Gz9TsJWVA", "lHV5aHgaZGz9TsJWVA"]) {
    const wrapper = triggers.find((node) => node.id === wrapperId)
    const actions = (wrapper?.attributes?.onTap ?? []).filter(
        (action) => action.action && action.action !== "NONE"
    )
    if (actions.length > 0) {
        throw new Error(`Wrapper ${wrapperId} still owns actions`)
    }
}

const menuFile = await framer.getCodeFile("Menu_Paper_Reveal.tsx")
if (!menuFile) throw new Error("Menu_Paper_Reveal.tsx not found")
const logoFile = await framer.getCodeFile("Logo_Menu_Roll.tsx")
if (!logoFile) throw new Error("Logo_Menu_Roll.tsx not found")

const checks = {
    asymmetricTiming:
        menuFile.content.includes("const ENTER_MS = 490") &&
        menuFile.content.includes("const EXIT_MS = 280") &&
        menuFile.content.includes("const CONTENT_EXIT_MS = 180") &&
        menuFile.content.includes("const CONTENT_EXIT_Y = 24"),
    exitEventBridge:
        menuFile.content.includes(
            'const MENU_EXIT_EVENT = "halden:menu-exit"'
        ) &&
        logoFile.content.includes(
            'const MENU_EXIT_EVENT = "halden:menu-exit"'
        ) &&
        logoFile.content.includes("window.dispatchEvent"),
    reducedMotion: menuFile.content.includes("reduceMotion"),
    staticRenderer:
        menuFile.content.includes("useIsStaticRenderer") &&
        logoFile.content.includes("useIsStaticRenderer"),
    pressFeedback:
        logoFile.content.includes("const PRESS_SCALE = 0.98") &&
        logoFile.content.includes("onPointerDown") &&
        logoFile.content.includes("pressed"),
    accessibleTrigger:
        logoFile.content.includes("<button") &&
        logoFile.content.includes('type="button"') &&
        logoFile.content.includes("onClick={handleClick}") &&
        logoFile.content.includes("type: ControlType.EventHandler") &&
        logoFile.content.includes(
            'aria-label={open ? "Close menu" : "Open menu"}'
        ),
}
for (const [name, ok] of Object.entries(checks)) {
    if (!ok) throw new Error(`Motion check failed: ${name}`)
}

console.log(
    JSON.stringify({ ok: true, closeDelay, checks }, null, 2)
)
