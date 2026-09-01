// @framerDisableUnlink
// @framerSupportedLayoutWidth fixed
// @framerSupportedLayoutHeight auto
// @framerIntrinsicWidth 640
// @framerIntrinsicHeight 860
/** Kern_QuoteIntake — Multi-step quote calculator. Version: 3.24.0 */

import { addPropertyControls, ControlType, RenderTarget, useIsOnFramerCanvas, useIsStaticRenderer } from "framer"
import {
    AnimatePresence,
    motion,
    useMotionValue,
    useMotionValueEvent,
    useReducedMotion,
    useSpring,
} from "framer-motion"
import {
    useState,
    useMemo,
    useCallback,
    useEffect,
    useLayoutEffect,
    useRef,
    startTransition,
    type CSSProperties,
    type KeyboardEvent,
    type FocusEvent,
} from "react"

interface FormulaLineItem { label: string; quantityFieldKey: string; unitPrice: number }
interface KeyMultiplier { key: string; multiplier: number }
interface LineContribution { label: string; quantityFieldKey: string; quantity: number; unitPrice: number; lineSubtotal: number; contributionAfterMultipliers: number }
interface IntentOption { title: string; helperText?: string; key: string }
interface QuantityField { label: string; helperText?: string; key: string; min: number; max: number; step: number; defaultValue: number }
interface TimelineOption { label: string; key: string }
type FormValue = string | number | boolean | undefined
type FormData = Record<string, FormValue>

interface Kern_QuoteIntakeProps {
    style?: CSSProperties
    step1: { screenTitle: string; screenSubtitle: string; primaryButtonLabel: string; intentOptions: IntentOption[]; hideSingleOptionPicker: boolean }
    step2: { screenTitle: string; screenSubtitle: string; primaryButtonLabel: string; quantityFields: QuantityField[]; quantityControlType: "stepper" | "number" | "slider" }
    step3: { screenTitle: string; screenSubtitle: string; primaryButtonLabel: string; timelineBucketLabel: string; timelineBucketHelper: string; timelineBucketOptions: TimelineOption[]; rushToggleLabel: string; rushToggleHelper: string }
    step4: { screenTitle: string; screenSubtitle: string; primaryButtonLabel: string; showContactFields: boolean; submittingButtonLabel: string; emailLabel: string; emailHelper: string; noteLabel: string; noteHelper: string; disclaimerText: string; consentCheckboxLabel: string; consentCheckboxHelper: string }
    narrative: { productTitle: string; supportingLine: string; showStepList: boolean; step1Label: string; step2Label: string; step3Label: string; step4Label: string; backButtonLabel: string; ariaLabel: string; previewImageUrl: string; previewImageAlt: string }
    typography: { titleFont: CSSProperties; labelFont: CSSProperties; inputFont: CSSProperties; buttonFont: CSSProperties; cardFont: CSSProperties; smallPrintFont: CSSProperties }
    colors: { backgroundColor: string; cardBackground: string; textPrimary: string; textSecondary: string; border: string; accent: string; focusRingColor: string; secondaryButtonColor: string; secondaryButtonTextColor: string }
    layout: { borderRadius: number; cardPaddingDesktop: number; sectionGapDesktop: number; fieldGapDesktop: number; buttonHeightDesktop: number }
    submission: { webhookUrl: string; submitErrorMessage: string; formulaLineItems: FormulaLineItem[]; showAdvancedPricing: boolean; rushMultiplierWhenChecked: number; intentMultiplierOverrides: KeyMultiplier[]; timelineMultiplierOverrides: KeyMultiplier[]; currencySymbol: string; rangeLowPercent: number; rangeHighPercent: number; showLineBreakdown: boolean; breakdownStaggerMs: number; successScreenCopy: { screenTitle: string; screenSubtitle: string; primaryButtonLabel: string; nextStep1Text?: string; nextStep2Text?: string; nextStep3Text?: string } }
    accessibility: { announceStepChanges: boolean; announceEstimateRange: boolean }
}

const EASE_OUT = [0.23, 1, 0.32, 1] as const
const ENTER_TRANSITION = { duration: 0.2, ease: EASE_OUT }
const EXIT_TRANSITION = { duration: 0.12, ease: EASE_OUT }

function faintRule(color: string) {
    return `1px solid color-mix(in srgb, ${color} 40%, transparent)`
}
const QI_THUMB = 14
const snapQty = (raw: number, min: number, max: number, step: number) => {
    const s = step > 0 ? step : 1
    return Math.max(min, Math.min(max, Math.round((raw - min) / s) * s + min))
}
function normalizeQtyField(f: Partial<QuantityField>, i = 0): QuantityField {
    const min = Number.isFinite(f.min as number) ? Number(f.min) : 0
    const maxRaw = Number.isFinite(f.max as number) ? Number(f.max) : Math.max(min + 1, 50)
    const max = Math.max(min, maxRaw)
    const step = Number.isFinite(f.step as number) && Number(f.step) > 0 ? Number(f.step) : 1
    const def = Number.isFinite(f.defaultValue as number) ? Number(f.defaultValue) : min
    return { label: f.label ?? `Field ${i + 1}`, helperText: f.helperText, key: f.key ?? `field-${i}`, min, max, step, defaultValue: snapQty(def, min, max, step) }
}
function buildInitialForm(fields: QuantityField[], intentKey: string): FormData {
    const next: FormData = {}
    for (const f of fields) next[f.key] = f.defaultValue
    if (intentKey) next.intent = intentKey
    return next
}
function intentSeedFrom(step1: Kern_QuoteIntakeProps["step1"]) {
    return step1.hideSingleOptionPicker && step1.intentOptions.length === 1 ? step1.intentOptions[0].key : ""
}
const NOISE =
    "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.55'/%3E%3C/svg%3E\")"
const HIDDEN: CSSProperties = { position: "absolute", width: 1, height: 1, padding: 0, margin: -1, overflow: "hidden", clipPath: "inset(50%)", whiteSpace: "nowrap", border: 0 }

