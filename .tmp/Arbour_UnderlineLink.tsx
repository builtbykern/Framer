// @framerDisableUnlink
// @framerSupportedLayoutWidth: any
// @framerSupportedLayoutHeight: auto

import { addPropertyControls, ControlType, useIsOnFramerCanvas, useIsStaticRenderer } from "framer"
import { motion, useReducedMotion } from "framer-motion"
import type { CSSProperties } from "react"

interface Props {
    label: string
    href: string
    openInNewTab: boolean
    decorative: boolean
    color: string
    underlineColor: string
    underlineHeight: number
    underlineOffset: number
    style?: CSSProperties
}

const META_STYLE: CSSProperties = {
    margin: 0,
    fontFamily: '"Space Mono", monospace',
    fontSize: 11,
    fontWeight: 400,
    lineHeight: 1.5,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    textDecoration: "none",
}

function coerceBool(value: unknown, fallback = false): boolean {
    if (typeof value === "boolean") return value
    if (value === "true") return true
    if (value === "false") return false
    return fallback
}

/** Original Arbour underline: color stays; line draws in on hover (scaleX 0 → 1). */
export default function Arbour_UnderlineLink(
    props: Partial<Props> & {
        link?: string
        newTab?: boolean
        text?: string
        underline?: string
        line?: number
        offset?: number
        hover?: string
        hoverColor?: string
    }
) {
    const label = props.label ?? "VIEW PROJECT →"
    const href = props.href || props.link || "#"
    const openInNewTab = coerceBool(props.openInNewTab ?? props.newTab, false)
    const decorative = coerceBool(props.decorative, false)
    const color = props.color || props.text || "rgb(252, 250, 244)"
    const underlineColor = props.underlineColor || props.underline || color
    const underlineHeight = props.underlineHeight ?? props.line ?? 1
    const underlineOffset = props.underlineOffset ?? props.offset ?? 4
    const { style } = props

    const isCanvas = useIsOnFramerCanvas()
    const isStatic = useIsStaticRenderer()
    const prefersReduced = useReducedMotion()
    const shouldAnimate = !isCanvas && !isStatic && !prefersReduced

    const linkStyle: CSSProperties = {
        ...META_STYLE,
        color,
        display: "inline-flex",
        flexDirection: "column",
        alignItems: "flex-start",
        width: "max-content",
        cursor: "pointer",
        position: "relative",
        ...style,
    }

    const lineStyle: CSSProperties = {
        display: "block",
        height: underlineHeight,
        backgroundColor: underlineColor,
        width: "100%",
        marginTop: underlineOffset,
        transformOrigin: "left center",
    }

    const motionProps = {
        style: linkStyle,
        initial: "rest" as const,
        whileHover: shouldAnimate ? ("hover" as const) : undefined,
        whileFocus: shouldAnimate ? ("hover" as const) : undefined,
    }

    const labelNode = (
        <>
            <span>{label}</span>
            <motion.span
                aria-hidden
                style={lineStyle}
                variants={{
                    rest: { scaleX: 0, opacity: 0.35 },
                    hover: { scaleX: 1, opacity: 1 },
                }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            />
        </>
    )

    if (decorative) {
        return <motion.span {...motionProps}>{labelNode}</motion.span>
    }

    return (
        <motion.a
            href={href}
            target={openInNewTab ? "_blank" : undefined}
            rel={openInNewTab ? "noopener noreferrer" : undefined}
            {...motionProps}
        >
            {labelNode}
        </motion.a>
    )
}

addPropertyControls(Arbour_UnderlineLink, {
    label: {
        type: ControlType.String,
        title: "Label",
        defaultValue: "VIEW PROJECT →",
    },
    href: {
        type: ControlType.Link,
        title: "Link",
    },
    openInNewTab: {
        type: ControlType.Boolean,
        title: "New Tab",
        defaultValue: false,
    },
    decorative: {
        type: ControlType.Boolean,
        title: "Decorative",
        description: "Inside a linked frame — renders span, not anchor.",
        defaultValue: false,
    },
    color: {
        type: ControlType.Color,
        title: "Text",
        defaultValue: "rgb(252, 250, 244)",
    },
    underlineColor: {
        type: ControlType.Color,
        title: "Underline",
        defaultValue: "rgb(252, 250, 244)",
    },
    underlineHeight: {
        type: ControlType.Number,
        title: "Line",
        defaultValue: 1,
        min: 1,
        max: 3,
        unit: "px",
        step: 1,
    },
    underlineOffset: {
        type: ControlType.Number,
        title: "Offset",
        defaultValue: 4,
        min: 0,
        max: 12,
        unit: "px",
        step: 1,
    },
})
