import React, { useState } from "react";
import "./AppHeader.css";
import logo from "../images/logo.png";
import SideDrawer from "./SideDrawer";
import { useTheme } from "../context/ThemeContext";

interface AppHeaderProps {
  title?: string;
}

const AppHeader: React.FC<AppHeaderProps> = ({
  title = "Launch DevCycle AI",
}) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="app-header">
      <div className="header-content">
        <button
          className="side-menu-hamburger"
          aria-label="Open menu"
          onClick={() => setDrawerOpen(true)}
        >
          <span />
          <span />
          <span />
        </button>
        <img src={logo} alt="Logo" className="header-logo" />
        <h1>{title}</h1>
        <button
          className="theme-toggle-btn"
          onClick={toggleTheme}
          aria-label="Toggle theme"
          style={{
            marginLeft: "auto",
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: "1.5rem",
            color: "inherit",
            outline: "none",   
            boxShadow: "none"
          }}
        >
          {theme === "dark" ? "🌙" : "🌞"}
        </button>
      </div>
      <SideDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </header>
  );
};

export default AppHeader;