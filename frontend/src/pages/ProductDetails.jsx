
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import "./ProductDetails.css";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Fetch Product Details
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(`/products/${id}`);
        setProduct(response.data);
      } catch (err) {
        setError("Unable to load product details.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Add Product to Customer Cart
  const handleAddToCart = async () => {
    const token = localStorage.getItem("customer_token");

    if (!token) {
      setError("Please login as customer first.");
      navigate("/customer/login");
      return;
    }

    if (
      !quantity ||
      Number(quantity) < 1 ||
      Number(quantity) > product.available_quantity
    ) {
      setError("Please select a valid quantity.");
      return;
    }

    try {
      setAdding(true);
      setMessage("");
      setError("");

      const response = await api.post(
        "/cart/add",
        {
          product_id: product.id,
          quantity: Number(quantity),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(
        response.data.message || "Product added to cart successfully!"
      );

      setQuantity(1);

    } catch (err) {
      console.error("Add to cart error:", err);

      if (err.response?.status === 401) {
        setError("Session expired. Please login again.");

        localStorage.removeItem("customer_token");
        localStorage.removeItem("customer");

        return;
      }

      setError(
        err.response?.data?.detail ||
        "Unable to add product to cart."
      );

    } finally {
      setAdding(false);
    }
  };

  // Loading
  if (loading) {
    return (
      <div className="pd-loading">
        <span>🌿</span>
        <p>Loading fresh product...</p>
      </div>
    );
  }

  // Product Error
  if (error && !product) {
    return (
      <div className="pd-error">
        <h2>Unable to load product</h2>
        <p>{error}</p>

        <button onClick={() => navigate("/products")}>
          Back to Products
        </button>
      </div>
    );
  }

  if (!product) {
    return <p>Product not found.</p>;
  }

  return (
    <div className="pd-page">

      {/* Back Button */}
      <button
        className="pd-back"
        onClick={() => navigate("/products")}
      >
        ← Back to Products
      </button>

      <div className="pd-card">

        {/* Product Image */}
        <div className="pd-image-box">

          {product.image_url ? (
            <img
              src={
                product.image_url.startsWith("http")
                  ? product.image_url
                  : `http://127.0.0.1:8000${product.image_url}`
              }
              alt={product.name}
            />
          ) : (
            <div className="pd-placeholder">
              🌿
            </div>
          )}

          <span className="pd-fresh-badge">
            🌱 Fresh from Farm
          </span>
        </div>

        {/* Product Information */}
        <div className="pd-info">

          <span className="pd-category">
            {product.category}
          </span>

          <h1>{product.name}</h1>

          <p className="pd-farmer">
            👨‍🌾 Grown by {product.farmer_name}
          </p>

          <h2 className="pd-price">
            ₹{Number(product.price).toFixed(2)}
          </h2>

          <p className="pd-description">
            {product.description ||
              "Fresh and quality farm product."}
          </p>

          {/* Stock */}
          <div className="pd-stock">
            {product.available_quantity > 0 ? (
              <span className="pd-in-stock">
                ✓ {product.available_quantity} items available
              </span>
            ) : (
              <span className="pd-out-stock">
                Currently Out of Stock
              </span>
            )}
          </div>

          {/* Quantity */}
          {product.available_quantity > 0 && (
            <div className="pd-quantity">

              <label>Quantity</label>

              <div className="pd-quantity-control">

                <button
                  type="button"
                  onClick={() =>
                    setQuantity(
                      Math.max(1, Number(quantity) - 1)
                    )
                  }
                  disabled={Number(quantity) <= 1}
                >
                  −
                </button>

                <input
                  type="number"
                  min="1"
                  max={product.available_quantity}
                  value={quantity}
                  onChange={(e) => {
                    const value = e.target.value;

                    if (value === "") {
                      setQuantity("");
                    } else {
                      setQuantity(
                        Math.min(
                          product.available_quantity,
                          Math.max(1, Number(value))
                        )
                      );
                    }
                  }}
                  onBlur={() => {
                    if (
                      quantity === "" ||
                      Number(quantity) < 1
                    ) {
                      setQuantity(1);
                    }
                  }}
                />

                <button
                  type="button"
                  onClick={() =>
                    setQuantity(
                      Math.min(
                        product.available_quantity,
                        Number(quantity) + 1
                      )
                    )
                  }
                  disabled={
                    Number(quantity) >=
                    product.available_quantity
                  }
                >
                  +
                </button>

              </div>
            </div>
          )}

          {/* Add to Cart */}
          <button
            className="pd-add-cart"
            onClick={handleAddToCart}
            disabled={
              adding ||
              product.available_quantity <= 0 ||
              Number(quantity) < 1 ||
              Number(quantity) > product.available_quantity
            }
          >
            {adding
              ? "Adding to Cart..."
              : "🛒 Add to Cart"}
          </button>

          {/* View Cart */}
          <button
            className="pd-view-cart"
            onClick={() => navigate("/cart")}
          >
            View Cart
          </button>

          {/* Success Message */}
          {message && (
            <div className="pd-success">
              ✓ {message}
            </div>
          )}

          {/* Error Message */}
          {error && product && (
            <div className="pd-error-message">
              {error}
            </div>
          )}

          {/* Benefits */}
          <div className="pd-benefits">
            <span>🌿 Farm Fresh</span>
            <span>🚚 Quality Products</span>
            <span>💚 Support Farmers</span>
          </div>

        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
