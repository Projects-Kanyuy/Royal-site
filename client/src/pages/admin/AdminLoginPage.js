// src/pages/admin/AdminLoginPage.js
import React, { useState, useContext } from 'react';
import apiClient from '../../api/axios';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const AdminLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      // --- CRITICAL: Call the CORRECT user/admin login endpoint ---
      const { data } = await apiClient.post('/api/users/login', { email, password });
      if (data && data.isAdmin) {
        login(data);
        navigate('/admin/dashboard');
      } else {
        setError('Access Denied. You are not an authorized admin.');
        setLoading(false);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
      setLoading(false);
    }
  };

  return (
    <div className="bg-bg-light min-h-screen">
      <div className="container mx-auto py-20 flex justify-center">
        <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
            <h1 className="text-4xl font-bold text-gray-500 text-center">Admin Login</h1>
            <p className="text-gray-400 mt-2 text-center">Log in to manage hand votes.</p>
            {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
            <form onSubmit={handleSubmit} className="max-w-sm mx-auto mt-8 text-left">
                <div className="mb-4">
                  <label className="block mb-1 text-gray-500">Email</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full bg-gray-200 border border-gray-300 rounded-md p-3 focus:ring-brand-yellow-vote focus:border-brand-yellow-vote outline-none text-gray-800" />
                </div>
                <div className="mb-6">
                  <label className="block mb-1 text-gray-500">Password</label>
                  <div className="relative">
                    <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full bg-gray-200 border border-gray-300 rounded-md p-3 pr-10 focus:ring-brand-yellow-vote focus:border-brand-yellow-vote outline-none text-gray-800" />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <FaEyeSlash className="h-5 w-5 text-gray-500" /> : <FaEye className="h-5 w-5 text-gray-500" />}
                    </div>
                  </div>
                </div>
                <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white font-bold py-3 rounded-md hover:bg-blue-700 transition-all disabled:bg-gray-400">
                  {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>
            <div className="text-center mt-6">
                <Link to="/profile" className="text-sm text-gray-500 hover:text-blue-600 hover:underline">
                    Are you an Artist? Login here.
                </Link>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;