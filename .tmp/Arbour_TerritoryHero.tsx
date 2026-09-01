// @framerDisableUnlink
// @framerSupportedLayoutWidth: any
// @framerSupportedLayoutHeight: any
// @framerIntrinsicWidth: 640
// @framerIntrinsicHeight: 300

import { addPropertyControls, ControlType } from "framer"
import type { CSSProperties } from "react"

interface ImageValue {
    src: string
    srcSet?: string
    alt?: string
}

interface Props {
    image: ImageValue
    style?: CSSProperties
}

/**
 * Minimal CMS hero plane for breakpoint binding tests / T-P fallback.
 *
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight any
 */
export default function Arbour_TerritoryHero(props: Partial<Props>) {
    const image = props.image
    const src = typeof image === "string" ? image : image?.src || ""
    const alt = typeof image === "string" ? "Territory" : image?.alt || "Territory"
    const srcSet = typeof image === "object" && image ? image.srcSet : undefined

    return (
        <div
            style={{
                position: "relative",
                width: "100%",
                height: "100%",
                overflow: "hidden",
                backgroundColor: "rgb(28, 27, 22)",
                ...props.style,
            }}
        >
            {src ? (
                <img
                    src={src}
                    srcSet={srcSet}
                    alt={alt}
                    decoding="async"
                    draggable={false}
                    style={{
                        position: "absolute",
                        inset: 0,
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                    }}
                />
            ) : null}
        </div>
    )
}

addPropertyControls(Arbour_TerritoryHero, {
    image: {
        type: ControlType.ResponsiveImage,
        title: "Image",
    },
})
