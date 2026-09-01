// @framerDisableUnlink
// @framerSupportedLayoutWidth: any
// @framerSupportedLayoutHeight: auto
// @framerIntrinsicWidth: 220
// @framerIntrinsicHeight: 48

import { addPropertyControls, ControlType, useIsOnFramerCanvas, useIsStaticRenderer } from "framer"
import { motion, useReducedMotion } from "framer-motion"
import type { CSSProperties } from "react"

type ButtonVariant = "dark" | "light" | "outline" | "loadMore"

interface Props {
    label: string
    href: string
    newTab: boolean
    asSubmit: boolean
    variant: ButtonVariant
    fill: string
    text: string
    border: string
    style?: CSSProperties
}

function variantStyles(
    variant: ButtonVariant,
    fill: string,
    text: string,
    border: string
): CSSProperties {
    switch (variant) {
        case "loadMore":
            return {
                backgroundColor: "rgb(28, 27, 22)",
                color: "rgb(255, 255, 255)",
                border: "none",
                borderRadius: 12,
                textTransform: "none",
                letterSpacing: "-0.01em",
                fontSize: 16,
                fontWeight: 500,
                fontFamily:
                    '"Inter", "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
                minHeight: 60,
                padding: "20px 24px",
            }
        case "light":
            return {
                backgroundColor: "rgb(252, 250, 244)",
                color: "rgb(28, 27, 22)",
                border: `1px solid ${border}`,
            }
        case "outline":
            return {
                backgroundColor: "transparent",
                color: text,
                border: `1px solid ${border}`,
            }
        case "dark":
        default:
            return {
                backgroundColor: fill,
                color: text,
                border: `1px solid ${fill}`,
            }
    }
}

function coerceBool(value: unknown, fallback = false): boolean {
    if (typeof value === "boolean") return value
    if (value === "true") return true
    if (value === "false") return false
    return fallback
}

export default function Arbour_PrimaryButton(props: Partial<Props>) {
    const {
        label = "VIEW ALL NOTES →",
        href = "#",
        newTab = false,
        variant = "dark",
        fill = "rgb(21, 43, 30)",
        text = "rgb(252, 250, 244)",
        border = "rgba(28, 27, 22, 0.18)",
        style,
    } = props
    const asSubmit = coerceBool(props.asSubmit, false)

    const isCanvas = useIsOnFramerCanvas()
    const isStatic = useIsStaticRenderer()
    const prefersReduced = useReducedMotion()
    const shouldAnimate = !isCanvas && !isStatic && !prefersReduced

    const baseStyle: CSSProperties = {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        minHeight: 48,
        padding: "16px 24px",
        letterSpacing: variant === "loadMore" ? "normal" : "0.14em",
        textTransform: variant === "loadMore" ? "none" : "uppercase",
        fontSize: variant === "loadMore" ? 16 : 11,
        fontWeight: variant === "loadMore" ? 500 : 400,
        fontFamily:
            variant === "loadMore"
                ? '"Inter", "SF Pro Text", "Helvetica Neue", Arial, sans-serif'
                : '"Space Mono", monospace',
        borderRadius: variant === "loadMore" ? 12 : 0,
        textDecoration: "none",
        cursor: "pointer",
        ...variantStyles(variant, fill, text, border),
        ...style,
    }

    const motionShared = {
        style: baseStyle,
        whileHover: shouldAnimate ? { opacity: 0.92, y: -1 } : undefined,
        whileTap: shouldAnimate ? { scale: 0.98 } : undefined,
        whileFocus: shouldAnimate ? { opacity: 0.92, y: -1 } : undefined,
        transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] as const },
        onFocus: (e: { currentTarget: HTMLElement }) => {
            e.currentTarget.style.outline = "2px solid rgba(28, 27, 22, 0.45)"
            e.currentTarget.style.outlineOffset = "3px"
        },
        onBlur: (e: { currentTarget: HTMLElement }) => {
            e.currentTarget.style.outline = "none"
            e.currentTarget.style.outlineOffset = "0"
        },
    }

    if (asSubmit) {
        return (
            <motion.button type="submit" {...motionShared}>
                {label}
            </motion.button>
        )
    }

    return (
        <motion.a
            href={href}
            target={newTab ? "_blank" : undefined}
            rel={newTab ? "noopener noreferrer" : undefined}
            {...motionShared}
        >
            {label}
        </motion.a>
    )
}

Arbour_PrimaryButton.displayName = "Arbour_PrimaryButton"

addPropertyControls(Arbour_PrimaryButton, {
    label: {
        type: ControlType.String,
        title: "Label",
        defaultValue: "VIEW ALL NOTES →",
    },
    href: {
        type: ControlType.Link,
        title: "Link",
        hidden: (p: Partial<Props>) => coerceBool(p.asSubmit, false),
    },
    newTab: {
        type: ControlType.Boolean,
        title: "New Tab",
        defaultValue: false,
        hidden: (p: Partial<Props>) => coerceBool(p.asSubmit, false),
    },
    asSubmit: {
        type: ControlType.Boolean,
        title: "Form Submit",
        defaultValue: false,
        enabledTitle: "Submit",
        disabledTitle: "Link",
    },
    variant: {
        type: ControlType.Enum,
        title: "Variant",
        options: ["dark", "light", "outline", "loadMore"],
        optionTitles: ["Dark", "Light", "Outline", "Load More"],
        defaultValue: "dark",
    },
    fill: {
        type: ControlType.Color,
        title: "Fill",
        defaultValue: "rgb(21, 43, 30)",
        hidden: (p: Partial<Props>) => p.variant !== "dark",
    },
    text: {
        type: ControlType.Color,
        title: "Text",
        defaultValue: "rgb(252, 250, 244)",
    },
    border: {
        type: ControlType.Color,
        title: "Border",
        defaultValue: "rgba(28, 27, 22, 0.18)",
        hidden: (p: Partial<Props>) => p.variant === "dark",
    },
})
