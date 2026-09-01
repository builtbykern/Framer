// @framerDisableUnlink
// @framerSupportedLayoutWidth: any
// @framerSupportedLayoutHeight: auto
// @framerIntrinsicWidth 1200
// @framerIntrinsicHeight 680

/**
 * Arbour_TerritoryRail — Framer Code Component
 * Version: 6.12.0
 * Slide Image structure + Arbour editorial layer: coords band, hairline frame,
 * title mask reveal, autoplay progress hairline.
 * Section header (kicker / heading / explore) lives on canvas — not in this module.
 * CMS-ready: connect the Items array to a Framer collection (e.g. Neighbourhoods).
 * @origin Arbour V2 Territories — Slide Image behavior, Arbour tokens
 * @marketplace Kern_TerritorySlide (future standalone listing)
 * @date 2026-07-08
 * @standards NORMA_01 v2.1, NORMA_03
 */

import { addPropertyControls, ControlType, useIsOnFramerCanvas, useIsStaticRenderer } from "framer"
import { AnimatePresence, motion, useReducedMotion, useInView } from "framer-motion"
import {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
    type CSSProperties,
    type KeyboardEvent,
} from "react"

// ─── TYPES ───────────────────────────────────────────────────────────────

type LayoutVariant = "slide" | "rail"
type StripPosition = "top" | "center" | "bottom"
type TextAlign = "left" | "center" | "right"
type ContentPosition = "bottom" | "top"
type TopBandAlign = "inline" | "stacked"

interface ImageValue {
    src?: string
    url?: string
    alt?: string
}

/** Framer ControlType.Font value shape. */
interface FontValue {
    fontFamily?: string
    fontSelector?: string
    fontWeight?: number | string
    fontStyle?: string
    fontSize?: number | string
    lineHeight?: number | string | [number, string]
    letterSpacing?: number | string | [number, string]
}

/** Accepts manual controls, CMS rows, or mixed field names. */
interface TerritoryInput {
    name?: string
    title?: string
    label?: string
    imageUrl?: string
    image?: string | ImageValue
    cover?: string | ImageValue
    photo?: string | ImageValue
    slug?: string
    link?: string
    href?: string
    alt?: string
    coords?: string
    description?: string
}

interface ResolvedTerritory {
    id: string
    name: string
    image: string
    href: string
    alt: string
    coords: string
    indexLabel: string
}

interface ContentGroup {
    itemLimit: number
    linkBase: string
    viewLabel: string
    ariaLabel: string
}

interface LayoutGroup {
    variant: LayoutVariant
    imageRatio: number
    stripWidth: number
    stripHeight: number
    stripLift: number
    stripInactiveOpacity: number
    stripGap: number
    showEditorialIndex: boolean
    showViewLink: boolean
    stripPosition: StripPosition
    imagePadding: number
    textAlign: TextAlign
    contentPadding: number
    contentPosition: ContentPosition
    topBandAlign: TopBandAlign
    cardWidth: number
}

interface TypographyGroup {
    titleFont?: FontValue
    metaFont?: FontValue
    titleUppercase: boolean
}

interface AtmosphereGroup {
    showGrain: boolean
    showVignette: boolean
    showFrame: boolean
    showBlur: boolean
    showTopBlur: boolean
    blurStrength: number
    grainOpacity: number
}

interface ColorGroup {
    titleColor: string
    metaColor: string
    accentColor: string
    stageBackground: string
    scrimColor: string
    scrimOpacity: number
    showIndex: boolean
}

interface MotionGroup {
    slideInterval: number
    pauseOnHover: boolean
    springStiffness: number
    springDamping: number
}

interface Props {
    items: TerritoryInput[]
    content: ContentGroup
    layout: LayoutGroup
    typography: TypographyGroup
    atmosphere: AtmosphereGroup
    colors: ColorGroup
    motion: MotionGroup
    style?: CSSProperties
}

interface SlideStageProps {
    items: ResolvedTerritory[]
    activeIndex: number
    onSelect: (index: number) => void
    imageRatio: number
    stripWidth: number
    stripHeight: number
    stripLift: number
    stripInactiveOpacity: number
    stripGap: number
    showEditorialIndex: boolean
    showViewLink: boolean
    stripPosition: StripPosition
    imagePadding: number
    textAlign: TextAlign
    contentPadding: number
    contentPosition: ContentPosition
    topBandAlign: TopBandAlign
    typography: TypographyGroup
    colors: ColorGroup
    atmosphere: AtmosphereGroup
    viewLabel: string
    ariaLabel: string
    shouldAnimate: boolean
    stiffness: number
    damping: number
    intervalSeconds: number
    autoplayPaused: boolean
}

interface RailStageProps {
    items: ResolvedTerritory[]
    cardWidth: number
    imageRatio: number
    colors: ColorGroup
    atmosphere: AtmosphereGroup
    viewLabel: string
    shouldAnimate: boolean
}

// ─── DEFAULTS ──────────────────────────────────────────────────────────────

const DEFAULT_ITEMS: TerritoryInput[] = [
    {
        name: "Chelsea",
        imageUrl:
            "https://framerusercontent.com/images/8IGPbFclzfRApOAIssLZgmHsnw.png",
        slug: "chelsea",
        alt: "Explore prime Chelsea homes for sale, from Cheyne Walk river frontages to quiet garden squares off the King's Road.",
        coords: "51.4875° N — 0.1687° W",
    },
    {
        name: "Notting Hill",
        imageUrl:
            "https://framerusercontent.com/images/AOaAcGKE51AkwHdqIubUdXQHRf8.png",
        slug: "notting-hill",
        alt: "Discover Notting Hill's finest pastel townhouses and garden squares, moments from Portobello Road.",
        coords: "51.5090° N — 0.1963° W",
    },
    {
        name: "Hampstead",
        imageUrl:
            "https://framerusercontent.com/images/cCQCSnQDjuSX1xXtwUtrzIHQ.png",
        slug: "hampstead",
        alt: "Search Hampstead's finest period houses, moments from the Heath and Kenwood House.",
        coords: "51.5560° N — 0.1780° W",
    },
    {
        name: "The Cotswolds",
        imageUrl:
            "https://framerusercontent.com/images/UT2rfsfKG6VCT8OfYxd7DZWEA0.png",
        slug: "the-cotswolds",
        alt: "Browse country houses and cottages for sale across the Cotswolds' finest villages.",
        coords: "51.8330° N — 1.8433° W",
    },
]

const CONTENT_DEFAULTS: ContentGroup = {
    itemLimit: 12,
    linkBase: "/neighbourhoods",
    viewLabel: "VIEW →",
    ariaLabel: "Territories",
}

// Defaults tuned to Arbour Home Desktop canvas (Object controls not settable via DSL).
const LAYOUT_DEFAULTS: LayoutGroup = {
    variant: "slide",
    imageRatio: 1.74,
    stripWidth: 160,
    stripHeight: 240,
    stripLift: 26,
    stripInactiveOpacity: 0.4,
    stripGap: 0,
    showEditorialIndex: false,
    showViewLink: false,
    stripPosition: "bottom",
    imagePadding: 0,
    textAlign: "center",
    contentPadding: 40,
    contentPosition: "top",
    topBandAlign: "inline",
    cardWidth: 360,
}

const TYPOGRAPHY_DEFAULTS: TypographyGroup = {
    titleFont: {
        fontSelector: "GF;Space Mono-regular",
        fontSize: 16,
        fontWeight: 400,
        letterSpacing: "0em",
        lineHeight: "1em",
    },
    metaFont: {
        fontSelector: "GF;Space Mono-regular",
        fontSize: 11,
        fontWeight: 400,
        letterSpacing: "0em",
        lineHeight: "1em",
    },
    titleUppercase: true,
}

