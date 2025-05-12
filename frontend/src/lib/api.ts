// src/api.tsx

import axios from "axios";

// The base URL of your backend
const API_URL = "http://localhost:5000/api/auth";

// Register a new user
export const registerUser = async (username: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/register`, null, {
      params: { username, password },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || "Registration failed";
  }
};

// Log in and get a JWT token
export const loginUser = async (username: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/login`, null, {
      params: { username, password },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || "Login failed";
  }
};

// Call a protected API (with token)
export const callProtectedApi = async (token: string) => {
  try {
    const response = await axios.get("http://localhost:5000/api/protected", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || "Protected request failed";
  }
};
