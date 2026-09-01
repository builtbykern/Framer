import { useParams } from "react-router-dom"
import { ProjectSplit } from "../components/ProjectSplit"
import { getAdjacentWork, getWorkBySlug, WORK } from "../data/work"
import { NotFoundPage } from "./NotFoundPage"

export function ProjectPage() {
  const { slug } = useParams()
  const work = getWorkBySlug(WORK, slug ?? "")
  if (!work) {
    return <NotFoundPage />
  }
  const { prev, next } = getAdjacentWork(WORK, work.slug)
  return (
    <main className="project">
      <ProjectSplit work={work} prev={prev} next={next} />
    </main>
  )
}
