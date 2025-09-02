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

// @desc    Delete an artist
// @route   DELETE /api/admin/artists/:id
export const deleteArtist = async (req, res) => {
  try {
    const artist = await Artist.findById(req.params.id);

    if (!artist) {
      return res.status(404).json({ message: "Artist not found" });
    }

    // Optional: Add logic here to also delete the artist's profile picture from storage (e.g., Cloudinary)
    // if (artist.profilePicture.public_id) {
    //   await cloudinary.uploader.destroy(artist.profilePicture.public_id);
    // }

    await Artist.findByIdAndDelete(req.params.id);
    res.json({ message: "Artist deleted successfully" });
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

    // 2. Total Votes Cast (Financial votes ARE manual votes)
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

    // FIX: Calculate total votes and revenue correctly
    const totalVotes =
      voteData.totalCamPayVotes +
      voteData.totalManualVotes +
      voteData.totalHandVotes;
    const totalRevenue = totalVotes * 100; // Each vote costs 100 XAF

    // 3. Financial Analytics (from ManualVote records)
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

    // 4. Payment Analytics (online payments)
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

    // 5. Voting Trends (both online and manual)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Online payment trends
    const onlineVoteTrends = await Payment.aggregate([
      { $match: { status: "SUCCESSFUL", createdAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          votes: { $sum: "$votesAdded" },
          revenue: { $sum: "$amount" },
          transactionCount: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Manual vote trends
    const manualVoteTrends = await ManualVote.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          votes: { $sum: "$votesAdded" },
          revenue: { $sum: "$amount" },
          transactionCount: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Add time-based analytics
    const dailyStats = await Payment.aggregate([
      {
        $match: { status: "SUCCESSFUL" },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          totalVotes: { $sum: "$votesAdded" },
          totalRevenue: { $sum: "$amount" },
          transactionCount: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Weekly/Monthly trends
    const monthlyStats = await Payment.aggregate([
      {
        $match: { status: "SUCCESSFUL" },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
          totalVotes: { $sum: "$votesAdded" },
          totalRevenue: { $sum: "$amount" },
          transactionCount: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({
      totalArtists,
      totalVotes, // ADDED: Total sum of all votes
      totalRevenue, // ADDED: Total revenue (votes * 100 XAF)
      voteStats: voteData,
      paymentStats,
      manualVoteStats,
      onlineVoteTrends,
      manualVoteTrends,
      dailyStats,
      monthlyStats,
    });
  } catch (error) {
    console.error("Analytics error:", error);
    res.status(500).json({ message: "Failed to fetch analytics." });
  }
};
