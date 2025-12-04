// server/server.js
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";

// IMPORT ROUTES (ESM)
import artistRoutes from "./routes/artistRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

connectDB();

const app = express();

// -------------------------
// CORS
// -------------------------
const corsOptions = {
  origin: [
    "http://localhost:3000",
    "https://royalcitysnack.site"
  ],
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());

// -------------------------
// ROOT ROUTE
// -------------------------
app.get("/", (req, res) => {
  res.send("API is running...");
});

// -------------------------
// API ROUTES
// -------------------------
app.use("/api/artists", artistRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);

// -------------------------
// DEBUG ROUTES
// -------------------------
app.get("/api/test-payment-mount", (req, res) => {
  console.log("✅ PAYMENT MOUNT TEST ROUTE HIT!");
  res.json({ message: "Payment mount test works!" });
});

app.post("/api/test-post", (req, res) => {
  console.log("✅ TEST POST ROUTE HIT!");
  res.json({ message: "POST works!", body: req.body });
});

// -------------------------
// ERROR HANDLERS
// -------------------------
app.use(notFound);
app.use(errorHandler);

// -------------------------
// START SERVER
// -------------------------
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`\n🚀 Server running on port ${PORT}`);
  console.log("\n=== MOUNTED ROUTES ===");
  console.log("- /api/artists");
  console.log("- /api/payments");
  console.log("- /api/users");
  console.log("- /api/admin");
  console.log("- /api/test-post (POST)");
});
