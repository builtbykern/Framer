const fs = require("fs")
const content = fs.readFileSync(
    "/Users/noel/Desktop/Framer/state/Edge_Refraction_Shader.tsx",
    "utf8"
)

const files = await framer.getCodeFiles()
const shader = files.find((f) => (f.name || "").includes("Edge_Refraction"))
const override = files.find((f) =>
    (f.name || "").includes("EdgeRefractionOverride")
)
const desk = await framer.agent.getNode({ id: "WQLkyLRf1" }, { pagePath: "/" })
const overlay = await framer.agent.getNode(
    { id: "jabCEPhKE" },
    { pagePath: "/" }
)

const checks = {
    project: (await framer.getProjectInfo()).name,
    singleCodeFile: files.length === 1 && Boolean(shader),
    noOverrideFile: !override,
    noCodeOverride: !desk?.attributes?.codeOverride,
    overlayFixed: overlay?.attributes?.position === "fixed",
    hasFeDisplacement: content.includes("feDisplacementMap"),
    hasFollowScroll: content.includes("Follow Scroll"),
    hasSettleMs: content.includes("settleMs"),
    hasHysteresis: content.includes("SCROLL_HYSTERESIS_PX"),
    hasCollectScrollRoots: content.includes("collectScrollRoots"),
    noWebGL: !/getContext\s*\(\s*['"]webgl/.test(content),
    tameScale: content.includes("(6 + s * 18)"),
}

const failed = Object.entries(checks)
    .filter(([k, v]) => k !== "project" && v !== true)
    .map(([k]) => k)

console.log(
    JSON.stringify(
        {
            ok: failed.length === 0,
            failed,
            checks,
            deskOverride: desk?.attributes?.codeOverride ?? null,
            files: files.map((f) => f.name),
            overlay: {
                id: overlay?.id,
                position: overlay?.attributes?.position,
                zIndex: overlay?.attributes?.zIndex,
            },
        },
        null,
        2
    )
)
