import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { cart } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="bg-slate-900 text-white shadow-lg">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
          Live MART
        </Link>

        <div className="flex items-center space-x-6">
          {user ? (
            <>
              <span className="text-gray-300">Welcome, <span className="font-semibold text-white">{user.name}</span> ({user.role})</span>
              {user.role === 'Retailer' && <Link to="/retailer" className="hover:text-green-400">Dashboard</Link>}
              {user.role === 'Customer' && (
                  <>
                    <Link to="/" className="hover:text-green-400">Shop</Link>
                    {/* ADD THIS LINK */}
                    <Link to="/orders" className="hover:text-green-400">My Orders</Link>
                    
                    <Link to="/cart" className="hover:text-green-400 font-bold">
                        Cart ({cart.length})
                    </Link>
                  </>
              )}
              {user.role === 'Wholesaler' && <Link to="/wholesaler" className="hover:text-purple-400">Wholesale Portal</Link>}
              <button onClick={logout} className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded text-sm">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-blue-300">Login</Link>
              <Link to="/register" className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;