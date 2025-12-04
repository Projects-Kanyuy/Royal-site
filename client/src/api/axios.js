// src/api/axios.js
import axios from "axios";

const isLocalhost =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1";

const apiClient = axios.create({
  baseURL: isLocalhost
    ? "http://localhost:5000"               // Local backend
    : "https://api.royalcitysnack.site",    // Live backend
  withCredentials: true,
});

export default apiClient;
