// src/api/axios.js
import axios from 'axios';

// Create an instance of axios with the base URL of your backend
const apiClient = axios.create({
  baseURL: 'http://13.60.186.10:5000',
});

export default apiClient;