const ATMOSPHERE_DEFAULTS: AtmosphereGroup = {
    showGrain: true,
    showVignette: false,
    showFrame: true,
    showBlur: true,
    showTopBlur: true,
    blurStrength: 10,
    grainOpacity: 0.33,
}

const COLOR_DEFAULTS: ColorGroup = {
    titleColor: "rgb(252, 250, 244)",
    metaColor: "rgba(252, 250, 244, 0.72)",
    accentColor: "rgb(214, 224, 74)",
    stageBackground: "rgb(21, 43, 30)",
    scrimColor: "rgba(21, 43, 30, 0.7)",
    scrimOpacity: 0.72,
    showIndex: true,
}

const MOTION_DEFAULTS: MotionGroup = {
    slideInterval: 10,
    pauseOnHover: true,
    springStiffness: 90,
    springDamping: 22,
}

const META_BASE: CSSProperties = {
    margin: 0,
    fontFamily: '"Space Mono", monospace',
    fontSize: 11,
    fontWeight: 400,
    lineHeight: 1.5,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    textDecoration: "none",
}

const TITLE_BASE: CSSProperties = {
    margin: 0,
    fontFamily: '"Fraunces", Georgia, serif',
    fontWeight: 400,
    lineHeight: 1.02,
    letterSpacing: "-0.03em",
}

function resolveFontSpacing(
    value: number | string | [number, string] | undefined
): string | number | undefined {
    if (value == null) return undefined
    if (Array.isArray(value)) {
        const [amount, unit] = value
        return `${amount}${unit}`
    }
    return value
}

function normalizeFontValue(font?: FontValue): CSSProperties {
    if (!font) return {}
    const { lineHeight, letterSpacing, fontSelector: _selector, ...rest } = font
    return {
        ...rest,
        ...(lineHeight != null
            ? { lineHeight: resolveFontSpacing(lineHeight) }
            : {}),
        ...(letterSpacing != null
            ? { letterSpacing: resolveFontSpacing(letterSpacing) }
            : {}),
    }
}

function resolveTypographyStyles(typography: TypographyGroup): {
    titleStyle: CSSProperties
    metaStyle: CSSProperties
} {
    return {
        metaStyle: {
            ...META_BASE,
            ...normalizeFontValue(typography.metaFont),
        },
        titleStyle: {
            ...TITLE_BASE,
            ...normalizeFontValue(typography.titleFont),
        },
    }
}

function resolveTitleFontSize(
    titleStyle: CSSProperties,
    compact: boolean
): string | number {
    if (titleStyle.fontSize != null) return titleStyle.fontSize
    return compact
        ? "clamp(28px, 3.8vw, 48px)"
        : "clamp(36px, 5.5vw, 68px)"
}

// ─── NORMALIZERS (CMS + manual seam) ───────────────────────────────────────

function formatIndex(index: number): string {
    return `( ${String(index + 1).padStart(2, "0")} )`
}

function resolveImageSrc(value: unknown): string {
    if (!value) return ""
    if (typeof value === "string") return value
    if (typeof value === "object" && value !== null) {
        const image = value as ImageValue
        if (typeof image.src === "string" && image.src) return image.src
        if (typeof image.url === "string" && image.url) return image.url
    }
    return ""
}

function resolveImageAlt(value: unknown, fallback: string): string {
    if (typeof value === "object" && value !== null && "alt" in value) {
        const alt = (value as ImageValue).alt
        if (typeof alt === "string" && alt.trim()) return alt
    }
    return fallback
}

function resolveHref(slug: string, linkBase: string): string {
    const trimmed = slug.trim()
    if (!trimmed) return linkBase
    if (trimmed.startsWith("/") || trimmed.startsWith("http")) return trimmed
    const base = linkBase.endsWith("/") ? linkBase.slice(0, -1) : linkBase
    return `${base}/${trimmed}`
}

function readTerritoryName(input: TerritoryInput): string {
    return (input.name || input.title || input.label || "").trim()
}

function readTerritorySlug(input: TerritoryInput): string {
    return (input.slug || input.link || input.href || "").trim()
}

function readTerritoryImage(input: TerritoryInput): { src: string; alt: string } {
    const raw =
        input.imageUrl ?? input.image ?? input.cover ?? input.photo
    const name = readTerritoryName(input)
    const src =
        typeof input.imageUrl === "string" && input.imageUrl.trim()
            ? input.imageUrl.trim()
            : resolveImageSrc(raw)
    const alt =
        (input.alt || input.description || "").trim() ||
        resolveImageAlt(raw, name)
    return { src, alt }
}

function normalizeTerritoryItems(
    inputs: TerritoryInput[],
    linkBase: string,
    limit: number
): ResolvedTerritory[] {
    const capped = inputs.slice(0, Math.max(1, limit))
    const resolved: ResolvedTerritory[] = []

    capped.forEach((input, index) => {
        const name = readTerritoryName(input)
        const { src, alt } = readTerritoryImage(input)
        if (!name || !src) return

        resolved.push({
            id: `${name}-${index}`,
            name,
            image: src,
            href: resolveHref(readTerritorySlug(input), linkBase),
            alt: alt || name,
            coords: (input.coords || "").trim(),
            indexLabel: formatIndex(resolved.length),
        })
    })

    return resolved.map((item, index) => ({
        ...item,
        indexLabel: formatIndex(index),
    }))
}

function clampIndex(index: number, length: number): number {
    if (length <= 0) return 0
    return Math.min(Math.max(index, 0), length - 1)
}

function resolveStripPlacement(
    position: StripPosition
): Pick<CSSProperties, "top" | "bottom" | "transform"> {
    const inset = "clamp(20px, 4vw, 48px)"
    switch (position) {
        case "top":
            return { top: inset, bottom: "auto", transform: "none" }
        case "bottom":
            return { top: "auto", bottom: inset, transform: "none" }
        case "center":
            return { top: "50%", bottom: "auto", transform: "translateY(-50%)" }
        default: {
            const _exhaustive: never = position
            return _exhaustive
        }
    }
}

function resolveFlexAlign(align: TextAlign): CSSProperties["alignItems"] {
    switch (align) {
        case "center":
            return "center"
        case "right":
            return "flex-end"
        case "left":
            return "flex-start"
        default: {
            const _exhaustive: never = align
            return _exhaustive
        }
    }
}

function resolveTextAlign(align: TextAlign): CSSProperties["textAlign"] {
    switch (align) {
        case "center":
            return "center"
        case "right":
            return "right"
        case "left":
            return "left"
        default: {
            const _exhaustive: never = align
            return _exhaustive
        }
    }
}

function resolveJustifyContent(
    align: TextAlign
): CSSProperties["justifyContent"] {
    switch (align) {
        case "center":
            return "center"
        case "right":
            return "flex-end"
        case "left":
            return "flex-start"
        default: {
            const _exhaustive: never = align
            return _exhaustive
        }
    }
}

// ─── OVERLAYS ──────────────────────────────────────────────────────────────

function GrainOverlay({ opacity }: { opacity: number }) {
    return (
        <div
            aria-hidden
            style={{
                position: "absolute",
                inset: 0,
                pointerEvents: "none",
                opacity,
                mixBlendMode: "soft-light",
                backgroundImage:
                    "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")",
                backgroundSize: "180px 180px",
            }}
        />
    )
}

