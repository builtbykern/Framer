/**
 * Gap coherence + light typography bind for Arbour.
 *
 * Gap scale (section stacks):
 *   L 48 / 40 / 40
 *   M 40 / 32 / 32
 *   S 24 / 24 / 24
 *   Editorial XL 64 / 48 / 40
 *   Nested micro 10 keep
 */
const NL = String.fromCharCode(10)

const gapFixes = [
  // Home: Portfolio match Territories (L 48)
  { id: "RtG3B70W9", gap: "48px", note: "Home Portfolio Desktop gap 56→48" },
  { id: "wBAtV56MERtG3B70W9", gap: "48px", note: "Home Portfolio Tablet gap 56→48" },
  { id: "mcL3MFzFVRtG3B70W9", gap: "48px", note: "Home Portfolio Phone gap 56→48" },

  // Contact Hero: off-scale → S 24
  { id: "jmmPpci8t", gap: "24px", note: "Contact Hero Desktop gap 28→24" },
  { id: "qjv2S9WpajmmPpci8t", gap: "24px", note: "Contact Hero Tablet gap 20→24" },
  // Hero Copy 14 → 16 (micro scale)
  { id: "AATw4pip9", gap: "16px", note: "Contact Hero Copy Desktop 14→16" },
  { id: "jEM0wBo2vAATw4pip9", gap: "16px", note: "Contact Hero Copy Phone 14→16" },
  // need tablet hero copy if exists - probe later

  // Contact Journal Phone: align cascade D48/T40/P32 ok — leave
  // Contact Pause already 48/48/40 — leave

  // Properties listing outliers
  { id: "gn2phxXn5", gap: "64px", note: "Properties Grid Desktop 88→64" },
  { id: "APChY780b", gap: "64px", note: "Market Editorial Desktop 80→64" },

  // About chapters → Editorial XL cascade
  { id: "AiolEHPNd", gap: "64px", note: "Principals Desktop 96→64" },
  { id: "sx_GA8kBh", gap: "64px", note: "Two Offices Desktop 72→64" },
  { id: "xvqDXw58eTe9LPe3Or", gap: "48px", note: "Editorial Pause Tablet 64→48" },
  { id: "xvqDXw58eAiolEHPNd", gap: "48px", note: "Principals Tablet 64→48" },
  { id: "CYNrpU04tAiolEHPNd", gap: "40px", note: "Principals Phone 48→40" },

  // Property detail Hero / Continue / More
  { id: "lODMk6Egu", gap: "64px", note: "Property Hero Desktop 72→64" },
  { id: "EavJve6uGcIncylbTv", gap: "32px", note: "More From Journal Phone 28→32" },

  // Notes Closing already on 32/24 — leave
]

// Find tablet Contact Hero Copy
const pages = await framer.getNodesWithType("WebPageNode")
const contact = pages.find((p) => p.path === "/contact")
if (contact) {
    const ser = await framer.agent.serialize({ id: contact.id, depth: 5 }, {})
    for (const bp of ser.children || []) {
        function walk(n) {
            if (!n) return
            if (n.name === "Hero Copy" && n.attributes?.gap === "14px") {
                gapFixes.push({
                    id: n.id,
                    gap: "16px",
                    note: `Contact Hero Copy ${bp.name} 14→16`,
                })
            }
            for (const c of n.children || []) walk(c)
        }
        walk(bp)
    }
}

// Also snap tablet/phone Properties Grid / Market Editorial if off
const props = pages.find((p) => p.path === "/properties")
if (props) {
    const ser = await framer.agent.serialize({ id: props.id, depth: 4 }, {})
    for (const bp of ser.children || []) {
        function walk(n) {
            if (!n) return
            const g = parseFloat(n.attributes?.gap || "")
            if (n.name === "Properties Grid" && g && ![48, 40, 64, 32].includes(g) && g > 48) {
                const target = bp.name === "Desktop" ? "64px" : bp.name === "Tablet" ? "48px" : "40px"
                if (String(n.attributes.gap) !== target) {
                    gapFixes.push({
                        id: n.id,
                        gap: target,
                        note: `Properties Grid ${bp.name} ${n.attributes.gap}→${target}`,
                    })
                }
            }
            if (n.name === "Market Editorial" && g && ![48, 40, 64, 32].includes(g)) {
                const target = bp.name === "Desktop" ? "64px" : bp.name === "Tablet" ? "48px" : "40px"
                if (String(n.attributes.gap) !== target) {
                    gapFixes.push({
                        id: n.id,
                        gap: target,
                        note: `Market Editorial ${bp.name} ${n.attributes.gap}→${target}`,
                    })
                }
            }
            for (const c of n.children || []) walk(c)
        }
        walk(bp)
    }
}

const byId = new Map()
for (const f of gapFixes) byId.set(f.id, f)
const unique = [...byId.values()]
const lines = unique.map((f) => `SET ${f.id} gap="${f.gap}";`)
const result = await framer.agent.applyChanges(lines.join(NL), {})

return { n: unique.length, notes: unique.map((f) => f.note), result }
