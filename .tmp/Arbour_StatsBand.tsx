// @framerDisableUnlink
// Arbour StatsBand — editorial statistics band (max 6).

import {
    addPropertyControls,
    ControlType,
    useIsOnFramerCanvas,
    useIsStaticRenderer,
} from "framer"
import {
    animate,
    motion,
    useAnimationControls,
    useInView,
    useMotionValue,
    useReducedMotion,
    useTransform,
} from "framer-motion"
import {
    startTransition,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
    type CSSProperties,
} from "react"

type MotionMode = "off" | "subtle" | "full"
type SemanticMode = "description-list" | "region"
type LayoutMode = "wide" | "compact" | "phone"

interface StatItem {
    id?: string
    label: string
    prefix: string
    number: number
    suffix: string
    useCountTarget: boolean
    countTarget: number
}

interface Arbour_StatsBandProps {
    stats: StatItem[]
    accent?: string
    value?: string
    label?: string
    border?: string
    valueSizeTablet?: number
    valueSizeMobile?: number
    mode?: MotionMode
    contentGroup?: {
        stats?: StatItem[]
    }
    background: string
    surfaceColor?: string
    gradientTint?: string
    gradientStrength?: number
    overlayIntensity?: number
    showTexture?: boolean
    textureOpacity?: number
    accentColor: string
    valueColor: string
    labelColor: string
    dividerColor?: string
    borderColor: string
    appearanceGroup?: {
        background?: string
        accentColor?: string
        valueColor?: string
        labelColor?: string
        borderColor?: string
    }
    backgroundGroup?: {
        surfaceColor?: string
        gradientTint?: string
        gradientStrength?: number
        overlayIntensity?: number
        textureOpacity?: number
        showTexture?: boolean
    }
    padTop: number
    padBottom: number
    padX: number
    gap: number
    layoutGroup?: {
        paddingTop?: number
        paddingRight?: number
        paddingBottom?: number
        paddingLeft?: number
        rowGap?: number
        lineToTextGap?: number
        indexToTextGap?: number
        blurTop?: number
        blurBottom?: number
        padTop?: number
        padBottom?: number
        padX?: number
        gap?: number
        horizontalPaddingTablet?: number
        horizontalPaddingPhone?: number
        rowPaddingDesktop?: number
        rowPaddingCompact?: number
        rowPaddingPhone?: number
        contentGapDesktop?: number
        phoneContentGap?: number
        phoneTimelineInset?: number
    }
    valueFontSizeTablet: number
    valueFontSizeMobile: number
    responsiveTypeGroup?: {
        valueFontSizeTablet?: number
        valueFontSizeMobile?: number
    }
    valueFont: {
        fontSize?: string | number
        letterSpacing?: string | number
        lineHeight?: string | number
        fontWeight?: number
        fontStyle?: "normal" | "italic"
        fontFamily?: string
        textAlign?: "left" | "right" | "center"
    }
    labelFont: {
        fontSize?: string | number
        letterSpacing?: string | number
        lineHeight?: string | number
        fontWeight?: number
        fontStyle?: "normal" | "italic"
        fontFamily?: string
        textAlign?: "left" | "right" | "center"
    }
    typographyGroup?: {
        valueFont?: Arbour_StatsBandProps["valueFont"]
        labelFont?: Arbour_StatsBandProps["labelFont"]
    }
    motionMode: MotionMode
    stagger: number
    motionGroup?: {
        motionMode?: MotionMode
        stagger?: number
    }
    semanticMode: SemanticMode
    ariaLabel: string
    accessibilityGroup?: {
        semanticMode?: SemanticMode
        ariaLabel?: string
    }
    style?: CSSProperties
}

interface PreparedStat {
    id: string
    label: string
    prefix: string
    suffix: string
    baseNumber: number
    targetNumber: number | null
    decimals: number
}

interface StatRowProps {
    index: number
    stat: PreparedStat
    delay: number
    mode: LayoutMode
    isCanvas: boolean
    isStaticRenderer: boolean
    prefersReduced: boolean
    motionMode: MotionMode
    valueColor: string
    labelColor: string
    borderColor: string
    accentColor: string
    valueFontSizeTablet: number
    valueFontSizeMobile: number
    valueFont: Arbour_StatsBandProps["valueFont"]
    labelFont: Arbour_StatsBandProps["labelFont"]
    semanticMode: SemanticMode
    rowPaddingDesktop: number
    rowPaddingCompact: number
    rowPaddingPhone: number
    contentGapDesktop: number
    phoneContentGap: number
    phoneTimelineInset: number
    lineToTextGap: number
    indexToTextGap: number
}

const defaultStats: StatItem[] = [
    {
        id: "sold",
        label: "SOLD LAST YEAR",
        prefix: "£",
        number: 214,
        suffix: "M",
        useCountTarget: true,
        countTarget: 214,
    },
    {
        id: "homes",
        label: "HOMES PLACED",
        prefix: "",
        number: 97,
        suffix: "",
        useCountTarget: true,
        countTarget: 97,
    },
    {
        id: "tenure",
        label: "INDEPENDENT",
        prefix: "",
        number: 26,
        suffix: " yrs",
        useCountTarget: true,
        countTarget: 26,
    },
    {
        id: "rating",
        label: "CLIENT RATING",
        prefix: "",
        number: 9.2,
        suffix: "/10",
        useCountTarget: false,
        countTarget: 9.2,
    },
]

function toRGBA(color: string, alpha: number): string {
    const safeAlpha = Math.max(0, Math.min(1, alpha))
    const normalized = (color || "").trim()

    if (normalized.startsWith("#")) {
        let hex = normalized.slice(1)
        if (hex.length === 3) {
            hex = hex
                .split("")
                .map((char) => char + char)
                .join("")
        }
        if (hex.length === 6) {
            const r = parseInt(hex.slice(0, 2), 16)
            const g = parseInt(hex.slice(2, 4), 16)
            const b = parseInt(hex.slice(4, 6), 16)
            return `rgba(${r}, ${g}, ${b}, ${safeAlpha})`
        }
    }

    const rgbMatch = normalized.match(
        /^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*[\d.]+\s*)?\)$/
    )
    if (rgbMatch) {
        const r = Number(rgbMatch[1] ?? 0)
        const g = Number(rgbMatch[2] ?? 0)
        const b = Number(rgbMatch[3] ?? 0)
        return `rgba(${r}, ${g}, ${b}, ${safeAlpha})`
    }

    return color
}

function noiseDataUri(tint: string): string {
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160' viewBox='0 0 160 160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='2' seed='11' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/><feComponentTransfer><feFuncA type='table' tableValues='0 0.18'/></feComponentTransfer></filter><rect width='160' height='160' fill='${tint}' filter='url(#n)'/></svg>`
    return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`
}

function getDecimalPlaces(value: number): number {
    if (!Number.isFinite(value)) return 0
    const valueString = String(value)
    if (!valueString.includes(".")) return 0
    return Math.max(0, valueString.split(".")[1]?.length ?? 0)
}

function formatNumber(value: number, decimals: number): string {
    return new Intl.NumberFormat("en-GB", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    }).format(value)
}

function getFirstFontSizeNumber(value: string | number | undefined): number | null {
    if (typeof value === "number" && Number.isFinite(value)) return value
    if (typeof value !== "string") return null
    const match = value.match(/-?\d*\.?\d+/)
    if (!match) return null
    const parsed = Number(match[0])
    return Number.isFinite(parsed) ? parsed : null
}

