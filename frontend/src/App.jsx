
import { BrowserRouter, Routes, Route } from "react-router-dom";

import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";

import CustomerRegister from "./pages/CustomerRegister";
import CustomerLogin from "./pages/CustomerLogin";

import CustomerProducts from "./pages/CustomerProducts";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Admin */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />

        {/* Customer Authentication */}
        <Route path="/customer/register" element={<CustomerRegister />} />
        <Route path="/customer/login" element={<CustomerLogin />} />

        {/* Customer Shopping */}
        <Route path="/products" element={<CustomerProducts />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/orders" element={<Orders />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
