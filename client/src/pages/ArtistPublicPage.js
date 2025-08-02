// src/pages/ArtistDetailPage.js
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import apiClient from "../api/axios";
import useCamPay from "../hooks/useCamPay"; // Re-use our custom hook
import CamPayButton from "../components/CamPayButton"; // Re-use our payment button

const ArtistPublicPage = () => {
  // This hook loads the CamPay SDK script onto this page
  useCamPay();

  const { id: artistId } = useParams(); // Get the artist's ID from the URL
  const [artist, setArtist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [voteCount, setVoteCount] = useState(1);

  useEffect(() => {
    const fetchArtist = async () => {
      try {
        const { data } = await apiClient.get(`/api/artists/${artistId}`);
        setArtist(data);
      } catch (err) {
        console.error("Failed to fetch artist:", err);
        setError("Could not load artist data. The artist may not exist.");
      } finally {
        setLoading(false);
      }
    };

    fetchArtist();
  }, [artistId]);

  const handleIncrement = () => setVoteCount((prev) => prev + 1);
  const handleDecrement = () =>
    setVoteCount((prev) => (prev > 1 ? prev - 1 : 1));

  const amountToPay = voteCount * 100;

  if (loading) {
    return <div className="text-center text-white p-10">Loading Artist...</div>;
  }

  if (error) {
    return <div className="text-center text-red-400 p-10">{error}</div>;
  }

  return (
    <div className="bg-bg-light text-text-light min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {artist && (
          <div className="bg-card-dark p-8 rounded-lg text-center border-2 border-dashed border-border-dashed">
            <h2 className="text-3xl font-bold text-brand-yellow-vote mb-6">
              Vote for this Artist!
            </h2>
            <img
              src={artist.profilePicture.url}
              alt={artist.stageName}
              className="w-40 h-40 rounded-full mx-auto object-cover mb-4 border-4 border-gray-500"
            />
            <h3 className="text-2xl font-bold italic text-text-light mb-6">
              {artist.stageName}
            </h3>
            <div className="flex justify-between items-center bg-white text-black p-2 rounded-md my-4 font-bold">
              <button
                onClick={handleDecrement}
                className="text-2xl px-3 hover:bg-gray-200 rounded-md"
              >
                -
              </button>
              <span className="text-lg">{amountToPay} FCFA</span>
              <button
                onClick={handleIncrement}
                className="text-2xl px-3 hover:bg-gray-200 rounded-md"
              >
                +
              </button>
            </div>

            {/* The CamPayButton will now work correctly on this page */}
            <CamPayButton
              artist={artist}
              amount={amountToPay}
              onPaymentSuccess={() => console.log("Payment successful!")}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ArtistPublicPage;
