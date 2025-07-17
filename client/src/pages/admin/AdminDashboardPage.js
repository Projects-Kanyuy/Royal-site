// src/pages/admin/AdminDashboardPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminDashboardPage = () => {
  const [pendingArtists, setPendingArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchPendingArtists = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        navigate('/admin/login');
        return;
      }
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const { data } = await axios.get('/api/admin/artists/pending', config);
      setPendingArtists(data);
    } catch (err) {
      setError('Failed to fetch pending artists.');
      if (err.response?.status === 401) navigate('/admin/login');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingArtists();
  }, []);

  const handleApprove = async (artistId) => {
    try {
      const token = localStorage.getItem('adminToken');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.put(`/api/admin/artists/${artistId}/approve`, {}, config);
      setPendingArtists(prev => prev.filter(artist => artist._id !== artistId));
    } catch (err) {
      alert('Failed to approve artist.');
    }
  };

  const handleReject = async (artistId) => {
    if (window.confirm('Are you sure you want to reject and delete this artist?')) {
      try {
        const token = localStorage.getItem('adminToken');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        await axios.delete(`/api/admin/artists/${artistId}`, config);
        setPendingArtists(prev => prev.filter(artist => artist._id !== artistId));
      } catch (err) {
        alert('Failed to reject artist.');
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Admin Dashboard</h1>
          <button onClick={handleLogout} className="bg-red-500 text-white font-bold py-2 px-4 rounded-md hover:bg-red-600">Logout</button>
        </div>
        <h2 className="text-2xl font-semibold mb-4">Pending Artist Approvals</h2>
        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}
        <div className="space-y-4">
          {pendingArtists.length > 0 ? (
            pendingArtists.map(artist => (
              <div key={artist._id} className="bg-white p-4 rounded-lg shadow-md flex flex-col md:flex-row md:items-center justify-between">
                <div className="flex items-center mb-4 md:mb-0">
                  <img src={artist.profilePicture.url} alt={artist.stageName} className="w-16 h-16 rounded-full object-cover mr-4" />
                  <div>
                    <p className="font-bold text-lg">{artist.stageName} <span className="text-gray-500 font-normal">({artist.name})</span></p>
                    <p className="text-sm text-gray-600">{artist.email}</p>
                    <p className="text-sm mt-1">{artist.bio}</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <button onClick={() => handleApprove(artist._id)} className="bg-green-500 text-white font-bold py-2 px-4 rounded-md hover:bg-green-600">Approve</button>
                  <button onClick={() => handleReject(artist._id)} className="bg-gray-500 text-white font-bold py-2 px-4 rounded-md hover:bg-gray-600">Reject</button>
                </div>
              </div>
            ))
          ) : (
            !loading && <p>No pending artists to approve.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;