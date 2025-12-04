// server/routes/adminRoutes.js
import express from "express";
import {
  getAllArtistsForAdmin,
  deleteArtist,
  addFinancialVotesToArtist,
  getDashboardAnalytics,
} from "../controllers/adminController.js";

import protect from "../middleware/authMiddleware.js";
import { admin } from "../middleware/adminMiddleware.js";

const router = express.Router();

// =========================
// GET ALL ARTISTS (ADMIN PANEL)
// =========================
router.get("/artists", protect, admin, getAllArtistsForAdmin);

// =========================
// DELETE ARTIST
// =========================
router.delete("/artists/:id", protect, admin, deleteArtist);

// =========================
// ADD FINANCIAL VOTES
// =========================
router.put(
  "/artists/:id/add-financial-votes",
  protect,
  admin,
  addFinancialVotesToArtist
);

// =========================
// DASHBOARD ANALYTICS
// =========================
router.get("/analytics", protect, admin, getDashboardAnalytics);

export default router;
