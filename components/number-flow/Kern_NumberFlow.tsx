import { addPropertyControls, ControlType, useIsStaticRenderer } from "framer"
import { animate, useInView, useReducedMotion } from "framer-motion"
import {
    startTransition,
    useEffect,
    useMemo,
    useRef,
    useState,
    type CSSProperties,
} from "react"

type Trigger = "in-view" | "mount" | "manual"
type EaseName = "linear" | "easeOut" | "easeInOut" | "circOut"
type CanvasPreview = "start" | "mid" | "end"
type Settle = "leading" | "trailing"
type CharKind = "digit" | "mark" | "space"
type EaseInput = EaseName | "Linear" | "Ease Out" | "Ease In Out" | "Circ Out"
type TriggerInput = Trigger | "In View" | "Mount" | "Manual"
type CanvasPreviewInput = CanvasPreview | "Start" | "Mid" | "End"
type SettleInput = Settle | "Leading" | "Trailing"

interface ContentProps {
    start: number
    end: number
    decimals: number
    prefix: string
    suffix: string
    locale: string
}

interface LookProps {
    font: CSSProperties
    color: string
    flipLine: boolean
    window: boolean
}

interface MotionProps {
    duration: number
    ease: EaseInput
    trigger: TriggerInput
    play: boolean
    settle: SettleInput
    canvasPreview: CanvasPreviewInput
}

interface KernNumberFlowProps {
    content: ContentProps
    look: LookProps
    motion: MotionProps
    onComplete?: () => void
    builtByKern?: boolean
    style?: CSSProperties
}

interface GlyphPair {
    from: string
    to: string
    kind: CharKind
}

const PREVIEW_DESCRIPTION =
    "BuiltByKern\n[Explore more components](https://www.framer.com/%40builtbykern/)\n[Made for Framer](https://framer.link/qIg9LiG)"

const STAGGER_SPAN = 0.42
const MID_PROGRESS = 0.45

const DEFAULT_FONT: CSSProperties = {
    fontSize: "72px",
    fontWeight: 600,
    letterSpacing: "-0.04em",
    lineHeight: "1em",
    textAlign: "left",
}

const DEFAULT_CONTENT: ContentProps = {
    start: 0,
    end: 12840,
    decimals: 0,
    prefix: "",
    suffix: "",
    locale: "en-US",
}

const DEFAULT_LOOK: LookProps = {
    font: DEFAULT_FONT,
    color: "#F4F4F0",
    flipLine: true,
    window: true,
}

const DEFAULT_MOTION: MotionProps = {
    duration: 1.7,
    ease: "easeOut",
    trigger: "in-view",
    play: false,
    settle: "trailing",
    canvasPreview: "mid",
}

function clamp01(value: number): number {
    return Math.max(0, Math.min(1, value))
}

function clampNumber(value: unknown, fallback: number): number {
    return typeof value === "number" && Number.isFinite(value) ? value : fallback
}

function clampDecimals(value: unknown): number {
    const n = Math.round(clampNumber(value, 0))
    return Math.max(0, Math.min(6, n))
}

function resolveEase(ease: string): EaseName {
    switch (ease) {
        case "linear":
        case "Linear":
            return "linear"
        case "easeOut":
        case "Ease Out":
            return "easeOut"
        case "easeInOut":
        case "Ease In Out":
            return "easeInOut"
        case "circOut":
        case "Circ Out":
            return "circOut"
        default:
            return "easeOut"
    }
}

function resolveTrigger(trigger: string): Trigger {
    switch (trigger) {
        case "in-view":
        case "In View":
            return "in-view"
        case "mount":
        case "Mount":
            return "mount"
        case "manual":
        case "Manual":
            return "manual"
        default:
            return "in-view"
    }
}

function resolveCanvasPreview(value: string): CanvasPreview {
    switch (value) {
        case "start":
        case "Start":
            return "start"
        case "mid":
        case "Mid":
            return "mid"
        case "end":
        case "End":
            return "end"
        default:
            return "mid"
    }
}

function resolveSettle(value: string): Settle {
    switch (value) {
        case "leading":
        case "Leading":
            return "leading"
        case "trailing":
        case "Trailing":
            return "trailing"
        default:
            return "trailing"
    }
}

function applyEase(ease: EaseName, t: number): number {
    const x = clamp01(t)
    switch (ease) {
        case "linear":
            return x
        case "easeOut":
            return 1 - Math.pow(1 - x, 3)
        case "easeInOut":
            return x < 0.5
                ? 4 * x * x * x
                : 1 - Math.pow(-2 * x + 2, 3) / 2
        case "circOut":
            return Math.sqrt(1 - Math.pow(x - 1, 2))
        default: {
            const _never: never = ease
            return x
        }
    }
}

