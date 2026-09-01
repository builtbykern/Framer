const fs = require("fs")
const path = require("path")

const info = await framer.getProjectInfo()
const drift = await framer.getCodeFile("Drift_Plane.tsx")
const veil = await framer.getCodeFile("Page_Veil.tsx")
const driftTypes = await drift.typecheck({ strict: true })
const veilTypes = await veil.typecheck({ strict: true })

const pointerDownStart = drift.content.indexOf("const onPointerDown")
const pointerMoveStart = drift.content.indexOf("const onPointerMove")
const pointerCapture = drift.content.indexOf(
    "event.currentTarget.setPointerCapture",
    pointerMoveStart
)
const slopGate = drift.content.indexOf(
    "if (!dragExceededSlop.current)",
    pointerMoveStart
)
const pointerDownBody = drift.content.slice(pointerDownStart, pointerMoveStart)

const home = await framer.agent.serializeNodes({
    ids: ["augiA20Il"],
    depth: 2,
    attributeFilter: ["collectionList", "$control__workList", "left", "width"],
})

const drifts = await framer.agent.serializeNodes({
    ids: [
        "RV7bjlgdh",
        "BjqrvIntTRV7bjlgdh",
        "nyI5jW7lARV7bjlgdh",
        "xmBenkfAk",
        "dvcc6fymP",
    ],
    depth: 1,
    attributeFilter: [
        "$control__workList",
        "collectionList",
        "fill",
        "link",
        "left",
        "width",
    ],
})

const outputDir = "/Users/noel/Desktop/Framer/.tmp/halden-shots"
fs.mkdirSync(outputDir, { recursive: true })
const shots = {}
for (const [id, name] of [
    ["WQLkyLRf1", "final-native-desktop.jpg"],
    ["BjqrvIntT", "final-native-tablet.jpg"],
    ["nyI5jW7lA", "final-native-phone.jpg"],
]) {
    const result = await framer.screenshot(id, { format: "jpeg", scale: 1 })
    fs.writeFileSync(path.join(outputDir, name), result.data)
    shots[name] = result.data.length
}

const checks = {
    project: info.name === "Halden",
    driftTypes: driftTypes.length === 0,
    veilTypes: veilTypes.length === 0,
    nativeClick: !drift.content.includes("openCardLink"),
    pointerDownDoesNotPrevent: !pointerDownBody.includes(
        "event.preventDefault()"
    ),
    pointerDownBubbles:
        drift.content.includes(
            "onPointerDown={useSnapMode ? undefined : onPointerDown}"
        ) && !drift.content.includes("onPointerDownCapture="),
    captureAfterSlop: slopGate >= 0 && pointerCapture > slopGate,
    enterY: drift.content.includes("DRIFT_VEIL_Y = 48"),
    enterBlur: drift.content.includes('DRIFT_VEIL_BLUR = "blur(4px)"'),
    enterMs: drift.content.includes("DRIFT_VEIL_MS = 490"),
    noInternalRouter:
        !veil.content.includes("useRuntimeRouter") &&
        !veil.content.includes("router.navigate"),
    allScreensPaint:
        shots["final-native-desktop.jpg"] > 250000 &&
        shots["final-native-tablet.jpg"] > 100000 &&
        shots["final-native-phone.jpg"] > 80000,
}

console.log(
    JSON.stringify(
        {
            checks,
            complete: Object.values(checks).every(Boolean),
            shots,
            home,
            drifts,
        },
        null,
        2
    ).slice(0, 14000)
)
