/**
 * Coherence pass — depth-1 section shells only.
 * Scale: D L128/48 M96/48 S64/48 | T L96/40 M72/40 S48/40 | P L64/16 M48/16 S40/16
 */
const NL = String.fromCharCode(10)

const fixes = [
  // Property detail: Hero + Chapter Intro → L everywhere
  { id: "MrTKJzwELlODMk6Egu", padding: "64px 16px 64px 16px", note: "Property Hero Phone → L" },
  { id: "IQmBTrFpbubrig7P0R", padding: "96px 40px 96px 40px", note: "Chapter Intro Tablet → L" },
  { id: "MrTKJzwELubrig7P0R", padding: "64px 16px 64px 16px", note: "Chapter Intro Phone → L" },

  // Notes detail: Specs Strip match Desktop (gutter only, 0 vertical)
  { id: "gZUAlaJJ1OE3uHiT52", padding: "0px 40px 0px 40px", note: "Specs Strip Tablet → Z+gutter" },
  { id: "EavJve6uGOE3uHiT52", padding: "0px 16px 0px 16px", note: "Specs Strip Phone → Z+gutter" },

  // Closing Chapter → M cascade (D96 / T72 / P48)
  { id: "gZUAlaJJ1VeGntwuIg", padding: "72px 40px 72px 40px", note: "Closing Chapter Tablet → M" },
  { id: "EavJve6uGVeGntwuIg", padding: "48px 16px 48px 16px", note: "Closing Chapter Phone → M" },

  // Editorial / Consultation pauses → M cascade (D already 96)
  { id: "xvqDXw58eTe9LPe3Or", padding: "72px 40px 72px 40px", note: "Editorial Pause Tablet → M" },
  { id: "CYNrpU04tTe9LPe3Or", padding: "48px 16px 48px 16px", note: "Editorial Pause Phone → M" },
  { id: "qjv2S9WpaliyenGbOL", padding: "72px 40px 72px 40px", note: "Consultation Pause Tablet → M" },
  { id: "jEM0wBo2vliyenGbOL", padding: "48px 16px 48px 16px", note: "Consultation Pause Phone → M" },

  // Contact Hero bottom → S (tight hero, on-scale)
  { id: "jmmPpci8t", padding: "0px 48px 64px 48px", note: "Contact Hero Desktop bottom → S" },
  { id: "qjv2S9WpajmmPpci8t", padding: "0px 40px 48px 40px", note: "Contact Hero Tablet bottom → S" },

  // Journal Hero Image top → S cascade (D64 / T48 / P40), bottom 0
  { id: "rZDvGuaZD", padding: "64px 48px 0px 48px", note: "Journal Hero Image Desktop → S top" },
  { id: "gZUAlaJJ1rZDvGuaZD", padding: "48px 40px 0px 40px", note: "Journal Hero Image Tablet → S top" },
  { id: "EavJve6uGrZDvGuaZD", padding: "40px 16px 0px 16px", note: "Journal Hero Image Phone → S top" },

  // Property Specs Band Phone → match D/T (0 vertical + gutter)
  { id: "MrTKJzwELaqUTeKNkU", padding: "0px 16px 0px 16px", note: "Property Specs Band Phone → Z+gutter" },

  // /properties Properties Grid → L cascade (was T M / P asymmetric)
  { id: "SScKalu3Bgn2phxXn5", padding: "96px 40px 96px 40px", note: "Properties Grid Tablet → L" },
  { id: "EK6d5SyWLgn2phxXn5", padding: "64px 16px 64px 16px", note: "Properties Grid Phone → L" },
]

const lines = fixes.map((f) => `SET ${f.id} padding="${f.padding}";`)
const result = await framer.agent.applyChanges(lines.join(NL), {})
return { n: fixes.length, notes: fixes.map((f) => f.note), result }
