import { useState } from "react";
import { BUSINESS_CONFIG } from "../data/carsData";
import { supabase } from "../lib/supabaseClient";

function Contact() {
  const [formState, setFormState] = useState({
    name: "",
    mobile: "",
    email: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [inquiryId, setInquiryId] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const newInquiryId = `INQ-${Date.now()}`;

      // Save inquiry to Supabase
      const { error: supabaseError } = await supabase
        .from("inquiries")
        .insert([
          {
            id: newInquiryId,
            name: formState.name.trim(),
            mobile: formState.mobile.trim(),
            email: formState.email.trim(),
            message: formState.message.trim(),
            status: "New",
            created_at: new Date().toISOString(),
          },
        ]);

      if (supabaseError) {
        console.error("Supabase inquiry error:", supabaseError);
        throw supabaseError;
      }

      console.log(
        "Inquiry saved successfully:",
        newInquiryId
      );

      // WhatsApp message
      const whatsappMessage = `
Hello ${BUSINESS_CONFIG.name},

I have a new inquiry from the website.

Inquiry ID: ${newInquiryId}

Name: ${formState.name}
Mobile: ${formState.mobile}
Email: ${formState.email || "Not provided"}

Message / Requirement:
${formState.message}

Thank you.
      `.trim();

      const whatsappUrl = `https://wa.me/${
        BUSINESS_CONFIG.primaryWhatsapp
      }?text=${encodeURIComponent(whatsappMessage)}`;

      setInquiryId(newInquiryId);

      // Reset form
      setFormState({
        name: "",
        mobile: "",
        email: "",
        message: "",
      });

      setSubmitted(true);

      // Open WhatsApp
      window.open(
        whatsappUrl,
        "_blank",
        "noopener,noreferrer"
      );
    } catch (error) {
      console.error("Contact Form Error:", error);

      alert(
        "Something went wrong while saving your inquiry. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // General WhatsApp links
  const primaryWaUrl = `https://wa.me/${
    BUSINESS_CONFIG.primaryWhatsapp
  }?text=${encodeURIComponent(
    `Hello ${BUSINESS_CONFIG.name}, I would like to inquire about car rentals from Airoli.`
  )}`;

  const alternateWaUrl = `https://wa.me/${
    BUSINESS_CONFIG.alternateWhatsapp
  }?text=${encodeURIComponent(
    `Hello ${BUSINESS_CONFIG.name}, I am reaching out via alternate WhatsApp regarding car rental service.`
  )}`;

  return (
    <section
      className="contact-section"
      id="contact"
    >
      <div className="contact-container">

        {/* HEADER */}
        <div className="contact-header">
          <p className="sub-title">
            GET IN TOUCH
          </p>

          <h2>
            Contact Shree Hanuman Tours & Travels
          </h2>

          <span>
            We are ready to assist you with your
            car rental and tour bookings in Airoli,
            Maharashtra.
          </span>
        </div>

        <div className="contact-grid">

          {/* CONTACT INFORMATION */}
          <div className="contact-info-card">

            <h3>Contact Details</h3>

            <p className="info-intro">
              Reach out to us directly via call or
              WhatsApp for instant car availability
              and tour inquiries.
            </p>

            {/* Location */}
            <div className="contact-detail-item">
              <span className="detail-icon">
                📍
              </span>

              <div>
                <strong>
                  Location & Address:
                </strong>

                <p>
                  {BUSINESS_CONFIG.addressPlaceholder}
                </p>
              </div>
            </div>

            {/* Primary Phone */}
            <div className="contact-detail-item">
              <span className="detail-icon">
                📞
              </span>

              <div>
                <strong>
                  Primary Phone / Call:
                </strong>

                <p>
                  <a
                    href={`tel:${BUSINESS_CONFIG.primaryPhone}`}
                  >
                    {BUSINESS_CONFIG.primaryPhone}
                  </a>
                </p>
              </div>
            </div>

            {/* Primary WhatsApp */}
            <div className="contact-detail-item">
              <span className="detail-icon">
                💬
              </span>

              <div>
                <strong>
                  Primary WhatsApp:
                </strong>

                <p>
                  <a
                    href={primaryWaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contact-wa-link primary-wa"
                  >
                    💬 Chat on Primary WhatsApp (
                    {BUSINESS_CONFIG.primaryPhone}
                    )
                  </a>
                </p>
              </div>
            </div>

            {/* Alternate Phone */}
            <div className="contact-detail-item">
              <span className="detail-icon">
                📱
              </span>

              <div>
                <strong>
                  Alternate Phone / Call:
                </strong>

                <p>
                  <a
                    href={`tel:${BUSINESS_CONFIG.alternatePhone}`}
                  >
                    {BUSINESS_CONFIG.alternatePhone}
                  </a>
                </p>
              </div>
            </div>

            {/* Alternate WhatsApp */}
            <div className="contact-detail-item">
              <span className="detail-icon">
                💬
              </span>

              <div>
                <strong>
                  Alternate WhatsApp:
                </strong>

                <p>
                  <a
                    href={alternateWaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contact-wa-link alternate-wa"
                  >
                    💬 Chat on Alternate WhatsApp (
                    {BUSINESS_CONFIG.alternatePhone}
                    )
                  </a>
                </p>
              </div>
            </div>

            {/* Email */}
            <div className="contact-detail-item">
              <span className="detail-icon">
                ✉️
              </span>

              <div>
                <strong>
                  Email:
                </strong>

                <p>
                  {BUSINESS_CONFIG.emailPlaceholder}
                </p>
              </div>
            </div>

          </div>

          {/* INQUIRY FORM */}
          <div className="contact-form-card">

            <h3>
              Send Us an Inquiry
            </h3>

            {submitted ? (

              <div className="contact-success-msg">

                <span className="success-icon">
                  ✅
                </span>

                <h4>
                  Thank You!
                </h4>

                <p>
                  Your inquiry has been submitted
                  successfully.
                </p>

                {inquiryId && (
                  <p>
                    <strong>
                      Inquiry ID:
                    </strong>{" "}
                    {inquiryId}
                  </p>
                )}

                <p>
                  A WhatsApp message has been
                  prepared for the business.
                </p>

                <button
                  className="reset-btn"
                  onClick={() => {
                    setSubmitted(false);
                    setInquiryId("");
                  }}
                >
                  Send Another Message
                </button>

              </div>

            ) : (

              <form
                onSubmit={handleSubmit}
                className="inquiry-form"
              >

                {/* Name */}
                <div className="form-group">
                  <label htmlFor="contact-name">
                    Full Name *
                  </label>

                  <input
                    id="contact-name"
                    type="text"
                    name="name"
                    value={formState.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                {/* Mobile */}
                <div className="form-group">
                  <label htmlFor="contact-mobile">
                    Mobile Number *
                  </label>

                  <input
                    id="contact-mobile"
                    type="tel"
                    name="mobile"
                    value={formState.mobile}
                    onChange={handleChange}
                    placeholder="Enter your mobile number"
                    required
                  />
                </div>

                {/* Email */}
                <div className="form-group">
                  <label htmlFor="contact-email">
                    Email
                  </label>

                  <input
                    id="contact-email"
                    type="email"
                    name="email"
                    value={formState.email}
                    onChange={handleChange}
                    placeholder="Enter your email address"
                  />
                </div>

                {/* Message */}
                <div className="form-group">
                  <label htmlFor="contact-message">
                    Message / Requirement *
                  </label>

                  <textarea
                    id="contact-message"
                    name="message"
                    value={formState.message}
                    onChange={handleChange}
                    placeholder="Tell us about your requirement..."
                    rows="5"
                    required
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="submit-inquiry-btn"
                  disabled={loading}
                >
                  {loading
                    ? "Submitting..."
                    : "Send Inquiry"}
                </button>

              </form>

            )}

          </div>

        </div>

        {/* MAP */}
        <div className="contact-map-wrapper">

          <h3>
            Find Us in Airoli
          </h3>

          <iframe
            title="Shree Hanuman Tours & Travels Location"
            src="https://www.google.com/maps?q=Airoli,Navi%20Mumbai,Maharashtra&output=embed"
            width="100%"
            height="350"
            style={{
              border: 0,
              borderRadius: "12px",
            }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />

        </div>

      </div>
    </section>
  );
}

export default Contact;