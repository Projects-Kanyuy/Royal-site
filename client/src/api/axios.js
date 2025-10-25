// src/api/axios.js
import axios from "axios";

// Create an instance of axios with the base URL of your backend
const apiClient = axios.create({
  // baseURL: process.env.REACT_APP_SERVER_BASE_URL,
  baseURL: "https://api.royalcitysnack.site",
});

export default apiClient;
