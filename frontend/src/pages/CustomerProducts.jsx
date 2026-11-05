
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";
import "./CustomerProducts.css";

function CustomerProducts() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch Products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/products/", {
        params: {
          search: search || undefined,
          category: category || undefined,
        },
      });

      setProducts(response.data);
    } catch (err) {
      setError("Unable to load products.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Add Product to Customer Cart
  const handleAddToCart = async (productId) => {
    const token = localStorage.getItem("customer_token");

    if (!token) {
      alert("Please login as customer first.");
      navigate("/customer/login");
      return;
    }

    try {
      await api.post(
        "/cart/add",
        {
          product_id: productId,
          quantity: 1,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Product added to cart successfully!");
    } catch (err) {
      console.error("Add to cart error:", err);

      if (err.response?.status === 401) {
        alert("Session expired. Please login again.");
        localStorage.removeItem("customer_token");
        localStorage.removeItem("customer");
        navigate("/customer/login");
        return;
      }

      alert(
        err.response?.data?.detail ||
        "Unable to add product to cart."
      );
    }
  };

  // Fetch products when search/category changes
  useEffect(() => {
    fetchProducts();
  }, [search, category]);

  return (
    <div className="customer-page">

      {/* Header */}
      <header className="customer-header">
        <h1>🌿 Farmer Fresh Market</h1>

        <nav className="customer-nav">
          <button onClick={() => navigate("/products")}>
            Home
          </button>

          <button onClick={() => navigate("/cart")}>
            🛒 Cart
          </button>

          <button onClick={() => navigate("/orders")}>
            📦 My Orders
          </button>

          <button
            onClick={() => {
              localStorage.removeItem("customer_token");
              localStorage.removeItem("customer");
              navigate("/customer/login");
            }}
          >
            Logout
          </button>
        </nav>
      </header>

      {/* Title */}
      <h2 className="customer-title">
        Fresh Products Direct From Farmers
      </h2>

      <p style={{ textAlign: "center", color: "#666" }}>
        Shop fresh vegetables and fruits at affordable prices.
      </p>

      {/* Search */}
      <div className="customer-filters">
        <input
          type="text"
          placeholder="🔍 Search product name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <input
          type="text"
          placeholder="Search category..."
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
      </div>

      {/* Loading */}
      {loading && <p>Loading products...</p>}

      {/* Error */}
      {error && (
        <p style={{ color: "red", textAlign: "center" }}>
          {error}
        </p>
      )}

      {/* Empty Products */}
      {!loading && products.length === 0 && !error && (
        <p style={{ textAlign: "center" }}>
          No products available.
        </p>
      )}

      {/* Product Cards */}
      <div className="product-grid">
        {products.map((product) => (
          <div className="product-card" key={product.id}>

            {/* Product Image */}
            <div className="product-image-container">
              <img
                src={
                  product.image_url
                    ? `http://127.0.0.1:8000${product.image_url}`
                    : "https://placehold.co/300x200?text=No+Image"
                }
                alt={product.name}
                className="product-image"
              />
            </div>

            <h3>🥬 {product.name}</h3>

            <p>Category: {product.category}</p>

            <p>Farmer: {product.farmer_name}</p>

            <p className="product-price">
              ₹{product.price}
            </p>

            <p className="product-stock">
              Available Stock: {product.available_quantity}
            </p>

            {/* Product Actions */}
            <div className="product-actions">

              <button
                onClick={() =>
                  navigate(`/products/${product.id}`)
                }
              >
                View Details
              </button>

              <button
                onClick={() =>
                  handleAddToCart(product.id)
                }
                disabled={product.available_quantity <= 0}
              >
                {product.available_quantity > 0
                  ? "Add to Cart"
                  : "Out of Stock"}
              </button>

            </div>
          </div>
        ))}
      </div>

    </div>
  );
}

export default CustomerProducts;
