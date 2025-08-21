// src/pages/LeaderboardPage.js
import React, { useState, useEffect } from "react";
import apiClient from "../api/axios";
import { Link } from "react-router-dom";
import { FaHandPointUp } from 'react-icons/fa'; // Import the hand icon

const LeaderboardPage = () => {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [votingId, setVotingId] = useState(null); // State to manage loading for hand votes

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const { data } = await apiClient.get("/api/artists/leaderboard");
        setArtists(data);
      } catch (err) {
        setError("Could not load the leaderboard.");
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  // --- LOGIC TO HANDLE THE FREE "HAND VOTE" ---
  const handleManualVote = async (artistId) => {
    if (votingId) return; // Prevent multiple clicks while one is processing
    setVotingId(artistId);
    try {
      const { data } = await apiClient.post(`/api/artists/${artistId}/manual-vote`);
      setArtists(currentArtists => {
        const updatedArtists = currentArtists.map(artist =>
          artist._id === artistId ? { ...artist, votes: data.newVoteCount } : artist
        );
        // Re-sort the list immediately after a vote
        return updatedArtists.sort((a, b) => b.votes - a.votes);
      });
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add vote.');
    } finally {
      setVotingId(null); // Reset loading state
    }
  };

  // Your original logic for separating artists
  const topArtist = artists.length > 0 ? artists[0] : null;
  const otherArtists = artists.length > 1 ? artists.slice(1) : [];

  // Your original function for card backgrounds
  const getCardBg = (rank) => {
    if (rank === 2) return "bg-leaderboard-2";
    if (rank === 3) return "bg-leaderboard-3";
    return "bg-card-dark";
  };

  return (
    // Your original page UI structure
    <div className="bg-bg-light text-text-black min-h-screen">
      <div className="container mx-auto py-12 px-4">
        <div className="text-center mb-12">
          <h3 className="text-lg font-bold uppercase tracking-wider">
            ROCIMUC 2025 TOP ARTISTS
          </h3>
          <h1 className="font-display text-7xl text-brand-gold uppercase">
            Leaderboard
          </h1>
        </div>

        {loading && <p className="text-center text-lg">Loading Leaderboard...</p>}
        {error && <p className="text-center text-lg text-red-400">{error}</p>}

        {!loading && !error && topArtist && (
          <div className="flex flex-col md:flex-row gap-8 max-w-4xl mx-auto">
            {/* --- Left Column: #1 Artist (Your Original UI) --- */}
            <div className="flex-1">
              <div className="bg-leaderboard-1 text-white p-6 rounded-lg shadow-lg h-full flex flex-col items-center justify-center text-center relative">
                <span className="absolute top-4 left-4 bg-black bg-opacity-20 px-3 py-1 text-xs rounded-full font-bold">
                  TOP 1
                </span>
                <img
                  src={topArtist.profilePicture.url}
                  alt={topArtist.stageName}
                  className="w-40 h-40 rounded-full mx-auto border-4 border-white object-cover mb-4"
                />
                <h3 className="text-3xl font-bold">{topArtist.stageName}</h3>
                <p className="text-lg">{topArtist.genre || "Afrobeat"}</p>
                {/* --- MODIFIED: Added Hand Vote Icon --- */}
                <div className="flex items-center justify-center gap-3 mt-2 text-xl font-bold">
                    <span>{topArtist.votes} Votes</span>
                    <button onClick={() => handleManualVote(topArtist._id)} disabled={!!votingId} className="hover:text-yellow-300 transition disabled:opacity-50">
                        {votingId === topArtist._id ? <span className="text-sm animate-pulse">...</span> : <FaHandPointUp />}
                    </button>
                </div>
                 {/* --- MODIFIED: Added Paid Vote Button --- */}
                <Link to={`/artist/${topArtist._id}`} className="mt-4">
                    <button className="bg-brand-yellow-vote text-black font-bold py-2 px-8 rounded-md hover:brightness-90 transition">
                        Vote
                    </button>
                </Link>
              </div>
            </div>

            {/* --- Right Column: #2, #3, #4... (Your Original UI) --- */}
            <div className="flex-1 flex flex-col gap-4">
              {otherArtists.map((artist, index) => {
                const rank = index + 2;
                const textColorClass = rank > 3 ? "text-white" : "text-black";
                return (
                  <div key={artist._id} className={`p-4 rounded-lg flex items-center shadow-lg ${getCardBg(rank)}`}>
                    <span className={`text-2xl font-bold w-10 text-center ${textColorClass}`}>{rank}</span>
                    <img src={artist.profilePicture.url} alt={artist.stageName} className="w-16 h-16 rounded-full mx-4 object-cover" />
                    <div className="flex-grow">
                      <h3 className={`text-lg font-bold ${textColorClass}`}>{artist.stageName}</h3>
                      <p className={`text-sm opacity-80 ${textColorClass}`}>{artist.genre || "Afrobeat"}</p>
                    </div>
                    {/* --- MODIFIED: Replaced votes with voting buttons --- */}
                    <div className={`ml-auto flex items-center gap-4 font-bold pr-2 ${textColorClass}`}>
                        <span>{artist.votes} Votes</span>
                        <button onClick={() => handleManualVote(artist._id)} disabled={!!votingId} className={`${textColorClass === 'text-white' ? 'hover:text-yellow-300' : 'hover:text-gray-700'} transition disabled:opacity-50`}>
                           {votingId === artist._id ? <span className="text-xs animate-pulse">...</span> : <FaHandPointUp />}
                        </button>
                        <Link to={`/artist/${artist._id}`}>
                            <button className="bg-brand-yellow-vote text-black text-xs font-bold py-1 px-3 rounded hover:brightness-90 transition">
                                Vote
                            </button>
                        </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        
        {/* Your original "Vote Now" button at the bottom is removed as per the new design logic */}
      </div>
    </div>
  );
};

export default LeaderboardPage;