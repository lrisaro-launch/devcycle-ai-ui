import React from "react";
import { Link } from "react-router-dom";
import "./SideDrawer.css";

interface SideDrawerProps {
  open: boolean;
  onClose: () => void;
}

const SideDrawer: React.FC<SideDrawerProps> = ({ open, onClose }) => (
  <>
    <nav className={`side-drawer${open ? " open" : ""}`}>
      <button className="side-drawer-close" onClick={onClose} aria-label="Close menu">
        <span />
        <span />
        <span />
      </button>
      <ul>
        <li>
          <Link to="/" onClick={onClose}>Home</Link>
        </li>
        <hr className="side-drawer-separator" />
        <li>
          <Link to="/review" onClick={onClose}>Review user stories</Link>
        </li>
        <hr className="side-drawer-separator" />
        <li>
          <Link to="/configuration" onClick={onClose}>Configuration</Link>
        </li>
      </ul>
    </nav>
  </>
);

export default SideDrawer;