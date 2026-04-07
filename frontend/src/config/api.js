import axios from "axios";

// Normalize: strip trailing slash, ensure ends with /api
const RAW = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/+$/, "");
export const API_BASE = RAW.endsWith("/api") ? RAW : `${RAW}/api`;

const API = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

// Automatically attach the JWT token to every request if present
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// If the server returns 401, the token has expired — clear it and redirect to login
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Auth routes
export const signUp = (name, email, password) =>
  API.post("/auth/signup", { name, email, password });

export const logIn = (email, password) =>
  API.post("/auth/login", { email, password });

export const forgotPasswordAPI = (email) =>
  API.post("/auth/forgot-password", { email });

export const verifyOtpAPI = (email, otp) =>
  API.post("/auth/verify-otp", { email, otp });

export const resetPasswordAPI = (email, otp, newPassword) =>
  API.post("/auth/reset-password", { email, otp, newPassword });

// Transaction routes — token is injected automatically via the interceptor
export const getTransactions = (token) =>
  API.get("/transactions", token ? { headers: { Authorization: `Bearer ${token}` } } : {});

export const addTransaction = (data, token) =>
  API.post("/transactions", data, token ? { headers: { Authorization: `Bearer ${token}` } } : {});

export const deleteTransaction = (id, token) =>
  API.delete(`/transactions/${id}`, token ? { headers: { Authorization: `Bearer ${token}` } } : {});

export default API;