function frozenProgress(canvasPreview: CanvasPreview): number {
    switch (canvasPreview) {
        case "start":
            return 0
        case "mid":
            return MID_PROGRESS
        case "end":
            return 1
        default: {
            const _never: never = canvasPreview
            return 1
        }
    }
}

function formatNumber(
    value: number,
    locale: string,
    decimals: number
): string {
    const options: Intl.NumberFormatOptions = {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    }

    try {
        return new Intl.NumberFormat(locale || "en-US", options).format(value)
    } catch {
        return new Intl.NumberFormat("en-US", options).format(value)
    }
}

function charKind(char: string): CharKind {
    if (char === " " || char === "") return "space"
    if (char >= "0" && char <= "9") return "digit"
    return "mark"
}

function pairKind(from: string, to: string): CharKind {
    const fromKind = charKind(from)
    const toKind = charKind(to)
    if (fromKind === "digit" || toKind === "digit") return "digit"
    if (fromKind === "mark" || toKind === "mark") return "mark"
    return "space"
}

function alignGlyphs(fromValue: string, toValue: string): GlyphPair[] {
    const width = Math.max(fromValue.length, toValue.length)
    const from = fromValue.padStart(width, " ")
    const to = toValue.padStart(width, " ")
    const pairs: GlyphPair[] = []

    for (let i = 0; i < width; i++) {
        const a = from[i] ?? " "
        const b = to[i] ?? " "
        pairs.push({ from: a, to: b, kind: pairKind(a, b) })
    }

    return pairs
}

function columnProgress(
    progress: number,
    index: number,
    count: number,
    settle: Settle
): number {
    if (count <= 1) return clamp01(progress)
    const order = settle === "leading" ? index : count - 1 - index
    const delay = (order / (count - 1)) * STAGGER_SPAN
    return clamp01((progress - delay) / (1 - STAGGER_SPAN))
}

/** Shortest drum path from digit a to b on a 0–9 wheel. */
function digitSteps(fromDigit: number, toDigit: number, direction: number): number {
    if (fromDigit === toDigit) return 0
    if (direction >= 0) {
        return (toDigit - fromDigit + 10) % 10 || 10
    }
    return (fromDigit - toDigit + 10) % 10 || 10
}

function buildDrum(fromChar: string, toChar: string, direction: number): string[] {
    const fromDigit = fromChar >= "0" && fromChar <= "9" ? Number(fromChar) : 0
    const toDigit = toChar >= "0" && toChar <= "9" ? Number(toChar) : 0
    const entering = fromChar === " " && toChar !== " "
    const exiting = toChar === " " && fromChar !== " "

    if (entering) {
        return [" ", toChar]
    }
    if (exiting) {
        return [fromChar, " "]
    }
    if (fromDigit === toDigit) {
        return [toChar]
    }

    const steps = digitSteps(fromDigit, toDigit, direction)
    const drum: string[] = [String(fromDigit)]
    for (let i = 1; i <= steps; i++) {
        const next =
            direction >= 0
                ? (fromDigit + i) % 10
                : (fromDigit - i + 10 * 4) % 10
        drum.push(String(next))
    }
    return drum
}

function glyphWidth(kind: CharKind, char: string): string {
    switch (kind) {
        case "digit":
            return "0.68em"
        case "mark":
            return char === "." || char === "·" || char === ","
                ? "0.34em"
                : "0.42em"
        case "space":
            return "0.2em"
        default: {
            const _never: never = kind
            return "0.68em"
        }
    }
}

/**
 * Number Flow
 *
 * Alarm-clock flip. Each digit rolls in its own window.
 *
 * @framerIntrinsicWidth 340
 * @framerIntrinsicHeight 100
 *
 * @framerSupportedLayoutWidth any-prefer-fixed
 * @framerSupportedLayoutHeight any-prefer-fixed
 */
