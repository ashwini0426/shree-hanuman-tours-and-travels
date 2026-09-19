import { Link } from "react-router-dom";

function Services() {
  const servicesList = [
    {
      id: "outstation",
      icon: "🏞️",
      title: "Outstation Car Rentals",
      description: "Comfortable round-trip and one-way car rental services from Airoli to cities across Maharashtra and neighboring states."
    },
    {
      id: "local",
      icon: "🏙️",
      title: "Local Hourly Packages",
      description: "Flexible local car rental packages (e.g. 8 Hours / 80 Kms) ideal for shopping, meetings, and local sightseeing."
    },
    {
      id: "airport",
      icon: "✈️",
      title: "Airport Transfers",
      description: "Punctual airport pick & drop services to Chhatrapati Shivaji Maharaj International Airport (T1/T2) and regional hubs."
    },
    {
      id: "tours",
      icon: "🏖️",
      title: "Custom Tour Packages",
      description: "Tailored holiday tour rides to Mahabaleshwar, Lonavala, Khandala, Shirdi, Nashik, Alibaug, and the Konkan coast."
    },
    {
      id: "corporate",
      icon: "💼",
      title: "Corporate Car Rentals",
      description: "Reliable executive car rentals for business meetings, delegate transport, and office travel requirements."
    },
    {
      id: "events",
      icon: "🎉",
      title: "Event & Special Occasion Rentals",
      description: "Spacious car fleets (Sedans, MUVs, SUVs) for wedding functions, family gatherings, and group events."
    }
  ];

  return (
    <section className="services-section" id="services">
      <div className="services-container">
        <div className="services-header">
          <p className="sub-title">OUR SERVICES</p>
          <h2>Car Rental & Travel Solutions</h2>
          <span className="section-desc">
            Tailored car hire services designed for convenience, safety, and comfort.
          </span>
        </div>

        <div className="services-grid">
          {servicesList.map((service) => (
            <div className="service-card" key={service.id}>
              <div className="service-icon-wrap">{service.icon}</div>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
              <Link to="/booking" className="service-link">
                Book This Service →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Services;
