/* Upload Journal cover images from local Lummi assets and assign by slug. */
const fs = require("fs");
const path = require("path");

const ASSETS = ".tmp/journal-covers";
const COVER_FIELD = "UuvdpyCxL";

/** Best thematic fit — 7 notes, unique covers. */
const MAP = [
  {
    slug: "on-proportion-light-london-row-house",
    file: "elegant-townhouses-row-x5qwe-8a07764f-170e-442c-9cbb-8af69074203d.png",
    alt: "Cream London row houses in soft golden light",
  },
  {
    slug: "reading-a-facade-as-ledger",
    file: "rustic-lion-door-kq3aw-3c24c3db-f076-4429-8273-c569ea639352.png",
    alt: "Weathered door with brass lion knocker and number 18",
  },
  {
    slug: "mews-houses-second-visit",
    file: "charming-cobblestone-street-hq608-ab8e6374-6ffa-422f-9f54-561697d40e77.png",
    alt: "Pastel mews garage doors on a cobblestone lane",
  },
  {
    slug: "colville-terrace-field-notes",
    file: "elegant-townhouses-ua5_t-fdabf806-3a8e-4003-b493-bfc38d016c68.png",
    alt: "Terrace townhouses with iron railings and climbing ivy",
  },
  {
    slug: "what-a-second-viewing-is-really-for",
    file: "minimalist-hallway-hjkmx-c6270e3d-dd8a-43ac-be72-ce719bb2b7b0.png",
    alt: "Bright hallway landing with herringbone floor and window light",
  },
  {
    slug: "notting-hill-after-the-rain",
    file: "pastel-townhouses-at-dusk-hdi1_-d432f015-deea-4d08-ab32-debffd80b51d.png",
    alt: "Pastel Notting Hill terraces reflected in wet pavement at dusk",
  },
  {
    slug: "on-instructing-an-agent-without-losing-your-nerve",
    file: "keys-and-townhouses-vc6nk-f97f5063-43e1-45d7-ac48-650732a3e0c4.png",
    alt: "Brass house key held above a London townhouse doorstep",
  },
];

const cols = await framer.getCollections();
const journal = cols.find((c) => c.name === "Journal");
if (!journal) throw new Error("Journal collection not found");

const items = await journal.getItems();
const bySlug = Object.fromEntries(items.map((it) => [it.slug, it]));

const results = [];

for (const row of MAP) {
  const item = bySlug[row.slug];
  if (!item) {
    results.push({ slug: row.slug, ok: false, error: "item not found" });
    continue;
  }

  const filePath = path.join(ASSETS, row.file);
  if (!fs.existsSync(filePath)) {
    results.push({ slug: row.slug, ok: false, error: `missing file ${row.file}` });
    continue;
  }

  const buf = fs.readFileSync(filePath);
  const dataUrl = `data:image/jpeg;base64,${buf.toString("base64")}`;

  let uploaded;
  try {
    uploaded = await framer.uploadImage({ image: dataUrl, altText: row.alt });
  } catch (e) {
    results.push({
      slug: row.slug,
      ok: false,
      error: `upload: ${e?.message || e}`,
    });
    continue;
  }

  const url = uploaded?.url || uploaded?.src;
  if (!url) {
    results.push({
      slug: row.slug,
      ok: false,
      error: `no url in upload: ${JSON.stringify(uploaded).slice(0, 200)}`,
    });
    continue;
  }

  try {
    await item.setAttributes({
      [COVER_FIELD]: {
        type: "image",
        value: {
          id: uploaded.id || url.split("/").pop(),
          url,
          altText: row.alt,
        },
      },
    });
    results.push({ slug: row.slug, ok: true, url, file: row.file });
  } catch (e) {
    // Fallback: value as plain url string / asset shape
    try {
      await item.setAttributes({
        [COVER_FIELD]: url,
      });
      results.push({
        slug: row.slug,
        ok: true,
        url,
        file: row.file,
        note: "set as bare url",
      });
    } catch (e2) {
      results.push({
        slug: row.slug,
        ok: false,
        error: `setAttributes: ${e?.message || e} | fallback: ${e2?.message || e2}`,
        uploaded: url,
      });
    }
  }
}

console.log(JSON.stringify(results, null, 2));
state.journalCoverResults = results;
