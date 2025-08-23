// src/pages/LeaderboardPage.js
import React, { useState, useEffect } from "react";
import apiClient from "../api/axios";
import { Link } from "react-router-dom";
import { FaHandPointUp } from 'react-icons/fa';

const LeaderboardPage = () => {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [votingId, setVotingId] = useState(null);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const { data } = await apiClient.get("/api/artists/leaderboard");
      setArtists(data);
    } catch (err) {
      setError("Could not load the leaderboard.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard(); // Fetch on initial load
    
    // Auto-refresh when tab becomes visible
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchLeaderboard();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const handleManualVote = async (artistId) => {
    if (votingId) return;
    setVotingId(artistId);
    try {
      const { data } = await apiClient.post(`/api/artists/${artistId}/manual-vote`);
      setArtists(currentArtists => {
        const updatedArtists = currentArtists.map(artist =>
          artist._id === artistId ? { ...artist, handVotes: data.newHandVoteCount } : artist
        );
        return updatedArtists;
      });
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add vote.');
    } finally {
      setVotingId(null);
    }
  };

  const topArtist = artists.length > 0 ? artists[0] : null;
  const otherArtists = artists.length > 1 ? artists.slice(1) : [];

  const getCardBg = (rank) => {
    if (rank === 2) return "bg-leaderboard-2";
    if (rank === 3) return "bg-leaderboard-3";
    if (rank === 4 || rank === 5) return "bg-white";
    return "bg-card-dark";
  };
  
  const getTextColor = (rank) => {
      if (rank === 4 || rank === 5) return 'text-black';
      return rank > 3 ? "text-white" : "text-black";
  };

  return (
    <div className="bg-bg-light text-text-black min-h-screen">
      <div className="container mx-auto py-12 px-4">
        <div className="text-center mb-12">
          <h3 className="text-lg font-bold uppercase tracking-wider">ROCIMUC 2025 TOP ARTISTS</h3>
          <h1 className="font-display text-7xl text-brand-gold uppercase">Leaderboard</h1>
        </div>
        
        {loading && <p className="text-center text-lg">Loading Leaderboard...</p>}
        {error && <p className="text-center text-lg text-red-400">{error}</p>}

        {!loading && !error && topArtist && (
          <div className="flex flex-col md:flex-row gap-8 max-w-4xl mx-auto">
            <div className="flex-1">
              <div className="bg-leaderboard-1 text-white p-6 rounded-lg shadow-lg h-full flex flex-col items-center justify-center text-center relative">
                <span className="absolute top-4 left-4 bg-black bg-opacity-20 px-3 py-1 text-xs rounded-full font-bold">TOP 1</span>
                <img src={topArtist.profilePicture.url} alt={topArtist.stageName} className="w-40 h-40 rounded-full mx-auto border-4 border-white object-cover mb-4" />
                <h3 className="text-3xl font-bold">{topArtist.stageName}</h3>
                <p className="text-lg">{topArtist.genre || "Afrobeat"}</p>
                <div className="mt-2 text-center">
                    <p className="text-xl font-bold">{topArtist.votes} Official Votes</p>
                    <div className="flex items-center justify-center gap-2 mt-1 text-base opacity-80">
                        <span>{topArtist.handVotes || 0} Hand Votes</span>
                        {/* --- ADDED BACK THE HAND VOTE BUTTON --- */}
                        <button onClick={() => handleManualVote(topArtist._id)} disabled={!!votingId} className="hover:text-yellow-300 transition disabled:opacity-50">
                            {votingId === topArtist._id ? <span className="text-sm animate-pulse">...</span> : <FaHandPointUp />}
                        </button>
                    </div>
                </div>
                <Link to={`/artist/${topArtist._id}`} className="mt-4">
                  <button className="bg-brand-yellow-vote text-black font-bold py-2 px-8 rounded-md hover:brightness-90 transition">Vote</button>
                </Link>
              </div>
            </div>

            <div className="flex-1 flex flex-col gap-4">
              {otherArtists.map((artist, index) => {
                const rank = index + 2;
                const textColorClass = getTextColor(rank);
                return (
                  <div key={artist._id} className={`p-4 rounded-lg flex items-center shadow-lg ${getCardBg(rank)}`}>
                    <span className={`text-2xl font-bold w-10 text-center ${textColorClass}`}>{rank}</span>
                    <img src={artist.profilePicture.url} alt={artist.stageName} className="w-16 h-16 rounded-full mx-4 object-cover" />
                    <div className="flex-grow">
                      <h3 className={`text-lg font-bold ${textColorClass}`}>{artist.stageName}</h3>
                      <p className={`text-sm opacity-80 ${textColorClass}`}>{artist.genre || "Afrobeat"}</p>
                    </div>
                    <div className={`ml-auto text-right pr-2`}>
                        <p className={`font-bold text-sm ${textColorClass}`}>{artist.votes} Official Votes</p>
                        <div className={`flex items-center justify-end gap-2 text-xs opacity-80 ${textColorClass}`}>
                            <span>{artist.handVotes || 0} Hand Votes</span>
                            {/* --- ADDED BACK THE HAND VOTE BUTTON --- */}
                            <button onClick={() => handleManualVote(artist._id)} disabled={!!votingId} className={`transition disabled:opacity-50 ${textColorClass === 'text-black' ? 'hover:text-gray-500' : 'hover:text-yellow-300'}`}>
                               {votingId === artist._id ? <span className="text-xs animate-pulse">..</span> : <FaHandPointUp />}
                            </button>
                        </div>
                        <Link to={`/artist/${artist._id}`} className="mt-1 inline-block">
                            <button className="bg-brand-yellow-vote text-black text-xs font-bold py-1 px-4 rounded-md hover:brightness-90 transition">
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
      </div>
    </div>
  );
};
export default LeaderboardPage;