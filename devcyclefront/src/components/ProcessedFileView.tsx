import React from "react";
import AppHeader from "./AppHeader";
import "./FileUpload.css";

const ProcessedFileView: React.FC = () => {
  return (
    <div className="file-upload-bg">
      <AppHeader subtitle="Here you will see the processed file content." />
      <main className="file-upload-main">
        <h2>Processed File Content</h2>
        <div style={{ marginTop: "2rem", color: "#334155", fontSize: "1.1rem" }}>
          {/* Here you can render the processed file content */}
          <em>The processed content will be displayed here.</em>
        </div>
      </main>
    </div>
  );
};

export default ProcessedFileView;