import React from "react";
import { Link } from "react-router-dom";
import "./AppHeader.css";
import logo from "../images/logo.png";

interface AppHeaderProps {
  title?: string;
}

const AppHeader: React.FC<AppHeaderProps> = ({
  title = "Launch AI Functional Document Processor",
}) => (
  <header className="app-header">
    <div className="header-content">
      <img src={logo} alt="Logo" className="header-logo" />
      <div>
        <h1>
          <Link to="/" style={{ color: "inherit", textDecoration: "none", cursor: "pointer" }}>
            {title}
          </Link>
        </h1>
      </div>
    </div>
  </header>
);

export default AppHeader;