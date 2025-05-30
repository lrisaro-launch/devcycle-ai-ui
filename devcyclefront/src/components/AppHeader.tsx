import React, { useState } from "react";
import "./AppHeader.css";
import logo from "../images/logo.png";
import SideDrawer from "./SideDrawer";

interface AppHeaderProps {
  title?: string;
}

const AppHeader: React.FC<AppHeaderProps> = ({
  title = "Launch DevCycle AI",
}) => {
  const [drawerOpen, setDrawerOpen] = useState(false);

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
      </div>
      <SideDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </header>
  );
};

export default AppHeader;