// src/pages/UpdateProfilePage.js
import React, { useState, useEffect, useContext } from 'react';
import apiClient from '../api/axios';
import AuthContext from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const UpdateProfilePage = () => {
  const { auth, login } = useContext(AuthContext);
  const [formData, setFormData] = useState({ name: '', stageName: '', bio: '' });
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  // Pre-fill the form with the logged-in artist's data
  useEffect(() => {
    if (auth) {
      setFormData({
        name: auth.name,
        stageName: auth.stageName || '', // Use current stageName or empty string
        bio: auth.bio || '', // Use current bio or empty string
      });
    }
  }, [auth]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (password && password !== confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.token}`,
        },
      };

      // Prepare data to send, only include password if it's being changed
      const updateData = { ...formData };
      if (password) {
        updateData.password = password;
      }
      
      const { data } = await apiClient.put('/api/artists/profile', updateData, config);

      // Update the global auth state and localStorage with the new user info
      login(data);

      setSuccess('Profile updated successfully!');
      setLoading(false);
      // Optional: redirect back to profile page after a delay
      setTimeout(() => navigate('/profile'), 2000);

    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile.');
      setLoading(false);
    }
  };

  if (!auth) {
    return <p className="text-center mt-20">You must be logged in to view this page.</p>;
  }

  return (
    <div className="bg-bg-light min-h-screen">
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold text-center mb-8">Update Your Profile</h1>

          {error && <div className="text-center text-red-600 p-3 bg-red-100 rounded-md mb-4">{error}</div>}
          {success && <div className="text-center text-green-600 p-3 bg-green-100 rounded-md mb-4">{success}</div>}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700">Full Name</label>
              <input type="text" name="name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="mt-1 block w-full p-3 border border-gray-300 rounded-md"/>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700">Stage Name</label>
              <input type="text" name="stageName" value={formData.stageName} onChange={(e) => setFormData({...formData, stageName: e.target.value})} className="mt-1 block w-full p-3 border border-gray-300 rounded-md"/>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700">Bio</label>
              <textarea name="bio" rows="4" value={formData.bio} onChange={(e) => setFormData({...formData, bio: e.target.value})} className="mt-1 block w-full p-3 border border-gray-300 rounded-md"></textarea>
            </div>
            <hr className="my-6" />
            <p className="text-sm text-gray-500">Update your password (leave blank to keep the same)</p>
            <div>
              <label className="block text-sm font-bold text-gray-700">New Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 block w-full p-3 border border-gray-300 rounded-md"/>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700">Confirm New Password</label>
              <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="mt-1 block w-full p-3 border border-gray-300 rounded-md"/>
            </div>
            <div>
              <button type="submit" disabled={loading} className="w-full bg-brand-gold text-white font-bold py-3 rounded-md hover:bg-brand-gold-light disabled:bg-gray-400">
                {loading ? 'Updating...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateProfilePage;