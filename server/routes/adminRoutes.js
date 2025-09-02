// server/routes/adminRoutes.js
import express from "express";
const router = express.Router();
import {
  getAllArtistsForAdmin,
  addFinancialVotesToArtist,
  getDashboardAnalytics,
  deleteArtist, // ADD THIS
} from "../controllers/adminController.js";
import protect from "../middleware/authMiddleware.js";
import { admin } from "../middleware/adminMiddleware.js";

// Temp
import Artist from "../models/Artist.js"; // ADD THIS
import { ManualVote } from "../models/ManualVote.js"; // ADD THIS
import { Payment } from "../models/Payment.js"; // ADD THIS

router.get("/artists", protect, admin, getAllArtistsForAdmin);
router.put(
  "/artists/:id/add-financial-votes",
  protect,
  admin,
  addFinancialVotesToArtist
);
router.get("/analytics", protect, admin, getDashboardAnalytics);
router.delete("/artists/:id", protect, admin, deleteArtist);

// temp
router.get("/fix-data", protect, admin, async (req, res) => {
  try {
    console.log("Running data reconciliation...");

    // Get all artist IDs
    const artists = await Artist.find({}, "_id");
    const artistIds = artists.map((a) => a._id.toString());
    console.log(`Found ${artistIds.length} artists in the system`);

    // Delete manual votes for non-existent artists
    const manualVoteResult = await ManualVote.deleteMany({
      artist: { $nin: artistIds },
    });
    console.log(
      `Deleted ${manualVoteResult.deletedCount} orphaned manual votes`
    );

    // Delete payments for non-existent artists
    const paymentResult = await Payment.deleteMany({
      artistId: { $nin: artistIds },
    });
    console.log(`Deleted ${paymentResult.deletedCount} orphaned payments`);

    res.json({
      success: true,
      message: "Data reconciliation completed",
      deletedManualVotes: manualVoteResult.deletedCount,
      deletedPayments: paymentResult.deletedCount,
      totalArtists: artistIds.length,
    });
  } catch (error) {
    console.error("Data reconciliation error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
      message: "Error during data reconciliation",
    });
  }
});

export default router;
