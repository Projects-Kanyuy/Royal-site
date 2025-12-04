// src/pages/VotePage.js
import React, { useState, useEffect } from 'react';
import apiClient from '../api/axios';

// Vote Card Component
const ArtistVoteCard = ({ artist, onInitiatePayment }) => {
  const [voteCount, setVoteCount] = useState(1);
  const amountToPay = voteCount * 100;

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
        <div className="flex justify-between items-center bg-white text-black p-2 rounded-md my-4 font-bold">
          <button
            onClick={() => setVoteCount(prev => (prev > 1 ? prev - 1 : 1))}
            className="text-2xl px-3 hover:bg-gray-200"
          >
            -
          </button>

          <span>{amountToPay} FCFA</span>

          <button
            onClick={() => setVoteCount(prev => prev + 1)}
            className="text-2xl px-3 hover:bg-gray-200"
          >
            +
          </button>
        </div>

        <button
          onClick={() => onInitiatePayment(artist, amountToPay)}
          className="w-full bg-brand-yellow-vote text-black font-bold py-3 rounded-md hover:brightness-90 transition-all"
        >
          VOTE NOW
        </button>
      </div>
    </div>
  );
};

const VotePage = () => {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch artists for voting
  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const { data } = await apiClient.get('/api/artists/vote');
        setArtists(data);
      } catch (err) {
        setError('Could not load artists. Please refresh the page.');
      } finally {
        setLoading(false);
      }
    };

    fetchArtists();
  }, []);

  // ********** SWYCHR PAYMENT FUNCTION **********
  const handleInitiatePayment = async (artist, amount) => {
    try {
      console.log("Creating payment for:", artist._id, "amount:", amount);

      // Call backend to create Swychr checkout
      const response = await apiClient.post('/api/payments/create', {
        artistId: artist._id,
        amount,
      });

      console.log("Payment link received:", response.data);

      const checkoutUrl = response.data.checkout_url;     // Swychr field
      const transactionId = response.data.transaction_id; // Swychr field

      if (!checkoutUrl) {
        alert("Could not initiate payment. Try again.");
        return;
      }

      // Redirect to Swychr payment page
      window.location.href = checkoutUrl;

      // No verification here — Swychr backend redirect handles verification

    } catch (err) {
      console.error("Payment error:", err);
      alert(
        err.response?.data?.error ||
        'An error occurred while starting payment.'
      );
    }
  };

  return (
    <div className="bg-bg-white text-text-light min-h-screen">
      <div className="container mx-auto py-12 px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-brand-yellow-vote">
            Your Votes will Count
          </h2>
          <p className="text-gray-400 mt-2">
            Select the number of votes and click "VOTE NOW" to pay.
          </p>
        </div>

        {loading && <p className="text-center text-lg">Loading Artists...</p>}
        {error && <p className="text-center text-lg text-red-400">{error}</p>}

        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {artists.map(artist => (
              <ArtistVoteCard
                key={artist._id}
                artist={artist}
                onInitiatePayment={handleInitiatePayment}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VotePage;
