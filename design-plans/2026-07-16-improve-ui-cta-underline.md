# Improve UI — Text CTAs without UnderlineLink (2026-07-16)

Read-only. No product edits.

## Design language
- Audited surface: Arbour — site-wide text CTAs (trailing `→`) across marketing, listing, detail, contact, 404
- Design sources: `Arbour_UnderlineLink` exemplars after link unification — Home `LPN9f_OPd` / `IdwyBx4Vz` / `h0vfeOTBw`, About `qU1PSkRMG` (`SPEAK WITH US →`); Olive token `var(--token-a16d0333-…)`; `line=1`, `offset=4`
- Documented decisions: Text CTAs use UnderlineLink + Olive token on Paper; Nav/Footer chrome stay Ink; solid CTAs use `Arbour_PrimaryButton` / `Arbour_FormButton`; `/404` cinematic exception
- Governing owners and consumers: `Arbour_UnderlineLink` for editorial `→` CTAs; Primary/Form for filled buttons
- Explicit exceptions: `/404` shell; Nav/Footer Ink links; detail back chips (Meta + border); solid buttons; CMS media chrome

## Findings
| # | Problem | Evidence | Proposed change | Scope | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Paper/editorial `→` CTAs still freehand RichText instead of `Arbour_UnderlineLink` | Owners: Home/About UnderlineLinks use Olive token + animated underline. Freehand peers with proven hrefs: `/properties-2` `a5bJrHCM4` `EXPLORE THE TERRITORIES →` (parent `KoYNULHfP` → `/neighbourhoods`); `/contact` `yXnPwn7e1` `WRITE PRIVATELY →` (parent mailto `enquiries@arbour.estate`); `/` `RzLXFj8LG` `VIEW ALL NOTES →` (parent → `/about`); `/contact` `Q9ZpLaN5X` `VIEW ALL NOTES →` (parent `L0IbNEUtc` → `/about`). | Replace each freehand label with `Arbour_UnderlineLink` matching About `qU1PSkRMG`: Olive token text+underline, `decorative=false`, `line=1`, `offset=4`; move existing href/mailto onto `$control__link`. | Listed Paper `→` CTAs | High |
| 2 | Notes manifesto `THE ARBOUR STORY →` is freehand on a dark band | `/notes` `XQJbaNPNJ` / parent `RK5P7rAc9` → `/about`; color Ink Soft on Racing Deep manifesto. Same `→` CTA role as UnderlineLink owners. | Replace with `Arbour_UnderlineLink`; text+underline Paper token (cream on dark); href `/about`; `line=1` `offset=4`. | `/notes` Journal Manifesto | High |
| 3 | Home still has freehand chartreuse `VIEW →` / `VIEW ALL →` beside Olive UnderlineLink CTAs | `/` `tKeB3b0G4` `VIEW ALL →` `rgb(214, 224, 74)`; chartreuse `VIEW →` peers. Contradicts Olive UnderlineLink owner (`IdwyBx4Vz`, `h0vfeOTBw`). | Convert visible chartreuse arrow labels to `Arbour_UnderlineLink` + Olive token (or remove if duplicate of existing UL). | `/` freehand chartreuse arrows | Medium |

## Improve first
Finding **1** — largest set of same-role CTAs missing the underline owner already locked on Home/About.

---

Rejected: Primary/Form buttons; Nav/Footer Ink; detail back chips; Enquiry kickers without `→`; `/404` cinematic `RETURN`; cream `SUBSCRIBE →` on dark newsletter bands (no cream-UL exemplar accepted yet); `/neighbourhoods` `START A CONVERSATION →` (no proven href on node/ancestors — cannot set link without inventing destination).
