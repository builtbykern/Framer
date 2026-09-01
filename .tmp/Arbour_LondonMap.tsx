// @framerDisableUnlink
// @framerSupportedLayoutWidth: any
// @framerSupportedLayoutHeight: any
// @framerIntrinsicWidth: 240
// @framerIntrinsicHeight: 160

/**
 * Generic abstract city map — pale mass + olive focus zone.
 * Optional seed (e.g. neighbourhood name) shifts the accent for variety.
 */

import { addPropertyControls, ControlType } from "framer"
import type { CSSProperties } from "react"

interface Props {
    seed: string
    city: string
    accent: string
    water: string
    style?: CSSProperties
}

function hash01(input: string): number {
    let h = 2166136261
    for (let i = 0; i < input.length; i++) {
        h ^= input.charCodeAt(i)
        h = Math.imul(h, 16777619)
    }
    return (h >>> 0) / 4294967295
}

export default function Arbour_LondonMap(props: Partial<Props>) {
    const {
        seed = "",
        city = "rgb(198, 193, 180)",
        accent = "rgb(84, 98, 45)",
        water = "rgba(28, 27, 22, 0.16)",
        style,
    } = props

    const t = seed.trim()
    const a = t ? hash01(t) : 0.42
    const b = t ? hash01(t + "·") : 0.55
    const focusX = 0.28 + a * 0.44
    const focusY = 0.32 + b * 0.4
    const focusScale = 0.95 + hash01(t + "#") * 0.35

    const fx = 40 + focusX * 160
    const fy = 28 + focusY * 100
    const s = 0.85 + focusScale * 0.35

    const root: CSSProperties = {
        width: "100%",
        height: "100%",
        minHeight: 110,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        ...style,
    }

    return (
        <div style={root}>
            <svg
                viewBox="0 0 240 160"
                width="100%"
                height="100%"
                preserveAspectRatio="xMidYMid meet"
                role="img"
                aria-label="Territory map"
            >
                <path
                    d="M24 56 L38 28 L72 14 L112 8 L152 12 L186 28 L214 52 L222 84 L208 116 L176 138 L128 148 L78 142 L42 120 L22 88 Z"
                    fill={city}
                    opacity={0.45}
                />
                <path
                    d="M48 58 L64 32 L102 22 L144 26 L178 44 L196 72 L188 104 L158 126 L112 134 L70 124 L48 96 Z"
                    fill={city}
                />
                <path
                    d="M52 92 L88 80 L124 82 L162 96 L196 104"
                    fill="none"
                    stroke={water}
                    strokeWidth="7"
                    strokeLinecap="square"
                />
                <path
                    d="M70 48 L90 70 L110 98"
                    fill="none"
                    stroke="rgba(28, 27, 22, 0.08)"
                    strokeWidth="3"
                />
                <path
                    d="M130 36 L148 68 L160 108"
                    fill="none"
                    stroke="rgba(28, 27, 22, 0.08)"
                    strokeWidth="3"
                />
                <path
                    d="M84 118 L120 110 L156 118"
                    fill="none"
                    stroke="rgba(28, 27, 22, 0.07)"
                    strokeWidth="2.5"
                />
                <g transform={`translate(${fx} ${fy}) scale(${s}) translate(-28 -22)`}>
                    <path
                        d="M8 18 L22 4 L48 8 L56 28 L42 44 L16 40 L4 28 Z"
                        fill={accent}
                    />
                </g>
            </svg>
        </div>
    )
}

addPropertyControls(Arbour_LondonMap, {
    seed: {
        type: ControlType.String,
        title: "Seed",
        defaultValue: "",
        placeholder: "Neighbourhood name",
    },
    city: {
        type: ControlType.Color,
        title: "City",
        defaultValue: "rgb(198, 193, 180)",
    },
    accent: {
        type: ControlType.Color,
        title: "Accent",
        defaultValue: "rgb(84, 98, 45)",
    },
    water: {
        type: ControlType.Color,
        title: "Water",
        defaultValue: "rgba(28, 27, 22, 0.16)",
    },
})
