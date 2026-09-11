import { addPropertyControls, ControlType } from "framer"
import { type CSSProperties, type ReactElement } from "react"

/**
 * Kern — Sill Skin A (Bruce)
 * Paste into Framer Code. One viewport, ink-on-paper, 50/50 type + still.
 * Demo defaults = Ada Vale only (no BBK SKUs). Do not publish — Noel RED.
 *
 * Craft bar: docs/sill/taste/01-bruce.png (split air, numbered text links, still weight,
 * tight intro leading). Steal — do not clone portfolio/About/SELECTED WORK/square markers.
 * Soulmates only if no still; we have a still → Bruce wins. Critique must name Bruce hold/fail.
 *
 * HARD LOCKS (FAIL = media/sill/desktop-framer-fail.png — Linktree dots, floating photo card,
 * empty cream under still, skinny rail):
 * - Exact 50/50 grid — never a skinny left rail
 * - Right pane = full-bleed still (cover, height 100%, no letterbox / cream void)
 * - Links = `01`–`06` + label ONLY (never · bullets); ~12px gap; bottom-anchored via spacer
 * - Name small/quiet top; heavy tight line; paper #F4F3F0 / ink #000
 * - No vertical divider chrome
 * - Defaults ADA VALE + chair still; max 6 links
 * - Desktop: minHeight 100vh/100dvh, overflow hidden
 */

interface SillLink {
    label: string
    url: string
}

interface KernSillSkinAProps {
    name: string
    line: string
    links: SillLink[]
    still: string
    stillAlt: string
    style?: CSSProperties
}

const PAPER = "#F4F3F0"
const INK = "#000000"
const FONT =
    '"Inter", "Geist", "Helvetica Neue", Helvetica, Arial, sans-serif'
const MAX_LINKS = 6
const CLASS = "kern-sill-skin-a"

const DEFAULT_LINKS: SillLink[] = [
    { label: "Instagram", url: "https://instagram.com" },
    { label: "Shop", url: "https://example.com/shop" },
    { label: "Are.na", url: "https://are.na" },
    { label: "Mail", url: "mailto:hello@example.com" },
    { label: "Notes", url: "https://example.com/notes" },
    { label: "Booking", url: "https://example.com/book" },
]

/** Quiet chair still — not a lifestyle room collage / postcard inset */
const DEFAULT_STILL =
    "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=1600&q=80"

const css = `
.${CLASS} {
  box-sizing: border-box;
  display: grid;
  /* LOCK: exact 50/50 — never skinny left rail / ~30-70 */
  grid-template-columns: minmax(0, 50%) minmax(0, 50%);
  grid-template-rows: minmax(0, 1fr);
  gap: 0;
  column-gap: 0;
  row-gap: 0;
  width: 100%;
  height: 100%;
  min-height: 100vh;
  min-height: 100dvh;
  overflow: hidden;
  background: ${PAPER};
  color: ${INK};
  font-family: ${FONT};
  border: none;
  outline: none;
  box-shadow: none;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}
.${CLASS} *,
.${CLASS} *::before,
.${CLASS} *::after {
  box-sizing: border-box;
}
.${CLASS} a {
  color: inherit;
  text-decoration: none;
}
.${CLASS} ul {
  list-style: none;
  list-style-type: none;
  margin: 0;
  padding: 0;
}
.${CLASS} li::marker {
  content: "";
  display: none;
}
.${CLASS}__type {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-self: stretch;
  height: 100%;
  min-width: 0;
  min-height: 0;
  padding: 52px;
  /* LOCK: no vertical divider / column rule chrome */
  border: none;
  border-right: none;
  outline: none;
  box-shadow: none;
  background: ${PAPER};
}
/* Bruce: quiet name — small, all caps, light tracking */
.${CLASS}__name {
  margin: 0;
  flex: 0 0 auto;
  font-size: 13px;
  font-weight: 400;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  font-variant-caps: all-small-caps;
  line-height: 1.2;
}
/* Bruce: heavy line, tight leading — dense ink block, not airy marketing copy */
.${CLASS}__line {
  margin: 28px 0 0;
  flex: 0 0 auto;
  max-width: 18ch;
  font-size: 34px;
  font-weight: 700;
  letter-spacing: -0.025em;
  line-height: 1.08;
}
/* Bruce editorial air between intro + links; also locks bottom-anchor (anti mid-rail float) */
.${CLASS}__spacer {
  flex: 1 1 auto;
  min-height: 48px;
  width: 100%;
  pointer-events: none;
}
.${CLASS}__list {
  flex: 0 0 auto;
  margin: 0;
  padding: 0;
}
.${CLASS}__list ul {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.${CLASS}__row {
  display: grid;
  /* LOCK: 01 + label only — never · / bullet prefix */
  grid-template-columns: 2.5ch 1fr;
  column-gap: 12px;
  align-items: baseline;
  font-size: 17px;
  font-weight: 500;
  line-height: 1.25;
  width: fit-content;
}
.${CLASS}__num {
  font-variant-numeric: tabular-nums;
  font-weight: 400;
  transition: font-weight 120ms ease;
}
.${CLASS}__label {
  transition: text-decoration-color 120ms ease;
  text-decoration: underline;
  text-decoration-color: transparent;
  text-underline-offset: 0.22em;
  text-decoration-thickness: 1px;
}
.${CLASS}__row:hover .${CLASS}__num,
.${CLASS}__row:focus-visible .${CLASS}__num {
  font-weight: 700;
}
.${CLASS}__row:hover .${CLASS}__label,
.${CLASS}__row:focus-visible .${CLASS}__label {
  text-decoration-color: ${INK};
}
.${CLASS}__row:focus-visible {
  outline: 1px solid ${INK};
  outline-offset: 4px;
}
.${CLASS}__still {
  position: relative;
  align-self: stretch;
  height: 100%;
  min-height: 0;
  min-width: 0;
  overflow: hidden;
  padding: 0;
  margin: 0;
  /* LOCK: no postcard inset / letterbox / cream void under image */
  border: none;
  border-left: none;
  outline: none;
  box-shadow: none;
  background: ${PAPER};
}
.${CLASS}__still img {
  position: absolute;
  inset: 0;
  display: block;
  width: 100%;
  height: 100%;
  max-width: none;
  max-height: none;
  object-fit: cover;
  object-position: center;
  border-radius: 0;
  border: none;
}
.${CLASS}__still-empty {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  background: ${PAPER};
}
@media (max-width: 768px) {
  .${CLASS} {
    grid-template-columns: minmax(0, 1fr);
    grid-template-rows: auto minmax(42vh, 52vh);
    height: auto;
    min-height: 100vh;
    min-height: 100dvh;
    overflow: auto;
  }
  .${CLASS}__type {
    height: auto;
    min-height: 48vh;
    padding: 32px 24px 36px;
  }
  .${CLASS}__line {
    font-size: 28px;
    max-width: 22ch;
    line-height: 1.1;
  }
  .${CLASS}__row {
    font-size: 16px;
  }
  .${CLASS}__still {
    height: 100%;
    min-height: 42vh;
  }
}
`

