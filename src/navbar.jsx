import React, { useState } from 'react';
import './navbar.css';

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  return (
    <div id='home' className="navbar">
      <button className="hamburger" onClick={toggleMenu} aria-label="Toggle navigation menu">
        ☰
      </button>
      <div className={`links ${menuOpen ? 'show' : ''}`}>
        <a href="#home" onClick={closeMenu}>Home</a>
        <a href="#projects" onClick={closeMenu}>Projects</a>
        <a href="#experience" onClick={closeMenu}>Experience</a>
        <a href="#about" onClick={closeMenu}>About</a>
        <a href="#contact" onClick={closeMenu}>Contact</a>
      </div>
      <div className="resume">
        <a href="./assets/General.pdf" download className="download">Download Resume</a>
      </div>
    </div>
  );
}

export default Navbar;
