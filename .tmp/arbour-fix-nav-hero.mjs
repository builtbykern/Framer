/**
 * Fix Home hero + Nav visibility regressions from textStylePreset bind.
 * - Nav Desktop closed: white logo/icon on Paper sticky → Ink
 * - Hero Subheadline: Body(Ink) on dark photo → Paper + Inter 16, clear preset
 * TerritoryRail controls untouched.
 */
const NL = String.fromCharCode(10)
const INK = "var(--token-e2f9a9eb-668a-4021-80d9-b04413b5f392)"
const PAPER = "var(--token-d5b3c09d-0364-4ed0-8804-e56957faa275)"

const lines = []

// Nav Desktop logo — Ink on sticky Paper chrome
lines.push(`SET IWDst2nAr textColor="${INK}";`)

// Nav Desktop menu icons — Ink (were #FFFFFF)
lines.push(`SET tmJAAugFF $control__color="${INK}";`)
lines.push(`SET KXUslQmE1 $control__color="${INK}";`)

// Optional: subtle Paper fill on Desktop nav shell so sticky bar reads clearly
lines.push(`SET YrKq9_bDB backgroundColor="${PAPER}";`)

// Hero Subheadline D/T/P — restore light-on-dark (undo Body/Ink preset)
const heroSubs = ["NSDs1we7r", "wBAtV56MENSDs1we7r", "mcL3MFzFVNSDs1we7r"]
for (const id of heroSubs) {
    lines.push(
        `SET ${id} textStylePreset=null textColor="${PAPER}" fontName="Inter" fontSize="16px" fontWeight="400" letterSpacing="0em" lineHeight="1.5em";`,
    )
}

const result = await framer.agent.applyChanges(lines.join(NL), {})
return { n: lines.length, lines, result }
