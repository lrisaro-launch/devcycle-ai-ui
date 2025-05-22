import React from "react";
import "./AppHeader.css";

interface AppHeaderProps {
  title?: string;
  subtitle?: string;
}

const AppHeader: React.FC<AppHeaderProps> = ({
  title = "AI Document Processor",
  subtitle = "Upload your file and process it with AI",
}) => (
  <header className="app-header">
    <h1>{title}</h1>
    <p>{subtitle}</p>
  </header>
);

export default AppHeader;