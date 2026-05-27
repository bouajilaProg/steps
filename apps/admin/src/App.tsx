import { Routes, Route } from 'react-router-dom'

function App() {
  return (
    <Routes>
      <Route path="/" element={<div className="p-8 text-center">Admin</div>} />
    </Routes>
  )
}

export default App
