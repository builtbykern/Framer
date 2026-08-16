import { Link } from "react-router-dom"
import {
  workPath,
  workTypeLabel,
  type WorkSeries,
} from "../data/work"

interface ProjectSplitProps {
  work: WorkSeries
  prev: WorkSeries | null
  next: WorkSeries | null
}

export function ProjectSplit({ work, prev, next }: ProjectSplitProps) {
  return (
    <article className="split">
      <aside className="split__info">
        <h1 className="split__title">{work.title}</h1>
        <dl className="split__meta">
          <div>
            <dt>location</dt>
            <dd>{work.location}</dd>
          </div>
          <div>
            <dt>year</dt>
            <dd>{work.year}</dd>
          </div>
          {work.client ? (
            <div>
              <dt>client</dt>
              <dd>{work.client}</dd>
            </div>
          ) : null}
          {work.credits.map((credit) => (
            <div key={credit.label}>
              <dt>{credit.label}</dt>
              <dd>{credit.value}</dd>
            </div>
          ))}
        </dl>
        <p className="split__body">{work.description}</p>
        <ul className="split__tags">
          <li>
            <span className="chip">{workTypeLabel(work.type)}</span>
          </li>
        </ul>
        <nav className="split__pager" aria-label="Series">
          {prev ? (
            <Link to={workPath(prev.slug)} className="split__page-link">
              Previous
            </Link>
          ) : (
            <span className="split__page-link is-disabled">Previous</span>
          )}
          <Link to="/work" className="split__page-link">
            Index
          </Link>
          {next ? (
            <Link to={workPath(next.slug)} className="split__page-link">
              Next
            </Link>
          ) : (
            <span className="split__page-link is-disabled">Next</span>
          )}
        </nav>
      </aside>
      <div className="split__media">
        {work.gallery.map((src, index) => (
          <img
            key={src}
            src={src}
            alt={`${work.title}, ${index + 1} of ${work.gallery.length}`}
            className="split__image"
          />
        ))}
      </div>
    </article>
  )
}
