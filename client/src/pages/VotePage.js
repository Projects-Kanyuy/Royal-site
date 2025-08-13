// src/pages/VotePage.js
import React, { useState, useEffect, useRef } from 'react';
import apiClient from '../api/axios';
import useCamPay from '../hooks/useCamPay';

// This is a simple, normal button component now. The logic is moved to the parent.
const ArtistVoteCard = ({ artist, onInitiatePayment }) => {
  const [voteCount, setVoteCount] = useState(1);
  const amountToPay = voteCount * 100;

  return (
    <div className="bg-card-dark p-6 rounded-lg text-center border-2 border-dashed border-border-dashed flex flex-col justify-between">
      <div>
        <img src={artist.profilePicture.url} alt={artist.stageName} className="w-32 h-32 rounded-full mx-auto object-cover mb-4 border-4 border-gray-500" />
        <h3 className="text-2xl font-bold italic text-text-light mb-6">{artist.stageName}</h3>
      </div>
      <div>
        <div className="flex justify-between items-center bg-white text-black p-2 rounded-md my-4 font-bold">
          <button onClick={() => setVoteCount(prev => (prev > 1 ? prev - 1 : 1))} className="text-2xl px-3 hover:bg-gray-200">-</button>
          <span>{amountToPay} FCFA</span>
          <button onClick={() => setVoteCount(prev => prev + 1)} className="text-2xl px-3 hover:bg-gray-200">+</button>
        </div>
        {/* This button now calls a function passed down from the parent page */}
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

// The main page now orchestrates the entire payment flow.
const VotePage = () => {
  useCamPay(); // Loads the CamPay SDK script onto the page

  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Use a ref to hold the data of the artist currently being paid for.
  // This avoids stale state issues with the global campay callback.
  const paymentDataRef = useRef(null);

  // This function is defined ONCE and handles the backend verification.
  const verifyAndRecordVote = async (reference) => {
    // Check if we have artist data stored in our ref
    if (!paymentDataRef.current) {
      console.error("Payment successful, but no artist data was stored.");
      alert("A problem occurred. Please contact support with your transaction reference.");
      return;
    }

    const { artist, amount } = paymentDataRef.current;

    try {
      const response = await apiClient.post('/api/payments/verify', {
        reference: reference,
        artistId: artist._id,
        amount: amount,
      });
      alert(response.data.message);
    } catch (error) {
      console.error("Verification failed:", error);
      alert(error.response?.data?.message || 'Server error during payment verification.');
    } finally {
      // Clear the ref after the process is complete
      paymentDataRef.current = null;
    }
  };
  
  // This useEffect sets up the global CamPay callbacks ONCE.
  useEffect(() => {
    // We check for window.campay to ensure the script has loaded
    const interval = setInterval(() => {
      if (window.campay) {
        clearInterval(interval); // Stop checking once it's loaded

        window.campay.onSuccess = function (data) {
          console.log("CamPay Success Data:", data);
          verifyAndRecordVote(data.reference); // Call our central verification function
        };

        window.campay.onFail = function (data) {
          console.log("CamPay Fail Data:", data);
          alert('Payment failed. Status: ' + data.status);
          paymentDataRef.current = null; // Clear the ref on failure
        };

        window.campay.onModalClose = function () {
          console.log('CamPay Modal Closed');
          paymentDataRef.current = null; // Clear the ref if the user closes the modal
        };
      }
    }, 100); // Check every 100ms

    return () => clearInterval(interval); // Cleanup on component unmount
  }, []); // Empty dependency array ensures this runs only once.


  // This function is passed down to each artist card.
  const handleInitiatePayment = (artist, amount) => {
    if (!window.campay) {
      alert("Payment service is still loading. Please wait a moment and try again.");
      return;
    }
    
    // 1. Store the data for the specific artist being paid for.
    paymentDataRef.current = { artist, amount };

    // 2. Configure CamPay with the correct details.
    window.campay.options({
      payButtonId: "masterPayButton", // We always use one master button
      description: `Vote for ${artist.stageName}`,
      amount: amount.toString(),
      currency: "XAF",
      externalReference: "",
    });

    // 3. Programmatically click the hidden master button to trigger the modal.
    document.getElementById("masterPayButton").click();
  };

  // Fetch artists when the page loads
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
    <div className="bg-bg-white text-text-light min-h-screen">
      <div className="container mx-auto py-12 px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-brand-yellow-vote">Your Votes will Count</h2>
          <p className="text-gray-400 mt-2">Select the number of votes and click "VOTE NOW" to pay.</p>
        </div>
        
        {/* A single, hidden button that we trigger programmatically */}
        <button id="masterPayButton" style={{ display: 'none' }}>Pay</button>

        {loading && <p className="text-center text-lg">Loading Artists...</p>}
        {error && <p className="text-center text-lg text-red-400">{error}</p>}
        
        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {artists.map(artist => (
              <ArtistVoteCard
                key={artist._id}
                artist={artist}
                onInitiatePayment={handleInitiatePayment} // Pass the handler function
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VotePage;