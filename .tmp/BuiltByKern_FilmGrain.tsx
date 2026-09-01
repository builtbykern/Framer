// @framerDisableUnlink
// BuiltByKern — Film Grain. Soft editorial overlay for Marketplace.

import {
    addPropertyControls,
    ControlType,
    useIsOnFramerCanvas,
    useIsStaticRenderer,
} from "framer"
import { useInView, useReducedMotion } from "framer-motion"
import { useEffect, useRef, type CSSProperties } from "react"

interface BuiltByKern_FilmGrainProps {
    amount: number
    tint: string
    size: number
    animate: boolean
    style?: CSSProperties
}

const BUFFER = 256

function clamp(n: number, min: number, max: number): number {
    return Math.min(max, Math.max(min, n))
}

function parseRgb(input: string): [number, number, number] {
    const hex = input.trim()
    if (hex.startsWith("#") && hex.length === 7) {
        return [
            parseInt(hex.slice(1, 3), 16),
            parseInt(hex.slice(3, 5), 16),
            parseInt(hex.slice(5, 7), 16),
        ]
    }
    if (hex.startsWith("#") && hex.length === 4) {
        return [
            parseInt(hex[1] + hex[1], 16),
            parseInt(hex[2] + hex[2], 16),
            parseInt(hex[3] + hex[3], 16),
        ]
    }
    const m = hex.match(
        /rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)/i
    )
    if (m) {
        return [
            Math.round(Number(m[1])),
            Math.round(Number(m[2])),
            Math.round(Number(m[3])),
        ]
    }
    return [17, 17, 17]
}

/** Soft value noise — smooth enough to feel like film, not digital static. */
function valueNoise(x: number, y: number, seed: number): number {
    const n = Math.sin(x * 127.1 + y * 311.7 + seed * 74.7) * 43758.5453
    return n - Math.floor(n)
}

function smoothNoise(x: number, y: number, seed: number): number {
    const x0 = Math.floor(x)
    const y0 = Math.floor(y)
    const fx = x - x0
    const fy = y - y0
    // Smoothstep
    const ux = fx * fx * (3 - 2 * fx)
    const uy = fy * fy * (3 - 2 * fy)

    const a = valueNoise(x0, y0, seed)
    const b = valueNoise(x0 + 1, y0, seed)
    const c = valueNoise(x0, y0 + 1, seed)
    const d = valueNoise(x0 + 1, y0 + 1, seed)

    const ab = a + (b - a) * ux
    const cd = c + (d - c) * ux
    return ab + (cd - ab) * uy
}

function fbm(x: number, y: number, seed: number): number {
    let v = 0
    let amp = 0.55
    let freq = 1
    let sum = 0
    for (let i = 0; i < 3; i += 1) {
        v += smoothNoise(x * freq, y * freq, seed + i * 19) * amp
        sum += amp
        amp *= 0.5
        freq *= 2.05
    }
    return v / sum
}

/**
 * BuiltByKern_FilmGrain
 *
 * Soft full-bleed film grain. Click-through. Canvas freezes on Framer canvas
 * and when reduced-motion or off-screen.
 *
 * @framerIntrinsicWidth 400
 * @framerIntrinsicHeight 400
 * @framerSupportedLayoutWidth any-prefer-fixed
 * @framerSupportedLayoutHeight any-prefer-fixed
 */
export default function BuiltByKern_FilmGrain(
    props: Partial<BuiltByKern_FilmGrainProps>
) {
    const {
        amount = 22,
        tint = "#111111",
        size = 3,
        animate = false,
        style,
    } = props

    const rootRef = useRef<HTMLDivElement>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const isCanvas = useIsOnFramerCanvas() ?? false
    const isStatic = useIsStaticRenderer()
    const prefersReduced = useReducedMotion() ?? false
    const inView = useInView(rootRef, { amount: 0.05, once: false })

    const freeze =
        isCanvas || isStatic || prefersReduced || !animate || !inView

    const safeAmount = clamp(amount, 0, 100) / 100
    const safeSize = clamp(size, 1, 8)
    const [tr, tg, tb] = parseRgb(tint)

    useEffect(() => {
        if (typeof window === "undefined") return

        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext("2d", { alpha: true })
        if (!ctx) return

        canvas.width = BUFFER
        canvas.height = BUFFER

        // Larger size → coarser soft fields (lower frequency).
        const freq = 0.085 / Math.max(0.65, safeSize * 0.45)
        // Soft curve: keep midtones gentle, avoid harsh speckles.
        const peak = safeAmount * 0.42
        let seed = 1.7
        let raf = 0
        let last = 0

        const paint = () => {
            const image = ctx.createImageData(BUFFER, BUFFER)
            const data = image.data

            for (let y = 0; y < BUFFER; y += 1) {
                for (let x = 0; x < BUFFER; x += 1) {
                    const n = fbm(x * freq, y * freq, seed)
                    // Bias toward soft mid grain; squash extremes.
                    const soft = Math.pow(n, 1.35)
                    const a = Math.round(clamp(soft * peak * 255, 0, 255))
                    const i = (y * BUFFER + x) * 4
                    data[i] = tr
                    data[i + 1] = tg
                    data[i + 2] = tb
                    data[i + 3] = a
                }
            }

            ctx.putImageData(image, 0, 0)
        }

        paint()

        if (freeze) {
            return () => {
                if (raf) window.cancelAnimationFrame(raf)
            }
        }

        const tick = (now: number) => {
            // Rare, tiny seed drift — avoid visible flicker.
            if (now - last >= 2400) {
                seed += 0.08
                paint()
                last = now
            }
            raf = window.requestAnimationFrame(tick)
        }

        raf = window.requestAnimationFrame(tick)

        return () => {
            if (raf) window.cancelAnimationFrame(raf)
        }
    }, [freeze, safeAmount, safeSize, tb, tg, tr])

    return (
        <div
            ref={rootRef}
            style={{
                position: "relative",
                width: "100%",
                height: "100%",
                overflow: "hidden",
                pointerEvents: "none",
                ...style,
            }}
            aria-hidden="true"
        >
            <canvas
                ref={canvasRef}
                aria-hidden="true"
                style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    mixBlendMode: "soft-light",
                    opacity: 0.85,
                    // Softens pixel edges when the buffer scales up.
                    filter: "blur(0.45px) contrast(0.92)",
                    pointerEvents: "none",
                }}
            />
        </div>
    )
}

BuiltByKern_FilmGrain.displayName = "Film Grain"

addPropertyControls(BuiltByKern_FilmGrain, {
    amount: {
        type: ControlType.Number,
        title: "Amount",
        defaultValue: 22,
        min: 4,
        max: 55,
        step: 1,
        unit: "%",
    },
    tint: {
        type: ControlType.Color,
        title: "Tint",
        defaultValue: "#111111",
    },
    size: {
        type: ControlType.Number,
        title: "Size",
        defaultValue: 3,
        min: 1,
        max: 8,
        step: 1,
        displayStepper: true,
        description: "Larger = softer, coarser film.",
    },
    animate: {
        type: ControlType.Boolean,
        title: "Animate",
        defaultValue: false,
        enabledTitle: "On",
        disabledTitle: "Off",
        description: "Off by default — on uses a very slow weave to avoid flicker.",
    },
})
