import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';

const Checkout = () => {
  const { cart, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    address: '', city: '', zip: '', paymentMethod: 'Online'
  });

  useEffect(() => {
    if (cart.length === 0) navigate('/cart');
  }, [cart, navigate]);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    try {
      const orderItems = cart.map(item => ({
        productId: item.id || 'p1',
        quantity: item.quantity
      }));

      // Calculate Total
      const total = parseFloat(getCartTotal());

      const orderPayload = {
        items: orderItems,
        customerID: user.email,
        retailerID: 'r1',
        paymentMethod: formData.paymentMethod,
        totalAmount: total, // Sending correct total
        deliveryAddress: `${formData.address}, ${formData.city}`
      };

      await api.post('/api/order/place', orderPayload);

      alert('Order Placed Successfully! 🎉');
      clearCart();
      navigate('/orders'); // Redirect to My Orders
    } catch (err) {
      console.error(err);
      // Enhanced Error Handling
      const errorMsg = err.response?.data?.msg || err.message || 'Unknown Error';
      alert(`Order Failed: ${errorMsg}`);
    }
  };

  return (
    <div className="container mx-auto p-6 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Checkout 💳</h1>
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Form */}
        <div className="flex-grow bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 border-b pb-2">Shipping Details</h2>
          <form id="checkout-form" onSubmit={handlePlaceOrder} className="space-y-4">
            <div>
              <label className="block text-gray-600 text-sm mb-1">Address</label>
              <input required className="w-full p-2 border rounded" placeholder="123 Main St" onChange={e => setFormData({...formData, address: e.target.value})} />
            </div>
            <div className="flex gap-4">
              <input required className="w-full p-2 border rounded" placeholder="City" onChange={e => setFormData({...formData, city: e.target.value})} />
              <input required className="w-full p-2 border rounded" placeholder="ZIP" onChange={e => setFormData({...formData, zip: e.target.value})} />
            </div>
            <div className="mt-4">
                <label className="font-semibold">Payment:</label>
                <div className="flex gap-4 mt-2">
                    <label className="flex gap-2"><input type="radio" name="pay" value="Online" checked={formData.paymentMethod === 'Online'} onChange={e => setFormData({...formData, paymentMethod: e.target.value})} /> Online</label>
                    <label className="flex gap-2"><input type="radio" name="pay" value="COD" checked={formData.paymentMethod === 'COD'} onChange={e => setFormData({...formData, paymentMethod: e.target.value})} /> COD</label>
                </div>
            </div>
          </form>
        </div>
        
        {/* Summary */}
        <div className="w-full lg:w-80 bg-gray-50 p-6 rounded-lg shadow h-fit">
          <h2 className="text-xl font-bold mb-4">Total: ${getCartTotal()}</h2>
          <button type="submit" form="checkout-form" className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700">
            Confirm Order (${getCartTotal()})
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;