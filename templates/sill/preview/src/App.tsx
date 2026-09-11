import { sillDemo } from "./data/demo"

function padIndex(index: number): string {
  return String(index + 1).padStart(2, "0")
}

export function App() {
  const { name, line, links, still } = sillDemo

  return (
    <div className="sill">
      <section className="sill__type" aria-label="Identity">
        <p className="sill__name">{name}</p>
        <p className="sill__line">{line}</p>
        <div className="sill__list">
          <ul>
            {links.map((link, index) => (
              <li key={link.href}>
                <a className="sill__row" href={link.href}>
                  <span className="sill__num" aria-hidden="true">
                    {padIndex(index)}
                  </span>
                  <span className="sill__label">{link.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <section className="sill__still" aria-label="Still">
        <img src={still.src} alt={still.alt} />
      </section>
    </div>
  )
}
