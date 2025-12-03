// server/server.js
import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";

// Import all route files
import artistRoutes from "./routes/artistRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js"; // <-- NEW

import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

connectDB();

const app = express();

const corsOptions = {
  origin: ["http://localhost:3000", "https://royalcitysnack.site"], // Add your production URL here
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(express.json());

// API Routes
app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/api/artists", artistRoutes);
app.use("/api/payments", paymentRoutes);

// Add this DIRECT TEST ROUTE to check if payment routes work:
app.get('/api/test-payment-mount', (req, res) => {
  console.log('✅ PAYMENT MOUNT TEST ROUTE HIT!');
  res.json({ message: 'Payment mount test works!' });
});

app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes); // <-- NEW

// Right before your error middleware, add:
app.post("/api/test-post", (req, res) => {
  console.log("✅ TEST POST ROUTE HIT!");
  res.json({ message: "POST works!", body: req.body });
});
// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);

  // Debug routes after server starts
  console.log("\n=== MOUNTED ROUTES ===");
  console.log("- /api/artists");
  console.log("- /api/payments");
  console.log("- /api/users");
  console.log("- /api/admin");
  console.log("- /api/test-post (POST)");
});
