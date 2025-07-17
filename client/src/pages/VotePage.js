// src/pages/VotePage.js
import React, { useState, useEffect } from 'react';
import apiClient from '../api/axios';

const ArtistVoteCard = ({ artist }) => {
  const [voteCount, setVoteCount] = useState(1);
  const handleIncrement = () => setVoteCount(prev => prev + 1);
  const handleDecrement = () => setVoteCount(prev => (prev > 1 ? prev - 1 : 1));

  const handleVote = async () => {
    try {
      await apiClient.post(`/api/artists/${artist._id}/vote`);
      alert(`Thank you for your vote for ${artist.stageName}!`);
    } catch (error) {
      alert('Voting failed. Please try again.');
    }
  };

  return (
    // The card itself remains dark, as per the original designs
    <div className="bg-card-dark p-6 rounded-lg text-center border-2 border-dashed border-border-dashed">
      <img
        src={artist.profilePicture.url}
        alt={artist.stageName}
        className="w-32 h-32 rounded-full mx-auto object-cover mb-4 border-4 border-gray-500"
      />
      <h3 className="text-2xl font-bold italic text-text-light mb-6">
        {artist.stageName}
      </h3>
      <div className="flex justify-between items-center bg-white text-dark p-2 rounded-md my-4 font-bold">
        <button onClick={handleDecrement} className="text-2xl px-3 hover:bg-gray-200 rounded-md">-</button>
        <span>{voteCount * 100}fcfa</span>
        <button onClick={handleIncrement} className="text-2xl px-3 hover:bg-gray-200 rounded-md">+</button>
      </div>
      <button onClick={handleVote} className="w-full bg-brand-yellow-vote text-black font-bold py-3 rounded-md hover:brightness-90 transition-all">
        VOTE NOW
      </button>
    </div>
  );
};

const VotePage = () => {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const { data } = await apiClient.get('/api/artists/vote');
        setArtists(data);
      } catch (err) {
        setError('Could not load artists. Please try refreshing the page.');
      } finally {
        setLoading(false);
      }
    };
    fetchArtists();
  }, []);

  return (
    // This main div now has a light background, and the text colors are adjusted
    <div className="bg-bg-light text-text-dark min-h-screen">
      <div className="container mx-auto py-12 px-4">
        <div className="text-center mb-12">
          {/* Use a dark text color for the heading */}
          <h2 className="text-4xl font-extrabold text-gray-800">Your Votes will Count</h2>
          <p className="text-gray-600 mt-2">We bring you premium entertainment, make sure you vote for your favorite artist</p>
        </div>
        {loading && <p className="text-center text-lg">Loading Artists...</p>}
        {error && <p className="text-center text-lg text-red-600">{error}</p>}
        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {artists.length > 0 ? (
              artists.map(artist => <ArtistVoteCard key={artist._id} artist={artist} />)
            ) : (
              <p className="col-span-4 text-center">No artists are available for voting at this time.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default VotePage;