const DEFAULT_PROPS: Kern_QuoteIntakeProps = {
    step1: {
        screenTitle: "What are you building?",
        screenSubtitle: "Select the project type that best fits your needs",
        primaryButtonLabel: "Next",
        hideSingleOptionPicker: false,
        intentOptions: [
            { title: "Marketing site", helperText: "Multi-page structure with content management", key: "marketing-site" },
            { title: "Product UI with CMS", helperText: "Interactive app interface with dynamic data", key: "product-ui-cms" },
            { title: "Launch landing", helperText: "Single conversion page with form integration", key: "launch-landing" },
            { title: "Motion-led storytelling", helperText: "Scroll-driven narrative with custom animations", key: "motion-storytelling" },
        ],
    },
    step2: {
        screenTitle: "Define your scope",
        screenSubtitle: "These inputs shape the estimate range",
        primaryButtonLabel: "Continue",
        quantityControlType: "slider",
        quantityFields: [
            { label: "Unique page layouts", helperText: "Distinct templates you need", key: "pages", min: 1, max: 50, step: 1, defaultValue: 5 },
            { label: "CMS collections", helperText: "Dynamic content types", key: "cms", min: 0, max: 20, step: 1, defaultValue: 2 },
            { label: "Custom code components", helperText: "Interactive elements beyond standard Framer", key: "components", min: 0, max: 30, step: 1, defaultValue: 3 },
        ],
    },
    step3: {
        screenTitle: "Timeline and delivery",
        screenSubtitle: "When you need it affects resource allocation",
        primaryButtonLabel: "Continue",
        timelineBucketLabel: "Target delivery window",
        timelineBucketHelper: "Select the timeframe that works for your launch",
        timelineBucketOptions: [
            { label: "Standard (4–6 weeks)", key: "standard" },
            { label: "Accelerated (2–3 weeks)", key: "expedited" },
            { label: "Flexible timeline", key: "extended" },
        ],
        rushToggleLabel: "Rush delivery needed",
        rushToggleHelper: "Requires dedicated capacity and adds approximately 30% to the estimate",
    },
    step4: {
        screenTitle: "Review your estimate",
        screenSubtitle: "Confirm scope and timeline, then open the summary with your indicative range",
        primaryButtonLabel: "View summary",
        showContactFields: false,
        submittingButtonLabel: "Sending…",
        emailLabel: "Email address",
        emailHelper: "Required — used for follow-up on this estimate",
        noteLabel: "Additional context (optional)",
        noteHelper: "Share anything that might affect scope or timeline",
        disclaimerText: "This estimate is indicative only and does not constitute a binding quote or contract. Final pricing will be determined following a detailed discovery process and scope review.",
        consentCheckboxLabel: "I understand this is an indicative range only",
        consentCheckboxHelper: "When a webhook URL is set in Formula & summary, this response is posted on submit. Leave the URL empty for local summary only.",
    },
    narrative: {
        productTitle: "Estimate",
        supportingLine: "Shape a range. Refine the brief.",
        showStepList: true,
        step1Label: "Intent",
        step2Label: "Scope",
        step3Label: "Timing",
        step4Label: "Review",
        backButtonLabel: "Back",
        ariaLabel: "Project quote calculator",
        previewImageUrl: "",
        previewImageAlt: "Decorative preview for marketplace listing",
    },
    typography: {
        titleFont: { fontSize: "56px", fontWeight: 300, letterSpacing: "-0.055em", lineHeight: "0.95em" },
        labelFont: { fontSize: "15px", fontWeight: 400, letterSpacing: "-0.012em", lineHeight: "1.5em" },
        cardFont: { fontSize: "16px", fontWeight: 500, letterSpacing: "-0.02em", lineHeight: "1.3em" },
        inputFont: { fontSize: "15px", fontWeight: 400, letterSpacing: "-0.005em", lineHeight: "1.5em" },
        buttonFont: { fontSize: "12px", fontWeight: 500, letterSpacing: "0.1em", lineHeight: "1em" },
        smallPrintFont: { fontSize: "11px", fontWeight: 400, letterSpacing: "0.08em", lineHeight: "1.5em" },
    },
    colors: {
        backgroundColor: "transparent",
        cardBackground: "rgba(255, 255, 255, 0.04)",
        textPrimary: "#EEF1F6",
        textSecondary: "rgba(238, 241, 246, 0.52)",
        accent: "#6FD3FF",
        border: "rgba(238, 241, 246, 0.12)",
        focusRingColor: "#6FD3FF",
        secondaryButtonColor: "transparent",
        secondaryButtonTextColor: "rgba(238, 241, 246, 0.62)",
    },
    layout: { borderRadius: 0, cardPaddingDesktop: 40, sectionGapDesktop: 32, fieldGapDesktop: 16, buttonHeightDesktop: 44 },
    submission: {
        webhookUrl: "",
        submitErrorMessage: "Could not send your request. Check the webhook URL and try again.",
        showAdvancedPricing: false,
        rushMultiplierWhenChecked: 1.3,
        intentMultiplierOverrides: [],
        timelineMultiplierOverrides: [],
        currencySymbol: "$",
        rangeLowPercent: 0.9,
        rangeHighPercent: 1.1,
        showLineBreakdown: true,
        breakdownStaggerMs: 32,
        formulaLineItems: [
            { label: "Page design and build", quantityFieldKey: "pages", unitPrice: 500 },
            { label: "CMS setup and integration", quantityFieldKey: "cms", unitPrice: 300 },
            { label: "Custom interactive components", quantityFieldKey: "components", unitPrice: 400 },
        ],
        successScreenCopy: {
            screenTitle: "Indicative estimate",
            screenSubtitle: "Use this range for planning. Final pricing follows discovery and scope review.",
            primaryButtonLabel: "Start over",
            nextStep1Text: "Share this summary with your team or client as a ballpark",
            nextStep2Text: "Paste a Formspark, Make, or Zapier webhook URL in Formula & summary to capture leads",
            nextStep3Text: "Tune formula line items and multipliers in component settings to match your rates",
        },
    },
    accessibility: { announceStepChanges: true, announceEstimateRange: true },
}

function mergeProps(p: Partial<Kern_QuoteIntakeProps>): Kern_QuoteIntakeProps {
    return {
        ...DEFAULT_PROPS,
        ...p,
        step1: { ...DEFAULT_PROPS.step1, ...p.step1, intentOptions: p.step1?.intentOptions ?? DEFAULT_PROPS.step1.intentOptions },
        step2: { ...DEFAULT_PROPS.step2, ...p.step2, quantityFields: (p.step2?.quantityFields ?? DEFAULT_PROPS.step2.quantityFields).map((f, i) => normalizeQtyField(f, i)) },
        step3: { ...DEFAULT_PROPS.step3, ...p.step3, timelineBucketOptions: p.step3?.timelineBucketOptions ?? DEFAULT_PROPS.step3.timelineBucketOptions },
        step4: { ...DEFAULT_PROPS.step4, ...p.step4 },
        narrative: { ...DEFAULT_PROPS.narrative, ...p.narrative },
        typography: { ...DEFAULT_PROPS.typography, ...p.typography },
        colors: { ...DEFAULT_PROPS.colors, ...p.colors },
        layout: { ...DEFAULT_PROPS.layout, ...p.layout },
        submission: {
            ...DEFAULT_PROPS.submission,
            ...p.submission,
            formulaLineItems: p.submission?.formulaLineItems ?? DEFAULT_PROPS.submission.formulaLineItems,
            successScreenCopy: { ...DEFAULT_PROPS.submission.successScreenCopy, ...p.submission?.successScreenCopy },
            intentMultiplierOverrides: p.submission?.intentMultiplierOverrides ?? DEFAULT_PROPS.submission.intentMultiplierOverrides,
            timelineMultiplierOverrides: p.submission?.timelineMultiplierOverrides ?? DEFAULT_PROPS.submission.timelineMultiplierOverrides,
        },
        accessibility: { ...DEFAULT_PROPS.accessibility, ...p.accessibility },
    }
}

function computeEstimate(
    form: FormData,
    items: FormulaLineItem[],
    advanced: boolean,
    intentRows: KeyMultiplier[],
    timelineRows: KeyMultiplier[],
    rushMult: number
): { total: number; lines: LineContribution[] } {
    const base = items.map((item) => {
        const raw = form[item.quantityFieldKey]
        const qty = typeof raw === "number" ? raw : typeof raw === "string" ? Number.parseFloat(raw) || 0 : 0
        const sub = qty * item.unitPrice
        return { label: item.label, quantityFieldKey: item.quantityFieldKey, quantity: qty, unitPrice: item.unitPrice, lineSubtotal: sub, contributionAfterMultipliers: 0 }
    })
    const subtotal = base.reduce((s, l) => s + l.lineSubtotal, 0)
    const lookup = (rows: KeyMultiplier[], key: string) => {
        const hit = rows.find((r) => r.key === key)
        return hit && hit.multiplier > 0 ? hit.multiplier : 1
    }
    const intentM = advanced ? lookup(intentRows, String(form.intent ?? "")) : 1
    const timelineM = advanced ? lookup(timelineRows, String(form.timeline ?? "")) : 1
    const rushM = form.rush === true ? (rushMult > 0 ? rushMult : 1.3) : 1
    const total = Math.round(subtotal * intentM * timelineM * rushM)
    let allocated = 0
    const lines = base.map((line, i) => {
        if (subtotal <= 0) return { ...line, contributionAfterMultipliers: 0 }
        const isLast = i === base.length - 1
        const portion = isLast ? Math.max(0, total - allocated) : Math.round(total * (line.lineSubtotal / subtotal))
        if (!isLast) allocated += portion
        return { ...line, contributionAfterMultipliers: Math.max(0, portion) }
    })
    return { total, lines }
}

function formatRange(total: number, lo: number, hi: number, sym: string) {
    const rangeLow = Math.round(total * lo)
    const rangeHigh = Math.round(total * hi)
    const lowText = `${sym}${rangeLow.toLocaleString()}`
    const highText = `${sym}${rangeHigh.toLocaleString()}`
    return { rangeLow, rangeHigh, lowText, highText, text: `${lowText} – ${highText}` }
}

function validateStep(step: number, form: FormData, fields: QuantityField[], contact: boolean, intentCount: number, requireConsent: boolean): Record<string, string> {
    const err: Record<string, string> = {}
    if (step === 1 && intentCount > 0 && !form.intent) err.intent = "Select a project type to continue"
    if (step === 2) {
        for (const f of fields) {
            const v = form[f.key]
            if (v === undefined || v === null || v === "") err[f.key] = "Enter a value for this field"
            else {
                const n = typeof v === "number" ? v : Number.parseFloat(String(v))
                if (Number.isNaN(n)) err[f.key] = "Enter a valid number"
                else if (n < f.min) err[f.key] = `Minimum value is ${f.min}`
                else if (n > f.max) err[f.key] = `Maximum value is ${f.max}`
            }
        }
    }
    if (step === 3 && !form.timeline) err.timeline = "Select a delivery window"
    if (step === 4) {
        if (contact) {
            const email = String(form.email ?? "").trim()
            if (!email) err.email = "Enter your email address"
            else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) err.email = "Enter a valid email address"
        }
        if (contact || requireConsent) {
            if (!form.consent) err.consent = "Confirm before continuing"
        }
    }
    return err
}

async function postWebhook(url: string, payload: Record<string, unknown>) {
    if (typeof window === "undefined") return { ok: false, status: 0 }
    const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(payload) })
    return { ok: res.ok, status: res.status }
}

