const fs = require("fs")
const pagePath = "/contact"
const T = "qjv2S9Wpa"
const P = "jEM0wBo2v"
const INK = "var(--token-e2f9a9eb-668a-4021-80d9-b04413b5f392)"
const PAPER = "var(--token-d5b3c09d-0364-4ed0-8804-e56957faa275)"
const OLIVE = "var(--token-a16d0333-6bd5-4d60-aa00-fac26447145d)"
const CHARTREUSE = "var(--token-db86917b-d19e-4fd7-8dc5-e260f1f35cb1)"
const RACING = "var(--token-fa6ec05f-9d2d-44ad-a813-6c56bf2b324e)"

const proj = await framer.getProjectInfo()
if (proj.name !== "Arbour") throw new Error("wrong " + proj.name)

// 1) FormButton → normal UI button (Inter), keep type=submit
const formBtn = `// @framerDisableUnlink
// @framerSupportedLayoutWidth: any
// @framerSupportedLayoutHeight: auto
// @framerIntrinsicWidth: 200
// @framerIntrinsicHeight: 48

import { addPropertyControls, ControlType, useIsOnFramerCanvas, useIsStaticRenderer } from "framer"
import { motion, useReducedMotion } from "framer-motion"
import type { CSSProperties } from "react"

interface Props {
    text: string
    label: string
    color: string
    border: string
    backgroundColor: string
    style?: CSSProperties
}

const INK = "rgb(28, 27, 22)"
const PAPER = "rgb(252, 250, 244)"

/** Normal solid submit — Inter, not Meta mono. */
export default function Arbour_FormButton(
    props: Partial<Props> & { background?: string; borderCSS?: string }
) {
    const rawLabel = props.label
    const rawText = props.text
    const labelLooksLikeColor =
        typeof rawText === "string" &&
        (rawText.startsWith("var(") || rawText.startsWith("rgb"))
    const label =
        (typeof rawLabel === "string" && rawLabel.length > 0 ? rawLabel : null) ||
        (!labelLooksLikeColor && typeof rawText === "string" ? rawText : null) ||
        "Subscribe"
    const color = (labelLooksLikeColor ? rawText : null) || props.color || PAPER
    const backgroundColor = props.backgroundColor || props.background || INK
    const border = props.border || props.borderCSS || \`1px solid \${backgroundColor}\`
    const { style } = props

    const isCanvas = useIsOnFramerCanvas()
    const isStatic = useIsStaticRenderer()
    const prefersReduced = useReducedMotion()
    const shouldAnimate = !isCanvas && !isStatic && !prefersReduced

    const buttonStyle: CSSProperties = {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        minHeight: 48,
        padding: "14px 22px",
        fontFamily: '"Inter", "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
        fontSize: 14,
        fontWeight: 500,
        letterSpacing: "-0.01em",
        textTransform: "none",
        color,
        backgroundColor,
        border,
        borderRadius: 0,
        cursor: "pointer",
        outline: "none",
        ...style,
    }

    return (
        <motion.button
            type="submit"
            style={buttonStyle}
            whileHover={shouldAnimate ? { opacity: 0.92, y: -1 } : undefined}
            whileTap={shouldAnimate ? { scale: 0.98 } : undefined}
            whileFocus={shouldAnimate ? { opacity: 0.92, y: -1 } : undefined}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            onFocus={(e) => {
                e.currentTarget.style.outline = "2px solid rgba(28, 27, 22, 0.45)"
                e.currentTarget.style.outlineOffset = "3px"
            }}
            onBlur={(e) => {
                e.currentTarget.style.outline = "none"
                e.currentTarget.style.outlineOffset = "0"
            }}
        >
            {label}
        </motion.button>
    )
}

Arbour_FormButton.displayName = "Arbour_FormButton"

addPropertyControls(Arbour_FormButton, {
    text: { type: ControlType.String, title: "Label", defaultValue: "Subscribe" },
    color: { type: ControlType.Color, title: "Text", defaultValue: PAPER },
    border: { type: ControlType.String, title: "Border CSS", defaultValue: \`1px solid \${INK}\` },
    backgroundColor: { type: ControlType.Color, title: "Background", defaultValue: INK },
})
`
fs.writeFileSync(".tmp/Arbour_FormButton.tsx", formBtn)
const fb = await framer.getCodeFile("Arbour_FormButton.tsx")
await fb.setFileContent(formBtn)
console.log("FormButton typeErrors", await (await framer.getCodeFiles()).find((f) => f.id === fb.id)?.typecheck?.({ strict: true }))

