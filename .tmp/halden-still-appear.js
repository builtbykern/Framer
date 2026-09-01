const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(info.name)

const pagePath = "/work/:Work"
const stills = [
    { id: "GmsqajS3d", delay: "0s" },
    { id: "DyykSOQwx", delay: "0.07s" },
    { id: "w4QuZ0uSJ", delay: "0.14s" },
    { id: "UmN1BalYs", delay: "0.21s" },
]

function appear(id, delay) {
    return [
        `SET ${id} appearEffect.trigger="onInView"`,
        `appearEffect.threshold="0.18"`,
        `appearEffect.replay="false"`,
        `appearEffect.enter.opacity="0"`,
        `appearEffect.enter.x="0"`,
        `appearEffect.enter.y="48"`,
        `appearEffect.enter.scale="1"`,
        `appearEffect.enter.rotate="0"`,
        `appearEffect.enter.rotateX="0"`,
        `appearEffect.enter.rotateY="0"`,
        `appearEffect.enter.skewX="0"`,
        `appearEffect.enter.skewY="0"`,
        `appearEffect.enter.transition="tween 0.5,0,0.5,1 0.49s ${delay}"`,
        `appearEffect.enter.stagger="0s"`,
    ].join(" ") + ";"
}

const dsl = stills.map((s) => appear(s.id, s.delay)).join(" ")
const applied = await framer.agent.applyChanges(dsl, { pagePath })
if (applied?.errors && Object.keys(applied.errors).length) {
    throw new Error(JSON.stringify(applied.errors))
}

const prefixes = ["", "LSqc1L2WH", "Tf2mbU7Bv"]
const report = []
for (const prefix of prefixes) {
    for (const s of stills) {
        const n = await framer.agent.getNode({ id: prefix + s.id }, { pagePath })
        report.push({
            id: prefix + s.id,
            found: Boolean(n),
            appear: n?.attributes?.appearEffect,
        })
    }
}

console.log(
    JSON.stringify(
        {
            applied: applied.message,
            report,
        },
        null,
        2
    )
)
