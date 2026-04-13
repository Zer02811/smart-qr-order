import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import MenuPage from './pages/MenuPage';
import CartPage from './pages/CartPage';
import StaffDashboard from './pages/StaffDashboard';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminPage from './pages/AdminPage';

/**
 * App - Root component với routing
 * Routes:
 *  /order?table=XX  → Customer Menu (mobile)
 *  /cart             → Cart & Checkout
 *  /staff            → Staff Dashboard (real-time)
 *  /admin/login      → Admin Login
 *  /admin            → Admin Dashboard (protected)
 */
function App() {
  return (
    <Router>
      <CartProvider>
        <Routes>
          {/* Customer Routes */}
          <Route path="/order" element={<MenuPage />} />
          <Route path="/cart" element={<CartPage />} />

          {/* Staff Route */}
          <Route path="/staff" element={<StaffDashboard />} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin" element={<AdminPage />} />

          {/* Default redirect */}
          <Route path="*" element={<Navigate to="/order?table=01" replace />} />
        </Routes>
      </CartProvider>
    </Router>
  );
}

export default App;
