const fs = require("fs")
const dir = "/Users/noel/Desktop/Framer/.tmp/vitrine-shots"

const info = await framer.getProjectInfo()
if (info.name !== "Fair Platform") throw new Error(info.name)

const home = await framer.agent.applyChanges(
    [
        'SET yAd2lMDSW padding="80px 32px 112px 32px" htmlTag="main";',
        'SET t62LHpSTayAd2lMDSW padding="56px 22px 80px 22px";',
        'SET u75vHQkARyAd2lMDSW padding="40px 16px 64px 16px";',
        'SET YuQho50Zq padding="24px 28px 56px 28px";',
        'SET GiR6fF7o5 htmlTag="header";',
        'SET augiA20Il layoutTemplate="null";',
        'SET rootNode metadata.title="Vitrine" metadata.description="A catalogue of printed work. Sheets in the order they were issued.";',
    ].join(" "),
    { pagePath: "/" }
)

const appear =
    'appearEffect.threshold="0.5" appearEffect.trigger="onInView" appearEffect.replay="false" appearEffect.enter.opacity="0" appearEffect.enter.x="0" appearEffect.enter.y="0" appearEffect.enter.scale="1" appearEffect.enter.rotate="0" appearEffect.enter.rotateX="0" appearEffect.enter.rotateY="0" appearEffect.enter.skewX="0" appearEffect.enter.skewY="0" appearEffect.enter.transition="tween 0.23,1,0.32,1 0.4s 0s" appearEffect.enter.stagger="0s"'

const piece = await framer.agent.applyChanges(
    [
        `SET g1ctSOgfg ${appear} altText="var(--variable-Rjsd6qD9G)";`,
        `SET iR0ECI6Dz ${appear} altText="var(--variable-Rjsd6qD9G)";`,
        'SET FZFYEKdG1 metadata.title="{{Title}} — Vitrine" metadata.description="{{Description}}";',
        'SET yBOTItE1V htmlTag="article";',
    ].join(" "),
    { pagePath: "/piece/:Piece" }
)

const shots = {}
for (const [id, name] of [
    ["WQLkyLRf1", "home-desktop.jpg"],
    ["t62LHpSTa", "home-tablet.jpg"],
    ["u75vHQkAR", "home-phone.jpg"],
    ["dKIZmzj_1", "piece-desktop.jpg"],
    ["gFY0Qf8vi", "piece-tablet.jpg"],
    ["RRanDQOK5", "piece-phone.jpg"],
]) {
    const r = await framer.screenshot(id, { format: "jpeg", scale: 1 })
    fs.writeFileSync(`${dir}/${name}`, r.data)
    shots[name] = r.data.length
}

function brief(r) {
    return { message: r.message, errors: r.errors || r.linter?.errors }
}

console.log(JSON.stringify({ home: brief(home), piece: brief(piece), shots }, null, 2))
