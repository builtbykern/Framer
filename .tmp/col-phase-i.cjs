const fs = require("fs")
const path = require("path")
const out = "/Users/noel/Desktop/Framer/.tmp/col-shots"
fs.mkdirSync(out, { recursive: true })

await framer.agent.readComponentControls({ componentIds: ["PzdF7MhGJ"] })

const rest = await framer.agent.applyChanges(
    `
SET Fyj0MwAfG $control__slug="var(--variable-v1_jAZuNB)" $control__date="var(--variable-Vu5g1RUmz)" $control__description="var(--variable-nVT6VC7MK)" $control__still="var(--variable-Bj5XtxwsY)";
CREATE_VARIANT lytTab001 from="vN8iVl4NW";
SET lytTab001 name="Tablet" width="810px" left="1500px" top="0px";
CREATE_VARIANT lytPhn001 from="vN8iVl4NW";
SET lytPhn001 name="Phone" width="390px" left="2380px" top="0px";
CREATE_VARIANT bpTablet1 from="WQLkyLRf1";
SET bpTablet1 name="Tablet" width="810px" left="1500px" top="0px";
CREATE_VARIANT bpPhone01 from="WQLkyLRf1";
SET bpPhone01 name="Phone" width="390px" left="2380px" top="0px";
CREATE_VARIANT wkTab0001 from="HUNupzO9a";
SET wkTab0001 name="Tablet" width="810px" left="1500px" top="0px";
CREATE_VARIANT wkPhn0001 from="HUNupzO9a";
SET wkPhn0001 name="Phone" width="390px" left="2380px" top="0px";
CREATE_VARIANT inTab0001 from="uSuSQYtM4";
SET inTab0001 name="Tablet" width="810px" left="1500px" top="0px";
CREATE_VARIANT inPhn0001 from="uSuSQYtM4";
SET inPhn0001 name="Phone" width="390px" left="2380px" top="0px";
CREATE_VARIANT ctTab0001 from="cEK2oDAzz";
SET ctTab0001 name="Tablet" width="810px" left="1500px" top="0px";
CREATE_VARIANT ctPhn0001 from="cEK2oDAzz";
SET ctPhn0001 name="Phone" width="390px" left="2380px" top="0px";
CREATE_VARIANT erTab0001 from="hh6O1ngaE";
SET erTab0001 name="Tablet" width="810px" left="1500px" top="0px";
CREATE_VARIANT erPhn0001 from="hh6O1ngaE";
SET erPhn0001 name="Phone" width="390px" left="2380px" top="0px";
`.replace(/\n+/g, " "),
    { pagePath: "/" }
)

console.log(JSON.stringify({ rest }, null, 2))
