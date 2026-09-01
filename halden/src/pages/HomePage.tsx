import { DriftPlane } from "../components/DriftPlane"
import { WORK } from "../data/work"

export function HomePage() {
  return (
    <main className="home">
      <h1 className="sr-only">Mira Halden, photographer</h1>
      <DriftPlane items={WORK} />
    </main>
  )
}
