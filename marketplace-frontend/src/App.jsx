import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Box from "@mui/material/Box";
import Navbar from "./components/Navbar";
import ProductList from "./components/ProductList";
import ProductDetail from "./components/ProductDetail";
import ProductUploadForm from "./components/ProductUploadForm";
import Cart from "./components/Cart";
import About from "./components/About";
import Contact from "./components/Contact";
import CategoryList from "./components/CategoryList";
import Checkout from "./components/Checkout";
import Auth from "./components/Auth";
import RequireAuth from "./components/RequireAuth";
import Profile from "./components/Profile";
import SellerCenter from "./components/SellerCenter";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import Footer from "./components/Footer";
import HelpCenter from './components/HelpCenter';
import Returns from './components/Returns';
import ShippingInfo from './components/ShippingInfo';
import PaymentMethods from './components/PaymentMethods';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfService from './components/TermsOfService';
import FAQ from './components/FAQ';
import VetDashboard from './components/VetDashboard';
import Account from './components/Account';
import ForgotPassword from "./components/ForgotPassword";
import ResetPasswordConfirm from "./components/ResetPasswordConfirm";
import OrderHistory from "./components/OrderHistory";
import AdminDashboard from "./components/AdminDashboard";
import AdminOrders from "./components/AdminOrders";
import Dashboard from "./components/Dashboard";

function App() {
  useEffect(() => {
    const root = document.getElementById('root');
    const observer = new MutationObserver(() => {
      if (root?.getAttribute('aria-hidden') === 'true') {
        console.warn("⚠️ aria-hidden='true' was added to #root — removing it.");
        root.removeAttribute('aria-hidden');
      }
    });

    if (root) {
      observer.observe(root, { attributes: true, attributeFilter: ['aria-hidden'] });
    }

    return () => observer.disconnect();
  }, []);

  return (
    <AuthProvider>
      <CartProvider>
        <Box minHeight="100vh" display="flex" flexDirection="column" bgcolor="#f7fafc">
          <Navbar />
          <Box component="main" flex={1}>
            <Routes>
              <Route path="/" element={<ProductList />} />
              <Route path="/products/:id" element={<ProductDetail />} />
              <Route path="/add-product" element={<RequireAuth><ProductUploadForm /></RequireAuth>} />
              <Route path="/categories" element={<CategoryList />} />
              <Route path="/categories/:categoryId" element={<ProductList />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<RequireAuth><Checkout /></RequireAuth>} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />
              <Route path="/account" element={<RequireAuth><Account /></RequireAuth>} />
              <Route path="/order-history" element={<RequireAuth><OrderHistory /></RequireAuth>} />
              <Route path="/seller-center" element={<SellerCenter />} />
              <Route path="/help" element={<HelpCenter />} />
              <Route path="/returns" element={<Returns />} />
              <Route path="/shipping" element={<ShippingInfo />} />
              <Route path="/payment" element={<PaymentMethods />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<TermsOfService />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/vet-dashboard" element={<VetDashboard />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password/" element={<ForgotPassword />} />
              <Route path="/reset-password/:uid/:token/" element={<ResetPasswordConfirm />} />
              <Route path="/admin-dashboard" element={<RequireAuth><AdminDashboard /></RequireAuth>} />
              <Route path="/admin-orders" element={<AdminOrders />} />
              <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
          </Box>
          <Footer />
        </Box>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
