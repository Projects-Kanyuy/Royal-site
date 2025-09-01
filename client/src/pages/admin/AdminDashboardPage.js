// src/pages/admin/AdminDashboardPage.js
import React, { useState, useEffect, useContext } from "react";
import apiClient from "../../api/axios";
import AuthContext from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import AnalyticsDashboard from "./AnalyticsDashboard";

const AdminDashboardPage = () => {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { auth, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${auth.token}` } };
        const { data } = await apiClient.get("/api/admin/artists", config);
        setArtists(data);
      } catch (err) {
        setError("Failed to fetch artists. You may not be authorized.");
      } finally {
        setLoading(false);
      }
    };
    if (auth?.token) {
      fetchArtists();
    }
  }, [auth]);

  const handleAddFinancialVotes = async (artistId) => {
    const votesString = prompt(
      `Enter number of Financial (Cash) Votes to add:`,
      "0"
    );
    if (votesString) {
      const votesToAdd = Number(votesString);
      if (isNaN(votesToAdd) || votesToAdd <= 0) {
        alert("Please enter a valid positive number.");
        return;
      }
      try {
        const config = { headers: { Authorization: `Bearer ${auth.token}` } };
        const { data: updatedArtist } = await apiClient.put(
          `/api/admin/artists/${artistId}/add-financial-votes`,
          { votesToAdd },
          config
        );
        setArtists((prev) =>
          prev.map((a) => (a._id === artistId ? updatedArtist : a))
        );
        alert("Financial votes added successfully!");
      } catch (err) {
        alert("Failed to add votes.");
      }
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (loading) return <p className="text-center p-8">Loading Artists...</p>;
  if (error) return <p className="text-center p-8 text-red-500">{error}</p>;

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Panel</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors"
        >
          Logout
        </button>
      </div>

      {/* Analytics Dashboard - Always visible at the top */}
      <AnalyticsDashboard />

      {/* Financial Votes Management Section */}
      <div className="bg-white p-6 rounded-lg shadow-md mt-6">
        <h2 className="text-xl font-semibold mb-4">
          Manage Financial (Cash) Votes
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left py-2 px-3">Artist</th>
                <th className="py-2 px-3">CamPay Votes</th>
                <th className="py-2 px-3">Financial Votes</th>
                <th className="py-2 px-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {artists.map((artist) => (
                <tr key={artist._id} className="border-b">
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={artist.profilePicture.url}
                        alt={artist.stageName}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <div className="font-bold">{artist.stageName}</div>
                        <div className="text-sm text-gray-500">
                          {artist.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-center font-semibold">
                    {artist.votes || 0}
                  </td>
                  <td className="py-3 px-3 text-center font-semibold">
                    {artist.financialVotes || 0}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <button
                      onClick={() => handleAddFinancialVotes(artist._id)}
                      className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                    >
                      Add Financial Votes
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
