/** Demo content from templates/sill/demo-content.md — Ada Vale only. */

export type SillLink = {
  label: string
  href: string
}

export const sillDemo = {
  name: "Ada Vale",
  line: "Independent designer. Visual identity, web, and a shop.",
  links: [
    { label: "Instagram", href: "https://instagram.com" },
    { label: "Shop", href: "https://example.com/shop" },
    { label: "Are.na", href: "https://are.na" },
    { label: "Mail", href: "mailto:hello@example.com" },
    { label: "Notes", href: "https://example.com/notes" },
    { label: "Booking", href: "https://example.com/book" },
  ] satisfies SillLink[],
  still: {
    src: "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=1600&q=80",
    alt: "Studio still, chair and daylight",
  },
} as const
