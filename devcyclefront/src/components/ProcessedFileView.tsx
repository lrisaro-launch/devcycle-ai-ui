import React, { useState } from "react";
import { useProcessedFile } from "../context/ProcessedFileContext";
import { useNavigate } from "react-router-dom";
import AppHeader from "./AppHeader";
import "./FileUpload.css";

const ProcessedFileView: React.FC = () => {
  const { result } = useProcessedFile(); 
  const historias = result?.historias_de_usuario || result?.analisis?.historias_de_usuario;
  const [selectedRepo, setSelectedRepo] = useState<string>("Azure");
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsCreating(true);

      try {
        alert("Processing the document with " + selectedRepo + " AI...");
      // const response = await fetch("https://ai-devcrew-back.onrender.com/process-request", {
      //   method: "POST",
      //   body: formData,
      // });

      // if (!response.ok) {
      //   throw new Error("Failed to process the document.");
      // }

      // const result = await response.json();

      setIsCreating(false);
      setShowSuccess(true);
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
          <strong><div style={{ textAlign: "center", color: "#6366f1", marginBottom: "2rem", fontSize: 35  }}>Processed File Content</div></strong>
          {historias && Array.isArray(historias) && historias.length > 0 ? (
            <section style={{ margin: "2rem 0" }}>
              <h2 style={{ color: "#2563eb", marginBottom: "1.5rem", textAlign: "center" }}>Historias de Usuario</h2>
              <div style={{
                display: "flex",
                flexDirection: "column",
                gap: "1.5rem"
              }}>
                {historias.map((historia: any, idx: number) => (
                  <div
                    key={idx}
                    style={{
                      background: "#fff",
                      borderRadius: "12px",
                      padding: "1.5rem",
                      boxShadow: "0 4px 16px #0002",
                      border: "1px solid #e0e7ef",
                      display: "flex",
                      flexDirection: "column",
                      minHeight: "120px"
                    }}
                  >
                    <span style={{ color: "#6366f1", fontWeight: 700, fontSize: "1.15rem", marginBottom: "0.5rem" }}>
                      {idx + 1}. {historia.epica}
                    </span>
                    <span style={{ color: "#334155", fontSize: "1rem", lineHeight: 1.6 }}>
                      {historia.historia}
                    </span>
                  </div>
                ))}
              </div>
              <br /><br />
                <div> 
                  <strong>
                    <div style={{ textAlign: "center", color: "#6366f1", marginBottom: "2rem", fontSize: 35 }}>
                      Select the plataform where you want to create the user stories
                    </div>
                  </strong>
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
          <div style={{
            position: "fixed",
            top: 0, left: 0, right: 0, bottom: 0,
            background: "rgba(0,0,0,0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000
          }}>
            <div style={{
              background: "#fff",
              borderRadius: "12px",
              padding: "2rem 2.5rem",
              boxShadow: "0 4px 24px #0003",
              textAlign: "center",
              minWidth: 320
            }}>
              <h2 style={{ color: "#334155", marginBottom: "1rem" }}>User stories were created successfully</h2>
              <button
                style={{
                  padding: "0.5rem 2rem",
                  background: "#6366f1",
                  color: "#fff",
                  border: "none",
                  borderRadius: "6px",
                  fontWeight: 600,
                  cursor: "pointer"
                }}
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