function VignetteOverlay() {
    return (
        <div
            aria-hidden
            style={{
                position: "absolute",
                inset: 0,
                pointerEvents: "none",
                background: [
                    "radial-gradient(ellipse 120% 90% at 50% 50%, transparent 42%, rgba(10, 22, 15, 0.38) 100%)",
                    "linear-gradient(180deg, rgba(10, 22, 15, 0.28) 0%, transparent 32%, transparent 58%, rgba(10, 22, 15, 0.72) 100%)",
                ].join(", "),
            }}
        />
    )
}

function BottomScrimOverlay({
    color,
    opacity,
}: {
    color: string
    opacity: number
}) {
    return (
        <div
            aria-hidden
            style={{
                position: "absolute",
                left: 0,
                right: 0,
                bottom: 0,
                height: "52%",
                pointerEvents: "none",
                backgroundColor: color,
                opacity,
                maskImage:
                    "linear-gradient(0deg, #000 0%, rgba(0,0,0,0.38) 42%, transparent 100%)",
                WebkitMaskImage:
                    "linear-gradient(0deg, #000 0%, rgba(0,0,0,0.38) 42%, transparent 100%)",
            }}
        />
    )
}

function TopScrimOverlay({
    color,
    opacity,
}: {
    color: string
    opacity: number
}) {
    return (
        <div
            aria-hidden
            style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: 0,
                height: "42%",
                pointerEvents: "none",
                backgroundColor: color,
                opacity: opacity * 0.85,
                maskImage:
                    "linear-gradient(180deg, #000 0%, rgba(0,0,0,0.35) 48%, transparent 100%)",
                WebkitMaskImage:
                    "linear-gradient(180deg, #000 0%, rgba(0,0,0,0.35) 48%, transparent 100%)",
            }}
        />
    )
}

/** Progressive blur — stacked backdrop layers, each masked tighter (Design 2 pattern). */
function TopBlurOverlay({ strength }: { strength: number }) {
    const layers = [
        { blur: strength * 0.25, from: 40, to: 62 },
        { blur: strength * 0.5, from: 58, to: 78 },
        { blur: strength, from: 74, to: 100 },
    ]
    return (
        <div
            aria-hidden
            style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: 0,
                height: "42%",
                pointerEvents: "none",
            }}
        >
            {layers.map((layer, index) => {
                const mask = `linear-gradient(0deg, transparent ${layer.from}%, #000 ${layer.to}%)`
                return (
                    <div
                        key={index}
                        style={{
                            position: "absolute",
                            inset: 0,
                            backdropFilter: `blur(${layer.blur}px)`,
                            WebkitBackdropFilter: `blur(${layer.blur}px)`,
                            maskImage: mask,
                            WebkitMaskImage: mask,
                        }}
                    />
                )
            })}
        </div>
    )
}

function BottomBlurOverlay({ strength }: { strength: number }) {
    const layers = [
        { blur: strength * 0.25, from: 40, to: 62 },
        { blur: strength * 0.5, from: 58, to: 78 },
        { blur: strength, from: 74, to: 100 },
    ]
    return (
        <div
            aria-hidden
            style={{
                position: "absolute",
                left: 0,
                right: 0,
                bottom: 0,
                height: "46%",
                pointerEvents: "none",
            }}
        >
            {layers.map((layer, index) => {
                const mask = `linear-gradient(180deg, transparent ${layer.from}%, #000 ${layer.to}%)`
                return (
                    <div
                        key={index}
                        style={{
                            position: "absolute",
                            inset: 0,
                            backdropFilter: `blur(${layer.blur}px)`,
                            WebkitBackdropFilter: `blur(${layer.blur}px)`,
                            maskImage: mask,
                            WebkitMaskImage: mask,
                        }}
                    />
                )
            })}
        </div>
    )
}

interface ViewLinkProps {
    href: string
    label: string
    ariaLabel: string
    color: string
    underlineColor: string
    shouldAnimate: boolean
    font?: CSSProperties
    align?: TextAlign
}

function ViewLink({
    href,
    label,
    ariaLabel,
    color,
    underlineColor,
    shouldAnimate,
    font,
    align = "left",
}: ViewLinkProps) {
    const linkAlign = resolveFlexAlign(align)
    return (
        <motion.a
            href={href}
            aria-label={ariaLabel}
            initial="rest"
            whileHover={shouldAnimate ? "hover" : undefined}
            whileFocus={shouldAnimate ? "hover" : undefined}
            style={{
                ...(font ?? META_BASE),
                color,
                display: "inline-flex",
                flexDirection: "column",
                alignItems: linkAlign,
                width: "max-content",
                textDecoration: "none",
                pointerEvents: "auto",
                marginTop: 4,
            }}
        >
            <span>{label}</span>
            <motion.span
                aria-hidden
                style={{
                    display: "block",
                    height: 1,
                    width: "100%",
                    marginTop: 4,
                    backgroundColor: underlineColor,
                    transformOrigin: "left center",
                }}
                variants={{
                    rest: { scaleX: 0.35, opacity: 0.45 },
                    hover: { scaleX: 1, opacity: 1 },
                }}
                transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
            />
        </motion.a>
    )
}

interface AutoplayProgressProps {
    activeId: string
    accentColor: string
    intervalSeconds: number
    autoplayPaused: boolean
}

function AutoplayProgress({
    activeId,
    accentColor,
    intervalSeconds,
    autoplayPaused,
}: AutoplayProgressProps) {
    return (
        <div
            aria-hidden
            style={{
                position: "relative",
                width: 96,
                height: 1,
                backgroundColor: "rgba(252, 250, 244, 0.18)",
                overflow: "hidden",
            }}
        >
            <motion.div
                key={`${activeId}-progress`}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: autoplayPaused ? 0 : 1 }}
                transition={
                    autoplayPaused
                        ? { duration: 0.3 }
                        : {
                              duration: Math.max(3, intervalSeconds),
                              ease: "linear",
                          }
                }
                style={{
                    position: "absolute",
                    inset: 0,
                    backgroundColor: accentColor,
                    transformOrigin: "left center",
                }}
            />
        </div>
    )
}

interface SlideTitleBlockProps {
    active: ResolvedTerritory
    showIndex: boolean
    showViewLink: boolean
    viewLabel: string
    textAlign: TextAlign
    compact: boolean
    metaStyle: CSSProperties
    titleStyle: CSSProperties
    titleUppercase: boolean
    metaFont?: CSSProperties
    colors: ColorGroup
    shouldAnimate: boolean
}

function SlideTitleBlock({
    active,
    showIndex,
    showViewLink,
    viewLabel,
    textAlign,
    compact,
    metaStyle,
    titleStyle,
    titleUppercase,
    metaFont,
    colors,
    shouldAnimate,
}: SlideTitleBlockProps) {
    const textAlignCss = resolveTextAlign(textAlign)
    const titleSize = resolveTitleFontSize(titleStyle, compact)

    return (
        <>
            {showIndex ? (
                <motion.span
                    key={`${active.id}-index`}
                    initial={shouldAnimate ? { opacity: 0, y: 8 } : undefined}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 26 }}
                    style={{ ...metaStyle, color: colors.accentColor }}
                >
                    {active.indexLabel}
                </motion.span>
            ) : null}
            <div style={{ overflow: "hidden", paddingBottom: 2 }}>
                <AnimatePresence mode="wait" initial={false}>
                    <motion.h3
                        key={active.name}
                        initial={shouldAnimate ? { y: "108%" } : undefined}
                        animate={{ y: "0%" }}
                        exit={shouldAnimate ? { y: "-108%" } : undefined}
                        transition={{
                            duration: 0.62,
                            ease: [0.22, 1, 0.36, 1],
                        }}
                        style={{
                            margin: 0,
                            ...titleStyle,
                            fontSize: titleSize,
                            lineHeight: titleStyle.lineHeight ?? 1.05,
                            color: colors.titleColor,
                            textAlign: textAlignCss,
                            textTransform: titleUppercase
                                ? "uppercase"
                                : titleStyle.textTransform ?? "none",
                        }}
                    >
                        {active.name}
                    </motion.h3>
                </AnimatePresence>
            </div>
            {showViewLink ? (
                <ViewLink
                    href={active.href}
                    label={viewLabel}
                    ariaLabel={`${viewLabel} ${active.name}`}
                    color={colors.titleColor}
                    underlineColor={colors.accentColor}
                    shouldAnimate={shouldAnimate}
                    font={metaStyle}
                    align={textAlign}
                />
            ) : null}
        </>
    )
}

