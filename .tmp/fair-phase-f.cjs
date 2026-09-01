const fs = require("fs")
const path = require("path")
const dir = "/Users/noel/Desktop/Framer/.tmp/fair-shots"
fs.mkdirSync(dir, { recursive: true })

const bp = await framer.agent.applyChanges(
    `
CREATE_VARIANT lytTab001 from="ioawFeLTS";
SET lytTab001 name="Tablet" width="810px" left="1500px" top="0px";
CREATE_VARIANT lytPhn001 from="ioawFeLTS";
SET lytPhn001 name="Phone" width="390px" left="2380px" top="0px";
CREATE_VARIANT bpTablet1 from="WQLkyLRf1";
SET bpTablet1 name="Tablet" width="810px" left="1500px" top="0px";
CREATE_VARIANT bpPhone01 from="WQLkyLRf1";
SET bpPhone01 name="Phone" width="390px" left="2380px" top="0px";
CREATE_VARIANT wkTab0001 from="dKIZmzj_1";
SET wkTab0001 name="Tablet" width="810px" left="1500px" top="0px";
CREATE_VARIANT wkPhn0001 from="dKIZmzj_1";
SET wkPhn0001 name="Phone" width="390px" left="2380px" top="0px";
CREATE_VARIANT inTab0001 from="tVu2ncruf";
SET inTab0001 name="Tablet" width="810px" left="1500px" top="0px";
CREATE_VARIANT inPhn0001 from="tVu2ncruf";
SET inPhn0001 name="Phone" width="390px" left="2380px" top="0px";
CREATE_VARIANT ctTab0001 from="J1kd1wjJe";
SET ctTab0001 name="Tablet" width="810px" left="1500px" top="0px";
CREATE_VARIANT ctPhn0001 from="J1kd1wjJe";
SET ctPhn0001 name="Phone" width="390px" left="2380px" top="0px";
CREATE_VARIANT erTab0001 from="pWw0UM2JG";
SET erTab0001 name="Tablet" width="810px" left="1500px" top="0px";
CREATE_VARIANT erPhn0001 from="pWw0UM2JG";
SET erPhn0001 name="Phone" width="390px" left="2380px" top="0px";
`.replace(/\n+/g, " "),
    { pagePath: "/" }
)

const ids = bp.renamedIds || {}
const polish = await framer.agent.applyChanges(
    `
SET ${ids.bpTablet1}yAd2lMDSW gap="24px" padding="28px 16px 48px 24px";
SET ${ids.bpPhone01}yAd2lMDSW gap="16px" padding="16px 0px 32px 16px";
SET ${ids.lytTab001}Knrx2Shr2 padding="20px 24px 16px 24px";
SET ${ids.lytPhn001}Knrx2Shr2 padding="16px 16px 12px 16px";
SET ${ids.wkTab0001}yBOTItE1V padding="36px 24px 64px 24px";
SET ${ids.wkPhn0001}yBOTItE1V padding="24px 16px 56px 16px";
SET ${ids.wkPhn0001}Acqr3K1t3 width="1fr";
SET ${ids.wkPhn0001}g1ctSOgfg height="200px";
SET ${ids.wkPhn0001}iR0ECI6Dz height="140px";
SET ${ids.inTab0001}V0k3Oe2i8 padding="56px 24px 80px 24px";
SET ${ids.inPhn0001}V0k3Oe2i8 padding="40px 16px 64px 16px";
SET ${ids.inPhn0001}oSHXrizqB width="1fr";
SET ${ids.ctTab0001}mRmEjTFrV padding="56px 24px 80px 24px";
SET ${ids.ctPhn0001}mRmEjTFrV padding="40px 16px 64px 16px";
SET ${ids.ctPhn0001}DZIMTQiKB width="1fr";
`.replace(/\n+/g, " "),
    { pagePath: "/" }
)

const shots = {}
for (const [id, name] of [
    ["WQLkyLRf1", "home-desktop.jpg"],
    [ids.bpTablet1, "home-tablet.jpg"],
    [ids.bpPhone01, "home-phone.jpg"],
]) {
    const r = await framer.screenshot(id, { format: "jpeg", scale: 1 })
    fs.writeFileSync(path.join(dir, name), r.data)
    shots[name] = r.data.length
}

let vekter = null
try {
    vekter = await framer.agent.readProject(
        [
            { type: "screenshot", id: "WQLkyLRf1" },
            { type: "screenshot", id: ids.bpTablet1 },
            { type: "screenshot", id: ids.bpPhone01 },
        ],
        { pagePath: "/" }
    )
} catch (e) {
    vekter = { error: String(e) }
}

const phone = await framer.agent.serializeNodes(
    {
        ids: [ids.bpPhone01],
        depth: 2,
        attributeFilter: ["name", "width", "collectionList", "$rect"],
    },
    { pagePath: "/" }
)

console.log(JSON.stringify({ bp, polish, shots, vekter, phone }, null, 2).slice(0, 16000))
