import React from "react";
import ReactDOM from "react-dom/client";
import { Navigation } from "./components/Navigation";
import { Hero } from "./components/Hero";
import { PortfolioSections } from "./components/PortfolioSections";
import "./styles.css";
import { FullPageExperience } from "./components/FullPageExperience";
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <a className="skip-link" href="#about">
      본문으로 건너뛰기
    </a>
    <Navigation />
    <FullPageExperience>
      <Hero />
      <PortfolioSections />
    </FullPageExperience>
  </React.StrictMode>,
);
