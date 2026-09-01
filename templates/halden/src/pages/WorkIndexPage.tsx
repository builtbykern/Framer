import { Link } from "react-router-dom"
import { WORK, workPath, workTypeLabel } from "../data/work"

export function WorkIndexPage() {
  return (
    <main className="page">
      <h1 className="page__kicker">Index</h1>
      <ul className="index-list">
        {WORK.map((item) => (
          <li key={item.slug}>
            <Link to={workPath(item.slug)} className="index-row">
              <span className="index-row__title">{item.title}</span>
              <span className="index-row__meta">
                {workTypeLabel(item.type)}
              </span>
              <span className="index-row__meta">{item.year}</span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  )
}
