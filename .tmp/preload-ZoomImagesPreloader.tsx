import { addPropertyControls, ControlType } from "framer"
import { motion, useReducedMotion, type Transition } from "framer-motion"
import type { CSSProperties } from "react"

interface ResponsiveImage {
    src: string
    srcSet?: string
    alt?: string
}

interface ZoomImagesPreloaderProps {
    images: ResponsiveImage[]
    transition: Transition
    delayBetweenImages: number
    style?: CSSProperties
}

/**
 * Legacy stacked zoom — prefer **Zoom Image Intro** for Marketplace.
 *
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight any-prefer-fixed
 */
export default function ZoomImagesPreloader(
    props: Partial<ZoomImagesPreloaderProps>
) {
    const {
        images = [],
        transition = {
            type: "tween",
            ease: "easeInOut",
            duration: 1.6,
            delay: 0,
        },
        delayBetweenImages = 0.1,
        style,
    } = props

    const prefersReduced = useReducedMotion()
    const safeImages = Array.isArray(images)
        ? images.filter((image) => Boolean(image?.src))
        : []

    return (
        <div style={{ position: "relative", width: "100%", height: "100%", ...style }}>
            {safeImages.map((image, index) => (
                <motion.div
                    key={image.src + String(index)}
                    style={{
                        width: "100%",
                        height: "100%",
                        position: "absolute",
                        top: 0,
                        left: 0,
                        overflow: "hidden",
                    }}
                    initial={
                        prefersReduced
                            ? { scale: 1, y: "0%" }
                            : { scale: 0, y: "50%" }
                    }
                    transition={
                        prefersReduced
                            ? { duration: 0 }
                            : {
                                  ...transition,
                                  delay:
                                      (transition.delay ?? 0) +
                                      index * delayBetweenImages,
                              }
                    }
                    animate={{
                        scale: 1,
                        y: "0%",
                        rotate: "0deg",
                    }}
                >
                    <motion.div
                        style={{
                            width: "100%",
                            height: "100%",
                            backgroundImage: `url(${image.src})`,
                            backgroundPosition: "center center",
                            backgroundSize: "cover",
                            position: "absolute",
                            top: 0,
                            left: 0,
                        }}
                        initial={
                            prefersReduced
                                ? { scale: 1, rotate: "0deg" }
                                : { scale: 2.5, rotate: "-45deg" }
                        }
                        transition={
                            prefersReduced
                                ? { duration: 0 }
                                : {
                                      ...transition,
                                      delay:
                                          (transition.delay ?? 0) +
                                          index * delayBetweenImages,
                                  }
                        }
                        animate={{
                            scale: 1,
                            rotate: "0deg",
                        }}
                    />
                </motion.div>
            ))}
        </div>
    )
}

ZoomImagesPreloader.displayName = "ZoomImagesPreloader (Legacy)"

addPropertyControls(ZoomImagesPreloader, {
    images: {
        title: "Images",
        type: ControlType.Array,
        control: {
            type: ControlType.ResponsiveImage,
        },
        defaultValue: [],
        description: "Legacy component — use Zoom Image Intro for new projects.",
    },
    delayBetweenImages: {
        title: "Delay Between Images",
        type: ControlType.Number,
        defaultValue: 0.1,
        min: 0.1,
        max: 1,
        step: 0.1,
        unit: "s",
    },
    transition: {
        title: "Transition",
        type: ControlType.Transition,
        defaultValue: {
            type: "tween",
            ease: "easeInOut",
            duration: 1.6,
        },
    },
})
