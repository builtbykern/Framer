import { Link } from "react-router-dom"

export function NotFoundPage() {
  return (
    <main className="page page--narrow">
      <h1 className="page__kicker">Missing</h1>
      <p className="page__lead">This series is not on the plane.</p>
      <p>
        <Link to="/work">Return to the index</Link>
      </p>
    </main>
  )
}
