import { Routes, Route } from 'react-router-dom'
import LoginPage from './pages/login/loginPage'
import EditProcessPage from './pages/editProcess/EditProcessPage'
import NotFound from './pages/NotFound'
import { UserProvider } from './hooks/UserProvider'

function App() {
  return (
    <UserProvider >
      <Routes>
        <Route path="/" element={<div className="p-8 text-center">Admin</div>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/edit/:processId" element={<EditProcessPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </UserProvider>
  )
}

export default App