interface SlideTitleInlineProps {
    active: ResolvedTerritory
    showIndex: boolean
    titleStyle: CSSProperties
    titleUppercase: boolean
    metaStyle: CSSProperties
    colors: ColorGroup
    shouldAnimate: boolean
    compact: boolean
}

function SlideTitleInline({
    active,
    showIndex,
    titleStyle,
    titleUppercase,
    metaStyle,
    colors,
    shouldAnimate,
    compact,
}: SlideTitleInlineProps) {
    const titleSize = resolveTitleFontSize(titleStyle, compact)

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: compact ? "center" : "flex-start",
                gap: 10,
                minWidth: 0,
                width: compact ? "100%" : undefined,
                textAlign: compact ? "center" : "left",
            }}
        >
            {showIndex ? (
                <motion.span
                    key={`${active.id}-index-inline`}
                    initial={shouldAnimate ? { opacity: 0 } : undefined}
                    animate={{ opacity: 1 }}
                    style={{ ...metaStyle, color: colors.accentColor, flexShrink: 0 }}
                >
                    {active.indexLabel}
                </motion.span>
            ) : null}
            <div style={{ overflow: "hidden", minWidth: 0 }}>
                <AnimatePresence mode="wait" initial={false}>
                    <motion.h3
                        key={active.name}
                        initial={shouldAnimate ? { y: "100%" } : undefined}
                        animate={{ y: "0%" }}
                        exit={shouldAnimate ? { y: "-100%" } : undefined}
                        transition={{
                            duration: 0.55,
                            ease: [0.22, 1, 0.36, 1],
                        }}
                        style={{
                            margin: 0,
                            ...titleStyle,
                            fontSize: titleSize,
                            lineHeight: titleStyle.lineHeight ?? 1,
                            color: colors.titleColor,
                            whiteSpace: "nowrap",
                            textOverflow: "ellipsis",
                            overflow: "hidden",
                            textTransform: titleUppercase
                                ? "uppercase"
                                : titleStyle.textTransform ?? "none",
                        }}
                    >
                        {active.name}
                    </motion.h3>
                </AnimatePresence>
            </div>
        </div>
    )
}

function FrameOverlay() {
    return (
        <div
            aria-hidden
            style={{
                position: "absolute",
                inset: "clamp(16px, 1.6vw, 24px)",
                pointerEvents: "none",
                border: "1px solid rgba(252, 250, 244, 0.16)",
                zIndex: 1,
            }}
        />
    )
}

function CanvasPlaceholder() {
    return (
        <div
            style={{
                width: "100%",
                aspectRatio: 1.76,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 32,
                boxSizing: "border-box",
                backgroundColor: "rgb(21, 43, 30)",
                color: "rgba(252, 250, 244, 0.72)",
                fontFamily: '"Space Mono", monospace',
                fontSize: 11,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                textAlign: "center",
            }}
        >
            Add territories in Content → Items, or connect a CMS collection
        </div>
    )
}

// ─── SLIDE STAGE (Slide Image structure + Arbour layer) ───────────────────

