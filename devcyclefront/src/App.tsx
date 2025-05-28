import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FileUpload from "./components/FileUpload";
import ProcessedFileView from "./components/ProcessedFileView";
import { ProcessedFileProvider } from "./context/ProcessedFileContext";
import HomePage from "./components/HomePage"; // <-- Importa el nuevo componente

function App() {
  return (
    <ProcessedFileProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} /> {/* Página de inicio moderna */}
          <Route path="/upload" element={<FileUpload />} />
          <Route path="/processed" element={<ProcessedFileView />} />
        </Routes>
      </Router>
    </ProcessedFileProvider>
  );
}

export default App;