import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export const signUp = (username, email, password) =>
  API.post("/signup", { username, email, password });

export const getTransactions = (token) =>
  API.get("/transactions", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const addTransaction = (data, token) =>
  API.post("/transactions", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });