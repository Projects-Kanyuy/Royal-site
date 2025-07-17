// src/pages/ArtistPublicPage.js
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import apiClient from '../api/axios';

const ArtistPublicPage = () => {
  const { id } = useParams();
  const [artist, setArtist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [voteCount, setVoteCount] = useState(1);

  useEffect(() => {
    const fetchArtist = async () => {
      try {
        const { data } = await apiClient.get(`/api/artists/${id}`);
        setArtist(data);
      } catch (err) {
        setError('Could not find this artist.');
      } finally {
        setLoading(false);
      }
    };
    fetchArtist();
  }, [id]);

  const handleVote = async () => {
    try {
      await apiClient.post(`/api/artists/${artist._id}/vote`);
      alert(`Thank you for your vote for ${artist.stageName}!`);
    } catch (error) {
      alert('Voting failed. Please try again.');
    }
  };

  // Main container with a dark background for the content area
  return (
    <div className="bg-bg-dark min-h-screen flex items-center justify-center text-center">
      <div className="container max-w-sm mx-auto p-4">
        {loading && <p className="text-lg text-white">Loading Artist...</p>}
        
        {error && (
          // --- CORRECTED ERROR STATE ---
          <div className="flex flex-col items-center">
            <p className="text-lg text-red-500 mb-6">{error}</p>
            <Link to="/vote">
              <button className="bg-brand-yellow-vote text-black font-bold py-3 px-8 rounded-md hover:brightness-90">
                View All Artists
              </button>
            </Link>
          </div>
        )}

        {!loading && !error && artist && (
          // --- SUCCESS STATE (ARTIST FOUND) ---
          <div className="bg-card-dark p-8 rounded-lg border-2 border-dashed border-border-dashed">
            <h2 className="text-2xl font-bold text-brand-yellow-vote mb-6">Vote for this Artist!</h2>
            <img
              src={artist.profilePicture.url}
              alt={artist.stageName}
              className="w-40 h-40 rounded-full mx-auto object-cover mb-4 border-4 border-gray-500"
            />
            <h3 className="text-3xl font-bold italic text-text-light mb-6">
              {artist.stageName}
            </h3>
            <div className="flex justify-between items-center bg-white text-dark p-2 rounded-md my-4 font-bold">
              <button onClick={() => setVoteCount(v => (v > 1 ? v - 1 : 1))} className="text-2xl px-3 hover:bg-gray-200">-</button>
              <span>{voteCount * 100}fcfa</span>
              <button onClick={() => setVoteCount(v => v + 1)} className="text-2xl px-3 hover:bg-gray-200">+</button>
            </div>
            <button onClick={handleVote} className="w-full bg-brand-yellow-vote text-black font-bold py-3 rounded-md hover:brightness-90">
              VOTE NOW
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArtistPublicPage;