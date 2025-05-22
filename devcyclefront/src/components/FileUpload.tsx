import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AppHeader from "./AppHeader";
import "./FileUpload.css";

const FileUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [selectedIA, setSelectedIA] = useState<string>("OpenAI");
  const [error, setError] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const navigate = useNavigate();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setError(""); // Clear error if a file is selected
    }
  };

  useEffect(() => {
    document.title = "Upload File | AI Integration";
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a file before processing.");
      return;
    }
    setError("");
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      navigate("/processed");
    }, 2000);
  };

  return (
    <div className="file-upload-bg">
      {isProcessing && <div className="file-upload-overlay"></div>}
      <AppHeader />
      <main className="file-upload-main">
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="file-upload-error">
              {error}
            </div>
          )}
          <h2>Upload the functional document</h2>
          <label className="file-upload-label">
            Select file
            <input
              type="file"
              accept=".pdf,.txt,.doc,.docx"
              onChange={handleChange}
              disabled={isProcessing}
            />
          </label>
          {file && (
            <div className="file-upload-info">
              <strong>Selected file:</strong> {file.name}
            </div>
          )}
          <section className="file-upload-ia-section">
            <h3>Select AI to process the document</h3>
            <div className="file-upload-ia-options">
              <label>
                <input
                  type="radio"
                  name="ia"
                  value="OpenAI"
                  checked={selectedIA === "OpenAI"}
                  onChange={() => setSelectedIA("OpenAI")}
                  disabled={isProcessing}
                />
                OpenAI
              </label>
              <label>
                <input
                  type="radio"
                  name="ia"
                  value="Deepseek"
                  checked={selectedIA === "Deepseek"}
                  onChange={() => setSelectedIA("Deepseek")}
                  disabled={isProcessing}
                />
                Deepseek
              </label>
            </div>
          </section>
          <br />
          <button
            className="file-upload-submit"
            type="submit"
            disabled={isProcessing}
          >
            {isProcessing ? "Processing..." : "Process document"}
          </button>
          {isProcessing && (
            <div className="file-upload-progress">
              <span className="loader"></span> Processing document...
            </div>
          )}
        </form>
      </main>
    </div>
  );
};

export default FileUpload;