function SlideStage({
    items,
    activeIndex,
    onSelect,
    imageRatio,
    stripWidth,
    stripHeight,
    stripLift,
    stripInactiveOpacity,
    stripGap,
    showEditorialIndex,
    showViewLink,
    stripPosition,
    imagePadding,
    textAlign,
    contentPadding,
    contentPosition,
    topBandAlign,
    typography,
    colors,
    atmosphere,
    viewLabel,
    ariaLabel,
    shouldAnimate,
    stiffness,
    damping,
    intervalSeconds,
    autoplayPaused,
}: SlideStageProps) {
    const active = items[activeIndex] ?? items[0]

    if (!active) return null

    const showIndex = showEditorialIndex && colors.showIndex
    const showProgress = shouldAnimate && items.length > 1

    const { titleStyle, metaStyle } = resolveTypographyStyles(typography)

    const stripPlacement = resolveStripPlacement(stripPosition)
    const flexAlign = resolveFlexAlign(textAlign)
    const titleJustify = resolveJustifyContent(textAlign)
    const heroBleed = imagePadding <= 0
    const heroInset = imagePadding > 0 ? imagePadding : 0
    const isTextCentered = textAlign === "center"
    const isTopContent = contentPosition === "top"
    const isTopInline = isTopContent && topBandAlign === "inline"

    return (
        <div
            style={{
                position: "relative",
                width: "100%",
                aspectRatio: imageRatio,
                overflow: "hidden",
                backgroundColor: colors.stageBackground,
            }}
        >
            <AnimatePresence mode="sync" initial={false}>
                <motion.img
                    key={active.image}
                    src={active.image}
                    alt={active.alt}
                    initial={
                        shouldAnimate ? { opacity: 0, scale: 1.02 } : undefined
                    }
                    animate={{ opacity: 1, scale: 1.03, x: 0, y: 0 }}
                    exit={shouldAnimate ? { opacity: 0, scale: 1.01 } : undefined}
                    transition={{ type: "spring", stiffness, damping }}
                    style={{
                        position: "absolute",
                        ...(heroBleed
                            ? {
                                  inset: "-3%",
                                  width: "106%",
                                  height: "106%",
                              }
                            : {
                                  top: heroInset,
                                  left: heroInset,
                                  right: heroInset,
                                  bottom: heroInset,
                                  width: "auto",
                                  height: "auto",
                              }),
                        objectFit: "cover",
                        objectPosition: "center center",
                        display: "block",
                    }}
                />
            </AnimatePresence>

            {atmosphere.showTopBlur ? (
                <TopBlurOverlay strength={atmosphere.blurStrength} />
            ) : null}
            {atmosphere.showBlur ? (
                <BottomBlurOverlay strength={atmosphere.blurStrength} />
            ) : null}
            {atmosphere.showVignette ? <VignetteOverlay /> : null}
            {isTopContent ? (
                <TopScrimOverlay
                    color={colors.scrimColor}
                    opacity={colors.scrimOpacity}
                />
            ) : (
                <BottomScrimOverlay
                    color={colors.scrimColor}
                    opacity={colors.scrimOpacity}
                />
            )}
            {atmosphere.showGrain ? (
                <GrainOverlay opacity={atmosphere.grainOpacity} />
            ) : null}
            {atmosphere.showFrame ? <FrameOverlay /> : null}

            {isTopContent ? (
                <div
                    style={{
                        position: "absolute",
                        left: 0,
                        right: 0,
                        top: 0,
                        zIndex: 3,
                        display: "flex",
                        flexDirection: "column",
                        gap: 10,
                        padding: `clamp(24px, 3.4vw, 44px) ${contentPadding}px 0`,
                        pointerEvents: "none",
                    }}
                >
                    {isTopInline ? (
                        <div
                            style={{
                                position: "relative",
                                width: "100%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                gap: "clamp(16px, 2vw, 24px)",
                                minHeight: "clamp(28px, 3.2vw, 40px)",
                            }}
                        >
                            <span
                                style={{
                                    ...metaStyle,
                                    color: colors.metaColor,
                                    whiteSpace: "nowrap",
                                    flexShrink: 0,
                                    position: "relative",
                                    zIndex: 1,
                                }}
                            >
                                [ {ariaLabel} ]
                            </span>
                            {active.coords ? (
                                <AnimatePresence mode="wait" initial={false}>
                                    <motion.span
                                        key={`${active.id}-coords`}
                                        initial={
                                            shouldAnimate
                                                ? { opacity: 0 }
                                                : undefined
                                        }
                                        animate={{ opacity: 1 }}
                                        exit={
                                            shouldAnimate
                                                ? { opacity: 0 }
                                                : undefined
                                        }
                                        transition={{ duration: 0.4 }}
                                        style={{
                                            ...metaStyle,
                                            color: colors.metaColor,
                                            fontVariantNumeric: "tabular-nums",
                                            whiteSpace: "nowrap",
                                            flexShrink: 0,
                                            textAlign: "right",
                                            position: "relative",
                                            zIndex: 1,
                                        }}
                                    >
                                        {active.coords}
                                    </motion.span>
                                </AnimatePresence>
                            ) : (
                                <span aria-hidden="true" />
                            )}
                            <div
                                style={{
                                    position: "absolute",
                                    left: "50%",
                                    top: "50%",
                                    transform: "translate(-50%, -50%)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    width: "min(58vw, 560px)",
                                    maxWidth: "calc(100% - 120px)",
                                    pointerEvents: "none",
                                    zIndex: 2,
                                }}
                            >
                                <SlideTitleInline
                                    active={active}
                                    showIndex={showIndex}
                                    titleStyle={titleStyle}
                                    titleUppercase={typography.titleUppercase}
                                    metaStyle={metaStyle}
                                    colors={colors}
                                    shouldAnimate={shouldAnimate}
                                    compact
                                />
                            </div>
                        </div>
                    ) : (
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "auto minmax(0, 1fr) auto",
                                alignItems: "start",
                                gap: "clamp(16px, 2vw, 24px)",
                                width: "100%",
                            }}
                        >
                            <span
                                style={{
                                    ...metaStyle,
                                    color: colors.metaColor,
                                    whiteSpace: "nowrap",
                                }}
                            >
                                [ {ariaLabel} ]
                            </span>
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: flexAlign,
                                    gap: 6,
                                    minWidth: 0,
                                }}
                            >
                                <SlideTitleBlock
                                    active={active}
                                    showIndex={showIndex}
                                    showViewLink={false}
                                    viewLabel={viewLabel}
                                    textAlign={textAlign}
                                    compact
                                    metaStyle={metaStyle}
                                    titleStyle={titleStyle}
                                    titleUppercase={typography.titleUppercase}
                                    metaFont={typography.metaFont}
                                    colors={colors}
                                    shouldAnimate={shouldAnimate}
                                />
                            </div>
                            {active.coords ? (
                                <AnimatePresence mode="wait" initial={false}>
                                    <motion.span
                                        key={`${active.id}-coords`}
                                        initial={
                                            shouldAnimate
                                                ? { opacity: 0 }
                                                : undefined
                                        }
                                        animate={{ opacity: 1 }}
                                        exit={
                                            shouldAnimate
                                                ? { opacity: 0 }
                                                : undefined
                                        }
                                        transition={{ duration: 0.4 }}
                                        style={{
                                            ...metaStyle,
                                            color: colors.metaColor,
                                            fontVariantNumeric: "tabular-nums",
                                            whiteSpace: "nowrap",
                                            textAlign: "right",
                                        }}
                                    >
                                        {active.coords}
                                    </motion.span>
                                </AnimatePresence>
                            ) : (
                                <span aria-hidden="true" />
                            )}
                        </div>
                    )}
                    {showViewLink ? (
                        <div
                            style={{
                                display: "flex",
                                justifyContent: titleJustify,
                                width: "100%",
                            }}
                        >
                            <ViewLink
                                href={active.href}
                                label={viewLabel}
                                ariaLabel={`${viewLabel} ${active.name}`}
                                color={colors.titleColor}
                                underlineColor={colors.accentColor}
                                shouldAnimate={shouldAnimate}
                                font={metaStyle}
                                align={textAlign}
                            />
                        </div>
                    ) : null}
                </div>
            ) : (
                <div
                    style={{
                        position: "absolute",
                        left: 0,
                        right: 0,
                        top: 0,
                        zIndex: 3,
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 24,
                        padding: `clamp(24px, 3.4vw, 44px) ${contentPadding}px 0`,
                        pointerEvents: "none",
                    }}
                >
                    <span style={{ ...metaStyle, color: colors.metaColor }}>
                        [ {ariaLabel} ]
                    </span>
                    {active.coords ? (
                        <AnimatePresence mode="wait" initial={false}>
                            <motion.span
                                key={`${active.id}-coords`}
                                initial={
                                    shouldAnimate ? { opacity: 0 } : undefined
                                }
                                animate={{ opacity: 1 }}
                                exit={
                                    shouldAnimate ? { opacity: 0 } : undefined
                                }
                                transition={{ duration: 0.4 }}
                                style={{
                                    ...metaStyle,
                                    color: colors.metaColor,
                                    fontVariantNumeric: "tabular-nums",
                                }}
                            >
                                {active.coords}
                            </motion.span>
                        </AnimatePresence>
                    ) : null}
                </div>
            )}

            <div
                style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    ...stripPlacement,
                    zIndex: 2,
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "flex-end",
                    gap: stripGap,
                    padding: "0 clamp(24px, 4vw, 48px)",
                    WebkitMaskImage:
                        "linear-gradient(90deg, transparent 0%, #000 10%, #000 90%, transparent 100%)",
                    maskImage:
                        "linear-gradient(90deg, transparent 0%, #000 10%, #000 90%, transparent 100%)",
                }}
                role="tablist"
                aria-label={ariaLabel}
            >
                {items.map((item, index) => {
                    const isActive = index === activeIndex
                    return (
                        <button
                            key={item.id}
                            type="button"
                            role="tab"
                            aria-selected={isActive}
                            aria-label={item.name}
                            onClick={() => onSelect(index)}
                            onPointerEnter={() => onSelect(index)}
                            onFocus={() => onSelect(index)}
                            style={{
                                flex: `0 0 ${stripWidth}px`,
                                width: stripWidth,
                                border: "none",
                                background: "transparent",
                                padding: 0,
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "flex-end",
                                justifyContent: "center",
                            }}
                        >
                            <motion.div
                                animate={{
                                    y: isActive ? -stripLift : 0,
                                    scale: isActive ? 1.04 : 0.98,
                                    opacity: isActive ? 1 : stripInactiveOpacity,
                                    filter: isActive
                                        ? "saturate(1)"
                                        : "saturate(0.55)",
                                }}
                                transition={{
                                    type: "spring",
                                    stiffness: 180,
                                    damping: 24,
                                }}
                                style={{
                                    position: "relative",
                                    width: stripWidth,
                                    height: isActive
                                        ? stripHeight + stripLift
                                        : stripHeight,
                                    overflow: "hidden",
                                    boxShadow: isActive
                                        ? "0 22px 44px rgba(10, 22, 15, 0.36)"
                                        : "none",
                                    outline: isActive
                                        ? `1px solid ${colors.accentColor}`
                                        : "1px solid rgba(252, 250, 244, 0.08)",
                                    outlineOffset: -1,
                                }}
                            >
                                <img
                                    src={item.image}
                                    alt=""
                                    aria-hidden
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover",
                                        objectPosition: "center center",
                                        display: "block",
                                    }}
                                />
                            </motion.div>
                        </button>
                    )
                })}
            </div>

            {!isTopContent ? (
                <div
                    style={{
                        position: "absolute",
                        left: 0,
                        right: 0,
                        bottom: 0,
                        zIndex: 3,
                        display: "flex",
                        flexDirection: isTextCentered
                            ? "column"
                            : textAlign === "right"
                              ? "row-reverse"
                              : "row",
                        alignItems: isTextCentered ? "center" : "flex-end",
                        justifyContent: isTextCentered
                            ? "center"
                            : "space-between",
                        gap: 24,
                        padding: `clamp(28px, 4vw, 52px) ${contentPadding}px`,
                        pointerEvents: "none",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: flexAlign,
                            gap: 8,
                            maxWidth: isTextCentered
                                ? "min(88%, 720px)"
                                : "min(72%, 640px)",
                        }}
                    >
                        <SlideTitleBlock
                            active={active}
                            showIndex={showIndex}
                            showViewLink={showViewLink}
                            viewLabel={viewLabel}
                            textAlign={textAlign}
                            compact={false}
                            metaStyle={metaStyle}
                            titleStyle={titleStyle}
                            titleUppercase={typography.titleUppercase}
                            metaFont={typography.metaFont}
                            colors={colors}
                            shouldAnimate={shouldAnimate}
                        />
                        {showProgress && isTextCentered ? (
                            <AutoplayProgress
                                activeId={active.id}
                                accentColor={colors.accentColor}
                                intervalSeconds={intervalSeconds}
                                autoplayPaused={autoplayPaused}
                            />
                        ) : null}
                    </div>
                    {!isTextCentered && showProgress ? (
                        <div
                            style={{
                                flexShrink: 0,
                                paddingBottom: showViewLink ? 2 : 0,
                            }}
                        >
                            <AutoplayProgress
                                activeId={active.id}
                                accentColor={colors.accentColor}
                                intervalSeconds={intervalSeconds}
                                autoplayPaused={autoplayPaused}
                            />
                        </div>
                    ) : null}
                </div>
            ) : null}

            {isTopContent && showProgress ? (
                <div
                    style={{
                        position: "absolute",
                        right: contentPadding,
                        bottom: "clamp(28px, 4vw, 52px)",
                        zIndex: 3,
                        pointerEvents: "none",
                    }}
                >
                    <AutoplayProgress
                        activeId={active.id}
                        accentColor={colors.accentColor}
                        intervalSeconds={intervalSeconds}
                        autoplayPaused={autoplayPaused}
                    />
                </div>
            ) : null}
        </div>
    )
}

