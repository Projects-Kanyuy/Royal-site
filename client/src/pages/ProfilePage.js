// src/pages/ProfilePage.js
import React, { useState, useContext, useEffect } from 'react';
import apiClient from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Import the eye icons

// --- SUB-COMPONENT: Login Form (with password toggle) ---
const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // State to manage password visibility
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await apiClient.post('/api/artists/login', { email, password });
      onLogin(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
      setLoading(false);
    }
  };

  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold text-gray-500">Artist Login</h1>
      <p className="text-gray-400 mt-2">Log in to update your profile.</p>
      {error && <p className="text-red-500 mt-4">{error}</p>}
      <form onSubmit={handleSubmit} className="max-w-sm mx-auto mt-8 text-left">
        <div className="mb-4">
          <label className="block mb-1 text-gray-500">Email</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
            className="w-full bg-gray-200 border border-gray-300 rounded-md p-3 focus:ring-brand-yellow-vote focus:border-brand-yellow-vote outline-none text-gray-800" 
          />
        </div>
        
        {/* --- PASSWORD FIELD WITH TOGGLE ICON --- */}
        <div className="mb-6">
          <label className="block mb-1 text-gray-500">Password</label>
          <div className="relative">
            <input 
              type={showPassword ? 'text' : 'password'} // Dynamically change input type
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              className="w-full bg-gray-200 border border-gray-300 rounded-md p-3 pr-10 focus:ring-brand-yellow-vote focus:border-brand-yellow-vote outline-none text-gray-800" 
            />
            {/* The icon is positioned inside the input field */}
            <div 
              className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
              onClick={() => setShowPassword(!showPassword)} // Toggle state on click
            >
              {showPassword ? (
                <FaEyeSlash className="h-5 w-5 text-gray-500" />
              ) : (
                <FaEye className="h-5 w-5 text-gray-500" />
              )}
            </div>
          </div>
        </div>
        
        <button 
          type="submit" 
          disabled={loading} 
          className="w-full bg-brand-yellow-vote text-black font-bold py-3 rounded-md hover:brightness-90 transition-all disabled:bg-gray-400"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

// --- SUB-COMPONENT: Logged-In Dashboard ---
const ProfileDashboard = ({ artist, onLogout }) => {
  const [shareableLink, setShareableLink] = useState('');

  useEffect(() => {
    const link = `${window.location.origin}/artist/${artist._id}`;
    setShareableLink(link);
  }, [artist._id]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareableLink).then(() => {
      alert('Link copied to clipboard!');
    }, (err) => {
      alert('Failed to copy link.');
      console.error('Could not copy text: ', err);
    });
  };

  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold text-gray-800">Welcome, {artist.name}</h1>
      <p className="text-gray-600 mt-2">We thank you for your participation.</p>
      
      <div className="mt-12">
        <label className="font-bold text-gray-700">Your unique voting link:</label>
        <div className="flex items-center justify-center gap-2 mt-2">
            <input 
                type="text" 
                readOnly 
                value={shareableLink} 
                className="bg-white border border-gray-300 p-2 rounded-md text-gray-700 w-full max-w-md"
            />
            <button onClick={copyToClipboard} className="bg-gray-700 text-white font-bold py-2 px-4 rounded-md hover:bg-gray-800">
                Copy
            </button>
        </div>
      </div>

      <div className="max-w-md mx-auto mt-8 space-y-4">
        <Link to="/update-profile" className="block">
          <button className="w-full bg-brand-yellow-vote text-black font-bold py-3 px-8 rounded-md hover:brightness-90 border-2 border-black">
            UPDATE PROFILE
          </button>
        </Link>
        <button onClick={onLogout} className="w-full bg-gray-700 text-white font-bold py-3 px-8 rounded-md hover:bg-gray-800">
          Logout
        </button>
      </div>
    </div>
  );
};


// --- MAIN PAGE COMPONENT ---
const ProfilePage = () => {
  const { auth, login, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = (userInfo) => {
    login(userInfo);
    navigate('/profile', { replace: true });
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="bg-bg-light min-h-screen">
      <div className="container mx-auto py-20 px-4">
        {auth ? (
          <ProfileDashboard artist={auth} onLogout={handleLogout} />
        ) : (
          <LoginPage onLogin={handleLogin} />
        )}
      </div>
    </div>
  );
};

export default ProfilePage;