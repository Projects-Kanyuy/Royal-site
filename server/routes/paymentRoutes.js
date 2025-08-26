import express from "express";
import {
  createPayment,
  verifyPayment,
  checkPaymentStatus,
} from "../controllers/paymentController.js";

const router = express.Router();

router.post("/create", createPayment);
router.post("/verify", verifyPayment);
router.get("/status/:transId", checkPaymentStatus);

export default router;
