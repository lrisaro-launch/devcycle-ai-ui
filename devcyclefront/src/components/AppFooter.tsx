import React from "react";
import "./AppFooter.css"; // O crea un AppFooter.css si prefieres

const AppFooter: React.FC = () => (
  <footer className="homepage-footer">
    © {new Date().getFullYear()} DevCycle AI — User stories with AI
  </footer>
);

export default AppFooter;