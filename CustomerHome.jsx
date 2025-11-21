import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import { useCart } from '../context/CartContext';
import FeedbackSection from '../components/FeedbackSection';

// Helper Component for individual product cards
const ProductCard = ({ product, onAddToCart, refreshData }) => {
    const [qty, setQty] = useState(1); // Local state for quantity selection

    return (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow border border-gray-100">
            <div className="h-48 bg-gradient-to-tr from-gray-200 to-gray-300 flex items-center justify-center text-4xl">
                🍎
            </div>
            <div className="p-6">
                <div className="flex justify-between items-start">
                    <h3 className="text-xl font-bold text-gray-800">{product.name}</h3>
                    {product.isLocal && <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-2 py-1 rounded-full">📍 Local</span>}
                </div>
                <p className="text-gray-600 mt-2 text-sm">{product.description || 'Fresh produce.'}</p>
                
                <div className="mt-4 flex justify-between items-center">
                    <span className="text-2xl font-bold text-green-600">${product.price}</span>
                    <span className={`text-sm ${product.stock > 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {product.stock > 0 ? `${product.stock} in stock` : 'Out of Stock'}
                    </span>
                </div>

                {/* Quantity Selection & Add Button */}
                <div className="mt-4 flex gap-2">
                    <input 
                        type="number" 
                        min="1" 
                        max={product.stock}
                        value={qty} 
                        onChange={(e) => setQty(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-16 p-2 border rounded text-center"
                    />
                    <button 
                        onClick={() => onAddToCart(product, qty)}
                        className="flex-grow bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition font-medium"
                    >
                        Add to Cart
                    </button>
                </div>

                {/* Feedback Section */}
                <FeedbackSection 
                    productId={product.id || 'p1'} 
                    initialReviews={product.reviews} 
                    refreshData={refreshData} 
                />
            </div>
        </div>
    );
};

const CustomerHome = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const { addToCart } = useCart(); // Cart Context

  const refreshProducts = async () => {
      try {
          const res = await api.get('/api/catalog/details/p1');
          setProducts([res.data]); 
      } catch (err) { console.error(err); }
  };

  useEffect(() => {
    refreshProducts();
  }, []);

  const handleAddToCart = (product, quantity) => {
      addToCart(product, quantity);
      alert(`Added ${quantity} ${product.name}(s) to Cart!`);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Shop Local 🏪</h1>
        <div className="flex gap-2">
            <input 
                type="text" 
                placeholder="Search products..." 
                className="p-2 border rounded w-64"
                onChange={(e) => setSearch(e.target.value)}
            />
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Search</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard 
            key={product.id || 'p1'} 
            product={product} 
            onAddToCart={handleAddToCart}
            refreshData={refreshProducts}
          />
        ))}
      </div>
    </div>
  );
};

export default CustomerHome;