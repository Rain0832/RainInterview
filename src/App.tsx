import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import CompanyPage from './pages/CompanyPage'
import SessionPage from './pages/SessionPage'
import ChoicePage from './pages/ChoicePage'
import CodingPage from './pages/CodingPage'
import WrongBookPage from './pages/WrongBookPage'
import MyRecordsPage from './pages/MyRecordsPage'
import UploadPage from './pages/UploadPage'
import AuthPage from './pages/AuthPage'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/company/:companyId" element={<CompanyPage />} />
        <Route path="/company/:companyId/:sessionId" element={<SessionPage />} />
        <Route path="/company/:companyId/:sessionId/choice" element={<ChoicePage />} />
        <Route path="/company/:companyId/:sessionId/coding/:questionId" element={<CodingPage />} />
        <Route path="/wrong-book" element={<WrongBookPage />} />
        <Route path="/my-records" element={<MyRecordsPage />} />
        <Route path="/upload" element={<UploadPage />} />
      </Route>
    </Routes>
  )
}

export default App
