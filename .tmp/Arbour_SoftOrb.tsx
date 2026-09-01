// @framerDisableUnlink
// @framerSupportedLayoutWidth: any
// @framerSupportedLayoutHeight: any
// @framerIntrinsicWidth: 320
// @framerIntrinsicHeight: 320

/**
 * Soft ambient orb for editorial heroes.
 * Translates Lumena-style continuous ambient motion into Arbour materials:
 * stone fill, olive rings, grain — slow breathe + counter-rotate (not particle torus).
 */

import {
    addPropertyControls,
    ControlType,
    useIsOnFramerCanvas,
    useIsStaticRenderer,
} from "framer"
import { motion, useReducedMotion } from "framer-motion"
import type { CSSProperties } from "react"

interface Props {
    fill: string
    ring: string
    ringWidth: number
    duration: number
    drift: number
    breathe: number
    grainOpacity: number
    style?: CSSProperties
}

/**
 * @framerDisableUnlink
 */
export default function Arbour_SoftOrb(props: Partial<Props>) {
    const {
        fill = "rgb(231, 223, 206)",
        ring = "rgba(84, 98, 45, 0.5)",
        ringWidth = 1,
        duration = 16,
        drift = 10,
        breathe = 0.028,
        grainOpacity = 0.09,
        style,
    } = props

    const isCanvas = useIsOnFramerCanvas()
    const isStatic = useIsStaticRenderer()
    const prefersReduced = useReducedMotion()
    const animate = !isCanvas && !isStatic && !prefersReduced

    const root: CSSProperties = {
        position: "relative",
        width: "100%",
        height: "100%",
        borderRadius: "50%",
        overflow: "hidden",
        background: fill,
        flexShrink: 0,
        ...style,
    }

    const grain: CSSProperties = {
        position: "absolute",
        inset: 0,
        borderRadius: "50%",
        opacity: grainOpacity,
        pointerEvents: "none",
        backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.55'/%3E%3C/svg%3E\")",
        backgroundSize: "180px 180px",
        mixBlendMode: "multiply",
    }

    const ringStyle: CSSProperties = {
        position: "absolute",
        inset: "16%",
        borderRadius: "50%",
        border: `${ringWidth}px solid ${ring}`,
        pointerEvents: "none",
    }

    const inner: CSSProperties = {
        position: "absolute",
        inset: "32%",
        borderRadius: "50%",
        border: `${ringWidth}px solid rgba(28, 27, 22, 0.1)`,
        pointerEvents: "none",
    }

    return (
        <motion.div
            style={root}
            animate={
                animate
                    ? {
                          y: [0, -drift, 0, drift * 0.55, 0],
                          scale: [1, 1 + breathe, 1, 1 - breathe * 0.45, 1],
                      }
                    : undefined
            }
            transition={
                animate
                    ? {
                          duration,
                          ease: "easeInOut",
                          repeat: Infinity,
                      }
                    : undefined
            }
        >
            <div style={grain} aria-hidden="true" />
            <motion.div
                style={ringStyle}
                animate={animate ? { rotate: 360 } : undefined}
                transition={
                    animate
                        ? {
                              duration: duration * 1.55,
                              ease: "linear",
                              repeat: Infinity,
                          }
                        : undefined
                }
                aria-hidden="true"
            />
            <motion.div
                style={inner}
                animate={animate ? { rotate: -360 } : undefined}
                transition={
                    animate
                        ? {
                              duration: duration * 2.1,
                              ease: "linear",
                              repeat: Infinity,
                          }
                        : undefined
                }
                aria-hidden="true"
            />
        </motion.div>
    )
}

addPropertyControls(Arbour_SoftOrb, {
    fill: {
        type: ControlType.Color,
        title: "Fill",
        defaultValue: "rgb(231, 223, 206)",
    },
    ring: {
        type: ControlType.Color,
        title: "Ring",
        defaultValue: "rgba(84, 98, 45, 0.5)",
    },
    ringWidth: {
        type: ControlType.Number,
        title: "Ring Width",
        defaultValue: 1,
        min: 1,
        max: 3,
        step: 0.5,
    },
    duration: {
        type: ControlType.Number,
        title: "Cycle (s)",
        defaultValue: 16,
        min: 8,
        max: 40,
        step: 1,
    },
    drift: {
        type: ControlType.Number,
        title: "Drift",
        defaultValue: 10,
        min: 0,
        max: 28,
        step: 1,
    },
    breathe: {
        type: ControlType.Number,
        title: "Breathe",
        defaultValue: 0.028,
        min: 0,
        max: 0.08,
        step: 0.002,
    },
    grainOpacity: {
        type: ControlType.Number,
        title: "Grain",
        defaultValue: 0.09,
        min: 0,
        max: 0.25,
        step: 0.01,
    },
})
