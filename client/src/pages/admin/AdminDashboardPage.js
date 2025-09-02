// src/pages/admin/AdminDashboardPage.js
import React, { useState, useEffect, useContext } from "react";
import apiClient from "../../api/axios";
import AuthContext from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import AnalyticsDashboard from "./AnalyticsDashboard";
import { Plus, Trash2, Vote, UserX, Check, X } from "lucide-react";

const AdminDashboardPage = () => {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { auth, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // States for Modals
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAddVotesModalOpen, setIsAddVotesModalOpen] = useState(false);
  const [isConfirmVotesModalOpen, setIsConfirmVotesModalOpen] = useState(false);
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
      setArtists((prev) => prev.filter((a) => a._id !== artistToModify._id));
      alert("Artist deleted successfully!");
    } catch (err) {
      alert("Failed to delete artist.");
      console.error(err);
    } finally {
      setIsDeleteModalOpen(false);
      setArtistToModify(null);
    }
  };

  // Function to handle Adding Financial Votes
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
      setIsConfirmVotesModalOpen(false);
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

  // Helper function to open the confirmation modal
  const openConfirmVotesModal = () => {
    if (votesToAdd && Number(votesToAdd) > 0) {
      setIsAddVotesModalOpen(false);
      setIsConfirmVotesModalOpen(true);
    } else {
      alert("Please enter a valid number of votes.");
    }
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
        <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
        >
          <UserX className="w-4 h-4" />
          Logout
        </button>
      </div>

      {/* Analytics Dashboard - Always visible at the top */}
      <AnalyticsDashboard />

      {/* Artists Management Section */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mt-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Manage Artists & Votes
          </h2>
          <span className="text-sm text-gray-600">
            {artists.length} artists
          </span>
        </div>

        <div className="overflow-x-auto  rounded-lg border border-gray-200">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-700 uppercase tracking-wider">
                  Artist
                </th>
                <th className="text-center py-4 px-6 text-sm font-medium text-gray-700 uppercase tracking-wider">
                  CamPay Votes
                </th>
                <th className="text-center py-4 px-6 text-sm font-medium text-gray-700 uppercase tracking-wider">
                  Financial Votes
                </th>
                <th className="text-center py-4 px-6 text-sm font-medium text-gray-700 uppercase tracking-wider">
                  Total Votes
                </th>
                <th className="text-center py-4 px-6 text-sm font-medium text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {artists.map((artist) => (
                <tr
                  key={artist._id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-4">
                      <img
                        src={artist.profilePicture.url}
                        alt={artist.stageName}
                        className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                      />
                      <div>
                        <div className="font-semibold text-gray-900">
                          {artist.stageName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {artist.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="text-center py-4 px-6">
                    <span className="inline-flex items-center justify-center w-12 h-8 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                      {artist.votes || 0}
                    </span>
                  </td>
                  <td className="text-center py-4 px-6">
                    <span className="inline-flex items-center justify-center w-12 h-8 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                      {artist.financialVotes || 0}
                    </span>
                  </td>
                  <td className="text-center py-4 px-6">
                    <span className="inline-flex items-center justify-center w-16 h-8 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                      {(artist.votes || 0) + (artist.financialVotes || 0)}
                    </span>
                  </td>
                  <td className="text-center py-4 px-6">
                    <div className="flex justify-center items-center gap-2">
                      <button
                        onClick={() => openAddVotesModal(artist)}
                        className="flex items-center gap-1 px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm"
                      >
                        <Plus className="w-4 h-4" />
                        Add Votes
                      </button>
                      <button
                        onClick={() => openDeleteModal(artist)}
                        className="flex items-center gap-1 px-3 py-2 bg-[#f65555] text-white rounded-md hover:bg-red-600 transition-colors text-sm"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white p-6 rounded-xl shadow-xl max-w-md w-full">
            <div className="text-center mb-4">
              <Trash2 className="w-12 h-12 text-red-500 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Delete Artist
              </h3>
              <p className="text-gray-600 mb-1">
                Are you sure you want to delete{" "}
                <strong>{artistToModify?.stageName}</strong>?
              </p>
              <p className="text-sm text-red-600 font-medium">
                This action cannot be undone and will permanently remove all
                artist data.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={handleDeleteArtist}
                className="w-full py-3 bg-[#f65555] text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
              >
                Yes, Delete Permanently
              </button>
              <button
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setArtistToModify(null);
                }}
                className="w-full py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Votes Modal */}
      {isAddVotesModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white p-6 rounded-xl shadow-xl max-w-md w-full">
            <div className="flex items-center gap-3 mb-4">
              <Plus className="w-6 h-6 text-blue-500" />
              <h3 className="text-lg font-bold text-gray-900">
                Add Financial Votes
              </h3>
            </div>

            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <img
                  src={artistToModify?.profilePicture.url}
                  alt={artistToModify?.stageName}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <div className="font-semibold">
                    {artistToModify?.stageName}
                  </div>
                  <div className="text-sm text-gray-600">
                    Current votes: {artistToModify?.financialVotes || 0}
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <label
                htmlFor="votesInput"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Number of Votes to Add:
              </label>
              <input
                id="votesInput"
                type="number"
                min="1"
                value={votesToAdd}
                onChange={(e) => setVotesToAdd(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter number of votes"
                autoFocus
              />
              <p className="text-xs text-gray-500 mt-2">
                Each vote represents 100 XAF
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setIsAddVotesModalOpen(false);
                  setArtistToModify(null);
                  setVotesToAdd("");
                }}
                className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={openConfirmVotesModal}
                className="flex-1 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" />
                Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Votes Modal */}
      {isConfirmVotesModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white p-6 rounded-xl shadow-xl max-w-md w-full">
            <div className="text-center mb-4">
              <Vote className="w-12 h-12 text-green-500 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Confirm Vote Addition
              </h3>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="text-center">
                <div className="font-semibold text-blue-900 mb-2">
                  {artistToModify?.stageName}
                </div>
                <div className="text-2xl font-bold text-blue-800">
                  {votesToAdd} votes
                </div>
                <div className="text-sm text-blue-600 mt-1">
                  ({votesToAdd * 100} XAF)
                </div>
              </div>
            </div>

            <p className="text-sm text-gray-600 text-center mb-6">
              Are you sure you want to add these votes to the artist?
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setIsConfirmVotesModalOpen(false);
                  setIsAddVotesModalOpen(true);
                }}
                className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center justify-center gap-2"
              >
                <X className="w-4 h-4" />
                Go Back
              </button>
              <button
                onClick={handleAddFinancialVotes}
                className="flex-1 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" />
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardPage;
