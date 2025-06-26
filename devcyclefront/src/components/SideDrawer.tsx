import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./SideDrawer.css";

interface SideDrawerProps {
  open: boolean;
  onClose: () => void;
}

const SideDrawer: React.FC<SideDrawerProps> = ({ open, onClose }) => {
  const [showResources, setShowResources] = useState(false);
  const [showGenerateUS, setShowGenerateUS] = useState(false);

  const handleClose = () => {
    setShowResources(false);
    setShowGenerateUS(false);
    onClose();
  };

  return (
    <>
      {open && (
        <div
          className="side-drawer-overlay"
          onClick={handleClose}
          tabIndex={-1}
          aria-label="Close menu"
        />
      )}

      <nav className={`side-drawer${open ? " open" : ""}`}>
        <button className="side-drawer-close" onClick={handleClose} aria-label="Close menu">
          <span />
          <span />
          <span />
        </button>
        <div className="drawer-content">
          {/* Main menu */}
          <ul className={`drawer-menu${showResources ? " hide" : ""}`}>
            <li>
              <Link to="/" onClick={onClose}>Home</Link>
            </li>
            <hr className="side-drawer-separator" />
            <li>
              <button className="drawer-link-btn drawer-link-arrow" onClick={() => setShowResources(true)}>
                <span>Resources</span>
                <span className="drawer-arrow">&#8250;</span>
              </button>
            </li>
            <hr className="side-drawer-separator" />
            <li>
              <Link to="/infrastructure" onClick={onClose}>Infrastructure Configuration</Link>
            </li>
            <hr className="side-drawer-separator" />
            <li>
              <Link to="/settings" onClick={onClose}>System Configuration</Link>
            </li>
          </ul>
          {/* Resources submenu */}
          <ul className={`drawer-menu drawer-submenu${showResources ? " show" : ""}`}>
            <li>
              <button className="drawer-back-btn" onClick={() => setShowResources(false)}>
                <span className="drawer-back-arrow">&#8249;</span>
              </button>
            </li>
            <li>
              <button className="drawer-link-btn drawer-link-arrow" onClick={() => { setShowGenerateUS(true) }}>
                <span>Generate User Stories</span>
                <span className="drawer-arrow">&#8250;</span>
              </button>
            </li>
            <hr className="side-drawer-separator" />
            <li>
              <Link to="/processUserStories" onClick={onClose}>Generate Code</Link>
            </li>
          </ul>
          {/* Generate US submenu */}
          <ul className={`drawer-menu drawer-submenu${showGenerateUS ? " show" : ""}`}>
            <li>
              <button className="drawer-back-btn" onClick={() => { setShowGenerateUS(false) }}>
                <span className="drawer-back-arrow">&#8249;</span>
              </button>
            </li>
            <li>
              <Link to="/upload" onClick={onClose}>Process document</Link>
            </li>
            <hr className="side-drawer-separator" />
            <li>
              <Link to="/review" onClick={onClose}>Review user stories</Link>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
};

export default SideDrawer;