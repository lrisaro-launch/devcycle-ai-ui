import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useProcessedFile } from "../context/ProcessedFileContext";
import AppHeader from "./AppHeader";
import "./FileUpload.css";
import AppFooter from "./AppFooter";
import OpenAILogo from '../assets/openai-logo.svg';
import DeepseekLogo from '../assets/deepseek-logo.svg';

const steps = [
  "Upload File",
  "Select AI",
  "Summary"
];

const FileUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [selectedIA, setSelectedIA] = useState<string>("gpt-4");
  const [error, setError] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [step, setStep] = useState<number>(0);
  const navigate = useNavigate();
  const { setResult, result } = useProcessedFile();

  useEffect(() => {
    document.title = "AI Integration";
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setError("");
    }
  };

  const handleNext = () => {
    if (step === 0 && !file) {
      setError("Please select a file before continuing.");
      return;
    }
    setError("");
    setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setError("");
    setStep((prev) => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (result) {
      navigate("/processed");
    } else {
      if (!file) {
        setError("Please select a file before processing.");
        return;
      }
      setError("");
      setIsProcessing(true);
      setResult(null);
      localStorage.removeItem("processedFileResult");

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
        setResult(result);

        setIsProcessing(false);
        navigate("/processed");
      } catch (err: any) {
        setIsProcessing(false);
        setError(err.message || "An error occurred while processing the document.");
      }
    }
  };

  // Progress bar width
  const progressPercent = ((step + 1) / steps.length) * 100;

  return (
    <div className="file-upload-bg">
      <AppHeader />
      <br /><br />
      {/* Progress Bar */}
      <div className="file-upload-progress-bar-container">
        <div className="file-upload-progress-bar-bg">
          <div
            className="file-upload-progress-bar-fill"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="file-upload-progress-steps">
          {steps.map((label, idx) => (
            <div
              key={label}
              className={`file-upload-progress-step${step >= idx ? " active" : ""}`}
            >
              {label}
            </div>
          ))}
        </div>
      </div>
      <main className="file-upload-main">
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="file-upload-error">
              {error}
            </div>
          )}
          {/* Step 1: Upload File */}
          {step === 0 && (
            <section className="file-upload-ia-section">
              <h2>Upload the functional document</h2>
              <br />
              <div
                className="file-upload-dropzone"
                onDragOver={e => e.preventDefault()}
                onDrop={e => {
                  e.preventDefault();
                  if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                    setFile(e.dataTransfer.files[0]);
                    setError("");
                  }
                }}
              >
                <div className="file-upload-dropzone-icon">
                  {/* Puedes usar un SVG o emoji como ícono */}
                  <svg width="48" height="48" fill="none" viewBox="0 0 48 48">
                    <rect width="48" height="48" rx="12" fill="#232b3e"/>
                    <path d="M24 14v16m0 0l-6-6m6 6l6-6" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <label className="file-upload-label file-upload-label-drop">
                  <input
                    type="file"
                    accept=".pdf,.txt,.doc,.docx"
                    onChange={handleChange}
                    disabled={isProcessing}
                  />
                  <span>Browse File</span>
                </label>
                <div className="file-upload-dropzone-text">
                  or drop the file here
                </div>
              </div>
              <br />
              {file && (
                <div className="file-upload-info">
                  <strong>Selected file:</strong> {file.name}
                </div>
              )}
              <div className="file-upload-step-actions">
                <button type="button" onClick={handleNext} disabled={isProcessing}>
                  Next
                </button>
              </div>
            </section>
          )}

          {/* Step 2: Select AI */}
          {step === 1 && (
            <section className="file-upload-ia-section">
              <h2>Select AI to process the document</h2>
              <div className="file-upload-ia-logos">
                <div
                  className={`file-upload-ia-logo-option${selectedIA === "gpt-4" ? " selected" : ""}`}
                  onClick={() => !isProcessing && setSelectedIA("gpt-4")}
                  tabIndex={0}
                  role="button"
                  aria-pressed={selectedIA === "gpt-4"}
                >
                  <img src={OpenAILogo} alt="OpenAI Logo" className="file-upload-ia-logo-img" />
                  <div className="file-upload-ia-logo-label">OpenAI</div>
                </div>
                <div
                  className={`file-upload-ia-logo-option${selectedIA === "Deepseek" ? " selected" : ""}`}
                  onClick={() => !isProcessing && setSelectedIA("Deepseek")}
                  tabIndex={0}
                  role="button"
                  aria-pressed={selectedIA === "Deepseek"}
                >
                  <img src={DeepseekLogo} alt="Deepseek Logo" className="file-upload-ia-logo-img" />
                  <div className="file-upload-ia-logo-label">Deepseek</div>
                </div>
              </div>
              <div className="file-upload-step-actions-between">
                <button type="button" onClick={handleBack} disabled={isProcessing}>
                  Back
                </button>
                <button type="button" onClick={handleNext} disabled={isProcessing}>
                  Next
                </button>
              </div>
            </section>
          )}

          {/* Step 3: Summary */}
          {step === 2 && (
            <section className="file-upload-ia-section">
              <h2>Summary</h2>
              <div className="file-upload-summary">
                <div>
                  <strong>File:</strong> {file ? file.name : "No file selected"}
                </div>
                <div>
                  <strong>AI Selected:</strong> {selectedIA === "gpt-4" ? "OpenAI" : selectedIA}
                </div>
              </div>
              <div className="file-upload-step-actions-between">
                <button type="button" onClick={handleBack} disabled={isProcessing}>
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                >
                  {isProcessing ? "Processing..." : "Process document"}
                </button>
              </div>
              {isProcessing && (
                <div className="file-upload-progress">
                  <span className="loader"></span> Processing document...
                </div>
              )}
            </section>
          )}
        </form>
      </main>
      <AppFooter />
    </div>
  );
};

export default FileUpload;