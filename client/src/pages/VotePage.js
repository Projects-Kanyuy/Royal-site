// src/pages/VotePage.js
import React, { useState, useEffect } from 'react';
import apiClient from '../api/axios';
import useCamPay from '../hooks/useCamPay'; // Import the custom hook
import CamPayButton from '../components/CamPayButton'; // Import the reusable payment button

/**
 * ArtistVoteCard Component
 * Displays an individual artist and handles their specific voting logic.
 */
const ArtistVoteCard = ({ artist }) => {
  // Each card manages its own vote count
  const [voteCount, setVoteCount] = useState(1);

  const handleIncrement = () => {
    setVoteCount(prevCount => prevCount + 1);
  };

  const handleDecrement = () => {
    setVoteCount(prevCount => (prevCount > 1 ? prevCount - 1 : 1));
  };

  const amountToPay = voteCount * 100;

  // Callback function for when a payment is fully verified and successful
  const handlePaymentSuccess = (data) => {
    console.log('Payment cycle complete for artist:', artist.stageName, data);
    // You could potentially update the UI here, e.g., show a success message on the card
  };

  return (
    <div className="bg-card-dark p-6 rounded-lg text-center border-2 border-dashed border-border-dashed flex flex-col justify-between">
      <div>
        <img
          src={artist.profilePicture.url}
          alt={artist.stageName}
          className="w-32 h-32 rounded-full mx-auto object-cover mb-4 border-4 border-gray-500"
        />
        <h3 className="text-2xl font-bold italic text-text-light mb-6">
          {artist.stageName}
        </h3>
      </div>
      
      <div>
        <div className="flex justify-between items-center bg-white text-dark p-2 rounded-md my-4 font-bold">
          <button onClick={handleDecrement} className="text-2xl px-3 hover:bg-gray-200 rounded-md transition-colors">-</button>
          <span className="text-lg">{amountToPay} FCFA</span>
          <button onClick={handleIncrement} className="text-2xl px-3 hover:bg-gray-200 rounded-md transition-colors">+</button>
        </div>
        
        {/* Replace the old button with the new, smart CamPayButton */}
        <CamPayButton 
          artist={artist} 
          amount={amountToPay} 
          onPaymentSuccess={handlePaymentSuccess}
          // You can also pass an onPaymentFail callback if needed
        />
      </div>
    </div>
  );
};

/**
 * VotePage Component
 * The main page that orchestrates loading the CamPay SDK and displaying all artists.
 */
const VotePage = () => {
  // This custom hook injects the CamPay SDK script into the page when it mounts.
  useCamPay(); 
  
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch the list of votable artists from the backend when the page loads.
  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const { data } = await apiClient.get('/api/artists/vote');
        setArtists(data);
      } catch (err) {
        console.error("Failed to fetch artists:", err);
        setError('Could not load artists. Please try refreshing the page.');
      } finally {
        setLoading(false);
      }
    };
    fetchArtists();
  }, []); // Empty dependency array means this runs only once.

  return (
    <div className="bg-bg-dark text-text-light min-h-screen">
      <div className="container mx-auto py-12 px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-brand-yellow-vote">Your Votes will Count</h2>
          <p className="text-gray-400 mt-2">Select the number of votes and click "VOTE NOW" to pay.</p>
        </div>
        
        {/* Conditional rendering based on loading and error state */}
        {loading && (
          <p className="text-center text-lg text-gray-400">Loading Artists...</p>
        )}
        
        {error && (
          <p className="text-center text-lg text-red-400 bg-red-900 bg-opacity-30 p-4 rounded-lg">{error}</p>
        )}
        
        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {artists.length > 0 ? (
              artists.map(artist => <ArtistVoteCard key={artist._id} artist={artist} />)
            ) : (
              <p className="col-span-4 text-center text-gray-400">No artists are available for voting at this time.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default VotePage;