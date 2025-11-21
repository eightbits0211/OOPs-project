// src/pages/Register.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axiosConfig'; // Uses your real backend connection

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'Customer' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // This hits your running User Service (Port 3001)
      await api.post('/api/user/register', formData);
      alert('Registration Successful! Please Login.');
      navigate('/login');
    } catch (err) {
      alert('Registration Failed: ' + (err.response?.data?.msg || 'Server Error'));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center text-green-600">Create Account</h2>
        <input className="w-full mb-4 p-2 border rounded" placeholder="Full Name" onChange={e => setFormData({...formData, name: e.target.value})} required />
        <input className="w-full mb-4 p-2 border rounded" type="email" placeholder="Email" onChange={e => setFormData({...formData, email: e.target.value})} required />
        
        <label className="block text-sm text-gray-600 mb-1">I am a:</label>
        <select className="w-full mb-4 p-2 border rounded" onChange={e => setFormData({...formData, role: e.target.value})}>
          <option value="Customer">Customer</option>
          <option value="Retailer">Retailer</option>
          <option value="Wholesaler">Wholesaler</option>
        </select>
        
        <input className="w-full mb-6 p-2 border rounded" type="password" placeholder="Password" onChange={e => setFormData({...formData, password: e.target.value})} required />
        <button className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 font-bold">Register</button>
        <p className="mt-4 text-center text-sm">Already have an account? <Link to="/login" className="text-blue-500 hover:underline">Login</Link></p>
      </form>
    </div>
  );
};

export default Register;