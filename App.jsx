import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import CustomerHome from './pages/CustomerHome';
import RetailerDashboard from './pages/RetailerDashboard';
import WholesalerDashboard from './pages/WholesalerDashboard';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderHistory from './pages/OrderHistory'; // <--- IMPORT THIS

const ProtectedRoute = ({ children, allowedRole }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRole && user.role !== allowedRole) return <Navigate to="/" replace />;
  return children;
};

function AppRoutes() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Customer Routes */}
        <Route path="/" element={<CustomerHome />} />
        <Route path="/cart" element={<Cart />} />
        
        <Route 
          path="/checkout" 
          element={<ProtectedRoute allowedRole="Customer"><Checkout /></ProtectedRoute>} 
        />
        
        {/* THIS IS THE MISSING ROUTE */}
        <Route 
          path="/orders" 
          element={<ProtectedRoute allowedRole="Customer"><OrderHistory /></ProtectedRoute>} 
        />

        {/* Retailer & Wholesaler Routes */}
        <Route 
          path="/retailer" 
          element={<ProtectedRoute allowedRole="Retailer"><RetailerDashboard /></ProtectedRoute>} 
        />
        <Route 
          path="/wholesaler" 
          element={<ProtectedRoute allowedRole="Wholesaler"><WholesalerDashboard /></ProtectedRoute>} 
        />
      </Routes>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <AppRoutes />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;