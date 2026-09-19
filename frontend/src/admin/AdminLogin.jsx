import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { BUSINESS_CONFIG } from "../data/carsData";
import "./AdminCss.css";

function AdminLogin() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username.trim(),
          password: password,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.message || "Invalid username or password.");
        setLoading(false);
        return;
      }

      // Save JWT token
      localStorage.setItem("admin_token", data.token);

      // Save admin information
      localStorage.setItem(
        "admin_user",
        JSON.stringify(data.admin)
      );

      // Save login status
      localStorage.setItem("admin_auth", "true");

      // Open Admin Dashboard
      navigate("/admin/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      setError(
        "Unable to connect to server. Please make sure backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">

        {/* Brand Icon */}
        <div className="login-brand-icon">🚗</div>

        {/* Business Name */}
        <h2>{BUSINESS_CONFIG.name}</h2>

        <p>Owner Login</p>

        {/* Error Message */}
        {error && (
          <div className="error-msg-box">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="login-form">

          {/* Username */}
          <div className="form-group">
            <label htmlFor="username">
              Username
            </label>

            <input
              id="username"
              type="text"
              placeholder="Enter owner username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              required
            />
          </div>

          {/* Password */}
          <div className="form-group">
            <label htmlFor="password">
              Password
            </label>

            <input
              id="password"
              type="password"
              placeholder="Enter owner password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="login-btn"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login to Owner Panel"}
          </button>

        </form>

        {/* Back to Customer Website */}
        <Link
          to="/"
          className="back-to-site-link"
        >
          ← Return to Customer Website
        </Link>

      </div>
    </div>
  );
}

export default AdminLogin;