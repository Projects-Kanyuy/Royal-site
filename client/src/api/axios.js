  // src/api/axios.js
  import axios from "axios";

  // Create an instance of axios with the base URL of your backend
  const apiClient = axios.create({
    // baseURL: 'https://rocimuc-api.onrender.com',
    baseURL: "http://localhost:5000",
  });

  export default apiClient;