function scalePxValues(expression: string, factor: number): string {
    return expression.replace(/(-?\d*\.?\d+)px/g, (_, raw) => {
        const value = Number(raw)
        if (!Number.isFinite(value)) return `${raw}px`
        const scaled = Math.max(10, value * factor)
        return `${Math.round(scaled * 100) / 100}px`
    })
}

function resolveWideValueFontSize(
    input: string | number | undefined,
    characterCount: number
): string {
    const safeCount = Math.max(1, characterCount)
    const lengthFactor =
        safeCount > 16 ? 0.62 : safeCount > 13 ? 0.72 : safeCount > 10 ? 0.82 : 1
    const fallbackMin = Math.round(72 * lengthFactor)
    const fallbackMax = Math.round(132 * lengthFactor)
    const fallbackVw = (9.6 * lengthFactor).toFixed(2)
    const fallback = `clamp(${fallbackMin}px, ${fallbackVw}vw, ${fallbackMax}px)`

    const first = getFirstFontSizeNumber(input)
    if (first === null || first < 36) return fallback

    if (typeof input === "number") {
        const scaled = Math.max(56, input * lengthFactor)
        const min = Math.round(Math.max(48, scaled * 0.78))
        const max = Math.round(Math.max(72, scaled))
        return `clamp(${min}px, ${fallbackVw}vw, ${max}px)`
    }

    if (typeof input === "string" && input.includes("px")) {
        return scalePxValues(input, lengthFactor)
    }

    return fallback
}

function getPreparedStats(input: StatItem[] | undefined): PreparedStat[] {
    const source = input && input.length > 0 ? input : defaultStats
    return source.slice(0, 6).map((item, index) => {
        const baseNumber = Number.isFinite(item.number) ? item.number : 0
        const targetNumber = item.useCountTarget
            ? Number.isFinite(item.countTarget)
                ? item.countTarget
                : baseNumber
            : null
        const decimals = Math.max(
            getDecimalPlaces(baseNumber),
            targetNumber !== null ? getDecimalPlaces(targetNumber) : 0
        )
        return {
            id: item.id?.trim() || `stat-${index + 1}`,
            label: item.label || `STAT ${index + 1}`,
            prefix: item.prefix ?? "",
            suffix: item.suffix ?? "",
            baseNumber,
            targetNumber,
            decimals,
        }
    })
}

interface ResolvedContentConfig {
    stats: StatItem[]
}

interface ResolvedAppearanceConfig {
    accentColor: string
    valueColor: string
    labelColor: string
    dividerColor: string
}

interface ResolvedBackgroundConfig {
    surfaceColor: string
    gradientTint: string
    gradientStrength: number
    overlayIntensity: number
    textureOpacity: number
    showTexture: boolean
}

interface ResolvedTypographyConfig {
    valueFont: Arbour_StatsBandProps["valueFont"]
    labelFont: Arbour_StatsBandProps["labelFont"]
}

interface ResolvedLayoutConfig {
    paddingTop: number
    paddingRight: number
    paddingBottom: number
    paddingLeft: number
    rowGap: number
    lineToTextGap: number
    indexToTextGap: number
    topFadeDepth: number
    bottomFadeDepth: number
    horizontalPaddingTablet: number
    horizontalPaddingPhone: number
    rowPaddingDesktop: number
    rowPaddingCompact: number
    rowPaddingPhone: number
    contentGapDesktop: number
    phoneContentGap: number
    phoneTimelineInset: number
}

interface ResolvedResponsiveTypeConfig {
    valueFontSizeTablet: number
    valueFontSizeMobile: number
}

interface ResolvedMotionConfig {
    motionMode: MotionMode
    stagger: number
}

interface ResolvedAccessibilityConfig {
    semanticMode: SemanticMode
    ariaLabel: string
}

function resolveLayoutConfig(props: Partial<Arbour_StatsBandProps>): ResolvedLayoutConfig {
    const layoutGroup = props.layoutGroup
    // Visible layoutGroup → legacy layoutGroup aliases → top-level aliases → defaults
    const paddingTop = layoutGroup?.paddingTop ?? layoutGroup?.padTop ?? props.padTop ?? 160
    const paddingBottom =
        layoutGroup?.paddingBottom ?? layoutGroup?.padBottom ?? props.padBottom ?? 160
    const paddingRight = layoutGroup?.paddingRight ?? layoutGroup?.padX ?? props.padX ?? 80
    const paddingLeft = layoutGroup?.paddingLeft ?? layoutGroup?.padX ?? props.padX ?? 80
    const rowGap = layoutGroup?.rowGap ?? layoutGroup?.gap ?? props.gap ?? 40

    return {
        paddingTop,
        paddingRight,
        paddingBottom,
        paddingLeft,
        rowGap,
        lineToTextGap: layoutGroup?.lineToTextGap ?? 0,
        indexToTextGap: layoutGroup?.indexToTextGap ?? 24,
        topFadeDepth: layoutGroup?.blurTop ?? 0,
        bottomFadeDepth: layoutGroup?.blurBottom ?? 0,
        horizontalPaddingTablet: layoutGroup?.horizontalPaddingTablet ?? 32,
        horizontalPaddingPhone: layoutGroup?.horizontalPaddingPhone ?? 20,
        rowPaddingDesktop: layoutGroup?.rowPaddingDesktop ?? 34,
        rowPaddingCompact: layoutGroup?.rowPaddingCompact ?? 26,
        rowPaddingPhone: layoutGroup?.rowPaddingPhone ?? 24,
        contentGapDesktop: layoutGroup?.contentGapDesktop ?? 24,
        phoneContentGap: layoutGroup?.phoneContentGap ?? 8,
        phoneTimelineInset: layoutGroup?.phoneTimelineInset ?? 18,
    }
}

function resolveContentConfig(props: Partial<Arbour_StatsBandProps>): ResolvedContentConfig {
    return {
        stats: props.contentGroup?.stats ?? props.stats ?? defaultStats,
    }
}

function resolveAppearanceConfig(
    props: Partial<Arbour_StatsBandProps>
): ResolvedAppearanceConfig {
    return {
        accentColor:
            props.accentColor ??
            props.appearanceGroup?.accentColor ??
            props.accent ??
            "rgb(214, 224, 74)",
        valueColor:
            props.valueColor ??
            props.appearanceGroup?.valueColor ??
            props.value ??
            "rgb(252, 250, 244)",
        labelColor:
            props.labelColor ??
            props.appearanceGroup?.labelColor ??
            props.label ??
            "rgba(239, 233, 219, 0.55)",
        dividerColor:
            props.dividerColor ??
            props.appearanceGroup?.borderColor ??
            props.borderColor ??
            props.border ??
            "rgba(239, 233, 219, 0.18)",
    }
}

function resolveBackgroundConfig(
    props: Partial<Arbour_StatsBandProps>
): ResolvedBackgroundConfig {
    const legacySurface =
        props.appearanceGroup?.background ?? props.background ?? "rgb(21, 43, 30)"
    return {
        surfaceColor:
            props.surfaceColor ??
            props.backgroundGroup?.surfaceColor ??
            legacySurface,
        gradientTint:
            props.gradientTint ??
            props.backgroundGroup?.gradientTint ??
            "rgb(134, 170, 104)",
        gradientStrength:
            props.gradientStrength ??
            props.backgroundGroup?.gradientStrength ??
            0.38,
        overlayIntensity:
            props.overlayIntensity ??
            props.backgroundGroup?.overlayIntensity ??
            0.36,
        textureOpacity:
            props.textureOpacity ??
            props.backgroundGroup?.textureOpacity ??
            0.16,
        showTexture:
            props.showTexture ??
            props.backgroundGroup?.showTexture ??
            true,
    }
}