function focusRing(el: HTMLElement, color: string, on: boolean) {
    el.style.outline = on ? `2px solid ${color}` : "2px solid transparent"
    el.style.outlineOffset = "2px"
}

function errAlert(id: string, msg: string, font: CSSProperties) {
    return <div id={id} role="alert" style={{ ...font, color: "#FF5588", fontSize: "12px" }}>{msg}</div>
}

function EstimateText({ text, color, font, announce }: {
    text: string; color: string; font: CSSProperties; announce: boolean
}) {
    return (
        <span aria-live={announce ? "polite" : "off"} aria-atomic={announce || undefined} style={{
            ...font, color, fontVariantNumeric: "tabular-nums", lineHeight: "1.15em", display: "block",
            fontSize: "24px", fontWeight: 300, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
            maxWidth: "100%", textAlign: "left", letterSpacing: "-0.04em",
        }}>
            {text}
        </span>
    )
}

/** Spring-smoothed range — only mount when motion is allowed (not static/canvas/reduced). */
function AnimatedEstimate({ total, lo, hi, sym, spring, color, font, announce }: {
    total: number; lo: number; hi: number; sym: string
    spring: { stiffness: number; damping: number; mass: number }; color: string; font: CSSProperties
    announce: boolean
}) {
    const target = useMotionValue(total)
    const springVal = useSpring(target, spring)
    const [smooth, setSmooth] = useState(total)
    useLayoutEffect(() => { target.set(total) }, [total, target])
    useMotionValueEvent(springVal, "change", (v) => {
        const next = Math.round(v)
        setSmooth((prev) => (prev === next ? prev : next))
    })
    const { text } = formatRange(smooth, lo, hi, sym)
    return <EstimateText text={text} color={color} font={font} announce={announce} />
}

function EstimateRange({ total, lo, hi, sym, freeze, spring, color, font, announce }: {
    total: number; lo: number; hi: number; sym: string; freeze: boolean
    spring: { stiffness: number; damping: number; mass: number }; color: string; font: CSSProperties
    announce: boolean
}) {
    if (freeze) {
        const { text } = formatRange(total, lo, hi, sym)
        return <EstimateText text={text} color={color} font={font} announce={announce} />
    }
    return <AnimatedEstimate total={total} lo={lo} hi={hi} sym={sym} spring={spring} color={color} font={font} announce={announce} />
}

function RadioTile({ id, label, helper, selected, tabIndex, onSelect, colors, font, setRef, rule = true }: {
    id: string; label: string; helper?: string; selected: boolean; tabIndex: number; onSelect: () => void
    colors: Kern_QuoteIntakeProps["colors"]; font: CSSProperties
    setRef?: (el: HTMLButtonElement | null) => void
    rule?: boolean
}) {
    return (
        <button type="button" id={id} role="radio" aria-checked={selected} tabIndex={tabIndex} ref={setRef}
            onClick={onSelect} onFocus={(e) => focusRing(e.currentTarget, colors.focusRingColor, true)} onBlur={(e) => focusRing(e.currentTarget, colors.focusRingColor, false)}
            style={{ ...font, padding: "16px 0 16px 12px", textAlign: "left", cursor: "pointer", display: "flex", flexDirection: "column", gap: 5, color: colors.textPrimary, backgroundColor: "transparent", border: "none", borderBottom: rule ? faintRule(colors.border) : "none", boxShadow: selected ? `inset 2px 0 0 ${colors.accent}` : "inset 2px 0 0 transparent", opacity: selected ? 1 : 0.72, WebkitTapHighlightColor: "transparent", minHeight: 48, width: "100%" }}>
            <div style={{ fontWeight: selected ? 500 : 400, letterSpacing: "-0.02em", fontSize: "15px" }}>{label}</div>
            {helper ? <div style={{ fontSize: "12px", color: colors.textSecondary, lineHeight: "1.4em", opacity: selected ? 0.9 : 0.62 }}>{helper}</div> : null}
        </button>
    )
}

function handleRadioKeys(e: KeyboardEvent, keys: string[], current: string | undefined, onSelect: (k: string) => void, focusNext: (key: string) => void) {
    if (!["ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight"].includes(e.key)) return
    e.preventDefault()
    const idx = keys.indexOf(current ?? "")
    const base = idx < 0 ? 0 : idx
    const next = e.key === "ArrowDown" || e.key === "ArrowRight" ? (base + 1) % keys.length : (base - 1 + keys.length) % keys.length
    onSelect(keys[next]); focusNext(keys[next])
}

/**
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight auto
 */
