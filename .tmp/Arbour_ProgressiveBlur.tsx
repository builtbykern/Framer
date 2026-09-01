// @framerDisableUnlink
// BuiltByKern · Arbour — progressive edge blur (reduced-motion → strength 0)
import { addPropertyControls, ControlType } from "framer"
import { useReducedMotion } from "framer-motion"
import { useMemo, useRef } from "react"
import type { CSSProperties } from "react"

type Curve = "linear" | "bezier" | "ease-in" | "ease-out" | "ease-in-out"
type Position = "top" | "bottom" | "left" | "right"

interface Arbour_ProgressiveBlurProps {
    position: Position
    strength: number
    percentage: number
    divCount: number
    exponential: boolean
    opacity: number
    curve: Curve
    style?: CSSProperties
}

const CURVE_FUNCTIONS: Record<Curve, (p: number) => number> = {
    linear: (p) => p,
    bezier: (p) => p * p * (3 - 2 * p),
    "ease-in": (p) => p * p,
    "ease-out": (p) => 1 - Math.pow(1 - p, 2),
    "ease-in-out": (p) =>
        p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2,
}

function getGradientDirection(position: Position): string {
    const map: Record<Position, string> = {
        top: "to top",
        bottom: "to bottom",
        left: "to left",
        right: "to right",
    }
    return map[position]
}

/**
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight auto
 */
export default function Arbour_ProgressiveBlur(
    props: Partial<Arbour_ProgressiveBlurProps>
) {
    const {
        position = "bottom",
        strength = 2,
        percentage = 30,
        divCount = 5,
        exponential = false,
        opacity = 1,
        curve = "linear",
        style,
    } = props

    const prefersReduced = useReducedMotion()
    const effectiveStrength = prefersReduced ? 0 : strength

    const containerRef = useRef<HTMLDivElement>(null)
    const curveFunc = CURVE_FUNCTIONS[curve] ?? CURVE_FUNCTIONS.linear

    const blurDivs = useMemo(() => {
        if (effectiveStrength <= 0) return []

        const divs: JSX.Element[] = []
        const increment = 100 / divCount

        for (let i = 1; i <= divCount; i += 1) {
            const progress = curveFunc(i / divCount)
            let blurValue: number
            if (exponential) {
                blurValue =
                    Math.pow(2, progress * 4) * 0.0625 * effectiveStrength
            } else {
                blurValue =
                    0.0625 * (progress * divCount + 1) * effectiveStrength
            }

            const p1 = Math.round((increment * i - increment) * 10) / 10
            const p2 = Math.round(increment * i * 10) / 10
            const p3 = Math.round((increment * i + increment) * 10) / 10
            const p4 = Math.round((increment * i + increment * 2) * 10) / 10

            let gradient = `transparent ${p1}%, black ${p2}%`
            if (p3 <= 100) gradient += `, black ${p3}%`
            if (p4 <= 100) gradient += `, transparent ${p4}%`

            const direction = getGradientDirection(position)
            const divStyle: CSSProperties = {
                position: "absolute",
                inset: 0,
                maskImage: `linear-gradient(${direction}, ${gradient})`,
                WebkitMaskImage: `linear-gradient(${direction}, ${gradient})`,
                backdropFilter: `blur(${blurValue.toFixed(3)}rem)`,
                WebkitBackdropFilter: `blur(${blurValue.toFixed(3)}rem)`,
                opacity,
            }
            divs.push(<div key={i} style={divStyle} />)
        }
        return divs
    }, [
        divCount,
        effectiveStrength,
        exponential,
        curveFunc,
        position,
        opacity,
    ])

    const containerStyle = useMemo((): CSSProperties => {
        const isVertical = position === "top" || position === "bottom"
        const isHorizontal = position === "left" || position === "right"
        const baseStyle: CSSProperties = {
            position: "absolute",
            pointerEvents: "none",
            ...style,
        }
        if (isVertical) {
            baseStyle.height = `${percentage}%`
            baseStyle.width = "100%"
            if (position === "top") baseStyle.top = 0
            if (position === "bottom") baseStyle.bottom = 0
            baseStyle.left = 0
            baseStyle.right = 0
        } else if (isHorizontal) {
            baseStyle.width = `${percentage}%`
            baseStyle.height = "100%"
            if (position === "left") baseStyle.left = 0
            if (position === "right") baseStyle.right = 0
            baseStyle.top = 0
            baseStyle.bottom = 0
        }
        return baseStyle
    }, [position, percentage, style])

    return (
        <div ref={containerRef} style={containerStyle}>
            <div
                style={{
                    position: "relative",
                    width: "100%",
                    height: "100%",
                }}
            >
                {blurDivs}
            </div>
        </div>
    )
}

Arbour_ProgressiveBlur.displayName = "Arbour_ProgressiveBlur"

addPropertyControls(Arbour_ProgressiveBlur, {
    position: {
        type: ControlType.Enum,
        title: "Position",
        options: ["top", "bottom", "left", "right"],
        optionTitles: ["Top", "Bottom", "Left", "Right"],
        defaultValue: "bottom",
    },
    percentage: {
        type: ControlType.Number,
        title: "Coverage",
        defaultValue: 60,
        min: 0,
        max: 100,
        step: 1,
        unit: "%",
    },
    strength: {
        type: ControlType.Number,
        title: "Strength",
        defaultValue: 1.2,
        min: 0.5,
        max: 10,
        step: 0.5,
    },
    divCount: {
        type: ControlType.Number,
        title: "Div Count",
        defaultValue: 4,
        min: 2,
        max: 20,
        step: 1,
        displayStepper: true,
    },
    exponential: {
        type: ControlType.Boolean,
        title: "Exponential",
        defaultValue: true,
        enabledTitle: "On",
        disabledTitle: "Off",
    },
    curve: {
        type: ControlType.Enum,
        title: "Curve",
        options: ["linear", "bezier", "ease-in", "ease-out", "ease-in-out"],
        optionTitles: [
            "Linear",
            "Bezier",
            "Ease In",
            "Ease Out",
            "Ease In-Out",
        ],
        defaultValue: "linear",
    },
    opacity: {
        type: ControlType.Number,
        title: "Opacity",
        defaultValue: 1,
        min: 0,
        max: 1,
        step: 0.1,
    },
})
