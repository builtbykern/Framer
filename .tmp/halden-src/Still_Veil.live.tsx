import {
    addPropertyControls,
    ControlType,
    useIsStaticRenderer,
} from "framer"
import { useReducedMotion } from "framer-motion"
import {
    startTransition,
    useCallback,
    useEffect,
    useRef,
    useState,
    type CSSProperties,
} from "react"

interface ResponsiveImage {
    src?: string
    srcSet?: string
    alt?: string
    url?: string
    thumbnailUrl?: string
    altText?: string
}

interface StillEntry {
    image?: ResponsiveImage | string | null
}

type StillItem =
    | StillEntry
    | ResponsiveImage
    | string
    | null
    | undefined

type VeilPhase = "hidden" | "covering" | "covered" | "revealing"

interface StillVeilProps {
    stills?: Array<StillItem> | { items?: Array<StillItem> }
    images?: Array<StillItem> | { items?: Array<StillItem> }
    image1?: ResponsiveImage | string | null
    image2?: ResponsiveImage | string | null
    image3?: ResponsiveImage | string | null
    image4?: ResponsiveImage | string | null
    paper?: string
    blur?: number
    delay?: number
    duration?: number
    hold?: number
    preview?: boolean
    style?: CSSProperties
}

const EASE = "cubic-bezier(0.5, 0, 0.5, 1)"
const PAPER = "#F6F3EE"
const BLUR_MAX = 20

function clampBlur(value: number): number {
    if (!Number.isFinite(value)) return 12
    return Math.min(BLUR_MAX, Math.max(0, value))
}

