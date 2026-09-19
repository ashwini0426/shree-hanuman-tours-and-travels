import { useState } from "react";
import { Link } from "react-router-dom";
import { BUSINESS_CONFIG } from "../data/carsData";

function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="site-header">
      <nav className="navbar">

        {/* Logo */}
        <Link to="/" className="logo-container" onClick={closeMenu}>
          <div className="logo-icon">🚗</div>

          <div className="logo-text">
            <span className="brand-name">
              {BUSINESS_CONFIG.name}
            </span>

            <span className="brand-sub">
              CAR RENTAL & TOURS • AIROLI
            </span>
          </div>
        </Link>

        {/* Location Badge */}
        <div className="location-badge">
          📍 Airoli, Maharashtra
        </div>

        {/* Navigation Menu */}
        <div className={`nav-links ${mobileMenuOpen ? "active" : ""}`}>

          <a href="#home" onClick={closeMenu}>
            Home
          </a>

          <a href="#cars" onClick={closeMenu}>
            Cars Fleet
          </a>

          <a href="#about" onClick={closeMenu}>
            About Us
          </a>

          <a href="#services" onClick={closeMenu}>
            Services
          </a>

          <a href="#contact" onClick={closeMenu}>
            Contact
          </a>

          {/* Mobile Book Button */}
          <Link
            to="/booking"
            className="nav-button mobile-only-btn"
            onClick={closeMenu}
          >
            Book Now
          </Link>

          {/* 🔐 Admin Login */}
          <Link
            to="/admin/login"
            className="admin-menu-link"
            onClick={closeMenu}
          >
            🔐 Admin Login
          </Link>

        </div>

        {/* Header Actions */}
        <div className="header-actions">

          <Link to="/booking" className="nav-button">
            Book Ride Now
          </Link>

          {/* Hamburger */}
          <button
            className={`hamburger-btn ${
              mobileMenuOpen ? "open" : ""
            }`}
            onClick={toggleMenu}
            aria-label="Toggle navigation menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

        </div>

      </nav>
    </header>
  );
}

export default Navbar;