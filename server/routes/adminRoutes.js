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

router.get("/artists", protect, admin, getAllArtistsForAdmin);
router.put(
  "/artists/:id/add-financial-votes",
  protect,
  admin,
  addFinancialVotesToArtist
);
router.get("/analytics", protect, admin, getDashboardAnalytics);
router.delete("/artists/:id", protect, admin, deleteArtist); 

export default router;
