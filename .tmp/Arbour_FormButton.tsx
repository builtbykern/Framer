// @framerDisableUnlink
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
    const border = props.border || props.borderCSS || `1px solid ${backgroundColor}`
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
    border: { type: ControlType.String, title: "Border CSS", defaultValue: `1px solid ${INK}` },
    backgroundColor: { type: ControlType.Color, title: "Background", defaultValue: INK },
})
