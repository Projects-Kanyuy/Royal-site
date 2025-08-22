// server/seeder.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import users from './data/users.js';
import User from './models/User.js';
import Artist from './models/Artist.js'; 
import connectDB from './config/db.js';

// Load environment variables
dotenv.config();
// Connect to the database
connectDB();

const importData = async () => {
  try {
    // Clear existing users to prevent duplicates
    await User.deleteMany();
    // Optional: Clear artists if you need a fresh start
    // await Artist.deleteMany();

    // --- THIS IS THE CRITICAL FIX ---
    // The User model has a .pre('save') hook that automatically hashes the password.
    // By using User.create() for each user, we ensure that hook is triggered.
    // User.insertMany() skips this hook, which was the bug.
    
    // We don't need to manually hash here because the model does it for us.
    await User.create(users);

    console.log('Data Imported Successfully! Your admin account has been created with a hashed password.');
    process.exit();
  } catch (error) {
    console.error(`Error during data import: ${error}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await User.deleteMany();
    await Artist.deleteMany();

    console.log('Data Destroyed!');
    process.exit();
  } catch (error) {
    console.error(`Error during data destruction: ${error}`);
    process.exit(1);
  }
};

// This allows you to run "npm run data:destroy" from the terminal
if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}