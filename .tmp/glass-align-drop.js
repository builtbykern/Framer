const files = await framer.getCodeFiles()
const file = files.find((f) => f.name === "BuiltByKern_GlassType.tsx")
if (!file) throw new Error("missing code file")
const exportId = `codeFile/${file.id}:default`
console.log("export", exportId)

const homeBefore = await framer.agent.serialize(
    { id: "SpJLywBKC", depth: 0 },
    { pagePath: "/" }
)
const thumbBefore = await framer.agent.serialize(
    { id: "u3y96DiCv", depth: 0 },
    { pagePath: "/thumbnail" }
)
console.log(
    "home before",
    JSON.stringify({
        look: homeBefore.attributes?.["$control__look"],
        layout: homeBefore.attributes?.["$control__layout"],
        motion: homeBefore.attributes?.["$control__motion"],
        content: homeBefore.attributes?.["$control__content"],
        font: homeBefore.attributes?.["$control__font"],
    }).slice(0, 1200)
)
console.log(
    "thumb before",
    JSON.stringify({
        look: thumbBefore.attributes?.["$control__look"],
        layout: thumbBefore.attributes?.["$control__layout"],
        motion: thumbBefore.attributes?.["$control__motion"],
        content: thumbBefore.attributes?.["$control__content"],
        font: thumbBefore.attributes?.["$control__font"],
    }).slice(0, 1200)
)

const homeDsl = [
    "DEL SpJLywBKC;",
    `+ComponentInstanceNode glassHome component="${exportId}" parent="J6H0w3tE9" index="1";`,
    'SET glassHome name="Glass Type" width="960px" height="444px";',
].join("\n")

const homeR = await framer.agent.applyChanges(homeDsl, { pagePath: "/" })
console.log("home recreate", JSON.stringify(homeR).slice(0, 1500))

const thumbDsl = [
    "DEL u3y96DiCv;",
    `+ComponentInstanceNode glassThumb component="${exportId}" parent="MKhInCtAf" index="1";`,
    'SET glassThumb name="Glass Type" width="960px" height="444px";',
].join("\n")

const thumbR = await framer.agent.applyChanges(thumbDsl, {
    pagePath: "/thumbnail",
})
console.log("thumb recreate", JSON.stringify(thumbR).slice(0, 1500))

function walk(n, acc) {
    if (!n) return acc
    acc.push({ id: n.id, name: n.name, type: n.type })
    for (const c of n.children || []) walk(c, acc)
    return acc
}

const homeStage = await framer.agent.serialize(
    { id: "J6H0w3tE9", depth: 2 },
    { pagePath: "/" }
)
const thumbStage = await framer.agent.serialize(
    { id: "MKhInCtAf", depth: 2 },
    { pagePath: "/thumbnail" }
)
const homeInst = (homeStage.children || []).find(
    (c) => c.type === "ComponentInstanceNode"
)
const thumbInst = (thumbStage.children || []).find(
    (c) => c.type === "ComponentInstanceNode"
)
console.log("home kids", walk(homeStage, []).map((n) => n.name + " " + n.id))
console.log("thumb kids", walk(thumbStage, []).map((n) => n.name + " " + n.id))
console.log(
    "home inst",
    JSON.stringify({
        id: homeInst?.id,
        look: homeInst?.attributes?.["$control__look"],
        layout: homeInst?.attributes?.["$control__layout"],
        motion: homeInst?.attributes?.["$control__motion"],
        content: homeInst?.attributes?.["$control__content"],
        font: homeInst?.attributes?.["$control__font"],
        w: homeInst?.attributes?.width,
        h: homeInst?.attributes?.height,
    }).slice(0, 1500)
)
console.log(
    "thumb inst",
    JSON.stringify({
        id: thumbInst?.id,
        look: thumbInst?.attributes?.["$control__look"],
        layout: thumbInst?.attributes?.["$control__layout"],
        motion: thumbInst?.attributes?.["$control__motion"],
        content: thumbInst?.attributes?.["$control__content"],
        font: thumbInst?.attributes?.["$control__font"],
        w: thumbInst?.attributes?.width,
        h: thumbInst?.attributes?.height,
    }).slice(0, 1500)
)
