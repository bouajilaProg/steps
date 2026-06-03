import { Routes, Route } from 'react-router-dom';
import ProcessViewer from './ProcessViewer';
import WorkflowList from './WorkflowList';

function App() {
  return (
    <Routes>
      <Route path="/" element={<WorkflowList />} />
      <Route path="/process/:id" element={<ProcessViewer />} />
    </Routes>
  );
}

export default App;
