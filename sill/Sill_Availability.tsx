import { addPropertyControls, ControlType, useIsStaticRenderer } from "framer"
import { useReducedMotion } from "framer-motion"
import type { CSSProperties } from "react"

type AvailabilityState = "open" | "away" | "closed"

interface SillAvailabilityProps {
    status: string
    state: string
    font: CSSProperties
    color: string
    dotColor: string
    dot: number
    style?: CSSProperties
}

function asState(value: string): AvailabilityState {
    if (value === "away" || value === "Away") return "away"
    if (value === "closed" || value === "Closed") return "closed"
    return "open"
}

const DEFAULT_FONT: CSSProperties = {
    fontFamily: '"Clash Grotesk", sans-serif',
    fontSize: "15px",
    fontWeight: 400,
    letterSpacing: "0em",
    lineHeight: "1.2em",
}

const EMBER = "rgb(212, 146, 72)"

function inkFor(state: AvailabilityState, openColor: string): string {
    switch (state) {
        case "open":
            return openColor
        case "away":
            return "#C4A35A"
        case "closed":
            return "#8A3A3A"
        default: {
            const exhaustive: never = state
            return exhaustive
        }
    }
}

function labelFor(state: AvailabilityState, status: string): string {
    switch (state) {
        case "open":
            return status || "Available"
        case "away":
            return status || "Away"
        case "closed":
            return status || "Unavailable"
        default: {
            const exhaustive: never = state
            return exhaustive
        }
    }
}

/**
 * Availability only. Nav chrome stays on the canvas.
 *
 * @framerSupportedLayoutWidth any-prefer-fixed
 * @framerSupportedLayoutHeight any-prefer-fixed
 */
export default function Sill_Availability(props: SillAvailabilityProps) {
    const {
        status = "Studio · bookings open",
        state = "open",
        font = DEFAULT_FONT,
        color = "rgb(72, 70, 66)",
        dotColor = EMBER,
        dot = 8,
        style,
    } = props
    const isStatic = useIsStaticRenderer()
    const reducedMotion = useReducedMotion()
    const resolved = asState(state)
    const ink = inkFor(resolved, dotColor)
    const pulse = resolved === "open" && !isStatic && !reducedMotion
    const copy = labelFor(resolved, status)

    return (
        <div
            aria-label={copy}
            style={{
                ...style,
                position: "relative",
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                width: "max-content",
                height: style?.height ?? "100%",
                boxSizing: "border-box",
            }}
        >
            <style>
                {pulse
                    ? `@keyframes sill-avail-pulse{0%{transform:scale(1);opacity:0.45}70%{transform:scale(1.85);opacity:0}100%{transform:scale(1.85);opacity:0}}.sill-avail-ring{position:absolute;inset:0;border-radius:999px;background:currentColor;animation:sill-avail-pulse 2.8s cubic-bezier(0.42,0,0.18,1) infinite}`
                    : `.sill-avail-ring{position:absolute;inset:0;border-radius:999px;background:currentColor;opacity:0}`}
            </style>
            <span
                style={{
                    position: "relative",
                    width: dot,
                    height: dot,
                    flex: "none",
                    color: ink,
                }}
            >
                <span className="sill-avail-ring" aria-hidden="true" />
                <span
                    style={{
                        position: "absolute",
                        inset: 0,
                        borderRadius: 999,
                        background: ink,
                        boxShadow: `0 0 8px ${ink}55`,
                    }}
                />
            </span>
            <p
                style={{
                    margin: 0,
                    color,
                    whiteSpace: "nowrap",
                    ...DEFAULT_FONT,
                    ...font,
                }}
            >
                {copy}
            </p>
        </div>
    )
}

addPropertyControls(Sill_Availability, {
    status: {
        type: ControlType.String,
        title: "Status",
        defaultValue: "Studio · bookings open",
    },
    state: {
        type: ControlType.Enum,
        title: "State",
        options: ["open", "away", "closed"],
        optionTitles: ["Open", "Away", "Closed"],
        defaultValue: "open",
        displaySegmentedControl: true,
    },
    font: {
        type: ControlType.Font,
        title: "Font",
        controls: "basic",
        defaultFontType: "sans-serif",
        defaultValue: {
            fontSize: "15px",
            letterSpacing: "0em",
            lineHeight: "1.2em",
        },
    },
    color: {
        type: ControlType.Color,
        title: "Color",
        defaultValue: "rgb(72, 70, 66)",
    },
    dotColor: {
        type: ControlType.Color,
        title: "Dot Color",
        defaultValue: EMBER,
        description: "Open-state pulse. Matches canvas Ember.",
    },
    dot: {
        type: ControlType.Number,
        title: "Dot",
        min: 6,
        max: 16,
        step: 1,
        unit: "px",
        defaultValue: 8,
    },
})
