
import { useState } from "react";
import api from "../services/api";
import "./AdminLogin.css";

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const response = await api.post(
        "/auth/login",
        new URLSearchParams({
          username: email,
          password,
        })
      );

      localStorage.setItem(
        "admin_token",
        response.data.access_token
      );

      window.location.href = "/admin/dashboard";
    } catch (error) {
      setMessage(
        error.response?.data?.detail || "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">

        <div className="login-brand">
          <div className="login-logo">🌿</div>
          <h1>Farmer Fresh</h1>
          <p>Fresh from farm to home</p>
        </div>

        <div className="login-heading">
          <h2>Admin Login</h2>
          <p>Welcome back! Please sign in.</p>
        </div>

        <form onSubmit={handleLogin}>
          <label>Email Address</label>
          <input
            type="email"
            placeholder="admin@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {message && (
            <div className="login-error">
              {message}
            </div>
          )}

          <button
            type="submit"
            className="login-submit"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In →"}
          </button>
        </form>

        <div className="login-footer">
          🌱 Farmer Fresh Market Admin Portal
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
