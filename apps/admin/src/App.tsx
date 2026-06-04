import { Routes, Route } from 'react-router-dom'
import LoginPage from './pages/login/loginPage'
import EditProcessPage from './pages/editProcess/EditProcessPage'
import WorkflowsPage from './pages/workflows/WorkflowsPage'
import NotFound from './pages/NotFound'
import { UserProvider } from './hooks/useUser'

function App() {
  return (
    <UserProvider >
      <Routes>
        <Route path="/" element={<WorkflowsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/edit/:processId" element={<EditProcessPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </UserProvider>
  )
}

export default App