import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import CompanyPage from './pages/CompanyPage'
import SessionPage from './pages/SessionPage'
import ChoicePage from './pages/ChoicePage'
import CodingPage from './pages/CodingPage'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/company/:companyId" element={<CompanyPage />} />
        <Route path="/company/:companyId/:sessionId" element={<SessionPage />} />
        <Route path="/company/:companyId/:sessionId/choice" element={<ChoicePage />} />
        <Route path="/company/:companyId/:sessionId/coding/:questionId" element={<CodingPage />} />
      </Route>
    </Routes>
  )
}

export default App
