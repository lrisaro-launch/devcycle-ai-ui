import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FileUpload from "./components/FileUpload";
import ProcessedFileView from "./components/ProcessedFileView";
import { ProcessedFileProvider } from "./context/ProcessedFileContext";
import HomePage from "./components/HomePage";
import ReviewUserStories from "./components/ReviewUserStories";
import SettingsPage from "./components/SettingsPage";

function App() {
  return (
    <ProcessedFileProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} /> 
          <Route path="/upload" element={<FileUpload />} />
          <Route path="/processed" element={<ProcessedFileView />} />
          <Route path="/review" element={<ReviewUserStories />} /> 
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </Router>
    </ProcessedFileProvider>
  );
}

export default App;