
import { useEffect, useState } from "react";
import api from "../services/api";
import "./AdminDashboard.css";

function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const emptyForm = {
    name: "",
    category: "",
    farmer_name: "",
    description: "",
    price: "",
    available_quantity: "",
    image_url: "",
    is_active: true,
  };

  const [formData, setFormData] = useState(emptyForm);

  const token = localStorage.getItem("admin_token");

  const authHeaders = {
    Authorization: `Bearer ${token}`,
  };

  const fetchProducts = async () => {
    try {
      const response = await api.get("/products/admin/all", {
        headers: authHeaders,
      });
      setProducts(response.data);
      setMessage("");
    } catch (error) {
      setMessage(
        error.response?.data?.detail || "Unable to load products"
      );
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddClick = () => {
    setEditingId(null);
    setFormData({ ...emptyForm });
    setShowForm(true);
  };

  const handleEdit = (product) => {
    setEditingId(product.id);
    setFormData({
      name: product.name,
      category: product.category,
      farmer_name: product.farmer_name,
      description: product.description || "",
      price: product.price,
      available_quantity: product.available_quantity,
      image_url: product.image_url || "",
      is_active: product.is_active,
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      price: Number(formData.price),
      available_quantity: Number(formData.available_quantity),
    };

    try {
      if (editingId) {
        await api.put(`/products/${editingId}`, payload, {
          headers: authHeaders,
        });
        setMessage("Product updated successfully!");
      } else {
        await api.post("/products/", payload, {
          headers: authHeaders,
        });
        setMessage("Product added successfully!");
      }

      setShowForm(false);
      setEditingId(null);
      setFormData({ ...emptyForm });
      await fetchProducts();
    } catch (error) {
      alert(error.response?.data?.detail || "Failed to save product");
    }
  };

  const handleDelete = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      await api.delete(`/products/${productId}`, {
        headers: authHeaders,
      });
      setMessage("Product deleted successfully!");
      await fetchProducts();
    } catch (error) {
      alert(error.response?.data?.detail || "Failed to delete product");
    }
  };

  const handleStatusToggle = async (product) => {
    try {
      const response = await api.patch(
        `/products/${product.id}/status`,
        { is_active: !product.is_active },
        { headers: authHeaders }
      );

      setMessage(response.data.message || "Status updated successfully");
      await fetchProducts();
    } catch (error) {
      alert(error.response?.data?.detail || "Status update failed");
    }
  };

  const handleStock = async (product) => {
    const quantity = window.prompt(
      "Enter new available stock:",
      product.available_quantity
    );

    if (quantity === null) return;

    if (
      quantity.trim() === "" ||
      !Number.isInteger(Number(quantity)) ||
      Number(quantity) < 0
    ) {
      alert("Enter a valid non-negative whole number.");
      return;
    }

    try {
      await api.patch(
        `/products/${product.id}/stock`,
        { quantity: Number(quantity) },
        { headers: authHeaders }
      );
      setMessage("Stock updated successfully!");
      await fetchProducts();
    } catch (error) {
      alert(error.response?.data?.detail || "Failed to update stock");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    window.location.href = "/admin/login";
  };

  const activeCount = products.filter((p) => p.is_active).length;
  const inactiveCount = products.length - activeCount;
  const totalStock = products.reduce(
    (sum, p) => sum + Number(p.available_quantity || 0),
    0
  );

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <span className="brand-icon">🌿</span>
          <div>
            <h2>Farmer Fresh</h2>
            <span>Market Admin</span>
          </div>
        </div>

        <nav className="admin-menu">
          <a href="/admin/dashboard" className="menu-item active">
            <span>▦</span> Dashboard
          </a>
          <a href="/products" className="menu-item">
            <span>🛒</span> Customer Store
          </a>
        </nav>

        <div className="sidebar-bottom">
          <div className="admin-profile">
            <div className="admin-avatar">A</div>
            <div>
              <strong>Administrator</strong>
              <small>Store Manager</small>
            </div>
          </div>
          <button className="logout-button" onClick={handleLogout}>
            ↪ Logout
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-topbar">
          <div>
            <h1>Dashboard</h1>
            <p>Manage your farmer products and inventory</p>
          </div>
          <button className="primary-button" onClick={handleAddClick}>
            + Add Product
          </button>
        </header>

        {message && (
          <div className="admin-message">
            {message}
            <button onClick={() => setMessage("")}>×</button>
          </div>
        )}

        <section className="summary-grid">
          <div className="summary-card">
            <div className="summary-icon green-icon">📦</div>
            <div>
              <span>Total Products</span>
              <h2>{products.length}</h2>
            </div>
          </div>

          <div className="summary-card">
            <div className="summary-icon blue-icon">✓</div>
            <div>
              <span>Active Products</span>
              <h2>{activeCount}</h2>
            </div>
          </div>

          <div className="summary-card">
            <div className="summary-icon orange-icon">⏸</div>
            <div>
              <span>Inactive Products</span>
              <h2>{inactiveCount}</h2>
            </div>
          </div>

          <div className="summary-card">
            <div className="summary-icon purple-icon">📊</div>
            <div>
              <span>Total Available Stock</span>
              <h2>{totalStock}</h2>
            </div>
          </div>
        </section>

        <section className="products-panel">
          <div className="panel-header">
            <div>
              <h2>Product Management</h2>
              <p>Manage products, pricing and inventory</p>
            </div>
            <span className="product-count">
              {products.length} Products
            </span>
          </div>

          <div className="table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Farmer</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td>
                      <div className="product-cell">
                        <img
                          src={
                            product.image_url
                              ? `http://127.0.0.1:8000${product.image_url}`
                              : "https://placehold.co/60x60?text=No+Image"
                          }
                          alt={product.name}
                          onError={(e) => {
                            e.currentTarget.src =
                              "https://placehold.co/60x60?text=No+Image";
                          }}
                        />
                        <div>
                          <strong>{product.name}</strong>
                          <small>ID: {product.id}</small>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span className="category-badge">
                        {product.category}
                      </span>
                    </td>

                    <td>{product.farmer_name}</td>

                    <td className="price-cell">
                      ₹{Number(product.price).toFixed(2)}
                    </td>

                    <td>
                      <span
                        className={
                          product.available_quantity > 10
                            ? "stock-badge"
                            : "stock-badge low-stock"
                        }
                      >
                        {product.available_quantity} units
                      </span>
                    </td>

                    <td>
                      <span
                        className={
                          product.is_active
                            ? "status-badge active-status"
                            : "status-badge inactive-status"
                        }
                      >
                        {product.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td>
                      <div className="action-buttons">
                        <button
                          className="action-button edit-action"
                          onClick={() => handleEdit(product)}
                          title="Edit product"
                        >
                          ✎
                        </button>

                        <button
                          className="action-button stock-action"
                          onClick={() => handleStock(product)}
                          title="Update stock"
                        >
                          📦
                        </button>

                        <button
                          className="action-button status-action"
                          onClick={() => handleStatusToggle(product)}
                          title="Change status"
                        >
                          {product.is_active ? "⏸" : "▶"}
                        </button>

                        <button
                          className="action-button delete-action"
                          onClick={() => handleDelete(product.id)}
                          title="Delete product"
                        >
                          🗑
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {products.length === 0 && (
              <div className="empty-products">
                <span>📦</span>
                <h3>No products found</h3>
                <p>Add your first farmer product to get started.</p>
                <button className="primary-button" onClick={handleAddClick}>
                  + Add Product
                </button>
              </div>
            )}
          </div>
        </section>
      </main>

      {showForm && (
        <div className="modal-overlay">
          <div className="product-modal">
            <div className="modal-header">
              <div>
                <h2>{editingId ? "Edit Product" : "Add New Product"}</h2>
                <p>Enter product information below</p>
              </div>
              <button
                className="modal-close"
                onClick={() => setShowForm(false)}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="product-form">
              <div className="form-grid">
                <div className="form-group">
                  <label>Product Name *</label>
                  <input
                    placeholder="e.g. Fresh Tomatoes"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Category *</label>
                  <input
                    placeholder="e.g. Vegetables"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Farmer Name *</label>
                  <input
                    placeholder="Enter farmer name"
                    value={formData.farmer_name}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        farmer_name: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Price (₹) *</label>
                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Available Quantity *</label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    placeholder="0"
                    value={formData.available_quantity}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        available_quantity: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Image URL</label>
                  <input
                    placeholder="/uploads/tomato.jpeg"
                    value={formData.image_url}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        image_url: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="form-group full-width">
                  <label>Description</label>
                  <textarea
                    rows="3"
                    placeholder="Describe your product..."
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        description: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="form-group full-width active-checkbox">
                  <label>
                    <input
                      type="checkbox"
                      checked={formData.is_active}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          is_active: e.target.checked,
                        })
                      }
                    />
                    Active Product
                  </label>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="primary-button">
                  {editingId ? "Save Changes" : "Create Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