// Keep UnderlineLink improvements (Olive→Ink) — fine globally; hero reverted below

// 2) Revert HERO Write Privately
const revertHero = [
  `SET uONXSHosa link.href="mailto:enquiries@arbour.london" cursor="pointer"`,
  `SET ${T}uONXSHosa link.href="mailto:enquiries@arbour.london" cursor="pointer"`,
  `SET ${P}uONXSHosa link.href="mailto:enquiries@arbour.london" cursor="pointer"`,
  `SET BMhLvwqld $control__decorative=true $control__text="${OLIVE}" $control__underline="${OLIVE}"`,
  `SET ${T}BMhLvwqld $control__decorative=true $control__text="${OLIVE}" $control__underline="${OLIVE}"`,
  `SET ${P}BMhLvwqld $control__decorative=true $control__text="${OLIVE}" $control__underline="${OLIVE}"`,
].join("; ")
let r = await framer.agent.applyChanges(revertHero, { pagePath })
console.log("revert hero", r.message, r.errors)

// 3) Green section pill — kill scale hover + browser blue
// Replace rich text with UnderlineLink (Ink on Chartreuse), link on component; frame not an <a>
const green = [
  // Desktop Email Arbour pill
  `SET qB71RMXEV link="null" cursor="pointer" hoverEffect.scale="1" hoverEffect.opacity="0.92" hoverEffect.transition="tween 0.22,1,0.36,1 0.2s 0s" fill="${CHARTREUSE}"`,
  `SET EuA2UleYw visible=false`,
  // Tablet / Phone replicas
  `SET ${T}qB71RMXEV link="null" cursor="pointer" hoverEffect.scale="1" hoverEffect.opacity="0.92" fill="${CHARTREUSE}"`,
  `SET ${T}EuA2UleYw visible=false`,
  `SET ${P}qB71RMXEV link="null" cursor="pointer" hoverEffect.scale="1" hoverEffect.opacity="0.92" fill="${CHARTREUSE}"`,
  `SET ${P}EuA2UleYw visible=false`,
  // Subscribe label + Ink solid
  `SET u2DLuU3hW $control__label="Subscribe" $control__text="${PAPER}" $control__background="${INK}" $control__borderCSS="1px solid ${INK}"`,
  `SET ${T}u2DLuU3hW $control__label="Subscribe" $control__text="${PAPER}" $control__background="${INK}" $control__borderCSS="1px solid ${INK}"`,
  `SET ${P}u2DLuU3hW $control__label="Subscribe" $control__text="${PAPER}" $control__background="${INK}" $control__borderCSS="1px solid ${INK}"`,
].join("; ")
r = await framer.agent.applyChanges(green, { pagePath })
console.log("green+sub", r.message, r.errors)

// Insert UnderlineLink into Email Arbour if not present
async function ensurePillLink(parentId, existingCheck) {
  const parent = await framer.agent.serialize({ id: parentId, depth: 2 }, { pagePath })
  const has = (parent.children || []).some(
    (c) =>
      c.$componentDisplayName === "Arbour_UnderlineLink" ||
      /UnderlineLink/i.test(c.component || "")
  )
  if (has) {
    console.log(parentId, "already has UnderlineLink")
    return (parent.children || []).find(
      (c) => c.$componentDisplayName === "Arbour_UnderlineLink"
    )?.id
  }
  // create via applyChanges
  const tmpId = "pillLink" + parentId.slice(-4)
  const dsl = `+ComponentInstanceNode ${tmpId} component="codeFile/zCa0pzg:default" parent="${parentId}"; SET ${tmpId} $control__label="WRITE PRIVATELY →" $control__link="mailto:enquiries@arbour.london" $control__decorative=false $control__text="${INK}" $control__hover="${RACING}" $control__underline="${INK}" width="fit-content" height="fit-content"`
  const res = await framer.agent.applyChanges(dsl, { pagePath })
  console.log("insert", parentId, res.message, res.errors)
  const again = await framer.agent.serialize({ id: parentId, depth: 2 }, { pagePath })
  return (again.children || []).find(
    (c) => c.$componentDisplayName === "Arbour_UnderlineLink"
  )?.id
}

await ensurePillLink("qB71RMXEV")
await ensurePillLink(`${T}qB71RMXEV`)
await ensurePillLink(`${P}qB71RMXEV`)

const pub = await framer.publish()
console.log(JSON.stringify({ id: pub.deployment?.id, status: pub.deployment?.status }))
