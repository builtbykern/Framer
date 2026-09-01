import {
    addPropertyControls,
    ControlType,
    useIsOnFramerCanvas,
    useIsStaticRenderer,
} from "framer"
import { motion, useReducedMotion } from "framer-motion"
import {
    type CSSProperties,
    type ReactNode,
    useLayoutEffect,
    useRef,
    useState,
} from "react"

interface ResponsiveImage {
    src?: string
    srcSet?: string
    alt?: string
    url?: string
    thumbnailUrl?: string
    altText?: string
}

type LayoutMode = "stack" | "grid"

interface StillEntry {
    image?: ResponsiveImage | string | null
}

type StillItem =
    | StillEntry
    | ResponsiveImage
    | string
    | null
    | undefined

interface SeriesStillsProps {
    images?: Array<StillItem> | { items?: Array<StillItem> }
    cover?: ResponsiveImage | string | null
    desktop?: LayoutMode
    tablet?: LayoutMode
    phone?: LayoutMode
    layout?: LayoutMode
    layoutTablet?: LayoutMode
    layoutPhone?: LayoutMode
    gap: number
    maxImages?: number
    max?: number | string
    showIndex?: boolean
    index?: boolean
    indexFont: CSSProperties
    indexColor: string
    style?: CSSProperties
}

const PHONE_MAX = 390
const TABLET_MAX = 810

function coerceLayout(value: unknown, fallback: LayoutMode): LayoutMode {
    if (value === "grid" || value === "Grid") return "grid"
    if (value === "stack" || value === "Stack") return "stack"
    return fallback
}

function layoutForWidth(
    width: number,
    desktop: LayoutMode,
    tablet: LayoutMode,
    phone: LayoutMode
): LayoutMode {
    if (width <= PHONE_MAX) return phone
    if (width <= TABLET_MAX) return tablet
    return desktop
}

function allGrid(props: {
    desktop?: unknown
    tablet?: unknown
    phone?: unknown
    layout?: unknown
    layoutTablet?: unknown
    layoutPhone?: unknown
}): boolean {
    return (
        coerceLayout(props.desktop ?? props.layout, "stack") === "grid" &&
        coerceLayout(props.tablet ?? props.layoutTablet, "stack") === "grid" &&
        coerceLayout(props.phone ?? props.layoutPhone, "stack") === "grid"
    )
}

function useActiveLayoutWidth(ref: { current: HTMLElement | null }) {
    const [width, setWidth] = useState(1200)
    useLayoutEffect(() => {
        if (typeof window === "undefined") return
        const apply = () => {
            const node = ref.current
            const parent = node?.parentElement
            const next = Math.max(
                node?.offsetWidth ?? 0,
                node?.clientWidth ?? 0,
                node?.getBoundingClientRect().width ?? 0,
                parent?.clientWidth ?? 0,
                0
            )
            if (next > 0) setWidth(next)
        }
        apply()
        window.addEventListener("resize", apply)
        const node = ref.current
        const observer =
            node && typeof ResizeObserver !== "undefined"
                ? new ResizeObserver(apply)
                : null
        if (node && observer) observer.observe(node)
        return () => {
            window.removeEventListener("resize", apply)
            observer?.disconnect()
        }
    }, [])
    return width
}

function unwrapImages(
    images: SeriesStillsProps["images"]
): Array<StillItem> {
    if (!images) return []
    if (Array.isArray(images)) return images
    if (Array.isArray(images.items)) return images.items
    return []
}

function cmsImageFromFieldData(
    fieldData: Record<string, unknown> | undefined
): ResponsiveImage | string | null {
    if (!fieldData) return null
    for (const value of Object.values(fieldData)) {
        if (!value || typeof value !== "object") continue
        const record = value as {
            type?: string
            value?: ResponsiveImage | string
            url?: string
            src?: string
        }
        if (record.type === "image" && record.value) {
            return record.value
        }
        if (record.url || record.src) {
            return record as ResponsiveImage
        }
    }
    return null
}

