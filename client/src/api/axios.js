// src/api/axios.js
import axios from "axios";

// Create an instance of axios with the base URL of your backend
const apiClient = axios.create({
  // baseURL: 'https://rocimuc-api.onrender.com',
  baseURL: process.env.REACT_APP_SERVER_BASE_URL,
});

export default apiClient;