function prefersReducedMotion(): boolean {
    if (typeof window === "undefined") return false
    if (typeof window.matchMedia !== "function") return false
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

function unwrapImages(
    images: StillVeilProps["images"]
): Array<StillItem> {
    if (!images) return []
    if (Array.isArray(images)) return images
    if (Array.isArray(images.items)) return images.items
    return []
}

function resolveAsset(
    asset: ResponsiveImage | string | null | undefined
): { src: string; srcSet?: string; alt: string } | null {
    if (!asset) return null
    if (typeof asset === "string") {
        return asset ? { src: asset, alt: "" } : null
    }
    const src = asset.src || asset.url || asset.thumbnailUrl
    if (!src) return null
    return {
        src,
        srcSet: asset.srcSet,
        alt: asset.alt || asset.altText || "",
    }
}

function resolveImage(
    item: StillItem
): { src: string; srcSet?: string; alt: string } | null {
    if (!item) return null
    if (typeof item === "string") return resolveAsset(item)
    const entry = item as StillEntry & ResponsiveImage
    if (entry.image !== undefined) return resolveAsset(entry.image)
    return resolveAsset(entry)
}

const FALLBACK_STILLS: Array<{ src: string; alt: string }> = [
    {
        src: "https://framerusercontent.com/images/BIXGLiFvScaLnmbWFITSSiRpb0I.jpg",
        alt: "Empty frame, scan error in the mount",
    },
    {
        src: "https://framerusercontent.com/images/ODb8KGvC5gJi7sn0FM05vyXGik.jpg",
        alt: "Empty frame, white scan streaks",
    },
    {
        src: "https://framerusercontent.com/images/Jtx04UEmf4oYBm7NKyYTVe9q4.jpg",
        alt: "Empty frame, analog scan bands",
    },
    {
        src: "https://framerusercontent.com/images/IIhS6srvBQ6gOUxE5DLrTgQSha0.jpg",
        alt: "Empty frame, failed still",
    },
]

function exhaustive(_phase: never): void {}

/**
 * @framerSupportedLayoutWidth any-prefer-fixed
 * @framerSupportedLayoutHeight any-prefer-fixed
 */
export default function StillVeil(props: StillVeilProps) {
    const paperColor = props.paper || PAPER
    const blurAmount = clampBlur(props.blur ?? 16)
    const delay = Math.max(0, props.delay ?? 20)
    const duration = Math.max(0, props.duration ?? 120)
    const hold = Math.max(400, props.hold ?? 900)
    const isStatic = useIsStaticRenderer()
    const reduceMotion = Boolean(useReducedMotion())

    const slotted = [props.image1, props.image2, props.image3, props.image4]
        .map(resolveAsset)
        .filter((item): item is { src: string; srcSet?: string; alt: string } =>
            Boolean(item)
        )
    const fromControls = unwrapImages(props.stills || props.images)
        .map(resolveImage)
        .filter((item): item is { src: string; srcSet?: string; alt: string } =>
            Boolean(item)
        )
    const stills =
        slotted.length > 0
            ? slotted
            : fromControls.length > 0
              ? fromControls
              : FALLBACK_STILLS

    const reducedRef = useRef(isStatic || reduceMotion || prefersReducedMotion())
    const [index, setIndex] = useState(0)
    const [phase, setPhase] = useState<VeilPhase>("hidden")
    const coveringRef = useRef(false)
    const holdTimerRef = useRef<number | null>(null)
    const delayTimerRef = useRef<number | null>(null)
    const doneTimerRef = useRef<number | null>(null)
    const rafRef = useRef<number | null>(null)

    const count = stills.length
    const safeIndex = count === 0 ? 0 : index % count
    const current = count === 0 ? null : stills[safeIndex]

    const clearTimers = useCallback(() => {
        if (typeof window === "undefined") return
        if (holdTimerRef.current !== null) {
            window.clearTimeout(holdTimerRef.current)
            holdTimerRef.current = null
        }
        if (delayTimerRef.current !== null) {
            window.clearTimeout(delayTimerRef.current)
            delayTimerRef.current = null
        }
        if (doneTimerRef.current !== null) {
            window.clearTimeout(doneTimerRef.current)
            doneTimerRef.current = null
        }
        if (rafRef.current !== null) {
            window.cancelAnimationFrame(rafRef.current)
            rafRef.current = null
        }
    }, [])

    useEffect(() => {
        if (typeof window === "undefined") return
        const media = window.matchMedia("(prefers-reduced-motion: reduce)")
        const syncReduced = () => {
            reducedRef.current = isStatic || reduceMotion || media.matches
            if (reducedRef.current) {
                coveringRef.current = false
                startTransition(() => setPhase("hidden"))
            }
        }
        syncReduced()
        if (typeof media.addEventListener === "function") {
            media.addEventListener("change", syncReduced)
        } else {
            media.addListener(syncReduced)
        }
        return () => {
            if (typeof media.removeEventListener === "function") {
                media.removeEventListener("change", syncReduced)
            } else {
                media.removeListener(syncReduced)
            }
        }
    }, [isStatic, reduceMotion])

    useEffect(() => {
        if (isStatic) return
        if (typeof window === "undefined") return
        if (count < 2) return
        if (reducedRef.current) return

        const armHold = () => {
            clearTimers()
            holdTimerRef.current = window.setTimeout(() => {
                coveringRef.current = true
                startTransition(() => setPhase("covering"))
                rafRef.current = window.requestAnimationFrame(() => {
                    rafRef.current = window.requestAnimationFrame(() => {
                        startTransition(() => setPhase("covered"))
                    })
                })
                delayTimerRef.current = window.setTimeout(() => {
                    startTransition(() =>
                        setIndex((prev) => (prev + 1) % count)
                    )
                }, duration)
                doneTimerRef.current = window.setTimeout(() => {
                    coveringRef.current = false
                    startTransition(() => setPhase("revealing"))
                    holdTimerRef.current = window.setTimeout(() => {
                        startTransition(() => setPhase("hidden"))
                        armHold()
                    }, duration)
                }, duration + delay)
            }, hold)
        }

        armHold()
        return () => {
            clearTimers()
        }
    }, [clearTimers, count, delay, duration, hold, isStatic])

    const animating =
        phase === "revealing" || (phase === "covered" && coveringRef.current)

    let blurPx = 0
    switch (phase) {
        case "hidden":
            blurPx = 0
            break
        case "covering":
            blurPx = 0
            break
        case "covered":
            blurPx = blurAmount
            break
        case "revealing":
            blurPx = 0
            break
        default:
            exhaustive(phase)
    }

    return (
        <div
            style={{
                position: "relative",
                width: "100%",
                height: "100%",
                overflow: "hidden",
                backgroundColor: paperColor,
                ...props.style,
            }}
        >
            {current ? (
                <img
                    src={current.src}
                    alt={current.alt || "Missing still"}
                    style={{
                        position: "absolute",
                        inset: 0,
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        objectPosition: "center",
                        display: "block",
                        pointerEvents: "none",
                        filter: `blur(${blurPx}px)`,
                        transform: "translateZ(0)",
                        transition: animating
                            ? `filter ${duration}ms ${EASE}`
                            : "none",
                    }}
                />
            ) : null}
        </div>
    )
}

StillVeil.displayName = "Still Veil"

addPropertyControls(StillVeil, {
    image1: {
        type: ControlType.ResponsiveImage,
        title: "Still 1",
    },
    image2: {
        type: ControlType.ResponsiveImage,
        title: "Still 2",
    },
    image3: {
        type: ControlType.ResponsiveImage,
        title: "Still 3",
    },
    image4: {
        type: ControlType.ResponsiveImage,
        title: "Still 4",
    },
    stills: {
        type: ControlType.Array,
        title: "Stills",
        control: {
            type: ControlType.ResponsiveImage,
            title: "Image",
        },
        defaultValue: [
            {
                src: "https://framerusercontent.com/images/BIXGLiFvScaLnmbWFITSSiRpb0I.jpg",
                alt: "Empty frame, scan error in the mount",
            },
            {
                src: "https://framerusercontent.com/images/ODb8KGvC5gJi7sn0FM05vyXGik.jpg",
                alt: "Empty frame, white scan streaks",
            },
            {
                src: "https://framerusercontent.com/images/Jtx04UEmf4oYBm7NKyYTVe9q4.jpg",
                alt: "Empty frame, analog scan bands",
            },
            {
                src: "https://framerusercontent.com/images/IIhS6srvBQ6gOUxE5DLrTgQSha0.jpg",
                alt: "Empty frame, failed still",
            },
        ],
    },
    paper: {
        type: ControlType.Color,
        title: "Paper",
        defaultValue: PAPER,
        description: "Wash color. Match Page Veil.",
    },
    blur: {
        type: ControlType.Number,
        title: "Blur",
        defaultValue: 16,
        min: 0,
        max: BLUR_MAX,
        step: 1,
        unit: "px",
        description: "Peak blur between stills. The still stays visible.",
    },
    delay: {
        type: ControlType.Number,
        title: "Delay",
        defaultValue: 20,
        min: 0,
        max: 800,
        step: 10,
        unit: "ms",
        description: "Hold cover before the next still dissolves.",
    },
    duration: {
        type: ControlType.Number,
        title: "Duration",
        defaultValue: 120,
        min: 80,
        max: 800,
        step: 10,
        unit: "ms",
        description: "Cover and reveal length.",
    },
    hold: {
        type: ControlType.Number,
        title: "Hold",
        defaultValue: 900,
        min: 400,
        max: 8000,
        step: 50,
        unit: "ms",
        description: "How long each still stays before the veil.",
    },
    preview: {
        type: ControlType.Boolean,
        title: "Preview",
        defaultValue: false,
        description:
            "BuiltByKern\n[Explore more components](https://www.framer.com/%40builtbykern/)",
    },
})
