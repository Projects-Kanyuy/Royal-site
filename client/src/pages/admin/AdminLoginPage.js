// src/pages/admin/AdminLoginPage.js
import React, { useState, useContext } from 'react';
import apiClient from '../../api/axios';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';

const AdminLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await apiClient.post('/api/users/login', { email, password });
      if (data && data.isAdmin) {
        login(data); // Save admin info to global state/localStorage
        navigate('/admin/dashboard');
      } else {
        setError('Access Denied. You are not an authorized admin.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-20 flex justify-center">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center mb-6">Admin Panel Login</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block font-medium">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full p-3 border border-gray-300 rounded-md mt-1" />
          </div>
          <div>
            <label className="block font-medium">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full p-3 border border-gray-300 rounded-md mt-1" />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white p-3 rounded-md font-bold hover:bg-blue-700 disabled:bg-gray-400">
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginPage;