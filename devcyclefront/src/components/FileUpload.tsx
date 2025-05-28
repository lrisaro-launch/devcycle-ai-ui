import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useProcessedFile } from "../context/ProcessedFileContext";
import AppHeader from "./AppHeader";
import "./FileUpload.css";
import AppFooter from "./AppFooter";

const FileUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [selectedIA, setSelectedIA] = useState<string>("gpt-4");
  const [error, setError] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const navigate = useNavigate();
  const { setResult } = useProcessedFile();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setError(""); // Clear error if a file is selected
    }
  };

  useEffect(() => {
    document.title = "AI Integration";
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a file before processing.");
      return;
    }
    setError("");
    setIsProcessing(true);
    setResult(null); // Clear previous result
    localStorage.removeItem("processedFileResult"); // Clear previous result from localStorage

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("model", selectedIA);

      const response = await fetch("https://ai-devcrew-back.onrender.com/process-request", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to process the document.");
      }

      const result = await response.json();
      setResult(result); // <-- Save the file content in context

      setIsProcessing(false);
      navigate("/processed");
    } catch (err: any) {
      setIsProcessing(false);
      setError(err.message || "An error occurred while processing the document.");
    }
  };

  return (
    <div className="file-upload-bg">
      <AppHeader />
      <main className="file-upload-main">
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="file-upload-error">
              {error}
            </div>
          )}
          <section className="file-upload-ia-section">
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
          </section>
          <section className="file-upload-ia-section">
            <h2>Select AI to process the document</h2>
            <div className="file-upload-ia-options">
              <label>
                <input
                  type="radio"
                  name="ia"
                  value="gpt-4"
                  checked={selectedIA === "gpt-4"}
                  onChange={() => setSelectedIA("gpt-4")}
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
      <AppFooter/>
    </div>
  );
};

export default FileUpload;