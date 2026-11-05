
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Checkout.css";

function Checkout() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");

  const handleCheckout = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.post("/orders/checkout");

      setOrder(response.data);
    } catch (err) {
      setError(
        err.response?.data?.detail || "Checkout failed"
      );
    } finally {
      setLoading(false);
    }
  };

  if (order) {
    return (
      <div className="checkout-page">
        <div className="checkout-success-card">
          <div className="checkout-success-icon">✓</div>

          <span className="checkout-brand">
            FARMER FRESH MARKET
          </span>

          <h1>Order Placed Successfully!</h1>

          <p className="checkout-success-text">
            Thank you for supporting our farmers. Your order has been
            placed successfully.
          </p>

          <div className="checkout-order-details">
            <div className="checkout-detail-row">
              <span>Order ID</span>
              <strong>#{order.id}</strong>
            </div>

            <div className="checkout-detail-row">
              <span>Total Amount</span>
              <strong className="checkout-amount">
                ₹{Number(order.total_amount).toFixed(2)}
              </strong>
            </div>

            <div className="checkout-detail-row">
              <span>Order Status</span>
              <span className="checkout-status">
                {order.status}
              </span>
            </div>
          </div>

          <button
            className="checkout-primary-button"
            onClick={() => navigate("/orders")}
          >
            View My Orders →
          </button>

          <button
            className="checkout-secondary-button"
            onClick={() => navigate("/products")}
          >
            Continue Shopping
          </button>

          <p className="checkout-footer">
            🌿 Fresh products, directly from farmers
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="checkout-card">
        <div className="checkout-header">
          <div className="checkout-logo">🌿</div>
          <span className="checkout-brand">
            FARMER FRESH MARKET
          </span>

          <h1>Checkout</h1>

          <p>Confirm your order and enjoy fresh farm products.</p>
        </div>

        <div className="checkout-confirmation">
          <div className="checkout-confirmation-icon">🛒</div>

          <h2>Ready to Place Your Order?</h2>

          <p>
            Please confirm your order. Your cart items will be
            processed and the available stock will be updated.
          </p>
        </div>

        {error && (
          <div className="checkout-error">
            ⚠️ {error}
          </div>
        )}

        <button
          className="checkout-primary-button"
          onClick={handleCheckout}
          disabled={loading}
        >
          {loading ? "Processing Order..." : "✓ Place Order"}
        </button>

        <button
          className="checkout-secondary-button"
          onClick={() => navigate("/cart")}
          disabled={loading}
        >
          ← Back to Cart
        </button>

        <p className="checkout-footer">
          🌱 Thank you for supporting local farmers
        </p>
      </div>
    </div>
  );
}

export default Checkout;
