import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Journal from './pages/Journal'
import Calendar from './pages/Calendar'
import Dashboard from './pages/Dashboard'
import DreamJournal from './pages/DreamJournal'

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dreams" element={<DreamJournal />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default App
