import { BUSINESS_CONFIG } from "../data/carsData";

function About() {
  return (
    <section className="about-section" id="about">
      <div className="about-container">
        <div className="about-header">
          <p className="sub-title">ABOUT US</p>
          <h2>Reliable Car Rental & Tour Services in Airoli</h2>
          <div className="title-divider"></div>
        </div>

        <div className="about-grid">
          <div className="about-text-content">
            <h3>Welcome to {BUSINESS_CONFIG.name}</h3>
            <p className="about-intro">
              Located in <strong>Airoli, Maharashtra</strong>, we specialize in providing comfortable, safe, and dependable car rental and travel services for families, corporate clients, and group trips.
            </p>
            <p>
              Whether you need a quick local city ride, a comfortable sedan for outstation trips, a spacious MUV/SUV for family travel, or a tour package across Maharashtra, we offer well-maintained vehicles tailored to your schedule.
            </p>

            <div className="about-features">
              <div className="feature-item">
                <span className="feature-icon">🚙</span>
                <div>
                  <h4>Well-Maintained Fleet</h4>
                  <p>Clean, sanitized AC & Non-AC cars equipped for short and long-distance travel.</p>
                </div>
              </div>

              <div className="feature-item">
                <span className="feature-icon">👨‍✈️</span>
                <div>
                  <h4>Experienced Drivers</h4>
                  <p>Courteous, punctual, and knowledgeable drivers for safe journeys.</p>
                </div>
              </div>

              <div className="feature-item">
                <span className="feature-icon">🏷️</span>
                <div>
                  <h4>Transparent Pricing</h4>
                  <p>Clear per-km rates, extra hour charges, and driver allowance with no surprises.</p>
                </div>
              </div>

              <div className="feature-item">
                <span className="feature-icon">📍</span>
                <div>
                  <h4>Local Convenience</h4>
                  <p>Convenient pickup and drop points across Airoli, Navi Mumbai, and surrounding regions.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="about-card-visual">
            <div className="visual-card">
              <div className="card-badge">LOCATION</div>
              <h3>Airoli, Maharashtra</h3>
              <p>Your local partner for outstation tours, local travel, and airport pick & drop services.</p>
              <ul className="service-checklist">
                <li>✓ Outstation Car Rentals</li>
                <li>✓ Local Hourly Packages</li>
                <li>✓ Airport Transfers</li>
                <li>✓ Customized Tour Packages</li>
              </ul>
              <a href="#cars" className="about-cta-btn">View Available Cars</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