function resolveAsset(
    asset: ResponsiveImage | string | null | undefined
): { src: string; srcSet?: string; alt: string } | null {
    if (!asset) return null
    if (typeof asset === "string") {
        return asset ? { src: asset, alt: "" } : null
    }
    const wrapped = asset as ResponsiveImage & {
        type?: string
        value?: ResponsiveImage | string
    }
    if (wrapped.type === "image" && wrapped.value) {
        return resolveAsset(wrapped.value)
    }
    const src = asset.src || asset.url || asset.thumbnailUrl
    if (!src) return null
    return {
        src,
        srcSet: asset.srcSet,
        alt: asset.alt || asset.altText || "",
    }
}

function resolveImage(item: StillItem): { src: string; srcSet?: string; alt: string } | null {
    if (!item) return null
    if (typeof item === "string") return resolveAsset(item)
    const entry = item as StillEntry &
        ResponsiveImage & {
            fieldData?: Record<string, unknown>
            value?: ResponsiveImage | string
        }
    if (entry.image !== undefined) return resolveAsset(entry.image)
    if (entry.value && typeof entry.value === "object") {
        const nested = resolveAsset(entry.value)
        if (nested) return nested
    }
    const fromFields = cmsImageFromFieldData(entry.fieldData)
    if (fromFields) return resolveAsset(fromFields)
    return resolveAsset(entry)
}

function isCssPaintSrc(src: string): boolean {
    return src.startsWith("var(") || src.startsWith("url(")
}

function isHttpSrc(src: string): boolean {
    return /^(https?:|data:|blob:)/i.test(src)
}

function capStills(maxImages: unknown, maxCtrl: unknown): number {
    const raw = maxImages ?? maxCtrl
    const cap = typeof raw === "number" ? raw : Number(raw)
    if (!Number.isFinite(cap) || cap <= 0) return 0
    return Math.floor(cap)
}

const CANVAS_STILLS: Array<{ src: string; alt: string }> = [
    {
        src: "https://framerusercontent.com/images/1X1RDsclDfmtF1YYCLMRvrS2zc.jpg",
        alt: "Salt on the cliff",
    },
    {
        src: "https://framerusercontent.com/images/mge10rQn0Y74TITWDFPTE3rvk38.jpg",
        alt: "Rusted rail",
    },
    {
        src: "https://framerusercontent.com/images/g0b9SJ6KkkJMHc1mShP4nvRmI.jpg",
        alt: "Water after the lamps",
    },
    {
        src: "https://framerusercontent.com/images/2Qyl9G77xnlCo5jlCSS9oFI6CDg.jpg",
        alt: "Wave on the wall",
    },
]

function StillMedia({
    image,
    isGrid,
    preferPaint,
}: {
    image: { src: string; srcSet?: string; alt: string }
    isGrid: boolean
    preferPaint?: boolean
}) {
    const box: CSSProperties = {
        display: "block",
        width: "100%",
        height: "100%",
        minHeight: isGrid ? 0 : undefined,
        objectFit: "cover",
        objectPosition: "center",
        pointerEvents: "none",
        ...(isGrid
            ? {}
            : {
                  position: "absolute",
                  inset: 0,
              }),
    }
    const paint =
        preferPaint || isCssPaintSrc(image.src) || !isHttpSrc(image.src)
    if (paint) {
        const backgroundImage = isCssPaintSrc(image.src)
            ? image.src
            : isHttpSrc(image.src)
              ? `url("${image.src.replace(/"/g, "%22")}")`
              : undefined
        return (
            <div
                data-still-paint=""
                role="img"
                aria-label={image.alt || "Still"}
                style={{
                    ...box,
                    backgroundImage,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                }}
            />
        )
    }
    return (
        <img
            src={image.src}
            srcSet={image.srcSet}
            alt={image.alt}
            style={box}
        />
    )
}

type PrintAlign = "stretch" | "flex-start" | "flex-end"

interface StackPrint {
    width: string
    alignSelf: PrintAlign
}

const STACK_PRINTS: readonly StackPrint[] = [
    { width: "90%", alignSelf: "flex-end" },
    { width: "100%", alignSelf: "stretch" },
    { width: "88%", alignSelf: "flex-start" },
    { width: "94%", alignSelf: "flex-end" },
]

const COLLECTION_PRINTS: readonly StackPrint[] = [
    { width: "100%", alignSelf: "flex-start" },
    { width: "92%", alignSelf: "flex-start" },
    { width: "96%", alignSelf: "flex-start" },
    { width: "90%", alignSelf: "flex-start" },
]

const FULL_PRINT: StackPrint = { width: "100%", alignSelf: "stretch" }

function stackPrint(
    index: number,
    mixed: boolean,
    prints: readonly StackPrint[] = STACK_PRINTS
): StackPrint {
    if (!mixed) return FULL_PRINT
    return prints[index % prints.length]
}

function printFlush(align: PrintAlign): {
    marginLeft: number | string
    marginRight: number | string
} {
    switch (align) {
        case "flex-end":
            return { marginLeft: "auto", marginRight: 0 }
        case "flex-start":
            return { marginLeft: 0, marginRight: "auto" }
        case "stretch":
            return { marginLeft: 0, marginRight: 0 }
        default: {
            const _never: never = align
            throw new Error(`unknown print align: ${String(_never)}`)
        }
    }
}

function captionAlign(alignSelf: PrintAlign): "left" | "right" {
    switch (alignSelf) {
        case "flex-end":
            return "right"
        case "flex-start":
        case "stretch":
            return "left"
        default: {
            const _never: never = alignSelf
            return _never
        }
    }
}

function padIndex(index: number): string {
    const n = Number.isFinite(index) ? Math.max(0, Math.floor(index)) + 1 : 1
    return String(n).padStart(2, "0")
}

const VEIL_EASE = [0.5, 0, 0.5, 1] as const
const VEIL_DURATION = 0.49
const VEIL_Y = 48
const VEIL_BLUR = "blur(12px)"

/**
 * Series Stills
 *
 * @framerSupportedLayoutWidth any-prefer-fixed
 * @framerSupportedLayoutHeight any-prefer-fixed
 */
