import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { MoonPhaseProvider } from './context/MoonPhaseContext'
import { AuthProvider } from './context/AuthContext'
import Layout from './components/Layout'
import Home from './pages/Home'
import Journal from './pages/Journal'
import Calendar from './pages/Calendar'
import Dashboard from './pages/Dashboard'
import DreamJournal from './pages/DreamJournal'
import ReadingMode from './pages/ReadingMode'
import Settings from './pages/Settings'
import TimeCapsules from './pages/TimeCapsules'
import Export from './pages/Export'
import Signup from './pages/Signup'
import Login from './pages/Login'
import Gallery from './pages/Gallery'

function App() {
  return (
    <AuthProvider>
      <MoonPhaseProvider>
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/journal" element={<Journal />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/dreams" element={<DreamJournal />} />
              <Route path="/read/:entryId" element={<ReadingMode />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/capsules" element={<TimeCapsules />} />
              <Route path="/export" element={<Export />} />
              <Route path="/gallery" element={<Gallery />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </MoonPhaseProvider>
    </AuthProvider>
  )
}

export default App