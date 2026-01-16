import axios from "axios";
import { env } from "@/config/env";

const API_BASE_URL = env.API_BASE_URL;

console.log(API_BASE_URL);

// base instance
const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // important if you use cookies later
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor (auth)
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// response interceptor (error normalization)
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const normalizedError = {
      status: error.response?.status,
      message:
        error.response?.data?.message ||
        error.message ||
        "Something went wrong",
      errors: error.response?.data?.errors || null,
    };

    return Promise.reject(normalizedError);
  }
);

export default axiosClient;