export default function SeriesStills(props: SeriesStillsProps) {
    const {
        images: imagesCtrl = [],
        cover,
        desktop,
        tablet,
        phone,
        layout = "stack",
        layoutTablet,
        layoutPhone,
        gap = 28,
        maxImages = 0,
        max: maxCtrl,
        showIndex = true,
        index: indexCtrl,
        indexFont,
        indexColor = "rgb(107, 107, 107)",
        style,
    } = props

    const rootRef = useRef<HTMLElement>(null)
    const width = useActiveLayoutWidth(rootRef)
    const desktopLayout = coerceLayout(desktop ?? layout, "stack")
    const tabletLayout = coerceLayout(tablet ?? layoutTablet, desktopLayout)
    const phoneLayout = coerceLayout(phone ?? layoutPhone, desktopLayout)
    const indexOn = indexCtrl ?? showIndex
    const isStatic = useIsStaticRenderer()
    const onCanvas = useIsOnFramerCanvas()
    const reducedMotion = useReducedMotion()
    const freeze = Boolean(isStatic)
    const reduceMove = Boolean(reducedMotion) && !freeze
    const [inCollection, setInCollection] = useState(false)
    const stacked = inCollection || freeze
    const activeLayout = stacked
        ? "stack"
        : layoutForWidth(width, desktopLayout, tabletLayout, phoneLayout)

    useLayoutEffect(() => {
        const node = rootRef.current
        const next = Boolean(
            node?.closest('[data-driftplane-mode="collection"]')
        )
        setInCollection((prev) => (prev === next ? prev : next))
    })
    const resolved = unwrapImages(imagesCtrl)
        .map(resolveImage)
        .filter(Boolean) as Array<{
        src: string
        srcSet?: string
        alt: string
    }>
    const cap = capStills(maxImages, maxCtrl)
    const gallery = cap > 0 ? resolved.slice(0, cap) : resolved
    const coverImage = resolveAsset(cover ?? null)
    const lookbookOnCanvas = Boolean(onCanvas) && cap === 0
    const stills =
        gallery.length > 0
            ? gallery
            : lookbookOnCanvas
              ? CANVAS_STILLS
              : coverImage
                ? [coverImage]
                : onCanvas || freeze
                  ? CANVAS_STILLS
                  : []
    const isGrid = activeLayout === "grid"
    const hostFrozen = freeze || inCollection

    return (
        <section
            ref={rootRef}
            style={{
                position: "relative",
                width: "100%",
                height: isGrid ? "100%" : "auto",
                display: isGrid ? "grid" : "flex",
                flexDirection: isGrid ? undefined : "column",
                gridTemplateColumns: isGrid ? "1fr 1fr" : undefined,
                gap,
                margin: 0,
                padding: 0,
                ...style,
            }}
            aria-label="Series stills"
        >
            {stills.map((image, index) => {
                const coverFallback =
                    gallery.length === 0 &&
                    Boolean(coverImage) &&
                    !lookbookOnCanvas
                const isCover = coverFallback && index === 0
                const print = isGrid
                    ? FULL_PRINT
                    : stacked
                      ? stackPrint(index, true, COLLECTION_PRINTS)
                      : isCover
                        ? FULL_PRINT
                        : stackPrint(index, true)
                const galleryIndex = index
                const media: ReactNode = (
                        <StillMedia
                        image={image}
                        isGrid={isGrid}
                        preferPaint={
                            !isHttpSrc(image.src) &&
                            (inCollection || freeze || isCssPaintSrc(image.src))
                        }
                    />
                )
                return (
                    <div
                        key={`${image.src}-${index}`}
                        style={{
                            width: "100%",
                            height: isGrid ? "100%" : "auto",
                            minHeight: isGrid ? 0 : undefined,
                            display: isGrid ? undefined : "flex",
                            flexDirection: isGrid ? undefined : "column",
                        }}
                    >
                        <figure
                            style={{
                                marginTop: 0,
                                marginBottom: 0,
                                padding: 0,
                                width: print.width,
                                alignSelf: print.alignSelf,
                                ...printFlush(print.alignSelf),
                                height: isGrid ? "100%" : "auto",
                                minHeight: isGrid ? 0 : undefined,
                                aspectRatio: isGrid ? "1 / 1" : undefined,
                                overflow: isGrid ? "hidden" : "visible",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "flex-start",
                                gap: indexOn && !isGrid ? 8 : 0,
                                flexShrink: 0,
                            }}
                        >
                            <motion.div
                                style={{
                                    width: "100%",
                                    height: isGrid ? "100%" : "auto",
                                    aspectRatio: isGrid ? undefined : "3 / 2",
                                    overflow: "hidden",
                                    position: "relative",
                                    flex: isGrid ? 1 : undefined,
                                    flexShrink: 0,
                                }}
                                initial={
                                    hostFrozen
                                        ? false
                                        : reduceMove
                                          ? { opacity: 0 }
                                          : {
                                                opacity: 0,
                                                y: VEIL_Y,
                                                filter: VEIL_BLUR,
                                            }
                                }
                                animate={
                                    hostFrozen
                                        ? {
                                              opacity: 1,
                                              y: 0,
                                              filter: "blur(0px)",
                                          }
                                        : undefined
                                }
                                whileInView={
                                    hostFrozen
                                        ? undefined
                                        : reduceMove
                                          ? { opacity: 1 }
                                          : {
                                                opacity: 1,
                                                y: 0,
                                                filter: "blur(0px)",
                                            }
                                }
                                viewport={{ once: true, amount: 0.18 }}
                                transition={
                                    hostFrozen
                                        ? { duration: 0 }
                                        : {
                                              duration: VEIL_DURATION,
                                              ease: VEIL_EASE,
                                              delay: index * 0.07,
                                          }
                                }
                            >
                                {media}
                            </motion.div>
                            {indexOn && !isGrid ? (
                                <figcaption
                                    style={{
                                        margin: 0,
                                        color: indexColor,
                                        textTransform: "uppercase",
                                        ...indexFont,
                                        fontVariantNumeric: "tabular-nums",
                                        textAlign: captionAlign(print.alignSelf),
                                        flexShrink: 0,
                                    }}
                                >
                                    {image.alt
                                        ? `${padIndex(galleryIndex)}  ·  ${image.alt}`
                                        : padIndex(galleryIndex)}
                                </figcaption>
                            ) : null}
                        </figure>
                    </div>
                )
            })}
        </section>
    )
}

