const fs = require("fs")
const dir = "/Users/noel/Desktop/Framer/.tmp/vitrine-shots"

const info = await framer.getProjectInfo()
if (info.name !== "Fair Platform") throw new Error(info.name)

const home = await framer.agent.applyChanges(
    [
        'SET QYwZhiOCq aspectRatio="1" height="auto";',
        'SET BZgqwOKfTQYwZhiOCq aspectRatio="1.5" height="auto";',
        'SET GLlag6b9RQYwZhiOCq aspectRatio="0.75" height="auto";',
        'SET S4aeyJLQaQYwZhiOCq aspectRatio="1.15" height="auto";',
        'SET O2btPltNw hoverEffect.opacity="0.82" hoverEffect.y="0" hoverEffect.scale="1" hoverEffect.transition="tween 0.23,1,0.32,1 0.2s 0s";',
        'SET augiA20Il layoutTemplate="null";',
        'SET rootNode metadata.socialImage="https://framerusercontent.com/images/erzXiD8x0aw5x8FISGgfLPOG4oQ.jpg";',
    ].join(" "),
    { pagePath: "/" }
)

const four = await framer.agent.applyChanges(
    [
        'SET U9F5gXIMeSJhrh_vcd padding="40px 16px 64px 16px";',
        'SET w02m12a91SJhrh_vcd padding="56px 24px 80px 24px";',
    ].join(" "),
    { pagePath: "/404" }
)

const shots = {}
for (const [id, name] of [
    ["WQLkyLRf1", "home-desktop.jpg"],
    ["t62LHpSTa", "home-tablet.jpg"],
    ["u75vHQkAR", "home-phone.jpg"],
    ["dKIZmzj_1", "piece-desktop.jpg"],
    ["gFY0Qf8vi", "piece-tablet.jpg"],
    ["RRanDQOK5", "piece-phone.jpg"],
    ["U9F5gXIMe", "404-phone.jpg"],
]) {
    const r = await framer.screenshot(id, { format: "jpeg", scale: 1 })
    fs.writeFileSync(`${dir}/${name}`, r.data)
    shots[name] = r.data.length
}

const proof = await framer.agent.serializeNodes({
    ids: ["augiA20Il", "u75vHQkAR", "IhgjBMpmC", "yAd2lMDSW"],
    depth: 2,
    attributeFilter: ["id", "name", "path", "layoutTemplate", "stackDirection", "overflow", "component", "codeFile", "htmlTag"],
})

function brief(r) {
    return { message: r.message, errors: r.errors || r.linter?.errors }
}

console.log(JSON.stringify({ home: brief(home), four: brief(four), shots, proof }, null, 2))
