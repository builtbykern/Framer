// @framerDisableUnlink
// @framerSupportedLayoutWidth: any
// @framerSupportedLayoutHeight: auto
// @framerIntrinsicWidth: 420
// @framerIntrinsicHeight: 520

import {
    addPropertyControls,
    ControlType,
    useIsOnFramerCanvas,
} from "framer"
import { motion, useReducedMotion } from "framer-motion"
import type { CSSProperties } from "react"

type LayoutVariant =
    | "featured"
    | "compact"
    | "editorial"
    | "filmstrip"
    | "index"
    | "ref"

type RefScale = "card" | "hero"

interface ImageValue {
    src: string
    alt: string
}

interface Props {
    layout: LayoutVariant
    image: ImageValue
    category: string
    title: string
    date: string
    excerpt: string
    index: string
    href: string
    newTab: boolean
    title1: string
    meta: string
    kicker: string
    scale: RefScale
    style?: CSSProperties
}

function normalizeLayout(layout: string | undefined): LayoutVariant {
    const v = (layout || "featured").toLowerCase()
    if (
        v === "featured" ||
        v === "compact" ||
        v === "editorial" ||
        v === "filmstrip" ||
        v === "index" ||
        v === "ref"
    ) {
        return v
    }
    return "featured"
}

function normalizeScale(scale: string | undefined): RefScale {
    return (scale || "card").toLowerCase() === "hero" ? "hero" : "card"
}

const DEFAULT_IMAGE: ImageValue = {
    src: "https://framerusercontent.com/images/GfGkADagM4KEibNcIiRUWlfrR0.jpg",
    alt: "Journal feature",
}

const CREAM = "rgb(242, 237, 231)"
const INK = "rgb(28, 27, 22)"

function formatMetaLine(
    indexLabel: string,
    date: string,
    category: string
): string {
    const idx = indexLabel.trim() ? `[ ${indexLabel.trim()} ]` : "[ 01 ]"
    const d = date.trim() || "MAR 2026"
    const c = category.trim() || "FIELD NOTES"
    return `${idx} — ${d} — ${c}`
}

function toTitleCase(value: string): string {
    const trimmed = value.trim()
    if (!trimmed) return ""
    return trimmed
        .toLowerCase()
        .replace(/\b[a-z]/g, (char) => char.toUpperCase())
}

function formatRefDate(date: string): string {
    const trimmed = date.trim()
    if (!trimmed) return "01.04.2026"
    if (/^\d{2}\.\d{2}\.\d{4}$/.test(trimmed)) return trimmed

    const dotted = trimmed.match(/^(\d{1,2})[./](\d{1,2})[./](\d{4})$/)
    if (dotted) {
        const day = dotted[1].padStart(2, "0")
        const month = dotted[2].padStart(2, "0")
        return `${day}.${month}.${dotted[3]}`
    }

    const parsed = Date.parse(
        trimmed.replace(/(\d{1,2})\s+([A-Za-z]{3})\s+(\d{4})/, "$1 $2 $3")
    )
    if (!Number.isNaN(parsed)) {
        const d = new Date(parsed)
        const day = String(d.getUTCDate()).padStart(2, "0")
        const month = String(d.getUTCMonth() + 1).padStart(2, "0")
        const year = d.getUTCFullYear()
        return `${day}.${month}.${year}`
    }

    return trimmed
}

function formatRefMeta(category: string, date: string): string {
    const c = toTitleCase(category) || "Case Study"
    const d = formatRefDate(date)
    return `${c} • ${d}`
}

function formatIndexNumber(indexLabel: string): string {
    const trimmed = indexLabel.trim()
    if (!trimmed) return "01"
    return trimmed.padStart(2, "0")
}

