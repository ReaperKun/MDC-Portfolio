import React from "react";
import "./css/Hero.css";
import logo from "../assets/mdc-logo.svg";
import figmaLogo from "../assets/figma-logo.svg";
import javaLogo from "../assets/java-logo.svg";
import pythonLogo from "../assets/python-logo.svg";
import avatar1 from "../assets/avatar1.svg";
import avatar2 from "../assets/avatar2.svg";
import avatar3 from "../assets/avatar3.svg";

const Hero: React.FC = () => {
  return (
    <section className="section hero">
      <nav className="navBar">
        <div className="navbar-left">
          <img src={logo} alt="MDC Logo" />
          <ul className="nav-links">
            <li>About</li>
            <li>Our Mentors</li>
            <li>Gallery</li>
            <li>Events</li>
            <li>Domains</li>
            <li>Our Team</li>
          </ul>
        </div>

        <div className="nav-buttons">
          <button className="btn">Contact Us</button>
          <button className="btn">Log in</button>
        </div>
      </nav>
    </section>
  );
};

export default Hero;
