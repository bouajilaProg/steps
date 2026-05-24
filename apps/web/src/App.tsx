import { Routes, Route } from 'react-router-dom';
import ProcessViewer from './ProcessViewer';

function App() {
  return (
    <Routes>
      <Route path="/" element={<ProcessViewer />} />
    </Routes>
  );
}

export default App;
