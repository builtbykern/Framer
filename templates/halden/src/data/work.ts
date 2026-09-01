export type WorkType = "people" | "place" | "commission"
export type CoverFormat = "portrait" | "landscape" | "square"

export interface WorkCredit {
  label: string
  value: string
}

export interface WorkSeries {
  title: string
  slug: string
  cover: string
  coverFormat: CoverFormat
  gallery: string[]
  year: number
  location: string
  type: WorkType
  client: string | null
  description: string
  credits: WorkCredit[]
  featured: boolean
}

export function workTypeLabel(type: WorkType): string {
  switch (type) {
    case "people":
      return "people"
    case "place":
      return "place"
    case "commission":
      return "commission"
    default: {
      const exhaustive: never = type
      return exhaustive
    }
  }
}

export function workPath(slug: string): string {
  return `/work/${slug}`
}

export function getWorkBySlug(
  items: WorkSeries[],
  slug: string
): WorkSeries | undefined {
  return items.find((item) => item.slug === slug)
}

export function getAdjacentWork(
  items: WorkSeries[],
  slug: string
): { prev: WorkSeries | null; next: WorkSeries | null } {
  const index = items.findIndex((item) => item.slug === slug)
  if (index < 0) {
    return { prev: null, next: null }
  }
  return {
    prev: index > 0 ? (items[index - 1] ?? null) : null,
    next: index < items.length - 1 ? (items[index + 1] ?? null) : null,
  }
}

export function featuredWork(items: WorkSeries[]): WorkSeries[] {
  return items.filter((item) => item.featured)
}

