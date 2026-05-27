import { Routes, Route } from 'react-router-dom'
import LoginPage from './pages/login/loginPage'
import { UserProvider } from './hooks/useUser'

function App() {
  return (
    <UserProvider >
      <Routes>
        <Route path="/" element={<div className="p-8 text-center">Admin</div>} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </UserProvider>
  )
}

export default App
