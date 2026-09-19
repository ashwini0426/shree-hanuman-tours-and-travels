import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { BUSINESS_CONFIG } from "../data/carsData";
import AdminCars from "./AdminCars";
import AdminBookings from "./AdminBookings";
import AdminInquiries from "./AdminInquiries";
import "./AdminCss.css";

const CARS_STORAGE_KEY = "shree_hanuman_cars";
const BOOKINGS_STORAGE_KEY = "shree_hanuman_bookings";
const INQUIRIES_STORAGE_KEY = "shree_hanuman_inquiries";

function AdminDashboard() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [stats, setStats] = useState({
    totalCars: 0,
    availableCars: 0,
    carsOnBooking: 0,
    totalBookings: 0,
    pendingBookings: 0,
    totalInquiries: 0,
  });

  // =========================
  // Authentication
  // =========================
  useEffect(() => {
    const token = localStorage.getItem("admin_token");

    if (!token) {
      navigate("/admin/login");
      return;
    }

    loadStats();
  }, [navigate]);

  // =========================
  // Load Real Stats
  // =========================
  const loadStats = () => {
    try {
      // -------------------------
      // Cars
      // -------------------------
      const savedCars = localStorage.getItem(
        CARS_STORAGE_KEY
      );

      const cars = savedCars
        ? JSON.parse(savedCars)
        : [];

      const totalCars = Array.isArray(cars)
        ? cars.length
        : 0;

      const availableCars = Array.isArray(cars)
        ? cars.filter(
            (car) => car.status === "Available"
          ).length
        : 0;

      const carsOnBooking = Array.isArray(cars)
        ? cars.filter(
            (car) => car.status === "On Booking"
          ).length
        : 0;

      // -------------------------
      // Bookings
      // -------------------------
      const savedBookings = localStorage.getItem(
        BOOKINGS_STORAGE_KEY
      );

      const bookings = savedBookings
        ? JSON.parse(savedBookings)
        : [];

      const totalBookings = Array.isArray(bookings)
        ? bookings.length
        : 0;

      const pendingBookings = Array.isArray(bookings)
        ? bookings.filter(
            (booking) =>
              !booking.status ||
              booking.status === "Pending"
          ).length
        : 0;

      // -------------------------
      // Inquiries
      // -------------------------
      const savedInquiries = localStorage.getItem(
        INQUIRIES_STORAGE_KEY
      );

      const inquiries = savedInquiries
        ? JSON.parse(savedInquiries)
        : [];

      const totalInquiries = Array.isArray(inquiries)
        ? inquiries.length
        : 0;

      // -------------------------
      // Update Stats
      // -------------------------
      setStats({
        totalCars,
        availableCars,
        carsOnBooking,
        totalBookings,
        pendingBookings,
        totalInquiries,
      });

    } catch (error) {
      console.error(
        "Error loading dashboard stats:",
        error
      );

      setStats({
        totalCars: 0,
        availableCars: 0,
        carsOnBooking: 0,
        totalBookings: 0,
        pendingBookings: 0,
        totalInquiries: 0,
      });
    }
  };

  // =========================
  // Refresh Stats
  // =========================
  useEffect(() => {
    const handleStorageChange = () => {
      loadStats();
    };

    window.addEventListener(
      "storage",
      handleStorageChange
    );

    const interval = setInterval(() => {
      loadStats();
    }, 2000);

    return () => {
      window.removeEventListener(
        "storage",
        handleStorageChange
      );

      clearInterval(interval);
    };
  }, []);

  // =========================
  // Logout
  // =========================
  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_auth");
    localStorage.removeItem("admin_user");

    navigate("/admin/login");
  };

  return (
    <div className="admin-layout">

      {/* =========================
          SIDEBAR
      ========================= */}
      <aside
        className={`admin-sidebar ${
          sidebarOpen ? "open" : ""
        }`}
      >

        <div className="sidebar-header">

          <div
            className="logo-icon"
            style={{
              width: "36px",
              height: "36px",
              fontSize: "20px",
            }}
          >
            🚗
          </div>

          <div>
            <span className="sidebar-brand-name">
              {BUSINESS_CONFIG.name}
            </span>

            <span className="sidebar-brand-sub">
              ADMIN PORTAL
            </span>
          </div>

        </div>

        {/* Sidebar Navigation */}
        <nav className="sidebar-nav">

          <button
            className={`nav-item-btn ${
              activeTab === "dashboard"
                ? "active"
                : ""
            }`}
            onClick={() => {
              setActiveTab("dashboard");
              setSidebarOpen(false);
              loadStats();
            }}
          >
            📊 Dashboard Summary
          </button>

          <button
            className={`nav-item-btn ${
              activeTab === "cars"
                ? "active"
                : ""
            }`}
            onClick={() => {
              setActiveTab("cars");
              setSidebarOpen(false);
              loadStats();
            }}
          >
            🚘 Fleet Management ({stats.totalCars})
          </button>

          <button
            className={`nav-item-btn ${
              activeTab === "bookings"
                ? "active"
                : ""
            }`}
            onClick={() => {
              setActiveTab("bookings");
              setSidebarOpen(false);
              loadStats();
            }}
          >
            📋 Bookings ({stats.totalBookings})
          </button>

          <button
            className={`nav-item-btn ${
              activeTab === "inquiries"
                ? "active"
                : ""
            }`}
            onClick={() => {
              setActiveTab("inquiries");
              setSidebarOpen(false);
              loadStats();
            }}
          >
            💬 Contact Inquiries ({stats.totalInquiries})
          </button>

        </nav>

        {/* Sidebar Footer */}
        <div className="sidebar-footer">

          <Link
            to="/"
            className="nav-item-btn main-site-btn"
          >
            🌐 View Customer Website
          </Link>

          <button
            onClick={handleLogout}
            className="nav-item-btn logout-btn"
          >
            🚪 Logout
          </button>

        </div>

      </aside>

      {/* =========================
          MAIN CONTENT
      ========================= */}
      <main className="admin-main">

        {/* Top Bar */}
        <div className="admin-topbar">

          <div>
            <h1>Admin Control Panel</h1>

            <span
              style={{
                color: "#64748b",
                fontSize: "14px",
              }}
            >
              Location:{" "}
              <strong>
                Airoli, Maharashtra
              </strong>{" "}
              • Real-time Car Fleet & Booking
              Management
            </span>
          </div>

          <div
            style={{
              display: "flex",
              gap: "12px",
              alignItems: "center",
            }}
          >

            <span className="admin-user-tag">
              👤 Admin Authorized
            </span>

            <button
              className="hamburger-btn"
              style={{ display: "none" }}
              onClick={() =>
                setSidebarOpen(!sidebarOpen)
              }
            >
              <span></span>
              <span></span>
              <span></span>
            </button>

          </div>

        </div>

        {/* =========================
            STATS CARDS
        ========================= */}
        <div className="stats-cards-grid">

          {/* Total Cars */}
          <div className="stat-card">

            <div className="stat-icon icon-blue">
              🚗
            </div>

            <div className="stat-info">
              <h3>{stats.totalCars}</h3>
              <p>Total Cars</p>
            </div>

          </div>

          {/* Available Cars */}
          <div className="stat-card">

            <div className="stat-icon icon-green">
              ✅
            </div>

            <div className="stat-info">
              <h3>
                {stats.availableCars}
              </h3>

              <p>Available Cars</p>
            </div>

          </div>

          {/* Cars On Booking */}
          <div className="stat-card">

            <div className="stat-icon icon-orange">
              📌
            </div>

            <div className="stat-info">
              <h3>
                {stats.carsOnBooking}
              </h3>

              <p>Cars On Booking</p>
            </div>

          </div>

          {/* Total Bookings */}
          <div className="stat-card">

            <div className="stat-icon icon-purple">
              📋
            </div>

            <div className="stat-info">
              <h3>
                {stats.totalBookings}
              </h3>

              <p>Total Bookings</p>
            </div>

          </div>

          {/* Pending Bookings */}
          <div className="stat-card">

            <div className="stat-icon icon-amber">
              ⏳
            </div>

            <div className="stat-info">
              <h3>
                {stats.pendingBookings}
              </h3>

              <p>Pending Bookings</p>
            </div>

          </div>

        </div>

        {/* =========================
            TAB CONTENT
        ========================= */}

        {activeTab === "dashboard" && (
          <div>

            <AdminCars />

            <div
              style={{
                marginTop: "32px",
              }}
            >
              <AdminBookings />
            </div>

          </div>
        )}

        {activeTab === "cars" && (
          <AdminCars />
        )}

        {activeTab === "bookings" && (
          <AdminBookings />
        )}

        {activeTab === "inquiries" && (
          <AdminInquiries />
        )}

      </main>

    </div>
  );
}

export default AdminDashboard;