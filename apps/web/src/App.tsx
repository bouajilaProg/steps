import { Routes, Route } from 'react-router-dom';
import ProcessViewer from './ProcessViewer';
import WorkflowList from './WorkflowList';
import ScanPage from './ScanPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<WorkflowList />} />
      <Route path="/scan" element={<ScanPage />} />
      <Route path="/process/:id" element={<ProcessViewer />} />
    </Routes>
  );
}

export default App;
