
import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

api.interceptors.request.use(
  (config) => {
    const url = config.url || "";

    // Admin API requests
    if (url.includes("/products/admin") ||
        url === "/products/" ||
        url.startsWith("/products/")) {
      const adminToken = localStorage.getItem("admin_token");

      if (adminToken) {
        config.headers.Authorization = `Bearer ${adminToken}`;
      }
    }

    // Customer API requests
    if (
      url.startsWith("/cart") ||
      url.startsWith("/orders")
    ) {
      const customerToken = localStorage.getItem("customer_token");

      if (customerToken) {
        config.headers.Authorization = `Bearer ${customerToken}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