export default function Kern_QuoteIntake(p: Partial<Kern_QuoteIntakeProps>) {
    const props = useMemo(() => mergeProps(p), [p])
    const { style, step1, step2, step3, step4, narrative, typography, colors, layout, submission, accessibility } = props
    const isStatic = useIsStaticRenderer()
    const isOnCanvas = useIsOnFramerCanvas()
    const prefersReducedMotion = useReducedMotion() ?? false
    const isThumbnail = RenderTarget.current() === RenderTarget.thumbnail
    // Marketplace: never animate in static contexts (canvas / export) — same gate as ZoomImageIntro
    const freezeMotion = isStatic || isThumbnail
    const motionOk = !freezeMotion && !isOnCanvas && !prefersReducedMotion
    const spring = motionOk ? { stiffness: 220, damping: 32, mass: 0.8 } : { stiffness: 10000, damping: 1000, mass: 0.01 }
    const intentSeed = intentSeedFrom(step1)

    const [step, setStep] = useState(1)
    const [form, setForm] = useState<FormData>(() => {
        const m = mergeProps(p)
        return buildInitialForm(m.step2.quantityFields, intentSeedFrom(m.step1))
    })
    const [submitted, setSubmitted] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [submitErr, setSubmitErr] = useState<string | undefined>()
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [triedNext, setTriedNext] = useState(false)
    const [estGen, setEstGen] = useState(0)
    const rootRef = useRef<HTMLDivElement>(null)
    const headingRef = useRef<HTMLHeadingElement>(null)
    const bodyRef = useRef<HTMLDivElement>(null)
    const radioRefs = useRef<Record<string, HTMLButtonElement | null>>({})
    const skipFocus = useRef(true)
    const focusRadio = useCallback((id: string) => {
        radioRefs.current[id]?.focus()
    }, [])

    const webhook = (submission.webhookUrl ?? "").trim()
    // Desktop-only chrome — same layout at every marked width.
    const cardPad = layout.cardPaddingDesktop
    const secGap = layout.sectionGapDesktop
    const fldGap = layout.fieldGapDesktop
    const btnH = Math.max(36, layout.buttonHeightDesktop)
    const stepTitleSize = "28px"
    const labelSize = "14px"
    const rootPad = `${cardPad}px`
    const chapterNum = String(step).padStart(2, "0")

    const estimate = useMemo(() => computeEstimate(form, submission.formulaLineItems, submission.showAdvancedPricing,
        submission.intentMultiplierOverrides, submission.timelineMultiplierOverrides, submission.rushMultiplierWhenChecked),
        [form, submission])
    const range = useMemo(() => formatRange(estimate.total, submission.rangeLowPercent, submission.rangeHighPercent, submission.currencySymbol), [estimate.total, submission])
    const stepLabels = [narrative.step1Label, narrative.step2Label, narrative.step3Label, narrative.step4Label]
    const screens = [step1, step2, step3, step4]
    const active = screens[step - 1] ?? step4

    const qtySeed = step2.quantityFields.map((f) => `${f.key}:${f.defaultValue}`).join("|")
    useEffect(() => {
        setForm((prev) => {
            let changed = false
            const next = { ...prev }
            for (const f of step2.quantityFields) { if (next[f.key] === undefined) { next[f.key] = f.defaultValue; changed = true } }
            if (intentSeed && next.intent === undefined) { next.intent = intentSeed; changed = true }
            return changed ? next : prev
        })
    }, [qtySeed, intentSeed, step2.quantityFields])

    useLayoutEffect(() => {
        if (skipFocus.current) { skipFocus.current = false; return }
        if (isOnCanvas || submitted) return
        const id = requestAnimationFrame(() => headingRef.current?.focus())
        return () => cancelAnimationFrame(id)
    }, [step, isOnCanvas, submitted])

    const patch = useCallback((key: string, value: FormValue) => setForm((prev) => ({ ...prev, [key]: value })), [])
    const clearErr = useCallback((key: string) => setErrors((prev) => { const n = { ...prev }; delete n[key]; return n }), [])

    const validate = useCallback(() => {
        const e = validateStep(step, form, step2.quantityFields, step4.showContactFields, step1.intentOptions.length, Boolean(webhook))
        startTransition(() => setErrors(e))
        return Object.keys(e).length === 0
    }, [step, form, step2.quantityFields, step4.showContactFields, step1.intentOptions.length, webhook])

    const handleNext = useCallback(() => {
        if (submitting) return
        startTransition(() => { setTriedNext(true); setSubmitErr(undefined) })
        if (!validate()) return
        if (step < 4) {
            startTransition(() => { setStep(step + 1); setTriedNext(false); setErrors({}) })
            return
        }
        // Keep step at 4 while showing success (submitted gate owns UI).
        const done = () => startTransition(() => { setSubmitting(false); setSubmitted(true); setTriedNext(false); setErrors({}); setSubmitErr(undefined) })
        if (isOnCanvas || !webhook) { done(); return }
        startTransition(() => setSubmitting(true))
        const payload = {
            source: "Kern_QuoteIntake", intent: form.intent ?? null, timeline: form.timeline ?? null, rush: Boolean(form.rush),
            email: form.email ? String(form.email) : null, note: form.note ? String(form.note) : null, consent: Boolean(form.consent),
            quantities: Object.fromEntries(step2.quantityFields.map((f) => [f.key, typeof form[f.key] === "number" ? form[f.key] : f.defaultValue])),
            estimate: { total: estimate.total, rangeLow: range.rangeLow, rangeHigh: range.rangeHigh, text: range.text, currencySymbol: submission.currencySymbol },
            lineContributions: estimate.lines,
        }
        void postWebhook(webhook, payload).then((r) => {
            if (r.ok) done()
            else startTransition(() => { setSubmitting(false); setSubmitErr(submission.submitErrorMessage) })
        }).catch(() => startTransition(() => { setSubmitting(false); setSubmitErr(submission.submitErrorMessage) }))
    }, [submitting, validate, step, isOnCanvas, webhook, form, step2.quantityFields, estimate, range, submission])

    const handleBack = useCallback(() => {
        if (submitting || step <= 1) return
        startTransition(() => { setStep(step - 1); setTriedNext(false); setErrors({}); setSubmitErr(undefined) })
    }, [submitting, step])

    const returnToStart = useCallback(() => {
        startTransition(() => {
            setSubmitted(false); setStep(1); setForm(buildInitialForm(step2.quantityFields, intentSeed))
            setErrors({}); setTriedNext(false); setSubmitErr(undefined); setSubmitting(false); setEstGen((g) => g + 1)
        })
    }, [step2.quantityFields, intentSeed])

    const bodyMotion = useMemo(() => motionOk
        ? { initial: { opacity: 0, transform: "translateY(8px)" }, animate: { opacity: 1, transform: "translateY(0px)", transition: ENTER_TRANSITION }, exit: { opacity: 0, transition: EXIT_TRANSITION } }
        : { initial: false as const, animate: { opacity: 1 }, exit: { opacity: 1, transition: { duration: 0 } } }, [motionOk])
    const ctaLabel = "#03050A"
    const ctaType = { ...typography.buttonFont, textTransform: "uppercase" as const, letterSpacing: typography.buttonFont.letterSpacing ?? "0.1em", fontSize: typography.buttonFont.fontSize ?? "12px" }
    const primaryCtaStyle: CSSProperties = { ...ctaType, height: btnH, padding: "0 18px", backgroundColor: colors.textPrimary, color: ctaLabel, border: "none", borderRadius: layout.borderRadius, cursor: "pointer", WebkitTapHighlightColor: "transparent" }
    const backCtaStyle: CSSProperties = { ...ctaType, height: btnH, padding: "0 12px", backgroundColor: colors.secondaryButtonColor, color: colors.secondaryButtonTextColor, border: "none", borderRadius: layout.borderRadius, cursor: "pointer", WebkitTapHighlightColor: "transparent" }

    const renderProgress = (inline: boolean) => (
        <div aria-label="Form chapters" style={{
            display: "flex", flexDirection: inline ? "row" : "column", flexWrap: inline ? "wrap" : undefined,
            gap: inline ? "6px 14px" : 6, marginBottom: inline ? 0 : secGap * 0.35, alignItems: inline ? "center" : "stretch",
            minWidth: 0, flexShrink: 1,
        }}>
            {narrative.showStepList ? stepLabels.map((lbl, i) => {
                const n = i + 1; const on = n === step
                const op = on ? 1 : n < step ? 0.5 : 0.28
                const chapType = { ...typography.smallPrintFont, fontSize: "9px", textTransform: "uppercase" as const, lineHeight: "1.2em" }
                return (
                    <div key={lbl} style={{ display: "flex", gap: 5, alignItems: "baseline", opacity: op }}>
                        <span style={{ ...chapType, letterSpacing: "0.14em", color: on ? colors.accent : colors.textSecondary }}>{String(n).padStart(2, "0")}</span>
                        <span style={{ ...chapType, letterSpacing: "0.1em", color: on ? colors.textPrimary : colors.textSecondary }}>{lbl}</span>
                    </div>
                )
            }) : null}
            <div role="progressbar" aria-label="Form progress" aria-valuemin={1} aria-valuemax={4} aria-valuenow={step} style={HIDDEN} />
        </div>
    )

    const estBase = {
        total: estimate.total, lo: submission.rangeLowPercent, hi: submission.rangeHighPercent, sym: submission.currencySymbol,
        freeze: !motionOk, spring, color: colors.textPrimary, font: typography.titleFont,
        announce: accessibility.announceEstimateRange,
    }
    const estStage = estBase
    const ring = { onFocus: (e: FocusEvent<HTMLElement>) => focusRing(e.currentTarget, colors.focusRingColor, true), onBlur: (e: FocusEvent<HTMLElement>) => focusRing(e.currentTarget, colors.focusRingColor, false) }
    const intentKeys = step1.intentOptions.map((o) => o.key)
    const timelineKeys = step3.timelineBucketOptions.map((o) => o.key)
    const primaryLabel = submitting && step === 4 ? step4.submittingButtonLabel : active.primaryButtonLabel
    const stepLive = accessibility.announceStepChanges && !submitted ? `Step ${step} of 4: ${active.screenTitle}` : ""
    const needConsent = step4.showContactFields || Boolean(webhook)

    const rootStyle: CSSProperties = {
        height: "auto", position: "relative",
        overflowX: "hidden", overflowY: "visible",
        display: "flex", flexDirection: "column", alignItems: "stretch", gap: secGap,
        padding: rootPad,
        border: faintRule(colors.border),
        borderRadius: layout.borderRadius,
        backgroundColor: colors.backgroundColor,
        backgroundImage: `radial-gradient(ellipse 90% 80% at 28% 22%, color-mix(in srgb, ${colors.accent} 16%, transparent), rgba(3, 5, 10, 0.55) 58%)`,
        backdropFilter: "blur(28px) saturate(1.08)",
        WebkitBackdropFilter: "blur(28px) saturate(1.08)",
        WebkitTapHighlightColor: "transparent",
        ...style,
        width: "100%", maxWidth: "100%", minWidth: "100%",
        alignSelf: "stretch", boxSizing: "border-box",
    }

    const renderStepContent = () => {
        if (step === 1 && !(step1.hideSingleOptionPicker && step1.intentOptions.length <= 1)) {
            const errId = "intent-error"
            return (
                <div role="radiogroup" aria-labelledby="step-title" aria-describedby={triedNext && errors.intent ? errId : undefined}
                    onKeyDown={(e) => handleRadioKeys(e, intentKeys, String(form.intent ?? ""), (k) => { patch("intent", k); if (triedNext) clearErr("intent") }, (k) => focusRadio(`intent-${k}`))}
                    style={{ display: "flex", flexDirection: "column", gap: fldGap, marginTop: secGap * 0.35 }}>
                    {step1.intentOptions.map((o, i) => (
                        <RadioTile key={o.key} id={`intent-${o.key}`} label={o.title} helper={o.helperText}
                            selected={form.intent === o.key} tabIndex={(form.intent === o.key || (!form.intent && i === 0)) ? 0 : -1}
                            onSelect={() => { patch("intent", o.key); if (triedNext) clearErr("intent") }}
                            setRef={(el) => { radioRefs.current[`intent-${o.key}`] = el }}
                            colors={colors} font={typography.cardFont}
                            rule={i < step1.intentOptions.length - 1} />
                    ))}
                    {triedNext && errors.intent ? errAlert(errId, errors.intent, typography.smallPrintFont) : null}
                </div>
            )
        }
        if (step === 2) {
            return (
                <div style={{ display: "flex", flexDirection: "column", gap: secGap, marginTop: secGap * 0.5 }}>
                    {step2.quantityFields.map((f, qi) => {
                        const inputId = `qty-${f.key}`
                        const helpId = `${inputId}-help`
                        const errId = `${inputId}-error`
                        const val = (form[f.key] as number | undefined) ?? f.defaultValue
                        const invalid = triedNext && Boolean(errors[f.key])
                        const describedBy = [f.helperText ? helpId : "", invalid ? errId : ""].filter(Boolean).join(" ") || undefined
                        const span = f.max - f.min
                        const pct = span <= 0 ? 0 : Math.max(0, Math.min(100, ((Number(val) - f.min) / span) * 100))
                        const tick: CSSProperties = { ...typography.smallPrintFont, color: colors.textSecondary, fontVariantNumeric: "tabular-nums", fontSize: 12, lineHeight: 1.2 }
                        const r = Math.min(layout.borderRadius, 4)
                        const setQty = (n: number) => { patch(f.key, snapQty(n, f.min, f.max, f.step)); if (triedNext) clearErr(f.key) }
                        return (
                            <div key={f.key} style={{ display: "flex", flexDirection: "column", gap: fldGap * 0.4, padding: `${fldGap * 0.35}px 0`, borderBottom: qi < step2.quantityFields.length - 1 ? faintRule(colors.border) : "none" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12 }}>
                                    <label htmlFor={inputId} style={{ ...typography.labelFont, color: colors.textPrimary }}>{f.label}</label>
                                    <span style={{ ...tick, color: colors.textPrimary, fontWeight: 500 }}>{val}</span>
                                </div>
                                {step2.quantityControlType === "slider" ? (
                                    <div style={{ width: "100%" }}>
                                        <div style={{ position: "relative", height: 32, width: "100%" }}>
                                            <div aria-hidden style={{ position: "absolute", left: 0, right: 0, top: "50%", transform: "translateY(-50%)", height: 1, borderRadius: r, pointerEvents: "none", backgroundImage: `linear-gradient(90deg, transparent 0%, ${colors.textPrimary} 22%, ${colors.textPrimary} 78%, transparent 100%)`, opacity: 0.16 }} />
                                            <div aria-hidden style={{ position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)", width: `${pct}%`, height: 1, borderRadius: r, pointerEvents: "none", backgroundColor: colors.accent, opacity: 0.45 }} />
                                            <div aria-hidden style={{ position: "absolute", top: "50%", left: `calc((100% - ${QI_THUMB}px) * ${pct / 100})`, width: QI_THUMB, height: QI_THUMB, transform: "translateY(-50%)", borderRadius: r, backgroundColor: colors.textPrimary, border: `1px solid ${colors.border}`, boxSizing: "border-box", pointerEvents: "none" }} />
                                            <input type="range" id={inputId} min={f.min} max={f.max} step={f.step} value={Number(val)} aria-invalid={invalid} aria-describedby={describedBy}
                                                onInput={(e) => setQty(Number((e.target as HTMLInputElement).value))}
                                                onChange={(e) => setQty(Number(e.target.value))}
                                                style={{ position: "absolute", inset: 0, zIndex: 2, width: "100%", height: "100%", margin: 0, opacity: 0, cursor: "pointer", touchAction: "none" }} {...ring} />
                                        </div>
                                        <div aria-hidden style={{ display: "flex", justifyContent: "space-between", marginTop: 2 }}>
                                            <span style={tick}>{f.min}</span><span style={tick}>{f.max}</span>
                                        </div>
                                    </div>
                                ) : (
                                    <input type="number" id={inputId} min={f.min} max={f.max} step={f.step} value={val} aria-invalid={invalid} aria-describedby={describedBy}
                                        onChange={(e) => setQty(Number(e.target.value))}
                                        style={{ ...typography.inputFont, padding: "12px 16px", borderRadius: layout.borderRadius, border: `1px solid ${colors.border}`, backgroundColor: colors.cardBackground, color: colors.textPrimary }} {...ring} />
                                )}
                                {f.helperText ? <div id={helpId} style={{ ...typography.smallPrintFont, color: colors.textSecondary }}>{f.helperText}</div> : null}
                                {invalid ? errAlert(errId, errors[f.key], typography.smallPrintFont) : null}
                            </div>
                        )
                    })}
                </div>
            )
        }
        if (step === 3) {
            const tlErrId = "timeline-error"
            const rushId = "rush-toggle"
            const rushHelpId = "rush-help"
            return (
                <div style={{ display: "flex", flexDirection: "column", gap: secGap, marginTop: secGap * 0.5 }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: fldGap * 0.5 }}>
                        <span id="timeline-label" style={{ ...typography.labelFont, color: colors.textPrimary }}>{step3.timelineBucketLabel}</span>
                        {step3.timelineBucketHelper ? <div style={{ ...typography.smallPrintFont, color: colors.textSecondary }}>{step3.timelineBucketHelper}</div> : null}
                        <div role="radiogroup" aria-labelledby="timeline-label" aria-describedby={triedNext && errors.timeline ? tlErrId : undefined}
                            onKeyDown={(e) => handleRadioKeys(e, timelineKeys, String(form.timeline ?? ""), (k) => { patch("timeline", k); if (triedNext) clearErr("timeline") }, (k) => focusRadio(`timeline-${k}`))}
                            style={{ display: "flex", flexDirection: "column", gap: fldGap }}>
                            {step3.timelineBucketOptions.map((o, i) => (
                                <RadioTile key={o.key} id={`timeline-${o.key}`} label={o.label}
                                    selected={form.timeline === o.key} tabIndex={(form.timeline === o.key || (!form.timeline && i === 0)) ? 0 : -1}
                                    onSelect={() => { patch("timeline", o.key); if (triedNext) clearErr("timeline") }}
                                    setRef={(el) => { radioRefs.current[`timeline-${o.key}`] = el }}
                                    colors={colors} font={typography.cardFont}
                                    rule={i < step3.timelineBucketOptions.length - 1} />
                            ))}
                        </div>
                        {triedNext && errors.timeline ? errAlert(tlErrId, errors.timeline, typography.smallPrintFont) : null}
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: fldGap * 0.5 }}>
                        <label htmlFor={rushId} style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}>
                            <input type="checkbox" id={rushId} checked={Boolean(form.rush)} aria-describedby={rushHelpId}
                                onChange={(e) => patch("rush", e.target.checked)} style={{ width: 18, height: 18, accentColor: colors.accent }} />
                            <span style={{ ...typography.labelFont, color: colors.textPrimary }}>{step3.rushToggleLabel}</span>
                        </label>
                        {step3.rushToggleHelper ? <div id={rushHelpId} style={{ ...typography.smallPrintFont, color: colors.textSecondary, paddingLeft: 30 }}>{step3.rushToggleHelper}</div> : null}
                    </div>
                </div>
            )
        }
        if (step === 4 && step4.showContactFields) {
            const inputStyle: CSSProperties = {
                ...typography.inputFont, padding: "12px 16px", borderRadius: layout.borderRadius,
                border: `1px solid ${colors.border}`, backgroundColor: colors.cardBackground, color: colors.textPrimary,
                fontSize: undefined, width: "100%", boxSizing: "border-box", maxWidth: "100%",
            }
            const emailInvalid = triedNext && Boolean(errors.email)
            return (
                <div style={{ display: "flex", flexDirection: "column", gap: secGap, marginTop: secGap * 0.5 }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: fldGap * 0.5 }}>
                        <label htmlFor="contact-email" style={{ ...typography.labelFont, color: colors.textPrimary }}>{step4.emailLabel}</label>
                        {step4.emailHelper ? <div id="contact-email-help" style={{ ...typography.smallPrintFont, color: colors.textSecondary }}>{step4.emailHelper}</div> : null}
                        <input type="email" id="contact-email" autoComplete="email" value={String(form.email ?? "")} placeholder="your@email.com" aria-invalid={emailInvalid}
                            aria-describedby={emailInvalid ? "contact-email-error" : step4.emailHelper ? "contact-email-help" : undefined}
                            onChange={(e) => { patch("email", e.target.value); if (triedNext) clearErr("email") }} style={inputStyle} {...ring} />
                        {emailInvalid ? errAlert("contact-email-error", errors.email, typography.smallPrintFont) : null}
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: fldGap * 0.5 }}>
                        <label htmlFor="contact-note" style={{ ...typography.labelFont, color: colors.textPrimary }}>{step4.noteLabel}</label>
                        <textarea id="contact-note" rows={4} value={String(form.note ?? "")} onChange={(e) => patch("note", e.target.value)} style={{ ...inputStyle, resize: "vertical" }} {...ring} />
                    </div>
                    <div style={{ ...typography.smallPrintFont, color: colors.textSecondary, opacity: 0.75, maxWidth: "40em" }}>{step4.disclaimerText}</div>
                    <label htmlFor="contact-consent" style={{ display: "flex", alignItems: "flex-start", gap: 12, cursor: "pointer", ...typography.smallPrintFont, color: colors.textPrimary }}>
                        <input type="checkbox" id="contact-consent" checked={Boolean(form.consent)} aria-invalid={triedNext && Boolean(errors.consent)}
                            aria-describedby={step4.consentCheckboxHelper ? "contact-consent-help" : undefined}
                            onChange={(e) => { patch("consent", e.target.checked); if (triedNext) clearErr("consent") }} style={{ width: 18, height: 18, marginTop: 2, accentColor: colors.accent }} />
                        <span>{step4.consentCheckboxLabel}</span>
                    </label>
                    {step4.consentCheckboxHelper ? <div id="contact-consent-help" style={{ ...typography.smallPrintFont, color: colors.textSecondary, paddingLeft: 30 }}>{step4.consentCheckboxHelper}</div> : null}
                    {triedNext && errors.consent ? errAlert("contact-consent-error", errors.consent, typography.smallPrintFont) : null}
                </div>
            )
        }
        if (step === 4) {
            const stagger = Math.min(0.08, submission.breakdownStaggerMs / 1000)
            return (
                <div style={{ display: "flex", flexDirection: "column", gap: secGap * 1.25, marginTop: secGap * 0.5 }}>
                    {submission.showLineBreakdown ? (
                        <div style={{ display: "flex", flexDirection: "column", gap: fldGap * 0.45, paddingTop: secGap * 0.5, borderTop: faintRule(colors.border) }}>
                            <div style={{ ...typography.smallPrintFont, color: colors.textSecondary, textTransform: "uppercase", fontSize: "10px", opacity: 0.45 }}>Line breakdown</div>
                            {estimate.lines.map((line, i) => {
                                const row = (
                                    <div style={{ display: "flex", justifyContent: "space-between", gap: 16, ...typography.smallPrintFont, color: colors.textSecondary, opacity: 0.65, minWidth: 0 }}>
                                        <span style={{ minWidth: 0, overflowWrap: "anywhere" }}>{line.label}</span>
                                        <span style={{ fontWeight: 500, fontVariantNumeric: "tabular-nums", flexShrink: 0 }}>{submission.currencySymbol}{line.contributionAfterMultipliers.toLocaleString()}</span>
                                    </div>
                                )
                                return motionOk ? (
                                    <motion.div
                                        key={line.quantityFieldKey}
                                        initial={{ opacity: 0, transform: "translateY(4px)" }}
                                        animate={{ opacity: 1, transform: "translateY(0px)" }}
                                        transition={{ delay: i * stagger, ...ENTER_TRANSITION }}
                                    >{row}</motion.div>
                                ) : <div key={line.quantityFieldKey}>{row}</div>
                            })}
                        </div>
                    ) : null}
                    <div style={{ display: "flex", flexDirection: "column", gap: fldGap * 0.45, paddingTop: secGap * 0.5, borderTop: faintRule(colors.border) }}>
                        <div style={{ ...typography.smallPrintFont, color: colors.textSecondary, textTransform: "uppercase", letterSpacing: "0.12em", fontSize: "10px", opacity: 0.45 }}>Selection</div>
                        {step1.intentOptions.filter((o) => o.key === form.intent).map((o) => (
                            <div key="intent" style={{ display: "flex", justifyContent: "space-between", gap: 16, ...typography.smallPrintFont, color: colors.textSecondary, opacity: 0.55, minWidth: 0 }}>
                                <span style={{ flexShrink: 0 }}>Project type</span><span style={{ fontWeight: 500, color: colors.textPrimary, opacity: 0.85, textAlign: "right", minWidth: 0, overflowWrap: "anywhere" }}>{o.title}</span>
                            </div>
                        ))}
                        {step2.quantityFields.map((f) => (
                            <div key={f.key} style={{ display: "flex", justifyContent: "space-between", gap: 16, ...typography.smallPrintFont, color: colors.textSecondary, opacity: 0.55, minWidth: 0 }}>
                                <span style={{ minWidth: 0, overflowWrap: "anywhere" }}>{f.label}</span><span style={{ fontWeight: 500, fontVariantNumeric: "tabular-nums", color: colors.textPrimary, opacity: 0.85, flexShrink: 0 }}>{String(form[f.key] ?? f.defaultValue)}</span>
                            </div>
                        ))}
                    </div>
                    {needConsent && !step4.showContactFields ? (
                        <div style={{ display: "flex", flexDirection: "column", gap: fldGap * 0.45, paddingTop: secGap * 0.5, borderTop: faintRule(colors.border) }}>
                            <label htmlFor="review-consent" style={{ display: "flex", alignItems: "flex-start", gap: 12, cursor: "pointer", ...typography.smallPrintFont, color: colors.textPrimary }}>
                                <input type="checkbox" id="review-consent" checked={Boolean(form.consent)} aria-invalid={triedNext && Boolean(errors.consent)}
                                    aria-describedby={step4.consentCheckboxHelper ? "review-consent-help" : undefined}
                                    onChange={(e) => { patch("consent", e.target.checked); if (triedNext) clearErr("consent") }} style={{ width: 18, height: 18, marginTop: 2, accentColor: colors.accent }} />
                                <span>{step4.consentCheckboxLabel}</span>
                            </label>
                            {step4.consentCheckboxHelper ? <div id="review-consent-help" style={{ ...typography.smallPrintFont, color: colors.textSecondary, paddingLeft: 30 }}>{step4.consentCheckboxHelper}</div> : null}
                            {triedNext && errors.consent ? errAlert("review-consent-error", errors.consent, typography.smallPrintFont) : null}
                        </div>
                    ) : null}
                </div>
            )
        }
        return null
    }

    // ZoomImageIntro pattern: plain styled tree when static / thumbnail — no motion mounts
    if (isStatic || isThumbnail) {
        const { text: estText } = formatRange(estimate.total, submission.rangeLowPercent, submission.rangeHighPercent, submission.currencySymbol)
        return (
            <div ref={rootRef} role="region" aria-label={isOnCanvas ? "Quote intake (canvas preview)" : (narrative.ariaLabel || narrative.productTitle)} style={rootStyle}>
                <div aria-hidden="true" style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0, backgroundImage: NOISE, opacity: 0.035, mixBlendMode: "overlay" }} />
                <header style={{
                    position: "relative", zIndex: 1, width: "100%", display: "flex", flexDirection: "row",
                    alignItems: "flex-end", justifyContent: "space-between", gap: 28, paddingBottom: 28, borderBottom: faintRule(colors.border),
                }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10, minWidth: 0, flex: "1 1 auto", flexShrink: 0 }}>
                        <span style={{ ...typography.smallPrintFont, color: colors.accent, textTransform: "uppercase" as const, letterSpacing: "0.28em" }}>{narrative.productTitle}</span>
                        <EstimateText text={estText} color={colors.textPrimary} font={typography.titleFont} announce={false} />
                        <div style={{ ...typography.labelFont, color: colors.textSecondary, fontSize: "13px", lineHeight: 1.5, maxWidth: "34em", opacity: 0.72 }}>{narrative.supportingLine}</div>
                    </div>
                    {narrative.showStepList ? <div style={{ flexShrink: 1, minWidth: 0, paddingBottom: 6 }}>{renderProgress(true)}</div> : null}
                </header>
                <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", gap: secGap, width: "100%", minWidth: 0 }}>
                    {narrative.previewImageUrl.trim() ? <img src={narrative.previewImageUrl} alt={narrative.previewImageAlt} style={{ width: "100%", maxHeight: 140, objectFit: "cover", marginBottom: fldGap, opacity: 0.85 }} /> : null}
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        <h2 id="step-title" style={{ ...typography.titleFont, color: colors.textPrimary, fontSize: stepTitleSize, letterSpacing: "-0.04em", lineHeight: 1.1, maxWidth: "18em", margin: 0, fontWeight: typography.titleFont.fontWeight ?? 300 }}>{active.screenTitle}</h2>
                        <div style={{ ...typography.labelFont, color: colors.textSecondary, fontSize: labelSize, maxWidth: "40em", lineHeight: 1.55, opacity: 0.85 }}>{active.screenSubtitle}</div>
                    </div>
                    {renderStepContent()}
                    <div style={{
                        display: "flex", flexDirection: "row-reverse", alignItems: "center", justifyContent: "space-between",
                        gap: fldGap, marginTop: 4, paddingTop: secGap * 0.65, borderTop: faintRule(colors.border), width: "100%",
                    }}>
                        <button type="button" disabled style={{ ...primaryCtaStyle, width: "auto", minWidth: 132, opacity: 0.9 }}>{active.primaryButtonLabel}</button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div ref={rootRef} role="region" aria-label={narrative.ariaLabel || narrative.productTitle} style={rootStyle}>
            <div aria-hidden="true" style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0, backgroundImage: NOISE, opacity: 0.035, mixBlendMode: "overlay" }} />
            <header style={{
                position: "relative", zIndex: 1, width: "100%",
                display: "flex", flexDirection: "row",
                alignItems: "flex-end",
                justifyContent: "space-between",
                gap: 28,
                paddingBottom: 28,
                borderBottom: faintRule(colors.border),
            }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 10, minWidth: 0, flex: "1 1 auto", flexShrink: 0 }}>
                    <span style={{ ...typography.smallPrintFont, color: colors.accent, textTransform: "uppercase" as const, letterSpacing: "0.28em" }}>{narrative.productTitle}</span>
                    <EstimateRange key={estGen} {...estStage} />
                    <div style={{ ...typography.labelFont, color: colors.textSecondary, fontSize: "13px", lineHeight: 1.5, maxWidth: "34em", opacity: 0.72 }}>{narrative.supportingLine}</div>
                </div>
                {!submitted && narrative.showStepList ? (
                    <div style={{ flexShrink: 1, minWidth: 0, paddingBottom: 6 }}>{renderProgress(true)}</div>
                ) : null}
            </header>
            <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", width: "100%", minWidth: 0 }}>
                {stepLive ? <div aria-live="polite" aria-atomic="true" style={HIDDEN}>{stepLive}</div> : null}
                {narrative.previewImageUrl.trim() ? <img src={narrative.previewImageUrl} alt={narrative.previewImageAlt} style={{ width: "100%", maxHeight: 140, objectFit: "cover", marginBottom: fldGap, opacity: 0.85 }} /> : null}
                <AnimatePresence mode="wait" initial={false}>
                    {submitted ? (
                        <motion.div key="success" {...bodyMotion} style={{ display: "flex", flexDirection: "column", gap: secGap * 1.25, width: "100%", minWidth: 0 }}>
                            <div style={{ ...typography.smallPrintFont, color: colors.accent, textTransform: "uppercase" as const, letterSpacing: "0.18em" }}>Confirmed</div>
                            <div style={{ ...typography.titleFont, color: colors.textPrimary, fontSize: "44px", letterSpacing: "-0.045em" }}>{submission.successScreenCopy.screenTitle}</div>
                            <div style={{ ...typography.labelFont, color: colors.textSecondary, maxWidth: "32em" }}>{submission.successScreenCopy.screenSubtitle}</div>
                            <div style={{ display: "flex", flexDirection: "column", gap: fldGap, paddingTop: secGap * 0.5, borderTop: faintRule(colors.border) }}>
                                {[submission.successScreenCopy.nextStep1Text, submission.successScreenCopy.nextStep2Text, submission.successScreenCopy.nextStep3Text].filter(Boolean).map((txt, i) => motionOk ? (
                                    <motion.div key={txt} initial={{ opacity: 0, transform: "translateY(4px)" }} animate={{ opacity: 0.88, transform: "translateY(0px)" }} transition={{ ...ENTER_TRANSITION, delay: i * 0.05 }}
                                        style={{ ...typography.labelFont, color: colors.textPrimary, display: "flex", gap: 14, fontSize: "14px" }}><span style={{ color: colors.accent }}>→</span><span style={{ minWidth: 0, overflowWrap: "anywhere" }}>{txt}</span></motion.div>
                                ) : (
                                    <div key={txt} style={{ ...typography.labelFont, color: colors.textPrimary, display: "flex", gap: 14, fontSize: "14px", opacity: 0.88 }}><span style={{ color: colors.accent }}>→</span><span style={{ minWidth: 0, overflowWrap: "anywhere" }}>{txt}</span></div>
                                ))}
                            </div>
                            <button type="button" onClick={returnToStart} {...ring}
                                style={{ ...primaryCtaStyle, width: "100%", maxWidth: 240, marginTop: fldGap }}>
                                {submission.successScreenCopy.primaryButtonLabel}
                            </button>
                        </motion.div>
                    ) : (
                        <motion.div ref={bodyRef} key={`step-${step}`} {...bodyMotion} style={{
                            display: "flex", flexDirection: "column", gap: secGap, width: "100%", minWidth: 0,
                        }}>
                            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                                {!narrative.showStepList ? (
                                    <div style={{ ...typography.smallPrintFont, color: colors.accent, textTransform: "uppercase" as const, letterSpacing: "0.2em", opacity: 0.8 }}>{chapterNum} — {stepLabels[step - 1]}</div>
                                ) : null}
                                <h2
                                    ref={headingRef}
                                    tabIndex={-1}
                                    id="step-title"
                                    style={{ ...typography.titleFont, color: colors.textPrimary, fontSize: stepTitleSize, outline: "none", letterSpacing: "-0.04em", lineHeight: 1.1, maxWidth: "18em", margin: 0, fontWeight: typography.titleFont.fontWeight ?? 300 }}
                                >{active.screenTitle}</h2>
                                <div style={{ ...typography.labelFont, color: colors.textSecondary, fontSize: labelSize, maxWidth: "40em", lineHeight: 1.55, opacity: 0.85 }}>{active.screenSubtitle}</div>
                            </div>
                            {step === 4 && !step4.showContactFields && step4.disclaimerText ? (
                                <div style={{ ...typography.smallPrintFont, color: colors.textSecondary, opacity: 0.55, maxWidth: "38em", letterSpacing: "0.02em", textTransform: "none" as const }}>{step4.disclaimerText}</div>
                            ) : null}
                            {renderStepContent()}
                            <div style={{
                                display: "flex", flexDirection: "row-reverse",
                                alignItems: "center", justifyContent: "space-between",
                                gap: fldGap, marginTop: 4, paddingTop: secGap * 0.65,
                                borderTop: faintRule(colors.border),
                                width: "100%",
                            }}>
                                <button type="button" onClick={handleNext} disabled={submitting} aria-busy={submitting} aria-disabled={submitting} {...ring}
                                    style={{
                                        ...primaryCtaStyle,
                                        width: "auto",
                                        minWidth: 132,
                                        alignSelf: "flex-end",
                                        cursor: submitting ? "not-allowed" : "pointer",
                                        opacity: submitting ? 0.85 : 1,
                                    }}>
                                    {primaryLabel}
                                </button>
                                {step > 1 ? (
                                    <button type="button" onClick={handleBack} disabled={submitting} aria-disabled={submitting} {...ring}
                                        style={{
                                            ...backCtaStyle,
                                            width: "auto",
                                            cursor: submitting ? "not-allowed" : "pointer",
                                            opacity: submitting ? 0.55 : 1,
                                        }}>
                                        {narrative.backButtonLabel}
                                    </button>
                                ) : null}
                            </div>
                            {step === 4 && submitErr ? errAlert("submit-error", submitErr, typography.smallPrintFont) : null}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )

}

