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

  // States for Modals
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAddVotesModalOpen, setIsAddVotesModalOpen] = useState(false);
  const [artistToModify, setArtistToModify] = useState(null);
  const [votesToAdd, setVotesToAdd] = useState("");

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

  // Function to handle Artist Deletion
  const handleDeleteArtist = async () => {
    if (!artistToModify) return;
    try {
      const config = { headers: { Authorization: `Bearer ${auth.token}` } };
      await apiClient.delete(
        `/api/admin/artists/${artistToModify._id}`,
        config
      );
      // Remove the artist from the local state to update the UI
      setArtists((prev) => prev.filter((a) => a._id !== artistToModify._id));
      alert("Artist deleted successfully!");
    } catch (err) {
      alert("Failed to delete artist.");
      console.error(err);
    } finally {
      // Close the modal and reset the selected artist
      setIsDeleteModalOpen(false);
      setArtistToModify(null);
    }
  };

  // Function to handle Adding Financial Votes (updated with modal)
  const handleAddFinancialVotes = async () => {
    if (!artistToModify) return;

    const votesToAddNum = Number(votesToAdd);
    if (isNaN(votesToAddNum) || votesToAddNum <= 0) {
      alert("Please enter a valid positive number.");
      return;
    }

    try {
      const config = { headers: { Authorization: `Bearer ${auth.token}` } };
      const { data: updatedArtist } = await apiClient.put(
        `/api/admin/artists/${artistToModify._id}/add-financial-votes`,
        { votesToAdd: votesToAddNum },
        config
      );
      setArtists((prev) =>
        prev.map((a) => (a._id === artistToModify._id ? updatedArtist : a))
      );
      alert("Financial votes added successfully!");
    } catch (err) {
      alert("Failed to add votes.");
    } finally {
      // Close modal and reset state
      setIsAddVotesModalOpen(false);
      setArtistToModify(null);
      setVotesToAdd("");
    }
  };

  // Helper function to open the Add Votes modal
  const openAddVotesModal = (artist) => {
    setArtistToModify(artist);
    setVotesToAdd("");
    setIsAddVotesModalOpen(true);
  };

  // Helper function to open the Delete Confirmation modal
  const openDeleteModal = (artist) => {
    setArtistToModify(artist);
    setIsDeleteModalOpen(true);
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
        <h2 className="text-xl font-semibold mb-4">Manage Artists & Votes</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left py-2 px-3">Artist</th>
                <th className="py-2 px-3">CamPay Votes</th>
                <th className="py-2 px-3">Financial Votes</th>
                <th className="py-2 px-3">Total Votes</th>
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
                  <td className="py-3 px-3 text-center font-semibold">
                    {(artist.votes || 0) + (artist.financialVotes || 0)}
                  </td>
                  <td className="py-3 px-3 text-center space-x-2">
                    <button
                      onClick={() => openAddVotesModal(artist)}
                      className="bg-blue-500 text-white px-3 py-1 text-sm rounded-md hover:bg-blue-600 transition-colors"
                    >
                      Add Votes
                    </button>
                    <button
                      onClick={() => openDeleteModal(artist)}
                      className="bg-red-500 text-white px-3 py-1 text-sm rounded-md hover:bg-red-600 transition-colors"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
            <h3 className="text-lg font-bold mb-2">Delete Artist</h3>
            <p className="mb-6 text-gray-700">
              Are you sure you want to delete the artist "
              {artistToModify?.stageName}"? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setArtistToModify(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteArtist}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Votes Modal */}
      {isAddVotesModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
            <h3 className="text-lg font-bold mb-2">
              Add Financial Votes to {artistToModify?.stageName}
            </h3>
            <div className="mb-4">
              <label htmlFor="votesInput" className="block mb-2 font-medium">
                Number of Votes:
              </label>
              <input
                id="votesInput"
                type="number"
                min="1"
                value={votesToAdd}
                onChange={(e) => setVotesToAdd(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Enter number of votes"
                autoFocus
              />
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setIsAddVotesModalOpen(false);
                  setArtistToModify(null);
                  setVotesToAdd("");
                }}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddFinancialVotes}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                Add Votes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardPage;
