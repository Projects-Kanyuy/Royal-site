import React, { useState } from "react";

const AddVotesModal = ({ isOpen, onClose, onConfirm, artistName }) => {
  const [votesToAdd, setVotesToAdd] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const numVotes = Number(votesToAdd);
    if (!isNaN(numVotes) && numVotes > 0) {
      onConfirm(numVotes);
      setVotesToAdd(""); // Reset input
      onClose(); // Close modal
    } else {
      alert("Please enter a valid positive number.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
        <h3 className="text-lg font-bold mb-2">
          Add Financial Votes to {artistName}
        </h3>
        <form onSubmit={handleSubmit}>
          <label htmlFor="votesInput" className="block mb-2 font-medium">
            Number of Votes:
          </label>
          <input
            id="votesInput"
            type="number"
            min="1"
            value={votesToAdd}
            onChange={(e) => setVotesToAdd(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md mb-4"
            placeholder="Enter number of votes"
            autoFocus
          />
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              Add Votes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddVotesModal;
