// src/api/axios.js
import axios from 'axios';

// Create an instance of axios with the base URL of your backend
const apiClient = axios.create({
  baseURL: 'http://localhost:5000', // The full address of your backend API
});

export default apiClient;