// ─── RAIL STAGE ────────────────────────────────────────────────────────────

function RailStage({
    items,
    cardWidth,
    imageRatio,
    colors,
    atmosphere,
    viewLabel,
    shouldAnimate,
}: RailStageProps) {
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "stretch",
                gap: 24,
                overflowX: "auto",
                overflowY: "hidden",
                width: "100%",
                paddingBottom: 8,
                scrollSnapType: "x mandatory",
                WebkitOverflowScrolling: "touch",
            }}
        >
            {items.map((item, index) => (
                <motion.article
                    key={item.id}
                    style={{
                        flex: `0 0 ${cardWidth}px`,
                        width: cardWidth,
                        scrollSnapAlign: "start",
                        display: "flex",
                        flexDirection: "column",
                        gap: 14,
                    }}
                    initial={shouldAnimate ? { opacity: 0, y: 20 } : undefined}
                    whileInView={shouldAnimate ? { opacity: 1, y: 0 } : undefined}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{
                        type: "spring",
                        stiffness: 90,
                        damping: 22,
                        delay: index * 0.07,
                    }}
                >
                    <a
                        href={item.href}
                        style={{ textDecoration: "none", color: "inherit" }}
                    >
                        <div
                            style={{
                                position: "relative",
                                width: "100%",
                                aspectRatio: imageRatio,
                                overflow: "hidden",
                                backgroundColor: colors.stageBackground,
                            }}
                        >
                            <img
                                src={item.image}
                                alt={item.alt}
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                    display: "block",
                                }}
                            />
                            {atmosphere.showVignette ? <VignetteOverlay /> : null}
                            {atmosphere.showGrain ? (
                                <GrainOverlay
                                    opacity={atmosphere.grainOpacity * 0.82}
                                />
                            ) : null}
                            <div
                                style={{
                                    position: "absolute",
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    padding: 24,
                                    zIndex: 2,
                                }}
                            >
                                <p
                                    style={{
                                        margin: 0,
                                        ...TITLE_BASE,
                                        fontSize: "clamp(24px, 3vw, 32px)",
                                        lineHeight: 1.1,
                                        letterSpacing: "-0.02em",
                                        color: colors.titleColor,
                                    }}
                                >
                                    {item.name}
                                </p>
                            </div>
                        </div>
                    </a>
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                            gap: 12,
                        }}
                    >
                        <span style={{ ...META_BASE, color: colors.metaColor }}>
                            {item.indexLabel}
                        </span>
                        <a
                            href={item.href}
                            style={{ ...META_BASE, color: colors.accentColor }}
                        >
                            {viewLabel}
                        </a>
                    </div>
                </motion.article>
            ))}
        </div>
    )
}

// ─── ROOT ────────────────────────────────────────────────────────────────────

