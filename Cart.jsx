import React from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  // Import the new updateQuantity function
  const { cart, removeFromCart, updateQuantity, getCartTotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!user) {
      alert('Please login to checkout');
      navigate('/login');
      return;
    }
    if (cart.length === 0) return;
    navigate('/checkout');
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Your Shopping Cart 🛒</h1>

      {cart.length === 0 ? (
        <p className="text-gray-500 text-lg">Your cart is empty.</p>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items List */}
          <div className="flex-grow bg-white rounded-lg shadow overflow-hidden">
            {cart.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 border-b hover:bg-gray-50">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 bg-gray-200 rounded flex items-center justify-center text-2xl">🍎</div>
                  <div>
                    <h3 className="font-semibold text-lg">{item.name}</h3>
                    <p className="text-gray-500 text-sm">Unit Price: ${item.price}</p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  {/* Quantity Controls */}
                  <div className="flex items-center border rounded">
                    <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="px-3 py-1 hover:bg-gray-200 text-gray-600 font-bold disabled:opacity-50"
                        disabled={item.quantity <= 1}
                    >
                        -
                    </button>
                    <span className="px-3 py-1 font-medium">{item.quantity}</span>
                    <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-3 py-1 hover:bg-gray-200 text-gray-600 font-bold"
                    >
                        +
                    </button>
                  </div>

                  <span className="font-bold text-lg w-20 text-right">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>

                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 hover:text-red-700 font-medium ml-4"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="w-full lg:w-80 h-fit bg-white p-6 rounded-lg shadow border border-gray-200">
            <h2 className="text-xl font-bold mb-4 border-b pb-2">Summary</h2>
            <div className="flex justify-between mb-2">
              <span>Subtotal</span>
              <span>${getCartTotal()}</span>
            </div>
            <div className="flex justify-between mb-6 font-bold text-xl text-green-700">
              <span>Total</span>
              <span>${getCartTotal()}</span>
            </div>
            <button 
              onClick={handleCheckout}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;