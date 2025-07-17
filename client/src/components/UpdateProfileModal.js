// src/components/UpdateProfileModal.js
import React, { useState, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';

const UpdateProfileModal = ({ artist, closeModal }) => {
  const [formData, setFormData] = useState({
    name: artist.name || '',
    stageName: artist.stageName || '',
    bio: artist.bio || '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { setAuth } = useContext(AuthContext); // Use setAuth to update context

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const token = artist.token;
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const { data } = await axios.put('/api/artists/profile', formData, config);
      
      // Update the user info in AuthContext and localStorage
      const updatedUserInfo = { ...artist, ...data };
      localStorage.setItem('userInfo', JSON.stringify(updatedUserInfo));
      setAuth(updatedUserInfo);

      alert('Profile updated successfully!');
      closeModal(); // Close the modal on success
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile.');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
      <div className="bg-card-dark p-8 rounded-lg shadow-xl w-full max-w-md text-white">
        <h2 className="text-2xl font-bold mb-6 text-center">Update Your Profile</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400">Full Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full mt-1 p-3 bg-gray-800 border border-gray-600 rounded-md"/>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400">Stage Name</label>
            <input type="text" name="stageName" value={formData.stageName} onChange={handleChange} className="w-full mt-1 p-3 bg-gray-800 border border-gray-600 rounded-md"/>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400">Bio</label>
            <textarea name="bio" rows="4" value={formData.bio} onChange={handleChange} className="w-full mt-1 p-3 bg-gray-800 border border-gray-600 rounded-md"></textarea>
          </div>
          <div className="flex gap-4 pt-4">
            <button type="button" onClick={closeModal} className="w-full bg-gray-600 text-white font-bold py-3 rounded-md hover:bg-gray-700">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="w-full bg-brand-yellow-vote text-black font-bold py-3 rounded-md hover:brightness-90 disabled:bg-gray-500">
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateProfileModal;