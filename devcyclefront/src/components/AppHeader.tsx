import React from "react";
import { Link } from "react-router-dom";
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
    <h1>
      <Link to="/" style={{ color: "inherit", textDecoration: "none", cursor: "pointer" }}>
        {title}
      </Link>
    </h1>
    <p>{subtitle}</p>
  </header>
);

export default AppHeader;