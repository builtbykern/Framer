const pagePath = "/contact"

const proj = await framer.getProjectInfo()
if (proj.name !== "Arbour") throw new Error("wrong " + proj.name)

const styles = await framer.getTextStyles()
const display = styles.find((s) => s.path === "/Arbour/Display")
const punch = styles.find((s) => s.id === "q12FT3nyc" || s.path === "/Arbour/Display Punch")
if (!display || !punch) throw new Error("missing styles")

const fonts = await framer.getFonts()
const fraunces =
  fonts.find((f) => f.selector === "GF;Fraunces-variable-regular") ||
  fonts.find((f) => f.selector === "GF;Fraunces-regular")
const frauncesItalic =
  fonts.find((f) => f.selector === "GF;Fraunces-variable-italic") ||
  fonts.find((f) => f.selector === "GF;Fraunces-italic")

await punch.setAttributes({
  font: fraunces,
  italicFont: frauncesItalic || null,
  color: display.color,
  fontSize: "104px",
  letterSpacing: "-0.045em",
  lineHeight: "0.92em",
  paragraphSpacing: 0,
  alignment: "left",
  transform: "none",
  balance: false,
  breakpoints: [
    {
      minWidth: 1200,
      fontSize: "96px",
      letterSpacing: "-0.045em",
      lineHeight: "0.92em",
      paragraphSpacing: 0,
    },
    {
      minWidth: 810,
      fontSize: "78px",
      letterSpacing: "-0.04em",
      lineHeight: "0.92em",
      paragraphSpacing: 0,
    },
    {
      minWidth: 640,
      fontSize: "56px",
      letterSpacing: "-0.035em",
      lineHeight: "0.94em",
      paragraphSpacing: 0,
    },
    {
      minWidth: 540,
      fontSize: "44px",
      letterSpacing: "-0.035em",
      lineHeight: "0.95em",
      paragraphSpacing: 0,
    },
  ],
})

const refreshed = (await framer.getTextStyles()).find((s) => s.id === punch.id)
console.log(
  JSON.stringify({
    id: refreshed.id,
    font: refreshed.font,
    italic: refreshed.italicFont,
    fontSize: refreshed.fontSize,
    color: refreshed.color?.name || refreshed.color,
  })
)

// Apply punch style to Contact H1 (all BPs inherit via primary + style breakpoints)
const dsl = [
  `SET R80e8PwNu textStylePreset="Display Punch" maxWidth="1180px"`,
  `SET qjv2S9WpaR80e8PwNu textStylePreset="Display Punch" maxWidth="920px"`,
  `SET jEM0wBo2vR80e8PwNu textStylePreset="Display Punch" maxWidth="100%"`,
  // Quiet entrance — ease, not theatre
  `SET R80e8PwNu appearEffect.trigger="onMount" appearEffect.enter.opacity="0" appearEffect.enter.y="16" appearEffect.enter.transition="spring-duration 0.85s 0.78 0.28s"`,
  `SET TWVNilHRn appearEffect.trigger="onMount" appearEffect.enter.opacity="0" appearEffect.enter.y="8" appearEffect.enter.transition="spring-duration 0.7s 0.82 0.12s"`,
  `SET WLSMm5iy1 appearEffect.trigger="onMount" appearEffect.enter.opacity="0" appearEffect.enter.scale="1.03" appearEffect.enter.transition="spring-duration 1s 0.86 0.05s"`,
  // Ensure soft wash still present
  `SET smzXd5qNf width="100%" visible=true fill="linear-gradient(90deg, rgb(252, 250, 244) 0%, rgb(252, 250, 244) 34%, rgba(252, 250, 244, 0.55) 50%, rgba(252, 250, 244, 0) 68%)"`,
  `SET e5xcrxKTw visible=false`,
].join("; ")

const r = await framer.agent.applyChanges(dsl, { pagePath })
console.log(JSON.stringify({ msg: r.message, errors: r.errors }))

const h1 = await framer.getNode("R80e8PwNu")
console.log("h1 style", h1.inlineTextStyle?.name, h1.inlineTextStyle?.fontSize)

const res = await framer.publish()
console.log(JSON.stringify({ id: res.deployment?.id, status: res.deployment?.status }))
