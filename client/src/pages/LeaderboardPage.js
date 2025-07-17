// src/pages/LeaderboardPage.js
import React, { useState, useEffect } from 'react';
import apiClient from '../api/axios';
import { Link } from 'react-router-dom';

const LeaderboardPage = () => {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const { data } = await apiClient.get('/api/artists/leaderboard');
        setArtists(data);
      } catch (err) {
        setError('Could not load the leaderboard.');
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  // Separate the top artist from the rest
  const topArtist = artists.length > 0 ? artists[0] : null;
  const otherArtists = artists.length > 1 ? artists.slice(1) : [];

  const getCardBg = (rank) => {
    if (rank === 2) return 'bg-leaderboard-2'; // Gold/Tan for #2
    if (rank === 3) return 'bg-leaderboard-3'; // Brown for #3
    return 'bg-card-dark'; // Default dark for others
  };

  return (
    <div className="bg-bg-dark text-text-light min-h-screen">
      <div className="container mx-auto py-12 px-4">
        <div className="text-center mb-12">
          <h3 className="text-lg font-bold uppercase tracking-wider">ROCIMUC 2025 TOP ARTISTS</h3>
          <h1 className="font-display text-7xl text-brand-gold uppercase">Leaderboard</h1>
        </div>

        {loading && <p className="text-center text-lg">Loading Leaderboard...</p>}
        {error && <p className="text-center text-lg text-red-400">{error}</p>}

        {!loading && !error && topArtist && (
          // Main container for the two-column layout
          <div className="flex flex-col md:flex-row gap-8 max-w-4xl mx-auto">
            
            {/* --- Left Column: #1 Artist --- */}
            <div className="flex-1">
              <div className="bg-leaderboard-1 p-6 rounded-lg shadow-lg h-full flex flex-col items-center justify-center text-center relative">
                <span className="absolute top-4 left-4 bg-black bg-opacity-20 px-3 py-1 text-xs rounded-full font-bold">TOP 1</span>
                <img src={topArtist.profilePicture.url} alt={topArtist.stageName} className="w-40 h-40 rounded-full mx-auto border-4 border-white object-cover mb-4" />
                <h3 className="text-3xl font-bold">{topArtist.stageName}</h3>
                <p className="text-lg">{topArtist.genre || 'Afrobeat'}</p>
                <p className="text-xl font-bold mt-2">{topArtist.votes} Votes</p> 
              </div>
            </div>

            {/* --- Right Column: #2, #3, #4... --- */}
            <div className="flex-1 flex flex-col gap-4">
              {otherArtists.map((artist, index) => {
                const rank = index + 2; // Rank starts from 2
                return (
                  <div key={artist._id} className={`p-4 rounded-lg flex items-center shadow-lg ${getCardBg(rank)}`}>
                    <span className="text-2xl font-bold w-10 text-center">{rank}</span>
                    <img src={artist.profilePicture.url} alt={artist.stageName} className="w-16 h-16 rounded-full mx-4 object-cover" />
                    <div className="flex-grow">
                      <h3 className="text-lg font-bold">{artist.stageName}</h3>
                      <p className="text-sm opacity-80">{artist.genre || 'Afrobeat'}</p>
                    </div>
                    <span className="font-bold">Metric</span>
                  </div>
                );
              })}
            </div>

          </div>
        )}

        {!loading && !error && artists.length === 0 && (
          <p className="text-center">The leaderboard is not available yet.</p>
        )}

        <div className="text-center mt-12">
          <p className="text-brand-gold font-semibold">Every vote counts! Support your favorite artist to win 500.000 FCFA</p>
          <Link to="/vote">
            <button className="mt-4 bg-transparent border-2 border-brand-gold text-brand-gold font-bold py-2 px-6 rounded-md hover:bg-brand-gold hover:text-white transition-colors">
              VOTE NOW
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage;