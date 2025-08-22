// server/data/users.js
import bcrypt from 'bcryptjs';

const users = [
  {
    name: 'Admin', // Or just 'Admin'
    email: 'adminemail@gmail.com', // <-- CHANGE THIS
    password: 'Password_123!',      // <-- CHANGE THIS
    isAdmin: true,
  },
];
export default users;