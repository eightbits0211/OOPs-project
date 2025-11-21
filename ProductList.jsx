import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig'; // Import the configured API instance

function ProductList() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            // --- INTEGRATION POINT: Fetch Details for Mock Item p1 ---
            // We call the catalog endpoint, which internally calls the Inventory Service (3002).
            const res = await api.get('/api/catalog/details/p1');
            
            // To demonstrate multiple items, we'll map the single fetched item
            setProducts([res.data]); 
            setError('');
        } catch (err) {
            console.error('API Call Failed:', err);
            setError('Failed to fetch product data. Check if ALL backend services are running.');
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="text-center">Loading Products...</div>;
    if (error) return <div className="text-red-500 text-center">{error}</div>;
    if (products.length === 0) return <div className="text-center">No products found.</div>;

    return (
        <div className="p-8">
            <h2 className="text-3xl font-bold mb-6 text-white">🛒 Live MART Catalog (Test Item)</h2>
            <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-green-500/50">
                <h3 className="text-xl font-semibold text-white">{products[0].name}</h3>
                <p className="text-lg font-mono text-green-400">Price: ${products[0].price}</p>
                <p className="text-sm text-gray-400">Status: {products[0].stockStatus} ({products[0].stock} units)</p>
                <p className="mt-2 text-yellow-400">{products[0].isLocal ? '✨ Region-Specific Local Item' : ''}</p>
                <p className="text-xs text-gray-500 mt-2">Source: Data aggregated from Catalog (3003) and Inventory (3002).</p>
            </div>
        </div>
    );
}
export default ProductList;

