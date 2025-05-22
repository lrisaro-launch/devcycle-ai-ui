import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FileUpload from "./components/FileUpload";
import ProcessedFileView from "./components/ProcessedFileView";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FileUpload />} />
        <Route path="/processed" element={<ProcessedFileView />} />
      </Routes>
    </Router>
  );
}

export default App;