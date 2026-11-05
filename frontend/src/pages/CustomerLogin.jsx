
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./CustomerLogin.css";

function CustomerLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new URLSearchParams();
    formData.append("username", email);
    formData.append("password", password);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/auth/customer/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          body: formData
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Login failed");
      }

      localStorage.setItem("customer_token", data.access_token);
      localStorage.setItem("customer", JSON.stringify(data.customer));

      navigate("/products");

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="customer-login-page">
      <div className="customer-login-card">

        <div className="customer-login-logo">🌿</div>

        <span className="customer-login-brand">
          FARMER FRESH MARKET
        </span>

        <h1>Customer Login</h1>

        <p>Login to order fresh farm products.</p>

        <form onSubmit={handleSubmit}>

          <label>Email Address</label>

          <input
            type="email"
            placeholder="Enter your email"
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

          {error && (
            <div className="customer-login-error">
              ⚠️ {error}
            </div>
          )}

          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        <p className="customer-login-register">
          New customer?{" "}
          <Link to="/customer/register">Register</Link>
        </p>

        <button
          className="customer-login-back"
          onClick={() => navigate("/products")}
        >
          ← Back to Products
        </button>

        <p className="checkout-footer">
          🌱 Fresh products, directly from farmers
        </p>

      </div>
    </div>
  );
}

export default CustomerLogin;
