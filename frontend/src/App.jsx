import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Cars from "./pages/Cars";
import About from "./components/About";
import Services from "./components/Services";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import QuickActionFloat from "./components/QuickActionFloat";
import Booking from "./pages/Booking";
import AdminLogin from "./admin/AdminLogin";
import AdminDashboard from "./admin/AdminDashboard";
import { BUSINESS_CONFIG } from "./data/carsData";

function Home() {
  return (
    <div className="website">
      {/* Navigation Header */}
      <Navbar />

      {/* Hero Section */}
      <section className="hero" id="home">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <div className="location-pill">
            📍 AIROLI, MAHARASHTRA • CAR RENTAL & TOURS
          </div>

          <p className="small-title">WELCOME TO {BUSINESS_CONFIG.name.toUpperCase()}</p>

          <h1>
            Your Journey,
            <br />
            Our Responsibility.
          </h1>

          <p className="hero-text">
            Comfortable, safe, and reliable car rental and tour travel services in <strong>Airoli, Maharashtra</strong>. Well-maintained AC/Non-AC cars for outstation trips, local hourly rentals, and airport pick & drop.
          </p>

          <div className="hero-buttons">
            <a href="#cars" className="primary-btn">
              Explore Available Cars 🚗
            </a>

            <a href="#contact" className="secondary-btn">
              Contact & Inquiry 📞
            </a>
          </div>
        </div>
      </section>

      {/* Quick Service Highlights Strip */}
      <section className="highlights-strip">
        <div className="strip-container">
          <div className="strip-item">
            <span className="strip-icon">🚙</span>
            <div>
              <strong>Multiple Car Options</strong>
              <p>Sedan, MUV, SUV (1 to 7+ Seats)</p>
            </div>
          </div>

          <div className="strip-item">
            <span className="strip-icon">❄️</span>
            <div>
              <strong>AC & Non-AC Available</strong>
              <p>Clean, sanitized vehicles</p>
            </div>
          </div>

          <div className="strip-item">
            <span className="strip-icon">🗺️</span>
            <div>
              <strong>Outstation & Local</strong>
              <p>Tour packages across Maharashtra</p>
            </div>
          </div>

          <div className="strip-item">
            <span className="strip-icon">✈️</span>
            <div>
              <strong>Airport Pickup & Drop</strong>
              <p>Punctual transfers from Airoli</p>
            </div>
          </div>
        </div>
      </section>

      {/* Available Cars Section */}
      <Cars />

      {/* About Us Section */}
      <About />

      {/* Services Section */}
      <Services />

      {/* Contact Section */}
      <Contact />

      {/* Footer */}
      <Footer />

      {/* Quick Contact Float */}
      <QuickActionFloat />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;