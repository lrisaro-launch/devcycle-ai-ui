import React, { useState } from "react";
import { useProcessedFile } from "../context/ProcessedFileContext";
import { useNavigate } from "react-router-dom";
import AppHeader from "./AppHeader";
import "./ProcessedFileView.css";

const ProcessedFileView: React.FC = () => {
  const { result } = useProcessedFile(); 
  const historias = result?.analisis?.tickets;
  const [selectedRepo, setSelectedRepo] = useState<string>("Azure");
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsCreating(true);

      try {
        const formData = new FormData();
        formData.append("additionalProp1", result);

        const response = await fetch("https://ai-devcrew-back.onrender.com/publish-to-jira", {
          method: "POST",
          body: formData,
        });

      if (!response.ok) {
        throw new Error("Failed to process the document.");
      }

      const resultAPI = await response.json();
      alert(resultAPI);

      setIsCreating(false);
      // setShowSuccess(true);
    } catch (err: any) {
      setIsCreating(false);
      alert("An error occurred while processing the document.");
    }

  }
  return (
    <div className="file-upload-bg">
      <AppHeader subtitle="Here you will see the processed file content." />
      <main className="file-upload-main">
        <form onSubmit={handleSubmit}>
          <div className="pfv-title">Processed File Content</div>
          <div className="pfv-historia-card">
            <h2 className="pfv-section-title">Process info</h2>
            <div className="pfv-file-info-row">
              <span className="pfv-epica">File Name: </span>
              <span className="pfv-file-name">{result?.analisis?.hitos[0]}</span>
              <br />
              <span className="pfv-epica">Model: </span>
              <span className="pfv-file-name">{result?.modelo_usado}</span>
            </div>
          </div>
          {historias && Array.isArray(historias) && historias.length > 0 ? (
            <section className="pfv-section">
              <div className="pfv-historia-card">
                <h2 className="pfv-section-title">User Stories</h2>
                <div className="pfv-historias-list">
                  {historias.map((historia: any, idx: number) => (
                    <div key={idx} className="pfv-historia-card">
                      <span className="pfv-epica">
                        {idx + 1}. {historia.summary}
                      </span>
                      <span className="pfv-historia">
                        {historia.description}
                      </span>
                      <br />
                      <span className="pfv-epica">
                        Acceptance criteria:
                      </span>
                      <span className="pfv-historia">
                        {historia.criterios_de_aceptacion}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <br /><br />
              <div>
                <div className="pfv-platform-title">
                  Select the platform where you want to create the user stories
                </div>
                <div className="file-upload-ia-options">
                  <label>
                    <input
                      type="radio"
                      name="repo"
                      value="Azure"
                      checked={selectedRepo === "Azure"}
                      onChange={() => setSelectedRepo("Azure")}
                      disabled={isCreating}
                    />
                    Azure
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="repo"
                      value="Jira"
                      checked={selectedRepo === "Jira"}
                      onChange={() => setSelectedRepo("Jira")}
                      disabled={isCreating}
                    />
                    Jira
                  </label>
                </div>
                <br />
                <div>
                  <button
                    className="file-upload-submit"
                    type="submit"
                    disabled={isCreating}
                  >
                    {isCreating ? "Creating..." : "Create"}
                  </button>
                  {isCreating && (
                    <div className="file-upload-progress">
                      <span className="loader"></span> Creating user stories...
                    </div>
                  )}
                </div>
              </div>
            </section>
          ) : (
            <div style={{ marginTop: "2rem", color: "#334155", fontSize: "1.1rem", textAlign: "left", whiteSpace: "pre-wrap" }}>
              <em>No processed content available.</em>
            </div>
          )}
        </form>
        {showSuccess && (
          <div className="pfv-modal-bg">
            <div className="pfv-modal">
              <h2 style={{ color: "#334155", marginBottom: "1rem" }}>User stories were created successfully</h2>
              <button
                className="pfv-modal-btn"
                onClick={() => navigate("/")}
              >
                Accept
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
export default ProcessedFileView;