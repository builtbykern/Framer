const NL = String.fromCharCode(10)
const sets = [
  { id: "LptqEiXVpwY1tfyIdc", padding: "96px 40px 0px 40px", note: "Notes Tablet Journal" },
  { id: "IQmBTrFpblODMk6Egu", padding: "96px 40px 96px 40px", note: "Property Tablet Hero" },
  { id: "wBAtV56MEiq0rlFlTE", padding: "0px 0px 64px 0px", note: "Home Tablet Hero" },
]
const lines = sets.map((s) => `SET ${s.id} padding="${s.padding}";`)
const result = await framer.agent.applyChanges(lines.join(NL), {})
return { sets, result }