export default function Arbour_TerritoryRail(props: Partial<Props>) {
    const itemsInput = props.items ?? DEFAULT_ITEMS
    const content = { ...CONTENT_DEFAULTS, ...props.content }
    const layout = { ...LAYOUT_DEFAULTS, ...props.layout }
    const typography = { ...TYPOGRAPHY_DEFAULTS, ...props.typography }
    const atmosphere = { ...ATMOSPHERE_DEFAULTS, ...props.atmosphere }
    const colors = { ...COLOR_DEFAULTS, ...props.colors }
    const motion = { ...MOTION_DEFAULTS, ...props.motion }
    const { style } = props

    const isCanvas = useIsOnFramerCanvas() ?? false
    const isStatic = useIsStaticRenderer()
    const prefersReduced = useReducedMotion() ?? false
    const railRef = useRef<HTMLDivElement>(null)
    const railInView = useInView(railRef, { amount: 0.2, once: false })
    const shouldAnimate = !isCanvas && !isStatic && !prefersReduced

    const items = useMemo(
        () =>
            normalizeTerritoryItems(
                itemsInput,
                content.linkBase,
                content.itemLimit
            ),
        [itemsInput, content.linkBase, content.itemLimit]
    )

    const [activeIndex, setActiveIndex] = useState(0)
    const [hovered, setHovered] = useState(false)

    useEffect(() => {
        setActiveIndex((current) => clampIndex(current, items.length))
    }, [items.length])

    const advance = useCallback(() => {
        if (items.length < 2) return
        setActiveIndex((current) => (current + 1) % items.length)
    }, [items.length])

    useEffect(() => {
        if (typeof window === "undefined") return
        if (layout.variant !== "slide" || !shouldAnimate || items.length < 2)
            return
        if (!railInView) return
        if (motion.pauseOnHover && hovered) return
        const ms = Math.max(3, motion.slideInterval) * 1000
        const timer = window.setInterval(advance, ms)
        return () => window.clearInterval(timer)
    }, [
        advance,
        hovered,
        items.length,
        layout.variant,
        motion.pauseOnHover,
        motion.slideInterval,
        shouldAnimate,
        railInView,
    ])

    const handleKeyDown = useCallback(
        (event: KeyboardEvent<HTMLDivElement>) => {
            if (layout.variant !== "slide" || items.length < 2) return
            if (event.key === "ArrowDown" || event.key === "ArrowRight") {
                event.preventDefault()
                setActiveIndex((current) => (current + 1) % items.length)
            }
            if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
                event.preventDefault()
                setActiveIndex(
                    (current) => (current - 1 + items.length) % items.length
                )
            }
        },
        [items.length, layout.variant]
    )

    if (items.length === 0) {
        return (
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    boxSizing: "border-box",
                    ...style,
                }}
            >
                <CanvasPlaceholder />
            </div>
        )
    }

    return (
        <div
            ref={railRef}
            style={{
                width: "100%",
                height: "100%",
                overflowX: "hidden",
                boxSizing: "border-box",
                ...style,
            }}
            onPointerEnter={() => setHovered(true)}
            onPointerLeave={() => setHovered(false)}
            onKeyDown={handleKeyDown}
            tabIndex={layout.variant === "slide" ? 0 : undefined}
        >
            {layout.variant === "rail" ? (
                <RailStage
                    items={items}
                    cardWidth={layout.cardWidth}
                    imageRatio={layout.imageRatio}
                    colors={colors}
                    atmosphere={atmosphere}
                    viewLabel={content.viewLabel}
                    shouldAnimate={shouldAnimate}
                />
            ) : (
                <SlideStage
                    items={items}
                    activeIndex={activeIndex}
                    onSelect={setActiveIndex}
                    imageRatio={layout.imageRatio}
                    stripWidth={layout.stripWidth}
                    stripHeight={layout.stripHeight}
                    stripLift={layout.stripLift}
                    stripInactiveOpacity={layout.stripInactiveOpacity}
                    stripGap={layout.stripGap}
                    showEditorialIndex={layout.showEditorialIndex}
                    showViewLink={layout.showViewLink}
                    stripPosition={layout.stripPosition}
                    imagePadding={layout.imagePadding}
                    textAlign={layout.textAlign}
                    contentPadding={layout.contentPadding}
                    contentPosition={layout.contentPosition}
                    topBandAlign={layout.topBandAlign}
                    typography={typography}
                    colors={colors}
                    atmosphere={atmosphere}
                    viewLabel={content.viewLabel}
                    ariaLabel={content.ariaLabel}
                    shouldAnimate={shouldAnimate}
                    stiffness={motion.springStiffness}
                    damping={motion.springDamping}
                    intervalSeconds={motion.slideInterval}
                    autoplayPaused={
                        !shouldAnimate ||
                        items.length < 2 ||
                        (motion.pauseOnHover && hovered)
                    }
                />
            )}
        </div>
    )
}

Arbour_TerritoryRail.defaultProps = {
    items: DEFAULT_ITEMS,
    content: CONTENT_DEFAULTS,
    layout: LAYOUT_DEFAULTS,
    typography: TYPOGRAPHY_DEFAULTS,
    atmosphere: ATMOSPHERE_DEFAULTS,
    colors: COLOR_DEFAULTS,
    motion: MOTION_DEFAULTS,
}

// ─── PROPERTY CONTROLS ───────────────────────────────────────────────────────

