#!/usr/bin/env node
/**
 * Surgical patches for Arbour apply-all (025–027).
 * Mutates /tmp/arbour-apply/*.tsx in place.
 */
const fs = require("fs")
const path = require("path")
const DIR = "/tmp/arbour-apply"

function patch(file, fn) {
  const p = path.join(DIR, file)
  let src = fs.readFileSync(p, "utf8")
  const next = fn(src)
  if (next === src) throw new Error(`No change: ${file}`)
  fs.writeFileSync(p, next)
  console.log("patched", file, "lines", next.split("\n").length)
}

// ProgressiveBlur: static renderer + keep blur visible on canvas/export
patch("Arbour_ProgressiveBlur.tsx", (s) => {
  s = s.replace(
    `import { addPropertyControls, ControlType } from "framer"\nimport { useReducedMotion } from "framer-motion"`,
    `import { addPropertyControls, ControlType, useIsStaticRenderer } from "framer"\nimport { useReducedMotion } from "framer-motion"`
  )
  s = s.replace(
    `    const prefersReduced = useReducedMotion()
    const effectiveStrength = prefersReduced ? 0 : strength`,
    `    const isStatic = useIsStaticRenderer()
    const prefersReduced = useReducedMotion()
    // RM → off; static renderer keeps a lighter useful blur (export/canvas tiling)
    const effectiveStrength = prefersReduced ? 0 : isStatic ? Math.min(strength, 1.2) : strength
    const effectiveDivCount = isStatic ? Math.min(divCount, 3) : divCount`
  )
  s = s.replace(
    `        const increment = 100 / divCount

        for (let i = 1; i <= divCount; i += 1) {
            const progress = curveFunc(i / divCount)`,
    `        const increment = 100 / effectiveDivCount

        for (let i = 1; i <= effectiveDivCount; i += 1) {
            const progress = curveFunc(i / effectiveDivCount)`
  )
  s = s.replace(
    `                    0.0625 * (progress * divCount + 1) * effectiveStrength`,
    `                    0.0625 * (progress * effectiveDivCount + 1) * effectiveStrength`
  )
  s = s.replace(
    `        divCount,
        effectiveStrength,`,
    `        effectiveDivCount,
        effectiveStrength,`
  )
  return s
})

function addStaticToShouldAnimate(s, importLine) {
  if (!s.includes("useIsStaticRenderer")) {
    s = s.replace(
      /useIsOnFramerCanvas(,?)/,
      (m, c) => (s.includes("useIsStaticRenderer") ? m : `useIsOnFramerCanvas, useIsStaticRenderer${c || ""}`)
    )
    // Fix double if already had both somehow
    s = s.replace(
      /useIsOnFramerCanvas, useIsStaticRenderer, useIsStaticRenderer/g,
      "useIsOnFramerCanvas, useIsStaticRenderer"
    )
  }
  return s
}

function injectStaticHook(s) {
  // import from framer multiline or single
  if (!/useIsStaticRenderer/.test(s.split("from \"framer\"")[0] || "")) {
    if (s.includes("useIsOnFramerCanvas,\n}")) {
      s = s.replace(
        "useIsOnFramerCanvas,\n}",
        "useIsOnFramerCanvas,\n    useIsStaticRenderer,\n}"
      )
    } else if (s.includes("useIsOnFramerCanvas } from \"framer\"")) {
      s = s.replace(
        "useIsOnFramerCanvas } from \"framer\"",
        "useIsOnFramerCanvas, useIsStaticRenderer } from \"framer\""
      )
    } else if (s.includes("useIsOnFramerCanvas } from 'framer'")) {
      s = s.replace(
        "useIsOnFramerCanvas } from 'framer'",
        "useIsOnFramerCanvas, useIsStaticRenderer } from 'framer'"
      )
    }
  }
  return s
}

const SIMPLE_FILES = [
  "Arbour_FormButton.tsx",
  "Arbour_PrimaryButton.tsx",
  "Arbour_UnderlineLink.tsx",
  "Arbour_ArticleCard.tsx",
]

for (const file of SIMPLE_FILES) {
  patch(file, (s) => {
    s = injectStaticHook(s)
    s = s.replace(
      /const isCanvas = useIsOnFramerCanvas\(\)\n    const prefersReduced = useReducedMotion\(\)\n    const shouldAnimate = !isCanvas && !prefersReduced/,
      `const isCanvas = useIsOnFramerCanvas()
    const isStatic = useIsStaticRenderer()
    const prefersReduced = useReducedMotion()
    const shouldAnimate = !isCanvas && !isStatic && !prefersReduced`
    )
    return s
  })
}