export default function Kern_NumberFlow(props: KernNumberFlowProps) {
    const {
        content = DEFAULT_CONTENT,
        look = DEFAULT_LOOK,
        motion = DEFAULT_MOTION,
        onComplete,
        style,
    } = props

    const start = clampNumber(content.start, DEFAULT_CONTENT.start)
    const end = clampNumber(content.end, DEFAULT_CONTENT.end)
    const decimals = clampDecimals(content.decimals)
    const prefix = content.prefix ?? ""
    const suffix = content.suffix ?? ""
    const locale = content.locale || "en-US"
    const duration = Math.max(
        0,
        clampNumber(motion.duration, DEFAULT_MOTION.duration)
    )
    const ease = resolveEase(motion.ease ?? "easeOut")
    const trigger = resolveTrigger(motion.trigger ?? "in-view")
    const play = motion.play === true
    const settle = resolveSettle(motion.settle ?? "trailing")
    const canvasPreview = resolveCanvasPreview(motion.canvasPreview ?? "mid")
    const font = look.font ?? DEFAULT_FONT
    const color = look.color || "#F4F4F0"
    const flipLine = look.flipLine !== false
    const showWindow = look.window !== false
    const direction = end >= start ? 1 : -1

    const isStatic = useIsStaticRenderer()
    const prefersReducedMotion = useReducedMotion()
    const reducedMotion = Boolean(prefersReducedMotion)
    const rootRef = useRef<HTMLDivElement>(null)
    const isInView = useInView(rootRef, { once: true, amount: 0.4 })

    const startLabel = formatNumber(start, locale, decimals)
    const endLabel = formatNumber(end, locale, decimals)
    const glyphs = useMemo(
        () => alignGlyphs(startLabel, endLabel),
        [endLabel, startLabel]
    )

    const restProgress = isStatic
        ? frozenProgress(canvasPreview)
        : reducedMotion
          ? 1
          : 0
    const [progress, setProgress] = useState(restProgress)

    let shouldRun = false
    switch (trigger) {
        case "mount":
            shouldRun = true
            break
        case "in-view":
            shouldRun = isInView
            break
        case "manual":
            shouldRun = play
            break
        default: {
            const _never: never = trigger
            shouldRun = true
        }
    }

    useEffect(() => {
        if (isStatic) {
            startTransition(() => setProgress(frozenProgress(canvasPreview)))
            return
        }

        if (reducedMotion) {
            startTransition(() => setProgress(1))
            return
        }

        if (!shouldRun) {
            startTransition(() => setProgress(0))
            return
        }

        if (duration === 0 || startLabel === endLabel) {
            startTransition(() => setProgress(1))
            onComplete?.()
            return
        }

        const controls = animate(0, 1, {
            duration,
            ease: "linear",
            onUpdate(value) {
                startTransition(() => setProgress(value))
            },
            onComplete() {
                startTransition(() => setProgress(1))
                onComplete?.()
            },
        })

        return () => {
            controls.stop()
        }
    }, [
        canvasPreview,
        duration,
        endLabel,
        isStatic,
        onComplete,
        reducedMotion,
        shouldRun,
        startLabel,
    ])

    const locals = useMemo(
        () =>
            glyphs.map((_, index) =>
                applyEase(
                    ease,
                    columnProgress(progress, index, glyphs.length, settle)
                )
            ),
        [ease, glyphs, progress, settle]
    )

    const textAlign = (font.textAlign as CSSProperties["textAlign"]) || "left"

    const isFixedWidth = style?.width === "100%"
    const isFixedHeight = style?.height === "100%"
    const freezeMotion = isStatic || reducedMotion
    const liveLabel = formatNumber(
        start + (end - start) * applyEase(ease, progress),
        locale,
        decimals
    )

    return (
        <div
            ref={rootRef}
            aria-label={`${prefix}${endLabel}${suffix}`}
            style={{
                ...style,
                position: "relative",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent:
                    textAlign === "center"
                        ? "center"
                        : textAlign === "right"
                          ? "flex-end"
                          : "flex-start",
                gap: "0.06em",
                width: isFixedWidth ? "100%" : "max-content",
                height: isFixedHeight ? "100%" : "auto",
                minWidth: "max-content",
                color,
                ...font,
            }}
        >
            {prefix ? (
                <span
                    aria-hidden="true"
                    style={{
                        opacity: 0.48,
                        marginRight: "0.08em",
                        letterSpacing: "0.02em",
                        lineHeight: 1,
                    }}
                >
                    {prefix}
                </span>
            ) : null}

            <div
                aria-hidden="true"
                style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: showWindow ? "0.08em" : "0.02em",
                    width: "max-content",
                    fontVariantNumeric: "tabular-nums",
                    fontFeatureSettings: '"tnum" 1',
                    whiteSpace: "nowrap",
                    color,
                }}
            >
                {glyphs.map((glyph, index) => (
                    <FlipCell
                        key={`${index}-${glyph.from}-${glyph.to}`}
                        glyph={glyph}
                        local={locals[index] ?? 1}
                        direction={direction}
                        freezeMotion={freezeMotion}
                        flipLine={flipLine}
                        showWindow={showWindow}
                        color={color}
                    />
                ))}
            </div>

            {suffix ? (
                <span
                    aria-hidden="true"
                    style={{
                        opacity: 0.48,
                        marginLeft: "0.08em",
                        letterSpacing: "0.02em",
                        lineHeight: 1,
                    }}
                >
                    {suffix}
                </span>
            ) : null}

            <span
                style={{
                    position: "absolute",
                    width: 1,
                    height: 1,
                    overflow: "hidden",
                    clip: "rect(0 0 0 0)",
                }}
            >
                {prefix}
                {liveLabel}
                {suffix}
            </span>
        </div>
    )
}