addPropertyControls(Arbour_TerritoryRail, {
    items: {
        type: ControlType.Array,
        title: "Territories",
        description:
            "Connect to CMS → Neighbourhoods, or edit manually. Maps name, imageUrl, slug, alt.",
        defaultValue: DEFAULT_ITEMS,
        control: {
            type: ControlType.Object,
            controls: {
                name: {
                    type: ControlType.String,
                    title: "Name",
                    defaultValue: "Chelsea",
                },
                imageUrl: {
                    type: ControlType.String,
                    title: "Image URL",
                    defaultValue:
                        "https://framerusercontent.com/images/8IGPbFclzfRApOAIssLZgmHsnw.png",
                    displayTextArea: false,
                },
                slug: {
                    type: ControlType.String,
                    title: "Slug / Link",
                    defaultValue: "chelsea",
                    placeholder: "chelsea or /page",
                },
                alt: {
                    type: ControlType.String,
                    title: "Alt",
                    defaultValue: "Neighbourhood photograph",
                },
                coords: {
                    type: ControlType.String,
                    title: "Coords",
                    defaultValue: "",
                    placeholder: "51.4875° N — 0.1687° W",
                },
            },
        },
    },
    content: {
        type: ControlType.Object,
        title: "Content",
        buttonTitle: "Content",
        controls: {
            itemLimit: {
                type: ControlType.Number,
                title: "Limit",
                defaultValue: 12,
                min: 1,
                max: 24,
                step: 1,
                displayStepper: true,
                description: "Max items when fed from CMS.",
            },
            linkBase: {
                type: ControlType.String,
                title: "Link Base",
                defaultValue: "/neighbourhoods",
                placeholder: "/neighbourhoods",
                description: "Prepended to slug when link is not absolute.",
            },
            viewLabel: {
                type: ControlType.String,
                title: "View Label",
                defaultValue: "VIEW →",
            },
            ariaLabel: {
                type: ControlType.String,
                title: "Aria Label",
                defaultValue: "Territories",
            },
        },
        defaultValue: CONTENT_DEFAULTS,
    },
    layout: {
        type: ControlType.Object,
        title: "Layout",
        buttonTitle: "Layout",
        controls: {
            variant: {
                type: ControlType.Enum,
                title: "Mode",
                options: ["slide", "rail"],
                optionTitles: ["Slide", "Rail"],
                defaultValue: "slide",
                displaySegmentedControl: true,
            },
            imageRatio: {
                type: ControlType.Number,
                title: "Image Ratio",
                defaultValue: 1.76,
                min: 0.8,
                max: 2.4,
                step: 0.02,
            },
            stripWidth: {
                type: ControlType.Number,
                title: "Strip Width",
                defaultValue: 100,
                min: 64,
                max: 160,
                step: 4,
                unit: "px",
                hidden: (group: Partial<LayoutGroup>) =>
                    group.variant !== "slide",
            },
            stripHeight: {
                type: ControlType.Number,
                title: "Strip Height",
                defaultValue: 260,
                min: 140,
                max: 360,
                step: 4,
                unit: "px",
                hidden: (group: Partial<LayoutGroup>) =>
                    group.variant !== "slide",
            },
            stripLift: {
                type: ControlType.Number,
                title: "Active Lift",
                defaultValue: 40,
                min: 12,
                max: 80,
                step: 2,
                unit: "px",
                hidden: (group: Partial<LayoutGroup>) =>
                    group.variant !== "slide",
            },
            stripInactiveOpacity: {
                type: ControlType.Number,
                title: "Inactive Opacity",
                defaultValue: 0.42,
                min: 0.2,
                max: 1,
                step: 0.05,
                description:
                    "Opacity of non-active strip thumbnails. Set to 1 for no dimming.",
                hidden: (group: Partial<LayoutGroup>) =>
                    group.variant !== "slide",
            },
            stripGap: {
                type: ControlType.Number,
                title: "Strip Gap",
                defaultValue: 2,
                min: 0,
                max: 16,
                step: 1,
                unit: "px",
                hidden: (group: Partial<LayoutGroup>) =>
                    group.variant !== "slide",
            },
            stripPosition: {
                type: ControlType.Enum,
                title: "Strip Position",
                options: ["top", "center", "bottom"],
                optionTitles: ["Top", "Center", "Bottom"],
                defaultValue: "center",
                displaySegmentedControl: true,
                description: "Vertical placement of thumbnail strip on stage.",
                hidden: (group: Partial<LayoutGroup>) =>
                    group.variant !== "slide",
            },
            imagePadding: {
                type: ControlType.Number,
                title: "Image Padding",
                defaultValue: 0,
                min: 0,
                max: 80,
                step: 4,
                unit: "px",
                description: "Inset hero image from stage edges. 0 = full bleed.",
                hidden: (group: Partial<LayoutGroup>) =>
                    group.variant !== "slide",
            },
            textAlign: {
                type: ControlType.Enum,
                title: "Text Align",
                options: ["left", "center", "right"],
                optionTitles: ["Left", "Center", "Right"],
                defaultValue: "left",
                displaySegmentedControl: true,
                hidden: (group: Partial<LayoutGroup>) =>
                    group.variant !== "slide",
            },
            contentPadding: {
                type: ControlType.Number,
                title: "Text Padding",
                defaultValue: 48,
                min: 16,
                max: 120,
                step: 4,
                unit: "px",
                description: "Horizontal padding for title and view link.",
                hidden: (group: Partial<LayoutGroup>) =>
                    group.variant !== "slide",
            },
            contentPosition: {
                type: ControlType.Enum,
                title: "Content Position",
                options: ["bottom", "top"],
                optionTitles: ["Bottom", "Top Band"],
                defaultValue: "bottom",
                displaySegmentedControl: true,
                description:
                    "Top Band — title between kicker and coordinates.",
                hidden: (group: Partial<LayoutGroup>) =>
                    group.variant !== "slide",
            },
            topBandAlign: {
                type: ControlType.Enum,
                title: "Top Band Align",
                options: ["inline", "stacked"],
                optionTitles: ["Inline", "Stacked"],
                defaultValue: "inline",
                displaySegmentedControl: true,
                description:
                    "Inline — title on same row as kicker and coords.",
                hidden: (group: Partial<LayoutGroup>) =>
                    group.variant !== "slide" ||
                    group.contentPosition !== "top",
            },
            showEditorialIndex: {
                type: ControlType.Boolean,
                title: "Editorial Index",
                defaultValue: true,
                description: "Arbour `( 01 )` label — not in original.",
                hidden: (group: Partial<LayoutGroup>) =>
                    group.variant !== "slide",
            },
            showViewLink: {
                type: ControlType.Boolean,
                title: "View Link",
                defaultValue: true,
                hidden: (group: Partial<LayoutGroup>) =>
                    group.variant !== "slide",
            },
            cardWidth: {
                type: ControlType.Number,
                title: "Card Width",
                defaultValue: 360,
                min: 260,
                max: 480,
                step: 10,
                unit: "px",
                hidden: (group: Partial<LayoutGroup>) =>
                    group.variant !== "rail",
            },
        },
        defaultValue: LAYOUT_DEFAULTS,
    },
    typography: {
        type: ControlType.Object,
        title: "Typography",
        buttonTitle: "Typography",
        controls: {
            titleFont: {
                type: ControlType.Font,
                title: "Title Font",
                controls: "extended",
                displayTextAlignment: false,
                defaultFontType: "serif",
                defaultValue: {
                    fontSelector: "GF;Fraunces-regular",
                    fontWeight: 400,
                    letterSpacing: "-0.03em",
                },
                description:
                    "Full control — family, size, weight, line-height, tracking. Syncs with project text styles.",
            },
            metaFont: {
                type: ControlType.Font,
                title: "Meta Font",
                controls: "extended",
                displayTextAlignment: false,
                defaultFontType: "monospace",
                defaultValue: {
                    fontSelector: "GF;Space Mono-regular",
                    fontSize: 11,
                    fontWeight: 400,
                    letterSpacing: "0.12em",
                },
                description:
                    "Kicker, coords, index, view link. Syncs with project text styles.",
            },
            titleUppercase: {
                type: ControlType.Boolean,
                title: "Title Caps",
                defaultValue: false,
            },
        },
        defaultValue: TYPOGRAPHY_DEFAULTS,
    },
    atmosphere: {
        type: ControlType.Object,
        title: "Atmosphere",
        buttonTitle: "Atmosphere",
        controls: {
            showGrain: {
                type: ControlType.Boolean,
                title: "Grain",
                defaultValue: true,
            },
            showVignette: {
                type: ControlType.Boolean,
                title: "Vignette",
                defaultValue: true,
            },
            showFrame: {
                type: ControlType.Boolean,
                title: "Hairline Frame",
                defaultValue: true,
                description: "Editorial inset frame — template DNA.",
            },
            showBlur: {
                type: ControlType.Boolean,
                title: "Bottom Blur",
                defaultValue: true,
                description: "Progressive blur at bottom edge.",
            },
            showTopBlur: {
                type: ControlType.Boolean,
                title: "Top Blur",
                defaultValue: true,
                description: "Progressive blur at top — for Top Band layout.",
            },
            blurStrength: {
                type: ControlType.Number,
                title: "Blur Strength",
                defaultValue: 12,
                min: 4,
                max: 28,
                step: 1,
                unit: "px",
                hidden: (group: Partial<AtmosphereGroup>) =>
                    !group.showBlur && !group.showTopBlur,
            },
            grainOpacity: {
                type: ControlType.Number,
                title: "Grain Opacity",
                defaultValue: 0.22,
                min: 0.05,
                max: 0.5,
                step: 0.01,
                hidden: (group: Partial<AtmosphereGroup>) => !group.showGrain,
            },
        },
        defaultValue: ATMOSPHERE_DEFAULTS,
    },
    colors: {
        type: ControlType.Object,
        title: "Colors",
        buttonTitle: "Colors",
        controls: {
            titleColor: {
                type: ControlType.Color,
                title: "Title",
                defaultValue: "rgb(252, 250, 244)",
            },
            metaColor: {
                type: ControlType.Color,
                title: "Meta",
                defaultValue: "rgba(252, 250, 244, 0.72)",
            },
            accentColor: {
                type: ControlType.Color,
                title: "Accent",
                defaultValue: "rgb(214, 224, 74)",
            },
            stageBackground: {
                type: ControlType.Color,
                title: "Stage Bg",
                defaultValue: "rgb(21, 43, 30)",
            },
            scrimColor: {
                type: ControlType.Color,
                title: "Scrim",
                defaultValue: "rgb(21, 43, 30)",
                description: "Bottom gradient colour behind title.",
            },
            scrimOpacity: {
                type: ControlType.Number,
                title: "Scrim Amount",
                defaultValue: 0.72,
                min: 0,
                max: 1,
                step: 0.02,
            },
            showIndex: {
                type: ControlType.Boolean,
                title: "Index Labels",
                defaultValue: true,
            },
        },
        defaultValue: COLOR_DEFAULTS,
    },
    motion: {
        type: ControlType.Object,
        title: "Motion",
        buttonTitle: "Motion",
        controls: {
            slideInterval: {
                type: ControlType.Number,
                title: "Interval (s)",
                defaultValue: 6,
                min: 3,
                max: 20,
                step: 1,
                description: "Slide mode autoplay interval.",
            },
            pauseOnHover: {
                type: ControlType.Boolean,
                title: "Pause Hover",
                defaultValue: true,
                description: "Slide mode only.",
            },
            springStiffness: {
                type: ControlType.Number,
                title: "Stiffness",
                defaultValue: 60,
                min: 30,
                max: 200,
            },
            springDamping: {
                type: ControlType.Number,
                title: "Damping",
                defaultValue: 20,
                min: 10,
                max: 40,
            },
        },
        defaultValue: MOTION_DEFAULTS,
    },
})