function unsplash(id: string, width: number): string {
  return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=80`
}

export const WORK: WorkSeries[] = [
  {
    title: "Atlantic Rooms",
    slug: "atlantic-rooms",
    cover: unsplash("photo-1507525428034-b723cf961d3e", 900),
    coverFormat: "landscape",
    gallery: [
      unsplash("photo-1507525428034-b723cf961d3e", 1800),
      unsplash("photo-1500375592092-40eb2168fd21", 1800),
      unsplash("photo-1473116763249-2faaef81ccda", 1800),
      unsplash("photo-1439405326854-014607f694d7", 1800),
      unsplash("photo-1505118380757-91f5f5632de0", 1800),
    ],
    year: 2025,
    location: "Cascais, Portugal",
    type: "place",
    client: null,
    description:
      "Rooms of weather along the Lisbon coast. The series stays with the hour when the Atlantic turns from silver to ink, and the hotels empty of their day.",
    credits: [
      { label: "camera", value: "Mamiya 7 II" },
      { label: "format", value: "6×7 colour negative" },
    ],
    featured: true,
  },
  {
    title: "After the Sitting",
    slug: "after-the-sitting",
    cover: unsplash("photo-1531746020798-e6953c6e8e04", 900),
    coverFormat: "portrait",
    gallery: [
      unsplash("photo-1531746020798-e6953c6e8e04", 1800),
      unsplash("photo-1524504388940-b1c1722653e1", 1800),
      unsplash("photo-1531123897727-8f129e1688ce", 1800),
      unsplash("photo-1529626455594-4afb9ae9fd76", 1800),
    ],
    year: 2024,
    location: "Lisbon",
    type: "people",
    client: null,
    description:
      "Portraits made after the formal sitting ends. Hands, windows, the clothes people chose when they thought the work was over.",
    credits: [
      { label: "camera", value: "Leica M10" },
      { label: "lens", value: "50mm Summicron" },
    ],
    featured: true,
  },
  {
    title: "Salt Brief",
    slug: "salt-brief",
    cover: unsplash("photo-1490481651871-ab68de25d43d", 900),
    coverFormat: "portrait",
    gallery: [
      unsplash("photo-1490481651871-ab68de25d43d", 1800),
      unsplash("photo-1529139574466-a303027c1d8b", 1800),
      unsplash("photo-1483985988355-763728e1935b", 1800),
      unsplash("photo-1515886657613-9f3515b0c78f", 1800),
    ],
    year: 2025,
    location: "Porto",
    type: "commission",
    client: "Vestis Almanac",
    description:
      "A clothing brief shot as if it were a private afternoon. Fabric against Atlantic light, no set beyond a rented apartment and the street below.",
    credits: [
      { label: "camera", value: "Phase One XF" },
      { label: "styling", value: "Inês Carvalho" },
    ],
    featured: true,
  },
  {
    title: "Night Garden",
    slug: "night-garden",
    cover: unsplash("photo-1519681393784-d120267933ba", 900),
    coverFormat: "landscape",
    gallery: [
      unsplash("photo-1519681393784-d120267933ba", 1800),
      unsplash("photo-1500534314209-a25ddb2bd429", 1800),
      unsplash("photo-1418065460487-3e41a6c84dc5", 1800),
      unsplash("photo-1441974231531-c6227db76b6e", 1800),
    ],
    year: 2023,
    location: "Sintra",
    type: "place",
    client: null,
    description:
      "The gardens after closing. Paths, hedges, and a green that only exists when the lamps are still warming up.",
    credits: [
      { label: "camera", value: "Fuji GSW690" },
      { label: "format", value: "6×9 black and white" },
    ],
    featured: true,
  },
  {
    title: "The Cousins",
    slug: "the-cousins",
    cover: unsplash("photo-1506794778202-cad84cf45f1d", 900),
    coverFormat: "portrait",
    gallery: [
      unsplash("photo-1506794778202-cad84cf45f1d", 1800),
      unsplash("photo-1507003211169-0a1dd7228f2d", 1800),
      unsplash("photo-1539571696357-5a69c17a67c6", 1800),
      unsplash("photo-1521119989659-a83eee48882b", 1800),
    ],
    year: 2024,
    location: "Almada",
    type: "people",
    client: null,
    description:
      "Two brothers, one apartment, four Sundays. A small family record with the television left on.",
    credits: [
      { label: "camera", value: "Contax T2" },
      { label: "format", value: "35mm colour negative" },
    ],
    featured: true,
  },
  {
    title: "Glass House",
    slug: "glass-house",
    cover: unsplash("photo-1600607687939-ce8a6c25118c", 900),
    coverFormat: "landscape",
    gallery: [
      unsplash("photo-1600607687939-ce8a6c25118c", 1800),
      unsplash("photo-1600585154340-0ef3ceae5aac", 1800),
      unsplash("photo-1600566753190-17f0baa2a6c3", 1800),
      unsplash("photo-1600210492486-724fe5c67fb0", 1800),
    ],
    year: 2025,
    location: "Comporta",
    type: "commission",
    client: "Atelier Norte",
    description:
      "An architecture record for a house that is mostly sky. Interiors photographed as weather, not as furniture.",
    credits: [
      { label: "camera", value: "Cambo Wide DS" },
      { label: "format", value: "4×5 colour" },
    ],
    featured: true,
  },
  {
    title: "Inland",
    slug: "inland",
    cover: unsplash("photo-1470071459604-3b2ce05aa51b", 900),
    coverFormat: "landscape",
    gallery: [
      unsplash("photo-1470071459604-3b2ce05aa51b", 1800),
      unsplash("photo-1501785888041-af3ef285b470", 1800),
      unsplash("photo-1469474968028-56623f02e42e", 1800),
      unsplash("photo-1447752875215-b2761ad7a1b1", 1800),
    ],
    year: 2023,
    location: "Alentejo",
    type: "place",
    client: null,
    description:
      "A week away from the water. Heat, distance, and the kind of quiet that makes a road feel longer than it is.",
    credits: [
      { label: "camera", value: "Pentax 67" },
      { label: "lens", value: "105mm" },
    ],
    featured: true,
  },
  {
    title: "Studio Days",
    slug: "studio-days",
    cover: unsplash("photo-1544005313-94ddf0286df2", 900),
    coverFormat: "square",
    gallery: [
      unsplash("photo-1544005313-94ddf0286df2", 1800),
      unsplash("photo-1554151228-14d9def656e4", 1800),
      unsplash("photo-1534528741775-53994a69daeb", 1800),
      unsplash("photo-1520813792240-56fc4a3765a7", 1800),
    ],
    year: 2024,
    location: "Lisbon",
    type: "people",
    client: null,
    description:
      "Daylight in a rented studio on Rua da Madalena. No styling beyond what each sitter brought up the stairs.",
    credits: [
      { label: "camera", value: "Hasselblad 500C/M" },
      { label: "format", value: "6×6 colour negative" },
    ],
    featured: true,
  },
  {
    title: "Fog Station",
    slug: "fog-station",
    cover: unsplash("photo-1418065460487-3e41a6c84dc5", 900),
    coverFormat: "landscape",
    gallery: [
      unsplash("photo-1418065460487-3e41a6c84dc5", 1800),
      unsplash("photo-1472214103451-21a1f1b1c580", 1800),
      unsplash("photo-1449824913935-59a10b8d2000", 1800),
      unsplash("photo-1480714378408-67cf0d13bc1b", 1800),
    ],
    year: 2022,
    location: "Guincho",
    type: "place",
    client: null,
    description:
      "A closed café and the road that serves it. Fog coming in faster than the last cars leaving.",
    credits: [
      { label: "camera", value: "Nikon F3" },
      { label: "format", value: "35mm black and white" },
    ],
    featured: true,
  },
]
