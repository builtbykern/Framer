const info = await framer.getProjectInfo()
const home = await framer.agent.serializeNodes({
    ids: ["augiA20Il"],
    depth: 1,
    attributeFilter: ["left", "width", "height", "visible"],
})
const drifts = await framer.agent.serializeNodes({
    ids: [
        "RV7bjlgdh",
        "BjqrvIntTRV7bjlgdh",
        "nyI5jW7lARV7bjlgdh",
        "NTEyuOtv3",
        "xmBenkfAk",
        "fpoP3kuA4",
    ],
    depth: 0,
    attributeFilter: [
        "$control__workList",
        "left",
        "width",
        "path",
        "visible",
        "component",
    ],
})

const driftFile = await framer.getCodeFile("Drift_Plane.tsx")
const veilFile = await framer.getCodeFile("Page_Veil.tsx")
const driftSrc = driftFile.content
const veilSrc = veilFile.content
const driftTypes = await driftFile.typecheck({ strict: true })
const veilTypes = await veilFile.typecheck({ strict: true })

let review = null
try {
    review = await framer.agent.reviewChanges()
} catch (err) {
    review = { error: String(err) }
}

const checks = {
    project: info?.name,
    projectId: info?.id,
    previewUrl: info?.previewUrl || info?.url || null,
    infoKeys: Object.keys(info || {}),
    openCardLink: driftSrc.includes("function openCardLink"),
    veilEvent: driftSrc.includes("halden:veil-navigate"),
    driftVeilY: driftSrc.includes("DRIFT_VEIL_Y = 48"),
    driftVeilBlur: driftSrc.includes('DRIFT_VEIL_BLUR = "blur(4px)"'),
    driftVeilMs: driftSrc.includes("DRIFT_VEIL_MS = 490"),
    staticRenderer: driftSrc.includes("useIsStaticRenderer"),
    pageVeilListen: veilSrc.includes("halden:veil-navigate"),
    pageVeilWorkPath: veilSrc.includes("isWorkPath"),
    pageVeilClick: veilSrc.includes("clickFramerAnchor"),
}

console.log(
    JSON.stringify(
        { checks, home, drifts, driftTypes, veilTypes, review },
        null,
        2
    ).slice(0, 12000)
)