export default function Arbour_ArticleCard(props: Partial<Props>) {
    const {
        image = DEFAULT_IMAGE,
        category = "Case Study",
        title = "On proportion, light, and the London row house.",
        date = "12 JUN 2026",
        excerpt = "A short editorial note on reading architecture as a lived surface.",
        index = "01",
        href = "#",
        newTab = false,
        title1 = INK,
        meta = "rgba(28, 27, 22, 0.55)",
        kicker = "rgb(84, 98, 45)",
        style,
    } = props

    const layout = normalizeLayout(props.layout)
    const scale = normalizeScale(props.scale)
    const inkColor = title1
    const metaColor = meta
    const accentColor = kicker
    const indexLabel = index

    const isCanvas = useIsOnFramerCanvas()
    const prefersReduced = useReducedMotion()
    const shouldAnimate = !isCanvas && !prefersReduced

    const isEditorial = layout === "editorial"
    const isFeatured = layout === "featured"
    const isFeaturedHero = isFeatured && scale === "hero"
    const isHero = isFeatured || isEditorial
    const isFilmstrip = layout === "filmstrip"
    const isCompact = layout === "compact"
    const isIndex = layout === "index"
    const isRef = layout === "ref"
    const isRefHero = isRef && scale === "hero"

    const rootStyle: CSSProperties = {
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: isIndex
            ? "row"
            : isCompact
              ? "row"
              : "column",
        gap: isRef
            ? isRefHero
                ? 20
                : 16
            : isCompact
              ? 16
              : isFilmstrip
                ? 0
                : isIndex
                  ? 32
                  : isEditorial
                    ? 32
                    : isHero
                      ? 28
                      : 24,
        alignItems: isIndex ? "flex-start" : isCompact ? "flex-start" : "stretch",
        textDecoration: "none",
        color: "inherit",
        padding: isIndex ? "32px 0" : undefined,
        borderBottom: isIndex ? "1px solid rgba(28, 27, 22, 0.1)" : undefined,
        ...style,
    }

    const imageWrapStyle: CSSProperties = {
        position: "relative",
        overflow: "hidden",
        flex: isCompact ? "0 0 120px" : isIndex ? "0 0 0" : "0 0 auto",
        width: isCompact ? 120 : isIndex ? 0 : "100%",
        display: isIndex ? "none" : "block",
        aspectRatio: isRef
            ? "4 / 3"
            : isFilmstrip
              ? "4 / 3"
              : isFeaturedHero
                ? "21 / 9"
                : isEditorial
                  ? "21 / 10"
                  : isHero
                    ? "16 / 10"
                    : isCompact
                      ? "1 / 1"
                      : "4 / 3",
        borderRadius: isRef ? 12 : 0,
        backgroundColor: "rgba(28, 27, 22, 0.06)",
    }

    const imageStyle: CSSProperties = {
        width: "100%",
        height: "100%",
        objectFit: "cover",
        display: "block",
    }

    const gradientStyle: CSSProperties = {
        position: "absolute",
        inset: 0,
        background: isFeaturedHero
            ? "linear-gradient(180deg, rgba(10, 22, 15, 0.05) 0%, rgba(10, 22, 15, 0.15) 45%, rgba(21, 43, 30, 0.72) 100%)"
            : "linear-gradient(180deg, rgba(10, 22, 15, 0) 50%, rgba(10, 22, 15, 0.28) 100%)",
        pointerEvents: "none",
    }

    const overlayBodyStyle: CSSProperties = {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        display: "flex",
        flexDirection: "column",
        gap: 12,
        padding: "clamp(24px, 4vw, 48px)",
        zIndex: 1,
    }

    const bodyStyle: CSSProperties = {
        display: "flex",
        flexDirection: "column",
        gap: isRef
            ? isRefHero
                ? 10
                : 8
            : isEditorial
              ? 16
              : isIndex
                ? 10
                : 10,
        flex: "1 1 auto",
        minWidth: 0,
        paddingTop: isFilmstrip ? 14 : isIndex ? 2 : 0,
    }

    const indexNumberStyle: CSSProperties = {
        margin: 0,
        flex: "0 0 auto",
        minWidth: "clamp(56px, 8vw, 88px)",
        fontFamily: '"Fraunces", Georgia, serif',
        fontSize: "clamp(48px, 6vw, 80px)",
        fontWeight: 400,
        lineHeight: 0.9,
        letterSpacing: "-0.04em",
        color: "rgba(84, 98, 45, 0.35)",
    }

    const refTitleStyle: CSSProperties = {
        margin: 0,
        fontFamily:
            '"Inter", "SF Pro Display", "Helvetica Neue", Arial, sans-serif',
        fontSize: isRefHero
            ? "clamp(36px, 4.8vw, 56px)"
            : "clamp(20px, 1.6vw, 24px)",
        fontWeight: 700,
        lineHeight: 1.12,
        letterSpacing: "-0.03em",
        color: inkColor,
    }

    const refMetaStyle: CSSProperties = {
        margin: 0,
        fontFamily:
            '"Inter", "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
        fontSize: isRefHero ? 15 : 13,
        fontWeight: 400,
        lineHeight: 1.45,
        letterSpacing: "0.01em",
        color: metaColor,
    }

    const metaLineStyle: CSSProperties = {
        margin: 0,
        fontFamily: '"Space Mono", monospace',
        fontSize: 10,
        fontWeight: 400,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        color: isFeaturedHero ? CREAM : inkColor,
    }

    const metaStyle: CSSProperties = {
        margin: 0,
        fontFamily: '"Space Mono", monospace',
        fontSize: 10,
        fontWeight: 400,
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        color: accentColor,
    }

    const titleStyle: CSSProperties = {
        margin: 0,
        fontFamily: '"Fraunces", Georgia, serif',
        fontSize: isFeaturedHero
            ? "clamp(32px, 4.5vw, 64px)"
            : isEditorial
              ? "clamp(32px, 4.2vw, 56px)"
              : isFilmstrip
                ? 18
                : isIndex
                  ? "clamp(22px, 2.4vw, 32px)"
                  : isCompact
                    ? 20
                    : "clamp(24px, 2.4vw, 34px)",
        fontWeight: 400,
        lineHeight: isEditorial || isFeaturedHero ? 1.04 : 1.1,
        letterSpacing: isEditorial || isFeaturedHero ? "-0.035em" : "-0.025em",
        color: isFeaturedHero ? CREAM : inkColor,
        maxWidth: isFeaturedHero ? 720 : undefined,
    }

    const excerptStyle: CSSProperties = {
        margin: 0,
        fontFamily: '"Inter", "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
        fontSize: isFeaturedHero ? 16 : isEditorial ? 16 : 14,
        fontWeight: 400,
        lineHeight: 1.55,
        color: isFeaturedHero ? "rgba(242, 237, 231, 0.82)" : metaColor,
        maxWidth: isEditorial || isFeaturedHero ? 560 : isIndex ? 520 : undefined,
    }

    const dateStyle: CSSProperties = {
        margin: 0,
        fontFamily: '"Space Mono", monospace',
        fontSize: 10,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        color: metaColor,
    }

    const imageBlock = !isIndex ? (
        <div style={imageWrapStyle}>
            {image?.src ? (
                <motion.img
                    src={image.src}
                    alt={image.alt || title}
                    style={imageStyle}
                    whileHover={shouldAnimate ? { scale: 1.03 } : undefined}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                />
            ) : null}
            <div style={gradientStyle} />
            {isFeaturedHero ? (
                <div style={overlayBodyStyle}>
                    <p style={metaLineStyle}>
                        {formatMetaLine(indexLabel, date, category)}
                    </p>
                    <h3 style={titleStyle}>{title}</h3>
                    {excerpt ? <p style={excerptStyle}>{excerpt}</p> : null}
                </div>
            ) : null}
        </div>
    ) : null

    const textBlock = isRef ? (
        <div style={bodyStyle}>
            <h3 style={refTitleStyle}>{title}</h3>
            <p style={refMetaStyle}>{formatRefMeta(category, date)}</p>
        </div>
    ) : isFilmstrip ? (
        <div style={bodyStyle}>
            <p style={metaStyle}>{category}</p>
            <h3 style={titleStyle}>{title}</h3>
        </div>
    ) : isIndex ? (
        <>
            <p style={indexNumberStyle} aria-hidden="true">
                {formatIndexNumber(indexLabel)}
            </p>
            <div style={bodyStyle}>
                <p style={metaLineStyle}>
                    {formatMetaLine(indexLabel, date, category)}
                </p>
                <h3 style={titleStyle}>{title}</h3>
                {excerpt ? <p style={excerptStyle}>{excerpt}</p> : null}
            </div>
        </>
    ) : (
        <div style={bodyStyle}>
            {isEditorial ? (
                <>
                    <p style={metaLineStyle}>
                        {formatMetaLine(indexLabel, date, category)}
                    </p>
                    <h3 style={titleStyle}>{title}</h3>
                    {excerpt ? <p style={excerptStyle}>{excerpt}</p> : null}
                </>
            ) : (
                <>
                    <p style={metaStyle}>{category}</p>
                    <h3 style={titleStyle}>{title}</h3>
                    {isFeatured && excerpt ? (
                        <p style={excerptStyle}>{excerpt}</p>
                    ) : null}
                    <p style={dateStyle}>{date}</p>
                </>
            )}
        </div>
    )

    return (
        <motion.a
            href={href}
            target={newTab ? "_blank" : undefined}
            rel={newTab ? "noopener noreferrer" : undefined}
            style={rootStyle}
            whileHover={
                shouldAnimate
                    ? isIndex
                        ? { x: 4 }
                        : { y: -2 }
                    : undefined
            }
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
        >
            {imageBlock}
            {isFeaturedHero ? null : textBlock}
        </motion.a>
    )
}

