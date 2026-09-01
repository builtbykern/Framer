# Halden type — Lead + kill Inter

## Goal

Give Syne 27 a semantic preset (`Lead`) and remove Inter from Work prose, without putting Syne on series titles.

## Design

- Add text style **Lead**: Syne 500, 27px, −0.03em, 1.28em, ink. Tag `h2`.
- Bind existing Syne 27 nodes (404 lead, Nav overlay leads) to Lead.
- Bind Work Inter 14/16 nodes to **Body**.
- Do not bind Work series titles to Lead or Display. Leave titles as they are (including any existing Display).
- Label / Info Link / Display / Body metrics stay.

## Out of scope

- Rebrand off Syne
- Work Info gap rhythm
- Publish
