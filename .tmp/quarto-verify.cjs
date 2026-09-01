const fs = require("fs")
const path = require("path")
const dir = "/Users/noel/Desktop/Framer/.tmp/quarto-shots"
fs.mkdirSync(dir, { recursive: true })

const field = "var(--token-14d41f00-d3b3-4455-b994-8566aa84333e)"
const mute = "var(--token-41c8b9ae-e604-40b6-9d37-a14c3803c179)"

const fix = await framer.agent.applyChanges(
    `
SET GiR6fF7o5 width="1440px" fill="${field}";
SET Nx5jccWgM width="810px" fill="${field}";
SET tKUMOkWpP width="390px" fill="${field}";
SET NBF_dDp3H $control__variant="Desktop";
SET t62LHpSTaNBF_dDp3H $control__variant="Tablet";
SET u75vHQkARNBF_dDp3H $control__variant="Phone";
SET RHoEs0FRc $control__variant="Desktop";
SET gFY0Qf8viRHoEs0FRc $control__variant="Tablet";
SET RRanDQOK5RHoEs0FRc $control__variant="Phone";
SET oSrkdzMjI $control__variant="Desktop";
SET hRNnw_VA2oSrkdzMjI $control__variant="Tablet";
SET EU24xAeMIoSrkdzMjI $control__variant="Phone";
SET ZF0dPB4g_ $control__variant="Desktop";
SET XX7urzdEPZF0dPB4g_ $control__variant="Tablet";
SET XCr9mFaYBZF0dPB4g_ $control__variant="Phone";
SET zfk3t7j3f $control__variant="Desktop";
SET w02m12a91zfk3t7j3f $control__variant="Tablet";
SET U9F5gXIMezfk3t7j3f $control__variant="Phone";
SET JN7M7ldcs textColor="${mute}";
SET yAd2lMDSW name="Edition List";
`.replace(/\n+/g, " "),
    { pagePath: "/" }
)

let delLayout = null
try {
    delLayout = await framer.agent.applyChanges(
        "DEL JjTK8_uXk;",
        { pagePath: "/" }
    )
} catch (e) {
    delLayout = { error: String(e) }
}

const home = await framer.agent.serializeNodes({
    ids: ["augiA20Il", "WQLkyLRf1", "u75vHQkAR"],
    depth: 2,
    attributeFilter: ["name", "layoutTemplate", "$layoutTemplateId", "fill", "collectionList"],
})

const shots = {}
for (const [id, name] of [
    ["WQLkyLRf1", "home-desktop.jpg"],
    ["t62LHpSTa", "home-tablet.jpg"],
    ["u75vHQkAR", "home-phone.jpg"],
    ["tVu2ncruf", "info-desktop.jpg"],
]) {
    const r = await framer.screenshot(id, { format: "jpeg", scale: 1 })
    fs.writeFileSync(path.join(dir, name), r.data)
    shots[name] = r.data.length
}

let renamed = null
try {
    if (typeof framer.setProjectName === "function") {
        renamed = await framer.setProjectName("Quarto")
    } else if (typeof framer.renameProject === "function") {
        renamed = await framer.renameProject("Quarto")
    } else {
        renamed = {
            keys: Object.keys(framer).slice(0, 80),
        }
    }
} catch (e) {
    renamed = { error: String(e) }
}

const info = await framer.getProjectInfo()
const vekter = await framer.agent.readProject(
    [
        { type: "screenshot", id: "WQLkyLRf1" },
        { type: "screenshot", id: "u75vHQkAR" },
    ],
    { pagePath: "/" }
)

console.log(
    JSON.stringify(
        {
            fix,
            delLayout,
            renamed,
            info,
            layoutId: home[0]?.$layoutTemplateId,
            homeKids: home[1]?.children?.map((c) => c.name),
            phoneKids: home[2]?.children?.map((c) => ({
                name: c.name,
                type: c.type,
                cl: c.attributes?.collectionList,
            })),
            shots,
            vekter,
        },
        null,
        2
    )
)