function resolveTypographyConfig(
    props: Partial<Arbour_StatsBandProps>
): ResolvedTypographyConfig {
    return {
        valueFont: props.typographyGroup?.valueFont ??
            props.valueFont ?? {
                fontSize: "clamp(48px, 7.2vw, 96px)",
                letterSpacing: "-0.04em",
                lineHeight: "0.95em",
                fontFamily: '"Fraunces", "Iowan Old Style", "Times New Roman", serif',
                fontWeight: 400,
            },
        labelFont: props.typographyGroup?.labelFont ??
            props.labelFont ?? {
                fontSize: 11,
                letterSpacing: "0.12em",
                lineHeight: "1.5em",
                fontFamily: '"Space Mono", "IBM Plex Mono", "SFMono-Regular", monospace',
                fontWeight: 500,
            },
    }
}

function resolveResponsiveTypeConfig(
    props: Partial<Arbour_StatsBandProps>
): ResolvedResponsiveTypeConfig {
    return {
        valueFontSizeTablet:
            props.responsiveTypeGroup?.valueFontSizeTablet ??
            props.valueFontSizeTablet ??
            props.valueSizeTablet ??
            62,
        valueFontSizeMobile:
            props.responsiveTypeGroup?.valueFontSizeMobile ??
            props.valueFontSizeMobile ??
            props.valueSizeMobile ??
            40,
    }
}

function resolveMotionConfig(props: Partial<Arbour_StatsBandProps>): ResolvedMotionConfig {
    return {
        motionMode: props.motionGroup?.motionMode ?? props.motionMode ?? props.mode ?? "full",
        stagger: props.motionGroup?.stagger ?? props.stagger ?? 0.08,
    }
}

function resolveAccessibilityConfig(
    props: Partial<Arbour_StatsBandProps>
): ResolvedAccessibilityConfig {
    return {
        semanticMode:
            props.accessibilityGroup?.semanticMode ??
            props.semanticMode ??
            "description-list",
        ariaLabel: props.accessibilityGroup?.ariaLabel ?? props.ariaLabel ?? "Key statistics",
    }
}

function resolveLayoutMode(width: number, previous: LayoutMode): LayoutMode {
    if (previous === "wide") {
        if (width < 880) return width < 580 ? "phone" : "compact"
        return "wide"
    }
    if (previous === "compact") {
        if (width >= 920) return "wide"
        if (width < 580) return "phone"
        return "compact"
    }
    if (width >= 620) return width >= 920 ? "wide" : "compact"
    return "phone"
}

