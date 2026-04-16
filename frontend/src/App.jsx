import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './context/AuthContext';
import { CartProvider, useCart } from './context/CartContent';
import { WishlistProvider } from './context/WishlistContent';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import OrdersPage from './pages/OrdersPage';
import WishlistPage from './pages/WishlistPage';
import AdminProductsPage from './pages/AdminProductsPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';

// WishlistProvider needs sessionId from CartContext, so nest it inside
function AppWithProviders() {
  const { sessionId } = useCart();
  return (
    <WishlistProvider sessionId={sessionId}>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar />
        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/order-confirmation/:orderCode" element={<OrderConfirmationPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/admin/products" element={<AdminProductsPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={
              <div style={{ textAlign: 'center', padding: '80px 20px' }}>
                <div style={{ fontSize: 64 }}>😕</div>
                <h2 style={{ fontSize: 28, color: '#2874f0', margin: '12px 0 8px' }}>Page Not Found</h2>
                <p style={{ color: '#878787', marginBottom: 20 }}>The page you're looking for doesn't exist.</p>
                <a href="/" style={{
                  display: 'inline-block', background: '#2874f0', color: 'white',
                  padding: '10px 28px', borderRadius: 2, fontWeight: 600,
                  fontSize: 14, textDecoration: 'none',
                }}>Go to Home</a>
              </div>
            } />
          </Routes>
        </main>
        <Footer />
      </div>
      <ToastContainer position="bottom-right" autoClose={2000} />
    </WishlistProvider>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <AppWithProviders />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;