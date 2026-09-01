/* Assign uploaded Journal covers via CollectionItem.setAttributes({ fieldData }). */
const COVER_FIELD = "UuvdpyCxL";

const MAP = [
  {
    slug: "on-proportion-light-london-row-house",
    url: "https://framerusercontent.com/images/e6gkMLN4uDb047jdjtCeGaHVB4.jpg",
    alt: "Cream London row houses in soft golden light",
  },
  {
    slug: "reading-a-facade-as-ledger",
    url: "https://framerusercontent.com/images/Q62zztvmrue26HMdGmau2uNwqdw.jpg",
    alt: "Weathered door with brass lion knocker and number 18",
  },
  {
    slug: "mews-houses-second-visit",
    url: "https://framerusercontent.com/images/lBfFl3QUAP5c1NwKhfYIvYkPTU.jpg",
    alt: "Pastel mews garage doors on a cobblestone lane",
  },
  {
    slug: "colville-terrace-field-notes",
    url: "https://framerusercontent.com/images/vnP0yAf0DNq0tW4f03ZezaVlI.jpg",
    alt: "Terrace townhouses with iron railings and climbing ivy",
  },
  {
    slug: "what-a-second-viewing-is-really-for",
    url: "https://framerusercontent.com/images/qYkuojaUOKGCgBNSbpZU47OOia4.jpg",
    alt: "Bright hallway landing with herringbone floor and window light",
  },
  {
    slug: "notting-hill-after-the-rain",
    url: "https://framerusercontent.com/images/qOhaKNcNsOnzdWST2oTicpKs35M.jpg",
    alt: "Pastel Notting Hill terraces reflected in wet pavement at dusk",
  },
  {
    slug: "on-instructing-an-agent-without-losing-your-nerve",
    url: "https://framerusercontent.com/images/Uh6fxb59EIarn3e87SWtJ8ltmc.jpg",
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

  try {
    const updated = await item.setAttributes({
      fieldData: {
        [COVER_FIELD]: {
          type: "image",
          value: row.url,
          alt: row.alt,
        },
      },
    });
    const cover = updated?.fieldData?.[COVER_FIELD]?.value;
    results.push({
      slug: row.slug,
      ok: true,
      coverUrl: cover?.url || cover || null,
    });
  } catch (e) {
    results.push({ slug: row.slug, ok: false, error: String(e?.message || e) });
  }
}

console.log(JSON.stringify(results, null, 2));
state.journalCoverAssign = results;
