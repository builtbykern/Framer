// @framerDisableUnlink
// @framerSupportedLayoutWidth: any
// @framerSupportedLayoutHeight: auto
// @framerIntrinsicWidth: 480
// @framerIntrinsicHeight: 560

import { addPropertyControls, ControlType, useIsOnFramerCanvas } from "framer"
import type { CSSProperties } from "react"

interface ImageValue {
    src: string
    srcSet?: string
    alt: string
}

interface Props {
    image: ImageValue
    title: string
    price: string
    location: string
    area: string
    imageHeight: number
    ink: string
    meta: string
    accent: string
    style?: CSSProperties
}

const DEFAULT_IMAGE: ImageValue = {
    src: "https://framerusercontent.com/images/LbYhvKzwEJNib5o77SBnb59y0.jpg",
    alt: "Residence",
}

const META_FONT = '"Space Mono", ui-monospace, monospace'
const PRICE_FONT = '"Fraunces", "Times New Roman", serif'

/** Scoped once per instance — pure CSS hover/press; no Motion / no hover React state. */
const CARD_CSS = `
.arbour-pc {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 16px;
  width: 100%;
  height: auto;
  text-decoration: none;
  cursor: pointer;
  transform: translateZ(0);
  transition: transform 0.16s cubic-bezier(0.23, 1, 0.32, 1);
}
.arbour-pc__media {
  position: relative;
  width: 100%;
  overflow: hidden;
  background-color: rgba(28, 27, 22, 0.06);
  /* Promote layer before first hover — avoids flash on scale */
  transform: translateZ(0);
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
}
.arbour-pc__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transform: scale(1);
  transform-origin: center center;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  transition: transform 0.22s cubic-bezier(0.23, 1, 0.32, 1);
}
@media (hover: hover) and (pointer: fine) {
  .arbour-pc:not(.arbour-pc--static):hover .arbour-pc__img {
    transform: scale(1.04);
  }
}
.arbour-pc:not(.arbour-pc--static):active {
  transform: scale(0.98);
}
@media (prefers-reduced-motion: reduce) {
  .arbour-pc,
  .arbour-pc__img {
    transition: none !important;
  }
  .arbour-pc:hover .arbour-pc__img {
    transform: scale(1) !important;
  }
  .arbour-pc:active {
    transform: none !important;
  }
}
`

/**
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight auto
 */
export default function Arbour_PropertyCard(props: Partial<Props>) {
    const {
        image = DEFAULT_IMAGE,
        title = "Residence",
        price = "Price on application",
        location = "London",
        area = "—",
        imageHeight = 420,
        ink = "rgb(28, 27, 22)",
        meta = "rgba(28, 27, 22, 0.55)",
        accent = "rgb(214, 224, 74)",
        style,
    } = props

    const isCanvas = useIsOnFramerCanvas()
    const imgSrc = image?.src || DEFAULT_IMAGE.src
    const imgSrcSet = image?.srcSet
    const imgAlt = image?.alt || title || DEFAULT_IMAGE.alt

    const metaText: CSSProperties = {
        fontFamily: META_FONT,
        fontSize: 11,
        letterSpacing: "0.12em",
        lineHeight: 1.5,
        textTransform: "uppercase",
    }

    return (
        <div
            className={isCanvas ? "arbour-pc arbour-pc--static" : "arbour-pc"}
            style={{ color: ink, ...style }}
        >
            <style>{CARD_CSS}</style>

            <div className="arbour-pc__media" style={{ height: imageHeight }}>
                <img
                    className="arbour-pc__img"
                    src={imgSrc}
                    srcSet={imgSrcSet}
                    alt={imgAlt}
                    draggable={false}
                />
                <div
                    style={{
                        position: "absolute",
                        left: 16,
                        bottom: 16,
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        padding: "8px 16px",
                        backgroundColor: "rgba(10, 22, 15, 0.6)",
                        borderRadius: 999,
                        pointerEvents: "none",
                    }}
                >
                    <span style={{ ...metaText, color: accent, whiteSpace: "nowrap" }}>
                        ( RESIDENCE )
                    </span>
                    <span
                        style={{
                            ...metaText,
                            color: "rgb(252, 250, 244)",
                            whiteSpace: "nowrap",
                        }}
                    >
                        VIEW
                    </span>
                </div>
            </div>

            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-end",
                    gap: 16,
                    paddingTop: 16,
                    width: "100%",
                }}
            >
                <span style={{ ...metaText, flex: 1, color: ink }}>{title}</span>
                <span style={{ ...metaText, color: ink, whiteSpace: "nowrap" }}>
                    VIEW
                </span>
            </div>

            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                    paddingTop: 8,
                    width: "100%",
                }}
            >
                <span
                    style={{
                        fontFamily: PRICE_FONT,
                        fontSize: 24,
                        lineHeight: 1.2,
                        letterSpacing: "-0.02em",
                        color: ink,
                    }}
                >
                    {price}
                </span>
                <span style={{ ...metaText, color: meta }}>{location}</span>
                <div
                    style={{
                        width: "100%",
                        height: 1,
                        backgroundColor: "rgba(28, 27, 22, 0.12)",
                        marginTop: 4,
                    }}
                />
                <span style={{ ...metaText, color: meta }}>{area}</span>
            </div>
        </div>
    )
}

addPropertyControls(Arbour_PropertyCard, {
    image: {
        type: ControlType.ResponsiveImage,
        title: "Image",
    },
    title: {
        type: ControlType.String,
        title: "Title",
        defaultValue: "Residence",
    },
    price: {
        type: ControlType.String,
        title: "Price",
        defaultValue: "Price on application",
    },
    location: {
        type: ControlType.String,
        title: "Location",
        defaultValue: "London",
    },
    area: {
        type: ControlType.String,
        title: "Area",
        defaultValue: "—",
    },
    imageHeight: {
        type: ControlType.Number,
        title: "Image Height",
        defaultValue: 420,
        min: 200,
        max: 640,
        step: 10,
        unit: "px",
        displayStepper: true,
    },
    ink: {
        type: ControlType.Color,
        title: "Ink",
        defaultValue: "rgb(28, 27, 22)",
    },
    meta: {
        type: ControlType.Color,
        title: "Meta",
        defaultValue: "rgba(28, 27, 22, 0.55)",
    },
    accent: {
        type: ControlType.Color,
        title: "Accent",
        defaultValue: "rgb(214, 224, 74)",
    },
})
