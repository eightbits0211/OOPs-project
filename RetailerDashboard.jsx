import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';

const RetailerDashboard = () => {
  const [inventory, setInventory] = useState([]);
  const [newItem, setNewItem] = useState({ name: '', price: '', stock: '', category: '' });
  const [refresh, setRefresh] = useState(false); // To trigger re-fetch

  // Fetch Inventory
  useEffect(() => {
    api.get('/api/inventory/items')
       .then(res => setInventory(res.data))
       .catch(err => console.error("Failed to load inventory"));
  }, [refresh]);

  // Add Item
  const handleAddItem = async (e) => {
    e.preventDefault();
    try {
        await api.post('/api/inventory/add', newItem);
        alert('Item Added!');
        setNewItem({ name: '', price: '', stock: '', category: '' }); // Reset form
        setRefresh(!refresh); // Refresh list
    } catch (err) {
        alert('Failed to add item');
    }
  };

  // Delete Item
  const handleDelete = async (id) => {
      if(!window.confirm("Are you sure?")) return;
      try {
          await api.delete(`/api/inventory/delete/${id}`);
          setRefresh(!refresh);
      } catch(err) { alert("Delete failed"); }
  };

  // Update Stock (Simple +10 button for demo)
  const handleRestock = async (id, currentStock) => {
      try {
          await api.put(`/api/inventory/update/${id}`, { stock: currentStock + 10 });
          setRefresh(!refresh);
      } catch(err) { alert("Update failed"); }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-indigo-800 mb-8">Retailer Store Management 🏪</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Add New Item Form */}
        <div className="bg-white p-6 rounded-lg shadow-md h-fit">
            <h2 className="text-xl font-bold mb-4 text-gray-700">Add New Product</h2>
            <form onSubmit={handleAddItem} className="space-y-4">
                <input 
                    className="w-full p-2 border rounded" 
                    placeholder="Product Name" 
                    value={newItem.name} 
                    onChange={e => setNewItem({...newItem, name: e.target.value})} 
                    required 
                />
                <input 
                    className="w-full p-2 border rounded" 
                    placeholder="Category (e.g. Produce)" 
                    value={newItem.category} 
                    onChange={e => setNewItem({...newItem, category: e.target.value})} 
                    required 
                />
                <div className="flex gap-4">
                    <input 
                        type="number" 
                        className="w-full p-2 border rounded" 
                        placeholder="Price ($)" 
                        value={newItem.price} 
                        onChange={e => setNewItem({...newItem, price: e.target.value})} 
                        required 
                    />
                    <input 
                        type="number" 
                        className="w-full p-2 border rounded" 
                        placeholder="Stock" 
                        value={newItem.stock} 
                        onChange={e => setNewItem({...newItem, stock: e.target.value})} 
                        required 
                    />
                </div>
                <button className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 font-bold">
                    Add to Inventory
                </button>
            </form>
        </div>

        {/* Right Column: Inventory List */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4 text-gray-700">Current Inventory</h2>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-100 border-b">
                            <th className="p-3">Name</th>
                            <th className="p-3">Price</th>
                            <th className="p-3">Stock</th>
                            <th className="p-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {inventory.map((item) => (
                            <tr key={item.id} className="border-b hover:bg-gray-50">
                                <td className="p-3">{item.name}</td>
                                <td className="p-3 text-green-600 font-bold">${item.price}</td>
                                <td className="p-3">
                                    <span className={`px-2 py-1 rounded text-xs ${item.stock < 10 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                                        {item.stock}
                                    </span>
                                </td>
                                <td className="p-3 flex gap-2">
                                    <button onClick={() => handleRestock(item.id, item.stock)} className="text-blue-500 hover:text-blue-700 text-sm font-medium">
                                        +10 Stock
                                    </button>
                                    <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:text-red-700 text-sm font-medium">
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {inventory.length === 0 && <tr><td colSpan="4" className="p-4 text-center text-gray-500">No items found.</td></tr>}
                    </tbody>
                </table>
            </div>
        </div>

      </div>
    </div>
  );
};

export default RetailerDashboard;