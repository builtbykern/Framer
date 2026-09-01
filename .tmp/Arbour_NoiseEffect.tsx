// @framerDisableUnlink
// @framerSupportedLayoutWidth: any
// @framerSupportedLayoutHeight: auto
// @framerIntrinsicWidth: 400
// @framerIntrinsicHeight: 400
// BuiltByKern · Arbour

import {
    addPropertyControls,
    ControlType,
    useIsOnFramerCanvas,
    useIsStaticRenderer,
} from "framer"
import { useReducedMotion } from "framer-motion"
import { useEffect, useRef } from "react"
import type { CSSProperties } from "react"

interface ArbourNoiseEffectProps {
    patternSize: number
    patternScaleX: number
    patternScaleY: number
    patternRefreshInterval: number
    grainOpacity: number
    animate: boolean
    blendMode: CSSProperties["mixBlendMode"]
    style?: CSSProperties
}

const CANVAS_RES = 512

function clampAlpha(grainOpacity: number): number {
    const normalized = Math.min(1, Math.max(0, grainOpacity))
    return Math.round(normalized * 255)
}

export default function Arbour_NoiseEffect(props: Partial<ArbourNoiseEffectProps>) {
    const {
        patternSize = 280,
        patternScaleX = 1,
        patternScaleY = 1,
        patternRefreshInterval = 3,
        grainOpacity = 0.045,
        animate = true,
        blendMode = "soft-light",
        style,
    } = props

    const grainRef = useRef<HTMLCanvasElement>(null)
    const isCanvas = useIsOnFramerCanvas()
    const isStatic = useIsStaticRenderer()
    const prefersReduced = useReducedMotion()
    const shouldAnimate =
        animate && !isCanvas && !isStatic && !prefersReduced

    useEffect(() => {
        if (typeof window === "undefined") return

        const canvas = grainRef.current
        if (!canvas) return

        const ctx = canvas.getContext("2d", { alpha: true })
        if (!ctx) return

        let frame = 0
        let animationId = 0
        const alpha = clampAlpha(grainOpacity)

        const resize = () => {
            canvas.width = CANVAS_RES
            canvas.height = CANVAS_RES
        }

        const drawGrain = () => {
            const imageData = ctx.createImageData(CANVAS_RES, CANVAS_RES)
            const data = imageData.data
            for (let i = 0; i < data.length; i += 4) {
                const value = Math.random() * 255
                data[i] = value
                data[i + 1] = value
                data[i + 2] = value
                data[i + 3] = alpha
            }
            ctx.putImageData(imageData, 0, 0)
        }

        const loop = () => {
            if (frame % patternRefreshInterval === 0) drawGrain()
            frame += 1
            animationId = window.requestAnimationFrame(loop)
        }

        resize()
        drawGrain()
        if (shouldAnimate) loop()

        return () => {
            if (animationId) window.cancelAnimationFrame(animationId)
        }
    }, [
        patternSize,
        patternScaleX,
        patternScaleY,
        patternRefreshInterval,
        grainOpacity,
        shouldAnimate,
    ])

    const tileScaleX = patternScaleX * (patternSize / 280)
    const tileScaleY = patternScaleY * (patternSize / 280)

    return (
        <div
            style={{
                position: "relative",
                width: "100%",
                height: "100%",
                overflow: "hidden",
                pointerEvents: "none",
                ...style,
            }}
        >
            <canvas
                ref={grainRef}
                aria-hidden
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: `${100 * tileScaleX}%`,
                    height: `${100 * tileScaleY}%`,
                    pointerEvents: "none",
                    imageRendering: "pixelated",
                    mixBlendMode: blendMode,
                    opacity: 1,
                }}
            />
        </div>
    )
}

Arbour_NoiseEffect.displayName = "Arbour_NoiseEffect"

addPropertyControls(Arbour_NoiseEffect, {
    grainOpacity: {
        type: ControlType.Number,
        title: "Grain Strength",
        defaultValue: 0.045,
        min: 0.01,
        max: 0.2,
        step: 0.005,
        displayStepper: true,
    },
    animate: {
        type: ControlType.Boolean,
        title: "Animate Grain",
        defaultValue: true,
        enabledTitle: "Film",
        disabledTitle: "Static",
    },
    patternSize: {
        type: ControlType.Number,
        title: "Pattern Size",
        defaultValue: 280,
        min: 120,
        max: 480,
        step: 10,
    },
    patternScaleX: {
        type: ControlType.Number,
        title: "Scale X",
        defaultValue: 1,
        min: 0.5,
        max: 2,
        step: 0.1,
    },
    patternScaleY: {
        type: ControlType.Number,
        title: "Scale Y",
        defaultValue: 1,
        min: 0.5,
        max: 2,
        step: 0.1,
    },
    patternRefreshInterval: {
        type: ControlType.Number,
        title: "Refresh Rate",
        defaultValue: 3,
        min: 1,
        max: 12,
        step: 1,
        displayStepper: true,
    },
    blendMode: {
        type: ControlType.Enum,
        title: "Blend Mode",
        defaultValue: "soft-light",
        options: [
            "normal",
            "multiply",
            "screen",
            "overlay",
            "soft-light",
        ],
        optionTitles: [
            "Normal",
            "Multiply",
            "Screen",
            "Overlay",
            "Soft Light",
        ],
    },
})
