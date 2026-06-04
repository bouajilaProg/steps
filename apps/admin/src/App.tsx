import { Routes, Route } from 'react-router-dom'
import LoginPage from './pages/login/loginPage'
import EditProcessPage from './pages/editProcess/EditProcessPage'
import WorkflowsPage from './pages/workflows/WorkflowsPage'
import NotFound from './pages/NotFound'
import { UserProvider } from './hooks/useUser'
import { ProtectedRoute } from './components/ProtectedRoute'

function App() {
  return (
    <UserProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<ProtectedRoute><WorkflowsPage /></ProtectedRoute>} />
        <Route path="/edit/:processId" element={<ProtectedRoute><EditProcessPage /></ProtectedRoute>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </UserProvider>
  )
}

export default App