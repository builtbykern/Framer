const pagePath = "/contact"
const PAPER = "rgb(252, 250, 244)"
const INK = "var(--token-e2f9a9eb-668a-4021-80d9-b04413b5f392)"

const proj = await framer.getProjectInfo()
if (proj.name !== "Arbour") throw new Error("wrong " + proj.name)

// Soft feathered wash (no hard edge) + display-scale H1 + denser cinema media
// Arbour: punch via scale/atmosphere, never stroke/blend theatre
const dsl = [
  // Restore wash as soft left→clear gradient across full stage (no hard borde)
  `SET smzXd5qNf width="100%" left="0px" top="0px" bottom="0px" zIndex=2 visible=true fill="linear-gradient(90deg, ${PAPER} 0%, ${PAPER} 34%, rgba(252, 250, 244, 0.55) 50%, rgba(252, 250, 244, 0) 68%)"`,
  `SET qjv2S9WpasmzXd5qNf width="100%" visible=true fill="linear-gradient(90deg, ${PAPER} 0%, ${PAPER} 30%, rgba(252, 250, 244, 0.5) 48%, rgba(252, 250, 244, 0) 64%)"`,
  // Phone: no wash overlay
  `SET jEM0wBo2vsmzXd5qNf visible=false`,

  // Media fuller / more cinematic
  `SET WLSMm5iy1 width="78%"`,
  `SET qjv2S9WpaWLSMm5iy1 width="76%"`,

  // H1 punch — local scale, not global Display style
  `SET R80e8PwNu fontSize="104px" lineHeight="0.92em" letterSpacing="-0.045em" maxWidth="1180px" textColor="${INK}"`,
  `SET qjv2S9WpaR80e8PwNu fontSize="78px" lineHeight="0.92em" letterSpacing="-0.04em" maxWidth="920px"`,
  `SET jEM0wBo2vR80e8PwNu fontSize="44px" lineHeight="0.95em" letterSpacing="-0.035em" maxWidth="100%"`,

  // Native copy a touch wider for the larger measure
  `SET qxIyvg6PE maxWidth="1200px" gap="14px"`,
  `SET qjv2S9WpaqxIyvg6PE maxWidth="980px" gap="12px"`,

  // Tighten hero vertical rhythm (less dead air above type)
  `SET AATw4pip9 padding="72px 40px 40px 40px" gap="16px"`,
  `SET qjv2S9WpaAATw4pip9 padding="64px 32px 32px 32px" gap="14px"`,

  // Entrance: quiet but decisive type rise
  `SET R80e8PwNu appearEffect.trigger="onMount" appearEffect.enter.opacity="0" appearEffect.enter.y="18" appearEffect.enter.transition="{type:spring, stiffness:120, damping:24, delay:0.28}"`,
  `SET TWVNilHRn appearEffect.trigger="onMount" appearEffect.enter.opacity="0" appearEffect.enter.y="10" appearEffect.enter.transition="{type:spring, stiffness:140, damping:26, delay:0.12}"`,
  `SET WLSMm5iy1 appearEffect.trigger="onMount" appearEffect.enter.opacity="0" appearEffect.enter.scale="1.04" appearEffect.enter.transition="{type:spring, stiffness:90, damping:28, delay:0.05}"`,

  // Kill blend injector (no stroke / no blend)
  `SET e5xcrxKTw visible=false`,
  `SET qjv2S9Wpae5xcrxKTw visible=false`,
  `SET jEM0wBo2ve5xcrxKTw visible=false`,
].join("; ")

const r = await framer.agent.applyChanges(dsl, { pagePath })
console.log(JSON.stringify({
  msg: r.message,
  errors: r.errors,
  warnings: (r.warnings || []).slice(0, 8),
}))

const wash = await framer.getNode("smzXd5qNf")
const h1 = await framer.getNode("R80e8PwNu")
console.log(JSON.stringify({
  wash: {
    w: wash.width,
    bg: wash.backgroundColor,
    g: wash.backgroundGradient,
    fill: wash.fill,
  },
  h1: {
    maxW: h1.maxWidth,
    fontSize: h1.fontSize,
    lineHeight: h1.lineHeight,
    letterSpacing: h1.letterSpacing,
  },
}))

const res = await framer.publish()
console.log(JSON.stringify({ id: res.deployment?.id, status: res.deployment?.status }))
