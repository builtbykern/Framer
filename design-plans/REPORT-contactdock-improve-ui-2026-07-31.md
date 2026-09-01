# improve-ui — Contact Dock

Written against: `4aa0cbc` · 2026-07-31  
Surface: Marketplace code component `Contact Dock` (`code-components/ContactDock.tsx`) + Home sell canvas on Overly Interaction.

## Design language

- Audited surface: Contact Dock closed orb + open sheet (Book / Email); Home demo eyebrow/caption are page chrome only
- Design sources: `docs/superpowers/specs/2026-07-31-contact-dock-design.md` (accepted v1); Kern accent `#6FD3FF`; glass dark house
- Documented decisions: orb glass + popover sheet; hello + avatar + Book + Email; pulse idle; Font on greeting/name; no WhatsApp
- Governing owners and consumers: `ContactDock.tsx` props / `addPropertyControls`; demo mount via `scripts/framer/contactdock-demo.mjs`
- Explicit exceptions: None documented

## Findings

| # | Problem | Evidence | Proposed change | Scope | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Fallback typeface is Inter, contradicting Kern / spec “avoid Inter-only identity” | Spec Visual language forbids Inter-only identity; runtime `DEFAULT_FONT.fontFamily` is `"Inter, system-ui, sans-serif"` (`ContactDock.tsx` 90–96) applied when Font control omits `fontFamily` (Framer Font `defaultValue` correctly has no family) | Remove `Inter` from `DEFAULT_FONT`; use a neutral stack e.g. `ui-sans-serif, system-ui, sans-serif` so Clash/`setAttributes` or buyer Font can own identity | `ContactDock.tsx` `DEFAULT_FONT` only | High |

### Candidates rejected

- Email row showing raw address vs Book CTA label — Spec Content lists `bookLabel` but no email label; inventing `emailLabel` would invent product intent  
- `outline: none` / focus ring — a11y (out of improve-ui unless requested); tracked in improve-animations #4  
- Sheet blur / glass rgba vs hex Color control quirks — no binding contract that glass must be hex; ambiguous correction  
- Hierarchy / “super visual” polish on open sheet — needs open-state rendered evidence; closed screenshot only available  

## Improve first

**Finding 1** — Inter fallback is a one-line identity leak against the accepted Kern/spec contract, with a deterministic fix.

---

**Stop.** Which finding IDs should become `design-plans/`? (Only #1 survived.)