addPropertyControls(Kern_QuoteIntake, {
    step1: {
        type: ControlType.Object, title: "Step 1: Intent", icon: "object",
        controls: {
            screenTitle: { type: ControlType.String, title: "Title", defaultValue: DEFAULT_PROPS.step1.screenTitle },
            screenSubtitle: { type: ControlType.String, title: "Subtitle", defaultValue: DEFAULT_PROPS.step1.screenSubtitle },
            primaryButtonLabel: { type: ControlType.String, title: "Button", defaultValue: DEFAULT_PROPS.step1.primaryButtonLabel },
            intentOptions: {
                type: ControlType.Array, title: "Options", maxCount: 6, defaultValue: DEFAULT_PROPS.step1.intentOptions,
                control: { type: ControlType.Object, controls: {
                    title: { type: ControlType.String, title: "Title", defaultValue: "Marketing site" },
                    key: { type: ControlType.String, title: "Key", defaultValue: "marketing-site" },
                    helperText: { type: ControlType.String, title: "Helper", defaultValue: "Multi-page site with CMS" },
                }},
            },
            hideSingleOptionPicker: { type: ControlType.Boolean, title: "Hide Single", defaultValue: false, enabledTitle: "Yes", disabledTitle: "No" },
        },
    },
    step2: {
        type: ControlType.Object, title: "Step 2: Scope", icon: "object",
        controls: {
            screenTitle: { type: ControlType.String, title: "Title", defaultValue: DEFAULT_PROPS.step2.screenTitle },
            screenSubtitle: { type: ControlType.String, title: "Subtitle", defaultValue: DEFAULT_PROPS.step2.screenSubtitle },
            primaryButtonLabel: { type: ControlType.String, title: "Button", defaultValue: DEFAULT_PROPS.step2.primaryButtonLabel },
            quantityControlType: {
                type: ControlType.Enum, title: "Control", options: ["stepper", "slider"], optionTitles: ["Number", "Slider"],
                defaultValue: "slider", displaySegmentedControl: true,
                description: "Number uses a plain numeric field; Slider uses a range control.",
            },
            quantityFields: {
                type: ControlType.Array, title: "Fields", maxCount: 5, defaultValue: DEFAULT_PROPS.step2.quantityFields,
                control: { type: ControlType.Object, controls: {
                    label: { type: ControlType.String, title: "Label", defaultValue: "Unique page layouts" },
                    key: { type: ControlType.String, title: "Key", defaultValue: "pages" },
                    helperText: { type: ControlType.String, title: "Helper", defaultValue: "Distinct templates" },
                    min: { type: ControlType.Number, title: "Min", defaultValue: 0, min: 0, max: 999, step: 1, displayStepper: true },
                    max: { type: ControlType.Number, title: "Max", defaultValue: 50, min: 1, max: 999, step: 1, displayStepper: true },
                    step: { type: ControlType.Number, title: "Step", defaultValue: 1, min: 1, max: 100, step: 1, displayStepper: true },
                    defaultValue: { type: ControlType.Number, title: "Default", defaultValue: 5, min: 0, max: 999, step: 1, displayStepper: true },
                }},
            },
        },
    },
    step3: {
        type: ControlType.Object, title: "Step 3: Timeline", icon: "object",
        controls: {
            screenTitle: { type: ControlType.String, title: "Title", defaultValue: DEFAULT_PROPS.step3.screenTitle },
            screenSubtitle: { type: ControlType.String, title: "Subtitle", defaultValue: DEFAULT_PROPS.step3.screenSubtitle },
            primaryButtonLabel: { type: ControlType.String, title: "Button", defaultValue: DEFAULT_PROPS.step3.primaryButtonLabel },
            rushToggleLabel: { type: ControlType.String, title: "Rush label", defaultValue: DEFAULT_PROPS.step3.rushToggleLabel },
            timelineBucketOptions: {
                type: ControlType.Array, title: "Timeline", defaultValue: DEFAULT_PROPS.step3.timelineBucketOptions,
                control: { type: ControlType.Object, controls: {
                    label: { type: ControlType.String, title: "Label", defaultValue: "Standard" },
                    key: { type: ControlType.String, title: "Key", defaultValue: "standard" },
                }},
            },
        },
    },
    step4: {
        type: ControlType.Object, title: "Step 4: Review", icon: "interaction",
        controls: {
            screenTitle: { type: ControlType.String, title: "Title", defaultValue: DEFAULT_PROPS.step4.screenTitle },
            showContactFields: {
                type: ControlType.Boolean, title: "Contact", defaultValue: false, enabledTitle: "Show", disabledTitle: "Hide",
                description: "When shown, email is required. Consent is also required whenever a webhook URL is set.",
            },
            disclaimerText: { type: ControlType.String, title: "Disclaimer", defaultValue: DEFAULT_PROPS.step4.disclaimerText, displayTextArea: true },
            primaryButtonLabel: { type: ControlType.String, title: "Button", defaultValue: DEFAULT_PROPS.step4.primaryButtonLabel },
        },
    },
    narrative: {
        type: ControlType.Object, title: "Narrative", icon: "object",
        controls: {
            productTitle: { type: ControlType.String, title: "Title", defaultValue: DEFAULT_PROPS.narrative.productTitle },
            supportingLine: { type: ControlType.String, title: "Supporting", defaultValue: DEFAULT_PROPS.narrative.supportingLine, displayTextArea: true },
            showStepList: { type: ControlType.Boolean, title: "Step list", defaultValue: true, enabledTitle: "Show", disabledTitle: "Hide" },
            backButtonLabel: { type: ControlType.String, title: "Back", defaultValue: DEFAULT_PROPS.narrative.backButtonLabel },
        },
    },
    typography: {
        type: ControlType.Object, title: "Typography", icon: "object",
        controls: {
            titleFont: { type: ControlType.Font, title: "Title", controls: "extended", defaultFontType: "serif", defaultValue: { fontSize: "56px", letterSpacing: "-0.055em", lineHeight: "0.95em" } },
            labelFont: { type: ControlType.Font, title: "Label", controls: "extended", defaultFontType: "sans-serif", defaultValue: { fontSize: "15px", variant: "Regular", letterSpacing: "-0.012em", lineHeight: "1.5em" } },
            cardFont: { type: ControlType.Font, title: "Card", controls: "extended", defaultFontType: "sans-serif", defaultValue: { fontSize: "16px", variant: "Medium", letterSpacing: "-0.02em", lineHeight: "1.3em" } },
            inputFont: { type: ControlType.Font, title: "Input", controls: "extended", defaultFontType: "sans-serif", defaultValue: { fontSize: "15px", variant: "Regular", letterSpacing: "-0.005em", lineHeight: "1.5em" } },
            buttonFont: { type: ControlType.Font, title: "Button", controls: "extended", defaultFontType: "sans-serif", defaultValue: { fontSize: "12px", variant: "Medium", letterSpacing: "0.1em", lineHeight: "1em" } },
            smallPrintFont: { type: ControlType.Font, title: "Small", controls: "extended", defaultFontType: "sans-serif", defaultValue: { fontSize: "11px", variant: "Regular", letterSpacing: "0.08em", lineHeight: "1.5em" } },
        },
    },
    colors: {
        type: ControlType.Object, title: "Theme", icon: "color",
        controls: {
            backgroundColor: {
                type: ControlType.Color, title: "Background", defaultValue: DEFAULT_PROPS.colors.backgroundColor,
                description: "Base panel fill under the accent wash. Use transparent for glass over a page background.",
            },
            cardBackground: { type: ControlType.Color, title: "Card", defaultValue: DEFAULT_PROPS.colors.cardBackground },
            textPrimary: { type: ControlType.Color, title: "Text", defaultValue: DEFAULT_PROPS.colors.textPrimary },
            textSecondary: { type: ControlType.Color, title: "Muted", defaultValue: DEFAULT_PROPS.colors.textSecondary },
            accent: { type: ControlType.Color, title: "Accent", defaultValue: DEFAULT_PROPS.colors.accent },
            border: { type: ControlType.Color, title: "Border", defaultValue: DEFAULT_PROPS.colors.border },
            focusRingColor: { type: ControlType.Color, title: "Focus ring", defaultValue: DEFAULT_PROPS.colors.focusRingColor },
        },
    },
    layout: {
        type: ControlType.Object, title: "Layout", icon: "object",
        description: "Desktop layout only — same chrome at every marked width.",
        controls: {
            borderRadius: { type: ControlType.Number, title: "Radius", defaultValue: 0, min: 0, max: 32, step: 1, unit: "px", displayStepper: true },
            cardPaddingDesktop: { type: ControlType.Number, title: "Padding", defaultValue: DEFAULT_PROPS.layout.cardPaddingDesktop, min: 16, max: 80, step: 4, unit: "px", displayStepper: true },
            sectionGapDesktop: { type: ControlType.Number, title: "Section gap", defaultValue: DEFAULT_PROPS.layout.sectionGapDesktop, min: 12, max: 64, step: 2, unit: "px", displayStepper: true },
            fieldGapDesktop: { type: ControlType.Number, title: "Field gap", defaultValue: DEFAULT_PROPS.layout.fieldGapDesktop, min: 8, max: 32, step: 2, unit: "px", displayStepper: true },
            buttonHeightDesktop: { type: ControlType.Number, title: "Button H", defaultValue: DEFAULT_PROPS.layout.buttonHeightDesktop, min: 36, max: 64, step: 2, unit: "px", displayStepper: true },
        },
    },
    submission: {
        type: ControlType.Object, title: "Formula & summary", icon: "object",
        controls: {
            webhookUrl: {
                type: ControlType.String, title: "Webhook URL", defaultValue: "", placeholder: "https://…",
                description: "POSTs JSON on final submit. Empty URL = local summary only. Consent is required when set.",
            },
            rushMultiplierWhenChecked: { type: ControlType.Number, title: "Rush ×", defaultValue: 1.3, min: 1, max: 3, step: 0.05, displayStepper: true },
            currencySymbol: { type: ControlType.String, title: "Currency", defaultValue: "$" },
            rangeLowPercent: { type: ControlType.Number, title: "Range low", defaultValue: 0.9, min: 0.5, max: 1, step: 0.01, displayStepper: true },
            rangeHighPercent: { type: ControlType.Number, title: "Range high", defaultValue: 1.1, min: 1, max: 2, step: 0.01, displayStepper: true },
            formulaLineItems: {
                type: ControlType.Array, title: "Line items", defaultValue: DEFAULT_PROPS.submission.formulaLineItems,
                control: { type: ControlType.Object, controls: {
                    label: { type: ControlType.String, defaultValue: "Page design and build" },
                    quantityFieldKey: { type: ControlType.String, defaultValue: "pages" },
                    unitPrice: { type: ControlType.Number, title: "Unit price", defaultValue: 500, min: 0, max: 100000, step: 50, displayStepper: true },
                }},
            },
            successScreenCopy: {
                type: ControlType.Object, title: "Summary", icon: "interaction",
                controls: {
                    screenTitle: { type: ControlType.String, title: "Title", defaultValue: DEFAULT_PROPS.submission.successScreenCopy.screenTitle },
                },
            },
        },
    },
})

