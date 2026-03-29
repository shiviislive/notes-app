import axios from "axios";

// Create axios instance
const API = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true // for cookies (optional)
});

// 🔐 Add token automatically in every request
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default API;