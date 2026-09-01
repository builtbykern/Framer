// @framerDisableUnlink
// @framerSupportedLayoutWidth: any
// @framerSupportedLayoutHeight: any
// @framerIntrinsicWidth: 1
// @framerIntrinsicHeight: 1
// BuiltByKern · Arbour

import { addPropertyControls, ControlType } from "framer"
import type { CSSProperties } from "react"

type Blend =
    | "difference"
    | "exclusion"
    | "overlay"
    | "soft-light"
    | "multiply"
    | "screen"
    | "normal"

interface Props {
    targetName: string
    blendMode: Blend
    halo: boolean
    style?: CSSProperties
}

/** Optional mix-blend injector. Halo disabled by default — stroke edges look cheap. */
export default function Arbour_BlendStyle(props: Partial<Props>) {
    const targetName = props.targetName || "H1 Blend Wrap"
    const blendMode = (props.blendMode || "normal") as Blend
    const halo = props.halo ?? false
    const safe = targetName.replace(/\\/g, "\\\\").replace(/"/g, '\\"')

    const haloCss = halo
        ? `
        [data-framer-name="${safe}"],
        [data-framer-name="${safe}"] h1,
        [data-framer-name="${safe}"] p {
            text-shadow: 0 0 24px rgba(252, 250, 244, 0.55);
        }
    `
        : ""

    return (
        <div
            aria-hidden
            style={{
                position: "absolute",
                width: 0,
                height: 0,
                overflow: "hidden",
                pointerEvents: "none",
                ...props.style,
            }}
        >
            <style>{`
                [data-framer-name="${safe}"] {
                    mix-blend-mode: ${blendMode} !important;
                    background-color: transparent !important;
                    background: transparent !important;
                }
                ${haloCss}
            `}</style>
        </div>
    )
}

Arbour_BlendStyle.defaultProps = {
    targetName: "H1 Blend Wrap",
    blendMode: "normal" as Blend,
    halo: false,
}

addPropertyControls(Arbour_BlendStyle, {
    targetName: {
        type: ControlType.String,
        title: "Layer Name",
        defaultValue: "H1 Blend Wrap",
    },
    blendMode: {
        type: ControlType.Enum,
        title: "Blend",
        options: [
            "normal",
            "soft-light",
            "exclusion",
            "difference",
            "overlay",
            "multiply",
            "screen",
        ],
        defaultValue: "normal",
    },
    halo: {
        type: ControlType.Boolean,
        title: "Soft Glow",
        defaultValue: false,
        enabledTitle: "On",
        disabledTitle: "Off",
    },
})
