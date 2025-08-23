// src/pages/admin/AdminDashboardPage.js
import React, { useState, useEffect, useContext } from 'react';
import apiClient from '../../api/axios';
import AuthContext from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminDashboardPage = () => {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { auth, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${auth.token}` } };
        const { data } = await apiClient.get('/api/admin/artists', config);
        setArtists(data);
      } catch (err) {
        setError('Failed to fetch artists. You may not be authorized.');
      } finally {
        setLoading(false);
      }
    };
    if (auth?.token) { fetchArtists(); }
  }, [auth]);
  
  const handleAddHandVotes = async (artistId) => {
    const votesString = prompt(`Enter the number of Hand Votes (cash votes) to add:`, "0");
    if (votesString) {
      const votesToAdd = Number(votesString);
      if (isNaN(votesToAdd) || votesToAdd <= 0) {
        alert("Please enter a valid positive number.");
        return;
      }
      try {
        const config = { headers: { Authorization: `Bearer ${auth.token}` } };
        const { data: updatedArtist } = await apiClient.put(`/api/admin/artists/${artistId}/add-hand-votes`, { votesToAdd }, config);
        setArtists(artists.map(a => a._id === artistId ? updatedArtist : a));
        alert('Hand votes added successfully!');
      } catch (err) { 
        alert(err.response?.data?.message || 'Failed to add votes.'); 
      }
    }
  };

  const handleLogout = () => { logout(); navigate('/'); };
  
  if (loading) return <p className="text-center p-8">Loading Artists...</p>;
  if (error) return <p className="text-center p-8 text-red-500">{error}</p>;

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Panel</h1>
        <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">Logout</button>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Manage Hand (Cash) Votes</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left py-2 px-3">Artist</th>
                <th className="py-2 px-3">Official Votes</th>
                {/* --- ADDED THE MISSING COLUMN HEADER --- */}
                <th className="py-2 px-3">Hand Votes</th>
                <th className="py-2 px-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {artists.map(artist => (
                <tr key={artist._id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-3">
                      <img src={artist.profilePicture.url} alt={artist.stageName} className="w-12 h-12 rounded-full object-cover" />
                      <div>
                        <div className="font-bold">{artist.stageName}</div>
                        <div className="text-sm text-gray-500">{artist.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-center font-semibold">{artist.votes}</td>
                  {/* --- DISPLAY THE HAND VOTES DATA --- */}
                  <td className="py-3 px-3 text-center font-semibold">{artist.handVotes}</td>
                  <td className="py-3 px-3 text-center">
                    <button onClick={() => handleAddHandVotes(artist._id)} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
                      Add Hand Votes
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default AdminDashboardPage;