function FlipCell(props: {
    glyph: GlyphPair
    local: number
    direction: number
    freezeMotion: boolean
    flipLine: boolean
    showWindow: boolean
    color: string
}) {
    const {
        glyph,
        local,
        direction,
        freezeMotion,
        flipLine,
        showWindow,
        color,
    } = props
    const { from, to, kind } = glyph
    const width = glyphWidth(kind, to === " " ? from : to)

    if (kind === "space" && from === " " && to === " ") {
        return <span style={{ display: "inline-block", width }} />
    }

    if (kind === "mark") {
        const mark = to === " " ? from : to
        const opacity = from === " " ? local : to === " " ? 1 - local : 1
        return (
            <span
                style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width,
                    height: "1.15em",
                    opacity: 0.55 + opacity * 0.45,
                    lineHeight: 1,
                }}
            >
                {mark}
            </span>
        )
    }

    const drum =
        kind === "digit"
            ? buildDrum(from === " " ? "0" : from, to === " " ? "0" : to, direction)
            : [to === " " ? from : to]
    const entering = from === " " && to !== " "
    const exiting = to === " " && from !== " "
    const strip = entering
        ? [" ", to]
        : exiting
          ? [from, " "]
          : drum.length > 0
            ? drum
            : [to]

    const maxIndex = Math.max(strip.length - 1, 1)
    const travel = local * maxIndex
    const offsetY = -travel

    return (
        <span
            style={{
                display: "inline-block",
                position: "relative",
                width,
                height: "1.15em",
                borderRadius: showWindow ? "0.08em" : 0,
                background: showWindow ? "rgba(255,255,255,0.04)" : "transparent",
                boxShadow: showWindow
                    ? `inset 0 0 0 1px color-mix(in srgb, ${color} 18%, transparent)`
                    : undefined,
                overflow: "clip",
                verticalAlign: "middle",
                lineHeight: 1,
            }}
        >
            <span
                style={{
                    display: "flex",
                    flexDirection: "column",
                    transform: `translateY(${offsetY * 1.15}em)`,
                    willChange:
                        !freezeMotion && local > 0 && local < 1
                            ? "transform"
                            : undefined,
                }}
            >
                {strip.map((digit, i) => (
                    <span
                        key={`${digit}-${i}`}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            height: "1.15em",
                            width: "100%",
                            textAlign: "center",
                            fontVariantNumeric: "tabular-nums",
                        }}
                    >
                        {digit === " " ? "\u00A0" : digit}
                    </span>
                ))}
            </span>

            {flipLine ? (
                <span
                    aria-hidden="true"
                    style={{
                        position: "absolute",
                        left: "6%",
                        right: "6%",
                        top: "50%",
                        height: 1,
                        background: color,
                        opacity: 0.28,
                        transform: "translateY(-50%)",
                        pointerEvents: "none",
                        zIndex: 2,
                    }}
                />
            ) : null}

            {showWindow ? (
                <span
                    aria-hidden="true"
                    style={{
                        position: "absolute",
                        inset: 0,
                        pointerEvents: "none",
                        background:
                            "linear-gradient(to bottom, rgba(0,0,0,0.22) 0%, transparent 28%, transparent 72%, rgba(0,0,0,0.22) 100%)",
                        zIndex: 1,
                    }}
                />
            ) : null}
        </span>
    )
}

Kern_NumberFlow.displayName = "Number Flow"

Kern_NumberFlow.defaultProps = {
    content: DEFAULT_CONTENT,
    look: DEFAULT_LOOK,
    motion: DEFAULT_MOTION,
}

addPropertyControls(Kern_NumberFlow, {
    content: {
        type: ControlType.Object,
        title: "Content",
        icon: "object",
        controls: {
            start: {
                type: ControlType.Number,
                title: "Start",
                defaultValue: 0,
                displayStepper: true,
                description: "Value before the flip.",
            },
            end: {
                type: ControlType.Number,
                title: "End",
                defaultValue: 12840,
                displayStepper: true,
                description: "Value after the flip.",
            },
            decimals: {
                type: ControlType.Number,
                title: "Decimals",
                defaultValue: 0,
                min: 0,
                max: 6,
                step: 1,
                displayStepper: true,
                description: "Digits after the decimal. 0–6.",
            },
            prefix: {
                type: ControlType.String,
                title: "Prefix",
                defaultValue: "",
                placeholder: "$",
                description: "Quiet text before the figures. `$`, `€`.",
            },
            suffix: {
                type: ControlType.String,
                title: "Suffix",
                defaultValue: "",
                placeholder: "+",
                description: "Quiet text after the figures. `+`, `%`, `/mo`.",
            },
            locale: {
                type: ControlType.String,
                title: "Locale",
                defaultValue: "en-US",
                placeholder: "en-US",
                description:
                    "BCP 47 tag for grouping and decimals. `en-US`, `de-DE`, `fr-FR`.",
            },
        },
        defaultValue: DEFAULT_CONTENT,
    },
    look: {
        type: ControlType.Object,
        title: "Look",
        icon: "color",
        controls: {
            font: {
                type: ControlType.Font,
                title: "Font",
                controls: "extended",
                defaultFontType: "sans-serif",
                defaultValue: {
                    fontSize: "72px",
                    variant: "Semibold",
                    letterSpacing: "-0.04em",
                    lineHeight: "1em",
                    textAlign: "left",
                },
                description: "Typeface, size, weight, tracking, alignment.",
            },
            color: {
                type: ControlType.Color,
                title: "Color",
                defaultValue: "#F4F4F0",
                description: "Digit color.",
            },
            flipLine: {
                type: ControlType.Boolean,
                title: "Flip Line",
                defaultValue: true,
                enabledTitle: "On",
                disabledTitle: "Off",
                description: "Equator line across each digit. Classic flip-clock.",
            },
            window: {
                type: ControlType.Boolean,
                title: "Window",
                defaultValue: true,
                enabledTitle: "On",
                disabledTitle: "Off",
                description: "Soft aperture and shade around each digit.",
            },
        },
        defaultValue: DEFAULT_LOOK,
    },
    motion: {
        type: ControlType.Object,
        title: "Motion",
        icon: "effect",
        controls: {
            duration: {
                type: ControlType.Number,
                title: "Duration",
                defaultValue: 1.7,
                min: 0,
                max: 8,
                step: 0.1,
                unit: "s",
                description: "Seconds for the full flip.",
            },
            ease: {
                type: ControlType.Enum,
                title: "Ease",
                options: ["linear", "easeOut", "easeInOut", "circOut"],
                optionTitles: ["Linear", "Ease Out", "Ease In Out", "Circ Out"],
                defaultValue: "easeOut",
                description: "Curve of each digit drum.",
            },
            settle: {
                type: ControlType.Enum,
                title: "Settle",
                options: ["trailing", "leading"],
                optionTitles: ["Trailing", "Leading"],
                defaultValue: "trailing",
                displaySegmentedControl: true,
                description:
                    "Trailing: ones flip first, like a clock. Leading: thousands first.",
            },
            trigger: {
                type: ControlType.Enum,
                title: "Trigger",
                options: ["in-view", "mount", "manual"],
                optionTitles: ["In View", "Mount", "Manual"],
                defaultValue: "in-view",
                displaySegmentedControl: true,
                description:
                    "In View flips when it enters the viewport. Mount flips on load. Manual waits for Play.",
            },
            play: {
                type: ControlType.Boolean,
                title: "Play",
                defaultValue: false,
                enabledTitle: "Run",
                disabledTitle: "Wait",
                hidden: (props) =>
                    resolveTrigger(
                        props.trigger ?? props.motion?.trigger ?? "in-view"
                    ) !== "manual",
                description: "Run the flip. Only when Trigger is Manual.",
            },
            canvasPreview: {
                type: ControlType.Enum,
                title: "Canvas Preview",
                options: ["start", "mid", "end"],
                optionTitles: ["Start", "Mid", "End"],
                defaultValue: "mid",
                displaySegmentedControl: true,
                description:
                    "Frozen frame on the canvas and in exports. Mid catches digits mid-flip.",
            },
        },
        defaultValue: DEFAULT_MOTION,
    },
    onComplete: {
        type: ControlType.EventHandler,
        title: "On Complete",
        description: `Fires when the last digit lands.\n\n${PREVIEW_DESCRIPTION}`,
    },
    builtByKern: {
        type: ControlType.Boolean,
        title: "BuiltByKern",
        defaultValue: true,
        hidden: true,
        description: PREVIEW_DESCRIPTION,
    },
})
