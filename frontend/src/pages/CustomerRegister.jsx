
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./CustomerRegister.css";

function CustomerRegister() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      setLoading(true);

      const response = await fetch(
        "http://127.0.0.1:8000/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(form)
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Registration failed");
      }

      setMessage("Registration successful!");

      setTimeout(() => {
        navigate("/customer/login");
      }, 1000);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="customer-register-page">
      <div className="customer-register-card">

        <div className="customer-register-logo">🌿</div>

        <span className="customer-register-brand">
          FARMER FRESH MARKET
        </span>

        <h1>Customer Registration</h1>

        <p>Create your account to shop fresh farm products.</p>

        <form onSubmit={handleSubmit}>

          <label>Full Name</label>
          <input
            name="name"
            placeholder="Enter your full name"
            value={form.name}
            onChange={handleChange}
            required
          />

          <label>Email Address</label>
          <input
            name="email"
            type="email"
            placeholder="Enter your email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <label>Password</label>
          <input
            name="password"
            type="password"
            placeholder="Create your password"
            value={form.password}
            onChange={handleChange}
            required
          />

          {message && (
            <div className="customer-register-success">
              ✓ {message}
            </div>
          )}

          {error && (
            <div className="customer-register-error">
              ⚠️ {error}
            </div>
          )}

          <button type="submit" disabled={loading}>
            {loading ? "Creating Account..." : "Create Account"}
          </button>

        </form>

        <p className="customer-register-login">
          Already registered?{" "}
          <Link to="/customer/login">Login</Link>
        </p>

        <button
          className="customer-register-back"
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

export default CustomerRegister;