function padIndex(index: number): string {
    return String(index + 1).padStart(2, "0")
}

function normalizeLinks(links: SillLink[] | undefined): SillLink[] {
    if (!Array.isArray(links)) return DEFAULT_LINKS
    return links
        .slice(0, MAX_LINKS)
        .map((item) => ({
            label:
                typeof item?.label === "string" && item.label.length > 0
                    ? item.label
                    : "Link",
            url: typeof item?.url === "string" ? item.url : "",
        }))
}

/**
 * @framerSupportedLayoutWidth any-prefer-fixed
 * @framerSupportedLayoutHeight any-prefer-fixed
 * @framerIntrinsicWidth 1440
 * @framerIntrinsicHeight 900
 */
export default function Kern_SillSkinA(
    props: KernSillSkinAProps
): ReactElement {
    const name =
        typeof props.name === "string" && props.name.length > 0
            ? props.name
            : "ADA VALE"
    const line =
        typeof props.line === "string" && props.line.length > 0
            ? props.line
            : "Independent designer. Visual identity, web, and a shop."
    const links = normalizeLinks(props.links)
    const still =
        typeof props.still === "string" && props.still.length > 0
            ? props.still
            : DEFAULT_STILL
    const stillAlt =
        typeof props.stillAlt === "string" && props.stillAlt.length > 0
            ? props.stillAlt
            : "Studio still, chair and daylight"

    return (
        <div className={CLASS} style={props.style}>
            <style>{css}</style>
            <section className={`${CLASS}__type`} aria-label="Identity">
                <p className={`${CLASS}__name`}>{name}</p>
                <p className={`${CLASS}__line`}>{line}</p>
                <div className={`${CLASS}__spacer`} aria-hidden="true" />
                <nav className={`${CLASS}__list`} aria-label="Links">
                    <ul>
                        {links.map((link, index) => {
                            const content = (
                                <>
                                    <span
                                        className={`${CLASS}__num`}
                                        aria-hidden="true"
                                    >
                                        {padIndex(index)}
                                    </span>
                                    <span className={`${CLASS}__label`}>
                                        {link.label}
                                    </span>
                                </>
                            )

                            return (
                                <li key={`${padIndex(index)}-${link.label}`}>
                                    {link.url ? (
                                        <a
                                            className={`${CLASS}__row`}
                                            href={link.url}
                                        >
                                            {content}
                                        </a>
                                    ) : (
                                        <span className={`${CLASS}__row`}>
                                            {content}
                                        </span>
                                    )}
                                </li>
                            )
                        })}
                    </ul>
                </nav>
            </section>
            <section className={`${CLASS}__still`} aria-label="Still">
                {still ? (
                    <img src={still} alt={stillAlt} />
                ) : (
                    <div
                        className={`${CLASS}__still-empty`}
                        aria-hidden="true"
                    />
                )}
            </section>
        </div>
    )
}

Kern_SillSkinA.displayName = "Kern Sill Skin A"

addPropertyControls(Kern_SillSkinA, {
    name: {
        type: ControlType.String,
        title: "Name",
        defaultValue: "ADA VALE",
    },
    line: {
        type: ControlType.String,
        title: "Line",
        defaultValue: "Independent designer. Visual identity, web, and a shop.",
        displayTextArea: true,
    },
    links: {
        type: ControlType.Array,
        title: "Links",
        maxCount: MAX_LINKS,
        control: {
            type: ControlType.Object,
            controls: {
                label: {
                    type: ControlType.String,
                    title: "Label",
                    defaultValue: "Instagram",
                },
                url: {
                    type: ControlType.Link,
                    title: "URL",
                    defaultValue: "https://instagram.com",
                },
            },
        },
        defaultValue: DEFAULT_LINKS,
    },
    still: {
        type: ControlType.Image,
        title: "Still",
        defaultValue: DEFAULT_STILL,
    },
    stillAlt: {
        type: ControlType.String,
        title: "Alt",
        defaultValue: "Studio still, chair and daylight",
    },
})
