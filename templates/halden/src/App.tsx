import { Route, Routes } from "react-router-dom"
import { SiteChrome } from "./components/SiteChrome"
import { ContactPage } from "./pages/ContactPage"
import { HomePage } from "./pages/HomePage"
import { InfoPage } from "./pages/InfoPage"
import { NotFoundPage } from "./pages/NotFoundPage"
import { PrivacyPage } from "./pages/PrivacyPage"
import { ProjectPage } from "./pages/ProjectPage"
import { WorkIndexPage } from "./pages/WorkIndexPage"

export function App() {
  return (
    <>
      <SiteChrome />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/work" element={<WorkIndexPage />} />
        <Route path="/work/:slug" element={<ProjectPage />} />
        <Route path="/info" element={<InfoPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  )
}