Arbour_ArticleCard.displayName = "Arbour_ArticleCard"

addPropertyControls(Arbour_ArticleCard, {
    layout: {
        type: ControlType.Enum,
        title: "Layout",
        options: ["ref", "editorial", "featured", "index", "compact", "filmstrip"],
        optionTitles: [
            "Ref",
            "Editorial",
            "Featured",
            "Index",
            "Compact",
            "Filmstrip",
        ],
        defaultValue: "ref",
    },
    image: {
        type: ControlType.ResponsiveImage,
        title: "Image",
    },
    category: {
        type: ControlType.String,
        title: "Category",
        defaultValue: "Case Study",
    },
    title: {
        type: ControlType.String,
        title: "Title",
        defaultValue: "On proportion, light, and the London row house.",
        displayTextArea: true,
    },
    date: {
        type: ControlType.String,
        title: "Date",
        defaultValue: "12 JUN 2026",
    },
    excerpt: {
        type: ControlType.String,
        title: "Excerpt",
        defaultValue:
            "A short editorial note on reading architecture as a lived surface.",
        displayTextArea: true,
        hidden: (p: Partial<Props>) => {
            const l = normalizeLayout(p.layout)
            return l === "compact" || l === "filmstrip" || l === "ref"
        },
    },
    scale: {
        type: ControlType.Enum,
        title: "Scale",
        options: ["card", "hero"],
        optionTitles: ["Card", "Hero"],
        defaultValue: "card",
        hidden: (p: Partial<Props>) => {
            const l = normalizeLayout(p.layout)
            return l !== "ref" && l !== "featured"
        },
    },
    index: {
        type: ControlType.String,
        title: "Index",
        defaultValue: "01",
        hidden: (p: Partial<Props>) => {
            const l = normalizeLayout(p.layout)
            return l !== "editorial" && l !== "index" && l !== "featured"
        },
    },
    href: {
        type: ControlType.Link,
        title: "Link",
    },
    newTab: {
        type: ControlType.Boolean,
        title: "New Tab",
        defaultValue: false,
    },
    title1: {
        type: ControlType.Color,
        title: "Title",
        defaultValue: INK,
    },
    meta: {
        type: ControlType.Color,
        title: "Meta",
        defaultValue: "rgba(28, 27, 22, 0.55)",
    },
    kicker: {
        type: ControlType.Color,
        title: "Kicker",
        defaultValue: "rgb(84, 98, 45)",
    },
})
