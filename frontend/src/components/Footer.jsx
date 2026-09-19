import { Link } from "react-router-dom";
import { BUSINESS_CONFIG } from "../data/carsData";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-brand">
          <h3>🚗 {BUSINESS_CONFIG.name}</h3>
          <p>
            Your trusted car rental and travel service provider based in <strong>Airoli, Maharashtra</strong>. Safe, comfortable, and affordable rides for every journey.
          </p>
          <div className="footer-loc-tag">📍 Airoli, Navi Mumbai, Maharashtra</div>
        </div>

        <div className="footer-links">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="#home">Home</a></li>
            <li><a href="#cars">View Cars</a></li>
            <li><a href="#about">About Us</a></li>
            <li><a href="#services">Services</a></li>
            <li><a href="#contact">Contact Us</a></li>
            <li><Link to="/booking">Book Car</Link></li>
          </ul>
        </div>

        <div className="footer-services">
          <h4>Our Car Services</h4>
          <ul>
            <li>Outstation Car Rental</li>
            <li>Local Hourly Hire</li>
            <li>Airport Pick & Drop</li>
            <li>Corporate Car Rental</li>
            <li>Tour Packages</li>
          </ul>
        </div>

        <div className="footer-contact">
          <h4>Contact & Location</h4>
          <p><strong>Primary:</strong> {BUSINESS_CONFIG.primaryPhone}</p>
          <p><strong>Alternate:</strong> {BUSINESS_CONFIG.alternatePhone}</p>
          <p><strong>Location:</strong> Airoli, Maharashtra</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {currentYear} {BUSINESS_CONFIG.name}. All Rights Reserved. | Based in Airoli, Maharashtra</p>
      </div>
    </footer>
  );
}

export default Footer;
