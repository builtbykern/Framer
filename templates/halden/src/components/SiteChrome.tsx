import { NavLink } from "react-router-dom"

const LINKS = [
  { to: "/work", label: "Index" },
  { to: "/info", label: "Info" },
  { to: "/contact", label: "Contact" },
] as const

export function SiteChrome() {
  return (
    <header className="chrome">
      <NavLink to="/" className="chrome__mark">
        Mira Halden
      </NavLink>
      <nav className="chrome__nav" aria-label="Primary">
        {LINKS.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              isActive ? "chrome__link is-active" : "chrome__link"
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
      <NavLink to="/privacy" className="chrome__privacy">
        Privacy
      </NavLink>
    </header>
  )
}
