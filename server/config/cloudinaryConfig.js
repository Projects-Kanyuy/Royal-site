// server/config/cloudinaryConfig.js
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

// Self-checking configuration logic
if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
  console.log('Cloudinary has been configured successfully.');
} else {
  console.error('\n\n!!! FATAL ERROR: CLOUDINARY CREDENTIALS ARE MISSING OR UNDEFINED IN .env FILE !!!\n\n');
  // Optional: Exit the process if Cloudinary is absolutely required for the app to run
  // process.exit(1); 
}

export default cloudinary;