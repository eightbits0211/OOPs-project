import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext'; // <--- 1. Import AuthContext

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth(); // <--- 2. Get the logged-in user

  useEffect(() => {
    const fetchOrders = async () => {
      // If no user is logged in, stop
      if (!user || !user.email) {
          setLoading(false);
          return;
      }

      try {
        // <--- 3. Use the dynamic user email instead of 'demo'
        const res = await api.get(`/api/order/history/${user.email}`); 
        setOrders(res.data);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user]); // Re-run this whenever the user changes

  if (loading) return <div className="text-center mt-10">Loading Orders...</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">My Orders 📦</h1>

      {orders.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow text-center text-gray-500">
            <p className="text-xl">No orders found.</p>
            <p className="text-sm mt-2">Go shopping to place your first order!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 hover:shadow-md transition">
              <div className="flex justify-between items-start border-b pb-4 mb-4">
                <div>
                    <h3 className="text-lg font-bold text-gray-800">{order.id}</h3>
                    <p className="text-sm text-gray-500">Placed on: {order.date}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold 
                    ${order.status === 'Delivered' ? 'bg-green-100 text-green-800' : 
                      order.status === 'Processing' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {order.status}
                </span>
              </div>
              
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-600 mb-2">Items:</h4>
                <ul className="list-disc list-inside text-gray-700">
                    {order.items.map((item, idx) => (
                        <li key={idx}>Product ID: {item.productId} (Qty: {item.quantity})</li>
                    ))}
                </ul>
              </div>

              <div className="flex justify-between items-center mt-2">
                  <p className="font-bold text-gray-800">Total: ${order.totalAmount}</p>
                  <div className="text-sm text-gray-500">Payment: {order.paymentMethod}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;