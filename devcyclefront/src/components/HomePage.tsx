import React from "react";
import { Link } from "react-router-dom";
import AppHeader from "./AppHeader";
import "./HomePage.css";
import AppFooter from "./AppFooter";
import logo from "../images/ailogo.png";

const areas = [
  {
    icon: (
      <span className="area-icon">&#9881;</span>
    ),
    title: "Automation",
    desc: "Automatically generate user stories.",
  },
  {
    icon: (
      <span className="area-icon">&#129302;</span>
    ),
    title: "Applied AI",
    desc: "Intelligent document processing.",
  },
  {
    icon: (
      <span className="area-icon">&#128190;</span>
    ),
    title: "Easy Export",
    desc: "Export to Jira, Azure, and more with one click.",
  },
];

const HomePage: React.FC = () => (
  <div className="homepage-bg">
    <AppHeader />
    {/* HERO */}
    <section className="homepage-hero">
      <div className="homepage-hero-content">
        <div>
            <img src={logo} alt="Logo" className="homepage-logo" />
        </div>
        <h1 className="homepage-title">
          Automatic user stories<br />for your software projects
        </h1>
        <p className="homepage-desc">
          Upload your functional document and our AI will generate user stories ready to export to Jira, Azure, and more.
        </p>
        <div className="homepage-hero-buttons">
          <Link to="/upload" className="homepage-btn homepage-btn-primary">
            Upload your document
          </Link>
        </div>
        <br />
      </div>
    </section>
    {/* Areas / Benefits */}
    <section id="areas" className="homepage-areas">
      <h2 className="homepage-areas-title">Why use DevCycle AI?</h2>
      <div className="homepage-areas-list">
        {areas.map((area, idx) => (
          <div key={idx} className="homepage-area-card">
            {area.icon}
            <h3>{area.title}</h3>
            <p>{area.desc}</p>
          </div>
        ))}
      </div>
    </section>
    <AppFooter />
  </div>
);

export default HomePage;