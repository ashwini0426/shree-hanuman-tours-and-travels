import { Link } from "react-router-dom";
import { BUSINESS_CONFIG } from "../data/carsData";

function QuickActionFloat() {
  const primaryWhatsappUrl = `https://wa.me/${BUSINESS_CONFIG.primaryWhatsapp}?text=${encodeURIComponent(
    `Hello ${BUSINESS_CONFIG.name}, I would like to inquire about car booking from Airoli.`
  )}`;

  const alternateWhatsappUrl = `https://wa.me/${BUSINESS_CONFIG.alternateWhatsapp}?text=${encodeURIComponent(
    `Hello ${BUSINESS_CONFIG.name}, I am reaching out via alternate WhatsApp regarding car hire in Airoli.`
  )}`;

  return (
    <div className="quick-action-float">
      {/* Primary WhatsApp */}
      <a
        href={primaryWhatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="float-btn whatsapp-btn primary-float"
        title="WhatsApp (Primary)"
      >
        <span className="btn-icon">💬</span>
        <span className="btn-text">Primary WhatsApp</span>
      </a>

      {/* Alternate WhatsApp */}
      <a
        href={alternateWhatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="float-btn whatsapp-btn alt-float"
        title="WhatsApp (Alternate)"
      >
        <span className="btn-icon">📱</span>
        <span className="btn-text">Alternate WhatsApp</span>
      </a>

      {/* Quick Booking */}
      <Link
        to="/booking"
        className="float-btn book-btn"
        title="Book Car Online"
      >
        <span className="btn-icon">🚗</span>
        <span className="btn-text">Book Ride</span>
      </Link>
    </div>
  );
}

export default QuickActionFloat;
