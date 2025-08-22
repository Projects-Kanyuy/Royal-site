// server/seeder.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import users from './data/users.js';
import User from './models/User.js';
import Artist from './models/Artist.js'; // Optional: if you want to clear artists too
import connectDB from './config/db.js';

// Load environment variables
dotenv.config();
// Connect to the database
connectDB();

const importData = async () => {
  try {
    // Clear existing users to avoid duplicates
    await User.deleteMany();
    // Optional: You could also clear all artists if you want a fresh start
    // await Artist.deleteMany();

    // Insert the admin user from your data file
    await User.insertMany(users);

    console.log('Data Imported Successfully! Your admin account has been created.');
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