// FormButton focus
patch("Arbour_FormButton.tsx", (s) => {
  if (s.includes("whileFocus=")) return s
  return s.replace(
    `            whileTap={shouldAnimate ? { scale: 0.98 } : undefined}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}`,
    `            whileTap={shouldAnimate ? { scale: 0.98 } : undefined}
            whileFocus={
                shouldAnimate
                    ? { backgroundColor: "rgba(252, 250, 244, 0.08)" }
                    : undefined
            }
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            onFocus={(e) => {
                e.currentTarget.style.outline = "2px solid rgba(252, 250, 244, 0.55)"
                e.currentTarget.style.outlineOffset = "3px"
            }}
            onBlur={(e) => {
                e.currentTarget.style.outline = "none"
                e.currentTarget.style.outlineOffset = "0"
            }}`
  )
})

// PrimaryButton focus
patch("Arbour_PrimaryButton.tsx", (s) => {
  if (s.includes("whileFocus=")) return s
  return s.replace(
    `            whileTap={shouldAnimate ? { scale: 0.98 } : undefined}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}`,
    `            whileTap={shouldAnimate ? { scale: 0.98 } : undefined}
            whileFocus={shouldAnimate ? { opacity: 0.92, y: -1 } : undefined}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            onFocus={(e) => {
                e.currentTarget.style.outline = "2px solid rgba(28, 27, 22, 0.45)"
                e.currentTarget.style.outlineOffset = "3px"
            }}
            onBlur={(e) => {
                e.currentTarget.style.outline = "none"
                e.currentTarget.style.outlineOffset = "0"
            }}`
  )
})

// ArticleCard focus
patch("Arbour_ArticleCard.tsx", (s) => {
  if (s.includes("whileFocus=")) return s
  return s.replace(
    `            whileHover={shouldAnimate ? { y: -2 } : undefined}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}`,
    `            whileHover={shouldAnimate ? { y: -2 } : undefined}
            whileFocus={shouldAnimate ? { y: -2 } : undefined}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            onFocus={(e) => {
                e.currentTarget.style.outline = "2px solid rgba(84, 98, 45, 0.7)"
                e.currentTarget.style.outlineOffset = "4px"
            }}
            onBlur={(e) => {
                e.currentTarget.style.outline = "none"
                e.currentTarget.style.outlineOffset = "0"
            }}`
  )
})

// ScrollCue: static + inView pause
patch("Arbour_ScrollCue.tsx", (s) => {
  s = injectStaticHook(s)
  s = s.replace(
    `import { motion, useReducedMotion, useMotionValue, useTransform, animate } from "framer-motion"
import { useEffect, type CSSProperties } from "react"`,
    `import { motion, useReducedMotion, useMotionValue, useTransform, animate, useInView } from "framer-motion"
import { useEffect, useRef, type CSSProperties } from "react"`
  )
  s = s.replace(
    `    const isCanvas = useIsOnFramerCanvas()
    const prefersReduced = useReducedMotion()
    const shouldAnimate = !isCanvas && !prefersReduced
    const arrowY = useMotionValue(0)`,
    `    const isCanvas = useIsOnFramerCanvas()
    const isStatic = useIsStaticRenderer()
    const prefersReduced = useReducedMotion()
    const rootRef = useRef<HTMLDivElement>(null)
    const inView = useInView(rootRef, { amount: 0.35, once: false })
    const shouldAnimate = !isCanvas && !isStatic && !prefersReduced && inView
    const arrowY = useMotionValue(0)`
  )
  if (!s.includes("ref={rootRef}")) {
    s = s.replace(
      `<div style={rootStyle} aria-label={ariaLabel} role="group">`,
      `<div ref={rootRef} style={rootStyle} aria-label={ariaLabel} role="group">`
    )
  }
  if (!s.includes("ref={rootRef}")) throw new Error("ScrollCue: failed to attach rootRef")
  return s
})

// EditorialReveal
patch("Arbour_EditorialReveal.tsx", (s) => {
  s = injectStaticHook(s)
  return s.replace(
    `    const isCanvas = useIsOnFramerCanvas() ?? false
    const prefersReduced = useReducedMotion() ?? false
    const isStatic = isCanvas || prefersReduced`,
    `    const isCanvas = useIsOnFramerCanvas() ?? false
    const isStaticRenderer = useIsStaticRenderer()
    const prefersReduced = useReducedMotion() ?? false
    const isStatic = isCanvas || isStaticRenderer || prefersReduced`
  )
})

