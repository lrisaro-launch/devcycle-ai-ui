import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FileUpload from "./components/FileUpload";
import ProcessedFileView from "./components/ProcessedFileView";
import { ProcessedFileProvider } from "./context/ProcessedFileContext";

function App() {
  return (
    <ProcessedFileProvider> 
      {
        <Router>
          <Routes>
            <Route path="/" element={<FileUpload />} />
            <Route path="/processed" element={<ProcessedFileView />} />
          </Routes>
        </Router>
      }
    </ProcessedFileProvider>
  );
}

export default App;