function StatRow({
    index,
    stat,
    delay,
    mode,
    isCanvas,
    isStaticRenderer,
    prefersReduced,
    motionMode,
    valueColor,
    labelColor,
    borderColor,
    accentColor,
    valueFontSizeTablet,
    valueFontSizeMobile,
    valueFont,
    labelFont,
    semanticMode,
    rowPaddingDesktop,
    rowPaddingCompact,
    rowPaddingPhone,
    contentGapDesktop,
    phoneContentGap,
    phoneTimelineInset,
    lineToTextGap,
    indexToTextGap,
}: StatRowProps) {
    const ref = useRef<HTMLDivElement>(null)
    const isInView = useInView(ref, { once: true, amount: 0.35 })
    const animationsAllowed =
        !isCanvas && !isStaticRenderer && !prefersReduced && motionMode !== "off"
    const isVisible = !animationsAllowed || isInView
    const shouldAnimateCount =
        motionMode === "full" && animationsAllowed && isInView && stat.targetNumber !== null
    const canHoverAccent = mode === "wide" && !isCanvas && !isStaticRenderer
    const [isMarkerActive, setIsMarkerActive] = useState(false)

    const handleMarkerEnter = useCallback(() => {
        if (isCanvas || isStaticRenderer) return
        startTransition(() => setIsMarkerActive(true))
    }, [isCanvas, isStaticRenderer])

    const handleMarkerLeave = useCallback(() => {
        if (isCanvas || isStaticRenderer) return
        startTransition(() => setIsMarkerActive(false))
    }, [isCanvas, isStaticRenderer])

    const count = useMotionValue(stat.baseNumber)
    const formattedCount = useTransform(count, (latest) =>
        formatNumber(latest, stat.decimals)
    )
    const countSettleControls = useAnimationControls()

    useEffect(() => {
        const finalValue = stat.targetNumber ?? stat.baseNumber
        if (!shouldAnimateCount) {
            count.set(finalValue)
            void countSettleControls.set({ scale: 1 })
            return
        }
        void countSettleControls.set({ scale: 1 })
        const controls = animate(count, finalValue, {
            type: "spring",
            stiffness: 90,
            damping: 18,
            delay: delay + 0.14,
            onComplete: () => {
                void countSettleControls.start({
                    scale: [1.015, 1],
                    transition: { duration: 0.16, ease: [0.22, 1, 0.36, 1] },
                })
            },
        })
        return () => controls.stop()
    }, [
        count,
        countSettleControls,
        delay,
        shouldAnimateCount,
        stat.baseNumber,
        stat.targetNumber,
    ])

    const isWide = mode === "wide"
    const isPhone = mode === "phone"
    const isCompact = mode === "compact"
    const offset = isWide ? (index % 2 === 0 ? -6 : 10) : isCompact ? (index % 2 === 0 ? -3 : 4) : 0
    const justifyValue = isWide || isCompact ? "flex-end" : "flex-start"
    const alignText = isPhone ? "left" : justifyValue === "flex-end" ? "right" : valueFont.textAlign ?? "left"
    const compactContentGap = Math.max(8, Math.round(contentGapDesktop * 0.75))
    const compactIndexGap = Math.max(6, Math.round(indexToTextGap * 0.7))
    const rowPadding =
        isWide
            ? rowPaddingDesktop
            : mode === "compact"
              ? Math.max(16, Math.round(rowPaddingCompact * 0.86))
              : Math.max(12, Math.round(rowPaddingPhone * 0.68))
    const indexGap = isPhone ? 0 : isWide ? indexToTextGap : compactIndexGap
    const termValueGap = isPhone ? Math.max(4, phoneContentGap) : isWide ? contentGapDesktop : compactContentGap
    const contentStartOffset = lineToTextGap
    const interactiveActive = isMarkerActive
    const phoneContentInset = isPhone ? Math.max(8, Math.min(phoneTimelineInset, 28)) : 0

    const rowStyle: CSSProperties = {
        position: "relative",
        paddingTop: rowPadding,
        paddingBottom: rowPadding,
    }

    const revealMaskStyle: CSSProperties = {
        overflow: "hidden",
        paddingTop: contentStartOffset,
        paddingBottom: 0,
        marginTop: 0,
        marginBottom: 0,
    }

    const innerRowStyle: CSSProperties = {
        display: "grid",
        gridTemplateColumns: isPhone ? "1fr" : mode === "wide" ? "62px minmax(220px, 0.9fr) minmax(0, 1.1fr)" : "48px minmax(140px, 1fr) minmax(0, 1fr)",
        rowGap: isPhone ? Math.max(4, phoneContentGap + 1) : 6,
        columnGap: indexGap,
        alignItems: "end",
    }

    const dividerStyle: CSSProperties = {
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        height: 1,
        backgroundColor: "var(--arbour-border, rgba(239, 233, 219, 0.18))",
        transformOrigin: "left center",
    }

    const rowWashStyle: CSSProperties = {
        position: "absolute",
        inset: "1px 0 0 0",
        background: `linear-gradient(90deg, ${toRGBA(accentColor, 0.06)} 0%, ${toRGBA(valueColor, 0.03)} 42%, transparent 100%)`,
        opacity: 0,
        pointerEvents: "none",
        zIndex: 0,
    }

    const indexStyle: CSSProperties = {
        margin: 0,
        fontFamily:
            labelFont.fontFamily ??
            '"Space Mono", "IBM Plex Mono", "SFMono-Regular", monospace',
        fontWeight: labelFont.fontWeight,
        fontStyle: labelFont.fontStyle,
        fontSize: Math.max(
            10,
            Math.min(12, Math.round((getFirstFontSizeNumber(labelFont.fontSize) ?? 11) * 0.9))
        ),
        lineHeight: labelFont.lineHeight ?? 1.4,
        letterSpacing: labelFont.letterSpacing ?? "0.12em",
        textTransform: "uppercase",
        color: "var(--arbour-accent, rgb(214, 224, 74))",
        opacity: 0.84,
        paddingLeft: phoneContentInset,
    }

    const contentStyle: CSSProperties = {
        minWidth: 0,
        display: "grid",
        gridTemplateColumns: isPhone ? "1fr" : mode === "wide" ? "minmax(180px, 0.72fr) minmax(0, 1.28fr)" : "minmax(120px, 0.78fr) minmax(0, 1.22fr)",
        gap: termValueGap,
        alignItems: "end",
    }

    const finalValue = stat.targetNumber ?? stat.baseNumber
    const staticValue = `${stat.prefix}${formatNumber(finalValue, stat.decimals)}${stat.suffix}`
    const wideValueSize = resolveWideValueFontSize(valueFont.fontSize, staticValue.length)

    const valueStyle: CSSProperties = {
        margin: 0,
        fontFamily:
            valueFont.fontFamily ??
            '"Fraunces", "Iowan Old Style", "Times New Roman", serif',
        fontWeight: valueFont.fontWeight,
        fontStyle: valueFont.fontStyle,
        fontSize:
            mode === "wide"
                ? wideValueSize
                : `clamp(${Math.max(24, Math.round(valueFontSizeMobile * 0.84))}px, 9.2vw, ${Math.max(36, Math.round(
                      valueFontSizeTablet * 0.9
                  ))}px)`,
        lineHeight: valueFont.lineHeight ?? 0.92,
        letterSpacing: valueFont.letterSpacing ?? "-0.04em",
        color: "var(--arbour-value, rgb(252, 250, 244))",
        minWidth: 0,
        maxWidth: "100%",
        justifySelf: justifyValue,
        transform: offset !== 0 ? `translateX(${offset}px)` : "none",
        textAlign: alignText,
        fontVariantNumeric: "tabular-nums lining-nums",
        fontFeatureSettings: '"tnum" 1, "lnum" 1',
        whiteSpace: isPhone ? "normal" : "nowrap",
        overflow: isPhone ? "visible" : "hidden",
        textOverflow: isPhone ? "clip" : "ellipsis",
        overflowWrap: isPhone ? "anywhere" : "normal",
        paddingLeft: phoneContentInset,
    }

    const labelStyle: CSSProperties = {
        margin: 0,
        fontFamily: labelFont.fontFamily ?? '"Space Mono", "IBM Plex Mono", "SFMono-Regular", monospace',
        fontWeight: labelFont.fontWeight,
        fontStyle: labelFont.fontStyle,
        fontSize: labelFont.fontSize ?? 11,
        lineHeight: labelFont.lineHeight ?? 1.5,
        letterSpacing: labelFont.letterSpacing ?? "0.12em",
        textTransform: "uppercase",
        color: "var(--arbour-label, rgba(239, 233, 219, 0.55))",
        alignSelf: "center",
        maxWidth: mode === "wide" ? 320 : "100%",
        textAlign: labelFont.textAlign ?? "left",
        whiteSpace: isPhone ? "normal" : "nowrap",
        overflow: "hidden",
        textOverflow: isPhone ? "clip" : "ellipsis",
        paddingLeft: phoneContentInset,
    }

    const activeMotionMode = animationsAllowed ? motionMode : "off"
    const subtle = activeMotionMode === "subtle"
    const full = activeMotionMode === "full"
    const depthShift = full && isWide ? (index % 2 === 0 ? -6 : 6) : 0
    const valueContent =
        full && stat.targetNumber !== null ? (
            <>
                {stat.prefix}
                <motion.span
                    animate={countSettleControls}
                    style={{
                        display: "inline-block",
                        transformOrigin: "center bottom",
                    }}
                >
                    {formattedCount}
                </motion.span>
                {stat.suffix}
            </>
        ) : (
            staticValue
        )

    const markerChromeVisible = isVisible || activeMotionMode === "off"
    const markerEnterDelay = Math.max(0, delay - 0.04)
    const markerRestWidth = canHoverAccent ? 12 : 8
    const markerAnimate = {
        width: canHoverAccent
            ? interactiveActive
                ? 24
                : 12
            : interactiveActive
              ? 12
              : 8,
        opacity: !markerChromeVisible
            ? 0
            : canHoverAccent
              ? interactiveActive
                  ? 0.92
                  : 0.65
              : interactiveActive
                ? 0.64
                : 0.42,
    }
    const markerTickAnimate = {
        opacity: !markerChromeVisible
            ? 0
            : interactiveActive
              ? 0.68
              : 0.32,
    }
    const markerEnterTransition = {
        duration: 0.28,
        ease: [0.22, 1, 0.36, 1] as const,
        width: { duration: 0.28, ease: [0.22, 1, 0.36, 1] as const, delay: 0 },
        opacity: {
            duration: 0.28,
            ease: [0.22, 1, 0.36, 1] as const,
            delay: markerChromeVisible && !interactiveActive ? markerEnterDelay : 0,
        },
    }

    const markerStyle: CSSProperties = {
        position: "absolute",
        left: 0,
        top: "50%",
        transform: "translateY(-50%)",
        height: 1,
        width: markerRestWidth,
        background: "var(--arbour-accent, rgb(214, 224, 74))",
        pointerEvents: "none",
        zIndex: 2,
    }

    const markerTickStyle: CSSProperties = {
        position: "absolute",
        left: isPhone ? 7 : 10,
        top: "calc(50% - 5px)",
        width: 1,
        height: isPhone ? 8 : 10,
        background: "var(--arbour-accent, rgb(214, 224, 74))",
        pointerEvents: "none",
        zIndex: 2,
    }

    if (semanticMode === "description-list") {
        const groupedRowStyle: CSSProperties = {
            ...rowStyle,
            paddingTop: rowPadding + contentStartOffset,
            borderTop: `1px solid ${toRGBA(borderColor, interactiveActive ? 0.8 : 0.56)}`,
            display: "grid",
            gridTemplateColumns: isPhone
                ? "1fr"
                : mode === "wide"
                  ? "62px minmax(200px, 0.84fr) minmax(0, 1.16fr)"
                  : "48px minmax(120px, 0.82fr) minmax(0, 1.18fr)",
            columnGap: indexGap,
            rowGap: isPhone ? Math.max(4, phoneContentGap) : 6,
            alignItems: "end",
            overflow: "visible",
        }

        const indexInlineStyle: CSSProperties = {
            ...indexStyle,
            display: "block",
            marginBottom: 0,
            alignSelf: isPhone ? "start" : "end",
            gridColumn: isPhone ? "1 / -1" : "1 / 2",
        }

        const dtStyle: CSSProperties = {
            ...labelStyle,
            margin: 0,
            gridColumn: isPhone ? "1 / -1" : "2 / 3",
        }

        const ddStyle: CSSProperties = {
            ...valueStyle,
            margin: 0,
            gridColumn: isPhone ? "1 / -1" : "3 / 4",
            paddingLeft: isPhone ? phoneContentInset : termValueGap,
        }

        return (
            <motion.div
                ref={ref}
                style={groupedRowStyle}
                onMouseEnter={handleMarkerEnter}
                onMouseLeave={handleMarkerLeave}
                initial={
                    activeMotionMode === "off"
                        ? false
                        : { opacity: 0, y: subtle ? 12 : 24 }
                }
                animate={
                    isVisible
                        ? { opacity: 1, y: 0, x: 0 }
                        : { opacity: 0, y: subtle ? 12 : 24, x: full ? depthShift : 0 }
                }
                transition={{
                    duration: subtle ? 0.42 : 0.72,
                    ease: [0.22, 1, 0.36, 1],
                    delay,
                }}
            >
                <motion.div
                    style={rowWashStyle}
                    animate={{ opacity: interactiveActive ? 1 : 0 }}
                    transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                />
                <motion.div
                    style={markerStyle}
                    initial={
                        activeMotionMode === "off"
                            ? false
                            : { opacity: 0, width: markerRestWidth }
                    }
                    animate={markerAnimate}
                    transition={markerEnterTransition}
                />
                <motion.div
                    style={markerTickStyle}
                    initial={
                        activeMotionMode === "off" ? false : { opacity: 0 }
                    }
                    animate={markerTickAnimate}
                    transition={markerEnterTransition}
                />
                <motion.span
                    style={indexInlineStyle}
                    aria-hidden="true"
                    initial={
                        activeMotionMode === "off"
                            ? false
                            : { opacity: 0, y: subtle ? 6 : 12 }
                    }
                    animate={
                        isVisible
                            ? { opacity: 1, y: 0 }
                            : { opacity: 0, y: subtle ? 6 : 12 }
                    }
                    transition={{
                        duration: subtle ? 0.35 : 0.5,
                        ease: [0.22, 1, 0.36, 1],
                        delay: delay + 0.02,
                    }}
                >
                    {String(index + 1).padStart(2, "0")}
                </motion.span>
                <motion.dt
                    style={dtStyle}
                    initial={
                        activeMotionMode === "off"
                            ? false
                            : { opacity: 0, y: subtle ? 8 : 10 }
                    }
                    animate={
                        isVisible
                            ? { opacity: 1, y: 0 }
                            : { opacity: 0, y: subtle ? 8 : 10 }
                    }
                    transition={{
                        duration: subtle ? 0.35 : 0.5,
                        ease: [0.22, 1, 0.36, 1],
                        delay: delay + 0.06,
                    }}
                >
                    {stat.label}
                </motion.dt>
                <motion.dd
                    style={ddStyle}
                    initial={
                        activeMotionMode === "off"
                            ? false
                            : { opacity: 0, y: subtle ? 10 : 14 }
                    }
                    animate={
                        isVisible
                            ? { opacity: 1, y: 0 }
                            : { opacity: 0, y: subtle ? 10 : 14 }
                    }
                    transition={{
                        duration: subtle ? 0.38 : 0.56,
                        ease: [0.22, 1, 0.36, 1],
                        delay: delay + 0.1,
                    }}
                >
                    {valueContent}
                </motion.dd>
            </motion.div>
        )
    }

    return (
        <div
            ref={ref}
            style={{
                ...rowStyle,
                overflow: "visible",
            }}
            onMouseEnter={handleMarkerEnter}
            onMouseLeave={handleMarkerLeave}
        >
            <motion.div
                style={rowWashStyle}
                animate={{ opacity: interactiveActive ? 1 : 0 }}
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            />
            <motion.div
                style={dividerStyle}
                initial={activeMotionMode === "off" ? false : { scaleX: 0, opacity: 0.75 }}
                animate={
                    isVisible
                        ? { scaleX: 1, opacity: interactiveActive ? 1 : 0.88 }
                        : { scaleX: 0, opacity: 0.75 }
                }
                transition={{
                    duration: subtle ? 0.45 : 0.72,
                    ease: [0.3, 1, 0.36, 1],
                    delay: Math.max(0, delay - 0.04),
                }}
            />
            <motion.div
                style={markerStyle}
                initial={
                    activeMotionMode === "off"
                        ? false
                        : { opacity: 0, width: markerRestWidth }
                }
                animate={markerAnimate}
                transition={markerEnterTransition}
            />
            <motion.div
                style={markerTickStyle}
                initial={activeMotionMode === "off" ? false : { opacity: 0 }}
                animate={markerTickAnimate}
                transition={markerEnterTransition}
            />
            <div style={revealMaskStyle}>
                <motion.div
                    style={innerRowStyle}
                    initial={
                        activeMotionMode === "off"
                            ? false
                            : { opacity: 0, y: subtle ? 12 : 42 }
                    }
                    animate={
                        isVisible
                            ? { opacity: 1, y: 0, x: 0 }
                            : {
                                  opacity: 0,
                                  y: subtle ? 12 : 42,
                                  x: full ? depthShift : 0,
                              }
                    }
                    transition={{
                        duration: subtle ? 0.42 : 0.72,
                        ease: [0.22, 1, 0.36, 1],
                        delay,
                    }}
                >
                    <motion.p
                        style={indexStyle}
                        aria-hidden="true"
                        initial={
                            activeMotionMode === "off"
                                ? false
                                : { opacity: 0, y: subtle ? 6 : 12 }
                        }
                        animate={
                            isVisible
                                ? { opacity: 1, y: 0 }
                                : { opacity: 0, y: subtle ? 6 : 12 }
                        }
                        transition={{
                            duration: subtle ? 0.35 : 0.5,
                            ease: [0.22, 1, 0.36, 1],
                            delay: delay + 0.02,
                        }}
                    >
                        {String(index + 1).padStart(2, "0")}
                    </motion.p>
                    <div style={contentStyle}>
                        <motion.p
                            style={labelStyle}
                            initial={
                                activeMotionMode === "off"
                                    ? false
                                    : { opacity: 0, y: subtle ? 8 : 10 }
                            }
                            animate={
                                isVisible
                                    ? { opacity: 1, y: 0 }
                                    : { opacity: 0, y: subtle ? 8 : 10 }
                            }
                            transition={{
                                duration: subtle ? 0.35 : 0.5,
                                ease: [0.22, 1, 0.36, 1],
                                delay: delay + 0.06,
                            }}
                        >
                            {stat.label}
                        </motion.p>
                        <motion.p
                            style={valueStyle}
                            initial={
                                activeMotionMode === "off"
                                    ? false
                                    : { opacity: 0, y: subtle ? 10 : 14 }
                            }
                            animate={
                                isVisible
                                    ? { opacity: 1, y: 0 }
                                    : { opacity: 0, y: subtle ? 10 : 14 }
                            }
                            transition={{
                                duration: subtle ? 0.38 : 0.56,
                                ease: [0.22, 1, 0.36, 1],
                                delay: delay + 0.1,
                            }}
                        >
                            {valueContent}
                        </motion.p>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}

/**
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight auto
 */
export default function Arbour_StatsBand(props: Partial<Arbour_StatsBandProps>) {
    const contentConfig = resolveContentConfig(props)
    const appearanceConfig = resolveAppearanceConfig(props)
    const backgroundConfig = resolveBackgroundConfig(props)
    const typographyConfig = resolveTypographyConfig(props)
    const layoutConfig = resolveLayoutConfig(props)
    const responsiveTypeConfig = resolveResponsiveTypeConfig(props)
    const motionConfig = resolveMotionConfig(props)
    const accessibilityConfig = resolveAccessibilityConfig(props)

    const isCanvas = useIsOnFramerCanvas() ?? false
    const isStatic = useIsStaticRenderer()
    const prefersReduced = useReducedMotion() ?? false
    const rootRef = useRef<HTMLElement>(null)
    const [containerWidth, setContainerWidth] = useState(1200)
    const [layoutMode, setLayoutMode] = useState<LayoutMode>("wide")

    useEffect(() => {
        const node = rootRef.current
        if (!node) return

        let frame = 0
        const measure = () => {
            const width = node.offsetWidth
            startTransition(() => setContainerWidth(width))
            startTransition(() =>
                setLayoutMode((previous) => resolveLayoutMode(width, previous))
            )
        }

        const scheduleMeasure = () => {
            if (frame !== 0 && typeof window !== "undefined") {
                window.cancelAnimationFrame(frame)
            }
            if (typeof window !== "undefined") {
                frame = window.requestAnimationFrame(() => {
                    frame = 0
                    measure()
                })
            } else {
                measure()
            }
        }
        scheduleMeasure()

        if (typeof window !== "undefined" && typeof ResizeObserver !== "undefined") {
            const observer = new ResizeObserver(scheduleMeasure)
            observer.observe(node)
            return () => {
                observer.disconnect()
                if (frame !== 0) window.cancelAnimationFrame(frame)
            }
        }

        if (typeof window !== "undefined") {
            window.addEventListener("resize", scheduleMeasure)
            return () => {
                window.removeEventListener("resize", scheduleMeasure)
                if (frame !== 0) window.cancelAnimationFrame(frame)
            }
        }
    }, [])

    const preparedStats = getPreparedStats(contentConfig.stats)
    const derivedTabletLeft = Math.max(
        16,
        Math.min(96, Math.round(layoutConfig.paddingLeft * 0.6))
    )
    const derivedTabletRight = Math.max(
        16,
        Math.min(96, Math.round(layoutConfig.paddingRight * 0.6))
    )
    const derivedPhoneLeft = Math.max(12, Math.round(layoutConfig.paddingLeft * 0.36))
    const derivedPhoneRight = Math.max(12, Math.round(layoutConfig.paddingRight * 0.36))
    const maxPhoneSafeSide = Math.max(12, Math.floor(containerWidth * 0.22))
    const responsiveSpacing = useMemo(
        () => ({
            wide: {
                top: layoutConfig.paddingTop,
                right: layoutConfig.paddingRight,
                bottom: layoutConfig.paddingBottom,
                left: layoutConfig.paddingLeft,
                rowGap: layoutConfig.rowGap,
            },
            compact: {
                top: Math.max(48, Math.round(layoutConfig.paddingTop * 0.62)),
                right: derivedTabletRight,
                bottom: Math.max(40, Math.round(layoutConfig.paddingBottom * 0.58)),
                left: derivedTabletLeft,
                rowGap: Math.max(0, Math.round(layoutConfig.rowGap * 0.7)),
            },
            phone: {
                top: Math.max(28, Math.round(layoutConfig.paddingTop * 0.36)),
                right: Math.min(
                    derivedPhoneRight,
                    maxPhoneSafeSide
                ),
                bottom: Math.max(24, Math.round(layoutConfig.paddingBottom * 0.3)),
                left: Math.min(
                    derivedPhoneLeft,
                    maxPhoneSafeSide
                ),
                rowGap: Math.max(0, Math.round(layoutConfig.rowGap * 0.52)),
            },
        }),
        [
            derivedPhoneLeft,
            derivedPhoneRight,
            derivedTabletLeft,
            derivedTabletRight,
            layoutConfig.paddingBottom,
            layoutConfig.paddingLeft,
            layoutConfig.paddingRight,
            layoutConfig.paddingTop,
            layoutConfig.rowGap,
            maxPhoneSafeSide,
        ]
    )
    const activeSpacing =
        layoutMode === "wide"
            ? responsiveSpacing.wide
            : layoutMode === "compact"
              ? responsiveSpacing.compact
              : responsiveSpacing.phone
    const effectivePaddingLeft = activeSpacing.left
    const effectivePaddingRight = activeSpacing.right
    const effectivePaddingTop = activeSpacing.top
    const effectivePaddingBottom = activeSpacing.bottom

    const rootStyle: CSSProperties = {
        position: "relative",
        width: "100%",
        backgroundColor: backgroundConfig.surfaceColor,
        padding: `${effectivePaddingTop}px ${effectivePaddingRight}px ${effectivePaddingBottom}px ${effectivePaddingLeft}px`,
        boxSizing: "border-box",
        minHeight: 160,
        overflow: "visible",
        ...props.style,
        ["--arbour-bg" as any]: backgroundConfig.surfaceColor,
        ["--arbour-accent" as any]: appearanceConfig.accentColor,
        ["--arbour-value" as any]: appearanceConfig.valueColor,
        ["--arbour-label" as any]: appearanceConfig.labelColor,
        ["--arbour-border" as any]: appearanceConfig.dividerColor,
    }

    const decorativeClipStyle: CSSProperties = {
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 0,
    }

    const contentShellStyle: CSSProperties = {
        position: "relative",
        zIndex: 2,
    }

    const shellOverlayStyle: CSSProperties = {
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 0,
        background: `
            radial-gradient(120% 80% at 8% 6%, ${toRGBA(backgroundConfig.gradientTint, Math.max(0, Math.min(1, 0.32 * backgroundConfig.gradientStrength * backgroundConfig.overlayIntensity)))} 0%, transparent 65%),
            radial-gradient(90% 70% at 92% 10%, ${toRGBA(backgroundConfig.gradientTint, Math.max(0, Math.min(1, 0.22 * backgroundConfig.gradientStrength * backgroundConfig.overlayIntensity)))} 0%, transparent 70%),
            linear-gradient(180deg, ${toRGBA(backgroundConfig.surfaceColor, Math.max(0, Math.min(1, 0.16 * backgroundConfig.overlayIntensity)))} 0%, transparent 30%, transparent 70%, ${toRGBA(backgroundConfig.surfaceColor, Math.max(0, Math.min(1, 0.18 * backgroundConfig.overlayIntensity)))} 100%)
        `,
    }

    const noiseTexture = useMemo(
        () => noiseDataUri(toRGBA(backgroundConfig.gradientTint, 0.9)),
        [backgroundConfig.gradientTint]
    )
    const shellTextureStyle: CSSProperties = {
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 1,
        backgroundImage: noiseTexture,
        backgroundRepeat: "repeat",
        backgroundSize: "160px 160px",
        mixBlendMode: "normal",
        opacity: Math.max(0, Math.min(0.8, backgroundConfig.textureOpacity)),
    }

    const frameStyle: CSSProperties = {
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 1,
        borderTop: `1px solid ${toRGBA(appearanceConfig.dividerColor, 0.52)}`,
        borderBottom: `1px solid ${toRGBA(appearanceConfig.dividerColor, 0.52)}`,
    }

    const railStyle: CSSProperties = {
        position: "absolute",
        top: 0,
        bottom: 0,
        left: effectivePaddingLeft,
        width: 1,
        background: `linear-gradient(180deg, ${toRGBA(appearanceConfig.accentColor, 0.1)} 0%, ${toRGBA(
            appearanceConfig.dividerColor,
            0.45
        )} 20%, ${toRGBA(appearanceConfig.dividerColor, 0.4)} 80%, ${toRGBA(appearanceConfig.accentColor, 0.1)} 100%)`,
        pointerEvents: "none",
        zIndex: 1,
    }

    const listStyle: CSSProperties = {
        width: "100%",
        margin: 0,
        padding: 0,
        paddingBottom:
            accessibilityConfig.semanticMode === "description-list" && layoutMode === "wide"
                ? Math.round(activeSpacing.rowGap * 0.35)
                : 0,
    }

    const spacerStyle: CSSProperties = {
        height: layoutMode === "wide" ? activeSpacing.rowGap : 0,
        borderTop: `1px solid ${appearanceConfig.dividerColor}`,
        opacity: layoutMode === "wide" ? 0.45 : 0,
    }

    const topFadeStyle: CSSProperties = {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: layoutConfig.topFadeDepth,
        pointerEvents: "none",
        zIndex: 3,
        background: `linear-gradient(180deg, ${toRGBA(backgroundConfig.surfaceColor, 0.94)} 0%, ${toRGBA(
            backgroundConfig.surfaceColor,
            0.6
        )} 38%, ${toRGBA(backgroundConfig.surfaceColor, 0)} 100%)`,
    }

    const bottomFadeStyle: CSSProperties = {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: layoutConfig.bottomFadeDepth,
        pointerEvents: "none",
        zIndex: 3,
        background: `linear-gradient(0deg, ${toRGBA(backgroundConfig.surfaceColor, 0.94)} 0%, ${toRGBA(
            backgroundConfig.surfaceColor,
            0.6
        )} 38%, ${toRGBA(backgroundConfig.surfaceColor, 0)} 100%)`,
    }

    const commonRowProps = useCallback(
        (stat: PreparedStat, index: number) => ({
            key: `${stat.id}-${index}`,
            index,
            stat,
            delay: index * motionConfig.stagger,
            mode: layoutMode,
            isCanvas,
            isStaticRenderer: isStatic,
            prefersReduced,
            motionMode: motionConfig.motionMode,
            valueColor: appearanceConfig.valueColor,
            labelColor: appearanceConfig.labelColor,
            borderColor: appearanceConfig.dividerColor,
            accentColor: appearanceConfig.accentColor,
            valueFontSizeTablet: responsiveTypeConfig.valueFontSizeTablet,
            valueFontSizeMobile: responsiveTypeConfig.valueFontSizeMobile,
            valueFont: typographyConfig.valueFont,
            labelFont: typographyConfig.labelFont,
            semanticMode: accessibilityConfig.semanticMode,
            rowPaddingDesktop: layoutConfig.rowPaddingDesktop,
            rowPaddingCompact: layoutConfig.rowPaddingCompact,
            rowPaddingPhone: layoutConfig.rowPaddingPhone,
            contentGapDesktop: layoutConfig.contentGapDesktop,
            phoneContentGap: layoutConfig.phoneContentGap,
            phoneTimelineInset: layoutConfig.phoneTimelineInset,
            lineToTextGap: layoutConfig.lineToTextGap,
            indexToTextGap: layoutConfig.indexToTextGap,
        }),
        [
            accessibilityConfig.semanticMode,
            appearanceConfig.accentColor,
            appearanceConfig.dividerColor,
            appearanceConfig.labelColor,
            appearanceConfig.valueColor,
            isCanvas,
            isStatic,
            layoutConfig.contentGapDesktop,
            layoutConfig.indexToTextGap,
            layoutConfig.lineToTextGap,
            layoutConfig.phoneContentGap,
            layoutConfig.phoneTimelineInset,
            layoutConfig.rowPaddingCompact,
            layoutConfig.rowPaddingDesktop,
            layoutConfig.rowPaddingPhone,
            layoutMode,
            motionConfig.motionMode,
            motionConfig.stagger,
            prefersReduced,
            responsiveTypeConfig.valueFontSizeMobile,
            responsiveTypeConfig.valueFontSizeTablet,
            typographyConfig.labelFont,
            typographyConfig.valueFont,
        ]
    )
    const rows = preparedStats.map((stat, index) => (
        <StatRow {...commonRowProps(stat, index)} />
    ))

    return (
        <section
            ref={rootRef}
            style={rootStyle}
            aria-label={accessibilityConfig.ariaLabel}
            role={accessibilityConfig.semanticMode === "region" ? "region" : undefined}
        >
            <div style={decorativeClipStyle} aria-hidden="true">
                <div style={shellOverlayStyle} />
                {backgroundConfig.showTexture ? <div style={shellTextureStyle} /> : null}
                <div style={frameStyle} />
                <div style={railStyle} />
                {layoutConfig.topFadeDepth > 0 ? <div style={topFadeStyle} /> : null}
                {layoutConfig.bottomFadeDepth > 0 ? <div style={bottomFadeStyle} /> : null}
            </div>
            <div style={contentShellStyle}>
                {accessibilityConfig.semanticMode === "description-list" ? (
                    <dl style={listStyle}>{rows}</dl>
                ) : (
                    <div style={listStyle}>
                        {rows}
                        <div style={spacerStyle} aria-hidden="true" />
                    </div>
                )}
            </div>
        </section>
    )
}

addPropertyControls(Arbour_StatsBand, {
    contentGroup: {
        type: ControlType.Object,
        title: "Content",
        optional: true,
        icon: "object",
        controls: {
            stats: {
                type: ControlType.Array,
                title: "Stats",
                maxCount: 6,
                defaultValue: defaultStats,
                control: {
                    type: ControlType.Object,
                    controls: {
                        label: {
                            type: ControlType.String,
                            title: "Label",
                            defaultValue: "SOLD LAST YEAR",
                        },
                        prefix: {
                            type: ControlType.String,
                            title: "Prefix",
                            defaultValue: "£",
                        },
                        number: {
                            type: ControlType.Number,
                            title: "Number",
                            defaultValue: 214,
                            step: 0.1,
                        },
                        suffix: {
                            type: ControlType.String,
                            title: "Suffix",
                            defaultValue: "M",
                        },
                        useCountTarget: {
                            type: ControlType.Boolean,
                            title: "Use Count Target",
                            defaultValue: true,
                            enabledTitle: "On",
                            disabledTitle: "Off",
                        },
                        countTarget: {
                            type: ControlType.Number,
                            title: "Count Target",
                            defaultValue: 214,
                            step: 0.1,
                            hidden: (item: StatItem) => !item?.useCountTarget,
                        },
                        id: {
                            type: ControlType.String,
                            title: "ID",
                            defaultValue: "",
                            placeholder: "optional-stable-id",
                            hidden: () => true,
                        },
                    },
                },
                description:
                    "Add up to 6 stats. Compose each value using Prefix + Number + Suffix.",
            },
        },
    },
    surfaceColor: {
        type: ControlType.Color,
        title: "Surface Color",
        defaultValue: "rgb(21, 43, 30)",
    },
    gradientTint: {
        type: ControlType.Color,
        title: "Gradient Tint",
        defaultValue: "rgb(134, 170, 104)",
    },
    gradientStrength: {
        type: ControlType.Number,
        title: "Gradient Strength",
        defaultValue: 0.38,
        min: 0,
        max: 1,
        step: 0.01,
    },
    overlayIntensity: {
        type: ControlType.Number,
        title: "Overlay Intensity",
        defaultValue: 0.36,
        min: 0,
        max: 1,
        step: 0.01,
    },
    showTexture: {
        type: ControlType.Boolean,
        title: "Show Texture",
        defaultValue: true,
        enabledTitle: "On",
        disabledTitle: "Off",
    },
    textureOpacity: {
        type: ControlType.Number,
        title: "Texture Opacity",
        defaultValue: 0.16,
        min: 0,
        max: 0.8,
        step: 0.01,
        hidden: (props: Partial<Arbour_StatsBandProps>) => props.showTexture === false,
    },
    accentColor: {
        type: ControlType.Color,
        title: "Accent Color",
        defaultValue: "rgb(214, 224, 74)",
    },
    valueColor: {
        type: ControlType.Color,
        title: "Value Color",
        defaultValue: "rgb(252, 250, 244)",
    },
    labelColor: {
        type: ControlType.Color,
        title: "Label Color",
        defaultValue: "rgba(239, 233, 219, 0.55)",
    },
    dividerColor: {
        type: ControlType.Color,
        title: "Divider Color",
        defaultValue: "rgba(239, 233, 219, 0.18)",
    },
    typographyGroup: {
        type: ControlType.Object,
        title: "Typography",
        optional: true,
        icon: "object",
        controls: {
            valueFont: {
                type: ControlType.Font,
                title: "Value Font",
                controls: "extended",
                defaultFontType: "sans-serif",
                defaultValue: {
                    fontSize: "clamp(48px, 7.2vw, 96px)",
                    variant: "Regular",
                    letterSpacing: "-0.04em",
                    lineHeight: "0.95em",
                },
                description:
                    "Default uses Inter. In wide mode values intentionally alternate alignment for editorial rhythm; text alignment applies where alternation does not override it.",
            },
            labelFont: {
                type: ControlType.Font,
                title: "Label Font",
                controls: "extended",
                defaultFontType: "sans-serif",
                defaultValue: {
                    fontSize: 11,
                    variant: "Medium",
                    letterSpacing: "0.12em",
                    lineHeight: "1.5em",
                },
            },
        },
    },
    layoutGroup: {
        type: ControlType.Object,
        title: "Layout",
        optional: true,
        icon: "effect",
        controls: {
            paddingTop: {
                type: ControlType.Number,
                title: "Padding Top",
                defaultValue: 160,
                min: 0,
                max: 320,
            },
            paddingRight: {
                type: ControlType.Number,
                title: "Padding Right",
                defaultValue: 80,
                min: 0,
                max: 200,
            },
            paddingBottom: {
                type: ControlType.Number,
                title: "Padding Bottom",
                defaultValue: 160,
                min: 0,
                max: 320,
            },
            paddingLeft: {
                type: ControlType.Number,
                title: "Padding Left",
                defaultValue: 80,
                min: 0,
                max: 200,
            },
            rowGap: {
                type: ControlType.Number,
                title: "Row Gap",
                defaultValue: 40,
                min: 0,
                max: 120,
            },
            phoneTimelineInset: {
                type: ControlType.Number,
                title: "Phone Timeline Inset",
                defaultValue: 18,
                min: 12,
                max: 48,
                step: 2,
                unit: "px",
                description:
                    "Phone only: space between the timeline tick and index/label/value.",
            },
        },
    },
    responsiveTypeGroup: {
        type: ControlType.Object,
        title: "Responsive Type",
        optional: true,
        icon: "object",
        controls: {
            valueFontSizeTablet: {
                type: ControlType.Number,
                title: "Tablet Value Size",
                defaultValue: 62,
                min: 32,
                max: 96,
                step: 1,
                unit: "px",
                description: "Upper cap for compact/tablet value sizing.",
            },
            valueFontSizeMobile: {
                type: ControlType.Number,
                title: "Phone Value Size",
                defaultValue: 40,
                min: 24,
                max: 72,
                step: 1,
                unit: "px",
                description: "Lower floor for compact/phone value sizing.",
            },
        },
    },
    motionGroup: {
        type: ControlType.Object,
        title: "Motion",
        optional: true,
        icon: "interaction",
        controls: {
            motionMode: {
                type: ControlType.Enum,
                title: "Motion Mode",
                defaultValue: "full",
                options: ["off", "subtle", "full"],
                optionTitles: ["Off", "Subtle", "Full"],
                description:
                    "Off = static, Subtle = gentle reveal, Full = reveal + count up. Reduced motion always disables animation.",
            },
            stagger: {
                type: ControlType.Number,
                title: "Stagger",
                defaultValue: 0.08,
                min: 0,
                max: 0.4,
                step: 0.02,
            },
        },
    },
    accessibilityGroup: {
        type: ControlType.Object,
        title: "Accessibility",
        optional: true,
        icon: "interaction",
        controls: {
            semanticMode: {
                type: ControlType.Enum,
                title: "Semantic Mode",
                defaultValue: "description-list",
                options: ["description-list", "region"],
                optionTitles: ["Description List", "Region"],
                description: "Choose semantic output: description list or region wrapper.",
            },
            ariaLabel: {
                type: ControlType.String,
                title: "Aria Label",
                defaultValue: "Key statistics",
                description: "Accessible label for this statistics block.",
            },
        },
    },
    stats: {
        type: ControlType.Array,
        hidden: () => true,
        control: {
            type: ControlType.Object,
            controls: {
                label: { type: ControlType.String },
                prefix: { type: ControlType.String },
                number: { type: ControlType.Number },
                suffix: { type: ControlType.String },
                useCountTarget: { type: ControlType.Boolean },
                countTarget: { type: ControlType.Number },
                id: { type: ControlType.String },
            },
        },
    },
    // Legacy top-level keys (hidden) — keep for instance backwards-compat reads in resolvers
    background: { type: ControlType.Color, hidden: () => true },
    borderColor: { type: ControlType.Color, hidden: () => true },
    backgroundGroup: { type: ControlType.Object, hidden: () => true },
    appearanceGroup: { type: ControlType.Object, hidden: () => true },
    valueFont: { type: ControlType.Font, hidden: () => true, controls: "extended" },
    labelFont: { type: ControlType.Font, hidden: () => true, controls: "extended" },
    padTop: { type: ControlType.Number, hidden: () => true },
    padBottom: { type: ControlType.Number, hidden: () => true },
    padX: { type: ControlType.Number, hidden: () => true },
    gap: { type: ControlType.Number, hidden: () => true },
    valueFontSizeTablet: { type: ControlType.Number, hidden: () => true },
    valueFontSizeMobile: { type: ControlType.Number, hidden: () => true },
    motionMode: { type: ControlType.Enum, hidden: () => true, options: ["off", "subtle", "full"] },
    stagger: { type: ControlType.Number, hidden: () => true },
    semanticMode: {
        type: ControlType.Enum,
        hidden: () => true,
        options: ["description-list", "region"],
    },
    ariaLabel: { type: ControlType.String, hidden: () => true },
    accent: { type: ControlType.Color, hidden: () => true },
    value: { type: ControlType.Color, hidden: () => true },
    label: { type: ControlType.Color, hidden: () => true },
    border: { type: ControlType.Color, hidden: () => true },
    valueSizeTablet: { type: ControlType.Number, hidden: () => true },
    valueSizeMobile: { type: ControlType.Number, hidden: () => true },
    mode: { type: ControlType.Enum, hidden: () => true, options: ["off", "subtle", "full"] },
} as any)
