/* Batch A — Journal SEO Descriptions */
const SEO = {
  "on-proportion-light-london-row-house":
    "How ceiling height, bay depth, and afternoon light decide whether a London terrace feels generous or merely large — notes for a first walkthrough.",
  "reading-a-facade-as-ledger":
    "Door furniture, brick courses, and patched stucco as a quiet record of who cared for a house — and who merely held it.",
  "mews-houses-second-visit":
    "Why the second appointment in a mews reveals scale, service access, and neighbour rhythm that a rushed first viewing conceals.",
  "colville-terrace-field-notes":
    "Street-level observations from Colville: garden squares, terrace setbacks, and the small cues that separate a good address from a great one.",
  "what-a-second-viewing-is-really-for":
    "A second viewing is for light at the wrong hour, storage you missed, and the questions you only think of after leaving.",
  "notting-hill-after-the-rain":
    "Pastel façades, wet pavement, and the softer market mood that follows a London shower — reading Notting Hill when the streets empty.",
  "on-instructing-an-agent-without-losing-your-nerve":
    "Briefing counsel without surrendering judgement: what to put in writing, what to keep oral, and when to slow the instruction.",
};

const cols = await framer.getCollections();
const journal = cols.find((c) => c.name === "Journal");
const fields = await journal.getFields();
const seoField = fields.find((f) => f.name === "SEO Description");
if (!seoField) throw new Error("SEO Description field missing");

const items = await journal.getItems();
const results = [];

for (const it of items) {
  const next = SEO[it.slug];
  if (!next) {
    results.push({ slug: it.slug, ok: false, error: "no copy mapped" });
    continue;
  }
  await it.setAttributes({
    fieldData: {
      [seoField.id]: { type: "string", value: next },
    },
  });
  results.push({ slug: it.slug, ok: true, len: next.length });
}

console.log(JSON.stringify(results, null, 2));
state.journalSeo = results;
