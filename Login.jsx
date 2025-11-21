// src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    
    // SIMULATED LOGIN LOGIC FOR PROTOTYPE
    // (In a real app, this would POST to your User Service)
    let role = 'Customer';
    if(email.includes('retail')) role = 'Retailer';
    if(email.includes('whole')) role = 'Wholesaler';
    
    const mockUser = { name: 'Demo User', email, role };
    login(mockUser);
    
    // Redirect based on role
    if (role === 'Retailer') navigate('/retailer');
    else if (role === 'Wholesaler') navigate('/wholesaler');
    else navigate('/'); // Customer goes to home
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">Login</h2>
        
        <div className="mb-4 bg-blue-50 p-3 rounded text-sm text-blue-800">
            <p><strong>Tip for Demo:</strong></p>
            <p>• Use <b>retail@test.com</b> to login as Retailer.</p>
            <p>• Use <b>any other email</b> for Customer.</p>
        </div>

        <input className="w-full mb-4 p-2 border rounded" type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
        <input className="w-full mb-6 p-2 border rounded" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
        
        <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 font-bold">Login</button>
        <p className="mt-4 text-center text-sm">Don't have an account? <Link to="/register" className="text-blue-500 hover:underline">Sign up</Link></p>
      </form>
    </div>
  );
};

export default Login;