import { Routes, Route } from 'react-router-dom'
import LoginPage from './pages/login/loginPage'
import EditProcessPage from './pages/editProcess/EditProcessPage'
import { UserProvider } from './hooks/useUser'

function App() {
  return (
    <UserProvider >
      <Routes>
        <Route path="/" element={<div className="p-8 text-center">Admin</div>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/edit" element={<EditProcessPage />} />
      </Routes>
    </UserProvider>
  )
}

export default App
