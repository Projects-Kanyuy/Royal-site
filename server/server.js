// server/server.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';

// Import all route files
import artistRoutes from './routes/artistRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import userRoutes from './routes/userRoutes.js';
import adminRoutes from './routes/adminRoutes.js'; // <-- NEW

import { notFound, errorHandler } from './middleware/errorMiddleware.js';

dotenv.config();
connectDB();

const app = express();

const corsOptions = {
  origin: ['http://localhost:3000', 'https://royalcitysnack.site'], // Add your production URL here
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json());

// API Routes
app.get('/', (req, res) => { res.send('API is running...') });

app.use('/api/artists', artistRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes); // <-- NEW

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server running on port ${PORT}`));