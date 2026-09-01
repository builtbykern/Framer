import { addPropertyControls, ControlType, useIsStaticRenderer } from "framer"
import type { CSSProperties } from "react"

interface PaperGrainProps {
    amount?: number
    style?: CSSProperties
}

const GRAIN_URI = encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="4" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter><rect width="100%" height="100%" filter="url(#n)"/></svg>`
)

/**
 * Frozen paper grain for the Work info column. 3–6%. Never on Home Drift.
 *
 * @framerSupportedLayoutWidth any-prefer-fixed
 * @framerSupportedLayoutHeight any-prefer-fixed
 */
export default function Paper_Grain(props: PaperGrainProps) {
    const { amount = 0.05, style } = props
    const isStatic = useIsStaticRenderer()
    const opacity = Math.min(0.06, Math.max(0.03, amount))

    return (
        <div
            aria-hidden
            data-static={isStatic ? "true" : undefined}
            style={{
                position: "relative",
                width: "100%",
                height: "100%",
                overflow: "hidden",
                pointerEvents: "none",
                ...style,
            }}
        >
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    pointerEvents: "none",
                    opacity,
                    mixBlendMode: "multiply",
                    backgroundImage: `url("data:image/svg+xml,${GRAIN_URI}")`,
                    backgroundRepeat: "repeat",
                    backgroundSize: "160px 160px",
                }}
            />
        </div>
    )
}

addPropertyControls(Paper_Grain, {
    amount: {
        type: ControlType.Number,
        title: "Amount",
        defaultValue: 0.05,
        min: 0.03,
        max: 0.06,
        step: 0.01,
        displayStepper: true,
    },
})

Paper_Grain.displayName = "Paper Grain"
