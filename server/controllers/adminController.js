// server/controllers/adminController.js
import Artist from "../models/Artist.js";
import { ManualVote } from "../models/ManualVote.js";
import { Payment } from "../models/Payment.js";

// @desc    Get all artists for the admin panel
export const getAllArtistsForAdmin = async (req, res) => {
  try {
    const artists = await Artist.find({}).sort({ stageName: 1 });
    res.json(artists);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch artists." });
  }
};

// server/controllers/adminController.js
// @desc    Delete an artist
// @route   DELETE /api/admin/artists/:id
export const deleteArtist = async (req, res) => {
  try {
    const artist = await Artist.findById(req.params.id);

    if (!artist) {
      return res.status(404).json({ message: "Artist not found" });
    }

    // DELETE ALL RELATED DATA FIRST
    // Delete manual votes for this artist
    await ManualVote.deleteMany({ artist: req.params.id });

    // Delete payments for this artist
    await Payment.deleteMany({ artistId: req.params.id });

    // Optional: Delete profile picture from storage
    // if (artist.profilePicture.public_id) {
    //   await cloudinary.uploader.destroy(artist.profilePicture.public_id);
    // }

    // Finally delete the artist
    await Artist.findByIdAndDelete(req.params.id);

    res.json({
      message: "Artist and all associated data deleted successfully",
    });
  } catch (error) {
    console.error("Delete artist error:", error);
    res.status(500).json({ message: "Error deleting artist" });
  }
};

// @desc    Add FINANCIAL votes to an artist (for cash payments)
// @route   PUT /api/admin/artists/:id/add-financial-votes
export const addFinancialVotesToArtist = async (req, res) => {
  const { votesToAdd, amount, paymentMethod, notes } = req.body;

  if (!votesToAdd || isNaN(votesToAdd) || Number(votesToAdd) <= 0) {
    return res.status(400).json({
      message: "Please provide a valid, positive number of votes to add.",
    });
  }

  try {
    const artist = await Artist.findById(req.params.id);
    if (artist) {
      artist.financialVotes = (artist.financialVotes || 0) + Number(votesToAdd);
      const updatedArtist = await artist.save();

      // Add this AFTER artist.save():
      try {
        const manualVote = new ManualVote({
          artist: req.params.id,
          adminUser: req.user._id,
          amount: amount || 0,
          votesAdded: Number(votesToAdd),
          paymentMethod: paymentMethod || "cash",
          notes: notes || `Admin-added ${votesToAdd} financial votes`,
          createdAt: new Date(),
        });
        await manualVote.save();
        console.log(
          `✅ Manual vote recorded: ${votesToAdd} votes for artist ${req.params.id}`
        );
      } catch (manualVoteError) {
        console.error("❌ Failed to save manual vote:", manualVoteError);
        // Don't fail the whole request - just log the error
      }

      res.json(updatedArtist);
    } else {
      res.status(404).json({ message: "Artist not found" });
    }
  } catch (error) {
    console.error("Error adding financial votes:", error);
    res.status(500).json({ message: "Failed to add financial votes." });
  }
};

// @desc    Get dashboard analytics
// @route   GET /api/admin/analytics
export const getDashboardAnalytics = async (req, res) => {
  try {
    // 1. Total Artists
    const totalArtists = await Artist.countDocuments({ isApproved: true });

    // 2. Total Votes Cast from ALL artists
    const voteStats = await Artist.aggregate([
      {
        $group: {
          _id: null,
          totalCamPayVotes: { $sum: "$votes" },
          totalManualVotes: { $sum: "$financialVotes" },
          totalHandVotes: { $sum: "$handVotes" },
        },
      },
    ]);

    const voteData = voteStats[0] || {
      totalCamPayVotes: 0,
      totalManualVotes: 0,
      totalHandVotes: 0,
    };

    // 3. Calculate revenues from TRANSACTION RECORDS (this ensures consistency)
    // Online revenue from successful payments
    const onlineRevenueResult = await Payment.aggregate([
      { $match: { status: "SUCCESSFUL" } },
      { $group: { _id: null, totalAmount: { $sum: "$amount" } } },
    ]);

    // Manual revenue from manual votes
    const manualRevenueResult = await ManualVote.aggregate([
      { $group: { _id: null, totalAmount: { $sum: "$amount" } } },
    ]);

    const onlineRevenue = onlineRevenueResult[0]?.totalAmount || 0;
    const manualRevenue = manualRevenueResult[0]?.totalAmount || 0;
    const totalRevenue = onlineRevenue + manualRevenue;

    // 4. Calculate total votes from TRANSACTION RECORDS (for consistency check)
    const onlineVotesResult = await Payment.aggregate([
      { $match: { status: "SUCCESSFUL" } },
      { $group: { _id: null, totalVotes: { $sum: "$votesAdded" } } },
    ]);

    const manualVotesResult = await ManualVote.aggregate([
      { $group: { _id: null, totalVotes: { $sum: "$votesAdded" } } },
    ]);

    const onlineVotes = onlineVotesResult[0]?.totalVotes || 0;
    const manualVotes = manualVotesResult[0]?.totalVotes || 0;
    const totalVotesFromTransactions = onlineVotes + manualVotes;

    // 5. Financial Analytics (from ManualVote records)
    const manualVoteStats = await ManualVote.aggregate([
      {
        $group: {
          _id: "$paymentMethod",
          totalVotes: { $sum: "$votesAdded" },
          totalAmount: { $sum: "$amount" },
          transactionCount: { $sum: 1 },
        },
      },
    ]);

    // 6. Payment Analytics (online payments)
    const paymentStats = await Payment.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          totalAmount: { $sum: "$amount" },
          totalVotes: { $sum: "$votesAdded" },
        },
      },
    ]);

    // ... (keep the rest of your trends and analytics code the same)

    res.json({
      totalArtists,
      totalVotes:
        voteData.totalCamPayVotes +
        voteData.totalManualVotes +
        voteData.totalHandVotes,
      totalVotesFromTransactions, // Added for debugging/consistency check
      totalRevenue,
      onlineRevenue,
      manualRevenue,
      voteStats: voteData,
      paymentStats,
      manualVoteStats,
      onlineVoteTrends,
      manualVoteTrends,
      dailyStats,
      monthlyStats,
      // Added consistency metrics for debugging
      consistencyCheck: {
        artistVotes: voteData.totalCamPayVotes + voteData.totalManualVotes,
        transactionVotes: totalVotesFromTransactions,
        difference:
          voteData.totalCamPayVotes +
          voteData.totalManualVotes -
          totalVotesFromTransactions,
      },
    });
  } catch (error) {
    console.error("Analytics error:", error);
    res.status(500).json({ message: "Failed to fetch analytics." });
  }
};
