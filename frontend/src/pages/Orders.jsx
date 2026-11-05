
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Orders.css";

function Orders() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get("/orders/");
        setOrders(response.data);
      } catch (err) {
        setError(
          err.response?.data?.detail || "Unable to load orders."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="orders-page">
        <div className="orders-loading">Loading your orders...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="orders-page">
        <div className="orders-error">⚠️ {error}</div>
        <button
          className="orders-primary-button"
          onClick={() => navigate("/products")}
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <div className="orders-container">

        <div className="orders-header">
          <div>
            <span className="orders-brand">
              🌿 FARMER FRESH MARKET
            </span>
            <h1>My Orders</h1>
            <p>Track your purchases and order history.</p>
          </div>

          <button
            className="orders-primary-button"
            onClick={() => navigate("/products")}
          >
            + Continue Shopping
          </button>
        </div>

        <div className="orders-summary">
          <div className="orders-summary-icon">📦</div>
          <div>
            <h3>{orders.length} Orders</h3>
            <p>Your order history</p>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="orders-empty">
            <div className="orders-empty-icon">🛒</div>
            <h2>No Orders Yet</h2>
            <p>
              Your orders will appear here after you complete checkout.
            </p>
            <button
              className="orders-primary-button"
              onClick={() => navigate("/products")}
            >
              Explore Products
            </button>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div className="orders-card" key={order.id}>
                <div className="orders-card-header">
                  <div>
                    <span className="orders-label">ORDER ID</span>
                    <h3>#{order.id}</h3>
                  </div>

                  <span className="orders-status">
                    {order.status}
                  </span>
                </div>

                <div className="orders-card-details">
                  <div>
                    <span className="orders-label">ORDER DATE</span>
                    <p>
                      {order.created_at
                        ? new Date(order.created_at).toLocaleString()
                        : "Date unavailable"}
                    </p>
                  </div>

                  <div>
                    <span className="orders-label">TOTAL AMOUNT</span>
                    <h3 className="orders-amount">
                      ₹{Number(order.total_amount).toFixed(2)}
                    </h3>
                  </div>
                </div>

                <div className="orders-card-footer">
                  <span>🌱 Thank you for supporting farmers</span>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

export default Orders;
