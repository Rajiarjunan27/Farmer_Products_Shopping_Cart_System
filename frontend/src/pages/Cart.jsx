
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Cart.css";

function Cart() {
  const navigate = useNavigate();

  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(null);

  // Customer Authentication
  const getCustomerHeaders = () => {
    const token = localStorage.getItem("customer_token");

    if (!token) {
      navigate("/customer/login");
      throw new Error("Please login as customer.");
    }

    return {
      Authorization: `Bearer ${token}`,
    };
  };

  // Load Customer Cart
  const fetchCart = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/cart/", {
        headers: getCustomerHeaders(),
      });

      setCart(response.data);

    } catch (err) {
      setError(
        err.response?.data?.detail ||
        err.message ||
        "Unable to load cart."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // Update Quantity
  const updateQuantity = async (productId, quantity) => {
    if (!Number.isInteger(quantity) || quantity < 1) {
      alert("Enter a valid quantity");
      return;
    }

    try {
      setUpdating(productId);

      await api.put(
        "/cart/update",
        {
          product_id: productId,
          quantity: Number(quantity),
        },
        {
          headers: getCustomerHeaders(),
        }
      );

      await fetchCart();

    } catch (err) {
      alert(
        err.response?.data?.detail ||
        err.message ||
        "Quantity update failed"
      );
    } finally {
      setUpdating(null);
    }
  };

  // Remove Cart Item
  const removeItem = async (productId) => {
    try {
      await api.delete(
        `/cart/remove/${productId}`,
        {
          headers: getCustomerHeaders(),
        }
      );

      await fetchCart();

    } catch (err) {
      alert(
        err.response?.data?.detail ||
        err.message ||
        "Remove failed"
      );
    }
  };

  // Loading
  if (loading) {
    return (
      <div className="cart-loading">
        <span>🌿</span>
        <p>Loading your shopping cart...</p>
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className="cart-error">
        <h2>Unable to load cart</h2>
        <p>{error}</p>

        <button onClick={fetchCart}>
          Try Again
        </button>

        <button onClick={() => navigate("/customer/login")}>
          Customer Login
        </button>
      </div>
    );
  }

  const items = cart?.items || [];

  return (
    <div className="cart-page">

      {/* Header */}
      <div className="cart-header">
        <div>
          <span className="cart-label">
            FARMER FRESH MARKET
          </span>

          <h1>My Shopping Cart 🛒</h1>

          <p>Fresh products selected for you</p>
        </div>

        <button
          className="cart-continue"
          onClick={() => navigate("/products")}
        >
          ← Continue Shopping
        </button>
      </div>

      {/* Empty Cart */}
      {items.length === 0 ? (
        <div className="cart-empty">
          <div className="cart-empty-icon">🛒</div>

          <h2>Your cart is empty!</h2>

          <p>
            Discover fresh farm products and add them to your cart.
          </p>

          <button onClick={() => navigate("/products")}>
            Explore Products
          </button>
        </div>
      ) : (

        <div className="cart-layout">

          {/* Cart Items */}
          <div className="cart-items-section">

            <div className="cart-items-heading">
              <h2>Cart Items</h2>
              <span>{items.length} product(s)</span>
            </div>

            {items.map((item) => (
              <div
                className="cart-item"
                key={item.product_id}
              >

                {/* Image */}
                <div className="cart-item-image">
                  {item.image_url ? (
                    <img
                      src={
                        item.image_url.startsWith("http")
                          ? item.image_url
                          : `http://127.0.0.1:8000${item.image_url}`
                      }
                      alt={item.product_name || item.name}
                    />
                  ) : (
                    <span>🌿</span>
                  )}
                </div>

                {/* Details */}
                <div className="cart-item-details">

                  <h3>
                    {item.product_name || item.name}
                  </h3>

                  <p className="cart-item-price">
                    ₹{Number(item.price).toFixed(2)}
                  </p>

                  {/* Quantity Controls */}
                  <div className="cart-quantity-control">

                    <button
                      onClick={() =>
                        updateQuantity(
                          item.product_id,
                          Number(item.quantity) - 1
                        )
                      }
                      disabled={
                        Number(item.quantity) <= 1 ||
                        updating === item.product_id
                      }
                    >
                      −
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      onClick={() =>
                        updateQuantity(
                          item.product_id,
                          Number(item.quantity) + 1
                        )
                      }
                      disabled={updating === item.product_id}
                    >
                      +
                    </button>

                  </div>

                  {updating === item.product_id && (
                    <small className="cart-updating">
                      Updating...
                    </small>
                  )}

                </div>

                {/* Subtotal and Remove */}
                <div className="cart-item-total">

                  <strong>
                    ₹{Number(item.subtotal).toFixed(2)}
                  </strong>

                  <button
                    className="cart-remove"
                    onClick={() => removeItem(item.product_id)}
                  >
                    🗑 Remove
                  </button>

                </div>

              </div>
            ))}

          </div>

          {/* Order Summary */}
          <div className="cart-summary">

            <h2>Order Summary</h2>

            <div className="cart-summary-row">
              <span>Items</span>
              <span>{items.length}</span>
            </div>

            <div className="cart-summary-row">
              <span>Subtotal</span>
              <span>
                ₹{Number(cart.grand_total).toFixed(2)}
              </span>
            </div>

            <div className="cart-summary-row cart-delivery">
              <span>Delivery</span>
              <span>Free</span>
            </div>

            <div className="cart-summary-total">
              <span>Grand Total</span>

              <strong>
                ₹{Number(cart.grand_total).toFixed(2)}
              </strong>
            </div>

            {/* Checkout */}
            <button
              className="cart-checkout"
              onClick={() => navigate("/checkout")}
            >
              Proceed to Checkout →
            </button>

            <button
              className="cart-back-products"
              onClick={() => navigate("/products")}
            >
              Continue Shopping
            </button>

            <div className="cart-trust">
              🌱 Fresh products from local farmers
            </div>

          </div>

        </div>
      )}

    </div>
  );
}

export default Cart;
