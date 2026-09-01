# Link style coherence review — Arbour (2026-07-16)

Read-only scan of all routes + Nav/Footer masters.

## Link families in use

| Family | Mechanism | Intended look |
| --- | --- | --- |
| Text CTA | `Arbour_UnderlineLink` | Space Mono Meta caps + animated underline |
| Solid CTA | `Arbour_PrimaryButton` / `Arbour_FormButton` | Filled Racing Deep button |
| Chrome nav | Nav / Footer linked text | Ink / Ink Soft |
| Detail back | Frame + `Arbour/Meta` label | Meta + border chip |
| Inline body | RichText `link` | Body / preset on parent |

## Inconsistencies

### 1. UnderlineLink color not unified
| Instance | Color |
| --- | --- |
| Home `EXPLORE →`, `VIEW ALL →` | Olive hard `rgb(84, 98, 45)` |
| About `SPEAK WITH US →` | Olive **token** `var(--token-a16d0333-…)` |
| Home `VIEW →` | Ink `rgb(28, 27, 22)` (+ `decorative` true on Desktop/Tablet; Phone `decorative` false) |

Same component, three color treatments.

### 2. Detail “back” labels diverge
| Surface | Return Label |
| --- | --- |
| Property `Back to Properties` | Meta + Olive `rgb(84, 98, 45)` |
| Journal `Back to Journal` | Meta + Ink Soft `rgba(28, 27, 22, 0.55)` |

Same pattern (Meta + border frame); different ink.

### 3. Footer nav vs UnderlineLink
Footer route links: Ink `rgb(28, 27, 22)`, often **no** `Arbour/Meta` preset. UnderlineLink CTAs: Olive Meta + underline. Different families — OK if intentional chrome vs CTA; not OK if all “links” should match UnderlineLink.

## Aligned / OK
- UnderlineLink geometry: `line=1`, `offset=4` everywhere
- PrimaryButton fills shared Racing Deep / Paper text
- Nav socials consistently Ink Soft Tags
- Contact mailto body uses Ink Body (inline, not CTA)

## Recommended owner (if unifying CTAs)
- Text CTAs → `Arbour_UnderlineLink` with Olive **token** for text+underline (match About)
- Detail back labels → Olive Meta (match Property detail)
- Leave Nav/Footer chrome as Ink family unless product wants CTA treatment there

## Status

Executed 2026-07-16 via Framer:
- Home UnderlineLinks (`LPN9f_OPd`, `IdwyBx4Vz`, `h0vfeOTBw`) → Olive token text+underline
- Journal Return Label `bk4wPgyNv` → `rgb(84, 98, 45)` Meta (match Property)
- Nav/Footer chrome left Ink
- Unpublished