// InertiaFrame
patch("Arbour_InertiaFrame.tsx", (s) => {
  s = injectStaticHook(s)
  s = s.replace(
    `    const isCanvas = useIsOnFramerCanvas()
    const prefersReduced = useReducedMotion()`,
    `    const isCanvas = useIsOnFramerCanvas()
    const isStatic = useIsStaticRenderer()
    const prefersReduced = useReducedMotion()`
  )
  s = s.replace(
    `    const shouldAnimate = !isCanvas && !prefersReduced && isInView
    const usePointerParallax = parallaxMode === "pointer" && shouldAnimate
    const useScrollParallax = parallaxMode === "scroll" && !isCanvas && !prefersReduced`,
    `    const shouldAnimate = !isCanvas && !isStatic && !prefersReduced && isInView
    const usePointerParallax = parallaxMode === "pointer" && shouldAnimate
    const useScrollParallax = parallaxMode === "scroll" && !isCanvas && !isStatic && !prefersReduced`
  )
  return s
})

// SectionHeader
patch("Arbour_SectionHeader.tsx", (s) => {
  s = injectStaticHook(s)
  s = s.replace(
    `    const isCanvas = useIsOnFramerCanvas()
    const prefersReduced = useReducedMotion()`,
    `    const isCanvas = useIsOnFramerCanvas()
    const isStatic = useIsStaticRenderer()
    const prefersReduced = useReducedMotion()
    const freezeMotion = isCanvas || isStatic || prefersReduced`
  )
  s = s.replace(
    /isCanvas \|\| prefersReduced \|\| headingInView/g,
    "freezeMotion || headingInView"
  )
  s = s.replace(
    /whileHover=\{isCanvas \|\| prefersReduced \? undefined : \{ y: -2 \}\}/g,
    "whileHover={freezeMotion ? undefined : { y: -2 }}\n                        whileFocus={freezeMotion ? undefined : { y: -2 }}"
  )
  return s
})

// TerritoryRail: static + inView for autoplay
patch("Arbour_TerritoryRail.tsx", (s) => {
  s = injectStaticHook(s)
  if (!s.includes("useInView")) {
    s = s.replace(
      `import { AnimatePresence, motion, useReducedMotion } from "framer-motion"`,
      `import { AnimatePresence, motion, useReducedMotion, useInView } from "framer-motion"`
    )
  }
  if (!s.includes("useRef")) {
    s = s.replace(
      `import {
    useCallback,
    useEffect,
    useMemo,
    useState,`,
      `import {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,`
    )
  }
  s = s.replace(
    `    const isCanvas = useIsOnFramerCanvas() ?? false
    const prefersReduced = useReducedMotion() ?? false
    const shouldAnimate = !isCanvas && !prefersReduced`,
    `    const isCanvas = useIsOnFramerCanvas() ?? false
    const isStatic = useIsStaticRenderer()
    const prefersReduced = useReducedMotion() ?? false
    const railRef = useRef<HTMLDivElement>(null)
    const railInView = useInView(railRef, { amount: 0.2, once: false })
    const shouldAnimate = !isCanvas && !isStatic && !prefersReduced`
  )
  s = s.replace(
    `        if (layout.variant !== "slide" || !shouldAnimate || items.length < 2)
            return
        if (motion.pauseOnHover && hovered) return`,
    `        if (layout.variant !== "slide" || !shouldAnimate || items.length < 2)
            return
        if (!railInView) return
        if (motion.pauseOnHover && hovered) return`
  )
  // Only the autoplay effect deps — unique enough with slideInterval nearby
  s = s.replace(
    `        motion.slideInterval,
        shouldAnimate,
    ])`,
    `        motion.slideInterval,
        shouldAnimate,
        railInView,
    ])`
  )
  if (!s.includes("ref={railRef}")) {
    const marker = "export default function Arbour_TerritoryRail"
    const start = s.indexOf(marker)
    // last return in the default export is the real root
    const lastReturn = s.lastIndexOf("return (\n        <div\n            style={{")
    if (lastReturn < start) throw new Error("TerritoryRail: root return not found")
    s = s.replace(
      `return (
        <div
            style={{
                width: "100%",
                height: "100%",
                overflowX: "hidden",
                boxSizing: "border-box",
                ...style,
            }}
            onPointerEnter={() => setHovered(true)}`,
      `return (
        <div
            ref={railRef}
            style={{
                width: "100%",
                height: "100%",
                overflowX: "hidden",
                boxSizing: "border-box",
                ...style,
            }}
            onPointerEnter={() => setHovered(true)}`
    )
  }
  if (!s.includes("ref={railRef}")) throw new Error("TerritoryRail: failed to attach railRef")
  return s
})

console.log("OK")
