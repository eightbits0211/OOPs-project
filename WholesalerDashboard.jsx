// src/pages/WholesalerDashboard.jsx
import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig'; // Import API connection

const WholesalerDashboard = () => {
  const [inventory, setInventory] = useState([]);
  const [message, setMessage] = useState('');

  // 1. Fetch initial data when page loads
  useEffect(() => {
    api.get('/api/catalog/details/p1')
       .then(res => setInventory([res.data]))
       .catch(err => console.error("Failed to fetch wholesale inventory:", err));
  }, []);

  // 2. Function to handle the Restock button click
  const handleRestock = async (id) => {
    const amountToAdd = 50; // Bulk add amount
    try {
        // Send request to backend to update stock
        await api.post('/api/order/place', { 
            items: [{ productId: id, quantity: -amountToAdd }], // Negative quantity adds stock in our logic
            customerID: 'wholesaler_admin', 
            retailerID: 'r1', 
            paymentMethod: 'Wholesale_Restock' 
        });
        
        // Update the UI instantly
        setInventory(prev => prev.map(item => 
            item.id === id || item._id === id ? { ...item, stock: item.stock + amountToAdd } : item
        ));
        setMessage(`Success: Added ${amountToAdd} units to inventory.`);
        
        // Clear success message after 3 seconds
        setTimeout(() => setMessage(''), 3000);
    } catch(e) { 
        setMessage('Restock Failed: Backend connectivity issue.'); 
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-purple-800 mb-6">Wholesaler Portal 🏭</h1>
      
      {message && <div className={`mb-4 p-3 rounded ${message.includes('Success') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{message}</div>}

      <div className="bg-white rounded-lg shadow overflow-hidden border-t-4 border-purple-600">
        <table className="min-w-full">
          <thead className="bg-gray-100 text-gray-800">
            <tr>
              <th className="py-3 px-6 text-left">Product</th>
              <th className="py-3 px-6 text-left">Wholesale Price</th>
              <th className="py-3 px-6 text-left">Retailer Stock</th>
              <th className="py-3 px-6 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {inventory.map((item) => (
              <tr key={item.id || 'p1'} className="border-b hover:bg-gray-50">
                <td className="py-4 px-6 font-medium">{item.name}</td>
                <td className="py-4 px-6 font-bold text-green-600">${(item.price * 0.7).toFixed(2)}</td>
                <td className="py-4 px-6">
                  <span className={`px-2 py-1 rounded ${item.stock < 20 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                    {item.stock} units
                  </span>
                </td>
                <td className="py-4 px-6">
                  <button 
                    onClick={() => handleRestock(item.id || 'p1')}
                    className="bg-purple-600 text-white px-4 py-1 rounded hover:bg-purple-700 transition shadow-md"
                  >
                    Restock (+50)
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {inventory.length === 0 && (
            <div className="p-6 text-center text-gray-500">Loading inventory or backend is offline...</div>
        )}
      </div>
    </div>
  );
};

export default WholesalerDashboard;
