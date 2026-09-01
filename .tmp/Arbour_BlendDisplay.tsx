// @framerDisableUnlink
// @framerSupportedLayoutWidth: any
// @framerSupportedLayoutHeight: auto
// @framerIntrinsicWidth: 720
// @framerIntrinsicHeight: 200
// BuiltByKern · Arbour

import { addPropertyControls, ControlType, useIsStaticRenderer } from "framer"
import { useEffect, useState, type CSSProperties } from "react"

type Blend =
    | "difference"
    | "exclusion"
    | "overlay"
    | "soft-light"
    | "multiply"
    | "screen"
    | "normal"

interface Props {
    line1: string
    italic1: string
    line2: string
    italic2: string
    color: string
    blendMode: Blend
    fontSize: number
    letterSpacing: number
    style?: CSSProperties
}

/**
 * Display line that can sit across Paper → media with mix-blend-mode.
 * Keeps Arbour Fraunces cadence; no WebGL.
 */
export default function Arbour_BlendDisplay(props: Partial<Props>) {
    const line1 = props.line1 ?? "The "
    const italic1 = props.italic1 ?? "first"
    const line2 = props.line2 ?? " conversation stays "
    const italic2 = props.italic2 ?? "between us."
    const color = props.color || "rgb(28, 27, 22)"
    const blendMode = props.blendMode || "difference"
    const fontSize = Number(props.fontSize ?? 84)
    const letterSpacing = Number(props.letterSpacing ?? -0.03)
    const isStatic = useIsStaticRenderer()
    const reduce = usePrefersReducedMotion()

    return (
        <h1
            className="arbour-blend-display"
            style={{
                margin: 0,
                padding: 0,
                width: "100%",
                maxWidth: "100%",
                color,
                mixBlendMode: isStatic || reduce ? "normal" : blendMode,
                fontFamily:
                    '"Fraunces Variable", Fraunces, "Iowan Old Style", Georgia, serif',
                fontWeight: 400,
                fontSize: `clamp(42px, 6.2vw, ${fontSize}px)`,
                lineHeight: 1.02,
                letterSpacing: `${letterSpacing}em`,
                ...props.style,
            }}
        >
            <style>{`
                .arbour-blend-display em {
                    font-style: italic;
                    font-synthesis: none;
                }
                @media (prefers-reduced-motion: reduce) {
                    .arbour-blend-display {
                        mix-blend-mode: normal !important;
                    }
                }
            `}</style>
            {line1}
            <em>{italic1}</em>
            {line2}
            <em>{italic2}</em>
        </h1>
    )
}

function usePrefersReducedMotion(): boolean {
    const [reduced, setReduced] = useState(false)
    useEffect(() => {
        if (typeof window === "undefined" || !window.matchMedia) return
        const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
        const update = () => setReduced(Boolean(mq.matches))
        update()
        mq.addEventListener?.("change", update)
        return () => mq.removeEventListener?.("change", update)
    }, [])
    return reduced
}

Arbour_BlendDisplay.defaultProps = {
    line1: "The ",
    italic1: "first",
    line2: " conversation stays ",
    italic2: "between us.",
    color: "rgb(28, 27, 22)",
    blendMode: "difference" as Blend,
    fontSize: 92,
    letterSpacing: -0.03,
}

addPropertyControls(Arbour_BlendDisplay, {
    line1: { type: ControlType.String, title: "Before 1", defaultValue: "The " },
    italic1: { type: ControlType.String, title: "Italic 1", defaultValue: "first" },
    line2: {
        type: ControlType.String,
        title: "Before 2",
        defaultValue: " conversation stays ",
    },
    italic2: {
        type: ControlType.String,
        title: "Italic 2",
        defaultValue: "between us.",
    },
    color: {
        type: ControlType.Color,
        title: "Color",
        defaultValue: "rgb(28, 27, 22)",
    },
    blendMode: {
        type: ControlType.Enum,
        title: "Blend",
        options: [
            "difference",
            "exclusion",
            "overlay",
            "soft-light",
            "multiply",
            "screen",
            "normal",
        ],
        optionTitles: [
            "Difference",
            "Exclusion",
            "Overlay",
            "Soft Light",
            "Multiply",
            "Screen",
            "Normal",
        ],
        defaultValue: "difference",
    },
    fontSize: {
        type: ControlType.Number,
        title: "Size",
        min: 48,
        max: 128,
        step: 1,
        defaultValue: 92,
    },
    letterSpacing: {
        type: ControlType.Number,
        title: "Tracking",
        min: -0.06,
        max: 0.02,
        step: 0.005,
        defaultValue: -0.03,
    },
})