SeriesStills.displayName = "Series Stills"

SeriesStills.defaultProps = {
    gap: 28,
    maxImages: 0,
    showIndex: true,
    indexColor: "rgb(107, 107, 107)",
}

addPropertyControls(SeriesStills, {
    images: {
        type: ControlType.Array,
        title: "Images",
        description: "Bind Work → Gallery. Same bind on every breakpoint.",
        control: {
            type: ControlType.Object,
            title: "Still",
            controls: {
                image: {
                    type: ControlType.ResponsiveImage,
                    title: "Image",
                },
            },
        },
        defaultValue: CANVAS_STILLS.map((image) => ({ image })),
    },
    cover: {
        type: ControlType.ResponsiveImage,
        title: "Cover",
        description: "Work detail plate. Leave empty on Home.",
    },
    desktop: {
        type: ControlType.Enum,
        title: "Desktop",
        description: "Stack or Grid above 810px.",
        options: ["stack", "grid"],
        optionTitles: ["Stack", "Grid"],
        defaultValue: "stack",
        displaySegmentedControl: true,
    },
    tablet: {
        type: ControlType.Enum,
        title: "Tablet",
        description: "Stack or Grid from 391px to 810px.",
        options: ["stack", "grid"],
        optionTitles: ["Stack", "Grid"],
        defaultValue: "stack",
        displaySegmentedControl: true,
    },
    phone: {
        type: ControlType.Enum,
        title: "Phone",
        description: "Stack or Grid at 390px and below. Change this on the Phone breakpoint.",
        options: ["stack", "grid"],
        optionTitles: ["Stack", "Grid"],
        defaultValue: "stack",
        displaySegmentedControl: true,
    },
    gap: {
        type: ControlType.Number,
        title: "Gap",
        defaultValue: 28,
        min: 0,
        max: 80,
        step: 2,
        unit: "px",
    },
    maxImages: {
        type: ControlType.Number,
        title: "Max",
        defaultValue: 0,
        min: 0,
        max: 24,
        step: 1,
        displayStepper: true,
        description: "0 = all. Home journal: 3.",
    },
    showIndex: {
        type: ControlType.Boolean,
        title: "Index",
        defaultValue: true,
        enabledTitle: "On",
        disabledTitle: "Off",
        hidden: (props) => allGrid(props),
    },
    indexFont: {
        type: ControlType.Font,
        title: "Index Font",
        controls: "extended",
        defaultFontType: "monospace",
        defaultValue: {
            fontSize: "11px",
            letterSpacing: "0.14em",
            lineHeight: "1.2em",
        },
        hidden: (props) =>
            props.showIndex === false || props.index === false || allGrid(props),
    },
    indexColor: {
        type: ControlType.Color,
        title: "Index Color",
        defaultValue: "rgb(107, 107, 107)",
        hidden: (props) =>
            props.showIndex === false || props.index === false || allGrid(props),
    },
})
